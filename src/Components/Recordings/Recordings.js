import React from "react";
import { useNavigate } from "react-router-dom";
import "./Recordings.css";

const recordingsData = [
  {
    title: "PSPF - Problem solving and fundamentals By Sir Twaha Minai",
    duration: "10:12:09",
    lessons: 10,
    description: "Coding like poetry should be short and concise.",
    links: [
      { date: "2025-01-10", url: "https://www.loom.com/share/example1" },
      { date: "2025-01-11", url: "https://www.loom.com/share/example2" },
    ],
  },
  {
    title: "Design Thinking By Sir Rauf",
    duration: "3:50:05",
    lessons: 6,
    description: "A process for solving problems by prioritizing the consumer's needs above all else.",
    links: [
      { date: "2025-01-09", url: "https://www.loom.com/share/example3" },
    ],
  },
  {
    title: "Web Technologies By Sir Khubaib",
    duration: "5:30:05",
    lessons: 8,
    description: "The means by which computers communicate with each other using markup languages and multimedia packages..",
    links: [
      { date: "2025-01-08", url: "https://www.loom.com/share/example4" },
      { date: "2025-01-12", url: "https://www.loom.com/share/example5" },
    ],
  },
  {
    title: "Functional English By Sir Ali Dossa",
    duration: "4:00:00",
    lessons: 2,
    description: "Usage of the English language required to perform a specific function like academic study or career progression..",
    links: [
      { date: "2025-01-07", url: "https://www.loom.com/share/example6" },
    ],
  },
  {
    title: "Web Tech Lab By Miss Zoha Mobin",
    duration: "2:50:00",
    lessons: 2,
    description: "Let's learn about colors, color contrast, and color styles.",
    links: [
      { date: "2025-01-06", url: "https://www.loom.com/share/example7" },
    ],
  },
  {
    title: "Discrete Structures By Sir Shahzad",
    duration: "2:50:00",
    lessons: 2,
    description: "Deals with the study of mathematical structures.",
    links: [
      { date: "2025-01-05", url: "https://www.loom.com/share/example8" },
      { date: "2025-01-13", url: "https://www.loom.com/share/example9" },
    ],
  },
  {
    title: "PSPF-Lab By Miss Zoha Mobin",
    duration: "3:00:00",
    lessons: 4,
    description: "Lab sessions focused on applying problem-solving techniques.",
    links: [
      { date: "2025-01-15", url: "https://www.loom.com/share/example10" },
      { date: "2025-01-16", url: "https://www.loom.com/share/example11" },
    ],
  },
];

const RecordingsPage = () => {
  const navigate = useNavigate();

  const handleWatchNow = (recording) => {
    navigate("/recording-links", { state: { recording } });
  };

  return (
    <div className="recordings-container">
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
              <button
                className="watch-now"
                onClick={() => handleWatchNow(recording)}
              >
                Watch Now
              </button>
            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordingsPage;
