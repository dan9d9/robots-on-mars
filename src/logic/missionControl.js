import Robot from './RobotModel';

const newIdHandler = () => {
  let id = 0;
  return () => {
    id += 1;
    return id;
  };
};
const createNewId = newIdHandler();

export const createRobot = (consciousness, startPos) => {
  return new Robot(createNewId(), consciousness, startPos);
};

export const executeInstruction = (
  gridXY = [5, 3],
  startPosition = [0, 0, 'E'],
  instruction = 'R',
  robot,
  grid
) => {
  const gridSquaresArray = [...grid];
  const [gridWidth, gridHeight] = gridXY;
  const N = 'N',
    E = 'E',
    S = 'S',
    W = 'W',
    L = 'L',
    R = 'R',
    F = 'F';
  const newOrientationKey = {
    N: {
      L: W,
      R: E,
    },
    E: {
      L: N,
      R: S,
    },
    S: {
      L: E,
      R: W,
    },
    W: {
      L: S,
      R: N,
    },
  };

  const getNewPosition = (currentPosition, currentOrientation) => {
    switch (currentOrientation) {
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
  };

  let currentOrientation = startPosition[2];
  let currentPosition = [startPosition[0], startPosition[1]];
  let newPosition;
  const lavaPitLocations = gridSquaresArray.filter(
    (gridSquare) => gridSquare.terrain === 'lavaPit'
  );

  /** Check if current position and orientation are in collective memory
   If true and instruction is to move forward, ignore instruction */
  if (robot.memory.includes(`${currentPosition[0]},${currentPosition[1]},${currentOrientation}`)) {
    if (instruction === F) {
      robot.log.push('Ignore order to move forward');
      return robot;
    }
  }

  // Otherwise, if you don't smell any dead robot friends charge ahead blindly!
  if (instruction === F) {
    newPosition = getNewPosition(currentPosition, currentOrientation);
    const currentSquare = gridSquaresArray.find(
      (gridSquare) => gridSquare.pos[0] === newPosition[0] && gridSquare.pos[1] === newPosition[1]
    );

    if (
      newPosition[0] > gridWidth ||
      newPosition[0] < 0 ||
      newPosition[1] > gridHeight ||
      newPosition[1] < 0
    ) {
      // Oh no you charged ahead blindly into the abyss!
      robot.status = 'lost';
      robot.log.push(
        `[${currentPosition[0]}, ${currentPosition[1]}, ${currentOrientation}] to [${newPosition[0]}, ${newPosition[1]}, ${currentOrientation}] abyss`
      );

      return robot;
    } else {
      currentSquare.show = true;

      robot.log.push(
        `[${currentPosition[0]}, ${currentPosition[1]}, ${currentOrientation}] to [${newPosition[0]}, ${newPosition[1]}, ${currentOrientation}] ${currentSquare.terrain}`
      );

      if (currentSquare.terrain === 'lavaPit') {
        // Oh no you charged ahead blindly into a lavaPit!
        robot.status = 'lost';
      } else if (currentSquare.terrain === 'water') {
        // Oh no you charged ahead blindly into some water! You'll need to be rescued.
        robot.status = 'stranded';
        currentPosition = newPosition;
      } else {
        // Safe for now
        currentPosition = newPosition;
      }
    }
  } else if (instruction === L || instruction === R) {
    let prevOrientation = currentOrientation;

    currentOrientation = newOrientationKey[currentOrientation][instruction];

    robot.log.push(
      `[${currentPosition[0]}, ${currentPosition[1]}, ${prevOrientation}] to [${currentPosition[0]}, ${currentPosition[1]}, ${currentOrientation}]`
    );
  }

  robot.lastPosition = [currentPosition[0], currentPosition[1], currentOrientation];

  return robot;
};
