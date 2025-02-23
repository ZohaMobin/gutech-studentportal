import React, { useState } from "react";
import Announcement from "../../Page/Dashboard/Announcement";
import BarChart from "../../Page/Dashboard/Attendancebargraph";
import Calendar from "../../Page/Dashboard/Calendar";
import PieChart from "../../Page/Dashboard/PieChart";
import Statistics from "../../Page/Dashboard/Statistics";
import TodaysTimetable from "../../Page/Dashboard/Todaystimetable";
import BarChartmarks from "../../Page/Dashboard/Marks";
import CGPAMeter from "../../Page/Dashboard/CGPAMeter";
import './dashboard.css';

const Dashboard = () => {
    const [cgpa, setCgpa] = useState(3.5);  // Using useState for dynamic CGPA

    return (
        <div className="dashboard-container">
            <Announcement />
            <TodaysTimetable />
            <Calendar />
            <BarChart />
            <CGPAMeter cgpa={cgpa} />
            <PieChart />
            <BarChartmarks />
            <Statistics />
        </div>
       
    );
};

export default Dashboard;
