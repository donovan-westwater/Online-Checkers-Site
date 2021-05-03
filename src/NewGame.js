import React from 'react';
import Button from 'react-bootstrap/Button';

function Game(props) {
  const { func } = props;
  const { socket } = props;
  const { user } = props;

  function onClick() {
    console.log(user);
    socket.emit('connect-game', { user, id: socket.id });
    func(true);
  }

  return (
    <div>
      <Button variant="info" onClick={onClick}>New Game</Button>
    </div>
  );
}

export default Game;
