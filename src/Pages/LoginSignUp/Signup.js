import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Components/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [isSignupActive, setIsSignupActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Signup form state
  const [signupForm, setSignupForm] = useState({
    rollNumber: '',
    password: '',
  });
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    identifier: '', // Can be email or roll number
    password: '',
  });
  
  const navigate = useNavigate();
  
  // Handle signup form input changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
    setError(''); // Clear any previous errors when user makes changes
  };

  // Handle login form input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
    setError(''); // Clear any previous errors when user makes changes
  };

  // Validate signup form
  const validateSignupForm = () => {
    if (!signupForm.rollNumber || !signupForm.password) {
      setError('All fields are required');
      return false;
    }
    
    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };
  
  // Validate login form
  const validateLoginForm = () => {
    if (!loginForm.identifier || !loginForm.password) {
      setError('All fields are required');
      return false;
    }
    return true;
  };

  // Handle signup submission
  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateSignupForm()) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const apiUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(`${apiUrl}/api/auth/student-signup`, {
        rollNumber: signupForm.rollNumber,
        password: signupForm.password,
      });
      
      
      // Reset form after successful registration
      setSignupForm({
        rollNumber: '',
        password: '',
      });
      
      // Switch to login tab
      setIsSignupActive(false);
      
      // Show success message
      alert('Registration successful! Please log in with your roll number and password.');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

 // Handle login submission
 const { login } = useAuth(); // ⬅️ make sure this is at the top

 const handleLogin = async (e) => {
   e.preventDefault();
 
   if (!validateLoginForm()) return;
 
   try {
     setIsSubmitting(true);
     setError('');
 
     const apiUrl = process.env.REACT_APP_BACKEND_URL;
     const response = await axios.post(`${apiUrl}/api/auth/login`, {
       rollNumber: loginForm.identifier,
       password: loginForm.password,
     });

         // Check if the user is a student
         if (response.data.user.role !== 'student') {
          setError('Access denied. This portal is for students only.');
          return;
        }
 
     const { user, token } = response.data;
     login(user, token); // 🔑 Save user and token in context + sessionStorage
     navigate("/main/dashboard");  // 🚀 Redirect to dashboard
 
   } catch (error) {
     setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
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
      <div className={`auth-container ${isSignupActive ? 'active' : ''}`}>
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignup}>
            <h1 className="form-title">Create Account</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <input
              type="text"
              name="rollNumber"
              placeholder="Roll Number"
              value={signupForm.rollNumber}
              onChange={handleSignupChange}
              disabled={isSubmitting}
            />
            
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={signupForm.password}
                onChange={handleSignupChange}
                disabled={isSubmitting}
              />
              <div
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </div>
            </div>
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Register'}
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <h1 className="form-title">Sign In</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <input
              type="text"
              name="identifier"
              placeholder="Email or Roll Number"
              value={loginForm.identifier}
              onChange={handleLoginChange}
              disabled={isSubmitting}
            />
            
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginChange}
                disabled={isSubmitting}
              />
              <div
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </div>
            </div>
            
            <Link to="/forgot-password" className="forgot-password">Forgot Your Password?</Link>
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Toggle Container */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome</h1>
              <p>Create an account to access all features and services</p>
              <p className="toggle-message">Already have an account?<br />Sign in to continue.</p>
              <button className="toggle-button" onClick={() => setIsSignupActive(false)}>
                Sign In
              </button>
            </div>
            
            <div className="toggle-panel toggle-right">
              <h1>Welcome Back</h1>
              <p>Access your account to use all features and services</p>
              <p className="toggle-message">Don't have an account?<br />Register to get started.</p>
              <button className="toggle-button" onClick={() => setIsSignupActive(true)}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;