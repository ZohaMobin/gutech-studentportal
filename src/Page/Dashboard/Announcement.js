import React from 'react';
import './Announcement.css';

function Announcement() {
  return (
    <div className="announcement-card">
      <h1>Announcements</h1>
      <div className="boxes-container">
        <div className="announcement-box">
          <p>There will be off on Friday due to inclement weather.</p>
        </div>
        <div className="announcement-box">
          <p>Leap Innovation Workshop on Monday</p>
        </div>
      </div>
    </div>
  );
}

export default Announcement;

