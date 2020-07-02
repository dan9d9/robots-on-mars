import React from 'react';

import '../styles/Grid.css';

const GridSquare = props => {
  const classes = props.show && props.occupied
    ? `${props.terrain} occupied`
    : props.show
      ? props.terrain
      : '';

  return (
    <div 
      style={{borderRadius: props.isOrigin ? '50%' : ''}}
      className={`grid_square ${classes}`} 
      data-idx={props.idx} 
      data-x={props.pos[0]} 
      data-y={props.pos[1]} 
      onClick={props.handleClick}>
    </div>
  )
}

export default GridSquare;
