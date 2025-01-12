import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScholarshipPage from './Pages/Group5-JobOpportunities/Scholarship'; // Import the ScholarshipPage component


const App = () => {
  return (
    <Router>
      <div>
        {/* Add your navigation or top bar here if needed */}
        <Routes>
          {/* Route for the ScholarshipPage */}
          <Route path="/" element={<ScholarshipPage />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
