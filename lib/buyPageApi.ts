import { fetchBuyPageProperties, FrontendProperty } from './api';

// Buy page property type that matches the existing Listing interface structure
export interface BuyPageProperty {
  id: number;
  propertyId: string;
  tier: "exclusive" | "featured" | "regular";
  source: "owner" | "partner" | "builder";
  title: string;
  locality: string;
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
  const generateTitle = (location: string, beds: number, type: string): string => {
    return `${location} ${beds}BHK ${type}`;
  };

  // Map property type from backend to frontend types
  const mapPropertyType = (backendType: string): BuyPageProperty["type"] => {
    const typeMap: Record<string, BuyPageProperty["type"]> = {
      '2BHK': 'Apartment',
      '3BHK': 'Apartment',
      '4BHK': 'Apartment',
      'Bungalow': 'Bungalow',
      'Plot': 'Plot',
      'Villa': 'Bungalow',
      'Penthouse': 'Penthouse',
      'Tenement': 'Tenement',
      'Shop': 'Shop',
      'Office': 'Office'
    };
    return typeMap[backendType] || 'Apartment';
  };

  const priceInCr = extractPriceInCr(property.price);
  const area = extractArea(property.sqft);
  const propertyType = mapPropertyType(property.propertyType || 'Apartment');

  return {
    id: parseInt(property.id) || Math.floor(Math.random() * 1000000), // Convert string ID to number, fallback to random
    propertyId: property.id,
    tier,
    source: "owner", // Default, can be updated based on backend data
    title: generateTitle(property.location, property.beds, propertyType),
    locality: property.location,
    city: property.city || "Gandhinagar",
    bedrooms: property.beds,
    bathrooms: property.baths,
    areaSqft: area,
    areaDisplay: property.sqft,
    type: propertyType,
    furnishing: "Unfurnished", // Default, can be updated based on backend data
    readyStatus: "Ready to move", // Default, can be updated based on backend data
    parking: 1, // Default, can be updated based on backend data
    ageLabel: "New Property", // Default, can be updated based on backend data
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
export const fetchAndTransformBuyPageProperties = async (): Promise<{
  exclusive: BuyPageProperty[];
  featured: BuyPageProperty[];
  others: BuyPageProperty[];
}> => {
  const data = await fetchBuyPageProperties();
  
  return {
    exclusive: data.exclusive.map(prop => transformToBuyPageProperty(prop, 'exclusive')),
    featured: data.featured.map(prop => transformToBuyPageProperty(prop, 'featured')),
    others: data.others.map(prop => transformToBuyPageProperty(prop, 'regular'))
  };
};
