import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './EventCalendar.css'; // ✅ Fixed import path

const localizer = momentLocalizer(moment);

function StudentEventCalendar() {
  const [myEvents, setEvents] = useState([]);

  useEffect(() => {
    const initialEvents = [
      {
        title: 'Sample Event 1',
        start: new Date(2025, 0, 15, 10, 0),
        end: new Date(2025, 0, 15, 11, 0),
        color: '#991D20',
      },
      {
        title: 'Sample Event 2',
        start: new Date(2025, 0, 16, 12, 0),
        end: new Date(2025, 0, 16, 13, 0),
        color: '#007BFF',
      },
    ];
    setEvents(initialEvents);
  }, []);

  return (
    <div className="student-calendar-container">
      <h2 className="calendar-heading">Event Calendar</h2>

      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={['month', 'week', 'day']}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            color: 'white',
            borderRadius: '5px',
            padding: '5px',
          },
        })}
      />
    </div>
  );
}

export default StudentEventCalendar;
