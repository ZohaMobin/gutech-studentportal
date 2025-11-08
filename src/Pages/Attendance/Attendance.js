import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Search, Users, CheckCircle, XCircle, Clock, AlertCircle, BookOpen } from 'lucide-react';
import './Attendance.css';

const Attendance = () => {
  // State variables
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);

  // API URL from environment variable
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  
  // Get auth token from session storage
  const getAuthToken = () => {
    return sessionStorage.getItem('token');
  };

  // Get student ID from session storage
  const getStudentId = () => {
    const userData = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');

    if (!userData || !token) {
      console.error('Missing user data or token in session');
      return null;
    }

    try {
      const user = JSON.parse(userData);
      if (!user || !user.studentId) {
        console.error('Invalid user data structure:', user);
        return null;
      }
      return user.studentId;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  };

  // Error handling utility
  const handleApiError = (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        setError("Course or attendance not found.");
      } else if (error.response?.status === 403) {
        setError("You don't have permission to view this attendance.");
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || "Invalid request.");
      } else {
        setError("Network error. Please check your connection.");
      }
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
    console.error("API Error:", error);
  };

  // Fetch student's enrolled courses for the current academic year
  const fetchStudentCourses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const studentId = getStudentId();
      if (!studentId) {
        setError("Student ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      // Get active registered courses for the student in the current academic year
      // The API filters by current academic year by default
      const response = await axios.get(`${apiUrl}/api/course-registrations/student/${studentId}/courses`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      });

      if (response.data && response.data.courses) {
        const activeCourses = response.data.courses.map(course => ({
          id: course.id,
          name: course.name || 'Unknown Course',
          code: course.code || '',
          creditHours: course.creditHours || 0
        }));
        
        setCourses(activeCourses);
        
        if (activeCourses.length > 0 && !activeCourse) {
          setActiveCourse(activeCourses[0].id);
          fetchCourseAttendance(activeCourses[0].id);
        }
      } else {
        setCourses([]);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance for a specific course
  const fetchCourseAttendance = async (courseId) => {
    if (!courseId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${apiUrl}/api/students/attendance/${courseId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      });

      if (response.data) {
        // Format dates and sort by date (newest first)
        const records = response.data.records.map(record => {
          // Parse date string directly to avoid timezone issues
          // API returns dates like "2025-10-07T00:00:00.000Z"
          const dateStr = record.date;
          let year, month, day;
          
          if (typeof dateStr === 'string') {
            // Extract date parts from ISO string (YYYY-MM-DD)
            const dateMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (dateMatch) {
              year = dateMatch[1];
              month = dateMatch[2];
              day = dateMatch[3];
            } else {
              // Fallback to Date parsing with UTC methods
              const dateObj = new Date(dateStr);
              year = String(dateObj.getUTCFullYear());
              month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
              day = String(dateObj.getUTCDate()).padStart(2, '0');
            }
          } else {
            // If it's already a Date object, use UTC methods
            const dateObj = new Date(dateStr);
            year = String(dateObj.getUTCFullYear());
            month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
            day = String(dateObj.getUTCDate()).padStart(2, '0');
          }
          
          const formattedDateStr = `${year}-${month}-${day}`;
          const dateObj = new Date(`${year}-${month}-${day}T12:00:00`); // Use noon to avoid timezone issues
          
          return {
            date: formattedDateStr,
            dateObj: dateObj,
            day: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
            status: record.status
          };
        }).sort((a, b) => b.dateObj - a.dateObj);

        setAttendanceRecords(records);
        setFilteredRecords(records);
        setAttendanceSummary(response.data.summary);
        
        // Extract marked dates for calendar highlighting
        const dates = records.map(r => r.date);
        setMarkedDates(dates);
      }
    } catch (error) {
      handleApiError(error);
      setAttendanceRecords([]);
      setFilteredRecords([]);
      setAttendanceSummary(null);
      setMarkedDates([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle course change
  const handleCourseChange = (course) => {
    setActiveCourse(course);
    setSearchTerm('');
    setSelectedDate(null);
    fetchCourseAttendance(course.id);
  };

  // Handle date filter change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      const filtered = attendanceRecords.filter(record => record.date === dateStr);
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(attendanceRecords);
    }
  };

  // Filter records based on search term
  useEffect(() => {
    if (!searchTerm) {
      if (selectedDate) {
        const dateStr = selectedDate.toISOString().split('T')[0];
        setFilteredRecords(attendanceRecords.filter(record => record.date === dateStr));
      } else {
        setFilteredRecords(attendanceRecords);
      }
      return;
    }

    const filtered = attendanceRecords.filter(record => {
      const dateMatch = record.date.includes(searchTerm);
      const dayMatch = record.day.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = record.status.toLowerCase().includes(searchTerm.toLowerCase());
      return dateMatch || dayMatch || statusMatch;
    });
    
    setFilteredRecords(filtered);
  }, [searchTerm, attendanceRecords, selectedDate]);

  // Initialize component
  useEffect(() => {
    fetchStudentCourses();
  }, []);

  // Format status for display
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'present':
        return 'present';
      case 'absent':
        return 'absent';
      case 'late':
        return 'late';
      default:
        return '';
    }
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <div className="header-content">
          <h1>Attendance</h1>
          <p>View your attendance records for each course</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="attendance-content">
        <div className="attendance-sidebar">
          <div className="section-selector">
            <h3>
              <BookOpen size={16} /> My Courses
            </h3>
            <div className="section-list">
              {loading && courses.length === 0 ? (
                <div className="loading-text">Loading courses...</div>
              ) : courses.length === 0 ? (
                <div className="empty-text">No courses available</div>
              ) : (
                courses.map(course => (
                  <div 
                    key={course.id}
                    className={`section-item ${activeCourse?.id === course.id ? 'active' : ''}`}
                    onClick={() => handleCourseChange(course)}
                  >
                    <div className="section-info">
                      <div className="section-name">
                        {course.name}
                      </div>
                      <div className="section-code">
                        {course.code}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="attendance-main">
          {loading && !activeCourse ? (
            <div className="loading">Loading...</div>
          ) : !activeCourse ? (
            <div className="empty-state">
              <Users size={48} />
              <p>Select a course to view attendance</p>
                </div>
          ) : (
            <>
              {/* Date Filter and Search */}
              <div className="attendance-controls">
                <div className="date-selector">
                  <label>
                    <Calendar size={16} /> Filter by Date
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    maxDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    className="date-input"
                    placeholderText="Select a date to filter"
                    isClearable
                    highlightDates={markedDates.map(dateStr => {
                      const [year, month, day] = dateStr.split('-');
                      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    })}
                    dayClassName={(date) => {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const dateStr = `${year}-${month}-${day}`;
                      return markedDates.includes(dateStr) ? 'marked-date' : '';
                    }}
                  />
                  {markedDates.length > 0 && (
                    <div className="date-legend">
                      <span className="legend-dot"></span>
                      <span className="legend-text">Dates with attendance</span>
                </div>
                  )}
            </div>

                <div className="search-container">
                  <Search className="search-icon" size={16} />
                  <input
                    type="text"
                    placeholder="Search by date, day, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              {/* Statistics */}
              {attendanceSummary && (
                <div className="attendance-stats">
                  <div className="stat-card total">
                    <div className="stat-value">{attendanceSummary.totalClasses}</div>
                    <div className="stat-label">Total Classes</div>
                  </div>
                  <div className="stat-card present">
                    <div className="stat-value">{attendanceSummary.present}</div>
                    <div className="stat-label">Present</div>
                  </div>
                  <div className="stat-card absent">
                    <div className="stat-value">{attendanceSummary.absent}</div>
                    <div className="stat-label">Absent</div>
                  </div>
                  <div className="stat-card late">
                    <div className="stat-value">{attendanceSummary.late}</div>
                    <div className="stat-label">Late</div>
                  </div>
                  <div className="stat-card percentage">
                    <div className="stat-value">{attendanceSummary.percentage.toFixed(1)}%</div>
                    <div className="stat-label">Attendance %</div>
            </div>
          </div>
              )}

              {/* Attendance Records Table */}
              <div className="students-table-container">
                <table className="students-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record, index) => (
                  <tr key={index}>
                          <td className="date-cell">{record.date}</td>
                          <td className="day-cell">{record.day}</td>
                          <td className="status-cell">
                            <span className={`status-badge ${getStatusBadgeClass(record.status)}`}>
                              {formatStatus(record.status)}
                      </span>
                    </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="no-results">
                          {searchTerm || selectedDate 
                            ? 'No attendance records match your search' 
                            : 'No attendance records available for this course'}
                        </td>
                  </tr>
                    )}
              </tbody>
            </table>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
