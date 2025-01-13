import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./RecordingLinks.css";

const RecordingLinksPage = () => {
  const location = useLocation();
  const { recording } = location.state || {}; // Fallback if recording is undefined

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  // Filter links based on search term and selected date
  const filteredLinks = recording
    ? recording.links.filter((link) => {
        const searchTermLower = searchTerm.toLowerCase();
        const linkTopic = link.topic ? link.topic.toLowerCase() : "";

        const isDateMatch =
          selectedDate &&
          new Date(link.date).toDateString() === selectedDate.toDateString();

        return (
          (!selectedDate || isDateMatch) &&
          linkTopic.includes(searchTermLower)
        );
      })
    : [];

  const handleSearch = () => {
    console.log(
      "Search button clicked with term:",
      searchTerm,
      "and date:",
      selectedDate
    );
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedDate(null);
  };

  if (!recording) {
    return <p>No recording data found. Please navigate back to the recordings page.</p>;
  }

  return (
    <div className="recording-links-container">
      <div className="header">
        <h1>{recording.title}</h1>
        <div className="search-bar-container">
          {/* Single Search Box */}
          <div className="input-with-icon">
            <input
              type="text"
              placeholder="Search by topic or pick a date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText=""
              className="date-picker-inline"
              calendarClassName="calendar-dropdown"
            />
            <i
              className="calendar-icon"
              onClick={() => document.querySelector(".date-picker-inline").focus()}
            ></i>
          </div>

          {/* Search Button */}
          <button onClick={handleSearch} className="search-button">
            Search
          </button>

          {/* Clear Button */}
          <button onClick={handleClear} className="clear-button">
            Clear
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
                <strong>Topic:</strong> {link.topic || "No Topic"}
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
