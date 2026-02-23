const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Debug logging
console.log('API_BASE_URL:', API_BASE_URL);

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

// Backend Property structure from MongoDB
export interface BackendProperty {
  _id: string;
  title: string;
  propertyType: string;
  category: string;
  propertyCategory: string;
  location: {
    sector: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  specifications: {
    bedrooms: number;
    bathrooms: number;
    balconies: number;
    totalFloors: number;
    propertyOnFloor: number;
    builtUpArea: number;
    carpetArea: number;
    age: number | string;
    furnishing: string;
    facing: string;
  };
  pricing: {
    expectedPrice: number;
    pricePerSqft: number;
    maintenanceCharges: number;
    bookingAmount: number;
    priceNegotiable: boolean;
  };
  media: {
    images: Array<{
      url: string;
      publicId: string;
      isPrimary: boolean;
    }>;
    documents?: Array<{
      url: string;
      publicId: string;
    }>;
    video?: {
      url: string;
      publicId: string;
    };
  };
  highlights: string[];
  amenities: string[];
  nearbyFacilities: string[];
  status: string;
  userId: {
    _id: string;
    name: string;
    whatsappNumber?: string;
    mobile?: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
  views: number;
}

// Frontend Property type (matching existing components)
export interface FrontendProperty {
  id: string;
  image: string;
  price: string;
  location: string;
  city?: string;
  beds: number;
  baths: number;
  sqft: string;
  propertyType?: string;
  features: string[];
  tag: { text: string; color: string };
  furnishing?: string;
  parking?: number;
  ageOfProperty?: number | string;
}

// Transform backend property to frontend format
export const transformProperty = (backendProp: BackendProperty): FrontendProperty => {
  const primaryImage = backendProp.media.images.find(img => img.isPrimary) || backendProp.media.images[0];
  
  // Fallback preview images based on property type
  const getFallbackImage = (propertyType: string, sector: string) => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', // Modern apartment
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80', // Luxury house
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', // Villa
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', // Pool villa
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', // Modern home
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', // House
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80', // Apartment
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80', // Interior
    ];
    
    // Use property type and sector to generate consistent but varied images
    const seed = `${propertyType}-${sector}`.replace(/\s+/g, '').toLowerCase();
    const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageIndex = hash % fallbackImages.length;
    
    return fallbackImages[imageIndex];
  };
  
  let imageUrl: string;
  if (primaryImage && primaryImage.url) {
    // Use backend image if available
    imageUrl = `${API_BASE_URL.replace('/api', '')}${primaryImage.url}`;
  } else {
    // Use fallback preview image
    imageUrl = getFallbackImage(backendProp.propertyType, backendProp.location.sector);
  }
  
  // Format price
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Get tag color based on property category
  const getTagStyle = (category: string) => {
    switch (category.toLowerCase()) {
      case 'exclusive':
        return { text: 'Exclusive', color: 'bg-yellow-500 text-white' };
      case 'featured':
        return { text: 'Featured', color: 'bg-[#0F7F9C] text-white' };
      case 'premium':
        return { text: 'Premium', color: 'bg-purple-500 text-white' };
      case 'new':
        return { text: 'New', color: 'bg-green-500 text-white' };
      default:
        return { text: 'Standard', color: 'bg-gray-500 text-white' };
    }
  };

  // Get features with fallbacks
  const getFeatures = (highlights: string[], amenities: string[], propertyType: string) => {
    if (highlights && highlights.length > 0) {
      return highlights.slice(0, 2);
    }
    if (amenities && amenities.length > 0) {
      return amenities.slice(0, 2);
    }
    
    // Default features based on property type
    const defaultFeatures = {
      '2BHK': ['Ready to Move', 'Modern Design'],
      '3BHK': ['Spacious', 'Prime Location'],
      '4BHK': ['Luxury', 'Premium Location'],
      'Bungalow': ['Private Garden', 'Parking'],
      'Plot': ['Corner Plot', 'Wide Road'],
      'Villa': ['Private Pool', 'Garden'],
      'Apartment': ['High Floor', 'City View'],
      'default': ['Well Maintained', 'Good Location']
    };
    
    return defaultFeatures[propertyType as keyof typeof defaultFeatures] || defaultFeatures['default'];
  };

  // Handle missing/undefined fields with fallbacks
  const specs = backendProp.specifications || {};
  const pricing = backendProp.pricing || {};
  const location = backendProp.location || {};

