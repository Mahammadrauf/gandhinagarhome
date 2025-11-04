"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

const FeaturedProperties = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 0);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const properties = [
    {
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
      price: '₹2.1 Cr',
      location: 'Sargasan',
      beds: 4,
      baths: 4,
      sqft: '3,000',
      features: ['Vaastu-friendly', '2 Car Parks'],
      tag: { text: 'New', color: 'bg-primary text-white' },
    },
    {
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      price: '₹1.65 Cr',
      location: 'Kudasan',
      beds: 3,
      baths: 3,
      sqft: '1,950',
      features: ['Club Access', 'High Floor'],
      tag: { text: 'Exclusive', color: 'bg-yellow-500 text-white' },
    },
    {
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      price: '₹2.45 Cr',
      location: 'Randesan',
      beds: 3,
      baths: 3,
      sqft: '2,250',
      features: ['Garden View', 'Modular Kitchen'],
      tag: { text: 'Open House', color: 'bg-gray-200 text-gray-800' },
    },
    {
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      price: '₹3.10 Cr',
      location: 'Sector 21',
      beds: 4,
      baths: 4,
      sqft: '3,500',
      features: ['Private Pool', 'Premium Location'],
      tag: { text: 'Private', color: 'bg-purple-500 text-white' },
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      price: '₹1.85 Cr',
      location: 'Sector 16',
      beds: 3,
      baths: 2,
      sqft: '2,100',
      features: ['City View', 'Ready to Move'],
      tag: { text: 'Hot Deal', color: 'bg-red-500 text-white' },
    },
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      price: '₹2.75 Cr',
      location: 'Sector 7',
      beds: 4,
      baths: 3,
      sqft: '2,800',
      features: ['Corner Plot', 'Premium Finishes'],
      tag: { text: 'Premium', color: 'bg-primary text-white' },
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80',
      price: '₹1.45 Cr',
      location: 'Sector 12',
      beds: 2,
      baths: 2,
      sqft: '1,600',
      features: ['Compact Design', 'Park Facing'],
      tag: { text: 'Affordable', color: 'bg-green-500 text-white' },
    },
    {
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      price: '₹3.50 Cr',
      location: 'Sector 5',
      beds: 5,
      baths: 4,
      sqft: '4,200',
      features: ['Luxury Villa', 'Private Garden'],
      tag: { text: 'Luxury', color: 'bg-purple-600 text-white' },
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative">
      {/* Subtle decorative line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Featured Properties</h2>
          <p className="text-gray-600 text-lg">Curated interiors from Gandhinagar's finest homes.</p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary-light mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="relative">
          {/* Left gradient fade */}
          
          {/* Right gradient fade */}
          
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#006D5B #f3f4f6' }}>
            {properties.map((property, index) => (
              <div
                key={index}
                className="group flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.location}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${property.tag.color}`}>
                    {property.tag.text}
                  </div>
                  {/* Price badge on image */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
                    <span className="text-lg font-bold text-primary">{property.price}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
                        {property.location}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {property.beds} bd
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                      {property.baths} ba
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      {property.sqft} sq ft
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.features.map((feature, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-2.5 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Prev/Next scroll buttons */}
          {canScrollPrev && (
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollByAmount(-320)}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollByAmount(320)}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;

