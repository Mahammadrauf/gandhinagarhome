"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const WhyInvest = () => {
  const previewText =
    "Gandhinagar, Gujarat's capital, is a promising investment destination. It offers a stable environment and long-term growth, driven by key projects like GIFT City.";

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
      
      {/* Animated Decorative background blobs - Updated to Brand Green */}
      <motion.div 
        className="pointer-events-none absolute -top-10 -right-10 w-[28rem] h-[28rem] bg-[#056F5E]/5 rounded-full blur-3xl"
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
        className="pointer-events-none absolute -bottom-16 -left-10 w-[28rem] h-[28rem] bg-[#056F5E]/5 rounded-full blur-3xl"
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
        
        {/* Animated Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Why To Invest In Gandhinagar?
          </h2>
          
          {/* === THE INTERACTIVE EXPANDING LINE === */}
          <div 
            className="h-1.5 bg-[#056F5E] mx-auto mt-4 rounded-full w-24 hover:w-64 transition-all duration-500 ease-in-out cursor-pointer" 
          />

        </motion.div>

        <div 
          ref={ref}
          className="rounded-2xl bg-[#056F5E]/5 border border-[#056F5E]/10 p-6 md:p-10"
        >
          {/* Animated Grid Container */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Left Card (Video) */}
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

            {/* Right Card (Text) */}
            <motion.div 
              className="w-full"
              variants={itemSlideFromRight}
            >
              <div className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-gray-100 bg-white
                            transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                {/* Aspect ratio spacer for desktop match */}
                <div className="pt-[56.25%] hidden lg:block"></div> 
                
                <div className="lg:absolute lg:inset-0 p-5 md:p-8 flex flex-col justify-between h-full relative">
                  <div> 
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#056F5E]/10 rounded-full mb-4">
                      <svg className="w-4 h-4 text-[#056F5E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-xs font-semibold text-[#056F5E]">Investment Opportunity</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                      Why You Should Invest in Gandhinagar
                    </h3>
                    
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {previewText}
                    </p>
                  </div>

                  <div className="pt-3">
                    <button className="group bg-[#056F5E] hover:bg-[#045c4e] text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-[#056F5E]/30 flex items-center gap-2 text-sm md:text-base">
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