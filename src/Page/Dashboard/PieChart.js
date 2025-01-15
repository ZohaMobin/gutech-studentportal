import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './PieChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  const data = {
    labels: ['PSPF', 'Web Tech', 'Discrete Structure', 'PSPF Lab', 'Web Tech Lab', 'Design Thinking', 'English'],
    datasets: [
      {
        label: 'Score',
        data: [50, 65, 70, 80, 75, 65, 80],
        backgroundColor: [
          '#FF8C94',  // Darker Light Pink
          '#A0C4D4',  // Darker Soft Light Blue
          '#A0E0A0',  // Darker Pale Mint Green
          '#F5A6C4',  // Darker Soft Blush Pink
          '#C59BD8',  // Darker Lavender Purple
          '#A4D8C6',  // Darker Soft Seafoam Green
          '#F3D2A1'   // Darker Creamy Peach
        ],
        borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true, // Use point style for the legend (small circle)
          boxWidth: 10,        // Size of the legend color box
        },
      },
    },
  };

  return (
    <div className="pie-chart-container">
      <h3>Course Weightage</h3>
      <Pie data={data} options={options} />
    </div>
  );
}

export default PieChart;
