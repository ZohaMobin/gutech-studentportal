// Header.jsx
import React, { useState } from 'react';
import './topbar.css';

const Topbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Mobile hamburger menu */}
        <div className="header-mobile-toggle">
          <button className="hamburger-button" onClick={toggleSidebar}>
            <span className={`hamburger-icon ${isSidebarOpen ? 'active' : ''}`}></span>
          </button>
        </div>

        {/* Logo for mobile */}
        <div className="header-logo-mobile">
          <div className="logo">
            <div className="logo-icon">P</div>
            <span className="logo-text">Portal</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="header-search">
          <div className="search-container">
            <input type="text" placeholder="Search..." className="search-input" />
            <button className="search-button">
              <span className="search-icon">🔍</span>
            </button>
          </div>
        </div>

        {/* Right navigation */}
        <nav className="header-nav">
          <a href="#" className="header-nav-item">Help</a>
          <a href="#" className="header-nav-item">Support</a>
          <a href="#" className="header-nav-item notification-icon">
            <span>🔔</span>
            <span className="notification-badge">3</span>
          </a>
          
          {/* User profile */}
          <div className="user-profile">
            <div className="user-avatar" onClick={toggleProfileMenu}>
              <span>JD</span>
            </div>
            
            {/* Profile dropdown menu */}
            {isProfileMenuOpen && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <span className="profile-name">John Doe</span>
                  <span className="profile-email">john.doe@example.com</span>
                </div>
                <div className="profile-menu">
                  <a href="#" className="profile-menu-item">My Profile</a>
                  <a href="#" className="profile-menu-item">Account Settings</a>
                  <a href="#" className="profile-menu-item">Preferences</a>
                  <div className="profile-divider"></div>
                  <a href="#" className="profile-menu-item logout">Logout</a>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Topbar;