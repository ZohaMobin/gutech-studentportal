import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './PieChart.css';


ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  const data = {
    labels: ['PSPF', 'Web Tech', 'Discrete Structure', 'PSPF Lab', 'Web Tech Lab', 'Design Thinking','English'],
    datasets: [
      {
        label: 'Score',
        data: [50, 65, 70, 80, 75, 65,80], 
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FFC300', '#8E44AD', '#D6A6FF','#E78C3C'],
        borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF','#FFFFFF'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
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
