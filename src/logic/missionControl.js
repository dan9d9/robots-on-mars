const loop = (grid = [5, 3], startPosition = [0, 0, 'E'], instructions = ['R', 'R', 'F'], robot, gridArray) => {
  const gridSquaresArray = [...gridArray];
  const [ gridWidth, gridHeight ] = grid;
  const N = 'N', E = 'E', S = 'S', W = 'W', L = 'L', R = 'R', F = 'F';
  const newOrientationKey = {
    N: {
      L: W,
      R: E
    },
    E: {
      L: N,
      R: S
    },
    S: {
      L: E,
      R: W
    },
    W: {
      L: S,
      R: N
    }
  }

  const getNewPosition = (currentPosition, currentOrientation) => {
    switch(currentOrientation) {
      case N:
        return [currentPosition[0], currentPosition[1] - 1];
      case E:
        return [currentPosition[0] + 1, currentPosition[1]];
      case S:
        return [currentPosition[0], currentPosition[1] + 1];
      case W:
        return [currentPosition[0] - 1, currentPosition[1]];
      default:
        return currentPosition;
    }
  }

  let currentOrientation = startPosition[2];
  let currentPosition = [startPosition[0], startPosition[1]];
  let newPosition;
  let count = 0;
  let lost = false;
  const lavaPitLocations = gridSquaresArray.filter(gridSquare => gridSquare.terrain === 'lavaPit');
  // console.log(lavaPitLocations);

  while(count < instructions.length && lost === false) {
    // If current position and orientation is same as a previously deceased robot friend and your programming
    // urges you to follow in its path, rewire circuitry and ignore current order. 
    if(robot.memory.includes(`${currentPosition[0]},${currentPosition[1]},${currentOrientation}`)) {
      if(instructions[count] === F) {
        robot.log.push('Ignore order to move forward');
        count++;
        continue;
      }
    }
 
    // Otherwise, if you don't smell any dead robot friends charge ahead blindly!
    if(instructions[count] === F) {
      newPosition = getNewPosition(currentPosition, currentOrientation);
      const currentSquare = gridSquaresArray.find(gridSquare => gridSquare.pos[0] === newPosition[0] && gridSquare.pos[1] === newPosition[1]);

      if(newPosition[0] > gridWidth || 
        newPosition[0] < 0 || 
        newPosition[1] > gridHeight || 
        newPosition[1] < 0)
        {
        // Oh no you charged ahead blindly into the abyss!
        lost = true;
        robot.status = 'lost';

        robot.log.push(`[${currentPosition[0]}, ${currentPosition[1]}, ${currentOrientation}] to [${newPosition[0]}, ${newPosition[1]}, ${currentOrientation}] abyss`);
      }else {
        currentSquare.show = true;

        robot.log.push(`[${currentPosition[0]}, ${currentPosition[1]}, ${currentOrientation}] to [${newPosition[0]}, ${newPosition[1]}, ${currentOrientation}] ${currentSquare.terrain}`);
        
        if(currentSquare.terrain === 'lavaPit') {
          // Oh no you charged ahead blindly into a lavaPit!
          lost = true;
          robot.status = 'lost';
        }else if(currentSquare.terrain === 'water') {
          // Oh no you charged ahead blindly into some water! You'll need to be rescued.
          robot.status = 'stranded';
          currentPosition = newPosition;
          break;
        }else {
          // Safe for now
          currentPosition = newPosition; 
        }
      }

    }else if(instructions[count] === L || instructions[count] === R){
      let prevOrientation = currentOrientation;

      currentOrientation = newOrientationKey[currentOrientation][instructions[count]];

      robot.log.push(`[${currentPosition[0]}, ${currentPosition[1]}, ${prevOrientation}] to [${currentPosition[0]}, ${currentPosition[1]}, ${currentOrientation}]`);
    }

    count++;
  }

  robot.lastPosition = [currentPosition[0], currentPosition[1], currentOrientation];

  return robot;
}

module.exports = loop;