  const parseBedroomsFromBhk = (bhkValue: unknown): number => {
    if (!bhkValue) return 0;
    const s = String(bhkValue);
    const match = s.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const bedrooms = (specs as any).bedrooms ?? parseBedroomsFromBhk((specs as any).bhk);
  const bathrooms = (specs as any).bathrooms ?? 0;
  const areaValue = (specs as any).builtUpArea ?? (specs as any).totalArea ?? 0;
  
  return {
    id: backendProp._id,
    image: imageUrl,
    price: formatPrice(pricing.expectedPrice || 0),
    location: location.sector || location.address || 'Unknown Location',
    city: location.city,
    beds: bedrooms,
    baths: bathrooms,
    sqft: Number(areaValue || 0).toLocaleString('en-IN'),
    propertyType: backendProp.propertyType,
    features: getFeatures(backendProp.highlights || [], backendProp.amenities || [], backendProp.propertyType),
    tag: getTagStyle(backendProp.propertyCategory),
    furnishing: specs.furnishing,
    parking: (specs as any).parking || 1,
    ageOfProperty: specs.age
  };
};

// API functions
export const fetchFeaturedProperties = async (): Promise<FrontendProperty[]> => {
  try {
    const url = `${API_BASE_URL}/properties/home/featured`;
    console.log('Fetching featured properties from:', url);
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<BackendProperty[]> = await response.json();
    console.log('API response:', result);
    console.log('result.success:', result.success);
    console.log('result.data:', result.data);
    console.log('result.data length:', result.data?.length);
    
    if (result.success && result.data && result.data.length > 0) {
      console.log('Processing real data...');
      const transformed = result.data.map(transformProperty);
      console.log('Transformed properties:', transformed);
      return transformed;
    }
    
    // Return mock data if API returns no data
    console.log('No data from API, returning mock data');
    console.log('Reason:', {
      success: result.success,
      hasData: !!result.data,
      dataLength: result.data?.length,
      dataContent: result.data
    });
    return getMockFeaturedProperties();
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    // Return mock data on error
    console.log('Returning mock data due to error');
    return getMockFeaturedProperties();
  }
};

export const fetchExclusiveProperties = async (): Promise<FrontendProperty[]> => {
  try {
    const url = `${API_BASE_URL}/properties/home/exclusive`;
    console.log('Fetching exclusive properties from:', url);
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<BackendProperty[]> = await response.json();
    console.log('API response:', result);
    console.log('result.success:', result.success);
    console.log('result.data:', result.data);
    console.log('result.data length:', result.data?.length);
    
    if (result.success && result.data && result.data.length > 0) {
      console.log('Processing real data...');
      const transformed = result.data.map(transformProperty);
      console.log('Transformed properties:', transformed);
      return transformed;
    }
    
    // Return mock data if API returns no data
    console.log('No data from API, returning mock data');
    console.log('Reason:', {
      success: result.success,
      hasData: !!result.data,
      dataLength: result.data?.length,
      dataContent: result.data
    });
    return getMockExclusiveProperties();
  } catch (error) {
    console.error('Error fetching exclusive properties:', error);
    // Return mock data on error
    console.log('Returning mock data due to error');
    return getMockExclusiveProperties();
  }
};

// Buy page API - fetches all properties with proper ordering
export const fetchBuyPageProperties = async (filters?: {
  beds?: number;
  city?: string;
  propertyType?: string;
  priceRange?: string;
  locality?: string;
}): Promise<{
  exclusive: FrontendProperty[];
  featured: FrontendProperty[];
  others: FrontendProperty[];
}> => {
  try {
    console.log('Fetching buy page properties with filters:', filters);
    
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters?.beds) queryParams.append('beds', filters.beds.toString());
    if (filters?.city && filters.city !== 'any') queryParams.append('city', filters.city);
    if (filters?.propertyType && filters.propertyType !== 'any') queryParams.append('type', filters.propertyType);
    if (filters?.locality) queryParams.append('sector', filters.locality);
    
    const queryString = queryParams.toString();
    const baseUrl = `${API_BASE_URL}/properties`;
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    
    console.log('Fetching properties from:', url);
    
    // Fetch all three categories in parallel
    const [exclusiveData, featuredData, allData] = await Promise.allSettled([
      fetch(`${API_BASE_URL}/properties/home/exclusive`),
      fetch(`${API_BASE_URL}/properties/home/featured`),
      fetch(url)
    ]);

    // Process exclusive properties
    let exclusive: FrontendProperty[] = [];
    if (exclusiveData.status === 'fulfilled') {
      const response = exclusiveData.value;
      if (response.ok) {
        const result: ApiResponse<BackendProperty[]> = await response.json();
        if (result.success && result.data) {
          exclusive = result.data.map(transformProperty);
        }
      }
    }
    if (exclusive.length === 0) {
      exclusive = getMockExclusiveProperties();
    }

    // Process featured properties
    let featured: FrontendProperty[] = [];
    if (featuredData.status === 'fulfilled') {
      const response = featuredData.value;
      if (response.ok) {
        const result: ApiResponse<BackendProperty[]> = await response.json();
        if (result.success && result.data) {
          featured = result.data.map(transformProperty);
        }
      }
    }
    if (featured.length === 0) {
      featured = getMockFeaturedProperties();
    }

    // Process all other properties
    let others: FrontendProperty[] = [];
    if (allData.status === 'fulfilled') {
      const response = allData.value;
      if (response.ok) {
        const result: ApiResponse<BackendProperty[]> = await response.json();
        if (result.success && result.data) {
          // Filter out exclusive and featured properties, then transform
          const filtered = result.data.filter(prop => 
            prop.propertyCategory !== 'Exclusive' && 
            prop.propertyCategory !== 'Featured'
          );
          others = filtered.map(transformProperty);
        }
      }
    }
    if (others.length === 0) {
      others = getMockOtherProperties();
    }

    console.log('Buy page data loaded:', {
      exclusive: exclusive.length,
      featured: featured.length,
      others: others.length
    });

    return { exclusive, featured, others };
  } catch (error) {
    console.error('Error fetching buy page properties:', error);
    return {
      exclusive: getMockExclusiveProperties(),
      featured: getMockFeaturedProperties(),
      others: getMockOtherProperties()
    };
  }
};

