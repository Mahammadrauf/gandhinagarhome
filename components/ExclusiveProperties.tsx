"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { fetchExclusiveProperties, FrontendProperty } from '@/lib/api';

interface ExclusivePropertyProps {
  data?: FrontendProperty[]; 
  isLoading?: boolean;
}


// --- Configuration ---

const CAROUSEL_CONFIG = {
  AUTO_ADVANCE_MS: 3000,
  DRAG_THRESHOLD: 50, 
  GAP: 20,
  DESKTOP_CARD_WIDTH: 350,
} as const;

// --- Hooks ---

const useCardWidth = () => {
  const [width, setWidth] = useState<number>(CAROUSEL_CONFIG.DESKTOP_CARD_WIDTH);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      if (window.innerWidth < 640) {
        setWidth(window.innerWidth * 0.85);
      } else {
        setWidth(CAROUSEL_CONFIG.DESKTOP_CARD_WIDTH);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

// --- Component ---

const ExclusivePropertyCarousel: React.FC<ExclusivePropertyProps> = ({ 
  data = [], 
  isLoading = false 
}) => {
  // State
  const [centerIndex, setCenterIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Dimensions
  const cardWidth = useCardWidth();
  const totalSlides = data.length;

  // Refs for Drag Logic
  const startXRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  
  // --- Logic Helpers ---

  const getWrappedIndex = useCallback(
    (idx: number) => {
      if (totalSlides === 0) return 0;
      return ((idx % totalSlides) + totalSlides) % totalSlides;
    },
    [totalSlides]
  );

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const goToSlide = useCallback((idx: number) => {
    setCenterIndex(getWrappedIndex(idx));
    setDragOffset(0);
  }, [getWrappedIndex]);

  const nextSlide = useCallback(() => goToSlide(centerIndex + 1), [centerIndex, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(centerIndex - 1), [centerIndex, goToSlide]);

  // --- Auto Advance ---

  const scheduleNext = useCallback(() => {
    clearTimer();
    if (isPaused || isDragging || totalSlides <= 1) return;
    
    timeoutRef.current = window.setTimeout(() => {
      setCenterIndex((prev) => getWrappedIndex(prev + 1));
      scheduleNext();
    }, CAROUSEL_CONFIG.AUTO_ADVANCE_MS);
  }, [isPaused, isDragging, totalSlides, getWrappedIndex, clearTimer]);

  useEffect(() => {
    scheduleNext();
    return () => clearTimer();
  }, [scheduleNext, clearTimer]);

  // --- Drag / Swipe Physics ---

  const handlePointerDown = (e: React.PointerEvent) => {
    if (totalSlides <= 1) return;
    setIsDragging(true);
    setIsPaused(true); 
    startXRef.current = e.clientX;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || startXRef.current === null) return;
    e.preventDefault();
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    setDragOffset(diff);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    (e.target as Element).releasePointerCapture(e.pointerId);
    startXRef.current = null;

    if (dragOffset > CAROUSEL_CONFIG.DRAG_THRESHOLD) {
      prevSlide();
    } else if (dragOffset < -CAROUSEL_CONFIG.DRAG_THRESHOLD) {
      nextSlide();
    } else {
      setDragOffset(0);
    }

    setTimeout(() => setIsPaused(false), 2000);
  };

  // --- Style Calculation ---

  const getCardStyles = useCallback((index: number) => {
    let diff = index - centerIndex;
    
    if (diff > totalSlides / 2) diff -= totalSlides;
    if (diff < -totalSlides / 2) diff += totalSlides;

    const isVisible = Math.abs(diff) <= 2;
    if (!isVisible) return { display: 'none' };

    const baseOffset = diff * (cardWidth + CAROUSEL_CONFIG.GAP);
    const totalX = baseOffset + dragOffset;

    const distanceFactor = Math.abs(diff + (dragOffset / -cardWidth)); 
    const scale = Math.max(0.9, 1.05 - (distanceFactor * 0.15));
    const opacity = Math.max(0.5, 1 - (distanceFactor * 0.5));
    const zIndex = 30 - Math.round(distanceFactor * 10);

    return {
      transform: `translateX(calc(-50% + ${totalX}px)) scale(${scale})`,
      left: '50%',
      zIndex: zIndex,
      opacity: opacity,
      position: 'absolute' as const,
      transition: isDragging ? 'none' : 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1), opacity 500ms',
      width: `${cardWidth}px`,
      cursor: isDragging ? 'grabbing' : 'grab',
    };
  }, [centerIndex, totalSlides, dragOffset, cardWidth, isDragging]);

  // --- Render ---

  if (isLoading) {
    return (
      <section className="py-20 bg-[#FAF9F6] h-[600px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-stone-200 rounded mb-4"></div>
          <div className="h-64 w-[350px] bg-stone-200 rounded-3xl"></div>
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="py-20 bg-[#FAF9F6] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-stone-800 mb-3 font-serif">
              Exclusive Properties
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto mb-8">
              No exclusive properties available at the moment.
            </p>
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-64 w-[350px] bg-stone-200 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const StatIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg className="w-4 h-4 inline-block mr-1 text-[#B59E78] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {children}
    </svg>
  );

  return (
    <section
      className="py-20 bg-gradient-to-b from-[#FAF9F6] to-[#F5F2EB] relative overflow-hidden touch-pan-y"
      aria-labelledby="exclusive-properties-heading"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B59E78]/40 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center select-none">
          <h2 id="exclusive-properties-heading" className="text-4xl font-bold text-stone-800 mb-3 font-serif">
            Exclusive Properties
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            Curated interiors from Gandhinagar's finest homes.
          </p>
          <div className="h-1.5 bg-[#B59E78] mx-auto mt-5 rounded-full w-24 hover:w-64 transition-all duration-500 ease-in-out" />
        </div>

        {/* Carousel Area */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => !isDragging && setIsPaused(false)}
        >
          {/* --- CONTROLS --- */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-40 w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/10 shadow-lg items-center justify-center hover:scale-105 hover:bg-white/40 transition-all text-stone-700"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-40 w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/10 shadow-lg items-center justify-center hover:scale-105 hover:bg-white/40 transition-all text-stone-700"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Viewport with Drag Events Attached */}
          <div
            className="relative w-full h-[540px] overflow-hidden select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {data.map((property: FrontendProperty, index: number) => {
              const isCenterCard = index === centerIndex;
              const style = getCardStyles(index);

              return (
                <article
                  key={property.id}
                  style={style}
                  className="top-4 origin-center touch-none" 
                >
                  <div className={`
                    relative rounded-3xl overflow-hidden h-full bg-[#FDFBF7] border border-[#EBE5D9] transition-shadow duration-300
                    ${isCenterCard ? "shadow-2xl ring-2 ring-[#B59E78]/50" : "shadow-lg"}
                  `}>
                    <div className="flex flex-col h-full bg-[#FDFBF7] rounded-3xl overflow-hidden">
                      {/* Image */}
                      <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-3xl pointer-events-none">
                        <img
                          src={property.image}
                          alt={property.location}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                        <div
                          className={`absolute top-4 ${isCenterCard ? "right-4" : "left-4"} px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm`}
                          style={{
                            backgroundColor: property.tag.color.includes('bg-[') ? property.tag.color.match(/bg-\[([^\]]+)\]/)?.[1] : '#B59E78',
                            color: property.tag.color.includes('text-white') ? '#fff' : property.tag.color.includes('text-') ? property.tag.color.match(/text-\[([^\]]+)\]/)?.[1] : '#000',
                          }}
                        >
                          {property.tag.text}
                        </div>
                        <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-2 rounded-lg shadow-md backdrop-blur-sm">
                          <span className="text-lg font-bold text-[#8C7A5B]">{property.price}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col">
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-stone-800 mb-1">{property.location}</h3>
                          <p className="text-xs text-stone-500">Gandhinagar · Prime locality</p>
                        </div>

                        <div className="flex items-center gap-4 mb-3 text-sm text-stone-600">
                          <span className="flex items-center gap-1"><StatIcon><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/></StatIcon>{property.beds} bd</span>
                          <span className="flex items-center gap-1"><StatIcon><path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/></StatIcon>{property.baths} ba</span>
                          <span className="flex items-center gap-1"><StatIcon><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/></StatIcon>{property.sqft} sq ft</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {property.features.slice(0, 2).map((feature: string, idx: number) => (
                            <span key={idx} className="px-3 py-1 bg-[#F5F2EB] text-[#8C7A5B] text-xs rounded-full font-medium">{feature}</span>
                          ))}
                        </div>

                        {/* UPDATED LINK: Opens in New Tab */}
                        <Link
                          href={`/properties/${property.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            // Prevent navigation if user is dragging
                            if (isDragging) {
                              e.preventDefault();
                            }
                          }}
                          className={`mt-auto w-full py-2.5 rounded-lg font-medium transition-all text-center block ${isCenterCard ? "bg-gradient-to-r from-[#B59E78] to-[#8C7A5B] text-white shadow-lg hover:shadow-xl" : "bg-stone-200 text-stone-600 hover:bg-stone-300"}`}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {data.map((_: FrontendProperty, idx: number) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-full ${centerIndex === idx ? 'w-8 h-2 bg-[#B59E78]' : 'w-2 h-2 bg-stone-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


// Usage Example
const PropertyPage = () => {
  const [properties, setProperties] = useState<FrontendProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchExclusiveProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching exclusive properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return <ExclusivePropertyCarousel data={properties} isLoading={loading} />;
};

export default PropertyPage;