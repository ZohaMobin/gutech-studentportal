import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "../src/Pages/Sidebar/sidebar/index";
import Assignments from './Pages/assignments/assignments';
import ScholarshipPage from './Pages/Group5-JobOpportunities/Scholarship';
import JobsAndBootcamps from './Pages/Group5-JobOpportunities/JobsAndBootcamps';
import BootcampForm from './Pages/Group5-JobOpportunities/BootcampForm';

import Dashboard from './Pages/dashboard/dashboard';
import { Topbar } from './Pages/topbar/topbar';

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
          <Route path="/scholarships" element={<ScholarshipPage />} />
          <Route path='/job-opportunities' element={<JobsAndBootcamps />} />
          <Route path='/apply' element={<BootcampForm />} />
      
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;


