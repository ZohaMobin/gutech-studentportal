import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "../src/Pages/Sidebar/sidebar/index";
import Assignments from './Pages/assignments/assignments';

import Dashboard from './Pages/dashboard/dashboard';
import { Topbar } from './Pages/topbar/topbar';

function App() {

  const Statistics_Data1 = {
    Overall_Attendance: "125",
    Overall_Progress: Math.round((100/125) *100)
  }
  const Header = ({ name }) => {
    return (
      <div className='header' style={{ 
        padding: '20px', 
        borderRadius: '10px', 
        backgroundColor: '#f0f4f8', 
        position: 'fixed', 
        top: '0', 
        left: '0', 
        width: '100%', 
        height: '70px',
        zIndex: '1000', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        display: 'flex',
        flexDirection: 'column', // Stack elements vertically
        // alignItems: 'center',
        // justifyContent: 'center',
        textAlign: 'left',
        
      }}>
        <h1 className='Title' style={{ 
          fontFamily: 'Poppins, sans-serif', 
          fontWeight: '600', 
          margin: '0' 
        }}>
          Hello {name} <img src='hi_emoji.png' alt="emoji" className="hello-image" style={{ verticalAlign: 'middle' }} />
        </h1>
        <p style={{ 
          color: '#757575', 
          fontFamily: 'Arial, sans-serif', 
          margin: '0',
          fontSize: '14px'
        }}>Learn Something new today</p>
      </div>
    );
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;



