import React, { useState } from "react";
import './Fees.css';

function Fees() {
  const student = {
    name: "Muhammad Ibraheem",
    rollNo: "24g-BCS016",
    batch: "fall-2024",
    status: "paid",
    semester: "1st",
    dues: "0/="
  };

  // Initial fee records
  const initialFees = [
    {
      Date: "11/01/2025",
      amount: "12345",
      statusfee: "paid",
      semesterfee: "1st (Installment 1)",
      receipt: "Not Uploaded"
    },
    {
      Date: "05/07/2024",
      amount: "12000",
      statusfee: "paid",
      semesterfee: "2nd (Installment 2)",
      receipt: "Not Uploaded"
    },
    {
      Date: "20/12/2023",
      amount: "15000",
      statusfee: "pending",
      semesterfee: "3rd (Installment 1)",
      receipt: "Not Uploaded"
    }
  ];

  const { name, rollNo, batch, status, semester, dues } = student;

  const [fileName, setFileName] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(''); // Track selected semester for file upload
  const [fees, setFees] = useState(initialFees); // Update fees dynamically
  const [uploadedFiles, setUploadedFiles] = useState({
    "1st (Installment 1)": null,
    "1st (Installment 2)": null,
    "2nd (Installment 1)": null,
    "2nd (Installment 2)": null,
    "3rd (Installment 1)": null,
    "3rd (Installment 2)": null,
    "4th (Installment 1)": null,
    "4th (Installment 2)": null,
    "5th (Installment 1)": null,
    "5th (Installment 2)": null,
    "6th (Installment 1)": null,
    "6th (Installment 2)": null,
    "7th (Installment 1)": null,
    "7th (Installment 2)": null,
    "8th (Installment 1)": null,
    "8th (Installment 2)": null
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedSemester) {
      setFileName(file.name);
      setUploadedFiles(prev => ({
        ...prev,
        [selectedSemester]: file.name // Assign the file to the selected semester
      }));

      // Check if semester already exists in the fees array
      const semesterExists = fees.some(fee => fee.semesterfee === selectedSemester);
      if (!semesterExists) {
        // Add a new fee record for the selected semester
        const newFeeRecord = {
          Date: new Date().toLocaleDateString(), // Current date
          amount: "0", // Default value, could be updated later
          statusfee: "paid", // Change status to paid if file is uploaded
          semesterfee: selectedSemester,
          receipt: file.name // Name of the uploaded file
        };
        setFees([...fees, newFeeRecord]); // Add the new record to the fees array
      } else {
        // Update existing record with paid status if file is uploaded
        const updatedFees = fees.map(fee => 
          fee.semesterfee === selectedSemester
            ? { ...fee, statusfee: "paid", receipt: file.name }
            : fee
        );
        setFees(updatedFees);
      }
    } else {
      alert("Please select a semester before uploading a file.");
    }
  };

  return (
    <div className="page">
      <h1 className="heading">Fees Details</h1>

      <div className="upper">
        <div className="left">
          <h4>Name: <span>{name}</span></h4>
          <h4>Roll No: <span>{rollNo}</span></h4>
          <h4>Batch: <span>{batch}</span></h4>
        </div>
        <hr className="line"></hr>
        <div className="right">
          <h4>Current semester: <span>{semester}</span></h4>
          <h4>Due fees: <span>{dues}</span></h4>
          <h4>Status: <span>{status}</span></h4>
        </div>
      </div>

      <h2 className="heading2">Past Payments</h2>
      <div className="details">
        <div className="details-headings">
          <h3>Date</h3>
          <h3>Semester</h3>
          <h3>Status</h3>
          <h3>Receipt</h3>
        </div>
        {fees.map((fee, index) => (
          <div className="details-info" key={index}>
            <p>{fee.Date}</p>
            <p>{fee.semesterfee}</p>
            <p>{fee.statusfee}</p>
            <p>
              {uploadedFiles[fee.semesterfee] ? (
                <a href="#" className="file-link">
                  {uploadedFiles[fee.semesterfee]}
                </a>
              ) : (
                <span>{fee.receipt}</span> // Show "Not Uploaded" initially
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="buttons">
        <div className="download-container">
          <a href="/fees-info.pdf" download>
            <button className="download-button">Download Fee Voucher</button>
          </a>
        </div>

        <div className="upload-container">
          {/* Select Semester and Installment for File Upload */}
          <div className="semester-select">
            <label htmlFor="semester-select">Select Semester:</label>
            <select
              id="semester-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">--Select Semester--</option>
              <option value="1st (Installment 1)">1st (Installment 1)</option>
              <option value="1st (Installment 2)">1st (Installment 2)</option>
              <option value="2nd (Installment 1)">2nd (Installment 1)</option>
              <option value="2nd (Installment 2)">2nd (Installment 2)</option>
              <option value="3rd (Installment 1)">3rd (Installment 1)</option>
              <option value="3rd (Installment 2)">3rd (Installment 2)</option>
              <option value="4th (Installment 1)">4th (Installment 1)</option>
              <option value="4th (Installment 2)">4th (Installment 2)</option>
              <option value="5th (Installment 1)">5th (Installment 1)</option>
              <option value="5th (Installment 2)">5th (Installment 2)</option>
              <option value="6th (Installment 1)">6th (Installment 1)</option>
              <option value="6th (Installment 2)">6th (Installment 2)</option>
              <option value="7th (Installment 1)">7th (Installment 1)</option>
              <option value="7th (Installment 2)">7th (Installment 2)</option>
              <option value="8th (Installment 1)">8th (Installment 1)</option>
              <option value="8th (Installment 2)">8th (Installment 2)</option>
            </select>
          </div>

          {/* Upload File Button */}
          <label htmlFor="file-upload" className="upload-button">
            Upload Payment Proof
          </label>
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileUpload}
            aria-label="Upload proof of payment"
          />

          {/* Display uploaded file info */}
          {fileName && <p className="file-info">File uploaded: {fileName}</p>}
        </div>
      </div>

    </div>
  );
}

export default Fees;
