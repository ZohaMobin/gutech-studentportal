import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BootcampForm.css";

const BootcampForm = () => {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const bootcamp = location.state?.bootcamp; 

  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    department: "",
  });

  if (!bootcamp) {
    return <h2>Error: Bootcamp data not found. Please go back and try again.</h2>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Your application for ${bootcamp.title} has been submitted!`);  //POST API//
    navigate("/");
  };

  return (
    <div className="bootcamp-form">
      <h1>Apply for {bootcamp.title}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="message">Why are you interested?</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Department Selection Dropdown */}
        <div>
          <label htmlFor="department">Select Your Department:</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">--Select Department--</option>
            <option value="BBA">BBA</option>
            <option value="BSCS">BSCS</option>
            <option value="BSIT">BSIT</option>
            <option value="BFA">Bs ACF</option>
            {/* Add more departments as needed */}
          </select>
        </div>

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default BootcampForm;

