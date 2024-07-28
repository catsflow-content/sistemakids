import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { Select } from "@chakra-ui/react";
import { Header, AlertCard, Footer } from "../../contents/layout";

interface Usuario {
  nome: string;
  user: string;
  photoPath: string;
  permission: string;
}

export function UVD() {
  const [alerta, setAlerta] = useState<{ status: string; mensagem: string }>({ status: '', mensagem: '' });
  const [usuario, setUsuario] = useState<Usuario>({ nome: '', user: '', photoPath: '', permission: '' });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [photoError, setPhotoError] = useState<string>('');

  useEffect(() => {
    const fetchUsuario = async () => {
      const userId = sessionStorage.getItem('UID');
      if (!userId) return setAlerta({ status: 'error', mensagem: 'ID do usuário não encontrado na sessão' });
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVIDOR_URL}/auth/view/${userId}`);
        setUsuario({
          nome: data.nome || '',
          user: data.user || '',
          photoPath: data.photoPath || '',
          permission: data.permission || ''
        });
      } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
        setAlerta({ status: 'error', mensagem: 'Erro ao carregar dados do usuário' });
      }
    };
    fetchUsuario();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setUsuario(prev => ({ ...prev, photoPath: value }));
    setPhotoError(value && !value.startsWith('https://live.staticflickr.com/') ? 'A URL deve começar com https://live.staticflickr.com/' : '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (photoError) return setAlerta({ status: 'error', mensagem: photoError });

    try {
      const userId = sessionStorage.getItem('UID');
      await axios.put(`${import.meta.env.VITE_SERVIDOR_URL}/auth/update/${userId}`, usuario);
      setAlerta({ status: 'success', mensagem: 'Dados atualizados com sucesso' });
      setIsEditMode(false);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      setAlerta({ status: 'error', mensagem: 'Erro ao atualizar dados do usuário' });
    }
  };

  return (
    <section className="_body _hw">
      <Helmet>
        <title>Gerenciar usuário • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Gerenciar usuário • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        {alerta.status && <AlertCard status={alerta.status} mensagem={alerta.mensagem} onClose={() => setAlerta({ status: '', mensagem: '' })} />}
        <form onSubmit={handleSubmit} className="_card">
          <h2 className="center">Gerenciar usuário</h2>
          <div className="_div">
            <input className="_input" type="text" name="nome" placeholder="Nome" maxLength={50} minLength={5} required value={usuario.nome} onChange={handleChange} readOnly={!isEditMode} />
            <input className="_input" type="text" name="user" placeholder="Usuário" maxLength={20} minLength={5} required value={usuario.user} onChange={handleChange} readOnly={!isEditMode} />
            <input className="_input" type="url" name="photoPath" placeholder="Foto de perfil" value={usuario.photoPath} onChange={handlePhotoChange} readOnly={!isEditMode} />
            {photoError && <p className="error">{photoError}</p>}
            {isEditMode ? (
              <label className="_select" htmlFor="permission">
                <Select title="Selecionar permissão do usuário" placeholder="Selecionar permissão" id="permission" className="sel camp" name="permission" value={usuario.permission} onChange={handleChange} required >
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
            ) : (
              <input className="_input" type="text" name="permission" placeholder="Permissão do usuário" value={usuario.permission} readOnly />
            )}
          </div>
          <div className="_nav">
            <button className="_btn active center" type="button" onClick={() => setIsEditMode(!isEditMode)}>
              {isEditMode ? 'Cancelar' : 'Editar'}
            </button>
            {isEditMode && <button className="_btn active center" type="submit">Salvar</button>}
          </div>
        </form>
      </main>
      <Footer />
    </section>
  );
}
