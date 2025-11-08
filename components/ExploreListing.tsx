"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";

/** ================= Types ================= */
type Tier = "exclusive" | "featured" | "standard";
type CategoryKey = "2bhk" | "3bhk" | "4bhk" | "bungalow" | "plot";

type Property = {
  id: string | number;
  title?: string;
  image: string;
  price: string;
  location: string;
  beds?: 1 | 2 | 3 | 4 | 5;      // optional: derive category from beds if not set
  baths: number;
  sqft: string;
  features: string[];
  tag?: { text: string; color: string };
  tier?: Tier;                   // exclusive | featured | standard
  category?: CategoryKey;        // optional direct category
};

/** ================= Helpers ================= */
const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "2bhk", label: "2 BHK" },
  { key: "3bhk", label: "3 BHK" },
  { key: "4bhk", label: "4 BHK" },
  { key: "bungalow", label: "Bungalow" },
  { key: "plot", label: "Plot" },
];

const tierWeight: Record<Tier, number> = {
  exclusive: 0,
  featured: 1,
  standard: 2,
};

const fallbackImg =
  "https://images.unsplash.com/photo-1600585154206-3cba1f1b9d1a?auto=format&fit=crop&w=1200&q=80";

// Normalize a property's category
const resolveCategory = (p: Property): CategoryKey | null => {
  if (p.category) return p.category;
  if (p.beds === 2) return "2bhk";
  if (p.beds === 3) return "3bhk";
  if (p.beds === 4) return "4bhk";
  return null; // if no beds/category set, skip unless explicitly "bungalow"/"plot"
};

/** ================= Small UI Bits ================= */
const Pills: React.FC<{
  items: { key: CategoryKey; label: string; count: number }[];
  active: CategoryKey;
  onChange: (key: CategoryKey) => void;
}> = ({ items, active, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6 lg:px-4">
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={[
              "px-4 py-2 rounded-full text-sm font-semibold transition-all",
              isActive
                ? "bg-primary text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            ].join(" ")}
            aria-pressed={isActive}
          >
            {it.label}
            <span className={["ml-2 text-xs",
              isActive ? "text-white/90" : "text-gray-500"].join(" ")}>
              {it.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const HorizontalList: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    listRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [children]);
  return (
    <div
      ref={listRef}
      className="relative overflow-x-auto overflow-y-visible px-4 sm:px-6 lg:px-4 snap-x snap-mandatory
                 [-ms-overflow-style:auto] [scrollbar-width:auto]"
    >
      <div className="flex gap-6 min-w-full py-6">{children}</div>
    </div>
  );
};

const PropertyCard: React.FC<{ p: Property }> = ({ p }) => (
  <div className="snap-start flex-none w-[85%] sm:w-[70%] md:w-[48%] lg:w-[32%]">
    <div className="relative rounded-3xl overflow-hidden bg-white shadow-lg ring-1 ring-gray-100 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Image */}
      <div className="relative h-56 sm:h-60 overflow-hidden rounded-3xl bg-gray-100">
        <img
          src={p.image}
          alt={p.location}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackImg;
          }}
        />
        {p.tag && (
          <div
            className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${p.tag.color}`}
          >
            {p.tag.text}
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
          <span className="text-lg font-bold text-primary">{p.price}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {p.title ?? `${p.beds ? `${p.beds}BHK ` : ""}for sale in ${p.location}`}
        </h3>
        <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
          {typeof p.beds !== "undefined" && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {p.beds} bd
            </span>
          )}
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            {p.baths} ba
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {p.sqft} sq ft
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {p.features.map((f, i) => (
            <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
              {f}
            </span>
          ))}
        </div>
        <button className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-2.5 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105">
          View Details
        </button>
      </div>
    </div>
  </div>
);

/** ================= Main Component ================= */
const ExploreListing: React.FC<{ properties: Property[] }> = ({ properties }) => {
  // Build category buckets + counts + sort by tier inside each bucket
  const buckets = useMemo(() => {
    const dict: Record<CategoryKey, Property[]> = {
      "2bhk": [],
      "3bhk": [],
      "4bhk": [],
      "bungalow": [],
      "plot": [],
    };

    for (const p of properties) {
      const cat = p.category ?? resolveCategory(p);
      if (!cat) continue; // skip if cannot resolve
      dict[cat].push(p);
    }

    const sorter = (a: Property, b: Property) =>
      tierWeight[a.tier ?? "standard"] - tierWeight[b.tier ?? "standard"];

    (Object.keys(dict) as CategoryKey[]).forEach((k) => dict[k].sort(sorter));

    const counts: Record<CategoryKey, number> = {
      "2bhk": dict["2bhk"].length,
      "3bhk": dict["3bhk"].length,
      "4bhk": dict["4bhk"].length,
      "bungalow": dict["bungalow"].length,
      "plot": dict["plot"].length,
    };

    return { dict, counts };
  }, [properties]);

  const [active, setActive] = useState<CategoryKey>(() => {
    // default to first category that has data, else "2bhk"
    const firstWithData = CATEGORIES.find((c) => buckets.counts[c.key] > 0)?.key;
    return firstWithData ?? "2bhk";
  });

  // Ensure active tab always points to a non-empty bucket if possible
  useEffect(() => {
    if (buckets.counts[active] === 0) {
      const fallback = CATEGORIES.find((c) => buckets.counts[c.key] > 0)?.key ?? "2bhk";
      if (fallback !== active) setActive(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buckets]);

  const list = buckets.dict[active];

  const RightCTA = (
    <a
      href="/listings"
      className="hidden sm:inline-flex items-center gap-2 text-gray-800 hover:text-primary font-semibold"
    >
      All Types
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-6 px-4 sm:px-6 lg:px-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Explore Listing</h2>
            <p className="text-gray-600 mt-2">Discover exceptional residential spaces</p>
          </div>
          {RightCTA}
        </div>

        {/* Category Pills */}
        <Pills
          items={CATEGORIES.map((c) => ({
            key: c.key,
            label: c.label,
            count: buckets.counts[c.key],
          }))}
          active={active}
          onChange={setActive}
        />

        {/* Cards for active category */}
        <div className="mt-4">
          {list.length > 0 ? (
            <HorizontalList>
              {list.map((p) => (
                <PropertyCard key={p.id} p={p} />
              ))}
            </HorizontalList>
          ) : (
            <div className="px-4 sm:px-6 lg:px-4 py-12 text-gray-600">
              No properties found in <span className="font-semibold">{CATEGORIES.find(c => c.key === active)?.label}</span>.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExploreListing;
