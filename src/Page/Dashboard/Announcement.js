import React from 'react';
import './Announcement.css';

function Announcement() {
  return (
    <div className="announcement-card">
      <h1>Important Announcements</h1>
      <div className="boxes-container">
        <div className="announcement-box">
          <p><strong>Notice:</strong> Classes will be suspended on Friday, January 17, 2025, due to inclement weather. Please plan accordingly.</p>
        </div>
        <div className="announcement-box">
          <p><strong>Upcoming Event:</strong> The Leap Innovation Workshop will be held on Monday, January 20, 2025. Attendance is highly encouraged.</p>
        </div>
      </div>
    </div>
  );
}

export default Announcement;


