class Worker extends Actor {
  constructor(x, y, goal = [], sprite = 6, speed = 200, capacity = 5) {
    super(x, y, goal, sprite, speed);
    this.capacity = capacity;
    this.working = false;
    this.returning = false;
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

  update() {
    if (!this.moving) {
      this.move();
    }
  }

  move() {
    super.move(() => {
      if (this.working) {
        this.performWork();
      } else if (this.returning) {
        this.unloadResources();
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
      }
    }, this.speed * 4);
    
  }

  returnHome() {
    this.working = false;
    this.returning = true;
    this.goal = [this.home.x, this.home.y];
    this.move();
  }

  unloadResources() {
    this.work.interval = setInterval(() => {
      if (this.work.holding === 0) {
        clearInterval(this.work.interval);
        this.returning = false;
        this.working = true;
        this.goal = this.work.location;
        this.move();
      } else {
        this.work.holding--;
        game.base.inventory[this.work.type]++;
        game.updateDisplay();
      }
    }, this.speed * 2);
  }

}