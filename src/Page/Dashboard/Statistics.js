import { useEffect, useState } from 'react';
import axios from 'axios';
import './Statistics.css';

function Statistics() {
  const [overallAttWidth, setOverallAttWidth] = useState(0);
  const [overallProgressWidth, setOverallProgressWidth] = useState(0);

  useEffect(() => {
    axios.get('https://student-portal-backend-sgik.onrender.com/') // Replace with your actual API URL
      .then(response => {
        setOverallAttWidth(response.data.overallAttendance || 70);
        setOverallProgressWidth(response.data.overallProgress || 85);
      })
      .catch(error => console.error('Error fetching statistics:', error));
  }, []);

  return (
    <div className="card2">
      <h3>Statistics Overview</h3>
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
