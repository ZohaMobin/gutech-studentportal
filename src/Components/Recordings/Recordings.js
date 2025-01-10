// Components/Recordings/Recordings.js
import React from "react";
import "./Recordings.css";

const recordingsData = [
  {
    title: "PSPF - Problem solving and fundamentals",
    duration: "10:12:09",
    lessons: 10,
    description: "Let's learn about colors, color contrast, and color styles.",
  },
  {
    title: "Design Thinking",
    duration: "3:50:05",
    lessons: 6,
    description: "A project to unravel and learn the fundamentals of design.",
  },
  {
    title: "Web Technologies",
    duration: "5:30:05",
    lessons: 8,
    description: "Making visually looking good UI screens from problem statement briefs.",
  },
  {
    title: "English",
    duration: "4:00:00",
    lessons: 2,
    description: "Understanding various visual design terms.",
  },
  {
    title: "Web Tech Lab",
    duration: "2:50:00",
    lessons: 2,
    description: "Let's learn about colors, color contrast, and color styles.",
  },
];

const RecordingsPage = () => {
  return (
    <div className="recordings-container">
       <nav className="navbar">
      <div className="navbar-center">
      <div className="navbar-search-container">
  <input type="text" className="navbar-search-input" placeholder="Search" />
  <span className="navbar-search-icon">🔍 </span>
  <span className="navbar-search-icon">⌘</span>
  <span className="navbar-search-icon">F</span>
</div>

      </div>
      <div className="navbar-right">
        <button className="navbar-notification"></button>
        <div className="navbar-profile">
          <img src="/path/to/profile.png" alt="User Profile" className="navbar-profile-img" />
          <span className="navbar-profile-name">Mudassir</span>
          <span className="navbar-profile-name">⌵</span>
        </div>
      </div>
    </nav> 
        
      <h1>Class Recordings</h1>
      <p>Access and review past class sessions</p>
      <div className="recordings-grid">
        {recordingsData.map((recording, index) => (
          <div className="recording-card" key={index}>
            <h3>{recording.title}</h3>
            <p>{recording.description}</p>
            <p>
              <strong>{recording.duration}</strong> | {recording.lessons} Lessons
            </p>
            <div className="recording-actions">
              <button className="watch-now">Watch Now</button>
              <button className="download">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordingsPage;
