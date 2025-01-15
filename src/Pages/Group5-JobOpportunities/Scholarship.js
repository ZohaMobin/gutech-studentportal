import React from 'react';
import './Scholarship.css';

const ScholarshipPage = () => {
  const formDownloadLink = 'https://example.com/scholarship-form.pdf'; // Replace with the actual form link

  const handleApplyClick = () => {
    // Trigger the download of the form
    const link = document.createElement('a');
    link.href = formDownloadLink;
    link.download = 'Scholarship_Form.pdf'; // Suggest a file name for the downloaded file
    link.click();
  };

  const currentScholarship = {
    isOnScholarship: true,
  };

  const scholarships = [
    { type: 'Need-Based' },
    { type: 'Merit-Based' },
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
              Download Form
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipPage;
