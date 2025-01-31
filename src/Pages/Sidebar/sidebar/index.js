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

        {/* ASSIGNMENTS */}
        <Link to="/assignments" className="sideBar-link">
          <li>
            <img
              src="/clipboard-inactive.svg"
              alt="Assignments Icon"
              className="icon icon-exlg"
            />
            {!isCollapsed && "Assignments"}
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
        <Link to="/downloads" className="sideBar-link">
          <li>
            <img
              src="/downloads-inactive.svg"
              alt="Downloads Icon"
              className="icon"
            />
            {!isCollapsed && "Downloads"}
          </li>
        </Link> */}


      {/* CLASSES */}
        {/* <Link to="/classes" className="sideBar-link">
          <li>
            <img
              src="/classes-inactive.svg"
              alt="Classes Icon"
              className="icon-exlg "
            />
            {!isCollapsed && "Classes"}
          </li>
        </Link> */}

      {/* NOTES */}
        {/* <Link to="/notes" className="sideBar-link">
          <li>
            <img
              src="/resources-inactive.svg"
              alt="Resources Icon"
              className="icon "
            />
            {!isCollapsed && "Resources"}
          </li>
        </Link> */}

      {/* GRADES */}
        {/* <li className="moreOptions">
          <div className="dropdown-toggle " onClick={toggleDropdown2}>
            <img
              src="/clipboard-inactive.svg"
              alt="Grades Icon"
              className="icon icon-exlg "
            />
            {!isCollapsed && "Grades"}
            <span className="dropdown-icon">{isDropdown2Open ? "▲" : "▼"}</span>
          </div>
          {isDropdown2Open && (
            <ul className="dropdown-menu">
              <Link to="/grading" className="sideBar-link">
                <li>{!isCollapsed ? "Discrete" : "Discrete"}</li>
              </Link>
              <Link to="/web-development" className="sideBar-link">
                <li>{!isCollapsed ? "Web Development" : "Web-Dev"}</li>
              </Link>
              <Link to="/programming-fundamentals" className="sideBar-link">
                <li>{!isCollapsed ? "Programming Fundamentals" : "PF"}</li>
              </Link>
              <Link to="/design-thinking" className="sideBar-link">
                <li>{!isCollapsed ? "Design Thinking" : "DT"}</li>
              </Link>
              <Link to="/english" className="sideBar-link">
                <li>{!isCollapsed ? "English" : "Eng"}</li>
              </Link>
            </ul>
          )}
        </li> */}


        {/* GRADINGS */}
        <Link to="/grading" className="sideBar-link">
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
        {/* <Link to="/courses" className="sideBar-link">
          <li>
            <img
              src="/courses-inactive.svg"
              alt="Courses Icon"
              className="icon icon-exlg "
            />
            {!isCollapsed && "Courses"}
          </li>
        </Link> */}
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
        <Link to="/transcript" className="sideBar-link">
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
        <Link to="/settings" className="sideBar-link">
          <li>
            <img
              src="/settings-inactive.svg"
              alt="Settings Icon"
              className="icon icon-exlg "
            />
            {isCollapsed ? "" : "Settings"}
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;



