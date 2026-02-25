import { fetchBuyPageProperties, FrontendProperty } from './api';

// Buy page property type that matches existing Listing interface structure
export interface BuyPageProperty {
  id: number;
  propertyId: string;
  slug?: string;
  tier: "exclusive" | "featured" | "regular";
  source: "owner" | "partner" | "builder";
  title: string;
  locality: string;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  areaDisplay?: string;
  type: "Apartment" | "Tenement" | "Bungalow" | "Penthouse" | "Plot" | "Shop" | "Office";
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

// Transform FrontendProperty to BuyPageProperty
export const transformToBuyPageProperty = (
  property: FrontendProperty, 
  tier: "exclusive" | "featured" | "regular"
): BuyPageProperty => {
  // Extract numeric price from price label
  const extractPriceInCr = (priceStr: string): number => {
    if (priceStr.includes('Cr')) {
      return parseFloat(priceStr.replace('₹', '').replace('Cr', '').trim());
    }
    if (priceStr.includes('L')) {
      return parseFloat(priceStr.replace('₹', '').replace('L', '').trim()) / 100;
    }
    return 0;
  };

  // Extract area from sqft string
  const extractArea = (sqftStr: string): number => {
    return parseInt(sqftStr.replace(',', '').replace(' sq ft', '').trim()) || 0;
  };

  // Generate a title based on property details
  const generateTitle = (location: string, beds: number, type: string, backendTitle?: string, address?: string): string => {
    // If backend title exists and has content, use it as is
    if (backendTitle && backendTitle.trim().length > 0) {
      return backendTitle;
    }
    // Fallback: construct a title if no database title exists
    if (address && address.trim().length > 0) {
      return `${beds}BHK ${type} on ${address}`;
    }
    return `${beds}BHK ${type} in ${location}`;
  };

  // Map property type from backend to frontend types
  const mapPropertyType = (backendType: string): BuyPageProperty["type"] => {
    if (!backendType) return 'Apartment';
    
    const typeLower = backendType.toLowerCase();
    const typeMap: Record<string, BuyPageProperty["type"]> = {
      '2bhk': 'Apartment',
      '3bhk': 'Apartment',
      '4bhk': 'Apartment',
      'apartment': 'Apartment',
      'bungalow': 'Bungalow',
      'plot': 'Plot',
      'villa': 'Bungalow',
      'penthouse': 'Penthouse',
      'tenement': 'Tenement',
      'shop': 'Shop',
      'office': 'Office'
    };
    return typeMap[typeLower] || 'Apartment';
  };

  // Map furnishing from backend to frontend types
  const mapFurnishing = (backendFurnishing: string): BuyPageProperty["furnishing"] => {
    if (!backendFurnishing) return "Unfurnished";
    const furnishingLower = backendFurnishing.toLowerCase();
    if (furnishingLower.includes('semi')) return "Semi-furnished";
    if (furnishingLower.includes('full')) return "Fully furnished";
    return "Unfurnished";
  };

  // Map age to proper label
  const mapAgeLabel = (age: number | string): string => {
    if (!age) return "New Property";
    
    // If it's already a formatted string, return as is
    if (typeof age === 'string') {
      const ageLower = age.toLowerCase();
      if (ageLower.includes('new') || ageLower.includes('0-1')) return "New Property";
      if (ageLower.includes('1-3') || ageLower.includes('1–3')) return "1–3 Years Old";
      if (ageLower.includes('3-6') || ageLower.includes('3–6')) return "3–6 Years Old";
      if (ageLower.includes('6-9') || ageLower.includes('6–9')) return "6–9 Years Old";
      if (ageLower.includes('9+') || ageLower.includes('9+')) return "9+ Years Old";
      
      // Try to extract number from string
      const numberMatch = age.match(/(\d+)/);
      if (numberMatch) {
        const ageNum = parseInt(numberMatch[1]);
        if (ageNum <= 1) return "New Property";
        if (ageNum <= 3) return "1–3 Years Old";
        if (ageNum <= 6) return "3–6 Years Old";
        if (ageNum <= 9) return "6–9 Years Old";
        return "9+ Years Old";
      }
      
      // If no number found, return as is or default
      return age;
    }
    
    // If it's a number
    const ageNum = age as number;
    if (ageNum <= 1) return "New Property";
    if (ageNum <= 3) return "1–3 Years Old";
    if (ageNum <= 6) return "3–6 Years Old";
    if (ageNum <= 9) return "6–9 Years Old";
    return "9+ Years Old";
  };

  const priceInCr = extractPriceInCr(property.price);
  const area = extractArea(property.sqft);
  const propertyType = mapPropertyType(property.propertyType || 'Apartment');

  return {
    id: parseInt(property.id) || Math.floor(Math.random() * 1000000), // Convert string ID to number, fallback to random
    propertyId: property.id,
    slug: property.slug,
    tier,
    source: "owner", // Default, can be updated based on backend data
    title: generateTitle(property.location, property.beds, propertyType, property.title, property.address),
    locality: property.location,
    address: property.address,
    city: property.city || "Gandhinagar",
    bedrooms: property.beds,
    bathrooms: property.baths,
    areaSqft: area,
    areaDisplay: property.sqft,
    type: propertyType,
    furnishing: mapFurnishing((property as any).furnishing || "Unfurnished"),
    readyStatus: "Ready to move", // Default, can be updated based on backend data
    parking: (property as any).parking || 1, // Use actual parking data if available
    ageLabel: mapAgeLabel((property as any).ageOfProperty || "New Property"),
    priceCr: priceInCr,
    priceLabel: property.price,
    media: "image", // Default
    phoneMasked: "XXXXXX1234", // Default mask
    image: property.image,
    tags: [property.tag.text],
    amenities: property.features
  };
};

// Fetch and transform buy page properties
export const fetchAndTransformBuyPageProperties = async (filters?: {
  beds?: number;
  city?: string;
  propertyType?: string;
  priceRange?: string;
  locality?: string;
}): Promise<{
  exclusive: BuyPageProperty[];
  featured: BuyPageProperty[];
  others: BuyPageProperty[];
}> => {
  const data = await fetchBuyPageProperties(filters);
  
  return {
    exclusive: data.exclusive.map(prop => transformToBuyPageProperty(prop, 'exclusive')),
    featured: data.featured.map(prop => transformToBuyPageProperty(prop, 'featured')),
    others: data.others.map(prop => transformToBuyPageProperty(prop, 'regular'))
  };
};
