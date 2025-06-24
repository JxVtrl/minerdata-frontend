import { useSocket } from '../hooks/useSocket';
import { useState, useEffect } from 'react';

interface CrawlerControlProps {
    onCrawlerComplete?: () => void;
}

interface Source {
    id: string;
    name: string;
    description: string;
    url: string;
}

export default function CrawlerControl({ onCrawlerComplete }: CrawlerControlProps) {
    const { progress, done, message } = useSocket();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [sources, setSources] = useState<Source[]>([]);

    useEffect(() => {
        fetchSources();
    }, []);

    const fetchSources = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/crawler/sources`);
            const data = await response.json();
            setSources(data);
        } catch (err) {
            console.error('Erro ao buscar fontes:', err);
        }
    };

    const iniciarCrawler = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/crawler/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            await response.json();
        } catch (err) {
            console.error('Erro ao iniciar crawler:', err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    };

    // Notifica quando o crawler termina
    if (done && onCrawlerComplete) {
        onCrawlerComplete();
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Controle do Crawler</h2>
                    <p className="text-sm text-gray-600">Execute o crawler para coletar dados de fontes oficiais</p>
                </div>

                {/* Fontes de Dados */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">Fontes de Dados:</h3>
                    <div className="space-y-2">
                        {sources.map((source) => (
                            <div key={source.id} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-gray-900">{source.name}</div>
                                    <div className="text-xs text-gray-500">{source.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                        <div className="font-medium mb-1">Erro:</div>
                        {error}
                    </div>
                )}

                {/* Control Button */}
                <div className="text-center">
                    <button
                        onClick={iniciarCrawler}
                        disabled={isLoading}
                        className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isLoading
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Iniciando...
                            </div>
                        ) : (
                            'Iniciar Crawler'
                        )}
                    </button>
                </div>

                {/* Progress Section */}
                {(progress > 0 || isLoading) && (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Progresso:</span>
                            <span className="font-mono font-medium text-gray-900">{progress}%</span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        {/* Progress Message */}
                        {message && (
                            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                {message}
                            </div>
                        )}
                    </div>
                )}

                {/* Status */}
                {done && (
                    <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-green-800 font-medium">✓ Crawler Finalizado!</div>
                        <div className="text-green-600 text-sm mt-1">Dados coletados de fontes oficiais</div>
                    </div>
                )}

                {/* Info */}
                <div className="text-xs text-gray-500 text-center">
                    <p>O crawler coleta dados de:</p>
                    <p className="mt-1">ANM, DOU e IBGE</p>
                </div>
            </div>
        </div>
    );
}
