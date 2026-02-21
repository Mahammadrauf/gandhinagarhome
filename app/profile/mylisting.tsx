"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Mock data for properties
const mockProperties: Record<string, any> = {
  "1": {
    id: "1",
    title: "Luxury 3BHK Apartment in Raysan",
    status: "Active",
    price: 5500000,
    propertyType: "Apartment",
    bedrooms: "3",
    bathrooms: "2",
    balcony: "2",
    parking: "2",
    furnishing: "Semi-furnished",
    propertyAge: "3–6 Years Old",
    propertySize: "1250",
    propertySizeUnit: "sq ft",
    city: "Gandhinagar",
    locality: "Raysan",
    mobile: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "seller@example.com",
    images: [
      "https://via.placeholder.com/600x400?text=Property+View+1",
      "https://via.placeholder.com/600x400?text=Bedroom",
      "https://via.placeholder.com/600x400?text=Kitchen",
      "https://via.placeholder.com/600x400?text=Balcony",
    ],
    hasSaleDeed: true,
    hasBrochure: true,
    createdAt: "2025-12-15",
    totalViews: 324,
    totalEnquiries: 12,
  },
  "2": {
    id: "2",
    title: "2BHK Apartment in Sargasan",
    status: "Pending",
    price: 3200000,
    propertyType: "Apartment",
    bedrooms: "2",
    bathrooms: "1",
    balcony: "1",
    parking: "1",
    furnishing: "Unfurnished",
    propertyAge: "1–3 Years Old",
    propertySize: "950",
    propertySizeUnit: "sq ft",
    city: "Gandhinagar",
    locality: "Sargasan",
    mobile: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "seller@example.com",
    images: [
      "https://via.placeholder.com/600x400?text=Property+View+2",
      "https://via.placeholder.com/600x400?text=Room+2",
    ],
    hasSaleDeed: true,
    hasBrochure: false,
    createdAt: "2025-11-20",
    totalViews: 156,
    totalEnquiries: 5,
  },
  "3": {
    id: "3",
    title: "4BHK Villa in Koba",
    status: "Sold",
    price: 8900000,
    propertyType: "Bungalow",
    bedrooms: "4",
    bathrooms: "3",
    balcony: "2",
    parking: "3",
    furnishing: "Fully furnished",
    propertyAge: "New Property",
    propertySize: "2100",
    propertySizeUnit: "sq ft",
    city: "Gandhinagar",
    locality: "Koba",
    mobile: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "seller@example.com",
    images: [
      "https://via.placeholder.com/600x400?text=Villa+View",
    ],
    hasSaleDeed: true,
    hasBrochure: true,
    createdAt: "2025-09-10",
    totalViews: 892,
    totalEnquiries: 38,
  },
};

export default function MyListingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const property = mockProperties[id];
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#f3fbf7] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-[#0b6b53] text-white rounded-lg font-semibold hover:bg-[#095244]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/sell/form?mode=edit&id=${id}`);
  };

  const handleBoost = () => {
    alert("Boost listing feature coming soon!");
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    alert("Listing deleted successfully!");
    router.push("/profile");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 border border-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "Sold":
        return "bg-gray-100 text-gray-700 border border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  const formatPrice = (price: number): string => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen bg-[#f3fbf7]">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="mb-4 text-[#0b6b53] font-semibold text-sm hover:underline"
          >
            ← Back to My Listings
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
                <p className="text-gray-600 text-sm">
                  {property.city} • {property.locality}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-[#0b6b53] text-white rounded-lg font-semibold text-sm hover:bg-[#095244] transition"
              >
                Edit Listing
              </button>
              <button
                onClick={handleBoost}
                className="px-4 py-2 border border-[#0b6b53] text-[#0b6b53] rounded-lg font-semibold text-sm hover:bg-[#f1faf6] transition"
              >
                Boost Listing
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={property.images[0]}
                  alt="Property main view"
                  className="w-full h-full object-cover"
                />
              </div>
              {property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {property.images.slice(1).map((img: string, idx: number) => (
                    <div key={idx} className="aspect-square bg-gray-200 rounded overflow-hidden cursor-pointer hover:opacity-80">
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {property.images.length > 5 && (
                    <div className="aspect-square bg-gray-300 rounded flex items-center justify-center text-gray-700 font-semibold">
                      +{property.images.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Property Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Type</label>
                  <p className="text-lg font-semibold text-gray-900">{property.propertyType}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Bedrooms</label>
                  <p className="text-lg font-semibold text-gray-900">{property.bedrooms}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Bathrooms</label>
                  <p className="text-lg font-semibold text-gray-900">{property.bathrooms}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Balcony</label>
                  <p className="text-lg font-semibold text-gray-900">{property.balcony}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Parking</label>
                  <p className="text-lg font-semibold text-gray-900">{property.parking}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Furnishing</label>
                  <p className="text-lg font-semibold text-gray-900">{property.furnishing}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Property Age</label>
                  <p className="text-lg font-semibold text-gray-900">{property.propertyAge}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Size</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {property.propertySize} {property.propertySizeUnit}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Price</label>
                  <p className="text-lg font-semibold text-[#0b6b53]">{formatPrice(property.price)}</p>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            {(property.hasSaleDeed || property.hasBrochure) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>
                <div className="space-y-3">
                  {property.hasSaleDeed && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0b6b53] rounded flex items-center justify-center">
                          <span className="text-white text-lg">📄</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Sale Deed</p>
                          <p className="text-xs text-gray-500">Verification document</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-[#0b6b53] font-semibold text-sm border border-[#0b6b53] rounded hover:bg-[#f1faf6]">
                        View
                      </button>
                    </div>
                  )}
                  {property.hasBrochure && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0b6b53] rounded flex items-center justify-center">
                          <span className="text-white text-lg">📋</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Brochure</p>
                          <p className="text-xs text-gray-500">Property brochure</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-[#0b6b53] font-semibold text-sm border border-[#0b6b53] rounded hover:bg-[#f1faf6]">
                        View
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Your Contact Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Mobile</label>
                  <p className="text-gray-900 font-semibold">{property.mobile}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">WhatsApp</label>
                  <p className="text-gray-900 font-semibold">{property.whatsapp}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Email</label>
                  <p className="text-gray-900 font-semibold break-all">{property.email}</p>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Performance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-blue-700">{property.totalViews}</p>
                  </div>
                  <span className="text-3xl">👁️</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Total Enquiries</p>
                    <p className="text-2xl font-bold text-green-700">{property.totalEnquiries}</p>
                  </div>
                  <span className="text-3xl">💬</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Created Date</p>
                    <p className="text-lg font-bold text-amber-700">{property.createdAt}</p>
                  </div>
                  <span className="text-3xl">📅</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Delete Listing?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
