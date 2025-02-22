import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Announcement.css';

function Announcement() {
  const [announcements, setAnnouncements] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    axios.get('https://student-portal-backend-sgik.onrender.com/') 
      .then(response => {
        console.log("API Response:", response.data); // Debugging

        // Ensure data is an array before setting it in state
        if (Array.isArray(response.data)) {
          setAnnouncements(response.data);
        } else if (response.data && Array.isArray(response.data.announcements)) {
          setAnnouncements(response.data.announcements);
        } else {
          console.error("Unexpected API response format:", response.data);
          setAnnouncements([]); // Fallback to an empty array
        }
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
