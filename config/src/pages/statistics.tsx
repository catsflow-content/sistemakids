import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartData
} from "chart.js";

import { Footer, Header } from "../contents/layout";
import { GCJ } from "../components/statistics/gcj";
import { GCM } from "../components/statistics/gcm";
import { UserStatistics } from "../components/statistics/user";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const initialChartData: ChartData<"pie", number[], string> = {
  labels: [],
  datasets: [{
    label: 'Número de alunos',
    data: [],
    backgroundColor: [],
    borderColor: [],
    borderWidth: 1
  }]
};

const initialBarData: ChartData<"bar", number[], string> = {
  labels: [],
  datasets: []
};

interface Aluno {
  turma: string;
  idade: string;
}

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    }
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      beginAtZero: true,
    },
  },
};

export function Statistics() {
  const [chartData, setChartData] = useState<ChartData<"pie", number[], string>>(initialChartData);
  const [barData, setBarData] = useState<ChartData<"bar", number[], string>>(initialBarData);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVIDOR_URL}/statistics/alunos`)
      .then(response => response.json())
      .then((data: Aluno[]) => {
        const turmaCounts = data.reduce((acc: Record<string, number>, aluno: Aluno) => {
          acc[aluno.turma] = (acc[aluno.turma] || 0) + 1;
          return acc;
        }, {});

        const idadeCounts = data.reduce((acc: Record<string, number>, aluno: Aluno) => {
          acc[aluno.idade] = (acc[aluno.idade] || 0) + 1;
          return acc;
        }, {});

        const turmaLabels = Object.keys(turmaCounts);
        const turmaValues = Object.values(turmaCounts);

        const idadeLabels = Object.keys(idadeCounts).sort((a, b) => parseInt(a) - parseInt(b));
        const idadeValues = idadeLabels.map(age => idadeCounts[age]);

        setChartData({
          labels: turmaLabels,
          datasets: [
            {
              label: "Número de alunos",
              data: turmaValues,
              backgroundColor: [
                "#38b6ff",
                "#ff66c4",
              ],
              borderColor: [
                "#38b6ff",
                "#ff66c4",
              ],
              borderWidth: 2
            }
          ]
        });

        setBarData({
          labels: idadeLabels,
          datasets: idadeLabels.map((age, index) => ({
            label: ` ${age}`,
            data: idadeLabels.map(label => (label === age ? idadeCounts[age] : 0)),
            backgroundColor: [
              "#38b6ff",
              "#ff66c4",
              "#ffb6b6",
              "#ffc66c",
              "#b6ffb6",
              "#8c52ff",
              "#ffccff",
              "#66ff66"
            ][index % 8],
            borderColor: [
              "#38b6ff",
              "#ff66c4",
              "#ffb6b6",
              "#ffc66c",
              "#b6ffb6",
              "#8c52ff",
              "#ffccff",
              "#66ff66"
            ][index % 8],
            borderWidth: 2,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
          }))
        });
      })
      .catch(error => {
        console.error("Erro ao buscar dados:", error);
      });
  }, []);

  return (
    <section className="_body">
      <Helmet>
        <title>Estatísticas • Sistema Kids | Ministério Kids</title>
        <meta name="title" content="Estatísticas • Sistema Kids | Ministério Kids" />
      </Helmet>
      <Header />
      <main className="_main">
        <section className="_card">
          <h2 className="center">Alunos por turma</h2>
          <Pie className="_grafic pie" data={chartData} />
        </section>
        <section className="_card">
          <h2 className="center">Idade dos alunos</h2>
          <Bar className="_grafic" data={barData} options={barOptions} />
        </section>
        <GCJ />
        <GCM />
        <UserStatistics />
      </main>
      <Footer />
    </section>
  );
}
