'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Basic validation
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            const res = await api.post('/api/auth/login', formData);
            if (res.data.success) {
                toast.success('Welcome back!');
                localStorage.setItem('token', res.data.token);
                const role = res.data.role;
                router.push(`/dashboard/${role}`);
            } else {
                toast.error(res.data.message || 'Login failed');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50">
            <Card className="w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in to your AgriCycle account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-green-600 font-semibold hover:underline">
                        Create account
                    </Link>
                </div>
            </Card>
        </div>
    );
}
