import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Scholarship.css';

const ScholarshipPage = () => {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/apply-scholarship');
  };

  const currentScholarship = {
    isOnScholarship: true,
  };

  const scholarships = [
    { type: 'Need-Based'},
    { type: 'Merit-Based'},
  ];

  return (
    <div className="container">
      <h1>Scholarship/Financial Aid</h1>

      <div className="current-scholarship">
        <h3>
          Current Scholarship:{' '}
          {currentScholarship.isOnScholarship
            ? 'You are currently on scholarship/financial aid.'
            : 'You are not currently on scholarship/financial aid.'}
        </h3>
      </div>

      <div>
        <h3 className="available-scholarships">Available Scholarships</h3>
        {scholarships.map((scholarship, index) => (
          <div key={index} className="scholarship-card">
            <span className="scholarship-type">{scholarship.type}</span>
            <button
              onClick={handleApplyClick}
              className="apply-button"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipPage;