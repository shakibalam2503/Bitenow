import React from 'react';
import RestaurantLayout from './RestaurantLayout';

const RestaurantDashboard: React.FC = () => {
    return (
        <RestaurantLayout>
            <div className="bg-white rounded-xl shadow-sm p-8 text-center py-20">
                <div className="w-20 h-20 bg-red-50 text-brand-red rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to your Dashboard!</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    Manage your orders, menus, and customers from here. Select an option from the sidebar to get started.
                </p>
            </div>
        </RestaurantLayout>
    );
};

export default RestaurantDashboard;
