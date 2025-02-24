import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import './Todaystimetable.css';

function TodaysTimetable() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching data from a dummy API using axios
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Simulate an API call with axios
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos'); // Dummy API endpoint
        // Transform the response data to match your tasks structure
        const dummyTasks = response.data.slice(0, 4).map((task, index) => ({
          id: task.id,
          name: `Task ${index + 1}`, // Customize task names
          completed: task.completed,
          date: 'Thursday, 10 June 2024', // Add a static date
        }));
        setTasks(dummyTasks);
      } catch (error) {
        setError('Failed to fetch timetable data.'); // Handle errors
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchTasks();
  }, []);

  const handleCheckboxChange = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  if (isLoading) {
    return <div>Loading today's timetable...</div>; // Show a loading message while data is being fetched
  }

  if (error) {
    return <div>Error: {error}</div>; // Show an error message if something went wrong
  }

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