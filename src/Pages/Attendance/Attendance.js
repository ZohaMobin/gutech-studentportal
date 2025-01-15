import React, { useState, useEffect } from "react";
import { Calendar, Filter, Clock } from "lucide-react";
import "./Attendance.css";

const Attendance = () => {
  const subjects = {
    PSPF: [
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
    WebTech: [
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
    ],
  };

  const [selectedSubject, setSelectedSubject] = useState("PSPF");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filteredAttendance, setFilteredAttendance] = useState(subjects[selectedSubject]);
  const [percentage, setPercentage] = useState(0);

  const calculatePercentage = (subjectData) => {
    const totalDays = subjectData.length;
    const presentDays = subjectData.filter((item) => item.status === "Present").length;
    return Math.round((presentDays / totalDays) * 100);
  };

  useEffect(() => {
    let filtered = subjects[selectedSubject];

    if (filterType === "date" && filterDate) {
      filtered = filtered.filter((item) => item.date === filterDate);
    } else if (filterType === "month" && filterDate) {
      const [year, month] = filterDate.split("-");
      filtered = filtered.filter((item) => item.date.startsWith(`${year}-${month}`));
    } else if (filterType === "week" && filterDate) {
      const selectedDate = new Date(filterDate);
      const weekStart = new Date(selectedDate);
      weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= weekStart && itemDate <= weekEnd;
      });
    }

    setFilteredAttendance(filtered);
    setPercentage(calculatePercentage(filtered));
  }, [selectedSubject, filterDate, filterType]);

  return (
    <div className="attendance-container">
      <header className="header">
        <div className="header-content">
          <h1>Attendance Dashboard</h1>
          <div className="subject-info">
            <span className="subject-label">Current Subject:</span>
            <span className="selected-subject">{selectedSubject}</span>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="sidebar">
          <nav className="subject-tabs">
            {Object.keys(subjects).map((subject) => (
              <button
                key={subject}
                className={`tab ${selectedSubject === subject ? "active" : ""}`}
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </nav>
        </div>

        <div className="content-area">
          <div className="stats-cards">
            <div className="stat-card attendance-circle">
              <div className="circle-wrapper">
                <svg viewBox="0 0 150 150">
                  <circle cx="75" cy="75" r="65" className="circle-bg" />
                  <circle
                    cx="75"
                    cy="75"
                    r="65"
                    className="circle-progress"
                    style={{
                      strokeDashoffset: `${408 - (408 * percentage) / 100}px`,
                    }}
                  />
                </svg>
                <div className="circle-content">
                  <span className="percentage">{percentage}%</span>
                  <span className="label">Present</span>
                </div>
              </div>
            </div>
          </div>

          <div className="filter-container">
            <div className="filter-header">
              <Filter size={20} />
              <h3>Filter Records</h3>
            </div>
            <div className="filter-controls">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Records</option>
                <option value="date">By Date</option>
                <option value="month">By Month</option>
                <option value="week">By Week</option>
              </select>

              {filterType !== "all" && (
                <input
                  type={filterType === "date" ? "date" : "month"}
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="filter-input"
                />
              )}
            </div>
          </div>

          <div className="table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>
                    <Calendar size={16} /> Date
                  </th>
                  <th>
                    <Clock size={16} /> Day
                  </th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.day}</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
