import React, { useState, useEffect } from 'react';
import './Calendar.css';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const renderCalendar = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${year}`;
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    dayNames.forEach((day, index) => {
      days.push(
        <div className="day day-name" key={`day-name-${index}`}>
          {day}
        </div>
      );
    });

    for (let i = 0; i < firstDay; i++) {
      days.push(<div className="day empty" key={`empty-${i}`}></div>);
    }

    for (let i = 1; i <= lastDate; i++) {
      days.push(
        <div className="day" key={`day-${i}`}>
          {i}
        </div>
      );
    }

    return { monthYear, days };
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const { monthYear, days } = renderCalendar(currentDate);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-btn" onClick={() => navigateMonth(-1)}>
          &lt;
        </button>
        <span>{monthYear}</span>
        <button className="nav-btn" onClick={() => navigateMonth(1)}>
          &gt;
        </button>
      </div>
      <div className="calendar-grid">
        {days}
      </div>
    </div>
  );
}

export default Calendar;



