import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Announcement.css';

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    axios.get('https://student-portal-backend-sgik.onrender.com/') // Replace with your actual API URL
      .then(response => {
        setAnnouncements(response.data || []);
      })
      .catch(error => {
        console.error('Error fetching announcements:', error);
        setError('Failed to load announcements.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="announcement-card">
      <h2>Important Announcements</h2>
      <div className="boxes-container">
        {loading ? (
          <p>Loading announcements...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <div key={index} className="announcement-box">
              <p><strong>{announcement.title}:</strong> {announcement.message}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "gray" }}>No announcements available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default Announcement;