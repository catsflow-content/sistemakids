import { useState, useEffect } from "react";
import { User, IdentificationCard } from "@phosphor-icons/react";
import { Helmet } from 'react-helmet';
import axios from "axios";
import { Input } from "@chakra-ui/react";
import { Eye, EyeClosed, Password } from "@phosphor-icons/react";

import { UserStatistics } from "../../components/statistics/user";
import { AlertCard, Footer, Header } from "../../contents/layout";
import { handleLogout } from "../../utils/auth";

export function Profile() {
  const [userInfo, setUserInfo] = useState({ id: "", nome: "", usuario: "", foto: "", permissao: "" });
  const [alerta, setAlerta] = useState({ status: '', mensagem: '' });
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/verify/profile?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo({ id: data.id, nome: data.nome, usuario: data.user, permissao: data.permission, foto: data.photoPath });
        } else {
          console.error('Erro ao obter informações do usuário:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleClick = () => setShow(!show);

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_SERVIDOR_URL}/auth/change/password/user`, {
        newPassword,
        token
      });
      console.log('Senha alterada com sucesso!');
      setNewPassword('');
      setAlerta({ status: 'success', mensagem: 'Senha alterada com sucesso' });
      setIsChangePasswordOpen(false);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setAlerta({ status: 'error', mensagem: 'Erro ao alterar senha. Por favor, tente novamente.' });
    }
  };

  return (
    <section className="_body _user">
      <Helmet>
        <title>Conta • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Conta • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        {alerta.status && (
          <AlertCard status={alerta.status} mensagem={alerta.mensagem} onClose={() => setAlerta({ status: '', mensagem: '' })} />
        )}
        <section className="_card profile">
          <div className="_fav">
            <IdentificationCard className="ico" />
          </div>
          {userInfo.foto ? (
            <img className="_photo" src={userInfo.foto} alt={`Foto do ${userInfo.nome}`} />
          ) : (
            <div className="_iconuser _btn active">
              <User />
            </div>
          )}
          <div className="_div">
            <h1 className="center">{userInfo.nome}</h1>
            <h4>@{userInfo.usuario} | {userInfo.permissao}</h4>
          </div>
          <div className="_nav">
            <button className="_btn center" title="Alterar a senha" onClick={() => setIsChangePasswordOpen(true)}>Alterar senha</button>
            <button className="_btn active center" title="Sair da conta" onClick={handleLogout}>Sair</button>
          </div>
        </section>
        <UserStatistics />
      </main>
      <Footer />
      {isChangePasswordOpen && (
        <section className="_toast">
          <section className="_card">
            <div className="_fav">
              <Password className="ico" />
            </div>
            <h2>Alterar senha</h2>
            <form onSubmit={handleSubmit} className="_cnt">
              <Input className="_input" name="Nova senha" placeholder="Nova senha" autoComplete="new-password" aria-label="Nova senha do usuário" maxLength={25} min={5} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type={show ? 'text' : 'password'} required />
              <div className="_btn rd" title={show ? 'Ocultar senha' : 'Mostrar senha'} onClick={handleClick}>
                {show ? <EyeClosed /> : <Eye />}
              </div>
            </form>
            <nav className="_nav">
              <button type="button" className="_btn center" onClick={() => setIsChangePasswordOpen(false)} >
                Cancelar
              </button>
              <button type="submit" className="_btn active center" title="Alterar senha" onClick={handleSubmit}>
                Alterar
              </button>
            </nav>
          </section>
        </section>
      )}
    </section>
  );
}
