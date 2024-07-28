import axios from 'axios';
import { fetchData } from "./request";

//* Função de verificação de Tokens
export async function verifyToken(): Promise<boolean> {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  try {
    await fetchData<{ success: boolean }>(`${import.meta.env.VITE_SERVIDOR_URL}/verify/token`, 'POST', { token });
    return true;
  } catch (error) {
    console.error('Erro ao verificar o token:', error);
    return false;
  }
}

//* Função de verificação de permissão
export async function verifyPermission(): Promise<string> {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('Erro ao obter o ID do usuário.');
  }

  try {
    const data = await fetchData<{ permission: string }>(`${import.meta.env.VITE_SERVIDOR_URL}/verify/permission`, 'POST', { userId });
    return data.permission;
  } catch (error) {
    console.error('Erro ao obter a permissão do usuário:', error);
    throw error;
  }
}

//* Função de verificação de nome do usuário
export async function fetchUserName(userId: number | string): Promise<string | null> {
  try {
    const data = await fetchData<{ nome: string }>(`${import.meta.env.VITE_SERVIDOR_URL}/verify/name`, 'POST', { userId });
    return data.nome;
  } catch (error) {
    console.error('Erro ao buscar nome do usuário:', error);
    return null;
  }
}

//* Função de verificação do servidor
export async function verifyServer(serverUrl: string): Promise<void> {
  await axios.get(`${serverUrl}/verify/server`);
}
