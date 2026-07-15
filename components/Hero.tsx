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
const BRAND_HEX = "#044c43";
const BRAND_GREEN = `bg-[${BRAND_HEX}]`;

// Button Styles
const BUTTON_BASE_CLASSES = `
  group
  relative
  ${BRAND_GREEN}
  hover:bg-[#066257]
  text-white
  px-8 py-3
  rounded-full
  font-bold tracking-tight
  shadow-[0_8px_20px_-8px_rgba(4,76,67,0.45)]
  transition-all duration-300 ease-out
  hover:-translate-y-0.5
  hover:shadow-[0_14px_28px_-10px_rgba(4,76,67,0.55)]
  active:scale-[0.99] active:translate-y-0
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
    <Select.Trigger className={`inline-flex items-center justify-between w-full gap-2 px-4 lg:px-5 py-3 rounded-full border border-gray-200/80 bg-white md:border-transparent md:bg-transparent text-gray-900 data-[placeholder]:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#056F5E]/50 shadow-sm md:shadow-none font-medium ${manrope.className} tracking-tight transition-all duration-200 hover:border-[#056F5E]/40 md:hover:border-transparent md:hover:bg-gray-100/70 ${triggerClassName}`}>
      <Select.Value placeholder={placeholder} />
      <Select.Icon>
        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
      </Select.Icon>
    </Select.Trigger>
    
    <Select.Portal>
      <Select.Content 
        position="popper" 
        sideOffset={5} 
        className={`z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_16px_40px_-12px_rgba(4,76,67,0.18),0_2px_8px_rgba(0,0,0,0.04)] animate-in fade-in zoom-in-95 duration-200 ${manrope.className}`}
      >
        <Select.Viewport className="p-1">
          {options.map((opt) => (
            <Select.Item
              key={opt}
              value={opt}
              className="group flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-gray-700 select-none data-[highlighted]:bg-[#056F5E]/[0.08] data-[highlighted]:text-[#056F5E] cursor-pointer outline-none transition-colors"
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
  return queryString ? `/buy-property-in-gandhinagar-gujarat?${queryString}` : '/buy-property-in-gandhinagar-gujarat';
  };

  return (
    <section className={`relative bg-white flex flex-col ${manrope.className}`}>
      
      {/* === ANIMATION STYLES === */}
      <style jsx global>{`
        @keyframes premiumRise {
          0% { opacity: 0; transform: translateY(16px); filter: blur(3px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-rise { opacity: 0; animation: premiumRise 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .delay-100 { animation-delay: 0.15s; }
        .delay-200 { animation-delay: 0.3s; }
        .delay-300 { animation-delay: 0.45s; }
      `}</style>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-8 mt-6 md:mt-6 relative z-10">
        <div className="relative h-[620px] sm:h-[560px] md:h-[460px] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-[0_30px_60px_-25px_rgba(4,76,67,0.35)]">

          {/* Background */}
          {/* Original green background - commented out */}
          {/* <div className="absolute inset-0 bg-[#056F5E]" /> */}
          {/* <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/5 pointer-events-none" /> */}
          
          {/* Dark teal green background with soft light source & vignette for depth */}
          <div className="absolute inset-0 bg-[#044c43]" />
          <div className="absolute inset-0 bg-[radial-gradient(110%_130%_at_82%_-20%,rgba(52,211,153,0.16),transparent_55%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(100%_120%_at_0%_115%,rgba(0,0,0,0.32),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] ring-1 ring-inset ring-white/10 pointer-events-none" />

          {/* TEXT BLOCK */}
          <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-start pt-8 sm:pt-10 md:justify-center md:pt-0 md:pb-24 px-5 sm:px-8 md:px-16 lg:px-24 z-10 text-white max-w-4xl">
            <h1 className="animate-rise text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-3 md:mb-4 drop-shadow-sm leading-[1.08] md:leading-[1.05]">
              Gandhinagar<span className="text-emerald-300">Homes</span>.com
            </h1>
            <p className="animate-rise delay-100 text-xs sm:text-sm md:text-base font-semibold tracking-[0.2em] text-emerald-200/90 mb-6 uppercase">
             Where every property will find its next owner.
            </p>
            <p className="animate-rise delay-200 text-base md:text-lg text-emerald-50/85 leading-relaxed max-w-xl hidden md:block font-normal">
              Your trusted platform dedicated exclusively to <span className="text-white font-semibold underline decoration-emerald-300/50 decoration-2 underline-offset-[6px]">Resale Properties</span> in Gandhinagar.
              We connect home sellers with genuine buyers & help every home find its perfect match
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-3 sm:px-4 pb-4 sm:pb-6 animate-rise delay-300">
            <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-[1.75rem] md:rounded-full shadow-[0_16px_45px_-12px_rgba(2,44,38,0.35)] p-3 sm:p-3 md:p-2 border border-white/60 ring-1 ring-black/5">

              <div className="flex flex-col md:flex-row md:items-stretch gap-2 md:gap-0">

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
                <div className="w-full md:flex-1 min-w-0 md:border-l md:border-gray-200/70">
                  <Dropdown
                    placeholder="Type"
                    options={["Apartment", "Tenement", "Bungalow", "Penthouse", "Plot", "Shop", "Office"]}
                    value={propertyType}
                    onValueChange={setPropertyType}
                  />
                </div>

                {/* 3. BUDGET */}
                <div className="w-full md:flex-1 min-w-0 md:border-l md:border-gray-200/70">
                  <Dropdown
                    placeholder="Budget"
                    options={["₹0 - ₹50 Lakhs", "₹50L - ₹1 Cr", "₹1 Cr - ₹1.5 Cr", "Above ₹1.5 Cr"]}
                    value={budget}
                    onValueChange={setBudget}
                  />
                </div>

                {/* 4. AGE OF PROPERTY (REPLACED POSSESSION) */}
                <div className="w-full md:flex-1 min-w-0 md:border-l md:border-gray-200/70">
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
                  className={`${BUTTON_BASE_CLASSES} w-full md:w-auto md:ml-2 flex-shrink-0 flex items-center justify-center`}
                >
                  Search
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* === CTA BUTTONS === */}
      <div className="bg-white py-10 md:py-12 px-4 flex justify-center animate-rise delay-300">
        <div className="bg-white rounded-[2.5rem] px-5 sm:px-8 py-5 sm:py-6 border border-gray-100 shadow-[0_12px_36px_-14px_rgba(4,76,67,0.16)] transition-shadow duration-300 hover:shadow-[0_18px_44px_-14px_rgba(4,76,67,0.24)] w-full max-w-sm sm:max-w-none sm:w-auto">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">

            <Link href="/buy-property-in-gandhinagar-gujarat" className={`w-full sm:w-auto text-center flex-shrink-0 ${BUTTON_BASE_CLASSES} !px-10 sm:!px-12 !py-4`}>
              Buy Property
            </Link>

            <Link href="/sell-property-in-gandhinagar-gujarat/form" className={`w-full sm:w-auto text-center flex-shrink-0 ${BUTTON_BASE_CLASSES} !px-10 sm:!px-12 !py-4`}>
              Sell Property
            </Link>

          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;