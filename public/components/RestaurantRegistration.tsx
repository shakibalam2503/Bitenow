import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import Footer from './Footer';

const RestaurantRegistration: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const mapRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<any>(null);

    // Initialize Leaflet map
    useEffect(() => {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Add custom CSS for map styling
        const style = document.createElement('style');
        style.textContent = `
            .leaflet-container {
                background: #f9fafb;
            }
            .leaflet-control-zoom a {
                background-color: white !important;
                color: #374151 !important;
                border: 1px solid #e5e7eb !important;
            }
            .leaflet-control-zoom a:hover {
                background-color: #fee2e2 !important;
                color: #dc2626 !important;
                border-color: #dc2626 !important;
            }
            .leaflet-bar {
                border: none !important;
                box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1) !important;
            }
        `;
        document.head.appendChild(style);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;

        script.onload = () => {
            if (mapContainerRef.current && !(window as any).L) return;

            const L = (window as any).L;

            // Initialize map centered on Dhaka with closer zoom
            mapRef.current = L.map(mapContainerRef.current).setView([23.8103, 90.4125], 12);

            // Use CartoDB Positron tiles for a cleaner, lighter look
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap contributors © CARTO',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(mapRef.current);

            // Create custom red marker icon
            const redIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="
                    background-color: #dc2626;
                    width: 30px;
                    height: 30px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 3px solid white;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                ">
                    <div style="
                        width: 10px;
                        height: 10px;
                        background-color: white;
                        border-radius: 50%;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    "></div>
                </div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });

            // Handle map clicks
            mapRef.current.on('click', (e: any) => {
                const { lat, lng } = e.latlng;
                setLatitude(lat);
                setLongitude(lng);

                // Remove existing marker
                if (markerRef.current) {
                    mapRef.current.removeLayer(markerRef.current);
                }

                // Add new marker with custom red icon
                markerRef.current = L.marker([lat, lng], { icon: redIcon }).addTo(mapRef.current);
            });
        };

        document.head.appendChild(script);

        // Cleanup
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
            document.head.removeChild(link);
            document.head.removeChild(script);
            document.head.removeChild(style);
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');

        try {
            // Create FormData for multipart/form-data
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('address', formData.address);

            if (latitude !== null) {
                formDataToSend.append('latitude', latitude.toString());
            }
            if (longitude !== null) {
                formDataToSend.append('longitude', longitude.toString());
            }
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            const res = await fetch('/bitenow/restaurants/register', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            alert('Registration Successful! Awaiting admin approval.');
            navigate('/dashboard');

        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="hidden lg:block">
                <DashboardHeader />
            </div>

            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                {/* Visual Side (Left) */}
                <div className="hidden lg:flex lg:w-5/12 relative bg-black overflow-hidden flex-col justify-between p-12 text-white">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/assets/chef_background.png"
                            alt="Chef plating food"
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>

                    <div className="relative z-10 pt-20">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">Partner with Bitenow</h1>
                        <p className="text-lg text-gray-300 max-w-sm font-light leading-relaxed">
                            Expand your reach, manage orders efficiently, and grow your culinary business with our premium delivery network.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center space-x-4 text-sm font-medium text-gray-400">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-black flex items-center justify-center text-xs">A</div>
                                <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-black flex items-center justify-center text-xs">B</div>
                                <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-black flex items-center justify-center text-xs">C</div>
                            </div>
                            <span>Join 500+ Top Restaurants</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            © 2025 Bitenow Inc. All rights reserved.
                        </div>
                    </div>
                </div>

                {/* Form Side (Right) */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 overflow-y-auto bg-white">
                    <div className="w-full max-w-2xl space-y-10">
                        <div className="lg:hidden text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-gray-900">Partner with Bitenow</h2>
                            <p className="text-gray-500 mt-2">Create your restaurant profile</p>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">Application Form</h2>
                            <p className="text-gray-500 hidden lg:block">Fill in the details below to register your restaurant.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Restaurant Name */}
                            <div className="space-y-1">
                                <label className={`text-sm font-semibold transition-colors duration-200 ${focusedField === 'name' ? 'text-brand-red' : 'text-gray-600'}`}>
                                    Restaurant Name
                                </label>
                                <div className={`relative flex items-center border rounded-xl transition-all duration-300 ${focusedField === 'name' ? 'border-brand-red ring-4 ring-brand-red/10' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <div className="pl-4 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        placeholder="e.g. The Gourmet Kitchen"
                                        className="w-full h-12 px-3 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div className="space-y-1">
                                    <label className={`text-sm font-semibold transition-colors duration-200 ${focusedField === 'email' ? 'text-brand-red' : 'text-gray-600'}`}>
                                        Business Email
                                    </label>
                                    <div className={`relative flex items-center border rounded-xl transition-all duration-300 ${focusedField === 'email' ? 'border-brand-red ring-4 ring-brand-red/10' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="pl-4 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            placeholder="contact@domain.com"
                                            className="w-full h-12 px-3 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-1">
                                    <label className={`text-sm font-semibold transition-colors duration-200 ${focusedField === 'phone' ? 'text-brand-red' : 'text-gray-600'}`}>
                                        Phone Number
                                    </label>
                                    <div className={`relative flex items-center border rounded-xl transition-all duration-300 ${focusedField === 'phone' ? 'border-brand-red ring-4 ring-brand-red/10' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="pl-4 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('phone')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            placeholder="+880 1700-000000"
                                            className="w-full h-12 px-3 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-1">
                                <label className={`text-sm font-semibold transition-colors duration-200 ${focusedField === 'address' ? 'text-brand-red' : 'text-gray-600'}`}>
                                    Business Address
                                </label>
                                <div className={`relative flex items-start border rounded-xl transition-all duration-300 ${focusedField === 'address' ? 'border-brand-red ring-4 ring-brand-red/10' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <div className="pl-4 pt-3.5 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('address')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        placeholder="Full business address"
                                        className="w-full h-24 px-3 py-3 bg-transparent outline-none text-gray-800 placeholder-gray-400 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Map Location Picker */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600">
                                    Pick Location on Map (Optional)
                                </label>
                                <div
                                    ref={mapContainerRef}
                                    className="w-full h-80 rounded-xl border-2 border-gray-200 overflow-hidden"
                                    style={{ zIndex: 1 }}
                                />
                                {latitude !== null && longitude !== null && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Selected: <span className="font-mono font-semibold">{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
                                    </p>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600">
                                    Restaurant Photo/Banner (Optional)
                                </label>
                                <label className="cursor-pointer block">
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-brand-red transition-colors">
                                        {imagePreview ? (
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600 font-medium mb-1">{imageFile?.name}</p>
                                                    <p className="text-xs text-gray-400">Click to change image</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-red hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transform transition-all duration-200 hover:scale-[1.01] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-lg">
                                            Submit Application
                                            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </span>
                                    )}
                                </button>
                                <p className="mt-6 text-center text-xs text-gray-500">
                                    By registering, you agree to our <a href="#" className="text-brand-red hover:underline">Terms of Service</a> and <a href="#" className="text-brand-red hover:underline">Partner Agreement</a>.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="lg:hidden">
                <Footer />
            </div>
        </div>
    );
};

export default RestaurantRegistration;
