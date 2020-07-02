import React from 'react';

const FlexWrapper = props => {
  return (
    <div className={`wrapper-flex ${props.direction}`}>
      {props.children}
    </div>
  )
}

export default FlexWrapper;
