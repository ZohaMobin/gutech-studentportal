import React from "react";
import { useNavigate } from "react-router-dom";
import './Fees.css';

function Fees() {
  const navigate = useNavigate();

  const student = {
    name: "Muhammad Ibraheem",
    rollNo: "24g-BCS016",
    batch: "fall-2024",
    status: "paid",
    semester: "1st",
    program: "BS CS"
  };

  const initialFees = [
    {
      name: "Ibraheem",
      program: "BS CS",
      batch: "Fall-24",
      semesterInstallment: "1st (Installment 1)",
      dueDate: "July 1, 2025",
      status: "paid",
      receipt: "Not Uploaded"
    },
    {
      name: "Ibraheem",
      program: "BS CS",
      batch: "Fall-24",
      semesterInstallment: "1st (Installment 1)",
      dueDate: "July 1, 2025",
      status: "paid",
      receipt: "Not Uploaded"
    }
  ];

  const { name, rollNo, batch, status, semester, program } = student;

  return (
    <div className="page">
      <h1 className="heading">Fees Details</h1>

      {/* Student Information Section */}
      <div className="upper">
        <div className="left">
          <h4>Name: <span>{name}</span></h4>
          <h4>Roll No: <span>{rollNo}</span></h4>
          <h4>Batch: <span>{batch}</span></h4>
        </div>
        <hr className="line"></hr>
        <div className="right">
          <h4>Program: <span>{program}</span></h4>
          <h4>Current semester: <span>{semester}</span></h4>
          <h4>Status: <span>{status}</span></h4>
        </div>
      </div>

      <h2 className="heading2">Past Payments</h2>
      <div className="details">
        <div className="details-headings">
          <h3>Name</h3>
          <h3>Program</h3>
          <h3>Batch</h3>
          <h3>Semester</h3>
          <h3>Date</h3>
          <h3>Status</h3>
          <h3>Receipt</h3>
        </div>
        {initialFees.map((fee, index) => (
          <div className="details-info" key={index}>
            <p>{fee.name}</p>
            <p>{fee.program}</p>
            <p>{fee.batch}</p>
            <p>{fee.semesterInstallment}</p>
            <p>{fee.dueDate}</p>
            <p>{fee.status}</p>
            <p>
              {fee.receipt ? (
                <a href={`/path/to/uploads/${fee.receipt}`} target="_blank" rel="noopener noreferrer">
                  View Receipt
                </a>
              ) : (
                "Not Uploaded"
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="buttons">
        {/* Button to navigate to Add Fee form */}
        <button
          className="add-button"
          onClick={() => navigate("/add-fee")}
        >
          Add New Fee Record
        </button>

        {/* Download Fee Voucher Feature */}
        <div className="download-container">
          <a href="/fees-info.pdf" download>
            <button className="download-button">Download Fee Voucher</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Fees;
