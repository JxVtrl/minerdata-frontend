import { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await login(username, password);
            localStorage.setItem('token', token);
            navigate('/');
        } catch (err) {
            setError('Usuário ou senha inválidos');
        }
    };

    // Se já estiver logado, redireciona automaticamente
    if (isLoading) return <p>Carregando...</p>;
    if (user) {
        navigate('/');
        return null;
    }

    return (
        <form onSubmit={handleLogin} style={{ padding: '2rem' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <input
                    type="text"
                    placeholder="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Entrar</button>
        </form>
    );
}
