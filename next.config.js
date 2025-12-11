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
    ],
  },
}

module.exports = nextConfig;