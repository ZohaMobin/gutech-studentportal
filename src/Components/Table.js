const Table = ({ title, data, columns }) => (
  <div className="table-container">
    <h2 className="heading">{title}</h2>
    {/*Table starts */}
    <table>
      {/* Table Heading  */}
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
        </tr>
      </thead>
      {/* Table Heading Ends */}

      {/* Table Body */}
      <tbody>
        {/* INDIVIDUAL TABLE HEADING */}
        {data.map((row, index) => (
          <tr key={index}>
            {/* EACH ROW OF TABLE */}
            {columns.map((col, colIndex) => (
              <td key={colIndex}>
                {row[col.replace(/[^a-zA-Z]/g, "").toLowerCase()]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {/* Table Body Ends */}
    </table>
  </div>
);
export default Table;