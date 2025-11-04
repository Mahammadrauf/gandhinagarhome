'use client';

// ADDED: useState and useEffect
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
// ADDED: ArrowUp icon
import { ArrowDown, ArrowUp } from 'lucide-react';

const WhyChoose = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // ADDED: State to track if user is at the bottom
  const [isAtBottom, setIsAtBottom] = useState(false);

  const testimonials = [
    {
      name: 'Rahul Mehta',
      location: 'Ahmedabad',
      role: 'Seller',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      testimonial: 'Seamless experience from discovery to registration. Their pricing guidance was spot on and saved us time.',
    },
    {
      name: 'Neha Patel',
      location: 'Gandhinagar',
      role: 'Buyer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      testimonial: 'Curated listings in Sargasan and Kudasan were perfect. Verified details gave us confidence to close quickly.',
    },
    {
      name: 'Ankit Sharma',
      location: 'Gandhinagar',
      role: 'Buyer',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80',
      testimonial: 'The team understood my needs for a 3BHK near Infocity. Their local expertise is unmatched. Highly recommended!',
    },
    {
      name: 'Priya Iyer',
      location: 'Surat',
      role: 'Investor',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
      testimonial: 'I invested in a commercial property through them. The entire process was transparent and professional. Great ROI.',
    },
    {
      name: 'Vikram Singh',
      location: 'Gandhinagar',
      role: 'Seller',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
      testimonial: 'Sold my apartment in Raysan faster than I expected. They handled all the paperwork and negotiations flawlessly.',
    },
    {
      name: 'Aisha Khan',
      location: 'Vadodara',
      role: 'Buyer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      testimonial: 'Found the perfect family home in Sector 7. The virtual tours were a huge help since I was relocating.',
    },
  ];

  // RENAMED: from handleScroll to handleScrollDown
  const handleScrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 300,
        behavior: 'smooth',
      });
    }
  };

  // ADDED: Handler to scroll to the top
  const handleScrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // ADDED: Effect to listen to scroll events
  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleScroll = () => {
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        // Check if user is ~10px from the bottom
        const atBottom = scrollHeight - scrollTop - clientHeight < 10;
        setIsAtBottom(atBottom);
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Run a check on mount
      handleScroll();
    }

    // Cleanup function
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []); // Empty array means this runs once on mount

  return (
    <section className="py-12 bg-white"> 
      <div className="max-w-10xl mx-auto px-6 lg:px-10">
        
      <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Why choose Gandhinagar Homes?
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary-light mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 relative">
            
            <div 
              ref={scrollContainerRef} 
              className="space-y-6 h-[420px] overflow-y-auto hide-scrollbar pr-2"
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl p-6 border-l-4 border-primary transition-all duration-300 transform hover:-translate-x-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark rounded-full opacity-20"></div>
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.location}</p>
                        </div>
                        <span className="absolute right-6 bg-primary text-white text-base px-4 py-2 rounded-full font-medium shadow-md">
                          {testimonial.role}
                        </span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-700 font-bold leading-relaxed">"{testimonial.testimonial}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* --- MODIFIED: Conditional Button Rendering --- */}
            {!isAtBottom ? (
              // Show DOWN arrow if NOT at the bottom
              <button
                onClick={handleScrollDown}
                className="absolute bottom-6 right-8 z-20 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-all animate-bounce"
                aria-label="Scroll down"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            ) : (
              // Show UP arrow if AT the bottom
              <button
                onClick={handleScrollUp}
                className="absolute bottom-6 right-8 z-20 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-all"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            )}
            {/* --- END OF MODIFICATION --- */}

            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none"></div>

          </div>


          {/* Trusted By Card (UNCHANGED) */}
          <div className="bg-gradient-to-br from-primary-light via-primary/20 to-white rounded-xl shadow-lg p-6 border-2 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
            
            <div className="relative z-10">
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-dark to-primary text-white text-xs px-4 py-2 rounded-full font-semibold shadow-md">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  Top Rated
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-tight"> 
                Trusted by home buyers and sellers across Gandhinagar
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold">✓</span>
                  <span>Verified properties and transparent pricing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold">✓</span>
                  <span>Personal guidance from local experts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold">✓</span>
                  <span>Faster closings with streamlined paperwork</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;