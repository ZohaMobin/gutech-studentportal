import React from "react";
import { Bar } from "react-chartjs-2";
import './Attendancebargraph.css';
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

const BarChart = () => {

  const data = {
    labels: ["Pspf", "DM", "Pspf Lab", "Web tech", "Web tech lab", "Eng"],
    datasets: [
      {
        label: "Attendance",
        data: [300, 500, 400, 700, 600, 500],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
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
        text: "Attendance Data",
      },
    },
  };

  return (
    <div className="attendance-bargraph">
      <h2>Attendance Overview</h2>
      <Bar data={data} options={options} />
    </div>
  );
};


export default BarChart;
