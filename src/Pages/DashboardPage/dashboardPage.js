import React, { useState, useEffect } from "react";
import "./dashboardPage.css"; // Import the CSS file
import axios from "axios";
import ClassSchedule from "../ClassSchedule/ClassSchedule"; // Import the ClassSchedule component

const Dashboard = () => {
  // State to track viewport size
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  const [gradesData, setGradesData] = useState(null);

  const getUserFromStorage = () => {
    try {
      const userData = sessionStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const user = getUserFromStorage();

  // Fetch student details from API
  useEffect(() => {
    const fetchStudentDetails = async () => {
      // Skip if no user or already called API
      if (!user || !user.studentId || apiCalled) {
        return;
      }

      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_BACKEND_URL;

        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }

        // Fetch student details
        const studentResponse = await axios.get(`${apiUrl}/api/students/${user.studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Fetch grades data - filters by current academic year by default
        const gradesResponse = await axios.get(`${apiUrl}/api/grades/student/${user.studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Process grades data
        const processedGrades = processGradesData(gradesResponse.data);
        setGradesData(processedGrades);

        // Extract program name if it's an object
        const programName = typeof studentResponse.data.program === "object" ? studentResponse.data.program.name : studentResponse.data.program;

        // Update student data with grades
        const updatedStudentData = {
          ...studentResponse.data,
          program: programName, // Store as string instead of object
          attendance: {
            overall: 0,
            subjects: [],
          },
          courses: processedGrades.courses.map((course) => {
            return {
              name: course.name,
              marks: course.totalObtainedMarks || 0,
              total: course.totalMaxMarks || 100,
              weightedMarks: course.weightedMarks || 0,
              totalWeightage: course.totalWeightage || 100,
            };
          }),
        };

        setStudentData(updatedStudentData);
        setApiCalled(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [user, apiCalled]);

  // Process grades data
  const processGradesData = (apiData) => {
    // Check if apiData is an array or an object
    const data = Array.isArray(apiData) ? apiData[0] : apiData;

    if (!data || !data.grades || !Array.isArray(data.grades)) {
      return { courses: [] };
    }

    const courseMap = new Map();

    // Process each grade
    data.grades.forEach((grade) => {
      if (!grade.registrationId || !grade.registrationId.courseId) {
        return;
      }

      const courseId = grade.registrationId.courseId._id;
      const courseName = grade.registrationId.courseId.name;
      const courseCode = grade.registrationId.courseId.code;
      const sectionId = grade.registrationId.sectionId;

      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          id: courseId,
          name: `${courseCode} - ${courseName}`,
          totalObtainedMarks: 0,
          totalMaxMarks: 0,
          totalWeightage: 0,
          weightedMarks: 0,
          sectionId: sectionId,
        });
      }

      const course = courseMap.get(courseId);

      // Add the marks to the course totals
      if (grade.obtainedMarks !== undefined && grade.assessmentId?.maxMarks !== undefined) {
        // Get the weightage and maxMarks from the assessment
        const weightage = grade.assessmentId?.weightage || 0;
        const maxMarks = grade.assessmentId.maxMarks;

        // Calculate weighted marks
        const weightedMark = (grade.obtainedMarks / maxMarks) * weightage;

        // Update course totals
        course.totalObtainedMarks += grade.obtainedMarks;
        course.totalMaxMarks += maxMarks;
        course.totalWeightage += weightage;
        course.weightedMarks += weightedMark;
      }
    });

    const courses = Array.from(courseMap.values());

    return {
      courses: courses,
    };
  };

  // Improved window resize handler with debounce
  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        setWindowWidth(width);
        setIsMobile(width < 768);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Use abbreviated days for mobile
  const getDayLabel = (day) => {
    if (isMobile) {
      return day.substring(0, 3);
    }
    return day;
  };

  // Optimized subject name display based on screen size
  const getSubjectLabel = (subject) => {
    if (!subject) return "";

    if (subject.includes(":")) {
      const parts = subject.split(":");
      if (windowWidth < 576) {
        return parts[0].trim();
      }
      if (windowWidth < 768) {
        const name = parts[1].trim();
        return `${parts[0].trim()}: ${name.substring(0, 10)}...`;
      }
      return subject;
    }

    if (windowWidth < 576) {
      switch (subject) {
        case "Data Structures":
          return "DS";
        case "Algorithm Design":
          return "Algo";
        case "Web Development":
          return "Web";
        case "Database Systems":
          return "DB";
        default:
          return subject;
      }
    }
    if (windowWidth < 768) {
      switch (subject) {
        case "Data Structures":
          return "Data Struct.";
        case "Algorithm Design":
          return "Algorithms";
        case "Web Development":
          return "Web Dev";
        case "Database Systems":
          return "Database";
        default:
          return subject;
      }
    }
    return subject;
  };

  const getGradeColor = (marks, total) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return "#22c55e"; // A grade - green
    if (percentage >= 80) return "#3b82f6"; // B grade - blue
    if (percentage >= 70) return "#8b5cf6"; // C grade - purple
    if (percentage >= 60) return "#f59e0b"; // D grade - yellow
    return "#ef4444"; // F grade - red
  };

  const getGradeLetter = (marks, total) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const getClassColor = (subject) => {
    switch (subject) {
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="student-profile">
          <div className="profile-content">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user?.name
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("") || "S"}
              </div>
            </div>
            <div className="profile-info">
              <h2>{user?.name || "Loading..."}</h2>
              <div className="student-details">
                <div className="detail-item">
                  <span className="detail-label">Roll No:</span>
                  <span className="detail-value">{user?.studentId || "Loading..."}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Program:</span>
                  <span className="detail-value">{isMobile ? "CS" : "Loading..."}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Semester:</span>
                  <span className="detail-value">Loading...</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Year:</span>
                  <span className="detail-value">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card attendance-card">
            <div className="card-header">
              <h3>Attendance</h3>
              <div className="card-actions">
                <button className="card-action-button" aria-label="More options">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
            <div className="loading-indicator">Loading attendance data...</div>
          </div>

          <div className="dashboard-card marks-card">
            <div className="card-header">
              <h3>Course Performance</h3>
              <div className="card-actions">
                <button className="card-action-button" aria-label="More options">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
            <div className="loading-indicator">Loading grades data...</div>
          </div>

          <div className="dashboard-card timetable-card">
            <div className="card-header">
              <h3>{windowWidth < 576 ? "Schedule" : "Class Schedule"}</h3>
              <div className="card-actions">
                <button className="card-action-button" aria-label="More options">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
            <div className="loading-indicator">Loading timetable data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="dashboard-container">
        <div className="student-profile">
          <div className="profile-content">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user?.name
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("") || "S"}
              </div>
            </div>
            <div className="profile-info">
              <h2>{user?.name || "Student"}</h2>
              <div className="student-details">
                <div className="detail-item">
                  <span className="detail-label">Roll No:</span>
                  <span className="detail-value">{user?.studentId || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Program:</span>
                  <span className="detail-value">{isMobile ? "CS" : "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Semester:</span>
                  <span className="detail-value">N/A</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Year:</span>
                  <span className="detail-value">N/A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card attendance-card">
            <div className="card-header">
              <h3>Attendance</h3>
              <div className="card-actions">
                <button className="card-action-button" aria-label="More options">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
            <div className="no-data-message">
              <p>No attendance data available at the moment</p>
            </div>
          </div>

          <div className="dashboard-card marks-card">
            <div className="card-header">
              <h3>Course Performance</h3>
              <div className="card-actions">
                <button className="card-action-button" aria-label="More options">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
            <div className="no-data-message">
              <p>No course performance data available at the moment</p>
            </div>
          </div>

          <div className="dashboard-card timetable-card">
            <div className="card-header">
              <h3>{windowWidth < 576 ? "Schedule" : "Class Schedule"}</h3>
              <div className="card-actions">
                <button className="card-action-button" aria-label="More options">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
            <div className="no-data-message">
              <p>No timetable data available at the moment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="student-profile">
        <div className="profile-content">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {studentData?.name
                ? studentData.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                : "S"}
            </div>
          </div>
          <div className="profile-info">
            <h2>{studentData?.name || "Student"}</h2>
            <div className="student-details">
              <div className="detail-item">
                <span className="detail-label">Roll No:</span>
                <span className="detail-value">{studentData?.rollNumber || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Program:</span>
                <span className="detail-value">{isMobile ? "CS" : studentData?.program || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Semester:</span>
                <span className="detail-value">{studentData?.semester || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Year:</span>
                <span className="detail-value">{studentData?.year || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card attendance-card">
          <div className="card-header">
            <h3>Attendance</h3>
            <div className="card-actions">
              <button className="card-action-button" aria-label="More options">
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>
          {studentData.attendance.subjects.length === 0 ? (
            <div className="empty-attendance">
              <div className="empty-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <p>No attendance records available</p>
              <p className="empty-subtext">Your attendance data will appear here once available</p>
            </div>
          ) : (
            <div className="attendance-overview">
              <div className="attendance-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${studentData.attendance.overall}, 100`}
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage-value">
                    {studentData.attendance.overall}
                  </text>
                  <text x="18" y="24.5" className="percentage-symbol">
                    %
                  </text>
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
                          backgroundColor: subject.percentage >= 85 ? "var(--success-color)" : subject.percentage >= 75 ? "var(--warning-color)" : "var(--danger-color)",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-card marks-card">
          <div className="card-header">
            <h3>Course Performance</h3>
            <div className="card-actions">
              <button className="card-action-button" aria-label="More options">
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>
          <div className="course-performance">
            {!studentData || !studentData.courses || studentData.courses.length === 0 ? (
              <div className="no-data-message">No course data available</div>
            ) : (
              studentData.courses.map((course, index) => {
                const percentage = course.totalWeightage > 0 ? ((course.weightedMarks / course.totalWeightage) * 100).toFixed(1) : 0;
                return (
                  <div key={index} className="course-item">
                    <div className="course-header">
                      <span className="course-name">{getSubjectLabel(course.name)}</span>
                      <span className="course-marks">
                        {course.weightedMarks.toFixed(1)}/{course.totalWeightage.toFixed(1)} ({percentage}%)
                      </span>
                    </div>
                    <div className="course-progress-container">
                      <div
                        className="course-progress"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getGradeColor(course.weightedMarks, course.totalWeightage),
                        }}
                      ></div>
                    </div>
                    <div className="grade-indicator">{getGradeLetter(course.weightedMarks, course.totalWeightage)}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="dashboard-card timetable-card">
          <div className="card-header">
            <h3>{windowWidth < 576 ? "Schedule" : "Class Schedule"}</h3>
            <div className="card-actions">
              <button className="card-action-button" aria-label="More options">
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>
          <div className="dashboard-schedule-container">
            <ClassSchedule isDashboard={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
