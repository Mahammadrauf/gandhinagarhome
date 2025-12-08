"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
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
  source: "owner" | "partner"; 
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
  city: string; 
  localities: string[]; 
  propertyType: "any" | PropertyType;
  priceRange: PriceRangeValue; 
  possession: "any" | Possession;
  listedBy: "any" | "owner" | "partner"; 
  minBedrooms: number;
  minBathrooms: number;
  furnishing: "any" | Listing["furnishing"];
  minParking: number;
  amenities: string[];
  priceMin: number; 
  priceMax: number; 
  sizeMin: string;
  sizeMax: string;
}

// --- DATA CONSTANTS ---
const CITY_AREAS: Record<string, string[]> = {
  Gandhinagar: ["Raysan", "Randesan", "Sargasan", "Kudasan", "Koba", "Sectors"],
  Ahmedabad: ["Motera", "Chandkheda", "Zundal", "Adalaj", "Bhat"],
};

// --- EXPANDED DATASET (Source of Truth) ---
const ALL_LISTINGS: Listing[] = [
  // === 6 EXCLUSIVE PROPERTIES ===
  {
    id: 101,
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
    media: "Video • Floor plan",
    phoneMasked: "+91 8XXX-XXX001",
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Vaastu friendly", "Private garden"],
    amenities: ["Garden", "Security"],
  },
  {
    id: 102,
    tier: "exclusive",
    source: "owner",
    title: "Adalaj Green Farmhouse",
    locality: "Adalaj",
    city: "Ahmedabad",
    bedrooms: 5,
    bathrooms: 6,
    areaSqft: 5000,
    type: "Villa",
    furnishing: "Fully furnished",
    readyStatus: "Immediate",
    parking: 4,
    ageLabel: "New",
    priceCr: 5.5,
    priceLabel: "₹5.50 Cr",
    media: "Video • Tour",
    phoneMasked: "+91 8XXX-XXX002",
    image: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Pool", "Large Garden"],
    amenities: ["Pool", "Security"],
  },
  {
    id: 103,
    tier: "exclusive",
    source: "partner",
    title: "Gift City Penthouse • Sky View",
    locality: "Gift City",
    city: "Gift City",
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 4200,
    type: "Apartment",
    furnishing: "Fully furnished",
    readyStatus: "Ready to move",
    parking: 3,
    ageLabel: "0-1 years",
    priceCr: 4.2,
    priceLabel: "₹4.20 Cr",
    media: "Video",
    phoneMasked: "+91 8XXX-XXX003",
    image: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["River view", "Penthouse"],
    amenities: ["Gym", "Club house"],
  },
  {
    id: 104,
    tier: "exclusive",
    source: "owner",
    title: "Sargasan Royal Bungalow",
    locality: "Sargasan",
    city: "Gandhinagar",
    bedrooms: 5,
    bathrooms: 5,
    areaSqft: 3800,
    type: "Bungalow",
    furnishing: "Semi-furnished",
    readyStatus: "After 1 Month",
    parking: 3,
    ageLabel: "2-5 years",
    priceCr: 3.8,
    priceLabel: "₹3.80 Cr",
    media: "Photos only",
    phoneMasked: "+91 8XXX-XXX004",
    image: "https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Corner unit", "Theater room"],
    amenities: ["Garden", "Theater"],
  },
  {
    id: 105,
    tier: "exclusive",
    source: "partner",
    title: "Ambli-Bopal Luxury Apartment",
    locality: "Bhat", 
    city: "Ahmedabad",
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: 5500,
    type: "Apartment",
    furnishing: "Fully furnished",
    readyStatus: "Immediate",
    parking: 4,
    ageLabel: "New",
    priceCr: 6.5,
    priceLabel: "₹6.50 Cr",
    media: "Video",
    phoneMasked: "+91 8XXX-XXX005",
    image: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Ultra Luxury", "Concierge"],
    amenities: ["Pool", "Gym", "Concierge"],
  },
  {
    id: 106,
    tier: "exclusive",
    source: "owner",
    title: "Koba Circle Villa Estate",
    locality: "Koba",
    city: "Gandhinagar",
    bedrooms: 6,
    bathrooms: 6,
    areaSqft: 6000,
    type: "Villa",
    furnishing: "Unfurnished",
    readyStatus: "Ready to move",
    parking: 5,
    ageLabel: "5-10 years",
    priceCr: 5.1,
    priceLabel: "₹5.10 Cr",
    media: "Photos",
    phoneMasked: "+91 8XXX-XXX006",
    image: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Huge Plot", "Private Road"],
    amenities: ["Garden", "Security"],
  },

  // === 12 FEATURED PROPERTIES ===
  {
    id: 201,
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
    media: "Video",
    phoneMasked: "+91 7XXX-XXX201",
    image: "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Club house", "Gym"],
    amenities: ["Gym", "Club house"],
  },
  {
    id: 202,
    tier: "featured",
    source: "owner",
    title: "Motera Sports Enclave • 2BHK",
    locality: "Motera",
    city: "Ahmedabad",
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1350,
    type: "Apartment",
    furnishing: "Unfurnished",
    readyStatus: "Ready to move",
    parking: 1,
    ageLabel: "1-5 years",
    priceCr: 0.65,
    priceLabel: "₹65 Lac",
    media: "Photos",
    phoneMasked: "+91 7XXX-XXX202",
    image: "https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Near Stadium", "Metro"],
    amenities: ["Security", "Lift"],
  },
  {
    id: 203,
    tier: "featured",
    source: "owner",
    title: "Zundal Elegant Bungalow",
    locality: "Zundal",
    city: "Ahmedabad",
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 2800,
    type: "Bungalow",
    furnishing: "Unfurnished",
    readyStatus: "After 1 Month",
    parking: 2,
    ageLabel: "0-1 years",
    priceCr: 2.25,
    priceLabel: "₹2.25 Cr",
    media: "Photos",
    phoneMasked: "+91 7XXX-XXX203",
    image: "https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Gated Society", "Corner"],
    amenities: ["Club house", "Garden"],
  },
  {
    id: 204,
    tier: "featured",
    source: "partner",
    title: "Sargasan Terrace Apartment",
    locality: "Sargasan",
    city: "Gandhinagar",
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 2100,
    type: "Apartment",
    furnishing: "Semi-furnished",
    readyStatus: "Ready to move",
    parking: 2,
    ageLabel: "2-5 years",
    priceCr: 1.45,
    priceLabel: "₹1.45 Cr",
    media: "Video",
    phoneMasked: "+91 7XXX-XXX204",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Private Terrace", "View"],
    amenities: ["Lift", "Security"],
  },
  {
    id: 205,
    tier: "featured",
    source: "owner",
    title: "Randesan Garden Villa",
    locality: "Randesan",
    city: "Gandhinagar",
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 3100,
    type: "Villa",
    furnishing: "Fully furnished",
    readyStatus: "Immediate",
    parking: 2,
    ageLabel: "5-10 years",
    priceCr: 2.8,
    priceLabel: "₹2.80 Cr",
    media: "Photos",
    phoneMasked: "+91 7XXX-XXX205",
    image: "https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Garden", "Peaceful"],
    amenities: ["Garden", "Security"],
  },
  {
    id: 206,
    tier: "featured",
    source: "partner",
    title: "Bhat Riverfront Home",
    locality: "Bhat",
    city: "Ahmedabad",
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1850,
    type: "Apartment",
    furnishing: "Unfurnished",
    readyStatus: "Ready to move",
    parking: 1,
    ageLabel: "New",
    priceCr: 1.15,
    priceLabel: "₹1.15 Cr",
    media: "Photos",
    phoneMasked: "+91 7XXX-XXX206",
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["River View", "Breeze"],
    amenities: ["Gym", "Lift"],
  },
  {
    id: 207,
    tier: "featured",
    source: "partner",
    title: "Chandkheda Commercial Plot",
    locality: "Chandkheda",
    city: "Ahmedabad",
    bedrooms: 0,
    bathrooms: 0,
    areaSqft: 5000,
    type: "Plot",
    furnishing: "Unfurnished",
    readyStatus: "Immediate",
    parking: 0,
    ageLabel: "N/A",
    priceCr: 3.5,
    priceLabel: "₹3.50 Cr",
    media: "Map",
    phoneMasked: "+91 7XXX-XXX207",
    image: "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Commercial", "Main Road"],
    amenities: ["Water connection"],
  },
  {
    id: 208,
    tier: "featured",
    source: "owner",
    title: "Sector 6 Corner House",
    locality: "Sectors",
    city: "Gandhinagar",
    bedrooms: 3,
    bathrooms: 2,
    areaSqft: 1500,
    type: "Bungalow",
    furnishing: "Semi-furnished",
    readyStatus: "Ready to move",
    parking: 1,
    ageLabel: "10+ years",
    priceCr: 1.9,
    priceLabel: "₹1.90 Cr",
    media: "Photos",
    phoneMasked: "+91 7XXX-XXX208",
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Old Construction", "Prime Loc"],
    amenities: ["Water", "Parking"],
  },
  {
    id: 209,
    tier: "featured",
    source: "partner",
    title: "Koba IT Park Apartment",
    locality: "Koba",
    city: "Gandhinagar",
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1200,
    type: "Apartment",
    furnishing: "Fully furnished",
    readyStatus: "Immediate",
    parking: 1,
    ageLabel: "1-5 years",
    priceCr: 0.75,
    priceLabel: "₹75 Lac",
    media: "Photos",
    phoneMasked: "+91 7XXX-XXX209",
    image: "https://images.pexels.com/photos/323772/pexels-photo-323772.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Near IT Park", "Rental Income"],
    amenities: ["Lift", "Security"],
  },
  {
    id: 210,
    tier: "featured",
    source: "owner",
    title: "Adalaj Weekend Home",
    locality: "Adalaj",
    city: "Ahmedabad",
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1000,
    type: "Villa",
    furnishing: "Fully furnished",
    readyStatus: "Ready to move",
    parking: 1,
    ageLabel: "5-10 years",
    priceCr: 0.95,
    priceLabel: "₹95 Lac",
    media: "Photos",
    phoneMasked: "+91 7XXX-XXX210",
    image: "https://images.pexels.com/photos/259600/pexels-photo-259600.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Weekend", "Greenery"],
    amenities: ["Garden", "Club"],
  },
  {
    id: 211,
    tier: "featured",
    source: "partner",
    title: "Raysan Smart Home 3BHK",
    locality: "Raysan",
    city: "Gandhinagar",
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1800,
    type: "Apartment",
    furnishing: "Semi-furnished",
    readyStatus: "After 1 Month",
    parking: 2,
    ageLabel: "New",
    priceCr: 1.35,
    priceLabel: "₹1.35 Cr",
    media: "Video",
    phoneMasked: "+91 7XXX-XXX211",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Smart Home", "Solar"],
    amenities: ["Solar", "Lift"],
  },
  {
    id: 212,
    tier: "featured",
    source: "owner",
    title: "Gift City Office Space",
    locality: "Gift City",
    city: "Gift City",
    bedrooms: 0,
    bathrooms: 1,
    areaSqft: 800,
    type: "Apartment", // Using Apartment type for office demo
    furnishing: "Unfurnished",
    readyStatus: "Immediate",
    parking: 1,
    ageLabel: "New",
    priceCr: 1.1,
    priceLabel: "₹1.10 Cr",
    media: "Photos",
    phoneMasked: "+91 7XXX-XXX212",
    image: "https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Office", "Tax Free Zone"],
    amenities: ["Lift", "Security"],
  },

  // === REGULAR PROPERTIES (Existing + Extras) ===
  {
    id: 301,
    tier: "regular",
    source: "owner",
    title: "Sector 21 Apartment • Park Facing",
    locality: "Sectors",
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
    media: "Photos",
    phoneMasked: "+91 9XXX-XXX301",
    image: "https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Renovated", "Park view"],
    amenities: ["Park view", "Lift"],
  },
  {
    id: 302,
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
    media: "Video",
    phoneMasked: "+91 9XXX-XXX302",
    image: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["South facing", "Lift"],
    amenities: ["Lift", "Security"],
  },
  {
    id: 303,
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
    media: "Video",
    phoneMasked: "+91 9XXX-XXX303",
    image: "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Modular kitchen", "Garden"],
    amenities: ["Garden", "Lift"],
  },
  {
    id: 304,
    tier: "regular",
    source: "partner",
    title: "Chandkheda Modern 3BHK",
    locality: "Chandkheda",
    city: "Ahmedabad",
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1600,
    type: "Apartment",
    furnishing: "Semi-furnished",
    readyStatus: "Ready to move",
    parking: 1,
    ageLabel: "5-10 years",
    priceCr: 0.85,
    priceLabel: "₹85 Lac",
    media: "Photos",
    phoneMasked: "+91 9XXX-XXX304",
    image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Main Road", "Shopping"],
    amenities: ["Lift", "Water"],
  },
  {
    id: 305,
    tier: "regular",
    source: "partner",
    title: "Koba Prime Plot",
    locality: "Koba",
    city: "Gandhinagar",
    bedrooms: 0,
    bathrooms: 0,
    areaSqft: 4000,
    type: "Plot",
    furnishing: "Unfurnished",
    readyStatus: "Immediate",
    parking: 0,
    ageLabel: "N/A",
    priceCr: 1.1,
    priceLabel: "₹1.10 Cr",
    media: "Map",
    phoneMasked: "+91 9XXX-XXX305",
    image: "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["Investment", "Highway"],
    amenities: ["Water connection"],
  },
  {
    id: 306,
    tier: "regular",
    source: "partner",
    title: "Bhat Spacious 4BHK",
    locality: "Bhat",
    city: "Ahmedabad",
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 2100,
    type: "Apartment",
    furnishing: "Semi-furnished",
    readyStatus: "Ready to move",
    parking: 2,
    ageLabel: "2-5 years",
    priceCr: 1.05,
    priceLabel: "₹1.05 Cr",
    media: "Photos",
    phoneMasked: "+91 9XXX-XXX306",
    image: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: ["River view", "Quiet"],
    amenities: ["Gym", "Security"],
  },
];

