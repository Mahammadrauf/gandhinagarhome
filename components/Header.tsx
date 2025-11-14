import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

// A reusable component for the navigation links
const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <Link href={href}>
    <span className="relative group text-gray-800 font-semibold text-sm hover:text-primary transition-colors py-2 inline-block">
      {/* This span holds the text */}
      <span>{children}</span>
      
      {/* --- THIS IS THE NEW UNDERLINE --- */}
      <span 
        className="absolute bottom-0 left-0 h-0.5 w-full bg-primary 
                   transform scale-x-0 group-hover:scale-x-100 
                   transition-transform duration-300 ease-out origin-left"
      ></span>
      {/* ---------------------------------- */}
    </span>
  </Link>
);

const Header = () => {
  return (
    <header className="bg-gray-50 sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Home className="w-6 h-6 text-gray-800" strokeWidth={2.5} />
            <span className="text-base font-bold text-gray-800">GandhinagarHomes</span>
          </div>

          {/* Navigation - Right Aligned */}
          <div className="hidden md:flex items-center gap-6">
            {/* I've replaced your <a> tags with the new NavLink component */}
            <nav className="flex items-center gap-6">
              <NavLink href="/">Home</NavLink>
              <NavLink href="#">Buy</NavLink>
              <NavLink href="/sell">Sell</NavLink>
              <NavLink href="#">About Us</NavLink>
              <NavLink href="#">Contact Us</NavLink>
            </nav>
            {/* Sign In Button */}
            <button className="bg-primary px-6 py-2.5 rounded-full text-white font-semibold text-sm hover:bg-primary-dark transition-colors flex-shrink-0 ml-4">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;