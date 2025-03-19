import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';

const Sidebar = ({ isOpen, activePage }) => {
  const navigate = useNavigate(); // React Router navigation function

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'attendance', label: 'Attendance', icon: '📅' },
    { id: 'marks', label: 'Marks', icon: '📄' }, // Clicking this should go to /marks
    { id: 'transcript', label: 'Transcript', icon: '📜' },
    { id: 'timetable', label: 'Timetable', icon: '📆' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">P</div>
          <span className="logo-text">Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navigationItems.map(item => (
          <a 
            key={item.id}
            href="#" 
            className={`sidebar-nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${item.id}`); // Navigate to the correct page
            }}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-text">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* User Section */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-content">
          <div className="user-avatar-small">
            <span>JD</span>
          </div>
          <div className="user-info">
            <span className="user-name-small">John Doe</span>
            <a href="#" className="user-profile-link">View Profile</a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
