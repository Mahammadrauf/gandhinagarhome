import React from 'react';
import { CheckCircle2, DollarSign, Zap, Users } from 'lucide-react';

const KeyFeatures = () => {
  const features = [
    {
      icon: CheckCircle2,
      title: 'Verified Listings',
      description: 'Human-checked for accuracy',
      color: 'from-primary to-primary-dark', // This is now used
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description: 'Live market benchmarks',
      color: 'from-primary-light to-primary', // This is now used
    },
    {
      icon: Zap,
      title: 'Fast Closings',
      description: 'Streamlined paperwork',
      color: 'from-primary-dark to-primary', // This is now used
    },
    {
      icon: Users,
      title: 'Local Experts',
      description: 'Neighborhood insights',
      color: 'from-primary to-primary-light', // This is now used
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                // --- UPDATED: Added transition, group, and hover effects ---
                className={`group bg-white rounded-lg shadow-md p-4 
                            transition-all duration-300 ease-in-out 
                            hover:-translate-y-1 hover:shadow-xl 
                            hover:bg-gradient-to-r ${feature.color}`}
              >
                <div className="flex items-start gap-3">
                  {/* --- UPDATED: Added transition and group-hover effect --- */}
                  <div className={`flex-shrink-0 p-2 rounded-lg bg-primary/10 
                                  transition-all duration-300 
                                  group-hover:bg-white/20`}>
                    {/* --- UPDATED: Added transition and group-hover effect --- */}
                    <Icon className="w-5 h-5 text-primary 
                                     transition-colors duration-300 
                                     group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    {/* --- UPDATED: Added transition and group-hover effect --- */}
                    <h3 className="text-base font-semibold text-gray-800 mb-1 
                                   transition-colors duration-300 
                                   group-hover:text-white">
                      {feature.title}
                    </h3>
                    {/* --- UPDATED: Added transition and group-hover effect --- */}
                    <p className="text-sm text-gray-600 
                                 transition-colors duration-300 
                                 group-hover:text-white/80">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;