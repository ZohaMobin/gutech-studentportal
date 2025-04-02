import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './Components/AuthContext';
import PrivateRoute from './Components/PrivateRoute';
import Signup from './Pages/LoginSignUp/Signup';
import MainLayout from './Pages/MainLayout/ MainLayout';
import GradingPage from './Pages/Grading/Grading';
import ClassSchedule from './Pages/ClassSchedule/ClassSchedule';
import Transcript from './Pages/Transcript/Transcript';
import Dashboard from './Pages/DashboardPage/dashboardPage';
import ComingSoonPage from './Pages/ComingSoon/comingsoon';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Signup />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              {/* Redirect from /main to /main/dashboard */}
              <Route path="/" element={<Navigate to="/main/dashboard" replace />} />
              
              <Route path="/main/*" element={<MainLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="marks" element={<GradingPage />} />
                <Route path="timetable" element={<ClassSchedule />} />
                <Route path="transcript" element={<Transcript />} />
                <Route path="fees" element={<ComingSoonPage />} />
                <Route path="attendance" element={<ComingSoonPage />} />
              </Route>
            </Route>

            {/* Catch-all route redirects to login */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;