import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Definimos o tipo dos dados esperados para progresso
interface ProgressPayload {
  percent: number;
}

// Definimos o tipo para a mensagem final
interface DonePayload {
  message: string;
}

// Criamos o socket fora do componente para manter a conexão durante o ciclo de vida
const socket: Socket = io(import.meta.env.VITE_BACKEND_URL);

function App() {
  // Estado para guardar o progresso do crawler
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Envia ao backend o comando para iniciar o crawler
    socket.emit('start-crawler');

    // Escuta o progresso do backend
    socket.on('progress', (data: ProgressPayload) => {
      setProgress(data.percent); // Atualiza o progresso na tela
    });

    // Escuta a mensagem final de conclusão
    socket.on('done', (data: DonePayload) => {
      setMessage(data.message); // Mostra a mensagem final
    });

    // Limpa os listeners ao desmontar o componente
    return () => {
      socket.off('progress');
      socket.off('done');
    };
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>MinerData - Progresso do Crawler</h1>
      <p>Progresso: {progress}%</p>
      {message && <p><strong>{message}</strong></p>}
    </div>
  );
}

export default App;
