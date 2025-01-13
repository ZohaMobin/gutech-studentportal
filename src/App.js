import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Attendance from './Pages/Attendance/Attendance';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
       
        <Routes>
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
