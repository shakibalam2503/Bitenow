import React, { useState, useEffect } from 'react';
import { ShoppingBagIcon, ChevronDownIcon, MenuIcon, XMarkIcon } from './Icons';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 border-b border-transparent ${
          scrolled || isMobileMenuOpen ? 'bg-white/90 backdrop-blur-xl border-gray-100/50 shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-6 lg:gap-8 z-50">
            <a href="#" className="flex items-baseline gap-1.5 group select-none">
              <span className="text-2xl md:text-3xl font-extrabold tracking-tighter text-gray-900 transition-all duration-500 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-brand-red group-hover:to-[#ff8c42]">
                Bitenow
              </span>
              <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-brand-red shadow-[0_0_15px_rgba(255,43,77,0.6)] transition-all duration-500 group-hover:scale-150 group-hover:shadow-[0_0_25px_rgba(255,43,77,1)] group-hover:rotate-180"></div>
            </a>
          </div>

          {/* Center: Navigation - Desktop */}
          <nav className="hidden xl:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-100 shadow-inner">
            <a href="#" className="px-6 py-3 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-gray-900 font-bold text-sm transition-all transform hover:-translate-y-0.5 border border-gray-100 flex items-center gap-2">
              <span>Find food</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></span>
            </a>
            {['Categories', 'Restaurants', 'About us'].map((item) => (
              <a key={item} href="#" className="px-6 py-3 rounded-full text-gray-500 font-medium text-sm hover:text-gray-900 hover:bg-white/80 transition-all duration-200 hover:shadow-sm">
                {item}
              </a>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-6 lg:gap-10">
              {/* Phone Number - Desktop only */}
            <div className="hidden 2xl:flex items-center gap-2 text-brand-red bg-red-50/50 px-5 py-2.5 rounded-full border border-red-100/50 hover:bg-red-50 transition-colors cursor-pointer group">
              <span className="w-2 h-2 bg-brand-red rounded-full group-hover:animate-ping"></span>
              <span className="font-bold text-sm tracking-wide font-mono">+1-202-555-0104</span>
            </div>

            <div className="hidden lg:block h-8 w-px bg-gray-200/60"></div>

            <button className="hidden md:flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all">
              Account
              <ChevronDownIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>
            
            <div className="relative cursor-pointer group p-1 mr-2 md:mr-0">
              <ShoppingBagIcon className="w-6 h-6 md:w-7 md:h-7 text-gray-700 group-hover:text-brand-red transition-colors duration-300" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white ring-2 ring-white shadow-lg transform group-hover:scale-110 transition-transform">
                1
              </span>
            </div>

            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden md:flex relative overflow-hidden items-center gap-2 bg-gradient-to-r from-brand-red to-[#ff4766] text-white text-sm font-bold py-3 px-6 md:py-3.5 md:px-8 rounded-full shadow-[0_8px_20px_-6px_rgba(255,43,77,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 border-2 border-white/20 group"
            >
              <span className="relative z-10">Start order</span>
              {/* Shine effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            </button>

            {/* Mobile Menu Button */}
            <button 
                className="xl:hidden p-2 -mr-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors z-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? (
                    <XMarkIcon className="w-7 h-7" />
                ) : (
                    <MenuIcon className="w-7 h-7" />
                )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div 
        className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '0px' }}
      >
        <div className="flex flex-col h-full pt-24 px-6 pb-8 overflow-y-auto">
            <div className="space-y-6 mb-8">
                <a href="#" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl text-xl font-bold text-gray-900 border border-gray-100">
                    Find Food
                    <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                </a>
                {['Categories', 'Restaurants', 'About us', 'Deals', 'Account'].map((item) => (
                    <a 
                        key={item} 
                        href="#" 
                        className="block p-4 text-xl font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-colors"
                    >
                        {item}
                    </a>
                ))}
            </div>

            <div className="mt-auto space-y-4">
                <button 
                    onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                    }}
                    className="w-full py-4 rounded-xl bg-brand-red text-white text-lg font-bold shadow-lg shadow-brand-red/30"
                >
                    Start Order
                </button>
                <div className="text-center py-4">
                    <p className="text-sm text-gray-400 mb-1">Need help?</p>
                    <p className="text-lg font-bold text-brand-red font-mono">+1-202-555-0104</p>
                </div>
            </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;