"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, X, ArrowRight, HelpCircle } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function PricingPage() {
  const plans = [
    {
      name: "Standard",
      description: "List 1 Property",
      price: "₹299",
      originalPrice: "₹999",
      discount: "Short Time Offer",
      duration: "one-time payment",
      features: [
        { text: "Listing valid for 180 Days", included: true },
        { text: "Visible to buyers after approval", included: true },
        { text: "Standard inquiry form", included: true },
        { text: "Email support", included: true },
        { text: "Featured placement", included: false },
        { text: "Home page visibility", included: false },
        { text: "Professional photoshoot included", included: false },
      ],
      cta: "Get Started",
      highlighted: false,
      comingSoon: false,
    },
    {
      name: "Featured",
      description: "High Velocity Listing",
      price: "₹14,997",
      originalPrice: "₹18,000",
      discount: "Coming Soon",
      duration: "one-time payment",
      features: [
        { text: "30 Days Featured + 150 Days Standard (180 Days Total)", included: true },
        { text: "Visible on Home Page", included: true },
        { text: "Extra Reach & Visibility", included: true },
        { text: "Top 5 Search Ranking", included: true },
        { text: "Dedicated WhatsApp Support", included: true },
        { text: "Professional photoshoot included", included: false },
        { text: "Dedicated support manager", included: false },
      ],
      cta: "Coming Soon",
      highlighted: true,
      comingSoon: true,
    },
    {
      name: "Exclusive",
      description: "Maximum Exposure",
      price: "₹19,997",
      originalPrice: "₹28,000",
      discount: "Coming Soon",
      duration: "one-time payment",
      features: [
        { text: "30 Days Exclusive + 150 Days Standard (180 Days Total)", included: true },
        { text: "Top positioning on Home Page", included: true },
        { text: "Top of Property Page", included: true },
        { text: "Maximum Extra Reach", included: true },
        { text: "Professional Photoshoot & Video shoot Included", included: true },
        { text: "16x7 on call support", included: true },
        { text: "Dedicated Support Manager", included: true },
      ],
      cta: "Coming Soon",
      highlighted: true,
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 overflow-x-hidden">
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-[#0A2E2A] py-12 md:py-20">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <motion.div 
            className="relative max-w-6xl mx-auto px-6 text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.span 
              variants={fadeInUp}
              className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-[0.2em] uppercase bg-[#8ee3d4]/10 text-[#8ee3d4] rounded-full border border-[#8ee3d4]/20"
            >
              Transparent Pricing
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight"
            >
              Simple, Affordable <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ee3d4] to-emerald-400">
                Listing Plans
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed"
            >
              Choose the perfect plan to list your property and reach thousands of qualified buyers in Gandhinagar.
            </motion.p>
          </motion.div>
        </section>

        {/* PRICING CARDS */}
        <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
                  plan.highlighted
                    ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-white shadow-2xl md:scale-105"
                    : "border-slate-200 bg-white shadow-lg hover:shadow-xl"
                }`}
              >
                {plan.highlighted && !plan.comingSoon && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                    BEST VALUE
                  </div>
                )}
                
                {plan.comingSoon && (
                  <div className="absolute top-0 right-0 bg-slate-600 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                    COMING SOON
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mb-6">{plan.description}</p>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                      <span className="text-sm text-slate-500 line-through">{plan.originalPrice}</span>
                    </div>
                    {plan.discount && (
                      <div className="inline-block bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold mb-3">
                        {plan.discount}
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-2 font-medium">{plan.duration} • No hidden fees</p>
                  </div>

                  <button 
                    disabled={plan.comingSoon}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 mb-8 ${
                      plan.comingSoon
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : plan.highlighted
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg"
                        : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    {plan.cta}
                    {!plan.comingSoon && <ArrowRight className="w-4 h-4" />}
                  </button>

                  <div className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included ? "text-slate-700" : "text-slate-400"}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* IMPORTANT NOTE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 md:p-8"
          >
            <div className="flex gap-4">
              <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">What These Prices Cover</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Our plans are for <strong>property listing publication and promotion services only</strong>. 
                  The <strong>Standard Plan (₹299)</strong> publishes your property for 180 days to buyer review. 
                  Featured and Exclusive plans add enhanced visibility and professional services.
                </p>
                <p className="text-blue-800 text-sm mb-3">
                  <strong>These payments are NOT for:</strong> Property purchase, booking amounts, token amounts, 
                  advance payments, brokerage, or any real estate transaction values. All property transactions 
                  happen directly between buyers and sellers.
                </p>
                <p className="text-blue-800 text-sm">
                  For more information, see our <Link href="/terms-and-conditions" className="font-bold hover:underline">Terms & Conditions</Link>, 
                  <Link href="/refund-cancellation-policy" className="font-bold hover:underline"> Refund Policy</Link>, and 
                  <Link href="/about" className="font-bold hover:underline"> About Us</Link>.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 md:py-24 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-600">Have questions about our pricing? We've got answers.</p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  q: "What exactly am I paying for?",
                  a: "You're paying for property listing publication and promotion services. The Standard Plan (₹299) publishes your property for 180 days. Featured and Exclusive plans add enhanced visibility, search rankings, and professional photoshoot services."
                },
                {
                  q: "Can I upgrade to a higher plan after purchasing?",
                  a: "Yes! You can upgrade to Featured or Exclusive plans once they're available. You can also list multiple properties by purchasing the Standard Plan multiple times for each property."
                },
                {
                  q: "Is my payment refundable after my listing is published?",
                  a: "Once your listing is reviewed and published, charges become non-refundable because you immediately receive visibility and access to buyer inquiries. However, if there's a technical issue preventing publication, contact support for assistance."
                },
                {
                  q: "What if I want to delist my property early?",
                  a: "You can delist anytime through your account. However, as per our refund policy, listing charges are non-refundable once published. Your listing remains live until the plan duration ends."
                },
                {
                  q: "Are there any hidden fees or additional charges?",
                  a: "No! The price you see is exactly what you pay. There are no hidden fees. For information on all charges, see our Terms & Conditions and Refund Policy."
                },
                {
                  q: "Do I need to handle property payment through this website?",
                  a: "No. Our payment gateway accepts ONLY listing service charges. Property sales, booking amounts, token amounts, and other transaction values are handled directly between you and the buyer. We're a listing platform only."
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600 text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16 md:py-24 px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto rounded-[3rem] overflow-hidden bg-[#0A2E2A] relative group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-700" />
            <div className="relative py-16 px-8 md:px-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to list your property?</h2>
              <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
                Choose a plan and start reaching qualified buyers in Gandhinagar today.
              </p>
              <Link href="/sell-property-in-gandhinagar-gujarat/subscription" className="inline-flex items-center gap-2 bg-white text-[#0A2E2A] px-12 py-4 rounded-xl font-bold hover:shadow-2xl transition shadow-lg hover:scale-105 active:scale-95">
                Browse Our Plans <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
