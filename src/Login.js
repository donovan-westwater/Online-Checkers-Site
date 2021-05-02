import React from 'react';
import { GoogleLogin } from 'react-google-login';

const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT;

function Login(props) {
  const { socket } = props;
  const onSuccess = (res) => {
    const { email } = res.profileObj;
    console.log(res.profileObj.name);
    props.setUser(email.slice(0, email.indexOf('@')));
    socket.emit('login', res.profileObj);
    props.emailFunc(email);
    props.func(true);
  };
  const onFailure = (res) => {
    console.log('[Login failed] res:', res);
  };
  return (
    <div>
      <h1>Welcome to Online Checkers!</h1>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy="single_host_origin"
        style={{ marginTop: '100px' }}
      />
    </div>
  );
}

export default Login;
