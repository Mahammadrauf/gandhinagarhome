'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Home, Heart } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const Experience = () => {
  const [counts, setCounts] = useState({ years: 0, properties: 0, clients: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const achievements = [
    {
      icon: Calendar,
      number: 15,
      suffix: '+ Years Experience',
      title: 'Local expertise you can trust',
      key: 'years',
    },
    {
      icon: Home,
      number: 500,
      suffix: '+ Properties Sold',
      title: 'Across premium neighborhoods',
      key: 'properties',
    },
    {
      icon: Heart,
      number: 1000,
      suffix: '+ Happy Clients',
      title: 'Service with a personal touch',
      key: 'clients',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Animate counting
            const animateCount = (
              target: number,
              key: 'years' | 'properties' | 'clients',
              duration: number = 2000
            ) => {
              const steps = 60;
              const increment = target / steps;
              const stepDuration = duration / steps;
              let current = 0;

              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  setCounts((prev) => ({ ...prev, [key]: target }));
                  clearInterval(timer);
                } else {
                  setCounts((prev) => ({ ...prev, [key]: Math.floor(current) }));
                }
              }, stepDuration);
            };

            // Stagger the start times for a nicer effect
            animateCount(15, 'years', 1500);
            setTimeout(() => animateCount(500, 'properties', 2000), 200);
            setTimeout(() => animateCount(1000, 'clients', 2000), 400);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Each card animates 0.2s after the previous
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 }, // Start invisible and 24px down
    visible: {
      opacity: 1,
      y: 0, // Animate to visible and 0px
      transition: { type: 'spring', stiffness: 90, damping: 16 } // Gentle settle, no wobble
    },
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>

      <div className="container mx-auto px-4">
        {/* --- Title Animation --- */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Experience</h2>
          <p className="text-gray-600 text-lg">Numbers that inspire confidence.</p>
          
          {/* === THE UPDATED INTERACTIVE LINE === */}
          <div 
            className="h-1.5 bg-[#056F5E] mx-auto mt-5 rounded-full w-24 hover:w-64 transition-all duration-500 ease-in-out cursor-pointer" 
          />

        </motion.div>

        {/* --- Grid Animation Container --- */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"} // Use existing state
        >
          {achievements.map((a, idx) => {
            return (
              // --- Card Animation Item ---
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`rounded-3xl p-8 text-center
                            bg-white border border-gray-100
                            shadow-[0_10px_30px_-14px_rgba(0,109,91,0.15)]
                            transition-all duration-300 ease-out
                            hover:-translate-y-1.5 hover:border-primary/20
                            hover:shadow-[0_20px_44px_-16px_rgba(0,109,91,0.25)]`}
              >
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <a.icon className={`w-7 h-7 text-primary`} />
                  </div>
                </div>
                <div className="mb-2">
                  {/* The number count-up is handled by the useEffect */}
                  <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary tabular-nums">
                    {counts[a.key as keyof typeof counts]}
                    {a.suffix.split(' ')[0]}
                  </span>
                  <span className="block mt-2 text-lg font-semibold text-gray-900">
                    {a.suffix.split(' ').slice(1).join(' ')}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{a.title}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;