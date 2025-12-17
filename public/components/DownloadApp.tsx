import React from 'react';

const DownloadApp: React.FC = () => {
  return (
    <section className="py-12 md:py-24 max-w-[1600px] mx-auto px-4 md:px-12">
      <div className="bg-red-50 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 lg:p-0 overflow-hidden relative">
        <div className="grid lg:grid-cols-2 items-center gap-8 md:gap-12">
            
            {/* Text Content */}
            <div className="lg:pl-20 pt-4 md:py-10 z-10 text-center lg:text-left">
                <span className="inline-block py-1 px-3 rounded-full bg-brand-red/10 text-brand-red font-bold text-xs md:text-sm mb-4 md:mb-6">
                    Download App
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6 leading-tight">
                    Get the <span className="text-brand-red">Bitenow</span> App <br />
                    for easier ordering
                </h2>
                <p className="text-gray-600 text-base md:text-lg mb-8 max-w-md mx-auto lg:mx-0">
                    Order food and grocery delivery online from hundreds of restaurants and shops nearby.
                </p>
                
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
                    <button className="flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-900/20">
                         {/* Apple Logo SVG */}
                         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78.81 0 1.94-.96 3.63-.79.58.05 2.54.21 3.54 1.67-2.92 1.85-2.43 5.75.3 6.96-.63 1.77-1.57 3.51-2.55 4.35zm-2.2-13.84c.66-1.07 1.11-2.52.02-3.89-1.2.14-2.61.84-3.21 2.34-.58 1.41-.09 2.87 1.05 2.76.99-.08 1.68-.53 2.14-1.21z"/></svg>
                         <div className="text-left">
                             <div className="text-[10px] font-medium uppercase text-gray-300 leading-none">Download on the</div>
                             <div className="text-sm font-bold leading-tight">App Store</div>
                         </div>
                    </button>
                    
                    <button className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-5 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg border border-gray-100">
                         {/* Play Store Logo SVG */}
                         <svg className="w-8 h-8" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 8.81 2.14 13.81 5.64l-16.38 16.38L6.36 16.45C9.72 12.33 16.05 9.5 24 9.5z"/><path fill="#FBBC04" d="M42.27 24.08L28.16 38.19l-4.73-4.73 14.88-14.88c1.37 1.14 2.35 3.01 3.96 5.5z"/><path fill="#34A853" d="M6.36 16.45L21.43 31.52 6.58 46.37C5.45 44.57 4.5 40.53 4.5 32c0-5.88.75-10.74 1.86-15.55z"/><path fill="#4285F4" d="M24 46.5c-5.08 0-9.69-1.81-13.43-4.9l14.88-14.88L41.34 40.1C36.96 44.13 30.93 46.5 24 46.5z"/></svg>
                         <div className="text-left">
                             <div className="text-[10px] font-medium uppercase text-gray-500 leading-none">Get it on</div>
                             <div className="text-sm font-bold leading-tight">Google Play</div>
                         </div>
                    </button>
                </div>
            </div>

            {/* Image Content */}
            <div className="relative h-[300px] md:h-[400px] lg:h-[600px] flex items-end justify-center lg:justify-end mt-4 lg:mt-0">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-t lg:bg-gradient-to-l from-white/20 to-transparent pointer-events-none"></div>
                <img 
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80" 
                    alt="Mobile App Interface" 
                    className="h-full w-auto object-contain drop-shadow-2xl transform lg:translate-y-10 lg:-translate-x-10 origin-bottom"
                />
            </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;