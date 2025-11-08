"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/** ========= Types ========= */
type Property = {
  image: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  features: string[];
  tag: { text: string; color: string };
};

type PropertySectionProps = {
  title: string;
  subTitle?: string;
  properties: Property[];
  timerMs?: number; // default 10000
};

/** ========= Utils ========= */
const chunkInto = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

/** ========= Generic Property Section (no circular control) ========= */
const PropertySection: React.FC<PropertySectionProps> = ({
  title,
  subTitle = "Curated interiors from Gandhinagar's finest homes.",
  properties,
  timerMs = 10000,
}) => {
  const groups = useMemo(() => chunkInto(properties, 3), [properties]);
  const groupCount = groups.length;

  const [groupIndex, setGroupIndex] = useState(0);

  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-advance every timerMs
  useEffect(() => {
    if (groupCount <= 1) return;
    const id = setInterval(() => {
      setGroupIndex((prev) => (prev + 1) % groupCount);
    }, timerMs);
    return () => clearInterval(id);
  }, [groupCount, timerMs]);

  const scrollToActive = (idx: number) => {
    const startIdx = idx * 3;
    const container = listRef.current;
    const target = itemRefs.current[startIdx];
    if (container && target) {
      const left = target.offsetLeft - 16;
      container.scrollTo({ left, behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToActive(groupIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIndex]);

  useEffect(() => {
    const onResize = () => scrollToActive(groupIndex);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIndex]);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto">
        <div className="mb-12 text-center px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">{title}</h2>
          <p className="text-gray-600 text-lg">{subTitle}</p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary-light mx-auto mt-4 rounded-full" />
        </div>

        {/* Native horizontal scrollbar kept */}
        <div
          ref={listRef}
          className="relative overflow-x-auto overflow-y-visible px-4 sm:px-6 lg:px-4 snap-x snap-mandatory
                     [-ms-overflow-style:auto] [scrollbar-width:auto]"
        >
          <div className="flex gap-6 min-w-full py-8">
            {properties.map((property, index) => {
              const activeStart = groupIndex * 3;
              const isActive = index >= activeStart && index < activeStart + 3;
              const positionInGroup = index % 3;

              return (
                <div
                  key={`${property.location}-${index}`}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className="snap-start flex-none w-[85%] sm:w-[70%] md:w-[48%] lg:w-[32%]"
                >
                  {/* OUTER WRAPPER — unify radius + clip */}
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
                      {/* Image with fallback */}
                      <div className="relative h-56 sm:h-60 overflow-hidden rounded-3xl bg-gray-100">
                        <img
                          src={property.image}
                          alt={property.location}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1600585154206-3cba1f1b9d1a?auto=format&fit=crop&w=1200&q=80";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div
                          className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${property.tag.color}`}
                        >
                          {property.tag.text}
                        </div>
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
                          <span className="text-lg font-bold text-primary">{property.price}</span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
                            {property.location}
                          </h3>
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
      </div>

      {/* Animation */}
      <style jsx global>{`
        @keyframes liftIn {
          0% { transform: translateY(10px) scale(0.985); opacity: 0.6; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
};

/** ========= Exclusive Property (12 items) ========= */
const ExclusiveProperty: React.FC = () => {
  const properties: Property[] = [
    { image: "https://images.unsplash.com/photo-1505692952047-1a78307da8e8?auto=format&fit=crop&w=1200&q=80", price: "₹3.40 Cr", location: "Sector 5", beds: 4, baths: 4, sqft: "3,200", features: ["Penthouse", "Terrace Garden"], tag: { text: "Premium", color: "bg-primary text-white" } },
    { image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80", price: "₹1.90 Cr", location: "Koba", beds: 3, baths: 3, sqft: "2,050", features: ["Club Access", "Corner Unit"], tag: { text: "Exclusive", color: "bg-yellow-500 text-white" } },
    { image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?auto=format&fit=crop&w=1200&q=80", price: "₹2.80 Cr", location: "Torda", beds: 4, baths: 3, sqft: "2,850", features: ["Garden View", "Home Office"], tag: { text: "New", color: "bg-primary text-white" } },
    { image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80", price: "₹3.60 Cr", location: "Gift City", beds: 4, baths: 4, sqft: "3,450", features: ["Riverfront", "High Floor"], tag: { text: "Private", color: "bg-purple-500 text-white" } },
    { image: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=80", price: "₹2.10 Cr", location: "Kh Road", beds: 3, baths: 3, sqft: "2,200", features: ["Ready to Move", "2 Car Parks"], tag: { text: "Hot Deal", color: "bg-red-500 text-white" } },
    { image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80", price: "₹2.95 Cr", location: "Chiloda", beds: 4, baths: 3, sqft: "2,900", features: ["Corner Plot", "Smart Home"], tag: { text: "Premium", color: "bg-primary text-white" } },
    { image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80", price: "₹2.25 Cr", location: "Adalaj", beds: 3, baths: 3, sqft: "2,300", features: ["Club Access", "Park Facing"], tag: { text: "Open House", color: "bg-gray-200 text-gray-800" } },
    { image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80", price: "₹3.05 Cr", location: "Sargasan Ext.", beds: 4, baths: 4, sqft: "3,050", features: ["Premium Finishes", "Servant Room"], tag: { text: "Exclusive", color: "bg-yellow-500 text-white" } },
    { image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80", price: "₹1.99 Cr", location: "Randesan", beds: 3, baths: 3, sqft: "2,120", features: ["Modular Kitchen", "City View"], tag: { text: "New", color: "bg-primary text-white" } },
    { image: "https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=1200&q=80", price: "₹2.70 Cr", location: "Kudasan Ext.", beds: 4, baths: 3, sqft: "2,780", features: ["Corner Unit", "Premium Location"], tag: { text: "Premium", color: "bg-primary text-white" } },
    { image: "https://images.unsplash.com/photo-1489365091240-6a18fc761ec2?auto=format&fit=crop&w=1200&q=80", price: "₹2.35 Cr", location: "Sector 25", beds: 3, baths: 3, sqft: "2,380", features: ["Green Belt", "High Floor"], tag: { text: "Open House", color: "bg-gray-200 text-gray-800" } },
    { image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", price: "₹3.25 Cr", location: "Sector 10", beds: 4, baths: 4, sqft: "3,120", features: ["Terrace Deck", "2 Car Parks"], tag: { text: "Private", color: "bg-purple-500 text-white" } },
  ];

  return (
    <PropertySection
      title="Exclusive Properties"
      properties={properties}
      timerMs={10000}
    />
  );
};

export default ExclusiveProperty;
