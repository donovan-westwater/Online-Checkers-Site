import React from 'react';
import { GoogleLogin } from 'react-google-login';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT;

function Login(props) {
  const { socket } = props;
  const onSuccess = (res) => {
    const { email } = res.profileObj;
    props.setFunc(email.slice(0, email.indexOf('@')), email, res.profileObj.imageUrl);
    socket.emit('login', res.profileObj);
    props.func(true);
  };
  const onFailure = (res) => {
    console.log('[Login failed] res:', res);
  };
  return (
    <div>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand href="#home">Online Checkers</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">About</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <h1>Welcome to Online Checkers!</h1>
      <p>What is it?</p>
      <p>Why it matters</p>
      <p>Who is it made by</p>
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
