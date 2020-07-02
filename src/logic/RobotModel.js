class Robot {
  id;
  status = 'active';
  log = [];
  lastPosition = 'origin';
  memory = [];

  constructor(id, collectiveRobotConsciousness, startPosition) {
    this.id = id;
    this.memory = [...collectiveRobotConsciousness];
    this.startPosition = startPosition;
  }
}

export default Robot;