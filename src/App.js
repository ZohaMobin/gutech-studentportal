import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "../src/Pages/Sidebar/sidebar/index";
import Assignments from './Pages/assignments/assignments';
import Grading from './Pages/Grading/Grading';
import Dashboard from './Pages/dashboard/dashboard';
import ChatApp from './Pages/Chat/Chat';
import { Topbar } from './Pages/topbar/topbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="mainContent ">
          <Topbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/grading" element={<Grading />} />
            <Route path="/chat" element={<ChatApp />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;



