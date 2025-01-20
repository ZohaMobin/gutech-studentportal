import React from "react";
import { Bar } from "react-chartjs-2";
import './Marks.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartmarks = () => {

  const data = {
    labels: ["Pspf", "DM", "Pspf Lab", "Web tech", "Web tech lab", "Eng"],
    datasets: [
      {
        label: "Marks (%)",
        data: [85, 72, 90, 65, 88, 77], 
        backgroundColor: [
          '#FF8C94',  // Darker Light Pink
          '#A0C4D4',  // Darker Soft Light Blue
          '#A0E0A0',  // Darker Pale Mint Green
          '#F5A6C4',  // Darker Soft Blush Pink
          '#C59BD8',  // Darker Lavender Purple
          '#A4D8C6',  // Darker Soft Seafoam Green
        ],
        borderColor: [
          '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', 
        ],
        borderWidth: 1,
      },
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Marks Distribution",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div className="marks-bargraph">
      <h2>Marks Overview</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartmarks;
