import React from 'react';
import { useNavigate } from 'react-router-dom';

const ScholarshipPage = () => {
  const navigate = useNavigate(); // To handle navigation

  const handleApplyClick = () => {
    navigate('/apply-scholarship');
  };

  const currentScholarship = {
    isOnScholarship: true, // Indicates if the user is currently on a scholarship
  };

  const scholarships = [
    { type: 'Need-Based', status: 'Eligible' },
    { type: 'Merit-Based', status: '-' },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#cssi-1-25' }}>Scholarship/Financial Aid</h1>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontStyle: 'italic', color: 'gray' }}>
          Current Scholarship:{' '}
          {currentScholarship.isOnScholarship
            ? 'You are currently on scholarship/financial aid.'
            : 'You are not currently on scholarship/financial aid.'}
        </h3>
      </div>

      <div>
        <h3 style={{ color: 'orange' }}>Available Scholarships</h3>
        {scholarships.map((scholarship, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              border: '1px solid #ddd',
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <span>{scholarship.type}</span>
            <span>{scholarship.status}</span>
            <button
              onClick={handleApplyClick}
              style={{
                backgroundColor: 'orange',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
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

