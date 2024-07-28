import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const initialChartData: ChartData<"pie", number[], string> = {
  labels: ["Presente", "Ausente"],
  datasets: [{
    label: 'Número de aulas',
    data: [0, 0],
    backgroundColor: ["#66ff66", "#ff66c4"],
    borderColor: ["#66ff66", "#ff66c4"],
    borderWidth: 2
  }]
};

export function GCJ() {
  const [chartData, setChartData] = useState<ChartData<"pie", number[], string>>(initialChartData);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVIDOR_URL}/statistics/chamada/juniores`)
      .then(response => response.json())
      .then((data: { Presenca: string }[]) => {
        
        if (!Array.isArray(data) || !data.every(item => 'Presenca' in item)) {
          throw new Error("Dados inválidos da API");
        }

        const presencaCounts = data.reduce((acc: { presente: number, ausente: number }, aluno: { Presenca: string }) => {
          if (aluno.Presenca === 'presente') {
            acc.presente += 1;
          } else if (aluno.Presenca === 'ausente') {
            acc.ausente += 1;
          }
          return acc;
        }, { presente: 0, ausente: 0 });

        setChartData({
          labels: ["Presente", "Ausente"],
          datasets: [
            {
              label: "Número de aulas",
              data: [presencaCounts.presente, presencaCounts.ausente],
              backgroundColor: ["#66ff66", "#ff66c4"],
              borderColor: ["#66ff66", "#ff66c4"],
              borderWidth: 2
            }
          ]
        });
      })
      .catch(error => {
        console.error("Erro ao buscar dados:", error);
      });
  }, []);

  return (
    <section className="_card">
      <h2 className="center">Presença juniores</h2>
      <Pie className="_grafic pie" data={chartData} />
    </section>
  );
}
