import React, { useState, useEffect } from "react";
import "./Grading.css";

const Grading = () => {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [activeCourse, setActiveCourse] = useState("");
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BACKEND_URL;
        
        // Get the student ID from session storage
        const userData = sessionStorage.getItem('user');
        if (!userData) {
          throw new Error('Please log in again to view your marks');
        }
        
        const user = JSON.parse(userData);
        if (!user.studentId) {
          throw new Error('Student ID not found. Please log in again');
        }

        // Get the auth token from session storage
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found. Please log in again');
        }

        // First, fetch all registered courses for the student (current academic year)
        const coursesResponse = await fetch(`${apiUrl}/api/course-registrations/student/${user.studentId}/courses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!coursesResponse.ok) {
          if (coursesResponse.status === 401) {
            throw new Error('Your session has expired. Please log in again');
          } else if (coursesResponse.status === 404) {
            // No courses registered yet, but continue to show empty state
            const processedData = createEmptyDataStructure();
            setMarksData(processedData);
            setLoading(false);
            return;
          } else {
            throw new Error(`Unable to load courses (Error ${coursesResponse.status})`);
          }
        }

        const coursesData = await coursesResponse.json();
        
        // Then, fetch grades for the student - filters by current academic year by default
        const gradesResponse = await fetch(`${apiUrl}/api/grades/student/${user.studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        let gradesData = null;
        if (gradesResponse.ok) {
          gradesData = await gradesResponse.json();
        } else if (gradesResponse.status !== 404) {
          // Only throw error if it's not a 404 (no grades is acceptable)
          throw new Error(`Unable to load grades (Error ${gradesResponse.status})`);
        }
        
        // Process data combining courses and grades
        const processedData = processApiData(coursesData, gradesData);
        setMarksData(processedData);
        
        // Set active course to the first course in the list
        if (processedData.courses.length > 0) {
          setActiveCourse(processedData.courses[0].id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create empty data structure
  const createEmptyDataStructure = () => {
    return {
      courses: [
        {
          id: 'default',
          name: 'No Courses Available'
        }
      ],
      quizzes: {
        'default': [
          {
            serial: 'No Quizzes',
            weightage: 0,
            obtainedMarks: '-',
            totalMarks: '-',
            average: '-',
            min: '-',
            max: '-'
          }
        ]
      },
      assignments: {
        'default': [
          {
            serial: 'No Assignments',
            weightage: 0,
            obtainedMarks: '-',
            totalMarks: '-',
            average: '-',
            min: '-',
            max: '-'
          }
        ]
      },
      midterms: {
        'default': [
          {
            serial: 'No Midterms',
            weightage: 0,
            obtainedMarks: '-',
            totalMarks: '-',
            average: '-',
            min: '-',
            max: '-'
          }
        ]
      },
      finals: {
        'default': [
          {
            serial: 'No Finals',
            weightage: 0,
            obtainedMarks: '-',
            totalMarks: '-',
            average: '-',
            min: '-',
            max: '-'
          }
        ]
      },
      courseStats: {}
    };
  };

  // Process API data to match the component's expected structure
  const processApiData = (coursesData, gradesData) => {
    const processedData = {
      courses: [],
      quizzes: {},
      assignments: {},
      midterms: {},
      finals: {},
      courseStats: {}
    };

    // Extract courses from registered courses (not just from grades)
    if (coursesData && coursesData.courses && Array.isArray(coursesData.courses)) {
      coursesData.courses.forEach(course => {
        processedData.courses.push({
          id: course.id,
          name: `${course.code || ''}: ${course.name || 'Unknown Course'}`.trim(),
          sectionId: course.sectionId || null
        });
      });
    }

    // If no courses found, return empty structure
    if (processedData.courses.length === 0) {
      return createEmptyDataStructure();
    }

    // Initialize data structures for each course
    processedData.courses.forEach(course => {
      processedData.quizzes[course.id] = [];
      processedData.assignments[course.id] = [];
      processedData.midterms[course.id] = [];
      processedData.finals[course.id] = [];
      
      // Initialize course stats (will be populated from grades data if available)
      processedData.courseStats[course.id] = {
        sectionMax: 0,
        sectionMin: 0,
        assessmentTypes: {}
      };
    });

    // Process grades if available
    if (gradesData && gradesData.grades && Array.isArray(gradesData.grades) && gradesData.grades.length > 0) {
      // Get section stats from grades data
      if (gradesData.sectionStats) {
        processedData.courses.forEach(course => {
          if (course.sectionId && gradesData.sectionStats[course.sectionId]) {
            const sectionStats = gradesData.sectionStats[course.sectionId];
            processedData.courseStats[course.id] = {
              sectionMax: sectionStats?.maxWeightedMarks || 0,
              sectionMin: sectionStats?.minWeightedMarks || 0,
              assessmentTypes: sectionStats?.assessmentTypes || {}
            };
          }
        });
      }

      // Group grades by course
      const courseGrades = {};
      gradesData.grades.forEach(grade => {
        const courseId = grade.registrationId?.courseId?._id;
        if (!courseId) return;

        if (!courseGrades[courseId]) {
          courseGrades[courseId] = [];
        }
        courseGrades[courseId].push(grade);
      });

      // Process grades for each course
      Object.entries(courseGrades).forEach(([courseId, grades]) => {
        grades.forEach(grade => {
          const assessmentType = grade.assessmentId?.type?.toLowerCase();
          const gradeData = {
            serial: grade.assessmentId?.title || 'Untitled Assessment',
            weightage: grade.assessmentId?.weightage || 0,
            obtainedMarks: grade.obtainedMarks || 0,
            totalMarks: grade.assessmentId?.maxMarks || 0,
            average: grade.stats?.average || 0,
            min: grade.stats?.min || 0,
            max: grade.stats?.max || 0
          };

          switch(assessmentType) {
            case 'quiz':
              processedData.quizzes[courseId].push(gradeData);
              break;
            case 'assignment':
              processedData.assignments[courseId].push(gradeData);
              break;
            case 'midterm':
              processedData.midterms[courseId].push(gradeData);
              break;
            case 'final':
              processedData.finals[courseId].push(gradeData);
              break;
          }
        });
      });
    }

    // For courses without grades, add default "No data" entries
    processedData.courses.forEach(course => {
      const courseId = course.id;
      
      // If no grades found for any category, add default entries
      if (processedData.quizzes[courseId].length === 0) {
        processedData.quizzes[courseId].push({
          serial: 'No Quizzes',
          weightage: 0,
          obtainedMarks: '-',
          totalMarks: '-',
          average: '-',
          min: '-',
          max: '-'
        });
      }

      if (processedData.assignments[courseId].length === 0) {
        processedData.assignments[courseId].push({
          serial: 'No Assignments',
          weightage: 0,
          obtainedMarks: '-',
          totalMarks: '-',
          average: '-',
          min: '-',
          max: '-'
        });
      }

      if (processedData.midterms[courseId].length === 0) {
        processedData.midterms[courseId].push({
          serial: 'No Midterms',
          weightage: 0,
          obtainedMarks: '-',
          totalMarks: '-',
          average: '-',
          min: '-',
          max: '-'
        });
      }

      if (processedData.finals[courseId].length === 0) {
        processedData.finals[courseId].push({
          serial: 'No Finals',
          weightage: 0,
          obtainedMarks: '-',
          totalMarks: '-',
          average: '-',
          min: '-',
          max: '-'
        });
      }
    });

    return processedData;
  };
  
  // Helper function to calculate student's total weighted marks for a course
  const calculateStudentWeightedMarks = (data, courseId) => {
    const categories = ['quizzes', 'assignments', 'midterms', 'finals'];
    let totalWeightedMarks = 0;
    
    categories.forEach(category => {
      const categoryData = data[category][courseId];
      if (categoryData && categoryData.length > 0) {
        categoryData.forEach(item => {
          const weightedMark = (item.obtainedMarks / item.totalMarks) * item.weightage;
          totalWeightedMarks += weightedMark;
        });
      }
    });
    
    return totalWeightedMarks;
  };
  
  // Map API assessment type to component assessment type
  const mapAssessmentType = (apiType) => {
    if (!apiType) return 'quizzes'; // Default to quizzes if type is undefined
    
    switch (apiType.toLowerCase()) {
      case 'quiz':
        return 'quizzes';
      case 'assignment':
        return 'assignments';
      case 'midterm':
        return 'midterms';
      case 'final':
        return 'finals';
      default:
        console.warn('Unknown assessment type:', apiType);
        return 'quizzes'; // Default to quizzes for unknown types
    }
  };

  // Calculate totals for a specific category and course
  const calculateTotals = (category, courseId) => {
    if (!marksData || !marksData[category] || !marksData[category][courseId]) return null;
    
    const categoryData = marksData[category][courseId];
    if (categoryData.length === 0) return null;
    
    // Check if the data contains placeholder values
    if (categoryData[0].obtainedMarks === '-') {
      return {
        totalWeightage: 0,
        totalObtained: '-',
        totalMarks: '-',
        average: '-',
        min: '-',
        max: '-'
      };
    }
    
    let totalWeightage = 0;
    let totalObtained = 0;
    let totalMarks = 0;
    let validAverages = [];
    let validMins = [];
    let validMaxs = [];
    
    categoryData.forEach(item => {
      if (typeof item.obtainedMarks === 'number' && typeof item.totalMarks === 'number' && item.totalMarks > 0) {
        totalWeightage += item.weightage;
        totalObtained += item.obtainedMarks;
        totalMarks += item.totalMarks;
        
        if (typeof item.average === 'number') {
          validAverages.push(item.average);
        }
        
        if (typeof item.min === 'number') {
          validMins.push(item.min);
        }
        
        if (typeof item.max === 'number') {
          validMaxs.push(item.max);
        }
      }
    });
    
    // Calculate average of averages
    const average = validAverages.length > 0 
      ? validAverages.reduce((sum, val) => sum + val, 0) / validAverages.length 
      : 0;
    
    // Find min of mins and max of maxs
    const min = validMins.length > 0 ? Math.min(...validMins) : 0;
    const max = validMaxs.length > 0 ? Math.max(...validMaxs) : 0;
    
    return {
      totalWeightage,
      totalObtained,
      totalMarks,
      average,
      min,
      max
    };
  };

  // Calculate grand total for a course
  const calculateGrandTotal = (courseId) => {
    if (!marksData) return null;
    
    const categories = ['quizzes', 'assignments', 'midterms', 'finals'];
    let totalObtained = 0;
    let totalMarks = 0;
    let totalWeightage = 0;
    let weightedMarks = 0;
    let hasValidData = false;
    
    categories.forEach(category => {
      const categoryData = marksData[category][courseId];
      if (categoryData && categoryData.length > 0) {
        // Check if the data contains placeholder values
        if (categoryData[0].obtainedMarks !== '-') {
          hasValidData = true;
          // Calculate total obtained marks and weightage
          categoryData.forEach(item => {
            if (typeof item.obtainedMarks === 'number' && typeof item.totalMarks === 'number' && item.totalMarks > 0) {
              totalObtained += item.obtainedMarks;
              totalMarks += item.totalMarks;
              totalWeightage += item.weightage;
              
              // Calculate weighted marks for this assessment
              const weightedMark = (item.obtainedMarks / item.totalMarks) * item.weightage;
              weightedMarks += weightedMark;
            }
          });
        }
      }
    });
    
    if (!hasValidData) {
      return {
        totalObtained: '-',
        totalMarks: '-',
        totalWeightage: 0,
        percentage: '-',
        maxPossible: '-',
        minPossible: '-',
        weightedMarks: 0
      };
    }
    
    if (totalMarks === 0) return null;
    
    // Calculate percentage based on total weightage
    const percentage = totalWeightage > 0 ? (weightedMarks / totalWeightage) * 100 : 0;
    
    // Get section-wide stats from courseStats
    const sectionMax = marksData.courseStats[courseId]?.sectionMax || 0;
    const sectionMin = marksData.courseStats[courseId]?.sectionMin || 0;
    
    return {
      totalObtained,
      totalMarks,
      totalWeightage,
      percentage: percentage.toFixed(2),
      maxPossible: sectionMax.toFixed(2),
      minPossible: sectionMin.toFixed(2),
      weightedMarks
    };
  };

  if (loading) {
    return (
      <div className="marks-container">
        <div className="page-header">
          <h1>Marks Overview</h1>
        </div>
        <div className="loading-container">Loading marks data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="marks-container">
        <div className="page-header">
          <h1>Marks Overview</h1>
        </div>
        <div className="error-container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
          </div>
        </div>
        
        {/* Course Tabs - Show empty tabs when API fails */}
        <div className="course-tabs">
          <button className="course-tab active">No Courses Available</button>
        </div>
        
        {/* Assessment Type Tabs - Show all tabs when API fails */}
        <div className="assessment-tabs">
          <button className={`assessment-tab ${activeTab === 'quizzes' ? 'active' : ''}`}>
            Quizzes
          </button>
          <button className={`assessment-tab ${activeTab === 'assignments' ? 'active' : ''}`}>
            Assignments
          </button>
          <button className={`assessment-tab ${activeTab === 'midterms' ? 'active' : ''}`}>
            Midterms
          </button>
          <button className={`assessment-tab ${activeTab === 'finals' ? 'active' : ''}`}>
            Finals
          </button>
        </div>
        
        {/* Marks Table - Show empty table when API fails */}
        <div className="marks-table-container">
          <table className="marks-table">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Weightage (%)</th>
                <th>Your Marks</th>
                <th>Total Marks</th>
                <th>Class Average</th>
                <th>Min Marks</th>
                <th>Max Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="no-data">Unable to load marks data</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Grand Total Section - Show empty section when API fails */}
        <div className="grand-total-section">
          <h2>Grand Total Marks</h2>
          <table className="grand-total-table">
            <thead>
              <tr>
                <th>Total Weightage</th>
                <th>Weighted Marks</th>
                <th>Section Max</th>
                <th>Section Min</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!marksData || !activeCourse) {
    return (
      <div className="marks-container">
        <div className="page-header">
          <h1>Marks Overview</h1>
        </div>
        <div className="no-data-container">No marks data available</div>
      </div>
    );
  }

  const activeCategoryData = marksData[activeTab][activeCourse];
  const totals = calculateTotals(activeTab, activeCourse);
  const grandTotal = calculateGrandTotal(activeCourse);

  return (
    <div className="marks-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Marks Overview</h1>
      </div>
      
      {/* Course Tabs */}
      <div className="course-tabs">
        {marksData.courses.map(course => (
          <button
            key={course.id}
            className={`course-tab ${course.id === activeCourse ? 'active' : ''}`}
            onClick={() => setActiveCourse(course.id)}
          >
            {course.name}
          </button>
        ))}
      </div>
      
      {/* Assessment Type Tabs */}
      <div className="assessment-tabs">
        <button className={`assessment-tab ${activeTab === 'quizzes' ? 'active' : ''}`} onClick={() => setActiveTab('quizzes')}>
          Quizzes
        </button>
        <button className={`assessment-tab ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>
          Assignments
        </button>
        <button className={`assessment-tab ${activeTab === 'midterms' ? 'active' : ''}`} onClick={() => setActiveTab('midterms')}>
          Midterms
        </button>
        <button className={`assessment-tab ${activeTab === 'finals' ? 'active' : ''}`} onClick={() => setActiveTab('finals')}>
          Finals
        </button>
      </div>
      
      {/* Marks Table */}
      <div className="marks-table-container">
        <table className="marks-table">
          <thead>
            <tr>
              <th>Assessment</th>
              <th>Weightage (%)</th>
              <th>Your Marks</th>
              <th>Total Marks</th>
              <th>Class Average</th>
              <th>Min Marks</th>
              <th>Max Marks</th>
            </tr>
          </thead>
          <tbody>
            {activeCategoryData.map((item, index) => (
              <tr key={index}>
                <td>{item.serial}</td>
                <td>{item.weightage}%</td>
                <td>{item.obtainedMarks}</td>
                <td>{item.totalMarks}</td>
                <td>{item.average}</td>
                <td>{item.min}</td>
                <td>{item.max}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Grand Total Section */}
      {grandTotal && (
        <div className="grand-total-section">
          <h2>Grand Total Marks</h2>
          <table className="grand-total-table">
            <thead>
              <tr>
                <th>Total Weightage</th>
                <th>Weighted Marks</th>
                <th>Section Max</th>
                <th>Section Min</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{grandTotal.totalWeightage}%</td>
                <td>{typeof grandTotal.weightedMarks === 'number' ? grandTotal.weightedMarks.toFixed(2) : '0.00'}</td>
                <td>{marksData.courseStats[activeCourse]?.sectionMax.toFixed(2)}</td>
                <td>{marksData.courseStats[activeCourse]?.sectionMin.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Grading;