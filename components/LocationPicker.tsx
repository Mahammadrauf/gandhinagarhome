"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    L?: any;
  }
}

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

const geocodeNominatim = async (q: string): Promise<{ coords: LatLng; displayName?: string } | null> => {
  const query = q.trim();
  if (!query) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });
  if (!res.ok) return null;
  const data = (await res.json()) as Array<{ lat: string; lon: string; display_name?: string }>;
  if (!data?.length) return null;

  return {
    coords: { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) },
    displayName: data[0].display_name
  };
};

const reverseGeocodeNominatim = async (coords: LatLng): Promise<string | null> => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { display_name?: string };
  return data?.display_name || null;
};

export type LocationValue = {
  lat: number | null;
  lng: number | null;
  displayAddress?: string;
};

export default function LocationPicker({
  value,
  onChange,
  defaultCenter = { lat: 23.2156, lng: 72.6369 },
  defaultZoom = 12
}: {
  value: LocationValue;
  onChange: (next: LocationValue) => void;
  defaultCenter?: LatLng;
  defaultZoom?: number;
}) {
  const containerId = useMemo(() => `leaflet-location-picker-${Math.random().toString(16).slice(2)}`, []);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const lastReverseRef = useRef<string | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value.displayAddress || "");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    setSearchQuery(value.displayAddress || "");
  }, [value.displayAddress]);

  const setMarker = async (coords: LatLng, opts?: { updateAddress?: boolean }) => {
    const L = window.L;
    if (!L || !mapRef.current) return;

    if (!markerRef.current) {
      const iconHtml = `
        <div style="position: relative; transform: translate(-50%, -100%);">
          <svg width="34" height="44" viewBox="0 0 384 512" fill="#0b6b53" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 6px 10px rgba(0,0,0,0.25));">
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

      const marker = L.marker([coords.lat, coords.lng], { icon, draggable: true });
      marker.on("dragend", async () => {
        const ll = marker.getLatLng();
        const nextCoords = { lat: ll.lat, lng: ll.lng };

        let nextAddress = value.displayAddress;
        if (opts?.updateAddress !== false) {
          const key = `${nextCoords.lat.toFixed(5)},${nextCoords.lng.toFixed(5)}`;
          if (lastReverseRef.current !== key) {
            lastReverseRef.current = key;
            try {
              const addr = await reverseGeocodeNominatim(nextCoords);
              if (addr) nextAddress = addr;
            } catch {
              // ignore
            }
          }
        }

        onChange({ lat: nextCoords.lat, lng: nextCoords.lng, displayAddress: nextAddress });
      });

      markerRef.current = marker;
      marker.addTo(mapRef.current);
    } else {
      markerRef.current.setLatLng([coords.lat, coords.lng]);
    }

    onChange({ lat: coords.lat, lng: coords.lng, displayAddress: value.displayAddress });

    if (opts?.updateAddress !== false) {
      const key = `${coords.lat.toFixed(5)},${coords.lng.toFixed(5)}`;
      if (lastReverseRef.current !== key) {
        lastReverseRef.current = key;
        try {
          const addr = await reverseGeocodeNominatim(coords);
          if (addr) {
            onChange({ lat: coords.lat, lng: coords.lng, displayAddress: addr });
          }
        } catch {
          // ignore
        }
      }
    }
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
          zoomControl: true,
          attributionControl: true
        }).setView([defaultCenter.lat, defaultCenter.lng], defaultZoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: " OpenStreetMap contributors"
        }).addTo(map);

        map.on("click", async (e: any) => {
          const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
          await setMarker(coords, { updateAddress: true });
        });

        mapRef.current = map;
        setIsReady(true);

        if (value.lat != null && value.lng != null) {
          await setMarker({ lat: value.lat, lng: value.lng }, { updateAddress: false });
          map.setView([value.lat, value.lng], Math.max(defaultZoom, 15));
        }
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
  }, [containerId, defaultCenter.lat, defaultCenter.lng, defaultZoom]);

  const handleSearch = async () => {
    if (!mapRef.current) return;
    const q = searchQuery.trim();
    if (!q) return;

    setSearchError(null);
    setIsSearching(true);
    try {
      const res = await geocodeNominatim(q);
      if (!res) {
        setSearchError("Location not found");
        return;
      }

      await setMarker(res.coords, { updateAddress: false });
      mapRef.current.setView([res.coords.lat, res.coords.lng], Math.max(mapRef.current.getZoom(), 15));

      if (res.displayName) {
        onChange({ lat: res.coords.lat, lng: res.coords.lng, displayAddress: res.displayName });
      }
    } catch {
      setSearchError("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-center gap-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search your address"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none shadow-sm"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={!isReady || isSearching}
            className="h-[46px] shrink-0 rounded-xl bg-[#0b6b53] px-4 text-sm font-bold text-white shadow disabled:opacity-60"
          >
            {isSearching ? "Searching" : "Search"}
          </button>
        </div>

        {searchError && <div className="text-xs text-red-600">{searchError}</div>}

        <div className="text-[11px] text-gray-500 leading-relaxed">
          Tip: click on the map to drop a pin. Drag the pin to fine-tune the exact location.
        </div>
      </div>

      <div className="mt-3 h-96 rounded-lg bg-gray-200 overflow-hidden">
        <div id={containerId} className="w-full h-full" />
      </div>

      <div className="mt-3 px-1 text-xs text-gray-600">
        {value.lat != null && value.lng != null ? (
          <div>
            <div>Selected Coordinates: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}</div>
            {value.displayAddress ? <div className="mt-1">{value.displayAddress}</div> : null}
          </div>
        ) : (
          <div>No pin selected yet.</div>
        )}
      </div>
    </div>
  );
}
