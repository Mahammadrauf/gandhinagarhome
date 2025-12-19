// app/sell/page.tsx
"use client";

import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment, useRef, useState, KeyboardEvent } from "react"; 

type Step = 0 | 1 | 2 | 3;
const stepTitles = ["Basic Information", "Specifications", "Location", "Media Upload"];

const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const onlyDigitsOrSymbols = (v: string) => /^[0-9+\-\s()]*$/.test(v);

// Utility functions for data formatting
const formatPrice = (price: string): string => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return price;
  
  if (numPrice >= 10000000) { // 1 Cr = 10,000,000
    const cr = (numPrice / 10000000).toFixed(1);
    return `₹${cr} Cr`;
  } else if (numPrice >= 100000) { // 1 Lac = 100,000
    const lac = (numPrice / 100000).toFixed(1);
    return `₹${lac} Lac`;
  } else {
    return `₹${numPrice.toLocaleString()}`;
  }
};

const mapAgeToLabel = (age: string): string => {
  const numAge = age === "25+" ? 25 : parseInt(age);
  if (isNaN(numAge)) return age;
  
  if (numAge === 0 || numAge === 1) return "New";
  if (numAge >= 2 && numAge <= 5) return "1-5 Years";
  if (numAge >= 6 && numAge <= 10) return "5-10 Years";
  if (numAge >= 11 && numAge <= 15) return "10-15 Years";
  if (numAge >= 16 && numAge <= 20) return "15-20 Years";
  if (numAge >= 21) return "20+ Years";
  
  return age;
};

const formatArea = (size: string, unit: string): string => {
  return `${size} ${unit}`;
};

