import React from "react";
import "./Match.css";
import io from "socket.io-client";
import { Cell } from "./cell";

const socket = io();

let loginStatus = false;
let activeUser = "";

export function MatchComp(){
    const disArr = [];
    const storArr = [];
    const [board, setBoard] = React.useState(disArr);
    const [playerTurn, setTurn] = React.useState("Player 1");
    const [players, setPlayers] = React.useState(0); 
    //Setup click function
    function onCellClick(){
        console.log("Clicked on a square")
    }
    //Setup gameboard
    for (let row = 0; row < 8; row ++) {
        disArr.push([])
        storArr.push([])
        for (let col = 0; col < 8; col ++) {
            storArr[row].push("");
            let type = "";
            let index = 8*row + col; 
            if((index % 2 == 0 && row % 2 == 0) || (index % 2 == 1 && row % 2 == 1)) type = "redcell";
            else type = "blackcell";
            disArr[row].push(<Cell index={index} click ={() => onCellClick()} type={type} symbol="O" />);
        }
    }
    //Joining a game
    if(players < 2){
        let newPlayers = players+1;
        setPlayers(newPlayers);
        socket.emit("join-game", newPlayers);
        //Setup new player 
        if(newPlayers == 1){
            console.log("We have a player 1");
        }
    }
    React.useEffect(() => {
    socket.on("board", (data) => {
      const upBoard = data.newBoard;
      setBoard(upBoard);
    });

    socket.on("change-turn", (data) => {
      setTurn(data);
    });
    
    socket.on("join-game", (data) => {
      setPlayers(data);
    });
  }, []);
    
    return (
    <div role="grid" data-testid="gameboard" className="checkerboard">
        {board}
    </div>
        );
    
}