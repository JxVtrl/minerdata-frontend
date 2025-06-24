import Navigation from '../components/Navigation';
import ClientsList from '../components/ClientsList';

export default function Clients() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />

            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Gerenciar Clientes</h1>
                    <p className="mt-2 text-gray-600">Cadastre e gerencie os clientes do sistema</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ClientsList />
            </div>
        </div>
    );
} 