import './App.css';
import io from 'socket.io-client';
import React from 'react';
import Home from './Home';

const socket = io(); // Socket connection

function App() {
  return (
    <div className="App">
      <Home socket={socket} />
    </div>
  );
}
// <Home socket={socket}/> Move this back in when board is fully functional
export default App;
