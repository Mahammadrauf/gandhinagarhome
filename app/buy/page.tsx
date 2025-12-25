"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  MapPin, Clock, Car, Calendar, Map as MapIcon, 
  ShieldCheck, X, List, Plus, Minus, ArrowLeft, Filter 
} from "lucide-react";

// --- TYPES ---
type Tier = "exclusive" | "featured" | "regular";
type PropertyType = "Apartment" | "Tenement" | "Bungalow" | "Penthouse" | "Plot" | "Shop" | "Office";
type Possession = "Ready to move" | "After 1 Month" | "After 2 Months" | "After 3 Months" | "Above 3 Months";

type PriceRangeValue = 
  | "any" 
  | "0-50L" 
  | "50L-1Cr" 
  | "1Cr-1.5Cr" 
  | "1.5Cr+";

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
  source: "owner" | "partner" | "builder";
  title: string;
  locality: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  areaDisplay?: string;
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
  listedBy: "any" | "owner" | "partner" | "builder"; 
  minBedrooms: number; 
  minBathrooms: number;
  furnishing: "any" | Listing["furnishing"];
  minParking: number;
  amenities: string[];
  sizeMin: string;
  sizeMax: string;
}

// --- DATA CONSTANTS ---
const CITY_AREAS: Record<string, string[]> = {
  Gandhinagar: ["Raysan", "Randesan", "Sargasan", "Kudasan", "Koba", "Sectors"],
  Ahmedabad: ["Motera", "Chandkheda", "Zundal", "Adalaj", "Bhat", "Tapovan", "Vaishnodevi"],
};

// --- FULL DATASET (RESTORED ALL PROPERTIES) ---
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
    areaDisplay: "3400 sq ft",
    type: "Bungalow",
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
    type: "Bungalow",
    furnishing: "Fully furnished",
    readyStatus: "After 1 Month",
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
    type: "Penthouse",
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
    source: "builder", 
    title: "Ambli-Bopal Luxury Apartment",
    locality: "Bhat", 
    city: "Ahmedabad",
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: 5500,
    type: "Apartment",
    furnishing: "Fully furnished",
    readyStatus: "After 2 Months",
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
    type: "Bungalow",
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
    readyStatus: "After 3 Months",
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
    title: "Zundal Elegant Tenement",
    locality: "Zundal",
    city: "Ahmedabad",
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 2800,
    type: "Tenement",
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
    type: "Bungalow",
    furnishing: "Fully furnished",
    readyStatus: "After 2 Months",
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
    readyStatus: "Ready to move",
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
    type: "Tenement",
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
    readyStatus: "Above 3 Months",
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
    type: "Bungalow",
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
    source: "builder",
    title: "Gift City Office Space",
    locality: "Gift City",
    city: "Gift City",
    bedrooms: 0,
    bathrooms: 1,
    areaSqft: 800,
    type: "Office",
    furnishing: "Unfurnished",
    readyStatus: "Ready to move",
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

  // === REGULAR PROPERTIES ===
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
    readyStatus: "After 2 Months",
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
    readyStatus: "Ready to move",
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
  sizeMin: "",
  sizeMax: "",
};

const getTierWeight = (tier: Tier) => {
  if (tier === "exclusive") return 3;
  if (tier === "featured") return 2;
  return 1; 
};

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
  const [rotatedListings, setRotatedListings] = useState<Listing[]>([]);
  
  // NEW: Toggle for Map View
  const [isMapView, setIsMapView] = useState(false);

  // --- ROTATION LOGIC (RESTORES YOUR 10-PROPERTY MIX) ---
  useEffect(() => {
    // Filter by tiers from the full dataset
    const exclusive = ALL_LISTINGS.filter(l => l.tier === "exclusive");
    const featured = ALL_LISTINGS.filter(l => l.tier === "featured");
    const regular = ALL_LISTINGS.filter(l => l.tier === "regular");

    // Logic: Select 2 Exclusive + 2 Featured + All 6 Regular = 10 items displayed initially
    const selectedExclusive = shuffleArray(exclusive).slice(0, 2);
    const selectedFeatured = shuffleArray(featured).slice(0, 2);

    const combined = [...selectedExclusive, ...selectedFeatured, ...regular];
    setRotatedListings(combined);
  }, []);

  const handleClearFilters = () => setFilters(initialFilters);

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
    // If Map View is active, we might want to search against ALL_LISTINGS to populate map?
    // But per your request, we stick to the 10 rotated ones or the full list?
    // Usually map search shows MORE. Let's use the rotatedListings to keep the "10 properties" 
    // count consistent with your complaint, unless filters are applied.
    
    // However, if the user starts filtering, they expect to see results from ALL data.
    // For this specific request ("I had 10 properties... I want that back"), 
    // we default to rotatedListings. If filters are active, we search ALL.
    const hasFilters = filters.city !== "any" || filters.priceRange !== "any" || filters.propertyType !== "any";
    const sourceData = hasFilters ? ALL_LISTINGS : (rotatedListings.length > 0 ? rotatedListings : []);

    let result = sourceData.filter((l) => {
      if (filters.location.trim()) {
        const q = filters.location.toLowerCase().trim();
        const locString = `${l.locality} ${l.city}`.toLowerCase();
        if (!locString.includes(q)) return false;
      }
      if (filters.city !== "any" && l.city !== filters.city) return false;
      if (filters.localities.length > 0 && !filters.localities.includes(l.locality)) return false;
      if (filters.propertyType !== "any" && l.type !== filters.propertyType) return false;
      if (filters.priceRange !== "any") {
        const price = l.priceCr;
        if (filters.priceRange === "0-50L" && !(price > 0 && price <= 0.5)) return false;
        if (filters.priceRange === "50L-1Cr" && !(price > 0.5 && price <= 1)) return false;
        if (filters.priceRange === "1Cr-1.5Cr" && !(price > 1 && price <= 1.5)) return false;
        if (filters.priceRange === "1.5Cr+" && !(price > 1.5)) return false;
      }
      if (filters.possession !== "any" && l.readyStatus !== filters.possession) return false;
      if (filters.listedBy !== "any") {
          if (filters.listedBy === "owner" && l.source !== "owner") return false;
          if (filters.listedBy === "partner" && l.source !== "partner") return false;
          if (filters.listedBy === "builder" && l.source !== "builder") return false;
      }
      if (filters.minBedrooms > 0 && l.bedrooms < filters.minBedrooms) return false;
      if (l.bathrooms < filters.minBathrooms) return false;
      if (l.parking < filters.minParking) return false;
      if (filters.furnishing !== "any" && l.furnishing !== filters.furnishing) return false;

      return true;
    });

    result = [...result].sort((a, b) => {
      const weightA = getTierWeight(a.tier);
      const weightB = getTierWeight(b.tier);
      if (weightA !== weightB) return weightB - weightA; 

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

  // --- COMPONENT CHUNKS ---
  
  // 1. Sidebar Filter Component (Reusable)
  const FilterSidebarContent = () => (
    <div className="bg-white px-4 py-5 text-xs text-slate-700 shadow-sm h-full flex flex-col">
        <div className="flex items-start justify-between gap-2">
        <div>
            <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
            <p className="text-[11px] text-slate-500">Refine your search results.</p>
        </div>
        <button onClick={handleClearFilters} className="text-[11px] font-medium text-[#006B5B]">
            Clear all
        </button>
        </div>

        <div className="mt-4 space-y-5 overflow-y-auto custom-scrollbar flex-1 pr-1">
        
        <FilterBlock title="City">
            <PillButton active={filters.city === "Gandhinagar"} onClick={() => handleCityToggle("Gandhinagar")}>Gandhinagar</PillButton>
            <PillButton active={filters.city === "Ahmedabad"} onClick={() => handleCityToggle("Ahmedabad")}>Ahmedabad</PillButton>
            <PillButton active={filters.city === "Gift City"} onClick={() => handleCityToggle("Gift City")}>Gift City</PillButton>
        </FilterBlock>

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

        <FilterBlock title="Budget">
            <PillButton active={filters.priceRange === "0-50L"} onClick={() => setFilters(f => ({...f, priceRange: f.priceRange === "0-50L" ? "any" : "0-50L"}))}>₹0 - 50L</PillButton>
            <PillButton active={filters.priceRange === "50L-1Cr"} onClick={() => setFilters(f => ({...f, priceRange: f.priceRange === "50L-1Cr" ? "any" : "50L-1Cr"}))}>₹50L - 1Cr</PillButton>
            <PillButton active={filters.priceRange === "1Cr-1.5Cr"} onClick={() => setFilters(f => ({...f, priceRange: f.priceRange === "1Cr-1.5Cr" ? "any" : "1Cr-1.5Cr"}))}>₹1Cr - 1.5Cr</PillButton>
            <PillButton active={filters.priceRange === "1.5Cr+"} onClick={() => setFilters(f => ({...f, priceRange: f.priceRange === "1.5Cr+" ? "any" : "1.5Cr+"}))}>Above 1.5Cr</PillButton>
        </FilterBlock>

        <FilterBlock title="Listed by">
            <PillButton active={filters.listedBy === "owner"} onClick={() => setFilters(f => ({...f, listedBy: f.listedBy === "owner" ? "any" : "owner"}))}>Direct Owner</PillButton>
            <PillButton active={filters.listedBy === "partner"} onClick={() => setFilters(f => ({...f, listedBy: f.listedBy === "partner" ? "any" : "partner"}))}>Agent</PillButton>
            <PillButton active={filters.listedBy === "builder"} onClick={() => setFilters(f => ({...f, listedBy: f.listedBy === "builder" ? "any" : "builder"}))}>Builder</PillButton>
        </FilterBlock>
        
        <FilterBlock title="Property type">
            {["Apartment", "Tenement", "Bungalow", "Penthouse", "Plot", "Shop", "Office"].map((type) => (
                <PillButton key={type} active={filters.propertyType === type} onClick={() => setFilters((f) => ({...f, propertyType: f.propertyType === type ? "any" : (type as PropertyType)}))}>{type}</PillButton>
            ))}
        </FilterBlock>

        <FilterBlock title="Bedrooms">
            {["1", "2", "3", "4", "5", "6"].map((label, idx) => (
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
  );

  // 2. The Search Bar Component (Reusable)
  const TopSearchBar = () => (
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
        <div className="flex flex-col gap-1 sm:flex-row">
            <div className="w-60">
            <SmartDropdown label="City" value={filters.city} onChange={(val) => setFilters((f) => ({ ...f, city: val as any, localities: [] }))} options={[{ value: "any", label: "Any" }, { value: "Gandhinagar", label: "Gandhinagar" }, { value: "Gift City", label: "Gift City" }, { value: "Ahmedabad", label: "Ahmedabad" }]} />
            </div>
            <div className="w-60">
            <SmartDropdown label="Property Type" value={filters.propertyType} onChange={(val) => setFilters((f) => ({ ...f, propertyType: val as any }))} options={[{ value: "any", label: "Any" }, { value: "Apartment", label: "Apartment" }, { value: "Tenement", label: "Tenement" }, { value: "Bungalow", label: "Bungalow" }, { value: "Penthouse", label: "Penthouse" }, { value: "Plot", label: "Plot" }, { value: "Shop", label: "Shop" }, { value: "Office", label: "Office" }]} />
            </div>
            <div className="w-60">
            <SmartDropdown label="Budget" value={filters.priceRange} onChange={(val) => setFilters((f) => ({ ...f, priceRange: val as any }))} options={[{ value: "any", label: "Any" }, { value: "0-50L", label: "₹0 - ₹50 Lakhs" }, { value: "50L-1Cr", label: "₹50L - ₹1 Cr" }, { value: "1Cr-1.5Cr", label: "₹1 Cr - ₹1.5 Cr" }, { value: "1.5Cr+", label: "Above ₹1.5 Cr" }]} />
            </div>
            <div className="w-60">
            <SmartDropdown label="Possession" value={filters.possession} onChange={(val) => setFilters((f) => ({ ...f, possession: val as any }))} options={[{ value: "any", label: "Any" }, { value: "Ready to move", label: "Ready to Move" }, { value: "After 1 Month", label: "After 1 Month" }, { value: "After 2 Months", label: "After 2 Months" }, { value: "After 3 Months", label: "After 3 Months" }, { value: "Above 3 Months", label: "Above 3 Months" }]} />
            </div>
        </div>
        <button className="h-8 shrink-0 rounded-full bg-[#006B5B] px-5 text-sm font-semibold text-white shadow transition-all hover:bg-[#005347] active:scale-95 mt-1 lg:mt-0 lg:ml-2">
            Search
        </button>
        </div>

        <div className="mt-3 flex flex-col gap-1 border-t border-slate-100 pt-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-1">
                {/* Info Pills */}
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Order: Exclusive first, then Featured, then all others.
                </div>
            </div>

            <div className="relative mt-0.5 lg:mt-0 flex items-center gap-2">
               {/* SHOW LIST VIEW BUTTON IF IN MAP MODE */}
               {isMapView && (
                   <button onClick={() => setIsMapView(false)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50">
                        <List className="w-3.5 h-3.5" />
                        List View
                   </button>
               )}
               <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
        </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F5F7F9] overflow-hidden flex flex-col font-sans">
      <Header />

      {/* CONDITIONAL LAYOUT: STANDARD vs MAP SPLIT */}
      {!isMapView ? (
          // === STANDARD GRID VIEW ===
          <section className="w-full px-3 sm:px-4 lg:px-6 xl:px-10 py-6 overflow-y-auto flex-1">
            <TopSearchBar />

            <div className="mt-2 grid gap-3 md:grid-cols-[270px,1fr]">
                <aside className="h-fit">
                    {/* View on Map Trigger */}
                    <div onClick={() => setIsMapView(true)} className="mb-3 w-full aspect-square rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden relative group cursor-pointer shadow-sm">
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

                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                        <FilterSidebarContent />
                    </div>
                </aside>

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
      ) : (
          // === NEW TRENDY MAP VIEW LAYOUT ===
          <div className="fixed inset-0 top-[64px] z-40 bg-[#F7F6F4] p-4 flex flex-col h-full overflow-y-auto animate-in fade-in duration-300">
            
            <div className="flex-1 flex gap-4">
              {/* --- LEFT FILTER CARD --- */}
              {/* White rounded card for filters, separated from map */}
              <div className="w-[300px] shrink-0 h-full flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-white/60 relative z-30">
                 {/* Back Button Header */}
                 <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-white/50 backdrop-blur-sm">
                     <button onClick={() => setIsMapView(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800">
                         <ArrowLeft className="w-5 h-5" />
                     </button>
                     <div>
                         <h1 className="text-lg font-bold text-slate-900 leading-tight">Map Search</h1>
                         <p className="text-[10px] text-slate-500 font-medium">{filteredListings.length} properties found</p>
                     </div>
                 </div>

                 {/* Reuse EXACT Filter Sidebar Content */}
                 <div className="flex-1 overflow-hidden relative">
                     <FilterSidebarContent />
                 </div>
              </div>
      
              {/* --- RIGHT MAP AREA --- */}
              {/* Floating rounded card for the map */}
              <div className="flex-1 min-h-[80vh] rounded-3xl overflow-hidden shadow-xl border border-white/60 relative bg-slate-200 z-20">
                   <InteractiveMap listings={filteredListings} />
              </div>
            </div>

            <Footer />
          </div>
      )}
    </main>
  );
}

/* ===== NEW COMPONENT: INTERACTIVE MAP WITH ZOOM, HOVER POPUP & COLORED PINS ===== */
function InteractiveMap({ listings }: { listings: Listing[] }) {
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const lastPosition = useRef({ x: 0, y: 0 });

    // Handle Zoom
    const handleZoomIn = () => setZoom(z => Math.min(z + 0.5, 4));
    const handleZoomOut = () => setZoom(z => Math.max(z - 0.5, 1));

    // Simple Drag Logic implementation
    const onMouseDown = (e: React.MouseEvent) => {
       isDragging.current = true;
       lastPosition.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: React.MouseEvent) => {
       if (!isDragging.current) return;
       const dx = e.clientX - lastPosition.current.x;
       const dy = e.clientY - lastPosition.current.y;
       setPosition(p => ({ x: p.x + dx, y: p.y + dy }));
       lastPosition.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => isDragging.current = false;

    // Helper for pin colors matching your request
    const getPinColor = (tier: Tier) => {
        if (tier === "exclusive") return "#DCCEB9"; // Gold
        if (tier === "featured") return "#0F7F9C";  // Blueish Teal
        return "#004D40";                           // Green (Standard)
    };

    return (
        <div 
            className="w-full h-full relative overflow-hidden bg-[#eef0f2] cursor-grab active:cursor-grabbing group"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            {/* Map Plane Layer */}
            <div 
                className="w-full h-full absolute top-0 left-0 transition-transform duration-100 ease-out origin-center"
                style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
            >
                {/* Background Grid Pattern (Subtle map texture) */}
                <div className="absolute inset-[-100%] w-[300%] h-[300%] opacity-30 pointer-events-none" 
                     style={{ 
                         backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', 
                         backgroundSize: '40px 40px' 
                     }} 
                />
                
                {/* Simulated Roads/Paths for visual appeal */}
                <svg className="absolute inset-0 w-full h-full text-slate-300 pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-500 200 Q 400 600 1200 200 T 2000 400" stroke="currentColor" strokeWidth="20" fill="none" />
                    <path d="M500 -200 Q 400 500 200 1500" stroke="currentColor" strokeWidth="15" fill="none" />
                </svg>

                {/* Render Pins */}
                {listings.map((l) => {
                    // Stable random position based on ID
                    const top = ((l.id * 17) % 70) + 15; 
                    const left = ((l.id * 31) % 70) + 15;
                    const isHovered = hoveredId === l.id;
                    const color = getPinColor(l.tier);
                    
                    return (
                        <div 
                            key={l.id} 
                            className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200 ${isHovered ? "z-50 scale-110" : "z-20"}`}
                            style={{ top: `${top}%`, left: `${left}%` }}
                            onMouseEnter={() => setHoveredId(l.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <CustomPin color={color} isSelected={isHovered} />

                            {/* --- HOVER POPUP CARD (Anchored to Pin) --- */}
                            {isHovered && (
                                <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[280px] pointer-events-none z-50">
                                    <div className="bg-white rounded-2xl shadow-2xl p-0 overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-2 duration-200">
                                        <div className="h-32 w-full bg-slate-200 relative">
                                            <img src={l.image} className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute top-2 left-2">
                                                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md text-white shadow-sm uppercase tracking-wide ${l.tier === "exclusive" ? "bg-[#DCCEB9] text-[#5A4A2E]" : l.tier === "featured" ? "bg-[#0F7F9C]" : "bg-[#004D40]"}`}>
                                                    {l.tier}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-bold text-sm text-slate-900 leading-tight mb-1 truncate">{l.title}</h3>
                                            <div className="text-[10px] text-slate-500 mb-2">{l.locality}, {l.city}</div>
                                            <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                                                <div className="font-bold text-base text-slate-900">{l.priceLabel}</div>
                                                <div className="text-[10px] font-medium text-slate-500">{l.bedrooms} Bed • {l.areaSqft} sqft</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Triangle Arrow */}
                                    <div className="w-4 h-4 bg-white absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 shadow-sm border-r border-b border-slate-100"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* --- CONTROLS --- */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-40">
                <button onClick={handleZoomIn} className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <Plus className="w-5 h-5" />
                </button>
                <button onClick={handleZoomOut} className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <Minus className="w-5 h-5" />
                </button>
            </div>

            {/* --- LEGEND (Without white box background as requested per "remove white box from exclusive") --- */}
            <div className="absolute top-6 left-6 z-20 flex gap-2 pointer-events-none">
                <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/50 flex items-center gap-3 pointer-events-auto">
                     <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#DCCEB9]"></span> Exclusive
                     </div>
                     <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0F7F9C]"></span> Featured
                     </div>
                     <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#004D40]"></span> Regular
                     </div>
                </div>
            </div>
        </div>
    );
}

// Custom Pin SVG Component
function CustomPin({ color, isSelected }: { color: string; isSelected: boolean }) {
    return (
        <div className={`relative group transition-transform duration-300 ${isSelected ? "scale-125 -translate-y-2" : ""}`}>
            <svg 
                width="44" 
                height="54" 
                viewBox="0 0 384 512" 
                fill={color} 
                className="drop-shadow-lg"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Teardrop shape */}
                <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
            </svg>
            {/* Inner White Circle (The Hole) */}
            <div className="absolute top-[13px] left-[11px] w-[22px] h-[22px] bg-white rounded-full shadow-inner" />
        </div>
    );
}

/* ===== EXISTING CUSTOM COMPONENTS (Unchanged) ===== */

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
  
  const featured = { 
      badge: "bg-[#0F7F9C] text-white shadow-sm", 
      priceChip: "bg-white text-[#0F7F9C] border border-sky-100 shadow-sm", 
      tagBg: "bg-[#e0f2ff] text-[#0F7F9C] border border-[#bfe0ff]", 
      viewBtn: "bg-gradient-to-r from-[#0F7F9C] to-[#022F5A] text-white shadow hover:opacity-90", 
      cardAccent: "ring-1 ring-sky-200", 
      cardBg: "bg-gradient-to-r from-[#CFE5FF] to-[#F0F9FF]" 
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
  const getSourceLabel = () => {
      if (item.source === "owner") return { text: "Direct Owner", colorClass: "text-green-700" };
      if (item.source === "builder") return { text: "Builder Listed", colorClass: "text-purple-700" };
      return { text: "Agent Listed", colorClass: "text-blue-700" };
  };
  const sourceInfo = getSourceLabel();

  return (
    <article className={`relative overflow-hidden flex flex-col md:flex-row gap-3 md:gap-5 p-3 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${theme.cardAccent} ${theme.cardBg ? theme.cardBg : "bg-white"}`}>
      {item.tier === "featured" && ( 
          <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl bg-gradient-to-b from-[#e0f2ff] to-[#f0f9ff] pointer-events-none" /> 
      )}
      <div className="w-full md:w-[288px] h-[190px] relative rounded-xl overflow-hidden shrink-0 bg-slate-100">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        {tierLabel(item.tier) && ( <span className={`absolute top-3 left-3 px-3 py-1 text-[11px] font-semibold rounded-full ${theme.badge}`}> {tierLabel(item.tier)} </span> )}
        <div className="absolute left-4 bottom-4"> <span className={`px-3 py-1.5 text-[13px] rounded-lg font-semibold ${theme.priceChip}`}> {item.priceLabel} </span> </div>
        <div className="absolute top-3 right-3"> 
              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/95 backdrop-blur-sm ${sourceInfo.colorClass} text-[10px] font-bold shadow-sm`}> 
                <ShieldCheck className="w-3 h-3" /> {sourceInfo.text} 
              </span> 
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div> <h3 className="text-lg font-bold text-slate-900 leading-tight"> {item.title} </h3> </div>
        <div className="flex flex-wrap gap-2"> <span className="px-3 py-1.5 bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 border border-slate-100"> {item.bedrooms > 0 ? `${item.bedrooms} BHK` : item.type} • {item.bathrooms > 0 ? `${item.bathrooms} Bath` : ""} </span> <span className="px-3 py-1.5 bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 border border-slate-100"> {item.areaDisplay || `${item.areaSqft.toLocaleString()} sq ft`} </span> </div>
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