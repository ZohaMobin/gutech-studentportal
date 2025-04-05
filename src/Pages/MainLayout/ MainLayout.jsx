// MainLayout.jsx - Updated
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/sidebar/Sidebar';
import './MainLayout.css';
import Topbar from '../topbar/topbar';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const location = useLocation();
  
  // Update activePage when the route changes
  useEffect(() => {
    // Extract the page ID from the path (e.g., /main/dashboard -> dashboard)
    const pathParts = location.pathname.split('/');
    if (pathParts.length >= 3) {
      setActivePage(pathParts[2]); // Get the last part of the path
    } else {
      setActivePage('dashboard'); // Default to dashboard if path is incomplete
    }
  }, [location]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    // On mobile, close sidebar after navigation
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="main-layout">
      <Topbar 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
      />
      
      <div className="main-container">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onNavClick={handleNavClick}
          activePage={activePage} 
        />
        
        <div className={`content-area ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <main className="main-content">
            <Outlet />
            {React.Children.map(children, child => {
              // Clone the child element and pass the activePage prop
              return child ? React.cloneElement(child, { activePage }) : null;
            })}
          </main>
        </div>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div className="mobile-overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default MainLayout;