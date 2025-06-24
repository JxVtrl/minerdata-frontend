// src/components/GlobalError.tsx
// Exemplo futuro: mostrar mensagens de erro vindas de fetchs

export default function GlobalError({ message }: { message: string }) {
    return (
        <div style={{ color: 'red', padding: '1rem', background: '#fee' }}>
            ⚠️ {message}
        </div>
    );
}
