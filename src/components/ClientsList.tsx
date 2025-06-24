import { useState, useEffect } from 'react';
import type { Client, ClientFormData } from '../services/api';
import { clientsApi } from '../services/api';
import ClientForm from './ClientForm';

export default function ClientsList() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [saving, setSaving] = useState(false);

    // Filtros e paginação
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalClients, setTotalClients] = useState(0);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await clientsApi.getClients({
                page: currentPage,
                limit: 10,
                search,
                status: statusFilter
            });
            setClients(response.clients);
            setTotalPages(response.pagination.pages);
            setTotalClients(response.pagination.total);
        } catch (err) {
            setError('Erro ao carregar clientes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, [currentPage, search, statusFilter]);

    const handleSubmit = async (data: ClientFormData) => {
        try {
            setSaving(true);
            if (editingClient) {
                await clientsApi.updateClient(editingClient.id, data);
            } else {
                await clientsApi.createClient(data);
            }
            setShowForm(false);
            setEditingClient(null);
            fetchClients();
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar cliente');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (client: Client) => {
        setEditingClient(client);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este cliente?')) {
            return;
        }

        try {
            await clientsApi.deleteClient(id);
            fetchClients();
        } catch (err) {
            setError('Erro ao excluir cliente');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            active: { label: 'Ativo', class: 'bg-green-100 text-green-800' },
            inactive: { label: 'Inativo', class: 'bg-red-100 text-red-800' },
            pending: { label: 'Pendente', class: 'bg-yellow-100 text-yellow-800' }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
                {config.label}
            </span>
        );
    };

    if (showForm) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                    </h2>
                    <button
                        onClick={() => {
                            setShowForm(false);
                            setEditingClient(null);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <ClientForm
                    client={editingClient || undefined}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingClient(null);
                    }}
                    isLoading={saving}
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Clientes</h2>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200"
                    >
                        Novo Cliente
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Buscar por nome, email, empresa..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos os status</option>
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                            <option value="pending">Pendente</option>
                        </select>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        Total: {totalClients} clientes
                    </div>
                </div>
            </div>

            {/* Lista */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Carregando...</div>
                ) : error ? (
                    <div className="p-6 text-center text-red-500">{error}</div>
                ) : clients.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">Nenhum cliente encontrado</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contato
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Localização
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {client.name}
                                            </div>
                                            {client.company && (
                                                <div className="text-sm text-gray-500">
                                                    {client.company}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm text-gray-900">
                                                {client.email}
                                            </div>
                                            {client.phone && (
                                                <div className="text-sm text-gray-500">
                                                    {client.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {client.city && client.state ? `${client.city}, ${client.state}` : '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(client.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(client)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(client.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-700">
                            Página {currentPage} de {totalPages}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 