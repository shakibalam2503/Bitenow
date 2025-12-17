import React from 'react';

const Cuisines: React.FC = () => {
  const cuisines = [
    { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80' },
    { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80' },
    { name: 'Asian', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=150&q=80' },
    { name: 'Taco', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=150&q=80' },
    { name: 'Dessert', image: 'https://images.unsplash.com/photo-1563729768-7491131ba718?auto=format&fit=crop&w=150&q=80' },
    { name: 'Healthy', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80' },
    { name: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?auto=format&fit=crop&w=150&q=80' },
    { name: 'Italian', image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=150&q=80' },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Browse by Cuisine</h2>
            <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500">←</button>
                <button className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center hover:bg-red-600 shadow-lg shadow-red-200">→</button>
            </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x">
          {cuisines.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 min-w-[100px] group cursor-pointer snap-start">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 border-2 border-transparent group-hover:border-brand-red transition-all duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
              </div>
              <span className="font-bold text-gray-700 group-hover:text-brand-red transition-colors">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cuisines;