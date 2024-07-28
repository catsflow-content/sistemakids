import React, { useState, useEffect } from "react";
import { Select } from "@chakra-ui/react";
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

import { ChartDonut } from "@phosphor-icons/react";
import { verifyPermission } from "../../utils/verify";
import { AlertCard, Footer, Header } from "../../contents/layout";

type Aluno = {
  nome: string;
  sexo: string;
  idade: string;
  responsavel: string;
  dataNascimento: string;
  observacao?: string;
  turma: string;
};

type Presenca = {
  NomeAluno: string;
  Presenca: string;
  ChamadaId: number;
};

type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
};

export function AVD() {
  const [aluno, setAluno] = useState<Aluno>({
    nome: '', sexo: '', idade: '', responsavel: '',
    dataNascimento: '', observacao: '', turma: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [alerta, setAlerta] = useState({ status: '', mensagem: '' });
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    const alunoId = sessionStorage.getItem('ALID');
    if (alunoId) fetchAlunoData(alunoId);
    checkUserPermission();
  }, []);

  useEffect(() => {
    updateTurma(aluno.idade);
  }, [aluno.idade]);

  const checkUserPermission = async () => {
    try {
      const permission = await verifyPermission();
      setHasEditPermission(permission === 'administrador' || permission === 'lider');
    } catch (error) {
      console.error('Erro ao verificar permissão do usuário:', error);
      setAlerta({ status: 'error', mensagem: 'Erro ao verificar permissão do usuário' });
    }
  };

  const fetchAlunoData = async (id: string) => {
    try {
      const response = await axios.get<Aluno>(`${import.meta.env.VITE_SERVIDOR_URL}/alunos/gerenciar/${id}`);
      const data = response.data;
      setAluno({
        nome: data.nome, sexo: data.sexo, idade: data.idade, responsavel: data.responsavel,
        dataNascimento: format(parseISO(data.dataNascimento), 'dd/MM/yyyy', { locale: ptBR }),
        observacao: data.observacao || '', turma: data.turma
      });


      const presencesResponse = await axios.get<Presenca[]>(`${import.meta.env.VITE_SERVIDOR_URL}/statistics/presenca/${id}`);
      const presencesData = presencesResponse.data;


      const presentes = presencesData.filter(p => p.Presenca === "presente").length;
      const ausentes = presencesData.filter(p => p.Presenca === "ausente").length;

      setChartData({
        labels: ["Presentes", "Ausentes"],
        datasets: [
          {
            data: [presentes, ausentes],
            backgroundColor: ["#36A2EB", "#FF6384"]
          }
        ]
      });

    } catch (error) {
      console.error('Erro ao buscar informações do aluno:', error);
      setAlerta({ status: 'error', mensagem: 'Erro ao buscar informações do aluno' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAluno(prevState => ({ ...prevState, [name]: value }));
  };

  const updateTurma = (idade: string) => {
    let turma = '';
    if (['3 anos', '4 anos', '5 anos', '6 anos'].includes(idade)) {
      turma = 'Maternal';
    } else if (['7 anos', '8 anos', '9 anos'].includes(idade)) {
      turma = 'Juniores';
    }
    setAluno(prevState => ({ ...prevState, turma }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const alunoId = sessionStorage.getItem('ALID');
    try {
      await axios.put(`${import.meta.env.VITE_SERVIDOR_URL}/alunos/update/${alunoId}`, aluno);
      setAlerta({ status: 'success', mensagem: 'Dados atualizados com sucesso' });
      setIsEditMode(false);
    } catch (error) {
      console.error('Erro ao atualizar dados do aluno:', error);
      setAlerta({ status: 'error', mensagem: 'Erro ao atualizar dados do aluno' });
    }
  };

  return (
    <section className="_body">
      <Helmet>
        <title>Informações do aluno • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Informações do aluno • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        {alerta.status && (
          <AlertCard status={alerta.status} mensagem={alerta.mensagem} onClose={() => setAlerta({ status: '', mensagem: '' })} />
        )}
        <form onSubmit={handleSubmit} className="_card">
          <h2 className="center">Informações do aluno</h2>
          <div className="_div">
            <input className="_input" type="text" name="nome" placeholder="Nome do aluno" value={aluno.nome} onChange={handleChange} readOnly={!isEditMode} />
            <input className="_input" type="text" name="responsavel" placeholder="Nome do responsável" value={aluno.responsavel} onChange={handleChange} readOnly={!isEditMode} />
            <input className="_input" type="text" name="dataNascimento" placeholder="Data de nascimento" value={aluno.dataNascimento} onChange={handleChange} readOnly={!isEditMode} />
            <textarea className="_textarea" name="observacao" placeholder="Observação" value={aluno.observacao} onChange={handleChange} readOnly={!isEditMode}></textarea>
            <section className="_nav">
              {isEditMode ? (
                <label className="_select" htmlFor="selsex">
                  <Select className="camp" id="selsex" name="sexo" placeholder="Sexo" title="Sexo do aluno" value={aluno.sexo} onChange={handleChange} required>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                  </Select>
                </label>
              ) : (
                <input className="_input" type="text" name="sexo" placeholder="Sexo do aluno" value={aluno.sexo} readOnly />
              )}
              {isEditMode ? (
                <label className="_select" htmlFor="selidade">
                  <Select className="camp" id="selidade" name="idade" placeholder="Idade" title="Idade do aluno" value={aluno.idade} onChange={handleChange} required>
                    <optgroup className="sel-title" label="Maternal">
                      <option value="3 anos">3 anos</option>
                      <option value="4 anos">4 anos</option>
                      <option value="5 anos">5 anos</option>
                      <option value="6 anos">6 anos</option>
                    </optgroup>
                    <optgroup className="sel-title" label="Juniores">
                      <option value="7 anos">7 anos</option>
                      <option value="8 anos">8 anos</option>
                      <option value="9 anos">9 anos</option>
                    </optgroup>
                  </Select>
                </label>
              ) : (
                <input className="_input" type="text" name="idade" placeholder="Idade do aluno" value={aluno.idade} readOnly />
              )}

            </section>
            {isEditMode ? (
              <label className="_select" htmlFor="selturma">
                <Select className="camp" id="selturma" name="turma" placeholder="Selecionar turma" title="Turma do aluno" value={aluno.turma} onChange={handleChange} required>
                  <option value="Maternal">Turma do maternal</option>
                  <option value="Juniores">Turma do juniores</option>
                </Select>
              </label>
            ) : (
              <input className="_input" type="text" name="turma" placeholder="Turma do aluno" value={aluno.turma} readOnly />
            )}
          </div>
          {hasEditPermission && (
            <div className="_nav">
              <button className={`_btn center ${isEditMode ? '' : 'active'}`} type="button" onClick={() => setIsEditMode(!isEditMode)}>
                {isEditMode ? 'Cancelar' : 'Editar'}
              </button>
              {isEditMode && <button className="_btn active center" type="submit">Salvar</button>}
            </div>
          )}
        </form>
        {chartData && (
          <section className="_card">
            <div className="_fav">
              <ChartDonut className="ico" />
            </div>
            <h2>Presença do Aluno</h2>
            <Pie className="_grafic pie" data={chartData} />
          </section>
        )}
      </main>
      <Footer />
    </section>
  );
}
