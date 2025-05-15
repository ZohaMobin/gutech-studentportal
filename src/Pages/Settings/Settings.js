import React from 'react';
import './Settings.css';

const Settings = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>
      
      <div className="settings-content">
        <div className="settings-section">
          <h2>Account Settings</h2>
          <div className="settings-card">
            <div className="settings-item">
              <label>Name</label>
              <p>{user?.name || 'N/A'}</p>
            </div>
            <div className="settings-item">
              <label>Roll Number</label>
              <p>{user?.studentId || 'N/A'}</p>
            </div>
            <div className="settings-item">
              <label>Email</label>
              <p>{user?.email || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Preferences</h2>
          <div className="settings-card">
            <div className="settings-item">
              <label>Notifications</label>
              <div className="toggle-switch">
                <input type="checkbox" id="notifications" />
                <label htmlFor="notifications"></label>
              </div>
            </div>
            <div className="settings-item">
              <label>Email Notifications</label>
              <div className="toggle-switch">
                <input type="checkbox" id="email-notifications" />
                <label htmlFor="email-notifications"></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 