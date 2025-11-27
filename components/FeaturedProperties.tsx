"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const TIMER_MS = 2000; // 2 seconds

/** ========= Types ========= */
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

/** ========= Data: 12 Featured Properties (Updated Order) ========= */
const ALL_FEATURED_PROPERTIES: Property[] = [
  // First 3 (from screenshot)
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

  // Remaining properties
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

const FeaturedProperties: React.FC = () => {
  const featuredList = useMemo(() => ALL_FEATURED_PROPERTIES, []);
  const totalSlides = featuredList.length;

  const [centerIndex, setCenterIndex] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoAdvanceRef = useRef<number | null>(null);

  const scrollToActive = (idx: number) => {
    const container = listRef.current;
    const target = itemRefs.current[idx];

    if (container && target) {
      const targetOffsetLeft = target.offsetLeft;
      const offset =
        targetOffsetLeft - container.offsetWidth / 2 + target.offsetWidth / 2;

      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  };

  const wrapIndex = (idx: number) => {
    return ((idx % totalSlides) + totalSlides) % totalSlides;
  };

  const goToSlide = (idx: number) => {
    if (autoAdvanceRef.current) window.clearInterval(autoAdvanceRef.current);
    setCenterIndex(wrapIndex(idx));
  };

  const prevSlide = () => goToSlide(centerIndex - 1);
  const nextSlide = () => goToSlide(centerIndex + 1);

  useEffect(() => {
    if (isHovered) {
      if (autoAdvanceRef.current) window.clearInterval(autoAdvanceRef.current);
      return;
    }

    if (autoAdvanceRef.current) window.clearInterval(autoAdvanceRef.current);

    const id = window.setInterval(() => {
      setCenterIndex((prev) => wrapIndex(prev + 1));
    }, TIMER_MS);

    autoAdvanceRef.current = id;

    return () => {
      if (autoAdvanceRef.current) window.clearInterval(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    };
  }, [isHovered, totalSlides]);

  useEffect(() => {
    scrollToActive(centerIndex);

    const onResize = () => scrollToActive(centerIndex);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [centerIndex]);

  const getCircularDiff = (index: number) => {
    const rawDiff = index - centerIndex;
    const altDiff = rawDiff > 0 ? rawDiff - totalSlides : rawDiff + totalSlides;
    return Math.abs(altDiff) < Math.abs(rawDiff) ? altDiff : rawDiff;
  };

  const getCardPositionClasses = (index: number) => {
    const diff = getCircularDiff(index);

    if (diff === 0) {
      return {
        wrapper:
          "z-30 scale-[1.05] translate-x-0 shadow-2xl ring-2 ring-green-200 bg-white",
        tagText: featuredList[index].tag.text,
      };
    } else if (diff === -1) {
      return {
        wrapper: "z-20 scale-[0.9] -translate-x-10",
        tagText: featuredList[index].tag.text,
      };
    } else if (diff === 1) {
      return {
        wrapper: "z-20 scale-[0.9] translate-x-10",
        tagText: featuredList[index].tag.text,
      };
    } else {
      return {
        wrapper: "z-0 opacity-0 scale-[0.7] translate-x-0 pointer-events-none",
        tagText: featuredList[index].tag.text,
      };
    }
  };

  // map tag text to styled classes — keep content untouched but display with green themed highlight when centered
  const resolvedTagClass = (tagText: string, isCenter: boolean) => {
    if (isCenter) return "px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg bg-green-800 text-white";

    // preserve some original distinct colors for certain tags to keep recognizability
    if (tagText === "Exclusive") return "px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg bg-yellow-500 text-white";
    if (tagText === "Private") return "px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg bg-purple-500 text-white";
    if (tagText === "Hot Deal") return "px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg bg-red-500 text-white";

    // default subtle green-muted tag
    return "px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg bg-green-600 text-white";
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#acd8a7]/20 via-[#acd8a7]/40 to-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-300 to-transparent" />
      <div className="container mx-auto">
        {/* Heading */}
        <div className="mb-12 text-center px-4">
          <h2 className="text-4xl font-bold text-stone-800 mb-3 font-serif">Featured Properties</h2>
          <p className="text-gray-600 text-lg">Curated interiors from Gandhinagar&apos;s finest homes.</p>

          {/* === THE INTERACTIVE EXPANDING LINE (GREEN PALETTE) === */}
          <div
            className="h-1.5 bg-gradient-to-r from-green-600 to-green-700 mx-auto mt-5 rounded-full w-24 hover:w-64 transition-all duration-500 ease-in-out cursor-pointer"
            aria-hidden
          />
        </div>

        <div className="relative">
          {/* Prev */}
          <button
            aria-label="Previous properties"
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-105 transition transform focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next */}
          <button
            aria-label="Next properties"
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-105 transition transform focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel */}
          <div
            ref={listRef}
            className="relative overflow-x-auto overflow-y-visible px-4 md:px-24 lg:px-48 snap-x no-scrollbar"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured properties carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex gap-0 min-w-full py-8 justify-start">
              <div className="flex-none w-[320px] md:w-[350px] opacity-0 pointer-events-none" />

              {featuredList.map((property, index) => {
                const isCenterCard = index === centerIndex;
                const { wrapper: cardWrapperClasses, tagText } = getCardPositionClasses(index);

                return (
                  <div
                    key={property.id}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    className="flex-none w-[320px] md:w-[350px]"
                  >
                    <div
                      className={[
                        "relative rounded-3xl overflow-hidden transform-gpu transition-all duration-500 origin-center h-full",
                        "bg-white border border-gray-100",
                        cardWrapperClasses,
                      ].join(" ")}
                      style={
                        isCenterCard
                          ? ({
                              animation: "liftIn 480ms ease forwards",
                              willChange: "transform, opacity",
                              boxShadow: "0 30px 40px rgba(5,111,94,0.14)",
                            } as React.CSSProperties)
                          : undefined
                      }
                    >
                      <div className="relative group flex-shrink-0 w-full bg-white rounded-3xl shadow-lg overflow-hidden">
                        <div className="relative h-48 overflow-hidden rounded-3xl">
                          <img
                            src={property.image}
                            alt={property.location}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />

                          <div className={resolvedTagClass(tagText, isCenterCard)} style={{ position: 'absolute', top: 12, right: isCenterCard ? 16 : 'auto', left: isCenterCard ? 'auto' : 16 }}>
                            {tagText}
                          </div>

                          <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-2 rounded-lg shadow-md">
                            <span className="text-lg font-bold text-[var(--green-700)]">{property.price}</span>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[var(--green-700)] transition-colors">{property.location}</h3>
                              <p className="text-xs text-gray-500">Gandhinagar · Prime locality</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-[var(--green-700)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              {property.beds} bd
                            </span>

                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-[var(--green-700)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                              </svg>
                              {property.baths} ba
                            </span>

                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-[var(--green-700)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                              {property.sqft} sq ft
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {property.features.map((feature, idx) => (
                              <span key={idx} className="px-3 py-1 bg-green-50 text-[var(--green-700)] text-xs rounded-full font-medium">
                                {feature}
                              </span>
                            ))}
                          </div>

                          <button
                            className={`w-full py-2.5 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-[1.02] ${
                              isCenterCard
                                ? "bg-gradient-to-r from-green-700 to-green-800 text-white"
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

              <div className="flex-none w-[320px] md:w-[350px] opacity-0 pointer-events-none" />
            </div>
          </div>

          {/* Dots */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to property ${idx + 1}: ${featuredList[idx].location}`}
                className={`w-3 h-3 rounded-full transition-all ${
                  centerIndex === idx
                    ? "scale-125 bg-green-700 shadow-md"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --green-700: #056F5E;
        }

        @keyframes liftIn {
          0% {
            transform: translateY(10px) scale(0.985);
            opacity: 0.6;
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
          width: 0;
          height: 0;
        }

        /* subtle glass/outline when centered to give premium look */
        .ring-green-200 {
          box-shadow: 0 10px 30px rgba(5,111,94,0.08), 0 2px 6px rgba(5,111,94,0.06);
        }
      `}</style>
    </section>
  );
};

export default FeaturedProperties;
