import { jwtDecode } from 'jwt-decode';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'farmer' | 'company' | 'admin';
    phone?: string;
}

export interface AuthResponse {
    token: string;
    user: User; // Backend returns token, need to decode or store user
}

// Helper to check if user is authenticated
export const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
};

export const getUserRole = (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const decoded: any = jwtDecode(token);
        return decoded.role;
    } catch (e) {
        return null;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};
