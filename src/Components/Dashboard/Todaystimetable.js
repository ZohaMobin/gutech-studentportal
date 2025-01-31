import React, { useState } from 'react';
import './Todaystimetable.css';


function TodaysTimetable() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Pspf', completed: false, date: 'Thursday, 10 June 2024' },
    { id: 2, name: 'Design Thinking', completed: false, date: 'Thursday, 10 June 2024' },
    { id: 3, name: 'Pspf Lab', completed: false, date: 'Thursday, 10 June 2024' },
    { id: 4, name: 'Pspf Lab', completed: false, date: 'Thursday, 10 June 2024' },
  ]);

  const handleCheckboxChange = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="timetable-container">
      <h2>Today's Time Table</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {/* <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleCheckboxChange(task.id)}
            /> */}
            <span>{task.name}</span> 
            <br /> 
            <span>{task.date}</span> 
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodaysTimetable;