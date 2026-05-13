"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

declare global {
  interface Window {
    google?: any;
  }
}

// --- TYPES ---
type Tier = "exclusive" | "featured" | "regular";
type PropertyType =
  | "Apartment"
  | "Tenement"
  | "Bungalow"
  | "Penthouse"
  | "Plot"
  | "Shop"
  | "Office";

interface Listing {
  id: number;
  propertyId?: string;
  slug?: string;
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
  readyStatus: string;
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

interface MapProps {
  listings: Listing[];
  onBack: () => void;
  FilterSidebar: React.ReactNode;
  onSelectProperty?: (propertyId: string) => void;
}

// --- COMPONENT DEFINITIONS ---
type LatLng = { lat: number; lng: number };

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <div className="flex items-center justify-center h-full bg-[#eef0f2]">
        <div className="text-slate-600">Loading Google Maps...</div>
      </div>;
    case Status.FAILURE:
      return <div className="flex items-center justify-center h-full bg-[#eef0f2]">
        <div className="text-red-600">Failed to load Google Maps. Please check your API key.</div>
      </div>;
    case Status.SUCCESS:
      return <div className="w-full h-full" />;
  }
};

const geocodeAddress = async (address: string): Promise<LatLng | null> => {
  if (!window.google || !window.google.maps) return null;
  
  const geocoder = new window.google.maps.Geocoder();
  
  return new Promise((resolve) => {
    geocoder.geocode({ address }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng()
        });
      } else {
        resolve(null);
      }
    });
  });
};

