import { EyeClosed, Eye } from "@phosphor-icons/react";
import { Input, Select } from "@chakra-ui/react";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { AlertCard, Footer, Header } from "../../contents/layout";

export function RNU() {
  const [alerta, setAlerta] = useState<{ status: string; mensagem: string }>({ status: '', mensagem: '' });
  const [photoError, setPhotoError] = useState<string>('');
  const [permissao, setPermissao] = useState<string>('');
  const [usuario, setUsuario] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [photo, setPhoto] = useState<string>('');
  const [nome, setNome] = useState<string>('');

  const [show, setShow] = useState<boolean>(false);
  const handleClick = () => setShow(!show);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setPhoto(value);
    setPhotoError(value && !value.startsWith('https://live.staticflickr.com/') ? 'A URL deve começar com https://live.staticflickr.com/' : '');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (photoError) {
      setAlerta({ status: 'error', mensagem: photoError });
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, usuario, photo, senha, permissao }),
      });
      if (response.ok) {
        setAlerta({ status: 'success', mensagem: 'Usuário cadastrado com sucesso' });
        setPermissao('');
        setUsuario('');
        setPhoto('');
        setSenha('');
        setNome('');
      } else {
        throw new Error('Erro ao cadastrar usuário');
      }
      console.log(await response.json());
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      setAlerta({ status: 'error', mensagem: 'Erro ao cadastrar usuário' });
    }
  };

  return (
    <section className="_body _hw _rnu">
      <Helmet>
        <title>Registrar novo usuário • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Registrar novo usuário • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        {alerta.status && <AlertCard status={alerta.status} mensagem={alerta.mensagem} onClose={() => setAlerta({ status: '', mensagem: '' })} />}
        <form title="Cadastro de novos usuários" className="_card" onSubmit={handleSubmit}>
          <h2 className="center">Cadastrar usuário</h2>
          <div className="_div">
            <input className="_input" type="text" name="nome" placeholder="Nome" aria-label="Nome Completo do usuário" maxLength={50} minLength={5} value={nome} onChange={(e) => setNome(e.target.value)} required />
            <input className="_input" type="text" name="usuario" placeholder="Usuário" autoComplete="username" aria-label="Nome do usuário" maxLength={20} minLength={5} value={usuario} onChange={(e) => setUsuario(e.target.value.toLowerCase())} required />
            <section className="_cnt">
              <Input className="_input" name="Senha do usuário" placeholder="Senha" autoComplete="current-password" aria-label="Senha do usuário" maxLength={25} min={5} value={senha} onChange={(e) => setSenha(e.target.value)} type={show ? 'text' : 'password'} required />
              <div className="_btn rd" title={show ? 'Ocultar senha' : 'Mostrar senha'} onClick={handleClick}>
                {show ? <EyeClosed /> : <Eye />}
              </div>
            </section>
            <input className="_input" type="url" name="foto" placeholder="Foto de perfil" value={photo} onChange={handlePhotoChange} onBlur={handlePhotoChange} />
            <label className="_select" htmlFor="permission">
              <Select title="Selecionar permissão do usuário" id="permission" className="sel camp" placeholder="Permissão do usuário" value={permissao} onChange={(e) => setPermissao(e.target.value)}>
                <optgroup className="sel-title" label="Administração">
                  <option value="administrador">Administrador</option>
                  <option value="lider">Liderança</option>
                  <option value="pastor">Pastor</option>
                </optgroup>
                <optgroup className="sel-title" label="Professor">
                  <option value="maternal">Maternal</option>
                  <option value="juniores">Juniores</option>
                </optgroup>
              </Select>
            </label>
          </div>
          <button title="Cadastrar usuário" className="_btn active center" type="submit">
            Cadastrar
          </button>
        </form>
      </main>
      <Footer />
    </section>
  );
}
