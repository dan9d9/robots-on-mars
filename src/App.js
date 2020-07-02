import React, { useState, useEffect } from 'react';

import sendRobot from './logic/missionControl';

import Grid from './containers/Grid';
import GridGenerator from './GridGenerator';
import Robot from './logic/RobotModel';
import FlexWrapper from './components/FlexWrapper';
// import GridSquareArray from './GridSquareModel';

const App = () => {
  const [ grid, setGrid ] = useState([]);
  const [ startPosition, setStartPosition ] = useState([]);

  const [ robotsRemaining, setRobotsRemaining ] = useState(10);
  const [ robots, setRobots ] = useState([]);
  const [ collectiveRobotConsciousness, setCollectiveRobotConsciousness ] = useState([]);

  const [ instructions, setInstructions ] = useState('');

  useEffect(() => {
    setGrid([...GridGenerator]);

    let startPos = GridGenerator.find(gridSquare => gridSquare.isOrigin === true);
    console.log(startPos.pos[0], startPos.pos[1]);
    setStartPosition([startPos.pos[0], startPos.pos[1], 'N']);
  }, []);


  const handleChange = e => {
    setInstructions(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    if(!instructions.trim()) {return}

    let newRobot;
    if(robotsRemaining > 0) {
      newRobot = new Robot(robotsRemaining, collectiveRobotConsciousness, startPosition);
      setRobotsRemaining(robotsRemaining => robotsRemaining -= 1);
    }else {
      return;
    }

    const returnedRobot = sendRobot([50, 20], newRobot.startPosition, instructions, newRobot, grid);
    if(returnedRobot.status === 'lost') {collectiveRobotConsciousness.push(`${returnedRobot.lastPosition}`)}
    console.log('pushing: ', `${returnedRobot.lastPosition}`);
    robots.push(returnedRobot);
    console.log(returnedRobot);
  }

  return (
    <div className="App">
      <FlexWrapper direction='column'>
        <Grid grid={grid} startPosition={startPosition} robots={robots}/>
        <form onSubmit={handleSubmit}>
          <input type='text' onChange={handleChange} value={instructions}/>
          <button type='submit' >Send</button>
        </form>
      </FlexWrapper>
    </div>
  );
}

export default App;
