'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FiSearch, FiFilter } from 'react-icons/fi';
import Link from 'next/link';

interface Listing {
    id: number;
    type: string;
    quantity: string;
    price: string;
    location: string;
    farmer_name: string;
    image_url: string;
}

export default function CompanyDashboard() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await api.get('/waste');
                if (res.data.success) {
                    setListings(res.data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchListings();
    }, []);

    const filteredListings = listings.filter(l =>
        l.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Marketplace</h1>
                <p className="text-gray-500">Discover and buy agricultural waste</p>
            </div>

            <div className="flex gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm">
                <div className="flex-1">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by crop type or location..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <Button variant="secondary">
                    <FiFilter size={18} /> Filters
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                    <Card key={listing.id} className="flex flex-col h-full hover:shadow-2xl transition-all duration-300">
                        <div className="h-48 w-full bg-gray-200 relative overflow-hidden group">
                            {listing.image_url ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${listing.image_url}`}
                                    alt={listing.type}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                                <h3 className="text-white font-bold text-lg">{listing.type}</h3>
                                <p className="text-green-300 font-medium">₹{listing.price}</p>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col gap-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Quantity: <strong>{listing.quantity}</strong></span>
                                <span>Loc: <strong>{listing.location}</strong></span>
                            </div>
                            <div className="text-xs text-gray-500">
                                Seller: {listing.farmer_name}
                            </div>

                            <div className="mt-auto">
                                <Link href={`/listing/${listing.id}`} className="block">
                                    <Button className="w-full">View Details</Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}

                {filteredListings.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg">
                        No listings found matching your search.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
