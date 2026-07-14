// app/sell/form/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment, useRef, useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import API_URL from '@/app/config/config';
import { useToast } from '@/components/ui/Toast';
import GoogleLocationPicker from "@/components/GoogleLocationPicker";
import { fetchUserProfile } from '@/lib/api';
import {
  clearSellFormMedia,
  getSellFormMedia,
  setSellFormBrochure,
  setSellFormPhotos,
  setSellFormSaleDeed,
  setSellFormVideo,
} from '@/lib/sellFormMediaStore';

type Step = 0 | 1 | 2 | 3;
const stepTitles = ["Basic Information", "Specifications", "Location", "Media Upload"];

// Utility functions for data formatting
const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const onlyDigitsOrSymbols = (v: string) => /^[0-9+\-\s()]*$/.test(v);

const formatPrice = (price: string): string => {
  const numPrice = parseFloat(price.replace(/,/g, ''));
  if (isNaN(numPrice)) return price;

  if (numPrice >= 10000000) {
    const cr = (numPrice / 10000000).toFixed(2);
    return `₹${parseFloat(cr)} Cr`;
  } else if (numPrice >= 100000) {
    const lac = (numPrice / 100000).toFixed(2);
    return `₹${parseFloat(lac)} Lac`;
  } else {
    return `₹${numPrice.toLocaleString('en-IN')}`;
  }
};

/// City and locality data
const CITY_AREAS: Record<string, string[]> = {
  Gandhinagar: ["Raysan", "Randesan", "Sargasan", "Kudasan", "Koba", "Sectors", "Vavol", "New Vavol", "Randheja", "Pethapur"],
  Ahmedabad: ["Motera", "Chandkheda", "Zundal", "Adalaj", "Bhat", "Tapovan", "Vaishnodevi"],
  "Gift City": ["Gift City"],
};

// Full terms list used inside modal (kept in sync with /terms-and-conditions/page.tsx)
const TERMS: string[] = [
  'By listing a property on GandhinagarHomes.com, I confirm that I am the legal owner of the property or I am legally authorized by the owner to post the property listing.',
  'I confirm that all information provided by me including property details, pricing, area, location, approvals, amenities, photographs, videos, and ownership details are true, accurate, and updated.',
  'I understand that GandhinagarHomes.com is only a technology-enabled property listing platform connecting buyers and sellers directly and is not acting as a broker, agent, legal advisor, or transaction mediator.',
  'I understand that GandhinagarHomes.com does not guarantee property sale, buyer inquiries, transaction completion, or any financial outcome from the listing.',
  'I agree that all negotiations, site visits, token amounts, agreements, payments, registrations, possession transfers, and transactions shall be handled directly between the buyer and seller without any responsibility of GandhinagarHomes.com.',
  'I agree that GandhinagarHomes.com shall not be held responsible for any disputes related to ownership, title, payments, fraud, legal issues, possession, documentation, pricing, or transaction failure.',
  'I confirm that the property listed by me complies with applicable laws, municipal rules, society norms, and other legal requirements.',
  'I agree that any false, misleading, fake, duplicate, illegal, or suspicious listing may be removed by GandhinagarHomes.com without prior notice.',
  'I authorize GandhinagarHomes.com to verify my listing details and request supporting documents whenever required.',
  'I consent to GandhinagarHomes.com sharing my contact details with genuine interested buyers for property-related communication.',
  'I agree that I have read, understood, and agreed to all the above Terms & Conditions before submitting my property listing.',
  'I agree not to upload any content that is false, offensive, misleading, copyrighted without permission, unlawful, or intended to deceive users.',
  'I agree not to misuse buyer information received through the platform for spam, harassment, or unrelated promotional activities.',
  'I understand that GandhinagarHomes.com reserves the right to edit, reject, suspend, remove, or deactivate any listing at its sole discretion.',
  'I grant GandhinagarHomes.com permission to use, display, promote, advertise, and publish my uploaded property photographs, videos, and descriptions across digital platforms and social media for marketing purposes.',
  'I agree that GandhinagarHomes.com may contact me regarding listing verification, property updates, promotional services, or platform-related communication.',
  'I understand that brokers, agents, or third parties posting misleading owner listings may face suspension or permanent removal from the platform.',
  'I agree that GandhinagarHomes.com shall not be liable for any direct or indirect financial loss, damages, fraud, or legal claims arising from buyer-seller interactions.',
  'I agree to indemnify and hold harmless GandhinagarHomes.com, its owners, employees, and affiliates against any legal claims, disputes, damages, or liabilities arising due to my listing or actions.',
  'I understand that GandhinagarHomes.com reserves the right to modify these terms and conditions at any time without prior notice.',
  'I agree that any disputes related to the use of this platform shall be subject to the jurisdiction of courts located in Ahmedabad/Gandhinagar, Gujarat.'
];

const priceToWords = (num: number): string => {
  if (!num || isNaN(num)) return "";
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const format = (n: number, suffix: string) => {
    if (n === 0) return "";
    let str = n > 19 ? b[Math.floor(n / 10)] + " " + a[n % 10] : a[n];
    return str + suffix;
  };

  let res = "";
  res += format(Math.floor(num / 10000000), "Crore ");
  res += format(Math.floor((num / 100000) % 100), "Lakh ");
  res += format(Math.floor((num / 1000) % 100), "Thousand ");
  res += format(Math.floor((num / 100) % 10), "Hundred ");

  const lastTwo = num % 100;
  if (num > 100 && lastTwo > 0) res += "and ";
  res += format(lastTwo, "");

  return "₹ " + res.trim();
};

