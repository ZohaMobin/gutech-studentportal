import React, { useState, useEffect } from "react";
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
import axios from 'axios'; // Import axios

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Attendance",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
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
        // Transform the API data to match the chart's data structure.
        const transformedData = response.data.slice(0, 6).map((item, index) => ({
          label: ["Pspf", "DM", "Pspf Lab", "Web tech", "Web tech lab", "Eng"][index], //use the original label array
          attendance: Math.floor(Math.random() * (100 - 60 + 1)) + 60, //generate random attendance data between 60-100
        }));

        setData({
          labels: transformedData.map((item) => item.label),
          datasets: [
            {
              label: "Attendance",
              data: transformedData.map((item) => item.attendance),
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
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
        text: "Attendance Data",
      },
    },
  };

  if (isLoading) {
    return <div className="attendance-bargraph"><h2>Loading Attendance Data...</h2></div>;
  }

  if (error) {
    return <div className="attendance-bargraph"><h2>Error: {error.message}</h2></div>;
  }

  return (
    <div className="attendance-bargraph">
      <h2>Attendance Overview</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;