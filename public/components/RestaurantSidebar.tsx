import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    OrderIcon,
    MenuIcon,
    CatalogIcon,
    AnalyticsIcon,
    TagIcon,
    CustomersIcon,
    SettingsIcon,
    AddMenuVector
} from './icons/RestaurantIcons';

interface SidebarProps {
    restaurantName?: string;
}

const RestaurantSidebar: React.FC<SidebarProps> = ({ restaurantName }) => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col z-20">
            {/* Logo */}
            <div className="p-6">
                <h1 className="text-2xl font-bold">
                    {restaurantName ? (
                        <span className="text-brand-red">{restaurantName}</span>
                    ) : (
                        <>
                            <span className="text-brand-red">Food</span>
                            <span className="text-[#84D14D]">Mode</span>
                        </>
                    )}
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">

                {/* Orders */}
                <NavLink
                    to="/restaurant/orders"
                    className={({ isActive }) => `flex items-center justify-between p-3 rounded-xl transition-all ${isActive ? 'bg-red-50 text-brand-red font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <div className="flex items-center gap-3">
                        <OrderIcon className="w-5 h-5" />
                        <span>Orders</span>
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </NavLink>

                {/* Menus (Expandable) */}
                <div>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${isMenuOpen || location.pathname.includes('menu') ? 'bg-red-50 text-brand-red font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center gap-3">
                            <MenuIcon className={`w-5 h-5 ${isMenuOpen || location.pathname.includes('menu') ? 'bg-brand-red text-white p-1 rounded-full' : ''}`} />
                            <span>Menus</span>
                        </div>
                        <svg className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>

                    {isMenuOpen && (
                        <div className="ml-4 pl-4 border-l-2 border-gray-100 mt-2 space-y-2">
                            <NavLink to="/create-menu" className={({ isActive }) => `block text-sm p-2 rounded-lg ${isActive ? 'text-brand-red font-semibold' : 'text-gray-500 hover:text-gray-800'}`}>
                                • Add New Menu
                            </NavLink>
                            <NavLink to="/my-menus" className={({ isActive }) => `block text-sm p-2 rounded-lg ${isActive ? 'text-brand-red font-semibold' : 'text-gray-500 hover:text-gray-800'}`}>
                                • Menu List
                            </NavLink>
                            <NavLink to="/restaurant/categories" className={({ isActive }) => `block text-sm p-2 rounded-lg ${isActive ? 'text-brand-red font-semibold' : 'text-gray-500 hover:text-gray-800'}`}>
                                • Categories
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Other Items */}
                <NavLink to="/restaurant/catalogue" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl">
                    <CatalogIcon className="w-5 h-5" />
                    <span>Catalogue</span>
                </NavLink>

                <NavLink to="/restaurant/analytics" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl">
                    <AnalyticsIcon className="w-5 h-5" />
                    <span>Analytics</span>
                </NavLink>

                <NavLink to="/restaurant/tags" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl">
                    <TagIcon className="w-5 h-5" />
                    <span>Tags</span>
                </NavLink>

                <NavLink to="/restaurant/customers" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl">
                    <CustomersIcon className="w-5 h-5" />
                    <span>Customers</span>
                </NavLink>

                <NavLink to="/restaurant/settings" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl">
                    <SettingsIcon className="w-5 h-5" />
                    <span>Setting</span>
                </NavLink>

            </nav>

            {/* Promo Card */}
            <div className="p-4 m-4 rounded-2xl bg-[#84D14D] text-white relative overflow-hidden">
                <div className="relative z-10 text-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                    <h3 className="font-bold text-sm mb-1">Add Menus</h3>
                    <p className="text-[10px] opacity-90 mb-2">Manage your food and beverages menus</p>
                    <NavLink to="/create-menu" className="inline-block bg-white text-[#84D14D] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        →
                    </NavLink>
                </div>
                {/* Decorative Vector */}
                <AddMenuVector className="absolute bottom-0 right-0 w-24 h-24 opacity-30 -mb-4 -mr-4" />
            </div>

            <div className="p-4 text-xs text-gray-400 text-center">
                <p className="font-bold text-gray-800">Brand Restaurant Admin</p>
                <p>2025 All Rights Reserved</p>
                <p className="mt-1">Made with ❤️ by Alex</p>
            </div>
        </div>
    );
};

export default RestaurantSidebar;
