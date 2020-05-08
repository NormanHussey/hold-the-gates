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
    if (this.goal.length > 0) {
      game.sprites[this.x][this.y] = 0;
      this.path = game.findPath(game.world, game.sprites, [this.x, this.y], this.goal);
      this.path.shift();
      if (this.path.length === 0) {
        game.sprites[this.x][this.y] = this.sprite;
        this.findNextNearestGoal();
      } else {
        this.x = this.path[0][0];
        this.y = this.path[0][1];
        game.sprites[this.x][this.y] = this.sprite;
        if (this.x === this.goal[0] && this.y === this.goal[1]) {
          this.goal = [];
          this.path = [];
          if (this.working) {
            this.performWork();
          }
        }
      }
      this.drawSelf();
    }
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