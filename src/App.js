import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScholarshipPage from './Pages/Group5-JobOpportunities/Scholarship'; 
import JobsAndBootcamps from './Pages/Group5-JobOpportunities/JobsAndBootcamps.js';
import BootcampForm from './Pages/Group5-JobOpportunities/BootcampsForm';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/scholarships" element={<ScholarshipPage />} />
          <Route path="/jobs-bootcamps" element={<JobsAndBootcamps/>} />
          <Route path="/apply" element={<BootcampForm/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
