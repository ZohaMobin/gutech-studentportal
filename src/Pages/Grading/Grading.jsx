import React, { useState } from "react";
import { Plus } from "lucide-react";
import "./Grading.css";

const GradingPage = () => {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [course, setCourse] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    title: "",
    totalMarks: "",
    weightage: "",
  });

  // Sample data
  const quizzes = [
    {
      Sno : 1,
      weightage : 20,
      Obtained_Marks : 6,	
      Total_marks : 10,
      Average	: 12.43,
      Standard_deviation : " ",	
      Minimum	: 2,
      Maximum : 9.5
    },
    {
      Sno : 2,
      weightage : 20,
      Obtained_Marks : 6,	
      Total_marks : 10,
      Average	: 12.43,
      Standard_deviation : " ",	
      Minimum	: 2,
      Maximum : 9.5
    },
    // Add more sample data as needed
  ];

  const assessmentTypes = {
    quizzes: { title: "Quizzes", data: quizzes },
    assignments: { title: "Assignments", data: [] },
    mids: { title: "Mids", data: [] },
    finals: { title: "Finals", data: [] },
  };

  const handleAddAssessment = () => {
    // Add assessment logic here
    setShowAddModal(false);
  };

  return (
    <div className="portal-container">
      <div className="filters-section">
        <div className="filters-grid">
          <select
            className="form-input"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            <option value="discrete">Discrete</option>
            <option value="pspf">PSPF</option>
            <option value="calculus">Calculus</option>
          </select>
        </div>
      </div>

      <div className="tab-container fade-in">
        <div className="tab-header">
          {Object.keys(assessmentTypes).map((type) => (
            <button
              key={type}
              className={`tab-button ${activeTab === type ? "active" : ""}`}
              onClick={() => setActiveTab(type)}
            >
              {assessmentTypes[type].title}
            </button>
          ))}
        </div>

        <div className="table-section">
          <div className="table-header">
            <h2>{assessmentTypes[activeTab].title}</h2>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>{activeTab} #</th>
                <th>Weightage</th>
                <th>Obtained Marks</th>
                <th>Total marks</th>
                <th>Average</th>
                <th>Standard deviation</th>
                <th>Minimum</th>
                <th>Maximum</th>
              </tr>
            </thead>
            <tbody>
              {assessmentTypes[activeTab].data.map((item, index) => (
                <tr key={index}>
                  <td>{item.Sno}</td>
                  <td>{item.weightage}</td>
                  <td>{item.Obtained_Marks}</td>
                  <td>{item.Total_marks}</td>
                  <td>{item.Average}</td>
                  <td>{item.Standard_deviation}</td>
                  <td>{item.Minimum}</td>
                  <td>{item.Maximum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradingPage;
