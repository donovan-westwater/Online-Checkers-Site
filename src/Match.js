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
    const [playerCount, setpCount] = React.useState(0); 
    const [players,setPlayers] = React.useState({});
    const [isSelected,setSelect] = React.useState(false);
    const [selectedCell,setCell] = React.useState(-1);
    //Setup click function
    function onCellClick(index){
        console.log("Clicked on a square: "+index);
        let col = index % 8;
        let row = (index - col) / 8;
        let cell = board[row][col];
        let oldSym = cell.props.symbol;
        let newBoard = [...board];
        console.log(board);
        console.log(isSelected);
        if(!isSelected){
            newBoard[row][col] = <Cell index={index} click ={() => onCellClick(index)} type="selectedcell" symbol="0" />;
            console.log(newBoard[row][col]);
            setCell(index);
            setSelect(true);
            
        } else{
            let type = "";
            if((index % 2 == 0 && row % 2 == 0) || (index % 2 == 1 && row % 2 == 1)) type = "redcell";
            else type = "blackcell";
            let scol = selectedCell % 8;
            let srow = (selectedCell - scol) / 8;
            newBoard[srow][scol] = <Cell index={selectedCell} click ={() => onCellClick(selectedCell)} type={type} symbol={oldSym} />;
            setCell(-1);
            setSelect(false);
        }
        console.log(newBoard);
        setBoard(newBoard);
        //socket.emit("board", {newBoard});
    }
    if(playerCount == 0){
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
                disArr[row].push(<Cell index={index} click ={() => onCellClick(index)} type={type} symbol="" />);
            }
        }
    }
    console.log("--------------");
    console.log(board);
    console.log("--------------");
    //Joining a game
    if(playerCount < 2){
        if(playerCount == 1){
            //
        }
        if(playerCount == 2){
            
        }
    }
    React.useEffect(() => {
    socket.on("board", (data) => {
      const upBoard = data.newBoard;
      console.log("CALLDED");
      setBoard(upBoard);
    });

    socket.on("change-turn", (data) => {
      setTurn(data);
    });
    
    socket.on("join-game", (data) => {
        let newPlayers = playerCount+1;
        console.log(newPlayers);
        setpCount(newPlayers);
        activeUser = data;
    });
  }, []);
    
    return (
    <div role="grid" data-testid="gameboard" className="checkerboard">
        {board}
    </div>
        );
    
}