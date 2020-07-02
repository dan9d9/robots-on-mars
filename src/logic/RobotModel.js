class Robot {
  id;
  status = 'active';
  log = [];
  memory = [];

  constructor(id, collectiveRobotConsciousness, startPosition) {
    this.id = id;
    this.memory = [...collectiveRobotConsciousness];
    this.startPosition = startPosition;
    this.lastPosition = startPosition;
  }
}

export default Robot;