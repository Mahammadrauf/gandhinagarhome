'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { Home, Menu, X } from 'lucide-react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
  onClick?: () => void;
  mobile?: boolean;
}

// Custom Brand Color derived from your image
const BRAND_COLOR = "text-[#006A58]";
const BRAND_BG = "bg-[#006A58]";
const BRAND_HOVER_BG = "hover:bg-[#005445]"; // Slightly darker for hover
const BRAND_LIGHT_BG = "hover:bg-[#006A58]/10"; // Light tint for menu items

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick, mobile }) => {
  if (mobile) {
    return (
      <Link href={href} onClick={onClick} className="block w-full">
        <div className={`py-3 px-4 text-gray-600 ${BRAND_LIGHT_BG} hover:text-[#006A58] font-medium transition-colors rounded-lg`}>
          {children}
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="relative group py-2">
      <span className={`text-gray-600 font-medium text-sm group-hover:text-[#006A58] transition-colors`}>
        {children}
      </span>
      {/* Center-out Underline Animation with your Brand Color */}
      <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-[#006A58] transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
    </Link>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled || isMobileMenuOpen
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' 
            : 'bg-transparent py-5 border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2 flex-shrink-0 z-50">
              {/* Logo Icon Background matches your green theme */}
              <div className={`${BRAND_BG} p-1.5 rounded-lg text-white transition-transform group-hover:scale-110 duration-300`}>
                <Home className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className={`text-lg font-bold text-gray-800 tracking-tight group-hover:text-[#006A58] transition-colors`}>
                Gandhinagar<span className="text-[#006A58]">Homes</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-8">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/buy">Buy</NavLink>
                <NavLink href="/sell">Sell</NavLink>
                <NavLink href="/about">About Us</NavLink>
                <NavLink href="/contact">Contact Us</NavLink>
              </nav>

              {/* Sign In Button with Brand Green */}
              <button className={`${BRAND_BG} ${BRAND_HOVER_BG} text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg shadow-[#006A58]/20 hover:shadow-[#006A58]/40 active:scale-95 transform`}>
                Sign In
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col p-4 space-y-1">
            <NavLink mobile href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
            <NavLink mobile href="/buy" onClick={() => setIsMobileMenuOpen(false)}>Buy</NavLink>
            <NavLink mobile href="/sell" onClick={() => setIsMobileMenuOpen(false)}>Sell</NavLink>
            <NavLink mobile href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</NavLink>
            <NavLink mobile href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</NavLink>
            <div className="pt-4 mt-2 border-t border-gray-100">
              <button className={`w-full ${BRAND_BG} text-white py-3 rounded-lg font-semibold active:scale-95 transition-transform`}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Spacer */}
      <div className="h-20" /> 
    </>
  );
};

export default Header;