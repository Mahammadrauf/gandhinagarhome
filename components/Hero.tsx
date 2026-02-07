'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Manrope } from 'next/font/google';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

// === FONTS ===
const manrope = Manrope({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope'
});

// === COLORS & BUTTON STYLES ===
const BRAND_HEX = "#056F5E";
const BRAND_GREEN = `bg-[${BRAND_HEX}]`;

// Button Styles
const BUTTON_BASE_CLASSES = `
  group
  relative
  ${BRAND_GREEN}
  hover:bg-[#068a75]
  text-white 
  px-8 py-3 
  rounded-full 
  font-bold tracking-tight 
  shadow-[0_10px_20px_-10px_rgba(5,111,94,0.5)]
  transition-all duration-300 ease-out
  hover:scale-105
  hover:-translate-y-1
  hover:shadow-[0_20px_35px_-15px_rgba(5,111,94,0.6)]
  active:scale-[0.98] active:translate-y-0
`;

// === REUSABLE DROPDOWN COMPONENT ===
const Dropdown = ({ 
  placeholder, 
  options, 
  value,
  onValueChange,
  triggerClassName = "" 
}: { 
  placeholder: string; 
  options: string[];
  value?: string;
  onValueChange?: (value: string) => void;
  triggerClassName?: string;
}) => (
  <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger className={`inline-flex items-center justify-between w-full gap-2 px-4 lg:px-6 py-3 rounded-full border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#056F5E] shadow-sm font-medium ${manrope.className} tracking-tight transition-all hover:border-[#056F5E]/50 ${triggerClassName}`}>
      <Select.Value placeholder={placeholder} />
      <Select.Icon>
        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
      </Select.Icon>
    </Select.Trigger>
    
    <Select.Portal>
      <Select.Content 
        position="popper" 
        sideOffset={5} 
        className={`z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${manrope.className}`}
      >
        <Select.Viewport className="p-1">
          {options.map((opt) => (
            <Select.Item
              key={opt}
              value={opt}
              className="group flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 select-none data-[highlighted]:bg-[#056F5E]/10 data-[highlighted]:text-[#056F5E] cursor-pointer outline-none transition-colors"
            >
              <Select.ItemText>{opt}</Select.ItemText>
              <Select.ItemIndicator className="ml-auto text-[#056F5E]">
                <Check className="w-4 h-4" />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const Hero = () => {
  // State for search filters
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [age, setAge] = useState("");

  // Map display budget to internal filter keys used in /buy page
  const getBudgetParams = (displayValue: string) => {
    const map: Record<string, string> = {
      "₹0 - ₹50 Lakhs": "0-50L",
      "₹50L - ₹1 Cr": "50L-1Cr",
      "₹1 Cr - ₹1.5 Cr": "1Cr-1.5Cr",
      "Above ₹1.5 Cr": "1.5Cr+"
    };
    return map[displayValue] || "";
  };

  // Build the search URL with query parameters
  const getSearchUrl = () => {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (propertyType) params.append("propertyType", propertyType);
    if (budget) params.append("priceRange", getBudgetParams(budget));
    if (age) params.append("ageOfProperty", age);
    
    const queryString = params.toString();
    return queryString ? `/buy?${queryString}` : '/buy';
  };

  return (
    <section className={`relative bg-white flex flex-col ${manrope.className}`}>
      
      {/* === ANIMATION STYLES === */}
      <style jsx global>{`
        @keyframes premiumRise {
          0% { opacity: 0; transform: translateY(25px) scale(0.98); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-rise { opacity: 0; animation: premiumRise 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .delay-100 { animation-delay: 0.15s; }
        .delay-200 { animation-delay: 0.3s; }
        .delay-300 { animation-delay: 0.45s; }
      `}</style>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-8 mt-6 md:mt-6 relative z-10">
        <div className="relative h-[500px] sm:h-[480px] md:h-[420px] overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-2xl">

          {/* Background */}
          {/* Original green background - commented out */}
          {/* <div className="absolute inset-0 bg-[#056F5E]" /> */}
          {/* <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/5 pointer-events-none" /> */}
          
          {/* New hero.png background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/images/hero.png")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* TEXT BLOCK */}
          <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-start pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-24 z-10 text-white max-w-4xl">
            <h1 className="animate-rise text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter sm:tracking-tight md:tracking-tight mb-3 drop-shadow-sm leading-[1.1]">
              Gandhinagar<span className="text-emerald-300">Homes</span>.com
            </h1>
            <p className="animate-rise delay-100 text-sm md:text-xl font-bold tracking-[0.15em] text-emerald-100 mb-6 uppercase drop-shadow-sm">
             Where every property will find its next owner.
            </p>
            <p className="animate-rise delay-200 text-base md:text-lg text-emerald-50 leading-relaxed max-w-xl hidden md:block font-medium opacity-90 mb-10">
              Your trusted platform dedicated exclusively to <span className="text-white font-bold border-b border-white/30 pb-0.5">Resale Properties</span> in Gandhinagar. 
              We connect home sellers with genuine buyers & help every home find its perfect match
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-3 sm:px-4 pb-4 sm:pb-6 animate-rise delay-300">
            <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-[2rem] md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-3 sm:p-3 md:p-2.5 border border-gray-100">
              
              <div className="flex flex-col md:flex-row gap-2">
                
                {/* 1. CITY */}
                <div className="w-full md:flex-1 min-w-0">
                    <Dropdown 
                        placeholder="City" 
                        options={["Gandhinagar", "Gift City", "Ahmedabad"]} 
                        value={city}
                        onValueChange={setCity}
                    />
                </div>

                {/* 2. PROPERTY TYPE */}
                <div className="w-full md:flex-1 min-w-0">
                  <Dropdown 
                    placeholder="Type" 
                    options={["Apartment", "Tenement", "Bungalow", "Penthouse", "Plot", "Shop", "Office"]} 
                    value={propertyType}
                    onValueChange={setPropertyType}
                  />
                </div>

                {/* 3. BUDGET */}
                <div className="w-full md:flex-1 min-w-0">
                  <Dropdown 
                    placeholder="Budget" 
                    options={["₹0 - ₹50 Lakhs", "₹50L - ₹1 Cr", "₹1 Cr - ₹1.5 Cr", "Above ₹1.5 Cr"]} 
                    value={budget}
                    onValueChange={setBudget}
                  />
                </div>

                {/* 4. AGE OF PROPERTY (REPLACED POSSESSION) */}
                <div className="w-full md:flex-1 min-w-0">
                  <Dropdown 
                    placeholder="Property Age" 
                    options={["New Property", "1–3 Years Old", "3–6 Years Old", "6–9 Years Old", "9+ Years Old"]} 
                    value={age}
                    onValueChange={setAge}
                  />
                </div>

                {/* Search button */}
                <Link 
                  href={getSearchUrl()} 
                  className={`${BUTTON_BASE_CLASSES} w-full md:w-auto flex-shrink-0 flex items-center justify-center`}
                >
                  Search
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* === CTA BUTTONS === */}
      <div className="bg-white py-10 flex justify-center animate-rise delay-300">
        <div className="bg-white rounded-[2.5rem] px-8 py-5 border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-shadow hover:shadow-[0_20px_50px_-10px_rgba(5,111,94,0.15)] inline-flex">
          <div className="flex flex-col md:flex-row gap-6 flex-gap-6-fallback flex-no-shrink items-center">
            
            <Link href="/buy" className={`inline-block flex-shrink-0 ${BUTTON_BASE_CLASSES} !px-12 !py-4`}>
              Buy Property
            </Link>
            
            <Link href="/sell" className={`inline-block flex-shrink-0 ${BUTTON_BASE_CLASSES} !px-12 !py-4`}>
              Sell Property
            </Link>

          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;