import React from 'react';
import PropTypes from 'prop-types';
import './Match.css';

export function Cell(props) {
  const {
    index, click, select, symbol,
  } = props;
  let type = '';
  const col = index % 8;
  const row = (index - col) / 8;
  if (select) type = 'selectedcell';
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
  select: PropTypes.bool,
  click: PropTypes.func,
  index: PropTypes.number,
};

Cell.defaultProps = {
  symbol: '',
  select: false,
  click: null,
  index: 0,
};
