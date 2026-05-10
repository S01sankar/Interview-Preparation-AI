import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Radar, Line } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

export const RadarChart = ({ scores }) => {
  const data = {
    labels: ["Technical", "Clarity", "Relevance", "Structure"],
    datasets: [
      {
        label: "Your Scores",
        data: [
          scores.technical || 0,
          scores.clarity || 0,
          scores.relevance || 0,
          scores.structure || 0,
        ],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
      },
    ],
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: { stepSize: 2, font: { size: 11 } },
        pointLabels: { font: { size: 12 } },
      },
    },
    plugins: { legend: { display: false } },
  };

  return <Radar data={data} options={options} />;
};

export const LineChart = ({ sessions }) => {
  const labels = sessions.map((s, i) => `Session ${i + 1}`);
  const scores = sessions.map((s) => s.overallScore || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Overall Score",
        data: scores,
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        pointRadius: 5,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: { stepSize: 2 },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      x: { grid: { display: false } },
    },
    plugins: { legend: { display: false } },
    responsive: true,
  };

  return <Line data={data} options={options} />;
};