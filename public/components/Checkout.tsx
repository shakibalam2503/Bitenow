import React, { useState } from 'react';
// Checkout component
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import DashboardHeader from './DashboardHeader';
import Footer from './Footer';

interface PaymentResponse {
    message: string;
    transactionId: string;
    amount: number;
    paymentMethod: string;
}

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, cartTotal, clearCart, removeFromCart, updateQuantity } = useCart();
    const [loading, setLoading] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
    const [phoneNumber, setPhoneNumber] = useState('');

    const DELIVERY_FEE = 50;
    const TOTAL_AMOUNT = cartTotal + DELIVERY_FEE;

    const handlePlaceOrder = async () => {
        if (!deliveryAddress) {
            alert('Please enter delivery address');
            return;
        }

        if (paymentMethod === 'ONLINE' && !phoneNumber) {
            alert('Please enter phone number for bKash payment');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            // Check for stale cart data (missing restaurantId)
            if (!items[0]?.restaurantId) {
                if (window.confirm('Your cart contains outdated items that are missing required information. Would you like to clear your cart and start fresh?')) {
                    clearCart();
                    navigate('/dashboard');
                }
                return;
            }

            // 1. Create Order
            const orderRes = await fetch('/bitenow/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    restaurantId: items[0].restaurantId,
                    items: items.map(item => ({
                        menuId: item.menuId,
                        quantity: item.quantity
                    })),
                    deliveryAddress,
                    deliveryInstructions,
                    paymentMethod: paymentMethod === 'ONLINE' ? 'ONLINE' : 'COD'
                })
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.message || 'Failed to place order');
            }

            // 2. Handle Payment
            if (paymentMethod === 'ONLINE') {
                const paymentRes = await fetch('/bitenow/payments/simulate-bkash', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        orderId: orderData.order._id,
                        phoneNumber: phoneNumber
                    })
                });

                const paymentData = await paymentRes.json();

                if (!paymentRes.ok) {
                    throw new Error(paymentData.message || 'Payment failed');
                }

                alert(`Order Placed Successfully! Payment Transaction ID: ${paymentData.transactionId}`);
            } else {
                alert('Order Placed Successfully! Please pay cash on delivery.');
            }

            clearCart();
            navigate('/dashboard');

        } catch (error: any) {
            console.error('Order error:', error);
            alert(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#F9FAFB]">
                <DashboardHeader />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-brand-red text-white font-bold py-3 px-8 rounded-full hover:bg-red-600 transition-colors"
                    >
                        Browse Food
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <DashboardHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-red-100 text-brand-red flex items-center justify-center text-sm">1</span>
                                Delivery Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                                    <textarea
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                                        rows={3}
                                        placeholder="Enter your full delivery address"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions (Optional)</label>
                                    <input
                                        type="text"
                                        value={deliveryInstructions}
                                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                                        placeholder="e.g. Ring the doorbell, Leave at front desk"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-red-100 text-brand-red flex items-center justify-center text-sm">2</span>
                                Payment Method
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPaymentMethod('COD')}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'COD'
                                        ? 'border-brand-red bg-red-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-brand-red' : 'border-gray-300'
                                        }`}>
                                        {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-brand-red" />}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900">Cash on Delivery</p>
                                        <p className="text-xs text-gray-500">Pay when you receive</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('ONLINE')}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'ONLINE'
                                        ? 'border-brand-red bg-red-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'ONLINE' ? 'border-brand-red' : 'border-gray-300'
                                        }`}>
                                        {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 rounded-full bg-brand-red" />}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900">Online Payment</p>
                                        <p className="text-xs text-gray-500">Pay via bKash</p>
                                    </div>
                                </button>
                            </div>

                            {paymentMethod === 'ONLINE' && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">bKash Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                                        placeholder="01XXXXXXXXX"
                                    />
                                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        This is a simulated payment. No real money will be deducted.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-28">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <p className="font-bold text-gray-900">{items[0]?.restaurantName}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.menuId} className="flex gap-3">
                                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-brand-red font-bold my-1">${item.price}</p>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.menuId, -1)}
                                                    className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-600"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xs font-bold text-gray-900 w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.menuId, 1)}
                                                    className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-600"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.menuId)}
                                                    className="ml-auto text-xs text-gray-400 hover:text-red-500"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>${DELIVERY_FEE.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                                    <span>Total</span>
                                    <span>${TOTAL_AMOUNT.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full bg-brand-red hover:bg-red-600 text-white font-bold py-4 rounded-xl mt-6 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Place Order
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Checkout;
