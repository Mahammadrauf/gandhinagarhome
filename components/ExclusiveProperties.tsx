"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// --- Types ---

export type Property = {
  id: string;
  image: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  features: string[];
  tag: { text: string; color: string };
};

interface ExclusivePropertyProps {
  data?: Property[]; // Made optional to handle loading states
  isLoading?: boolean;
}

// --- Configuration ---

const CAROUSEL_CONFIG = {
  AUTO_ADVANCE_MS: 3000,
  DRAG_THRESHOLD: 50, // Pixel movement required to change slide
  GAP: 20,
  DESKTOP_CARD_WIDTH: 350,
} as const;

// --- Hooks ---

/**
 * Calculates available width for cards based on window size
 */
const useCardWidth = () => {
  const [width, setWidth] = useState<number>(CAROUSEL_CONFIG.DESKTOP_CARD_WIDTH);

  useEffect(() => {
    // Check if window is defined (client-side only)
    if (typeof window === "undefined") return;

    const handleResize = () => {
      // On mobile (less than 640px), make card 85% of screen width
      // On desktop, stick to fixed 350px
      if (window.innerWidth < 640) {
        setWidth(window.innerWidth * 0.85);
      } else {
        setWidth(CAROUSEL_CONFIG.DESKTOP_CARD_WIDTH);
      }
    };

    // Initial set
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
    // Don't auto-advance if paused, dragging, or not enough slides
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
    setIsPaused(true); // Pause auto-scroll immediately
    startXRef.current = e.clientX;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || startXRef.current === null) return;
    e.preventDefault();
    // Calculate how many pixels moved
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    setDragOffset(diff);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Release capture
    (e.target as Element).releasePointerCapture(e.pointerId);
    startXRef.current = null;

    // Decide if we should change slide based on threshold
    if (dragOffset > CAROUSEL_CONFIG.DRAG_THRESHOLD) {
      prevSlide();
    } else if (dragOffset < -CAROUSEL_CONFIG.DRAG_THRESHOLD) {
      nextSlide();
    } else {
      // Snap back to center if drag wasn't far enough
      setDragOffset(0);
    }

    // Resume auto-scroll after a short delay
    setTimeout(() => setIsPaused(false), 2000);
  };

  // --- Style Calculation (The Math) ---

  const getCardStyles = useCallback((index: number) => {
    let diff = index - centerIndex;
    
    // Shortest path wrapping
    if (diff > totalSlides / 2) diff -= totalSlides;
    if (diff < -totalSlides / 2) diff += totalSlides;

    // Visibility optimization
    const isVisible = Math.abs(diff) <= 2;
    if (!isVisible) return { display: 'none' };

    // Standard spacing offset
    const baseOffset = diff * (cardWidth + CAROUSEL_CONFIG.GAP);
    
    // Add the pixel-perfect drag offset
    // We add dragOffset directly to the translation
    const totalX = baseOffset + dragOffset;

    // Scale effect (center card is bigger)
    // We calculate a "progress" 0 to 1 based on how close to center it is
    const distanceFactor = Math.abs(diff + (dragOffset / -cardWidth)); // roughly 0 when centered
    const scale = Math.max(0.9, 1.05 - (distanceFactor * 0.15));
    const opacity = Math.max(0.5, 1 - (distanceFactor * 0.5));
    const zIndex = 30 - Math.round(distanceFactor * 10);

    return {
      transform: `translateX(calc(-50% + ${totalX}px)) scale(${scale})`,
      left: '50%',
      zIndex: zIndex,
      opacity: opacity,
      position: 'absolute' as const,
      // If dragging, remove transition for instant follow. If released, smooth snap.
      transition: isDragging ? 'none' : 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1), opacity 500ms',
      width: `${cardWidth}px`,
      cursor: isDragging ? 'grabbing' : 'grab',
    };
  }, [centerIndex, totalSlides, dragOffset, cardWidth, isDragging]);

  // --- Render ---

  // Loading State
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

  // No Data State
  if (!data || data.length === 0) return null;

  // Icon Helper
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
          {/* Controls - Hide on mobile if you prefer pure swipe */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/80 backdrop-blur border border-stone-200 shadow-lg items-center justify-center hover:scale-105 transition-all text-stone-600 z-50"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/80 backdrop-blur border border-stone-200 shadow-lg items-center justify-center hover:scale-105 transition-all text-stone-600 z-50"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Viewport */}
          <div
            className="relative w-full h-[540px] overflow-hidden select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {data.map((property, index) => {
              const isCenterCard = index === centerIndex;
              const style = getCardStyles(index);

              return (
                <article
                  key={property.id}
                  style={style}
                  className="top-4 origin-center touch-none" // touch-none is critical for dragging
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
                          {property.features.slice(0, 2).map((feature, idx) => (
                            <span key={idx} className="px-3 py-1 bg-[#F5F2EB] text-[#8C7A5B] text-xs rounded-full font-medium">{feature}</span>
                          ))}
                        </div>

                        <button
                          type="button"
                          // Prevent button click while dragging
                          onClick={(e) => {
                             if(isDragging) e.preventDefault();
                             else console.log('Navigating to', property.id);
                          }}
                          className={`mt-auto w-full py-2.5 rounded-lg font-medium transition-all ${isCenterCard ? "bg-gradient-to-r from-[#B59E78] to-[#8C7A5B] text-white shadow-lg" : "bg-stone-200 text-stone-600"}`}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {data.map((_, idx) => (
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

// --- SIMULATION OF PARENT COMPONENT (Backend Fetch) ---

// Dummy data moved outside component
const MOCK_DB_DATA: Property[] = [
  {
    id: "f1",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    price: "₹2.1 Cr",
    location: "Sargasan",
    beds: 4,
    baths: 4,
    sqft: "3,000",
    features: ["Vaastu-friendly", "2 Car Parks"],
    tag: { text: "New", color: "bg-[#B59E78] text-white" },
  },
  {
    id: "f2",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    price: "₹1.65 Cr",
    location: "Kudasan",
    beds: 3,
    baths: 3,
    sqft: "1,950",
    features: ["Club Access", "High Floor"],
    tag: { text: "Exclusive", color: "bg-[#D4C5A5] text-[#5C5042]" },
  },
  {
    id: "f3",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    price: "₹2.45 Cr",
    location: "Randesan",
    beds: 3,
    baths: 3,
    sqft: "2,250",
    features: ["Garden View", "Modular Kitchen"],
    tag: { text: "Open House", color: "bg-stone-200 text-stone-700" },
  },
  {
    id: "f4",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    price: "₹3.10 Cr",
    location: "Sector 21",
    beds: 4,
    baths: 4,
    sqft: "3,500",
    features: ["Private Pool", "Premium Location"],
    tag: { text: "Private", color: "bg-[#8C7A5B] text-white" },
  },
  {
    id: "f5",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    price: "₹1.85 Cr",
    location: "Sector 16",
    beds: 3,
    baths: 2,
    sqft: "2,100",
    features: ["City View", "Ready to Move"],
    tag: { text: "Hot Deal", color: "bg-[#A65D57] text-white" },
  },
];

// Usage Example
const PropertyPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate Fetching Data
  useEffect(() => {
    const fetchData = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProperties(MOCK_DB_DATA);
      setLoading(false);
    };

    fetchData();
  }, []);

  return <ExclusivePropertyCarousel data={properties} isLoading={loading} />;
};

export default PropertyPage;