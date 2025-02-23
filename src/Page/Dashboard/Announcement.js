import { useState, useEffect } from "react";
import axios from "axios";
import "./Announcement.css";

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Fetch announcements from API
    axios.get("https://api.example.com/announcements") // Replace with actual API endpoint
      .then((response) => {
        setAnnouncements(response.data);
      })
      .catch((error) => {
        console.error("Error fetching announcements:", error);
        // Fallback to static data in case of error
        setAnnouncements([
          {
            title: "Notice",
            message: "Classes will be suspended on Friday, January 17, 2025, due to inclement weather. Please plan accordingly.",
          },
          {
            title: "Upcoming Event",
            message: "The Leap Innovation Workshop will be held on Monday, January 20, 2025. Attendance is highly encouraged.",
          },
        ]);
      });
  }, []);

  return (
    <div className="announcement-card">
      <h2>Important Announcements</h2>
      <div className="boxes-container">
        {announcements.map((announcement, index) => (
          <div key={index} className="announcement-box">
            <p>
              <strong>{announcement.title}:</strong> {announcement.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Announcement;
