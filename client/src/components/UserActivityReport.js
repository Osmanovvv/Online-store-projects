import React from 'react';

const UserActivityReport = ({ data }) => {
  return (
    <div className="mt-4">
      <h4>Отчет об активности пользователей</h4>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Регистрации</th>
            <th>Активные пользователи</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.date}</td>
              <td>{row.registrations}</td>
              <td>{row.activeUsers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserActivityReport;
