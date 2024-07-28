import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from 'axios';

import { Checkbox } from "@chakra-ui/react";
import { GearFine } from "@phosphor-icons/react";
import { AlertCard, Footer, Header } from "../../contents/layout";


interface Config {
  id: number;
  name: string;
  value: boolean;
}

export function ACP() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [alerta, setAlerta] = useState<{ status: string, mensagem: string }>({ status: '', mensagem: '' });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await axios.get<Config[]>(`${import.meta.env.VITE_SERVIDOR_URL}/config/view`);
      console.log(response.data);  
      setConfigs(response.data);
    } catch (error) {
      console.error("Falha ao obter as configurações", error);
      setAlerta({ status: 'error', mensagem: 'Falha ao obter as configurações' });
    }
  };

  const handleCheckboxChange = async (id: number, value: boolean) => {
    try {
      const response = await axios.put<Config>(`${import.meta.env.VITE_SERVIDOR_URL}/config/edit/${id}`, { value });
      const updatedConfig = response.data;
      setConfigs(configs.map(config => config.id === updatedConfig.id ? updatedConfig : config));
      setAlerta({ status: 'success', mensagem: 'Configuração atualizada com sucesso' });
    } catch (error) {
      console.error("Falha na atualização da configuração", error);
      setAlerta({ status: 'error', mensagem: 'Falha na atualização da configuração' });
    }
  };

  return (
    <section className="_body _hw">
      <Helmet>
        <title>Configurações do sistema • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Configurações do sistema • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main _acp">
        {alerta.status && (
          <AlertCard status={alerta.status} mensagem={alerta.mensagem} onClose={() => setAlerta({ status: '', mensagem: '' })} />
        )}
        <section className="_card">
          <div className="_fav">
            <GearFine className="ico" />
          </div>
          <h2>Configurações</h2>
          <section className="_div">
            {Array.isArray(configs) && configs.map(config => (
              <div className="_div" key={config.id}>
                <span className="_cnt">
                  <p>{config.name}</p>
                  <Checkbox
                    name={config.name}
                    className="_btn check"
                    isChecked={config.value}
                    onChange={(e) => handleCheckboxChange(config.id, e.target.checked)}
                  ></Checkbox>
                </span>
              </div>
            ))}
          </section>
        </section>
      </main>
      <Footer />
    </section>
  );
}
