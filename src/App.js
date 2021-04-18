import Home from './Home.js';
import io from 'socket.io-client';

const socket = io(); //Socket connection

function App() {
  return (
    <div>
      <Home socket={socket}/>
    </div>
  )
}

export default App;
