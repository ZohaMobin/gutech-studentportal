import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Transcript.css";
import PrintButton from "../../Components/PrintButton/PrintButton";

const Transcript = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get grade from percentage using grading scale
  const getGradeFromPercentage = (percentage, scale) => {
    if (!scale || !scale.gradeRanges) {
      // Fallback if grading scale not loaded
      return { grade: "F", gradePoints: 0, remarks: "Fail" };
    }

    // Sort ranges by minPercentage descending to check highest ranges first
    const sortedRanges = [...scale.gradeRanges].filter((r) => !r.isSpecialGrade).sort((a, b) => b.minPercentage - a.minPercentage);

    for (const range of sortedRanges) {
      if (percentage >= range.minPercentage && percentage <= range.maxPercentage) {
        return {
          grade: range.grade,
          gradePoints: range.gradePoints || 0,
          remarks: range.remarks || null,
        };
      }
    }

    // Default to F if no range matches
    const fGrade = scale.gradeRanges.find((r) => r.grade === "F" && !r.isSpecialGrade);
    return {
      grade: fGrade?.grade || "F",
      gradePoints: fGrade?.gradePoints || 0,
      remarks: fGrade?.remarks || "Fail",
    };
  };

  // Helper function to get grade points for a grade letter
  const getGradePoints = (grade, scale) => {
    if (!scale || !scale.gradeRanges || !grade) return 0;
    const gradeRange = scale.gradeRanges.find((r) => r.grade === grade && !r.isSpecialGrade);
    return gradeRange?.gradePoints || 0;
  };

  // Calculate GPA from courses (excludes special grades W and I)
  const calculateGPA = (courses) => {
    if (!courses || courses.length === 0) return 0;
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach((course) => {
      // Skip special grades (W, I), courses without grades ("-"), and courses where marks are not locked
      if (
        course.grade &&
        course.grade !== "W" &&
        course.grade !== "I" &&
        course.grade !== "-" &&
        course.points !== null &&
        course.points !== undefined &&
        typeof course.points === "number"
      ) {
        totalPoints += course.points * course.creditUnits;
        totalCredits += course.creditUnits;
      }
    });
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  useEffect(() => {
    const fetchTranscriptData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_BACKEND_URL;

        // Get user from session storage
        const userData = sessionStorage.getItem("user");
        if (!userData) {
          throw new Error("Please log in to view your transcript");
        }

        const user = JSON.parse(userData);
        if (!user.studentId) {
          throw new Error("Student ID not found");
        }

        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Fetch grading scale first
        const gradingScaleResponse = await axios.get(`${apiUrl}/api/students/grading-scale`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const gradingScaleData = gradingScaleResponse.data.gradingScale;

        // Fetch student details
        const studentResponse = await axios.get(`${apiUrl}/api/students/${user.studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Fetch all course registrations (all academic years)
        let registrationsResponse;
        try {
          registrationsResponse = await axios.get(`${apiUrl}/api/course-registrations/student/${user.studentId}/courses?includeAll=true`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        } catch (err) {
          // If registrations API fails, treat as no data
          console.warn("Failed to fetch course registrations:", err);
          registrationsResponse = { data: { registrations: [] } };
        }

        // Fetch all grades (all academic years)
        let gradesResponse;
        try {
          gradesResponse = await axios.get(`${apiUrl}/api/grades/student/${user.studentId}?includeAll=true`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        } catch (err) {
          // If grades API fails, treat as no data
          console.warn("Failed to fetch grades:", err);
          gradesResponse = { data: { grades: [] } };
        }

        // Process the data
        const student = studentResponse.data;
        const registrations = registrationsResponse?.data?.registrations || [];
        const gradesData = gradesResponse?.data || {};

        // Group registrations by academic year
        const academicYearMap = new Map();

        registrations.forEach((reg) => {
          // Handle both new (academicYearId) and legacy (academicYear string) formats
          const academicYear = reg.academicYearId;
          if (!academicYear) return;

          const yearKey = academicYear._id || academicYear.id || academicYear;
          const yearName = academicYear.displayName || academicYear.academicYearString || `${academicYear.semesterType} ${academicYear.year}`;
          const semester = reg.semester || 1;

          if (!academicYearMap.has(yearKey)) {
            academicYearMap.set(yearKey, {
              academicYearId: yearKey,
              name: yearName,
              semesterType: academicYear.semesterType,
              year: academicYear.year,
              semesters: new Map(),
            });
          }

          const yearData = academicYearMap.get(yearKey);
          if (!yearData.semesters.has(semester)) {
            yearData.semesters.set(semester, {
              semester,
              courses: [],
            });
          }

          // Get course info from registration
          const course = reg.courseId;
          if (course) {
            yearData.semesters.get(semester).courses.push({
              courseId: course._id || course.id,
              code: course.code,
              name: course.name,
              creditUnits: course.creditHours || 0,
              registrationId: reg._id,
              registrationGrade: reg.grade, // Final grade from registration if available
              marksLocked: reg.marksLocked || false, // Check if marks are locked
            });
          }
        });

        // Process grades and calculate final grades for each course
        const grades = gradesData.grades || [];
        const courseGradesMap = new Map();

        // Group grades by registration ID
        grades.forEach((grade) => {
          if (!grade.registrationId) return;

          const regId = grade.registrationId._id || grade.registrationId;
          if (!courseGradesMap.has(regId)) {
            courseGradesMap.set(regId, {
              totalWeightedMarks: 0,
              totalWeightage: 0,
            });
          }

          const courseGrade = courseGradesMap.get(regId);
          if (grade.assessmentId && grade.obtainedMarks !== undefined) {
            const weightage = grade.assessmentId.weightage || 0;
            const maxMarks = grade.assessmentId.maxMarks || 100;
            const weightedMark = (grade.obtainedMarks / maxMarks) * weightage;

            courseGrade.totalWeightedMarks += weightedMark;
            courseGrade.totalWeightage += weightage;
          }
        });

        // Calculate final grades and add to courses
        academicYearMap.forEach((yearData) => {
          yearData.semesters.forEach((semesterData) => {
            semesterData.courses = semesterData.courses.map((course) => {
              // Only show grades if marks are locked
              if (!course.marksLocked) {
                return {
                  ...course,
                  grade: "-",
                  points: "-",
                  percentage: null,
                };
              }

              // If marks are locked and registration has a final grade, use it
              if (course.registrationGrade && course.registrationGrade !== null) {
                const points = getGradePoints(course.registrationGrade, gradingScaleData);
                const isSpecialGrade = gradingScaleData?.gradeRanges?.find((r) => r.grade === course.registrationGrade && r.isSpecialGrade);
                return {
                  ...course,
                  grade: course.registrationGrade,
                  points: points,
                  percentage: isSpecialGrade ? null : 0,
                };
              }

              // Otherwise, calculate from grades (only if marks are locked)
              const regId = course.registrationId;
              const courseGrade = courseGradesMap.get(regId);

              if (courseGrade && courseGrade.totalWeightage > 0) {
                const percentage = (courseGrade.totalWeightedMarks / courseGrade.totalWeightage) * 100;
                const gradeInfo = getGradeFromPercentage(percentage, gradingScaleData);
                return {
                  ...course,
                  grade: gradeInfo.grade,
                  points: gradeInfo.gradePoints,
                  percentage: percentage.toFixed(1),
                };
              } else {
                // No grades yet even though locked
                return {
                  ...course,
                  grade: "-",
                  points: "-",
                  percentage: null,
                };
              }
            });

            // Calculate semester GPA
            semesterData.gpa = calculateGPA(semesterData.courses);
            semesterData.creditsAttempted = semesterData.courses.reduce((sum, c) => sum + c.creditUnits, 0);
            semesterData.creditsEarned = semesterData.courses
              .filter((c) => c.grade !== "F" && c.grade !== "-" && c.grade !== "W" && c.grade !== "I")
              .reduce((sum, c) => sum + c.creditUnits, 0);
          });
        });

        // Convert to array format and sort
        const semesters = [];
        academicYearMap.forEach((yearData) => {
          yearData.semesters.forEach((semesterData) => {
            semesters.push({
              name: `${yearData.semesterType} ${yearData.year} - Semester ${semesterData.semester}`,
              year: yearData.year,
              semesterType: yearData.semesterType,
              ...semesterData,
            });
          });
        });

        // Sort semesters by year and semester
        semesters.sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year;
          // Sort by semester type: Fall (1), Spring (2), Summer (3)
          const typeOrder = { Fall: 1, Spring: 2, Summer: 3 };
          const typeA = typeOrder[a.semesterType] || 0;
          const typeB = typeOrder[b.semesterType] || 0;
          if (typeA !== typeB) return typeA - typeB;
          return a.semester - b.semester;
        });

        // Check if there's no transcript data
        if (semesters.length === 0 || !registrations || registrations.length === 0) {
          // Extract name from userId for the empty state
          const studentName =
            student.userId?.name || (student.userId?.firstName && student.userId?.lastName ? `${student.userId.firstName} ${student.userId.lastName}`.trim() : student.name || "N/A");
          
          setStudentData({
            name: studentName,
            studentId: student.rollNumber || user.studentId,
            hasNoData: true, // Flag to indicate no transcript data
          });
          setLoading(false);
          return;
        }

        // Calculate CGPA and totals
        const allCourses = semesters.flatMap((s) => s.courses);
        const cgpa = calculateGPA(allCourses);
        const totalCreditsAttempted = allCourses.reduce((sum, c) => sum + c.creditUnits, 0);
        const totalCreditsEarned = allCourses.filter((c) => c.grade !== "F" && c.grade !== "-" && c.grade !== "W" && c.grade !== "I").reduce((sum, c) => sum + c.creditUnits, 0);

        // Extract name from userId
        const studentName =
          student.userId?.name || (student.userId?.firstName && student.userId?.lastName ? `${student.userId.firstName} ${student.userId.lastName}`.trim() : student.name || "N/A");

        // Extract department and program names
        const departmentName = typeof student.department === "object" ? student.department.name : student.department || "N/A";
        const programName = typeof student.program === "object" ? student.program.name : student.program || "N/A";
        const degreeName = programName !== "N/A" ? `${programName} - ${departmentName}` : departmentName;

        setStudentData({
          name: studentName,
          studentId: student.rollNumber || user.studentId,
          degree: degreeName,
          department: departmentName,
          program: programName,
          status: student.status || "Active",
          semesters,
          cgpa,
          totalCreditsRequired: student.totalCreditHours || totalCreditsAttempted,
          totalCreditsEarned,
        });
      } catch (err) {
        console.error("Error fetching transcript data:", err);
        setError(err.message || "Failed to load transcript data");
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
                      <td>{typeof course.points === "number" ? course.points.toFixed(1) : course.points}</td>
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
