import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
    }

    if (!user) {
        toast.error('Sessão expirada. Faça login novamente.');
        return <Navigate to="/login" />;
    }

    return children;
}
