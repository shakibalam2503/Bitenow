import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import Footer from './Footer';

interface Menu {
    _id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    isAvailable: boolean;
}

const MyMenus: React.FC = () => {
    const navigate = useNavigate();
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);

    // Fetch Restaurant & Menus
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                // 1. Get My Restaurant ID
                const resRest = await fetch('/bitenow/restaurants/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!resRest.ok) throw new Error("Could not fetch restaurant details");

                const dataRest = await resRest.json();
                const restId = dataRest.restaurant._id;
                setRestaurantId(restId);

                // 2. Get Menus for this Restaurant
                const resMenus = await fetch(`/bitenow/menus/${restId}`);
                const dataMenus = await resMenus.json();

                if (dataMenus.menus) {
                    setMenus(dataMenus.menus);
                }

            } catch (error) {
                console.error(error);
                // alert("Failed to load menus");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/bitenow/menus/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setMenus(menus.filter(m => m._id !== id));
            } else {
                alert("Failed to delete");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/bitenow/menus/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isAvailable: !currentStatus })
            });

            if (res.ok) {
                setMenus(menus.map(m =>
                    m._id === id ? { ...m, isAvailable: !currentStatus } : m
                ));
            } else {
                alert("Failed to update availability");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <DashboardHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">My Menus</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage your restaurant's dishes and pricing.</p>
                    </div>
                    <button
                        onClick={() => navigate('/create-menu')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-red hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-all hover:scale-105"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Item
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
                    </div>
                ) : menus.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No menu items</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new dish for your menu.</p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/create-menu')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-red hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Create Menu Item
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {menus.map((menu) => (
                            <div key={menu._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col h-full">
                                <div className="h-48 bg-gray-100 overflow-hidden relative">
                                    {menu.image ? (
                                        <img src={menu.image} alt={menu.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/edit-menu/${menu._id}`)}
                                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                            title="Edit Item"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(menu._id)}
                                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            title="Delete Item"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                    <div className="absolute top-2 left-2">
                                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm text-gray-900">
                                            ${menu.price}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-brand-red transition-colors">{menu.name}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{menu.description}</p>

                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <button
                                            onClick={() => handleToggleAvailability(menu._id, menu.isAvailable)}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105 ${menu.isAvailable ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                        >
                                            {menu.isAvailable ? '✓ Available' : '✕ Unavailable'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default MyMenus;
