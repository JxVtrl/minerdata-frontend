import { useSocket } from '../hooks/useSocket';
import { useState } from 'react';

export default function CrawlerControl() {
    const { progress, done } = useSocket();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const iniciarCrawler = async () => {
        setIsLoading(true);
        setError('');

        try {
            console.log('Iniciando crawler...');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/crawler/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Crawler iniciado:', data);
        } catch (err) {
            console.error('Erro ao iniciar crawler:', err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded-xl bg-white shadow max-w-md mx-auto text-center space-y-4">
            <h2 className="text-lg font-bold">Iniciar Crawler</h2>

            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}

            <button
                onClick={iniciarCrawler}
                disabled={isLoading}
                className={`px-4 py-2 rounded text-white font-medium transition-colors ${isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {isLoading ? 'Iniciando...' : 'Iniciar'}
            </button>

            <div className="mt-4">
                <p>Progresso: <span className="font-mono">{progress}%</span></p>
                <div className="h-3 w-full bg-gray-200 rounded">
                    <div
                        className="h-3 bg-green-500 rounded transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {done && <p className="text-green-600 font-semibold">Crawler finalizado!</p>}
        </div>
    );
}
