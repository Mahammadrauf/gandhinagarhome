import { generatePropertyUrl } from "../../lib/propertyUrl";
import { BLOG_POSTS } from "../../lib/blogPosts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gandhinagarhomes.com/api';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://gandhinagarhomes.com';

async function fetchAllProperties() {
  try {
    const res = await fetch(`${API_BASE_URL}/properties`);
    if (!res.ok) return [];
    const json = await res.json();
    // Support different API shapes
    if (json && json.success && Array.isArray(json.data)) return json.data;
    if (Array.isArray(json)) return json;
    return [];
  } catch (e) {
    console.error('Error fetching properties for sitemap', e);
    return [];
  }
}

function formatDate(d?: string) {
  if (!d) return new Date().toISOString().split('T')[0];
  return new Date(d).toISOString().split('T')[0];
}

export async function GET() {
  const properties = await fetchAllProperties();

  const staticUrls = [
    { loc: `${BASE_URL}/`, lastmod: formatDate() },
    { loc: `${BASE_URL}/about`, lastmod: formatDate() },
    { loc: `${BASE_URL}/contact`, lastmod: formatDate() },
    { loc: `${BASE_URL}/privacy-policy`, lastmod: formatDate() },
    { loc: `${BASE_URL}/buy-property-in-gandhinagar-gujarat`, lastmod: formatDate() },
    { loc: `${BASE_URL}/buy-property-in-gandhinagar-gujarat/search`, lastmod: formatDate() },
    { loc: `${BASE_URL}/buy-property-in-gandhinagar-gujarat/subscription`, lastmod: formatDate() },
    { loc: `${BASE_URL}/sell-property-in-gandhinagar-gujarat`, lastmod: formatDate() },
    { loc: `${BASE_URL}/sell-property-in-gandhinagar-gujarat/form`, lastmod: formatDate() },
    { loc: `${BASE_URL}/sell-property-in-gandhinagar-gujarat/subscription`, lastmod: formatDate() },
    { loc: `${BASE_URL}/sell-property-in-gandhinagar-gujarat/confirmation`, lastmod: formatDate() },
    { loc: `${BASE_URL}/profile`, lastmod: formatDate() },
    { loc: `${BASE_URL}/admin`, lastmod: formatDate() },
    { loc: `${BASE_URL}/terms-and-conditions`, lastmod: formatDate() },
    { loc: `${BASE_URL}/disclaimer`, lastmod: formatDate() },
    { loc: `${BASE_URL}/blog`, lastmod: formatDate() }
  ];

  const blogUrls = BLOG_POSTS.map((p) => ({
    loc: `${BASE_URL}/blog/${p.slug}`,
    lastmod: formatDate(p.date)
  }));

  const propertyUrls = properties.map((p: any) => {
    const slug = generatePropertyUrl(p.title || p.name || 'property', p.propertyid || p._id, (p.specifications && p.specifications.bhk) || undefined, (p.location && p.location.city) || undefined);
    return {
      loc: `${BASE_URL}/properties/${slug}`,
      lastmod: formatDate(p.updatedAt || p.createdAt)
    };
  });

  const urls = [...staticUrls, ...blogUrls, ...propertyUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
