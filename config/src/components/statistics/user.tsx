import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartDonut } from '@phosphor-icons/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
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

export function UserStatistics() {
  const [chartData, setChartData] = useState({
    labels: ['Minhas Aulas', 'Outras Aulas'],
    datasets: [
      {
        label: 'Minhas Aulas',
        data: [0, 0],
        backgroundColor: '#ffae80',
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
      {
        label: 'Outras Aulas',
        data: [0, 0],
        backgroundColor: '#ff66c4',
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
    ],
  });

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`${import.meta.env.VITE_SERVIDOR_URL}/statistics/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const classesData = await response.json();
          console.log("Classes Data:", classesData);

          setChartData({
            labels: ['Minhas Aulas', 'Outras Aulas'],
            datasets: [
              {
                label: 'Minhas Aulas',
                data: [classesData.minhasAulas.length, 0],
                backgroundColor: '#ffae80',
                barPercentage: 1.0,
                categoryPercentage: 1.0,
              },
              {
                label: 'Outras Aulas',
                data: [0, classesData.outrasAulas.length],
                backgroundColor: '#ff66c4',
                barPercentage: 1.0,
                categoryPercentage: 1.0,
              },
            ],
          });
        } else {
          console.error('Erro ao obter as aulas:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao obter as aulas:', error);
      }
    };

    fetchClassData();
  }, []);

  return (
    <section className="_card">
      <div className="_fav">
        <ChartDonut className="ico" />
      </div>
      <h2>Minhas estastísticas</h2>
      <div className="_div">
        <Bar data={chartData} options={options} />
      </div>
    </section>
  );
}
