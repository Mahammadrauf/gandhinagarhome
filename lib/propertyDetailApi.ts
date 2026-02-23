import { fetchPropertyById, BackendProperty } from './api';

// Property detail interface for detail page
export interface PropertyDetail {
  id: string;
  title: string;
  type: string;
  category: string;
  propertyCategory: 'exclusive' | 'featured' | 'regular';
  price: string;
  priceLabel: string;
  priceNote?: string;
  location: string;
  city: string;
  state: string;
  pincode: string;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  builtUpArea: number;
  carpetArea: number;
  areaDisplay: string;
  furnishing: string;
  facing: string;
  age: number | string;
  ageLabel: string;
  totalFloors: number;
  propertyOnFloor: string;
  readyStatus: string;
  parking: string;
  images: string[];
  videoUrl?: string;
  saleDeedUrl?: string;
  brochureUrl?: string;
  hasSaleDeed: boolean;
  hasBrochure: boolean;
  amenities: string[];
  highlights: string[];
  nearbyFacilities: string[];
  description?: string;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  seller: {
    id: string;
    name: string;
    phone: string;
    whatsappNumber: string;
    whatsapp?: string;
    email?: string;
    verification: string;
    isVerified: boolean;
    isDirectOwner: boolean;
  };
  // Add badges and overview for compatibility
  badges: Array<{
    text: string;
    icon: any;
  }>;
  overview: Array<{
    label: string;
    value: string;
    icon: any;
  }>;
  details: Array<{
    label: string;
    value: string;
  }>;
  // Color theme based on property type
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    badge: string;
    priceChip: string;
    tagBg: string;
    viewBtn: string;
    cardAccent: string;
    cardBg: string;
    // Add missing theme properties
    primaryHover?: string;
    lightBg?: string;
    borderColor?: string;
    badgeBg?: string;
    badgeText?: string;
    buttonBg?: string;
    buttonHover?: string;
  };
}

