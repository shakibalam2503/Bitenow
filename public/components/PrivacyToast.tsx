import React, { useState } from 'react';
import { CookieIcon, XMarkIcon } from './Icons';

const PrivacyToast: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] max-w-md w-[calc(100%-3rem)] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
        
        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-gray-50 rounded-full z-0"></div>
        <div className="absolute right-8 bottom-8 w-4 h-4 bg-gray-100 rounded-full z-0"></div>
        <div className="absolute right-16 bottom-2 w-2 h-2 bg-gray-200 rounded-full z-0"></div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20 p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close privacy notice"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="relative z-10 flex gap-4">
          <div className="mt-1">
             <div className="w-10 h-10 rounded-full border-2 border-brand-red/20 flex items-center justify-center text-brand-red">
                <CookieIcon className="w-5 h-5" />
             </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">What about Privacy Policy ?</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed egestas consequat orci tincidunt accumsan.
            </p>
            <button className="text-brand-red font-semibold text-sm hover:underline">
              See more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyToast;