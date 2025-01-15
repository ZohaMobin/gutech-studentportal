// transcript.jsx
import React from 'react';
import './Transcript.css';

const Transcript = () => {
  const studentData = {
    name: "William Smith",
    studentId: "12345678",
    dob: "12/06/1995",
    degree: "Bachelor of Computer Science",
    major: "Computer Science",
    status: "Enrolled",
    graduationDate: "6/2026",
    semesters: [
      {
        name: "Spring 2024",
        courses: [
          { code: "WEB101", title: "Web Tech Lab", creditUnits: 3, grade: "A", points: 12 },
          { code: "WEB102", title: "Web Tech", creditUnits: 3, grade: "B", points: 9 },
          { code: "PSPFLAB", title: "PSPF Lab", creditUnits: 3, grade: "A", points: 12 },
          { code: "PSPF", title: "PSPF", creditUnits: 3, grade: "B", points: 9 },
          { code: "DS", title: "Discrete Structures", creditUnits: 3, grade: "A", points: 12 },
          { code: "DT", title: "Design Thinking", creditUnits: 3, grade: "A", points: 12 }
        ]
      }
    ]
  };

  return (
    <div className="transcript-container">
      <header className="transcript-header">
        <h1>UNIVERSITY NAME</h1>
        <p>OFFICIAL ACADEMIC TRANSCRIPT</p>
      </header>

      <div className="student-info">
        <p><strong>Name:</strong> {studentData.name}</p>
        <p><strong>Student ID:</strong> {studentData.studentId}</p>
        <p><strong>Date of Birth:</strong> {studentData.dob}</p>
        <p><strong>Degree:</strong> {studentData.degree}</p>
        <p><strong>Major:</strong> {studentData.major}</p>
        <p><strong>Status:</strong> {studentData.status}</p>
        <p><strong>Graduation Date:</strong> {studentData.graduationDate}</p>
      </div>

      {studentData.semesters.map((semester, index) => (
        <div key={index} className="semester-section">
          <h2>{semester.name}</h2>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Course Title</th>
                <th>Credit Units</th>
                <th>Grade</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {semester.courses.map((course, idx) => (
                <tr key={idx}>
                  <td>{course.code}</td>
                  <td>{course.title}</td>
                  <td>{course.creditUnits}</td>
                  <td>{course.grade}</td>
                  <td>{course.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <footer className="transcript-footer">
        <p>End of Transcript</p>
      </footer>
    </div>
  );
};

export default Transcript;
