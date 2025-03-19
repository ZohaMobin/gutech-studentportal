import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import Signup from "./Pages/LoginSignUp/Signup.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;