// Transform backend property to detail page format
export const transformPropertyDetail = (backendProp: BackendProperty): PropertyDetail => {
  const specs = backendProp.specifications || {};
  const pricing = backendProp.pricing || {};
  const location = backendProp.location || {};
  const media = backendProp.media || {};
  const userId = backendProp.userId || {};

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '');
  const toAbsoluteUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${baseUrl}${url}`;
  };

  // Format price
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Get age label
  const getAgeLabel = (age: number | string) => {
    // If age is already a formatted string, return it as is
    if (typeof age === 'string' && age.includes('Years')) {
      return age;
    }
    
    // Convert to number if it's a string
    const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
    
    if (ageNum === 0) return 'New Property';
    if (ageNum <= 3) return '1–3 Years Old';
    if (ageNum <= 6) return '3–6 Years Old';
    if (ageNum <= 9) return '6–9 Years Old';
    return '9+ Years Old';
  };

  // Get ready status
  const getReadyStatus = (status: string) => {
    if (status === 'ready') return 'Ready to move';
    if (status === 'under-construction') return 'Under construction';
    return status;
  };

  // Get parking info
  const getParking = (balconies: number) => {
    if (balconies >= 2) return `${balconies} covered`;
    if (balconies === 1) return '1 covered';
    return 'Open';
  };

  // Parse bedrooms from BHK string
  const parseBedroomsFromBhk = (bhkValue: unknown): number => {
    if (!bhkValue) return 0;
    const s = String(bhkValue);
    const match = s.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Get floor info
  const getFloorInfo = (propertyOnFloor: number, totalFloors: number) => {
    if (propertyOnFloor === 0 && totalFloors > 0) return `Ground`;
    if (totalFloors === propertyOnFloor) return `Top (${propertyOnFloor})`;
    return `${propertyOnFloor} of ${totalFloors}`;
  };

  // Process images
  const processImages = (images: any[]) => {
    const fallbacks = [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80'
    ];

    const normalized = (images || [])
      .map((img) => {
        const url = typeof img === 'string' ? img : img?.url;
        if (!url) return undefined;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        return `${baseUrl}/${url}`;
      })
      .filter(Boolean) as string[];

    const merged = normalized.length > 0 ? normalized : fallbacks;

    while (merged.length < 5) {
      merged.push(fallbacks[merged.length % fallbacks.length]);
    }

    return merged;
  };

  // Get theme colors based on property category
  const getThemeColors = (category: string) => {
    switch (category.toLowerCase()) {
      case 'exclusive':
        return {
          primary: '#BFA97F',
          secondary: '#DCCEB9',
          accent: '#5A4A2E',
          badge: 'bg-[#DCCEB9] text-[#5A4A2E] shadow-sm',
          priceChip: 'bg-white text-[#5A4A2E] border border-[#E6D9C4] shadow-sm',
          tagBg: 'bg-[#F5EFE7] text-[#6B5A41] border border-[#E6D9C4]',
          viewBtn: 'bg-[#BFA97F] hover:bg-[#a89064] text-white shadow',
          cardAccent: 'ring-1 ring-[#EAE0CF]/40',
          cardBg: 'bg-gradient-to-r from-[#E8DEC9] to-white',
          // Add missing properties
          primaryHover: '#a89064',
          lightBg: '#F5F2EB',
          borderColor: '#B59E78',
          badgeBg: '#f4c15b',
          badgeText: 'text-[#4f3a06]',
          buttonBg: 'bg-[#B59E78]',
          buttonHover: 'hover:bg-[#8C7A5B]'
        };
      case 'featured':
        return {
          primary: '#0F7F9C',
          secondary: '#CFE5FF',
          accent: '#022F5A',
          badge: 'bg-[#0F7F9C] text-white shadow-sm',
          priceChip: 'bg-white text-[#0F7F9C] border border-sky-100 shadow-sm',
          tagBg: 'bg-[#e0f2ff] text-[#0F7F9C] border border-[#bfe0ff]',
          viewBtn: 'bg-gradient-to-r from-[#0F7F9C] to-[#022F5A] text-white shadow hover:opacity-90',
          cardAccent: 'ring-1 ring-sky-200',
          cardBg: 'bg-gradient-to-r from-[#CFE5FF] to-[#F0F9FF]',
          // Add missing properties
          primaryHover: '#075985',
          lightBg: '#e0f2ff',
          borderColor: '#0F7F9C',
          badgeBg: '#0F7F9C',
          badgeText: 'text-white',
          buttonBg: 'bg-[#0F7F9C]',
          buttonHover: 'hover:bg-[#075985]'
        };
      default:
        return {
          primary: '#006B5B',
          secondary: '#E5F6F2',
          accent: '#004D40',
          badge: 'bg-[#004D40] text-white',
          priceChip: 'bg-white text-slate-800 border border-slate-100 shadow-sm',
          tagBg: 'bg-[#E5F6F2] text-[#006B5B]',
          viewBtn: 'bg-[#0F4C3E] hover:bg-[#0b3b30] text-white shadow',
          cardAccent: '',
          cardBg: 'bg-white',
          // Add missing properties
          primaryHover: '#164542',
          lightBg: '#eefcfa',
          borderColor: '#1f5f5b',
          badgeBg: '#1f5f5b',
          badgeText: 'text-white',
          buttonBg: 'bg-[#1f5f5b]',
          buttonHover: 'hover:bg-[#164542]'
        };
    }
  };

  // Extract bedroom count from BHK field or bedrooms field
  const bedrooms = specs.bedrooms ?? parseBedroomsFromBhk((specs as any).bhk);

  // Create overview array
  const createOverview = () => [
    { label: 'Price', value: formatPrice(pricing.expectedPrice || 0), icon: 'FileText' },
    { label: 'Bedrooms', value: `${bedrooms} BHK`, icon: 'BedDouble' },
    { label: 'Built-up Area', value: specs.builtUpArea ? `${specs.builtUpArea.toLocaleString('en-IN')} sq ft` : 'N/A', icon: 'Maximize2' },
    { label: 'Furnishing', value: specs.furnishing || 'Unfurnished', icon: 'Home' },
    { label: 'Status', value: getReadyStatus(backendProp.status), icon: 'CheckCircle2' },
    { label: 'Parking', value: getParking(specs.balconies || 0), icon: 'Car' },
    { label: 'Age', value: getAgeLabel(specs.age || 0), icon: 'Clock' },
    { label: 'Bathrooms', value: `${specs.bathrooms || 0} Baths`, icon: 'Bath' },
  ];

  // Create details array
  const createDetails = () => [
    { label: 'Title', value: backendProp.title },
    { label: 'Type', value: backendProp.propertyType },
    { label: 'Price', value: formatPrice(pricing.expectedPrice || 0) },
    { label: 'Built-up Area', value: specs.builtUpArea ? `${specs.builtUpArea.toLocaleString('en-IN')} sq ft` : 'N/A' },
    { label: 'Bedrooms', value: `${bedrooms}` },
    { label: 'Bathrooms', value: `${specs.bathrooms || 0}` },
    { label: 'Balconies', value: `${specs.balconies || 0}` },
    { label: 'Parking', value: getParking(specs.balconies || 0) },
    { label: 'Furnishing', value: specs.furnishing || 'Unfurnished' },
    { label: 'Availability', value: getReadyStatus(backendProp.status) },
    { label: 'Age of property', value: getAgeLabel(specs.age || 0) },
  ];

  // Create badges array
  const createBadges = () => [
    { text: 'Verified Property', icon: 'CheckCircle2' },
    { text: 'Clear Title', icon: 'FileCheck' },
    { text: 'Premium Partner', icon: 'Shield' },
  ];

  return {
    id: backendProp._id,
    title: backendProp.title,
    type: backendProp.propertyType,
    category: backendProp.category,
    propertyCategory: (backendProp.propertyCategory?.toLowerCase() === 'exclusive' ? 'exclusive' : 
                       backendProp.propertyCategory?.toLowerCase() === 'featured' ? 'featured' : 'regular') as 'exclusive' | 'featured' | 'regular',
    price: formatPrice(pricing.expectedPrice || 0),
    priceLabel: formatPrice(pricing.expectedPrice || 0),
    priceNote: '+ Stamp Duty',
    location: `${location.sector || ''}, ${location.city || ''}`.replace(/^,\s*/, ''),
    city: location.city || 'Unknown',
    state: location.state || 'Unknown',
    pincode: location.pincode || '',
    bedrooms: bedrooms,
    bathrooms: specs.bathrooms || 0,
    balconies: specs.balconies || 0,
    builtUpArea: specs.builtUpArea || 0,
    carpetArea: specs.carpetArea || 0,
    areaDisplay: specs.builtUpArea ? `${specs.builtUpArea.toLocaleString('en-IN')} sq ft` : 'N/A',
    furnishing: specs.furnishing || 'Unfurnished',
    facing: specs.facing || 'N/A',
    age: specs.age || 0,
    ageLabel: getAgeLabel(specs.age || 0),
    totalFloors: specs.totalFloors || 0,
    propertyOnFloor: getFloorInfo(specs.propertyOnFloor || 0, specs.totalFloors || 0),
    readyStatus: getReadyStatus(backendProp.status),
    parking: getParking(specs.balconies || 0),
    images: processImages(media.images),
    videoUrl: toAbsoluteUrl(media.video?.url),
    saleDeedUrl: toAbsoluteUrl(media.documents?.[0]?.url),
    brochureUrl: toAbsoluteUrl(media.documents?.[1]?.url),
    hasSaleDeed: !!media.documents?.[0]?.url,
    hasBrochure: !!media.documents?.[1]?.url,
    amenities: backendProp.amenities || [],
    highlights: backendProp.highlights || [],
    nearbyFacilities: backendProp.nearbyFacilities || [],
    description: '', // Add description field to backend if needed
    status: backendProp.status || 'available',
    views: backendProp.views || 0,
    createdAt: backendProp.createdAt,
    updatedAt: backendProp.updatedAt,
    seller: {
      id: userId._id || '',
      name: userId.name || 'Property Owner',
      phone: userId.mobile || userId.whatsappNumber || 'Hidden',
      whatsappNumber: userId.whatsappNumber || userId.mobile || 'Hidden',
      whatsapp: 'Shared after connect',
      email: '', // Add email field to backend if needed
      verification: 'OTP verified',
      isVerified: true,
      isDirectOwner: true
    },
    badges: createBadges(),
    overview: createOverview(),
    details: createDetails(),
    theme: getThemeColors(backendProp.propertyCategory)
  };
};

// Fetch property detail by ID
export const fetchPropertyDetail = async (id: string): Promise<PropertyDetail | null> => {
  try {
    console.log('Fetching property detail for ID:', id);
    const backendData = await fetchPropertyById(id);
    
    if (backendData) {
      const transformed = transformPropertyDetail(backendData);
      console.log('Transformed property detail:', transformed);
      return transformed;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching property detail:', error);
    return null;
  }
};

// Mock property detail for fallback
export const getMockPropertyDetail = (): PropertyDetail => {
  const createBadges = () => [
    { text: 'Verified Property', icon: 'CheckCircle2' },
    { text: 'Clear Title', icon: 'FileCheck' },
    { text: 'Premium Partner', icon: 'Shield' },
  ];

  const createOverview = () => [
    { label: 'Price', value: '₹3.10 Cr', icon: 'FileText' },
    { label: 'Bedrooms', value: '4 BHK', icon: 'BedDouble' },
    { label: 'Built-up Area', value: '3,400 sq ft', icon: 'Maximize2' },
    { label: 'Furnishing', value: 'Fully furnished', icon: 'Home' },
    { label: 'Status', value: 'Ready to move', icon: 'CheckCircle2' },
    { label: 'Parking', value: '2 covered', icon: 'Car' },
    { label: 'Age', value: '3–6 Years Old', icon: 'Clock' },
    { label: 'Bathrooms', value: '4 Baths', icon: 'Bath' },
  ];

  const createDetails = () => [
    { label: 'Title', value: 'Raysan Luxury Apartment 4 BHK' },
    { label: 'Type', value: 'Apartment' },
    { label: 'Price', value: '₹3.10 Cr' },
    { label: 'Built-up Area', value: '3,400 sq ft' },
    { label: 'Bedrooms', value: '4' },
    { label: 'Bathrooms', value: '4' },
    { label: 'Balconies', value: '2' },
    { label: 'Parking', value: '2 covered' },
    { label: 'Furnishing', value: 'Fully furnished' },
    { label: 'Availability', value: 'Ready to move' },
    { label: 'Age of property', value: '5 Years' },
  ];

  return {
    id: 'mock-detail-1',
    title: 'Raysan Luxury Apartment • Corner Plot',
    type: 'Apartment',
    category: 'Residential',
    propertyCategory: 'exclusive',
    price: '₹3.10 Cr',
    priceLabel: '₹3.10 Cr',
    priceNote: '+ Stamp Duty',
    location: 'Raysan, Gandhinagar',
    city: 'Gandhinagar',
    state: 'Gujarat',
    pincode: '382421',
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    builtUpArea: 3400,
    carpetArea: 2800,
    areaDisplay: '3,400 sq ft',
    furnishing: 'Fully furnished',
    facing: 'North-East',
    age: 5,
    ageLabel: '3–6 Years Old',
    totalFloors: 10,
    propertyOnFloor: '5 of 10',
    readyStatus: 'Ready to move',
    parking: '2 covered',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616594031246-852a69137bc8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    hasSaleDeed: true,
    hasBrochure: true,
    amenities: [
      'Gym', 'Lift', 'Garden', '24×7 Security', 'Vaastu friendly', 'Smart home', 'Clubhouse', 'Jogging Track', 'Children Play Area'
    ],
    highlights: ['Corner Plot', 'Premium Location', 'Modern Design'],
    nearbyFacilities: ['School', 'Hospital', 'Shopping Mall', 'Metro Station'],
    description: 'Luxury 4BHK apartment in the prime location of Raysan, Gandhinagar. This corner plot property offers modern amenities and spacious living.',
    status: 'available',
    views: 1250,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    seller: {
      id: 'seller-1',
      name: 'Rajesh K. Patel',
      phone: '+91 98XX-XXXXXX',
      whatsappNumber: '+91 98765 43210',
      whatsapp: 'Shared after connect',
      email: 'rajesh.patel@example.com',
      verification: 'OTP verified',
      isVerified: true,
      isDirectOwner: true
    },
    badges: createBadges(),
    overview: createOverview(),
    details: createDetails(),
    theme: {
      primary: '#BFA97F',
      secondary: '#DCCEB9',
      accent: '#5A4A2E',
      badge: 'bg-[#DCCEB9] text-[#5A4A2E] shadow-sm',
      priceChip: 'bg-white text-[#5A4A2E] border border-[#E6D9C4] shadow-sm',
      tagBg: 'bg-[#F5EFE7] text-[#6B5A41] border border-[#E6D9C4]',
      viewBtn: 'bg-[#BFA97F] hover:bg-[#a89064] text-white shadow',
      cardAccent: 'ring-1 ring-[#EAE0CF]/40',
      cardBg: 'bg-gradient-to-r from-[#E8DEC9] to-white',
      // Add missing properties
      primaryHover: '#a89064',
      lightBg: '#F5F2EB',
      borderColor: '#B59E78',
      badgeBg: '#f4c15b',
      badgeText: 'text-[#4f3a06]',
      buttonBg: 'bg-[#B59E78]',
      buttonHover: 'hover:bg-[#8C7A5B]'
    }
  };
};
