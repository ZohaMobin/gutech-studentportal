import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up">
        <form>
          <h1 className="ss">Create Account</h1>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="GU-Tech E-mail" />
          <input type="value" placeholder="Roll-No" />
          <button type="button">Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in">
        <form>
          <h1 className="ss">Sign In</h1>
          <input type="email" placeholder="Email or Roll-No" />
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'} // Toggle between password and text
              placeholder="Password"
            />
            <div
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)} // Toggle visibility on click
            >
              {showPassword ? (
                <i className="fas fa-eye-slash"></i> // Icon for hiding password
              ) : (
                <i className="fas fa-eye"></i> // Icon for showing password
              )}
            </div>
          </div>
          <Link to="/forgot-password">Forgot Your Password?</Link>
          <button type="button">Sign In</button>
        </form>
      </div>

      {/* Toggle Container */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Friend</h1>
            <p>Register with your personal details to use all of the site's features</p>
            <p className="back">Already Have an Account?<br /> Sign In to Continue!</p>
            <button className="hidden" onClick={() => setIsActive(false)}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of the site's features</p>
            <p className="back">Don't Have an Account Yet?<br /> Let’s Get You Started!</p>
            <button className="hidden" onClick={() => setIsActive(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
