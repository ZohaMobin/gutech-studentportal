import React from 'react';

const ApplicationForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Your application has been submitted successfully!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ color: 'orange', textAlign: 'center' }}>Scholarship Application Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Personal Details */}
        <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px' }}>
          <legend style={{ fontWeight: 'bold', color: 'orange' }}>Personal Details</legend>
          <label>
            Name: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            CNIC Number: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Application Reference Number: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Degree Program: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Enrollment Number: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Date of Birth: <br />
            <input type="date" required style={inputStyle} />
          </label>
          <label>
            Domicile Number: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Gender: <br />
            <select required style={inputStyle}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label>
            Marital Status: <br />
            <select required style={inputStyle}>
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </label>
          <label>
            Residential Address: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Email Address: <br />
            <input type="email" required style={inputStyle} />
          </label>
          <label>
            Mobile Number: <br />
            <input type="text" required style={inputStyle} />
          </label>
        </fieldset>

        {/* Parent Details */}
        <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px' }}>
          <legend style={{ fontWeight: 'bold', color: 'orange' }}>Parent's Details</legend>
          <label>
            Parent's Name: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Parent's CNIC: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Relationship with Applicant: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Parent's Mobile Number: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Parent's Postal Address: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Parent's Occupation: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Nature of Employment: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Parent's Email: <br />
            <input type="email" required style={inputStyle} />
          </label>
          <label>
            Designation: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Company Name: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Office Address: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Office Telephone: <br />
            <input type="text" required style={inputStyle} />
          </label>
          <label>
            Parent's Income: <br />
            <input type="text" required style={inputStyle} />
          </label>
        </fieldset>

        {/* Spouse Details */}
        <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px' }}>
          <legend style={{ fontWeight: 'bold', color: 'orange' }}>Spouse's Details (if applicable)</legend>
          <label>
            Spouse Name: <br />
            <input type="text" style={inputStyle} />
          </label>
          <label>
            Spouse CNIC: <br />
            <input type="text" style={inputStyle} />
          </label>
          <label>
            Spouse's Mobile Number: <br />
            <input type="text" style={inputStyle} />
          </label>
          <label>
            Spouse's Occupation: <br />
            <input type="text" style={inputStyle} />
          </label>
          <label>
            Spouse's Income: <br />
            <input type="text" style={inputStyle} />
          </label>
          <label>
            Spouse's Office Address: <br />
            <input type="text" style={inputStyle} />
          </label>
        </fieldset>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            display: 'block',
            backgroundColor: 'orange',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer',
            margin: '0 auto',
          }}
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

// Common input styles
const inputStyle = {
  display: 'block',
  width: '100%',
  margin: '10px 0',
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

export default ApplicationForm;
