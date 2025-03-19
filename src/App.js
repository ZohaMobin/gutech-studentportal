import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './Pages/MainLayout/ MainLayout'; // Fixed import path
import Signup from './Pages/LoginSignUp/Signup';
import GradingPage from './Pages/Grading/Grading';
import ClassSchedule from './Pages/ClassSchedule/ClassSchedule';
import Transcript from './Pages/Transcript/Transcript';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Signup Page */}
          <Route path="/" element={<Signup />} />

          {/* Main Layout with Nested Routes */}
          <Route path="/*" element={<MainLayout />}>
            <Route path="marks" element={<GradingPage />} />
            <Route path="timetable" element={<ClassSchedule />} />
            <Route path="transcript" element={<Transcript />} />
            {/* Add more routes if needed */}
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
