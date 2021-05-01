import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

function StatsComponent(props) {
  const { socket } = props;
  const [stats, setStats] = useState([]);

  function pingAllUserStats() {
    socket.emit('requestAllStats', { id: socket.id });
  }

  useEffect(() => {
    // Listener for app.py returning the userlist
    socket.on('requestAllStatsCallback', (data) => {
      setStats(data);
    });
    pingAllUserStats();
  }, []);

  return (
    <div>
      {/* <button type="button" onClick={pingAllUserStats}>Stats</button> */}
      <Table striped bordered hover size="sm">
        <thead>
          <th>Username</th>
          <th>Wins</th>
          <th>Losses</th>
        </thead>
        <tbody>
          {stats.map((player, index) => (
            <tr>
              <td key={index}>{player.username}</td>
              <td>{player.wins}</td>
              <td>{player.losses}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default StatsComponent;
