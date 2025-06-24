import { useRef } from 'react';
import Navigation from '../components/Navigation';
import CrawlerControl from '../components/CrawlerControl';
import PublicationsList from '../components/PublicationsList';
import type { PublicationsListRef } from '../components/PublicationsList';

export default function Dashboard() {
    const publicationsListRef = useRef<PublicationsListRef>(null);

    const handleCrawlerComplete = () => {
        // Atualiza a lista de publicações quando o crawler termina
        if (publicationsListRef.current) {
            publicationsListRef.current.fetchPublications();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />

            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">Gerencie o crawler e visualize as publicações coletadas</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Sidebar - Controle do Crawler */}
                    <div className="xl:col-span-1">
                        <div className="sticky top-8">
                            <CrawlerControl onCrawlerComplete={handleCrawlerComplete} />
                        </div>
                    </div>

                    {/* Main Content - Lista de Publicações */}
                    <div className="xl:col-span-3">
                        <PublicationsList ref={publicationsListRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}
