import React, { useState, useEffect } from 'react';
import './dashboardPage.css';

const Dashboard = () => {
  // State to track viewport size
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const user = JSON.parse(sessionStorage.getItem('user'));
  // Sample student data
  const studentData = {
    name: user?.name,
    id: "STU2025031",
    program: "Computer Science",
    semester: "Spring 2025",
    year: 3,
    cgpa: 3.7,
    attendance: {
      overall: 87,
      subjects: [
        { name: "Data Structures", percentage: 92 },
        { name: "Algorithm Design", percentage: 85 },
        { name: "Web Development", percentage: 78 },
        { name: "Database Systems", percentage: 91 }
      ]
    },
    courses: [
      { name: "Data Structures", marks: 88, total: 100 },
      { name: "Algorithm Design", marks: 76, total: 100 },
      { name: "Web Development", marks: 81, total: 100 },
      { name: "Database Systems", marks: 92, total: 100 }
    ],
    timetable: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
      classes: [
        { day: "Monday", time: "9:00 AM", subject: "Data Structures", location: "Hall A-101", duration: "2h" },
        { day: "Monday", time: "1:00 PM", subject: "Web Development", location: "Lab B-203", duration: "2h" },
        { day: "Tuesday", time: "11:00 AM", subject: "Algorithm Design", location: "Hall A-102", duration: "2h" },
        { day: "Tuesday", time: "3:00 PM", subject: "Database Systems", location: "Lab B-205", duration: "2h" },
        { day: "Wednesday", time: "9:00 AM", subject: "Data Structures", location: "Hall A-101", duration: "2h" },
        { day: "Thursday", time: "11:00 AM", subject: "Algorithm Design", location: "Hall A-102", duration: "2h" },
        { day: "Thursday", time: "3:00 PM", subject: "Database Systems", location: "Lab B-205", duration: "2h" },
        { day: "Friday", time: "1:00 PM", subject: "Web Development", location: "Lab B-203", duration: "2h" }
      ]
    }
  };

  // Listen for window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cgpaLevel = (studentData.cgpa / 4) * 100;
  
  // Use abbreviated days for mobile
  const getDayLabel = (day) => {
    if (isMobile) {
      return day.substring(0, 3); // "Monday" becomes "Mon"
    }
    return day;
  };
  
  // Simplify time format for mobile
  const getTimeLabel = (time) => {
    if (isMobile) {
      return time.replace(':00', '').replace(' AM', 'a').replace(' PM', 'p'); // "9:00 AM" becomes "9a"
    }
    return time;
  };
  
  // Shorten subject names for small screens if needed
  const getSubjectLabel = (subject) => {
    if (windowWidth < 576) {
      // Create abbreviations for subjects on very small screens
      switch(subject) {
        case "Data Structures": return "DS";
        case "Algorithm Design": return "Algo";
        case "Web Development": return "Web";
        case "Database Systems": return "DB";
        default: return subject;
      }
    }
    if (windowWidth < 768) {
      // Shortened names for small screens
      switch(subject) {
        case "Data Structures": return "Data Struct.";
        case "Algorithm Design": return "Algorithms";
        case "Web Development": return "Web Dev";
        case "Database Systems": return "Database";
        default: return subject;
      }
    }
    return subject;
  };

  const getGradeColor = (marks, total) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return "var(--success-color)";
    if (percentage >= 80) return "var(--success-light)";
    if (percentage >= 70) return "var(--warning-color)";
    if (percentage >= 60) return "var(--warning-light)";
    return "var(--danger-color)";
  };

  const getClassByTimeAndDay = (day, time) => {
    return studentData.timetable.classes.find(
      cls => cls.day === day && cls.time === time
    );
  };

  const getClassColor = (subject) => {
    switch(subject) {
      case "Data Structures":
        return "var(--primary-light)";
      case "Algorithm Design":
        return "var(--secondary-light)";
      case "Web Development":
        return "var(--accent-light)";
      case "Database Systems":
        return "var(--success-light)";
      default:
        return "var(--light-bg)";
    }
  };

  // Choose which days to display based on screen size
  const displayDays = () => {
    if (windowWidth < 576) {
      // For very small screens, show only current day + next day (simulating "today" and "tomorrow")
      const today = new Date().getDay(); // 0=Sunday, 1=Monday, ...
      const dayIndex = today === 0 || today > 5 ? 0 : today - 1; // Adjust to match our days array (0=Monday)
      const nextDayIndex = (dayIndex + 1) % 5;
      return [studentData.timetable.days[dayIndex], studentData.timetable.days[nextDayIndex]];
    }
    if (windowWidth < 768) {
      // For medium-small screens, show 3 days
      return studentData.timetable.days.slice(0, 3);
    }
    // For larger screens, show all days
    return studentData.timetable.days;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        {/* Header content can be added here */}
      </div>
      
      <div className="student-profile">
        <div className="profile-content">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {studentData.name.split(' ').map(name => name[0]).join('')}
            </div>
          </div>
          <div className="profile-info">
            <h2>{studentData.name}</h2>
            <div className="student-details">
              <div className="detail-item"><span className="detail-label">ID:</span><span className="detail-value">{studentData.id}</span></div>
              <div className="detail-item"><span className="detail-label">Program:</span><span className="detail-value">{isMobile ? "CS" : studentData.program}</span></div>
              <div className="detail-item"><span className="detail-label">Semester:</span><span className="detail-value">{studentData.semester}</span></div>
              <div className="detail-item"><span className="detail-label">Year:</span><span className="detail-value">{studentData.year}</span></div>
            </div>
          </div>
        </div>
        
        <div className="cgpa-meter-container">
          <h3>CGPA Performance</h3>
          <div className="cgpa-meter">
            <div className="cgpa-value">{studentData.cgpa.toFixed(2)}<span className="cgpa-max">/4.0</span></div>
            <div className="meter">
              <div className="meter-fill" style={{ width: `${cgpaLevel}%` }}></div>
            </div>
            <div className="meter-scale">
              {!isMobile ? (
                <>
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </>
              ) : (
                <>
                  <span>P</span>
                  <span>A</span>
                  <span>G</span>
                  <span>E</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card attendance-card">
          <div className="card-header">
            <h3>Attendance</h3>
            <div className="card-actions">
              <button className="card-action-button"><i className="fas fa-ellipsis-h"></i></button>
            </div>
          </div>
          <div className="attendance-overview">
            <div className="attendance-circle">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg" d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" strokeDasharray={`${studentData.attendance.overall}, 100`} d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="17" className="percentage-value">{studentData.attendance.overall}</text>
                <text x="18" y="22" className="percentage-symbol">%</text>
              </svg>
              <div className="attendance-label">Overall</div>
            </div>
            <div className="attendance-details">
              {studentData.attendance.subjects.map((subject, index) => (
                <div key={index} className="subject-attendance">
                  <div className="subject-info">
                    <div className="subject-name">{getSubjectLabel(subject.name)}</div>
                    <div className="attendance-value">{subject.percentage}%</div>
                  </div>
                  <div className="attendance-bar-container">
                    <div 
                      className="attendance-bar" 
                      style={{ 
                        width: `${subject.percentage}%`, 
                        backgroundColor: subject.percentage >= 85 ? 'var(--success-color)' : 
                                        subject.percentage >= 75 ? 'var(--warning-color)' : 
                                        'var(--danger-color)'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-card marks-card">
          <div className="card-header">
            <h3>Course Performance</h3>
            <div className="card-actions">
              <button className="card-action-button"><i className="fas fa-ellipsis-h"></i></button>
            </div>
          </div>
          <div className="course-performance">
            {studentData.courses.map((course, index) => (
              <div key={index} className="course-item">
                <div className="course-header">
                  <span className="course-name">{getSubjectLabel(course.name)}</span>
                  <span className="course-marks">{course.marks}/{course.total}</span>
                </div>
                <div className="course-progress-container">
                  <div 
                    className="course-progress" 
                    style={{ 
                      width: `${(course.marks / course.total) * 100}%`, 
                      backgroundColor: getGradeColor(course.marks, course.total) 
                    }}
                  ></div>
                </div>
                <div className="grade-indicator">
                  {course.marks >= 90 ? 'A' : 
                   course.marks >= 80 ? 'B' : 
                   course.marks >= 70 ? 'C' : 
                   course.marks >= 60 ? 'D' : 'F'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card timetable-card">
          <div className="card-header">
            <h3>{windowWidth < 576 ? "Schedule" : "Weekly Timetable"}</h3>
            <div className="card-actions">
              <button className="card-action-button"><i className="fas fa-ellipsis-h"></i></button>
            </div>
          </div>
          <div className="timetable-container">
            <div className="timetable-grid">
              <div className="timetable-header time-column">
                <div className="timetable-cell"></div>
                {studentData.timetable.timeSlots.map((time, index) => (
                  <div key={index} className="timetable-cell time-cell">{getTimeLabel(time)}</div>
                ))}
              </div>
              
              {displayDays().map((day, dayIndex) => (
                <div key={dayIndex} className="timetable-column">
                  <div className="timetable-cell day-cell">{getDayLabel(day)}</div>
                  
                  {studentData.timetable.timeSlots.map((time, timeIndex) => {
                    const classInfo = getClassByTimeAndDay(day, time);
                    return (
                      <div key={timeIndex} className="timetable-cell class-cell">
                        {classInfo ? (
                          <div 
                            className="class-item" 
                            style={{ backgroundColor: getClassColor(classInfo.subject) }}
                          >
                            <div className="class-subject">{getSubjectLabel(classInfo.subject)}</div>
                            <div className="class-details">
                              <span className="class-location">{windowWidth < 576 ? classInfo.location.split('-')[1] : classInfo.location}</span>
                              <span className="class-duration">{classInfo.duration}</span>
                            </div>
                          </div>
                        ) : <div className="class-empty"></div>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="dashboard-card performance-summary">
          <div className="card-header">
            <h3>Performance Summary</h3>
            <div className="card-actions">
              <button className="card-action-button"><i className="fas fa-ellipsis-h"></i></button>
            </div>
          </div>
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)' }}>
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">84.2%</div>
                <div className="stat-label">Average Score</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)' }}>
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">12/15</div>
                <div className="stat-label">Assignments</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)' }}>
                <i className="fas fa-star"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">3.7</div>
                <div className="stat-label">GPA Trend</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)' }}>
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">3</div>
                <div className="stat-label">Pending Tasks</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;