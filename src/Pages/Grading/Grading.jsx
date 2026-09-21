import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Grading.css";

const Grading = () => {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [activeCourse, setActiveCourse] = useState("");
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the student's results. The server works out every total, percentage and grade.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BACKEND_URL;
        // Sent through axios so the portal's shared interceptor adds the token and handles an expired session.
        const response = await axios.get(`${apiUrl}/api/results/me`);
        const results = response.data;
        const processedData = processResults(results);
        setMarksData(processedData);
        if (processedData.courses.length > 0) {
          setActiveCourse(processedData.courses[0].id);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || err.message || "Unable to load marks");
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      projects: {
        'default': [
          {
            serial: 'No Projects',
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

  const PLACEHOLDER = (serial) => ({
    serial, weightage: 0, obtainedMarks: '-', totalMarks: '-', average: '-', min: '-', max: '-'
  });
  const CATEGORY_OF = { quiz: 'quizzes', assignment: 'assignments', midterm: 'midterms', final: 'finals', project: 'projects' };
  const EMPTY_LABEL = { quizzes: 'No Quizzes', assignments: 'No Assignments', midterms: 'No Midterms', finals: 'No Finals', projects: 'No Projects' };
  const format = (value) => (typeof value === 'number' ? parseFloat(value.toFixed(2)) : '-');

  // Arrange the server's course results into the tabs this page shows. No arithmetic happens here.
  const processResults = (results) => {
    const courses = results?.courses || [];
    if (courses.length === 0) {
      return createEmptyDataStructure();
    }

    const processedData = { courses: [], quizzes: {}, assignments: {}, midterms: {}, finals: {}, projects: {}, courseStats: {} };

    courses.forEach(course => {
      const id = course.registrationId;
      processedData.courses.push({ id, name: `${course.code || ''}: ${course.name || 'Unknown Course'}`.trim() });
      Object.values(CATEGORY_OF).forEach(category => { processedData[category][id] = []; });

      course.assessments.forEach(assessment => {
        const category = CATEGORY_OF[String(assessment.type).toLowerCase()];
        if (!category) return;
        processedData[category][id].push({
          serial: assessment.title || 'Untitled Assessment',
          weightage: assessment.weightage,
          isBonus: assessment.isBonus,
          obtainedMarks: assessment.obtainedMarks ?? '-',
          totalMarks: assessment.maxMarks,
          average: format(assessment.stats?.average),
          min: format(assessment.stats?.min),
          max: format(assessment.stats?.max)
        });
      });

      Object.entries(EMPTY_LABEL).forEach(([category, label]) => {
        if (processedData[category][id].length === 0) processedData[category][id].push(PLACEHOLDER(label));
      });

      processedData.courseStats[id] = {
        totals: course.totals,
        sectionMax: course.sectionStats.maxWeightedMarks,
        sectionMin: course.sectionStats.minWeightedMarks
      };
    });

    return processedData;
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
          <button className={`assessment-tab ${activeTab === 'projects' ? 'active' : ''}`}>
            Projects
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
  const stats = marksData.courseStats[activeCourse];
  const hasMarks = stats?.totals && stats.totals.gradedWeight > 0;

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
        <button className={`assessment-tab ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
          Projects
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
              <tr key={index} className={item.isBonus ? 'bonus-row' : undefined}>
                <td>
                  <span className="assessment-title-cell">
                    {item.serial}
                    {item.isBonus ? <span className="bonus-badge">Bonus</span> : null}
                  </span>
                </td>
                <td>{item.isBonus ? `+${item.weightage}%` : `${item.weightage}%`}</td>
                <td>{item.obtainedMarks}</td>
                <td>{item.totalMarks}</td>
                <td>{typeof item.average === 'number' ? item.average.toFixed(2) : item.average}</td>
                <td>{item.min}</td>
                <td>{item.max}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {activeCategoryData.some((item) => item.isBonus) && (
          <p className="bonus-note">Bonus marks are extra credit on top of the course's 100%.</p>
        )}
      </div>
      
      {/* Grand Total Section: every figure is calculated by the server */}
      {stats && (
        <div className="grand-total-section">
          <h2>Total So Far</h2>
          <table className="grand-total-table">
            <thead>
              <tr>
                <th>Your Total</th>
                <th>Percentage</th>
                <th>Class Highest</th>
                <th>Class Lowest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{hasMarks ? `${stats.totals.weightedMarks.toFixed(2)} out of ${stats.totals.gradedWeight}` : '-'}</td>
                <td>{typeof stats.totals.percentageSoFar === 'number' ? `${stats.totals.percentageSoFar.toFixed(2)}%` : '-'}</td>
                <td>{stats.sectionMax.toFixed(2)}</td>
                <td>{stats.sectionMin.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <p className="grand-total-note">
            {hasMarks && stats.totals.gradedWeight < stats.totals.ordinaryWeight
              ? `Based on the assessments marked so far (${stats.totals.gradedWeight} of the course's ${stats.totals.ordinaryWeight} marks). This is provisional and will change as more marks are added.`
              : 'This is provisional. Final grades are published on your Transcript once results are finalised.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Grading;