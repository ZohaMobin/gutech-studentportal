import React, { useState, useEffect } from "react";
import "./Attendance.css";

const Attendance = () => {
  const attendanceData = [
    { date: "2025-01-03", remarks: "-", status: "Present", submit: "Submitted" },
    { date: "2025-01-02", remarks: "Sick Leave", status: "Absent", submit: "Upload" },
    { date: "2025-01-01", remarks: "Arrived late", status: "Late", submit: "Upload" },
    { date: "2024-12-27", remarks: "Arrived late", status: "Late", submit: "Upload" },
    { date: "2024-12-25", remarks: "-", status: "Present", submit: "Submitted" },
    { date: "2024-12-23", remarks: "Sick Leave", status: "Absent", submit: "Upload" },
  ];

  // Calculate attendance percentage
  const calculatePercentage = () => {
    const totalDays = attendanceData.length;
    const presentDays = attendanceData.filter(item => item.status === "Present").length;
    return Math.round((presentDays / totalDays) * 100);
  };

  const [percentage, setPercentage] = useState(calculatePercentage());

  useEffect(() => {
    setPercentage(calculatePercentage());
  }, [attendanceData]);

  return (
    <div className="attendance-container">
      <header className="header">
        <h1>Attendance</h1>
        <p>View your attendance</p>
      </header>

      <section className="attendance-summary">
        <h2>Semester 1 Percentage</h2>
        <div className="circle">
          <svg width="150" height="150">
            <circle
              cx="75"
              cy="75"
              r="65"
              stroke="#e6e6e6"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="75"
              cy="75"
              r="65"
              stroke="#991D20"
              strokeWidth="10"
              fill="none"
              strokeDasharray="408"
              strokeDashoffset={408 - (408 * percentage) / 100}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <span>{percentage}%</span>
          <p>Attendance Completed</p>
        </div>
      </section>

      <section className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Remarks</th>
              <th>Status</th>
              <th>Submit</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.remarks}</td>
                <td className={`status ${item.status.toLowerCase()}`}>{item.status}</td>
                <td>
                  <button type="button" className="submit-btn">{item.submit}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button type="button" className="page-btn">&lt;</button>
          <button type="button" className="page-btn active">1</button>
          <button type="button" className="page-btn">2</button>
          <button type="button" className="page-btn">3</button>
          <button type="button" className="page-btn">&gt;</button>
        </div>
      </section>
    </div>
  );
};

export default Attendance;
