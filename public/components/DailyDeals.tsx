import React from 'react';
import { FireIcon, TagIcon, ClockIcon } from './Icons';

const DailyDeals: React.FC = () => {
  const deals = [
    {
      title: "50% OFF Sushi Platter",
      desc: "Order min $20",
      image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80",
      color: "from-orange-500 to-red-500",
      tag: "Limited Time"
    },
    {
      title: "Free Delivery",
      desc: "On all Burger Orders",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      color: "from-blue-500 to-indigo-500",
      tag: "Free Shipping"
    },
    {
      title: "Dessert Madness",
      desc: "Buy 1 Get 1 Free",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80",
      color: "from-pink-500 to-rose-500",
      tag: "BOGO"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-red-100 rounded-full text-brand-red animate-pulse">
                <FireIcon className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Daily Deals & Discounts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal, idx) => (
            <div key={idx} className="relative h-64 md:h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <img 
                src={deal.image} 
                alt={deal.title}
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <div className="absolute top-4 left-4">
                 <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${deal.color} shadow-lg`}>
                    <TagIcon className="w-3 h-3" />
                    {deal.tag}
                 </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 leading-tight">{deal.title}</h3>
                <p className="text-gray-200 text-sm mb-4">{deal.desc}</p>
                <button className="bg-white text-gray-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-brand-red hover:text-white transition-colors duration-300">
                    Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DailyDeals;