import React, { useState } from "react";
import "./navbar.css";

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
        <li> {isCollapsed ? "" : "Dashboard"}</li>
        <li> {isCollapsed ? "" : "Courses"}</li>
        <li> {isCollapsed ? "" : "Performance"}</li>
        <li> {isCollapsed ? "" : "Attendance"}</li>
        <li> {isCollapsed ? "" : "Settings"}</li>
      </ul>
    </div>
  );
};

export default Sidebar;
