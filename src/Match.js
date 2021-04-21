import React from 'react';
import './Match.css';
import io from 'socket.io-client';
import { Cell } from './cell';

const socket = io();

function MatchComp() {
  const disArr = [...Array(8)].map((v, i) => {
    const inner = new Array(8);
    inner.fill('');
    for (let j = 0; j < 8; j += 1) {
      if (i < 3) {
        if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0)) inner[j] = 'X';
      } else if (i > 4) {
        if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0)) inner[j] = 'O';
      }
    }
    return inner;
  });
  const [board, setBoard] = React.useState(disArr);
  const [playerTurn, setTurn] = React.useState('Player 1');
  const [playerCount, setpCount] = React.useState(0);
  const [players, setPlayers] = React.useState({});
  const [user, setUser] = React.useState('');
  const [isSelected, setSelect] = React.useState(false);
  const [selectedCell, setCell] = React.useState(-1);
  // Setup click function
  function onCellClick(index) {
    console.log(`Clicked on a square: ${index}`);
    const col = index % 8;
    const row = (index - col) / 8;
    const newBoard = [...board];
    console.log(players);
    if (players[user] === playerTurn) {
      if (!isSelected) {
        setSelect(true);
        setCell(index);
      } else {
        // Move part goes here
        console.log(newBoard);
        const scol = selectedCell % 8;
        const srow = (selectedCell - scol) / 8;
        const scell = board[srow][scol];
        setBoard((prevBoard) => {
          /* const b = [...Array(8)].map((v,i) => {
                      let inner = [...prevBoard[i]]
                      return inner;
                  });
                  */
          const b = [...prevBoard];
          b[srow][scol] = '';
          b[row][col] = scell;
          console.log(b);
          socket.emit('board', { b });
          return b;
        });

        console.log('MOVED!');
        setSelect(false);
        setCell(-1);
        // Move on to next turn here
        if (playerTurn === 'Player 1') setTurn('Player 2');
        else setTurn('Player 1');
      }
    }
    // socket.emit("board", {newBoard});
  }

  // console.log("--------------");
  // console.log(board);
  // console.log("--------------");

  React.useEffect(() => {
    socket.on('board', (data) => {
      console.log(data);
      const upBoard = data.b;
      console.log('CALLDED');
      setBoard(upBoard);
    });

    socket.on('change-turn', (data) => {
      setTurn(data);
    });

    socket.on('join-game', (data) => {
      const newCount = playerCount + 1;
      if (newCount === 1) {
        const newPlayers = {};
        newPlayers[data] = 'Player 1';
        setPlayers(newPlayers);
      } else if (newCount === 2) {
        setPlayers((prevPlayers) => {
          const newPlayers = prevPlayers;
          newPlayers[data] = 'Player 2';
        });
      }
      console.log(newCount);
      console.log(`Old count: ${playerCount}`);
      console.log(data);
      setpCount(newCount);
      setUser(data);
    });
  }, []);

  return (
    <div role="grid" data-testid="gameboard" className="checkerboard">
      {board.map((row, rowIndex) => row.map((cell, colIndex) => {
        const index = 8 * rowIndex + colIndex;
        let selected = false;
        if (index === selectedCell) selected = true;
        return (
          <Cell
            index={index}
            click={() => onCellClick(index)}
            select={selected}
            symbol={cell}
          />
        );
      }))}
    </div>
  );
}

export default MatchComp;

/* How to change board state - i var and newData var come from out of scope
setBoard((prevBoard) => {
      const b = [...prevBoard];
      b[i] = newData;
      return b;
}

//Setup gameboard
        for (let row = 0; row < 8; row ++) {
            disArr.push([])
            storArr.push([])
            for (let col = 0; col < 8; col ++) {
                storArr[row].push("");
                let type = "";
                let index = 8*row + col;
                if((index % 2 == 0 && row % 2 == 0) || (index % 2 == 1 && row % 2 == 1)) {
                  type = "redcell";
                }
                else type = "blackcell";
                disArr[row].push(
                  <Cell index={index} click ={() => onCellClick(index)} type={type} symbol="" />
                );
            }
        }
*/
