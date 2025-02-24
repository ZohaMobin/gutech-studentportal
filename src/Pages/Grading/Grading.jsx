// import React, { useState,useEffect } from "react";
// import { Plus } from "lucide-react";
// import axios from "axios";
// import "./Grading.css";

// const GradingPage = () => {
//   const [activeTab, setActiveTab] = useState("quizzes");
//   const [course, setCourse] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newAssessment, setNewAssessment] = useState({
//     // Sno,
//     title: "",
//     totalMarks: "",
//     weightage: "",
//     Obtained_Marks: "",
//     Total_marks: "",
//     Average: "",
//     Standard_deviation: " ",
//     Minimum: "",
//     Maximum: "",
//   });

//   const assessmentTypes = {
//     quizzes: { title: "Quizzes" },
//     assignments: { title: "Assignments", data: [] },
//     mids: { title: "Mids", data: [] },
//     finals: { title: "Finals", data: [] },
//   };

//   const handleAddAssessment = () => {
//     // Add assessment logic here
//     setShowAddModal(false);
//   };

//   // //GET API
//   // useEffect(() => {
//   //   axios.get("http://localhost:5000/grading")
//   //     .then((response) => {
        
//   //       setNewAssessment(response.data);
//   //       console.log(response.data);
//   //     })
//   //     .catch((error) => {
//   //       console.error(error);
//   //     });
//   // }, []);

//   return (
//     <div className="portal-container">
//       <div className="filters-section">
//         <div className="filters-grid">
//           <select
//             className="form-input"
//             value={course}
//             onChange={(e) => setCourse(e.target.value)}
//           >
//             <option value="">Select Course</option>
//             <option value="discrete">Discrete</option>
//             <option value="pspf">PSPF</option>
//             <option value="calculus">Calculus</option>
//           </select>
//         </div>
//       </div>

//       <div className="tab-container fade-in">
//         <div className="tab-header">
//           {Object.keys(assessmentTypes).map((type) => (
//             <button
//               key={type}
//               className={`tab-button ${activeTab === type ? "active" : ""}`}
//               onClick={() => setActiveTab(type)}
//             >
//               {assessmentTypes[type].title}
//             </button>
//           ))}
//         </div>

//         <div className="table-section">
//           <div className="table-header">
//             <h2>{assessmentTypes[activeTab].title}</h2>
//           </div>

//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>{activeTab} #</th>
//                 <th>Weightage</th>
//                 <th>Obtained Marks</th>
//                 <th>Total marks</th>
//                 <th>Average</th>
//                 <th>Standard deviation</th>
//                 <th>Minimum</th>
//                 <th>Maximum</th>
//               </tr>
//             </thead>
//             <tbody>
//               {assessmentTypes[activeTab].data.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.Sno}</td>
//                   <td>{item.weightage}</td>
//                   <td>{item.Obtained_Marks}</td>
//                   <td>{item.Total_marks}</td>
//                   <td>{item.Average}</td>
//                   <td>{item.Standard_deviation}</td>
//                   <td>{item.Minimum}</td>
//                   <td>{item.Maximum}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GradingPage;


import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import "./Grading.css";

const GradingPage = () => {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [course, setCourse] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    title: "",
    totalMarks: "",
    weightage: "",
    Obtained_Marks: "",
    Total_marks: "",
    Average: "",
    Standard_deviation: "",
    Minimum: "",
    Maximum: "",
  });

  // Dummy data for each assessment type
  const assessmentTypes = {
    quizzes: {
      title: "Quizzes",
      data: [
        { Sno: 1, weightage: "10%", Obtained_Marks: 8, Total_marks: 10, Average: 7, Standard_deviation: 1.2, Minimum: 5, Maximum: 10 },
        { Sno: 2, weightage: "15%", Obtained_Marks: 12, Total_marks: 15, Average: 10, Standard_deviation: 1.5, Minimum: 8, Maximum: 14 },
      ],
    },
    assignments: {
      title: "Assignments",
      data: [
        { Sno: 1, weightage: "20%", Obtained_Marks: 18, Total_marks: 20, Average: 16, Standard_deviation: 2.1, Minimum: 12, Maximum: 20 },
      ],
    },
    mids: {
      title: "Mids",
      data: [
        { Sno: 1, weightage: "30%", Obtained_Marks: 22, Total_marks: 30, Average: 20, Standard_deviation: 3, Minimum: 15, Maximum: 28 },
      ],
    },
    finals: {
      title: "Finals",
      data: [
        { Sno: 1, weightage: "40%", Obtained_Marks: 38, Total_marks: 40, Average: 35, Standard_deviation: 4, Minimum: 30, Maximum: 40 },
      ],
    },
  };

  const handleAddAssessment = () => {
    setShowAddModal(false);
  };

  // Uncomment when API is ready
  // useEffect(() => {
  //   axios.get("http://localhost:5000/grading")
  //     .then((response) => {
  //       setNewAssessment(response.data);
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

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
