import React, { useState } from 'react';
import './Calendar.css';

function Calendar() {
  const [currentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    const calendarDays = [];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach((day, index) => {
      calendarDays.push(
        <div className="day day-name" key={`day-name-${index}`}>
          {day}
        </div>
      );
    });

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isCurrentDate =
        i === currentDate.getDate() &&
        currentMonth === currentDate.getMonth() &&
        currentYear === currentDate.getFullYear();

      calendarDays.push(
        <div
          key={`day-${i}`}
          className={`day ${isCurrentDate ? 'current' : ''}`}
        >
          {i}
        </div>
      );
    }

    return calendarDays;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-btn" onClick={handlePrevMonth}>
          &#10094;
        </button>
        <span>
          {new Date(currentYear, currentMonth).toLocaleString('default', {
            month: 'long',
          })}{' '}
          {currentYear}
        </span>
        <button className="nav-btn" onClick={handleNextMonth}>
          &#10095;
        </button>
      </div>
      <div className="calendar-grid">{renderCalendar()}</div>
    </div>
  );
}

export default Calendar;
