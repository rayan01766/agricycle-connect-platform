'use client';
import Sidebar from '@/components/layout/Sidebar';
import { getUserRole } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        setRole(getUserRole());
    }, []);

    if (!role) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="flex">
            <Sidebar role={role} />
            <div className="flex-1 md:ml-64 p-6 min-h-[calc(100vh-64px)] bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
