import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantLayout from './RestaurantLayout';

const CreateMenu: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('45.00');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Tags and Cuisine State
    const [cuisine, setCuisine] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const availableTags = [
        "VEGAN", "VEGETARIAN", "EGG", "HALAL", "DAIRY",
        "NUTS", "PEANUTS", "PORK", "GLUTEN_FREE"
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(prev => prev.filter(t => t !== tag));
        } else {
            setSelectedTags(prev => [...prev, tag]);
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
            formData.append('cuisine', cuisine);
            formData.append('tags', JSON.stringify(selectedTags));
            if (image) {
                formData.append('image', image);
            }

            const res = await fetch('/bitenow/menus', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error("Failed to parse JSON response:", text);
                throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
            }

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            alert('Menu Item Created Successfully!');
            navigate('/restaurant/dashboard'); // Redirect to dashboard

        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RestaurantLayout>
            <div className="flex items-center justify-between mb-8">
                {/* Breadcrumb would go here if needed, title is in header/layout */}
                <div></div>
                <div className="flex gap-4">
                    <button className="text-gray-500 font-bold hover:text-gray-700">
                        &lt; Back to Menu List
                    </button>
                    <button
                        onClick={(e) => handleSubmit(e as any)}
                        disabled={loading}
                        className="bg-[#84D14D] hover:bg-green-600 text-white font-bold py-2 px-8 rounded shadow-sm disabled:opacity-50"
                    >
                        {loading ? 'SAVING...' : 'SAVE'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">

                {/* Left Column (Main Info) */}
                <div className="col-span-12 lg:col-span-8 space-y-6">

                    {/* ITEM INFORMATION */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800 tracking-wide text-sm uppercase">ITEM INFORMATON</h3>

                            <div className="flex items-center gap-2">
                                {/* Actions removed as requested */}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-200 rounded p-3 text-gray-700 focus:outline-none focus:border-brand-red"
                                    placeholder="Chickent Burger"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-gray-200 rounded p-3 text-gray-700 resize-none focus:outline-none focus:border-brand-red"
                                />
                            </div>
                        </div>
                    </div>

                    {/* PRICING */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 tracking-wide text-sm uppercase mb-6">PRICING</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full border border-gray-200 rounded p-3 text-gray-700 focus:outline-none focus:border-brand-red"
                                />
                            </div>
                            <button className="mt-6 text-gray-400 italic text-sm hover:text-red-500">
                                Delet Price
                            </button>
                        </div>
                    </div>

                    {/* TAGS & CUISINE */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 tracking-wide text-sm uppercase mb-6">TAGS & CUISINE</h3>

                        {/* Cuisine Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Cuisine</label>
                            <input
                                type="text"
                                value={cuisine}
                                onChange={(e) => setCuisine(e.target.value)}
                                className="w-full border border-gray-200 rounded p-3 text-gray-700 focus:outline-none focus:border-brand-red"
                                placeholder="e.g. Italian, Mexican, Burger"
                            />
                        </div>

                        {/* Selected Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {selectedTags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-xs font-bold flex items-center gap-2 border border-brand-red/20">
                                    {tag}
                                    <button onClick={() => toggleTag(tag)} className="hover:text-red-700">×</button>
                                </span>
                            ))}
                        </div>

                        {/* Available Tags Selection */}
                        <div>
                            <label className="text-gray-500 text-sm mb-2 block">Select Tags</label>
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${selectedTags.includes(tag)
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-brand-red hover:text-brand-red'
                                            }`}
                                        disabled={selectedTags.includes(tag)}
                                    >
                                        {tag} +
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Pricing Options & Photo) */}
                <div className="col-span-12 lg:col-span-4 space-y-6">

                    {/* PRICING OPTIONS */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 tracking-wide text-sm uppercase mb-6">PRICING OPTIONS</h3>
                        <div className="grid grid-cols-2 gap-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red" />
                                <span className="text-gray-600 text-sm">Price Label</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red" />
                                <span className="text-gray-600 text-sm">Price Unit</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red" />
                                <span className="text-gray-600 text-sm">Price Range</span>
                            </label>
                        </div>
                    </div>

                    {/* FEATURED PHOTO */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 tracking-wide text-sm uppercase mb-6">FEATURED PHOTO</h3>

                        <div className="mb-4">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full aspect-square object-cover rounded-lg border border-gray-100" />
                            ) : (
                                <div className="w-full aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-4xl">🍕</span>
                                        <p className="text-xs text-gray-400 mt-2">No image selected</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Alt Text</label>
                                <input type="text" placeholder="Pizza.jpeg" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-600" />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <label className="cursor-pointer">
                                    <span className="text-[#84D14D] text-sm font-medium hover:underline">Add another</span>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </RestaurantLayout>
    );
};

export default CreateMenu;
