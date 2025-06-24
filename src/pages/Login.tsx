import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, user, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch {
            setError('Usuário ou senha inválidos');
        }
    };

    if (isLoading) return <p className="text-center mt-10 text-gray-500">Carregando...</p>;
    if (user) {
        navigate('/');
        return null;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md"
            >
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="exemplo@dominio.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                        Senha
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-200"
                >
                    Entrar
                </button>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                            Criar conta
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
