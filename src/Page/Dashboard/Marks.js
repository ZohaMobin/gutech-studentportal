import React, { useState, useEffect } from "react";
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
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartmarks = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Marks (%)",
        data: [],
        backgroundColor: [
          '#FF8C94',
          '#A0C4D4',
          '#A0E0A0',
          '#F5A6C4',
          '#C59BD8',
          '#A4D8C6',
        ],
        borderColor: [
          '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
        ],
        borderWidth: 1,
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
        const transformedData = response.data.slice(0, 6).map((item, index) => ({
          label: ["Pspf", "DM", "Pspf Lab", "Web tech", "Web tech lab", "Eng"][index],
          marks: Math.floor(Math.random() * (100 - 60 + 1)) + 60, // Generate random marks between 60 and 100
        }));

        setData({
          labels: transformedData.map((item) => item.label),
          datasets: [
            {
              label: "Marks (%)",
              data: transformedData.map((item) => item.marks),
              backgroundColor: [
                '#FF8C94',
                '#A0C4D4',
                '#A0E0A0',
                '#F5A6C4',
                '#C59BD8',
                '#A4D8C6',
              ],
              borderColor: [
                '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (isLoading) {
    return <div className="marks-bargraph"><h2>Loading Marks Data...</h2></div>;
  }

  if (error) {
    return <div className="marks-bargraph"><h2>Error: {error.message}</h2></div>;
  }

  return (
    <div className="marks-bargraph">
      <h2>Marks Overview</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartmarks;