import { React, useState } from 'react';
import Login from './Login';
import Logout from './Logout';

function Home(props) {
  const { socket } = props;
  const [logged, setLogin] = useState(false);
  const [user, setUser] = useState('');
  return (
    <div>
      {logged ? <Logout socket={socket} func={setLogin} user={user} />
        : <Login socket={socket} func={setLogin} setUser={setUser} />}
    </div>
  );
}

export default Home;
