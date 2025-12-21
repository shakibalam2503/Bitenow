import React, { useState, useEffect } from 'react';
import { UserIcon, CheckIcon, XMarkIcon, ClockIcon, MapPinIcon, EnvelopeIcon } from './Icons';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

interface Restaurant {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    owner: {
        firstName: string;
        lastName: string;
        email: string;
    };
    createdAt: string;
}

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
}

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'requests' | 'members'>('requests');
    const [pendingRestaurants, setPendingRestaurants] = useState<Restaurant[]>([]);
    const [members, setMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                navigate('/');
                return;
            }
            const user = JSON.parse(userStr);
            if (user.role !== 'ADMIN') {
                navigate('/dashboard');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            const [restaurantsRes, usersRes] = await Promise.all([
                fetch('/bitenow/admin/restaurants/pending', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('/bitenow/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (restaurantsRes.ok) {
                const data = await restaurantsRes.json();
                setPendingRestaurants(data.restaurants);
            }
            if (usersRes.ok) {
                const data = await usersRes.json();
                setMembers(data.users);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/bitenow/admin/restaurants/${id}/approve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: action })
            });

            if (res.ok) {
                // Remove from list
                setPendingRestaurants(prev => prev.filter(r => r._id !== id));
                alert(action === 'APPROVED' ? 'Restaurant Approved!' : 'Restaurant Rejected');
            } else {
                alert('Action failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            <main className="flex-grow pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage restaurant requests and view member details.</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'requests'
                                ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Pending Requests
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'requests' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {pendingRestaurants.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'members'
                                ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Members
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'members' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {members.length}
                            </span>
                        </button>
                    </div>
                </div>

                {activeTab === 'requests' && (
                    <div className="grid grid-cols-1 gap-6">
                        {pendingRestaurants.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border dashed border-2 border-gray-200">
                                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckIcon className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">No pending requests</h3>
                                <p className="text-gray-500 text-sm mt-1">All restaurant requests have been processed.</p>
                            </div>
                        ) : (
                            pendingRestaurants.map((restaurant) => (
                                <div key={restaurant._id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                        <div className="flex-grow space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                        <ClockIcon className="w-4 h-4" />
                                                        <span>Requested {new Date(restaurant.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                                    {restaurant.status}
                                                </span>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Info</h4>

                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400">
                                                            <EnvelopeIcon className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Email</p>
                                                            <p className="text-sm font-semibold text-gray-900">{restaurant.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400">
                                                            <MapPinIcon className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Address</p>
                                                            <p className="text-sm font-semibold text-gray-900">{restaurant.address}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Owner Details</h4>

                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400">
                                                            <UserIcon className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Full Name</p>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                {restaurant.owner?.firstName} {restaurant.owner?.lastName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400">
                                                            <EnvelopeIcon className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Owner Email</p>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                {restaurant.owner?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row lg:flex-col gap-3 min-w-[140px]">
                                            <button
                                                onClick={() => handleAction(restaurant._id, 'APPROVED')}
                                                className="flex-1 bg-brand-red text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-brand-red/30 hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <CheckIcon className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(restaurant._id, 'REJECTED')}
                                                className="flex-1 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Name</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Email</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Joined Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {members.map((member) => (
                                        <tr key={member._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center font-bold text-xs">
                                                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{member.firstName} {member.lastName}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600">{member.email}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${member.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                    member.role === 'RESTAURANT' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500">
                                                {new Date(member.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {members.length === 0 && (
                            <div className="p-12 text-center">
                                <p className="text-gray-500">No members found.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
