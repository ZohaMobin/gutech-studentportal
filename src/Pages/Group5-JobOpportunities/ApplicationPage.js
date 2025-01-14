import React from "react";
import "./ApplicationPage.css";

const ApplicationForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Your application has been submitted successfully!");
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Scholarship Application Form</h1>
      <form onSubmit={handleSubmit}>

      <fieldset className="fieldset">
          <legend className="legend">Scholarship Basis</legend>
          <label>
            On what basis are you applying for the scholarship? <br />
            <select required className="input">
              <option value="">Select</option>
              <option value="hsc_marks">HSC Marks</option>
              <option value="entry_test_marks">Entry Test Marks</option>
              <option value="cgpa">CGPA</option>
              <option value="need_based">Need-Based</option>
            </select>
          </label>
        </fieldset>

        {/* Personal Details */}
        <fieldset className="fieldset">
          <legend className="legend">Personal Details</legend>
          <label>
            Name: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            CNIC Number: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Application Reference Number: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Degree Program: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Enrollment Number: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Date of Birth: <br />
            <input type="date" required className="input" />
          </label>
          <label>
            Domicile Number: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Gender: <br />
            <select required className="input">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label>
            Marital Status: <br />
            <select required className="input">
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </label>
          <label>
            Residential Address: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Email Address: <br />
            <input type="email" required className="input" />
          </label>
          <label>
            Mobile Number: <br />
            <input type="text" required className="input" />
          </label>
        </fieldset>

        {/* Parent Details */}
        <fieldset className="fieldset">
          <legend className="legend">Parent's Details</legend>
          <label>
            Parent's Name: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Parent's CNIC: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Relationship with Applicant: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Parent's Mobile Number: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Parent's Postal Address: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Parent's Occupation: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Nature of Employment: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Parent's Email: <br />
            <input type="email" required className="input" />
          </label>
          <label>
            Designation: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Company Name: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Office Address: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Office Telephone: <br />
            <input type="text" required className="input" />
          </label>
          <label>
            Parent's Income: <br />
            <input type="text" required className="input" />
          </label>
        </fieldset>

        {/* Spouse Details */}
        <fieldset className="fieldset">
          <legend className="legend">Spouse's Details (if applicable)</legend>
          <label>
            Spouse Name: <br />
            <input type="text" className="input" />
          </label>
          <label>
            Spouse CNIC: <br />
            <input type="text" className="input" />
          </label>
          <label>
            Spouse's Mobile Number: <br />
            <input type="text" className="input" />
          </label>
          <label>
            Spouse's Occupation: <br />
            <input type="text" className="input" />
          </label>
          <label>
            Spouse's Income: <br />
            <input type="text" className="input" />
          </label>
          <label>
            Spouse's Office Address: <br />
            <input type="text" className="input" />
          </label>
        </fieldset>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;

