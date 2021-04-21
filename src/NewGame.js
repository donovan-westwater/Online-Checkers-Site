import React from 'react';

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
      <button type="button" onClick={onClick}>New Game</button>
    </div>
  );
}

export default Game;
