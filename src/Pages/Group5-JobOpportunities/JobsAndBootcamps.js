import React from "react";
import { useNavigate } from "react-router-dom";
import "./JobsAndBootcamps.css";

const JobsAndBootcamps = () => {
  const navigate = useNavigate();

  const bootcamps = [
    {
      title: "Technical Support Specialist",
      type: "Morning",
      salary: "0",
      startDate: "2023-06-01",
      endDate: "2023-06-30",
    },
    {
      title: "Full Stack Developer Bootcamp",
      type: "Evening",
      salary: "0",
      startDate: "2023-07-01",
      endDate: "2023-07-31",
    },
  ];

  const jobs = [
    {
      title: "Junior Graphic Designer",
      type: "PART-TIME",
      company: "Google Inc.",
      salary: "15,000",
      location: "Karachi, Pakistan",
      linkedIn: "https://www.linkedin.com/company/google",
    },
    {
      title: "Software Engineer",
      type: "FULL-TIME",
      company: "Microsoft",
      salary: "25,000",
      location: "Lahore, Pakistan",
      linkedIn: "https://www.linkedin.com/company/google",
    },
    {
      title: "Marketing Manager",
      type: "PART-TIME",
      company: "Amazon",
      salary: "30,000",
      location: "Islamabad, Pakistan",
      linkedIn: "https://www.linkedin.com/company/google",
    },
  ];

  const handleBootcampApply = (bootcamp) => {
    navigate("/apply", { state: { bootcamp } }); // Pass bootcamp data as state
  };

  const handleJobapply = (linkedInUrl) => {
    window.open(linkedInUrl, "_blank");
  };
  

  return (
    <div className="jobs-and-bootcamps">
      <h1>Job Opportunities & Bootcamps</h1>

      <section className="bootcamps-section">
        <h2>Bootcamps</h2>
        <div className="bootcamp-cards">
          {bootcamps.map((bootcamp, index) => (
            <div key={index} className="card">
              <h3>{bootcamp.title}</h3>
              <p className="type">{bootcamp.type}</p>
              <p className="salary">Fee: PKR {bootcamp.salary}</p>
              <p className="startDate">Start Date: {bootcamp.startDate}</p>
              <p className="endDate">End Date: {bootcamp.endDate}</p>
              <button className="apply-button" onClick={() => handleBootcampApply(bootcamp)}>
                Apply
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="jobs-section">
        <h2>Job Opportunities</h2>
        <div className="job-cards">
          {jobs.map((job, index) => (
            <div key={index} className="card">
              <h3>{job.title}</h3>
              <p className="type">{job.type}</p>
              <p className="company">{job.company}</p>
              <p className="salary">Salary: PKR {job.salary}</p>
              <p className="location">{job.location}</p>
              <button className="apply-button" onClick={() => handleJobapply(job.linkedIn)}>Apply</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
 export default JobsAndBootcamps;

