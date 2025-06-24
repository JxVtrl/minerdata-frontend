import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Bem-vindo, {user?.username}</h2>
            <p>Você está autenticado.</p>
            <button onClick={handleLogout}>Sair</button>
        </div>
    );
}
