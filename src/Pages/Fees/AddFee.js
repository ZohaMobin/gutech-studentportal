import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddFee.css'; // Assuming CSS is shared

function AddFee() {
  const [newFee, setNewFee] = useState({
    semester: "",
    dueDate: "",
    status: "",
    receipt: ""
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFee({ ...newFee, [name]: value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFee({ ...newFee, receipt: file.name });
    }
  };

  const handleAddFee = (e) => {
    e.preventDefault();
    if (Object.values(newFee).some((field) => field === "")) {
      alert("All fields must be filled.");
      return;
    }
    alert("Fee record added successfully!");
    navigate("/"); // Navigate back to the main Fees page
  };

  return (
    <div className="page">
      <h1 className="heading">Add New Fee Record</h1>
      <form className="add-fee-form" onSubmit={handleAddFee}>
        <label>
          Semester:
          <input
            type="text"
            name="semester"
            value={newFee.semester}
            onChange={handleInputChange}
            placeholder="Enter Semester"
          />
        </label>
        <label>
          Due Date:
          <input
            type="date"
            name="dueDate"
            value={newFee.dueDate}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Status:
          <select
            name="status"
            value={newFee.status}
            onChange={handleInputChange}
          >
            <option value="">--Select Status--</option>
            <option value="paid">Paid</option>
            <option value="not paid">Not Paid</option>
          </select>
        </label>
        <label>
          Receipt:
          <input
            type="file"
            name="receipt"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </label>
        <div className="buttons1">
          <button
            type="button"
            className="add-button1"
            onClick={() => navigate("/fees")}
          >
            Cancel
          </button>
          <button type="submit" className="download-button1">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default AddFee;