import { useEffect, useState } from 'react';

interface User {
    id: number;
    username: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        fetch('http://localhost:3001/verify', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Token inválido');
                return res.json();
            })
            .then((data) => {
                setUser(data.user);
            })
            .catch(() => {
                localStorage.removeItem('token');
            })
            .finally(() => setLoading(false));
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return { user, loading, logout };
}
