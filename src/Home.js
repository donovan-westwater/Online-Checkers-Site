import { React, useState } from 'react';
import Login from './Login';
import Logout from './Logout';

function Home(props) {
  const { socket } = props;
  const [logged, setLogin] = useState(false);
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  return (
    <div>
      {logged ? <Logout socket={socket} func={setLogin} email={email} user={user} />
        : <Login socket={socket} func={setLogin} emailFunc={setEmail} setUser={setUser} />}
    </div>
  );
}

export default Home;
