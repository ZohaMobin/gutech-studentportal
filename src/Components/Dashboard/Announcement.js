import { useEffect, useState } from "react";
import axios from "axios";
import "./Announcement.css";

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch announcements from API
  useEffect(() => {
    axios
      .get("https://student-portal-backend-sgik.onrender.com/announcements")
      .then((response) => {
        console.log("API Response:", response.data); // Debugging log
        if (Array.isArray(response.data)) {
          setAnnouncements(response.data);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        console.error("Error fetching announcements:", error);
        setError("Failed to load announcements.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Dummy data (default announcements)
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

  // Use API data if available, otherwise fallback to dummy data
  const displayAnnouncements = announcements.length > 0 ? announcements : dummyAnnouncements;

  return (
    <div className="announcement-card">
      <h2>Important Announcements</h2>
      {loading ? (
        <p>Loading announcements...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="boxes-container">
          {displayAnnouncements.map((announcement, index) => (
            <div key={index} className="announcement-box">
              <p>
                <strong>{announcement.title}:</strong> {announcement.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Announcement;
