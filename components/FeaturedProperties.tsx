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

interface FeaturedPropertyProps {
  data?: Property[];
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
    // Check if window is defined (client-side only)
    if (typeof window === "undefined") return;

    const handleResize = () => {
      // On mobile (less than 640px), make card 85% of screen width
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

const FeaturedPropertiesCarousel: React.FC<FeaturedPropertyProps> = ({
  data = [],
  isLoading = false,
}) => {
  // State
  const [centerIndex, setCenterIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Dimensions
  const cardWidth = useCardWidth();
  const totalSlides = data.length;

  // Refs
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

  const goToSlide = useCallback(
    (idx: number) => {
      setCenterIndex(getWrappedIndex(idx));
      setDragOffset(0);
    },
    [getWrappedIndex]
  );

  const nextSlide = useCallback(
    () => goToSlide(centerIndex + 1),
    [centerIndex, goToSlide]
  );
  const prevSlide = useCallback(
    () => goToSlide(centerIndex - 1),
    [centerIndex, goToSlide]
  );

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

  // --- Drag Physics ---

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
    setDragOffset(currentX - startXRef.current);
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

  // --- Style Calculation (Round Robin Math) ---

  const getCardStyles = useCallback(
    (index: number) => {
      let diff = index - centerIndex;

      // Wrap logic for shortest path
      if (diff > totalSlides / 2) diff -= totalSlides;
      if (diff < -totalSlides / 2) diff += totalSlides;

      // Optimization: Only render visible cards + buffer
      const isVisible = Math.abs(diff) <= 2;
      if (!isVisible) return { display: "none" };

      const baseOffset = diff * (cardWidth + CAROUSEL_CONFIG.GAP);
      const totalX = baseOffset + dragOffset;

      const distanceFactor = Math.abs(diff + dragOffset / -cardWidth);
      const scale = Math.max(0.9, 1.05 - distanceFactor * 0.15);
      const opacity = Math.max(0.5, 1 - distanceFactor * 0.5);
      const zIndex = 30 - Math.round(distanceFactor * 10);

      return {
        transform: `translateX(calc(-50% + ${totalX}px)) scale(${scale})`,
        left: "50%",
        zIndex: zIndex,
        opacity: opacity,
        position: "absolute" as const,
        transition: isDragging
          ? "none"
          : "transform 500ms cubic-bezier(0.25, 1, 0.5, 1), opacity 500ms",
        width: `${cardWidth}px`,
        cursor: isDragging ? "grabbing" : "grab",
      };
    },
    [centerIndex, totalSlides, dragOffset, cardWidth, isDragging]
  );

  // --- Helper: Tag Styling ---
  const getTagClass = (tagText: string, isCenter: boolean) => {
    const base =
      "px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg text-white";
    if (isCenter) return `${base} bg-[#0F7F9C]`; // Active bluish-teal
    if (tagText === "Exclusive") return `${base} bg-yellow-500`;
    if (tagText === "Private") return `${base} bg-purple-500`;
    if (tagText === "Hot Deal") return `${base} bg-red-500`;
    if (tagText === "Open House")
      return "px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg bg-gray-200 text-gray-800";
    return `${base} bg-[#0F7F9C]`;
  };

  // --- Render ---

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50 h-[600px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-[350px] bg-gray-200 rounded-3xl"></div>
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-[#c5e6ff]/10 via-[#9fd4ff]/40 to-[#f5fbff] relative overflow-hidden touch-pan-y">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" />

      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12 text-center px-4 select-none">
          <h2 className="text-4xl font-bold text-stone-800 mb-3 font-serif">
            Featured Properties
          </h2>
          <p className="text-gray-600 text-lg">
            Curated interiors from Gandhinagar&apos;s finest homes.
          </p>
          <div className="h-1.5 bg-gradient-to-r from-[#0F7F9C] to-[#075985] mx-auto mt-5 rounded-full w-24 hover:w-64 transition-all duration-500 ease-in-out" />
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => !isDragging && setIsPaused(false)}
        >
          {/* Controls */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center hover:scale-105 transition transform focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center hover:scale-105 transition transform focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
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
                <div
                  key={property.id}
                  style={style}
                  className="top-4 origin-center touch-none"
                >
                  <div
                    className={[
                      "relative rounded-3xl overflow-hidden h-full bg-white border border-gray-100 transition-shadow duration-300",
                      isCenterCard
                        ? "shadow-[0_30px_40px_rgba(15,127,156,0.17)] ring-2 ring-sky-200"
                        : "shadow-sm",
                    ].join(" ")}
                  >
                    {/* Inner Card Content */}
                    <div className="relative group flex-shrink-0 w-full bg-white rounded-3xl overflow-hidden h-full flex flex-col">
                      {/* Image Area */}
                      <div className="relative h-48 sm:h-52 overflow-hidden rounded-t-3xl flex-shrink-0 pointer-events-none">
                        <img
                          src={property.image}
                          alt={property.location}
                          className="absolute inset-0 w-full h-full object-cover"
                          draggable={false}
                        />
                        <div
                          className={getTagClass(
                            property.tag.text,
                            isCenterCard
                          )}
                          style={{
                            position: "absolute",
                            top: 12,
                            right: isCenterCard ? 16 : "auto",
                            left: isCenterCard ? "auto" : 16,
                          }}
                        >
                          {property.tag.text}
                        </div>
                        <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-2 rounded-lg shadow-md">
                          <span className="text-lg font-bold text-[#0F7F9C]">
                            {property.price}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {property.location}
                          </h3>
                          <p className="text-xs text-gray-500">
                            Gandhinagar · Prime locality
                          </p>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4 text-[#0F7F9C]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                            {property.beds} bd
                          </span>
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4 text-[#0F7F9C]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                              />
                            </svg>
                            {property.baths} ba
                          </span>
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4 text-[#0F7F9C]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                              />
                            </svg>
                            {property.sqft} sq ft
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {property.features.slice(0, 2).map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-[#e0f2ff] text-[#0F7F9C] text-xs rounded-full font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            if (isDragging) e.preventDefault();
                            else console.log("Navigating to", property.id);
                          }}
                          className={`mt-auto w-full py-2.5 rounded-lg font-medium transition-all ${
                            isCenterCard
                              ? "bg-gradient-to-r from-[#0F7F9C] to-[#022F5A] text-white shadow-md hover:shadow-lg"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {data.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  centerIndex === idx
                    ? "scale-125 bg-[#0F7F9C] shadow-md"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- SIMULATION OF PARENT COMPONENT (12 Items Restored) ---

const ALL_FEATURED_PROPERTIES: Property[] = [
  {
    id: "e1",
    image:
      "https://images.unsplash.com/photo-1505692952047-1a78307da8e8?auto=format&fit=crop&w=1200&q=80",
    price: "₹3.40 Cr",
    location: "Sector 5",
    beds: 4,
    baths: 4,
    sqft: "3,200",
    features: ["Penthouse", "Terrace Garden"],
    tag: { text: "Premium", color: "bg-primary text-white" },
  },
  {
    id: "e2",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    price: "₹1.90 Cr",
    location: "Koba",
    beds: 3,
    baths: 3,
    sqft: "2,050",
    features: ["Club Access", "Corner Unit"],
    tag: { text: "Exclusive", color: "bg-yellow-500 text-white" },
  },
  {
    id: "e3",
    image:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?auto=format&fit=crop&w=1200&q=80",
    price: "₹2.80 Cr",
    location: "Torda",
    beds: 4,
    baths: 3,
    sqft: "2,850",
    features: ["Garden View", "Home Office"],
    tag: { text: "New", color: "bg-primary text-white" },
  },
  {
    id: "e4",
    image:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80",
    price: "₹3.60 Cr",
    location: "Gift City",
    beds: 4,
    baths: 4,
    sqft: "3,450",
    features: ["Riverfront", "High Floor"],
    tag: { text: "Private", color: "bg-purple-500 text-white" },
  },
  {
    id: "e5",
    image:
      "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=80",
    price: "₹2.10 Cr",
    location: "Kh Road",
    beds: 3,
    baths: 3,
    sqft: "2,200",
    features: ["Ready to Move", "2 Car Parks"],
    tag: { text: "Hot Deal", color: "bg-red-500 text-white" },
  },
  {
    id: "e6",
    image:
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
    price: "₹2.95 Cr",
    location: "Chiloda",
    beds: 4,
    baths: 3,
    sqft: "2,900",
    features: ["Corner Plot", "Smart Home"],
    tag: { text: "Premium", color: "bg-primary text-white" },
  },
  {
    id: "e7",
    image:
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80",
    price: "₹2.25 Cr",
    location: "Adalaj",
    beds: 3,
    baths: 3,
    sqft: "2,300",
    features: ["Club Access", "Park Facing"],
    tag: { text: "Open House", color: "bg-gray-200 text-gray-800" },
  },
  {
    id: "e8",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    price: "₹3.05 Cr",
    location: "Sargasan Ext.",
    beds: 4,
    baths: 4,
    sqft: "3,050",
    features: ["Premium Finishes", "Servant Room"],
    tag: { text: "Exclusive", color: "bg-yellow-500 text-white" },
  },
  {
    id: "e9",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    price: "₹1.99 Cr",
    location: "Randesan",
    beds: 3,
    baths: 3,
    sqft: "2,120",
    features: ["Modular Kitchen", "City View"],
    tag: { text: "New", color: "bg-primary text-white" },
  },
  {
    id: "e10",
    image:
      "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=1200&q=80",
    price: "₹2.70 Cr",
    location: "Kudasan Ext.",
    beds: 4,
    baths: 3,
    sqft: "2,780",
    features: ["Corner Unit", "Premium Location"],
    tag: { text: "Premium", color: "bg-primary text-white" },
  },
  {
    id: "e11",
    image:
      "https://images.unsplash.com/photo-1489365091240-6a18fc761ec2?auto=format&fit=crop&w=1200&q=80",
    price: "₹2.35 Cr",
    location: "Sector 25",
    beds: 3,
    baths: 3,
    sqft: "2,380",
    features: ["Green Belt", "High Floor"],
    tag: { text: "Open House", color: "bg-gray-200 text-gray-800" },
  },
  {
    id: "e12",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    price: "₹3.25 Cr",
    location: "Sector 10",
    beds: 4,
    baths: 4,
    sqft: "3,120",
    features: ["Terrace Deck", "2 Car Parks"],
    tag: { text: "Private", color: "bg-purple-500 text-white" },
  },
];

const FeaturedPropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProperties(ALL_FEATURED_PROPERTIES);
      setLoading(false);
    };

    fetchData();
  }, []);

  return <FeaturedPropertiesCarousel data={properties} isLoading={loading} />;
};

export default FeaturedPropertiesPage;
