import React from 'react';
import { BellIcon, CartIcon } from './icons/RestaurantIcons';

interface HeaderProps {
    user: any;
}

const RestaurantHeader: React.FC<HeaderProps> = ({ user }) => {
    // Fallback if user is null/undefined (e.g. during loading or error)
    const safeUser = user || { name: "Guest", role: "Guest", firstName: "Guest", lastName: "" };
    const displayName = safeUser.firstName ? `${safeUser.firstName} ${safeUser.lastName}` : safeUser.name;

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Hello {safeUser.firstName || displayName},</h2>
                <p className="text-sm text-gray-500">Welcome to back!</p>
            </div>

            <div className="flex items-center gap-6">
                <button className="bg-brand-red text-white px-6 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:bg-red-600">
                    Menu Guide
                </button>

                <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                    <button className="relative p-2 hover:bg-gray-50 rounded-full text-gray-500">
                        <CartIcon className="w-6 h-6" />
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">3</span>
                    </button>

                    <button className="relative p-2 hover:bg-gray-50 rounded-full text-gray-500">
                        <BellIcon className="w-6 h-6" />
                        <span className="absolute top-1 right-1 w-4 h-4 bg-purple-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">4</span>
                    </button>
                </div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{displayName}</p>
                        <p className="text-xs text-gray-500">{safeUser.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100">
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-100">
                    <img src="https://flagcdn.com/w20/gb.png" alt="English" className="w-5 h-auto rounded-sm" />
                    <span className="text-sm font-medium text-gray-700">English</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
        </header>
    );
};

export default RestaurantHeader;
