import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './ClassSchedule.css';

const ClassSchedule = () => {
  const [scheduleData, setScheduleData] = useState({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(sessionStorage.getItem('user'));
      
      if (!userData || !userData.studentId) {
        throw new Error('Student ID not found. Please log in again.');
      }

      const response = await axios.get(`${apiUrl}/api/section-schedules/student/${userData.studentId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });

      setScheduleData(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setError(error.message || 'Failed to load schedule data');
      toast.error(error.message || 'Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="schedule-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="schedule-container">
        <div className="error-container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchSchedule}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-container">
      <h1 className="heading">My Class Schedule</h1>
      <div className="table-responsive">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="time-col"></th>
              {days.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, i) => {
              const nextTime = timeSlots[i + 1];
              if (!nextTime) return null;

              return (
                <tr key={time}>
                  <td className="time-cell">{`${time} - ${nextTime}`}</td>
                  {days.map(day => {
                    const schedules = scheduleData[day].filter(schedule => 
                      schedule.timeSlot.startTime === time &&
                      schedule.timeSlot.endTime === nextTime
                    );

                    return (
                      <td key={day} className={schedules.length ? 'schedule-cell' : ''}>
                        {schedules.map((schedule, index) => (
                          <div key={index} className="class-item">
                            <div className="course-info">
                              <span className="course-code">{schedule.courseId.code}</span>
                              <span className="course-name">{schedule.courseId.name}</span>
                            </div>
                            <div className="schedule-details">
                              <div className="teacher-info">
                                {schedule.teacherId.firstName} {schedule.teacherId.lastName}
                              </div>
                              <div className="room-info">
                                {schedule.timeSlot.room}
                              </div>
                              <div className="section-info">
                                Section {schedule.sectionId.section}
                              </div>
                            </div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassSchedule;