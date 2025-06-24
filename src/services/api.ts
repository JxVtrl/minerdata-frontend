// services/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

// Tipos para clientes
export interface Client {
    id: number;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    cnpj_cpf?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    status: 'active' | 'inactive' | 'pending';
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface ClientFormData {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    cnpj_cpf?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    status?: 'active' | 'inactive' | 'pending';
    notes?: string;
}

export interface ClientsResponse {
    clients: Client[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Funções para clientes
export const clientsApi = {
    // Listar clientes
    getClients: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }): Promise<ClientsResponse> => {
        const response = await api.get('/clients', { params });
        return response.data;
    },

    // Buscar cliente por ID
    getClient: async (id: number): Promise<Client> => {
        const response = await api.get(`/clients/${id}`);
        return response.data;
    },

    // Criar cliente
    createClient: async (data: ClientFormData): Promise<Client> => {
        const response = await api.post('/clients', data);
        return response.data;
    },

    // Atualizar cliente
    updateClient: async (id: number, data: ClientFormData): Promise<Client> => {
        const response = await api.put(`/clients/${id}`, data);
        return response.data;
    },

    // Deletar cliente
    deleteClient: async (id: number): Promise<void> => {
        await api.delete(`/clients/${id}`);
    },

    // Estatísticas dos clientes
    getClientStats: async () => {
        const response = await api.get('/clients/stats/summary');
        return response.data;
    },
};
