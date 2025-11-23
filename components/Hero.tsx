import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dancing_Script, Playfair_Display } from 'next/font/google';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

// Fonts
const dancing = Dancing_Script({ subsets: ['latin'], weight: ['400','600','700'] }); 
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['600','700','800'] });

const Dropdown = ({ placeholder, options }: { placeholder: string; options: string[] }) => (
  <Select.Root>
    <Select.Trigger className="inline-flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary min-w-[12rem] shadow-sm">
      <Select.Value placeholder={placeholder} />
      <Select.Icon>
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl animate-pop">
        <Select.Viewport className="p-1">
          {options.map((opt) => (
            <Select.Item
              key={opt}
              value={opt}
              className="group flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-800 select-none data-[highlighted]:bg-gray-100 cursor-pointer"
            >
              <Select.ItemText>{opt}</Select.ItemText>
              <Select.ItemIndicator className="ml-auto text-primary">
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
    <section className="relative bg-white flex flex-col">

      <div className="container mx-auto px-4 md:px-8 mt-4 md:mt-6">
        <div className="relative h-[340px] md:h-[380px] overflow-hidden rounded-3xl border-2 border-gray-200">

          {/* ======= DARK GREEN BACKGROUND (instead of image) ======= */}
          <div className="absolute inset-0 bg-[#056F5E]" />

          {/* TEXT BLOCK */}
          <div className="absolute top-10 left-24 md:top-16 md:left-24 z-10 text-left text-white max-w-2xl drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] animate-rise-up">
            <h1 className={`${playfair.className} text-2xl md:text-4xl font-extrabold tracking-wide`}>
              GandhinagarHomes.com
            </h1>
            <p className="text-lg lg:text-2xl font-medium mt-2 mb-6">
              WHERE EVERY PROPERTY FINDS ITS NEXT OWNER.
            </p>
            <p className="text-base md:text-lg text-gray-100 leading-relaxed max-w-xl">
              Your Trusted Platform Dedicated Exclusively To <span className="font-semibold text-white">Resale</span> Properties In <span className="font-semibold text-white">Gandhinagar</span>. 
              We Connect Home Sellers With Genuine Buyers & Help Every Home Find Its Perfect Match.
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-3">
            <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-2 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-2">
                
                <input
                  type="text"
                  placeholder="Location (Sargasan, Kudasan...)"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                />

                <Dropdown placeholder="Property Type" options={["Apartment","Villa","Plot","Penthouse"]} />
                <Dropdown placeholder="Price Range" options={["Under ₹50 Lakhs","₹50L - ₹1 Cr","₹1 Cr - ₹2 Cr","Above ₹2 Cr"]} />
                <Dropdown placeholder="Possession" options={["Ready to Move","Under Construction","Resale"]} />

                <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105">
                  Search
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CTA BUTTONS */}
      <div className="bg-white py-12 flex justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl px-6 py-4 md:px-8 md:py-5 border border-gray-200/50 shadow-xl inline-flex">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Link
              href="/buy"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-medium transition-all transform hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-primary-dark"
            >
              Buy Property
            </Link>
            <Link
              href="/sell"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-primary-dark"
            >
              Sell Property
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
