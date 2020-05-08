class Worker extends Actor {
  constructor(x, y, goal = [], sprite = 6, speed = 150) {
    super(x, y, goal, sprite, speed);
  }
}