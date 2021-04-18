import {React, useState} from 'react';
import Login from './Login.js';
import Logout from './Logout.js';

function Home(props){
    const socket = props.socket;
    const [logged, setLogin] = useState(false);
    const [user, setUser] = useState('');
    return(
        <div>
            {logged?<Logout socket={socket} func={setLogin} user={user}/>:<Login socket={socket} func={setLogin} setUser={setUser}/>}
        </div>
    );
}

export default Home;