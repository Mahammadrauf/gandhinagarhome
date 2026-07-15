'use client';

/**
 * PropertyImageLightbox
 * ---------------------
 * Fullscreen, mobile-first image viewer for property photos.
 * - Pure presentation: receives already-fetched image URLs, never touches data logic.
 * - object-contain always: landscape / portrait / square / panorama images are never cropped.
 * - Pinch to zoom, double-tap to zoom / reset, pan while zoomed, swipe to change image.
 * - Preloads neighbouring images only (no eager loading of the full set).
 * - Esc closes, arrow keys navigate, close button focused on open.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const MAX_ZOOM = 4;
const DOUBLE_TAP_ZOOM = 2.5;
const DOUBLE_TAP_MS = 300;
const SWIPE_THRESHOLD_PX = 48;

type Props = {
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

export default function PropertyImageLightbox({ images, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0))
  );
  const [loaded, setLoaded] = useState(false);

  // Zoom / pan state lives in refs during gestures (no re-render per move) and is
  // committed to the element style directly for 60fps behaviour on low-end phones.
  const [zoomed, setZoomed] = useState(false);
  const scaleRef = useRef(1);
  const txRef = useRef(0);
  const tyRef = useRef(0);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const gesture = useRef({
    pointers: new Map<number, { x: number; y: number }>(),
    startDist: 0,
    startScale: 1,
    startTx: 0,
    startTy: 0,
    startMidX: 0,
    startMidY: 0,
    panStartX: 0,
    panStartY: 0,
    swipeDx: 0,
    swipeDy: 0,
    swiping: false,
    lastTapTime: 0,
    lastTapX: 0,
    lastTapY: 0,
    moved: false,
  });

  const applyTransform = useCallback((animate: boolean) => {
    const img = imgRef.current;
    if (!img) return;
    img.style.transition = animate ? 'transform 0.25s ease-out' : 'none';
    img.style.transform = `translate(${txRef.current}px, ${tyRef.current}px) scale(${scaleRef.current})`;
  }, []);

  const clampPan = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const scale = scaleRef.current;
    const maxX = (img.clientWidth * (scale - 1)) / 2;
    const maxY = (img.clientHeight * (scale - 1)) / 2;
    txRef.current = Math.min(maxX, Math.max(-maxX, txRef.current));
    tyRef.current = Math.min(maxY, Math.max(-maxY, tyRef.current));
  }, []);

  const setScale = useCallback(
    (next: number, animate: boolean) => {
      scaleRef.current = Math.min(MAX_ZOOM, Math.max(1, next));
      if (scaleRef.current === 1) {
        txRef.current = 0;
        tyRef.current = 0;
      } else {
        clampPan();
      }
      setZoomed(scaleRef.current > 1);
      applyTransform(animate);
    },
    [applyTransform, clampPan]
  );

  const resetZoom = useCallback(
    (animate: boolean) => {
      scaleRef.current = 1;
      txRef.current = 0;
      tyRef.current = 0;
      setZoomed(false);
      applyTransform(animate);
    },
    [applyTransform]
  );

  const goTo = useCallback(
    (next: number) => {
      if (images.length === 0) return;
      const wrapped = (next + images.length) % images.length;
      setLoaded(false);
      resetZoom(false);
      setIndex(wrapped);
    },
    [images.length, resetZoom]
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Lock body scroll while the viewer is open.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Keyboard support.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, goNext, goPrev]);

  // Preload only the neighbouring images so swiping feels instant without
  // downloading the whole gallery upfront.
  useEffect(() => {
    if (images.length < 2) return;
    [index + 1, index - 1].forEach((i) => {
      const src = images[(i + images.length) % images.length];
      if (src) {
        const im = new window.Image();
        im.src = src;
      }
    });
  }, [index, images]);

  // ---- Gestures (pointer events cover touch + mouse) ----

  const onPointerDown = (e: React.PointerEvent) => {
    const g = gesture.current;
    g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    g.moved = false;

    if (g.pointers.size === 2) {
      // Pinch start
      const pts = Array.from(g.pointers.values());
      g.startDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      g.startScale = scaleRef.current;
      g.startTx = txRef.current;
      g.startTy = tyRef.current;
      g.startMidX = (pts[0].x + pts[1].x) / 2;
      g.startMidY = (pts[0].y + pts[1].y) / 2;
      g.swiping = false;
    } else if (g.pointers.size === 1) {
      g.panStartX = e.clientX - txRef.current;
      g.panStartY = e.clientY - tyRef.current;
      g.swipeDx = 0;
      g.swipeDy = 0;
      g.swiping = scaleRef.current <= 1;
    }
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g.pointers.has(e.pointerId)) return;
    const prev = g.pointers.get(e.pointerId)!;
    if (Math.abs(e.clientX - prev.x) > 2 || Math.abs(e.clientY - prev.y) > 2) g.moved = true;
    g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (g.pointers.size === 2) {
      // Pinch zoom
      const pts = Array.from(g.pointers.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (g.startDist > 0) {
        const nextScale = Math.min(MAX_ZOOM, Math.max(1, (g.startScale * dist) / g.startDist));
        scaleRef.current = nextScale;
        // Keep the pinch midpoint roughly anchored while zooming.
        const midX = (pts[0].x + pts[1].x) / 2;
        const midY = (pts[0].y + pts[1].y) / 2;
        txRef.current = g.startTx + (midX - g.startMidX);
        tyRef.current = g.startTy + (midY - g.startMidY);
        clampPan();
        setZoomed(nextScale > 1);
        applyTransform(false);
      }
    } else if (g.pointers.size === 1) {
      if (scaleRef.current > 1) {
        // Pan while zoomed — never switches images.
        txRef.current = e.clientX - g.panStartX;
        tyRef.current = e.clientY - g.panStartY;
        clampPan();
        applyTransform(false);
      } else if (g.swiping) {
        // Horizontal swipe drag while not zoomed.
        g.swipeDx = e.clientX - (g.panStartX + txRef.current);
        g.swipeDy = e.clientY - (g.panStartY + tyRef.current);
        const img = imgRef.current;
        if (img && Math.abs(g.swipeDx) > Math.abs(g.swipeDy)) {
          img.style.transition = 'none';
          img.style.transform = `translate(${g.swipeDx}px, 0px) scale(1)`;
        }
      }
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const g = gesture.current;
    g.pointers.delete(e.pointerId);

    if (g.pointers.size > 0) {
      // Ending a pinch: re-anchor remaining pointer for panning.
      const remaining = Array.from(g.pointers.values())[0];
      g.panStartX = remaining.x - txRef.current;
      g.panStartY = remaining.y - tyRef.current;
      if (scaleRef.current <= 1.02) resetZoom(true);
      return;
    }

    // Single-pointer release
    if (g.swiping && scaleRef.current <= 1) {
      if (Math.abs(g.swipeDx) > SWIPE_THRESHOLD_PX && Math.abs(g.swipeDx) > Math.abs(g.swipeDy)) {
        if (g.swipeDx < 0) goNext();
        else goPrev();
        return;
      }
      // Snap back if swipe didn't pass the threshold.
      applyTransform(true);
    }

    // Double-tap detection (only counts taps, not drags).
    if (!g.moved) {
      const now = Date.now();
      const isDoubleTap =
        now - g.lastTapTime < DOUBLE_TAP_MS &&
        Math.abs(e.clientX - g.lastTapX) < 32 &&
        Math.abs(e.clientY - g.lastTapY) < 32;
      if (isDoubleTap) {
        g.lastTapTime = 0;
        if (scaleRef.current > 1) {
          resetZoom(true);
        } else {
          // Zoom towards the tapped point.
          const img = imgRef.current;
          if (img) {
            const rect = img.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            txRef.current = (cx - e.clientX) * (DOUBLE_TAP_ZOOM - 1);
            tyRef.current = (cy - e.clientY) * (DOUBLE_TAP_ZOOM - 1);
          }
          setScale(DOUBLE_TAP_ZOOM, true);
        }
      } else {
        g.lastTapTime = now;
        g.lastTapX = e.clientX;
        g.lastTapY = e.clientY;
      }
    }
  };

  const onPointerCancel = (e: React.PointerEvent) => {
    gesture.current.pointers.delete(e.pointerId);
    if (gesture.current.pointers.size === 0 && scaleRef.current <= 1) applyTransform(true);
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Property image viewer"
      className="fixed inset-0 z-[100] flex items-center justify-center select-none"
      style={{ background: 'rgba(0,0,0,0.92)', touchAction: 'none' }}
    >
      {/* Top bar: counter + close */}
      <div className="absolute top-0 left-0 right-0 z-[102] flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <span className="text-white/90 text-sm font-semibold tracking-wide tabular-nums pointer-events-auto">
          {index + 1} / {images.length}
        </span>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Image stage */}
      <div
        className="absolute inset-0 z-[101] flex items-center justify-center overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="w-9 h-9 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
          </div>
        )}
        {/* Plain <img> keeps transforms cheap and never crops (object-contain). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          key={images[index]}
          src={images[index]}
          alt={`Property photo ${index + 1} of ${images.length}`}
          draggable={false}
          onLoad={() => setLoaded(true)}
          className={`max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ willChange: 'transform', transform: 'translate(0px, 0px) scale(1)' }}
        />
      </div>

      {/* Prev / Next controls (hidden when zoomed to avoid accidental switches) */}
      {images.length > 1 && !zoomed && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[102] flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-[102] flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      {/* Hint (mobile only, fades naturally as it's just a static bar) */}
      <div className="absolute bottom-0 left-0 right-0 z-[102] flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none sm:hidden">
        <span className="text-white/60 text-[11px] font-medium">
          {zoomed ? 'Drag to move • Double-tap to reset' : 'Swipe to browse • Pinch or double-tap to zoom'}
        </span>
      </div>
    </div>
  );
}
