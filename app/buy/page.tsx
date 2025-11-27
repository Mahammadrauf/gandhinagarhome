"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { MapPin, Clock, Car, Calendar, Map as MapIcon, ShieldCheck, User } from "lucide-react";

// --- TYPES ---
type Tier = "exclusive" | "featured" | "regular";
type PropertyType = "Apartment" | "Villa" | "Bungalow" | "Plot";
type Possession = "Ready to move" | "Immediate" | "After 1 Month";
type PriceRangeValue = "any" | "0-1.5" | "1.5-2" | "2-2.5" | "2.5+";

type SortOption = 
  | "PriceLowHigh" 
  | "PriceHighLow" 
  | "SizeLowHigh"
  | "SizeHighLow" 
  | "Oldest" 
  | "Newest";

interface Listing {
  id: number;
  tier: Tier;
  source: "owner" | "partner"; // owner = Owner, partner = Agent
  title: string;
  locality: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  type: PropertyType;
  furnishing: "Unfurnished" | "Semi-furnished" | "Fully furnished";
  readyStatus: Possession;
  parking: number;
  ageLabel: string;
  priceCr: number;
  priceLabel: string;
  media: string;
  phoneMasked: string;
  image: string;
  tags: string[];
  amenities: string[];
}

interface Filters {
  location: string;
  propertyType: "any" | PropertyType;
  priceRange: PriceRangeValue;
  possession: "any" | Possession;
  listedBy: "any" | "owner" | "partner"; 
  minBedrooms: number;
  minBathrooms: number;
  furnishing: "any" | Listing["furnishing"];
  minParking: number;
  amenities: string[];
  priceMin: string;
  priceMax: string;
  sizeMin: string;
  sizeMax: string;
}

// --- DATA ---
const listings: Listing[] = [
  {
    id: 6,
    tier: "exclusive",
    source: "owner", 
    title: "Raysan Luxury Villa • Corner Plot",
    locality: "Raysan",
    city: "Gandhinagar",
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 3400,
    type: "Villa",
    furnishing: "Fully furnished",
    readyStatus: "Ready to move",
    parking: 2,
    ageLabel: "5–10 years",
    priceCr: 3.1,
    priceLabel: "₹3.10 Cr",
    media: "8 photos • Video • Floor plan",
    phoneMasked: "+91 8XXX-XXX000",
    image:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Vaastu friendly", "Smart home", "Private garden"],
    amenities: ["Garden", "Security", "Parking"],
  },
  {
    id: 5,
    tier: "exclusive",
    source: "partner",
    title: "Sargasan Bungalow • Private Terrace",
    locality: "Sargasan",
    city: "Gandhinagar",
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 3000,
    type: "Bungalow",
    furnishing: "Semi-furnished",
    readyStatus: "After 1 Month",
    parking: 2,
    ageLabel: "10+ years",
    priceCr: 2.4,
    priceLabel: "₹2.40 Cr",
    media: "7 photos • No video",
    phoneMasked: "+91 9XXX-XXX000",
    image:
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Terrace", "Corner unit", "Modular kitchen"],
    amenities: ["Terrace", "Parking", "Garden"],
  },
  {
    id: 4,
    tier: "featured",
    source: "partner",
    title: "Kudasan High-Rise • Club Access",
    locality: "Kudasan",
    city: "Gandhinagar",
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1950,
    type: "Apartment",
    furnishing: "Semi-furnished",
    readyStatus: "Immediate",
    parking: 1,
    ageLabel: "<5 years",
    priceCr: 1.65,
    priceLabel: "₹1.65 Cr",
    media: "9 photos • Video",
    phoneMasked: "+91 7XXX-XXX000",
    image:
      "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Club house", "Gym", "City view"],
    amenities: ["Gym", "Club house", "Lift", "Security"],
  },
  {
    id: 3,
    tier: "regular",
    source: "owner",
    title: "Sector 21 Apartment • Park Facing",
    locality: "Sector 21",
    city: "Gandhinagar",
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1250,
    type: "Apartment",
    furnishing: "Unfurnished",
    readyStatus: "Ready to move",
    parking: 1,
    ageLabel: "5–10 years",
    priceCr: 1.25,
    priceLabel: "₹1.25 Cr",
    media: "5 photos • No video",
    phoneMasked: "+91 9XXX-XXX000",
    image:
      "https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Renovated", "Park view"],
    amenities: ["Park view", "Lift"],
  },
  {
    id: 2,
    tier: "regular",
    source: "partner",
    title: "Kudasan Cozy 3BHK • Renovated",
    locality: "Kudasan",
    city: "Gandhinagar",
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1800,
    type: "Apartment",
    furnishing: "Semi-furnished",
    readyStatus: "Immediate",
    parking: 1,
    ageLabel: "1–5 years",
    priceCr: 1.55,
    priceLabel: "₹1.55 Cr",
    media: "6 photos • Video",
    phoneMasked: "+91 9XXX-XXX000",
    image:
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["South facing", "Lift"],
    amenities: ["Lift", "Security"],
  },
  {
    id: 1,
    tier: "regular",
    source: "owner",
    title: "Randesan Premium 3BHK • Garden View",
    locality: "Randesan",
    city: "Gandhinagar",
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 2250,
    type: "Apartment",
    furnishing: "Fully furnished",
    readyStatus: "Ready to move",
    parking: 2,
    ageLabel: "5–10 years",
    priceCr: 2.1,
    priceLabel: "₹2.10 Cr",
    media: "8 photos • Video",
    phoneMasked: "+91 9XXX-XXX000",
    image:
      "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Modular kitchen", "Garden"],
    amenities: ["Garden", "Lift"],
  },
];

