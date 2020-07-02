import React from 'react';

import '../styles/Grid.css';

import GridSquare from '../components/GridSquare';


const Grid = props => {
  const handleClick = e => {
    const idx = e.target.dataset.idx;
    // const x = e.target.dataset.x;
    // const y = e.target.dataset.y;

    // console.log(
    //   'pos: ', `[${x}, ${y}]`, 
    //   'idx: ', idx
    // );
    console.log(idx, props.grid[idx]);

    // const tempGrid = [...grid];
    // tempGrid[idx].toggleShow();
    // setGrid([...tempGrid]);
  }
    
  return (
    <div className='grid'>
      {props.grid.map((ele, idx) => {
        let occupied = false;
        props.robots.filter(robot => robot.status === 'active').forEach(robot => {
          if(robot.lastPosition[0] === ele.pos[0] && robot.lastPosition[1] === ele.pos[1]) {
            occupied = true;
          }
        });
        return <GridSquare 
          key={`${ele.pos}`}
          isOrigin={ele.isOrigin} 
          pos={ele.pos}
          show={ele.show} 
          idx={idx} 
          terrain={ele.terrain}
          occupied={occupied}
          handleClick={handleClick} 
        />
      })}
    </div>
  )
}

export default Grid;
