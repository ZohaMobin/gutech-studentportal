import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "../src/Pages/Navbar/Navbar";
import Sidebar from "../src/Pages/Sidebar/sidebar/index";
import Assignments from './Pages/assignments/assignments';

import Dashboard from './Pages/dashboard/dashboard';


function App() {
  return (
    <Router>
      <div>
        <div classname= "placement" ><Navbar /> </div>
      
      <div className="App">
      
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard/>} /> 
          <Route path="/assignments" element={<Assignments />} />
         
        </Routes>
       
      </div>
      </div>
      
  
    </Router>
  );
}

export default App;




