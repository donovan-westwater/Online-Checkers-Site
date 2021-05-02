import { React, useState } from 'react';
import Login from './Login';
import Logout from './Logout';

function Home(props) {
  const { socket } = props;
  const [logged, setLogin] = useState(false);
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');

  function setAll(newUser, newEmail, newImage) {
    setUser(newUser);
    setEmail(newEmail);
    setImage(newImage);
  }

  return (
    <div>
      {logged ? <Logout socket={socket} func={setLogin} email={email} image={image} user={user} />
        : <Login socket={socket} func={setLogin} setFunc={setAll} />}
    </div>
  );
}

export default Home;
