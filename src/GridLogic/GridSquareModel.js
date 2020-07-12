class GridSquareModel {
  isOrigin = false;
  show = true;
  occupants = [];

  constructor(index, pos, terrain) {
    this.pos = pos;
    this.terrain = terrain;
    this.index = index;
  }
}

export default GridSquareModel;
