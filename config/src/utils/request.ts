//* Função genérica para fazer requisições HTTP ao servidor
export async function fetchData<T>(url: string, method: string, body?: object): Promise<T> {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Erro ao fazer a requisição para ${url}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Erro ao conectar-se ao servidor: ${error.message}`);
    } else {
      console.error('Erro desconhecido ao conectar-se ao servidor');
    }
    throw error;
  }
}