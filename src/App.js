import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../src/Pages/Sidebar/sidebar/index";
import Dashboard from './Pages/dashboard/dashboard';
import { Topbar } from "./Pages/topbar/topbar";
import RecordingsPage from "./Components/Recordings/Recordings";
import RecordingLinksPage from "./Components/Recordings/RecordingLinks";
import ExamSchedule from "./Components/Exam Schedual/ExamSchedule";
import EventSchedule from "./Pages/Event-Calender/Eventcalender";
import Timetable from './Pages/Class Schedule/ClassSchedule';
import Chat from "./Pages/Chat/Chat.js";
import Transcript from './Pages/Transcript/Transcript.jsx';
import ScholarshipPage from './Pages/Group5-JobOpportunities/Scholarship';
import JobsAndBootcamps from './Pages/Group5-JobOpportunities/JobsAndBootcamps';
import BootcampForm from './Pages/Group5-JobOpportunities/BootcampForm';
import GradingPage from './Pages/Grading/Grading';
import Fees from './Pages/Group1-Fees/Fees';
import AddFee from './Pages/Group1-Fees/AddFee';
import Attendance from './Pages/Attendance/Attendance';
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
            <Route path="/recordings" element={<RecordingsPage />} />
            <Route path="/recording-links" element={<RecordingLinksPage />} />
            <Route path="/exam-schedule" element={<ExamSchedule />} />
            <Route path="/event-calender" element={<EventSchedule />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/transcript" element={<Transcript />} />
            <Route path="/scholarship" element={<ScholarshipPage />} />
            <Route path="/jobs-and-bootcamps" element={<JobsAndBootcamps />} />
            <Route path="/bootcamp-form" element={<BootcampForm />} />
            <Route path="/Grading" element={< GradingPage />} />
          <Route path="/fees" element={<Fees/>} />
          <Route path='/add-fee' element={<AddFee/>}/>
          <Route path="/Attendance" element={<Attendance />} />
          </Routes>

        </div>
      </div>
    </Router>
  );
}
export default App;