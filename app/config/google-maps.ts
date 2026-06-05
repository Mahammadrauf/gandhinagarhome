export const GOOGLE_MAPS_API_KEY = 'AIzaSyCq6MeKb6JCE7MTUM9w4tJVjsF36nBcPIQ';

type GMLibrary = "core" | "maps" | "places" | "geocoding" | "routes" | "marker" | "geometry" | "elevation" | "streetView" | "journeySharing" | "drawing" | "visualization";

export const GOOGLE_MAPS_CONFIG = {
  libraries: ['places', 'geometry'] as GMLibrary[],
  version: 'weekly',
  language: 'en',
  region: 'IN',
};
