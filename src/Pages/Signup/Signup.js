import React from 'react'
import './Signup.css'
const Signup = () => {
  return (
    <div>
      <div className="container">
        <div className="form-container sign-in">
          <form>
            <h1>Sign In</h1>
            <span>Enter User and Password</span>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Forgot Password</a>
            <button>Sign In</button>
          </form>
        </div>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-right">
            <h1>Hello, Youtube!</h1>
            <p>Login with your personal details to use all of site features</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup