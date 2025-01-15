import React, { useState } from "react";

const ExamSchedule = () => {
  const [selectedMonth, setSelectedMonth] = useState("September");

  const schedulesByMonth = {
    September: [
      {
        day: "Monday",
        slots: [
          { time: "09:00 AM - 11:00 AM", subject: "PSPF (Twaha Minai)", date: "4th September" },
          { time: "11:30 AM - 1:30 PM", subject: "PSPF (Zoha mobin)", date: "4th September" },
          { time: "", subject: "", date: "" },
        ],
      },
      {
        day: "Tuesday",
        slots: [
          { time: "09:00 AM - 11:00 AM", subject: "English (Dr. Samra Javed & Mr. Ali Dossa)", date: "5th September" },
          { time: "11:30 AM - 1:30 PM", subject: "", date: "" },
    
          { time: "", subject: "", date: "" },
        ],
      },
      {
        day: "Wednesday",
        slots: [
          { time: "09:00 AM - 11:00 AM", subject: "Web Tech (Dr Khubaib)", date: "6th September" },
          { time: "01:45 PM - 3:00 PM", subject: "Web Lab (Miss Zoha)", date: "5th September" },
          { time: "", subject: "", date: "" },
          { time: "", subject: "", date: "" },
        ],
      },
      {
        day: "Thursday",
        slots: [
          { time: "09:00 AM - 11:00 AM", subject: "Discrete Structure", date: "7th September" },
          { time: "01:45 PM - 3:00 PM", subject: "Design Thinking (Dr. JG/Dr. RM)", date: "7th September" },
          { time: "", subject: "", date: "" },
        ],
      },
      {
        day: "Friday",
        slots: [
       
          { time: "", subject: "", date: "" },   
          { time: "", subject: "", date: "" },
          { time: "", subject: "", date: "" },
        ],
      },
    ],
  };

  const schedule = schedulesByMonth[selectedMonth] || [];

  return (
    <div className="exam-schedule">
      {/* Header Section */}
      <div className="header">
        <h1>Exam Schedule</h1>
        <h2>MIDS Exam</h2>
        <div className="month-display">
          <span>{selectedMonth}</span>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="schedule-table">
        <div className="time-row">
          <div className="day-cell">Days</div>
          <div className="time-cell">09:00 AM - 11:00 AM</div>
          <div className="time-cell">11:30 AM - 1:30 PM</div>
          <div className="time-cell">01:45 PM - 3:00 PM</div>
        </div>

        {schedule.map((day, index) => (
          <div className="day-row" key={index}>
            <div className="day-cell">{day.day}</div>
            {day.slots.map((slot, i) => (
              <div className={`slot-cell ${slot.subject ? "filled" : ""}`} key={i}>
                {slot.subject && (
                  <div>
                    <strong>{slot.subject}</strong>
                    <br />
                    <span>{slot.date}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamSchedule;