// Initial state
const initialFilters: Filters = {
  location: "",
  city: "any",
  localities: [],
  propertyType: "any",
  priceRange: "any",
  possession: "any",
  listedBy: "any", 
  minBedrooms: 0,
  minBathrooms: 0,
  furnishing: "any",
  minParking: 0,
  amenities: [],
  priceMin: 0,
  priceMax: 6, 
  sizeMin: "",
  sizeMax: "",
};

// --- HELPER: Tier Ranking ---
const getTierWeight = (tier: Tier) => {
  if (tier === "exclusive") return 3;
  if (tier === "featured") return 2;
  return 1; // regular
};

// Helper to shuffle array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- MAIN PAGE COMPONENT ---
export default function BuyIntroPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>("Newest");
  
  // State to hold the specific rotation of listings for this user/session
  // Initialize with empty or default logic, then populate in useEffect to avoid hydration mismatch
  const [rotatedListings, setRotatedListings] = useState<Listing[]>([]);

  // --- ROTATION LOGIC ---
  useEffect(() => {
    // 1. Split ALL_LISTINGS into buckets
    const exclusive = ALL_LISTINGS.filter(l => l.tier === "exclusive");
    const featured = ALL_LISTINGS.filter(l => l.tier === "featured");
    const regular = ALL_LISTINGS.filter(l => l.tier === "regular");

    // 2. Randomly select 2 Exclusive and 2 Featured
    // Note: We shuffle the buckets and take the first 2
    const selectedExclusive = shuffleArray(exclusive).slice(0, 2);
    const selectedFeatured = shuffleArray(featured).slice(0, 2);

    // 3. Combine them: 2 Exclusive + 2 Featured + All Regulars
    // The regular ones are just appended. The sort logic later will handle the final order (Ex > Feat > Reg)
    const combined = [...selectedExclusive, ...selectedFeatured, ...regular];

    setRotatedListings(combined);
  }, []); // Runs once on mount (refresh triggers re-mount)

  const handleClearFilters = () => setFilters(initialFilters);

  // Logic to handle clicking a City pill
  const handleCityToggle = (selectedCity: string) => {
    setFilters((prev) => {
      const isSame = prev.city === selectedCity;
      return {
        ...prev,
        city: isSame ? "any" : selectedCity,
        localities: [], 
      };
    });
  };

  const handleLocalityToggle = (loc: string) => {
    setFilters((prev) => {
      const exists = prev.localities.includes(loc);
      return {
        ...prev,
        localities: exists 
          ? prev.localities.filter(l => l !== loc)
          : [...prev.localities, loc]
      };
    });
  };

  const filteredListings = useMemo(() => {
    // Use ROTATED listings as source
    // If rotatedListings is empty (initial render), we can fallback to empty array or ALL_LISTINGS slice
    const sourceData = rotatedListings.length > 0 ? rotatedListings : [];

    let result = sourceData.filter((l) => {
      // 1. LOCATION text search
      if (filters.location.trim()) {
        const q = filters.location.toLowerCase().trim();
        const locString = `${l.locality} ${l.city}`.toLowerCase();
        if (!locString.includes(q)) return false;
      }

      // 2. CITY FILTER
      if (filters.city !== "any" && l.city !== filters.city) {
        return false;
      }

      // 3. LOCALITY FILTER
      if (filters.localities.length > 0) {
        if (!filters.localities.includes(l.locality)) {
          return false;
        }
      }

      // 4. PROPERTY TYPE
      if (filters.propertyType !== "any" && l.type !== filters.propertyType)
        return false;

      // 5. BUDGET SLIDER
      if (l.priceCr < filters.priceMin || l.priceCr > filters.priceMax) {
          return false;
      }

      // 5b. OLD DROPDOWN (legacy support)
      if (filters.priceRange !== "any") {
        const price = l.priceCr;
        if (filters.priceRange === "0-1.5" && !(price <= 1.5)) return false;
        if (filters.priceRange === "1.5-2" && !(price >= 1.5 && price <= 2)) return false;
        if (filters.priceRange === "2-2.5" && !(price >= 2 && price <= 2.5)) return false;
        if (filters.priceRange === "2.5+" && !(price >= 2.5)) return false;
      }

      // 6. POSSESSION
      if (filters.possession !== "any" && l.readyStatus !== filters.possession)
        return false;
        
      // 7. LISTED BY
      if (filters.listedBy !== "any") {
          if (filters.listedBy === "owner" && l.source !== "owner") return false;
          if (filters.listedBy === "partner" && l.source !== "partner") return false;
      }

      // 8. SPECS
      if (l.bedrooms < filters.minBedrooms) return false;
      if (l.bathrooms < filters.minBathrooms) return false;
      if (l.parking < filters.minParking) return false;

      // 9. FURNISHING
      if (filters.furnishing !== "any" && l.furnishing !== filters.furnishing)
        return false;

      return true;
    });

    // --- SORTING LOGIC ---
    // This sorting ensures the selected Exclusive ones stay at top, then Featured, then Regular
    result = [...result].sort((a, b) => {
      const weightA = getTierWeight(a.tier);
      const weightB = getTierWeight(b.tier);

      if (weightA !== weightB) {
        return weightB - weightA; 
      }

      switch (sortBy) {
        case "PriceLowHigh": return a.priceCr - b.priceCr;
        case "PriceHighLow": return b.priceCr - a.priceCr;
        case "SizeLowHigh": return a.areaSqft - b.areaSqft; 
        case "SizeHighLow": return b.areaSqft - a.areaSqft; 
        case "Oldest": return a.id - b.id; 
        case "Newest":
        default: return b.id - a.id; 
      }
    });

    return result;
  }, [filters, sortBy, rotatedListings]);

  return (
    <main className="min-h-screen bg-[#F5F7F9]">
      <Header />

      <section className="w-full px-3 sm:px-4 lg:px-6 xl:px-10 py-6">
        
        {/* --- TOP SEARCH CARD --- */}
        <div className="rounded-2xl border border-slate-200 bg-white px-3 sm:px-4 py-2 shadow-sm">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between mb-3">
            <div>
              <h1 className="text-sm font-semibold text-slate-900">
                Find your next home
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Search by city, locality, type, and budget.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <BadgeDot color="#808080">Seller OTP verified</BadgeDot>
              <BadgeDot color="#808080">Direct Owner</BadgeDot>
              <BadgeDot color="#808080">Agent listed</BadgeDot>
              <BadgeDot color="#808080">Exclusive</BadgeDot>
            </div>
          </div>

          <div className="flex flex-col gap-1 lg:flex-row">
            <div className="flex flex-1 flex-col gap-1 sm:flex-row">
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

            <button className="h-8 shrink-0 rounded-full bg-[#006B5B] px-5 text-sm font-semibold text-white shadow transition-all hover:bg-[#005347] active:scale-95">
              Search
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-1 border-t border-slate-100 pt-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Order: Exclusive first, then Featured, then all others.
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                   <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                   <line x1="22" y1="2" x2="2" y2="22" />
                </svg>
                Seller mobile is partially hidden. View photos free.
              </div>
            </div>

            <div className="relative mt-0.5 lg:mt-0">
               <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="mt-2 grid gap-3 md:grid-cols-[270px,1fr]">
          
          <aside className="h-fit">
            <div className="mb-3 w-full aspect-square rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden relative group cursor-pointer shadow-sm">
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

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-xs text-slate-700 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
                    <p className="text-[11px] text-slate-500">Refine your search results.</p>
                </div>
                <button onClick={handleClearFilters} className="text-[11px] font-medium text-[#006B5B]">
                    Clear all
                </button>
                </div>

                <div className="mt-4 space-y-5">
                
                <FilterBlock title="City">
                  <PillButton active={filters.city === "Gandhinagar"} onClick={() => handleCityToggle("Gandhinagar")}>Gandhinagar</PillButton>
                  <PillButton active={filters.city === "Ahmedabad"} onClick={() => handleCityToggle("Ahmedabad")}>Ahmedabad</PillButton>
                  <PillButton active={filters.city === "Gift City"} onClick={() => handleCityToggle("Gift City")}>Gift City</PillButton>
                </FilterBlock>

                {/* CONDITIONAL LOCALITY */}
                {(filters.city === "Gandhinagar" || filters.city === "Ahmedabad") && (
                   <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <FilterBlock title={`Locality (${filters.city})`}>
                         {CITY_AREAS[filters.city].map(area => (
                            <PillButton key={area} active={filters.localities.includes(area)} onClick={() => handleLocalityToggle(area)}>
                               {area}
                            </PillButton>
                         ))}
                      </FilterBlock>
                   </div>
                )}

                <div className="pt-1">
                   <div className="flex justify-between items-center mb-2">
                      <div className="text-[11px] font-semibold text-slate-500">Budget</div>
                      <div className="text-[10px] text-slate-400 font-medium">₹{filters.priceMin} Cr - ₹{filters.priceMax}+ Cr</div>
                   </div>
                   <DualRangeSlider 
                      min={0} max={6} step={0.1}
                      minValue={filters.priceMin} maxValue={filters.priceMax}
                      onChange={(min, max) => setFilters(prev => ({...prev, priceMin: min, priceMax: max}))}
                   />
                </div>

                <FilterBlock title="Listed by">
                    <PillButton active={filters.listedBy === "owner"} onClick={() => setFilters(f => ({...f, listedBy: f.listedBy === "owner" ? "any" : "owner"}))}>Direct Owner</PillButton>
                    <PillButton active={filters.listedBy === "partner"} onClick={() => setFilters(f => ({...f, listedBy: f.listedBy === "partner" ? "any" : "partner"}))}>Agent listed</PillButton>
                </FilterBlock>
                
                <FilterBlock title="Property type">
                    {["Apartment", "Villa", "Bungalow", "Plot"].map((type) => (
                        <PillButton key={type} active={filters.propertyType === type} onClick={() => setFilters((f) => ({...f, propertyType: f.propertyType === type ? "any" : (type as PropertyType)}))}>{type}</PillButton>
                    ))}
                </FilterBlock>

                <FilterBlock title="Bedrooms">
                    {["1+", "2+", "3+", "4+"].map((label, idx) => (
                        <PillButton key={label} active={filters.minBedrooms === idx + 1} onClick={() => setFilters((f) => ({...f, minBedrooms: f.minBedrooms === idx + 1 ? 0 : idx + 1}))}>{label}</PillButton>
                    ))}
                </FilterBlock>

                <FilterBlock title="Furnishing">
                    {["Unfurnished", "Semi-furnished", "Fully furnished"].map((label) => (
                    <PillButton key={label} active={filters.furnishing === label} onClick={() => setFilters((f) => ({...f, furnishing: f.furnishing === label ? "any" : (label as Listing["furnishing"])}))}>{label}</PillButton>
                    ))}
                </FilterBlock>

                </div>
            </div>
          </aside>

          {/* LISTINGS */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                {filters.city !== "any" ? `Showing properties in ${filters.city}` : "Showing all properties"}
              </h2>
              <span className="text-xs font-medium text-slate-500">
                {filteredListings.length} listings • Updated just now
              </span>
            </div>

            <div className="space-y-3">
              {/* If empty while hydrating, you might see nothing for a millisecond, then random list appears */}
              {filteredListings.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                No properties match your filters yet.
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

/* ===== CUSTOM COMPONENTS ===== */

const DualRangeSlider = ({ min, max, step, minValue, maxValue, onChange }: { 
    min: number; max: number; step: number; minValue: number; maxValue: number; onChange: (min: number, max: number) => void 
}) => {
    const minRef = useRef<HTMLInputElement>(null);
    const maxRef = useRef<HTMLInputElement>(null);
    const range = useRef<HTMLDivElement>(null);

    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    useEffect(() => {
        if (maxRef.current && range.current) {
            const minPercent = getPercent(minValue);
            const maxPercent = getPercent(maxValue);

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minValue, maxValue, getPercent]);

    return (
        <div className="relative w-full h-4 flex items-center group">
            <input type="range" min={min} max={max} step={step} value={minValue} ref={minRef} onChange={(event) => { const value = Math.min(Number(event.target.value), maxValue - step); onChange(value, maxValue); }} className="absolute z-20 w-full h-full opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4" style={{zIndex: minValue > max - 100 ? 5 : undefined}} />
            <input type="range" min={min} max={max} step={step} value={maxValue} ref={maxRef} onChange={(event) => { const value = Math.max(Number(event.target.value), minValue + step); onChange(minValue, value); }} className="absolute z-20 w-full h-full opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4" />
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 rounded-full z-10">
                <div ref={range} className="absolute h-1 bg-[#007F6D] rounded-full z-10"></div>
                <div className="absolute h-4 w-4 bg-[#007F6D] rounded-full -translate-x-1/2 -top-[6px] shadow-sm z-20 pointer-events-none" style={{ left: `${getPercent(minValue)}%` }} />
                <div className="absolute h-4 w-4 bg-[#007F6D] rounded-full -translate-x-1/2 -top-[6px] shadow-sm z-20 pointer-events-none" style={{ left: `${getPercent(maxValue)}%` }} />
            </div>
        </div>
    );
};


/* ===== UI Helpers ===== */

interface SortDropdownProps { value: SortOption; onChange: (value: SortOption) => void; }

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const options: { label: string; value: SortOption }[] = [ { label: "Price (low to high)", value: "PriceLowHigh" }, { label: "Price (high to low)", value: "PriceHighLow" }, { label: "Size (small to large)", value: "SizeLowHigh" }, { label: "Size (large to small)", value: "SizeHighLow" }, { label: "Oldest to newest", value: "Oldest" }, { label: "Newest to oldest", value: "Newest" }, ];
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
      <button onClick={() => setIsOpen(!isOpen)} className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"> <line x1="21" x2="14" y1="4" y2="4" /> <line x1="10" x2="3" y1="4" y2="4" /> <line x1="21" x2="12" y1="12" y2="12" /> <line x1="8" x2="3" y1="12" y2="12" /> <line x1="21" x2="16" y1="20" y2="20" /> <line x1="12" x2="3" y1="20" y2="20" /> </svg>
        <span>Sort by: <span className="font-semibold text-slate-900 capitalize">{selectedLabel}</span></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right animate-in fade-in zoom-in-95 duration-100 rounded-xl border border-slate-100 bg-white p-1 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col">
            {options.map((option) => (
              <button key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors capitalize ${ value === option.value ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900" }`}>
                {option.label}
                {value === option.value && ( <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface SmartDropdownProps { label: string; options: { value: string; label: string }[]; value: string; onChange: (value: string) => void; }

const SmartDropdown: React.FC<SmartDropdownProps> = ({ label, options, value, onChange, }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) { setIsOpen(false); }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : "Any";
  const isActive = value !== "any";

  return (
    <div className="relative flex-1 min-w-[140px]" ref={wrapperRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={`group flex h-8 w-full items-center justify-between rounded-full border px-3 transition-all duration-200 ${ isOpen ? "border-emerald-500 ring-1 ring-emerald-500 bg-white" : isActive ? "border-emerald-200 bg-emerald-50/30 hover:border-emerald-300" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50" }`}>
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="shrink-0 text-xs font-medium text-slate-500">{label}</span>
          <span className="h-3 w-px bg-slate-200"></span>
          <span className={`truncate text-sm ${isActive ? "font-semibold text-emerald-900" : "text-slate-700"}`}>{displayLabel}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-2 h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-emerald-600" : ""}`}> <path d="m6 9 6 6 6-6" /> </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[180px] origin-top-left animate-in fade-in zoom-in-95 duration-100 rounded-xl border border-slate-100 bg-white p-1 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col">
            {options.map((option) => (
              <button key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${ value === option.value ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900" }`}>
                {option.label}
                {value === option.value && ( <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function BadgeDot({ color, children }: { color: string; children: React.ReactNode; }) {
  return ( <span className="flex items-center gap-1"> <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} /> {children} </span> );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode; }) {
  return ( <div> <div className="text-[11px] font-semibold text-slate-500">{title}</div> <div className="mt-2 flex flex-wrap gap-1.5">{children}</div> </div> );
}

function PillButton({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void; }) {
  return ( <button type="button" onClick={onClick} className={`rounded-full px-3 py-1 text-[11px] transition-colors ${ active ? "border border-[#0B8A72] bg-[#E5F6F2] font-medium text-[#0B6754]" : "border border-slate-200 bg-white text-slate-600 hover:border-[#0B8A72]/60" }`}> {children} </button> );
}

function themeForTier(tier: Tier) {
  const exclusive = { 
      badge: "bg-[#DCCEB9] text-[#5A4A2E] shadow-sm", 
      priceChip: "bg-white text-[#5A4A2E] border border-[#E6D9C4] shadow-sm", 
      tagBg: "bg-[#F5EFE7] text-[#6B5A41] border border-[#E6D9C4]", 
      viewBtn: "bg-[#BFA97F] hover:bg-[#a89064] text-white shadow", 
      cardAccent: "ring-1 ring-[#EAE0CF]/40", 
      cardBg: "bg-gradient-to-r from-[#E8DEC9] to-white" 
  };
  
  // UPDATED: Featured tier now uses the Bluish/Teal theme from your Carousel
  const featured = { 
      badge: "bg-[#0F7F9C] text-white shadow-sm", // Teal badge
      priceChip: "bg-white text-[#0F7F9C] border border-sky-100 shadow-sm", // Teal text
      tagBg: "bg-[#e0f2ff] text-[#0F7F9C] border border-[#bfe0ff]", // Light blue bg, teal text
      viewBtn: "bg-gradient-to-r from-[#0F7F9C] to-[#022F5A] text-white shadow hover:opacity-90", // Gradient button
      cardAccent: "ring-1 ring-sky-200", 
      cardBg: "bg-gradient-to-r from-[#f0f9ff] to-white" // Subtle blue tint
  };
  
  const regular = { 
      badge: "bg-[#004D40] text-white", 
      priceChip: "bg-white text-slate-800 border border-slate-100 shadow-sm", 
      tagBg: "bg-[#E5F6F2] text-[#006B5B]", 
      viewBtn: "bg-[#0F4C3E] hover:bg-[#0b3b30] text-white shadow", 
      cardAccent: "", 
      cardBg: "bg-white" 
  };
  
  if (tier === "exclusive") return exclusive;
  if (tier === "featured") return featured;
  return regular;
}

function tierLabel(tier: Tier) {
  if (tier === "exclusive") return "Exclusive";
  if (tier === "featured") return "Featured";
  return "";
}

function ListingCard({ item }: { item: Listing }) {
  const isOwner = item.source === "owner";
  const theme = themeForTier(item.tier);
  return (
    <article className={`relative overflow-hidden flex flex-col md:flex-row gap-3 md:gap-5 p-3 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${theme.cardAccent} ${theme.cardBg ? theme.cardBg : "bg-white"}`}>
      {item.tier === "featured" && ( 
          // UPDATED: Accent bar for featured is now blue-ish
          <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl bg-gradient-to-b from-[#e0f2ff] to-[#f0f9ff] pointer-events-none" /> 
      )}
      <div className="w-full md:w-[288px] h-[190px] relative rounded-xl overflow-hidden shrink-0 bg-slate-100">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        {tierLabel(item.tier) && ( <span className={`absolute top-3 left-3 px-3 py-1 text-[11px] font-semibold rounded-full ${theme.badge}`}> {tierLabel(item.tier)} </span> )}
        <div className="absolute left-4 bottom-4"> <span className={`px-3 py-1.5 text-[13px] rounded-lg font-semibold ${theme.priceChip}`}> {item.priceLabel} </span> </div>
        <div className="absolute top-3 right-3"> {isOwner ? ( <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/95 backdrop-blur-sm text-green-700 text-[10px] font-bold shadow-sm"> <ShieldCheck className="w-3 h-3" /> Direct Owner </span> ) : ( <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/95 backdrop-blur-sm text-blue-700 text-[10px] font-bold shadow-sm"> <ShieldCheck className="w-3 h-3" /> Agent listed </span> )} </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div> <h3 className="text-lg font-bold text-slate-900 leading-tight"> {item.title} </h3> </div>
        <div className="flex flex-wrap gap-2"> <span className="px-3 py-1.5 bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 border border-slate-100"> {item.bedrooms > 0 ? `${item.bedrooms} BHK` : "Plot"} • {item.bathrooms > 0 ? `${item.bathrooms} Bath` : ""} </span> <span className="px-3 py-1.5 bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 border border-slate-100"> {item.areaSqft.toLocaleString()} sq ft </span> </div>
        <div className="flex flex-wrap gap-2"> <span className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-slate-600 border border-slate-200"> {item.type} • {item.furnishing} </span> <span className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-slate-600 border border-slate-200"> {item.locality}, {item.city} </span> </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-slate-500"> <div className="flex items-center gap-1.5"> <Clock className="w-4 h-4 text-slate-400" /> <span>{item.readyStatus}</span> </div> <div className="flex items-center gap-1.5"> <Car className="w-4 h-4 text-slate-400" /> <span>{item.parking} Parking</span> </div> <div className="flex items-center gap-1.5"> <Calendar className="w-4 h-4 text-slate-400" /> <span>Age: {item.ageLabel}</span> </div> </div>
        <div className="flex flex-wrap gap-2 mt-auto"> {item.tags.map((tag) => ( <span key={tag} className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${theme.tagBg}`}> {tag} </span> ))} </div>
        <div className="text-[11px] text-slate-400 pt-1"> Media & docs • {item.media} </div>
      </div>
      <div className="w-full md:w-48 shrink-0 flex flex-col justify-between md:border-l md:border-slate-100 md:pl-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
        <div> <div className="text-xs font-medium text-slate-500">Price</div> <div className="text-xl font-bold text-slate-900 mt-0.5"> {item.priceLabel} </div> <div className="mt-2"> <div className="text-xs text-slate-500">Seller access</div> <div className="text-xs font-medium text-slate-700 mt-0.5">{item.phoneMasked}</div> <div className="text-[10px] text-slate-400 leading-tight">full number after subscription</div> </div> </div>
        <div className="flex flex-col gap-2 mt-4"> <button className={`w-full py-2 rounded-full text-white text-sm font-bold shadow-sm transition-all active:scale-95 ${theme.viewBtn}`}> View details </button> <button className="w-full py-2 rounded-full border border-slate-300 bg-white hover:border-slate-400 text-slate-800 text-sm font-bold transition-all active:scale-95"> Unlock seller </button> </div>
      </div>
    </article>
  );
}