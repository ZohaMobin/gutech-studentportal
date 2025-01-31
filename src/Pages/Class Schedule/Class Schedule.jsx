import './Class Schedule.css';

const SimpleTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>09:00 - 10:15 AM</th>
          <th>10:25 - 11:40 AM</th>
          <th>11:50 - 01:20 PM</th>
          <th>01:20 - 01:45 PM</th>
          <th>01:45 - 03:00 PM</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Monday</td>
          <td>
            Problem Solving & Programming Fundamentals <br />
            by Sir Twaha Minai
          </td>
          <td>
            Web Technologies <br />
            by Dr. Khubaib Ahmed
          </td>
          <td>
            Discrete Structures <br />
            by Dr. Shehzad
          </td>
          <td>NAMAZ BREAK</td>
          <td>
            Design Thinking <br />
            by Dr. Rauf Malik & Dr. Javaid Ghani
          </td>
        </tr>
        <tr>
          <td>Tuesday</td>
          <td colSpan="7"></td>
        </tr>
        <tr>
          <td>Wednesday</td>
          <td>
            Problem Solving & Programming Fundamentals <br />
            by Sir Twaha Minai
          </td>
          <td>
            Web Technologies <br />
            by Dr. Khubaib Ahmed
          </td>
          <td>
            Web Technologies Lab <br />
            by Ms. Zoha Mobin
          </td>
          <td>NAMAZ BREAK</td>
          <td>
            Web Technologies Lab <br />
            by Ms. Zoha Mobin
          </td>
        </tr>
        <tr>
          <td>Thursday</td>
          <td>
            Problem Solving & Programming Fundamentals Lab <br />
            by Ms. Zoha Mobin
          </td>
          <td>
            Problem Solving & Programming Fundamentals Lab <br />
            by Ms. Zoha Mobin
          </td>
          <td>
            Discrete Structures <br />
            by Dr. Shehzad
          </td>
          <td>NAMAZ BREAK</td>
          <td>
            Design Thinking <br />
            by Dr. Rauf Malik & Dr. Javaid Ghani
          </td>
        </tr>
        <tr>
          <td>Friday</td>
          <td>
            English <br />
            by Dr. Samra Javed & Mr. Ali Dossa
          </td>
          <td>
            English <br />
            by Dr. Samra Javed & Mr. Ali Dossa
          </td>
          <td>
            English <br />
            by Dr. Samra Javed & Mr. Ali Dossa
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default SimpleTable;
