import { useAuth } from '../hooks/useAuth';

export default function DebugInfo() {
    const { user, isAdmin, isLoading, login, logout } = useAuth();

    const handleAdminLogin = async () => {
        try {
            await login('admin@minerdata.dev', 'admin123');
        } catch (error) {
            console.error('Erro no login:', error);
        }
    };

    const handleUserLogin = async () => {
        try {
            await login('joao@minerdata.dev', 'joao123');
        } catch (error) {
            console.error('Erro no login:', error);
        }
    };

    return (
        <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded z-50 max-w-sm">
            <h3 className="font-bold">Debug Info:</h3>
            <p>Loading: {isLoading ? 'true' : 'false'}</p>
            <p>User: {user ? JSON.stringify(user) : 'null'}</p>
            <p>isAdmin: {isAdmin ? 'true' : 'false'}</p>
            <p>Token: {localStorage.getItem('token') ? 'exists' : 'missing'}</p>

            <div className="mt-3 space-y-2">
                <button
                    onClick={handleAdminLogin}
                    className="w-full bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                    Login Admin
                </button>
                <button
                    onClick={handleUserLogin}
                    className="w-full bg-green-500 text-white px-2 py-1 rounded text-sm"
                >
                    Login User
                </button>
                <button
                    onClick={logout}
                    className="w-full bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                    Logout
                </button>
            </div>
        </div>
    );
} 