import React, { useState, useEffect } from 'react';

import { createRobot, executeInstruction } from './logic/missionControl';
import Terminal from './containers/Terminal';
import Grid from './GridLogic/GridGenerator';
import FlexWrapper from './components/FlexWrapper';

const App = () => {
  const [grid, setGrid] = useState([]);
  const [startPosition, setStartPosition] = useState([]);

  const [robotsRemaining, setRobotsRemaining] = useState(10);
  const [deployedRobots, setDeployedRobots] = useState([]);
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

    let instructionIdx = 0;
    function instructionLoop() {
      let exit = false;

      setTimeout(() => {
        newRobot = executeInstruction(
          [50, 20],
          newRobot.lastPosition,
          instructionsArray[instructionIdx],
          newRobot,
          grid
        );

        if (newRobot.status === 'lost') {
          let tempMemory = [...collectiveRobotConsciousness];
          tempMemory.push(`${newRobot.lastPosition}`);
          setCollectiveRobotConsciousness([...tempMemory]);
          exit = true;
        } else if (newRobot.status === 'stranded') {
          exit = true;
        }
        setDeployedRobots([...deployedRobots, newRobot]);
        setLastLog(newRobot.log);
        instructionIdx++;

        if (instructionIdx < instructionsArray.length && exit === false) {
          instructionLoop();
        }
      }, 500);
    }

    instructionLoop();
  };

  useEffect(() => {
    console.log('deployed: ', deployedRobots);
  }, [deployedRobots]);

  return (
    <div className="App">
      <FlexWrapper direction="column">
        <Terminal
          grid={grid}
          startPosition={startPosition}
          deployedRobots={deployedRobots}
          lastLog={lastLog}
        />
        <form onSubmit={handleSubmit}>
          <input type="text" onChange={handleChange} value={instructions} />
          <button type="submit">Send</button>
        </form>
      </FlexWrapper>
    </div>
  );
};

export default App;
