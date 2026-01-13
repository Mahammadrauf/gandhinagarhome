"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Home, 
  MapPin, 
  Image as ImageIcon, 
  CheckCircle2, 
  Edit3, 
  ShieldCheck,
  FileText,
  CreditCard,
  AlertCircle,
  RotateCcw 
} from "lucide-react";

// Utility functions
const formatPrice = (price: string): string => {
  const numPrice = parseFloat(price.replace(/,/g, ""));
  if (isNaN(numPrice)) return price;
  if (numPrice >= 10000000)
    return `₹${parseFloat((numPrice / 10000000).toFixed(2))} Cr`;
  if (numPrice >= 100000)
    return `₹${parseFloat((numPrice / 100000).toFixed(2))} Lac`;
  return `₹${numPrice.toLocaleString("en-IN")}`;
};

const formatArea = (size: string, unit: string): string =>
  size ? `${size} ${unit}` : "";

export default function ConfirmationPage() {
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("pendingListing");
    if (data) {
      setListing(JSON.parse(data));
    } else {
      router.push("/sell/form");
    }
    setLoading(false);
  }, [router]);

  const handleEditStep = (stepNumber: number) => {
    router.push(`/sell/form?mode=edit&step=${stepNumber}`);
  };

  const handleConfirmSubmit = async () => {
    if (!listing) return;
    setSubmitting(true);
    setTimeout(() => {
      localStorage.removeItem("pendingListing");
      router.push("/sell/subscription"); 
    }, 2000);
  };

  const handleStartOver = () => {
    localStorage.removeItem("pendingListing");
    router.push("/sell/form");
  };

  if (loading || !listing) return null;

  // INFO BLOCK - Accepts className for grid spans
  const InfoBlock = ({ label, value, className = "" }: { label: string; value: any; className?: string }) => (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">
        {label}
      </span>
      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 min-h-[46px] flex items-center shadow-sm">
        <p className="text-[13px] font-semibold text-gray-700 truncate w-full">
          {value && value !== "" ? value : <span className="text-gray-300 italic font-normal">Not provided</span>}
        </p>
      </div>
    </div>
  );

  const ReviewSection = ({
    title,
    icon: Icon,
    stepIndex,
    children,
  }: {
    title: string;
    icon: any;
    stepIndex: number;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8 overflow-hidden transition-all hover:shadow-md">
      <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#0b6b53]/[0.02] to-transparent border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0b6b53] text-white flex items-center justify-center shadow-md shadow-[#0b6b53]/20">
            <Icon size={16} />
          </div>
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">
            {title}
          </h2>
        </div>
        <button
          onClick={() => handleEditStep(stepIndex)}
          className="flex items-center gap-1 text-[11px] font-bold text-[#0b6b53] hover:underline bg-[#0b6b53]/5 px-3 py-1.5 rounded-lg border border-[#0b6b53]/10 transition-colors hover:bg-[#0b6b53]/10"
        >
          <Edit3 size={12} /> Edit Details
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  const StatusTag = ({ label, exists }: { label: string; exists: boolean }) => (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
        exists
          ? "bg-emerald-50 border-emerald-100"
          : "bg-gray-50 border-gray-100 border-dashed"
      }`}
    >
      <div className="flex items-center gap-2">
        <FileText size={14} className={exists ? "text-emerald-600" : "text-gray-300"} />
        <span className={`text-[11px] font-bold uppercase ${exists ? "text-emerald-900" : "text-gray-400"}`}>
          {label}
        </span>
      </div>
      {exists ? (
        <CheckCircle2 size={16} className="text-emerald-600" />
      ) : (
        <span className="text-[10px] font-black text-gray-300">MISSING</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[#0b6b53]/10 rounded-xl">
                        <ShieldCheck className="text-[#0b6b53]" size={26} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-gray-900 tracking-tight">
                            Verify Your Listing
                        </h1>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                            Please review all details below. This is exactly how your property will appear to buyers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT CONTENT AREA */}
          <div className="flex-1">
            
            {/* 1. Seller Info - PERFECT 2-ROW GRID */}
            <ReviewSection title="Seller & Contact Information" icon={User} stepIndex={0}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoBlock label="First Name" value={listing.firstName} />
                <InfoBlock label="Middle Name" value={listing.middleName} />
                <InfoBlock label="Last Name" value={listing.lastName} />
                <InfoBlock label="WhatsApp Number" value={listing.whatsappNumber ? `${listing.countryCode} ${listing.whatsappNumber}` : ""} />
                
                {/* Email spans 2 columns */}
                <InfoBlock label="Email" value={listing.email} className="col-span-1 md:col-span-2" />
                
                <InfoBlock label="Mobile Number" value={listing.mobileNumber ? `${listing.countryCode} ${listing.mobileNumber}` : ""} />
                
                {/* Verification Badge - Compact */}
                <div className="col-span-1 flex flex-col gap-1.5 w-full">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1 invisible">
                        Status
                    </span>
                    <div className="flex items-center justify-center gap-2 px-3 py-3 bg-emerald-50 border border-emerald-100 rounded-xl min-h-[46px]">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-tight">
                            Verified
                        </span>
                    </div>
                </div>
              </div>
            </ReviewSection>

            {/* 2. Property Specs - OPTIMIZED 3-ROW GRID */}
            <ReviewSection title="Property Specifications" icon={Home} stepIndex={1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Row 1: Title (2) + Type (1) + Config (1) = 4 cols */}
                <InfoBlock label="Property Title" value={listing.title} className="col-span-2" />
                <InfoBlock label="Prop Type" value={listing.propertyType} />
                <InfoBlock label="Configuration" value={listing.bedrooms ? `${listing.bedrooms} BHK` : ""} />
                
                {/* Row 2: Baths (1) + Balcony (1) + Parking (1) + Area (1) = 4 cols */}
                <InfoBlock label="Bathrooms" value={listing.bathrooms} />
                <InfoBlock label="Balcony" value={listing.balcony} />
                <InfoBlock label="Parking" value={listing.parking} />
                <InfoBlock label="Area (Size)" value={formatArea(listing.propertySize, listing.propertySizeUnit)} />

                {/* Row 3: Age (1) + Furnishing (1) + Price (2) = 4 cols */}
                <InfoBlock label="Property Age" value={listing.ageOfProperty} />
                <InfoBlock label="Furnishing" value={listing.furnishing} />
                <InfoBlock 
                    label="Asking Price - All-inclusive(Excl.Stamp Duty)" 
                    value={listing.price ? formatPrice(listing.price.toString()) : ""} 
                    className="col-span-2" // Spanning 2 cols fills the row perfectly
                />
              </div>

              {listing.amenities?.length > 0 && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-3">
                    Selected Amenities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {listing.amenities.map((a: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-200"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </ReviewSection>

            {/* 3. Location - 2 ROWS (4 items top, 1 full item bottom) */}
            <ReviewSection title="Location Details" icon={MapPin} stepIndex={2}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <InfoBlock label="Unit No" value={listing.unitNo} />
                <InfoBlock label="Locality" value={listing.locality} />
                <InfoBlock label="City" value={listing.city} />
                <InfoBlock label="Pincode" value={listing.pincode} />
              </div>
              
              <div className="p-4 bg-[#0b6b53]/5 rounded-xl border border-[#0b6b53]/10 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-[10px] font-bold text-[#0b6b53] uppercase tracking-widest mb-1.5">
                        Exact Registered Address
                    </p>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                        {listing.address || "No Address Provided"}
                    </p>
                </div>
                <MapPin size={60} className="absolute right-[-10px] bottom-[-15px] text-[#0b6b53] opacity-[0.08] transform -rotate-12" />
              </div>
            </ReviewSection>

            {/* 4. Media - 1 ROW */}
            <ReviewSection title="Media & Documents" icon={ImageIcon} stepIndex={3}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border-2 border-dashed border-[#0b6b53]/20 bg-[#0b6b53]/5 p-4 flex flex-col items-center justify-center min-h-[80px]">
                  <p className="text-2xl font-black text-[#0b6b53]">
                    {listing.photosCount}
                  </p>
                  <p className="text-[9px] font-bold text-[#0b6b53] uppercase">
                    Photos
                  </p>
                </div>
                <StatusTag label="Video Tour" exists={!!listing.hasVideo} />
                <StatusTag label="Brochure" exists={!!listing.hasBrochure} />
                <StatusTag label="Sale Deed" exists={!!listing.hasSaleDeed} />
              </div>
            </ReviewSection>

            {/* MOVED & STYLED: Start Over Button */}
            <button
                onClick={handleStartOver}
                className="w-fit px-8 h-12 rounded-2xl bg-[#0b6b53] text-white font-bold hover:bg-[#085341] transition-all shadow-md shadow-[#0b6b53]/20 flex items-center justify-center gap-2"
            >
                <RotateCcw size={16} /> Start Over
            </button>
          </div>

          {/* RIGHT SIDEBAR SUMMARY */}
          <div className="lg:w-[380px]">
            <div className="bg-white rounded-[2rem] border border-gray-200 shadow-xl p-8 sticky top-28">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                Publication Preview
              </h3>

              {/* Property Card Preview */}
              <div className="rounded-2xl border border-[#0b6b53]/10 bg-[#0b6b53]/[0.03] p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Home size={64} className="text-[#0b6b53]" />
                </div>
                <span className="px-2 py-0.5 rounded bg-[#0b6b53] text-white text-[9px] font-black uppercase tracking-wider relative z-10">
                  {listing.propertyType}
                </span>
                <h4 className="text-xl font-bold text-gray-900 truncate mt-3 relative z-10">
                  {listing.title}
                </h4>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1 relative z-10">
                    <MapPin size={12} /> {listing.locality}
                </p>

                <div className="mt-6 pt-4 border-t border-[#0b6b53]/10 flex justify-between items-end relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Total Valuation - All-inclusive(Excl.Stamp Duty)</span>
                    <span className="text-2xl font-black text-[#0b6b53]">
                        {formatPrice(listing.price?.toString() || "0")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                
                {/* CTA BUTTON */}
                <button
                    onClick={handleConfirmSubmit}
                    disabled={submitting}
                    className="w-full h-14 rounded-2xl bg-[#0b6b53] text-white font-bold hover:bg-[#085341] transition-all shadow-lg shadow-[#0b6b53]/20 disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                    {submitting ? "Redirecting..." : (
                        <>
                            Confirm & Select Plan <CreditCard size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
                
                {/* Info Note */}
                <div className="flex gap-3 px-1">
                    <AlertCircle size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-medium text-gray-400 leading-relaxed">
                        By clicking above, you confirm that all details are correct. You will be redirected to the subscription plan page.
                    </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                 <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest">
                    Gandhinagar Homes Secure
                  </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}