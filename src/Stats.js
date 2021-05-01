import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

function StatsComponent(props) {
  const { socket } = props;
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // Listener for app.py returning the userlist
    socket.on('requestAllStatsCallback', (data) => {
      setStats(data);
    });
  }, []);

  function pingAllUserStats() {
    socket.emit('requestAllStats', { id: socket.id });
  }

  return (
    <div>
      <button type="button" onClick={pingAllUserStats}>Stats</button>
      <Table striped bordered hover size="sm">
        <thead>
          <th>username</th>
          <th>wins</th>
          <th>losses</th>
        </thead>
        <tbody>
          {stats.map((player, index) => (
            <tr>
              <th key={index}>{player.username}</th>
              <th>{player.wins}</th>
              <th>{player.losses}</th>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default StatsComponent;
