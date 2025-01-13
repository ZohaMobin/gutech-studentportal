import './Class Schedule.css';

const SimpleTable = () => {
  const schedule = [
    {
      day: 'Monday',
      slots: [
        { time: '09:00 - 10:15 AM', subject: 'Problem Solving & Programming Fundamentals', teacher: 'Sir Twaha Minai', classColor: 'yellow-cell' },
        { time: '10:25 - 11:40 AM', subject: 'Web Technologies', teacher: 'Dr. Khubaib Ahmed', classColor: 'blue-cell' },
        { time: '11:50 - 01:20 PM', subject: 'Discrete Structures', teacher: 'Dr. Shehzad', classColor: 'purple-cell' },
        { time: '01:20 - 01:45 PM', subject: 'NAMAZ BREAK', teacher: '', classColor: 'green-cell' },
        { time: '01:45 - 03:00 PM', subject: 'Design Thinking', teacher: 'Dr. Rauf Malik & Dr. Javaid Ghani', classColor: 'orange-cell' }
      ]
    },
    {
      day: 'Tuesday',
      slots: [
        { time: '', subject: '', teacher: '', classColor: '' },
        { time: '', subject: '', teacher: '', classColor: '' },
        { time: '', subject: '', teacher: '', classColor: '' },
        { time: '', subject: '', teacher: '', classColor: '' },
        { time: '', subject: '', teacher: '', classColor: '' }
      ]
    },
    {
      day: 'Wednesday',
      slots: [
        { time: '09:00 - 10:15 AM', subject: 'Problem Solving & Programming Fundamentals', teacher: 'Sir Twaha Minai', classColor: 'yellow-cell' },
        { time: '10:25 - 11:40 AM', subject: 'Web Technologies', teacher: 'Dr. Khubaib Ahmed', classColor: 'blue-cell' },
        { time: '11:50 - 01:20 PM', subject: 'Web Technologies Lab', teacher: 'Ms. Zoha Mobin', classColor: 'dark-blue-cell' },
        { time: '01:20 - 01:45 PM', subject: 'NAMAZ BREAK', teacher: '', classColor: 'green-cell' },
        { time: '01:45 - 03:00 PM', subject: 'Web Technologies Lab', teacher: 'Ms. Zoha Mobin', classColor: 'dark-blue-cell' }
      ]
    },
    {
      day: 'Thursday',
      slots: [
        { time: '09:00 - 10:15 AM', subject: 'Problem Solving & Programming Fundamentals Lab', teacher: 'Ms. Zoha Mobin', classColor: 'dark-yellow-cell' },
        { time: '10:25 - 11:40 AM', subject: 'Problem Solving & Programming Fundamentals Lab', teacher: 'Ms. Zoha Mobin', classColor: 'dark-yellow-cell' },
        { time: '11:50 - 01:20 PM', subject: 'Discrete Structures', teacher: 'Dr. Shehzad', classColor: 'purple-cell' },
        { time: '01:20 - 01:45 PM', subject: 'NAMAZ BREAK', teacher: '', classColor: 'green-cell' },
        { time: '01:45 - 03:00 PM', subject: 'Design Thinking', teacher: 'Dr. Rauf Malik & Dr. Javaid Ghani', classColor: 'orange-cell' }
      ]
    },
    {
      day: 'Friday',
      slots: [
        { time: '09:00 - 10:15 AM', subject: 'English', teacher: 'Dr. Samra Javed & Mr. Ali Dossa', classColor: 'aqua-cell' },
        { time: '10:25 - 11:40 AM', subject: 'English', teacher: 'Dr. Samra Javed & Mr. Ali Dossa', classColor: 'aqua-cell' },
        { time: '11:50 - 01:20 PM', subject: 'English', teacher: 'Dr. Samra Javed & Mr. Ali Dossa', classColor: 'aqua-cell' },
        { time: '', subject: '', teacher: '', classColor: '' },
        { time: '', subject: '', teacher: '', classColor: '' }
      ]
    }
  ];

  return (
    <div>
      <h1 className='heading'>CLASS SCHEDULE (BSCS SEM 01)</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th >09:00 - 10:15 AM</th>
            <th>10:25 - 11:40 AM</th>
            <th>11:50 - 01:20 PM</th>
            <th>01:20 - 01:45 PM</th>
            <th>01:45 - 03:00 PM</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((day, index) => (
            <tr key={index}>
              <td className='days'>{day.day}</td>
              {day.slots.map((slot, idx) => (
                <td key={idx} className={slot.classColor}>
                  {slot.subject && <>{slot.subject} <br /> by {slot.teacher}</>}
                  {!slot.subject && <>{slot.subject}</>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
