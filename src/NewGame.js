import React from 'react';

function Game(props) {
  return (
    <div>
      <button type="button" onClick={() => props.func(true)}>New Game</button>
    </div>
  );
}

export default Game;
