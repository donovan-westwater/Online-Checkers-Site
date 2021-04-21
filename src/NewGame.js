import React from 'react';

function Game(props) {
    const socket = props.socket;
    const user = props.user;
    const setGame = props.func;
    function onClick(){
        console.log(user);
        socket.emit("connect-game")
        setGame(true);
    }
    return (
        <div>
            <button onClick={onClick}>New Game</button>
        </div>
    )
}

export default Game;