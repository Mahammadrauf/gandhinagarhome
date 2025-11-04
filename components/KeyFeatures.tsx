import React from 'react';
import { CheckCircle2, DollarSign, Zap, Users } from 'lucide-react';

const KeyFeatures = () => {
  const features = [
    {
      icon: CheckCircle2,
      title: 'Verified Listings',
      description: 'Human-checked for accuracy',
      color: 'from-primary to-primary-dark',
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description: 'Live market benchmarks',
      color: 'from-primary-light to-primary',
    },
    {
      icon: Zap,
      title: 'Fast Closings',
      description: 'Streamlined paperwork',
      color: 'from-primary-dark to-primary',
    },
    {
      icon: Users,
      title: 'Local Experts',
      description: 'Neighborhood insights',
      color: 'from-primary to-primary-light',
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
                className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 p-2 rounded-lg bg-primary/10`}>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
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

