import React from "react";
import "./CGPAMeter.css";

const CGPAMeter = ({ cgpa }) => {
  const safeCGPA = Math.min(Math.max(cgpa, 0), 4); // Clamp CGPA between 0 and 4
  const percentage = (safeCGPA / 4.0) * 100; // Convert CGPA to percentage

  const getFeedbackMessage = () => {
    if (safeCGPA >= 3) return "Excellent performance! Keep it up!";
    if (safeCGPA >= 2) return "Good effort, but there's room for improvement!";
    return "You need to work harder!";
  };

  return (
    <div className="card">
      <h3>CGPA Meter</h3>
      <div
        className="circular-bar-container"
        style={{ "--percentage": `${percentage}%` }}
      >
        <div className="circular-bar"></div>
        <div className="circular-bar-inner">
          <span>{safeCGPA.toFixed(2)}/4</span>
        </div>
      </div>
      <div className="feedback-message">
        {getFeedbackMessage()}
      </div>
    </div>
  );
};

export default CGPAMeter;
