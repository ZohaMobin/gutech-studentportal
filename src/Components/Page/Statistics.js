import '../Page/Statistics.css';

function Staistics() {
  const OverallAttWidth = 70; 
  const OverallProgressWidth = 85; 

  return (
    <div className="card2">
      <h3>Statistics Overview</h3>
      <div className="stats-bar">
        <p>Overall Attendance: {OverallAttWidth}%</p>
        <div className="bar-container">
          <div className="bar overall-attendance" style={{ width: `${OverallAttWidth}%` }}></div>
        </div>

        <p>Overall Progress: {OverallProgressWidth}%</p>
        <div className="bar-container">
          <div className="bar overall-progress" style={{ width: `${OverallProgressWidth}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default Staistics;