import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import Navbar from "../src/Pages/Navbar/Navbar";
=======
>>>>>>> e8327696304d95d49c2cc0101f085da2da9f7896
import Sidebar from "../src/Pages/Sidebar/sidebar/index";
import Assignments from './Pages/assignments/assignments';

import Dashboard from './Pages/dashboard/dashboard';
<<<<<<< HEAD

=======
import { Topbar } from './Pages/topbar/topbar';
>>>>>>> e8327696304d95d49c2cc0101f085da2da9f7896

function App() {
  return (
    <Router>
<<<<<<< HEAD
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
      
  
=======
      <div className="App">
        <Sidebar />
        <div className='mainContent '>
  <Topbar/>
        <Routes>

          <Route path="/" element={<Dashboard/>} /> 
          <Route path="/assignments" element={<Assignments />} />
      
        </Routes>
        </div>
      </div>
>>>>>>> e8327696304d95d49c2cc0101f085da2da9f7896
    </Router>
  );
}

export default App;




