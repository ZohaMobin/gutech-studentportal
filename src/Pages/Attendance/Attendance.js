import React, { useState } from "react";
import "./Attendance.css";

const Attendance = () => {
  const subjects = {
    Math: [
      { date: "2025-01-05", remarks: "-", status: "Present", submit: "Submitted" },
      { date: "2025-01-04", remarks: "Sick Leave", status: "Absent", submit: "Upload" },
      { date: "2025-01-03", remarks: "Arrived late", status: "Late", submit: "Upload" },
    ],
    Science: [
      { date: "2025-01-06", remarks: "-", status: "Present", submit: "Submitted" },
      { date: "2025-01-05", remarks: "Arrived late", status: "Late", submit: "Upload" },
      { date: "2025-01-04", remarks: "Sick Leave", status: "Absent", submit: "Upload" },
    ],
    English: [
      { date: "2025-01-07", remarks: "-", status: "Present", submit: "Submitted" },
      { date: "2025-01-06", remarks: "Arrived late", status: "Late", submit: "Upload" },
      { date: "2025-01-05", remarks: "Sick Leave", status: "Absent", submit: "Upload" },
    ],
  };

  const [selectedSubject, setSelectedSubject] = useState("Math");

  const calculatePercentage = () => {
    const totalDays = subjects[selectedSubject].length;
    const presentDays = subjects[selectedSubject].filter(
      (item) => item.status === "Present"
    ).length;
    return Math.round((presentDays / totalDays) * 100);
  };

  const [percentage, setPercentage] = useState(calculatePercentage());

  const handleTabChange = (subject) => {
    setSelectedSubject(subject);
    setPercentage(calculatePercentage());
  };

  return (
    <div className="attendance-container">
      <header className="header">
        <h1>Attendance</h1>
        <p>View your attendance by subject</p>
      </header>

      <section className="tabs">
        {Object.keys(subjects).map((subject) => (
          <button
            key={subject}
            className={`tab-button ${
              selectedSubject === subject ? "active" : ""
            }`}
            onClick={() => handleTabChange(subject)}
          >
            {subject}
          </button>
        ))}
      </section>

      <section className="attendance-summary">
        <h2>{selectedSubject} Attendance Percentage</h2>
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
            {subjects[selectedSubject].map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.remarks}</td>
                <td className={`status ${item.status.toLowerCase()}`}>{item.status}</td>
                <td>
                  <button type="button" className="submit-btn">
                    {item.submit}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Attendance;
