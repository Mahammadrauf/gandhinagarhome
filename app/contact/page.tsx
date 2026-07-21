"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactUs from "@/components/ContactUs";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Company Information Section */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Get in Touch</h1>
            <p className="text-lg text-gray-600">We're here to help you with any questions about buying, selling, or listing properties.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Company Details */}
            <div className="bg-gradient-to-br from-emerald-50 to-slate-50 rounded-2xl p-8 border border-emerald-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Company Name (Legal Entity)</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">Lux Realty</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Platform Name</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">Gandhinagar Homes</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Payment Gateway</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">CCAvenue</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 mt-6 border border-emerald-200">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Payment Services:</strong> Lux Realty processes payments <strong>exclusively for property listing services</strong> through our three plans:
                  </p>
                  <ul className="text-xs text-gray-700 space-y-1 ml-2">
                    <li>• Standard Plan: ₹299 (180 days)</li>
                    <li>• Featured Plan: ₹14,997 (30 featured + 150 standard days)</li>
                    <li>• Exclusive Plan: ₹19,997 (30 exclusive + 150 standard days)</li>
                  </ul>
                  <p className="text-xs text-gray-700 mt-3 font-semibold">
                    We do NOT accept payments for property sales, booking amounts, token amounts, advances, or any real estate transaction values.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Details */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Business Address</p>
                    <p className="text-gray-900 mt-1">
                      414, Pramukh Square<br />
                      Sargasan, Gandhinagar<br />
                      Gujarat, India - 382421
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
                      <Mail className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email</p>
                    <p className="text-gray-900 mt-1">
                      <a href="mailto:support@gandhinagarhomes.com" className="text-blue-600 hover:text-blue-700 font-semibold">
                        support@gandhinagarhomes.com
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
                      <Phone className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Phone Number</p>
                    <p className="text-gray-900 mt-1">
                      <a href="tel:[PHONE_NUMBER_PLACEHOLDER]" className="text-blue-600 hover:text-blue-700 font-semibold">
                        [PHONE_NUMBER_PLACEHOLDER]
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Business Hours</p>
                    <p className="text-gray-900 mt-1">
                      Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <ContactUs />
      <Footer />
    </main>
  );
}