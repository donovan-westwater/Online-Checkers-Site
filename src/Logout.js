import React, {useState} from 'react';
import { GoogleLogout } from 'react-google-login';
import StatsComponent from './Stats.js';
import Game from './NewGame.js';

const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT

function Logout(props) {
    const socket = props.socket;
    const user = props.user;
    const [game, setGame] = useState(false);
    const onSuccess = () => {
        console.log("Logout success");
        socket.emit('logout');
        props.func(false);
    }
    return (
        <div>
            {game ? (
                <h1>Game on</h1>
                ):(
                <div> 
                    <h1>Welcome {user}</h1>
                    <StatsComponent socket={socket}/>
                    <Game socekt={socket} user={user} func={setGame}/>
                </div>
            )}
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            />
        </div>
    )
}

export default Logout;