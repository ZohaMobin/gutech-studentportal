import Loading from '../../Components/Loading/Loading';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showToast, TOAST_TYPES } from '../../Components/Toast/Toast';
import './ClassSchedule.css';
import { buildPeriods, periodIndexOf, to12Hour, to12HourRange } from '../../utils/timetablePeriods';
import { assignCardColors, cardStyle } from '../../utils/scheduleColors';

const ClassSchedule = ({ isDashboard }) => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [teacherNames, setTeacherNames] = useState({});
  const [sectionColors, setSectionColors] = useState({});
  const MAX_RETRIES = 3;

  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  // Function to fetch teacher names
  const fetchTeacherNames = async (teacherIds) => {
    try {
      const uniqueTeacherIds = [...new Set(teacherIds)];
      const teacherNamesMap = {};

      for (const teacherId of uniqueTeacherIds) {
        if (!teacherNamesMap[teacherId]) {
          const response = await axios.get(`${apiUrl}/api/teachers/${teacherId}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
          });
          
          if (response.data && response.data.userId && response.data.userId.name) {
            teacherNamesMap[teacherId] = response.data.userId.name;
          } else {
            teacherNamesMap[teacherId] = 'Teacher TBA';
          }
        }
      }

      setTeacherNames(teacherNamesMap);
    } catch (err) {
      console.error('Error fetching teacher names:', err);
      // Don't throw error here, just log it and continue with default names
    }
  };

  // Get course color for a schedule
  const getSectionColor = (schedule) => {
    if (!schedule || !schedule.courseId) return '#f8f9fa';
    
    // Get the course ID or code from the schedule
    let courseIdentifier = '';
    
    if (typeof schedule.courseId === 'object') {
      // Prioritize course code (ICT101) over internal ID when available for more visible colors
      courseIdentifier = schedule.courseId.code || schedule.courseId._id || '';
    } else if (typeof schedule.courseId === 'string') {
      courseIdentifier = schedule.courseId;
    }
    
    if (courseIdentifier && sectionColors[courseIdentifier]) return sectionColors[courseIdentifier];

    return '#f8f9f9'; // Default color if no identifier found
  };

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = JSON.parse(sessionStorage.getItem('user'));
      if (!userData || !userData.studentId) {
        throw new Error('Student ID not found');
      }
      
      const response = await axios.get(`${apiUrl}/api/section-schedules/student/${userData.studentId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      
      if (!response.data) {
        throw new Error('Invalid response data structure');
      }
      
      // One colour per course, handed out in order so no two courses on the timetable share one.
      const courseKeys = [];
      Object.values(response.data).forEach(daySchedules => {
        daySchedules.forEach(schedule => {
          if (typeof schedule.courseId === 'object') courseKeys.push(schedule.courseId?.code || schedule.courseId?._id);
          else if (typeof schedule.courseId === 'string') courseKeys.push(schedule.courseId);
        });
      });
      const newSectionColors = assignCardColors(courseKeys);
      setSectionColors(newSectionColors);
      
      setSchedule(response.data);
      setLoading(false);
      setError(null);
      setRetryCount(0);

      // Extract teacher names from schedule data (if populated) or fetch separately
      const teacherNamesMap = {};
      const teacherIdsToFetch = [];
      
      Object.values(response.data).flat().forEach(schedule => {
        if (schedule && schedule.teacherId && schedule.teacherId._id) {
          const teacherId = schedule.teacherId._id;
          // If teacher name is already populated, use it
          if (schedule.teacherId.userId && schedule.teacherId.userId.name) {
            teacherNamesMap[teacherId] = schedule.teacherId.userId.name;
          } else {
            // Otherwise, add to list to fetch separately
            if (!teacherIdsToFetch.includes(teacherId)) {
              teacherIdsToFetch.push(teacherId);
            }
          }
        }
      });

      // Set teacher names from populated data
      if (Object.keys(teacherNamesMap).length > 0) {
        setTeacherNames(prev => ({ ...prev, ...teacherNamesMap }));
      }

      // Fetch remaining teacher names if needed
      if (teacherIdsToFetch.length > 0) {
        await fetchTeacherNames(teacherIdsToFetch);
      }
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setError(err.message || 'Failed to fetch schedule');
      setLoading(false);
      
      if (retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          setLoading(true);
          fetchSchedule();
        }, delay);
      } else {
        showToast('Failed to load schedule after multiple attempts. Please try again later.', TOAST_TYPES.ERROR);
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadSchedule = async () => {
      if (mounted) {
        await fetchSchedule();
      }
    };

    loadSchedule();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // The rows are this student's real class windows (8:30 - 9:55, ...), not whole hours.
  const formatTime = to12Hour;

  // The row's time: the full range, shorter on the dashboard where space is tight.
  const getTimeLabel = (timeSlot) => (isDashboard ? to12HourRange(timeSlot.start, timeSlot.end) : `${formatTime(timeSlot.start)} - ${formatTime(timeSlot.end)}`);

  if (loading) {
    return (
      <div style={{ padding: '1.25rem' }}><Loading variant="table" rows={6} label={`Loading your schedule${retryCount > 0 ? ` (attempt ${retryCount + 1} of ${MAX_RETRIES + 1})` : ''}`} /></div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={() => {
              setRetryCount(0);
              setLoading(true);
              fetchSchedule();
            }}
            disabled={retryCount >= MAX_RETRIES}
            className={retryCount >= MAX_RETRIES ? 'disabled' : ''}
          >
            {retryCount >= MAX_RETRIES ? 'Max retries reached' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  // Check if there are any schedules
  const hasSchedules = Object.values(schedule).some(daySchedules => daySchedules && daySchedules.length > 0);
  if (!hasSchedules) {
    return (
      <div className="no-schedule-message">
        <p>No classes scheduled yet</p>
        <p className="subtext">Your class schedule will appear here once it's available</p>
      </div>
    );
  }

  const periods = buildPeriods(days.flatMap(day => schedule[day] || []));

  return (
    <div className="schedule-container">
      {/* Only show the heading when not in dashboard mode */}
      {!isDashboard && <h2 className="heading">My Class Schedule</h2>}
      <div className="table-responsive">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Time</th>
              {days.map(day => (
                <th key={day}>{isDashboard && window.innerWidth < 576 ? day.substring(0, 3) : day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((timeSlot, rowIndex) => (
              <tr key={`${timeSlot.start}-${timeSlot.end}`}>
                <td className="time-cell">
                  <div className="time-slot-label">{getTimeLabel(timeSlot)}</div>
                </td>
                {days.map(day => {
                  // Every class of this day that belongs in this row, each showing its own times.
                  const classes = (schedule[day] || []).filter(item => periodIndexOf(item, periods) === rowIndex);

                  return (
                    <td key={`${day}-${timeSlot.start}`} className="schedule-cell">
                      {classes.map(item => (
                        <div
                          key={item._id}
                          className="class-item"
                          style={cardStyle(getSectionColor(item))}
                        >
                          <div className="course-info">
                            <span className="course-code">{item.courseId?.code}</span>
                            <span className="course-name">{item.courseId?.name}</span>
                          </div>
                          <div className="schedule-details">
                            <div className="teacher-info">
                              {item.teacherId && item.teacherId._id
                                ? (item.teacherId.userId?.name || teacherNames[item.teacherId._id] || 'Loading...')
                                : 'Teacher TBA'}
                            </div>
                            <div className="room-info">
                              Room: {item.timeSlot.room}
                            </div>
                            <div className="section-info">
                              Section {item.sectionId?.section}
                            </div>
                            {(!isDashboard || item.timeSlot.startTime !== timeSlot.start || item.timeSlot.endTime !== timeSlot.end) && (
                              <div className="time-info">
                                {formatTime(item.timeSlot.startTime)} - {formatTime(item.timeSlot.endTime)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassSchedule;