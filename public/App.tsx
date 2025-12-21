import React from 'react';
// Force refresh
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Checkout from './components/Checkout.tsx';
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
import Dashboard from './components/Dashboard';
import RestaurantRegistration from './components/RestaurantRegistration';
import CreateMenu from './components/CreateMenu';
import MyMenus from './components/MyMenus';
import EditMenu from './components/EditMenu';
import AllFoods from './components/AllFoods';
import FoodDetail from './components/FoodDetail';

import AdminDashboard from './components/AdminDashboard';
import RestaurantDashboard from './components/RestaurantDashboard';

const Home: React.FC = () => {
  return (
    <>
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
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-[#F9FAFB] text-gray-900 selection:bg-brand-red selection:text-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/become-restaurant" element={<RestaurantRegistration />} />
            <Route path="/create-menu" element={<CreateMenu />} />
            <Route path="/my-menus" element={<MyMenus />} />
            <Route path="/edit-menu/:id" element={<EditMenu />} />
            <Route path="/all-foods" element={<AllFoods />} />
            <Route path="/food/:id" element={<FoodDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;