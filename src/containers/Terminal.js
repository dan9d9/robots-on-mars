import React from 'react';

import '../styles/Terminal.css';

import Grid from './Grid';

const Terminal = (props) => {
  return (
    <div className="terminal">
      <div className="sidebar robot_log">
        {props.lastLog.length !== 0 &&
          props.lastLog.map((ele, idx) => {
            return (
              <p style={{ color: 'green', fontSize: '12px' }} key={idx}>
                {ele}
              </p>
            );
          })}
      </div>
      <Grid
        grid={props.grid}
        startPosition={props.startPosition}
        deployedRobots={props.deployedRobots}
      />
      <div className="sidebar"></div>
    </div>
  );
};

export default Terminal;
