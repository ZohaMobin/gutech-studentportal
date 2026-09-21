import Loading, { Skeleton } from '../../Components/Loading/Loading';
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
      // Get user from storage inside the effect to avoid dependency issues
      const currentUser = getUserFromStorage();
      
      // Skip if no user or already called API
      if (!currentUser || !currentUser.studentId || apiCalled) {
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
        const studentResponse = await axios.get(`${apiUrl}/api/students/${currentUser.studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Extract name from userId
        const studentName =
          studentResponse.data.userId?.name ||
          (studentResponse.data.userId?.firstName && studentResponse.data.userId?.lastName
            ? `${studentResponse.data.userId.firstName} ${studentResponse.data.userId.lastName}`.trim()
            : studentResponse.data.name || "Student");

        // Extract program name if it's an object
        const programName = typeof studentResponse.data.program === "object" 
          ? (studentResponse.data.program?.name || studentResponse.data.program) 
          : studentResponse.data.program;

        // Extract department name if it's an object
        const departmentName = typeof studentResponse.data.department === "object" 
          ? (studentResponse.data.department?.name || studentResponse.data.department) 
          : studentResponse.data.department;

        // Extract semester
        const semester = studentResponse.data.currentSemester ?? studentResponse.data.semester ?? null;

        // Initialize student data with basic info first
        let updatedStudentData = {
          ...studentResponse.data,
          name: studentName,
          program: programName,
          department: departmentName,
          semester: semester,
          rollNumber: studentResponse.data.rollNumber || null,
          attendance: {
            overall: 0,
            subjects: [],
          },
          courses: [],
        };

        // Try to fetch results - don't fail if this errors. The server works out every total and grade.
        try {
          const resultsResponse = await axios.get(`${apiUrl}/api/results/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const results = resultsResponse.data.courses || [];

          // Fetch attendance data for all courses
          const attendanceData = await fetchAttendanceData(
            apiUrl,
            token,
            results.map((course) => ({ id: course.courseId, name: `${course.code} - ${course.name}` }))
          );

          updatedStudentData.attendance = attendanceData;
          updatedStudentData.courses = results.map((course) => ({
            name: `${course.code} - ${course.name}`,
            weightedMarks: course.totals.weightedMarks,
            gradedWeight: course.totals.gradedWeight,
            percentageSoFar: course.totals.percentageSoFar,
          }));
        } catch (gradesError) {
          console.warn("Error fetching grades/attendance data:", gradesError);
          // Continue with basic student data even if grades fail
        }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Fetch attendance data for all courses
  const fetchAttendanceData = async (apiUrl, token, courses) => {
    if (!courses || courses.length === 0) {
      return {
        overall: 0,
        subjects: [],
      };
    }

    try {
      const attendancePromises = courses.map(async (course) => {
        try {
          const response = await axios.get(`${apiUrl}/api/students/attendance/${course.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.data && response.data.summary) {
            const summary = response.data.summary;
            const percentage = parseFloat(summary.percentage) || 0;
            return {
              name: course.name,
              percentage: Math.round(percentage),
              totalClasses: summary.totalClasses || 0,
              present: summary.present || 0,
              absent: summary.absent || 0,
              late: summary.late || 0,
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching attendance for course ${course.id}:`, error);
          return null;
        }
      });

      const attendanceResults = await Promise.all(attendancePromises);
      const validAttendance = attendanceResults.filter((item) => item !== null);

      // Calculate overall attendance
      let totalClasses = 0;
      let totalPresent = 0;
      let totalLate = 0;

      validAttendance.forEach((subject) => {
        totalClasses += subject.totalClasses;
        totalPresent += subject.present;
        totalLate += subject.late;
      });

      const overallPercentage = totalClasses > 0 ? Math.round(((totalPresent + totalLate) / totalClasses) * 100) : 0;

      return {
        overall: overallPercentage,
        subjects: validAttendance,
      };
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      return {
        overall: 0,
        subjects: [],
      };
    }
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
              <h2>{user?.name || <Skeleton width="9rem" />}</h2>
              <div className="student-details">
                <div className="detail-item">
                  <span className="detail-label">Roll No:</span>
                  <span className="detail-value">{user?.studentId || <Skeleton width="5rem" />}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Program:</span>
                  <span className="detail-value">{isMobile ? "CS" : "–"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Semester:</span>
                  <span className="detail-value">–</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Year:</span>
                  <span className="detail-value">–</span>
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
            <Loading variant="inline" label="Loading attendance" />
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
            <Loading variant="inline" label="Loading grades" />
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
            <Loading variant="inline" label="Loading timetable" />
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
                <span className="detail-value">{studentData?.semester ?? studentData?.currentSemester ?? "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Department:</span>
                <span className="detail-value">
                  {isMobile ? studentData?.department?.code || studentData?.department || "N/A" : studentData?.department?.name || studentData?.department || "N/A"}
                </span>
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
                const hasMarks = typeof course.percentageSoFar === "number";
                const percentage = hasMarks ? course.percentageSoFar.toFixed(1) : "0.0";
                return (
                  <div key={index} className="course-item">
                    <div className="course-header">
                      <span className="course-name">{getSubjectLabel(course.name)}</span>
                      <span className="course-marks">
                        {hasMarks ? `${percentage}% so far` : "No marks yet"}
                      </span>
                    </div>
                    <div className="course-progress-container">
                      <div
                        className="course-progress"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: "var(--primary-color)",
                        }}
                      ></div>
                    </div>
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
