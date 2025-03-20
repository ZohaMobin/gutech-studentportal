import React, { useState, useEffect } from 'react';
import './ClassSchedule.css';

const ClassSchedule = () => {
  // State to store schedule data (would be populated from API in production)
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data - this would be replaced with API call
  const dummyScheduleData = [
    {
      day: 'Monday',
      slots: [
        { time: '09:00 - 10:15 AM', subject: 'Problem Solving & Programming Fundamentals', teacher: 'Sir Twaha Minai', room: 'Room 201', classColor: 'yellow-cell' },
        { time: '10:25 - 11:40 AM', subject: 'Web Technologies', teacher: 'Dr. Khubaib Ahmed', room: 'Lab 3', classColor: 'blue-cell' },
        { time: '11:50 - 01:20 PM', subject: 'Discrete Structures', teacher: 'Dr. Shehzad', room: 'Room 105', classColor: 'purple-cell' },
        { time: '01:20 - 01:45 PM', subject: 'NAMAZ BREAK', teacher: '', room: 'Prayer Hall', classColor: 'green-cell' },
        { time: '01:45 - 03:00 PM', subject: 'Design Thinking', teacher: 'Dr. Rauf Malik & Dr. Javaid Ghani', room: 'Room 301', classColor: 'orange-cell' }
      ]
    },
    {
      day: 'Tuesday',
      slots: [
        { time: '09:00 - 10:15 AM', subject: '', teacher: '', room: '', classColor: '' },
        { time: '10:25 - 11:40 AM', subject: '', teacher: '', room: '', classColor: '' },
        { time: '11:50 - 01:20 PM', subject: '', teacher: '', room: '', classColor: '' },
        { time: '01:20 - 01:45 PM', subject: '', teacher: '', room: '', classColor: '' },
        { time: '01:45 - 03:00 PM', subject: '', teacher: '', room: '', classColor: '' }
      ]
    },
    {
      day: 'Wednesday',
      slots: [
        { time: '09:00 - 10:15 AM', subject: 'Problem Solving & Programming Fundamentals', teacher: 'Sir Twaha Minai', room: 'Room 201', classColor: 'yellow-cell' },
        { time: '10:25 - 11:40 AM', subject: 'Web Technologies', teacher: 'Dr. Khubaib Ahmed', room: 'Room 104', classColor: 'blue-cell' },
        { time: '11:50 - 01:20 PM', subject: 'Web Technologies Lab', teacher: 'Ms. Zoha Mobin', room: 'Lab 2', classColor: 'dark-blue-cell' },
        { time: '01:20 - 01:45 PM', subject: 'NAMAZ BREAK', teacher: '', room: 'Prayer Hall', classColor: 'green-cell' },
        { time: '01:45 - 03:00 PM', subject: 'Web Technologies Lab', teacher: 'Ms. Zoha Mobin', room: 'Lab 2', classColor: 'dark-blue-cell' }
      ]
    },
    {
      day: 'Thursday',
      slots: [
        { time: '09:00 - 10:15 AM', subject: 'Problem Solving & Programming Fundamentals Lab', teacher: 'Ms. Zoha Mobin', room: 'Lab 1', classColor: 'dark-yellow-cell' },
        { time: '10:25 - 11:40 AM', subject: 'Problem Solving & Programming Fundamentals Lab', teacher: 'Ms. Zoha Mobin', room: 'Lab 1', classColor: 'dark-yellow-cell' },
        { time: '11:50 - 01:20 PM', subject: 'Discrete Structures', teacher: 'Dr. Shehzad', room: 'Room 105', classColor: 'purple-cell' },
        { time: '01:20 - 01:45 PM', subject: 'NAMAZ BREAK', teacher: '', room: 'Prayer Hall', classColor: 'green-cell' },
        { time: '01:45 - 03:00 PM', subject: 'Design Thinking', teacher: 'Dr. Rauf Malik & Dr. Javaid Ghani', room: 'Room 301', classColor: 'orange-cell' }
      ]
    },
    {
      day: 'Friday',
      slots: [
        { time: '09:00 - 10:15 AM', subject: 'English', teacher: 'Dr. Samra Javed & Mr. Ali Dossa', room: 'Room 203', classColor: 'aqua-cell' },
        { time: '10:25 - 11:40 AM', subject: 'English', teacher: 'Dr. Samra Javed & Mr. Ali Dossa', room: 'Room 203', classColor: 'aqua-cell' },
        { time: '11:50 - 01:20 PM', subject: 'English', teacher: 'Dr. Samra Javed & Mr. Ali Dossa', room: 'Room 203', classColor: 'aqua-cell' },
        { time: '01:20 - 01:45 PM', subject: '', teacher: '', room: '', classColor: '' },
        { time: '01:45 - 03:00 PM', subject: '', teacher: '', room: '', classColor: '' }
      ]
    }
  ];

  // Simulating API call
  useEffect(() => {
    // Function to fetch schedule data from API
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        
        // In a real application, this would be an API call:
        // const response = await fetch('api/schedule');
        // const data = await response.json();
        
        // For now, use our dummy data and simulate network delay
        setTimeout(() => {
          setScheduleData(dummyScheduleData);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load schedule data');
        setLoading(false);
        console.error('Error fetching schedule:', err);
      }
    };

    fetchScheduleData();
  }, []);

  // Time slots for header (could also come from API)
  const timeSlots = [
    '09:00 - 10:15 AM',
    '10:25 - 11:40 AM',
    '11:50 - 01:20 PM',
    '01:20 - 01:45 PM',
    '01:45 - 03:00 PM'
  ];

  // Loading state
  if (loading) {
    return (
       <div className="loading-container">Loading Schedule...</div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="schedule-container error-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-container">
      <h1 className="heading">CLASS SCHEDULE (BSCS SEM 01)</h1>
      <div className="table-responsive">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="time-col"></th>
              {timeSlots.map((time, index) => (
                <th key={index}>{time}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((day, index) => (
              <tr key={index}>
                <td className="days">{day.day}</td>
                {day.slots.map((slot, idx) => (
                  <td key={idx} className={`schedule-cell ${slot.classColor}`}>
                    {slot.subject && (
                      <>
                        <div className="subject">{slot.subject}</div>
                        {slot.teacher && slot.subject !== 'NAMAZ BREAK' && (
                          <div className="teacher">{slot.teacher}</div>
                        )}
                        {slot.room && (
                          <div className="room">
                            <span className="room-label">
                              {slot.room}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassSchedule;