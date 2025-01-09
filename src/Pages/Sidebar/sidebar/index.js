import React, { useState } from "react";
import "./navbar.css";
import { Link, useLocation } from "react-router-dom";
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
            {isCollapsed ? "Dash" : "Dashboard"}
          </Link>
        </li>
        <li>
         
          <Link to="/Attendance" className="sideBar-link">
            {isCollapsed ? "" : "Assignments"}
          </Link>
        </li>
        <li>
         
          <Link to="/Fees" className="sideBar-link">
            {isCollapsed ? "" : "Schedules"}
          </Link>
        </li>

        <li>
         
         <Link to="/Fees" className="sideBar-link">
           {isCollapsed ? "" : "Recordings"}
         </Link>
       </li>
       <li>
         
         <Link to="/Fees" className="sideBar-link">
           {isCollapsed ? "" : "Discussions"}
         </Link>
       </li>
       <li>
         
         <Link to="/Fees" className="sideBar-link">
           {isCollapsed ? "" : "Resources"}
         </Link>
       </li>

    

       <li>
         
         <Link to="/Fees" className="sideBar-link">
           {isCollapsed ? "" : "Notes"}
         </Link>
       </li>

       <li>
         
         <Link to="/Fees" className="sideBar-link">
           {isCollapsed ? "" : "Downloades"}
         </Link>
       </li>

       <li>
         
         <Link to="/Fees" className="sideBar-link">
           {isCollapsed ? "" : "Classes"}
         </Link>
       </li>

       <li>
         
         <Link to="/Fees" className="sideBar-link">
           {isCollapsed ? "" : "Courses"}
         </Link>
       </li>

       <li>
         
         <Link to="/Fees" className="sideBar-link">
           {isCollapsed ? "" : "Settings"}
         </Link>
       </li>


      </ul>
    </div>
  );
};

export default Sidebar;
