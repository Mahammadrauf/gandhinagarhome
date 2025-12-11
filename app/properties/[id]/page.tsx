'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  MapPin,
  PlayCircle,
  Image as ImageIcon,
  CheckCircle2,
  BedDouble,
  Bath,
  Maximize2,
  Home,
  Clock,
  Car,
  FileText,
  ShieldCheck,
  Share2,
  Grid
} from 'lucide-react';
import Header from '@/components/Header';

// ---- MOCK DATA ----
const propertyType = 'exclusive';

const property = {
  id: 'GH-XL-1024',
  type: propertyType,
  title: 'Raysan Luxury Villa • Corner Plot',
  subtitle: '₹3.10 Cr • 4 BHK • 3,400 sq ft • Villa • Fully furnished',
  price: '₹3.10 Cr',
  priceNote: 'Negotiable • Registration extra',
  location: 'Raysan, Gandhinagar',
  badges: [
    { text: 'Exclusive listing' },
    { text: 'OTP verified seller' },
    { text: 'Exact map available' },
  ],

  images: [
    'https://images.unsplash.com/photo-1600596542815-3ad19fb2a258?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600585154340-0ef3c08c0632?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  ],

  videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',

  overview: [
    { label: 'Price', value: '₹3.10 Cr', icon: FileText },
    { label: 'Bedrooms', value: '4 BHK', icon: BedDouble },
    { label: 'Size', value: '3,400 sq ft', icon: Maximize2 },
    { label: 'Furnishing', value: 'Fully furnished', icon: Home },
    { label: 'Status', value: 'Ready to move', icon: CheckCircle2 },
    { label: 'Parking', value: '2 covered', icon: Car },
    { label: 'Age', value: '5–10 years', icon: Clock },
    { label: 'Bathrooms', value: '4 Baths', icon: Bath },
  ],

  details: [
    { label: 'Title', value: 'Raysan Luxury Villa 4 BHK' },
    { label: 'Type', value: 'Villa' },
    { label: 'Price', value: '₹3.10 Cr' },
    { label: 'Size', value: '3,400 sq ft' },
    { label: 'Bedrooms', value: '4' },
    { label: 'Bathrooms', value: '4' },
    { label: 'Balconies', value: '2' },
    { label: 'Parking', value: '2 covered' },
    { label: 'Furnishing', value: 'Fully furnished' },
    { label: 'Availability', value: 'Ready to move' },
    { label: 'Age of property', value: '5–10 years' },
  ],

  seller: {
    name: 'Rajesh K. Patel',
    phone: '+91 98XX-XXXXXX',
    email: 'Hidden • Unlock to view',
    whatsapp: 'Shared after connect',
    verification: 'OTP verified',
    isVerified: true,
  },

  amenities: [
    'Gym', 'Lift', 'Garden', '24×7 Security', 'Vaastu friendly', 'Smart home',
  ],

  documents: [
    { label: '9 photos' },
    { label: '1 video tour' },
    { label: 'Sale deed / index' },
    { label: 'Project brochure' },
  ],
};

// ---- THEME ----
const getTheme = (type: string) => {
  const themes = {
    exclusive: {
      badgeBg: 'bg-[#f4c15b]',
      badgeText: 'text-[#4f3a06]',
      buttonBg: 'bg-[#1f5f5b]',
      buttonHover: 'hover:bg-[#164542]',
      tagBg: 'bg-[#1f5f5b]',
      lightBg: 'bg-[#eefcfa]',
    },
    // ... other themes preserved ...
  };
  return themes[type as keyof typeof themes] || themes.exclusive;
};

const theme = getTheme(property.type);

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const [mediaMode, setMediaMode] = useState('photos');
  const [galleryIndex, setGalleryIndex] = useState(0);

  const handleVideoClick = () => setMediaMode((prev) => (prev === 'video' ? 'photos' : 'video'));
  const handleGalleryClick = () => setMediaMode((prev) => (prev === 'gallery' ? 'photos' : 'gallery'));
  const handleNext = () => setGalleryIndex((prev) => (prev + 1) % property.images.length);
  const handlePrev = () => setGalleryIndex((prev) => prev === 0 ? property.images.length - 1 : prev - 1);

  const isVideoActive = mediaMode === 'video';
  const isGalleryActive = mediaMode === 'gallery';

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-gray-800 font-sans selection:bg-[#1f5f5b] selection:text-white pb-10">
      <Header />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/properties"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1f5f5b] transition-colors"
          >
            <div className="p-1.5 rounded-full bg-white border border-gray-200 group-hover:border-[#1f5f5b] transition-colors shadow-sm">
                <ArrowLeft className="w-4 h-4" />
            </div>
            Back to properties
          </Link>

          <div className="flex gap-3">
             <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-full border border-gray-200 hover:shadow-md active:scale-95 duration-200">
                <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors bg-white px-4 py-2 rounded-full border border-gray-200 hover:shadow-md active:scale-95 duration-200">
                <Heart className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        {/* Title Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md px-6 py-6 mb-6 relative overflow-hidden">
          {/* Subtle decorative background gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#eefcfa] to-transparent rounded-full opacity-50 blur-3xl pointer-events-none -mr-16 -mt-16"></div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 relative z-10">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {property.badges.map((badge, i) => (
                  <span
                    key={i}
                    className={`${theme.badgeBg} ${theme.badgeText} text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm`}
                  >
                    {badge.text}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                {property.title}
              </h1>
              <div className="mt-2 flex items-center text-sm text-gray-500 font-medium">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                {property.location}
              </div>
            </div>
            
            <div className="text-left md:text-right">
                 <p className="text-3xl font-bold text-gray-900 tracking-tight">{property.price}</p>
                 <p className="text-xs text-gray-500 font-medium mt-1">{property.priceNote}</p>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* LEFT: Main Content */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Photos & Video Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 p-5">
              
              {/* Media Area */}
              <div className="rounded-2xl overflow-hidden bg-[#f5f7f9]">
                {mediaMode === 'gallery' ? (
                  <div className="relative w-full h-[420px] md:h-[520px] group">
                    <Image
                      src={property.images[galleryIndex]}
                      alt="Gallery"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handlePrev} className="bg-white/90 p-3 rounded-full hover:bg-white shadow-lg transition-transform hover:scale-110"><ArrowLeft className="w-5 h-5"/></button>
                        <button onClick={handleNext} className="bg-white/90 p-3 rounded-full hover:bg-white shadow-lg transition-transform hover:scale-110"><ArrowLeft className="w-5 h-5 rotate-180"/></button>
                    </div>
                  </div>
                ) : mediaMode === 'video' ? (
                  <div className="relative w-full h-[420px] md:h-[520px] bg-black">
                    <video src={property.videoUrl} controls className="w-full h-full object-contain" />
                  </div>
                ) : (
                  // Default Grid
                  <div className="flex flex-col lg:flex-row gap-3 h-[420px]">
                    <div className="relative w-full lg:flex-[3] h-full rounded-xl overflow-hidden group cursor-pointer shadow-sm" onClick={handleGalleryClick}>
                      <Image
                        src={property.images[0]}
                        alt="Main property"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    <div className="w-full lg:flex-[2] grid grid-cols-2 grid-rows-2 gap-3 h-full">
                      {property.images.slice(1, 5).map((src, idx) => (
                        <div
                          key={idx}
                          className="relative w-full h-full rounded-xl overflow-hidden group cursor-pointer shadow-sm"
                          onClick={handleGalleryClick}
                        >
                          <Image src={src} alt="Thumb" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                          
                          {/* OVERLAY FOR LAST IMAGE */}
                          {idx === 3 && (
                             <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-[2px] transition-opacity hover:bg-black/50">
                                <Grid className="w-6 h-6 mb-1" />
                                <span className="text-xs font-bold uppercase tracking-wider">View All</span>
                             </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Media Controls */}
              <div className="mt-4 flex items-center justify-between">
                 <div className="flex gap-3">
                    <button
                      onClick={handleVideoClick}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 shadow-sm border ${
                        isVideoActive ? 'bg-gray-900 text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <PlayCircle className="w-4 h-4" /> Video
                    </button>
                    <button
                      onClick={handleGalleryClick}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 shadow-sm border ${
                        isGalleryActive ? 'bg-gray-900 text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" /> Gallery
                    </button>
                 </div>
                 <span className="text-xs font-medium text-gray-500">9 photos • 1 video</span>
              </div>
            </div>

            {/* Overview Card - Compact */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Overview</h2>
                <span className={`${theme.tagBg} text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm`}>
                    Exclusive
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {property.overview.map((item, i) => (
                  <div key={i} className="group bg-gray-50 hover:bg-[#eefcfa] border border-gray-100 hover:border-[#1f5f5b]/20 transition-all duration-300 rounded-lg p-3 flex items-center gap-3 cursor-default">
                    <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-[#1f5f5b] group-hover:scale-110 transition-transform">
                        <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-tight">{item.label}</span>
                        <span className="text-sm font-bold text-gray-900 leading-tight mt-0.5">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Details + Seller Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Property Details */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 h-full">
                <h3 className="text-base font-bold text-gray-900 mb-5">Property Details</h3>
                <div className="space-y-4">
                  {property.details.map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-gray-50 last:border-0 pb-3 last:pb-0 hover:bg-gray-50/50 transition-colors px-1 -mx-1 rounded-md">
                      <span className="text-sm text-gray-500 font-medium">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 h-full relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 ${theme.tagBg} opacity-5 rounded-bl-full -mr-4 -mt-4`} />
                
                <h3 className="text-base font-bold text-gray-900 mb-5 relative z-10">Seller Information</h3>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-xl font-bold text-gray-400">
                        {property.seller.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-lg font-bold text-gray-900">{property.seller.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-green-700 font-bold bg-green-50 border border-green-100 px-2 py-0.5 rounded-full w-fit mt-1">
                            <ShieldCheck className="w-3 h-3" /> OTP Verified
                        </div>
                    </div>
                </div>

                <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-100 relative z-10">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Email</span>
                      <span className="text-gray-400 italic">Hidden • Unlock to view</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Mobile</span>
                      <span className="text-gray-900 font-mono font-bold tracking-wide">{property.seller.phone}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">WhatsApp</span>
                      <span className="text-gray-900 font-bold">{property.seller.whatsapp}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Amenities & Location */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, i) => (
                  <span key={i} className="group inline-flex items-center px-4 py-2 rounded-full border border-gray-200 bg-white hover:border-[#1f5f5b] hover:bg-[#eefcfa] transition-all text-sm font-medium text-gray-600 hover:text-[#1f5f5b] cursor-default shadow-sm">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-gray-300 group-hover:text-[#1f5f5b] transition-colors" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

             {/* Map Preview */}
             <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-2">
                <div className="relative h-64 bg-[#f0f2f5] rounded-xl overflow-hidden flex flex-col items-center justify-center group cursor-pointer">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    
                    <div className="relative z-10 flex flex-col items-center p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                        <div className="bg-[#1f5f5b] p-3 rounded-full mb-3 text-white shadow-md">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">Map View Hidden</span>
                        <span className="text-xs text-gray-500 mt-1">Unlock property to see exact pin</span>
                    </div>
                </div>
                <div className="flex justify-between items-center px-4 py-3 bg-white rounded-b-xl">
                    <p className="text-xs text-gray-500 font-medium">Approx: Raysan, Gandhinagar – 382421</p>
                    <button className="text-xs font-bold text-[#1f5f5b] hover:underline flex items-center gap-1">
                        Open in Google Maps <ArrowLeft className="w-3 h-3 rotate-180" />
                    </button>
                </div>
            </div>

          </div>

          {/* RIGHT: Sticky Sidebar */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-4">
              
              {/* Main Price Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1f5f5b] to-[#f4c15b]" />
                
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Total Price</p>
                <h2 className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">{property.price}</h2>
                <p className="text-xs text-gray-500 font-medium mb-6">{property.priceNote}</p>

                <div className="flex justify-between text-sm py-3 border-y border-gray-50 mb-6">
                    <span className="text-gray-500">Posted</span>
                    <span className="text-gray-900 font-medium">3 days ago</span>
                </div>

                <button className={`w-full bg-gradient-to-r from-[#1f5f5b] to-[#164542] hover:shadow-lg hover:shadow-[#1f5f5b]/30 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] mb-4 flex items-center justify-center gap-2`}>
                    <ShieldCheck className="w-5 h-5" />
                    Unlock Seller Details
                </button>

                <p className="text-[10px] text-gray-400 text-center leading-relaxed px-2">
                    We respect your privacy. Your number is only shared with this specific seller.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}