const initialFilters: Filters = {
  location: "",
  propertyType: "any",
  priceRange: "any",
  possession: "any",
  listedBy: "any", 
  minBedrooms: 0,
  minBathrooms: 0,
  furnishing: "any",
  minParking: 0,
  amenities: [],
  priceMin: "",
  priceMax: "",
  sizeMin: "",
  sizeMax: "",
};

// --- HELPER: Tier Ranking ---
const getTierWeight = (tier: Tier) => {
  if (tier === "exclusive") return 3;
  if (tier === "featured") return 2;
  return 1; // regular
};

// --- MAIN PAGE COMPONENT ---
export default function BuyIntroPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>("Newest");

  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleClearFilters = () => setFilters(initialFilters);

  const filteredListings = useMemo(() => {
    let result = listings.filter((l) => {
      // LOCATION text search
      if (filters.location.trim()) {
        const q = filters.location.toLowerCase().trim();
        const locString = `${l.locality} ${l.city}`.toLowerCase();
        if (!locString.includes(q)) return false;
      }

      // PROPERTY TYPE
      if (
        filters.propertyType !== "any" &&
        l.type !== filters.propertyType
      )
        return false;

      // PRICE (Dropdown)
      if (filters.priceRange !== "any") {
        const price = l.priceCr;
        if (filters.priceRange === "0-1.5" && !(price <= 1.5)) return false;
        if (
          filters.priceRange === "1.5-2" &&
          !(price >= 1.5 && price <= 2)
        )
          return false;
        if (
          filters.priceRange === "2-2.5" &&
          !(price >= 2 && price <= 2.5)
        )
          return false;
        if (filters.priceRange === "2.5+" && !(price >= 2.5)) return false;
      }

      // PRICE (Min/Max inputs)
      const minPriceCr = filters.priceMin
        ? parseFloat(filters.priceMin)
        : NaN;
      const maxPriceCr = filters.priceMax
        ? parseFloat(filters.priceMax)
        : NaN;
      if (!Number.isNaN(minPriceCr) && l.priceCr < minPriceCr) return false;
      if (!Number.isNaN(maxPriceCr) && l.priceCr > maxPriceCr) return false;

      // POSSESSION
      if (
        filters.possession !== "any" &&
        l.readyStatus !== filters.possession
      )
        return false;
        
      // LISTED BY
      if (filters.listedBy !== "any") {
          if (filters.listedBy === "owner" && l.source !== "owner") return false;
          if (filters.listedBy === "partner" && l.source !== "partner") return false;
      }

      // BED / BATH / PARKING
      if (l.bedrooms < filters.minBedrooms) return false;
      if (l.bathrooms < filters.minBathrooms) return false;
      if (l.parking < filters.minParking) return false;

      // FURNISHING
      if (
        filters.furnishing !== "any" &&
        l.furnishing !== filters.furnishing
      )
        return false;

      // SIZE
      const minSize = filters.sizeMin ? parseInt(filters.sizeMin, 10) : NaN;
      const maxSize = filters.sizeMax ? parseInt(filters.sizeMax, 10) : NaN;
      if (!Number.isNaN(minSize) && l.areaSqft < minSize) return false;
      if (!Number.isNaN(maxSize) && l.areaSqft > maxSize) return false;

      // AMENITIES
      if (filters.amenities.length > 0) {
        const hasAll = filters.amenities.every((a) =>
          l.amenities.includes(a)
        );
        if (!hasAll) return false;
      }

      return true;
    });

    // --- SORTING LOGIC ---
    // Tier Weight > User Selection
    result = [...result].sort((a, b) => {
      // 1. Primary Sort: Tier
      const weightA = getTierWeight(a.tier);
      const weightB = getTierWeight(b.tier);

      if (weightA !== weightB) {
        return weightB - weightA; // Exclusive (3) first
      }

      // 2. Secondary Sort: User Selection
      switch (sortBy) {
        case "PriceLowHigh":
          return a.priceCr - b.priceCr;
        case "PriceHighLow":
          return b.priceCr - a.priceCr;
        case "SizeLowHigh":
            return a.areaSqft - b.areaSqft; 
        case "SizeHighLow":
          return b.areaSqft - a.areaSqft; 
        case "Oldest":
            return a.id - b.id; // Ascending ID
        case "Newest":
        default:
          return b.id - a.id; // Descending ID
      }
    });

    return result;
  }, [filters, sortBy]);

  return (
    <main className="min-h-screen bg-[#F5F7F9]">
      <Header />

      {/* FULL-WIDTH WRAPPER */}
      <section className="w-full px-3 sm:px-4 lg:px-6 xl:px-10 py-6">
        
        {/* --- TOP SEARCH CARD --- */}
        <div className="rounded-2xl border border-slate-200 bg-white px-3 sm:px-4 py-2 shadow-sm"> {/* ADJUSTED: py-3 -> py-2, px reduced */}
          {/* Header & Badges */}
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between mb-3"> {/* ADJUSTED: gap-2 -> gap-1, mb-4 -> mb-3 */}
            <div>
              <h1 className="text-sm font-semibold text-slate-900"> {/* ADJUSTED: text-base -> text-sm */}
                Find your next home
              </h1>
              <p className="text-xs text-slate-500 mt-0.5"> {/* ADJUSTED: mt-1 -> mt-0.5 */}
                Search by city, locality, type, and budget.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500"> {/* ADJUSTED: gap-3 -> gap-2 */}
              <BadgeDot color="#808080">Seller OTP verified</BadgeDot>
              <BadgeDot color="#808080">Direct Owner</BadgeDot>
              <BadgeDot color="#808080">Agent listed</BadgeDot>
              <BadgeDot color="#808080">Exclusive</BadgeDot>
            </div>
          </div>

          {/* SEARCH ROW */}
          <div className="flex flex-col gap-1 lg:flex-row"> {/* ADJUSTED: gap-2 -> gap-1 */}
            
            {/* 1. Location Input */}
            <div className="relative flex min-w-[240px] flex-[1.2] items-center rounded-full border border-slate-200 bg-slate-50 px-2 transition-colors hover:border-slate-300 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-500 h-8"> {/* ADJUSTED: px-3 -> px-2, h-9 -> h-8 */}
              <svg
                className="mr-2 h-3.5 w-3.5 text-slate-400" /* ADJUSTED: h-4 -> h-3.5 */
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                value={filters.location}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, location: e.target.value }))
                }
                placeholder="Search City, Locality..."
                className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* 2. Horizontal Filters */}
            <div className="flex flex-1 flex-col gap-1 sm:flex-row"> {/* ADJUSTED: gap-2 -> gap-1 */}
              <SmartDropdown
                label="Type"
                value={filters.propertyType}
                onChange={(val) =>
                  setFilters((f) => ({ ...f, propertyType: val as any }))
                }
                options={[
                  { value: "any", label: "Any" },
                  { value: "Apartment", label: "Apartment" },
                  { value: "Villa", label: "Villa" },
                  { value: "Plot", label: "Plot" },
                ]}
              />

              <SmartDropdown
                label="Budget"
                value={filters.priceRange}
                onChange={(val) =>
                  setFilters((f) => ({ ...f, priceRange: val as any }))
                }
                options={[
                  { value: "any", label: "Any" },
                  { value: "0-1.5", label: "Up to ₹1.5 Cr" },
                  { value: "1.5-2", label: "₹1.5 - ₹2 Cr" },
                  { value: "2.5+", label: "₹2.5 Cr +" },
                ]}
              />

              <SmartDropdown
                label="Move"
                value={filters.possession}
                onChange={(val) =>
                  setFilters((f) => ({ ...f, possession: val as any }))
                }
                options={[
                  { value: "any", label: "Any" },
                  { value: "Ready to move", label: "Ready to Move" },
                  { value: "Immediate", label: "Immediate" },
                  { value: "After 1 Month", label: "After 1 Month" },
                ]}
              />
            </div>

            {/* 3. Search Button */}
            <button className="h-8 shrink-0 rounded-full bg-[#006B5B] px-5 text-sm font-semibold text-white shadow transition-all hover:bg-[#005347] active:scale-95"> {/* ADJUSTED: h-9 -> h-8, px-6 -> px-5, font-bold -> font-semibold */}
              Search
            </button>
          </div>

          {/* --- FOOTER & SORTING --- */}
          <div className="mt-3 flex flex-col gap-1 border-t border-slate-100 pt-3 lg:flex-row lg:items-center lg:justify-between"> {/* ADJUSTED: mt-4 -> mt-3, gap-2 -> gap-1, pt-4 -> pt-3 */}
            
            {/* LEFT SIDE: Info Pills */}
            <div className="flex flex-wrap items-center gap-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"> {/* ADJUSTED: px,py reduced */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-400"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Order: Exclusive first, then Featured, then all others.
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"> {/* ADJUSTED: px,py reduced */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-400"
                >
                   <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                   <line x1="22" y1="2" x2="2" y2="22" />
                </svg>
                Seller mobile is partially hidden. View photos free.
              </div>
            </div>

            {/* RIGHT SIDE: CUSTOM Sort Dropdown */}
            <div className="relative mt-0.5 lg:mt-0"> {/* ADJUSTED: mt-1 -> mt-0.5 */}
               <SortDropdown 
                 value={sortBy}
                 onChange={setSortBy}
               />
            </div>

          </div>
        </div>

        {/* MAIN GRID */}
        <div className="mt-2 grid gap-3 md:grid-cols-[270px,1fr]"> {/* ADJUSTED: mt-3 -> mt-2, gap slightly reduced */}
          
          {/* SIDEBAR */}
          <aside className="h-fit">
            
            {/* MAP PLACEHOLDER */}
            <div className="mb-3 w-full aspect-square rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden relative group cursor-pointer shadow-sm"> {/* ADJUSTED: mb-4 -> mb-3 */}
                <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScDLQeIDVShuT2tL3g-BkmQUdq0tId_aQP9g&s"
                    alt="Map view"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                    <button className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg text-slate-800 text-xs font-bold hover:bg-white transition-all">
                        <MapIcon className="w-3 h-3" />
                        View on Map
                    </button>
                </div>
            </div>

            {/* FILTERS CONTAINER */}
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-xs text-slate-700 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                    Filters
                    </h2>
                    <p className="text-[11px] text-slate-500">
                    Refine your search results.
                    </p>
                </div>
                <button
                    onClick={handleClearFilters}
                    className="text-[11px] font-medium text-[#006B5B]"
                >
                    Clear all
                </button>
                </div>

                <div className="mt-4 space-y-4">
                
                {/* UPDATED: Listed By Filter */}
                
                <FilterBlock title="Listed by">
                    <PillButton
                      active={filters.listedBy === "owner"}
                      onClick={() => setFilters(f => ({...f, listedBy: f.listedBy === "owner" ? "any" : "owner"}))}
                    >
                      Direct Owner
                    </PillButton>
                    <PillButton
                      active={filters.listedBy === "partner"}
                      onClick={() => setFilters(f => ({...f, listedBy: f.listedBy === "partner" ? "any" : "partner"}))}
                    >
                      Agent listed
                    </PillButton>
                </FilterBlock>
                
                
                {/* Property type */}
                <FilterBlock title="Property type">
                    {["Apartment", "Villa", "Bungalow", "Plot"].map(
                    (type) => (
                        <PillButton
                        key={type}
                        active={filters.propertyType === type}
                        onClick={() =>
                            setFilters((f) => ({
                            ...f,
                            propertyType:
                                f.propertyType === type
                                ? "any"
                                : (type as PropertyType),
                            }))
                        }
                        >
                        {type}
                        </PillButton>
                    )
                    )}
                </FilterBlock>

                {/* Price range (₹) */}
                <FilterBlock title="Price range (₹)">
                    <div className="flex gap-2 w-full">
                    <input
                        value={filters.priceMin}
                        onChange={(e) =>
                        setFilters((f) => ({
                            ...f,
                            priceMin: e.target.value,
                        }))
                        }
                        placeholder="Min Cr"
                        className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] outline-none placeholder:text-slate-400 focus:border-emerald-500"
                    />
                    <input
                        value={filters.priceMax}
                        onChange={(e) =>
                        setFilters((f) => ({
                            ...f,
                            priceMax: e.target.value,
                        }))
                        }
                        placeholder="Max Cr"
                        className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] outline-none placeholder:text-slate-400 focus:border-emerald-500"
                    />
                    </div>
                </FilterBlock>

                {/* Bedrooms */}
                <FilterBlock title="Bedrooms">
                    {["1+", "2+", "3+", "4+"].map((label, idx) => {
                    const value = idx + 1;
                    return (
                        <PillButton
                        key={label}
                        active={filters.minBedrooms === value}
                        onClick={() =>
                            setFilters((f) => ({
                            ...f,
                            minBedrooms:
                                f.minBedrooms === value ? 0 : value,
                            }))
                        }
                        >
                        {label}
                        </PillButton>
                    );
                    })}
                </FilterBlock>

                {/* Bathrooms */}
                <FilterBlock title="Bathrooms">
                    {["1+", "2+", "3+"].map((label, idx) => {
                    const value = idx + 1;
                    return (
                        <PillButton
                        key={label}
                        active={filters.minBathrooms === value}
                        onClick={() =>
                            setFilters((f) => ({
                            ...f,
                            minBathrooms:
                                f.minBathrooms === value ? 0 : value,
                            }))
                        }
                        >
                        {label}
                        </PillButton>
                    );
                    })}
                </FilterBlock>

                {/* Furnishing */}
                <FilterBlock title="Furnishing">
                    {[
                    "Unfurnished",
                    "Semi-furnished",
                    "Fully furnished",
                    ].map((label) => (
                    <PillButton
                        key={label}
                        active={filters.furnishing === label}
                        onClick={() =>
                        setFilters((f) => ({
                            ...f,
                            furnishing:
                            f.furnishing === label
                                ? "any"
                                : (label as Listing["furnishing"]),
                        }))
                        }
                    >
                        {label}
                    </PillButton>
                    ))}
                </FilterBlock>

                {/* Parking */}
                <FilterBlock title="Parking">
                    <PillButton
                    active={filters.minParking === 0}
                    onClick={() =>
                        setFilters((f) => ({ ...f, minParking: 0 }))
                    }
                    >
                    Any
                    </PillButton>
                    <PillButton
                    active={filters.minParking === 1}
                    onClick={() =>
                        setFilters((f) => ({ ...f, minParking: 1 }))
                    }
                    >
                    1+
                    </PillButton>
                    <PillButton
                    active={filters.minParking === 2}
                    onClick={() =>
                        setFilters((f) => ({ ...f, minParking: 2 }))
                    }
                    >
                    2+
                    </PillButton>
                </FilterBlock>

                {/* Size (sq ft) */}
                <FilterBlock title="Size (sq ft)">
                    <div className="flex gap-2 w-full">
                    <input
                        value={filters.sizeMin}
                        onChange={(e) =>
                        setFilters((f) => ({
                            ...f,
                            sizeMin: e.target.value,
                        }))
                        }
                        placeholder="Min size"
                        className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] outline-none placeholder:text-slate-400 focus:border-emerald-500"
                    />
                    <input
                        value={filters.sizeMax}
                        onChange={(e) =>
                        setFilters((f) => ({
                            ...f,
                            sizeMax: e.target.value,
                        }))
                        }
                        placeholder="Max size"
                        className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] outline-none placeholder:text-slate-400 focus:border-emerald-500"
                    />
                    </div>
                </FilterBlock>

                {/* Age & availability */}
                <FilterBlock title="Possession">
                    <PillButton
                    active={filters.possession === "any"}
                    onClick={() =>
                        setFilters((f) => ({ ...f, possession: "any" }))
                    }
                    >
                    Any
                    </PillButton>
                    <PillButton
                    active={filters.possession === "Immediate"}
                    onClick={() =>
                        setFilters((f) => ({
                        ...f,
                        possession: "Immediate",
                        }))
                    }
                    >
                    Immediate
                    </PillButton>
                    <PillButton
                    active={filters.possession === "After 1 Month"}
                    onClick={() =>
                        setFilters((f) => ({
                        ...f,
                        possession: "After 1 Month",
                        }))
                    }
                    >
                    After 1 Month
                    </PillButton>
                </FilterBlock>

                {/* Amenities */}
                <FilterBlock title="Amenities">
                    {["Lift", "Garden", "Security", "Gym"].map(
                    (amenity) => (
                        <PillButton
                        key={amenity}
                        active={filters.amenities.includes(amenity)}
                        onClick={() => handleAmenityToggle(amenity)}
                        >
                        {amenity}
                        </PillButton>
                    )
                    )}
                </FilterBlock>
                </div>
            </div>
          </aside>

          {/* LISTINGS */}
          <section className="space-y-3"> {/* ADJUSTED: space-y-4 -> space-y-3 */}
            {/* HEADER SECTION */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Showing properties in Gandhinagar
              </h2>
              <span className="text-xs font-medium text-slate-500">
                {filteredListings.length} listings • Updated today
              </span>
            </div>

            {/* UNIFIED LIST RENDERING */}
            <div className="space-y-3"> {/* ADJUSTED */}
              {filteredListings.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                No properties match your filters yet. Try adjusting your
                budget or removing some filters.
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

/* ===== UI Helpers ===== */

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // UPDATED: Exact sort options requested
  const options: { label: string; value: SortOption }[] = [
    { label: "Price (low to high)", value: "PriceLowHigh" },
    { label: "Price (high to low)", value: "PriceHighLow" },
    { label: "Size (small to large)", value: "SizeLowHigh" },
    { label: "Size (large to small)", value: "SizeHighLow" },
    { label: "Oldest to newest", value: "Oldest" },
    { label: "Newest to oldest", value: "Newest" },
  ];

  const selectedLabel = options.find((o) => o.value === value)?.label;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-white" /* ADJUSTED: px,py reduced */
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-400"
        >
          <line x1="21" x2="14" y1="4" y2="4" />
          <line x1="10" x2="3" y1="4" y2="4" />
          <line x1="21" x2="12" y1="12" y2="12" />
          <line x1="8" x2="3" y1="12" y2="12" />
          <line x1="21" x2="16" y1="20" y2="20" />
          <line x1="12" x2="3" y1="20" y2="20" />
        </svg>
        <span>
          Sort by: <span className="font-semibold text-slate-900 capitalize">{selectedLabel}</span>
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right animate-in fade-in zoom-in-95 duration-100 rounded-xl border border-slate-100 bg-white p-1 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors capitalize ${
                  value === option.value
                    ? "bg-emerald-50 text-emerald-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {option.label}
                {value === option.value && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface SmartDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

const SmartDropdown: React.FC<SmartDropdownProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : "Any";
  const isActive = value !== "any";

  return (
    <div className="relative flex-1 min-w-[140px]" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex h-8 w-full items-center justify-between rounded-full border px-3 transition-all duration-200 ${/* ADJUSTED: h-9 -> h-8, px reduced */ ""} ${
          isOpen
            ? "border-emerald-500 ring-1 ring-emerald-500 bg-white"
            : isActive
            ? "border-emerald-200 bg-emerald-50/30 hover:border-emerald-300"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="shrink-0 text-xs font-medium text-slate-500">
            {label}
          </span>
          <span className="h-3 w-px bg-slate-200"></span>
          <span
            className={`truncate text-sm ${
              isActive ? "font-semibold text-emerald-900" : "text-slate-700"
            }`}
          >
            {displayLabel}
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`ml-2 h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-emerald-600" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[180px] origin-top-left animate-in fade-in zoom-in-95 duration-100 rounded-xl border border-slate-100 bg-white p-1 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  value === option.value
                    ? "bg-emerald-50 text-emerald-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {option.label}
                {value === option.value && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function BadgeDot({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {children}
    </span>
  );
}

function FilterBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-slate-500">{title}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function PillButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-[11px] transition-colors ${
        active
          ? "border border-[#0B8A72] bg-[#E5F6F2] font-medium text-[#0B6754]"
          : "border border-slate-200 bg-white text-slate-600 hover:border-[#0B8A72]/60"
      }`}
    >
      {children}
    </button>
  );
}

// --- TIER HELPER ---
function tierLabel(tier: Tier) {
  if (tier === "exclusive") return "Exclusive";
  if (tier === "featured") return "Featured";
  return "";
}

function tierBadgeClasses(tier: Tier) {
  if (tier === "exclusive")
    return "bg-[#004D40] text-white"; 
  if (tier === "featured")
    return "bg-[#F59E0B] text-white"; 
  return "";
}

// --- LISTING CARD (UNCHANGED except tiny spacing reductions kept earlier) ---
function ListingCard({ item }: { item: Listing }) {
  const isOwner = item.source === "owner";

  return (
    <article className="flex flex-col md:flex-row gap-3 md:gap-5 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"> {/* ADJUSTED: slightly reduced gaps/padding */}
      {/* LEFT: Image Section */}
      <div className="w-full md:w-[288px] h-[190px] relative rounded-xl overflow-hidden shrink-0 bg-slate-100"> {/* ADJUSTED: h-200 -> h-190 */}
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {/* Tier Badge (Exclusive/Featured) - Top Left */}
        {tierLabel(item.tier) && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-[11px] font-semibold rounded-full shadow-sm ${tierBadgeClasses(
              item.tier
            )}`}
          >
            {tierLabel(item.tier)}
          </span>
        )}

        {/* UPDATED: Direct Owner / Agent Badge - Top Right */}
        <div className="absolute top-3 right-3">
            {isOwner ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/95 backdrop-blur-sm text-green-700 text-[10px] font-bold shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                    Direct Owner
                </span>
            ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/95 backdrop-blur-sm text-blue-700 text-[10px] font-bold shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                    Agent listed
                </span>
            )}
        </div>
      </div>

      {/* CENTER: Info Section */}
      <div className="flex-1 flex flex-col gap-2"> {/* ADJUSTED: gap reduced */}
        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight"> {/* ADJUSTED: text-xl -> text-lg */}
            {item.title}
          </h3>
        </div>

        {/* Row 1: Specs Pills */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 border border-slate-100">
            {item.bedrooms} BHK • {item.bathrooms} Bath
          </span>
          <span className="px-3 py-1.5 bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 border border-slate-100">
            {item.areaSqft.toLocaleString()} sq ft
          </span>
        </div>

        {/* Row 2: Type & Location */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-slate-600 border border-slate-200">
            {item.type} • {item.furnishing}
          </span>
          <span className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-slate-600 border border-slate-200">
            {item.locality}, {item.city}
          </span>
        </div>

        {/* Row 3: Meta Info (Icons) */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-slate-500"> {/* ADJUSTED: gap-x reduced */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{item.readyStatus}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Car className="w-4 h-4 text-slate-400" />
            <span>{item.parking} Parking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Age: {item.ageLabel}</span>
          </div>
        </div>

        {/* Row 4: Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-[#E5F6F2] rounded-md text-[11px] font-medium text-[#006B5B]"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Media Text */}
        <div className="text-[11px] text-slate-400 pt-1">
           Media & docs • {item.media}
        </div>
      </div>

      {/* RIGHT: Price & Actions */}
      <div className="w-full md:w-48 shrink-0 flex flex-col justify-between md:border-l md:border-slate-100 md:pl-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100"> {/* ADJUSTED: pl reduced, pt reduced */}
        
        {/* Top: Price */}
        <div>
          <div className="text-xs font-medium text-slate-500">Price</div>
          <div className="text-xl font-bold text-slate-900 mt-0.5"> {/* ADJUSTED: text-2xl -> text-xl */}
            {item.priceLabel}
          </div>
          <div className="mt-2"> {/* ADJUSTED: mt reduced */}
              <div className="text-xs text-slate-500">Seller access</div>
              <div className="text-xs font-medium text-slate-700 mt-0.5">{item.phoneMasked}</div>
              <div className="text-[10px] text-slate-400 leading-tight">full number after subscription</div>
          </div>
        </div>

        {/* Bottom: Buttons */}
        <div className="flex flex-col gap-2 mt-4"> {/* ADJUSTED: gap & mt reduced */}
          <button className="w-full py-2 rounded-full bg-[#0F4C3E] hover:bg-[#0b3b30] text-white text-sm font-bold shadow-sm transition-all active:scale-95">
            View details
          </button>
          <button className="w-full py-2 rounded-full border border-slate-300 bg-white hover:border-slate-400 text-slate-800 text-sm font-bold transition-all active:scale-95">
            Unlock seller
          </button>
        </div>

      </div>
    </article>
  );
}
