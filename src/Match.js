import React from 'react';
import './Match.css';
import { Cell } from './cell';

function MatchComp(props) {
  const { socket } = props;
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
  // const [playerCount, setpCount] = React.useState(0);
  const [playerTurn, setTurn] = React.useState('');
  const [user, setUser] = React.useState('');
  const [isSelected, setSelect] = React.useState(false);
  const [selectedCell, setCell] = React.useState(-1);
  // Setup click function
  function onCellClick(index) {
    console.log(`Clicked on a square: ${index}`);
    const col = index % 8;
    const row = (index - col) / 8;
    const newBoard = [...board];
    console.log(`Player turn: ${playerTurn}`);
    console.log(`User: ${user}`);
    if (user === playerTurn) {
      console.log('In the if');
      if (!isSelected) {
        console.log('Selected');
        setSelect(true);
        setCell(index);
      } else {
        // Move part goes here
        console.log(newBoard);
        const scol = selectedCell % 8;
        const srow = (selectedCell - scol) / 8;
        const scell = board[srow][scol];
        setBoard((prevBoard) => {
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
        socket.emit('change-turn');
      }
    }
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

    socket.on('add-user', (data) => {
      console.log('add-user event');
      setUser(data);
    });
  }, []);

  return (
    <div role="grid" data-testid="gameboard" className="checkerboard">
      {board.map((row, rowIndex) => row.map((cell, colIndex) => {
        // console.log(colIndex);
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
