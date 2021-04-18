import React from 'react';
import { GoogleLogout } from 'react-google-login';

const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT

function Logout(props) {
    const socket = props.socket;
    const onSuccess = () => {
        console.log("Logout success");
        socket.emit('logout');
        props.func(false);
    }
    return (
        <div>
            <h1>Welcome {props.user}</h1>
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            />
        </div>
    )
}

export default Logout;