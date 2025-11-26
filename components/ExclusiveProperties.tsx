"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Enhanced ExclusiveProperty Carousel
 * - Better performance with optimized re-renders
 * - Improved accessibility with proper ARIA labels
 * - Smother animations and gestures
 * - Better code organization with custom hooks
 * - Enhanced responsive behavior
 */

const CAROUSEL_CONFIG = {
  AUTO_ADVANCE_MS: 4000,
  SWIPE_THRESHOLD_PX: 48,
  TRANSITION_DURATION_MS: 500,
  PAUSE_RESUME_DELAY_MS: 2500,
} as const;

type Property = {
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

type PositionClasses = {
  wrapper: string;
};

// Custom hook for carousel state management
const useCarousel = (totalSlides: number, autoAdvanceMs: number) => {
  const [centerIndex, setCenterIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoAdvanceRef = useRef<number | null>(null);

  const wrapIndex = useCallback(
    (idx: number) => ((idx % totalSlides) + totalSlides) % totalSlides,
    [totalSlides]
  );

  const goToSlide = useCallback(
    (idx: number) => {
      if (autoAdvanceRef.current) {
        window.clearInterval(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
      setCenterIndex(wrapIndex(idx));
    },
    [wrapIndex]
  );

  const prevSlide = useCallback(() => goToSlide(centerIndex - 1), [centerIndex, goToSlide]);
  const nextSlide = useCallback(() => goToSlide(centerIndex + 1), [centerIndex, goToSlide]);

  // Auto-advance with cleanup
  useEffect(() => {
    if (isPaused || totalSlides <= 1) {
      if (autoAdvanceRef.current) {
        window.clearInterval(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
      return;
    }

    const id = window.setInterval(() => {
      setCenterIndex((prev) => wrapIndex(prev + 1));
    }, autoAdvanceMs);

    autoAdvanceRef.current = id;

    return () => {
      if (autoAdvanceRef.current) {
        window.clearInterval(autoAdvanceRef.current);
      }
    };
  }, [isPaused, wrapIndex, totalSlides, autoAdvanceMs]);

  const pauseTemporarily = useCallback(() => {
    setIsPaused(true);
    const resumeTimer = window.setTimeout(
      () => setIsPaused(false),
      CAROUSEL_CONFIG.PAUSE_RESUME_DELAY_MS
    );
    return () => window.clearTimeout(resumeTimer);
  }, []);

  return {
    centerIndex,
    isPaused,
    setIsPaused,
    goToSlide,
    prevSlide,
    nextSlide,
    pauseTemporarily,
  };
};

// Custom hook for swipe gestures
const useSwipe = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
  const pointerStartX = useRef<number | null>(null);
  const pointerDeltaX = useRef<number>(0);

  const onPointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
    pointerDeltaX.current = 0;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (pointerStartX.current == null) return;
    pointerDeltaX.current = e.clientX - pointerStartX.current;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current == null) return;
    const delta = pointerDeltaX.current;
    pointerStartX.current = null;
    pointerDeltaX.current = 0;

    if (delta > CAROUSEL_CONFIG.SWIPE_THRESHOLD_PX) {
      onSwipeRight();
    } else if (delta < -CAROUSEL_CONFIG.SWIPE_THRESHOLD_PX) {
      onSwipeLeft();
    }
  };

  return { onPointerDown, onPointerMove, onPointerUp };
};

// Property data
const PROPERTY_DATA: Property[] = [
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
  {
    id: "f6",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    price: "₹2.75 Cr",
    location: "Sector 7",
    beds: 4,
    baths: 3,
    sqft: "2,800",
    features: ["Corner Plot", "Premium Finishes"],
    tag: { text: "Premium", color: "bg-[#B59E78] text-white" },
  },
];

const CARD_WIDTH_PX = 350;

const ExclusiveProperty: React.FC = () => {
  const properties = useMemo(() => PROPERTY_DATA, []);
  const totalSlides = properties.length;

  const {
    centerIndex,
    isPaused,
    setIsPaused,
    goToSlide,
    prevSlide,
    nextSlide,
    pauseTemporarily,
  } = useCarousel(totalSlides, CAROUSEL_CONFIG.AUTO_ADVANCE_MS);

  const { onPointerDown, onPointerMove, onPointerUp } = useSwipe(nextSlide, prevSlide);

  // Refs
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  // Position calculation
  const getCircularDiff = useCallback(
    (index: number): number => {
      const rawDiff = index - centerIndex;
      const altDiff = rawDiff > 0 ? rawDiff - totalSlides : rawDiff + totalSlides;
      return Math.abs(altDiff) < Math.abs(rawDiff) ? altDiff : rawDiff;
    },
    [centerIndex, totalSlides]
  );

  const getCardPositionClasses = useCallback(
    (index: number): PositionClasses => {
      const diff = getCircularDiff(index);

      switch (diff) {
        case 0:
          return {
            wrapper: "z-30 scale-[1.05] translate-x-0 shadow-2xl ring-2 ring-[#B59E78]/50 bg-[#FDFBF7]",
          };
        case -1:
          return {
            wrapper: "z-20 scale-[0.9] -translate-x-10 opacity-90",
          };
        case 1:
          return {
            wrapper: "z-20 scale-[0.9] translate-x-10 opacity-90",
          };
        default:
          return {
            wrapper: "z-0 opacity-0 scale-[0.7] translate-x-0 pointer-events-none",
          };
      }
    },
    [getCircularDiff]
  );

  // Smooth scroll to active card
  const scrollToActive = useCallback(
    (idx: number) => {
      const container = listRef.current;
      const target = itemRefs.current[idx];

      if (!container || !target) return;

      const offsetLeft = target.offsetLeft - container.offsetWidth / 2 + target.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, offsetLeft),
        behavior: "smooth",
      });
    },
    []
  );

  // Handle navigation with pause
  const handleNavigation = useCallback((navigationFn: () => void) => {
    navigationFn();
    pauseTemporarily();
  }, [pauseTemporarily]);

  // Effects
  useEffect(() => {
    scrollToActive(centerIndex);
  }, [centerIndex, scrollToActive]);

  useEffect(() => {
    const handleResize = () => scrollToActive(centerIndex);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [centerIndex, scrollToActive]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleNavigation(prevSlide);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNavigation(nextSlide);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide, handleNavigation]);

  // Stat Icon Component
  const StatIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg
      className="w-4 h-4 inline-block mr-1 text-[#B59E78] flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {children}
    </svg>
  );

  return (
    <section
      className="py-20 bg-gradient-to-b from-[#FAF9F6] to-[#F5F2EB] relative overflow-hidden"
      aria-labelledby="exclusive-properties-heading"
    >
      {/* Decorative line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B59E78]/40 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2
            id="exclusive-properties-heading"
            className="text-4xl font-bold text-stone-800 mb-3 font-serif"
          >
            Exclusive Properties
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            Curated interiors from Gandhinagar's finest homes.
          </p>
          <div className="h-1.5 bg-[#B59E78] mx-auto mt-5 rounded-full w-24 hover:w-64 transition-all duration-500 ease-in-out" />
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            type="button"
            aria-label="Previous property"
            onClick={() => handleNavigation(prevSlide)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200 shadow-lg flex items-center justify-center hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-[#B59E78]/60 disabled:opacity-50"
            disabled={totalSlides <= 1}
          >
            <svg className="w-5 h-5 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Next property"
            onClick={() => handleNavigation(nextSlide)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200 shadow-lg flex items-center justify-center hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-[#B59E78]/60 disabled:opacity-50"
            disabled={totalSlides <= 1}
          >
            <svg className="w-5 h-5 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel */}
          <div
            ref={listRef}
            className="relative overflow-x-auto overflow-y-visible px-4 md:px-24 lg:px-48 snap-x no-scrollbar"
            role="region"
            aria-roledescription="carousel"
            aria-label="Exclusive properties carousel"
            aria-live={isPaused ? "off" : "polite"}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <div className="flex gap-0 min-w-full py-8 justify-start items-stretch">
              {/* Ghost spacers for centering */}
              <div
                style={{ width: `${CARD_WIDTH_PX}px` }}
                className="flex-none opacity-0 pointer-events-none"
                aria-hidden="true"
              />

              {properties.map((property, index) => {
                const isCenterCard = index === centerIndex;
                const { wrapper } = getCardPositionClasses(index);

                return (
                  <article
                    key={property.id}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    className="flex-none w-[320px] md:w-[350px] px-0"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${totalSlides}: ${property.location} property for ${property.price}`}
                    aria-hidden={!isCenterCard}
                  >
                    <div
                      className={[
                        "relative rounded-3xl overflow-hidden transform-gpu transition-all duration-500 origin-center h-full",
                        "bg-[#FDFBF7] border border-[#EBE5D9]",
                        wrapper,
                      ].join(" ")}
                      style={{
                        animation: isCenterCard ? "liftIn 480ms ease forwards" : undefined,
                      }}
                    >
                      <div className="flex flex-col h-full bg-[#FDFBF7] rounded-3xl shadow-lg overflow-hidden">
                        {/* Image Container */}
                        <div className="relative h-48 overflow-hidden rounded-t-3xl">
                          <img
                            src={property.image}
                            alt={`Interior of ${property.location} property`}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            loading="lazy"
                            decoding="async"
                            width={800}
                            height={320}
                          />

                          {/* Tag */}
                          <div
                            className={`absolute top-4 ${isCenterCard ? "right-4" : "left-4"} px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm`}
                            style={{
                              backgroundColor: property.tag.color.includes('bg-[') 
                                ? property.tag.color.match(/bg-\[([^\]]+)\]/)?.[1]
                                : undefined,
                              color: property.tag.color.includes('text-white') ? '#fff' : undefined,
                            }}
                          >
                            {property.tag.text}
                          </div>

                          {/* Price */}
                          <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-2 rounded-lg shadow-md backdrop-blur-sm">
                            <span className="text-lg font-bold text-[#8C7A5B]">
                              {property.price}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="mb-3">
                            <h3 className="text-lg font-semibold text-stone-800 mb-1">
                              {property.location}
                            </h3>
                            <p className="text-xs text-stone-500">
                              Gandhinagar · Prime locality
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 mb-3 text-sm text-stone-600">
                            <span className="flex items-center gap-1">
                              <StatIcon>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </StatIcon>
                              {property.beds} bd
                            </span>

                            <span className="flex items-center gap-1">
                              <StatIcon>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                              </StatIcon>
                              {property.baths} ba
                            </span>

                            <span className="flex items-center gap-1">
                              <StatIcon>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </StatIcon>
                              {property.sqft} sq ft
                            </span>
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {property.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-[#F5F2EB] text-[#8C7A5B] text-xs rounded-full font-medium"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>

                          {/* Action Button */}
                          <button
                            type="button"
                            onClick={() => {
                              // Add your navigation or modal logic here
                              console.log('View details:', property.id);
                            }}
                            className={`mt-auto w-full py-2.5 rounded-lg font-medium transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#B59E78]/60 ${
                              isCenterCard
                                ? "bg-gradient-to-r from-[#B59E78] to-[#8C7A5B] text-white shadow-lg hover:shadow-xl"
                                : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                            }`}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Right ghost spacer */}
              <div
                style={{ width: `${CARD_WIDTH_PX}px` }}
                className="flex-none opacity-0 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Pagination */}
          {totalSlides > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {properties.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleNavigation(() => goToSlide(idx))}
                  aria-label={`Go to property ${idx + 1}`}
                  className={`w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#B59E78]/50 ${
                    centerIndex === idx 
                      ? "w-6 bg-[#B59E78] shadow-sm" 
                      : "bg-stone-300 hover:bg-stone-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes liftIn {
          0% {
            transform: translateY(8px) scale(0.99);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0) scale(1.05);
            opacity: 1;
          }
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ExclusiveProperty;