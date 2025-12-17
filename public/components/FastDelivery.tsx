import React from 'react';
import { BikeIcon, ClockIcon, CheckIcon } from './Icons';

const FastDelivery: React.FC = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="bg-gray-900 rounded-[3rem] p-8 md:p-16 relative">
          
          <div className="grid lg:grid-cols-2 gap-12 items-center z-10 relative">
            <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/20 text-brand-red border border-brand-red/20">
                    <ClockIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">Fastest Delivery</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                    More than just <br/>
                    <span className="text-brand-red">fast delivery</span>
                </h2>
                
                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                    Our delivery partner is on the way to deliver your order. We guarantee 30 minutes delivery for all orders within 5km radius.
                </p>

                <div className="space-y-4">
                    {['Super fast delivery within 30 mins', 'Live order tracking', 'No minimum order value'].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <CheckIcon className="w-4 h-4" />
                            </div>
                            <span className="text-white font-medium">{item}</span>
                        </div>
                    ))}
                </div>

                <button className="bg-brand-red hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_10px_30px_rgba(255,43,77,0.3)] hover:shadow-[0_10px_40px_rgba(255,43,77,0.5)] transition-all transform hover:-translate-y-1">
                    Order Now
                </button>
            </div>

            <div className="relative">
                 {/* Illustration simulation using an image */}
                 <div className="relative z-10 rounded-3xl overflow-hidden border-4 border-gray-800 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                     <img 
                        src="https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&w=800&q=80" 
                        alt="Fast Delivery Driver" 
                        className="w-full h-auto object-cover"
                     />
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-red/20 rounded-full blur-3xl"></div>
                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FastDelivery;