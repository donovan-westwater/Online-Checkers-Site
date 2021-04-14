import React from 'react';
import {GoogleLogin} from 'react-google-login';
const GOOGLE_OAUTH_CLIENT = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT;

function Login() {
    const onSuccess = (res)=>{
        console.log('Login Success currentUser:',res.profileObj);
    }
    const onFailure = (res)=>{
        console.log('[Login failed] res:',res);
    }
    return(
        <GoogleLogin
            clientId={GOOGLE_OAUTH_CLIENT}
            buttonText="Login"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            style={{ marginTop: '100px' }}
            isSignedIn={true}
        />
    );
}

export default Login;