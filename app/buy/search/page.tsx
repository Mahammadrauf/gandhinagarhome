"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { Search, MapPin, Home, DollarSign, Filter } from "lucide-react";

export default function BuySearchPage() {
  const [filters, setFilters] = useState({
    location: "",
    priceMin: "",
    priceMax: "",
    propertyType: "All",
    bedrooms: "All",
  });

  // Mock listings data
  const mockListings = [
    {
      id: 1,
      title: "Modern 3BHK Apartment in Kudasan",
      location: "Kudasan, Gandhinagar",
      price: "₹85,00,000",
      bedrooms: 3,
      bathrooms: 2,
      area: "1200 sqft",
      image: "https://via.placeholder.com/300x200?text=Property+1",
    },
    {
      id: 2,
      title: "Spacious Villa near Sargasan",
      location: "Sargasan, Gandhinagar",
      price: "₹1,20,00,000",
      bedrooms: 4,
      bathrooms: 3,
      area: "2000 sqft",
      image: "https://via.placeholder.com/300x200?text=Property+2",
    },
    {
      id: 3,
      title: "Cozy 2BHK in City Center",
      location: "City Center, Gandhinagar",
      price: "₹55,00,000",
      bedrooms: 2,
      bathrooms: 1,
      area: "900 sqft",
      image: "https://via.placeholder.com/300x200?text=Property+3",
    },
    {
      id: 4,
      title: "Plot near Main Road",
      location: "Main Road, Gandhinagar",
      price: "₹35,00,000",
      bedrooms: 0,
      bathrooms: 0,
      area: "1500 sqft",
      image: "https://via.placeholder.com/300x200?text=Property+4",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="container mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Location (Kudasan, Sargasan...)"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Min Price"
              value={filters.priceMin}
              onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
              className="px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Max Price"
              value={filters.priceMax}
              onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
              className="px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
              className="px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>All Types</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Plot</option>
              <option>Penthouse</option>
            </select>
            <button className="px-6 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-all">
              <Search className="w-5 h-5 inline mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{mockListings.length} Properties Found</h2>
            <p className="text-sm text-gray-600">Browse verified listings in Gandhinagar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Image */}
                <div className="h-40 bg-gray-200 overflow-hidden">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>

                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    {listing.location}
                  </div>

                  <div className="flex items-center gap-1 text-lg font-bold text-primary mb-3">
                    <DollarSign className="w-5 h-5" />
                    {listing.price}
                  </div>

                  <div className="flex gap-3 mb-4 text-sm text-gray-700">
                    {listing.bedrooms > 0 && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                        <Home className="w-4 h-4" /> {listing.bedrooms} BHK
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                      {listing.area}
                    </span>
                  </div>

                  <button className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-all">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
