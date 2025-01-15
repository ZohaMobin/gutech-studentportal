import React, { useState } from "react";
import "./Attendance.css";

const Attendance = () => {
  const subjects = {
    "PSPF": [
      { date: "2025-01-10", day: "Monday", status: "Present", remarks: "-" },
      { date: "2025-01-09", day: "Sunday", status: "Absent", remarks: "Sick Leave" },
      { date: "2025-01-08", day: "Saturday", status: "Late", remarks: "Arrived late" },
    ],
    "Design Thinking": [
      { date: "2025-01-10", day: "Monday", status: "Present", remarks: "-" },
      { date: "2025-01-09", day: "Sunday", status: "Late", remarks: "Arrived late" },
      { date: "2025-01-08", day: "Saturday", status: "Absent", remarks: "Sick Leave" },
    ],
    "Functional English": [
      { date: "2025-01-11", day: "Tuesday", status: "Present", remarks: "-" },
      { date: "2025-01-10", day: "Monday", status: "Absent", remarks: "Sick Leave" },
      { date: "2025-01-09", day: "Sunday", status: "Late", remarks: "Arrived late" },
    ],
    "Discrete Maths": [
      { date: "2025-01-11", day: "Tuesday", status: "Present", remarks: "-" },
      { date: "2025-01-10", day: "Monday", status: "Late", remarks: "Arrived late" },
      { date: "2025-01-09", day: "Sunday", status: "Absent", remarks: "Sick Leave" },
    ],
    "WebTech": [
      { date: "2025-01-12", day: "Wednesday", status: "Present", remarks: "-" },
      { date: "2025-01-11", day: "Tuesday", status: "Late", remarks: "Arrived late" },
      { date: "2025-01-10", day: "Monday", status: "Absent", remarks: "Sick Leave" },
    ],
    "PSPF Lab": [
      { date: "2025-01-13", day: "Thursday", status: "Present", remarks: "-" },
      { date: "2025-01-12", day: "Wednesday", status: "Late", remarks: "Arrived late" },
      { date: "2025-01-11", day: "Tuesday", status: "Absent", remarks: "Sick Leave" },
    ],
    "WebTech Lab": [
      { date: "2025-01-14", day: "Friday", status: "Present", remarks: "-" },
      { date: "2025-01-13", day: "Thursday", status: "Late", remarks: "Arrived late" },
      { date: "2025-01-12", day: "Wednesday", status: "Absent", remarks: "Sick Leave" },
    ]
  };

  const [selectedSubject, setSelectedSubject] = useState("PSPF");

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
        <select
          className="dropdown"
          value={selectedSubject}
          onChange={(e) => handleTabChange(e.target.value)}
        >
          {Object.keys(subjects).map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
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
              <th>Day</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {subjects[selectedSubject].map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.day}</td>
                <td className={`status ${item.status.toLowerCase()}`}>{item.status}</td>
                <td>{item.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Attendance;
