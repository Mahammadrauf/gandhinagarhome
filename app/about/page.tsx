"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BLOG_POSTS } from "@/lib/blogPosts";
import {
  ShieldCheck,
  Eye,
  MapPin,
  Lock,
  ArrowRight,
  XCircle,
  Zap,
  Building2,
} from "lucide-react";

// Animation Variants for the "Rise Up" effect
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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 overflow-x-hidden">
      <Header />

      <main>
        {/* HERO SECTION - REDUCED HEIGHT */}
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
              The Resale Specialist
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight"
            >
              Resale property is broken. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ee3d4] to-emerald-400">
                We are the fix.
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed"
            >
              Most platforms clutter your search with new projects and ads. 
              We focus <strong className="text-white">exclusively on Resale Properties</strong>—a curated ecosystem 
              built for the serious buyer in Gandhinagar.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/buy-property-in-gandhinagar-gujarat" className="group bg-[#8ee3d4] text-[#0A2E2A] px-10 py-3.5 rounded-xl font-bold hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20">
                Start Your Search <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/sell-property-in-gandhinagar-gujarat" className="bg-white/5 backdrop-blur-sm border border-white/20 text-white px-10 py-3.5 rounded-xl font-semibold hover:bg-white/10 hover:border-white/40 hover:scale-105 active:scale-95 transition-all">
                List Your Property
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* METRICS – PROOF OF CONCEPT */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-4 md:-mt-10 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
            {[
              { label: "Resale Only", value: "100%", sub: "Zero new project noise" },
              { label: "Direct Connections", value: "Verified", sub: "Cutting out the middle-noise" },
              { label: "Faster Closures", value: "3.2x", sub: "Optimized for resale market" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 text-center border-r border-slate-50 last:border-r-0 hover:bg-slate-50 transition-colors">
                <div className="text-3xl font-black text-[#0A2E2A] mb-1">{item.value}</div>
                <div className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">{item.label}</div>
                <div className="text-xs text-slate-400">{item.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* THE WHY SECTION */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Why Gandhinagar <br /> 
                needs a <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">Dedicated Path.</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                The secondary market is often treated as an afterthought. We believe a pre-owned home deserves a first-class experience without the ghost listings.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "The Market Reality", desc: "Fake photos, ghost listings, and price baiting.", icon: XCircle, color: "text-red-500" },
                  { title: "The GandhinagarHomes Way", desc: "Physical verification and data-backed transparency.", icon: Zap, color: "text-emerald-500" },
                ].map((box, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 10 }}
                    className={`p-6 rounded-2xl border transition-all duration-300 ${i === 1 ? 'border-emerald-100 bg-emerald-50/30 shadow-sm' : 'border-slate-100 bg-slate-50/50'}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <box.icon className={`w-5 h-5 ${box.color}`} />
                      <h4 className="font-bold text-slate-900">{box.title}</h4>
                    </div>
                    <p className="text-slate-600 pl-8 text-sm">{box.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-emerald-100 rounded-[2rem] -rotate-3 -z-10 group-hover:rotate-0 transition-transform duration-500" />
              <div className="bg-[#0A2E2A] rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                <h3 className="text-2xl font-bold mb-6 italic text-[#8ee3d4]">"The Platform Philosophy:"</h3>
                <p className="text-lg leading-relaxed text-slate-200">
                  If we wouldn&apos;t let our own family buy a property based on a listing, 
                  that listing doesn&apos;t belong here. We build for <span className="text-white font-bold underline decoration-[#8ee3d4]">certainty.</span>
                </p>
                <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">GandhinagarHomes Team</div>
                    <div className="text-sm text-slate-400">Setting the Standard for Resale</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CORE PILLARS SECTION */}
        <section className="bg-slate-50 py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Built on Four Pillars</h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                className="h-1.5 bg-emerald-500 mx-auto rounded-full" 
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: ShieldCheck, title: "Pre-Vetted Only", desc: "We manually filter every listing for legal and physical accuracy." },
                { icon: Lock, title: "Privacy Shield", desc: "No spam. No selling data. You control the contact." },
                { icon: Eye, title: "Visual Truth", desc: "Standardized photography so you see the real space." },
                { icon: MapPin, title: "Local Expertise", desc: "Deep sector-wise knowledge of Gandhinagar." },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPANY INFORMATION & LEGAL ENTITY */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-emerald-50 to-slate-50 rounded-3xl p-8 md:p-12 border border-emerald-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">About Our Company</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Who We Are</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    Gandhinagar Homes is an online property listing platform dedicated to revolutionizing the resale property market in Gandhinagar, Gujarat. We provide a transparent, efficient, and technology-driven ecosystem for buyers, sellers, and investors to connect directly.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Our mission is to eliminate the complexities of property transactions by connecting verified buyers and sellers directly, with complete transparency and local expertise. We offer three listing plans: Standard (₹299), Featured (₹14,997), and Exclusive (₹19,997).
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Legal Entity & Payment Processing</h3>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Gandhinagar Homes is operated by <strong className="text-emerald-600">Lux Realty</strong>, the registered legal entity. Until Gandhinagar Homes is registered as an independent legal entity, <strong>Lux Realty processes all payments</strong> through the CCAvenue payment gateway on behalf of Gandhinagar Homes.
                  </p>
                  <div className="bg-white rounded-2xl p-4 border border-emerald-100 space-y-2">
                    <p className="text-sm text-slate-600"><strong>Operating Company:</strong> Lux Realty</p>
                    <p className="text-sm text-slate-600"><strong>Platform:</strong> Gandhinagar Homes</p>
                    <p className="text-sm text-slate-600"><strong>Payment Gateway:</strong> CCAvenue (PCI-DSS Compliant)</p>
                    <p className="text-sm text-slate-600"><strong>Payment Type:</strong> Listing Publication Plans Only</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-emerald-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Our Listing Plans</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-emerald-100">
                    <p className="font-bold text-slate-900">Standard Plan</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">₹299</p>
                    <p className="text-xs text-slate-600 mt-2">180 Days • Email Support • Standard Inquiry Form</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <p className="font-bold text-slate-900">Featured Plan</p>
                    <p className="text-2xl font-black text-blue-600 mt-1">₹14,997</p>
                    <p className="text-xs text-slate-600 mt-2">30 Featured + 150 Standard • WhatsApp Support • Top 5 Ranking</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <p className="font-bold text-slate-900">Exclusive Plan</p>
                    <p className="text-2xl font-black text-amber-700 mt-1">₹19,997</p>
                    <p className="text-xs text-slate-600 mt-2">30 Exclusive + 150 Standard • Photoshoot Included • 24/7 Support</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-emerald-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Important Notice About Payments</h3>
                <p className="text-slate-700 leading-relaxed">
                  We process online payments <strong>exclusively for property listing publication and promotion services</strong> through our three plans above. Our payment gateway is NOT used for property sales, booking amounts, token amounts, advances, brokerage payments, or any other real estate transaction values. All such transactions occur directly between buyers and sellers outside our platform.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FROM OUR BLOG */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block px-3 py-1 mb-4 text-[11px] font-bold tracking-[0.2em] uppercase bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                  Insights & Guides
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  From our Blog
                </h2>
                <p className="text-slate-500 mt-3 max-w-lg">
                  Locality guides, price insights, and honest advice on
                  Gandhinagar's resale market.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold text-sm hover:border-emerald-300 hover:text-emerald-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300"
                >
                  View all articles <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {BLOG_POSTS.slice(0, 3).map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col h-full rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500"
                  >
                    <div className={`relative h-36 bg-gradient-to-br ${post.accent} overflow-hidden`}>
                      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] bg-[size:28px_28px]" />
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-700" />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white border border-white/20 backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-slate-900 leading-snug mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">
                        {post.description}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-2 text-emerald-700 font-bold text-sm">
                        Read article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 px-6">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="max-w-5xl mx-auto rounded-[3rem] overflow-hidden bg-[#0A2E2A] relative group"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-700" />
              <div className="relative py-16 px-8 md:px-16 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready for a better experience?</h2>
                <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
                  Experience the most transparent way to buy or sell a resale property in Gandhinagar.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/buy-property-in-gandhinagar-gujarat" 
                    className="bg-white text-[#0A2E2A] px-12 py-4 rounded-xl font-bold hover:shadow-2xl transition shadow-lg"
                  >
                    Find My Home
                  </motion.a>
                </div>
              </div>
           </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}