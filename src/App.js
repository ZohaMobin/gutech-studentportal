import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../src/Pages/Sidebar/sidebar/index";
import Assignments from "./Pages/assignments/assignments";
import Dashboard from "./Pages/dashboard/dashboard";
import { Topbar } from "./Pages/topbar/topbar";
import RecordingsPage from "./Components/Recordings/Recordings";
import RecordingLinksPage from "./Components/Recordings/RecordingLinks";
import ExamSchedule from "./Components/Exam Schedual/ExamSchedule";
import ClassSchedule from "./Pages/Class Schedule/Class Schedule";
import "./Components/Exam Schedual/ExamSchedule.css";

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
            <Route path="/recordings" element={<RecordingsPage />} />
            <Route path="/recording-links" element={<RecordingLinksPage />} />
            <Route path="/exam-schedule" element={<ExamSchedule />} />
            <Route path="/event-calender" element={<ClassSchedule />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
