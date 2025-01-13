import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "../src/Pages/Sidebar/sidebar/index";
import Assignments from './Pages/assignments/assignments';

import Dashboard from './Pages/dashboard/dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard/>} /> 
          <Route path="/assignments" element={<Assignments />} />
          {/* <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} />
          <Route path="/Fees" element={<Fee/>} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;




