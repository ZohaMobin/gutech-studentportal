import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Recordings.css";

const RecordingsPage = () => {
  const [recordings, setRecordings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await fetch("https://student-portal-backend-sgik.onrender.com/api/recordings/student", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add Authorization token if needed
            // "Authorization": Bearer ${localStorage.getItem("token")}
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recordings");
        }

        const data = await response.json();
        setRecordings(data);
      } catch (error) {
        console.error("Error fetching recordings:", error);
      }
    };

    fetchRecordings();
  }, []);

  return (
    <div className="recordings-container">
      <h2>Class Recordings</h2>
      {recordings.length > 0 ? (
        recordings.map((recording, index) => (
          <div key={index} className="recording-card">
            <h3>{recording.title}</h3>
            <p><strong>Instructor:</strong> {recording.instructor}</p>
            <p><strong>Description:</strong> {recording.description}</p>
            <ul>
              {recording.links.map((link, i) => (
                <li key={i}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">{link.topic} - {link.date}</a>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Loading recordings...</p>
      )}
    </div>
  );
};

export default RecordingsPage;
