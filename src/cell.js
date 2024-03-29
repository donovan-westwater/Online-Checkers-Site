import React from 'react';
import PropTypes from 'prop-types';
import './Match.css';

export function Cell(props) {
  const {
    index, click, cellState, symbol,
  } = props;
  let type = '';
  const col = index % 8;
  const row = (index - col) / 8;
  if (cellState === 'selected') type = 'selectedcell';
  else if (cellState === 'legal') type = 'legalcell';
  else if (cellState === 'first') type = 'firstcell';
  else if ((row % 2 === 0 && col % 2 === 0) || (row % 2 === 1 && col % 2 === 1)) type = 'redcell';
  else type = 'blackcell';
  return (
    <div role="button" tabIndex={index} onClick={click} onKeyDown={click} className={type}>
      {symbol}
    </div>
  );
}
export default 'not cell';
Cell.propTypes = {
  symbol: PropTypes.string,
  click: PropTypes.func,
  index: PropTypes.number,
};

Cell.defaultProps = {
  symbol: '',
  click: null,
  index: 0,
};
