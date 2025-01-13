import React, { useState } from "react";

const ExamSchedule = () => {
  const [selectedMonth, setSelectedMonth ] = useState("September");

  const schedulesByMonth = {
    September: [
      {
        day: "Monday",
        slots: [
          { subject: "PSPF (Twaha Minai)", date: "4th September",  },
          { subject: "PSPF (Twaha Minai)", date: "4th September",  },
          { subject: "", date: "", },
          { subject: "", date: "",  },
        ],
      },
      {
        day: "Tuesday",
        slots: [
          { subject: "", date: "", },
          { subject: "", date: "", },
          { subject: "Web Lab (Miss Zoha)", date: "5th September", },
          { subject: "", date: "", time: "" },
        ],
      },
      {
        day: "Wednesday",
        slots: [
          { subject: "", date: "",  },
          { subject: "", date: "",  },
          { subject: "Web Tech (Dr Khubaib)", date: "6th September",},
          { subject: "", date: "", time: "" },
        ],
      },
      {
        day: "Thursday",
        slots: [
          { subject: "", date: "",  },
          { subject: "", date: "",  },
          { subject: "Discrete Structre", date: "7th September",  },
          {
            subject: "Design Thinking (Dr. JG/Dr. RM)",
            date: "7th September",
          },
        ],
      },
      {
        day: "Friday",
        slots: [
          { subject: "English (Dr. Samra Javed & Mr. Ali Dossa)", date: "8th September",  },
          { subject: "", date: "", },
          { subject: "", date: "", },
          { subject: "", date: "",  },
        ],
      },
    ],
  };

  const schedule = schedulesByMonth[selectedMonth] || [];

  return (
    <div className="exam-schedule">

      <div className="header">
        <h1>Exam Schedule</h1>
        <h2>MIDS Exam</h2>
        <div className="month-display">
          <span>{selectedMonth}</span>
        </div>
      </div>

      <div className="schedule-table">

        <div className="time-row">
          <div className="time-cell">Days</div>
          <div className="time-cell">09:00 AM - 11:00 AM</div>
          <div className="time-cell">11:30 AM - 1:30 AM</div>
          <div className="time-cell">11:30 AM - 1:30 PM</div>
          <div className="time-cell">01:45 PM - 03:00 PM</div>
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
