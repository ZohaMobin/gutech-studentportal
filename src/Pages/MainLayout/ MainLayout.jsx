// MainLayout.jsx
import React, { useState } from 'react';
import Sidebar from '../Sidebar/sidebar/Sidebar';
import './MainLayout.css';
import Topbar from '../topbar/topbar';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  
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
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onNavClick={handleNavClick}
        activePage={activePage}
      />
      
      <div className={`content-area ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <main className="main-content">
          {/* Dynamic content based on active page */}
          {React.Children.map(children, child => {
            // Clone the child element and pass the activePage prop
            return React.cloneElement(child, { activePage });
          })}
        </main>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div className="mobile-overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default MainLayout;