import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import Footer from './Footer';

const EditMenu: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [existingImage, setExistingImage] = useState<string>('');
    const [preview, setPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    // Fetch existing menu data
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await fetch(`/bitenow/menus/item/${id}`);
                const data = await res.json();

                if (data.menu) {
                    setName(data.menu.name);
                    setDescription(data.menu.description || '');
                    setPrice(data.menu.price.toString());
                    if (data.menu.image) {
                        setExistingImage(data.menu.image);
                        setPreview(data.menu.image);
                    }
                }
            } catch (error) {
                console.error(error);
                alert("Failed to load menu data");
            } finally {
                setFetchingData(false);
            }
        };

        fetchMenu();
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            alert("You must be logged in.");
            navigate('/');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            if (image) {
                formData.append('image', image);
            }

            const res = await fetch(`/bitenow/menus/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                alert("Menu updated successfully!");
                navigate('/my-menus');
            } else {
                const errorText = await res.text();
                try {
                    const errorData = JSON.parse(errorText);
                    alert(errorData.message || "Failed to update menu");
                } catch {
                    console.error("Server returned non-JSON response:", errorText);
                    alert("Failed to update menu. Server error.");
                }
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="min-h-screen bg-[#F9FAFB]">
                <DashboardHeader />
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <DashboardHeader />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Edit Menu Item</h1>
                    <p className="mt-1 text-sm text-gray-500">Update your dish details and pricing.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                            Dish Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="block w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red transition-all"
                            placeholder="e.g., Signature Burger"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-bold text-gray-900 mb-2">
                            Price ($) *
                        </label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            step="0.01"
                            min="0"
                            className="block w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red transition-all"
                            placeholder="9.99"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="block w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red transition-all resize-none"
                            placeholder="Describe your dish..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Dish Photo {image ? '' : '(Keep existing or upload new)'}
                        </label>
                        <div className="mt-2">
                            <label
                                htmlFor="image-upload"
                                className="relative cursor-pointer bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-brand-red transition-all p-6 flex flex-col items-center justify-center group"
                            >
                                {preview ? (
                                    <div className="relative w-full h-64">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-xl flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 font-bold">
                                                Click to change
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-brand-red transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500 group-hover:text-gray-700">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                                    </>
                                )}
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="sr-only"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/my-menus')}
                            className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-red hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                        >
                            {loading ? 'Updating...' : 'Update Menu Item'}
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default EditMenu;
