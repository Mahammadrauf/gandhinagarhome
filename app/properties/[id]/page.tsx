'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
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
  Grid,
  FileCheck,
  BookOpen,
  Download,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Shield,
  X,
  Linkedin,
  Code,
  Check
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- WHATSAPP ICON COMPONENT (For Share Modal) ---
const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

// ---- MOCK DATA (Updated to match seller form data structure) ----
const propertyType = 'exclusive';

const property = {
  id: 'GH-XL-1024',
  type: propertyType,
  title: 'Raysan Luxury Apartment • Corner Plot', // Will be populated from title field
  subtitle: '₹3.10 Cr • 4 BHK • 3,400 sq ft • Apartment • Fully furnished', // Will be dynamically generated
  price: '₹3.10 Cr', // Will be populated from priceLabel
  priceNote: '+ Stamp Duty',
  location: 'Raysan, Gandhinagar', // Will be populated from locality + city
  // 1. CHANGED: Badges to build trust instead of "Exclusive Listing" etc.
  badges: [
    { text: 'Verified Property', icon: CheckCircle2 },
    { text: 'Clear Title', icon: FileCheck },
    { text: 'Premium Partner', icon: Shield },
  ],
  images: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616594031246-852a69137bc8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80',
  ],
  videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
  hasSaleDeed: true, // Will be populated from hasSaleDeed
  hasBrochure: true, // Will be populated from hasBrochure
  // 2. UPDATED: Overview to use dynamic data
  overview: [
    { label: 'Price', value: '₹3.10 Cr', icon: FileText }, // priceLabel
    { label: 'Bedrooms', value: '4 BHK', icon: BedDouble }, // bedrooms
    { label: 'Built-up Area', value: '3,400 sq ft', icon: Maximize2 }, // areaDisplay
    { label: 'Furnishing', value: 'Fully furnished', icon: Home }, // furnishing
    { label: 'Status', value: 'Ready to move', icon: CheckCircle2 }, // readyStatus
    { label: 'Parking', value: '2 covered', icon: Car }, // parking
    { label: 'Age', value: '5 Years', icon: Clock }, // ageLabel
    { label: 'Bathrooms', value: '4 Baths', icon: Bath }, // bathrooms
  ],
  details: [
    { label: 'Title', value: 'Raysan Luxury Apartment 4 BHK' }, // title
    { label: 'Type', value: 'Apartment' }, // type (from propertyType)
    { label: 'Price', value: '₹3.10 Cr' }, // priceLabel
    { label: 'Built-up Area', value: '3,400 sq ft' }, // areaDisplay
    { label: 'Bedrooms', value: '4' }, // bedrooms
    { label: 'Bathrooms', value: '4' }, // bathrooms
    { label: 'Balconies', value: '2' }, // balcony
    { label: 'Parking', value: '2 covered' }, // parking
    { label: 'Furnishing', value: 'Fully furnished' }, // furnishing
    { label: 'Availability', value: 'Ready to move' }, // readyStatus
    { label: 'Age of property', value: '5 Years' }, // ageLabel
  ],
  seller: {
    name: 'Rajesh K. Patel', // Will be populated from firstName + lastName
    phone: '+91 98XX-XXXXXX', // Will be populated from mobile
    email: 'Hidden • Unlock to view', // Will be populated from email
    whatsapp: 'Shared after connect',
    verification: 'OTP verified',
    isVerified: true,
    isDirectOwner: true, 
  },
  amenities: [
    'Gym', 'Lift', 'Garden', '24×7 Security', 'Vaastu friendly', 'Smart home', 'Clubhouse', 'Jogging Track', 'Children Play Area'
  ], // Will be populated from amenities array
};

