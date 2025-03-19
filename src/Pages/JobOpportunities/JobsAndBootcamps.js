import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./JobsAndBootcamps.css";

const JobsAndBootcamps = () => {
  const navigate = useNavigate();

  const bootcamps = [
    {
      title: "Technical Support Specialist",
      type: "PART-TIME",
      salary: "$0",
      company: "Google Inc.",
      location: "Karachi, Pakistan",
    },
    {
      title: "Full Stack Developer Bootcamp",
      type: "FULL-TIME",
      salary: "$0",
      company: "Meta Inc.",
      location: "Lahore, Pakistan",
    },
  ];

  const jobs = [
    {
      title: "Junior Graphic Designer",
      company: "Google Inc.",
      salary: "$15,000 - $20,000",
      location: "Karachi, Pakistan",
    },
    {
      title: "Software Engineer",
      company: "Microsoft",
      salary: "$25,000 - $30,000",
      location: "Lahore, Pakistan",
    },
    {
      title: "Marketing Manager",
      company: "Amazon",
      salary: "$30,000 - $40,000",
      location: "Islamabad, Pakistan",
    },
  ];

  const handleBootcampApply = (bootcamp) => {
    navigate("/apply", { state: { bootcamp } }); // Pass bootcamp data as state
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
              <p className="salary">Fee: {bootcamp.salary}</p>
              <p className="company">{bootcamp.company}</p>
              <p className="location">{bootcamp.location}</p>
              <Link to="/bootcamp-form"> 
              <button
                className="apply-button"
                onClick={() => handleBootcampApply(bootcamp)}
                >
                Apply
              </button>
              </Link>
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
              <p className="company">{job.company}</p>
              <p className="salary">Salary: {job.salary}</p>
              <p className="location">{job.location}</p>
              <Link to="/bootcamp-form">
                <button className="apply-button">Apply</button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
 export default JobsAndBootcamps;

