'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const ExploreLocation = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const locations = [
    { name: 'Sargasan', properties: 120 },
    { name: 'Kudasan', properties: 90 },
    { name: 'Raysan', properties: 75 },
    { name: 'Motera', properties: 150 },
    { name: 'Infocity', properties: 80 },
    { name: 'Koba', properties: 60 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.2 }
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

  const fadeInSlideUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemBounceIn: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 120, damping: 10 },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="py-12 bg-white relative overflow-hidden"
      initial="hidden"
      animate={hasAnimated ? 'visible' : 'hidden'}
      variants={fadeInSlideUp}
    >
      {/* Animated Background Blobs */}
      <motion.div
        className="pointer-events-none absolute -top-10 -left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-50"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-10 -right-10 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl opacity-50"
        animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div variants={fadeInSlideUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Explore Locations in Gandhinagar
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find your ideal home in Gandhinagar's most sought-after neighborhoods.
          </p>

          {/* === REPLACED: exact expanding green line from WhyInvest === */}
          <div
            className="h-1.5 bg-[#056F5E] mx-auto mt-4 rounded-full w-24 hover:w-64 transition-all duration-500 ease-in-out cursor-pointer"
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate={hasAnimated ? 'visible' : 'hidden'}
        >
          {locations.map((location, index) => (
            <motion.div
              key={index}
              variants={itemBounceIn}
              className="group relative rounded-xl bg-white shadow-lg border border-gray-100 
                         transition-all duration-300 ease-in-out 
                         hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/20 
                         cursor-pointer p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 
                             group-hover:text-primary transition-colors duration-300">
                    {location.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-500 
                              group-hover:text-gray-700 transition-colors duration-300">
                    {location.properties} Properties
                  </p>
                </div>

                <div
                  className="flex-shrink-0 p-4 rounded-full bg-primary/10 
                             border border-primary/20
                             group-hover:bg-primary
                             transition-all duration-300 ease-in-out"
                >
                  <Home
                    className="w-6 h-6 text-primary 
                               group-hover:text-white 
                               transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ExploreLocation;
