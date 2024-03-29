import React, { useState } from 'react';
import { GoogleLogout } from 'react-google-login';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import StatsComponent from './Stats';
import Game from './NewGame';
import MatchComp from './Match';

const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT;

function Logout(props) {
  const { socket } = props;
  const { user } = props;
  const { email } = props;
  const { image } = props;
  const [game, setGame] = useState(false);
  const onSuccess = () => {
    console.log('Logout success');
    socket.emit('logout', { user });
    props.func(false);
  };
  return (
    <div>
      <h1>
        Welcome
        {` ${user}`}
      </h1>
      {game ? (
        <div>
          <h1>Game on</h1>
          <MatchComp socket={socket}> test </MatchComp>
        </div>
      ) : (
        <div>
          <Container>
            <Row>
              <Col>
                <StatsComponent socket={socket} email={email} />
              </Col>
              <Col>
                <Image src={image} roundedCircle />
                <Game socket={socket} user={user} func={setGame} />
              </Col>
            </Row>
          </Container>
        </div>
      )}
      <GoogleLogout
        clientId={clientId}
        theme="dark"
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
}

export default Logout;
