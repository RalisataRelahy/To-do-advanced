import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatsChartProps {
  labels: string[];
  completedData: number[];
  totalData: number[];
}

export default function StatsChart({
  labels,
  completedData,
  totalData,
}: StatsChartProps) {
  const maxData=Math.max(...totalData);
  const yMax=Math.max(3,maxData);
  const data = useMemo<ChartData<"bar">>(() => ({
    labels,
    datasets: [
      {
        label: "Complétées",
        data: completedData,
        backgroundColor: "rgba(79,70,229,0.9)",
        borderRadius: 6,
        barThickness: 24,
      },
      {
        label: "Totales",
        data: totalData,
        backgroundColor: "rgba(165,180,252,0.9)",
        borderRadius: 6,
        barThickness: 24,
      },
    ],
  }), [labels, completedData, totalData]);

  const options = useMemo<ChartOptions<"bar">>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "Tâches par jour",
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min:0,
        max:yMax,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }), []);

  if (!labels.length) {
    return <p>Aucune donnée disponible</p>;
  }

  return (
    <div style={{ height: 300 }}>
      <Bar data={data} options={options} />
    </div>
  );
}
