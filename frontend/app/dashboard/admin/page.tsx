'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toast } from 'react-hot-toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ImagePreviewModal } from '@/components/ui/ImagePreviewModal';

interface Listing {
    id: number;
    type: string;
    quantity: string;
    price: string;
    status: 'pending' | 'approved' | 'rejected';
    farmer_name: string;
    created_at: string;
    image_url: string;
}

export default function AdminDashboard() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const res = await api.get('/waste?all=true');
            if (res.data.success) {
                setListings(res.data.data);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load listings');
        }
    };

    const handleStatus = async (id: number, status: 'approved' | 'rejected') => {
        try {
            const res = await api.patch(`/waste/${id}/status`, { status });
            if (res.data.success) {
                toast.success(`Listing ${status}`);
                fetchListings();
            }
        } catch (err) {
            toast.error('Action failed');
        }
    };

    const pendingListings = listings.filter(l => l.status === 'pending');
    const otherListings = listings.filter(l => l.status !== 'pending');

    return (
        <DashboardLayout>
            <ImagePreviewModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageUrl={selectedImage || ''}
            />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Console</h1>
                <p className="text-gray-500">Oversee platform activity</p>
            </div>

            {pendingListings.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-yellow-500 pl-3">Pending Approvals</h2>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Qty</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pendingListings.map(listing => (
                                    <tr key={listing.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {listing.image_url ? (
                                                <div
                                                    className="w-[110px] h-[110px] rounded-lg shadow-sm overflow-hidden cursor-pointer group"
                                                    onClick={() => setSelectedImage(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${listing.image_url}`)}
                                                >
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${listing.image_url}`}
                                                        alt={listing.type}
                                                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-[110px] h-[110px] bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">No Img</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{listing.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{listing.farmer_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{listing.quantity} @ ₹{listing.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Button size="sm" onClick={() => handleStatus(listing.id, 'approved')}>Approve</Button>
                                            <Button size="sm" variant="danger" onClick={() => handleStatus(listing.id, 'rejected')}>Reject</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Listing History</h2>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {otherListings.map(listing => (
                                    <tr key={listing.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {listing.image_url ? (
                                                <div
                                                    className="w-[110px] h-[110px] rounded-lg shadow-sm overflow-hidden cursor-pointer group"
                                                    onClick={() => setSelectedImage(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${listing.image_url}`)}
                                                >
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${listing.image_url}`}
                                                        alt={listing.type}
                                                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-[110px] h-[110px] bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">No Img</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{listing.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{listing.farmer_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={listing.status === 'approved' ? 'success' : 'danger'}>
                                                {listing.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                            {new Date(listing.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
