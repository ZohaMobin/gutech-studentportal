import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../Components/AuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BusyLabel } from "../../Components/Loading/Loading";
import "./Signup.css";
import { formMessageOf } from "../../utils/apiMessage";
import { InlineAlert } from "../../Components/ErrorState/ErrorState";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Login form state
  const [loginForm, setLoginForm] = useState({
    rollNumber: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Handle login form input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
    setError(""); // Clear any previous errors when user makes changes
  };

  // Validate login form
  const validateLoginForm = () => {
    if (!loginForm.rollNumber || !loginForm.password) {
      setError("All fields are required");
      return false;
    }
    return true;
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    try {
      setIsSubmitting(true);
      setError("");

      const apiUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        rollNumber: loginForm.rollNumber,
        password: loginForm.password,
        portal: "student", // the server refuses other roles here; the check below covers an older server
      });

      // Check if the user is a student
      if (response.data.user.role !== "student") {
        setError("Access denied. This portal is for students only.");
        return;
      }

      const { user, token } = response.data;
      login(user, token); // 🔑 Save user and token in context + sessionStorage
      navigate("/main/dashboard"); // 🚀 Redirect to dashboard
    } catch (error) {
      setError(formMessageOf(error, "Login failed. Please check your credentials."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Already signed in: no reason to show the login page again.
  if (isAuthenticated) return <Navigate to="/main/dashboard" replace />;

  return (
    <div className="auth-page">
      <div className="auth-container login-only">
        <aside className="brand-panel">
          <h2>Welcome back</h2>
          <p>Your timetable, attendance and marks in one place.</p>
          <ul>
            <li><i className="fas fa-calendar-alt" aria-hidden="true"></i>Timetable</li>
            <li><i className="fas fa-clipboard-check" aria-hidden="true"></i>Attendance</li>
            <li><i className="fas fa-chart-bar" aria-hidden="true"></i>Marks</li>
          </ul>
        </aside>

        <div className="form-container login-form">
          <form onSubmit={handleLogin}>
            <h1 className="form-title">Student sign in</h1>

            <InlineAlert message={error} />

            <label className="field-label" htmlFor="rollNumber">Roll number</label>
            <input id="rollNumber" type="text" name="rollNumber" placeholder="2522-4CS-001" autoComplete="username" value={loginForm.rollNumber} onChange={handleLoginChange} disabled={isSubmitting} required />

            <div className="field-label row">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={handleLoginChange}
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"} aria-hidden="true"></i>
              </button>
            </div>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              <BusyLabel busy={isSubmitting} busyText="Signing in…" idle="Sign In" />
            </button>

            <p className="help-text">No account? Contact your administrator for your credentials.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
