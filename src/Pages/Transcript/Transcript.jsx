import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Transcript.css";
import PrintButton from "../../Components/PrintButton/PrintButton";

const Transcript = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The server works out every grade, GPA and credit total; this page only lays them out.
  useEffect(() => {
    const fetchTranscriptData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_BACKEND_URL;

        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in to view your transcript");
        }

        const response = await axios.get(`${apiUrl}/api/results/me/transcript`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const transcript = response.data;

        if (!transcript.hasData || transcript.semesters.length === 0) {
          setStudentData({
            name: transcript.student.name,
            studentId: transcript.student.rollNumber,
            hasNoData: true,
          });
          return;
        }

        setStudentData({
          name: transcript.student.name,
          studentId: transcript.student.rollNumber,
          degree: transcript.student.degree,
          department: transcript.student.department || "N/A",
          program: transcript.student.program || "N/A",
          status: "Active",
          semesters: transcript.semesters.map((semester) => ({
            ...semester,
            courses: semester.courses.map((course) => ({
              code: course.code,
              name: course.name,
              creditUnits: course.creditHours,
              grade: course.grade,
              points: course.gradePoints ?? "-",
            })),
          })),
          cgpa: transcript.cgpa,
          totalCreditsRequired: transcript.totalCreditsAttempted,
          totalCreditsEarned: transcript.totalCreditsEarned,
        });
      } catch (err) {
        console.error("Error fetching transcript data:", err);
        setError(err.response?.data?.message || err.message || "Failed to load transcript data");
      } finally {
        setLoading(false);
      }
    };

    fetchTranscriptData();
  }, []);

  if (loading) {
    return (
      <div className="print-wrapper">
        <div className="transcript-container">
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>Loading transcript data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="print-wrapper">
        <div className="transcript-container">
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p style={{ color: "red" }}>{error || "Failed to load transcript data"}</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if there's no transcript data available
  if (studentData.hasNoData || !studentData.semesters || studentData.semesters.length === 0) {
    return (
      <div className="print-wrapper">
        <div className="transcript-container">
          <div className="no-transcript-message" style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "1rem", color: "#ccc" }}>📄</div>
            <h2 style={{ fontSize: "24px", marginBottom: "1rem", color: "#333" }}>No Transcript Available</h2>
            <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}>
              There is no transcript data available for this student at this time.
            </p>
            {studentData.name && (
              <p style={{ fontSize: "14px", color: "#999", marginTop: "1rem" }}>
                Student: {studentData.name} ({studentData.studentId})
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="print-wrapper">
      <div className="no-print">
        <PrintButton />
      </div>

      <div className="transcript-container">
        <header className="transcript-header">
          <div className="university-logo">GU-Tech</div>
          <h1>OFFICIAL ACADEMIC TRANSCRIPT</h1>
          <div className="transcript-id">
            <p>
              Transcript ID: GT-{studentData.studentId}-{new Date().getFullYear()}
            </p>
            <p>Issue Date: {new Date().toLocaleDateString()}</p>
          </div>
        </header>

        <div className="student-info-container">
          <h2>STUDENT INFORMATION</h2>
          <div className="student-info">
            <div className="info-group">
              <p>
                <span>Name:</span> {studentData.name}
              </p>
              <p>
                <span>Student ID:</span> {studentData.studentId}
              </p>
            </div>
            <div className="info-group">
              <p>
                <span>Degree:</span> {studentData.degree}
              </p>
              <p>
                <span>Department:</span> {studentData.department}
              </p>
            </div>
          </div>
        </div>

        <div className="academic-record">
          <h2>ACADEMIC RECORD</h2>

          {studentData.semesters.map((semester, index) => (
            <div key={index} className="semester-section">
              <h3>{semester.name}</h3>
              <table className="course-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Credits</th>
                    <th>Points</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {semester.courses.map((course, idx) => (
                    <tr key={idx}>
                      <td>{course.code}</td>
                      <td>{course.name}</td>
                      <td>{course.creditUnits}</td>
                      <td>{typeof course.points === "number" ? course.points.toFixed(2) : course.points}</td>
                      <td>{course.grade}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="semester-summary">
                      <div className="summary-details">
                        <span>Term GPA: {semester.gpa.toFixed(2)}</span>
                        <span>Credits Attempted: {semester.creditsAttempted}</span>
                        <span>Credits Earned: {semester.creditsEarned}</span>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
        </div>

        <div className="academic-summary">
          <h2>ACADEMIC SUMMARY</h2>
          <div className="summary-table">
            <table>
              <tbody>
                <tr>
                  <td>
                    <span>Cumulative GPA:</span>
                  </td>
                  <td>{studentData.cgpa.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>
                    <span>Total Credits Required:</span>
                  </td>
                  <td>{studentData.totalCreditsRequired}</td>
                </tr>
                <tr>
                  <td>
                    <span>Total Credits Earned:</span>
                  </td>
                  <td>{studentData.totalCreditsEarned}</td>
                </tr>
                <tr>
                  <td>
                    <span>Degree Status:</span>
                  </td>
                  <td>{studentData.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <footer className="transcript-footer">
          <div className="verification">
            <p>This transcript is official only when it bears the seal of the University and the signature of the Controller of Examinations.</p>
          </div>
          <div className="signature-section">
            <div className="signature-line">
              <div className="line"></div>
              <p>Controller of Examinations</p>
            </div>
            <div className="university-seal">
              <div className="seal-placeholder">SEAL</div>
            </div>
          </div>
          <div className="footer-note">
            <p>Any alterations to this document render it invalid.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Transcript;
