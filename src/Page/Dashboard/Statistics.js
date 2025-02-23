import { useEffect, useState } from "react";
import axios from "axios";
import "./Announcement.css";

function Announcement() {
  const dummyAnnouncements = [
    {
      title: "Notice",
      message: "Classes will be suspended on Friday, January 17, 2025, due to inclement weather. Please plan accordingly.",
    },
    {
      title: "Upcoming Event",
      message: "The Leap Innovation Workshop will be held on Monday, January 20, 2025. Attendance is highly encouraged.",
    },
  ];

  const [announcements, setAnnouncements] = useState(dummyAnnouncements);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts?_limit=2") // Dummy API
      .then(response => {
        const formattedData = response.data.map(post => ({
          title: `Announcement ${post.id}`,
          message: post.title,
        }));
        setAnnouncements([...dummyAnnouncements, ...formattedData]); // Keep dummy data + API data
      })
      .catch(error => {
        console.error("Error fetching announcements:", error);
        setError("Failed to load additional announcements.");
      });
  }, []);

  return (
    <div className="announcement-card">
      <h2>Important Announcements</h2>
      {error && <p className="error-message">{error}</p>}
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
