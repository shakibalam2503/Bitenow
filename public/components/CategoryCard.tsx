import React from 'react';
import { ArrowRightIcon } from './Icons';

interface CategoryCardProps {
  title: string;
  image: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, image }) => {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-gray-100 flex flex-col h-64 min-w-[240px] transform hover:-translate-y-2">
      <div className="relative flex-1 overflow-hidden rounded-2xl mb-4">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="flex items-center justify-between px-2 pb-2">
        <div className="flex items-center gap-2">
            {/* Icon based on title - purely decorative simulation */}
            {title === 'Pizza' && <span className="text-xl group-hover:animate-bounce">🍕</span>}
            {title === 'Healthy' && <span className="text-xl group-hover:animate-bounce">🥗</span>}
            {title === 'Sushi' && <span className="text-xl group-hover:animate-bounce">🍣</span>}
            <span className="font-bold text-gray-800 text-lg group-hover:text-brand-red transition-colors">{title}</span>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-red transition-colors duration-300 shadow-sm">
            <ArrowRightIcon className="w-4 h-4 text-brand-red group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;