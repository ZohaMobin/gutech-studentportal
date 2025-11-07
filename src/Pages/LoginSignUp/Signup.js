import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../Components/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

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
  const { login } = useAuth();

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
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page">
      <div className="auth-container login-only">
        {/* Login Form */}
        <div className="form-container login-form">
          <form onSubmit={handleLogin}>
            <h1 className="form-title">Student Login</h1>
            <p className="form-subtitle">Enter your credentials to access your account</p>

            {error && <div className="error-message">{error}</div>}

            <input type="text" name="rollNumber" placeholder="Roll Number" value={loginForm.rollNumber} onChange={handleLoginChange} disabled={isSubmitting} required />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginChange}
                disabled={isSubmitting}
                required
              />
              <div className="password-toggle" onClick={togglePasswordVisibility} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
              </div>
            </div>

            <Link to="/forgot-password" className="forgot-password">
              Forgot Your Password?
            </Link>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            <p className="help-text">Don't have an account? Contact your administrator to get your credentials.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