// ---- MOCK SIMILAR PROPERTIES ----
const similarProperties = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        price: '₹2.1 Cr',
        badge: 'New',
        title: 'Sargasan',
        subtitle: 'Gandhinagar • Prime locality',
        specs: { beds: 4, baths: 4, area: '3,000 sq ft' },
        tags: ['Vaastu-friendly', '2 Car Parks']
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        price: '₹1.85 Cr',
        badge: 'Hot Deal',
        title: 'Kudasan',
        subtitle: 'Gandhinagar • Near Metro',
        specs: { beds: 3, baths: 3, area: '2,400 sq ft' },
        tags: ['Gated Community', 'Gym']
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        price: '₹4.5 Cr',
        badge: null,
        title: 'Raysan Premium',
        subtitle: 'Gandhinagar • River View',
        specs: { beds: 5, baths: 5, area: '4,200 sq ft' },
        tags: ['Private Pool', 'Home Theater']
    },
     {
        id: 4,
        image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80',
        price: '₹3.2 Cr',
        badge: 'Exclusive',
        title: 'Gift City',
        subtitle: 'Gandhinagar • Smart City',
        specs: { beds: 4, baths: 4, area: '3,500 sq ft' },
        tags: ['High Rise', 'Smart Home']
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
        price: '₹1.1 Cr',
        badge: 'Sold Out',
        title: 'Randheshan Villa',
        subtitle: 'Gandhinagar • Green Belt',
        specs: { beds: 3, baths: 3, area: '1,800 sq ft' },
        tags: ['Garden', 'Security']
  }
];

// ---- THEME ----
const getTheme = (type: string, propertyId?: string) => {
  const isFeatured = propertyId && (propertyId.startsWith('f') || propertyId.startsWith('F'));
  const isExclusive = propertyId && (propertyId.startsWith('e') || propertyId.startsWith('E'));
  const isNormal = propertyId && (propertyId.startsWith('n') || propertyId.startsWith('N'));
  
  const themes = {
    featured: {
      primary: '#0F7F9C',
      primaryHover: '#075985',
      lightBg: '#e0f2ff', // Bluish
      borderColor: '#0F7F9C',
      badgeBg: '#0F7F9C',
      badgeText: 'text-white',
      buttonBg: 'bg-[#0F7F9C]',
      buttonHover: 'hover:bg-[#075985]',
      tagBg: '#0F7F9C',
    },
    exclusive: {
      primary: '#B59E78',
      primaryHover: '#8C7A5B',
      lightBg: '#F5F2EB', // Golden/Beige
      borderColor: '#B59E78',
      badgeBg: '#f4c15b',
      badgeText: 'text-[#4f3a06]',
      buttonBg: 'bg-[#B59E78]',
      buttonHover: 'hover:bg-[#8C7A5B]',
      tagBg: '#B59E78',
    },
    normal: {
      primary: '#1f5f5b',
      primaryHover: '#164542',
      lightBg: '#eefcfa', // Tealish
      borderColor: '#1f5f5b',
      badgeBg: '#1f5f5b',
      badgeText: 'text-white',
      buttonBg: 'bg-[#1f5f5b]',
      buttonHover: 'hover:bg-[#164542]',
      tagBg: '#1f5f5b',
    },
  };
  
  if (isFeatured) return themes.featured;
  if (isExclusive) return themes.exclusive;
  if (isNormal) return themes.normal;
  return themes[type as keyof typeof themes] || themes.normal;
};

