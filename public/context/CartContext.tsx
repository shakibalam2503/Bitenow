import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    menuId: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    restaurantId: string;
    restaurantName: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (menuId: string) => void;
    updateQuantity: (menuId: string, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (newItem: CartItem) => {
        setItems(prev => {
            // Check if item exists
            const existingItem = prev.find(item => item.menuId === newItem.menuId);

            // Check if adding item from different restaurant
            if (prev.length > 0 && prev[0].restaurantId !== newItem.restaurantId) {
                if (!window.confirm('Adding items from a different restaurant will clear your current cart. Do you want to proceed?')) {
                    return prev;
                }
                return [newItem];
            }

            if (existingItem) {
                return prev.map(item =>
                    item.menuId === newItem.menuId
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (menuId: string) => {
        setItems(prev => prev.filter(item => item.menuId !== menuId));
    };

    const updateQuantity = (menuId: string, delta: number) => {
        setItems(prev => {
            return prev.map(item => {
                if (item.menuId === menuId) {
                    return { ...item, quantity: item.quantity + delta };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            itemCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
