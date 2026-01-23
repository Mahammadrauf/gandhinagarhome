// app/buy/subscription/page.tsx
"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import axios from "axios";
import API_URL from "@/app/config/config";
import { 
  CheckCircle2, 
  Key, 
  Crown, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Clock, 
  Award,
  Phone
} from "lucide-react";

// --- Configuration ---

const HighlightText = ({ text, colorClass }: { text: string; colorClass: string }) => {
  const parts = text.split(/(\d+ Contacts|60 Days|\d+ Properties|Priority|Dedicated)/g);
  return (
    <span>
      {parts.map((part, i) => 
        /(\d+ Contacts|60 Days|\d+ Properties|Priority|Dedicated)/.test(part) ? (
          <span key={i} className={`font-extrabold ${colorClass}`}>{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

const plans = [
  {
    id: "basic_unlock",
    name: "Starter Pack",
    tagline: "For Focused Buyers",
    price: "1,997",
    fullPrice: "2,500",
    icon: Key,
    styles: {
      card: "bg-[#eaf4fc] border-2 border-[#1e40af] shadow-xl shadow-[#1e40af]/5 z-0 transform hover:-translate-y-1",
      title: "text-[#1e40af]", 
      tag: "bg-[#1e40af] text-white", 
      price: "text-[#1e40af]",
      button: "bg-[#1e40af] text-white hover:bg-[#172554] hover:shadow-lg hover:shadow-[#1e40af]/20",
      iconBox: "bg-white text-[#1e40af] shadow-sm",
      check: "text-[#1e40af]",
      featureText: "text-[#1e40af]"
    },
    features: [
      "Unlock 5 Contacts",
      "Valid for 60 Days",
      "Direct Owner Phone Numbers",
      "Verified Seller ID",
      "Basic Email Support"
    ],
    highlight: false
  },
  {
    id: "smart_buyer",
    name: "Smart Search",
    tagline: "Best Value",
    price: "4,997",
    fullPrice: "6,500",
    icon: ShieldCheck,
    styles: {
      card: "bg-[#f0fdfa] border-2 border-[#0d9488]/30 hover:border-[#0d9488] shadow-xl shadow-[#0d9488]/10 z-10 transform hover:-translate-y-1",
      title: "text-[#115e59]",
      tag: "bg-[#ccfbf1] text-[#0d9488]",
      price: "text-[#0d9488]",
      button: "bg-gradient-to-r from-[#0d9488] to-[#115e59] text-white hover:shadow-lg hover:shadow-[#0d9488]/25",
      iconBox: "bg-[#ccfbf1] text-[#0d9488]",
      check: "text-[#0d9488]",
      featureText: "text-[#115e59]"
    },
    features: [
      "Unlock 15 Contacts",
      "Valid for 60 Days",
      "Verified Properties Only",
      "Priority Email Support",
      "Save ₹10,000 in Brokerage"
    ],
    highlight: true
  },
  {
    id: "premium_access",
    name: "Investor Pack",
    tagline: "Serious Hunters",
    price: "9,997",
    fullPrice: "12,000",
    icon: Crown,
    styles: {
      card: "bg-gradient-to-b from-[#FFFBEB] to-[#fff7ed] border-2 border-[#d97706] ring-4 ring-[#d97706]/10 shadow-2xl shadow-[#d97706]/25 scale-[1.03] z-20 transform hover:-translate-y-1",
      title: "text-[#78350f]", 
      tag: "bg-[#FEF3C7] text-[#d97706]",
      price: "text-[#d97706]",
      button: "bg-gradient-to-r from-[#d97706] to-[#b45309] text-white hover:shadow-xl hover:shadow-[#d97706]/40",
      iconBox: "bg-[#FEF3C7] text-[#d97706]",
      check: "text-[#d97706]",
      featureText: "text-[#78350f]"
    },
    features: [
      "Unlock 40 Contacts",
      "Valid for 60 Days",
      "Access to Premium Listings",
      "Dedicated Relationship Manager",
      "Legal Agreement Assistance",
      "Loan Support Assistance",
      "Verified 'Premium Buyer' Badge"
    ],
    highlight: false
  }
];

export default function BuyerSubscriptionPage() {
  const router = useRouter();
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [submittingPlan, setSubmittingPlan] = useState<string | null>(null);

  const getAuthToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("gh_token") ||
      localStorage.getItem("authToken") ||
      ""
    );
  };

  const parseAmount = (v: string) => {
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const handlePlanPay = async (plan: { id: string; name: string; price: string }) => {
    try {
      setSubmittingPlan(plan.id);

      const token = getAuthToken();
      if (!token) {
        alert("Please login first to purchase a plan.");
        router.push("/login?redirect=/buy/subscription");
        return;
      }

      const amount = parseAmount(plan.price);
      
      const response = await axios.post(
        `${API_URL}/payment/create-order`,
        {
          paymentType: "buyer_subscription", 
          amount,
          planId: plan.id
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success) {
        localStorage.setItem(
          "pendingBuyerPayment",
          JSON.stringify({
            planId: plan.id,
            planName: plan.name,
            orderResponse: response.data.data,
            createdAt: new Date().toISOString(),
          })
        );
        alert("Payment order created successfully.");
        router.back(); 
        return;
      }

      alert(response.data?.message || "Failed to create payment order");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Payment API error";
      alert(msg);
    } finally {
      setSubmittingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <div className="container mx-auto px-4 py-6 lg:py-10">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm">
            <Phone size={14} className="text-[#1e40af]" />
            <span className="text-[#1e40af] font-bold">Direct Connect</span> & Zero Brokerage
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Unlock Owner Details
          </h1>
          
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Stop paying huge brokerage fees. 
            <span className="text-[#d97706] font-bold bg-[#d97706]/10 px-2 rounded mx-1">Unlock Direct Access</span> 
            to property owners and close deals faster.
          </p>
        </div>

        {/* --- Pricing Grid --- */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-end">
          {plans.map((plan) => {
            const Icon = plan.icon;
            
            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col h-full ${plan.styles.card}`}
              >
                {/* Best Value Badge */}
                {plan.highlight && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center z-30">
                    <span className="bg-gradient-to-r from-[#0d9488] to-[#115e59] text-white px-5 py-2 rounded-full text-xs font-black tracking-widest shadow-lg shadow-[#0d9488]/30 uppercase flex items-center gap-2 border-2 border-white">
                      <Crown size={14} fill="currentColor" />
                      Best Value
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${plan.styles.iconBox}`}>
                            <Icon size={24} strokeWidth={2} />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${plan.styles.tag}`}>
                            {plan.tagline}
                        </span>
                    </div>

                    <h3 className={`text-2xl font-black tracking-tight mb-2 ${plan.styles.title}`}>
                        {plan.name}
                    </h3>

                    <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-extrabold tracking-tight ${plan.styles.price}`}>
                            ₹{plan.price}
                        </span>
                        <span className="text-slate-400 text-lg line-through decoration-slate-300 font-medium opacity-70">
                            ₹{plan.fullPrice}
                        </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1 font-semibold opacity-80">Inclusive of all taxes</p>
                </div>

                <div className="h-px w-full bg-slate-200/60 mb-6"></div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <div className={`mt-0.5 rounded-full p-0.5`}>
                         <CheckCircle2 size={18} className={`${plan.styles.check} stroke-[3px]`} />
                      </div>
                      <span className={`text-sm font-medium leading-snug ${plan.styles.featureText || 'text-slate-600'}`}>
                        <HighlightText text={feature} colorClass={plan.styles.title} />
                      </span>
                    </li>
                  ))}
                </ul>

                {/* --- BUTTON TEXT UPDATED HERE --- */}
                <button
                  onClick={() => handlePlanPay(plan)}
                  disabled={submittingPlan !== null}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${plan.styles.button} active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {submittingPlan === plan.id ? "Processing..." : `Buy ${plan.name}`}
                  {plan.highlight ? <ArrowRight size={18} strokeWidth={2.5} /> : null}
                </button>
              </div>
            );
          })}
        </div>

        {/* --- Footer --- */}
        <div className="mt-16 border-t border-slate-200 pt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-1">
                        <Lock size={20} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Secure Payment</h4>
                    <p className="text-xs text-slate-500">256-bit SSL encrypted. <br/>Your transactions are safe.</p>
                </div>
                
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-1">
                        <Award size={20} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Genuine Owners</h4>
                    <p className="text-xs text-slate-500">We verify property owners <br/>to prevent spam.</p>
                </div>

                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-1">
                        <Clock size={20} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Instant Access</h4>
                    <p className="text-xs text-slate-500">Get owner details immediately <br/>after payment.</p>
                </div>
            </div>
            
            <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-10">
                Gandhinagar Homes • Official Partner
            </p>
        </div>

      </div>
    </main>
  );
}