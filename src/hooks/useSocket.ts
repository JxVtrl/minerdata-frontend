import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useSocket() {
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const socket = io('http://localhost:3001'); // URL do backend

        socket.on('progress', (data) => {
            setProgress(data.percent);
        });

        socket.on('done', (data) => {
            setDone(true);
            alert(data.message);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return { progress, done };
}
