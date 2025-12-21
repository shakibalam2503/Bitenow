import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantSidebar from './RestaurantSidebar';
import RestaurantHeader from './RestaurantHeader';

interface LayoutProps {
    children: React.ReactNode;
}

const RestaurantLayout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            navigate('/');
            return;
        }

        try {
            const userData = JSON.parse(userStr);
            setUser(userData);
            // Verify if user role is restaurant (or similar check)
            // strict check might be improved, for now ensuring login
        } catch (e) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="flex min-h-screen bg-[#F3F7FA] font-sans">
            <RestaurantSidebar restaurantName={user?.restaurant?.name} />

            <div className="flex-1 ml-64 flex flex-col">
                <RestaurantHeader user={user} />

                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default RestaurantLayout;
