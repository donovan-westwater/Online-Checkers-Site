import React from 'react';
import Button from 'react-bootstrap/Button';

function ResetButton(props) {
  const { socket } = props;

  function onClick() {
    socket.emit('reset');
  }

  return (
    <div>
      <Button variant="info" onClick={onClick}>Reset</Button>
    </div>
  );
}

export default ResetButton;
