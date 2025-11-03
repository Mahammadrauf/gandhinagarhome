'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Home, Heart } from 'lucide-react';



const Experience = () => {
  const [counts, setCounts] = useState({ years: 0, properties: 0, clients: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const achievements = [
    {
      icon: Calendar,
      number: 15,
      suffix: '+ Years Experience',
      title: 'Local expertise you can trust',
      key: 'years',
      highlight: true,
    },
    {
      icon: Home,
      number: 500,
      suffix: '+ Properties Sold',
      title: 'Across premium neighborhoods',
      key: 'properties',
      highlight: false,
    },
    {
      icon: Heart,
      number: 1000,
      suffix: '+ Happy Clients',
      title: 'Service with a personal touch',
      key: 'clients',
      highlight: false,
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

            animateCount(15, 'years', 1500);
            animateCount(500, 'properties', 2000);
            animateCount(1000, 'clients', 2500);
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
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-20 bg-white relative">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Experience</h2>
          <p className="text-gray-600 text-lg">Numbers that inspire confidence.</p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary-light mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-6">
          {achievements.map((a, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`rounded-3xl p-6 shadow transition cursor-pointer text-center
                  ${isActive ? 'bg-primary text-white border-primary' : 'bg-white text-gray-800 border'}
                  hover:bg-primary/10 hover:shadow-lg`}
              >
                <div className="flex justify-center mb-2">
                  <a.icon className={`w-10 h-10 ${isActive ? 'text-white' : 'text-primary'}`} />
                </div>
                <div className="text-3xl font-bold mb-2">
                  {counts[a.key]}{a.suffix}
                </div>
                <div className="text-lg">{a.title}</div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Experience;

