import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "../src/Pages/Sidebar/sidebar/index";
import Attendance from './Pages/Attendance/Attendance'; 
import Fee from './Pages/Fees/Fees';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Routes>
          <Route path="/" element={<div>Dashboard Content</div>} /> 
          <Route path="/Attendance" element={<Attendance />} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;




