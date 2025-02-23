import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './PieChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      // Simulate an API call with setTimeout
      setTimeout(() => {
        const dummyResponse = {
          labels: ['PSPF', 'Web Tech', 'Discrete Structure', 'PSPF Lab', 'Web Tech Lab', 'Design Thinking', 'English'],
          datasets: [
            {
              label: '%',
              data: [50, 65, 70, 80, 75, 65, 80],
              backgroundColor: [
                '#FF8C94',
                '#A0C4D4',
                '#A0E0A0',
                '#F5A6C4',
                '#C59BD8',
                '#A4D8C6',
                '#F3D2A1',
              ],
              borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
              borderWidth: 1,
            },
          ],
        };
        setChartData(dummyResponse);
        setIsLoading(false);
      }, 1000); // Simulate a 1-second delay
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setIsLoading(false);
    }
  };

  const data = chartData || {
    labels: ['PSPF', 'Web Tech', 'Discrete Structure', 'PSPF Lab', 'Web Tech Lab', 'Design Thinking', 'English'],
    datasets: [
      {
        label: '%',
        data: [50, 65, 70, 80, 75, 65, 80],
        backgroundColor: [
          '#FF8C94',
          '#A0C4D4',
          '#A0E0A0',
          '#F5A6C4',
          '#C59BD8',
          '#A4D8C6',
          '#F3D2A1',
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
          usePointStyle: true,
          boxWidth: 10,
        },
      },
    },
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

  return (
    <div className="pie-chart-container">
      <h3>Course Weightage</h3>
      <Pie data={data} options={options} />
    </div>
  );
}

export default PieChart;