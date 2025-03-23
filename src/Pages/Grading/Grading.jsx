import React, { useState, useEffect } from "react";
import "./Grading.css";

const Grading = () => {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [activeCourse, setActiveCourse] = useState("discrete"); // Changed default to first actual course
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample data structure - this would be replaced with your API data
  const sampleData = {
    courses: [
      // Removed "all" course
      { id: "discrete", name: "Discrete Mathematics" },
      { id: "pspf", name: "Programming Fundamentals" },
      { id: "calculus", name: "Calculus" }
    ],
    quizzes: {
      // Keep "all" data for reference but we won't display it anymore
      all: [
        { serial: 1, weightage: 15, obtainedMarks: 12.5, totalMarks: 15, average: 12.97, stdDev: 1.1, min: 8, max: 14.5 },
        { serial: 2, weightage: 15, obtainedMarks: 13.5, totalMarks: 15, average: 11.3, stdDev: 1.8, min: 7, max: 15 },
        { serial: 3, weightage: 20, obtainedMarks: 17, totalMarks: 20, average: 16.63, stdDev: 1.4, min: 12.5, max: 19 }
      ],
      discrete: [
        { serial: 1, weightage: 15, obtainedMarks: 12.5, totalMarks: 15, average: 12.97, stdDev: 1.1, min: 8, max: 14.5 },
      ],
      pspf: [
        { serial: 1, weightage: 15, obtainedMarks: 13.5, totalMarks: 15, average: 11.3, stdDev: 1.8, min: 7, max: 15 },
      ],
      calculus: [
        { serial: 1, weightage: 20, obtainedMarks: 17, totalMarks: 20, average: 16.63, stdDev: 1.4, min: 12.5, max: 19 }
      ]
    },
    assignments: {
      all: [
        { serial: 1, weightage: 25, obtainedMarks: 22, totalMarks: 25, average: 21.2, stdDev: 1.8, min: 17, max: 24 },
        { serial: 2, weightage: 25, obtainedMarks: 19.5, totalMarks: 25, average: 18.77, stdDev: 2.1, min: 15, max: 23.5 }
      ],
      discrete: [
        { serial: 1, weightage: 25, obtainedMarks: 22, totalMarks: 25, average: 21.2, stdDev: 1.8, min: 17, max: 24 },
      ],
      pspf: [
        { serial: 1, weightage: 25, obtainedMarks: 19.5, totalMarks: 25, average: 18.77, stdDev: 2.1, min: 15, max: 23.5 }
      ],
      calculus: []
    },
    midterms: {
      all: [
        { serial: 1, weightage: 30, obtainedMarks: 26, totalMarks: 30, average: 25.2, stdDev: 2.2, min: 19, max: 29 }
      ],
      discrete: [
        { serial: 1, weightage: 30, obtainedMarks: 26, totalMarks: 30, average: 25.2, stdDev: 2.2, min: 19, max: 29 }
      ],
      pspf: [],
      calculus: []
    },
    finals: {
      all: [
        { serial: 1, weightage: 50, obtainedMarks: 43, totalMarks: 50, average: 41.6, stdDev: 3.4, min: 32, max: 48 }
      ],
      discrete: [
        { serial: 1, weightage: 50, obtainedMarks: 43, totalMarks: 50, average: 41.6, stdDev: 3.4, min: 32, max: 48 }
      ],
      pspf: [],
      calculus: []
    }
  };

  // Simulating API data fetch
  useEffect(() => {
    // Replace this with your actual API call
    setTimeout(() => {
      setMarksData(sampleData);
      setLoading(false);
    }, 500);
  }, []);

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
    
    categories.forEach(category => {
      const categoryData = marksData[category][courseId];
      if (categoryData && categoryData.length > 0) {
        totalObtained += categoryData.reduce((sum, item) => sum + item.obtainedMarks, 0);
        totalMarks += categoryData.reduce((sum, item) => sum + item.totalMarks, 0);
        totalWeightage += categoryData.reduce((sum, item) => sum + item.weightage, 0);
        
        // Calculate average, min, max across all items in the category
        const avgSum = categoryData.reduce((sum, item) => sum + item.average, 0);
        average += avgSum;
        
        const minVal = Math.min(...categoryData.map(item => item.min));
        if (minVal < min || min === 0) min = minVal;
        
        const maxVal = Math.max(...categoryData.map(item => item.max));
        if (maxVal > max) max = maxVal;
      }
    });
    
    if (totalMarks === 0) return null;
    
    return {
      totalObtained,
      totalMarks,
      totalWeightage,
      classAverage: (average / categories.filter(cat => marksData[cat][courseId].length > 0).length).toFixed(2),
      min,
      max
    };
  };

  if (loading) {
    return <div className="loading-container">Loading marks data...</div>;
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
                    <td>{item.average}</td>
                    <td>{item.min}</td>
                    <td>{item.max}</td>
                  </tr>
                ))}
                {totals && (
                  <tr className="total-row">
                    <td>Total</td>
                    <td>{totals.totalWeightage}</td>
                    <td>{totals.totalObtained}</td>
                    <td>{totals.totalMarks}</td>
                    <td colSpan={4}></td>
                  </tr>
                )}
              </>
            ) : (
              <tr>
                <td colSpan={8} className="no-data">No data available for this category</td>
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