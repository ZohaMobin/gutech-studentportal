
import './App.css';
import Staistics from './Components/Page/Statistics';
import './Components/Page/Statistics';
import Announcement from './Components/Page/Announcement';
import './Components/Page/Announcement';


function App() {
  const Statistics_Data1 = {
    Overall_Attendance: "125",
    Overall_Progress: Math.round((100/125) *100)
  }
  return (
    <div className="container">
    <Staistics Statistics_Data={Statistics_Data1}/>
    <Announcement/>
    </div>
  );
}

export default App;
