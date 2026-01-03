// app/sell/subscription/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { CheckCircle2, Star, Crown, Zap, ShieldCheck, ArrowRight } from "lucide-react";

// Salesman Strategy: 
// 1. Standard (10k) is the "Anchor"
// 2. Featured (13k) is the "Middle"
// 3. Exclusive (15k) is the "Winner"

const plans = [
  {
    id: "standard",
    name: "Standard",
    tagline: "Basic Visibility",
    price: "10,000",
    fullPrice: "12,500",
    icon: Zap,
    styles: {
      card: "bg-white border-slate-200 hover:border-[#0b6b53] hover:shadow-xl hover:shadow-[#0b6b53]/10 z-0",
      title: "text-slate-700",
      tag: "bg-slate-100 text-slate-600",
      price: "text-[#0b6b53]",
      button: "bg-white border-2 border-[#0b6b53] text-[#0b6b53] hover:bg-[#0b6b53] hover:text-white",
      iconBox: "bg-[#0b6b53]/10 text-[#0b6b53]",
      check: "text-[#0b6b53]"
    },
    features: [
      "Listed for 60 Days",
      "Visible in search results",
      "Standard Inquiry Form",
      "Basic Photo Gallery (5 Photos)",
      "Email Support"
    ],
    highlight: false
  },
  {
    id: "featured",
    name: "Featured",
    tagline: "High Velocity",
    price: "13,000",
    fullPrice: "16,000",
    icon: Star,
    styles: {
      card: "bg-cyan-50/30 border-cyan-200 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/10 z-10",
      title: "text-cyan-900",
      tag: "bg-cyan-100 text-cyan-700",
      price: "text-cyan-700",
      button: "bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg shadow-cyan-500/20",
      iconBox: "bg-cyan-100 text-cyan-600",
      check: "text-cyan-500"
    },
    features: [
      "Listed for 90 Days",
      "Top 5 Search Ranking",
      "Highlighted 'Featured' Tag",
      "Expanded Gallery (15 Photos)",
      "WhatsApp Direct Chat Link",
      "Weekly Performance Report"
    ],
    highlight: false
  },
  {
    id: "exclusive",
    name: "Exclusive",
    tagline: "Maximum Exposure",
    price: "15,000",
    fullPrice: "25,000",
    icon: Crown,
    styles: {
      // Reduced scale slightly from 1.05 to 1.03 to fit better
      card: "bg-[#fffbf0] border-amber-300 ring-4 ring-amber-400/20 shadow-2xl shadow-amber-500/20 scale-[1.02] z-20",
      title: "text-amber-900",
      tag: "bg-amber-100 text-amber-800",
      price: "text-amber-700",
      button: "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-xl shadow-amber-500/30 transform hover:-translate-y-1",
      iconBox: "bg-amber-100 text-amber-600",
      check: "text-amber-600 font-bold"
    },
    features: [
      "Everything in Featured",
      "Listed Until Sold (Lifetime)",
      "#1 Position on Homepage",
      "Professional Photoshoot Included",
      "Dedicated Relationship Manager",
      "Verified 'Exclusive' Gold Badge",
      "Social Media Promotion"
    ],
    highlight: true
  }
];

export default function SubscriptionPage() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* Reduced py-16 to py-8 to remove top whitespace */}
      <div className="container mx-auto px-4 py-8 lg:py-10">
        
        {/* Sales Header - Reduced margin bottom */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#0b6b53]/10 text-[#0b6b53] px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
            <ShieldCheck size={14} />
            Verified & Secure Listings
          </div>
          {/* Reduced text size slightly */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Sell Faster with Premium
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            94% of sellers who choose <span className="text-amber-600 font-bold">Exclusive</span> find a buyer within 30 days. Select a plan to unlock Gandhinagar's top buyers.
          </p>
        </div>

        {/* Dynamic Plans Grid - Reduced Max Width to 6xl and gap to make boxes smaller */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto items-end">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isHovered = hoveredPlan === plan.id;
            
            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                // Reduced padding from p-8 to p-6
                className={`relative rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col h-full ${plan.styles.card} ${isHovered && !plan.highlight ? '-translate-y-2' : ''}`}
              >
                {/* "Best Value" Badge */}
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-full text-center">
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest shadow-lg uppercase flex items-center justify-center gap-2 w-fit mx-auto">
                      <Crown size={12} fill="currentColor" />
                      Best Value
                    </span>
                  </div>
                )}

                {/* Card Header */}
                <div className="mb-5">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className={`text-xl font-bold ${plan.styles.title}`}>
                                {plan.name}
                            </h3>
                            <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${plan.styles.tag}`}>
                                {plan.tagline}
                            </span>
                        </div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.styles.iconBox}`}>
                            <Icon size={20} strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-baseline gap-2">
                        {/* Reduced price size */}
                        <span className={`text-3xl font-extrabold tracking-tight ${plan.styles.price}`}>
                            ₹{plan.price}
                        </span>
                        <span className="text-slate-400 text-sm line-through decoration-slate-300">
                            ₹{plan.fullPrice}
                        </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1 font-medium">One-time listing fee</p>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-slate-200 mb-5"></div>

                {/* Features List - Reduced spacing */}
                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className={`${plan.styles.check} shrink-0 mt-0.5`} />
                      <span className={`text-sm font-medium leading-tight ${plan.highlight ? 'text-slate-800' : 'text-slate-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button - Reduced padding */}
                <button className={`w-full py-3 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${plan.styles.button}`}>
                  {plan.highlight ? "Get Maximum Exposure" : `Choose ${plan.name}`}
                  {plan.highlight && <ArrowRight size={18} />}
                </button>
                
                {/* Scarcity / Trust Text */}
                {plan.highlight && (
                    <p className="text-center text-[10px] text-amber-700 mt-3 font-semibold animate-pulse">
                        🔥 12 people are viewing this plan
                    </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Money Back Guarantee / Trust Section - Reduced margin */}
        <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm mb-3">Used by top agents in Gandhinagar</p>
            <div className="flex justify-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="h-6 w-20 bg-slate-300 rounded"></div>
                <div className="h-6 w-20 bg-slate-300 rounded"></div>
                <div className="h-6 w-20 bg-slate-300 rounded"></div>
            </div>
        </div>
      </div>
    </main>
  );
}