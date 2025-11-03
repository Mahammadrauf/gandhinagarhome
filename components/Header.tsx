import React from 'react';
import { Home } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-50 sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-10xl mx-auto px-4 py-4 lg:px-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
              <Home className="w-5 h-5 text-gray-800" strokeWidth={2} />
            </span>
            <span className="text-xl font-semibold text-gray-900">GandhinagarHomes</span>
          </div>


          {/* Navigation - Right Aligned */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-8">
              <a href="#" className="text-gray-900 font-medium text-base hover:text-primary transition-colors">Home</a>
              <a href="#" className="text-gray-900 font-medium text-base hover:text-primary transition-colors">Buy</a>
              {/* <a href="#" className="text-gray-900 font-medium text-base rounded-full px-6 py-2 border border-gray-200 bg-white shadow-sm">Sell</a> */}
              <a href="#" className="text-gray-900 font-medium text-base hover:text-primary transition-colors">Sell</a>
              <a href="#" className="text-gray-900 font-medium text-base hover:text-primary transition-colors">About Us</a>
              <a href="#" className="text-gray-900 font-medium text-base hover:text-primary transition-colors">Contact Us</a>
            </nav>

            {/* Sign In Button */}
            <button className="bg-primary px-7 py-3 rounded-xl text-white font-semibold text-base hover:bg-primary-dark transition-colors ml-6">
              Sign In
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

