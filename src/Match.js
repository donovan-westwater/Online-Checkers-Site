import React from 'react';
import './Match.css';
import { Cell } from './cell';

function MatchComp(props) {
  const { socket } = props;

  const [board, setBoard] = React.useState([]);
  const [playerTurn, setTurn] = React.useState('');
  const [user, setUser] = React.useState('');
  const [piece, setPiece] = React.useState('');
  const [isSelected, setSelect] = React.useState(false);
  const [selectedCell, setCell] = React.useState(-1);
  const [cellStates, setCellStates] = React.useState([]);
  const [moveOrder, setMoveOrder] = React.useState([]);

  function changeCellStateHelper(newState, row, col) {
    setCellStates((prev) => {
      const c = [...prev];
      c[row][col] = newState;
      return c;
    });
  }

  function toRow(index) { return (index - (index % 8)) / 8; }

  function toCol(index) { return index % 8; }

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

  function legalCellsHelper(row, col, canMove, firstMove = false) {
    const legalCells = [];

    const directions = {
      X: [[+1, -1], [+1, +1]],
      O: [[-1, -1], [-1, +1]],
    };
    console.log(canMove);
    directions[piece].forEach((m) => {
      let nrow = row + m[0];
      let ncol = col + m[1];
      if (nrow >= 0 && nrow <= 7 && ncol >= 0 && nrow <= 7) {
        if (board[nrow][ncol] !== piece) {
          if (board[nrow][ncol] === '') {
            if (canMove && firstMove) {
              legalCells.push([nrow, ncol, 'first']);
            }
          } else {
            nrow += m[0];
            ncol += m[1];
            if (nrow >= 0 && nrow <= 7 && ncol >= 0 && nrow <= 7) {
              if (board[nrow][ncol] === '') {
                legalCells.push([nrow, ncol, 'legal']);
              }
            }
          }
        }
      }
    });

    legalCells.forEach((c) => {
      changeCellStateHelper(c[2], c[0], c[1]);
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
          setSelect(true);
          setCell(index);
          changeCellStateHelper('selected', row, col);
          legalCellsHelper(row, col, true, true);
          setMoveOrder((prev) => [...prev, [row, col]]);
        }
      } else {
        const scol = toCol(selectedCell);
        const srow = toRow(selectedCell);

        if (cellStates[row][col] === 'selected') {
          if (moveOrder.length === 1 && row === srow && col === scol) {
            setSelect(false);
            setCell(-1);
            setMoveOrder([]);
            clearCellStatesHelper();
          } else {
            setMoveOrder((prev) => {
              const order = [...prev];
              socket.emit('make-move', {
                moves: order,
              });
              return order;
            });

            console.log(moveOrder);
            setMoveOrder([]);
            setSelect(false);
            setCell(-1);
            clearCellStatesHelper();
          }
        } else if (cellStates[row][col] === 'first') {
          setMoveOrder((prev) => {
            const order = [...prev, [row, col]];
            socket.emit('make-move', {
              moves: order,
            });
            return order;
          });
          setMoveOrder([]);
          setSelect(false);
          setCell(-1);
          clearCellStatesHelper();
        } else if (cellStates[row][col] === 'legal') {
          setMoveOrder((prev) => [...prev, [row, col]]);
          clearCellStatesHelper();
          changeCellStateHelper('selected', row, col);
          legalCellsHelper(row, col, false);
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

    // since useEffect only runs once we can use this to set up the cells
    clearCellStatesHelper();
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
