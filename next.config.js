/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Merge the eslint setting inside here
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Your Unsplash image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'gandhinagarhomes.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      
    ],
  },
  // Minimal rewrites to provide SEO-friendly public URLs
  async rewrites() {
    return [
      // map /buy-property-in-gandhinagar-gujarat -> /buy
      { source: '/buy-property-in-gandhinagar-gujarat', destination: '/buy' },
      // map /sell-property-in-gandhinagar-gujarat/* -> /sell/* (e.g. /form)
      { source: '/sell-property-in-gandhinagar-gujarat/:path*', destination: '/sell/:path*' },
    ]
  },
  // Redirect the original routes to the SEO-friendly public URLs so links to
  // /buy and /sell/* automatically become the SEO path in the browser.
  async redirects() {
    return [
      { source: '/buy', destination: '/buy-property-in-gandhinagar-gujarat', permanent: true },
      { source: '/buy/subscription', destination: '/buy-property-in-gandhinagar-gujarat/subscription', permanent: true },
      { source: '/sell/:path*', destination: '/sell-property-in-gandhinagar-gujarat/:path*', permanent: true },
    ]
  },
}

module.exports = nextConfig;