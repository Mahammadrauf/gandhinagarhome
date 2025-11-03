import React from 'react';
import Image from 'next/image';

const Dropdown = ({ label, options }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-left focus:outline-none transition-all hover:border-primary cursor-pointer ${open ? 'border-primary shadow-lg bg-white' : ''}`}
      >
        {selected}
        <span className="ml-2 inline-block align-middle">&#x25BC;</span>
      </button>
      {open && (
        <div className="absolute left-0 top-[100%] mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-30">
          {options.map((option, idx) => (
            <div
              key={option}
              className="px-6 py-3 cursor-pointer hover:bg-primary/10 transition-all text-gray-700"
              onMouseDown={() => { setSelected(option); setOpen(false); }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative bg-white min-h-screen flex flex-col">
      {/* Reduced Height Background Image Section */}
      <div className="container mx-auto px-4 md:px-8 mt-4 md:mt-6">
        <div className="relative h-[340px] md:h-[380px] overflow-hidden rounded-3xl border-2 border-gray-200">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80"
            alt="Property background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Text Overlay with Glassmorphism - Perfectly Centered */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 md:px-12 md:py-8 border border-white/20 shadow-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Gandhinagar Homes
            </h1>
            <p className="text-base md:text-lg text-white/95 max-w-2xl drop-shadow-md">
              Premium homes and a trusted selling experience — curated for Gandhinagar.
            </p>
          </div>
        </div>

        {/* Search Bar - At bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4">
          <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-2 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Location (Sargasan, Kudasan...)"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
              <select className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all">
                <option>Property Type</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Plot</option>
              </select>
              <select className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all">
                <option>Price Range</option>
                <option>Under ₹50 Lakhs</option>
                <option>₹50 Lakhs - ₹1 Cr</option>
                <option>₹1 Cr - ₹2 Cr</option>
                <option>Above ₹2 Cr</option>
              </select>
              <select className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all">
                <option>Possession</option>
                <option>Ready to Move</option>
                <option>Under Construction</option>
              </select>
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105">
                Search
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Compact CTA Buttons Section with Glassmorphism */}
      <div className="bg-white pt-2 pb-6 px-4 flex-1 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl px-4 py-4 md:px-6 md:py-4 border border-gray-200/50 shadow-xl inline-flex">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <button className="group bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-medium transition-all transform hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-primary-dark w-full md:w-auto">
              Buy Property
            </button>
            <button className="group bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-medium transition-all transform hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-primary-dark w-full md:w-auto">
              Sell Property
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

