'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated, logout, getUserRole } from '@/lib/auth';
import { Button } from './ui/Button';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuth, setIsAuth] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsAuth(isAuthenticated());
        setRole(getUserRole());
    }, [pathname]); // Re-check on route change

    const handleLogout = () => {
        logout();
        setIsAuth(false);
        setRole(null);
        router.push('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            A
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                            AgriCycle
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {!isAuth ? (
                            <>
                                <Link href="/login" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <div onClick={() => router.push('/signup')}>
                                    <Button size="sm">Get Started</Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={`/dashboard/${role}`}
                                    className={`text-sm font-medium transition-colors ${pathname.includes('/dashboard') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Button variant="secondary" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-green-600"
                    >
                        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg animate-in slide-in-from-top-5">
                    <div className="p-4 flex flex-col gap-4">
                        {!isAuth ? (
                            <>
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 font-medium p-2 hover:bg-gray-50 rounded">
                                    Login
                                </Link>
                                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full">Get Started</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={`/dashboard/${role}`} onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 font-medium p-2 hover:bg-gray-50 rounded">
                                    Dashboard
                                </Link>
                                <Button variant="danger" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                                    Logout
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
