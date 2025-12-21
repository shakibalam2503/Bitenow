import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBagIcon, ChevronDownIcon, MagnifyingGlassIcon, UserIcon, MapPinIcon, AdjustmentsIcon } from './Icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const DashboardHeader: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { itemCount } = useCart();
    const [q, setQ] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-all">
            <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between gap-6">

                {/* 1. Logo */}
                <div
                    className="flex items-center gap-1 cursor-pointer group shrink-0"
                    onClick={() => navigate('/')}
                >
                    <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                        Bitenow
                    </span>
                    <div className="w-2 h-2 rounded-full bg-brand-red mb-1"></div>
                </div>

                {/* 2. Location Picker */}
                <button className="hidden xl:flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-full transition-colors shrink-0 outline-none">
                    <MapPinIcon className="w-5 h-5 text-gray-900" />
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">Deliver to</span>
                        <span className="text-sm font-bold text-gray-900 leading-tight">123 Main St, Apt 4B</span>
                    </div>
                    <ChevronDownIcon className="w-3 h-3 text-gray-400 ml-1" />
                </button>

                {/* 3. Search Bar (Centered & Wide) */}
                <div className="flex-1 max-w-2xl px-4">
                    <div className="flex items-center gap-3">
                        <div className="relative group w-full">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-brand-red transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-full leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all duration-200 font-medium sm:text-sm"
                                placeholder="Search for food or restaurants..."
                            />
                        </div>
                        {/* 4. Filter Button */}
                        <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold text-sm px-5 py-3.5 rounded-full transition-colors shrink-0">
                            <AdjustmentsIcon className="w-5 h-5" />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6 shrink-0">

                    {/* 5. Cart */}
                    {/* 5. Cart */}
                    <button
                        onClick={() => navigate('/checkout')}
                        className="relative p-2 hover:bg-gray-50 rounded-full transition-colors group"
                    >
                        <ShoppingBagIcon className="w-6 h-6 text-gray-900 group-hover:text-brand-red transition-colors" />
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white ring-2 ring-white">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    {/* 6. Profile & Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer outline-none"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                {user.firstName ? (
                                    <span className="text-brand-red font-bold text-sm">{user.firstName[0]}</span>
                                ) : (
                                    <UserIcon className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                            <span className="text-sm font-bold text-gray-900 hidden md:block max-w-[120px] truncate">
                                {user.firstName || 'Account'}
                            </span>
                            <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                <div className="px-4 py-3 border-b border-gray-50">
                                    <p className="text-sm font-bold text-gray-900">Signed in as</p>
                                    <p className="text-sm text-gray-500 truncate">{user.email || 'user@example.com'}</p>
                                </div>
                                <div className="py-2">
                                    <a href="#" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                        My Orders
                                    </a>
                                    <a href="#" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                        Favorites
                                    </a>
                                    <a href="#" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                        Account Settings
                                    </a>
                                </div>
                                <div className="py-2 border-t border-gray-50">
                                    {user.role === 'RESTAURANT' ? (
                                        <>
                                            <button
                                                onClick={() => navigate('/create-menu')}
                                                className="w-full text-left block px-4 py-2.5 text-sm font-bold text-brand-red hover:bg-red-50"
                                            >
                                                Create Menu
                                            </button>
                                            <button
                                                onClick={() => navigate('/my-menus')}
                                                className="w-full text-left block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                            >
                                                My Menus
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => navigate('/become-restaurant')}
                                            className="w-full text-left block px-4 py-2.5 text-sm font-bold text-brand-red hover:bg-red-50"
                                        >
                                            Become a Restaurant
                                        </button>
                                    )}
                                </div>
                                <div className="py-2 border-t border-gray-50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left block px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
