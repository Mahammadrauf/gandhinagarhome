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
  const TOTAL_ITEMS = featuredList.length;

  // ---- STATE & CONSTANTS (3D Carousel Logic) ----
  // State tracks the index of the property at the front (center)
  const [activeIndex, setActiveIndex] = useState(0); 
  const autoAdvanceRef = useRef<number | null>(null);

  // Constants for 3D layout
  const ANGLE_PER_ITEM = 360 / TOTAL_ITEMS; // 60 degrees for 6 items
  // This radius determines how far back the rotated cards are pushed.
  // It's a key value for controlling the 'tightness' of the circle.
  const CAROUSEL_RADIUS = 500; 

  // The rotation needed to bring the active index to the front (0 degrees)
  const carouselRotation = activeIndex * -ANGLE_PER_ITEM;

  // ---- HELPERS ----
  const goToItem = (idx: number) => setActiveIndex(idx);
  const prevItem = () => goToItem((activeIndex - 1 + TOTAL_ITEMS) % TOTAL_ITEMS);
  const nextItem = () => goToItem((activeIndex + 1) % TOTAL_ITEMS);

  // ---- EFFECTS ----
  // Auto-advance every TIMER_MS
  useEffect(() => {
    if (autoAdvanceRef.current) window.clearInterval(autoAdvanceRef.current);

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TOTAL_ITEMS);
    }, TIMER_MS);

    autoAdvanceRef.current = id;
    return () => {
      if (autoAdvanceRef.current) window.clearInterval(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TOTAL_ITEMS]);
  
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

        {/* 3D CONTEXT WRAPPER: Establishes perspective and center point */}
        {/* The height needs to be sufficient for the card content. */}
        <div className="relative pt-16 h-[500px] flex justify-center items-center" style={{ perspective: '1200px' }}>

          {/* Left / Right Buttons - positioned relative to the 3D container */}
          <button
            aria-label="Previous properties"
            onClick={prevItem}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-105 transition transform"
          >
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            aria-label="Next properties"
            onClick={nextItem}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-105 transition transform"
          >
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 3D CAROUSEL CONTAINER: Applies rotation */}
          <div
            className="absolute inset-0 m-auto flex justify-center items-center"
            style={{
                width: '100%', 
                height: '100%',
                transformStyle: 'preserve-3d', 
                transform: `rotateY(${carouselRotation}deg)`, 
                transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
            }}
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured properties carousel"
          >
            {featuredList.map((property, index) => {
              const isFront = index === activeIndex;
              const itemAngle = index * ANGLE_PER_ITEM;
              
              const opacity = isFront ? 1 : 0.4;
              const scale = isFront ? 1.05 : 0.85;
              const zIndex = isFront ? 20 : 10; 

              return (
                <div
                  key={`${property.location}-${index}`}
                  onClick={() => goToItem(index)}
                  // Positioning the card absolutely at the center
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-800"
                  style={{
                    transformOrigin: 'center center',
                    // Rotation and translation to place card in the circle
                    transform: `rotateY(${itemAngle}deg) translateZ(${CAROUSEL_RADIUS}px) scale(${scale})`, 
                    opacity: opacity,
                    zIndex: zIndex,
                    // RE-APPLYING YOUR ORIGINAL CARD WIDTHS
                    width: '85%', // default width from your old card
                    maxWidth: '400px', // constrain max width so it fits
                  }}
                >
                  {/* OUTER WRAPPER — keeping original design structure */}
                  <div
                    className={`relative rounded-3xl overflow-hidden transform-gpu transition-all duration-300 shadow-xl bg-white border border-gray-100 ${isFront ? "ring-2 ring-primary/50" : ""}`}
                  >
                    {/* === Card === */}
                    <div className="relative group w-full bg-white rounded-3xl overflow-hidden transition-all duration-300 transform-gpu">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.location}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
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
                    {/* === End card === */}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination dots */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
            {Array.from({ length: TOTAL_ITEMS }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToItem(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-3 h-3 rounded-full transition-transform ${activeIndex === idx ? "scale-110 bg-primary shadow-md" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProperties;