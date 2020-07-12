import React from 'react';

import '../styles/Grid.css';

import GridSquare from '../components/GridSquare';

const Grid = (props) => {
  const handleClick = (e) => {
    let idx;
    e.target.tagName === 'IMG'
      ? (idx = e.target.parentNode.dataset.idx)
      : (idx = e.target.dataset.idx);

    const gridSquare = props.grid[idx];
    if (gridSquare.occupants.length > 0) {
      console.log(gridSquare.occupants);
    }
  };

  const activeRobots = props.deployedRobots.filter((robot) => {
    return robot.status === 'active' || robot.status === 'stranded';
  });

  return (
    <div className="grid">
      {props.grid.map((gridSquare, idx) => {
        gridSquare.occupants.splice(0);

        activeRobots.forEach((robot) => {
          if (
            robot.lastPosition[0] === gridSquare.pos[0] &&
            robot.lastPosition[1] === gridSquare.pos[1]
          ) {
            gridSquare.occupants.push(robot);
          }
        });
        return (
          <GridSquare
            key={`${gridSquare.pos}`}
            gridSquare={gridSquare}
            idx={idx}
            handleClick={handleClick}
          />
        );
      })}
    </div>
  );
};

export default Grid;
