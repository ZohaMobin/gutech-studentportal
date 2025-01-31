import React from 'react';
import './Scholarship.css';

const ScholarshipPage = () => {
  const formDownloadLink = 'https://mail.google.com/mail/u/0?ui=2&ik=c7da901a06&attid=0.1&permmsgid=msg-f:1820675278562243377&th=19445684fe09b331&view=att&disp=inline&realattid=f_m5nqs0k60&zw'; // Replace with the actual form link

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
    { type: 'AGU Scholarship Form' },
   
  ];

  return (
    <div className="container">
      <h1>Scholarship/Financial Aid</h1>

      <div className="current-scholarship">
        <h3>
          Current Scholarship:  {' '}
         
        </h3>
        </div>
        <div className='status'>
        <p>
          
          {currentScholarship.isOnScholarship
            ? 'You are currently on scholarship/FA.'
            : 'None.'}
        </p>
      </div>

      <div>
        <h3 className="available-scholarships">Available Scholarship</h3>
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
