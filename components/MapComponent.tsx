"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Footer from "@/components/Footer";
import { Plus, Minus, ArrowLeft } from "lucide-react";

declare global {
  interface Window {
    L?: any;
  }
}

// --- TYPES ---
type Tier = "exclusive" | "featured" | "regular";
type PropertyType = "Apartment" | "Tenement" | "Bungalow" | "Penthouse" | "Plot" | "Shop" | "Office";

interface Listing {
  id: number;
  propertyId?: string;
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

const LEAFLET_CSS_ID = "leaflet-css";
const LEAFLET_JS_ID = "leaflet-js";

const loadLeaflet = async (): Promise<any> => {
  if (typeof window === "undefined") return null;
  if (window.L) return window.L;

  const existingCss = document.getElementById(LEAFLET_CSS_ID);
  if (!existingCss) {
    const link = document.createElement("link");
    link.id = LEAFLET_CSS_ID;
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);
  }

  const existingJs = document.getElementById(LEAFLET_JS_ID) as HTMLScriptElement | null;
  if (existingJs) {
    await new Promise<void>((resolve, reject) => {
      existingJs.addEventListener("load", () => resolve());
      existingJs.addEventListener("error", () => reject(new Error("Failed to load Leaflet")));
    });
    return window.L;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = LEAFLET_JS_ID;
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Leaflet"));
    document.body.appendChild(script);
  });

  return window.L;
};

const geocodeNominatim = async (q: string): Promise<LatLng | null> => {
  const query = q.trim();
  if (!query) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "Accept": "application/json"
    }
  });
  if (!res.ok) return null;
  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (!data?.length) return null;

  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
};