const mapAgeToLabel = (age: string): string => {
  return age; // Labels are already descriptive strings
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

function SellFormPageContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";
  const [step, setStep] = useState<Step>(0);

  // Protect this route: only allow logged-in sellers
  const guardRef = React.useRef(false);
  const autoSubmitExecutedRef = React.useRef(false);
  useEffect(() => {
    if (guardRef.current) return;
    guardRef.current = true;
    const savedUser = localStorage.getItem('gh_user');
    if (!savedUser) {
      showToast('Only sellers can access the listing form. Please login as a seller.', 'warning');
      router.replace('/');
      return;
    }
    try {
      const parsed = JSON.parse(savedUser);
      if (!(parsed.isLoggedIn && parsed.role === 'seller')) {
        showToast('Only sellers can access the listing form. Please login as a seller.', 'warning');
        router.replace('/');
        return;
      }
    } catch (err) {
      console.error('Error parsing gh_user for route guard', err);
      router.replace('/');
    }
  }, []);

  // Auto-submit after payment: if user returns with ?autoSubmit=true and pendingListingPaid flag
  useEffect(() => {
    try {
      const auto = searchParams.get("autoSubmit");
      if (auto === "true" && !autoSubmitExecutedRef.current) {
        autoSubmitExecutedRef.current = true;
        const paid = localStorage.getItem("pendingListingPaid");
        const raw = localStorage.getItem("pendingListing");
        if (paid && raw) {
          const payload = JSON.parse(raw);
          const existingPropertyId =
            payload?.propertyId ||
            payload?.apiResponse?._id ||
            payload?.apiResponse?.data?._id;

          if (existingPropertyId) {
            localStorage.removeItem("pendingListing");
            localStorage.removeItem("pendingListingPaid");
            router.push("/sell-property-in-gandhinagar-gujarat/confirmation");
            return;
          }

          // populate form fields from payload (guard against undefined)
          setFirstName(payload.firstName || "");
          setMiddleName(payload.middleName || "");
          setLastName(payload.lastName || "");
          setEmail(payload.email || "");
          setWhatsappNumber(payload.whatsappNumber || "");
          setMobileNumber(payload.mobileNumber || "");
          setCountryCode(payload.countryCode || "+91");
          setTitle(payload.title || "");
          setBedrooms(String(payload.bedrooms || ""));
          setPropertyType(payload.propertyType || "");
          setBathrooms(String(payload.bathrooms || ""));
          setBalcony(payload.balcony || "");
          setParking(payload.parking || "");
          setAgeOfProperty(payload.ageOfProperty || "");
          setFurnishing(payload.furnishing || "");
          setPrice(String(payload.price || "0.00"));
          setPriceNegotiable(payload.priceNegotiable || "");
          setDescription(payload.description || "");
          setAmenities(payload.amenities || []);
          setPropertySize(payload.propertySize || "");
          setPropertySizeUnit(payload.propertySizeUnit || "sq ft");
          setCity(payload.city || "");
          setLocality(payload.locality || "");
          setUnitNo(payload.unitNo || "");
          setPincode(payload.pincode || "");
          setLatitude(payload.latitude || null);
          setLongitude(payload.longitude || null);
          setPickedDisplayAddress(payload.pickedDisplayAddress || "");
          // small delay to allow state to settle
          setTimeout(async () => {
            try {
              await handleSubmit({
                skipValidation: true,
                payloadOverride: payload,
                redirectTo: 'home',
              });
              localStorage.removeItem("pendingListing");
              localStorage.removeItem("pendingListingPaid");
            } catch (e) {
              console.error("Auto submit error", e);
            }
          }, 350);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [searchParams]);

  // Basic Info
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Specifications
  const [title, setTitle] = useState(""); // Society / Project Name (Single Source)
  const [bedrooms, setBedrooms] = useState("");

  // UPDATED DEFAULT
  const [propertyType, setPropertyType] = useState("");

  const [bathrooms, setBathrooms] = useState("");
  const [balcony, setBalcony] = useState("");
  const [parking, setParking] = useState("");

  // Age of property: Updated options
  const [ageOfProperty, setAgeOfProperty] = useState("");
  const [furnishing, setFurnishing] = useState<string>("");

  // Asking Price: Default 0.00
  const [price, setPrice] = useState("0.00");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [currentAmenity, setCurrentAmenity] = useState("");

  // NEW: Size of Property
  const [propertySize, setPropertySize] = useState("");
  const [propertySizeUnit, setPropertySizeUnit] = useState<"sq ft" | "sq m" | "sq yd">("sq ft");

  // NEW: Price negotiation & description
  const [priceNegotiable, setPriceNegotiable] = useState<"Negotiable" | "Non-Negotiable" | "">("");
  const [description, setDescription] = useState("");

  // Location
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState(""); // NEW Address field
  const [unitNo, setUnitNo] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [pickedDisplayAddress, setPickedDisplayAddress] = useState("");

  // Media — initialize from module store so files survive remounts/navigation
  const [photos, _setPhotos] = useState<File[]>(() => getSellFormMedia().photos);
  const [video, _setVideo] = useState<File | null>(() => getSellFormMedia().video);

  // Wrapper to log state changes
  const setPhotos = (val: File[] | ((prev: File[]) => File[])) => {
    if (typeof val === 'function') {
      _setPhotos((prev) => {
        const next = (val as (prev: File[]) => File[])(prev);
        if (next.length === 0 && prev.length > 0) {
          console.warn("[!!PHOTOS CLEARED!!]");
          console.error(new Error("[STACK]").stack);
        }
        return next;
      });
    } else {
      if (val.length === 0 && photos.length > 0) {
        console.warn("[!!PHOTOS CLEARED!!]");
        console.error(new Error("[STACK]").stack);
      }
      _setPhotos(val);
    }
  };

  const setVideo = (val: File | null | ((prev: File | null) => File | null)) => {
    if (typeof val === 'function') {
      _setVideo((prev) => {
        const next = (val as (prev: File | null) => File | null)(prev);
        if (next === null && prev !== null) {
          console.warn("[!!VIDEO CLEARED!!]");
          console.error(new Error("[STACK]").stack);
        }
        return next;
      });
    } else {
      if (val === null && video !== null) {
        console.warn("[!!VIDEO CLEARED!!]");
        console.error(new Error("[STACK]").stack);
      }
      _setVideo(val);
    }
  };
  const photoRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLInputElement | null>(null);

  // NEW: Docs
  const [saleDeed, setSaleDeed] = useState<File | null>(() => getSellFormMedia().saleDeed);
  const [brochure, setBrochure] = useState<File | null>(() => getSellFormMedia().brochure);
  const saleDeedRef = useRef<HTMLInputElement | null>(null);
  const brochureRef = useRef<HTMLInputElement | null>(null);

  // Media metadata for edit mode (when File objects are not available)
  const [existingPhotosCount, setExistingPhotosCount] = useState(0);
  const [existingHasVideo, setExistingHasVideo] = useState(false);
  const [existingHasSaleDeed, setExistingHasSaleDeed] = useState(false);
  const [existingHasBrochure, setExistingHasBrochure] = useState(false);

  // UI
  const [triedContinue, setTriedContinue] = useState(false);
  const [saving, setSaving] = useState(false);
  // Modal states for bypassing Razorpay: show terms/QR and thank you
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [termsVisibleCount, setTermsVisibleCount] = useState(10);
  const [showPaymentQrModal, setShowPaymentQrModal] = useState(false);

  useEffect(() => { setSellFormPhotos(photos); }, [photos]);
  useEffect(() => { setSellFormVideo(video); }, [video]);
  useEffect(() => { setSellFormSaleDeed(saleDeed); }, [saleDeed]);
  useEffect(() => { setSellFormBrochure(brochure); }, [brochure]);

  useEffect(() => {
  if (!isEditMode) return;

  const stepParam = searchParams.get("step");
  if (stepParam !== null) {
    const s = Number(stepParam);
    if (s >= 0 && s <= 3) {
      setStep(s as Step);
    }
  }
}, [isEditMode, searchParams]);

useEffect(() => {
  if (!isEditMode) return;

  const saved = localStorage.getItem("pendingListing");
  if (!saved) return;

  const d = JSON.parse(saved);

  setFirstName(d.firstName || "");
  setMiddleName(d.middleName || "");
  setLastName(d.lastName || "");
  setEmail(d.email || "");
  setWhatsappNumber(d.whatsappNumber || "");
  setMobileNumber(d.mobileNumber || "");
  setCountryCode(d.countryCode || "+91");

  setTitle(d.title || "");
  setBedrooms(d.bedrooms || "");
  setPropertyType(d.propertyType || "");
  setBathrooms(d.bathrooms || "");
  setBalcony(d.balcony || "");
  setParking(d.parking || "");
  setAgeOfProperty(d.ageOfProperty || "");
  setFurnishing(d.furnishing || "");
  setPrice(d.price ? d.price.toString() : "0.00");
  setPriceNegotiable(d.priceNegotiable || "");
  setDescription(d.description || "");
  setAmenities(d.amenities || []);
  setPropertySize(d.propertySize || "");
  setPropertySizeUnit(d.propertySizeUnit || "sq ft");

    setCity(d.city || "");
    setLocality(d.locality || "");
    setAddress(d.address || "");
    setUnitNo(d.unitNo || "");
    setPincode(d.pincode || "");

    // Load media metadata in edit mode
    setExistingPhotosCount(d.photosCount || 0);
    setExistingHasVideo(d.hasVideo || false);
    setExistingHasSaleDeed(d.hasSaleDeed || false);
    setExistingHasBrochure(d.hasBrochure || false);
  }, [isEditMode]);

  // Auto-fetch user profile on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('gh_user');
    console.log('Auto-fetch: User data from localStorage:', savedUser);
    
    if (!savedUser) {
      console.log('Auto-fetch: No user data found in localStorage, skipping profile fetch');
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      console.log('Auto-fetch: Parsed user data:', parsedUser);
      
      if (parsedUser.isLoggedIn === true && (parsedUser.role === 'buyer' || parsedUser.role === 'seller')) {
        // Split user name into parts
        const nameParts = parsedUser.name ? parsedUser.name.trim().split(' ') : [];
        const firstName = nameParts[0] || parsedUser.firstName || '';
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : parsedUser.lastName || '';
        const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

        console.log('Auto-fetch: Name parts:', { firstName, middleName, lastName, originalName: parsedUser.name });

        // Only populate if fields are empty (don't override existing data)
        setFirstName(prev => {
          console.log('Auto-fetch: Setting firstName - current:', prev, 'new:', firstName);
          return prev || firstName;
        });
        setMiddleName(prev => {
          console.log('Auto-fetch: Setting middleName - current:', prev, 'new:', middleName);
          return prev || middleName;
        });
        setLastName(prev => {
          console.log('Auto-fetch: Setting lastName - current:', prev, 'new:', lastName);
          return prev || lastName;
        });
        setEmail(prev => {
          console.log('Auto-fetch: Setting email - current:', prev, 'new:', parsedUser.email);
          return prev || parsedUser.email || '';
        });
        setWhatsappNumber(prev => {
          console.log('Auto-fetch: Setting whatsappNumber - current:', prev, 'new:', parsedUser.mobile);
          return prev || parsedUser.mobile || '';
        });
        setMobileNumber(prev => {
          console.log('Auto-fetch: Setting mobileNumber - current:', prev, 'new:', parsedUser.mobile);
          return prev || parsedUser.mobile || '';
        });
        
        console.log('User profile loaded and form populated:', parsedUser);
      } else {
        console.log('Auto-fetch: User not logged in or invalid role');
      }
    } catch (error) {
      console.error('Auto-fetch: Error parsing user data:', error);
    }
  }, []);

  // validation
  // Step 1 Validation
  const isFirstNameValid = firstName.trim().length >= 2;
  const isLastNameValid = lastName.trim().length >= 2;
  const isEmailValid = validateEmail(email);
  const isWhatsappValid = whatsappNumber.length === 10;
  const canContinueStep1 = isFirstNameValid && isLastNameValid && isEmailValid && (isEditMode ? true : isWhatsappValid);

  // Step 2 Validation
  const isTitleValid = title.trim().length >= 3;
  const isBedroomsValid = Number(bedrooms.replace("+", "")) >= 0;
  const isBathroomsValid = Number(bathrooms.replace("+", "")) >= 0;
  const isPriceValid = parseFloat(price.replace(/,/g, '')) > 0;
  const canContinueStep2 = isTitleValid && isBedroomsValid && isBathroomsValid && isPriceValid;

  // Step 3 Validation
  const isCityValid = city.trim().length > 2;
  const isLocalityValid = locality.trim().length > 2;
  const isPincodeValid = pincode.length === 6;
  const isSocietyValid = title.trim().length >= 3;
  const isAddressValid = address.trim().length > 5;
  const canContinueStep3 = isCityValid && isLocalityValid && isPincodeValid && isSocietyValid && isAddressValid;

  // --- Helper arrays for ALL dropdowns ---
  const propertyTypeOptions = ["Apartment", "Tenement", "Bungalow", "Penthouse", "Plot", "Shop", "Office"];
  const bedroomOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const balconyOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const bathroomOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const parkingOptions = ["None", "1", "2", "3","4","5","6","7","8","9","10"];

  // Age of property: Updated options
  const ageOfPropertyOptions = [
    "New Property",
    "1–3 Years Old",
    "3–6 Years Old",
    "6–9 Years Old",
    "9+ Years Old"
  ];

  const furnishingOptions = ["Unfurnished", "Semi-furnished", "Fully furnished"];
  const cityOptions = ["Gandhinagar", "Gift City", "Ahmedabad"];
  const amenitySuggestions = ["Lift", "Security", "Garden", "Gym", "Swimming Pool", "Clubhouse", "Parking"];
  const propertySizeUnitOptions: Array<"sq ft" | "sq m" | "sq yd"> = ["sq ft", "sq m", "sq yd"];

  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value === "") {
      setPrice("");
    } else {
      const numValue = parseInt(value, 10);
      // Limit price to 99,99,99,999 (one less than 100 Crore)
      if (numValue <= 999999999) {
        setPrice(numValue.toLocaleString('en-IN'));
      }
    }
  };

  const canNavigateTo = (target: number) => {
    if (target === 0) return true;
    if (target === 1) return canContinueStep1;
    if (target === 2) return canContinueStep1 && canContinueStep2;
    if (target === 3) return canContinueStep1 && canContinueStep2 && canContinueStep3;
    return false;
  };

  const goTo = (s: Step) => {
    if (!canNavigateTo(s)) {
      setTriedContinue(true);
      return;
    }
    setStep(s);
    setTriedContinue(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const next = () => setStep((prev) => ((prev + 1) % 4) as Step);
  const prev = () => setStep((prev) => (prev - 1 >= 0 ? (prev - 1) : 0) as Step);

  // Save draft
  const handleSaveDraft = () => {
    setSaving(true);
    const numericPrice = parseFloat(price.replace(/,/g, ''));
    const payload = {
      firstName, middleName, lastName, email, whatsappNumber, mobileNumber, countryCode,
      title,
      bedrooms,
      propertyType,
      bathrooms,
      balcony,
      parking,
      ageOfProperty,
      furnishing,
      price: numericPrice,
      amenities,
      propertySize,
      propertySizeUnit,
      city, locality, address, unitNo, pincode,
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
      showToast("Draft saved locally.", 'info');
    }, 700);
  };

  const buildPayload = () => {
  const storedMedia = getSellFormMedia();
  const effectivePhotos = photos.length > 0 ? photos : storedMedia.photos;
  const effectiveVideo = video ?? storedMedia.video;
  const effectiveSaleDeed = saleDeed ?? storedMedia.saleDeed;
  const effectiveBrochure = brochure ?? storedMedia.brochure;

  const numericPrice = parseFloat(price.replace(/,/g, ""));
  return {
    firstName, middleName, lastName, email, whatsappNumber, mobileNumber, countryCode,
    title, bedrooms, propertyType, bathrooms, balcony, parking,
    ageOfProperty, furnishing,
    price: numericPrice,
    priceNegotiable,
    description,
    amenities,
    propertySize,
    propertySizeUnit,
    city, locality, address, unitNo, pincode,
    photosCount: isEditMode && effectivePhotos.length === 0 ? existingPhotosCount : effectivePhotos.length,
    hasVideo: isEditMode && !effectiveVideo ? existingHasVideo : !!effectiveVideo,
    hasSaleDeed: isEditMode && !effectiveSaleDeed ? existingHasSaleDeed : !!effectiveSaleDeed,
    hasBrochure: isEditMode && !effectiveBrochure ? existingHasBrochure : !!effectiveBrochure,
  };
};

const handleEditMediaSubmit = () => {
  localStorage.setItem(
    "pendingListing",
    JSON.stringify({
      ...buildPayload(),
      submittedAt: new Date().toISOString(),
    })
  );

  router.replace("/sell-property-in-gandhinagar-gujarat/confirmation");
};



  // Submit
  const handleSubmit = async (options?: { skipValidation?: boolean; payloadOverride?: any; redirectTo?: 'confirmation' | 'home' | 'none' }) => {
  // DEBUG: Check current state of files before processing
  console.log("[SELL FORM - START] Current React state:", {
    photos: photos.length,
    photoNames: photos.map(p => p.name),
    video: video?.name || "none",
    saleDeed: saleDeed?.name || "none",
    brochure: brochure?.name || "none",
  });

  const payload = options?.payloadOverride || {};
  const firstNameValue = String(payload.firstName ?? firstName ?? "").trim();
  const middleNameValue = String(payload.middleName ?? middleName ?? "");
  const lastNameValue = String(payload.lastName ?? lastName ?? "").trim();
  const emailValue = String(payload.email ?? email ?? "").trim();
  const whatsappNumberValue = String(payload.whatsappNumber ?? whatsappNumber ?? "").trim();
  const mobileNumberValue = String(payload.mobileNumber ?? mobileNumber ?? "").trim();
  const countryCodeValue = String(payload.countryCode ?? countryCode ?? "+91");
  const titleValue = String(payload.title ?? title ?? "").trim();
  const bedroomsValue = String(payload.bedrooms ?? bedrooms ?? "");
  const propertyTypeValue = String(payload.propertyType ?? propertyType ?? "");
  const bathroomsValue = String(payload.bathrooms ?? bathrooms ?? "");
  const balconyValue = String(payload.balcony ?? balcony ?? "");
  const parkingValue = String(payload.parking ?? parking ?? "");
  const ageOfPropertyValue = String(payload.ageOfProperty ?? ageOfProperty ?? "");
  const furnishingValue = String(payload.furnishing ?? furnishing ?? "");
  const priceValue = String(payload.price ?? price ?? "0.00");
  const priceNegotiableValue = String(payload.priceNegotiable ?? priceNegotiable ?? "");
  const descriptionValue = String(payload.description ?? description ?? "");
  const amenitiesValue = Array.isArray(payload.amenities) ? payload.amenities : (amenities || []);
  const propertySizeValue = String(payload.propertySize ?? propertySize ?? "");
  const propertySizeUnitValue = String(payload.propertySizeUnit ?? propertySizeUnit ?? "sq ft");
  const cityValue = String(payload.city ?? city ?? "").trim();
  const localityValue = String(payload.locality ?? locality ?? "").trim();
  const addressValue = String(payload.address ?? address ?? "").trim();
  const unitNoValue = String(payload.unitNo ?? unitNo ?? "");
  const pincodeValue = String(payload.pincode ?? pincode ?? "").trim();
  const storedMedia = getSellFormMedia();
  const photosValue = Array.isArray(payload.photos)
    ? payload.photos
    : (photos.length > 0 ? photos : storedMedia.photos);
  const videoValue = payload.video ?? video ?? storedMedia.video ?? null;
  const saleDeedValue = payload.saleDeed ?? saleDeed ?? storedMedia.saleDeed ?? null;
  const brochureValue = payload.brochure ?? brochure ?? storedMedia.brochure ?? null;

  if (!options?.skipValidation) {
    const isFirstNameValid = firstNameValue.length >= 2;
    const isLastNameValid = lastNameValue.length >= 2;
    const isEmailValid = validateEmail(emailValue);
    const isWhatsappValid = whatsappNumberValue.length === 10;
    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isWhatsappValid) {
      setStep(0);
      setTriedContinue(true);
      showToast("Please complete Basic Information and verify your WhatsApp number.", 'warning');
      return;
    }

    const isTitleValid = titleValue.length >= 3;
    const isBedroomsValid = Number(bedroomsValue.replace("+", "")) >= 0;
    const isBathroomsValid = Number(bathroomsValue.replace("+", "")) >= 0;
    const isPriceValid = parseFloat(priceValue.replace(/,/g, '')) > 0;
    if (!isTitleValid || !isBedroomsValid || !isBathroomsValid || !isPriceValid) {
      setStep(1);
      setTriedContinue(true);
      showToast("Please complete Specifications.", 'warning');
      return;
    }

    const isCityValid = cityValue.length > 2;
    const isLocalityValid = localityValue.length > 2;
    const isPincodeValid = pincodeValue.length === 6;
    const isSocietyValid = titleValue.length >= 3;
    const isAddressValid = addressValue.length > 5;
    if (!isCityValid || !isLocalityValid || !isPincodeValid || !isSocietyValid || !isAddressValid) {
      setStep(2);
      setTriedContinue(true);
      showToast("Please complete Location details.", 'warning');
      return;
    }
  }

  try {
    setSaving(true);

    // Create FormData for file uploads
    const formData = new FormData();

    // Add basic form fields
    formData.append('firstName', firstNameValue);
    formData.append('middleName', middleNameValue);
    formData.append('lastName', lastNameValue);
    formData.append('email', emailValue);
    formData.append('whatsappNumber', whatsappNumberValue);
    formData.append('mobileNumber', mobileNumberValue);
    formData.append('countryCode', countryCodeValue);
    formData.append('title', titleValue);
    formData.append('bedrooms', bedroomsValue);
    formData.append('propertyType', propertyTypeValue);
    formData.append('bathrooms', bathroomsValue);
    formData.append('balcony', balconyValue);
    formData.append('parking', parkingValue);
    formData.append('ageOfProperty', ageOfPropertyValue);
    formData.append('furnishing', furnishingValue);
    formData.append('availability', 'Immediate'); // Default availability
    
    const numericPrice = parseFloat(priceValue.replace(/,/g, ''));
    formData.append('price', numericPrice.toString());
    formData.append('priceNegotiable', String(priceNegotiableValue === 'Negotiable'));
    formData.append('description', descriptionValue);

    formData.append('amenities', JSON.stringify(amenitiesValue));
    formData.append('propertySize', propertySizeValue);
    formData.append('propertySizeUnit', propertySizeUnitValue);
    formData.append('city', cityValue);
    formData.append('locality', localityValue);
    formData.append('address', addressValue);
    formData.append('society', titleValue); // Using title as society name
    formData.append('unitNo', unitNoValue);
    formData.append('pincode', pincodeValue);

    // Add files if they exist
    console.log("[SELL FORM] File counts:", {
      photos: photosValue.length,
      video: videoValue ? 1 : 0,
      saleDeed: saleDeedValue ? 1 : 0,
      brochure: brochureValue ? 1 : 0
    });

    if (photosValue.length > 0) {
      console.log(`[SELL FORM] Adding ${photosValue.length} image(s) to FormData`);
      photosValue.forEach((photo: File, index: number) => {
        console.log(`[SELL FORM] Photo ${index + 1}:`, photo.name, photo.size, photo.type);
        formData.append('images', photo);
      });
    } else {
      console.log("[SELL FORM] No photos to upload");
    }

    if (videoValue) {
      console.log("[SELL FORM] Adding video to FormData:", videoValue.name, videoValue.size, videoValue.type);
      formData.append('video', videoValue as Blob);
    } else {
      console.log("[SELL FORM] No video to upload");
    }

    // Combine sale deed and brochure into documents array
    const documents = [] as File[];
    if (saleDeedValue) documents.push(saleDeedValue as File);
    if (brochureValue) documents.push(brochureValue as File);
    
    if (documents.length > 0) {
      console.log(`[SELL FORM] Adding ${documents.length} document(s) to FormData`);
      documents.forEach((doc, index) => {
        console.log(`[SELL FORM] Document ${index + 1}:`, doc.name, doc.size, doc.type);
        formData.append('documents', doc);
      });
    } else {
      console.log("[SELL FORM] No documents to upload");
    }

    console.log("[SELL FORM] FormData ready. Total entries:", Array.from(formData.entries()).length);

    const token =
      localStorage.getItem("gh_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      "";

    if (!token) {
      showToast("Please login as a seller to submit your listing.", 'warning');
      router.replace("/");
      return;
    }

    console.log("[SELL FORM] Sending request to:", `${API_URL}/sell`);
    const response = await axios.post(`${API_URL}/sell`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("[SELL FORM] Response received:", response.status, response.data.success);

    if (response.data.success) {
      const propertyId = response.data.data?._id;
      clearSellFormMedia();
      localStorage.setItem("pendingListing", JSON.stringify({
        ...buildPayload(),
        submittedAt: new Date().toISOString(),
        apiResponse: response.data.data,
        propertyId,
        paymentInfo: response.data.payment
      }));

      if (options?.redirectTo === 'home') {
        router.push("/");
      } else if (options?.redirectTo === 'none') {
        // no redirect requested
      } else {
        router.push("/sell-property-in-gandhinagar-gujarat/confirmation");
      }
    } else {
      // Store data even on failure
      localStorage.setItem("pendingListing", JSON.stringify({
        ...buildPayload(),
        submittedAt: new Date().toISOString(),
      }));
      showToast("There was an issue submitting, but your data is saved. Please proceed to review.", 'warning');
  router.push("/sell-property-in-gandhinagar-gujarat/confirmation");
    }

  } catch (error: any) {
    console.error("Sell API error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Error creating sell request";
    const errorCode = error.response?.data?.code;

    if (errorCode === 'AWAITING_PAYMENT_EXISTS') {
      localStorage.setItem("pendingListing", JSON.stringify({
        ...buildPayload(),
        submittedAt: new Date().toISOString(),
      }));
      showToast("Your listing was accepted. You can continue with the next step.", 'success');
      router.push("/sell-property-in-gandhinagar-gujarat/confirmation");
      return;
    }

    localStorage.setItem("pendingListing", JSON.stringify({
      ...buildPayload(),
      submittedAt: new Date().toISOString(),
    }));
    showToast(`Issue submitting: ${errorMessage}. Your data is saved, please proceed to review.`, 'warning');
  router.push("/sell-property-in-gandhinagar-gujarat/confirmation");
  } finally {
    setSaving(false);
  }
};


  // Files handlers
  const onAddPhotos = (files: FileList | null) => {
    console.log("[FILE INPUT] onAddPhotos called with", files?.length || 0, "files");
    if (!files) {
      console.log("[FILE INPUT] files is null, returning");
      console.trace("[FILE INPUT] called from:");
      return;
    }
    const maxRemaining = 9 - photos.length;
    const arr = Array.from(files).slice(0, maxRemaining);
    if (arr.length === 0) {
      console.log("[FILE INPUT] No photos to add after filtering");
      return;
    }
    console.log("[FILE INPUT] Adding", arr.length, "photos to state");
    arr.forEach((f, i) => console.log(`  Photo ${i + 1}:`, f.name, f.size, f.type));
    console.trace("[FILE INPUT] setPhotos called from:");
    setPhotos((p) => {
      console.log("[FILE INPUT SETTER] photos before:", p.length, "after:", [...p, ...arr].length);
      return [...p, ...arr];
    });
  };

  const onAddVideo = (file: FileList | null) => {
    console.log("[FILE INPUT] onAddVideo called with", file?.length || 0, "files");
    if (!file || file.length === 0) return;
    console.log("[FILE INPUT] Setting video:", file[0].name, file[0].size, file[0].type);
    console.trace("[FILE INPUT] setVideo called from:");
    setVideo(file[0]);
  };

  const removePhoto = (i: number) => {
    console.log("[FILE REMOVE] removePhoto called for index", i);
    console.trace("[FILE REMOVE] removePhoto called from:");
    setPhotos((p) => p.filter((_, idx) => idx !== i));
  };
  
  const removeVideo = () => {
    console.log("[FILE REMOVE] removeVideo called");
    console.trace("[FILE REMOVE] removeVideo called from:");
    setVideo(null);
  };

  const onAddSaleDeed = (fileList: FileList | null) => {
    console.log("[FILE INPUT] onAddSaleDeed called with", fileList?.length || 0, "files");
    if (!fileList || fileList.length === 0) return;
    console.log("[FILE INPUT] Setting sale deed:", fileList[0].name, fileList[0].size, fileList[0].type);
    setSaleDeed(fileList[0]);
  };

  const onAddBrochure = (fileList: FileList | null) => {
    console.log("[FILE INPUT] onAddBrochure called with", fileList?.length || 0, "files");
    if (!fileList || fileList.length === 0) return;
    console.log("[FILE INPUT] Setting brochure:", fileList[0].name, fileList[0].size, fileList[0].type);
    setBrochure(fileList[0]);
  };

  const removeSaleDeed = () => {
    console.log("[FILE REMOVE] removeSaleDeed called");
    console.trace("[FILE REMOVE] removeSaleDeed called from:");
    setSaleDeed(null);
  };
  
  const removeBrochure = () => {
    console.log("[FILE REMOVE] removeBrochure called");
    console.trace("[FILE REMOVE] removeBrochure called from:");
    setBrochure(null);
  };

  const onContinueFromStep1 = () => {
    setTriedContinue(true);
    if (!canContinueStep1) {
      if (!isEditMode && !isOtpVerified) {
        showToast("Please verify your Mobile number via SMS to continue.", 'warning');
      }
      return;
    }

    if (isEditMode) {
      localStorage.setItem("pendingListing", JSON.stringify(buildPayload()));
  router.push("/sell-property-in-gandhinagar-gujarat/confirmation");
      return;
    }

    setStep(1);
    setTriedContinue(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const onContinueFromStep2 = () => {
  if (!canContinueStep2) {
    setTriedContinue(true);
    return;
  }

    if (isEditMode) {
    localStorage.setItem("pendingListing", JSON.stringify(buildPayload()));
    router.push("/sell-property-in-gandhinagar-gujarat/confirmation");
    return;
  }

  setStep(2);
};


  const onContinueFromStep3 = () => {
  if (!canContinueStep3) {
    setTriedContinue(true);
    return;
  }

  if (isEditMode) {
    localStorage.setItem("pendingListing", JSON.stringify(buildPayload()));
    router.push("/sell-property-in-gandhinagar-gujarat/confirmation");
    return;
  }

  setStep(3);
};


  // --- OTP Functions ---
  const handleSendOtp = async () => {
    setTriedContinue(true);
    if (!isWhatsappValid) return;

    setIsSendingOtp(true);
    try {
      const response = await axios.post(`${API_URL}/sell-otp/send-otp`, {
        mobile: whatsappNumber
      });

      if (response.data.success) {
        setOtpSent(true);
        const otpForDev = response.data.data?.otp;
        if (otpForDev) {
          showToast(`OTP Sent via SMS! Dev OTP: ${otpForDev}`, 'info');
        } else {
          showToast("OTP Sent to your Mobile number via SMS!", 'success');
        }
      } else {
        showToast(response.data.message || "Failed to send OTP. Please try again.", 'error');
      }
    } catch (error: any) {
      console.error("Send SMS OTP error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to send SMS OTP";
      showToast(errorMessage, 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    try {
      const response = await axios.post(`${API_URL}/sell-otp/verify-otp`, {
        mobile: whatsappNumber,
        otp: otp
      });

      if (response.data.success) {
        setIsOtpVerified(true);
        showToast("Mobile number verified successfully!", 'success');
      } else {
        showToast(response.data.message || "Invalid OTP. Please try again.", 'error');
      }
    } catch (error: any) {
      console.error("Verify SMS OTP error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to verify SMS OTP";
      showToast(errorMessage, 'error');
    } finally {
      setIsVerifying(false);
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
  const selectNormal = `${inputNormal} appearance-none bg-no-repeat pr-10 text-left`;
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
                        <path d="M10 3L8 8l-5 2 5 2 2 5 2-5 5-2-5-2zM14 14l-2 5-2-5-5-2 5-2 2-5 2 5 5 2z"></path>
                      </svg>
                      <span>Privacy protected</span>
                    </div>
                  </div>

                  {/* Card 1: Name */}
                  <div className={`${cardWrapper} grid grid-cols-1 lg:grid-cols-3 gap-6`}>
                    <div>
                      <label className={fieldLabel}>First Name <span className="text-[#0b6b53]">*</span> <span className="text-xs text-gray-500 ml-1">(from profile)</span></label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Ramesh"
                        className={`${triedContinue && !isFirstNameValid ? inputError : inputNormal} bg-gray-50`}
                        disabled
                        readOnly
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
                      <label className={fieldLabel}>Last Name <span className="text-[#0b6b53]">*</span> <span className="text-xs text-gray-500 ml-1">(from profile)</span></label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Shah"
                        className={`${triedContinue && !isLastNameValid ? inputError : inputNormal} bg-gray-50`}
                        disabled
                        readOnly
                      />
                      {triedContinue && !isLastNameValid && <div className="text-xs text-red-600 mt-2">Enter last name (min 2).</div>}
                    </div>
                  </div>

                  {/* Card 2: Contact Details */}
                  <div className={`${cardWrapper} space-y-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={fieldLabel}>Email <span className="text-[#0b6b53]">*</span> <span className="text-xs text-gray-500 ml-1">(from profile)</span></label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className={`${triedContinue && !isEmailValid ? inputError : inputNormal} bg-gray-50`}
                          disabled
                          readOnly
                        />
                        {triedContinue && !isEmailValid && <div className="text-xs text-red-600 mt-2">Enter a valid email address.</div>}
                      </div>
                      <div>
                        <label className={fieldLabel}>WhatsApp Number <span className="text-xs text-gray-500 ml-1">(from profile)</span></label>
                        <input
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          placeholder="From profile"
                          className={`${inputNormal} bg-gray-50`}
                          disabled
                          readOnly
                        />
                      </div>
                    </div>

                    {/* OTP Section - COMMENTED OUT AS NOT REQUIRED */}
                    {/* 
                    !isEditMode && (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className={fieldLabel}>Mobile Number <span className="text-[#0b6b53]">*</span></label>
                            <div className="flex gap-2">
                              <div className="flex items-center justify-center h-12 px-4 rounded-xl border border-gray-100 bg-gray-100 text-gray-700 font-semibold">{countryCode}</div>
                              <input
                                value={whatsappNumber}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                  setWhatsappNumber(value);
                                }}
                                placeholder="9XXXXXXXXX"
                                className={`${triedContinue && !isWhatsappValid ? inputError : inputNormal} flex-1`}
                                disabled={otpSent || isEditMode}
                                readOnly
                                maxLength={10}
                              />
                              <button
                                onClick={handleSendOtp}
                                disabled={!isWhatsappValid || otpSent || isSendingOtp}
                                className={`h-12 px-4 rounded-lg font-semibold text-sm ${(!isWhatsappValid || otpSent) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#0b6b53] text-white hover:bg-[#0b6b53]'}`}
                              >
                                {isSendingOtp ? "Sending..." : (otpSent ? "Sent" : "Send OTP")}
                              </button>
                            </div>
                            {triedContinue && !isWhatsappValid && <div className="text-xs text-red-600 mt-2">Enter a valid 10-digit number.</div>}
                          </div>

                          {otpSent && !isOtpVerified && (
                            <div>
                              <label className={fieldLabel}>Enter OTP <span className="text-[#0b6b53]">*</span></label>
                              <div className="flex gap-2">
                                <input
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value)}
                                  placeholder="Enter 6-digit OTP"
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
                    )
                    */}
                  </div>

                  <p className="text-sm text-gray-500">Your contact is partially visible to buyers. Full details require buyer subscription.</p>

                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={onContinueFromStep1}
                      className={canContinueStep1 ? btnPrimary : btnDisabled}
                      disabled={!canContinueStep1}
                    >
                      {isEditMode ? "Save Changes" : "Continue to Specifications"}
                    </button>
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
                      <label className={fieldLabel}>Society / Project Name <span className="text-[#0b6b53]">*</span></label>
                      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Shilp Residency" className={`${triedContinue && !isTitleValid ? inputError : inputNormal}`} />
                      {triedContinue && !isTitleValid && <div className="text-xs text-red-600 mt-2">Please enter society / project name.</div>}
                    </div>

                    <div>
                      <label className={fieldLabel}>Property Type</label>
                      <Listbox value={propertyType} onChange={setPropertyType}>
                        <div className="relative">
                          <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
<span className={`block truncate ${!propertyType ? 'text-gray-400' : 'text-black'}`}>
  {propertyType || "Select property type"}
</span>                            <DropdownChevron />
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
                    <div>
                      <label className={fieldLabel}>Bedrooms <span className="text-[#0b6b53]">*</span></label>
                        <Listbox value={bedrooms} onChange={setBedrooms}>
                        <div className="relative">
                          <Listbox.Button className={`${selectNormal} ${triedContinue && !isBedroomsValid ? 'border-red-200' : 'border-gray-100'} flex items-center justify-between`}>
<span className={`block truncate ${!bedrooms ? 'text-gray-400' : 'text-black'}`}>
  {bedrooms || "Select bedrooms"}
</span>                            <DropdownChevron />
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

                    <div>
                      <label className={fieldLabel}>Balcony</label>
                      <Listbox value={balcony} onChange={setBalcony}>
                        <div className="relative">
                          <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
<span className={`block truncate ${!balcony ? 'text-gray-400' : 'text-black'}`}>
  {balcony || "Select balcony"}
</span>                            <DropdownChevron />
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

                    <div>
                      <label className={fieldLabel}>Bathrooms <span className="text-[#0b6b53]">*</span></label>
                      <Listbox value={bathrooms} onChange={setBathrooms}>
                        <div className="relative">
                          <Listbox.Button className={`${selectNormal} ${triedContinue && !isBathroomsValid ? 'border-red-200' : 'border-gray-100'} flex items-center justify-between`}>
<span className={`block truncate ${!bathrooms ? 'text-gray-400' : 'text-black'}`}>
  {bathrooms || "Select bathrooms"}
</span>                            <DropdownChevron />
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
                    <div>
                      <label className={fieldLabel}>Parking</label>
                      <Listbox value={parking} onChange={setParking}>
                        <div className="relative">
                          <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
<span className={`block truncate ${!parking ? 'text-gray-400' : 'text-black'}`}>
  {parking || "Select parking"}
</span>                            <DropdownChevron />
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

                    <div>
                      <label className={fieldLabel}>Property Age</label>
                      <Listbox value={ageOfProperty} onChange={setAgeOfProperty}>
                        <div className="relative">
                          <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
<span className={`block truncate ${!ageOfProperty ? 'text-gray-400' : 'text-black'}`}>
  {ageOfProperty || "Select age of property"}
</span>                            <DropdownChevron />
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

                    <div>
                      <label className={fieldLabel}>Furnishing</label>
                      <Listbox value={furnishing} onChange={setFurnishing as any}>
                        <div className="relative">
                          <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
<span className={`block truncate ${!furnishing ? 'text-gray-400' : 'text-black'}`}>
  {furnishing || "Select furnishing"}
</span>                            <DropdownChevron />
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

                  {/* Size of Property */}
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
                        Example: 1200 sq ft (built-up as per your local standard).
                      </p>
                    </div>

                    <div>
  {/* Flex container to put label and info text side-by-side */}
  <div className="flex items-center justify-between mb-2">
    <label className="text-sm font-semibold text-gray-800">
      Asking Price (₹) <span className="text-[#0b6b53]">*</span>
    </label>
    <span className="text-xs text-gray-500 font-normal">
      All-inclusive(Excl.Stamp Duty)
    </span>
  </div>

  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-small">₹</span>
    <input
      value={price === "0.00" || price === "" ? "" : price}
      onChange={handlePriceInput}
      placeholder="0.00"
      className={`${triedContinue && !isPriceValid ? inputError : inputNormal} pl-8 text-medium font-regular ${price && price !== "0.00" ? 'text-black' : 'text-gray-400'}`}
    />
  </div>

  {price && (
    <div className="mt-2 px-1 text-sm font-medium text-black flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
      <span>{priceToWords(parseInt(price.replace(/,/g, ''), 10))}</span>
    </div>
  )}

  {/* Removed the bottom <p> tag as per your request */}
  {triedContinue && !isPriceValid && <div className="text-xs text-red-600 mt-2">Required</div>}

  <div className="mt-4">
    <label className={fieldLabel}>Price Negotiation</label>
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => setPriceNegotiable("Negotiable")}
        className={`flex-1 h-12 rounded-xl border font-semibold text-sm transition ${priceNegotiable === "Negotiable" ? "bg-[#0b6b53] text-white border-[#0b6b53]" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
      >
        Negotiable
      </button>
      <button
        type="button"
        onClick={() => setPriceNegotiable("Non-Negotiable")}
        className={`flex-1 h-12 rounded-xl border font-semibold text-sm transition ${priceNegotiable === "Non-Negotiable" ? "bg-[#0b6b53] text-white border-[#0b6b53]" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
      >
        Non-Negotiable
      </button>
    </div>
  </div>
</div>
                  </div>

                  {/* Row 4b: Property Description */}
                  <div className={cardWrapper + " grid grid-cols-1"}>
                    <div>
                      <label className={fieldLabel}>Property Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your property... Highway touch, corner plot, near metro, garden facing, newly renovated, etc."
                        className={inputNormal + " min-h-[120px]"}
                      />
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
                      <button onClick={onContinueFromStep2} className={canContinueStep2 ? btnPrimary : btnDisabled} disabled={!canContinueStep2}>{isEditMode ? "Save Changes" : "Continue to Location"}</button>
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


              {/* --- STEP 2: LOCATION --- */}
{step === 2 && (
  <div className="space-y-6">
    {/* Row 0: Header */}
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Step 3: Location</h3>
      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        Keep it simple
      </div>
    </div>

    {/* Combined Card: Project Details, Address, City, Locality & Pincode */}
    <div className={cardWrapper + " space-y-6"}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label className={fieldLabel}>Society / Project Name <span className="text-[#0b6b53]">*</span></label>
          <input
            value={title}
            readOnly
            placeholder="e.g., Shilp Residency"
            className={inputNormal + " bg-gray-50 text-gray-500 cursor-not-allowed"}
          />
        </div>

        <div className="md:col-span-1">
          <label className={fieldLabel}>Unit No</label>
          <input
            value={unitNo}
            onChange={(e) => setUnitNo(e.target.value)}
            placeholder="e.g., B-701 (Optional)"
            className={inputNormal}
          />
        </div>
      </div>

      {/* Address Field */}
      <div>
        <label className={fieldLabel}>Address <span className="text-[#0b6b53]">*</span></label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter full property address"
          className={`${triedContinue && !isAddressValid ? "border-red-200 bg-red-50" : "border-gray-100 bg-white"} w-full rounded-xl px-4 py-3 border outline-none shadow-sm min-h-[100px]`}
        />
        {triedContinue && !isAddressValid && <div className="text-xs text-red-600 mt-2">Please enter full address.</div>}
      </div>

      {/* City and Locality Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City Dropdown */}
        <div>
          <label className={fieldLabel}>City <span className="text-[#0b6b53]">*</span></label>
          <Listbox value={city} onChange={(val) => { setCity(val); setLocality(""); }}>
            <div className="relative">
              <Listbox.Button className={selectNormal + " flex items-center justify-between"}>
                <span className={`block truncate ${!city ? 'text-gray-400' : 'text-black'}`}>
                  {city || "Select city"}
                </span>
                <DropdownChevron />
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20">
                  {cityOptions.map((option, idx) => (
                    <Listbox.Option
                      key={idx}
                      className={({ active }) => `relative cursor-default select-none py-2 px-4 ${active ? 'bg-[#f1faf6] text-[#0b6b53]' : 'text-gray-900'}`}
                      value={option}
                    >
                      {({ selected }) => <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option}</span>}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
          {triedContinue && !isCityValid && <div className="text-xs text-red-600 mt-2">Please enter a city.</div>}
        </div>

        {/* Locality Dropdown */}
        <div>
          <label className={fieldLabel}>Locality / Area <span className="text-[#0b6b53]">*</span></label>
          <Listbox value={locality} onChange={setLocality} disabled={!city}>
            <div className="relative">
              <Listbox.Button className={`${selectNormal} flex items-center justify-between ${!city ? 'bg-gray-50 opacity-60 cursor-not-allowed' : ''}`}>
                <span className={`block truncate ${!locality ? 'text-gray-400' : 'text-black'}`}>
                  {!city ? "Select city first" : (locality || "Select locality")}
                </span>
                <DropdownChevron />
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20">
                  {city && CITY_AREAS[city]?.map((area, idx) => (
                    <Listbox.Option
                      key={idx}
                      className={({ active }) => `relative cursor-default select-none py-2 px-4 ${active ? 'bg-[#f1faf6] text-[#0b6b53]' : 'text-gray-900'}`}
                      value={area}
                    >
                      {({ selected }) => <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{area}</span>}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>

          {/* Helper Message Added Here */}
          {city && (
            <p className="text-[11px] text-gray-500 mt-2 px-1 leading-relaxed">
Can’t find your area? Select the nearest major locality.            </p>
          )}

          {triedContinue && !isLocalityValid && <div className="text-xs text-red-600 mt-2">Please enter a locality.</div>}
        </div>
      </div>

      {/* Pincode Bottom (Full Width) */}
      <div>
        <label className={fieldLabel}>Pincode <span className="text-[#0b6b53]">*</span></label>
        <input
          value={pincode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setPincode(value);
          }}
          placeholder="e.g., 382421"
          className={`${triedContinue && !isPincodeValid ? inputError : inputNormal}`}
          maxLength={6}
        />
        {triedContinue && !isPincodeValid && <div className="text-xs text-red-600 mt-2">Please enter a valid 6-digit pincode.</div>}
      </div>
    </div>

    {/* Card 4: Map */}
    <div className={cardWrapper + " p-2"}>
      <p className="text-sm text-gray-600 mb-3 px-1">
        Click on the map to open the location picker, search your address and drop a pin so buyers can see your exact location.
      </p>
      <GoogleLocationPicker
        value={{ lat: latitude, lng: longitude, displayAddress: pickedDisplayAddress }}
        onChange={(next) => {
          setLatitude(next.lat);
          setLongitude(next.lng);
          setPickedDisplayAddress(next.displayAddress || "");
          if (next.displayAddress && address.trim().length < 6) {
            setAddress(next.displayAddress);
          }
        }}
      />
    </div>

    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep(1)} className={btnLight}>Back to Specifications</button>
        <button
          onClick={onContinueFromStep3}
          className={canContinueStep3 ? btnPrimary : btnDisabled}
          disabled={!canContinueStep3}
        >
          {isEditMode ? "Save Changes" : "Continue to Media Upload"}
        </button>
      </div>
    </div>
  </div>
)}


              {/* --- STEP 3: MEDIA --- */}
              {step === 3 && (
                <div className="space-y-6">
                    {/* Row 0: Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Step 4: Media Upload </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      Add photos to get 5x more views
                    </div>
                  </div>

                  {/* Card 1: Photos */}
                  <div className={cardWrapper}>
                    <label className={fieldLabel}>Upload Photos (Optional)</label>
                    <p className="text-sm text-gray-500 mb-4">
                      Listings with photos get 5x more views. You can add them now or later from your dashboard.
                    </p>

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
                      {isEditMode && existingPhotosCount > 0 && photos.length === 0 && (
                        <p className="text-xs text-green-600 mt-2">
                          ✓ {existingPhotosCount} photo{existingPhotosCount > 1 ? "s" : ""} already uploaded
                        </p>
                      )}
                      {isEditMode && existingPhotosCount > 0 && photos.length > 0 && (
                        <p className="text-xs text-blue-600 mt-2">
                          {existingPhotosCount} existing + {photos.length} new photo{photos.length > 1 ? "s" : ""} selected
                        </p>
                      )}
                    </div>

                    <input
                      ref={photoRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        console.log("[PHOTO INPUT] onChange fired with", e.target.files?.length || 0, "files");
                        console.trace("[PHOTO INPUT] onChange stack:");
                        onAddPhotos(e.target.files);
                      }}
                    />

                    {(photos.length > 0 || (isEditMode && existingPhotosCount > 0)) && (
                      <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-3">
                        {/* Show existing photos in edit mode */}
                        {isEditMode && existingPhotosCount > 0 && Array.from({ length: existingPhotosCount }).map((_, i) => (
                          <div
                            key={`existing-${i}`}
                            className="aspect-square rounded-lg border border-green-200 flex items-center justify-center bg-green-50 overflow-hidden relative"
                          >
                            <div className="text-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mx-auto mb-1">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                              </svg>
                              <p className="text-xs text-green-700 font-medium">Photo {i + 1}</p>
                              <p className="text-xs text-green-600">Already uploaded</p>
                            </div>
                          </div>
                        ))}
                        {/* Show newly added photos */}
                        {photos.map((file, i) => (
                          <div
                            key={`new-${i}`}
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
                    <div className="h-24 rounded-lg border-2 border-dashed border-gray-200 bg-white flex items-center gap-4 px-6">
                      {video ? (
                        <div className="flex items-center gap-4 w-full">
                           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0b6b53]"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 font-medium truncate">{video.name}</p>
                            <p className="text-xs text-gray-500">{(video.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button onClick={removeVideo} className="text-sm text-red-600 font-medium ml-auto">Remove</button>
                        </div>
                      ) : isEditMode && existingHasVideo ? (
                        <div className="flex items-center gap-4 w-full">
                           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                          <div className="flex-1">
                            <p className="text-sm text-green-700 font-medium">Video already uploaded</p>
                            <p className="text-xs text-green-600">Click "Add Video" to replace</p>
                          </div>
                          <button onClick={() => videoRef.current?.click()} className="ml-auto h-10 w-32 flex justify-center items-center rounded-lg bg-[#0b6b53] text-white text-sm font-semibold">Replace Video</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                          <div className="text-sm text-gray-500">No video uploaded</div>

                          <button onClick={() => videoRef.current?.click()} className="ml-auto h-10 w-40 flex justify-center items-center rounded-lg bg-[#0b6b53] text-white text-sm font-semibold">Add Video</button>
                        </div>
                      )}
                      <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => {
                        console.log("[VIDEO INPUT] onChange fired with", e.target.files?.length || 0, "files");
                        console.trace("[VIDEO INPUT] onChange stack:");
                        onAddVideo(e.target.files);
                      }} />
                    </div>
                  </div>

                  {/* Card 3: Sale Deed */}
                  <div className={cardWrapper}>
                    <label className={fieldLabel}>Upload Sale Deed / Index Copy (Optional)</label>
                    <p className="text-sm text-gray-500 mb-4">
                      Uploading a sale deed or index copy helps buyers verify ownership and adds trust to your listing.
                    </p>
                    <div className="h-24 rounded-lg border-2 border-dashed border-gray-200 bg-white flex items-center gap-4 px-6">
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
                      ) : isEditMode && existingHasSaleDeed ? (
                        <div className="flex items-center gap-4 w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm text-green-700 font-medium">Sale Deed already uploaded</p>
                            <p className="text-xs text-green-600">Click "Add Document" to replace</p>
                          </div>
                          <button onClick={() => saleDeedRef.current?.click()} className="ml-auto h-10 w-40 flex justify-center items-center rounded-lg bg-[#0b6b53] text-white text-sm font-semibold">
                            Replace Document
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <div className="text-sm text-gray-500">No document uploaded</div>

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
                        onChange={(e) => {
                          console.log("[SALE DEED INPUT] onChange fired with", e.target.files?.length || 0, "files");
                          console.trace("[SALE DEED INPUT] onChange stack:");
                          onAddSaleDeed(e.target.files);
                        }}
                      />
                    </div>
                  </div>

                  {/* Card 4: Brochure */}
                  <div className={cardWrapper}>
                    <label className={fieldLabel}>Upload Brochure (Optional)</label>
                    <p className="text-sm text-gray-500 mb-4">
                      Share your project or property brochure so buyers can see detailed plans, layouts and highlights.
                    </p>
                    <div className="h-24 rounded-lg border-2 border-dashed border-gray-200 bg-white flex items-center gap-4 px-6">
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
                      ) : isEditMode && existingHasBrochure ? (
                        <div className="flex items-center gap-4 w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M4 4.5A2.5 2.5 0 0 1 6.5 7H20"></path>
                            <path d="M4 4.5v15"></path>
                            <path d="M20 4.5v15"></path>
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm text-green-700 font-medium">Brochure already uploaded</p>
                            <p className="text-xs text-green-600">Click "Add Brochure" to replace</p>
                          </div>
                          <button onClick={() => brochureRef.current?.click()} className="ml-auto h-10 w-40 flex justify-center items-center rounded-lg bg-[#0b6b53] text-white text-sm font-semibold">
                            Replace Brochure
                          </button>
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
                        onChange={(e) => {
                          console.log("[BROCHURE INPUT] onChange fired with", e.target.files?.length || 0, "files");
                          console.trace("[BROCHURE INPUT] onChange stack:");
                          onAddBrochure(e.target.files);
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer: Buttons */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setStep(2)} className={btnLight}>Back to Location</button>
                      <button onClick={handleSaveDraft} className={btnSecondary}>Save Draft</button>
                      <button
  onClick={isEditMode ? handleEditMediaSubmit : () => setShowPaymentModal(true)}
  className={saving ? btnDisabled : btnPrimary}
  disabled={saving}
>
  {saving ? (isEditMode ? "Saving..." : "Submitting...") : (isEditMode ? "Save & Return to Review" : "Submit Listing")}
</button>

                    {/* Payment / Terms modal (bypass Razorpay) */}
                    {showPaymentModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-lg">
                          {!showThankYou ? (
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Terms & Payment</h3>
                              <div className="text-sm text-gray-700 mb-4">
                                Please read and agree to the terms and conditions before proceeding. After you pay using the QR code, click Submit.
                              </div>

                              {/* Scrollable terms preview showing `termsVisibleCount` items */}
                              <div className="max-h-40 overflow-y-auto p-3 border border-gray-100 rounded-md bg-white mb-2">
                                <h4 className="text-sm font-semibold mb-2">Terms &amp; Conditions (Preview)</h4>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                  {TERMS.slice(0, termsVisibleCount).map((t, i) => (
                                    <li key={i}>{t}</li>
                                  ))}
                                </ol>
                              </div>

                              <div className="flex items-center justify-between mb-3">
                                {termsVisibleCount < TERMS.length ? (
                                  <button
                                    className="text-sm text-[#0b6b53] font-medium"
                                    onClick={() => setTermsVisibleCount(Math.min(TERMS.length, termsVisibleCount + 10))}
                                  >
                                    Read more
                                  </button>
                                ) : (
                                  <div className="text-xs text-gray-500">All terms shown</div>
                                )}
                                <label className="flex items-center gap-2">
                                  <input type="checkbox" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} />
                                  <span className="text-sm">I agree to the Terms & Conditions</span>
                                </label>
                              </div>

                              {/* {agreeToTerms && (
                                <div className="mt-4">
                                  <div className="mb-2 font-medium">Pay here</div>
                                  <div className="w-full h-64 flex items-center justify-center border border-gray-100 rounded-lg bg-gray-50">
                                    <img src="/images/qr_payment.png" alt="Payment QR" className="max-h-56 object-contain" />
                                  </div>
                                  <p className="text-xs text-gray-500 mt-2">Scan the QR and complete payment using your preferred UPI app.</p>
                                </div>
                              )} */}

                              <div className="mt-6 flex items-center justify-end gap-3">
                                <button className="px-4 py-2 rounded-lg bg-gray-100" onClick={() => { setShowPaymentModal(false); setAgreeToTerms(false); }}>Cancel</button>
                                <button
                                  className={`px-4 py-2 rounded-lg font-semibold ${agreeToTerms ? 'bg-[#0b6b53] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                                  disabled={!agreeToTerms || saving}
                                  onClick={async () => {
                                    setShowPaymentModal(false);
                                    setSaving(true);
                                    try {
                                      await handleSubmit({ redirectTo: 'none' });
                                      router.push('/sell-property-in-gandhinagar-gujarat/subscription');
                                    } catch (e) {
                                      console.error('Failed to submit listing before payment', e);
                                      showToast('Failed to submit listing. Please try again.', 'error');
                                    } finally {
                                      setSaving(false);
                                    }
                                  }}
                                >
                                  {saving ? 'Submitting...' : 'Proceed to Payment'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <h3 className="text-lg font-semibold">Thank you</h3>
                              <p className="mt-3 text-sm text-gray-700">If you have paid successfully, your property will be uploaded soon.</p>
                              <div className="mt-6">
                                <button className="px-4 py-2 rounded-lg bg-[#0b6b53] text-white" onClick={() => { setShowPaymentModal(false); setShowThankYou(false); setAgreeToTerms(false); }}>
                                  Close
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Separate Payment QR modal */}
                    {showPaymentQrModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
                          <h3 className="text-lg font-semibold">Payment</h3>
                            <div className="mt-4 text-center">
                            <img src="/images/qr_payment.jpeg" alt="Payment QR" className="mx-auto max-h-64 object-contain" />
                            <p className="text-sm text-gray-500 mt-3">Scan the QR and complete payment using your preferred UPI app.</p>
                          </div>
                          <div className="mt-6 flex items-center justify-end gap-3">
                            <button className="px-4 py-2 rounded-lg bg-gray-100" onClick={() => { setShowPaymentQrModal(false); setAgreeToTerms(false); setTermsVisibleCount(10); }}>Cancel</button>
                            <button
                              className="px-4 py-2 rounded-lg bg-[#0b6b53] text-white font-semibold"
                              onClick={async () => {
                                // User confirms payment done. Submit listing.
                                setShowPaymentQrModal(false);
                                setSaving(true);
                                try {
                                  await handleSubmit();
                                  // handleSubmit routes to confirmation on success
                                } catch (e) {
                                  // errors handled in handleSubmit
                                } finally {
                                  setSaving(false);
                                }
                              }}
                            >
                              I have paid
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        input:focus, select:focus, textarea:focus, [role="listbox"]:focus-within, [role="listbox"]:focus {
          box-shadow: 0 8px 24px rgba(11,107,83,0.06);
          border-color: rgba(11,107,83,0.45);
        }

        [role="listbox"] > button:focus {
           box-shadow: 0 8px 24px rgba(11,107,83,0.06);
           border-color: rgba(11,107,83,0.45);
        }
      `}</style>
    </div>
  );  
}

export default function SellFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SellFormPageContent />
    </Suspense>
  );
}