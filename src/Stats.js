import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function StatsComponent(props) {
    useEffect(() => {
    // Listener for app.py returning the userlist
    socket.on('requestStatsCallback', (data) => {
      console.log('Socked recieved user stats');
      console.log(data)
    });
    }, []);
    
    function pingServerForUser(){
        socket.emit('requestStats', { id: socket.id, usr: 1 });
    }
    
    return (
        <div>
        <button onClick={pingServerForUser}>Test</button>
        </div>
    );
}

export default StatsComponent;