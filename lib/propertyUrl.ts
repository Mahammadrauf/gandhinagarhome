// Utility functions for property URL handling

// Generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

// Generate property URL with property ID, BHK, and city
export const generatePropertyUrl = (title: string, propertyId?: string, bhk?: string, city?: string): string => {
  const slug = generateSlug(title);
  
  // Build the enhanced slug with BHK and city if available
  let enhancedSlug = slug;
  
  if (bhk) {
    // Clean BHK value (e.g., "1 BHK" -> "1-BHK")
    const cleanBhk = bhk.toLowerCase().replace(/\s+/g, '-');
    enhancedSlug = `${cleanBhk}-${enhancedSlug}`;
  }
  
  if (city) {
    // Clean city name and add to slug
    const cleanCity = city.toLowerCase().replace(/\s+/g, '-');
    enhancedSlug = `${enhancedSlug}-${cleanCity}`;
  }
  
  if (propertyId) {
    return `${enhancedSlug}-${propertyId}`;
  }
  
  // Fallback for properties without property ID
  return `${enhancedSlug}-GH-0012`;
};

// Parse property URL to extract slug and property ID
export const parsePropertyUrl = (url: string): { slug: string; propertyId?: string } => {
  const parts = url.split('-');
  
  // Check if the last part matches property ID pattern (2 letters + dash + 4 digits)
  const lastPart = parts[parts.length - 1];
  if (/^[A-Z]{2}-\d{4}$/i.test(lastPart)) {
    // Also check for GH-0012 fallback pattern
    if (lastPart === 'GH-0012') {
      const slug = parts.slice(0, -2).join('-'); // Remove GH and 0012
      return { slug, propertyId: 'GH-0012' };
    } else {
      const slug = parts.slice(0, -1).join('-'); // Remove property ID
      return { slug, propertyId: lastPart.toUpperCase() };
    }
  }
  
  // Check for old format without dash (2 letters + 4 digits)
  if (/^[A-Z]{2}\d{4}$/i.test(lastPart)) {
    const slug = parts.slice(0, -1).join('-'); // Remove property ID
    return { slug, propertyId: `${lastPart.substring(0, 2)}-${lastPart.substring(2)}` };
  }
  
  // Old format - just slug
  return { slug: url };
};

// Generate property URL for sharing
export const generateShareUrl = (title: string, propertyId?: string, bhk?: string, city?: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const propertyUrl = generatePropertyUrl(title, propertyId, bhk, city);
  return `${baseUrl}/properties/${propertyUrl}`;
};
