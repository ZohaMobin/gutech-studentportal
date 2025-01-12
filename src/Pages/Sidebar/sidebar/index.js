

import React, { useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdown1Open, setIsDropdown1Open] = useState(false); 
  const [isDropdown2Open, setIsDropdown2Open] = useState(false); 

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleDropdown1 = () => {
    setIsDropdown1Open(!isDropdown1Open);
  };

  const toggleDropdown2 = () => {
    setIsDropdown2Open(!isDropdown2Open);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2 className="logo">{isCollapsed ? "Logo" : "Your Logo"}</h2>
        <button onClick={toggleSidebar} className="toggle-btn">
          {isCollapsed ? "☰" : "✖"}
        </button>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/" className="sideBar-link">
            {isCollapsed ? "Dashboard" : "Dashboard"}
          </Link>
        </li>

        <li>
          <Link to="/assignments" className="sideBar-link">
            {isCollapsed ? "Assignments" : "Assignments"}
          </Link>
        </li>

        {/* Dropdown 1: Schedules, Timetable, Calendar */}
        <li className="moreOptions">
          <div
            className="dropdown-toggle sideBar-link"
            onClick={toggleDropdown1}
          >
            {isCollapsed ? "Schedules" : "Schedules"}
            <span className="dropdown-icon">
              {isDropdown1Open ? "▲" : "▼"}
            </span>
          </div>
          {isDropdown1Open && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/schedules" className="sideBar-link">
                  {isCollapsed ? "Schedules" : "Schedules"}
                </Link>
              </li>
              <li>
                <Link to="/timetable" className="sideBar-link">
                  {isCollapsed ? "Timetable" : "Timetable"}
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="sideBar-link">
                  {isCollapsed ? "Event-Calendar" : "Event-Calendar"}
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Dropdown 2: More Options */}
        

        {/* Other Links */}
        <li>
          <Link to="/classes" className="sideBar-link">
            {isCollapsed ? "Classes" : "Classes"}
          </Link>
        </li>
        <li>
          <Link to="/courses" className="sideBar-link">
            {isCollapsed ? "Courses" : "Courses"}
          </Link>
        </li>
        <li>
          <Link to="/courses" className="sideBar-link">
            {isCollapsed ? "Grades" : "Grades"}
          </Link>
        </li>
        <li>
          <Link to="/resources" className="sideBar-link">
            {isCollapsed ? "Resources" : "Resources"}
          </Link>
        </li>
        <li>
          <Link to="/downloads" className="sideBar-link">
            {isCollapsed ? "Downloads" : "Downloads"}
          </Link>
        </li>
        <li>
          <Link to="/notes" className="sideBar-link">
            {isCollapsed ? "Notes" : "Notes"}
          </Link>
        </li>
        <li>
          <Link to="/discussions" className="sideBar-link">
            {isCollapsed ? "Discussions" : "Discussions"}
          </Link>
        </li>


        <li className="moreOptions">
          <div
            className="dropdown-toggle sideBar-link"
            onClick={toggleDropdown2}
          >
            {isCollapsed ? "More" : "More Options"}
            <span className="dropdown-icon">
              {isDropdown2Open ? "▲" : "▼"}
            </span>
          </div>
          {isDropdown2Open && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/fees" className="sideBar-link">
                  {isCollapsed ? "Fees" : "Fees/Scholarship"}
                </Link>
              </li>
              <li>
                <Link to="/transcript" className="sideBar-link">
                  {isCollapsed ? "Transcript" : "Transcript"}
                </Link>
              </li>
              <li>
                <Link to="/job-opportunities" className="sideBar-link">
                  {isCollapsed ? "Job" : "Job-Opportunities"}
                </Link>
              </li>
              <li>
                <Link to="/settings" className="sideBar-link">
                  {isCollapsed ? "Settings" : "Settings"}
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;