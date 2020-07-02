import Robot from './helpers/Robot';
import missionControl from './helpers/missionControl.js';


const handleCreateId = () => {
  let id = 0;
  return () => {
    return id += 1;
  }
}
const newId = handleCreateId();

const inputs = [...args];
const grid = inputs.splice(0, 2);
const log = [];

let collectiveRobotConsciousness = [];

// Continue running until inputs have all been removed
while(inputs.length > 0) {
  const robot = new Robot(newId(), collectiveRobotConsciousness);

  // After grid is removed, startPosition takes the next 3 values
  const startPosition = inputs.splice(0, 3);

  // Instructions takes the next 1 value
  const instructions = inputs.shift();
  
  // Convert values before starting
  const convertedValues = convertInputs(grid, startPosition, instructions);

  const robotResponse = missionControl(convertedValues[0], convertedValues[1], convertedValues[2], robot);

  if(robotResponse.status === 'lost') {collectiveRobotConsciousness.push(robotResponse.finalPosition);}

  log.push(robot);
}

// console.log('FINAL: ', log);
console.log('log', log);
