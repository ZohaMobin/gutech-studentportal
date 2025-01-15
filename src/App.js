import React from 'react';
import Statistics from './Page/Dashboard/Statistics';
import './Page/Dashboard/Statistics';
import Announcement from './Page/Dashboard/Announcement';
import './Page/Dashboard/Announcement';
import TodaysTimetable from './Page/Dashboard/Todaystimetable';
import BarChart from './Page/Dashboard/Attendancebargraph';
import PieChart from './Page/Dashboard/PieChart';
import Calendar from './Page/Dashboard/Calendar';

function App() {

  const Statistics_Data1 = {
    Overall_Attendance: "125",
    Overall_Progress: Math.round((100/125) *100)
  }
  return (
    <div className="container">
      <div className='header'>
      <h1 className='Title'>
        Hello Zeenat <img src='hi_emoji.png' alt="emoji" className="hello-image" />
      </h1>
      <p>Learn Something new today</p>
      </div>
       
    <Statistics Statistics_Data={Statistics_Data1}/>
    <Announcement/>
    <PieChart/>
    <Calendar/>
    <TodaysTimetable/>
    <BarChart />
    </div>
  
  );
}

export default App;
