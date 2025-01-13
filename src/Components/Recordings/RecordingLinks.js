import React, { useState } from "react"; 
import { useLocation } from "react-router-dom";
import "./RecordingLinks.css";

const RecordingLinksPage = () => {
  const location = useLocation();
  const { recording } = location.state;

  const [searchTerm, setSearchTerm] = useState("");

  // Filter links based on search term (matches date or topic)
  const filteredLinks = recording.links.filter((link) => {
    const searchTermLower = searchTerm.toLowerCase();
    const linkDate = link.date ? link.date.toLowerCase() : "";
    const linkTopic = link.topic ? link.topic.toLowerCase() : ""; // Check for topic if it exists

    return (
      linkDate.includes(searchTermLower) || 
      linkTopic.includes(searchTermLower) // Match either date or topic
    );
  });

  const handleSearch = () => {
    // Function to handle search button click (already filters based on state)
    console.log("Search button clicked with term:", searchTerm);
  };

  return (
    <div className="recording-links-container">
      <div className="header">
        <h1>{recording.title}</h1>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search by date or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
      </div>
      <p>{recording.description}</p>
      <div className="recordings-list">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link, index) => (
            <div className="recording-link-card" key={index}>
              <p>
                <strong>Date:</strong> {link.date || "Unknown"}
              </p>
              <p>
                <strong>Topic:</strong> {link.topic || "No Topic"} {/* Render topic */}
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
          ))
        ) : (
          <p className="no-results">No recordings found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default RecordingLinksPage;
