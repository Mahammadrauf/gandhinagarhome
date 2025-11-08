import React from 'react';
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

const Footer = () => {
  // Segments (match your ExploreListing filters)
  const bhkLinks = [
    { label: '2 BHK', href: '/listings?beds=2' },
    { label: '3 BHK', href: '/listings?beds=3' },
    { label: '4 BHK', href: '/listings?beds=4' },
    { label: '5 BHK', href: '/listings?beds=5' },
    { label: 'Bungalow', href: '/listings?category=bungalow' },
    { label: 'Plot', href: '/listings?category=plot' },
  ];

  // Locations (match your ExploreLocations/ExploreListing usage)
  const locationLinks = [
    { label: 'Koba, Gandhinagar', href: '/listings?loc=koba' },
    { label: 'Kudasan, Gandhinagar', href: '/listings?loc=kudasan' },
    { label: 'Randesan, Gandhinagar', href: '/listings?loc=randesan' },
    { label: 'Raysan, Gandhinagar', href: '/listings?loc=raysan' },
    { label: 'Sargasan, Gandhinagar', href: '/listings?loc=sargasan' },
  ];

  const baseLink =
    'text-gray-700 hover:text-primary transition-colors flex items-center gap-2 group';

  const bullet =
    'w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity';

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t-2 border-primary/20 py-12 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary-light rounded-full" />
              <h3 className="text-xl font-bold text-gray-800">About GandhinagarHomes</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Premium real estate in Gandhinagar with a client-first approach and deep local
              expertise.
            </p>

            <h4 className="font-semibold text-gray-800 mb-3">Follow Us</h4>
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

          {/* Quick Links (general) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary-light rounded-full" />
              <h3 className="text-xl font-bold text-gray-800">Quick Links</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <a href="/buy" className={baseLink}>
                  <span className={bullet} />
                  <span>Buy</span>
                </a>
              </li>
              <li>
                <a href="/sell" className={baseLink}>
                  <span className={bullet} />
                  <span>Sell</span>
                </a>
              </li>
              <li>
                <a href="/about" className={baseLink}>
                  <span className={bullet} />
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a href="/blog" className={baseLink}>
                  <span className={bullet} />
                  <span>Blog</span>
                </a>
              </li>
              <li>
                <a href="/contact" className={baseLink}>
                  <span className={bullet} />
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Buy by Type (segments) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary-light rounded-full" />
              <h3 className="text-xl font-bold text-gray-800">Buy by Type</h3>
            </div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {bhkLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={baseLink}>
                    <span className={bullet} />
                    <span>{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary-light rounded-full" />
              <h3 className="text-xl font-bold text-gray-800">Popular Locations</h3>
            </div>
            <ul className="space-y-3">
              {locationLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={baseLink}>
                    <span className={bullet} />
                    <span>{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a href="https://maps.google.com?q=Premium+Plaza+Sargasan+Cross+Road+Gandhinagar" target="_blank" rel="noopener noreferrer"
             className="flex items-start gap-3 text-gray-700 hover:text-primary transition-colors">
            <span className="text-primary mt-1 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </span>
            <span>
              <strong className="text-gray-800">Address:</strong> 201, Premium Plaza, Sargasan Cross Rd, Gandhinagar
            </span>
          </a>
          <a href="mailto:hello@gandhinagarhomes.in" className="flex items-start gap-3 text-gray-700 hover:text-primary transition-colors">
            <span className="text-primary mt-1 flex-shrink-0">
              <Mail className="w-5 h-5" />
            </span>
            <span>
              <strong className="text-gray-800">Email:</strong> hello@gandhinagarhomes.in
            </span>
          </a>
          <a href="tel:+919876543210" className="flex items-start gap-3 text-gray-700 hover:text-primary transition-colors">
            <span className="text-primary mt-1 flex-shrink-0">
              <Phone className="w-5 h-5" />
            </span>
            <span>
              <strong className="text-gray-800">Phone:</strong> +91 98765 43210
            </span>
          </a>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-center md:text-left">
            &copy; {new Date().getFullYear()} <span className="text-primary font-semibold">GandhinagarHomes</span>. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
            <li>
              <a href="/privacy" className="hover:text-primary">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms" className="hover:text-primary">Terms of Use</a>
            </li>
            <li>
              <a href="/sitemap.xml" className="hover:text-primary">Sitemap</a>
            </li>
            <li>
              <a href="/disclaimer" className="hover:text-primary">Disclaimer</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
