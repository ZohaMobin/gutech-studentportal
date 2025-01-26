import React, { useState } from "react";
import Announcement from "../../Page/Dashboard/Announcement";
import BarChart from "../../Page/Dashboard/Attendancebargraph";
import Calendar from "../../Page/Dashboard/Calendar";
import PieChart from "../../Page/Dashboard/PieChart";
import Statistics from "../../Page/Dashboard/Statistics";
import TodaysTimetable from "../../Page/Dashboard/Todaystimetable";
import BarChartmarks from "../../Page/Dashboard/Marks";
import CGPAMeter from "../../Page/Dashboard/CGPAMeter";

const Dashboard = () => {
    const [cgpa, setCgpa] = useState(3.5);  // Using useState for dynamic CGPA

    return (
        <div>
            <Announcement />
            <BarChart />
            <Calendar />
            <PieChart />
            <Statistics />
            <TodaysTimetable />
            <BarChartmarks />
            <CGPAMeter cgpa={cgpa} />
        </div>
    );
};

export default Dashboard;
