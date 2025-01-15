import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Pages/Sidebar/sidebar/index';
import Assignments from './Pages/assignments/assignments';
import Dashboard from './Pages/dashboard/dashboard';
import { Topbar } from './Pages/topbar/topbar';
import ClassSchedule from './Pages/Class Schedule/ClassSchedule';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="mainContent">
          <Topbar />

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/timetable" element={ <ClassSchedule />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
