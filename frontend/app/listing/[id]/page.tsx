'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FiMapPin, FiPackage, FiDollarSign, FiUser, FiPhone, FiMail } from 'react-icons/fi';

export default function ListingDetail() {
    const params = useParams();
    const [listing, setListing] = useState<any>(null);

    useEffect(() => {
        if (params.id) {
            api.get(`/waste/${params.id}`)
                .then(res => setListing(res.data.data))
                .catch(err => console.error(err));
        }
    }, [params.id]);

    if (!listing) return <div className="p-8 text-center text-gray-500">Loading details...</div>;

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <Card className="overflow-hidden">
                    <div className="relative h-96 bg-gray-200">
                        {listing.image_url ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${listing.image_url}`}
                                alt={listing.type}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-lg">No Image Available</div>
                        )}
                        <div className="absolute top-4 right-4">
                            <Badge className={`px-4 py-1 text-sm shadow-md ${listing.status === 'approved' ? 'bg-green-500 text-white border-none' :
                                    'bg-yellow-500 text-white border-none'
                                }`}>
                                {listing.status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{listing.type}</h1>
                                <div className="flex items-center text-gray-500 gap-2">
                                    <FiMapPin />
                                    {listing.location}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-green-600">₹{listing.price}</div>
                                <div className="text-sm text-gray-400">Fixed Cost</div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <FiPackage /> Product Details
                                </h3>
                                <div className="space-y-3 text-gray-600">
                                    <div className="flex justify-between border-b pb-2">
                                        <span>Quantity Available</span>
                                        <span className="font-medium text-gray-900">{listing.quantity}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span>Organic Type</span>
                                        <span className="font-medium text-gray-900">Agriculture Waste</span>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <span>Posted Date</span>
                                        <span className="font-medium text-gray-900">{new Date(listing.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <FiUser /> Seller Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                            {listing.farmer_name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{listing.farmer_name}</div>
                                            <div className="text-xs text-gray-500">Verified Farmer</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        {listing.farmer_email && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FiMail className="text-green-600" />
                                                {listing.farmer_email}
                                            </div>
                                        )}
                                        {listing.farmer_phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FiPhone className="text-green-600" />
                                                {listing.farmer_phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 border-t pt-8">
                            <Button variant="outline" onClick={() => window.history.back()}>
                                Back to Browsing
                            </Button>
                            <Button size="lg" className="shadow-lg shadow-green-200">
                                Contact Seller Now
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
