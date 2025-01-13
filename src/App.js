import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecordingsPage from "./Components/Recordings/Recordings";
import RecordingLinksPage from "./Components/Recordings/RecordingLinks";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecordingsPage />} />
        <Route path="/recording-links" element={<RecordingLinksPage />} />
      </Routes>
    </Router>
  );
}

export default App;