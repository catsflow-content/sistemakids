import { useState, useEffect } from "react";
import { EyeClosed, Eye } from "@phosphor-icons/react";
import { Helmet } from "react-helmet";

import { Header, AlertCard, Footer } from "../contents/layout";
import { verifyToken, verifyServer } from "../utils/verify";

export function Login() {
  const [alerta, setAlerta] = useState<{ status: string; mensagem: string }>({ status: '', mensagem: '' });
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);

  const handleClick = () => setShow(!show);

  useEffect(() => {
    async function checkServerAndToken() {
      try {
        await verifyServer(import.meta.env.VITE_SERVIDOR_URL);

        const isAuthenticated = await verifyToken();
        if (isAuthenticated) {
          window.location.href = '/dash';
        }
      } catch (error) {
        window.location.href = '/err/off';
      }
    }

    checkServerAndToken();
  }, []);

  const handleErrors = (error: unknown) => {
    if (error instanceof Response) {
      setAlerta({ status: 'error', mensagem: 'Erro ao verificar token: ' + error.statusText });
    } else if (error instanceof Error) {
      console.error('Erro ao verificar token:', error);
      setAlerta({ status: 'error', mensagem: 'Erro interno do servidor' });
    } else {
      console.error('Erro inesperado:', error);
      setAlerta({ status: 'error', mensagem: 'Erro inesperado' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, password }),
      });

      if (response.ok) {
        const responseJson = await response.json();
        console.log('Resposta do servidor:', responseJson);

        if (responseJson.token) {
          const { token, userId } = responseJson;

          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);

          window.location.href = '/dash';
        } else {
          setAlerta({ status: 'error', mensagem: 'Token não encontrado na resposta do servidor' });
        }
      } else {
        handleErrors(new Error(`Erro HTTP: ${response.statusText}`));
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  return (
    <section className="_body _hw _login">
      <Helmet>
        <title>Entrar no sistema • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Entrar no sistema • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        {alerta.status === 'error' && (
          <AlertCard status={alerta.status} mensagem={alerta.mensagem} onClose={() => setAlerta({ status: '', mensagem: '' })} />
        )}
        <form onSubmit={handleSubmit} className="_card">
          <h2 className="center">Entre no sistema</h2>
          <div className="_div">
            <input className="_input" type="text" placeholder="Usuário" name="user" autoComplete="username" aria-label="Nome do usuário" maxLength={15} minLength={5} required value={user} onChange={(e) => setUser(e.target.value.toLowerCase())} />
            <section className="_cnt">
              <input className="_input" name="password" placeholder="Senha" autoComplete="current-password" aria-label="Senha do usuário" maxLength={25} min={5} value={password} onChange={(e) => setPassword(e.target.value)} type={show ? 'text' : 'password'} required />
              <div className="_btn rd" title={show ? 'Ocultar senha' : 'Mostrar senha'} onClick={handleClick}>
                {show ? <EyeClosed /> : <Eye />}
              </div>
            </section>
          </div>
          <button type="submit" className="_btn active center" title="Entrar">Entrar</button>
        </form>
      </main>
      <Footer />
    </section>
  );
}
