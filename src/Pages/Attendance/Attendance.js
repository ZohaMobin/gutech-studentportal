import React from 'react';
import './Attendance.css';

const attendanceData = [
  { day: 'Monday', date: '15-January-2024', group: 'Discrete Structures', teacher: 'Dr. Shahzad', room: 'B101' },
  { day: 'Tuesday', date: '16-January-2024', group: 'Web Technologies', teacher: 'Dr. Khubaib', room: 'C202' },
  { day: 'Wednesday', date: '17-January-2024', group: 'Web Technologies Lab', teacher: 'Ms. Zoha Mobin', room: 'Lab A' },
  { day: 'Thursday', date: '18-January-2024', group: 'PSPF', teacher: 'Dr. Twaha Minai', room: 'D303' },
  { day: 'Friday', date: '19-January-2024', group: 'PSPF Lab', teacher: 'Ms. Zoha Mobin', room: 'Lab B' },
  { day: 'Monday', date: '22-January-2024', group: 'Design Thinking', teacher: 'Dr. Rauf, Dr. Jawaid abdul ghani', room: 'E404' },
  { day: 'Tuesday', date: '23-January-2024', group: 'English Language', teacher: 'Mr. Ali Dossa', room: 'F505' }
];

const Attendance = () => {
  return (
    <div className="attendance-container">
      <header className="attendance-header">
        <img src="path_to_profile_picture.jpg" alt="Profile" className="profile-picture" />
        <div className="student-info">
          <h3>Student</h3>
          <h4>ATTENDANCE</h4>
        </div>
      </header>
      <input type="text" placeholder="Search..." className="search-bar" />
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Date</th>
            <th>Group</th>
            <th>Teacher</th>
            <th>Room</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((item, index) => (
            <tr key={index}>
              <td>{item.day}</td>
              <td>{item.date}</td>
              <td>{item.group}</td>
              <td>{item.teacher}</td>
              <td>{item.room}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
