// import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StatsChartProps {
  labels: string[];
  completedData: number[];
  totalData: number[];
}

export default function StatsChart({ labels, completedData, totalData }: StatsChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Complétées",
        data: completedData,
        backgroundColor: "#4f46e5",
        borderRadius: 6,
      },
      {
        label: "Totales",
        data: totalData,
        backgroundColor: "#a5b4fc",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Tâches par jour" },
    },
  };

  return <Bar data={data} options={options} />;
}
