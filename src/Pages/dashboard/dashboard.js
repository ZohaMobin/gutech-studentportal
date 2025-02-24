import React, { useState } from "react";
import Announcement from "../../Components/Dashboard/Announcement";



import BarChart from "../../Components/Dashboard/Attendancebargraph";
import Calendar from "../../Components/Dashboard/Calendar";
import PieChart from "../../Components/Dashboard/PieChart";
import Statistics from "../../Components/Dashboard/Statistics";
import TodaysTimetable from "../../Components/Dashboard/Todaystimetable";
import BarChartmarks from "../../Components/Dashboard/Marks";
import CGPAMeter from "../../Components/Dashboard/CGPAMeter";
import './dashboard.css';


const Dashboard = () => {
    const [cgpa, setCgpa] = useState(3.5);  // Using useState for dynamic CGPA

    return (
        <div className="dashboard-container">
            <Announcement />
            
            <TodaysTimetable />
            <BarChart />
            <PieChart />
            <CGPAMeter cgpa={cgpa} />
            <Calendar />
            
            <BarChartmarks />
            
            <Statistics />
        </div>
       
    );
};

export default Dashboard;
