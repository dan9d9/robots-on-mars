class GridSquareModel {
  isOrigin = false;
  show = false;
  terrain = 'dirt';

  constructor(index, pos, terrain) {
    this.pos = pos;
    this.terrain = terrain;
    this.index = index;
  }
}

export default GridSquareModel;