"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const TIMER_MS = 2000; // 5 seconds

const ExclusiveProperty = () => {
  // ---- DATA: This is now the 6-property list ----
  const allProperties = [
    { id: "f1", image:"https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80", price:"₹2.1 Cr", location:"Sargasan", beds:4, baths:4, sqft:"3,000", features:["Vaastu-friendly","2 Car Parks"], tag:{ text:"New", color:"bg-primary text-white" } },
    { id: "f2", image:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", price:"₹1.65 Cr", location:"Kudasan", beds:3, baths:3, sqft:"1,950", features:["Club Access","High Floor"], tag:{ text:"Exclusive", color:"bg-yellow-500 text-white" } },
    { id: "f3", image:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", price:"₹2.45 Cr", location:"Randesan", beds:3, baths:3, sqft:"2,250", features:["Garden View","Modular Kitchen"], tag:{ text:"Open House", color:"bg-gray-200 text-gray-800" } },
    { id: "f4", image:"https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", price:"₹3.10 Cr", location:"Sector 21", beds:4, baths:4, sqft:"3,500", features:["Private Pool","Premium Location"], tag:{ text:"Private", color:"bg-purple-500 text-white" } },
    { id: "f5", image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", price:"₹1.85 Cr", location:"Sector 16", beds:3, baths:2, sqft:"2,100", features:["City View","Ready to Move"], tag:{ text:"Hot Deal", color:"bg-red-500 text-white" } },
    { id: "f6", image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", price:"₹2.75 Cr", location:"Sector 7", beds:4, baths:3, sqft:"2,800", features:["Corner Plot","Premium Finishes"], tag:{ text:"Premium", color:"bg-primary text-white" } },
  ];

  const exclusiveList = useMemo(() => allProperties, []);

  const [centerIndex, setCenterIndex] = useState(1); // Start at index 1
  const [isHovered, setIsHovered] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoAdvanceRef = useRef<number | null>(null);

  const totalSlides = exclusiveList.length;

  const scrollToActive = (idx: number) => {
    const container = listRef.current;
    const target = itemRefs.current[idx];
    
    if (container && target) {
      const targetOffsetLeft = target.offsetLeft;
      const offset =
        targetOffsetLeft -
        container.offsetWidth / 2 +
        target.offsetWidth / 2;

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
    const altDiff =
      rawDiff > 0 ? rawDiff - totalSlides : rawDiff + totalSlides;
    return Math.abs(altDiff) < Math.abs(rawDiff) ? altDiff : rawDiff;
  };

  // ⭐ Updated: side cards no longer low opacity (no "blur" feel)
  const getCardPositionClasses = (index: number) => {
    const diff = getCircularDiff(index);

    if (diff === 0) {
      return {
        wrapper:
          "z-30 scale-[1.05] translate-x-0 shadow-2xl ring-2 ring-primary/50 bg-white",
        tagText: exclusiveList[index].tag.text,
      };
    } else if (diff === -1) {
      return {
        // removed opacity-30, slightly smaller only
        wrapper: "z-20 scale-[0.9] -translate-x-10",
        tagText: exclusiveList[index].tag.text,
      };
    } else if (diff === 1) {
      return {
        // removed opacity-30, slightly smaller only
        wrapper: "z-20 scale-[0.9] translate-x-10",
        tagText: exclusiveList[index].tag.text,
      };
    } else {
      return {
        wrapper:
          "z-0 opacity-0 scale-[0.7] translate-x-0 pointer-events-none",
        tagText: exclusiveList[index].tag.text,
      };
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto">
        <div className="mb-12 text-center px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Exclusive Properties
          </h2>
          <p className="text-gray-600 text-lg">
            Curated interiors from Gandhinagar&apos;s finest homes.
          </p>
          
          {/* === THE INTERACTIVE LINE === */}
          <div 
            className="h-1.5 bg-[#056F5E] mx-auto mt-5 rounded-full w-24 hover:w-64 transition-all duration-500 ease-in-out cursor-pointer" 
          />
          
        </div>

        <div className="relative">
          <button
            aria-label="Previous properties"
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-105 transition transform focus:outline-none focus:ring-2 focus:ring-primary/60"
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
            aria-label="Next properties"
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-105 transition transform focus:outline-none focus:ring-2 focus:ring-primary/60"
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

          <div
            ref={listRef}
            className="relative overflow-x-auto overflow-y-visible px-4 md:px-24 lg:px-48 snap-x no-scrollbar"
            role="region"
            aria-roledescription="carousel"
            aria-label="Exclusive properties carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex gap-0 min-w-full py-8 justify-start">
              {/* Ghost spacer for centering first card. */}
              <div
                className="flex-none w-[320px] md:w-[350px] opacity-0 pointer-events-none"
                aria-hidden="true"
              />
              
              {exclusiveList.map((property, index) => {
                const isCenterCard = index === centerIndex;
                const { wrapper: cardWrapperClasses, tagText } =
                  getCardPositionClasses(index);

                return (
                  <div
                    key={`${property.location}-${index}`}
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
                          {/* ⭐ Removed backdrop-blur-sm from tag */}
                          <div
                            className={`absolute top-4 ${
                              isCenterCard ? "right-4" : "left-4"
                            } px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg ${property.tag.color}`}
                          >
                            {tagText}
                          </div>
                          {/* ⭐ Removed backdrop-blur-sm from price chip */}
                          <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-2 rounded-lg shadow-md">
                            <span className="text-lg font-bold text-primary">
                              {property.price}
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                {property.location}
                              </h3>
                              <p className="text-xs text-gray-500">
                                Gandhinagar · Prime locality
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                              </svg>
                              {property.beds} bd
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                              </svg>
                              {property.baths} ba
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                              </svg>
                              {property.sqft} sq ft
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {property.features.map((feature, idx) => (
                              <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                {feature}
                              </span>
                            ))}
                          </div>
                          <button
                            className={`w-full py-2.5 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-[1.02] ${
                              isCenterCard
                                ? "bg-gradient-to-r from-primary to-primary-dark text-white"
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
              
              {/* Ghost spacer for centering last card. */}
              <div
                className="flex-none w-[320px] md:w-[350px] opacity-0 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to property ${idx + 1}: ${exclusiveList[idx].location}`}
                className={`w-3 h-3 rounded-full transition-all ${
                  centerIndex === idx
                    ? "scale-125 bg-primary shadow-md"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
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
      `}</style>
    </section>
  );
};

export default ExclusiveProperty;