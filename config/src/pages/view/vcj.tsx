import React, { useState, useEffect } from "react";
import { Checkbox, Button, Input, Select } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import axios from "axios";
import InputMask from "react-input-mask";
import { ChartDonut } from "@phosphor-icons/react";
import { Pie } from "react-chartjs-2";
import { TooltipItem } from "chart.js";
import { verifyPermission } from "../../utils/verify";
import { Loader } from "../loader";
import { AlertCard, Footer, Header } from "../../contents/layout";
import { formatDate, parseDateToISO } from "../../utils/date";

interface Aluno {
  id: number;
  NomeAluno: string;
  Presenca: "presente" | "ausente";
}

interface Chamada {
  id: number;
  Titulo: string;
  Professor: string;
  Data: string;
}

interface Usuario {
  id: number;
  nome: string;
  permission: string;
}

export function VCJ() {
  const [alerta, setAlerta] = useState({ status: "", mensagem: "" });
  const [loading, setLoading] = useState(true);
  const [chamada, setChamada] = useState<Chamada | null>(null);
  const [tempChamada, setTempChamada] = useState<Chamada | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const chamadaId = sessionStorage.getItem("CJID");
    if (chamadaId) {
      fetchChamada(chamadaId);
      fetchUsuarios();
    } else {
      setAlerta({ status: "error", mensagem: "ID da chamada não encontrado." });
      setLoading(false);
    }

    checkUserPermission();
  }, []);

  const checkUserPermission = async () => {
    try {
      const permission = await verifyPermission();
      setHasEditPermission(permission === 'administrador' || permission === 'lider');
    } catch (error) {
      console.error("Erro ao verificar permissão do usuário:", error);
      setAlerta({ status: "error", mensagem: "Erro ao verificar permissão do usuário" });
    }
  };

  const fetchChamada = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/chamadas/gerenciar/juniores/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        const chamadaComDataFormatada = {
          ...data.chamada,
          Data: formatDate(data.chamada.Data) 
        };
        setChamada(chamadaComDataFormatada);
        setTempChamada(chamadaComDataFormatada);
        setAlunos(data.alunos);
        updateChartData(data.alunos);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      setAlerta({ status: "error", mensagem: "Erro ao buscar dados da chamada." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const chamadaId = sessionStorage.getItem("CJID");

    const chamadaComDataISO = {
      ...tempChamada,
      Data: tempChamada ? parseDateToISO(tempChamada.Data) : "", 
    };

    try {
      await axios.put(`${import.meta.env.VITE_SERVIDOR_URL}/chamadas/update/juniores/${chamadaId}`, {
        chamada: chamadaComDataISO,
        alunos,
      });
      setChamada(tempChamada);
      setAlerta({ status: "success", mensagem: "Dados atualizados com sucesso" });
      setIsEditMode(false);
    } catch (error) {
      setAlerta({ status: "error", mensagem: "Erro ao atualizar dados da chamada." });
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/verify/usuarios`);
      if (response.ok) {
        const data: Usuario[] = await response.json();
        setUsuarios(data);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleChamadaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempChamada((prevState) => (prevState ? { ...prevState, [name]: value } : null));
  };

  const handleAlunoChange = (id: number, name: string, value: string) => {
    const updatedAlunos = alunos.map((aluno) => (aluno.id === id ? { ...aluno, [name]: value } : aluno));
    setAlunos(updatedAlunos);
    updateChartData(updatedAlunos);
  };

  const handleCancelEdit = () => {
    setTempChamada(chamada);
    setIsEditMode(false);
  };

  const updateChartData = (alunos: Aluno[]) => {
    const presentes = alunos.filter(aluno => aluno.Presenca === "presente").length;
    const ausentes = alunos.filter(aluno => aluno.Presenca === "ausente").length;

    setChartData({
      labels: ["Presente", "Ausente"],
      datasets: [
        {
          label: "Número de alunos",
          data: [presentes, ausentes],
          backgroundColor: ["#36A2EB", "#FF6384"],
          hoverBackgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem: TooltipItem<'pie'>) {
                let label = tooltipItem.label || '';
                if (label) {
                  label += ': ';
                }
                const value = tooltipItem.raw || 0;
                return `Número de alunos: ${value}`;
              }
            }
          }
        }
      }
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="_body _turma _view">
      <Helmet>
        <title>Chamada do juniores • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Chamada do juniores • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <form className="_main" onSubmit={handleSubmit}>
        <section className="_card">
          <h2 className="center">Registro da chamada</h2>
          <div className="_div">
            <InputMask className="_input" type="tel" mask="99/99/9999 - 99:99" placeholder="Data da aula" name="Data" value={tempChamada ? tempChamada.Data : ""} onChange={handleChamadaChange} readOnly={!isEditMode} />
            {isEditMode ? (
              <label className="_select" htmlFor="selprofessor">
                <Select className="camp" id="selprofessor" name="Professor" title="Nome do professor" placeholder="Selecionar professor" value={tempChamada ? tempChamada.Professor : ""} onChange={handleChamadaChange} required>
                  <optgroup label="Administração">
                    {usuarios.filter(usuario => usuario.permission === 'administrador' || usuario.permission === 'lider').map(usuario => (
                      <option key={usuario.id} value={usuario.nome}>{usuario.nome}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Professor">
                    {usuarios.filter(usuario => usuario.permission === 'juniores').map(usuario => (
                      <option key={usuario.id} value={usuario.nome}>{usuario.nome}</option>
                    ))}
                  </optgroup>
                </Select>
              </label>
            ) : (
              <Input type="text" className="_input" placeholder="Nome do Professor" name="Professor" value={tempChamada ? tempChamada.Professor : ""} readOnly />
            )}
            <Input type="text" className="_input" placeholder="Título da aula" name="Titulo" value={tempChamada ? tempChamada.Titulo : ""} onChange={handleChamadaChange} readOnly={!isEditMode} />
          </div>
        </section>
        <section className="_card">
          <h2 className="center">Alunos do juniores</h2>
          <div className="_div">
            {alunos.map((aluno, index) => (
              <div className="_cnt" key={aluno.id}>
                <Input type="text" className="_input" value={aluno.NomeAluno} readOnly />
                <Checkbox name={`presente_${index}`} className={`_btn check ${aluno.Presenca === "presente" ? "active" : ""}`} isChecked={aluno.Presenca === "presente"} isDisabled={!isEditMode} onChange={(event) => handleAlunoChange(aluno.id, "Presenca", event.target.checked ? "presente" : "ausente")}>
                </Checkbox>
              </div>
            ))}
          </div>
          {hasEditPermission && (
            <div className="_nav">
              <Button className="_btn active center" onClick={() => setIsEditMode(!isEditMode)}>
                {isEditMode ? "Cancelar" : "Editar"}
              </Button>
              {isEditMode && (
                <Button type="submit" className="_btn active center">
                  Salvar
                </Button>
              )}
            </div>
          )}
        </section>
        <section className="_card">
          <div className="_fav">
            <ChartDonut className="ico" />
          </div>
          <h2 className="center">Gráfico de Presença</h2>
          <div className="_div">
            <Pie className="_grafic pie" data={chartData} />
          </div>
        </section>
        {alerta.status && (
          <AlertCard status={alerta.status} mensagem={alerta.mensagem} onClose={() => setAlerta({ status: "", mensagem: "" })} />
        )}
      </form>
      <Footer />
    </section>
  );
}
