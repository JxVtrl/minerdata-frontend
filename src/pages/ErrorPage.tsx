import { Link } from 'react-router-dom';

export default function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
            <p className="mb-6">A rota que você tentou acessar não existe.</p>
            <Link to="/login" className="text-blue-500 underline">
                Ir para login
            </Link>
        </div>
    );
}
