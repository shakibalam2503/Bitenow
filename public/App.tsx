import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TopBrands from './components/TopBrands';
import DailyDeals from './components/DailyDeals';
import Cuisines from './components/Cuisines';
import HowItWorks from './components/HowItWorks';
import PopularRestaurants from './components/PopularRestaurants';
import FastDelivery from './components/FastDelivery';
import DownloadApp from './components/DownloadApp';
import Footer from './components/Footer';
import PrivacyToast from './components/PrivacyToast';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 selection:bg-brand-red selection:text-white">
      <Header />
      <Hero />
      <DailyDeals />
      <Cuisines />
      <HowItWorks />
      <PopularRestaurants />
      <FastDelivery />
      <DownloadApp />
      <TopBrands />
      <Footer />
      <PrivacyToast />
    </div>
  );
};

export default App;