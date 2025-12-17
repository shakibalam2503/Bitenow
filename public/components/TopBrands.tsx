import React from 'react';

const TopBrands: React.FC = () => {
  const brands = [
    { name: 'Pizza Hut', url: 'https://logo.clearbit.com/pizzahut.com', highlight: false },
    { name: 'Taco Bell', url: 'https://logo.clearbit.com/tacobell.com', highlight: false },
    { name: "Wendy's", url: 'https://logo.clearbit.com/wendys.com', highlight: false },
    { name: "Dunkin'", url: 'https://logo.clearbit.com/dunkindonuts.com', highlight: true },
    { name: 'Chipotle', url: 'https://logo.clearbit.com/chipotle.com', highlight: false },
    // Add a few more to make the strip long enough for large screens
    { name: 'Subway', url: 'https://logo.clearbit.com/subway.com', highlight: false },
    { name: 'KFC', url: 'https://logo.clearbit.com/kfc.com', highlight: false },
  ];

  return (
    <section className="bg-[#FDFDFD] py-10 border-t border-gray-100 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Static Label */}
            <h3 className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs shrink-0 relative z-20 bg-[#FDFDFD] md:pr-8 py-2">
                Trusted by top brands
            </h3>
            
            {/* Moving Marquee Container */}
            <div className="relative flex-1 overflow-hidden w-full mask-linear-gradient">
                {/* 
                   We duplicate the list to create a seamless loop.
                   The animation 'scroll' moves the container -50% to the left.
                   This creates the illusion of infinite scrolling.
                */}
                <div className="flex animate-scroll w-max items-center">
                    {/* First Set */}
                    <div className="flex items-center gap-12 md:gap-20 px-6 md:px-10">
                        {brands.map((brand, idx) => (
                            <div key={`set1-${idx}`} className="shrink-0 group">
                                <img 
                                    src={brand.url} 
                                    alt={brand.name}
                                    className={`h-8 md:h-9 w-auto object-contain transition-all duration-300 
                                        ${brand.highlight 
                                            ? 'grayscale-0 opacity-100 scale-105' 
                                            : 'grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105'
                                        }`}
                                />
                            </div>
                        ))}
                    </div>
                    
                    {/* Second Set (Duplicate) */}
                    <div className="flex items-center gap-12 md:gap-20 px-6 md:px-10">
                        {brands.map((brand, idx) => (
                            <div key={`set2-${idx}`} className="shrink-0 group">
                                <img 
                                    src={brand.url} 
                                    alt={brand.name}
                                    className={`h-8 md:h-9 w-auto object-contain transition-all duration-300 
                                        ${brand.highlight 
                                            ? 'grayscale-0 opacity-100 scale-105' 
                                            : 'grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105'
                                        }`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fade Gradients for smooth edges */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#FDFDFD] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#FDFDFD] to-transparent z-10 pointer-events-none"></div>
            </div>
        </div>
    </section>
  );
};

export default TopBrands;