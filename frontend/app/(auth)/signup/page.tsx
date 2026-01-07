'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { FaTractor, FaBuilding, FaUserPlus, FaArrowRight } from 'react-icons/fa';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'farmer',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.name || !formData.email || !formData.password || !formData.role) {
            toast.error('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        try {
            const res = await api.post('/api/auth/register', formData);
            if (res.data.success) {
                toast.success('Account created successfully!');
                localStorage.setItem('token', res.data.token);
                router.push(`/dashboard/${formData.role}`);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-xl shadow-2xl border-0 overflow-hidden relative z-10 transition-all duration-300 hover:shadow-green-900/10">
                <div className="flex flex-col md:flex-row h-full">
                    {/* Left Side - Visual & Info */}
                    <div className="md:w-5/12 bg-gradient-to-br from-green-600 to-emerald-700 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">Join Us</h2>
                            <p className="text-green-100 text-sm">Be part of the sustainable agricultural revolution.</p>
                        </div>

                        <div className="relative z-10 my-8 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-green-50">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <FaTractor className="w-4 h-4" />
                                </div>
                                <p>Connect with verified farmers</p>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-green-50">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <FaBuilding className="w-4 h-4" />
                                </div>
                                <p>Trade efficiently with businesses</p>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-green-50">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <FaUserPlus className="w-4 h-4" />
                                </div>
                                <p>Quick and secure easy signup</p>
                            </div>
                        </div>

                        <div className="relative z-10 mt-auto">
                            <p className="text-xs text-green-200">© 2024 AgriCycle Connect</p>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="md:w-7/12 p-8 md:p-10">
                        <div className="text-left mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Create Account</h3>
                            <p className="text-sm text-gray-500">Choose your role to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Role Selection */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'farmer' })}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 group ${formData.role === 'farmer'
                                            ? 'border-green-500 bg-green-50/50 text-green-700'
                                            : 'border-gray-100 bg-gray-50/50 text-gray-500 hover:border-green-200 hover:bg-green-50/30'
                                        }`}
                                >
                                    <FaTractor className={`w-6 h-6 ${formData.role === 'farmer' ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'}`} />
                                    <span className="font-semibold text-sm">Farmer</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'company' })}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 group ${formData.role === 'company'
                                            ? 'border-green-500 bg-green-50/50 text-green-700'
                                            : 'border-gray-100 bg-gray-50/50 text-gray-500 hover:border-green-200 hover:bg-green-50/30'
                                        }`}
                                >
                                    <FaBuilding className={`w-6 h-6 ${formData.role === 'company' ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'}`} />
                                    <span className="font-semibold text-sm">Buyer</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="bg-gray-50 focus:bg-white"
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="bg-gray-50 focus:bg-white"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        min={6}
                                        className="bg-gray-50 focus:bg-white"
                                    />
                                    <Input
                                        label="Phone"
                                        placeholder="+91 987..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-200 shadow-xl"
                                isLoading={isLoading}
                                size="lg"
                            >
                                Create Account <FaArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500">
                                Already have an account?{' '}
                                <Link href="/login" className="text-green-600 font-bold hover:text-green-700 hover:underline transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
