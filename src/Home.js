import {React, useState} from 'react';
import Login from './Login.js';
import Logout from './Logout.js';

function Home(props){
    const socket = props.socket;
    const [logged, setLogin] = useState(false);
    return(
        <div>
            {logged?<Logout socket={socket} func={setLogin}/>:<Login socket={socket} func={setLogin}/>}
        </div>
    );
}

export default Home;