const DirectOwnerBadge = () => (
    <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
        <div className="relative w-4 h-4 flex items-center justify-center">
             <ShieldCheck className="w-4 h-4 text-[#166534] fill-none stroke-[2.5px]" /> 
        </div>
        <span className="text-[11px] font-bold text-[#166534] tracking-wide">Direct Owner</span>
    </div>
);

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const [mediaMode, setMediaMode] = useState('photos');
  const [galleryIndex, setGalleryIndex] = useState(0);
  
  // -- HOVER STATES FOR DYNAMIC COLORING --
  const [hoveredOverview, setHoveredOverview] = useState<number | null>(null);
  const [hoveredDetail, setHoveredDetail] = useState<number | null>(null);

  // -- SHARE MODAL STATE --
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const propertyId = params.id;
  const theme = getTheme(property.type, propertyId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Mock URL for sharing
  const shareUrl = `https://gandhinagarhomes.com/properties/${propertyId || 'GH-1024'}`;

  // --- FOOTER DATA ---
  const bhkLinks = [
    { label: '2 BHK', href: '/listings?beds=2' },
    { label: '3 BHK', href: '/listings?beds=3' },
    { label: '4 BHK', href: '/listings?beds=4' },
    { label: '5 BHK', href: '/listings?beds=5' },
    { label: '6 BHK', href: '/listings?beds=6' },
  ];

  const propertyTypeLinks = [
    { label: 'Apartment', href: '/listings?type=apartment' },
    { label: 'Tenement', href: '/listings?type=tenement' },
    { label: 'Bungalow', href: '/listings?type=bungalow' },
    { label: 'Penthouse', href: '/listings?type=penthouse' },
    { label: 'Plot', href: '/listings?type=plot' },
    { label: 'Shop', href: '/listings?type=shop' },
    { label: 'Office', href: '/listings?type=office' },
  ];

  const gandhinagarLinks = [
    { label: 'Raysan', href: '/listings?loc=raysan' },
    { label: 'Randesan', href: '/listings?loc=randesan' },
    { label: 'Sargasan', href: '/listings?loc=sargasan' },
    { label: 'Kudasan', href: '/listings?loc=kudasan' },
    { label: 'Koba', href: '/listings?loc=koba' },
    { label: 'Sectors', href: '/listings?loc=sectors' },
  ];

  const ahmedabadLinks = [
    { label: 'Motera', href: '/listings?loc=motera' },
    { label: 'Chandkheda', href: '/listings?loc=chandkheda' },
    { label: 'Zundal', href: '/listings?loc=zundal' },
    { label: 'Adalaj', href: '/listings?loc=adalaj' },
    { label: 'Bhat', href: '/listings?loc=bhat' },
    { label: 'Tapovan', href: '/listings?loc=tapovan' },
    { label: 'Vaishnodevi', href: '/listings?loc=vaishnodevi' },
  ];

  const headingClass = "text-sm font-bold text-slate-900 border-l-[3px] border-[#006B5B] pl-3 mb-5 uppercase tracking-wide";

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleVideoClick = () => setMediaMode((prev) => (prev === 'video' ? 'photos' : 'video'));
  const handleGalleryClick = () => setMediaMode((prev) => (prev === 'gallery' ? 'photos' : 'gallery'));
  const handleNext = () => setGalleryIndex((prev) => (prev + 1) % property.images.length);
  const handlePrev = () => setGalleryIndex((prev) => prev === 0 ? property.images.length - 1 : prev - 1);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isVideoActive = mediaMode === 'video';
  const isGalleryActive = mediaMode === 'gallery';

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-gray-800 font-sans selection:bg-[#1f5f5b] selection:text-white flex flex-col">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
      <Header />

      <main className="flex-grow relative">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Breadcrumb / Navigation */}
          <div className="flex items-center justify-between mb-5">
            <Link
              href="/properties"
              className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors"
            >
              <div className="p-1.5 rounded-full bg-white border border-gray-200 transition-colors shadow-sm">
                 <ArrowLeft className="w-4 h-4" />
              </div>
              Back to properties
            </Link>

            <div className="flex gap-3">
               <button 
                 onClick={() => setIsShareOpen(true)}
                 className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-full border border-gray-200 hover:shadow-md active:scale-95 duration-200"
               >
                  <Share2 className="w-4 h-4" /> Share
               </button>
               <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors bg-white px-4 py-2 rounded-full border border-gray-200 hover:shadow-md active:scale-95 duration-200">
                  <Heart className="w-4 h-4" /> Save
               </button>
            </div>
          </div>

          {/* Title Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md px-6 py-6 mb-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full opacity-50 blur-3xl pointer-events-none -mr-16 -mt-16 transition-opacity group-hover:opacity-75"></div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 relative z-10">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {/* 1. UPDATED: Render Trust Building Badges with Green Theme */}
                  {property.badges.map((badge, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 bg-[#e0f2f1] text-[#1f5f5b] text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm"
                    >
                      <badge.icon className="w-3 h-3 stroke-[2.5]" />
                      {badge.text}
                    </span>
                  ))}
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {property.title}
                </h1>
                <div className="mt-2 flex items-center text-sm text-gray-500 font-medium">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {property.location}
                </div>
              </div>
              
              <div className="text-left md:text-right">
                    <p className="text-3xl font-bold tracking-tight" style={{ color: theme.primary }}>{property.price}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">{property.priceNote}</p>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* LEFT: Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 1. Media Section */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
                <div className="rounded-2xl overflow-hidden bg-[#f5f7f9] relative">
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
                    // Default Mosaic Grid
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
                <div className="mt-4 flex flex-wrap items-center justify-between gap-y-4">
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

                {/* Documents Section */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Property Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {property.hasSaleDeed && (
                          <div className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:${theme.lightBg} hover:border-[${theme.borderColor}] transition-all group cursor-pointer relative overflow-hidden`}>
                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-[${theme.borderColor}] opacity-0 group-hover:opacity-100 transition-opacity" />
                               <div className="flex items-center gap-4">
                                  <div className="p-2.5 bg-white rounded-lg shadow-sm text-[${theme.borderColor}] border border-gray-100 group-hover:scale-105 transition-transform">
                                      <FileCheck className="w-6 h-6" />
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-gray-900 group-hover:text-[${theme.borderColor}] transition-colors">Sale Deed / Index</p>
                                      <p className="text-[11px] text-green-600 font-bold flex items-center gap-1 mt-0.5">
                                          <CheckCircle2 className="w-3 h-3"/> Verified Ownership
                                      </p>
                                  </div>
                               </div>
                               <div className="bg-white p-2 rounded-lg border border-gray-200 text-gray-400 group-hover:text-[${theme.borderColor}] group-hover:border-[${theme.borderColor}]/30 shadow-sm transition-all">
                                   <Download className="w-4 h-4" />
                               </div>
                          </div>
                        )}
                        {property.hasBrochure && (
                          <div className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:${theme.lightBg} hover:border-[${theme.borderColor}] transition-all group cursor-pointer relative overflow-hidden`}>
                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-[${theme.borderColor}] opacity-0 group-hover:opacity-100 transition-opacity" />
                               <div className="flex items-center gap-4">
                                  <div className="p-2.5 bg-white rounded-lg shadow-sm text-[${theme.borderColor}] border border-gray-100 group-hover:scale-105 transition-transform">
                                      <BookOpen className="w-6 h-6" />
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-gray-900 group-hover:text-[${theme.borderColor}] transition-colors">Project Brochure</p>
                                      <p className="text-[11px] text-gray-500 font-medium mt-0.5">View layouts & plans</p>
                                  </div>
                               </div>
                               <div className="bg-white p-2 rounded-lg border border-gray-200 text-gray-400 group-hover:text-[${theme.borderColor}] group-hover:border-[${theme.borderColor}]/30 shadow-sm transition-all">
                                   <Download className="w-4 h-4" />
                               </div>
                          </div>
                        )}
                    </div>
                </div>
              </div>

              {/* 2. Overview Section (ENHANCED: Bento Grid Style with Dynamic Color) */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Overview</h2>
                  <span className={`${theme.tagBg} text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm`}>
                      Exclusive
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {property.overview.map((item, i) => (
                    <div 
                        key={i} 
                        onMouseEnter={() => setHoveredOverview(i)}
                        onMouseLeave={() => setHoveredOverview(null)}
                        className="group relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default"
                        style={{
                            backgroundColor: hoveredOverview === i ? theme.lightBg : '#ffffff',
                            borderColor: hoveredOverview === i ? `${theme.borderColor}80` : '#f3f4f6' 
                        }}
                    >
                      {/* Icon Box */}
                      <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                          <item.icon className="w-5 h-5" />
                      </div>
                      
                      {/* Text */}
                      <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-tight transition-colors"
                                style={{ color: hoveredOverview === i ? theme.borderColor : '' }}
                          >
                              {item.label}
                          </span>
                          {/* 3. UPDATED: Price in Overview check for + Stamp Duty */}
                          {item.label === 'Price' ? (
                                <div className="leading-tight mt-0.5">
                                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                                    <span className="text-[10px] font-normal text-gray-500 ml-1 block sm:inline">+ Stamp Duty</span>
                                </div>
                          ) : (
                                <span className="text-sm font-bold text-gray-900 leading-tight mt-0.5">{item.value}</span>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Property Details (ENHANCED: Hover Slide + Color Effect) */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">Property Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      {property.details.map((item, i) => (
                        <div 
                            key={i} 
                            onMouseEnter={() => setHoveredDetail(i)}
                            onMouseLeave={() => setHoveredDetail(null)}
                            className="flex justify-between items-center px-3 py-3 rounded-lg transition-all duration-200 hover:pl-4 border-b border-gray-50 last:border-0 md:border-0 group"
                            style={{
                                backgroundColor: hoveredDetail === i ? theme.lightBg : 'transparent',
                            }}
                        >
                           <span className="text-sm text-gray-500 font-medium group-hover:text-gray-700">{item.label}</span>
                           {/* 3. UPDATED: Price in Details check for + Stamp Duty */}
                           {item.label === 'Price' ? (
                               <div className="text-right">
                                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                                    <span className="text-[10px] font-normal text-gray-500 ml-1">+ Stamp Duty</span>
                               </div>
                           ) : (
                               <span className="text-sm font-semibold text-gray-900 text-right">{item.value}</span>
                           )}
                        </div>
                      ))}
                  </div>
              </div>

              {/* 4. Amenities (ENHANCED: Pill Pop Effect) */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {property.amenities.map((amenity, i) => (
                      <span key={i} className={`group inline-flex items-center px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-[${theme.borderColor}] hover:${theme.lightBg} transition-all duration-300 active:scale-95 text-sm font-medium text-gray-600 hover:text-[${theme.borderColor}] cursor-default shadow-sm hover:shadow-md`}>
                        <CheckCircle2 className={`w-4 h-4 mr-2 text-gray-300 group-hover:text-[${theme.borderColor}] transition-colors duration-300`} />
                        {amenity}
                      </span>
                    ))}
                  </div>
              </div>

              {/* 5. Map Preview */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-2">
                  <div className="relative h-64 md:h-72 bg-[#f0f2f5] rounded-xl overflow-hidden flex flex-col items-center justify-center group cursor-pointer">
                     <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                     <div className="relative z-10 flex flex-col items-center p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                         <div className="p-3 rounded-full mb-3 text-white shadow-md animate-bounce" style={{ backgroundColor: theme.primary }}>
                             <MapPin className="w-6 h-6" />
                         </div>
                         <span className="text-sm font-bold text-gray-900">Map View Hidden</span>
                         <span className="text-xs text-gray-500 mt-1">Unlock property to see exact pin</span>
                     </div>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 bg-white rounded-b-xl">
                     <p className="text-xs text-gray-500 font-medium">Approx: Raysan, Gandhinagar – 382421</p>
                     <button className="text-xs font-bold hover:underline flex items-center gap-1" style={{ color: theme.primary }}>
                         Open in Google Maps <ArrowLeft className="w-3 h-3 rotate-180" />
                     </button>
                  </div>
              </div>

            </div>

            {/* RIGHT: Sticky Sidebar (4 cols) */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-4">
                
                {/* Contact Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r" style={{ background: `linear-gradient(to right, ${theme.primary}, #f4c15b)` }} />
                  
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Price</p>
                  <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">{property.price}</h2>
                  <p className="text-xs text-gray-500 font-medium mb-6">{property.priceNote}</p>

                  <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-lg" style={{ backgroundColor: theme.primary }}>
                                {property.seller.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-base font-bold text-gray-900 leading-tight">{property.seller.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium">Verified Seller</p>
                            </div>
                        </div>
                        {/* --- DIRECT OWNER BADGE --- */}
                        {property.seller.isDirectOwner && (
                            <DirectOwnerBadge />
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Mobile</span>
                            <span className="text-sm font-mono font-bold text-gray-900">{property.seller.phone}</span>
                        </div>
                        {/* Hidden Email Row */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Email</span>
                            <span className="text-sm text-gray-400 italic bg-gray-100 px-2 py-0.5 rounded select-none cursor-pointer hover:bg-gray-200 transition-colors" title="Unlock to view">{property.seller.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">WhatsApp</span>
                            <span className="text-sm font-bold text-gray-900">{property.seller.whatsapp}</span>
                        </div>
                    </div>
                  </div>

                  <button className={`w-full text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] mb-3 flex items-center justify-center gap-2 shadow-lg text-base ${theme.buttonBg} ${theme.buttonHover} hover:shadow-xl`} style={{ boxShadow: `0 10px 25px -5px ${theme.primary}40` }}>
                      <ShieldCheck className="w-5 h-5" />
                      Contact Seller
                  </button>

                  <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                      Your data is secure. Connect directly with the seller.
                  </p>
                </div>

                {/* Quick Tip Card */}
                <div className={`${theme.lightBg} rounded-xl p-4 border border-[#00000010]`}>
                    <h5 className="text-sm font-bold mb-1" style={{ color: theme.primary }}>Interested?</h5>
                    <p className="text-xs leading-relaxed" style={{ color: theme.primary + 'cc' }}>
                        Properties in Raysan are seeing high demand. Don't wait too long to schedule a visit.
                    </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 mb-10 pt-10 border-t border-gray-200 relative group">
             <div className="flex items-center justify-between mb-6 px-1">
                <h2 className="text-2xl font-bold text-gray-900">Similar homes you might like</h2>
                <Link href="/properties" className="text-sm font-bold hover:underline flex items-center gap-1 text-[#1f5f5b]">
                    See all <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
             </div>
             
             {/* Carousel Buttons */}
             <button 
                onClick={() => scroll('left')} 
                className="absolute left-0 top-[55%] -translate-y-1/2 z-20 bg-white text-gray-700 p-2.5 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 hover:scale-110 transition-all hidden md:flex items-center justify-center"
                aria-label="Scroll left"
             >
                <ChevronLeft className="w-6 h-6" />
             </button>
             
             <button 
                onClick={() => scroll('right')} 
                className="absolute right-0 top-[55%] -translate-y-1/2 z-20 bg-white text-gray-700 p-2.5 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 hover:scale-110 transition-all hidden md:flex items-center justify-center"
                aria-label="Scroll right"
             >
                <ChevronRight className="w-6 h-6" />
             </button>

             {/* Carousel Container */}
             <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 sm:mx-0 sm:px-1 no-scrollbar scroll-smooth"
             >
                 {similarProperties.map((sim) => (
                     <div key={sim.id} className="min-w-[300px] sm:min-w-[340px] snap-center bg-[#fffbf2] rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col">
                         
                         {/* Card Image Area */}
                         <div className="relative h-60 w-full">
                             <Image src={sim.image} alt={sim.title} fill className="object-cover" />
                             
                             {/* Floating Price Badge (Bottom Left) */}
                             <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-xl shadow-md z-10">
                                 <span className="text-lg font-extrabold text-[#1f5f5b]">{sim.price}</span>
                             </div>

                             {/* Floating Status Badge (Top Right) */}
                             {sim.badge && (
                                <div className="absolute top-4 right-4 bg-[#b08d55]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                                    {sim.badge}
                                </div>
                             )}
                         </div>

                         {/* Content Area */}
                         <div className="p-5 flex-grow flex flex-col bg-[#fffbf2]">
                             <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{sim.title}</h3>
                                <p className="text-sm text-gray-500 font-normal">{sim.subtitle}</p>
                             </div>
                             
                             {/* Icons Row */}
                             <div className="flex items-center gap-5 mb-5 text-gray-600">
                                 <div className="flex items-center gap-1.5">
                                     <Home className="w-4 h-4 stroke-[2.5]" />
                                     <span className="text-sm font-semibold">{sim.specs.beds} bd</span>
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                     <Bath className="w-4 h-4 stroke-[2.5]" />
                                     <span className="text-sm font-semibold">{sim.specs.baths} ba</span>
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                     <Maximize2 className="w-4 h-4 stroke-[2.5]" />
                                     <span className="text-sm font-semibold">{sim.specs.area}</span>
                                 </div>
                             </div>

                             {/* Tags Row */}
                             <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                                 {sim.tags.map((tag, i) => (
                                     <span key={i} className="bg-[#f0ece1] text-gray-700 text-[11px] font-bold px-3 py-1.5 rounded-full">
                                          {tag}
                                     </span>
                                 ))}
                             </div>

                             {/* Full Width Button */}
                             <button className="w-full bg-[#1f5f5b] hover:bg-[#164542] text-white font-bold py-3 rounded-2xl transition-colors shadow-lg shadow-[#1f5f5b]/20">
                                 View Details
                             </button>
                         </div>
                     </div>
                 ))}
             </div>
          </div>
        </div>
      </main>

      {/* ---- 4. UPDATED: TRENDY SHARE POPUP MODAL ---- */}
      {isShareOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200 border border-white/50 ring-1 ring-black/5">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">Share Property</h3>
              <button 
                onClick={() => setIsShareOpen(false)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Trendy Icons Row */}
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar justify-center px-2 mb-4">
              {/* WHATSAPP (Original Icon) */}
              <div className="flex flex-col items-center gap-3 group min-w-[64px] cursor-pointer">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#25D366] text-white shadow-lg shadow-[#25D366]/20 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  <WhatsAppIcon />
                </div>
                <span className="text-xs text-gray-600 font-bold">WhatsApp</span>
              </div>

              {/* Facebook */}
              <div className="flex flex-col items-center gap-3 group min-w-[64px] cursor-pointer">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#1877F2] text-white shadow-lg shadow-[#1877F2]/20 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  <Facebook className="w-7 h-7 fill-current" />
                </div>
                <span className="text-xs text-gray-600 font-bold">Facebook</span>
              </div>

              {/* X / Twitter */}
              <div className="flex flex-col items-center gap-3 group min-w-[64px] cursor-pointer">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-black text-white shadow-lg shadow-black/20 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  <Twitter className="w-6 h-6 fill-current" />
                </div>
                <span className="text-xs text-gray-600 font-bold">X</span>
              </div>

              {/* Copy Link */}
              <div className="flex flex-col items-center gap-3 group min-w-[64px] cursor-pointer" onClick={handleCopyLink}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-100 text-gray-700 shadow-lg border border-gray-200 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:bg-gray-200">
                   {copied ? <Check className="w-7 h-7 text-green-600" /> : <Share2 className="w-7 h-7" />}
                </div>
                <span className="text-xs text-gray-600 font-bold">Copy</span>
              </div>
            </div>

            {/* Input Field */}
            <div className="mt-6 flex items-center gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-200 inner-shadow">
              <div className="flex-1 px-3 text-sm text-gray-500 truncate font-mono">
                {shareUrl}
              </div>
              <button 
                onClick={handleCopyLink}
                className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-md"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}