import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import DailyDeals from './DailyDeals';
import Cuisines from './Cuisines';
import Footer from './Footer';

interface Restaurant {
    _id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    isActive: boolean;
    image?: string;
}

interface Menu {
    _id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    restaurant: {
        _id: string;
        name: string;
        address: string;
    };
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [menusLoading, setMenusLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await fetch('/bitenow/restaurants');
                const data = await res.json();
                if (data.restaurants) {
                    setRestaurants(data.restaurants);
                }
            } catch (error) {
                console.error("Failed to fetch restaurants", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAllMenus = async () => {
            try {
                const res = await fetch('/bitenow/menus/all');
                const data = await res.json();
                if (data.menus) {
                    setMenus(data.menus);
                }
            } catch (error) {
                console.error("Failed to fetch menus", error);
            } finally {
                setMenusLoading(false);
            }
        };

        fetchRestaurants();
        fetchAllMenus();
    }, []);

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <DashboardHeader />

            <div className="pt-24 pb-10 space-y-12">
                {/* Cuisines Section */}
                <Cuisines />

                {/* Daily Deals Section */}
                <DailyDeals />

                {/* Flat 25% Discount Section */}
                <div className="container mx-auto px-4 md:px-8">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Flat 25% Discount</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">🍔</div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Tasty Burger Combo</h3>
                                    <p className="text-gray-500 text-sm line-through">$12.00</p>
                                    <p className="text-brand-red font-bold">$9.00</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* All Restaurants Section */}
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900">All Restaurants</h2>
                            <p className="text-gray-500 mt-1">Discover amazing food from top restaurants</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading restaurants...</div>
                    ) : restaurants.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No restaurants available right now.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {restaurants.map((restaurant) => (
                                <div key={restaurant._id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-100">
                                    <div className="h-48 bg-gray-200 w-full relative overflow-hidden">
                                        {restaurant.image ? (
                                            <img
                                                src={restaurant.image}
                                                alt={restaurant.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                                                <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                            Open
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-red transition-colors mb-2 line-clamp-1">{restaurant.name}</h3>
                                        <div className="flex items-start gap-2 mb-4">
                                            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p className="text-gray-500 text-sm line-clamp-2 flex-1">{restaurant.address}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-sm font-bold text-gray-900">4.5</span>
                                                <span className="text-xs text-gray-400">(200+)</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-xs font-medium">25-35 min</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Browse All Foods Section */}
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900">Browse All Foods</h2>
                            <p className="text-gray-500 mt-1">Explore delicious dishes from all restaurants</p>
                        </div>
                    </div>

                    {menusLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
                        </div>
                    ) : menus.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="mx-auto h-12 w-12 text-gray-400">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No food items available</h3>
                            <p className="mt-1 text-sm text-gray-500">Check back later for delicious options!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {menus.map((menu) => (
                                <div
                                    key={menu._id}
                                    onClick={() => navigate(`/food/${menu._id}`)}
                                    className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group flex flex-col h-full border border-gray-100 cursor-pointer"
                                >
                                    <div className="h-56 bg-gray-100 overflow-hidden relative">
                                        {menu.image ? (
                                            <img src={menu.image} alt={menu.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                                                <svg className="h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold shadow-lg text-brand-red flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                ${menu.price}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-red transition-colors line-clamp-1">{menu.name}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{menu.description}</p>

                                        <div className="pt-4 border-t border-gray-100 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-brand-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{menu.restaurant.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{menu.restaurant.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;
