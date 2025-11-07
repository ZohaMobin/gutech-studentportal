import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { showToast, TOAST_TYPES } from '../../Components/Toast/Toast';
import './ClassSchedule.css';

const ClassSchedule = ({ isDashboard }) => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [teacherNames, setTeacherNames] = useState({});
  const [sectionColors, setSectionColors] = useState({});
  const MAX_RETRIES = 3;

  const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

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

  // Generate a consistent color for each course
  const generateSectionColor = (courseId) => {
    // Predefined distinct vibrant pastel colors
    const distinctColors = [
      '#ffcccb',  // Light red
      '#c1e1c1',  // Mint green
      '#c4c3e0',  // Lavender
      '#ffdab9',  // Peach
      '#b0e0e6',  // Powder blue
      '#ffffcc',  // Light yellow
      '#d8bfd8',  // Thistle
      '#ffdead',  // Navajo white
      '#98fb98',  // Pale green
      '#afeeee',  // Pale turquoise
      '#ffc0cb',  // Pink
      '#dda0dd',  // Plum
      '#ffefd5',  // Papaya whip
      '#87ceeb',  // Sky blue
      '#f0e68c',  // Khaki
    ];
    
    // For empty or invalid IDs, return a default color
    if (!courseId || courseId.length < 3) {
      return '#f9f9f9';
    }
    
    // Use a hash of the course ID to select a color
    let hash = 0;
    for (let i = 0; i < courseId.length; i++) {
      hash = courseId.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Select a color from the predefined palette
    const colorIndex = Math.abs(hash) % distinctColors.length;
    return distinctColors[colorIndex];
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
    
    // If we have a course identifier, use or generate a color for it
    if (courseIdentifier) {
      // First try to use a predetermined color from sectionColors
      if (sectionColors[courseIdentifier]) {
        return sectionColors[courseIdentifier];
      }
      
      // If we don't have a color yet, generate one
      return generateSectionColor(courseIdentifier);
    }
    
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
      
      // Generate colors by course ID, not section ID
      const newSectionColors = {};
      Object.values(response.data).forEach(daySchedules => {
        daySchedules.forEach(schedule => {
          // Extract course ID or code correctly to ensure consistent colors
          let courseIdentifier = '';
          
          if (typeof schedule.courseId === 'object') {
            // Prioritize course code (ICT101) for more distinct colors
            courseIdentifier = schedule.courseId.code || schedule.courseId._id || '';
          } else if (typeof schedule.courseId === 'string') {
            courseIdentifier = schedule.courseId;
          }
          
          if (courseIdentifier && !newSectionColors[courseIdentifier]) {
            newSectionColors[courseIdentifier] = generateSectionColor(courseIdentifier);
          }
        });
      });
      
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
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Define time slots with start and end times
  const timeSlots = [
    { start: '08:00', end: '09:00', label: '8:00 AM - 9:00 AM' },
    { start: '09:00', end: '10:00', label: '9:00 AM - 10:00 AM' },
    { start: '10:00', end: '11:00', label: '10:00 AM - 11:00 AM' },
    { start: '11:00', end: '12:00', label: '11:00 AM - 12:00 PM' },
    { start: '12:00', end: '13:00', label: '12:00 PM - 1:00 PM' },
    { start: '13:00', end: '14:00', label: '1:00 PM - 2:00 PM' },
    { start: '14:00', end: '15:00', label: '2:00 PM - 3:00 PM' },
    { start: '15:00', end: '16:00', label: '3:00 PM - 4:00 PM' },
    { start: '16:00', end: '17:00', label: '4:00 PM - 5:00 PM' },
    { start: '17:00', end: '18:00', label: '5:00 PM - 6:00 PM' }
  ];

  // Function to format time in 12-hour format
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Define more compact time display for dashboard
  const getTimeLabel = (timeSlot) => {
    if (isDashboard) {
      // Simplified display for dashboard
      return `${formatTime(timeSlot.start)}`;
    }
    return timeSlot.label;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your schedule{retryCount > 0 ? ` (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})` : ''}...</p>
      </div>
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
            {timeSlots.map((timeSlot, index) => (
              <tr key={timeSlot.start}>
                <td className="time-cell">
                  <div className="time-slot-label">{getTimeLabel(timeSlot)}</div>
                </td>
                {days.map(day => {
                  const daySchedules = schedule[day] || [];
                  const scheduleForTime = daySchedules.find(s => 
                    s.timeSlot.startTime === timeSlot.start || 
                    (index > 0 && s.timeSlot.startTime === timeSlots[index - 1].start)
                  );

                  // Calculate rowspan for multi-hour classes
                  const rowSpan = scheduleForTime && scheduleForTime.timeSlot.startTime === timeSlot.start ? 
                    timeSlots.filter((ts, i) => 
                      i >= index && 
                      ts.start >= timeSlot.start && 
                      ts.end <= scheduleForTime.timeSlot.endTime
                    ).length : 1;

                  // Skip rendering if this cell is part of a longer class
                  if (index > 0 && scheduleForTime && 
                      scheduleForTime.timeSlot.startTime === timeSlots[index - 1].start) {
                    return null;
                  }

                  return (
                    <td 
                      key={`${day}-${timeSlot.start}`} 
                      className="schedule-cell"
                      rowSpan={rowSpan}
                    >
                      {scheduleForTime && scheduleForTime.timeSlot.startTime === timeSlot.start && (
                        <div 
                          className="class-item"
                          style={{ backgroundColor: getSectionColor(scheduleForTime) }}
                        >
                          <div className="course-info">
                            <span className="course-code">{scheduleForTime.courseId.code}</span>
                            <span className="course-name">{scheduleForTime.courseId.name}</span>
                          </div>
                          <div className="schedule-details">
                            <div className="teacher-info">
                              {scheduleForTime.teacherId && scheduleForTime.teacherId._id 
                                ? (scheduleForTime.teacherId.userId?.name || teacherNames[scheduleForTime.teacherId._id] || 'Loading...')
                                : 'Teacher TBA'}
                            </div>
                            <div className="room-info">
                              Room: {scheduleForTime.timeSlot.room}
                            </div>
                            <div className="section-info">
                              Section {scheduleForTime.sectionId.section}
                            </div>
                            {!isDashboard && (
                              <div className="time-info">
                                {formatTime(scheduleForTime.timeSlot.startTime)} - {formatTime(scheduleForTime.timeSlot.endTime)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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