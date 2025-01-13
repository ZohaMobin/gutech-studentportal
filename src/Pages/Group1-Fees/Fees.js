import React, { useState } from "react";
import './Fees.css';

function Fees(){
    const student = {
        name: "Muhammad Ibraheem",
        rollNo: "24g-BCS016",
        batch: "fall-2024",
        status: "paid",
        semester: "1st",
        dues: "0/="
    };

    const fees = [
        {
            Date: "11/01/2025",
            amount: "12345",
            statusfee: "paid",
            semesterfee: "1st",
            receipt: "Uploaded"
        },
        {
            Date: "05/07/2024",
            amount: "12000",
            statusfee: "paid",
            semesterfee: "2nd",
            receipt: "Uploaded"
        },
        {
            Date: "20/12/2023",
            amount: "15000",
            statusfee: "pending",
            semesterfee: "3rd",
            receipt: "Not Uploaded"
        }
    ];

    const {name, rollNo, batch, status, semester, dues} = student;

    const [fileName, setFileName] = useState('');

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
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
                        <h3>Amount</h3>
                        <h3>Status</h3>
                        <h3>Receipt</h3>
                    </div>
                    {fees.map((fee, index) => (
                    <div className="details-info" key={index}>
                        <p>{fee.Date}</p>
                        <p>{fee.semesterfee}</p>
                        <p>Rs. {fee.amount}</p>
                        <p>{fee.statusfee}</p>
                        <p>{fee.receipt}</p>
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
                {fileName && <p>File uploaded: {fileName}</p>}
            </div>
            </div>
        </div>
    )
}
export default Fees;