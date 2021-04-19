import React from 'react';

function Game(props) {
    const socket = props.socket;
    const user = props.user;
    const setGame = props.func;
    function onClick(){
        console.log(user);
        setGame(true);
    }
    return (
        <div>
            <button onClick={onClick}>New Game</button>
        </div>
    )
}

export default Game;