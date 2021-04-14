import React from 'react';
const GOOGLE_OAUTH_CLIENT = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT;

function Login() {
    return(
        <div>
            <button onClick={()=>GOOGLE_OAUTH_CLIENT?console.log("Loaded"):console.log("Empty")}>here</button>
        </div>
    );
}

export default Login;