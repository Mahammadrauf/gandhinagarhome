// app/sell/page.tsx
"use client";

import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment, useRef, useState, KeyboardEvent } from "react"; 

type Step = 0 | 1 | 2 | 3;
const stepTitles = ["Basic Information", "Specifications", "Location", "Media Upload"];

const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const onlyDigitsOrSymbols = (v: string) => /^[0-9+\-\s()]*$/.test(v);

/**
 * Updated Sell page
 * - (User) Rebuilt Location step (Step 2) with Project Name, Unit No, Locality, City, Pincode
 * - (User) Added required validation for new Location fields
 * - (User) Applied card-based layout to ALL steps (0, 1, 2, 3)
 * - (User) Replaced ALL dropdowns with attractive Headless UI Listbox
 * - (User) Replaced Amenities input with a "chip/tag" component
 */

export default function SellPage() {
  const [step, setStep] = useState<Step>(0);

  // Basic Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [preferredContact, setPreferredContact] = useState<"WhatsApp" | "Call" | "Email">("WhatsApp");

  // Specifications
  const [title, setTitle] = useState(""); // property name
  const [bedrooms, setBedrooms] = useState("2");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [bathrooms, setBathrooms] = useState("2");
  const [balcony, setBalcony] = useState("0");
  const [parking, setParking] = useState("None");
  const [ageOfProperty, setAgeOfProperty] = useState("New");
  const [furnishing, setFurnishing] = useState<"Semi" | "Full" | "None">("None");
  const [availability, setAvailability] = useState<"Ready" | "After1Month">("Ready");
  const [price, setPrice] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [currentAmenity, setCurrentAmenity] = useState("");


  // Location
  const [city, setCity] = useState("Gandhinagar");
  const [locality, setLocality] = useState("");
  const [society, setSociety] = useState(""); // Was optional, now "Project Name" (required)
  const [unitNo, setUnitNo] = useState(""); // NEW: Unit No field
  // const [address, setAddress] = useState(""); // REMOVED
  const [pincode, setPincode] = useState("");

  // Media
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const photoRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLInputElement | null>(null);

  // UI
  const [triedContinue, setTriedContinue] = useState(false);
  const [saving, setSaving] = useState(false);

  // validation
  // Step 1 Validation
  const isNameValid = firstName.trim().length >= 3;
  const isEmailValid = validateEmail(email);
  const isMobileValid = mobile.trim().length >= 8 && onlyDigitsOrSymbols(mobile);
  const canContinueStep1 = isNameValid && isEmailValid && isMobileValid;

  // Step 2 Validation
  const isTitleValid = title.trim().length >= 3;
  const isBedroomsValid = Number(bedrooms) >= 1;
  const isBathroomsValid = Number(bathrooms) >= 1;
  const isPriceValid = price.trim().length > 0;
  const canContinueStep2 = isTitleValid && isBedroomsValid && isBathroomsValid && isPriceValid;

  // Step 3 Validation (UPDATED)
  const isCityValid = city.trim().length > 2;
  const isLocalityValid = locality.trim().length > 2;
  const isPincodeValid = pincode.trim().length >= 6 && onlyDigitsOrSymbols(pincode);
  const isSocietyValid = society.trim().length >= 3; // NEW: Project Name validation
  const isUnitNoValid = unitNo.trim().length > 0; // NEW: Unit No validation
  // const isAddressValid = address.trim().length >= 5; // REMOVED
  const canContinueStep3 = isCityValid && isLocalityValid && isPincodeValid && isSocietyValid && isUnitNoValid;
  

  // --- Helper arrays for ALL dropdowns ---
  const propertyTypeOptions = ["Apartment", "Villa", "Bungalow", "Plot"];
  const bedroomOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
  const balconyOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
  const bathroomOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
  const parkingOptions = ["None", "1", "2", "3+"];
  const ageOfPropertyOptions = ["New", "1-5 yrs", "5-10 yrs", "10+ yrs"];
  const furnishingOptions = ["None", "Semi", "Full"];
  const availabilityOptions = ["Ready", "After1Month"];
  const amenitySuggestions = ["Lift", "Security", "Garden", "Gym", "Swimming Pool", "Clubhouse", "Parking"];


  const canNavigateTo = (target: number) => {
    if (target === 0) return true;
    if (target === 1) return canContinueStep1;
    if (target === 2) return canContinueStep1 && canContinueStep2;
    if (target === 3) return canContinueStep1 && canContinueStep2 && canContinueStep3; // UPDATED
    return false;
  };

  const goTo = (s: Step) => {
    if (!canNavigateTo(s)) {
      setTriedContinue(true);
      return;
    }
    setStep(s);
    setTriedContinue(false); 
  };

  const next = () => setStep((prev) => ((prev + 1) % 4) as Step);
  const prev = () => setStep((prev) => (prev - 1 >= 0 ? (prev - 1) : 0) as Step);

  // Save draft (placeholder)
  const handleSaveDraft = () => {
    setSaving(true);
    const payload = {
      firstName, lastName, email, mobile, preferredContact,
      title, bedrooms, propertyType, bathrooms, balcony, parking, ageOfProperty, furnishing, availability, price, 
      amenities, 
      city, locality, society, unitNo, pincode, // UPDATED
      photosCount: photos.length,
      hasVideo: !!video,
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
      alert("Please complete Basic Information.");
      return;
    }
    if (!canContinueStep2) {
      setStep(1);
      setTriedContinue(true);
      alert("Please complete Specifications.");
      return;
    }
    // NEW CHECK for Step 3 (Location)
    if (!canContinueStep3) {
      setStep(2);
      setTriedContinue(true);
      alert("Please complete Location details (Project, Unit, Locality, City, Pincode).");
      return;
    }

    const payload = {
      firstName, lastName, email, mobile, preferredContact,
      title, bedrooms, propertyType, bathrooms, balcony, parking, ageOfProperty, furnishing, availability, price, 
      amenities, 
      city, locality, society, unitNo, pincode, // UPDATED
      photosCount: photos.length,
      hasVideo: !!video,
      submittedAt: new Date().toISOString(),
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
    const arr = Array.from(files).slice(0, 9 - photos.length);
    setPhotos((p) => [...p, ...arr]);
  };
  const onAddVideo = (file: FileList | null) => {
    if (!file || file.length === 0) return;
    setVideo(file[0]);
  };
  const removePhoto = (i: number) => setPhotos((p) => p.filter((_, idx) => idx !== i));
  const removeVideo = () => setVideo(null);

  const onContinueFromStep1 = () => {
    if (!canContinueStep1) {
      setTriedContinue(true); 
      return;
    }
    setStep(1);
    setTriedContinue(false); 
  };

  const onContinueFromStep2 = () => {
    if (!canContinueStep2) {
      setTriedContinue(true); 
      return;
    }
    setStep(2);
    setTriedContinue(false); 
  };

  // NEW: Continue from Step 3 (Location)
  const onContinueFromStep3 = () => {
    if (!canContinueStep3) {
      setTriedContinue(true); 
      return;
    }
    setStep(3);
    setTriedContinue(false); 
  };


  // --- NEW: Helper functions for Amenities ---
  const addAmenity = (amenityToAdd: string) => {
    const trimmed = amenityToAdd.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities([...amenities, trimmed]);
    }
    setCurrentAmenity(""); // Clear input after adding
  };

  const removeAmenity = (indexToRemove: number) => {
    setAmenities(amenities.filter((_, index) => index !== indexToRemove));
  };

  const handleAmenityKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter
      addAmenity(currentAmenity);
    }
  };
  // --- END: Helper functions for Amenities ---


  // Reusable classes for consistent sizing (used inline to keep tailwind-style)
  const inputBase = "w-full h-12 rounded-xl px-4 border outline-none shadow-sm";
  const inputNormal = `${inputBase} border-gray-100 bg-white`;
  const selectNormal = `${inputNormal} appearance-none bg-no-repeat bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7280'%3e%3cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3e%3c/svg%3e")] bg-[position:right_1rem_center] bg-[size:1.25em] pr-10 text-left`;
  const inputError = `${inputBase} border-red-200 bg-red-50`;
  const btnPrimary = "inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#0b6b53] text-white font-semibold transition transform hover:scale-[1.02]";
  const btnSecondary = "inline-flex items-center justify-center h-12 px-5 rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:shadow-sm";
  const btnLight = "inline-flex items-center justify-center h-12 px-6 rounded-full bg-gray-100 text-gray-800 font-semibold transition hover:bg-gray-200";
  const btnDisabled = "inline-flex items-center justify-center h-12 px-6 rounded-full bg-gray-300 text-white cursor-not-allowed";
  const fieldLabel = "text-sm font-semibold text-gray-800 mb-2 block";
  // NEW: Class for the card wrapper
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
                          {i === 0 ? "Seller contact & preferred mode" : i === 1 ? "Set property details" : i === 2 ? "Map & address" : "Photos & docs"}
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
                  
                  {/* Card 1: Name and Email */}
                  <div className={`${cardWrapper} grid grid-cols-1 lg:grid-cols-3 gap-6`}>
                    <div className="lg:col-span-2">
                      <label className={fieldLabel}>Seller Full Name <span className="text-[#0b6b53]">*</span></label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Your legal name"
                        className={`${triedContinue && !isNameValid ? inputError : inputNormal}`}
                      />
                      {triedContinue && !isNameValid && <div className="text-xs text-red-600 mt-2">Please enter name (min 3 chars).</div>}
                    </div>

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
                  </div>

                  {/* Card 2: Contact Details */}
                  <div className={`${cardWrapper} grid grid-cols-1 md:grid-cols-3 gap-6`}>
                    <div>
                      <label className={fieldLabel}>Mobile Number <span className="text-[#0b6b53]">*</span></label>
                      <input
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+91 9XXXXXXXXX"
                        className={`${triedContinue && !isMobileValid ? inputError : inputNormal}`}
                      />
                      {triedContinue && !isMobileValid && <div className="text-xs text-red-600 mt-2">Enter a valid mobile number.</div>}
                    </div>

                    <div>
                      <label className={fieldLabel}>Alternate Number</label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Optional"
                        className={inputNormal}
                      />
                    </div>

                    <div>
                      <label className={fieldLabel}>Preferred Mode of Contact</label>
                      <div className="flex gap-2">
                        <label className={`flex-1 h-12 flex items-center justify-center rounded-xl px-3 text-sm cursor-pointer ${preferredContact === "WhatsApp" ? "bg-[#0b6b53] text-white" : "bg-white border border-gray-100 text-gray-700"}`}>
                          <input type="radio" name="prefContact" value="WhatsApp" checked={preferredContact === "WhatsApp"} onChange={() => setPreferredContact("WhatsApp")} className="hidden" />
                          WhatsApp
                        </label>
                        <label className={`flex-1 h-12 flex items-center justify-center rounded-xl px-3 text-sm cursor-pointer ${preferredContact === "Call" ? "bg-[#0b6b53] text-white" : "bg-white border border-gray-100 text-gray-700"}`}>
                          <input type="radio" name="prefContact" value="Call" checked={preferredContact === "Call"} onChange={() => setPreferredContact("Call")} className="hidden" />
                          Call
                        </label>
                        <label className={`flex-1 h-12 flex items-center justify-center rounded-xl px-3 text-sm cursor-pointer ${preferredContact === "Email" ? "bg-[#0b6b53] text-white" : "bg-white border border-gray-100 text-gray-700"}`}>
                          <input type="radio" name="prefContact" value="Email" checked={preferredContact === "Email"} onChange={() => setPreferredContact("Email")} className="hidden" />
                          Email
                        </label>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">Your contact is partially visible to buyers. Full details require buyer subscription.</p>

                  {/* Footer: Buttons */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button onClick={handleSaveDraft} className={btnSecondary} disabled={saving}>{saving ? "Saving..." : "Save Draft"}</button>
                      <button
                        onClick={onContinueFromStep1}
                        className={canContinueStep1 ? btnPrimary : btnDisabled}
                        disabled={!canContinueStep1}
                      >
                        Continue to Specifications
                      </button>
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
                          <Listbox.Button className={selectNormal}>
                            <span className="block truncate">{propertyType}</span>
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
                          <Listbox.Button className={`${selectNormal} ${triedContinue && !isBedroomsValid ? 'border-red-200' : 'border-gray-100'}`}>
                            <span className="block truncate">{bedrooms}</span>
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
                          <Listbox.Button className={selectNormal}>
                            <span className="block truncate">{balcony}</span>
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
                          <Listbox.Button className={`${selectNormal} ${triedContinue && !isBathroomsValid ? 'border-red-200' : 'border-gray-100'}`}>
                            <span className="block truncate">{bathrooms}</span>
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
                          <Listbox.Button className={selectNormal}>
                            <span className="block truncate">{parking}</span>
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
                      <label className={fieldLabel}>Age of Property</label>
                      <Listbox value={ageOfProperty} onChange={setAgeOfProperty}>
                        <div className="relative">
                          <Listbox.Button className={selectNormal}>
                            <span className="block truncate">{ageOfProperty}</span>
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
                          <Listbox.Button className={selectNormal}>
                            <span className="block truncate">{furnishing}</span>
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
                  
                  {/* Row 4: Availability / Price */}
                  <div className={cardWrapper + " grid grid-cols-1 md:grid-cols-2 gap-6"}>
                     {/* --- AVAILABILITY --- */}
                     <div>
                      <label className={fieldLabel}>Availability</label>
                      <Listbox value={availability} onChange={setAvailability as any}>
                        <div className="relative">
                          <Listbox.Button className={selectNormal}>
                            <span className="block truncate">{availability === "Ready" ? "Immediately" : "After 1 Month"}</span>
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
                                      {option === "Ready" ? "Immediately" : "After 1 Month"}
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
                        {/* Chip display area */}
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
                        
                        {/* Input field */}
                        <input 
                          value={currentAmenity} 
                          onChange={(e) => setCurrentAmenity(e.target.value)} 
                          onKeyDown={handleAmenityKeyDown}
                          placeholder="Type an amenity and press Enter..." 
                          className={inputNormal} 
                        />

                        {/* Suggestions */}
                        <div className="mt-4">
                          <p className="text-xs text-gray-600 mb-2">Suggestions:</p>
                          <div className="flex flex-wrap gap-2">
                            {amenitySuggestions.map((suggestion) => (
                              <button
                                type="button"
                                key={suggestion}
                                onClick={() => addAmenity(suggestion)}
                                className="inline-flex bg-white border border-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-50 disabled:opacity-50"
                                disabled={amenities.includes(suggestion)} // Disable if already added
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

              {/* --- STEP 2: LOCATION (REBUILT) --- */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Row 0: Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Step 3: Location</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      Keep it simple
                    </div>
                  </div>

                  {/* Card 1: Project Name / Locality */}
                  <div className={cardWrapper + " grid grid-cols-1 md:grid-cols-2 gap-6"}>
                    <div>
                      <label className={fieldLabel}>Project Name <span className="text-[#0b6b53]">*</span></label>
                      <input value={society} onChange={(e) => setSociety(e.target.value)} placeholder="e.g., Shilp Residency" className={`${triedContinue && !isSocietyValid ? inputError : inputNormal}`} />
                       {triedContinue && !isSocietyValid && <div className="text-xs text-red-600 mt-2">Please enter a project name.</div>}
                    </div>
                    <div>
                      <label className={fieldLabel}>Locality / Area <span className="text-[#0b6b53]">*</span></label>
                      <input value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="e.g., Kudasan" className={`${triedContinue && !isLocalityValid ? inputError : inputNormal}`} />
                       {triedContinue && !isLocalityValid && <div className="text-xs text-red-600 mt-2">Please enter a locality.</div>}
                    </div>
                  </div>

                  {/* Card 2: Unit No / Pincode */}
                  <div className={cardWrapper + " grid grid-cols-1 md:grid-cols-2 gap-6"}>
                    <div>
                      <label className={fieldLabel}>Unit No <span className="text-[#0b6b53]">*</span></label>
                      <input value={unitNo} onChange={(e) => setUnitNo(e.target.value)} placeholder="e.g., B-701" className={`${triedContinue && !isUnitNoValid ? inputError : inputNormal}`} />
                      {triedContinue && !isUnitNoValid && <div className="text-xs text-red-600 mt-2">Please enter a unit number.</div>}
                    </div>
                    <div>
                      <label className={fieldLabel}>Pincode <span className="text-[#0b6b53]">*</span></label>
                      <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="e.g., 382421" className={`${triedContinue && !isPincodeValid ? inputError : inputNormal}`} />
                       {triedContinue && !isPincodeValid && <div className="text-xs text-red-600 mt-2">Please enter a valid 6-digit pincode.</div>}
                    </div>
                  </div>
                  
                  {/* Card 3: City */}
                  <div className={cardWrapper + " grid grid-cols-1"}>
                    <div>
                      <label className={fieldLabel}>City <span className="text-[#0b6b53]">*</span></label>
                      <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Gandhinagar" className={`${triedContinue && !isCityValid ? inputError : inputNormal}`} />
                       {triedContinue && !isCityValid && <div className="text-xs text-red-600 mt-2">Please enter a city.</div>}
                    </div>
                  </div>
                  
                  {/* Card 4: Map */}
                  <div className={cardWrapper + " p-2"}>
                    <div className="h-60 rounded-lg bg-gray-200 grid place-items-center text-sm text-gray-500 overflow-hidden">
                       <img 
                        src="https://placehold.co/800x400/e2e8f0/64748b?text=Map+Integration+Placeholder" 
                        alt="Map placeholder" 
                        className="w-full h-full object-cover"
                       />
                       {/*  */}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500">Accurate location helps buyers filter results effectively.</p>

                  {/* Footer: Buttons */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setStep(1)} className={btnLight}>Back to Specifications</button>
                      <button onClick={onContinueFromStep3} className={canContinueStep3 ? btnPrimary : btnDisabled} disabled={!canContinueStep3}>Continue to Media Upload</button>
                    </div>
                  </div>
                </div>
              )}
              {/* --- END OF STEP 2 BLOCK --- */}

              {/* --- STEP 3: MEDIA (REBUILT) --- */}
              {step === 3 && (
                <div className="space-y-6">
                   {/* Row 0: Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Step 4: Media Upload</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      Add photos for 5x more views
                    </div>
                  </div>

                  {/* Card 1: Photos */}
                  <div className={cardWrapper}>
                    <label className={fieldLabel}>Photos (up to 9)</label>
                    <p className="text-sm text-gray-500 mb-4">Upload high-quality photos of your property.</p>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {[...Array(9)].map((_, i) => {
                        const file = photos[i];
                        return (
                          <div key={i} className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-white overflow-hidden relative">
                            {file ? (
                              <>
                                <img src={URL.createObjectURL(file)} alt="preview" className="object-cover w-full h-full" />
                                <button onClick={() => removePhoto(i)} className="absolute top-1.5 right-1.5 bg-white rounded-full p-1 text-xs shadow-md leading-none w-5 h-5 flex items-center justify-center hover:bg-gray-100">✕</button>
                              </>
                            ) : (
                              <button onClick={() => photoRef.current?.click()} className="text-sm text-gray-500 p-2 text-center">+ Add Photo</button>
                            )}
                          </div>
                        );
                      })}
                      <input ref={photoRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onAddPhotos(e.target.files)} />
                    </div>
                  </div>
                  
                  {/* Card 2: Video */}
                  <div className={cardWrapper}>
                    <label className={fieldLabel}>Video (optional)</label>
                    <p className="text-sm text-gray-500 mb-4">A video tour can significantly boost buyer interest.</p>
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
                          <button onClick={() => videoRef.current?.click()} className="ml-auto h-10 px-4 rounded-lg bg-[#0b6b53] text-white text-sm font-semibold">Add Video</button>
                        </div>
                      )}
                      <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => onAddVideo(e.target.files)} />
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