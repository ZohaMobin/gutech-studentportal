import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up">
        <form>
          <h1 className="ss">Create Account</h1>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="GU-Tech E-mail" />
          <input type="password" placeholder="Roll-No" />
          <button type="button">Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in">
        <form>
          <h1 className="ss">Sign In</h1>
          <input type="email" placeholder="Email or Roll-No" />
          <input type="password" placeholder="Password" />
          <Link to="/forgot-password">Forget Your Password?</Link>
          <button type="button">Sign In</button>
        </form>
      </div>

      {/* Toggle Container */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of the site's features</p>
            <button className="hidden" onClick={() => setIsActive(false)}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend</h1>
            <p>Register with your personal details to use all of the site's features</p>
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
