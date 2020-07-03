import GridSquareModel from './GridSquareModel';
import getSurrounding from './helpers/getSurrounding';

// Base 60% chance for dirt because this is Mars after all
const DIRT_PERCENTAGE = 60;
const GRASS_PERCENTAGE = 30;
const WATER_PERCENTAGE = 100 - (DIRT_PERCENTAGE + GRASS_PERCENTAGE);

const terrains = Array(100).fill('').map((ele, idx) => {
  if(idx < DIRT_PERCENTAGE) {
    ele = 'dirt';
  }else if(idx >= DIRT_PERCENTAGE && idx < (100 - WATER_PERCENTAGE)) {
    ele = 'grass';
  }else {
    ele = 'water';
  }

  return ele;
});

const terrainPicker = (terrainsArr, previousTerrain) => {
  let terrains = [...terrainsArr];

  switch(previousTerrain) {
    case 'water':
      terrains.splice(0, 0, ...Array(30).fill('grass'));
      break;
    case 'grass':
      terrains.splice(0, 0, ...Array(15).fill('grass'), ...Array(15).fill('dirt'));
      break;
    case 'dirt':
    default:
      terrains.splice(0, 0, ...Array(30).fill('dirt'));
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

  return gridArray;
}

const createLake = (array) => {
  const gridArray = [...array];

  const waterSquares = gridArray.filter(grid => grid.terrain === 'water');
  const randomWaterSquare = Math.floor(Math.random() * waterSquares.length);
  const surroundingWaterSquares = getSurrounding(randomWaterSquare, 50, 1000);

  gridArray[randomWaterSquare].terrain = 'water';
  surroundingWaterSquares.forEach(square => gridArray[square].terrain = 'water');

  return gridArray;
}

const placeLavaPits = (array, lavaPits) => {
  const gridArray = [...array];
  let totalLavaPits = lavaPits;

  while(totalLavaPits > 0) {
    const newLavaPit = Math.floor(Math.random() * 1000);
    const surroundingGridIndexes = getSurrounding(newLavaPit, 50, 1000);

    if(gridArray[newLavaPit].terrain !== 'lavaPit' && 
        gridArray[newLavaPit].isOrigin === false &&
        surroundingGridIndexes.every(gridIdx => {
          return gridArray[gridIdx].terrain !== 'lavaPit' && gridArray[newLavaPit].isOrigin === false;
        })) 
    {
      gridArray[newLavaPit].terrain = 'lavaPit';
      surroundingGridIndexes.forEach(gridIdx => {
        gridArray[gridIdx].terrain = 'cliff';
      });
      totalLavaPits--;
    }
  }

  return gridArray;
}

const placeStartPos = (array) => {
  const gridArray = [...array];

  let startIdx;
  while(!startIdx || 
    gridArray[startIdx].terrain === 'water' || 
    gridArray[startIdx].terrain === 'lavaPit') 
  {
    startIdx = Math.floor(Math.random() * 1000); 
  }

  gridArray[startIdx].isOrigin = true;
  gridArray[startIdx].show = true;

  return gridArray;
}

const initialGrid = setInitialGrid();
const gridWithLava = placeLavaPits(initialGrid, 15); //(gridArray, numOfLavaPits)
const gridWithLavaAndLake = createLake(gridWithLava);
const finalGrid = placeStartPos(gridWithLavaAndLake);

export default finalGrid;