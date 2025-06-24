import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('token');

    if (!token) {
        toast.error('Sessão expirada. Faça login novamente.');
        return <Navigate to="/login" />;
    }

    // Verifica expiração se o token for JWT
    try {
        const [, payloadBase64] = token.split('.');
        const payload = JSON.parse(atob(payloadBase64));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
            toast.error('Sessão expirada. Faça login novamente.');
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }
    } catch (err) {
        toast.error('Erro ao validar sessão. Faça login novamente.');
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }

    return children;
}
