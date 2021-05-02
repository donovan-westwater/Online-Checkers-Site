import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

function StatsComponent(props) {
  const { socket } = props;
  const { email } = props;
  const [stats, setStats] = useState([]);
  const [userStats, setUserStats] = useState({});

  function pingAllUserStats() {
    socket.emit('requestAllStats', { id: socket.id });
  }

  function pingUserStats() {
    socket.emit('requestStats', { id: socket.id, email });
  }

  useEffect(() => {
    // Listener for app.py returning the userlist
    socket.on('requestAllStatsCallback', (data) => {
      setStats(data);
    });
    socket.on('requestStatsCallback', (data) => {
      setUserStats(data);
    });
    pingUserStats();
    pingAllUserStats();
  }, []);

  return (
    <div>
      {/* <button type="button" onClick={pingAllUserStats}>Stats</button> */}
      <p><b>Personal Stats</b></p>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Win %</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#1</td>
            <td>{userStats.username}</td>
            <td>{userStats.wins}</td>
            <td>{userStats.losses}</td>
            <td>
              {userStats.wins + userStats.losses === 0
                ? 0
                : userStats.wins / userStats.wins + userStats.losses}
              %
            </td>
          </tr>
        </tbody>
      </Table>
      <p><b>Leaderboard</b></p>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Wins</th>
            <th>Losses</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((player, index) => (
            <tr key={index}>
              <td>
                #
                {index + 1}
              </td>
              <td>{player.username}</td>
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
