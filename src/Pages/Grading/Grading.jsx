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
        const response = await fetch("http://localhost:5000/api/grade/student/67de02eb0ad325dc130689b3");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const apiData = await response.json();
        const processedData = processApiData(apiData);
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

  // Process API data to match the component's expected structure
  const processApiData = (apiData) => {
    // Extract unique courses
    const coursesMap = new Map();
    
    apiData.forEach(item => {
      const courseId = item.enrollmentId.sectionId.courseId._id;
      const courseName = item.enrollmentId.sectionId.courseId.name;
      
      if (!coursesMap.has(courseId)) {
        coursesMap.set(courseId, {
          id: courseId,
          name: courseName
        });
      }
    });
    
    const courses = Array.from(coursesMap.values());
    
    // Initialize the data structure
    const processedData = {
      courses: courses,
      quizzes: {},
      assignments: {},
      midterms: {},
      finals: {}
    };
    
    // Initialize course data for each assessment type
    courses.forEach(course => {
      processedData.quizzes[course.id] = [];
      processedData.assignments[course.id] = [];
      processedData.midterms[course.id] = [];
      processedData.finals[course.id] = [];
    });
    
    // Process the API data
    apiData.forEach(item => {
      const courseId = item.enrollmentId.sectionId.courseId._id;
      const assessmentType = mapAssessmentType(item.type);
      
      // Skip if assessment type is unrecognized
      if (!assessmentType) return;
      
      // Calculate class statistics (in a real scenario, these would come from the API)
      // For this example, we'll simulate these values
      const average = item.maxMarks * 0.85; // Simulated class average (85% of max)
      const stdDev = item.maxMarks * 0.1; // Simulated standard deviation (10% of max)
      const min = Math.max(0, item.maxMarks * 0.6); // Simulated minimum (60% of max)
      const max = Math.min(item.maxMarks, item.maxMarks * 0.95); // Simulated maximum (95% of max)
      
      // Create the assessment item
      const assessmentItem = {
        serial: parseInt(item.title) || 1, // Use title as serial, fallback to 1
        weightage: item.weightage,
        obtainedMarks: item.obtainedMarks,
        totalMarks: item.maxMarks,
        average: average,
        stdDev: stdDev,
        min: min,
        max: max
      };
      
      // Add to the appropriate array
      processedData[assessmentType][courseId].push(assessmentItem);
    });
    
    return processedData;
  };
  
  // Map API assessment type to component assessment type
  const mapAssessmentType = (apiType) => {
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
        return null;
    }
  };

  // Calculate totals for a specific category and course
  const calculateTotals = (category, courseId) => {
    if (!marksData || !marksData[category] || !marksData[category][courseId]) return null;
    
    const items = marksData[category][courseId];
    if (items.length === 0) return null;
    
    return {
      totalWeightage: items.reduce((sum, item) => sum + item.weightage, 0),
      totalObtained: items.reduce((sum, item) => sum + item.obtainedMarks, 0),
      totalMarks: items.reduce((sum, item) => sum + item.totalMarks, 0)
    };
  };

  // Calculate grand total across all assessment types
  const calculateGrandTotal = (courseId) => {
    if (!marksData) return null;
    
    const categories = ['quizzes', 'assignments', 'midterms', 'finals'];
    let totalObtained = 0;
    let totalMarks = 0;
    let totalWeightage = 0;
    let average = 0;
    let min = 0;
    let max = 0;
    let categoryCount = 0;
    
    categories.forEach(category => {
      const categoryData = marksData[category][courseId];
      if (categoryData && categoryData.length > 0) {
        totalObtained += categoryData.reduce((sum, item) => sum + item.obtainedMarks, 0);
        totalMarks += categoryData.reduce((sum, item) => sum + item.totalMarks, 0);
        totalWeightage += categoryData.reduce((sum, item) => sum + item.weightage, 0);
        
        // Calculate average, min, max across all items in the category
        const avgSum = categoryData.reduce((sum, item) => sum + item.average, 0);
        average += avgSum;
        categoryCount += categoryData.length;
        
        const minVal = Math.min(...categoryData.map(item => item.min));
        min = min === 0 ? minVal : Math.min(min, minVal);
        
        const maxVal = Math.max(...categoryData.map(item => item.max));
        max = Math.max(max, maxVal);
      }
    });
    
    if (totalMarks === 0) return null;
    
    return {
      totalObtained,
      totalMarks,
      totalWeightage,
      classAverage: categoryCount > 0 ? (average / categoryCount).toFixed(2) : 0,
      min,
      max
    };
  };

  if (loading) {
    return <div className="loading-container">Loading marks data...</div>;
  }

  if (error) {
    return <div className="error-container">Error loading data: {error}</div>;
  }

  if (!marksData || !activeCourse) {
    return <div className="no-data-container">No marks data available</div>;
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
            className={`course-tab ${activeCourse === course.id ? 'active' : ''}`}
            onClick={() => setActiveCourse(course.id)}
          >
            {course.name}
          </button>
        ))}
      </div>
      
      {/* Assessment Type Tabs */}
      <div className="assessment-tabs">
        <button
          className={`assessment-tab ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          Quizzes
        </button>
        <button
          className={`assessment-tab ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button
          className={`assessment-tab ${activeTab === 'midterms' ? 'active' : ''}`}
          onClick={() => setActiveTab('midterms')}
        >
          Midterms
        </button>
        <button
          className={`assessment-tab ${activeTab === 'finals' ? 'active' : ''}`}
          onClick={() => setActiveTab('finals')}
        >
          Finals
        </button>
      </div>
      
      {/* Marks Table */}
      <div className="marks-table-container">
        <table className="marks-table">
          <thead>
            <tr>
              <th>Serial #</th>
              <th>Weightage</th>
              <th>Obtained Marks</th>
              <th>Total Marks</th>
              <th>Average</th>
              <th>Minimum</th>
              <th>Maximum</th>
            </tr>
          </thead>
          <tbody>
            {activeCategoryData && activeCategoryData.length > 0 ? (
              <>
                {activeCategoryData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.serial}</td>
                    <td>{item.weightage}</td>
                    <td>{item.obtainedMarks}</td>
                    <td>{item.totalMarks}</td>
                    <td>{item.average.toFixed(2)}</td>
                    <td>{item.min.toFixed(2)}</td>
                    <td>{item.max.toFixed(2)}</td>
                  </tr>
                ))}
                {totals && (
                  <tr className="total-row">
                    <td>Total</td>
                    <td>{totals.totalWeightage}</td>
                    <td>{totals.totalObtained}</td>
                    <td>{totals.totalMarks}</td>
                    <td colSpan={3}></td>
                  </tr>
                )}
              </>
            ) : (
              <tr>
                <td colSpan={7} className="no-data">No data available for this category</td>
              </tr>
            )}
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
                <th>Total Marks</th>
                <th>Obtained Marks</th>
                <th>Class Average</th>
                <th>Min</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{grandTotal.totalMarks.toFixed(2)}</td>
                <td>{grandTotal.totalObtained.toFixed(2)}</td>
                <td>{grandTotal.classAverage}</td>
                <td>{grandTotal.min.toFixed(2)}</td>
                <td>{grandTotal.max.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Grading;