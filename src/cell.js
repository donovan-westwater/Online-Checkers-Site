import React from "react";
import PropTypes from 'prop-types';
import "./Match.css";

export function Cell(props) {
  const { index, click, type, symbol } = props;
  return (
    <div role="button" tabIndex={index} onClick={click} onKeyDown={click} className={type}>
    {symbol}
    </div>
  );
}
export default 'not cell';
Cell.propTypes = {
  symbol: PropTypes.string,
  type : PropTypes.string, 
  click : PropTypes.func,
  index: PropTypes.number
};

Cell.defaultProps = {
  symbol: "",
  type : "",
  click : null,
  index: 0
};