// Property detail API - fetches individual property by ID
export const fetchPropertyById = async (id: string): Promise<BackendProperty | null> => {
  try {
    console.log('Fetching property by ID:', id);
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<BackendProperty> = await response.json();
    console.log('Property detail API response:', result);
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching property detail:', error);
    return null;
  }
};

// Similar properties API - fetches properties similar to the given property
export const fetchSimilarProperties = async (propertyId: string, limit: number = 5): Promise<FrontendProperty[]> => {
  try {
    const url = `${API_BASE_URL}/properties/similar/${propertyId}?limit=${limit}`;
    console.log('Fetching similar properties from:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<BackendProperty[]> = await response.json();
    console.log('Similar properties API response:', result);
    
    if (result.success && result.data) {
      const transformed = result.data.map(transformProperty);
      console.log('Transformed similar properties:', transformed);
      return transformed;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching similar properties:', error);
    return [];
  }
};
export const getMockSimilarProperties = (): FrontendProperty[] => [
  {
    id: "mock-s1",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    price: "₹2.1 Cr",
    location: "Sargasan, Gandhinagar",
    beds: 4,
    baths: 4,
    sqft: "3,000",
    features: ["Vaastu-friendly", "2 Car Parks"],
    tag: { text: "New", color: "#10b981" },
    furnishing: "Semi-furnished",
    parking: 2,
    ageOfProperty: 2
  },
  {
    id: "mock-s2", 
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    price: "₹1.85 Cr",
    location: "Kudasan, Gandhinagar",
    beds: 3,
    baths: 3,
    sqft: "2,400",
    features: ["Gated Community", "Gym"],
    tag: { text: "Hot Deal", color: "#ef4444" },
    furnishing: "Fully furnished",
    parking: 1,
    ageOfProperty: 4
  },
  {
    id: "mock-s3",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    price: "₹4.5 Cr",
    location: "Raysan, Gandhinagar",
    beds: 5,
    baths: 5,
    sqft: "4,200",
    features: ["Private Pool", "Home Theater"],
    tag: { text: "", color: "" },
    furnishing: "Fully furnished",
    parking: 3,
    ageOfProperty: 1
  },
  {
    id: "mock-s4",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80",
    price: "₹3.2 Cr",
    location: "Gift City, Gandhinagar",
    beds: 4,
    baths: 4,
    sqft: "3,500",
    features: ["High Rise", "Smart Home"],
    tag: { text: "Exclusive", color: "#b59e78" },
    furnishing: "Semi-furnished",
    parking: 2,
    ageOfProperty: 3
  },
  {
    id: "mock-s5",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    price: "₹1.1 Cr",
    location: "Randheshan, Gandhinagar",
    beds: 3,
    baths: 3,
    sqft: "1,800",
    features: ["Garden", "Security"],
    tag: { text: "Sold Out", color: "#6b7280" },
    furnishing: "Unfurnished",
    parking: 1,
    ageOfProperty: 5
  }
];

// Mock data for other properties
const getMockOtherProperties = (): FrontendProperty[] => [
  {
    id: "mock-o1",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
    price: "₹1.25 Cr",
    location: "Sector 23",
    beds: 2,
    baths: 2,
    sqft: "1,450",
    features: ["Well Maintained", "Good Location"],
    tag: { text: "Standard", color: "bg-gray-500 text-white" },
    furnishing: "Unfurnished",
    parking: 1,
    ageOfProperty: 6
  },
  {
    id: "mock-o2",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80",
    price: "₹95 L",
    location: "Sector 8",
    beds: 2,
    baths: 1,
    sqft: "1,200",
    features: ["Affordable", "Good Location"],
    tag: { text: "Standard", color: "bg-gray-500 text-white" },
    furnishing: "Semi-furnished",
    parking: 1,
    ageOfProperty: 3
  },
  {
    id: "mock-o3",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    price: "₹1.55 Cr",
    location: "Sector 12",
    beds: 3,
    baths: 2,
    sqft: "1,850",
    features: ["Spacious", "Ready to Move"],
    tag: { text: "Standard", color: "bg-gray-500 text-white" },
    furnishing: "Fully furnished",
    parking: 2,
    ageOfProperty: 2
  }
];

// API function to fetch user's listed properties
export const fetchMyProperties = async (token: string): Promise<BackendProperty[]> => {
  try {
    const url = `${API_BASE_URL}/properties/user/my-properties`;
    console.log('Fetching my properties from:', url);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<BackendProperty[]> = await response.json();
    console.log('My properties API response:', result);
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching my properties:', error);
    return [];
  }
};

// Mock data for testing
const getMockFeaturedProperties = (): FrontendProperty[] => [
  {
    id: "mock-f1",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    price: "₹2.1 Cr",
    location: "Sector 5",
    beds: 4,
    baths: 4,
    sqft: "3,000",
    features: ["Ready to Move", "Modern Design"],
    tag: { text: "Featured", color: "bg-[#0F7F9C] text-white" },
    furnishing: "Semi-furnished",
    parking: 2,
    ageOfProperty: 1
  },
  {
    id: "mock-f2",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    price: "₹1.65 Cr",
    location: "Koba",
    beds: 3,
    baths: 3,
    sqft: "1,950",
    features: ["Spacious", "Prime Location"],
    tag: { text: "Featured", color: "bg-[#0F7F9C] text-white" },
    furnishing: "Unfurnished",
    parking: 1,
    ageOfProperty: 4
  },
  {
    id: "mock-f3",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    price: "₹2.45 Cr",
    location: "Sargasan",
    beds: 3,
    baths: 3,
    sqft: "2,250",
    features: ["Garden View", "Modern Kitchen"],
    tag: { text: "Featured", color: "bg-[#0F7F9C] text-white" },
    furnishing: "Fully furnished",
    parking: 2,
    ageOfProperty: 2
  }
];

const getMockExclusiveProperties = (): FrontendProperty[] => [
  {
    id: "mock-e1",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    price: "₹3.10 Cr",
    location: "Sector 21",
    beds: 4,
    baths: 4,
    sqft: "3,500",
    features: ["Private Pool", "Premium Location"],
    tag: { text: "Exclusive", color: "bg-yellow-500 text-white" },
    furnishing: "Fully furnished",
    parking: 3,
    ageOfProperty: 1
  },
  {
    id: "mock-e2",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    price: "₹1.85 Cr",
    location: "Sector 16",
    beds: 3,
    baths: 2,
    sqft: "2,100",
    features: ["City View", "Ready to Move"],
    tag: { text: "Exclusive", color: "bg-yellow-500 text-white" },
    furnishing: "Semi-furnished",
    parking: 2,
    ageOfProperty: 3
  },
  {
    id: "mock-e3",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    price: "₹2.35 Cr",
    location: "Gift City",
    beds: 4,
    baths: 4,
    sqft: "3,120",
    features: ["Luxury", "Premium Location"],
    tag: { text: "Exclusive", color: "bg-yellow-500 text-white" },
    furnishing: "Fully furnished",
    parking: 2,
    ageOfProperty: 2
  }
];

// User profile types
export interface UserProfile {
  _id: string;
  mobile: string;
  name: string;
  email: string;
  whatsappNumber: string;
  profilePhoto?: string;
  role: string;
  subscriptionStatus: string;
  propertiesCount?: number;
}

// API function to fetch user profile
export const fetchUserProfile = async (token: string): Promise<UserProfile | null> => {
  try {
    const url = `${API_BASE_URL}/users/profile`;
    console.log('Fetching user profile from:', url);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('User profile response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<UserProfile> = await response.json();
    console.log('User profile API response:', result);
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
