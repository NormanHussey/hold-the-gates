class Worker extends Actor {
  constructor(id, x, y, goal = [], sprite = 8, speed = 200, capacity = 5) {
    super(id, x, y, goal, sprite, speed);
    this.capacity = capacity;
    this.working = false;
    this.returning = false;
    this.work = {
      type: null,
      obj: null,
      location: [],
      holding: [],
      interval: false
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
        if (this.work.type !== null) {
          this.gatherResources();
        } else if (this.work.obj !== null) {
          this.repairStructure();
        }
      } else if (this.returning) {
        this.unloadResources();
      }
    });
  }

  repairStructure() {
    this.work.interval = setInterval(() => {
      if (this.work.obj.health < this.work.obj.maxHealth) {
        this.work.obj.repair(1);
        this.drawSelf();
      } else {
        clearInterval(this.work.interval);
        this.work.interval = false;
        this.working = false;
      }
    }, this.speed * 4);
  }

  gatherResources() {
    this.work.interval = setInterval(() => {
      if (this.work.holding.length >= this.capacity) {
        // console.log(this.work.holding);
        clearInterval(this.work.interval);
        this.work.interval = false;
        this.returnHome();
      } else {
        this.work.holding.push(this.work.type);
      }
    }, this.speed * 4);
  }

  returnHome() {
    this.working = false;
    this.returning = true;
    this.setGoal([this.home.x, this.home.y]);
    this.move();
  }

  unloadResources() {
    this.work.interval = setInterval(() => {
      if (this.work.holding.length === 0) {
        clearInterval(this.work.interval);
        this.work.interval = false;
        this.returning = false;
        this.working = true;
        this.setGoal(this.work.location);
        this.move();
      } else {
        const resource = this.work.holding.pop();
        game.base.inventory[resource]++;
        game.updateDisplay();
      }
    }, this.speed * 2);
  }

}