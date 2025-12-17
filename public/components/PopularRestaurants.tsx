import React from 'react';
import { StarIcon, ClockIcon, BikeIcon } from './Icons';

const PopularRestaurants: React.FC = () => {
  const restaurants = [
    {
      id: 1,
      name: "Burger King",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=80",
      rating: 4.5,
      reviews: "25+",
      time: "15-25 min",
      deliveryFee: "Free",
      tags: ["Burger", "American"]
    },
    {
      id: 2,
      name: "Toasty Buns",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviews: "102",
      time: "20-30 min",
      deliveryFee: "$2.50",
      tags: ["Sandwich", "Fast Food"]
    },
    {
      id: 3,
      name: "Sushi Master",
      image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
      reviews: "500+",
      time: "30-45 min",
      deliveryFee: "Free",
      tags: ["Sushi", "Japanese"]
    },
    {
      id: 4,
      name: "Italiano Pizza",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
      rating: 4.3,
      reviews: "85",
      time: "25-40 min",
      deliveryFee: "$1.99",
      tags: ["Pizza", "Italian"]
    },
  ];

  return (
    <section className="py-20 bg-[#F9FAFB]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Popular Restaurants</h2>
                <p className="text-gray-500">The best restaurants in Washington near you</p>
            </div>
            <a href="#" className="text-brand-red font-bold hover:underline flex items-center gap-1 group">
                See all restaurants
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {restaurants.map((place) => (
            <div key={place.id} className="bg-white rounded-3xl p-3 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group cursor-pointer">
              <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                <img 
                  src={place.image} 
                  alt={place.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm group-hover:bg-brand-red group-hover:text-white transition-colors">
                   <ClockIcon className="w-3 h-3 text-brand-red group-hover:text-white" />
                   {place.time}
                </div>
              </div>
              
              <div className="px-2 pb-2">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-brand-red transition-colors">{place.name}</h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 text-yellow-400" filled />
                        <span className="font-semibold text-gray-900">{place.rating}</span>
                        <span className="text-gray-400">({place.reviews})</span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <div className="flex gap-2">
                        {place.tags.map(tag => (
                            <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors">{tag}</span>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-brand-red bg-red-50 px-2 py-1 rounded-lg group-hover:bg-brand-red group-hover:text-white transition-colors">
                        <BikeIcon className="w-4 h-4" />
                        {place.deliveryFee}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRestaurants;