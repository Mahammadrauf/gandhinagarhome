import React from 'react';
import Image from 'next/image';

const WhyChoose = () => {
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
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-10xl mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            <span className="text-primary">•</span> Why Choose Gandhinagar Homes
          </h2>
          <p className="text-black-600">
            {/* Built for Gandhinagar: transparent pricing, expert guidance, and end-to-end support. */}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Testimonials */}
          <div className="lg:col-span-2 space-y-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-xl shadow-md hover:shadow-xl p-8 border-l-4 border-primary transition-all duration-300 transform hover:-translate-x-1 relative overflow-hidden"
              >
                {/* Subtle gradient on hover */}
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

          {/* Trusted By Card */}
          <div className="bg-gradient-to-br from-primary-light via-primary/20 to-white rounded-xl shadow-lg p-6 border-2 border-primary/20 relative overflow-hidden">
            {/* Decorative elements */}
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
              <h3 className="text-2xl font-bold text-gray-800 mb-6 leading-tight">
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

