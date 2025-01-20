import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false); // Toggle for new password
  const [showConfirmPass, setShowConfirmPass] = useState(false); // Toggle for confirm password
  const navigate = useNavigate();

  const handleEmailSubmit = () => {
    if (email.includes("@agu.edu.pk")) {
      setErrorMessage(" ");
      setStep(2);
    } else {
      setErrorMessage("ERROR ! Enter your agu email!");
    }
  };

  const handleCodeSubmit = () => {
    if (otp === "1234") {
      setErrorMessage("");
      setStep(3);
    } else {
      setErrorMessage("ERROR ! Incorrect code");
    }
  };

  const handlePasswordSubmit = () => {
    if (pass === confirm) {
      alert("Password reset successfully!");
      navigate("/");
    } else {
      setErrorMessage("ERROR ! Passwords do not match");
    }
  };

  return (
    <div className="forgot-password-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Sign In
      </button>

      {/* EMAIL */}
      {step === 1 && (
        <div className="step step-active">
          <h1>Forgot Password</h1>
          <p className="descriptionMail">Enter your registered email address to reset your password.</p>
          <input
            type="email"
            placeholder="GU-Tech E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="button" onClick={handleEmailSubmit}>
            Submit
          </button>
        </div>
      )}

      {/* OTP */}
      {step === 2 && (
        <div className="step step-active">
          <p>Enter the code sent to your email.</p>
          <input
            type="number"
            className="otp"
            placeholder="Enter Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="button" onClick={handleCodeSubmit}>
            Submit
          </button>
        </div>
      )}

      {/* PASSWORD */}
      {step === 3 && (
        <div className="step step-active">
          <p>Enter your new password.</p>
          <div className="password-container">
            <input
              type={showPass ? "text" : "password"}
              className="otp"
              placeholder="New Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <span
              className="eyess"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? (
                <i className="fas fa-eye-slash"></i>
              ) : (
                <i className="fas fa-eye"></i>
              )}
            </span>
          </div>
          <div className="password-container">
            <input
              type={showConfirmPass ? "text" : "password"}
              className="otp"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <span
              className="eyess"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
            >
              {showConfirmPass ? (
                <i className="fas fa-eye-slash"></i>
              ) : (
                <i className="fas fa-eye"></i>
              )}
            </span>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="button" onClick={handlePasswordSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
