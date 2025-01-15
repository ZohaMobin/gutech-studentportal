import React from 'react';
import './Announcement.css';

function Announcement() {
  return (
    <div>
  <h1 className='Title'>
        Hello Zeenat <img src='hi_emoji.png' alt="emoji" className="hello-image" />
      </h1>
      <p>Learn Something new today</p>
    <div className="announcement-card">
      <h2>Important Announcements</h2>
      <div className="boxes-container">
        <div className="announcement-box">
          <p><strong>Notice:</strong> Classes will be suspended on Friday, January 17, 2025, due to inclement weather. Please plan accordingly.</p>
        </div>
        <div className="announcement-box">
          <p><strong>Upcoming Event:</strong> The Leap Innovation Workshop will be held on Monday, January 20, 2025. Attendance is highly encouraged.</p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Announcement;


