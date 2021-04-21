import React, { useState, useEffect } from 'react';

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
      {stats.map((player, index) => (
        <tr
          className={
                    player.username === true ? 'bold' : null
                  }
        >
          <th key={index}>{player.username}</th>
          <th>{player.wins}</th>
          <th>{player.losses}</th>
        </tr>
      ))}
    </div>
  );
}

export default StatsComponent;
