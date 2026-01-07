'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiList, FiPlusSquare, FiUser, FiLogOut } from 'react-icons/fi';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface SidebarProps {
    role: string;
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const links = [
        { name: 'Dashboard', href: `/dashboard/${role}`, icon: FiHome },
        // Add specific links based on role
        ...(role === 'farmer' ? [
            // maybe separate create and view? For now dashboard has both.
        ] : []),
        ...(role === 'company' ? [
            { name: 'Browse Waste', href: '/dashboard/company', icon: FiList },
        ] : []),
    ];

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="hidden md:flex flex-col w-64 bg-white border-r h-[calc(100vh-64px)] fixed top-16 left-0">
            <div className="p-6 flex-1 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Icon size={20} />
                            {link.name}
                        </Link>
                    );
                })}
            </div>
            <div className="p-4 border-t">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
                >
                    <FiLogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
}
