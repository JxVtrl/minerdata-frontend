import { useEffect, useState } from 'react';
import api from '../services/api';

type AuthResponse = {
    id: number;
    name: string;
    email: string;
};

export function useAuth() {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await api.get('/verify');
                setUser(res.data);
            } catch (err) {
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, []);

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
    };
}
