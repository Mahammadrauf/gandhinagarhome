'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import API_URL from '@/app/config/config';
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
import { fetchPropertyDetail, fetchPropertyDetailBySlug, getMockPropertyDetail, PropertyDetail } from '@/lib/propertyDetailApi';
import { fetchSimilarProperties, FrontendProperty } from '@/lib/api';

// --- WHATSAPP ICON COMPONENT (For Share Modal) ---
const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

// ---- THEME ----
const getTheme = (type: string) => {
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

export default function PropertyDetailsPage({ params }: { params: { slug: string } }) {
  const [mediaMode, setMediaMode] = useState('photos');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarProperties, setSimilarProperties] = useState<FrontendProperty[]>([]);
  
  // -- HOVER STATES FOR DYNAMIC COLORING --
  const [hoveredOverview, setHoveredOverview] = useState<number | null>(null);
  const [hoveredDetail, setHoveredDetail] = useState<number | null>(null);

  // -- SHARE MODAL STATE --
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // -- UNLOCK STATE --
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockStats, setUnlockStats] = useState<any>(null);
  const [contactInfo, setContactInfo] = useState<any>(null);
  
  const router = useRouter();
  const propertySlug = params.slug;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch property data
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const propertyData = await fetchPropertyDetailBySlug(propertySlug);
        
        if (propertyData) {
          setProperty(propertyData);
        } else {
          // Use mock data as fallback
          console.log('Using mock data as fallback');
          setProperty(getMockPropertyDetail());
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError('Failed to load property details');
        // Use mock data as fallback
        setProperty(getMockPropertyDetail());
      } finally {
        setLoading(false);
      }
    };

    if (propertySlug) {
      loadProperty();
    }
  }, [propertySlug]);

  // Fetch similar properties
  useEffect(() => {
    const loadSimilarProperties = async () => {
      try {
        const similarData = await fetchSimilarProperties(property?.id || '');
        setSimilarProperties(similarData);
      } catch (err) {
        console.error('Error loading similar properties:', err);
        setSimilarProperties([]);
      }
    };

    if (property?.id) {
      loadSimilarProperties();
    }
  }, [property?.id]);

  // Use theme from property data or fallback
  const theme = property ? property.theme : getTheme('exclusive');

  // Mock URL for sharing
  const shareUrl = `https://gandhinagarhomes.com/properties/${propertySlug || 'vinayak-courtyard'}`;

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Show error state
  if (error && !property) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/buy" className="text-blue-600 hover:underline">
              ← Back to Properties
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // If no property data, show not found
  if (!property) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
            <Link href="/buy" className="text-blue-600 hover:underline">
              ← Back to Properties
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

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

  const downloadFile = async (url?: string, fallbackName: string = 'document.pdf') => {
    if (!url) return;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = fallbackName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(objectUrl);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUnlockContact = async () => {
    try {
      // Check if user is logged in and get their role
      const savedUser = localStorage.getItem('gh_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.isLoggedIn && parsedUser.role === 'seller') {
          alert('You are not eligible to unlock seller as you are logged in as seller.');
          return;
        }
      }
      
      // Get auth token
      const token = localStorage.getItem("token") ||
                   localStorage.getItem("gh_token") ||
                   localStorage.getItem("authToken") ||
                   "";
      
      if (!token) {
        // Check if user has any saved user data to determine if they're registered
        const savedUser = localStorage.getItem('gh_user');
        const isUserRegistered = savedUser && JSON.parse(savedUser).isLoggedIn;
        
        if (!isUserRegistered) {
          alert('You need to register first before unlocking seller details.\n\nPlease sign up to create an account, then you can unlock property owner contact information.');
        } else {
          alert('Your session has expired. Please log in again to unlock seller details.');
        }
        return;
      }
      
      // Call unlock API
      const response = await axios.post(
        `${API_URL}/properties/${property?.id}/unlock`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.success) {
        const { contact, unlockStats } = response.data.data;
        setIsUnlocked(true);
        setContactInfo(contact);
        setUnlockStats(unlockStats);
      } else {
        if (response.data.data?.unlockStats) {
          const stats = response.data.data.unlockStats;
          alert(response.data.message + `\n\nCurrent Status: ${stats.usedUnlocks}/${stats.totalLimit} unlocks used.`);
        } else {
          alert(response.data.message || 'Failed to unlock property. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Error unlocking contact:', error);
      if (error.response?.status === 403) {
        const errorData = error.response.data;
        if (errorData.data?.unlockStats) {
          const stats = errorData.data.unlockStats;
          alert(errorData.message + `\n\nCurrent Status: ${stats.usedUnlocks}/${stats.totalLimit} unlocks used.\n\nPlease upgrade your plan to unlock more properties.`);
        } else {
          alert(errorData.message || 'Access denied. Please purchase a subscription.');
          router.push('/buy/subscription');
        }
      } else {
        alert('Failed to unlock contact details. Please try again.');
      }
    }
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
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push('/buy');
              }}
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
                        disabled={!property.videoUrl}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 shadow-sm border ${
                          isVideoActive ? 'bg-gray-900 text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        } ${!property.videoUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
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

                {/* Documents Section */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Property Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:${theme.lightBg} hover:border-[${theme.borderColor}] transition-all group cursor-default relative overflow-hidden ${!property.saleDeedUrl ? 'opacity-60' : ''}`}>
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
                               <button type="button" disabled={!property.saleDeedUrl} onClick={(e) => { e.preventDefault(); e.stopPropagation(); downloadFile(property.saleDeedUrl, 'sale-deed.pdf'); }} className={`bg-white p-2 rounded-lg border border-gray-200 text-gray-400 group-hover:text-[${theme.borderColor}] group-hover:border-[${theme.borderColor}]/30 shadow-sm transition-all ${!property.saleDeedUrl ? 'cursor-not-allowed' : ''}`}>
                                   <Download className="w-4 h-4" />
                               </button>
                          </div>

                        <div className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:${theme.lightBg} hover:border-[${theme.borderColor}] transition-all group cursor-default relative overflow-hidden ${!property.brochureUrl ? 'opacity-60' : ''}`}>
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
                               <button type="button" disabled={!property.brochureUrl} onClick={(e) => { e.preventDefault(); e.stopPropagation(); downloadFile(property.brochureUrl, 'brochure.pdf'); }} className={`bg-white p-2 rounded-lg border border-gray-200 text-gray-400 group-hover:text-[${theme.borderColor}] group-hover:border-[${theme.borderColor}]/30 shadow-sm transition-all ${!property.brochureUrl ? 'cursor-not-allowed' : ''}`}>
                                   <Download className="w-4 h-4" />
                               </button>
                          </div>
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
                  {isUnlocked ? (
                    // Show actual map when unlocked
                    <div className="relative h-64 md:h-72 rounded-xl overflow-hidden">
                      <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    // Show placeholder when locked
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
                  )}
                  <div className="flex justify-between items-center px-4 py-3 bg-white rounded-b-xl">
                     <p className="text-xs text-gray-500 font-medium">
                       {isUnlocked ? property.location : 'Approx: Raysan, Gandhinagar – 382421'}
                     </p>
                     <button 
                       className="text-xs font-bold hover:underline flex items-center gap-1" 
                       style={{ color: theme.primary }}
                       onClick={() => {
                         const mapUrl = isUnlocked 
                           ? `https://maps.google.com/?q=${encodeURIComponent(property.location)}`
                           : `https://maps.google.com/?q=Raysan,+Gandhinagar,+Gujarat,+India`;
                         window.open(mapUrl, '_blank');
                       }}
                     >
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
                            {isUnlocked ? (
                                <span className="text-sm font-mono font-bold text-gray-900">
                                    {contactInfo?.phone || property.seller.phone}
                                </span>
                            ) : (
                                <span className="text-sm text-gray-400 italic bg-gray-100 px-2 py-0.5 rounded select-none cursor-pointer hover:bg-gray-200 transition-colors" title="Unlock to view">
                                    **********
                                </span>
                            )}
                        </div>
                        {/* <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Email</span>
                            <span className={`text-sm ${isUnlocked ? 'text-gray-900' : 'text-gray-400 italic bg-gray-100 px-2 py-0.5 rounded select-none cursor-pointer hover:bg-gray-200'} transition-colors`} title={isUnlocked ? '' : 'Unlock to view'}>
                                {isUnlocked ? contactInfo?.email || property.seller.email : property.seller.email}
                            </span>
                        </div> */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">WhatsApp</span>
                            {isUnlocked ? (
                                <span className="text-sm font-bold text-gray-900">
                                    {contactInfo?.whatsapp || property.seller.whatsapp}
                                </span>
                            ) : (
                                <span className="text-sm text-gray-400 italic bg-gray-100 px-2 py-0.5 rounded select-none cursor-pointer hover:bg-gray-200 transition-colors" title="Unlock to view">
                                    **********
                                </span>
                            )}
                        </div>
                    </div>
                  </div>

                  <button onClick={handleUnlockContact} className={`w-full text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] mb-3 flex items-center justify-center gap-2 shadow-lg text-base ${theme.buttonBg} ${theme.buttonHover} hover:shadow-xl`} style={{ boxShadow: `0 10px 25px -5px ${theme.primary}40` }}>
                      <ShieldCheck className="w-5 h-5" />
                      {isUnlocked ? 'Contact Details Unlocked' : 'Unlock Seller'}
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
        </div>
      </main>

      {/* Similar Properties Section */}
      <div className="mt-12 mb-10 pt-10 border-t border-gray-200 relative group">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-2xl font-bold text-gray-900">Similar homes you might like</h2>
            <Link href="/properties" className="text-sm font-bold hover:underline flex items-center gap-1 text-[#1f5f5b]">
                See all <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>

          {/* Scroll Buttons */}
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
                  <Image src={sim.image} alt={sim.location} fill className="object-cover" />
                  
                  {/* Floating Price Badge (Bottom Left) */}
                  <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-xl shadow-md z-10">
                    <span className="text-lg font-extrabold text-[#1f5f5b]">{sim.price}</span>
                  </div>

                  {/* Floating Status Badge (Top Right) */}
                  {sim.tag.text && (
                    <div className="absolute top-4 right-4 bg-[#b08d55]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm" style={{ backgroundColor: sim.tag.color + 'e6' }}>
                      {sim.tag.text}
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-5 flex-grow flex flex-col bg-[#fffbf2]">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{sim.location.split(',')[0]}</h3>
                    <p className="text-sm text-gray-500 font-normal">{sim.location}</p>
                  </div>
                  
                  {/* Icons Row */}
                  <div className="flex items-center gap-5 mb-5 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Home className="w-4 h-4 stroke-[2.5]" />
                      <span className="text-sm font-semibold">{sim.beds} bd</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4 stroke-[2.5]" />
                      <span className="text-sm font-semibold">{sim.baths} ba</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 stroke-[2.5]" />
                      <span className="text-sm font-semibold">{sim.sqft} sq ft</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {sim.features.map((tag, i) => (
                      <span key={i} className="bg-[#f5f2e8] text-[#8b6f47] text-xs font-semibold px-3 py-1 rounded-full border border-[#e6d7c3]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Enquire Button */}
                  <div className="mt-auto">
                    <button className="w-full bg-[#1f5f5b] hover:bg-[#164542] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg active:scale-95">
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {similarProperties.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-500">
              No similar properties found right now.
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}