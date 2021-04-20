import './App.css';
import {MatchComp} from './Match';
import Home from './Home';

import io from 'socket.io-client';

const socket = io(); //Socket connection

function App() {
  return (
    <div className="App">
      <Home socket={socket}/>
    </div>
  )
}
//<Home socket={socket}/> Move this back in when board is fully functional
export default App;
