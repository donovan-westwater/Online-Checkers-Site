import logo from './logo.svg';
import './App.css';
import {MatchComp} from './Match';

import io from 'socket.io-client';

const socket = io(); //Socket connection

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Home socket={socket}/>
      <MatchComp> test </MatchComp>
      
    </div>
  )
}
//<Home socket={socket}/> Move this back in when board is fully functional
export default App;
