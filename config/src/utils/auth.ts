import { fetchData } from "./request";

interface LogoutResponse {
  redirectUrl: string;
}

interface ChangePasswordData {
  userId: number;
  newPassword: string;
}

//* Função para sair do sistema
export const handleLogout = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token não encontrado para logout.');
    return;
  }

  try {
    const data = await fetchData<LogoutResponse>(
      `${import.meta.env.VITE_SERVIDOR_URL}/auth/logout`,
      'POST',
      { token }
    );

    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    sessionStorage.removeItem('CMID');
    sessionStorage.removeItem('CJID');
    sessionStorage.removeItem('ALID');
    sessionStorage.removeItem('UID');

    window.location.href = data.redirectUrl;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

//* Função para o admin alterar a senha do usuários
export async function changePassword(data: ChangePasswordData): Promise<void> {
  try {
    await fetchData<void>(
      `${import.meta.env.VITE_SERVIDOR_URL}/auth/change/password/admin`,
      'POST',
      data
    );
    console.log('Senha alterada com sucesso!');
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    throw new Error('Erro ao alterar senha');
  }
}
