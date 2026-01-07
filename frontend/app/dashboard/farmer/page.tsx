'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiMapPin, FiPackage, FiDollarSign } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Listing {
    id: number;
    type: string;
    quantity: string;
    price: string;
    status: 'pending' | 'approved' | 'rejected';
    image_url: string;
    location: string;
}

export default function FarmerDashboard() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        type: '',
        quantity: '',
        price: '',
        location: '',
    });
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const res = await api.get('/waste/my');
            setListings(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load listings');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.type || !formData.quantity || !formData.price || !formData.location) {
            toast.error('Please fill all fields');
            setIsLoading(false);
            return;
        }

        const data = new FormData();
        data.append('type', formData.type);
        data.append('quantity', formData.quantity);
        data.append('price', formData.price);
        data.append('location', formData.location);
        if (image) {
            data.append('image', image);
        }

        try {
            await api.post('/waste', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Listing created successfully!');
            fetchListings();
            setFormData({ type: '', quantity: '', price: '', location: '' });
            setImage(null);
            setIsModalOpen(false);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to create listing');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;
        try {
            await api.delete(`/waste/${id}`);
            toast.success('Listing deleted');
            setListings(listings.filter(l => l.id !== id));
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'danger';
            default: return 'warning';
        }
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
                    <p className="text-gray-500">Manage your waste listings here</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <FiPlus size={20} />
                    Add New Listing
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                    <Card key={listing.id} className="flex flex-col h-full">
                        <div className="relative h-48 w-full bg-gray-200">
                            {listing.image_url ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${listing.image_url}`}
                                    alt={listing.type}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    No Image
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <Badge variant={getStatusVariant(listing.status)} className="shadow-sm">
                                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{listing.type}</h3>

                            <div className="space-y-2 text-sm text-gray-600 flex-1">
                                <div className="flex items-center gap-2">
                                    <FiPackage className="text-green-600" />
                                    <span>{listing.quantity}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiDollarSign className="text-green-600" />
                                    <span>₹{listing.price}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiMapPin className="text-green-600" />
                                    <span>{listing.location}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t">
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => handleDelete(listing.id)}
                                >
                                    <FiTrash2 size={16} />
                                    Delete Listing
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
                {listings.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No listings found. Create your first listing now!</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Listing">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Waste Type"
                        placeholder="e.g. Rice Husk"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    />
                    <Input
                        label="Quantity"
                        placeholder="e.g. 50 kg"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                    <Input
                        label="Expected Price (₹)"
                        type="number"
                        placeholder="e.g. 500"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                    <Input
                        label="Location"
                        placeholder="Village/City"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            Create Listing
                        </Button>
                    </div>
                </form>
            </Modal>

        </DashboardLayout>
    );
}
