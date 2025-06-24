import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useSocket() {
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const socket = io('http://localhost:3001'); // URL do backend

        socket.on('progress', (data) => {
            setProgress(data.percent);
            setMessage(data.message || '');
        });

        socket.on('done', (data) => {
            setDone(true);
            setMessage(data.message || 'Crawler finalizado!');
            alert(data.message || 'Crawler finalizado!');
        });

        socket.on('error', (data) => {
            setMessage(data.message || 'Erro no crawler');
            alert(data.message || 'Erro no crawler');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return { progress, done, message };
}
