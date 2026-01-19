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
    ],
  },
}

module.exports = nextConfig;