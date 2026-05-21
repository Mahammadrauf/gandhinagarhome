"use client";

import React, { useEffect, useRef } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_CONFIG } from "@/app/config/google-maps";

declare global {
  interface Window {
    google?: any;
  }
}

type LatLng = { lat: number; lng: number };

const defaultCenter: LatLng = { lat: 23.2156, lng: 72.6369 };
const defaultZoom = 12;

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full bg-slate-100 text-slate-600 text-sm">
          Loading map preview...
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full bg-slate-100 text-red-600 text-sm">
          Failed to load map preview
        </div>
      );
    case Status.SUCCESS:
      return <div className="w-full h-full" />;
  }
};

function MapPreviewContent() {
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!window.google?.maps || mapRef.current) return;

    const mapElement = document.getElementById("google-map-preview") as HTMLElement;
    if (!mapElement) return;

    const map = new window.google.maps.Map(mapElement, {
      center: defaultCenter,
      zoom: defaultZoom,
      mapTypeId: "roadmap",
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: "greedy",
      clickableIcons: false,
      styles: [],
    });

    new window.google.maps.Marker({
      position: defaultCenter,
      map,
      title: "Gandhinagar",
    });

    mapRef.current = map;
  }, []);

  return <div id="google-map-preview" className="absolute inset-0" />;
}

const GoogleMapPreview: React.FC = () => {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-sm text-slate-600">
        API key required for preview
      </div>
    );
  }

  return (
    <Wrapper
      apiKey={GOOGLE_MAPS_API_KEY}
      render={render}
      libraries={GOOGLE_MAPS_CONFIG.libraries}
      version={GOOGLE_MAPS_CONFIG.version}
      language={GOOGLE_MAPS_CONFIG.language}
      region={GOOGLE_MAPS_CONFIG.region}
    >
      <div className="relative w-full h-full">
        <MapPreviewContent />
      </div>
    </Wrapper>
  );
};

export default GoogleMapPreview;
