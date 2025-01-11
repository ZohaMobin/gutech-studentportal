// import React, { useState } from "react";
// import "./navbar.css";
// import { Link } from "react-router-dom";
// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
//       <div className="sidebar-header">
//         <h2 className="logo">{isCollapsed ? "Logo" : "Your Logo"}</h2>
//         <button onClick={toggleSidebar} className="toggle-btn">
//           {isCollapsed ? "☰" : "✖"}
//         </button>
//       </div>

//       <ul className="nav-links">
//         <Link to="/" className="sideBar-link">
//           <li>
//             <Link to="/" className="sideBar-link">
//               {isCollapsed ? "Dashboard" : "Dashboard"}
//             </Link>
//           </li>
//         </Link>
//         <Link to="/assignments" className="sideBar-link">
//         <li>
       
//             {isCollapsed ? "Assignments" : "Assignments"}
      
//         </li>
//         </Link>
        

//         <Link to="/classes" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Classes" : "Classes"}
//   </li>
// </Link>
// <Link to="/classes" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Grades" : "Grades"}
//   </li>
// </Link>

// <Link to="/courses" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Courses" : "Courses"}
//   </li>
// </Link>
// <Link to=" " className="sideBar-link">
//         <li>
        
//             {isCollapsed ? "Schedules" : "Schedules"}
        
//         </li>
//         </Link>
//         <Link to=" " className="sideBar-link">
//         <li>
        
//             {isCollapsed ? "Timetable" : "Timetable"}
        
//         </li>
//         </Link>
//         <Link to=" " className="sideBar-link">
//         <li>
        
//             {isCollapsed ? "Calender" : "Calender"}
        
//         </li>
//         </Link>
//         <Link to="/recordings" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Recordings" : "Recordings"}
//   </li>
// </Link>
// <Link to="/discussions" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Discussions" : "Discussions"}
//   </li>
// </Link>
// <Link to="/resources" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Resources" : "Resources"}
//   </li>
// </Link>
// <Link to="/notes" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Notes" : "Notes"}
//   </li>
// </Link>
// <Link to="/downloads" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Downloads" : "Downloads"}
//   </li>
// </Link>
// {/* <Link to="/classes" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Classes" : "Classes"}
//   </li>
// </Link>
// <Link to="/classes" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Grades" : "Grades"}
//   </li>
// </Link>

// <Link to="/courses" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Courses" : "Courses"}
//   </li>
// </Link> */}
// <Link to="/classes" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Transcript" : "Transcript"}
//   </li>
// </Link>
// <Link to="/classes" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Fees" : "Fees"}
//   </li>
// </Link>
// <Link to="/classes" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Job-Opportunities" : "Job-Opportunities"}
//   </li>
// </Link>
// <Link to="/settings" className="sideBar-link">
//   <li>
//     {isCollapsed ? "Settings" : "Settings"}
//   </li>
// </Link>

//       </ul>
//     </div>
//   );
// };

// export default Sidebar;




import React, { useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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

        {/* Dropdown Section */}
        <li>
          <div
            className="dropdown-toggle sideBar-link"
            onClick={toggleDropdown}
          >
            {isCollapsed ? "More" : "More Options"}
            <span className="dropdown-icon">
              {isDropdownOpen ? "▲" : "▼"}
            </span>
          </div>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/resources" className="sideBar-link">
                  {isCollapsed ? "Resources" : "Resources"}
                </Link>
              </li>
              <li>
                <Link to="/notes" className="sideBar-link">
                  {isCollapsed ? "Notes" : "Notes"}
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="sideBar-link">
                  {isCollapsed ? "Downloads" : "Downloads"}
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
            {isCollapsed ? "Calendar" : "Calendar"}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;