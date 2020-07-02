import GridSquareModel from './GridSquareModel';
import getSurrounding from './helpers/getSurrounding';

// 50% chance for dirt because this is Mars after all
const terrains = [
  'dirt',
  'grass',
  'dirt',
  'water',
]

const terrainPicker = (terrainsArr, previousTerrain) => {
  const terrains = [...terrainsArr];

  switch(previousTerrain) {
    case 'water':
      terrains.splice(0, 0, 'grass', 'grass');
      break;
    case 'grass':
      terrains.splice(0, 0, 'dirt', 'grass');
      break;
    case 'dirt':
    default:
      terrains.splice(0, 0, 'dirt', 'dirt');
      break;
  }

  const randNum = Math.floor(Math.random() * terrains.length);
  
  return terrains[randNum];
}

const setInitialGrid = () => {
  const gridArray = [];
  let index = 0;

  for(let y=0;y<20;y++) {
    for(let x=0;x<50;x++) {
      const pos = [x, y];
      if(gridArray.length === 0) {
        gridArray.push(new GridSquareModel(index, pos, terrainPicker(terrains, 'dirt')));
      }else {
        gridArray.push(new GridSquareModel(index, pos, terrainPicker(terrains, gridArray[gridArray.length - 1].terrain)));
      }
      index++;
    }
  }

  let startIdx;
  while(!startIdx || gridArray[startIdx].terrain === 'water') {
    startIdx = Math.floor(Math.random() * 1000); 
  }
  gridArray[startIdx].isOrigin = true;
  gridArray[startIdx].show = true;

  return gridArray;
}

const placeVoids = (array) => {
  const gridArray = [...array];
  let totalVoids = 20;

  while(totalVoids > 0) {
    const newVoid = Math.floor(Math.random() * 1000);
    const surroundingGridIndexes = getSurrounding(newVoid, 50, 1000);

    if(gridArray[newVoid].terrain !== 'void' && 
        gridArray[newVoid].isOrigin === false &&
        surroundingGridIndexes.every(gridIdx => {
          return gridArray[gridIdx].terrain !== 'void' && gridArray[newVoid].isOrigin === false;
        })) 
    {
      gridArray[newVoid].terrain = 'void';
      surroundingGridIndexes.forEach(gridIdx => {
        gridArray[gridIdx].terrain = 'cliff';
      });
      totalVoids--;
    }
  }

  return gridArray;
}

const initialGrid = setInitialGrid();
const gridArray = placeVoids(initialGrid);

export default gridArray;