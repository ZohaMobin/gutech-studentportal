import Announcement from "../../Page/Dashboard/Announcement";
import BarChart from "../../Page/Dashboard/Attendancebargraph";
import Calendar from "../../Page/Dashboard/Calendar";
import PieChart from "../../Page/Dashboard/PieChart";
import Statistics from "../../Page/Dashboard/Statistics";
import TodaysTimetable from "../../Page/Dashboard/Todaystimetable";
import BarChartmarks from "../../Page/Dashboard/Marks";
const Dashboard = () => {
    return (
        <div>
            <Announcement/>
            <BarChart/>
            <Calendar/>
            <PieChart/>
            <Statistics/>
            <TodaysTimetable/>
            <BarChartmarks/>
        </div>
    );
};

export default Dashboard;

