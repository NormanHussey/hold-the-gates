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
      this.path = game.findPath(game.world, game.sprites, [this.x, this.y], this.goal);
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
    let xDir, yDir;
    if (this.x < prevX) {
      xDir = 1;
    } else {
      xDir = -1;
    }

    if (this.y < prevY) {
      yDir = 1;
    } else {
      yDir = -1;
    }

    let goal = [];
    let dist = 1;
    while (goal.length === 0) {

      if (game.world[prevX - (dist * xDir)][prevY - (dist * yDir)] <= game.maxWalkableTileNum) {
        goal = [prevX - (dist * xDir), prevY - (dist * yDir)];
      } else if (game.world[prevX][prevY - (dist * yDir)] <= game.maxWalkableTileNum) {
        goal = [prevX, prevY - (dist * yDir)];
      } else if (game.world[prevX - (dist * xDir)][prevY] <= game.maxWalkableTileNum) {
        goal = [prevX - (dist * xDir), prevY];
      } else if (game.world[prevX + (dist * xDir)][prevY - (dist * yDir)] <= game.maxWalkableTileNum) {
        goal = [prevX + (dist * xDir), prevY - (dist * yDir)];
      } else if (game.world[prevX - (dist * xDir)][prevY + (dist * yDir)] <= game.maxWalkableTileNum) {
        goal = [prevX - (dist * xDir), prevY + (dist * yDir)];
      } else if (game.world[prevX + (dist * xDir)][prevY] <= game.maxWalkableTileNum) {
        goal = [prevX + (dist * xDir), prevY];
      } else if (game.world[prevX][prevY + (dist * yDir)] <= game.maxWalkableTileNum) {
        goal = [prevX, prevY + (dist * yDir)];
      } else if (game.world[prevX + (dist * xDir)][prevY + (dist * yDir)] <= game.maxWalkableTileNum) {
        goal = [prevX + (dist * xDir), prevY + (dist * yDir)];
      } else {
        dist++;
      }

    }
    this.goal = goal;
    this.path = game.findPath(game.world, game.sprites, [this.x, this.y], this.goal);

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