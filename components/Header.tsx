import React from 'react';
import { Home } from 'lucide-react';

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
            <nav className="flex items-center gap-6">
              <a href="#" className="text-gray-800 font-semibold text-sm hover:text-primary transition-colors py-1">Home</a>
              <a href="#" className="text-gray-800 font-semibold text-sm hover:text-primary transition-colors py-1">Buy</a>
              <a href="#" className="text-gray-800 font-semibold text-sm hover:text-primary transition-colors py-1">Sell</a>
              <a href="#" className="text-gray-800 font-semibold text-sm hover:text-primary transition-colors py-1">About Us</a>
              <a href="#" className="text-gray-800 font-semibold text-sm hover:text-primary transition-colors py-1">Contact Us</a>
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

