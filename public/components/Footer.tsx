import React from 'react';
import { FacebookIcon, TwitterIcon, InstagramIcon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
             <div className="flex items-baseline gap-1.5 group cursor-default">
                <span className="text-3xl font-extrabold tracking-tighter text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">Bitenow</span>
                <div className="w-2.5 h-2.5 rounded-full bg-brand-red group-hover:animate-pulse shadow-[0_0_10px_#ff2b4d]"></div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                The best way to find food near you. Reliable, fast, and always delicious.
            </p>
            <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-red transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,43,77,0.5)] text-white group">
                    <FacebookIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-red transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,43,77,0.5)] text-white group">
                    <TwitterIcon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-red transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,43,77,0.5)] text-white group">
                    <InstagramIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-4">
                {['About us', 'Team', 'Careers', 'Blog'].map(item => (
                    <li key={item}>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm relative group w-fit block">
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </li>
                ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact</h4>
            <ul className="space-y-4">
                {['Help & Support', 'Partner with us', 'Ride with us'].map(item => (
                    <li key={item}>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm relative group w-fit block">
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </li>
                ))}
            </ul>
            <div className="mt-6 text-gray-400 text-sm">
                <p>2118 Thornridge Cir. Syracuse,</p>
                <p>Connecticut 35624</p>
            </div>
          </div>

           {/* Newsletter */}
           <div>
            <h4 className="text-lg font-bold mb-6 text-white">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter to get more offers and tips.</p>
            <div className="relative group">
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full h-12 rounded-full bg-gray-800 border border-gray-700 px-5 text-sm text-white focus:outline-none focus:border-brand-red focus:bg-gray-800/50 transition-all placeholder:text-gray-500"
                />
                <button className="absolute right-1 top-1 bottom-1 bg-brand-red hover:bg-red-600 text-white px-4 rounded-full text-sm font-bold transition-all hover:shadow-[0_0_10px_rgba(255,43,77,0.4)] active:scale-95">
                    Join
                </button>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2024 Bitenow Inc. All rights reserved.</p>
            <div className="flex gap-8">
                <a href="#" className="hover:text-white transition-colors hover:underline">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors hover:underline">Terms of Service</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;