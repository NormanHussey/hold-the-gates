class Worker extends Actor {
  constructor(x, y, goal = [], sprite = 6, speed = 200, capacity = 5) {
    super(x, y, goal, sprite, speed);
    this.capacity = capacity;
    this.working = false;
    this.work = {
      type: null,
      location: [],
      holding: 0,
      interval: null
    }
    this.home = {
      x: game.base.keep.x,
      y: game.base.keep.y
    }
  }

  move() {
    super.move(() => {
      if (this.working) {
        this.performWork();
      }
    });
  }

  performWork() {
    this.work.interval = setInterval(() => {
      if (this.work.holding >= this.capacity) {
        clearInterval(this.work.interval);
        this.returnHome();
      } else {
        this.work.holding++;
        console.log(this.work.holding);
      }
    }, this.speed);
    
  }

  returnHome() {
    this.goal = [this.home.x, this.home.y];
    this.move();
  }

}