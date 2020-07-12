import GridSquareModel from './GridSquareModel';
import getSurrounding from './getSurrounding';

class GridGenerator {
  constructor(dirt = 60, grass = 30, water = 10, lakes = 1, lavaPits = 10) {
    let adjusted_dirt;
    if (dirt + grass + water < 100) {
      adjusted_dirt = dirt + 100 - (dirt + grass + water);
    } else if (dirt + grass + water > 100) {
      throw new Error('Terrain percentages must equal to 100');
    }
    this.DIRT_PERCENTAGE = adjusted_dirt || dirt;
    this.GRASS_PERCENTAGE = grass;
    this.WATER_PERCENTAGE = water;
    this.NUMBER_OF_LAKES = lakes;
    this.NUMBER_OF_LAVA_PITS = lavaPits;
  }

  setTerrains() {
    return Array(100)
      .fill()
      .map((terrain, idx) => {
        if (idx < this.DIRT_PERCENTAGE) {
          terrain = 'dirt';
        } else if (
          idx >= this.DIRT_PERCENTAGE &&
          idx < 100 - this.WATER_PERCENTAGE
        ) {
          terrain = 'grass';
        } else {
          terrain = 'water';
        }
        return terrain;
      });
  }

  terrainPicker(terrainsArr, previousTerrain) {
    let terrains = [...terrainsArr];

    switch (previousTerrain) {
      case 'water':
        terrains.splice(0, 0, ...Array(30).fill('grass'));
        break;
      case 'grass':
        terrains.splice(
          0,
          0,
          ...Array(15).fill('grass'),
          ...Array(15).fill('dirt')
        );
        break;
      case 'dirt':
      default:
        terrains.splice(0, 0, ...Array(30).fill('dirt'));
        break;
    }

    const randNum = Math.floor(Math.random() * terrains.length);

    return terrains[randNum];
  }

  setInitialGrid(terrainArr) {
    const gridArray = [];
    let index = 0;

    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 50; x++) {
        const pos = [x, y];
        if (gridArray.length === 0) {
          gridArray.push(
            new GridSquareModel(
              index,
              pos,
              this.terrainPicker(terrainArr, 'dirt')
            )
          );
        } else {
          gridArray.push(
            new GridSquareModel(
              index,
              pos,
              this.terrainPicker(
                terrainArr,
                gridArray[gridArray.length - 1].terrain
              )
            )
          );
        }
        index++;
      }
    }

    return gridArray;
  }

  createLakes(array, numLakes) {
    let totalLakes = numLakes;
    const gridArray = [...array];
    const waterSquares = gridArray.filter((grid) => grid.terrain === 'water');
    const lakesIndexes = [];

    while (totalLakes > 0) {
      let randomWaterSquare;
      if (waterSquares.length === 0) {
        randomWaterSquare = gridArray[Math.floor(Math.random() * 1000)];
      } else {
        randomWaterSquare =
          waterSquares[Math.floor(Math.random() * waterSquares.length)];
      }

      if (lakesIndexes.includes(randomWaterSquare.index)) {
        continue;
      }
      lakesIndexes.push(randomWaterSquare.index);

      const surroundingWaterSquares = getSurrounding(
        randomWaterSquare.index,
        50,
        1000
      );

      randomWaterSquare.terrain = 'water';
      surroundingWaterSquares.forEach(
        (square) => (gridArray[square].terrain = 'water')
      );

      totalLakes--;
    }

    return gridArray;
  }

  placeLavaPits(array, numLavaPits) {
    const gridArray = [...array];
    let totalLavaPits = numLavaPits;

    while (totalLavaPits > 0) {
      const newLavaPit = Math.floor(Math.random() * 1000);
      const surroundingGridIndexes = getSurrounding(newLavaPit, 50, 1000);

      if (
        gridArray[newLavaPit].terrain !== 'lavaPit' &&
        gridArray[newLavaPit].isOrigin === false &&
        surroundingGridIndexes.every((gridIdx) => {
          return (
            gridArray[gridIdx].terrain !== 'lavaPit' &&
            gridArray[newLavaPit].isOrigin === false
          );
        })
      ) {
        gridArray[newLavaPit].terrain = 'lavaPit';
        surroundingGridIndexes.forEach((gridIdx) => {
          gridArray[gridIdx].terrain = 'cliff';
        });
        totalLavaPits--;
      }
    }

    return gridArray;
  }

  placeStartPos(array) {
    const gridArray = [...array];

    let startIdx;
    while (
      !startIdx ||
      gridArray[startIdx].terrain === 'water' ||
      gridArray[startIdx].terrain === 'lavaPit'
    ) {
      startIdx = Math.floor(Math.random() * 1000);
    }

    gridArray[startIdx].isOrigin = true;
    gridArray[startIdx].show = true;

    return gridArray;
  }
}

const newGrid = new GridGenerator(60, 30, 10, 5, 10);
const terrainsArr = newGrid.setTerrains();
const initialGrid = newGrid.setInitialGrid(terrainsArr);
const gridWithLakes = newGrid.createLakes(initialGrid, newGrid.NUMBER_OF_LAKES);
const gridWithLavaAndLakes = newGrid.placeLavaPits(
  gridWithLakes,
  newGrid.NUMBER_OF_LAVA_PITS
);
const finalGrid = newGrid.placeStartPos(gridWithLavaAndLakes);

export default finalGrid;
