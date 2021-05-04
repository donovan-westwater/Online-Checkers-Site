import React from 'react';
import { GoogleLogin } from 'react-google-login';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

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
            <Nav.Link href="#what">What</Nav.Link>
            <Nav.Link href="#why">Why</Nav.Link>
            <Nav.Link href="#who">Who</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          theme="dark"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy="single_host_origin"
          style={{ marginTop: '100px' }}
        />
      </Navbar>
      <div id="what">
        <h1>Welcome to Online Checkers!</h1>
        <h2>What is it?</h2>
        <p>
          Welcome, here you can play Checkers with anyone in the world
          from the confort of your own home. Play a few matches, see how you stack
          against others and enjoy. Who said boardgames can&apos;t be enjoyed online?
        </p>
      </div>
      <div id="why">
        <h2>Why does it matter?</h2>
        <p>
          Sometimes it is just easier to go to a website and enjoy a game.
          Picture this: you are on trip with friends and out of nowhere you get the sudden
          urge to play checkers. You might say &quot;Oh no, what can I do now?&quot;
          don&apos;t fear, Online Checkers is here. Visit our site and you can play
          with your friends(or ditch them and play with anyone else in the world)
        </p>
      </div>
      <div id="who">
        <h2>Who are we?</h2>
        <p>
          Well that is a great question. What is our purpose in life?
          Is there an afterlife? What is beyond the stars?
        </p>
        <p>Anyways this is us:</p>
        <CardGroup>
          <Card bg="dark">
            <Card.Img variant="top" src="https://avatars.githubusercontent.com/u/44780575?s=400&v=4" />
            <Card.Body>
              <Card.Title>Felix Luciano Salomon</Card.Title>
              <Card.Text>
                Something something github link
              </Card.Text>
            </Card.Body>
          </Card>
          <Card bg="dark">
            <Card.Img variant="top" src="https://avatars.githubusercontent.com/u/34188366?v=4" />
            <Card.Body>
              <Card.Title>Charles Crider</Card.Title>
              <Card.Text>
                Something something github link
              </Card.Text>
            </Card.Body>
          </Card>
          <Card bg="dark">
            <Card.Img variant="top" src="https://avatars.githubusercontent.com/u/29764207?v=4" />
            <Card.Body>
              <Card.Title>Donovan Westwater</Card.Title>
              <Card.Text>
                Something something github link
              </Card.Text>
            </Card.Body>
          </Card>
        </CardGroup>
      </div>
    </div>
  );
}

export default Login;
