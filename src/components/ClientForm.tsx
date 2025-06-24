import { useState, useEffect } from 'react';
import type { Client, ClientFormData } from '../services/api';

interface ClientFormProps {
    client?: Client;
    onSubmit: (data: ClientFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function ClientForm({ client, onSubmit, onCancel, isLoading = false }: ClientFormProps) {
    const [formData, setFormData] = useState<ClientFormData>({
        name: '',
        email: '',
        phone: '',
        company: '',
        cnpj_cpf: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        status: 'active',
        notes: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name,
                email: client.email,
                phone: client.phone || '',
                company: client.company || '',
                cnpj_cpf: client.cnpj_cpf || '',
                address: client.address || '',
                city: client.city || '',
                state: client.state || '',
                zip_code: client.zip_code || '',
                status: client.status,
                notes: client.notes || ''
            });
        }
    }, [client]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (formData.cnpj_cpf && !/^[\d.-]+$/.test(formData.cnpj_cpf)) {
            newErrors.cnpj_cpf = 'CNPJ/CPF deve conter apenas números, pontos e hífens';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
        }
    };

    const handleChange = (field: keyof ClientFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome *
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Nome completo"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="email@exemplo.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Telefone */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                    </label>
                    <input
                        type="text"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="(11) 99999-9999"
                    />
                </div>

                {/* Empresa */}
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Empresa
                    </label>
                    <input
                        type="text"
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nome da empresa"
                    />
                </div>

                {/* CNPJ/CPF */}
                <div>
                    <label htmlFor="cnpj_cpf" className="block text-sm font-medium text-gray-700 mb-1">
                        CNPJ/CPF
                    </label>
                    <input
                        type="text"
                        id="cnpj_cpf"
                        value={formData.cnpj_cpf}
                        onChange={(e) => handleChange('cnpj_cpf', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cnpj_cpf ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="00.000.000/0000-00"
                    />
                    {errors.cnpj_cpf && <p className="text-red-500 text-sm mt-1">{errors.cnpj_cpf}</p>}
                </div>

                {/* Status */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="active">Ativo</option>
                        <option value="inactive">Inativo</option>
                        <option value="pending">Pendente</option>
                    </select>
                </div>
            </div>

            {/* Endereço */}
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                </label>
                <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Rua, número, complemento"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cidade */}
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade
                    </label>
                    <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nome da cidade"
                    />
                </div>

                {/* Estado */}
                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                    </label>
                    <select
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecione...</option>
                        {estados.map(estado => (
                            <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </select>
                </div>

                {/* CEP */}
                <div>
                    <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                        CEP
                    </label>
                    <input
                        type="text"
                        id="zip_code"
                        value={formData.zip_code}
                        onChange={(e) => handleChange('zip_code', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="00000-000"
                    />
                </div>
            </div>

            {/* Observações */}
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                </label>
                <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Informações adicionais sobre o cliente..."
                />
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition duration-200"
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 disabled:opacity-50"
                >
                    {isLoading ? 'Salvando...' : (client ? 'Atualizar' : 'Cadastrar')}
                </button>
            </div>
        </form>
    );
} 