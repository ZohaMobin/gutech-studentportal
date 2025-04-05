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
    { id: 'fees', label: 'Fees', icon: '💵', path: '/main/fees' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/main/settings' }
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
              navigate(item.path);
              onNavClick(item.id); // Call the handler from parent
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
            <span>GU</span>
          </div>
          <div className="user-info">
            <span className="user-name-small">{user?.name}</span>
            <a href="#" className="user-profile-link">View Profile</a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;