
import './App.css';
import Statistics from './Page/Dashboard/Statistics';
import './Page/Dashboard/Statistics';
import Announcement from './Page/Dashboard/Announcement';
import './Page/Dashboard/Announcement';
import TodaysTimetable from './Page/Dashboard/Todaystimetable';
import PieChart from './Page/Dashboard/PieChart';
import Calendar from './Page/Dashboard/Calendar';

function App() {
  const Statistics_Data1 = {
    Overall_Attendance: "125",
    Overall_Progress: Math.round((100/125) *100)
  }
  return (
    <div className="container">
    <Statistics Statistics_Data={Statistics_Data1}/>
    <Announcement/>
    <TodaysTimetable/>
    <PieChart/>
    <Calendar/>

    </div>
  );
}

export default App;
