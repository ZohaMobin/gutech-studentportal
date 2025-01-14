import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScholarshipPage from './Pages/Group5-JobOpportunities/Scholarship'; 
import ApplicationForm from './Pages/Group5-JobOpportunities/ApplicationPage';
import JobsAndBootcamps from './Pages/Group5-JobOpportunities/JobsAndBootcamps.js';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/scholarships" element={<ScholarshipPage />} />
          <Route path="/apply-scholarship" element={<ApplicationForm />} />
          <Route path="/jobs-bootcamps" element={<JobsAndBootcamps/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
