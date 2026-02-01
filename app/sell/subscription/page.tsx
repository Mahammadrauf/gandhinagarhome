// app/sell/subscription/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import axios from "axios";
import API_URL from "@/app/config/config";

import { 
  CheckCircle2, 
  Star, 
  Crown, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Clock, 
  Award,
  Info
} from "lucide-react";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

// --- Configuration ---

// Helper to bold numbers in features for readability
const HighlightText = ({ text, colorClass }: { text: string; colorClass: string }) => {
  // Regex to find numbers or specific keywords
  const parts = text.split(/(\d+ Days|Lifetime|\d+ Photos|Top 5|Top positioning|Home Page|Property Page)/g);
  return (
    <span>
      {parts.map((part, i) => 
        // If part matches regex, bold it
        /(\d+ Days|Lifetime|\d+ Photos|Top 5|Top positioning|Home Page|Property Page)/.test(part) ? (
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
    id: "standard",
    name: "Standard",
    tagline: "Basic Visibility",
    price: "9,997", 
    fullPrice: "12,500",
    icon: Zap,
    styles: {
      card: "bg-[#e7fcf7] border-2 border-[#0b6b53] shadow-xl shadow-[#0b6b53]/5 z-0 transform hover:-translate-y-1",
      title: "text-[#0b6b53]", 
      tag: "bg-[#0b6b53] text-white", 
      price: "text-[#0b6b53]",
      button: "bg-[#0b6b53] text-white hover:bg-[#095c47] hover:shadow-lg hover:shadow-[#0b6b53]/20",
      iconBox: "bg-white text-[#0b6b53] shadow-sm", 
      check: "text-[#0b6b53]",
      featureText: "text-[#0b6b53]" 
    },
    features: [
      "Listed for 60 Days", 
      "Visible in search results",
      "Standard Inquiry Form",
      "Email Support"
    ],
    highlight: false
  },
  {
    id: "featured",
    name: "Featured",
    tagline: "High Velocity",
    price: "14,997", 
    fullPrice: "18,000",
    icon: Star,
    styles: {
      card: "bg-[#f4fbff] border-2 border-[#0F7F9C]/30 hover:border-[#0F7F9C] shadow-xl shadow-[#0F7F9C]/10 z-10 transform hover:-translate-y-1",
      title: "text-[#022F5A]",
      tag: "bg-[#e0f2ff] text-[#0F7F9C]",
      price: "text-[#0F7F9C]",
      button: "bg-gradient-to-r from-[#0F7F9C] to-[#022F5A] text-white hover:shadow-lg hover:shadow-[#0F7F9C]/25",
      iconBox: "bg-[#e0f2ff] text-[#0F7F9C]",
      check: "text-[#0F7F9C]",
      featureText: "text-[#022F5A]"
    },
    features: [
      "30 Days Premium + 30 Days Standard (60 Days Total)", 
      "Visible on Home Page", 
      "Extra Reach & Visibility",
      "Top 5 Search Ranking",
      "WhatsApp Direct Chat Link"
    ],
    highlight: false
  },
  {
    id: "exclusive",
    name: "Exclusive",
    tagline: "Maximum Exposure",
    price: "19,997", 
    fullPrice: "28,000",
    icon: Crown,
    styles: {
      card: "bg-gradient-to-b from-[#FDFBF7] to-[#fcf8f0] border-2 border-[#B59E78] ring-4 ring-[#B59E78]/10 shadow-2xl shadow-[#B59E78]/25 scale-[1.03] z-20 transform hover:-translate-y-1",
      title: "text-[#5C5042]", 
      tag: "bg-[#F5F2EB] text-[#8C7A5B]",
      price: "text-[#8C7A5B]",
      button: "bg-gradient-to-r from-[#B59E78] to-[#8C7A5B] text-white hover:shadow-xl hover:shadow-[#B59E78]/40",
      iconBox: "bg-[#F5F2EB] text-[#B59E78]",
      check: "text-[#B59E78]",
      featureText: "text-[#5C5042]"
    },
    features: [
      "Top positioning on the home page (first among all features)",
      "30 Days Premium + 30 Days Standard (60 Days Total)",  
      "Top of Property Page",
      "Maximum Extra Reach",
      "Professional Photoshoot Included",
      "Dedicated Relationship Manager"
    ],
    highlight: true
  }
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [submittingPlan, setSubmittingPlan] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState(12);

  useEffect(() => {
    // Generate dynamic viewer count between 11 and 20
    setViewerCount(Math.floor(Math.random() * (20 - 11 + 1)) + 11);

    const raw = localStorage.getItem("pendingListing");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const id = parsed?.apiResponse?._id || parsed?.apiResponse?.data?._id;
      if (id) setPropertyId(id);
    } catch {
      // ignore
    }
  }, []);

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

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);

      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(true));
        existing.addEventListener('error', () => resolve(false));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlanPay = async (plan: { id: string; name: string; price: string }) => {
    try {
      setSubmittingPlan(plan.id);

      const token = getAuthToken();
      if (!token) {
        alert("Login token not found. Please login first to continue payment.");
        return;
      }

      const amount = parseAmount(plan.price);
      if (!amount) {
        alert("Invalid plan amount.");
        return;
      }

      const scriptOk = await loadRazorpayScript();
      if (!scriptOk) {
        alert("Failed to load Razorpay checkout. Please check your internet and try again.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/payments/create-order`,
        {
          paymentType: "subscription",
          amount,
          propertyId: propertyId || undefined,
          planId: plan.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        const { order, keyId } = response.data.data || {};
        if (!order?.id || !keyId) {
          alert("Payment order response is invalid.");
          return;
        }

        localStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            planId: plan.id,
            planName: plan.name,
            propertyId: propertyId || null,
            orderResponse: response.data.data,
            createdAt: new Date().toISOString(),
          })
        );

        const rzp = new window.Razorpay({
          key: keyId,
          amount: order.amount,
          currency: order.currency,
          name: "Gandhinagar Homes",
          description: `${plan.name} Plan`,
          order_id: order.id,
          handler: async (rzpResponse: any) => {
            try {
              const verifyRes = await axios.post(
                `${API_URL}/payments/verify`,
                {
                  razorpayPaymentId: rzpResponse.razorpay_payment_id,
                  razorpayOrderId: rzpResponse.razorpay_order_id,
                  razorpaySignature: rzpResponse.razorpay_signature,
                  paymentType: "subscription",
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (verifyRes.data?.success) {
                alert("Payment successful. Your plan is activated.");
                if (propertyId) {
                  router.push(`/properties/${propertyId}`);
                } else {
                  router.push("/");
                }
                return;
              }

              alert(verifyRes.data?.message || "Payment verification failed");
            } catch (e: any) {
              const msg = e?.response?.data?.message || e?.message || "Payment verification API error";
              alert(msg);
            }
          },
          modal: {
            ondismiss: () => {
              alert("Payment cancelled.");
            },
          },
          prefill: {},
          theme: { color: "#0b6b53" },
        });

        rzp.open();
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
            <ShieldCheck size={14} className="text-[#0b6b53]" />
            <span className="text-[#0b6b53] font-bold">Verified</span> & Secure Payment Gateway
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Choose Your Selling Power
          </h1>
          
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Sellers on the <span className="text-[#B59E78] font-bold bg-[#B59E78]/10 px-2 rounded">Exclusive Plan</span> sell 
            <span className="font-bold text-slate-800"> 3x faster</span>. 
            Select a plan to unlock Gandhinagar's top buyers.
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
                    <span className="bg-gradient-to-r from-[#B59E78] to-[#8C7A5B] text-white px-5 py-2 rounded-full text-xs font-black tracking-widest shadow-lg shadow-[#B59E78]/30 uppercase flex items-center gap-2 border-2 border-white">
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

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-extrabold tracking-tight ${plan.styles.price}`}>
                            ₹{plan.price}
                        </span>
                        <span className="text-slate-400 text-lg line-through decoration-slate-300 font-medium opacity-70">
                            ₹{plan.fullPrice}
                        </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1 font-semibold opacity-80">One-time payment • No hidden fees</p>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-slate-200/60 mb-6"></div>

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <div className={`mt-0.5 rounded-full p-0.5 ${plan.id === 'standard' ? 'bg-[#0b6b53]/10' : ''}`}>
                         <CheckCircle2 size={18} className={`${plan.styles.check} stroke-[3px]`} />
                      </div>
                      <span className={`text-sm font-medium leading-snug ${plan.styles.featureText || 'text-slate-600'}`}>
                        {/* Auto-bold numbers/key terms */}
                        <HighlightText text={feature} colorClass={plan.styles.title} />
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanPay(plan)}
                  disabled={submittingPlan !== null}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${plan.styles.button} active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {submittingPlan === plan.id ? "Processing..." : `Pay for ${plan.name} Plan`}
                  {plan.highlight ? <ArrowRight size={18} strokeWidth={2.5} /> : null}
                </button>
                
                {/* Social Proof Text for Exclusive */}
                {plan.highlight && (
                    <div className="mt-4 flex items-center justify-center gap-1.5 animate-pulse">
                        <div className="flex -space-x-1.5">
                            <div className="w-4 h-4 rounded-full bg-slate-200 border border-white"></div>
                            <div className="w-4 h-4 rounded-full bg-slate-300 border border-white"></div>
                            <div className="w-4 h-4 rounded-full bg-slate-400 border border-white"></div>
                        </div>
                        <p className="text-[10px] text-[#8C7A5B] font-bold">
                             {viewerCount} people viewing this profile right now
                        </p>
                    </div>
                )}
              </div>
            );
          })}
        </div>

        {/* --- UPGRADE INFO NOTE --- */}
        <div className="max-w-3xl mx-auto mt-12 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0">
                <Info size={24} />
            </div>
            <div>
                <h4 className="font-bold text-slate-800 text-sm md:text-base mb-1">
                    Flexible Upgrades Available
                </h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                    Not sure which plan to choose? Your property stays active for <strong>60 days</strong> across all plans. If you choose the <strong>Featured</strong> or <strong>Exclusive</strong> plan, your property will enjoy premium placement for the first <strong>30 days</strong>, and then continue as a normal standard property for the remaining <strong>30 days</strong>.
                </p>
            </div>
        </div>

        {/* --- Trust & Security Footer --- */}
        <div className="mt-16 border-t border-slate-200 pt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-[#0b6b53] mb-1">
                        <Lock size={20} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Secure Payment</h4>
                    <p className="text-xs text-slate-500">256-bit SSL encrypted. <br/>Your data is safe.</p>
                </div>
                
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-1">
                        <Award size={20} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Gandhinagar's #1</h4>
                    <p className="text-xs text-slate-500">Most trusted property <br/>platform in the city.</p>
                </div>

                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-1">
                        <Clock size={20} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Instant Activation</h4>
                    <p className="text-xs text-slate-500">Your listing goes live <br/>immediately after payment.</p>
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