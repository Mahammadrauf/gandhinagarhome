"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const TIMER_MS = 10000; // 10 seconds

const FeaturedProperties = () => {
  // ---- DATA (unchanged) ----
  const allProperties = [
    { image:"https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80", price:"₹2.1 Cr", location:"Sargasan", beds:4, baths:4, sqft:"3,000", features:["Vaastu-friendly","2 Car Parks"], tag:{ text:"New", color:"bg-primary text-white" } },
    { image:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", price:"₹1.65 Cr", location:"Kudasan", beds:3, baths:3, sqft:"1,950", features:["Club Access","High Floor"], tag:{ text:"Exclusive", color:"bg-yellow-500 text-white" } },
    { image:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", price:"₹2.45 Cr", location:"Randesan", beds:3, baths:3, sqft:"2,250", features:["Garden View","Modular Kitchen"], tag:{ text:"Open House", color:"bg-gray-200 text-gray-800" } },
    { image:"https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", price:"₹3.10 Cr", location:"Sector 21", beds:4, baths:4, sqft:"3,500", features:["Private Pool","Premium Location"], tag:{ text:"Private", color:"bg-purple-500 text-white" } },
    { image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", price:"₹1.85 Cr", location:"Sector 16", beds:3, baths:2, sqft:"2,100", features:["City View","Ready to Move"], tag:{ text:"Hot Deal", color:"bg-red-500 text-white" } },
    { image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", price:"₹2.75 Cr", location:"Sector 7", beds:4, baths:3, sqft:"2,800", features:["Corner Plot","Premium Finishes"], tag:{ text:"Premium", color:"bg-primary text-white" } },
  ];
  const featuredList = useMemo(() => allProperties.slice(0, 6), []);

  // ---- STATE & REFS ----
  const [groupIndex, setGroupIndex] = useState(0); // 0 or 1
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoAdvanceRef = useRef<number | null>(null);

  // derive how many groups (3 cards per group)
  const GROUP_SIZE = 3;
  const groupsCount = Math.ceil(featuredList.length / GROUP_SIZE);

  // ---- HELPERS ----
  const scrollToActive = (idx: number) => {
    const startIdx = idx * GROUP_SIZE;
    const container = listRef.current;
    const target = itemRefs.current[startIdx];
    if (container && target) {
      const left = target.offsetLeft - 16; // little padding offset
      container.scrollTo({ left, behavior: "smooth" });
    }
  };

  const goToGroup = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, groupsCount - 1));
    setGroupIndex(clamped);
    scrollToActive(clamped);
  };

  const prevGroup = () => goToGroup(groupIndex - 1);
  const nextGroup = () => goToGroup(groupIndex + 1);

  // ---- EFFECTS ----
  // Auto-advance every TIMER_MS
  useEffect(() => {
    // clear existing
    if (autoAdvanceRef.current) window.clearInterval(autoAdvanceRef.current);

    const id = window.setInterval(() => {
      setGroupIndex((prev) => {
        const next = prev + 1 >= groupsCount ? 0 : prev + 1;
        // scroll after state updates
        queueMicrotask(() => scrollToActive(next));
        return next;
      });
    }, TIMER_MS);

    autoAdvanceRef.current = id;
    return () => {
      if (autoAdvanceRef.current) window.clearInterval(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupsCount]);

  // Keep alignment on resize
  useEffect(() => {
    const onResize = () => scrollToActive(groupIndex);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIndex]);

  // ---- RENDER ----
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto">
        <div className="mb-12 text-center px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Featured Properties</h2>
          <p className="text-gray-600 text-lg">Curated interiors from Gandhinagar&apos;s finest homes.</p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary-light mx-auto mt-4 rounded-full" />
        </div>

        {/* WRAPPER: hide native scrollbar but keep scrollable behavior */}
        <div className="relative">

          {/* Left / Right Buttons */}
          {/* Prev: only render when not first group */}
          {groupIndex > 0 && (
            <button
              aria-label="Previous properties"
              onClick={prevGroup}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-105 transition transform"
            >
              <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <button
            aria-label="Next properties"
            onClick={nextGroup}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-105 transition transform"
          >
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scrollable list - scrollbar visually hidden via CSS classes below */}
          <div
            ref={listRef}
            className="relative overflow-x-auto overflow-y-visible px-4 sm:px-6 lg:px-4 snap-x snap-mandatory no-scrollbar"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured properties carousel"
          >
            <div className="flex gap-6 min-w-full py-8">
              {featuredList.map((property, index) => {
                const isActive =
                  (groupIndex === 0 && index < GROUP_SIZE) || (groupIndex === 1 && index >= GROUP_SIZE);
                const positionInGroup = index % GROUP_SIZE;

                return (
                  <div
                    key={`${property.location}-${index}`}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    className="snap-start flex-none w-[85%] sm:w-[70%] md:w-[48%] lg:w-[32%]"
                  >
                    {/* OUTER WRAPPER — unified radius + clipping to prevent sharp corners */}
                    <div
                      className={[
                        "relative rounded-3xl overflow-hidden transform-gpu transition-all duration-500",
                        isActive
                          ? "z-10 -translate-y-2 scale-[1.01] shadow-2xl ring-1 ring-gray-200 bg-white"
                          : "z-0 opacity-90 scale-[0.99] bg-white",
                      ].join(" ")}
                      style={
                        isActive
                          ? ({
                              animation: "liftIn 480ms ease forwards",
                              animationDelay: `${100 * positionInGroup}ms`,
                              willChange: "transform, opacity",
                            } as React.CSSProperties)
                          : undefined
                      }
                    >
                      {/* === Card === */}
                      <div className="relative group flex-shrink-0 w-full bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 transform-gpu border border-gray-100 hover:shadow-2xl hover:-translate-y-2">
                        <div className="relative h-48 overflow-hidden rounded-3xl">
                          <img
                            src={property.image}
                            alt={property.location}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${property.tag.color}`}>
                            {property.tag.text}
                          </div>
                          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
                            <span className="text-lg font-bold text-primary">{property.price}</span>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                {property.location}
                              </h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              {property.beds} bd
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                              </svg>
                              {property.baths} ba
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
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
                          <button className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-2.5 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105">
                            View Details
                          </button>
                        </div>
                      </div>
                      {/* === End card === */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {Array.from({ length: groupsCount }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToGroup(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-3 h-3 rounded-full transition-transform ${groupIndex === idx ? "scale-110 bg-primary shadow-md" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes liftIn {
          0% { transform: translateY(10px) scale(0.985); opacity: 0.6; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        /* Hide scrollbar but keep scroll functionality */
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
          width: 0;
          height: 0;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProperties;
