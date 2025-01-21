import React, { useState } from "react";

const ExamSchedule = () => {
  const [selectedMonth, setSelectedMonth] = useState("September");

  const schedulesByMonth = {
    September: [
      {
        day: "Monday",
        date: "4th September",
        slots: [
          { time: "09:00 AM - 11:00 AM", subject: "PSPF (Twaha Minai)" },
          { time: "11:30 AM - 1:30 PM", subject: "PSPF (Zoha mobin)" },
          { time: "", subject: "" },
        ],
      },
      {
        day: "Tuesday",
        date: "5th September",
        slots: [
          { time: "09:00 AM - 11:00 AM", subject: "English (Dr. Samra Javed & Mr. Ali Dossa)" },
          { time: "11:30 AM - 1:30 PM", subject: "" },
          { time: "", subject: "" },
        ],
      },
      {
        day: "Wednesday",
        date: "6th September",
        slots: [
          { time: "09:00 AM - 11:00 AM", subject: "Web Tech (Dr Khubaib)" },
          { time: "11:30 AM - 1:30 PM", subject: "" },
          { time: "01:45 PM - 3:00 PM", subject: "Web Lab (Miss Zoha)" },
        ],
      },
      {
        day: "Thursday",
        date: "7th September",
        slots: [
          { time: "09:00 AM - 11:00 AM", subject: "Discrete Structure" },
          { time: "11:30 AM - 1:30 PM", subject: "" },
          { time: "01:45 PM - 3:00 PM", subject: "Design Thinking (Dr. JG/Dr. RM)" },
        ],
      },
      {
        day: "Friday",
        date: "8th September",
        slots: [
          { time: "", subject: "" },
          { time: "", subject: "" },
          { time: "", subject: "" },
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
        <div className="centered-title">Midterm Exam</div>
      </div>

      {/* Schedule Table */}
      <div className="schedule-table">
        {schedule.map((day, index) => (
          <div className="day-row" key={index}>
            <div className="day-cell">
              {day.day}
              <br />
              <span className="day-date">{day.date}</span>
            </div>
            {day.slots.map((slot, i) => (
              <div className={`slot-cell ${slot.subject ? "filled" : ""}`} key={i}>
                {slot.subject && (
                  <div>
                    <strong>{slot.subject}</strong>
                    <br />
                    <span>{slot.time}</span>
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
