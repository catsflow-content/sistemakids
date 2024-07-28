import { Menu, MenuButton, MenuItem, MenuList, Select } from "@chakra-ui/react";
import { Clipboard, Equals, Funnel, SealWarning, Trash } from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AlertCard, Footer, Header } from "../../contents/layout";
import { Loading } from "../../contents/loading";
import Events from "../../contents/events";
import { verifyPermission } from "../../utils/verify";
import Pagination from "../../contents/pagination";

interface Chamada {
  id: string;
  Data: string;
}

interface Usuario {
  id: number;
  nome: string;
  permission: string;
}

export function GCJ() {
  const [alerta, setAlerta] = useState({ status: '', mensagem: '' });
  const [professor, setProfessor] = useState("");
  const [ordem, setOrdem] = useState("recentes");
  const [isAdmin, setIsAdmin] = useState(false);
  const [chamadas, setChamadas] = useState<Chamada[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [chamadaIdToDelete, setChamadaIdToDelete] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const callsPerPage = 10;

  useEffect(() => {
    const fetchChamadas = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/chamadas/gerenciar/juniores?ordem=${ordem}&professor=${professor}`);
        const data: Chamada[] = await response.json();
        setChamadas(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar chamadas do juniores:", error);
      }
    };

    fetchChamadas();
  }, [ordem, professor]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/verify/usuarios`);
        const data: Usuario[] = await response.json();
        const filteredUsuarios = data.filter(usuario =>
          usuario.permission === 'administrador' ||
          usuario.permission === 'lider' ||
          usuario.permission === 'juniores'
        );
        setUsuarios(filteredUsuarios);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsuarios();
  }, []);

  useEffect(() => {
    verifyUserPermissions();
  }, []);

  const verifyUserPermissions = async () => {
    try {
      const permission = await verifyPermission();
      setIsAdmin(permission === 'administrador' || permission === 'lider');
    } catch (error) {
      setAlerta({ status: 'error', mensagem: 'Erro ao verificar permissões do usuário.' });
    }
  };

  const handleOrdemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOrdem(event.target.value);
  };

  const handleProfessorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProfessor(event.target.value);
  };

  const handleExcluirChamada = (id: string) => {
    if (!isAdmin) {
      setAlerta({ status: 'error', mensagem: 'Somente administradores e líderes podem excluir chamadas.' });
      return;
    }

    setChamadaIdToDelete(id);
    setShowToast(true);
  };

  const confirmDelete = async () => {
    if (chamadaIdToDelete) {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/chamadas/excluir/juniores/${chamadaIdToDelete}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setChamadas(chamadas.filter(chamada => chamada.id !== chamadaIdToDelete));
          setAlerta({ status: 'success', mensagem: 'Chamada excluída com sucesso.' });
        } else {
          setAlerta({ status: 'error', mensagem: 'Erro ao excluir chamada.' });
        }

        setShowToast(false);
      } catch (error) {
        console.error("Erro ao excluir chamada:", error);
        setAlerta({ status: 'error', mensagem: 'Erro ao excluir chamada.' });
        setShowToast(false);
      }
    }
  };

  const closeToast = () => {
    setShowToast(false);
    setChamadaIdToDelete(null);
  };

  const handleVisualizarChamada = (id: string) => {
    sessionStorage.setItem('CJID', id);
    window.location.href = '/turma/juniores/chamada/view';
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calcular chamadas a serem exibidas
  const startIndex = (currentPage - 1) * callsPerPage;
  const endIndex = startIndex + callsPerPage;
  const currentCalls = chamadas.slice(startIndex, endIndex);
  const totalPages = Math.ceil(chamadas.length / callsPerPage);

  return (
    <section className="_body _turma">
      <Helmet>
        <title>Gerenciar chamada do juniores • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Gerenciar chamada do juniores • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        <section className="_card">
          <div className="_fav">
            <Funnel className="ico" />
          </div>
          <h2>Ferramentas</h2>
          <div className="_div">
            <label className="_select" htmlFor="ordem">
              <Select className="camp" id="ordem" placeholder="Selecionar ordem" name="Ordenar chamadas" title="Ordernar chamadas" value={ordem} onChange={handleOrdemChange}>
                <option value="recentes">Mais recentes</option>
                <option value="antigas">Mais antigas</option>
              </Select>
            </label>
            <label className="_select" htmlFor="professor">
              <Select className="camp" id="professor" placeholder="Selecionar professor" name="Selecionar professor" title="Selecionar professor" value={professor} onChange={handleProfessorChange}>
                <optgroup label="Administração">
                  {usuarios.filter(usuario => usuario.permission === 'administrador' || usuario.permission === 'lider').map(usuario => (
                    <option key={usuario.id} value={usuario.nome}>{usuario.nome}</option>
                  ))}
                </optgroup>
                <optgroup label="Professores">
                  {usuarios.filter(usuario => usuario.permission === 'juniores').map(usuario => (
                    <option key={usuario.id} value={usuario.nome}>{usuario.nome}</option>
                  ))}
                </optgroup>
              </Select>
            </label>
          </div>
        </section>
        {alerta.status && (
          <AlertCard status={alerta.status} mensagem={alerta.mensagem} onClose={() => setAlerta({ status: '', mensagem: '' })} />
        )}
        <section className="_card">
          <h2 className="center">Chamadas do juniores</h2>
          <div className="_div">
            {loading ? (
              <Loading />
            ) : currentCalls.length === 0 ? (
              <Events mensagem="Ops! Sem chamadas cadastradas." />
            ) : (
              <>
                {currentCalls.map((chamada) => (
                  <span className="_cnt" key={chamada.id}>
                    <p>{`${new Date(chamada.Data).getDate()} de ${new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(chamada.Data))} de ${new Date(chamada.Data).getFullYear()}`}</p>
                    <Menu>
                      <MenuButton as="button" className="_btn menu rd" title="Menu lateral">
                        <Equals />
                      </MenuButton>
                      <MenuList className="_menu">
                        <MenuItem className="_opt" as="button" title="Visualizar dados da chamada" onClick={() => handleVisualizarChamada(chamada.id)}>
                          <Clipboard />
                          Visualizar
                        </MenuItem>
                        <MenuItem className="_opt" as="button" title="Excluir chamada" onClick={() => handleExcluirChamada(chamada.id)}>
                          <Trash />
                          Excluir
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </span>
                ))}
              </>
            )}
          </div>
        </section>
        <Pagination totalItems={chamadas.length} itemsPerPage={callsPerPage} currentPage={currentPage} onPageChange={onPageChange} />
        {showToast && (
          <section className="_toast">
            <section className="_card">
              <div className="_fav">
                <SealWarning className="ico" />
              </div>
              <h2>Atenção</h2>
              <p>Você realmente deseja excluir essa chamada?</p>
              <div className="btns">
                <button className="_btn" title="Cancelar" type="button" onClick={closeToast}>
                  Cancelar
                </button>
                <button className="_btn" title="Excluir" type="button" onClick={confirmDelete}>
                  Excluir
                </button>
              </div>
            </section>
          </section>
        )}
      </main>
      <Footer />
    </section>
  );
}
