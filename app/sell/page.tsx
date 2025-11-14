// app/sell/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Home, FileText, MapPin, Camera } from "lucide-react";

export default function SellIntroPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="w-full flex items-center justify-center py-16">
        <div className="container mx-auto px-4">
          {/* Main card - stays above the fold */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col lg:flex-row items-center gap-6 p-6 lg:p-8 animate-card-in">
            {/* Left: Headline + short copy */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight animate-fade-up">
                Sell your property — fast & simple
              </h1>
              <p className="mt-2 text-gray-600 max-w-xl animate-fade-up delay-75">
                Publish your listing in minutes. Add basic information, set specs, choose the location and upload photos — we’ll connect you with buyers.
              </p>

              {/* Compact step badges */}
              <div className="mt-4 flex flex-wrap gap-3 items-center">
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium shadow-sm animate-pop-in">
                  <Home className="w-4 h-4" /> Basic information
                </span>

                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium shadow-sm animate-pop-in delay-100">
                  <FileText className="w-4 h-4" /> Specification
                </span>

                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium shadow-sm animate-pop-in delay-200">
                  <MapPin className="w-4 h-4" /> Location
                </span>

                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium shadow-sm animate-pop-in delay-300">
                  <Camera className="w-4 h-4" /> Photos
                </span>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <Link
                href="/sell/form"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform duration-250 animate-cta-in"
              >
                Start Listing
              </Link>

              <div className="mt-3 text-sm text-gray-500 text-center sm:text-left">
                <span className="font-medium text-gray-700">4 quick steps</span> • Privacy protected
              </div>
            </div>
          </div>

          {/* Decorative mini info chips - small, above-fold */}
          <div className="mt-6 grid grid-cols-3 gap-4 items-center text-center lg:text-left">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 animate-chip-in">
              <div className="text-sm text-gray-500">Verified buyers</div>
              <div className="font-semibold text-gray-800 mt-1">Quality leads</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 animate-chip-in delay-75">
              <div className="text-sm text-gray-500">Local focus</div>
              <div className="font-semibold text-gray-800 mt-1">Gandhinagar only</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 animate-chip-in delay-150">
              <div className="text-sm text-gray-500">Secure</div>
              <div className="font-semibold text-gray-800 mt-1">Privacy controls</div>
            </div>
          </div>
        </div>
      </section>

      {/* Local animations and tiny responsive tweak */}
      <style jsx>{`
        .animate-card-in {
          transform-origin: center;
          animation: cardIn 520ms cubic-bezier(.2,.9,.3,1) both;
        }
        .animate-fade-up { animation: fadeUp 420ms ease both; }
        .animate-pop-in { animation: popIn 420ms cubic-bezier(.2,.9,.3,1) both; }
        .animate-chip-in { animation: chipIn 420ms ease both; }
        .animate-cta-in { animation: ctaIn 520ms cubic-bezier(.15,.9,.3,1) both; }

        .delay-75 { animation-delay: 75ms; }
        .delay-100 { animation-delay: 100ms; }
        .delay-150 { animation-delay: 150ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(8px) scale(.995); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: translateY(6px) scale(.98); }
          60% { opacity: 1; transform: translateY(-2px) scale(1.01); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes chipIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ctaIn {
          0% { opacity: 0; transform: translateY(8px) scale(.98); }
          70% { opacity: 1; transform: translateY(-2px) scale(1.02); }
          100% { transform: translateY(0) scale(1); }
        }

        @media (min-width: 1024px) {
          main { min-height: calc(100vh - 72px); }
        }
      `}</style>
    </main>
  );
}
