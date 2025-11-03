import React from 'react';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t-2 border-primary/20 py-12 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
      
      <div className="max-w-10xl mx-auto px-4 relative z-10 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary-light rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800">About GandhinagarHomes</h3>
            </div>
            <p className="text-black-600 mb-6 leading-relaxed">
              Premium real estate in Gandhinagar with a client-first approach and deep local expertise.
            </p>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Follow Us</h4>
              <div className="flex gap-3">
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary-light/10 hover:from-primary hover:to-primary-dark text-gray-700 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary-light/10 hover:from-primary hover:to-primary-dark text-gray-700 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary-light/10 hover:from-primary hover:to-primary-dark text-gray-700 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary-light/10 hover:from-primary hover:to-primary-dark text-gray-700 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary-light rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800">Quick Links</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Buy</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Sell</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Blog</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary-light rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800">Contact Us</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-9 h-8 flex items-center justify-center rounded-full">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </span>

                <span><strong className="text-gray-800">Address:</strong> 201, Premium Plaza, Sargasan Cross Rd, Gandhinagar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-9 h-7 flex items-center justify-center rounded-full">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>

                  </svg>
                </span>
                <span><strong className="text-gray-800">Email:</strong> hello@gandhinagarhomes.in</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-9 h-7 flex items-center justify-center rounded-full">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.2.48 2.5.75 3.83.75a1 1 0 011 1v3.5a1 1 0 01-1 1C10.94 21 3 13.06 3 3.5a1 1 0 011-1H7.5a1 1 0 011 1c0 1.33.27 2.64.75 3.83a1 1 0 01-.27 1.11l-2.2 2.2z"/>

                  </svg>
                </span>
                <span><strong className="text-gray-800">Phone:</strong> +91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-600">
            &copy; 2024 <span className="text-primary font-semibold">GandhinagarHomes</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

