import "./DataTable.css";

export default function DataTable({ columns, rows, rowKey = "id" }) {
  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <i className="ti ti-inbox" aria-hidden="true"></i>
        <p>No records yet.</p>
      </div>
    );
  }

  return (
    <div className="data-table-wrap card">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
