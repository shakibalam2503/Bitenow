import React from 'react';
import { MapPinIcon, ShoppingBagIcon, BikeIcon } from './Icons';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: 'Select Location',
      description: 'Choose the location where your food will be delivered.',
      icon: <MapPinIcon className="w-8 h-8 text-brand-red group-hover:text-white transition-colors duration-300" />,
    },
    {
      id: 2,
      title: 'Choose Order',
      description: 'Check over hundreds of menus to pick your favorite food',
      icon: <ShoppingBagIcon className="w-8 h-8 text-brand-red group-hover:text-white transition-colors duration-300" />,
    },
    {
      id: 3,
      title: 'Pay Advanced',
      description: 'It\'s quick, safe, and simple. Select several methods of payment',
      icon: <span className="text-2xl font-bold text-brand-red group-hover:text-white transition-colors duration-300">$</span>,
    },
    {
      id: 4,
      title: 'Enjoy Meals',
      description: 'Food is made and delivered directly to your home.',
      icon: <BikeIcon className="w-8 h-8 text-brand-red group-hover:text-white transition-colors duration-300" />,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">How it works</h2>
          <p className="text-gray-500 text-lg">
             Ordering food has never been easier. Follow these 4 simple steps to get your meal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center group cursor-pointer p-6 rounded-3xl transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-1">
              <div className="w-24 h-24 rounded-3xl bg-red-50 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-brand-red group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-brand-red/20">
                <div className="transition-transform duration-300 group-hover:rotate-6">
                    {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-red transition-colors">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm px-4 group-hover:text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;