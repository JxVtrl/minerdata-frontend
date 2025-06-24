export async function login(username: string, password: string): Promise<string> {
    const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Credenciais inválidas');
    }

    const data = await response.json();
    return data.token;
}
