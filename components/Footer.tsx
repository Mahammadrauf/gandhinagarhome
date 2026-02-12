import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

// --- INTERFACES ---
interface LinkItemProps {
  href: string;
  label: string;
}

interface SocialIconProps {
  Icon: React.ElementType;
  label: string;
  href?: string;
}

// --- HELPER COMPONENTS ---

const LinkItem: React.FC<LinkItemProps> = ({ href, label }) => (
  <li>
    <a 
      href={href} 
      className="group flex items-center gap-2 text-[15px] font-semibold text-black hover:text-[#006B5B] transition-all duration-300 py-1.5 hover:translate-x-1"
    >
      <span className="w-1 h-1 rounded-full bg-black group-hover:bg-[#006B5B] group-hover:w-2 transition-all duration-300" />
      {label}
    </a>
  </li>
);

LinkItem.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const SocialIcon: React.FC<SocialIconProps> = ({ Icon, label, href }) => {
  const isExternal = href && /^https?:\/\//i.test(href);
  return (
    <a
      href={href ?? '#'}
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-[#006B5B] hover:border-[#006B5B] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      <Icon size={18} />
    </a>
  );
};

SocialIcon.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
};

// --- MAIN COMPONENT ---

const Footer = () => {
  // --- DATA ---
  const bhkLinks = [
    { label: '1 BHK', href: '/buy?beds=1' },
    { label: '2 BHK', href: '/buy?beds=2' },
    { label: '3 BHK', href: '/buy?beds=3' },
    { label: '4 BHK', href: '/buy?beds=4' },
    { label: '5 BHK', href: '/buy?beds=5' },
    { label: '6 BHK', href: '/buy?beds=6' },
  ];

  const propertyTypeLinks = [
    { label: 'Apartment', href: '/buy?propertyType=apartment' },
    { label: 'Tenement', href: '/buy?propertyType=tenement' },
    { label: 'Bungalow', href: '/buy?propertyType=bungalow' },
    { label: 'Penthouse', href: '/buy?propertyType=penthouse' },
    { label: 'Plot', href: '/buy?propertyType=plot' },
    { label: 'Shop', href: '/buy?propertyType=shop' },
    { label: 'Office', href: '/buy?propertyType=office' },
  ];

  const gandhinagarLinks = [
    { label: 'Raysan', href: '/buy?city=gandhinagar&locality=raysan' },
    { label: 'Randesan', href: '/buy?city=gandhinagar&locality=randesan' },
    { label: 'Sargasan', href: '/buy?city=gandhinagar&locality=sargasan' },
    { label: 'Kudasan', href: '/buy?city=gandhinagar&locality=kudasan' },
    { label: 'Koba', href: '/buy?city=gandhinagar&locality=koba' },
    { label: 'Sectors', href: '/buy?city=gandhinagar&locality=sectors' },
  ];

  const ahmedabadLinks = [
    { label: 'Motera', href: '/buy?city=ahmedabad&locality=motera' },
    { label: 'Chandkheda', href: '/buy?city=ahmedabad&locality=chandkheda' },
    { label: 'Zundal', href: '/buy?city=ahmedabad&locality=zundal' },
    { label: 'Adalaj', href: '/buy?city=ahmedabad&locality=adalaj' },
    { label: 'Bhat', href: '/buy?city=ahmedabad&locality=bhat' },
    { label: 'Tapovan', href: '/buy?city=ahmedabad&locality=tapovan' },
    { label: 'Vaishnodevi', href: '/buy?city=ahmedabad&locality=vaishnodevi' },
  ];

  // --- STYLES ---
  const headingClass = "text-sm font-bold text-black border-l-[3px] border-[#006B5B] pl-3 mb-5 uppercase tracking-wide";
    
  return (
    <footer className="bg-white pt-16 pb-6 relative font-sans text-black border-t border-slate-100">
        
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#006B5B] via-[#4CC9F0] to-[#006B5B] opacity-90" />

      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-8 gap-y-12 mb-14">
          
          {/* 1. BRAND & SOCIAL */}
          <div className="col-span-2 md:col-span-1 xl:col-span-2 pr-4">
            <h3 className="text-2xl font-extrabold text-black mb-4 tracking-tight flex items-center gap-1">
              Gandhinagar<span className="text-[#006B5B]">Homes</span>
            </h3>
            <p className="text-xs leading-relaxed text-black font-medium mb-6 max-w-xs">
              Premium real estate ecosystem. We simplify buying, selling, and renting with deep local expertise.
            </p>
            
            <div className="flex gap-2">
              <SocialIcon Icon={Instagram} label="Instagram" href="https://www.instagram.com/buymyghar?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" />
              <SocialIcon Icon={Facebook} label="Facebook" />
              <SocialIcon Icon={Twitter} label="Twitter" />
              <SocialIcon Icon={Youtube} label="YouTube" />
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          <div>
            <h3 className={headingClass}>Quick Links</h3>
            <ul className="space-y-1">
              <LinkItem href="/buy" label="Buy Properties" />
              <LinkItem href="/sell" label="List Your Property" />
              <LinkItem href="/about" label="About Us" />
              <LinkItem href="/blog" label="Real Estate News" />
              <LinkItem href="/contact" label="Contact Support" />
            </ul>
          </div>

          {/* 3. BUY BY BHK */}
          <div>
            <h3 className={headingClass}>Buy by BHK</h3>
            <ul className="space-y-1">
              {bhkLinks.map((l) => <LinkItem key={l.href} {...l} />)}
            </ul>
          </div>

          {/* 4. PROPERTY TYPE */}
          <div>
            <h3 className={headingClass}>Property Type</h3>
            <ul className="space-y-1">
              {propertyTypeLinks.map((l) => <LinkItem key={l.href} {...l} />)}
            </ul>
          </div>

          {/* 5. GANDHINAGAR */}
          <div>
            <h3 className={headingClass}>Gandhinagar</h3>
            <ul className="space-y-1">
              {gandhinagarLinks.map((l) => <LinkItem key={l.href} href={l.href} label={l.label} />)}
            </ul>
          </div>

          {/* 6. AHMEDABAD */}
          <div>
            <h3 className={headingClass}>Ahmedabad</h3>
            <ul className="space-y-1">
              {ahmedabadLinks.map((l) => <LinkItem key={l.href} href={l.href} label={l.label} />)}
            </ul>
          </div>
        </div>

        {/* --- CONTACT STRIP --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 mb-10">
            <div className="group flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-[#006B5B]/30 hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#006B5B] group-hover:bg-[#006B5B] group-hover:text-white transition-colors duration-300">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Visit Us</h4>
                <p className="text-sm font-bold text-black group-hover:text-black">
                  414 , Pramukh Square, Sargasan , Gandhinagar.
                </p>
              </div>
            </div>

            <a href="mailto:hello@gandhinagarhomes.in" className="group flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-[#006B5B]/30 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#006B5B] group-hover:bg-[#006B5B] group-hover:text-white transition-colors duration-300">
                <Mail size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Email Us</h4>
                <p className="text-sm font-bold text-black group-hover:text-[#006B5B] transition-colors">
                  gandhinagar.homes@gmail.com
                </p>
              </div>
            </a>

            <a href="tel:+919876543210" className="group flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-[#006B5B]/30 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#006B5B] group-hover:bg-[#006B5B] group-hover:text-white transition-colors duration-300">
                <Phone size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Call Us</h4>
                <p className="text-sm font-bold text-black group-hover:text-[#006B5B] transition-colors">
                  +91 99982 74454
                </p>
              </div>
            </a>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-black font-semibold text-center md:text-left">
            &copy; {new Date().getFullYear()} <span className="text-black font-bold">GandhinagarHomes</span>. All rights reserved.
          </p>

          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {['Privacy Policy', 'Terms & Conditions', 'Sitemap', 'Disclaimer'].map((item) => (
              <li key={item}>
                <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-xs font-bold text-black hover:text-[#006B5B] transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#006B5B] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;