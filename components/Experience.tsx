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
    hidden: { opacity: 0, y: 30 }, // Start invisible and 30px down
    visible: { 
      opacity: 1, 
      y: 0, // Animate to visible and 0px
      transition: { type: 'spring', stiffness: 100 } // Add a springy bounce
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-6"
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
                className={`rounded-3xl p-6 shadow-lg text-center
                            bg-primary text-white border-primary
                            transition-all duration-300 ease-in-out
                            hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30`}
              >
                <div className="flex justify-center mb-2">
                  <a.icon className={`w-10 h-10 text-white`} />
                </div>
                <div className="text-3xl font-bold mb-2">
                  {/* The number count-up is handled by the useEffect */}
                  {counts[a.key as keyof typeof counts]}
                  {a.suffix}
                </div>
                <div className="text-lg">{a.title}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;