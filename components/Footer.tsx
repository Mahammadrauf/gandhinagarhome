import React from 'react';
// --- ADDED MapPin, Mail, and Phone ---
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  MapPin, 
  Mail, 
  Phone 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t-2 border-primary/20 py-12 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary-light rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800">About GandhinagarHomes</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Buy</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Sell</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
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
              {/* --- MODIFIED --- */}
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </span>
                <span><strong className="text-gray-800">Address:</strong> 201, Premium Plaza, Sargasan Cross Rd, Gandhinagar</span>
              </li>
              {/* --- MODIFIED --- */}
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <span><strong className="text-gray-800">Email:</strong> hello@gandhinagarhomes.in</span>
              </li>
              {/* --- MODIFIED --- */}
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 flex-shrink-0">
                  <Phone className="w-4 h-4" />
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