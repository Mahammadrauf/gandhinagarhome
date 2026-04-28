"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Loader } from "@googlemaps/js-api-loader";

export type LocationValue = {
  lat: number | null;
  lng: number | null;
  displayAddress?: string;
};

interface GoogleLocationPickerProps {
  value: LocationValue;
  onChange: (next: LocationValue) => void;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <div className="flex items-center justify-center h-96 bg-gray-200 rounded-lg">
        <div className="text-gray-600">Loading Google Maps...</div>
      </div>;
    case Status.FAILURE:
      return <div className="flex items-center justify-center h-96 bg-gray-200 rounded-lg">
        <div className="text-red-600">Failed to load Google Maps. Please check your API key.</div>
      </div>;
    case Status.SUCCESS:
      return <MapComponentWrapper />;
  }
};

const MapComponent: React.FC = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationValue>({
    lat: null,
    lng: null,
    displayAddress: ""
  });

  // Get props from context
  const props = React.useContext(MapContext);
  const defaultCenter = props.defaultCenter || { lat: 23.2156, lng: 72.6369 };
  const defaultZoom = props.defaultZoom || 12;

  // Initialize geocoder
  useEffect(() => {
    if (window.google && window.google.maps && !geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, []);

  // Update search query when display address changes
  useEffect(() => {
    setSearchQuery(props.value.displayAddress || "");
    setCurrentLocation(props.value);
  }, [props.value.displayAddress, props.value.lat, props.value.lng]);

  // Initialize map
  useEffect(() => {
    if (!window.google || !window.google.maps) return;

    const mapElement = document.getElementById("google-map") as HTMLElement;
    if (!mapElement || mapRef.current) return;

    const map = new window.google.maps.Map(mapElement, {
      center: defaultCenter,
      zoom: defaultZoom,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
    });

    mapRef.current = map;

    // Add click listener to map
    map.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        console.log("Map clicked:", event.latLng);
        const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        console.log("Setting marker at:", coords);
        updateMarkerPosition(event.latLng.lat(), event.latLng.lng());
      }
    });

    // Initialize autocomplete
    if (searchInputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        types: ["geocode", "establishment"],
        componentRestrictions: { country: "in" }
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          updateMarkerPosition(lat, lng);
          map.setCenter({ lat, lng });
          map.setZoom(16);
          
          // Update with formatted address if available
          if (place.formatted_address) {
            props.onChange({ lat, lng, displayAddress: place.formatted_address });
          }
        }
      });
    }

    // Set initial marker if coordinates exist
    if (props.value.lat != null && props.value.lng != null) {
      updateMarkerPosition(props.value.lat, props.value.lng);
      map.setCenter({ lat: props.value.lat, lng: props.value.lng });
      map.setZoom(Math.max(defaultZoom, 15));
    }
  }, [defaultCenter, defaultZoom]);

  const updateMarkerPosition = useCallback((lat: number, lng: number) => {
    console.log("updateMarkerPosition called with:", lat, lng);
    if (!mapRef.current) {
      console.log("Map not available");
      return;
    }

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Create new marker
    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapRef.current,
      draggable: true,
      title: "Property Location"
    });

    markerRef.current = marker;
    console.log("Marker created at:", lat, lng);

    // Add drag end listener
    marker.addListener("dragend", (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        console.log("Marker dragged to:", newLat, newLng);
        reverseGeocode(newLat, newLng);
      }
    });

    // Reverse geocode to get address
    console.log("Calling reverse geocode for:", lat, lng);
    reverseGeocode(lat, lng);
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    console.log("Reverse geocoding called for:", lat, lng);
    if (!geocoderRef.current) {
      console.log("Geocoder not initialized");
      return;
    }

    try {
      console.log("Starting reverse geocoding...");
      const result = await geocoderRef.current.geocode({
        location: { lat, lng }
      });

      console.log("Geocoding result:", result);

      if (result.results && result.results.length > 0) {
        const address = result.results[0].formatted_address;
        console.log("Found address:", address);
        props.onChange({ lat, lng, displayAddress: address });
        setCurrentLocation({ lat, lng, displayAddress: address });
        // Update search query with the retrieved address
        setSearchQuery(address);
      } else {
        console.log("No results found");
        props.onChange({ lat, lng, displayAddress: "" });
        setCurrentLocation({ lat, lng, displayAddress: "" });
        setSearchQuery("");
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      props.onChange({ lat, lng, displayAddress: "" });
      setCurrentLocation({ lat, lng, displayAddress: "" });
      setSearchQuery("");
    }
  }, [props.onChange]);

  const handleSearch = useCallback(async () => {
    if (!geocoderRef.current || !searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const result = await geocoderRef.current.geocode({
        address: searchQuery,
        componentRestrictions: { country: "in" }
      });

      if (result.results && result.results.length > 0) {
        const location = result.results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const address = result.results[0].formatted_address;

        updateMarkerPosition(lat, lng);
        
        if (mapRef.current) {
          mapRef.current.setCenter({ lat, lng });
          mapRef.current.setZoom(16);
        }

        props.onChange({ lat, lng, displayAddress: address });
        setCurrentLocation({ lat, lng, displayAddress: address });
        // Update search query with the formatted address
        setSearchQuery(address);
      } else {
        setSearchError("Location not found");
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      setSearchError("Search failed");
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, updateMarkerPosition, props.onChange]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-center gap-2">
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search your address"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none shadow-sm"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
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
        <div id="google-map" className="w-full h-full" />
      </div>

      <div className="mt-3 px-1 text-xs text-gray-600">
        {currentLocation.lat != null && currentLocation.lng != null ? (
          <div>
            <div>Selected Coordinates: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}</div>
            {currentLocation.displayAddress ? <div className="mt-1">{currentLocation.displayAddress}</div> : null}
          </div>
        ) : (
          <div>No pin selected yet.</div>
        )}
      </div>
    </div>
  );
};

export default function GoogleLocationPicker(props: GoogleLocationPickerProps) {
  const { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_CONFIG } = require('@/app/config/google-maps');

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-96 bg-gray-200 rounded-lg">
          <div className="text-red-600">
            Google Maps API key is required. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.
          </div>
        </div>
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
      <MapComponentWrapper {...props} />
    </Wrapper>
  );
}

// Create a context to pass props to MapComponent
const MapContext = React.createContext<GoogleLocationPickerProps>({
  value: { lat: null, lng: null },
  onChange: () => {},
  defaultCenter: { lat: 23.2156, lng: 72.6369 },
  defaultZoom: 12
});

// Wrapper component to provide context to MapComponent
function MapComponentWrapper({ children, ...props }: GoogleLocationPickerProps & { children?: React.ReactNode }) {
  return (
    <MapContext.Provider value={props}>
      <MapComponent />
    </MapContext.Provider>
  );
}
