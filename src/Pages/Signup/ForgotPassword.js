import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="forgot-password-container">
      {/* Back Button */}
      <button 
        className="back-button" 
        onClick={() => navigate('/')}
      >
        ← Back to Sign In
      </button>

      {/* Forgot Password Form */}
      <h1>Forgot Password</h1>
      <p>Enter your registered email address to reset your password.</p>
      <input type="email" placeholder="GU-Tech E-mail" />
      <button type="button">Submit</button>
    </div>
  );
};

export default ForgotPassword;
