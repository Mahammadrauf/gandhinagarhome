"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * CurvedCarousel
 * props:
 *  - items: array of {id: string, render: () => JSX}  OR array of image URLs (strings)
 *  - radius: number (px) - distance from center (translateZ)
 *  - speed: number - degrees per frame increment (smaller = slower)
 *  - size: number - item size in px
 */
export default function CurvedCarousel({
  items = [],
  radius = 260,
  speed = 0.18,
  size = 140,
}) {
  const worldRef = useRef(null);
  const animRef = useRef(null);
  const lastRef = useRef({ dragging: false, startX: 0, startAngle: 0 });
  const [angle, setAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Normalize items to objects with render function
  const normalized = items.map((it, i) =>
    typeof it === "string" ? { id: `i${i}`, render: () => <img src={it} alt={`it-${i}`} className="w-2/3 h-2/3 object-contain pointer-events-none" /> } : it
  );

  // animation loop
  useEffect(() => {
    let a = angle;

    const tick = () => {
      if (!lastRef.current.dragging && !isPaused) {
        a = (a + speed) % 360;
        setAngle(a);
        if (worldRef.current) {
          worldRef.current.style.transform = `translateZ(-${radius / 2}px) rotateY(${a}deg)`;
        }
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, radius, speed]);

  // pointer drag handlers for desktop / touch
  useEffect(() => {
    const world = worldRef.current;
    if (!world) return;

    const onDown = (e) => {
      lastRef.current.dragging = true;
      lastRef.current.startX = e.clientX ?? e.touches?.[0]?.clientX;
      // read computed rotate
      const matrix = getComputedStyle(world).transform;
      lastRef.current.startAngle = angle;
      setIsPaused(true);
    };
    const onMove = (e) => {
      if (!lastRef.current.dragging) return;
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const dx = x - lastRef.current.startX;
      // convert dx to angle change (drag sensitivity)
      const newAngle = lastRef.current.startAngle + dx * 0.3;
      setAngle(newAngle);
      world.style.transform = `translateZ(-${radius / 2}px) rotateY(${newAngle}deg)`;
    };
    const onUp = () => {
      lastRef.current.dragging = false;
      setTimeout(() => setIsPaused(false), 700);
    };

    world.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    // touch fallback
    world.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp, { passive: true });

    return () => {
      world.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      world.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angle, radius]);

  // keyboard left/right for accessibility (optional)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        setAngle((a) => a - 20);
      } else if (e.key === "ArrowRight") {
        setAngle((a) => a + 20);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const itemCount = normalized.length;
  return (
    <div
      className="w-full flex items-center justify-center relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Perspective container */}
      <div
        className="relative w-full max-w-[980px] h-[320px] flex items-center justify-center"
        style={{ perspective: `${radius * 3}px` }}
      >
        {/* world that rotates */}
        <div
          ref={worldRef}
          className="absolute inset-0 m-auto w-full h-full transition-transform duration-300 will-change-transform transform-style-preserve-3d"
          style={{ transform: `translateZ(-${radius / 2}px) rotateY(${angle}deg)` }}
        >
          {normalized.map((it, i) => {
            const theta = (360 / itemCount) * i;
            return (
              <div
                key={it.id}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  transform: `rotateY(${theta}deg) translateZ(${radius}px)`,
                  transition: "transform 400ms ease",
                }}
              >
                {/* The card / bubble */}
                <div
                  className="w-full h-full rounded-2xl bg-white/90 shadow-xl flex items-center justify-center overflow-hidden transform transition-all duration-300 hover:scale-105"
                  style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <div className="p-3 flex items-center justify-center">
                    {it.render()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* small helper style (keeps preserve-3d working in SSR) */}
      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
