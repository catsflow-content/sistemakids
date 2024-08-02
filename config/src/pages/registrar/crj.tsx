import { useEffect, useState, ChangeEvent, FormEvent, MouseEvent } from "react";
import { Checkbox, Select } from "@chakra-ui/react";
import { Helmet } from 'react-helmet';
import { DateTime } from 'luxon';

import { ArrowsCounterClockwise } from "@phosphor-icons/react";
import { Header, AlertCard, Footer } from "../../contents/layout";
import { isValidDateTime } from "../../utils/date";
import { Loading } from "../../contents/loading";
import { fetchUserName, verifyPermission } from "../../utils/verify";
import Events from "../../contents/events";

interface Aluno {
  id: number;
  nome: string;
  presente: string;
}

interface Usuario {
  id: number;
  nome: string;
  permission: string;
}

export function Juniores() {
  const [alertas, setAlertas] = useState<{ status: string; mensagem: string }[]>([]);
  const initialDate = DateTime.local().setZone('America/Sao_Paulo').toFormat('dd/MM/yyyy - HH:mm');
  const [dataAula, setDataAula] = useState<string>(initialDate);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [tituloAula, setTituloAula] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [editProfessor, setEditProfessor] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [permission, setPermission] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('ID do usuário não encontrado na sessão');
        const nomeUsuario = await fetchUserName(userId);
        if (!nomeUsuario) throw new Error('Nome do usuário não encontrado');
        setUserName(nomeUsuario);

        const userPermission = await verifyPermission();
        setPermission(userPermission);
      } catch (error) {
        console.error('Erro ao obter dados:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchAlunosJuniores() {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/alunos/search/juniores`);
        if (!response.ok) throw new Error('Erro ao buscar alunos do juniores');
        const data = await response.json();
        setAlunos(data);
      } catch (error) {
        console.error('Erro ao conectar-se ao servidor:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAlunosJuniores();
  }, []);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/verify/usuarios`);
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Erro ao conectar-se ao servidor:', error);
      }
    }

    fetchUsuarios();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!isValidDateTime(dataAula)) {
        throw new Error('Data e hora inválidas');
      }

      const professor = selectedProfessor || userName;
      if (!professor) throw new Error('Nome do professor é inválido');

      const formattedDate = DateTime.fromFormat(dataAula, 'dd/MM/yyyy - HH:mm', { zone: 'America/Sao_Paulo' }).toISO();
      if (!formattedDate) throw new Error('Data e hora inválidas');

      const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/chamadas/register/juniores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataAula: formattedDate,
          professor,
          tituloAula,
          alunos,
        }),
      });

      if (!response.ok) throw new Error('Erro ao cadastrar aula');

      const data = await response.json();
      if (!data.message) throw new Error('Erro na resposta do servidor');

      const lastChamadaResponse = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/chamadas/last/juniores`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!lastChamadaResponse.ok) throw new Error('Erro ao buscar a última chamada registrada');

      const lastChamadaData = await lastChamadaResponse.json();
      if (!lastChamadaData.id) throw new Error('ID da última chamada não retornado');

      sessionStorage.setItem('CJID', lastChamadaData.id.toString());
      setAlertas([{ status: 'success', mensagem: 'Aula cadastrada com sucesso' }]);

      window.location.href = '/turma/juniores/chamada/view';
    } catch (error) {
      const errorMessage = (error as Error).message;
      setAlertas([{ status: 'error', mensagem: errorMessage }]);
    }
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDataAula(event.target.value);
  };

  const handleTituloAulaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTituloAula(event.target.value);
  };

  const handleCheckboxChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const updatedAlunos = [...alunos];
    updatedAlunos[index].presente = event.target.checked ? "presente" : "ausente";
    setAlunos(updatedAlunos);
  };

  const handleProfessorChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProfessor(event.target.value);
  };

  const handleEditProfessorClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setEditProfessor(!editProfessor);
  };

  return (
    <section className="_body _turma">
      <Helmet>
        <title>Registrar chamada dos juniores • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Registrar chamada dos juniores • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <form onSubmit={handleSubmit} className="_main">
        <section className="_card">
          <h2 className="center">Registro da chamada</h2>
          <div className="_div">
            <input type="text" className="_input" placeholder="Data da aula" name="dataAula" value={dataAula} onChange={handleDateChange} required />
            <div className="_cnt">
              {editProfessor ? (
                <label className="_select" htmlFor="selprofessor">
                  <Select className="camp" id="selprofessor" placeholder="Selecionar professor" name="Professor" title="Nome do professor" value={selectedProfessor} onChange={handleProfessorChange} required >
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
              ) : (
                <input type="text" className="_input" placeholder="Nome do Professor" name="professor" value={userName} readOnly required />
              )}
              {(permission === 'administrador' || permission === 'lider') && (
                <button type="button" className="_btn rd" title="Alterar professor" onClick={handleEditProfessorClick}>
                  <ArrowsCounterClockwise />
                </button>
              )}
            </div>
            <input type="text" className="_input" placeholder="Título da aula" name="tituloAula" value={tituloAula} onChange={handleTituloAulaChange} required />
          </div>
        </section>
        <section className="_card">
          <h2 className="center">Alunos do juniores</h2>
          {loading ? (
            <Loading />
          ) : (
            <>
              {alunos.length === 0 ? (
                <Events mensagem="Ops! Sem alunos cadastrados." />
              ) : (
                <div className="_div">
                  {alunos.map((aluno, index) => (
                    <div key={aluno.id} className="_cnt">
                      <p>{aluno.nome}</p>
                      <Checkbox name={`presente_${index}`} className={`_btn check ${aluno.presente === "presente" ? "active" : ""}`} checked={aluno.presente === "presente"} onChange={handleCheckboxChange(index)} />
                    </div>
                  ))}
                </div>
              )}
              <button type="submit" title="Cadastrar aula" className="_btn active center" disabled={alunos.length === 0}>
                Cadastrar aula
              </button>
            </>
          )}
        </section>
        {alertas.map((alerta, index) => (
          <AlertCard key={index} status={alerta.status} mensagem={alerta.mensagem} onClose={() => { setAlertas(prevAlertas => prevAlertas.filter((_, i) => i !== index)); }} />
        ))}
      </form>
      <Footer />
    </section>
  );
}
