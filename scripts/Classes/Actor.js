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
      if (this.path.length === 0) {
        game.world[this.x][this.y] = 4;
        this.findNextNearestGoal();
      } else {
        this.x = this.path[0][0];
        this.y = this.path[0][1];
        game.world[this.x][this.y] = 4;
        if (this.x === this.goal[0] && this.y === this.goal[1]) {
          this.goal = [];
          this.path = [];
        }
      }
      this.drawSelf();
    }
  }

  findNextNearestGoal() {
    let prevX = this.goal[0];
    let prevY = this.goal[1];
    let xChange, yChange;
    if (this.x < prevX) {
      xChange = -1;
    } else if (this.x > prevX) {
      xChange = 1;
    } else {
      xChange = 0;
    }
    if (this.y < prevY) {
      yChange = -1;
    } else if (this.y > prevY) {
      yChange = 1;
    } else {
      yChange = 0;
    }

    if (game.world[prevX + xChange][prevY + yChange] <= maxWalkableTileNum) {
      this.path = game.findPath(game.world, [this.x, this.y], [prevX + xChange, prevY + yChange]);
    } else if (game.world[prevX][prevY + yChange] <= maxWalkableTileNum) {
      this.path = game.findPath(game.world, [this.x, this.y], [prevX, prevY + yChange]);
    } else if (game.world[prevX + xChange][prevY] <= maxWalkableTileNum) {
      this.path = game.findPath(game.world, [this.x, this.y], [prevX + xChange, prevY]);
    }

  }

  drawSelf() {
    const self = this;
    game.drawWorld();
    if (this.path.length > 0) {
      setTimeout(function () {
        self.move();
      }, 100);
    }
  }


}