function InteractiveMap({ listings, onSelectProperty }: { listings: Listing[]; onSelectProperty?: (propertyId: string) => void }) {
  const containerId = useMemo(() => `leaflet-map-${Math.random().toString(16).slice(2)}`, []);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const tempSearchMarkerRef = useRef<any>(null);
  const geocodeCacheRef = useRef<Map<string, LatLng | null>>(new Map());

  const [isReady, setIsReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const getPinColor = (tier: Tier) => {
    if (tier === "exclusive") return "#DCCEB9";
    if (tier === "featured") return "#0F7F9C";
    return "#004D40";
  };

  useEffect(() => {
    let canceled = false;

    const init = async () => {
      try {
        const L = await loadLeaflet();
        if (!L || canceled) return;

        if (mapRef.current) {
          setIsReady(true);
          return;
        }

        const map = L.map(containerId, {
          zoomControl: false,
          attributionControl: true
        }).setView([23.2156, 72.6369], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: " OpenStreetMap contributors"
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapRef.current = map;
        setIsReady(true);
      } catch {
        setIsReady(false);
      }
    };

    init();

    return () => {
      canceled = true;
      try {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      } catch {
        mapRef.current = null;
      }
    };
  }, [containerId]);

  useEffect(() => {
    let canceled = false;

    const renderMarkers = async () => {
      if (!isReady || !mapRef.current || !markersLayerRef.current) return;

      const L = window.L;
      if (!L) return;

      markersLayerRef.current.clearLayers();

      // Safety cap: limit to 100 markers to prevent abuse and excessive load on Nominatim
      const toGeocode = listings.slice(0, 100);
      for (const l of toGeocode) {
        if (canceled) return;

        const q = `${l.locality}, ${l.city}, Gujarat, India`;
        let coords = geocodeCacheRef.current.get(q);
        if (coords === undefined) {
          try {
            coords = await geocodeNominatim(q);
          } catch {
            coords = null;
          }
          geocodeCacheRef.current.set(q, coords);
          await new Promise((r) => setTimeout(r, 250));
        }

        if (!coords) continue;

        const color = getPinColor(l.tier);
        const iconHtml = `
          <div style="position: relative; transform: translate(-50%, -100%);">
            <svg width="34" height="44" viewBox="0 0 384 512" fill="${color}" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 6px 10px rgba(0,0,0,0.25));">
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
            </svg>
            <div style="position:absolute; top:11px; left:9px; width:16px; height:16px; border-radius:9999px; background:#fff;"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: "",
          iconSize: [34, 44],
          iconAnchor: [17, 44]
        });

        const marker = L.marker([coords.lat, coords.lng], { icon });
        marker.on("click", () => {
          const targetId = l.propertyId || String(l.id);
          onSelectProperty?.(targetId);
        });
        marker.bindPopup(
          `<div style="width:240px">
            <div style="font-weight:700; font-size:14px; color:#0f172a; margin-bottom:4px;">${String(l.title).replace(/</g, "&lt;")}</div>
            <div style="font-size:11px; color:#64748b; margin-bottom:8px;">${String(l.locality).replace(/</g, "&lt;")}, ${String(l.city).replace(/</g, "&lt;")}</div>
            <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid #f1f5f9; padding-top:8px;">
              <div style="font-weight:800; font-size:14px; color:#0f172a;">${String(l.priceLabel).replace(/</g, "&lt;")}</div>
              <div style="font-size:11px; color:#64748b;">${l.bedrooms} Bed • ${l.areaSqft} sqft</div>
            </div>
          </div>`
        );
        marker.addTo(markersLayerRef.current);
      }
    };

    renderMarkers();

    return () => {
      canceled = true;
    };
  }, [isReady, listings]);

  const handleZoomIn = () => {
    if (!mapRef.current) return;
    mapRef.current.setZoom(mapRef.current.getZoom() + 1);
  };

  const handleZoomOut = () => {
    if (!mapRef.current) return;
    mapRef.current.setZoom(mapRef.current.getZoom() - 1);
  };

  const handleSearch = async () => {
    if (!mapRef.current) return;
    const q = searchQuery.trim();
    if (!q) return;
    setSearchError(null);
    setIsSearching(true);
    try {
      const coords = await geocodeNominatim(q);
      if (!coords) {
        setSearchError("Location not found");
        return;
      }
      mapRef.current.setView([coords.lat, coords.lng], Math.max(mapRef.current.getZoom(), 13));

      const L = window.L;
      if (L) {
        if (tempSearchMarkerRef.current) {
          tempSearchMarkerRef.current.remove();
          tempSearchMarkerRef.current = null;
        }
        tempSearchMarkerRef.current = L.circleMarker([coords.lat, coords.lng], {
          radius: 8,
          color: "#0f172a",
          weight: 2,
          fillColor: "#ffffff",
          fillOpacity: 1
        }).addTo(mapRef.current);
      }
    } catch {
      setSearchError("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#eef0f2]">
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center gap-2">
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
            <div className="mt-1 text-[11px] text-rose-600 font-medium">{searchError}</div>
          )}
        </div>
      </div>

      <div id={containerId} className="absolute inset-0" />

      <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-40">
        <button onClick={handleZoomIn} className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
        <button onClick={handleZoomOut} className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Minus className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-[72px] left-6 z-30 flex gap-2 pointer-events-none">
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
        <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
      </svg>
      <div className="absolute top-[13px] left-[11px] w-[22px] h-[22px] bg-white rounded-full shadow-inner" />
    </div>
  );
}

const MapComponent: React.FC<MapProps> = ({ listings, onBack, FilterSidebar, onSelectProperty }) => {
  return (
    <div className="fixed inset-0 top-[64px] z-40 bg-[#F7F6F4] p-4 flex flex-col h-full overflow-y-auto animate-in fade-in duration-300">
      <div className="flex-1 flex gap-4">
        <div className="w-[300px] shrink-0 h-full flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-white/60 relative z-30">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-white/50 backdrop-blur-sm">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Map Search</h1>
              <p className="text-[10px] text-slate-500 font-medium">{listings.length} properties found</p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {FilterSidebar}
          </div>
        </div>

        <div className="flex-1 min-h-[80vh] rounded-3xl overflow-hidden shadow-xl border border-white/60 relative bg-slate-200 z-20">
          <InteractiveMap listings={listings} onSelectProperty={onSelectProperty} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MapComponent;