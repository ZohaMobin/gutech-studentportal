import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./index.css";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdown1Open, setIsDropdown1Open] = useState(false);
  const [isDropdown2Open, setIsDropdown2Open] = useState(false);

  // Toggle functions
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleDropdown1 = () => {
    setIsDropdown1Open(!isDropdown1Open);
  };

  const toggleDropdown2 = () => {
    setIsDropdown2Open(!isDropdown2Open);
  };

  // Automatically collapse sidebar when screen size is below 1000px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1000) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <img
          className={`logo ${isCollapsed ? "collapsed-logo" : ""}`}
          src="./gulogo.svg"
          alt="Logo"
        />
        <img
          onClick={toggleSidebar}
          className={`toggle-btn ${isCollapsed ? "collapsed-toggle" : ""}`}
          src="/Slider.svg"
          alt="Toggle Sidebar"
        />
      </div>

      <ul className="nav-links">
        {/* LANDING PAGE IS DASHBOARD */}
        <Link to="/" className="sideBar-link">
          <li>
            <img
              src="/dashboard-inactive.svg"
              alt="Dashboard Icon"
              className="icon"
            />
            {!isCollapsed && "Dashboard"}
          </li>
        </Link>

        {/* Attendance */}
        <Link to="/Attendance" className="sideBar-link">
          <li>
            <img
              src="/clipboard-inactive.svg"
              alt="Assignments Icon"
              className="icon icon-exlg"
            />
            {!isCollapsed && "Attendance"}
          </li>
        </Link>

        {/* Schedules */}
        <li className="moreOptions">
          <div className="dropdown-toggle" onClick={toggleDropdown1}>
            <img
              src="/calender-inactive.svg"
              alt="Schedules Icon"
              className="icon"
            />
            {!isCollapsed && "Schedules"}
            <span className="dropdown-icon">{isDropdown1Open ? "▲" : "▼"}</span>
          </div>
          {isDropdown1Open && (
            <ul className="dropdown-menu">
              <Link to="/exam-schedule" className="sideBar-link">
                <li>{!isCollapsed ? "Exam schedule" : "schedule"}</li>
              </Link>
              <Link to="/timetable" className="sideBar-link">
                <li>{!isCollapsed ? "Timetable" : "Time"}</li>
              </Link>
              <Link to="/event-calender" className="sideBar-link">
                <li>{!isCollapsed ? "Event Calender " : " calendar"}</li>
              </Link>
            </ul>
          )}
        </li>

        {/* DOWNLOADS
   

        {/* GRADINGS */}
        <Link to="/Grading" className="sideBar-link">
          <li>
            <img src="/note-inactive.svg" alt="Notes Icon" className="icon" />
            {!isCollapsed && "Grades"}
          </li>
        </Link>

        {/* RECORDINGS */}
        <Link to="/recordings" className="sideBar-link">
          <li>
            <img
              src="/recordings-inactive.svg"
              alt="Recordings Icon"
              className="icon"
            />
            {!isCollapsed && "Recordings"}
          </li>
        </Link>

        {/* COURSES CHANGED TO FEES */}
     
        <Link to="/fees" className="sideBar-link">
          <li>
            <img
              src="/courses-inactive.svg"
              alt="Courses Icon"
              className="icon icon-exlg "
            />
            {!isCollapsed && "Fees"}
          </li>
        </Link>

        {/* CHAT */}
        <Link to="/Chat" className="sideBar-link">
          <li>
            <img
              src="/discussions-inactive.svg"
              alt="Discussions Icon"
              className="icon icon-exlg "
            />
            {!isCollapsed && "Chat"}
          </li>
        </Link>

        {/* Scholarship */}
        <Link to="/scholarship" className="sideBar-link">
          <li>
            <img
              src="/clipboard-inactive.svg"
              alt="Fees Icon"
              className="icon icon-exlg "
            />
            {isCollapsed ? "" : "Scholarship"}
          </li>
        </Link>

        {/* TRANSCRIPT */}
        <Link to="/Transcript" className="sideBar-link">
          <li>
            <img
              src="/downloads-inactive.svg"
              alt="Transcript Icon"
              className="icon icon-exlg "
            />
            {isCollapsed ? "" : "Transcript"}
          </li>
        </Link>

        {/* JOBS AND BOOTCAMPS */}
        <Link to="/jobs-and-bootcamps" className="sideBar-link">
          <li>
            <img
              src="/note-inactive.svg"
              alt="Job Icon"
              className="icon icon-exlg "
            />
            {isCollapsed ? "" : "Job-Opportunities"}
          </li>
        </Link>
      
      </ul>
    </div>
  );
};

export default Sidebar;


