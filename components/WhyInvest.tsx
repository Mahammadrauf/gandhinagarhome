"use client";

import React, { useRef } from 'react';
// --- NEW IMPORTS for animation ---
import { motion, useInView } from 'framer-motion';

const WhyInvest = () => {
  const previewText =
    "Gandhinagar, Gujarat's capital, is a promising investment destination. It offers a stable environment and long-term growth, driven by key projects like GIFT City.";

  // --- NEW: Refs and hooks for scroll animations ---
  const ref = useRef(null);
  // Triggers animation when 20% of the component is in view, and only animates once
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // --- NEW: Animation variants for staggering children ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Animate children one after another
      },
    },
  };

  const itemSlideFromLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const itemSlideFromRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      
      {/* --- NEW: Animated Decorative background blobs --- */}
      <motion.div 
        className="pointer-events-none absolute -top-10 -right-10 w-[28rem] h-[28rem] bg-primary/5 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="pointer-events-none absolute -bottom-16 -left-10 w-[28rem] h-[28rem] bg-primary-light/5 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* --- NEW: Animated Title --- */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Why To Invest In Gandhinagar?
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary-light mx-auto rounded-full" />
        </motion.div>

        {/* --- NEW: Added ref for scroll trigger --- */}
        <div 
          ref={ref}
          className="rounded-2xl bg-primary/5 border border-primary/12 p-6 md:p-10"
        >
          {/* --- NEW: Animated Grid Container --- */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* --- NEW: Animated Left Card (Video) --- */}
            <motion.div 
              className="w-full"
              variants={itemSlideFromLeft}
            >
              <div className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-gray-100 bg-gray-100 
                            transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative pt-[56.25%]">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/JjUfKt9zqVU?si=V11Uhyp3zodvuelm"
                    title="Why to invest in Gandhinagar"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </motion.div>

            {/* --- NEW: Animated Right Card (Text) --- */}
            <motion.div 
              className="w-full"
              variants={itemSlideFromRight}
            >
              <div className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-gray-100 bg-white
                            transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="pt-[56.25%]"></div>
                
                <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-between">
                  <div> 
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-full mb-4">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-xs font-semibold text-primary">Investment Opportunity</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                      Why You Should Invest in Gandhinagar
                    </h3>
                    
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {previewText}
                    </p>
                  </div>

                  <div className="pt-3">
                    <button className="group bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-primary/30 flex items-center gap-2 text-sm md:text-base">
                      <span>Read More</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyInvest;