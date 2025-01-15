import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "../src/Pages/Sidebar/sidebar/index";
import Assignments from './Pages/assignments/assignments';

import Dashboard from './Pages/dashboard/dashboard';
import { Topbar } from './Pages/topbar/topbar';
import Attendance from './Pages/Attendance/Attendance';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className='mainContent '>
  <Topbar/>
        <Routes>

          <Route path="/" element={<Dashboard/>} /> 
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/Attendance" element={<Attendance />} />

        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;



