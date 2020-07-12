import React, { useState, useEffect } from 'react';

import { createRobot, executeInstruction } from './logic/missionControl';
import Terminal from './containers/Terminal';
import Grid from './GridLogic/GridGenerator';
import FlexWrapper from './components/FlexWrapper';

const App = () => {
  const [grid, setGrid] = useState([]);
  const [startPosition, setStartPosition] = useState([]);

  const [robotsRemaining, setRobotsRemaining] = useState(10);
  const [robots, setRobots] = useState([]);
  const [lastLog, setLastLog] = useState([]);
  const [collectiveRobotConsciousness, setCollectiveRobotConsciousness] = useState([]);

  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    let startPos = Grid.find((gridSquare) => gridSquare.isOrigin === true);

    setStartPosition([startPos.pos[0], startPos.pos[1], 'N']);
    setGrid([...Grid]);
  }, []);

  const handleChange = (e) => {
    setInstructions(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!instructions.trim()) return;
    const instructionsArray = instructions.split('');

    let newRobot = createRobot(collectiveRobotConsciousness, startPosition);
    setRobotsRemaining((robotsRemaining) => (robotsRemaining -= 1));

    console.log(newRobot);
    for (let i = 0; i < instructionsArray.length; i++) {
      const returnedRobot = executeInstruction(
        [50, 20],
        newRobot.lastPosition,
        instructionsArray[i],
        newRobot,
        grid
      );

      if (returnedRobot.status === 'lost') {
        let tempMemory = [...collectiveRobotConsciousness];
        tempMemory.push(`${returnedRobot.lastPosition}`);
        setCollectiveRobotConsciousness([...tempMemory]);
        break;
      } else if (returnedRobot.status === 'stranded') {
        break;
      }
    }

    setRobots([...robots, newRobot]);
    setLastLog(newRobot.log);
  };

  return (
    <div className="App">
      <FlexWrapper direction="column">
        <Terminal grid={grid} startPosition={startPosition} robots={robots} lastLog={lastLog} />
        <form onSubmit={handleSubmit}>
          <input type="text" onChange={handleChange} value={instructions} />
          <button type="submit">Send</button>
        </form>
      </FlexWrapper>
    </div>
  );
};

export default App;
