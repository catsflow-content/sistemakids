import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { Select } from "@chakra-ui/react";
import InputMask from 'react-input-mask';
import { Helmet } from "react-helmet";
import axios from "axios";
import { AlertCard, Footer, Header } from "../../contents/layout";

interface FormData {
  nome: string;
  idade: string;
  responsavel: string;
  sexo: string;
  dataNascimento: string;
  observacao: string;
  turma: string;
}

interface AlertState {
  status: string;
  mensagem: string;
}

export function RNA() {
  const initialState: FormData = {
    nome: '',
    idade: '',
    responsavel: '',
    sexo: '',
    dataNascimento: '',
    observacao: '',
    turma: '',
  };

  const [formData, setFormData] = useState<FormData>(initialState);
  const [alerta, setAlerta] = useState<AlertState>({ status: '', mensagem: '' });

  useEffect(() => {
    updateTurma(formData.idade);
  }, [formData.idade]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateTurma = (idade: string) => {
    let turma = '';
    if (['3 anos', '4 anos', '5 anos', '6 anos'].includes(idade)) {
      turma = 'Maternal';
    } else if (['7 anos', '8 anos', '9 anos'].includes(idade)) {
      turma = 'Juniores';
    }
    setFormData(prevFormData => ({ ...prevFormData, turma }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVIDOR_URL}/alunos/register`, formData);
      if (response.status === 200) {
        setAlerta({ status: "success", mensagem: "Aluno adicionado com sucesso" });
        setFormData(initialState);
      } else {
        setAlerta({ status: "error", mensagem: "Erro ao adicionar aluno" });
      }
    } catch (error) {
      console.error("Erro ao enviar requisição:", error);
      setAlerta({ status: "error", mensagem: "Erro ao adicionar aluno" });
    }
  };

  return (
    <section className="_body _hw _cadaluno">
      <Helmet>
        <title>Registrar novo aluno • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Registrar novo aluno • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        {alerta.status && (
          <AlertCard status={alerta.status} mensagem={alerta.mensagem} onClose={() => setAlerta({ status: '', mensagem: '' })} />
        )}
        <form className="_card" onSubmit={handleSubmit}>
          <h2 className="center">Cadastrar aluno</h2>
          <div className="_div">
            <input className="_input" type="text" placeholder="Nome do aluno" name="nome" value={formData.nome} onChange={handleChange} required />
            <InputMask className="_input" type="tel" mask="99/99/9999" placeholder="Data de nascimento" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required />
            <textarea className="_textarea" name="observacao" placeholder="Observação" value={formData.observacao} onChange={handleChange}></textarea>
            <section className="_nav">
              <label className="_select" htmlFor="selsex">
                <Select className="camp" id="selsex" name="sexo" placeholder="Sexo" title="Sexo do aluno" value={formData.sexo} onChange={handleChange} required>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                </Select>
              </label>
              <label className="_select" htmlFor="idade">
                <Select title="Selecionar idade do aluno" placeholder="Idade" id="idade" className="sel camp" name="idade" value={formData.idade} onChange={handleChange} required>
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
            </section>
            <label className="_select" htmlFor="selturma">
              <Select className="camp" placeholder="Selecionar turma" id="selturma" name="turma" title="Turma do aluno" value={formData.turma} onChange={handleChange} required>
                <option value="Maternal">Turma do maternal</option>
                <option value="Juniores">Turma do juniores</option>
              </Select>
            </label>
          </div>
          <button title="Cadastrar aluno" className="_btn active center" type="submit">Cadastrar</button>
        </form>
      </main>
      <Footer />
    </section>
  );
}