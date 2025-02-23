import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import './PieChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1'); // Dummy API
      console.log('API Response:', response.data); // Debugging API response

      // Simulated API response data
      const dummyResponse = {
        labels: ['PSPF', 'Web Tech', 'Discrete Structure', 'PSPF Lab', 'Web Tech Lab', 'Design Thinking', 'English'],
        datasets: [
          {
            label: '%',
            data: [50, 65, 70, 80, 75, 65, 80],
            backgroundColor: [
              '#FF8C94', '#A0C4D4', '#A0E0A0', '#F5A6C4', '#C59BD8', '#A4D8C6', '#F3D2A1',
            ],
            borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
            borderWidth: 1,
          },
        ],
      };

      setChartData(dummyResponse);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to load chart data.');
    } finally {
      setIsLoading(false);
    }
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
    return <div className="loading-message">Loading Chart Data...</div>;
  }

  if (error) {
    return <div className="error-message" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="pie-chart-container">
      <h3>Course Weightage</h3>
      {chartData && <Pie data={chartData} options={options} />}
    </div>
  );
}

export default PieChart;
