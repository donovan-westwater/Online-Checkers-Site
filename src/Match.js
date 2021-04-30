import React from 'react';
import './Match.css';
import { Cell } from './cell';

function MatchComp(props) {
  const { socket } = props;

  const [board, setBoard] = React.useState([]);
  // const [playerCount, setpCount] = React.useState(0);
  const [playerTurn, setTurn] = React.useState('');
  const [user, setUser] = React.useState('');
  const [piece, setPiece] = React.useState('');
  const [isSelected, setSelect] = React.useState(false);
  const [selectedCell, setCell] = React.useState(-1);

  const cellArray = [8];
  console.log(cellArray);
  for (let i = 0; i < 8; i += 1) {
    const z = [];
    for (let j = 0; j < 8; j += 1) {
      z[j] = '';
    }
    cellArray[i] = z;
  }

  const [cellStates, setCellStates] = React.useState(cellArray);

  function changeCellStateHelper(newState, row, col) {
    setCellStates((prev) => {
      const c = [...prev];
      c[row][col] = newState;
      return c;
    });
  }

  function toRow(index) {
    return (index - (index % 8)) / 8;
  }

  function toCol(index) {
    return index % 8;
  }

  function clearCellStatesHelper() {
    setCellStates(() => {
      const c = [8];
      for (let i = 0; i < 8; i += 1) {
        const z = [];
        for (let j = 0; j < 8; j += 1) {
          z[j] = '';
        }
        c[i] = z;
      }
      return c;
    });
  }

  function legalCellsHelper(row, col) {
    const legalCells = [];

    if (piece === 'O') {
      legalCells.push([row - 1, col + 1]);
      legalCells.push([row - 1, col - 1]);
    }
    if (piece === 'X') {
      legalCells.push([row + 1, col + 1]);
      legalCells.push([row + 1, col - 1]);
    }

    legalCells.forEach((c) => {
      changeCellStateHelper('legal', c[0], c[1]);
    });
  }

  // Setup click function
  function onCellClick(index) {
    console.log(`Clicked on a square: ${index}`);
    console.log(`Player turn: ${playerTurn}`);
    console.log(`User: ${user}`);

    const col = toCol(index);
    const row = toRow(index);

    if (user === playerTurn) {
      if (!isSelected) {
        if (board[row][col] === piece) {
          console.log('Selected');
          setSelect(true);
          setCell(index);
          changeCellStateHelper('selected', row, col);
          legalCellsHelper(row, col);
        }
      } else {
        const scol = toCol(selectedCell);
        const srow = toRow(selectedCell);
        const scell = board[srow][scol];

        if (scol === col && srow === row) {
          console.log('unselected');
          setSelect(false);
          setCell(-1);
          clearCellStatesHelper();
        } else {
          setBoard((prevBoard) => {
            const b = [...prevBoard];
            b[srow][scol] = '';
            b[row][col] = scell;
            console.log(b);
            socket.emit('make-move', { board: b });
            return b;
          });

          console.log('MOVED!');
          setSelect(false);
          setCell(-1);
          clearCellStatesHelper();
          // Move on to next turn here
          socket.emit('change-turn');
        }
      }
    }
  }

  // console.log("--------------");
  // console.log(board);
  // console.log("--------------");

  React.useEffect(() => {
    socket.on('give-board', (data) => {
      console.log(data);
      setBoard(() => data.board);
    });

    socket.on('change-turn', (data) => {
      setTurn(data);
    });

    socket.on('add-user', (data) => {
      console.log('add-user event');
      setUser(data.user);
      setPiece(data.piece);
    });
  }, []);

  return (
    <div role="grid" data-testid="gameboard" className="checkerboard">
      {board.map((row, rowIndex) => row.map((cell, colIndex) => {
        const index = 8 * rowIndex + colIndex;
        return (
          <Cell
            index={index}
            click={() => onCellClick(index)}
            cellState={cellStates[rowIndex][colIndex]}
            symbol={cell}
          />
        );
      }))}
    </div>
  );
}

export default MatchComp;
