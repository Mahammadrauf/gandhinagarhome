// app/sell/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function SellIntroPage() {
  const [userRole, setUserRole] = useState<'buyer' | 'seller' | ''>('');

  useEffect(() => {
    const savedUser = localStorage.getItem('gh_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.isLoggedIn) {
          setUserRole(parsedUser.role || '');
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleStartListing = (e: React.MouseEvent) => {
    if (userRole === 'buyer' || userRole === '') {
      e.preventDefault();
      alert("You can't sell properties as you are logged in as buyer/user");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Header />

      <section className="w-full flex items-center justify-center py-16">
        <div className="container mx-auto px-4">

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col lg:flex-row items-center gap-6 p-6 lg:p-8 animate-card-in">

            {/* LEFT SIDE */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight animate-fade-up">
                Sell your Gandhinagar property with confidence
              </h1>

              <p className="mt-3 text-slate-600 max-w-xl text-sm sm:text-base animate-fade-up delay-75">
                One simple form. Verified local buyers. No broker spam.
                Get the best offer without wasting time.
              </p>
            </div>

            {/* RIGHT SIDE CTA */}
            <div className="flex-shrink-0 w-full sm:w-auto text-center lg:text-right">
              <Link
                href="/sell/form"
                onClick={handleStartListing}
                className="inline-flex items-center justify-center px-8 py-4 text-lg rounded-full bg-gradient-to-r from-[#0b6b53] to-[#085341] text-white font-bold shadow-xl hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 ease-in-out animate-cta-in relative group overflow-hidden"
              >
                <span className="relative z-10">Start Listing Now</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </Link>
            </div>
          </div>

          {/* TRUST & VALUE CHIPS */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

            {/* Chip 1 */}
            <div className="bg-gradient-to-br from-[#0b6b53]/5 via-[#0b6b53]/10 to-white rounded-xl p-6 shadow-md border border-[#0b6b53]/15 animate-chip-in group cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-300 transform-gpu hover:-translate-y-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-[#0b6b53]">
                Verified buyers
              </div>
              <div className="text-xl font-bold text-slate-900 mt-2">Quality leads only</div>
              <p className="text-slate-700 text-sm mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                Every enquiry is screened so you only talk to genuine buyers.
              </p>
            </div>

            {/* Chip 2 */}
            <div className="bg-gradient-to-br from-[#0b6b53]/5 via-slate-50 to-white rounded-xl p-6 shadow-md border border-slate-200 animate-chip-in delay-75 group cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-300 transform-gpu hover:-translate-y-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-[#0b6b53]">
                Gandhinagar focus
              </div>
              <div className="text-xl font-bold text-slate-900 mt-2">Built for this city</div>
              <p className="text-slate-700 text-sm mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                Hyper-local buyers and insights from top sectors & societies.
              </p>
            </div>

            {/* Chip 3 */}
            <div className="bg-gradient-to-br from-[#0b6b53]/5 via-emerald-50 to-white rounded-xl p-6 shadow-md border border-emerald-100 animate-chip-in delay-150 group cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-300 transform-gpu hover:-translate-y-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700/90">
                Privacy first
              </div>
              <div className="text-xl font-bold text-slate-900 mt-2">Your data stays safe</div>
              <p className="text-slate-700 text-sm mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                We never display your phone number publicly. You stay in control.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Animations */}
      <style jsx>{`
        .animate-card-in {
          animation: cardIn 520ms cubic-bezier(.2,.9,.3,1) both;
        }
        .animate-fade-up {
          animation: fadeUp 420ms ease both;
        }
        .animate-chip-in {
          animation: chipIn 600ms cubic-bezier(.15,.9,.3,1) both;
        }
        .animate-cta-in {
          animation: ctaIn 520ms cubic-bezier(.15,.9,.3,1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(8px) scale(.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes chipIn {
          0% { opacity: 0; transform: translateY(20px) scale(.9); }
          50% { opacity: .7; transform: translateY(-5px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
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