import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to access passed data
import "./RecordingLinks.css";

const RecordingLinksPage = () => {
  const location = useLocation(); // Get location data
  const { recording } = location.state; // Extract the recording data

  return (
    <div className="recording-links-container">
      <h1>{recording.title}</h1>
      <p>{recording.description}</p>
      <div className="recordings-list">
        {recording.links.map((link, index) => (
          <div className="recording-link-card" key={index}>
            <p>
              <strong>Date:</strong> {link.date}
            </p>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="watch-recording-button"
            >
              Watch Recording
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordingLinksPage;
