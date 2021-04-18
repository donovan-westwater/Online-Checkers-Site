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
            disArr[row].push(<Cell index={index} type={type} />);
        }
    }
    const [board, setBoard] = React.useState(disArr);    
    
    return (
    <div role="grid" data-testid="gameboard" className="checkerboard">
        {board}
    </div>
        );
    
}