// Small inline chevron icon for dropdowns
const DropdownChevron = () => (
  <svg
    className="w-4 h-4 text-gray-500 ml-2 flex-shrink-0"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 8L10 12L14 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Updated Sell page
 */

export default function SellPage() {
  const [step, setStep] = useState<Step>(0);

  // Basic Info
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState(""); 
  const [lastName, setLastName] = useState(""); 
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [alternateNumber, setAlternateNumber] = useState(""); 
  
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Specifications
  const [title, setTitle] = useState(""); // property name
  const [bedrooms, setBedrooms] = useState("2");
  
  // UPDATED DEFAULT
  const [propertyType, setPropertyType] = useState("Apartment");
  
  const [bathrooms, setBathrooms] = useState("2");
  const [balcony, setBalcony] = useState("0");
  const [parking, setParking] = useState("None");
  // Age of property 1–25 and 25+
  const [ageOfProperty, setAgeOfProperty] = useState("1");
  const [furnishing, setFurnishing] = useState<"Unfurnished" | "Semi-furnished" | "Fully furnished">("Unfurnished");
  
  // UPDATED DEFAULT STATE FOR AVAILABILITY
  const [availability, setAvailability] = useState("Ready to Move");
  
  const [price, setPrice] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [currentAmenity, setCurrentAmenity] = useState("");

  // NEW: Size of Property
  const [propertySize, setPropertySize] = useState("");
  const [propertySizeUnit, setPropertySizeUnit] = useState<"sq ft" | "sq m" | "sq yd">("sq ft");

  // Location
  // UPDATED: Default matches new dropdown
  const [city, setCity] = useState("Gandhinagar");
  const [locality, setLocality] = useState("");
  const [society, setSociety] = useState(""); 
  const [unitNo, setUnitNo] = useState(""); 
  const [pincode, setPincode] = useState("");

  // Media
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const photoRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLInputElement | null>(null);

  // NEW: Docs
  const [saleDeed, setSaleDeed] = useState<File | null>(null);
  const [brochure, setBrochure] = useState<File | null>(null);
  const saleDeedRef = useRef<HTMLInputElement | null>(null);
  const brochureRef = useRef<HTMLInputElement | null>(null);

  // UI
  const [triedContinue, setTriedContinue] = useState(false);
  const [saving, setSaving] = useState(false);

  // validation
  // Step 1 Validation
  const isFirstNameValid = firstName.trim().length >= 2; 
  const isLastNameValid = lastName.trim().length >= 2; 
  const isEmailValid = validateEmail(email);
  const isMobileValid = mobile.trim().length >= 10 && onlyDigitsOrSymbols(mobile); 
  const canContinueStep1 = isFirstNameValid && isLastNameValid && isEmailValid && isMobileValid && isOtpVerified;

  // Step 2 Validation
  const isTitleValid = title.trim().length >= 3;
  const isBedroomsValid = Number(bedrooms.replace("+", "")) >= 1;
  const isBathroomsValid = Number(bathrooms.replace("+", "")) >= 1;
  const isPriceValid = price.trim().length > 0;
  const canContinueStep2 = isTitleValid && isBedroomsValid && isBathroomsValid && isPriceValid;

  // Step 3 Validation
  const isCityValid = city.trim().length > 2;
  const isLocalityValid = locality.trim().length > 2;
  const isPincodeValid = pincode.trim().length >= 6 && onlyDigitsOrSymbols(pincode);
  const isSocietyValid = society.trim().length >= 3; 
  const isUnitNoValid = unitNo.trim().length > 0; 
  const canContinueStep3 = isCityValid && isLocalityValid && isPincodeValid && isSocietyValid && isUnitNoValid;
  

  // --- Helper arrays for ALL dropdowns ---
  
  // UPDATED: Property Type Options
  const propertyTypeOptions = ["Apartment", "Tenement", "Bungalow", "Penthouse", "Plot", "Shop", "Office"];
  
  const bedroomOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
  const balconyOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
  const bathroomOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
  const parkingOptions = ["None", "1", "2", "3+"];

  // Age of property: 1–25 and 25+
  const ageOfPropertyOptions = [
    ...Array.from({ length: 25 }, (_, i) => `${i + 1}`),
    "25+",
  ];

  const furnishingOptions = ["Unfurnished", "Semi-furnished", "Fully furnished"];
  
  // UPDATED: Availability (Possession) Options
  const availabilityOptions = ["Ready to Move", "After 1 Month", "After 2 Months", "After 3 Months", "Above 3 Months"];
  
  // UPDATED: City Options for Dropdown
  const cityOptions = ["Gandhinagar", "Gift City", "Ahmedabad"];

  const amenitySuggestions = ["Lift", "Security", "Garden", "Gym", "Swimming Pool", "Clubhouse", "Parking"];

  const propertySizeUnitOptions: Array<"sq ft" | "sq m" | "sq yd"> = ["sq ft", "sq m", "sq yd"];

  const canNavigateTo = (target: number) => {
    if (target === 0) return true;
    if (target === 1) return canContinueStep1;
    if (target === 2) return canContinueStep1 && canContinueStep2;
    if (target === 3) return canContinueStep1 && canContinueStep2 && canContinueStep3;
    return false;
  };

  // --- UPDATED: Added scroll to top ---
  const goTo = (s: Step) => {
    if (!canNavigateTo(s)) {
      setTriedContinue(true);
      return;
    }
    setStep(s);
    setTriedContinue(false); 
    window.scrollTo({ top: 0, behavior: 'auto' }); // Scroll to top
  };

  const next = () => setStep((prev) => ((prev + 1) % 4) as Step);
  const prev = () => setStep((prev) => (prev - 1 >= 0 ? (prev - 1) : 0) as Step);

  // Save draft (placeholder)
  const handleSaveDraft = () => {
    setSaving(true);
    const payload = {
      firstName, middleName, lastName, email, mobile, alternateNumber,
      title,
      bedrooms,
      propertyType,
      bathrooms,
      balcony,
      parking,
      ageOfProperty,
      furnishing,
      availability,
      price,
      amenities,
      propertySize,
      propertySizeUnit,
      city, locality, society, unitNo, pincode,
      photosCount: photos.length,
      hasVideo: !!video,
      hasSaleDeed: !!saleDeed,
      hasBrochure: !!brochure,
      status: "draft",
      savedAt: new Date().toISOString(),
    };
    console.log("Save draft:", payload);
    setTimeout(() => {
      setSaving(false);
      alert("Draft saved locally (console). Backend pending.");
    }, 700);
  };

  // Submit (stub)
  const handleSubmit = async () => {
    if (!canContinueStep1) {
      setStep(0);
      setTriedContinue(true);
      alert("Please complete Basic Information and verify your mobile number.");
      return;
    }
    if (!canContinueStep2) {
      setStep(1);
      setTriedContinue(true);
      alert("Please complete Specifications.");
      return;
    }
    if (!canContinueStep3) {
      setStep(2);
      setTriedContinue(true);
      alert("Please complete Location details (Project, Unit, Locality, City, Pincode).");
      return;
    }

    const payload = {
      // Original form data
      firstName, middleName, lastName, email, mobile, alternateNumber,
      title,
      bedrooms,
      propertyType,
      bathrooms,
      balcony,
      parking,
      ageOfProperty,
      furnishing,
      availability,
      price,
      amenities,
      propertySize,
      propertySizeUnit,
      city, locality, society, unitNo, pincode,
      photosCount: photos.length,
      hasVideo: !!video,
      hasSaleDeed: !!saleDeed,
      hasBrochure: !!brochure,
      submittedAt: new Date().toISOString(),
      
      // Formatted data for display components
      priceLabel: formatPrice(price),
      priceCr: parseFloat(price) / 10000000, // For sorting/filtering
      areaSqft: propertySizeUnit === "sq ft" ? parseFloat(propertySize) : 0, // For backward compatibility
      areaDisplay: formatArea(propertySize, propertySizeUnit),
      ageLabel: mapAgeToLabel(ageOfProperty),
      readyStatus: availability, // Map availability to readyStatus
      type: propertyType, // Map propertyType to type
    };

    try {
      const res = await fetch("/api/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Listing submitted! We will contact you.");
        setStep(0);
        setTriedContinue(false); 
      } else {
        const body = await res.json().catch(() => ({}));
        alert("Submission failed: " + (body.message || "Server error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error — try again.");
    }
  };

  // Files
  const onAddPhotos = (files: FileList | null) => {
    if (!files) return;
    const maxRemaining = 9 - photos.length;
    const arr = Array.from(files).slice(0, maxRemaining);
    if (arr.length === 0) return;
    setPhotos((p) => [...p, ...arr]);
  };
  const onAddVideo = (file: FileList | null) => {
    if (!file || file.length === 0) return;
    setVideo(file[0]);
  };
  const removePhoto = (i: number) => setPhotos((p) => p.filter((_, idx) => idx !== i));
  const removeVideo = () => setVideo(null);

  const onAddSaleDeed = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setSaleDeed(fileList[0]);
  };
  const onAddBrochure = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setBrochure(fileList[0]);
  };
  const removeSaleDeed = () => setSaleDeed(null);
  const removeBrochure = () => setBrochure(null);

  // --- UPDATED: Added scroll to top ---
  const onContinueFromStep1 = () => {
    setTriedContinue(true); 
    if (!canContinueStep1) {
      if (!isOtpVerified) {
        alert("Please verify your mobile number to continue.");
      }
      return;
    }
    setStep(1);
    setTriedContinue(false); 
    window.scrollTo({ top: 0, behavior: 'auto' }); // Scroll to top
  };

  // --- UPDATED: Added scroll to top ---
  const onContinueFromStep2 = () => {
    if (!canContinueStep2) {
      setTriedContinue(true); 
      return;
    }
    setStep(2);
    setTriedContinue(false); 
    window.scrollTo({ top: 0, behavior: 'auto' }); // Scroll to top
  };

  // --- UPDATED: Added scroll to top ---
  const onContinueFromStep3 = () => {
    if (!canContinueStep3) {
      setTriedContinue(true); 
      return;
    }
    setStep(3);
    setTriedContinue(false); 
    window.scrollTo({ top: 0, behavior: 'auto' }); // Scroll to top
  };

  // --- OTP Functions ---
  const handleSendOtp = async () => {
    setTriedContinue(true);
    if (!isMobileValid) return;

    setIsSendingOtp(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Sending OTP to", mobile);
    
    setIsSendingOtp(false);
    setOtpSent(true);
    alert("OTP Sent to your mobile number (use 1234 to verify)");
  };

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Verifying OTP", otp);

    if (otp === "1234") { // Placeholder OTP
      setIsVerifying(false);
      setIsOtpVerified(true);
      alert("Mobile number verified successfully!");
    } else {
      setIsVerifying(false);
      alert("Invalid OTP. Please try again.");
    }
  };
  
  // --- Amenities Functions ---
  const addAmenity = (amenityToAdd: string) => {
    const trimmed = amenityToAdd.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities([...amenities, trimmed]);
    }
    setCurrentAmenity("");
  };
  const removeAmenity = (indexToRemove: number) => {
    setAmenities(amenities.filter((_, index) => index !== indexToRemove));
  };
  const handleAmenityKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      addAmenity(currentAmenity);
    }
  };


  // Reusable classes
  const inputBase = "w-full h-12 rounded-xl px-4 border outline-none shadow-sm";
  const inputNormal = `${inputBase} border-gray-100 bg-white`;
  const selectNormal = `${inputNormal} appearance-none bg-no-repeat pr-10 text-left`; // background arrow removed; we show SVG chevron
  const inputError = `${inputBase} border-red-200 bg-red-50`;
  const btnPrimary = "inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#0b6b53] text-white font-semibold transition transform hover:scale-[1.02]";
  const btnSecondary = "inline-flex items-center justify-center h-12 px-5 rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:shadow-sm";
  const btnLight = "inline-flex items-center justify-center h-12 px-6 rounded-full bg-gray-100 text-gray-800 font-semibold transition hover:bg-gray-200";
  const btnDisabled = "inline-flex items-center justify-center h-12 px-6 rounded-full bg-gray-300 text-white cursor-not-allowed";
  const fieldLabel = "text-sm font-semibold text-gray-800 mb-2 block";
  const cardWrapper = "p-6 rounded-xl border border-gray-100 shadow-sm";


  return (
    <div className="min-h-screen bg-[#f3fbf7]">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Listing Steps</h4>

              <nav className="space-y-3">
                {stepTitles.map((t, i) => {
                  const idx = i as Step;
                  const active = idx === step;
                  const disabled = !canNavigateTo(idx);
                  return (
                    <button
                      key={t}
                      onClick={() => goTo(idx)}
                      disabled={disabled}
                      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition ${active ? "bg-[#f1faf6] ring-1 ring-[#dbeee7]" : disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"}`}
                      aria-current={active ? "step" : undefined}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${active ? "bg-[#0b6b53] text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
                        {i + 1}
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${active ? "text-gray-900" : "text-gray-700"}`}>{t}</div>
                        <div className="text-xs text-gray-500">
                          {i === 0 ? "Seller contact & verification" : i === 1 ? "Set property details" : i === 2 ? "Map & address" : "Photos & docs"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4 text-sm text-gray-500">
                Provide accurate details to get quality inquiries.
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              
              {/* --- STEP 0: BASIC INFO --- */}
              {step === 0 && (
                <div className="space-y-6">
                  {/* Row 0: Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Step 1: Basic Information</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2l7 3v5c0 5-3 9-7 11-4-2-7-6-7-11V5l7-3z" stroke="#6b7280" strokeWidth="1.5" fill="none" />
                      </svg>
                      <span>Privacy protected</span>
                    </div>
                  </div>
                  
                  {/* Card 1: Name */}
                  <div className={`${cardWrapper} grid grid-cols-1 lg:grid-cols-3 gap-6`}>
                    <div>
                      <label className={fieldLabel}>First Name <span className="text-[#0b6b53]">*</span></label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Ramesh"
                        className={`${triedContinue && !isFirstNameValid ? inputError : inputNormal}`}
                      />
                      {triedContinue && !isFirstNameValid && <div className="text-xs text-red-600 mt-2">Enter first name (min 2).</div>}
                    </div>
                    <div>
                      <label className={fieldLabel}>Middle Name</label>
                      <input
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        placeholder="Optional"
                        className={inputNormal}
                      />
                    </div>
                    <div>
                      <label className={fieldLabel}>Last Name <span className="text-[#0b6b53]">*</span></label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Shah"
                        className={`${triedContinue && !isLastNameValid ? inputError : inputNormal}`}
                      />
                      {triedContinue && !isLastNameValid && <div className="text-xs text-red-600 mt-2">Enter last name (min 2).</div>}
                    </div>
                  </div>

                  {/* Card 2: Contact Details */}
                  <div className={`${cardWrapper} space-y-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={fieldLabel}>Email <span className="text-[#0b6b53]">*</span></label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className={`${triedContinue && !isEmailValid ? inputError : inputNormal}`}
                        />
                        {triedContinue && !isEmailValid && <div className="text-xs text-red-600 mt-2">Enter a valid email address.</div>}
                      </div>
                      <div>
                        <label className={fieldLabel}>Whatsapp Number</label>
                        <input
                          value={alternateNumber}
                          onChange={(e) => setAlternateNumber(e.target.value)}
                          placeholder="Optional"
                          className={inputNormal}
                        />
                      </div>
                    </div>

                    {/* OTP Section */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={fieldLabel}>Mobile Number <span className="text-[#0b6b53]">*</span></label>
                          <div className="flex gap-2">
                            <input
                              value={mobile}
                              onChange={(e) => setMobile(e.target.value)}
                              placeholder="+91 9XXXXXXXXX"
                              className={`${triedContinue && !isMobileValid ? inputError : inputNormal}`}
                              disabled={otpSent} 
                            />
                            <button
                              onClick={handleSendOtp}
                              disabled={!isMobileValid || otpSent || isSendingOtp}
                              className={`h-12 px-4 rounded-lg font-semibold text-sm ${(!isMobileValid || otpSent) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'}`}
                            >
                              {isSendingOtp ? "Sending..." : (otpSent ? "Sent" : "Send OTP")}
                            </button>
                          </div>
                          {triedContinue && !isMobileValid && <div className="text-xs text-red-600 mt-2">Enter a valid 10-digit number.</div>}
                        </div>

                        {otpSent && !isOtpVerified && (
                          <div>
                            <label className={fieldLabel}>Enter OTP <span className="text-[#0b6b53]">*</span></label>
                            <div className="flex gap-2">
                              <input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 4-digit OTP"
                                className={inputNormal}
                              />
                              <button
                                onClick={handleVerifyOtp}
                                disabled={isVerifying || otp.length < 4}
                                className={`h-12 px-4 rounded-lg font-semibold text-sm ${isVerifying || otp.length < 4 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                              >
                                {isVerifying ? "Verifying..." : "Verify"}
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {isOtpVerified && (
                           <div className="flex items-center justify-center h-12 bg-green-100 text-green-700 font-semibold rounded-lg">
                             ✓ Mobile Verified
                           </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">Your contact is partially visible to buyers. Full details require buyer subscription.</p>

                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={onContinueFromStep1}
                      className={canContinueStep1 ? btnPrimary : btnDisabled}
                      disabled={!canContinueStep1}
                    >
                      Continue to Specifications
                    </button>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 3L8 8l-5 2 5 2 2 5 2-5 5-2-5-2zM14 14l-2 5-2-5-5-2 5-2 2-5 2 5 5 2z"></path>
                        </svg>
                      Well-detailed listings rank higher
                    </div>
                  </div>
                </div>
              )}
              {/* --- END OF STEP 0 BLOCK --- */}


              {/* --- STEP 1: SPECIFICATIONS --- */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Row 0: Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Step 2: Specifications</h3>
                    <button className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                      </svg>
                      Set property details
                    </button>
                  </div>

                  {/* Row 1: Property Name / Type */}
                  <div className={cardWrapper + " grid grid-cols-1 md:grid-cols-2 gap-6"}>
                    <div>
                      <label className={fieldLabel}>Property Name (Society / Project) <span className="text-[#0b6b53]">*</span></label>
                      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Shilp Residency" className={`${triedContinue && !isTitleValid ? inputError : inputNormal}`} />
                      {triedContinue && !isTitleValid && <div className="text-xs text-red-600 mt-2">Please enter property name.</div>}
                    </div>

                    <div>
                      <label className={fieldLabel}>Property Type</label>
                      <Listbox value={propertyType} onChange={setPropertyType}>
                        <div className="relative">
                          <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
                            <span className="block truncate">{propertyType}</span>
                            <DropdownChevron />
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                              {propertyTypeOptions.map((option, optionIdx) => (
                                <Listbox.Option
                                  key={optionIdx}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 px-4 ${
                                      active ? 'bg-[#f1faf6] text-[#0b6b53]' : 'text-gray-900'
                                    }`
                                  }
                                  value={option}
                                >
                                  {({ selected }) => (
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {option}
                                    </span>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  </div>

                  {/* Row 2: Bedrooms / Balcony / Bathrooms */}
                  <div className={cardWrapper + " grid grid-cols-1 md:grid-cols-3 gap-6"}>
                    {/* --- BEDROOMS --- */}
                    <div>
                      <label className={fieldLabel}>Bedrooms <span className="text-[#0b6b53]">*</span></label>
                        <Listbox value={bedrooms} onChange={setBedrooms}>
                        <div className="relative">
                          <Listbox.Button className={`${selectNormal} ${triedContinue && !isBedroomsValid ? 'border-red-200' : 'border-gray-100'} flex items-center justify-between`}>
                            <span className="block truncate">{bedrooms}</span>
                            <DropdownChevron />
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-40">
                              {bedroomOptions.map((option, optionIdx) => (
                                <Listbox.Option
                                  key={optionIdx}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 px-4 ${
                                      active ? 'bg-[#f1faf6] text-[#0b6b53]' : 'text-gray-900'
                                    }`
                                  }
                                  value={option}
                                >
                                  {({ selected }) => (
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {option}
                                    </span>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                      {triedContinue && !isBedroomsValid && <div className="text-xs text-red-600 mt-2">Choose bedrooms.</div>}
                    </div>

                    {/* --- BALCONY --- */}
                    <div>
                      <label className={fieldLabel}>Balcony</label>
                      <Listbox value={balcony} onChange={setBalcony}>
                        <div className="relative">
                          <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
                            <span className="block truncate">{balcony}</span>
                            <DropdownChevron />
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-40">
                              {balconyOptions.map((option, optionIdx) => (
                                <Listbox.Option
                                  key={optionIdx}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 px-4 ${
                                      active ? 'bg-[#f1faf6] text-[#0b6b53]' : 'text-gray-900'
                                    }`
                                  }
                                  value={option}
                                >
                                  {({ selected }) => (
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {option}
                                    </span>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>

                    {/* --- BATHROOMS --- */}
                    <div>
                      <label className={fieldLabel}>Bathrooms <span className="text-[#0b6b53]">*</span></label>
                      <Listbox value={bathrooms} onChange={setBathrooms}>
                        <div className="relative">
                          <Listbox.Button className={`${selectNormal} ${triedContinue && !isBathroomsValid ? 'border-red-200' : 'border-gray-100'} flex items-center justify-between`}>
                            <span className="block truncate">{bathrooms}</span>
                            <DropdownChevron />
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-40">
                              {bathroomOptions.map((option, optionIdx) => (
                                <Listbox.Option
                                  key={optionIdx}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 px-4 ${
                                      active ? 'bg-[#f1faf6] text-[#0b6b53]' : 'text-gray-900'
                                    }`
                                  }
                                  value={option}
                                >
                                  {({ selected }) => (
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {option}
                                    </span>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                        {triedContinue && !isBathroomsValid && <div className="text-xs text-red-600 mt-2">Required</div>}
                    </div>
                  </div>

                  {/* Row 3: Parking / Age / Furnishing */}
                  <div className={cardWrapper + " grid grid-cols-1 md:grid-cols-3 gap-6"}>
                    {/* --- PARKING --- */}
                    <div>
                      <label className={fieldLabel}>Parking</label>
                      <Listbox value={parking} onChange={setParking}>
                        <div className="relative">
                          <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
                            <span className="block truncate">{parking}</span>
                            <DropdownChevron />
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-30">
                              {parkingOptions.map((option, optionIdx) => (
                                <Listbox.Option
                                  key={optionIdx}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 px-4 ${
                                      active ? 'bg-[#f1faf6] text-[#0b6b53]' : 'text-gray-900'
                                    }`
                                  }
                                  value={option}
                                >
                                  {({ selected }) => (
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {option}
                                    </span>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>

                    {/* --- AGE OF PROPERTY --- */}
                    <div>
                      <label className={fieldLabel}>Age of Property (years)</label>
                      <Listbox value={ageOfProperty} onChange={setAgeOfProperty}>
                        <div className="relative">
                          <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
                            <span className="block truncate">{ageOfProperty}</span>
                            <DropdownChevron />
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-30">
                              {ageOfPropertyOptions.map((option, optionIdx) => (
                                <Listbox.Option
                                  key={optionIdx}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 px-4 ${
                                      active ? 'bg-[#f1faf6] text-[#0b6b53]' : 'text-gray-900'
                                    }`
                                  }
                                  value={option}
                                >
                                  {({ selected }) => (
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {option}
                                    </span>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>

                    {/* --- FURNISHING --- */}
                    <div>
                      <label className={fieldLabel}>Furnishing</label>
                      <Listbox value={furnishing} onChange={setFurnishing as any}>
                        <div className="relative">
                          <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
                            <span className="block truncate">{furnishing}</span>
                            <DropdownChevron />
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-30">
                              {furnishingOptions.map((option, optionIdx) => (
                                <Listbox.Option
                                  key={optionIdx}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 px-4 ${
                                      active ? 'bg-[#f1faf6] text-[#0b6b53]' : 'text-gray-900'
                                    }`
                                  }
                                  value={option}
                                >
                                  {({ selected }) => (
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {option}
                                    </span>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  </div>

                  {/* NEW Row: Size of Property */}
                  <div className={cardWrapper + " grid grid-cols-1 md:grid-cols-2 gap-6"}>
                    <div>
                      <label className={fieldLabel}>Size of Property</label>
                      <div className="flex gap-3">
                        <input
                          value={propertySize}
                          onChange={(e) => setPropertySize(e.target.value)}
                          placeholder="e.g., 1200"
                          className={inputNormal}
                          type="number"
                          min={0}
                        />
                        <Listbox value={propertySizeUnit} onChange={setPropertySizeUnit}>
                          <div className="relative min-w-[110px]">
                            <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
                              <span className="block truncate text-sm">{propertySizeUnit}</span>
                              <DropdownChevron />
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                                {propertySizeUnitOptions.map((option) => (
                                  <Listbox.Option
                                    key={option}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 px-4 ${
                                        active ? 'bg-[#f1faf6] text-[#0b6b53]' : 'text-gray-900'
                                      }`
                                    }
                                    value={option}
                                  >
                                    {({ selected }) => (
                                      <span
                                        className={`block truncate ${
                                          selected ? 'font-medium' : 'font-normal'
                                        }`}
                                      >
                                        {option}
                                      </span>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Example: 1200 sq ft (carpet / built-up as per your local standard).
                      </p>
                    </div>
                  </div>
                  
                  {/* Row 4: Availability / Price */}
                  <div className={cardWrapper + " grid grid-cols-1 md:grid-cols-2 gap-6"}>
                      {/* --- AVAILABILITY (UPDATED) --- */}
                      <div>
                       <label className={fieldLabel}>Availability</label>
                       <Listbox value={availability} onChange={setAvailability as any}>
                         <div className="relative">
                           <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
                             {/* UPDATED: Directly show value */}
                             <span className="block truncate">{availability}</span>
                             <DropdownChevron />
                           </Listbox.Button>
                           <Transition
                             as={Fragment}
                             leave="transition ease-in duration-100"
                             leaveFrom="opacity-100"
                             leaveTo="opacity-0"
                           >
                             <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20">
                               {availabilityOptions.map((option, optionIdx) => (
                                 <Listbox.Option
                                   key={optionIdx}
                                   className={({ active }) =>
                                     `relative cursor-default select-none py-2 px-4 ${
                                       active ? 'bg-[#f1faf6] text-[#0b6b53]' : 'text-gray-900'
                                     }`
                                   }
                                   value={option}
                                 >
                                   {({ selected }) => (
                                     <span
                                       className={`block truncate ${
                                         selected ? 'font-medium' : 'font-normal'
                                       }`}
                                     >
                                       {/* UPDATED: Directly show option */}
                                       {option}
                                     </span>
                                   )}
                                 </Listbox.Option>
                               ))}
                             </Listbox.Options>
                           </Transition>
                         </div>
                       </Listbox>
                     </div>
                    
                    <div>
                      <label className={fieldLabel}>Price (₹) <span className="text-[#0b6b53]">*</span></label>
                      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter total price" className={`${triedContinue && !isPriceValid ? inputError : inputNormal}`} />
                      {triedContinue && !isPriceValid && <div className="text-xs text-red-600 mt-2">Required</div>}
                    </div>
                  </div>
                  
                  {/* Row 5: Amenities */}
                   <div className={cardWrapper + " grid grid-cols-1"}>
                      <div>
                        <label className={fieldLabel}>Amenities</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {amenities.map((amenity, index) => (
                            <div key={index} className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full">
                              <span>{amenity}</span>
                              <button
                                type="button"
                                onClick={() => removeAmenity(index)}
                                className="bg-gray-300 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-gray-400"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <input 
                          value={currentAmenity} 
                          onChange={(e) => setCurrentAmenity(e.target.value)} 
                          onKeyDown={handleAmenityKeyDown}
                          placeholder="Type an amenity and press Enter..." 
                          className={inputNormal} 
                        />

                        <div className="mt-4">
                          <p className="text-xs text-gray-600 mb-2">Suggestions:</p>
                          <div className="flex flex-wrap gap-2">
                            {amenitySuggestions.map((suggestion) => (
                              <button
                                type="button"
                                key={suggestion}
                                onClick={() => addAmenity(suggestion)}
                                className="inline-flex bg-white border border-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-50 disabled:opacity-50"
                                disabled={amenities.includes(suggestion)} 
                              >
                                + {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                   </div>

                  {/* Row 6: Footer */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setStep(0)} className={btnLight}>Back to Basic Info</button>
                      <button onClick={onContinueFromStep2} className={canContinueStep2 ? btnPrimary : btnDisabled} disabled={!canContinueStep2}>Continue to Location</button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 3L8 8l-5 2 5 2 2 5 2-5 5-2-5-2zM14 14l-2 5-2-5-5-2 5-2 2-5 2 5 5 2z"></path>
                        </svg>
                      Well-detailed listings rank higher
                    </div>
                  </div>
                </div>
              )}
              {/* --- END OF STEP 1 BLOCK --- */}

              {/* --- STEP 2: LOCATION --- */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Row 0: Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Step 3: Location</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      Keep it simple
                    </div>
                  </div>

                  {/* Card 1: Project Name / Locality */}
                  <div className={cardWrapper + " grid grid-cols-1 md:grid-cols-2 gap-6"}>
                    <div>
                      <label className={fieldLabel}>
                        Project Name <span className="text-[#0b6b53]">*</span>
                      </label>
                      <input
                        value={society}
                        onChange={(e) => setSociety(e.target.value)}
                        placeholder="e.g., Shilp Residency"
                        className={`${triedContinue && !isSocietyValid ? inputError : inputNormal}`}
                      />
                      {triedContinue && !isSocietyValid && (
                        <div className="text-xs text-red-600 mt-2">
                          Please enter a project name.
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={fieldLabel}>
                        Locality / Area <span className="text-[#0b6b53]">*</span>
                      </label>
                      <input
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        placeholder="e.g., Kudasan"
                        className={`${triedContinue && !isLocalityValid ? inputError : inputNormal}`}
                      />
                      {triedContinue && !isLocalityValid && (
                        <div className="text-xs text-red-600 mt-2">
                          Please enter a locality.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 2: Unit No / Pincode */}
                  <div className={cardWrapper + " grid grid-cols-1 md:grid-cols-2 gap-6"}>
                    <div>
                      <label className={fieldLabel}>
                        Unit No <span className="text-[#0b6b53]">*</span>
                      </label>
                      <input
                        value={unitNo}
                        onChange={(e) => setUnitNo(e.target.value)}
                        placeholder="e.g., B-701"
                        className={`${triedContinue && !isUnitNoValid ? inputError : inputNormal}`}
                      />
                      {triedContinue && !isUnitNoValid && (
                        <div className="text-xs text-red-600 mt-2">
                          Please enter a unit number.
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={fieldLabel}>
                        Pincode <span className="text-[#0b6b53]">*</span>
                      </label>
                      <input
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g., 382421"
                        className={`${triedContinue && !isPincodeValid ? inputError : inputNormal}`}
                      />
                      {triedContinue && !isPincodeValid && (
                        <div className="text-xs text-red-600 mt-2">
                          Please enter a valid 6-digit pincode.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 3: City (UPDATED to Listbox) */}
                  <div className={cardWrapper + " grid grid-cols-1"}>
                    <div>
                      <label className={fieldLabel}>
                        City <span className="text-[#0b6b53]">*</span>
                      </label>
                      
                      <Listbox value={city} onChange={setCity}>
                        <div className="relative">
                          <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
                            <span className="block truncate">{city}</span>
                            <DropdownChevron />
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20">
                              {cityOptions.map((option, optionIdx) => (
                                <Listbox.Option
                                  key={optionIdx}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 px-4 ${
                                      active ? 'bg-[#f1faf6] text-[#0b6b53]' : 'text-gray-900'
                                    }`
                                  }
                                  value={option}
                                >
                                  {({ selected }) => (
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {option}
                                    </span>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>

                      {triedContinue && !isCityValid && (
                        <div className="text-xs text-red-600 mt-2">
                          Please enter a city.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 4: Map */}
                  <div className={cardWrapper + " p-2"}>
                    {/* NEW helper text */}
                    <p className="text-sm text-gray-600 mb-3 px-1">
                      Click on the map to open the location picker, search your address and drop a pin so buyers can see your exact location.
                    </p>

                    <div className="h-60 rounded-lg bg-gray-200 grid place-items-center text-sm text-gray-500 overflow-hidden cursor-pointer">
                      <img
                        src="https://placehold.co/800x400/e2e8f0/64748b?text=Map+Integration+Placeholder"
                        alt="Map placeholder"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    Accurate location helps buyers filter results effectively.
                  </p>

                  {/* Footer: Buttons */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setStep(1)} className={btnLight}>
                        Back to Specifications
                      </button>
                      <button
                        onClick={onContinueFromStep3}
                        className={canContinueStep3 ? btnPrimary : btnDisabled}
                        disabled={!canContinueStep3}
                      >
                        Continue to Media Upload
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- END OF STEP 2 BLOCK --- */}

              {/* --- STEP 3: MEDIA (UPDATED TEXT) --- */}
              {step === 3 && (
                <div className="space-y-6">
                    {/* Row 0: Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Step 4: Media Upload </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      {/* --- UPDATED TEXT --- */}
                      Add photos to get 5x more views
                    </div>
                  </div>

                  {/* Card 1: Photos – SINGLE UPLOAD BOX + PREVIEW GRID */}
                  <div className={cardWrapper}>
                    <label className={fieldLabel}>Upload Photos (Optional)</label>
                    <p className="text-sm text-gray-500 mb-4">
                      Listings with photos get 5x more views. You can add them now or later from your dashboard.
                    </p>

                    {/* Single big clickable box */}
                    <div
                      className="rounded-lg border-2 border-dashed border-gray-200 bg-white px-6 py-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0b6b53]/60 hover:bg-[#f8fffc]"
                      onClick={() => photoRef.current?.click()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mb-3 text-gray-400"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <p className="text-sm font-medium text-gray-800">
                        Click to upload property photos
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        You can select multiple images at once (up to 9).
                      </p>
                      {photos.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          {photos.length} photo{photos.length > 1 ? "s" : ""} selected
                        </p>
                      )}
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={photoRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => onAddPhotos(e.target.files)}
                    />

                    {/* Preview thumbnails if any */}
                    {photos.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-3">
                        {photos.map((file, i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-lg border border-gray-200 flex items-center justify-center bg-white overflow-hidden relative"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`preview-${i}`}
                              className="object-cover w-full h-full"
                            />
                            <button
                              onClick={() => removePhoto(i)}
                              className="absolute top-1.5 right-1.5 bg-white rounded-full p-1 text-xs shadow-md leading-none w-5 h-5 flex items-center justify-center hover:bg-gray-100"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Card 2: Video */}
                  <div className={cardWrapper}>
                    <label className={fieldLabel}>Upload Video (Optional)</label>
                    <p className="text-sm text-gray-500 mb-4">
                      A video tour can also be added now or later.
                    </p>
                    <div className="h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center gap-4 px-6">
                      {video ? (
                        <div className="flex items-center gap-4 w-full">
                           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0b6b53]"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 font-medium truncate">{video.name}</p>
                            <p className="text-xs text-gray-500">{(video.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button onClick={removeVideo} className="text-sm text-red-600 font-medium ml-auto">Remove</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                          <div className="text-sm text-gray-500">No video uploaded</div>
                          
                          {/* UPDATED WIDTH */}
                          <button onClick={() => videoRef.current?.click()} className="ml-auto h-10 w-40 flex justify-center items-center rounded-lg bg-[#0b6b53] text-white text-sm font-semibold">Add Video</button>
                        </div>
                      )}
                      <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => onAddVideo(e.target.files)} />
                    </div>
                  </div>

                  {/* Card 3: Sale Deed / Index Copy */}
                  <div className={cardWrapper}>
                    <label className={fieldLabel}>Upload Sale Deed / Index Copy (Optional)</label>
                    <p className="text-sm text-gray-500 mb-4">
                      Uploading a sale deed or index copy helps buyers verify ownership and adds trust to your listing.
                    </p>
                    <div className="h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center gap-4 px-6">
                      {saleDeed ? (
                        <div className="flex items-center gap-4 w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0b6b53]">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 font-medium truncate">{saleDeed.name}</p>
                            <p className="text-xs text-gray-500">{(saleDeed.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button onClick={removeSaleDeed} className="text-sm text-red-600 font-medium ml-auto">Remove</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <div className="text-sm text-gray-500">No document uploaded</div>
                          
                          {/* UPDATED WIDTH */}
                          <button onClick={() => saleDeedRef.current?.click()} className="ml-auto h-10 w-40 flex justify-center items-center rounded-lg bg-[#0b6b53] text-white text-sm font-semibold">
                            Add Document
                          </button>
                        </div>
                      )}
                      <input
                        ref={saleDeedRef}
                        type="file"
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={(e) => onAddSaleDeed(e.target.files)}
                      />
                    </div>
                  </div>

                  {/* Card 4: Brochure */}
                  <div className={cardWrapper}>
                    <label className={fieldLabel}>Upload Brochure (Optional)</label>
                    <p className="text-sm text-gray-500 mb-4">
                      Share your project or property brochure so buyers can see detailed plans, layouts and highlights.
                    </p>
                    <div className="h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center gap-4 px-6">
                      {brochure ? (
                        <div className="flex items-center gap-4 w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0b6b53]">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M4 4.5A2.5 2.5 0 0 1 6.5 7H20"></path>
                            <path d="M4 4.5v15"></path>
                            <path d="M20 4.5v15"></path>
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 font-medium truncate">{brochure.name}</p>
                            <p className="text-xs text-gray-500">{(brochure.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button onClick={removeBrochure} className="text-sm text-red-600 font-medium ml-auto">Remove</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M4 4.5A2.5 2.5 0 0 1 6.5 7H20"></path>
                            <path d="M4 4.5v15"></path>
                            <path d="M20 4.5v15"></path>
                          </svg>
                          <div className="text-sm text-gray-500">No brochure uploaded</div>
                          
                          {/* UPDATED WIDTH */}
                          <button onClick={() => brochureRef.current?.click()} className="ml-auto h-10 w-40 flex justify-center items-center rounded-lg bg-[#0b6b53] text-white text-sm font-semibold">
                            Add Brochure
                          </button>
                        </div>
                      )}
                      <input
                        ref={brochureRef}
                        type="file"
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={(e) => onAddBrochure(e.target.files)}
                      />
                    </div>
                  </div>

                  {/* Footer: Buttons */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setStep(2)} className={btnLight}>Back to Location</button>
                      <button onClick={handleSaveDraft} className={btnSecondary}>Save Draft</button>
                      <button onClick={handleSubmit} className={btnPrimary}>Submit Listing</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Local styles */}
      <style jsx>{`
        /* minor focus style */
        input:focus, select:focus, textarea:focus, [role="listbox"]:focus-within, [role="listbox"]:focus {
          box-shadow: 0 8px 24px rgba(11,107,83,0.06);
          border-color: rgba(11,107,83,0.45);
        }
        
        /* This applies the focus ring to our custom Listbox button */
        [role="listbox"] > button:focus {
           box-shadow: 0 8px 24px rgba(11,107,83,0.06);
           border-color: rgba(11,107,83,0.45);
        }
      `}</style>
    </div>
  );
}