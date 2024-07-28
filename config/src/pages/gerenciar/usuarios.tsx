import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { Menu, MenuButton, MenuItem, MenuList, Select } from "@chakra-ui/react";
import { Clipboard, Equals, Funnel, Password, SealWarning, Trash } from "@phosphor-icons/react";
import { AlertCard, Footer, Header } from "../../contents/layout";
import Events from "../../contents/events";
import { cancelDeleteToast } from "../../utils/toast";
import Pagination from "../../contents/pagination";
import { Input } from "@chakra-ui/react";
import { Eye, EyeClosed } from "@phosphor-icons/react";

interface Usuario {
  id: number;
  nome: string;
}

const API_URL = `${import.meta.env.VITE_SERVIDOR_URL}/auth`;

const fetchUsuarios = async (
  filtroPermission: string,
  filtroOrdem: string,
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>,
  setAlerta: React.Dispatch<React.SetStateAction<{ status: string, mensagem: string }>>
) => {
  try {
    const { data } = await axios.get<Usuario[]>(`${API_URL}/gerenciar/usuarios`, { params: { permission: filtroPermission, ordem: filtroOrdem } });
    setUsuarios(data);
  } catch (error) {
    setAlerta({ status: 'error', mensagem: 'Erro ao carregar usuários' });
  }
};

const handleExcluirUsuario = async (
  userId: number,
  usuarios: Usuario[],
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>,
  setAlerta: React.Dispatch<React.SetStateAction<{ status: string, mensagem: string }>>
) => {
  try {
    await axios.delete(`${API_URL}/delete/${userId}`);
    setUsuarios(usuarios.filter(u => u.id !== userId));
    setAlerta({ status: 'success', mensagem: 'Usuário excluído com sucesso' });
  } catch (error) {
    setAlerta({ status: 'error', mensagem: 'Erro ao excluir usuário' });
  }
};

const navigateTo = (path: string, userId: number) => {
  sessionStorage.setItem('UID', userId.toString());
  window.location.href = path;
};

const GUS: React.FC = () => {
  const [alerta, setAlerta] = useState({ status: '', mensagem: '' });
  const [filtroPermission, setFiltroPermission] = useState("");
  const [filtroOrdem, setFiltroOrdem] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ user: string }>({ user: '' });
  const [newPassword, setNewPassword] = useState('');
  const [show, setShow] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsuarios(filtroPermission, filtroOrdem, setUsuarios, setAlerta);
  }, [filtroPermission, filtroOrdem]);

  const openToast = (userId: number) => {
    setSelectedUserId(userId);
    setIsToastVisible(true);
  };

  const confirmDelete = () => {
    if (selectedUserId !== null) {
      handleExcluirUsuario(selectedUserId, usuarios, setUsuarios, setAlerta);
      cancelDeleteToast(setSelectedUserId, setIsToastVisible);
    }
  };

  const openChangePassword = async (userId: number) => {
    setSelectedUserId(userId);
    setIsChangePasswordVisible(true);
    try {
      const { data } = await axios.get(`${API_URL}/view/${userId}`);
      setSelectedUser(data);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }
  };

  const closeChangePassword = () => {
    setIsChangePasswordVisible(false);
    setSelectedUserId(null);
    setNewPassword('');
  };

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedUserId) {
      try {
        const { data } = await axios.post(`${API_URL}/change/password/admin`, {
          userId: selectedUserId,
          newPassword,
        });
        setAlerta({ status: 'success', mensagem: data.message });
        closeChangePassword();
      } catch (error) {
        setAlerta({ status: 'error', mensagem: 'Erro ao alterar senha' });
        console.error('Erro ao alterar senha:', error);
      }
    }
  };

  const handleClick = () => setShow(!show);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsuarios = usuarios.slice(startIndex, endIndex);

  return (
    <section className="_body _gus _turma">
      <Helmet>
        <title>Gerenciar usuários • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Gerenciar usuários • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        <section className="_card">
          <div className="_fav"><Funnel className="ico" /></div>
          <h2>Ferramentas</h2>
          <div className="_div">
            <label className="_select" htmlFor="ordem">
              <Select className="camp" id="ordem" placeholder="Selecionar ordem" value={filtroOrdem} onChange={e => setFiltroOrdem(e.target.value)}>
                <option value="A-Z">A-Z</option>
                <option value="Z-A">Z-A</option>
              </Select>
            </label>
            <label className="_select" htmlFor="permissao">
              <Select className="camp" id="permissao" placeholder="Selecionar permissão" value={filtroPermission} onChange={e => setFiltroPermission(e.target.value)}>
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
        </section>
        {alerta.status && <AlertCard status={alerta.status} mensagem={alerta.mensagem} onClose={() => setAlerta({ status: '', mensagem: '' })} />}
        <section className="_card">
          <h2 className="center">Gerenciar usuário</h2>
          <div className="_div">
            {currentUsuarios.length > 0 ? (
              currentUsuarios.map(usuario => (
                <section className="_cnt" key={usuario.id}>
                  <p>{usuario.nome}</p>
                  <Menu>
                    <MenuButton as="button" className="_btn menu rd" title="Menu lateral"><Equals /></MenuButton>
                    <MenuList className="_menu">
                      <MenuItem className="_opt" title="Visualizar dados dos usuários" onClick={() => navigateTo('/view/usuario', usuario.id)}>
                        <Clipboard />
                        Visualizar
                      </MenuItem>
                      <MenuItem className="_opt" title="Alterar senha do usuário" onClick={() => openChangePassword(usuario.id)}>
                        <Password />
                        Alterar senha
                      </MenuItem>
                      <MenuItem className="_opt" title="Excluir usuário" onClick={() => openToast(usuario.id)}>
                        <Trash />
                        Excluir
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </section>
              ))
            ) : (
              <Events mensagem="Ops! Sem usuários cadastrados." />
            )}
          </div>
        </section>
        <Pagination totalItems={usuarios.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
        {isToastVisible && (
          <section className="_toast">
            <section className="_card">
              <div className="_fav">
                <SealWarning className="ico" />
              </div>
              <h2>Excluir usuário?</h2>
              <nav className="_nav">
                <button type="button" title="Cancelar ação" className="_btn center" onClick={() => cancelDeleteToast(setSelectedUserId, setIsToastVisible)}>Cancelar</button>
                <button type="button" title="Excluir usuário" className="_btn center active" onClick={confirmDelete}>Excluir</button>
              </nav>
            </section>
          </section>
        )}
        {isChangePasswordVisible && (
          <section className="_toast">
            <form onSubmit={handleChangePassword} className="_card">
              <div className="_fav">
                <Password className="ico" />
              </div>
              <h2>Alterar senha do usuário</h2>
              <div className="_div">
                <input className="_input" type="text" placeholder="Usuário" name="user" value={selectedUser.user} readOnly disabled />
                <div className="_cnt">
                  <Input className="_input" type={show ? "text" : "password"} placeholder="Digite a nova senha" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  <div onClick={handleClick} className="_btn min">
                    {show ? <EyeClosed /> : <Eye />}
                  </div>
                </div>
              </div>
              <nav className="_nav">
                <button type="button" className="_btn center" onClick={closeChangePassword}>
                  Cancelar
                </button>
                <button type="submit" className="_btn center active">
                  Alterar
                </button>
              </nav>
            </form>
          </section>
        )}
      </main>
      <Footer />
    </section>
  );
};

export default GUS;