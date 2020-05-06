class Actor {
  constructor(x, y, goal = []) {
    this.x = x;
    this.y = y;
    game.world[this.x][this.y] = 4;
    this.path = [];
    this.goal = goal;
  }

  move() {
    if (this.goal.length > 0) {
      game.world[this.x][this.y] = 0;
      this.path = game.findPath(game.world, [this.x, this.y], [this.goal[0], this.goal[1]]);
      this.path.shift();
      this.x = this.path[0][0];
      this.y = this.path[0][1];
      game.world[this.x][this.y] = 4;
      if (this.x === this.goal[0] && this.y === this.goal[1]) {
        this.goal = [];
        this.path = [];
      }
      this.drawSelf();
    }
  }

  drawSelf() {
    const self = this;
    game.drawWorld();
    if (this.path.length > 0) {
      setTimeout(function () {
        self.move();
      }, 200);
    }
  }


}