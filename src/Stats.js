import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

function StatsComponent(props) {
  const { socket } = props;
  const { email } = props;
  const [stats, setStats] = useState([]);
  const [userStats, setUserStats] = useState([1, {}]);

  function pingAllUserStats() {
    socket.emit('requestAllStats', { id: socket.id, email });
  }

  // function pingUserStats() {
  //   socket.emit('requestStats', { id: socket.id, email });
  // }

  useEffect(() => {
    // Listener for app.py returning the userlist
    socket.on('requestAllStatsCallback', (data) => {
      setStats(data.all);
      setUserStats(data.user);
    });
    // socket.on('requestStatsCallback', (data) => {
    //   setUserStats(data);
    // });
    // pingUserStats();
    pingAllUserStats();
  }, []);

  return (
    <div>
      <p><b>Personal Stats</b></p>
      <Table striped bordered hover variant="dark" size="sm">
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
            <td>
              #
              {userStats[0]}
            </td>
            <td>{userStats[1].username}</td>
            <td>{userStats[1].wins}</td>
            <td>{userStats[1].losses}</td>
            <td>
              {userStats[1].wins + userStats[1].losses === 0
                ? 0
                : userStats[1].wins / userStats[1].wins + userStats[1].losses}
              %
            </td>
          </tr>
        </tbody>
      </Table>
      <p><b>Leaderboard</b></p>
      <Table striped bordered hover variant="dark" size="sm">
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
