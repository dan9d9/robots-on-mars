const getSurrounding = (idx, boardWidth, totalSquares) => {
  const leftTouching = idx - 1;
  const rightTouching = idx + 1;
  const topTouching = idx - boardWidth;
  const bottomTouching = idx + boardWidth;
  const topLeftTouching = (idx - boardWidth) - 1;
  const topRightTouching = (idx - boardWidth) + 1;
  const bottomLeftTouching = (idx + boardWidth) - 1;
  const bottomRightTouching = (idx + boardWidth) + 1;

  // top-left corner
    if(idx === 0) {
      return [rightTouching, bottomTouching, bottomRightTouching];
  // top-right corner
    }else if(idx === (boardWidth - 1)) {
      return [leftTouching, bottomTouching, bottomLeftTouching];
  // bottom-left corner
    }else if(idx === (totalSquares - boardWidth)) {
      return [rightTouching, topTouching, topRightTouching];
  // bottom-right corner
    }else if(idx === (totalSquares - 1)) {
      return [topLeftTouching, topTouching, leftTouching];
  // in first column    
    }else if(idx % boardWidth === 0) {
      return [topTouching, topRightTouching, rightTouching, bottomTouching, bottomRightTouching]
  // in last column
    }else if((idx + 1) % boardWidth === 0) {
      return [topLeftTouching, topTouching, leftTouching, bottomLeftTouching, bottomTouching]
  // in first row
    }else if((idx > 0 && idx < (boardWidth - 1))) {
      return [leftTouching, rightTouching, bottomLeftTouching, bottomTouching, bottomRightTouching]
  // in last row
    }else if((idx > (totalSquares - boardWidth) && idx < (totalSquares - 1))) {
      return [topLeftTouching, topTouching, topRightTouching, leftTouching, rightTouching]
  // not on a border
    }else {
      return [topLeftTouching, topTouching, topRightTouching,
              leftTouching, rightTouching,
              bottomLeftTouching, bottomTouching, bottomRightTouching]
    }   
  }

  export default getSurrounding;