function InteractiveGoogleMap({
  listings,
  onSelectProperty,
}: {
  listings: Listing[];
  onSelectProperty?: (propertyId: string) => void;
}) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const geocodeCacheRef = useRef<Map<string, LatLng | null>>(new Map());
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isReady, setIsReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const getPinColor = (tier: Tier) => {
    if (tier === "exclusive") return "#DCCEB9";
    if (tier === "featured") return "#0F7F9C";
    return "#004D40";
  };

  const createMarkerIcon = (color: string) => {
    return {
      path: "M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z",
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 1,
      strokeColor: '#ffffff',
      scale: 0.1,
      anchor: new google.maps.Point(192, 512),
      labelOrigin: new google.maps.Point(192, 200)
    };
  };

  useEffect(() => {
    if (!window.google || !window.google.maps) return;

    const mapElement = document.getElementById("google-map-buy") as HTMLElement;
    if (!mapElement || mapRef.current) return;

    const map = new window.google.maps.Map(mapElement, {
      center: { lat: 23.2156, lng: 72.6369 },
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    infoWindowRef.current = new window.google.maps.InfoWindow();
    mapRef.current = map;
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || !mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const addMarkers = async () => {
      const toGeocode = listings.slice(0, 100);

      // First, geocode all listings and group them by rounded coordinates
      const groups = new Map<string, Array<{ listing: Listing; coords: LatLng }>>();

      for (const listing of toGeocode) {
        const query = `${listing.locality}, ${listing.city}, Gujarat, India`;
        let coords = geocodeCacheRef.current.get(query);

        if (coords === undefined) {
          coords = await geocodeAddress(query);
          geocodeCacheRef.current.set(query, coords);
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        if (!coords) continue;

        // Use a fixed precision key so nearby identical geocode results group together
        const key = `${coords.lat.toFixed(6)}_${coords.lng.toFixed(6)}`;
        const arr = groups.get(key) || [];
        arr.push({ listing, coords });
        groups.set(key, arr);
      }

      // Place markers. For groups with multiple listings, offset them slightly in a circle
      const offsetRadius = 0.00006; // ~6-7 meters; tweak if needed

      groups.forEach((items) => {
        for (let i = 0; i < items.length; i++) {
          const { listing, coords } = items[i];

          let position = coords;
          if (items.length > 1) {
            const angle = (i * (360 / items.length)) * (Math.PI / 180);
            position = {
              lat: coords.lat + Math.cos(angle) * offsetRadius,
              lng: coords.lng + Math.sin(angle) * offsetRadius,
            };
          }

          const color = getPinColor(listing.tier);
          const icon = createMarkerIcon(color);

          const marker: any = new window.google.maps.Marker({
            position,
            map: mapRef.current,
            icon,
            title: listing.title,
            // removed label (price) so the pin won't show price text
          });
          // store color on marker for later icon updates
          (marker as any).__pinColor = color;

          const infoContent = `
            <div style="width:260px; padding:0; overflow:hidden; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
              <div style="width:100%; height:120px; overflow:hidden;">
                <img src="${listing.image}" alt="${listing.title.replace(/</g, "&lt;")}" style="width:100%; height:100%; object-fit:cover;" />
              </div>
              <div style="padding:12px;">
                <div style="font-weight:700; font-size:14px; color:#0f172a; margin-bottom:4px; line-height:1.2;">${listing.title.replace(/</g, "&lt;")}</div>
                <div style="font-size:11px; color:#64748b; margin-bottom:8px;">${listing.locality.replace(/</g, "&lt;")}, ${listing.city.replace(/</g, "&lt;")}</div>
                <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid #f1f5f9; padding-top:8px;">
                  <div style="font-weight:800; font-size:14px; color:#0f172a;">${listing.priceLabel.replace(/</g, "&lt;")}</div>
                  <div style="font-size:11px; color:#64748b;">${listing.bedrooms} Bed ${listing.areaSqft} sqft</div>
                </div>
              </div>
            </div>
          `;

          // Add hover listeners with delay to prevent flickering
          marker.addListener("mouseover", () => {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }

            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(infoContent);
              infoWindowRef.current.setOptions({
                pixelOffset: new google.maps.Size(0, -20),
                maxWidth: 260,
              });
              infoWindowRef.current.open(mapRef.current, marker);
            }
          });

          marker.addListener("mouseout", () => {
            hoverTimeoutRef.current = setTimeout(() => {
              if (infoWindowRef.current) {
                infoWindowRef.current.close();
              }
            }, 500);
          });

          marker.addListener("click", () => {
            const targetId = listing.slug || listing.propertyId || String(listing.id);
            onSelectProperty?.(targetId);
          });

          markersRef.current.push(marker);
        }
      });

  // No dynamic zoom-based icon updates: icons use a fixed small scale
    };

    addMarkers();
  }, [isReady, listings, onSelectProperty]);

  const handleZoomIn = () => {
    if (!mapRef.current) return;
    const currentZoom = mapRef.current.getZoom();
    if (currentZoom !== undefined) {
      mapRef.current.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (!mapRef.current) return;
    const currentZoom = mapRef.current.getZoom();
    if (currentZoom !== undefined) {
      mapRef.current.setZoom(currentZoom - 1);
    }
  };

  const handleSearch = async () => {
    if (!mapRef.current || !searchQuery.trim()) return;
    
    setSearchError(null);
    setIsSearching(true);
    
    try {
      const coords = await geocodeAddress(searchQuery);
      if (!coords) {
        setSearchError("Location not found");
        return;
      }
      
      mapRef.current.setCenter(coords);
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(Math.max(currentZoom || 12, 13));
    } catch (error) {
      setSearchError("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#eef0f2]">
      <div className="absolute top-4 left-3 right-3 md:left-4 md:right-4 z-40 flex items-center gap-2">
        <div className="flex-1 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 px-3 py-2">
          <div className="flex items-center gap-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search area (e.g. Raysan, Gandhinagar)"
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />
            <button
              onClick={handleSearch}
              disabled={!isReady || isSearching}
              className="h-8 shrink-0 rounded-full bg-[#006B5B] px-4 text-xs font-bold text-white shadow transition-all hover:bg-[#005347] disabled:opacity-60"
            >
              {isSearching ? "Searching" : "Search"}
            </button>
          </div>
          {searchError && (
            <div className="mt-1 text-[11px] text-rose-600 font-medium">
              {searchError}
            </div>
          )}
        </div>
      </div>

      <div id="google-map-buy" className="absolute inset-0" />

      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col gap-2 z-40">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-[72px] left-3 md:left-6 z-30 flex gap-2 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/50 flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DCCEB9]"></span>{" "}
            Exclusive
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F7F9C]"></span>{" "}
            Featured
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004D40]"></span>{" "}
            Regular
          </div>
        </div>
      </div>
    </div>
  );
}

const GoogleMapComponent: React.FC<MapProps> = ({
  listings,
  onBack,
  FilterSidebar,
  onSelectProperty,
}) => {
  const { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_CONFIG } = require('@/app/config/google-maps');

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="fixed inset-0 top-[64px] z-40 bg-[#F7F6F4] p-3 md:p-4 flex flex-col h-full overflow-y-auto">
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-[300px] shrink-0 h-auto md:h-full flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-white/60 relative z-30">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-white/50 backdrop-blur-sm">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  Map Search
                </h1>
                <p className="text-[10px] text-slate-500 font-medium">
                  {listings.length} properties found
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto md:overflow-hidden relative">
              {FilterSidebar}
            </div>
          </div>
          <div className="flex-1 h-[65vh] min-h-[400px] md:min-h-[80vh] rounded-3xl overflow-hidden shadow-xl border border-white/60 relative bg-slate-200 z-20 flex items-center justify-center">
            <div className="text-red-600 text-center p-4">
              Google Maps API key is required. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-[64px] z-40 bg-[#F7F6F4] p-3 md:p-4 flex flex-col h-full overflow-y-auto animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[300px] shrink-0 h-auto md:h-full flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-white/60 relative z-30">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-white/50 backdrop-blur-sm">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Map Search
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">
                {listings.length} properties found
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto md:overflow-hidden relative">
            {FilterSidebar}
          </div>
        </div>

        <div className="flex-1 h-[65vh] min-h-[400px] md:min-h-[80vh] rounded-3xl overflow-hidden shadow-xl border border-white/60 relative bg-slate-200 z-20">
          <Wrapper 
            apiKey={GOOGLE_MAPS_API_KEY} 
            render={render}
            libraries={GOOGLE_MAPS_CONFIG.libraries}
            version={GOOGLE_MAPS_CONFIG.version}
            language={GOOGLE_MAPS_CONFIG.language}
            region={GOOGLE_MAPS_CONFIG.region}
          >
            <InteractiveGoogleMap
              listings={listings}
              onSelectProperty={onSelectProperty}
            />
          </Wrapper>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GoogleMapComponent;
