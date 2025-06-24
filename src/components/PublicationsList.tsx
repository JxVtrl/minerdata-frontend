import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import api from '../services/api';

interface Publication {
    id: number;
    title: string;
    content: string;
    source: string;
    link: string;
    published_at: string;
    created_at: string;
}

export interface PublicationsListRef {
    fetchPublications: () => void;
}

const PublicationsList = forwardRef<PublicationsListRef>((props, ref) => {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPublications = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/publications');
            setPublications(response.data);
        } catch (err) {
            console.error('Erro ao buscar publicações:', err);
            setError('Erro ao carregar publicações');
        } finally {
            setIsLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        fetchPublications
    }));

    useEffect(() => {
        fetchPublications();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                    <div className="text-gray-600">Carregando publicações...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-red-600 text-center">
                    <div className="text-lg font-medium mb-2">Erro ao carregar publicações</div>
                    <div className="text-sm">{error}</div>
                    <button
                        onClick={fetchPublications}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    if (publications.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center text-gray-500">
                    <div className="text-lg font-medium mb-2">Nenhuma publicação encontrada</div>
                    <div className="text-sm mb-4">Execute o crawler para coletar publicações</div>
                    <button
                        onClick={fetchPublications}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Atualizar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Publicações Coletadas
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {publications.length} publicação{publications.length !== 1 ? 'es' : ''} encontrada{publications.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={fetchPublications}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                        Atualizar
                    </button>
                </div>
            </div>

            {/* Publications Grid */}
            <div className="grid gap-6">
                {publications.map((publication) => (
                    <div
                        key={publication.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 pr-4">
                                {publication.title}
                            </h3>
                            {publication.source && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                                    {publication.source}
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            {publication.content}
                        </p>

                        <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-4">
                            <span>
                                Coletado em: {formatDate(publication.created_at)}
                            </span>
                            {publication.link && (
                                <a
                                    href={publication.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                >
                                    Ver fonte →
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

PublicationsList.displayName = 'PublicationsList';

export default PublicationsList; 