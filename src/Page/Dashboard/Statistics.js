import { useEffect, useState } from 'react';
import axios from 'axios';
import './Statistics.css';

function Statistics() {
  const [overallAttWidth, setOverallAttWidth] = useState(70); // Default value
  const [overallProgressWidth, setOverallProgressWidth] = useState(85); // Default value
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts/1') // Replace with actual API
      .then(response => {
        setOverallAttWidth(Number(response.data.overallAttendance) || 70);
        setOverallProgressWidth(Number(response.data.overallProgress) || 85);
      })
      .catch(error => {
        console.error('Error fetching statistics:', error);
        setError("Failed to load statistics. Using default values.");
      });
  }, []);

  return (
    <div className="card2">
      <h3>Statistics Overview</h3>
      {error && <p className="error-message">{error}</p>}

      <div className="stats-bar">
        <p>Overall Attendance: {overallAttWidth}%</p>
        <div className="bar-container">
          <div className="bar overall-attendance" style={{ width: `${overallAttWidth}%` }}></div>
        </div>

        <p>Overall Progress: {overallProgressWidth}%</p>
        <div className="bar-container">
          <div className="bar overall-progress" style={{ width: `${overallProgressWidth}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
