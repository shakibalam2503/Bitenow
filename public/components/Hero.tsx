import React from 'react';
import { MagnifyingGlassIcon } from './Icons';
import CategoryCard from './CategoryCard';

const Hero: React.FC = () => {
  return (
    <main className="relative max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] overflow-hidden">
      
      <div className="grid lg:grid-cols-2 h-full gap-8">
        
        {/* Left Column: Content */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:pl-20 py-12 lg:py-20 z-10 text-center lg:text-left">
          
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 md:mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Discover restaurants <br className="hidden md:block" />
            that deliver near you.
          </h1>

          {/* Search Input */}
          <div className="relative max-w-xl w-full mb-10 md:mb-16 mx-auto lg:mx-0 shadow-xl md:shadow-2xl shadow-gray-200/50 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 group">
            <input 
              type="text" 
              placeholder="Search for restaurants, food" 
              className="w-full h-14 md:h-16 pl-6 md:pl-8 pr-20 rounded-full border-none outline-none text-gray-700 placeholder-gray-400 bg-white ring-1 ring-transparent focus:ring-2 focus:ring-brand-red/20 transition-all group-hover:shadow-lg text-sm md:text-base"
            />
            <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-brand-red hover:bg-red-600 text-white rounded-full px-4 md:px-6 flex items-center gap-2 transition-all transform active:scale-95 hover:shadow-lg">
              <MagnifyingGlassIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-bold text-xs md:text-sm">Search</span>
            </button>
          </div>

          {/* Category Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <CategoryCard 
              title="Sushi" 
              image="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80" 
            />
            <CategoryCard 
              title="Pizza" 
              image="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80" 
            />
            <CategoryCard 
              title="Healthy" 
              image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80" 
            />
          </div>

          {/* Pagination dots simulation for mobile visual cue */}
          <div className="flex gap-2 mt-8 md:hidden justify-center opacity-50">
             <div className="w-2 h-2 rounded-full bg-brand-red"></div>
             <div className="w-2 h-2 rounded-full bg-gray-300"></div>
             <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>

        </div>

        {/* Right Column: Background Image - Hidden on mobile, visible on lg */}
        <div className="relative hidden lg:block h-full min-h-[600px] overflow-visible">
            {/* 
              We use a high quality top-down food image. 
              The screenshot has a complex composition of floating elements. 
              We will simulate this with a large image and some decorative elements.
            */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[120%] h-[90%] pointer-events-none select-none">
                 <img 
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80"
                    alt="Delicious food spread"
                    className="w-full h-full object-contain drop-shadow-2xl opacity-90 scale-110 translate-x-12 animate-in fade-in duration-1000"
                 />
            </div>
            
            {/* Decorative smaller floating elements */}
            <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-yellow-400/10 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-40 left-10 w-40 h-40 rounded-full bg-red-400/10 blur-3xl animate-pulse delay-700"></div>
        </div>

      </div>
    </main>
  );
};

export default Hero;