"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";

/** ================= Types ================= */
type Tier = "exclusive" | "featured" | "standard";
type CategoryKey = "1bhk" | "2bhk" | "3bhk" | "4bhk" | "5bhk" | "bungalow" | "plot";

type Property = {
  id: string | number;
  title?: string;
  image: string; // Image is used in this version
  price: string;
  location: string;
  beds?: number;
  baths: number;
  sqft: string;
  features: string[];
  tag?: { text: string; color: string };
  tier?: string;
  category?: string;
};

/** ================= Helpers ================= */
const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "1bhk", label: "1 BHK" },
  { key: "2bhk", label: "2 BHK" },
  { key: "3bhk", label: "3 BHK" },
  { key: "4bhk", label: "4 BHK" },
  { key: "5bhk", label: "5 BHK" },
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

const resolveCategory = (p: Property): CategoryKey | null => {
  const validCategories: CategoryKey[] = ["1bhk", "2bhk", "3bhk", "4bhk", "5bhk", "bungalow", "plot"];
  if (p.category && validCategories.includes(p.category as CategoryKey))
    return p.category as CategoryKey;
  if (p.beds === 1) return "1bhk";
  if (p.beds === 2) return "2bhk";
  if (p.beds === 3) return "3bhk";
  if (p.beds === 4) return "4bhk";
  if (p.beds === 5) return "5bhk";
  return null;
};


/** ================= Small UI Bits ================= */
// --- This is the Pills component for filtering ---
const Pills: React.FC<{
  items: { key: CategoryKey; label: string; count: number }[];
  active: CategoryKey;
  onChange: (key: CategoryKey) => void;
}> = ({ items, active, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 sm:px-6 lg:px-4">
      {items.map((it) => {
        // Don't render a pill if there are 0 items in that category
        if (it.count === 0) return null;

        const isActive = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={[
              // Styling for the pills, matching your image
              "px-5 py-3 rounded-full text-base font-semibold transition-all duration-200 ease-in-out",
              isActive
                ? "bg-[#0b6b53] text-white shadow-lg" // Active state (green)
                : "bg-gray-100 text-gray-800 hover:bg-gray-200", // Inactive state
            ].join(" ")}
            aria-pressed={isActive}
          >
            {it.label}
            <span className={["ml-2.5 text-sm",
              isActive ? "text-white/80" : "text-gray-500"].join(" ")}>
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

  // Scrolls to the start when the category changes (children update)
  useEffect(() => {
    listRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [children]);

  return (
    <div
      ref={listRef}
      className="relative overflow-x-auto overflow-y-visible px-4 sm:px-6 lg:px-4 snap-x snap-mandatory
                 
                 [-ms-overflow-style:none] /* IE and Edge */
                 [scrollbar-width:none]    /* Firefox */
                 [&::-webkit-scrollbar]:hidden /* Webkit (Chrome, Safari) */"
    >
      <div className="flex gap-4 min-w-full py-6">{children}</div>
    </div>
  );
};

// --- This is the Property Card with the IMAGE ---
const PropertyCard: React.FC<{ p: Property }> = ({ p }) => {
  const locationCap = p.location.charAt(0).toUpperCase() + p.location.slice(1);
  const title = p.title ??
    (p.beds ? `${p.beds}BHK for sale in ${locationCap}` :
    (p.category ? `${p.category.charAt(0).toUpperCase() + p.category.slice(1)} for sale in ${locationCap}` :
    `Property in ${locationCap}`));

  return (
  <div className="snap-start flex-none w-[80%] sm:w-[60%] md:w-[45%] lg:w-[24%]">
    <a
      href={`/property/${p.id}`} // Example link
      className="block rounded-2xl overflow-hidden bg-white shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={p.image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackImg;
          }}
        />
      </div>

      {/* Body */}
      <div className="p-4 text-center">
        <h3 className="text-base font-semibold text-primary group-hover:text-primary-dark transition-colors">
          {title}
        </h3>
      </div>
    </a>
  </div>
  );
};

/** ================= Main Component ================= */
const ExploreListing: React.FC<{ properties: Property[] }> = ({ properties }) => {

  // --- This logic creates the "buckets" for each category ---
  const buckets = useMemo(() => {
    const dict: Record<CategoryKey, Property[]> = {
      "1bhk": [],
      "2bhk": [],
      "3bhk": [],
      "4bhk": [],
      "5bhk": [],
      "bungalow": [],
      "plot": [],
    };

    for (const p of properties) {
      const cat = resolveCategory(p);
      if (!cat) continue;
      dict[cat].push(p);
    }

    // Sorter function: ensures exclusive/featured are first
    const sorter = (a: Property, b: Property) => {
      const getWeight = (t?: string): number =>
        tierWeight[(t as Tier) ?? "standard"] ?? tierWeight["standard"];
      return getWeight(a.tier) - getWeight(b.tier);
    };

    // Sort each bucket individually
    (Object.keys(dict) as CategoryKey[]).forEach((key) => {
      dict[key].sort(sorter);
    });

    const counts: Record<CategoryKey, number> = {
      "1bhk": dict["1bhk"].length,
      "2bhk": dict["2bhk"].length,
      "3bhk": dict["3bhk"].length,
      "4bhk": dict["4bhk"].length,
      "5bhk": dict["5bhk"].length,
      "bungalow": dict["bungalow"].length,
      "plot": dict["plot"].length,
    };

    return { dict, counts };
  }, [properties]);

  // --- This state tracks which pill is active ---
  const [active, setActive] = useState<CategoryKey>(() => {
    // default to first category that has data, else "1bhk"
    const firstWithData = CATEGORIES.find((c) => buckets.counts[c.key] > 0)?.key;
    return firstWithData ?? "1bhk";
  });

  // This makes sure we never have an empty category selected
  useEffect(() => {
    if (buckets.counts[active] === 0) {
      const fallback = CATEGORIES.find((c) => buckets.counts[c.key] > 0)?.key ?? "1bhk";
      if (fallback !== active) setActive(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buckets, active]);

  // Get the list of properties for the *active* category
  const list = buckets.dict[active];

  const RightCTA = (
    <a
      href="/listings"
      className="inline-flex items-center gap-2 text-gray-800 hover:text-primary font-semibold text-base"
    >
      All Types
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h15" />
      </svg>
    </a>
  );

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        
{/* Header */}
<div className="px-4 sm:px-6 lg:px-4 text-center">
  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
    Explore Listing
  </h2>

  {/* green underline like the image */}
  <div className="mt-3 w-16 h-1.5 bg-[#0b6b53] mx-auto rounded-full" />
  
  {/* */}
  <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
    Find your dream home from our exclusive collection of properties.
  </p>

</div>



        {/* --- Renders the filter pills --- */}
        {/* <Pills
          items={CATEGORIES.map((c) => ({
            key: c.key,
            label: c.label,
            count: buckets.counts[c.key],
          }))}
          active={active}
          onChange={setActive}
        /> */}

        {/* --- Renders the property cards for the active category --- */}
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