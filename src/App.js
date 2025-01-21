import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "../src/Pages/Sidebar/sidebar/index";
import Assignments from './Pages/assignments/assignments';
import Fees from './Pages/Group1-Fees/Fees';
import Dashboard from './Pages/dashboard/dashboard';
import { Topbar } from './Pages/topbar/topbar';
import AddFee from './Pages/Group1-Fees/AddFee';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className='mainContent '>
  <Topbar/>
        <Routes>
          <Route path="/fees" element={<Fees/>} />
          <Route path='/add-fee' element={<AddFee/>}/>
          <Route path="/" element={<Dashboard/>} /> 
          <Route path="/assignments" element={<Assignments />} />
      
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;



