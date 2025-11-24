'use client';

import React from 'react';
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
const BRAND_TEXT = `text-[${BRAND_HEX}]`;

// New "Really Good" Hover Effect Definition
// 1. Base Green -> Brighter Green on hover
// 2. lift & scale up
// 3. Deep, soft colored shadow that expands on hover
const BUTTON_BASE_CLASSES = `
  group
  relative
  ${BRAND_GREEN}
  hover:bg-[#068a75] /* Slightly brighter/more energetic green on hover */
  text-white 
  px-12 py-4 
  rounded-full 
  font-bold tracking-tight 
  shadow-[0_10px_20px_-10px_rgba(5,111,94,0.5)] /* Nice base colored shadow */
  transition-all duration-300 ease-out
  hover:scale-105
  hover:-translate-y-1
  hover:shadow-[0_20px_35px_-15px_rgba(5,111,94,0.6)] /* Expansive shadow on hover */
  active:scale-[0.98] active:translate-y-0 /* Satisfying click press */
`;


const Dropdown = ({ placeholder, options }: { placeholder: string; options: string[] }) => (
  <Select.Root>
    <Select.Trigger className={`inline-flex items-center justify-between gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#056F5E] min-w-[12rem] shadow-sm font-medium ${manrope.className} tracking-tight transition-all hover:border-[#056F5E]/50`}>
      <Select.Value placeholder={placeholder} />
      <Select.Icon>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className={`z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${manrope.className}`}>
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
      <div className="container mx-auto px-4 md:px-8 mt-2 md:-mt-4 relative z-10">
        <div className="relative h-[360px] md:h-[420px] overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-2xl">

          {/* Background */}
          <div className="absolute inset-0 bg-[#056F5E]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/5 pointer-events-none" />

          {/* TEXT BLOCK */}
          <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-start pt-8 md:pt-10 px-6 md:px-24 z-10 text-white max-w-4xl">
            <h1 className="animate-rise text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-3 drop-shadow-sm leading-[1.1]">
              Gandhinagar<span className="text-emerald-300">Homes</span>.com
            </h1>
            <p className="animate-rise delay-100 text-sm md:text-xl font-bold tracking-[0.15em] text-emerald-100 mb-6 uppercase drop-shadow-sm">
              Where every property finds its owner
            </p>
            <p className="animate-rise delay-200 text-base md:text-lg text-emerald-50 leading-relaxed max-w-xl hidden md:block font-medium opacity-90 mb-10">
              Your trusted platform dedicated exclusively to <span className="text-white font-bold border-b border-white/30 pb-0.5">Resale Properties</span> in Gandhinagar. 
              We connect home sellers with genuine buyers seamlessly.
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-6 animate-rise delay-300">
            <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2.5 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-2">
                <input type="text" placeholder="Location (e.g. Sargasan, Kudasan...)" className="flex-1 px-6 py-3 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#056F5E] focus:bg-white transition-all text-gray-800 placeholder-gray-400 font-semibold tracking-tight" />
                <div className="hidden md:flex gap-2">
                  <Dropdown placeholder="Property Type" options={["Apartment","Villa","Plot","Penthouse"]} />
                  <Dropdown placeholder="Price Range" options={["Under ₹50 Lakhs","₹50L - ₹1 Cr","₹1 Cr - ₹2 Cr","Above ₹2 Cr"]} />
                  <Dropdown placeholder="Possession" options={["Ready to Move","Under Construction"]} />
                </div>
                {/* Search button uses the same new premium style */}
                <Link href="/buy" className={`${BUTTON_BASE_CLASSES} !px-8 !py-3 flex-shrink-0`}>
                  Search
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* === UPDATED CTA BUTTONS === */}
      <div className="bg-white py-10 flex justify-center animate-rise delay-300">
        {/* Added a subtle hover glow to the container itself */}
        <div className="bg-white rounded-[2.5rem] px-8 py-5 border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-shadow hover:shadow-[0_20px_50px_-10px_rgba(5,111,94,0.15)] inline-flex">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            
            {/* Buy Button - Solid Green with new hover effect */}
            <Link href="/buy" className={`inline-block ${BUTTON_BASE_CLASSES}`}>
              Buy Property
            </Link>
            
            {/* Sell Button - Now ALSO Solid Green with same effect */}
            <Link href="/sell" className={`inline-block ${BUTTON_BASE_CLASSES}`}>
              Sell Property
            </Link>

          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;