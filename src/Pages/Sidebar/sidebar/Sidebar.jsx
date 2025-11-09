// Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';

const Sidebar = ({ isOpen, activePage, onNavClick }) => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user'));
  
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/main/dashboard' },
    { id: 'attendance', label: 'Attendance', icon: '📅', path: '/main/attendance' },
    { id: 'marks', label: 'Marks', icon: '📄', path: '/main/marks' },
    { id: 'transcript', label: 'Transcript', icon: '📜', path: '/main/transcript' },
    { id: 'timetable', label: 'Timetable', icon: '📆', path: '/main/timetable' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: null }
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
          <button
            type="button"
            key={item.id}
            className={`sidebar-nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => {
              if (item.path) {
                navigate(item.path);
                onNavClick(item.id);
              }
            }}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-text">{item.label}</span>
          </button>
        ))}
      </nav>
      
      {/* User Section */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-content">
          <div className="user-avatar-small">
            <span>GU</span>
          </div>
          <div className="user-info">
            <span className="user-name-small">{user?.name}</span>
            <button type="button" className="user-profile-link">View Profile</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;