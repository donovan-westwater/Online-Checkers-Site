import React from 'react';

function Game(props) {
    const socket = props.socket;
    const user = props.user;
    function onClick(){
        console.log(user);
        socket.emit("connect-game", {id: socket.id});
        setGame(true);
    }
    return (
        <div>
            <button type="button" onClick={() => props.func(true)}>New Game</button>
        </div>
    )
}

export default Game;
