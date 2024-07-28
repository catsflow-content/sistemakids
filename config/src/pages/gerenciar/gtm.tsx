import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

import { Select, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Funnel, Equals, SealWarning, Clipboard, Trash } from "@phosphor-icons/react";
import { AlertCard, Footer, Header } from "../../contents/layout";
import { Loading } from "../../contents/loading";
import Events from "../../contents/events";
import Pagination from "../../contents/pagination";
import { verifyPermission } from "../../utils/verify";

interface Aluno {
  id: string;
  nome: string;
}

export function GTM() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroSexo, setFiltroSexo] = useState("");
  const [filtroOrdem, setFiltroOrdem] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [alerta, setAlerta] = useState({ status: '', mensagem: '' });
  const [showToast, setShowToast] = useState(false);
  const [alunoToDelete, setAlunoToDelete] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [alunosPorPagina] = useState(10);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await axios.get<Aluno[]>(`${import.meta.env.VITE_SERVIDOR_URL}/alunos/search/maternal`, {
          params: { sexo: filtroSexo, ordem: filtroOrdem }
        });
        setAlunos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar alunos do maternal:', error);
        setLoading(false);
        setAlerta({ status: 'error', mensagem: 'Erro ao buscar alunos do maternal.' });
      }
    };

    fetchAlunos();
  }, [filtroSexo, filtroOrdem]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      verifyPermissions(userId);
    }
  }, []);

  const verifyPermissions = async (userId: string) => {
    try {
      const permission = await verifyPermission(userId);
      setIsAdmin(permission === 'administrador');
    } catch (error) {
      setAlerta({ status: 'error', mensagem: 'Erro ao verificar permissões do usuário.' });
    }
  };

  const handleFiltroSexoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroSexo(event.target.value);
  };

  const handleFiltroOrdemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroOrdem(event.target.value);
  };

  const handleExcluirAluno = async (alunoId: string) => {
    if (!isAdmin) {
      setAlerta({ status: 'error', mensagem: 'Somente administradores podem excluir alunos.' });
      return;
    }

    setAlunoToDelete(alunoId);
    setShowToast(true);
  };

  const confirmDelete = async () => {
    if (!alunoToDelete) return;

    try {
      const response = await axios.delete(`${import.meta.env.VITE_SERVIDOR_URL}/alunos/excluir/${alunoToDelete}`);

      if (response.status === 200) {
        setAlunos(alunos.filter(aluno => aluno.id !== alunoToDelete));
        setAlerta({ status: 'success', mensagem: 'Aluno excluído com sucesso.' });
        setShowToast(false);
      } else {
        setAlerta({ status: 'error', mensagem: 'Erro ao excluir aluno.' });
      }
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
      setAlerta({ status: 'error', mensagem: 'Erro ao excluir aluno.' });
    }
  };

  const closeToast = () => {
    setShowToast(false);
    setAlunoToDelete(null);
  };

  const handleVerDadosAluno = (alunoId: string) => {
    sessionStorage.setItem('ALID', alunoId);
    window.location.href = '/view/aluno';
  };

  const indexOfLastAluno = paginaAtual * alunosPorPagina;
  const indexOfFirstAluno = indexOfLastAluno - alunosPorPagina;
  const currentAlunos = alunos.slice(indexOfFirstAluno, indexOfLastAluno);

  return (
    <>
      <Helmet>
        <title>Turma do maternal • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Turma do maternal • Sistema Kids | Ministério Kids" />
      </Helmet>
      <section className="_body _turma">
        <Header />
        <main className="_main">
          <section className="_card">
            <div className="_fav">
              <Funnel className="ico"/>
            </div>
            <h2>Ferramentas</h2>
            <section className="_nav">
              <label className="_select" htmlFor="selsexo">
                <Select className="camp" placeholder="Sexo" id="selsexo" name="sexp" title="Filtrar por sexo" value={filtroSexo} onChange={handleFiltroSexoChange}>
                  <option value="">Ambos</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                </Select>
              </label>
              <label className="_select" htmlFor="selord">
                <Select className="camp" placeholder="Ordem" id="selord" name="ordem" title="Ordem alfabetica" value={filtroOrdem} onChange={handleFiltroOrdemChange}>
                  <option value="A-Z">A-Z</option>
                  <option value="Z-A">Z-A</option>
                </Select>
              </label>
            </section>
          </section>
          {alerta.status && (
            <AlertCard status={alerta.status} mensagem={alerta.mensagem} onClose={() => setAlerta({ status: '', mensagem: '' })} />
          )}
          <section className="_card">
            <h2 className="center">Turma do maternal</h2>
            <div className="_div">
              {loading ? (
                <Loading />
              ) : (
                <>
                  {currentAlunos.length === 0 ? (
                    <Events mensagem="Ops! Sem alunos cadastrados." />
                  ) : (
                    <div className="_div">
                      {currentAlunos.map((aluno) => (
                        <section key={aluno.id} className="_cnt">
                          <p>{aluno.nome}</p>
                          <Menu>
                            <MenuButton as="button" className="_btn menu rd" title="Menu lateral">
                              <Equals />
                            </MenuButton>
                            <MenuList className="_menu">
                              <MenuItem className="_opt" as="button" title="Visualizar dados dos alunos" onClick={() => handleVerDadosAluno(aluno.id)}>
                                <Clipboard />
                                Visualizar
                              </MenuItem>
                              <MenuItem className="_opt" as="button" title="Excluir aluno" onClick={() => handleExcluirAluno(aluno.id)} disabled={!isAdmin}>
                                <Trash />
                                Excluir
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </section>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
          <Pagination totalItems={alunos.length} itemsPerPage={alunosPorPagina} currentPage={paginaAtual} onPageChange={setPaginaAtual} />
          {showToast && (
            <section className="_toast">
              <section className="_card">
                <div className="_fav">
                  <SealWarning className="ico" />
                </div>
                <h2>Excluir aluno?</h2>
                <nav className="_nav">
                  <button type="button" title="Cancelar ação" className="_btn center" onClick={closeToast}>Cancelar</button>
                  <button type="button" title="Excluir aluno" className="_btn center active" onClick={confirmDelete}>Excluir</button>
                </nav>
              </section>
            </section>
          )}
        </main>
        <Footer />
      </section>
    </>
  );
}
