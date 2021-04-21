import React from 'react';

function Game(props) {
  const { setGame } = props.func;
  function onClick() {
    setGame(true);
  }
  return (
    <div>
      <button type="button" onClick={onClick}>New Game</button>
    </div>
  );
}

export default Game;
