// Grading.js
import React from "react";
import { useState } from "react";
import "./Grading.css";
import Table from "../../Components/Table";
const Gradings = () => {
    const [subject, setSubject] = useState("Subject");
    const handleSubjectChange = (newSubject) => {
       setSubject(newSubject);
    };
  const quizzes = [
    { quizno: 1, totalmarks: 10, obtainmarks: 8 },
    { quizno: 2, totalmarks: 10, obtainmarks: 10 },
    { quizno: 3, totalmarks: 20, obtainmarks: 18 },
    { quizno: 4, totalmarks: 5, obtainmarks: 2.5 },
  ];

  const assignments = [
    { assignmentno: 1, totalmarks: 5, obtainmarks: 2.5 },
    { assignmentno: 2, totalmarks: 5, obtainmarks: 2.5 },

  ];

  return (
    <div className="app">
      <div className="header">
        <div className="dropdown">
          <button className="dropdown-button">Grades</button>
          <div className="dropdown-content">
            <a href="#" onClick={() => handleSubjectChange("PSPF")}>
              PSPF
            </a>
            <a href="#" onClick={() => handleSubjectChange("English")}>
              English
            </a>
            <a href="#" onClick={() => handleSubjectChange("Discrete")}>
              Discrete
            </a>
            <a href="#" onClick={() => handleSubjectChange("Design Thinking")}>
              Design Thinking
            </a>
          </div>
        </div>
      </div>
      <h1>Grades of {subject}</h1>
      <main>
        {/* For quizes */}
        <Table
          title="QUIZES"
          data={quizzes}
          columns={["quizno", "totalmarks", "Obtain marks"]}
        />

        {/* For Assignments */}
        <Table
          title="Assignments"
          data={assignments}
          columns={["Assignment no.", "Total marks", "Obtain marks"]}
        />
      </main>
    </div>
  );
};

export default Gradings;
