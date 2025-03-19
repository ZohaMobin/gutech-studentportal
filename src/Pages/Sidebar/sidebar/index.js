

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./index.css";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdown1Open, setIsDropdown1Open] = useState(false);
  const [isDropdown2Open, setIsDropdown2Open] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); 

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);

    if (window.innerWidth < 1000) {
      document.body.style.overflow = isCollapsed ? "auto" : "hidden";
    }
  };

  const toggleDropdown1 = () => {
    setIsDropdown1Open(!isDropdown1Open);
  };

  const toggleDropdown2 = () => {
    setIsDropdown2Open(!isDropdown2Open);
  };

  const toggleMobileSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); 
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setIsMobile(true);
      } else {
        setIsMobile(false); 
        setIsSidebarVisible(false); 
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>

      {isMobile && (
        <img
          onClick={toggleMobileSidebar}
          className=" toggleBtn"
          src="/Slider.svg"
          alt="Toggle Sidebar"
          style={{ position: "fixed", top: "10px", left: "10px", zIndex: 1000 }}
        />
      )}


      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobile && !isSidebarVisible ? "hidden" : ""
        }`}
        style={
          isMobile && isSidebarVisible
            ? { position: "fixed", top: 0.5, left: -8, zIndex: 999 }
            : {}
        }
      >
        <div className="sidebar-header">
          <img
            className={`logo ${isCollapsed ? "collapsed-logo" : ""}`}
            src="./gulogo.svg"
            alt="Logo"
          />
          <img
            onClick={toggleSidebar}
            className={`toggle-btn ${isCollapsed ? "" : "hidden"}`}
            src="/Slider.svg"
            alt="Toggle Sidebar"
          />
        </div>

        <ul className="nav-links">
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



        <Link to="/Announcement" className="sideBar-link">
          <li>
            <img
              src="/speaker-inactive.png"
              alt="Assignments Icon"
              className="icon icon-exlg"
            />
            {!isCollapsed && "Announcements"}
          </li>
        </Link>

     
        <Link to="/Class Schedule" className="sideBar-link">
           <li>
             <img
               src="/calender-inactive.svg"
               alt="Recordings Icon"
               className="icon"
             />
             {!isCollapsed && "Schedule"}
           </li>
         </Link>


        <Link to="/calendar" className="sideBar-link">
           <li>
             <img
               src="/calender-inactive.svg"
               alt="Recordings Icon"
               className="icon"
             />
             {!isCollapsed && "Event Calendar"}
           </li>
         </Link>


        <Link to="/Examschedule" className="sideBar-link">
           <li>
             <img
               src="/calender-inactive.svg"
               alt="Recordings Icon"
               className="icon"
             />
             {!isCollapsed && "ExamsSchedule"}
           </li>
         </Link>

        <Link to="/Attendance" className="sideBar-link">
           <li>
             <img
               src="/recordings-inactive.svg"
               alt="Recordings Icon"
               className="icon"
             />
             {!isCollapsed && "Attendance"}
           </li>
         </Link>
     

         
      



        

      

       
               <Link to="/Fees1" className="sideBar-link">
                 <li>
                   <img
                     src="/clipboard-inactive.svg"
                     alt="Fees Icon"
                     className="icon icon-exlg "
                   />
                   {isCollapsed ? "" : "Fees/Scholarship"}
                 </li>
               </Link>
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
               <Link to="/JobsAndBootcamps" className="sideBar-link">
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
    </>
  );
};






export default Sidebar ; 




