"use client";

import React, { useState, useRef } from "react";
import Footer from "@/components/Footer";
import { Plus, Minus, ArrowLeft } from "lucide-react";

// --- TYPES ---
type Tier = "exclusive" | "featured" | "regular";
type PropertyType = "Apartment" | "Tenement" | "Bungalow" | "Penthouse" | "Plot" | "Shop" | "Office";

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
}

// --- COMPONENT DEFINITIONS ---
function InteractiveMap({ listings }: { listings: Listing[] }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.5, 4));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.5, 1));

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

  const getPinColor = (tier: Tier) => {
    if (tier === "exclusive") return "#DCCEB9";
    if (tier === "featured") return "#0F7F9C";
    return "#004D40";
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden bg-[#eef0f2] cursor-grab active:cursor-grabbing group"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div
        className="w-full h-full absolute top-0 left-0 transition-transform duration-100 ease-out origin-center"
        style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
      >
        <div className="absolute inset-[-100%] w-[300%] h-[300%] opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <svg className="absolute inset-0 w-full h-full text-slate-300 pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
          <path d="M-500 200 Q 400 600 1200 200 T 2000 400" stroke="currentColor" strokeWidth="20" fill="none" />
          <path d="M500 -200 Q 400 500 200 1500" stroke="currentColor" strokeWidth="15" fill="none" />
        </svg>

        {listings.map((l) => {
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
                  <div className="w-4 h-4 bg-white absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 shadow-sm border-r border-b border-slate-100"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-40">
        <button onClick={handleZoomIn} className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
        <button onClick={handleZoomOut} className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Minus className="w-5 h-5" />
        </button>
      </div>

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

const MapComponent: React.FC<MapProps> = ({ listings, onBack, FilterSidebar }) => {
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
          <InteractiveMap listings={listings} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MapComponent;