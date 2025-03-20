import React from 'react';
import './Transcript.css';
import PrintButton from '../../Components/PrintButton/PrintButton';

const Transcript = () => {
  const studentData = {
    name: "Muhammad Waqas",
    studentId: "BCS-023",
    dob: "09/21/2005",
    degree: "Bachelor of Computer Science",
    major: "Computer Science",
    status: "Completed",
    graduationDate: "6/2028",
    semesters: [
      {
        name: "Fall 2023",
        courses: [
          { code: "WEB101", title: "Web Technology Lab", creditUnits: 3, grade: "A", points: 4 },
          { code: "WEB102", title: "Web Technology", creditUnits: 4, grade: "B", points: 4 },
          { code: "PSPFLAB", title: "PSPF Lab", creditUnits: 3, grade: "A", points: 4 },
          { code: "PSPF", title: "PSPF", creditUnits: 3, grade: "B", points: 3 }
        ],
        gpa: 3.7,
        creditsAttempted: 12,
        creditsEarned: 12,
      },
      {
        name: "Spring 2024",
        courses: [
          { code: "DS", title: "Discrete Structures", creditUnits: 3, grade: "A", points: 4 },
          { code: "DT", title: "Design Thinking", creditUnits: 3, grade: "A", points: 3 },
        ],
        gpa: 3.80,
        creditsAttempted: 6,
        creditsEarned: 6,
      }
    ],
    cgpa: 3.61,
    totalCreditsRequired: 18,
    totalCreditsEarned: 18,
  };

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
            <p>Transcript ID: GT-{studentData.studentId}-{new Date().getFullYear()}</p>
            <p>Issue Date: {new Date().toLocaleDateString()}</p>
          </div>
        </header>

        <div className="student-info-container">
          <h2>STUDENT INFORMATION</h2>
          <div className="student-info">
            <div className="info-group">
              <p><span>Name:</span> {studentData.name}</p>
              <p><span>Student ID:</span> {studentData.studentId}</p>
              <p><span>Date of Birth:</span> {studentData.dob}</p>
            </div>
            <div className="info-group">
              <p><span>Degree:</span> {studentData.degree}</p>
              <p><span>Major:</span> {studentData.major}</p>
              <p><span>Expected Graduation:</span> {studentData.graduationDate}</p>
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
                      <td>{course.title}</td>
                      <td>{course.creditUnits}</td>
                      <td>{course.points}</td>
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
                  <td><span>Cumulative GPA:</span></td>
                  <td>{studentData.cgpa.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><span>Total Credits Required:</span></td>
                  <td>{studentData.totalCreditsRequired}</td>
                </tr>
                <tr>
                  <td><span>Total Credits Earned:</span></td>
                  <td>{studentData.totalCreditsEarned}</td>
                </tr>
                <tr>
                  <td><span>Degree Status:</span></td>
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