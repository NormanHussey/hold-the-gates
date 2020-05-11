class Actor {
  constructor(id, x, y, goal = [], sprite, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.speed = speed;
    game.sprites[this.x][this.y] = this.sprite;
    this.path = [];
    this.goal = goal;
    this.mainGoal = goal;
    this.moving = false;
  }

  setGoal(newGoal) {
    this.goal = newGoal;
    this.mainGoal = newGoal;
  }

  move(goalReached = () => {}) {
    if (this.goal.length > 0) {
      this.moving = true;
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
          this.moving = false;
          this.goal = [];
          this.path = [];
          goalReached();
        }
      }
      this.drawSelf();
    }
  }

  findNextNearestGoal() {
    let prevX = this.mainGoal[0];
    let prevY = this.mainGoal[1];
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
      
      if (game.world[prevX][prevY - (dist * yDir)] <= game.maxWalkableTileNum && game.sprites[prevX][prevY - (dist * yDir)] <= game.maxWalkableTileNum) {
        goal = [prevX, prevY - (dist * yDir)];
      } else if (game.world[prevX - (dist * xDir)][prevY] <= game.maxWalkableTileNum && game.sprites[prevX - (dist * xDir)][prevY] <= game.maxWalkableTileNum) {
        goal = [prevX - (dist * xDir), prevY];
      } else if (game.world[prevX - (dist * xDir)][prevY - (dist * yDir)] <= game.maxWalkableTileNum && game.sprites[prevX - (dist * xDir)][prevY - (dist * yDir)] <= game.maxWalkableTileNum) {
        goal = [prevX - (dist * xDir), prevY - (dist * yDir)];
      } else if (game.world[prevX + (dist * xDir)][prevY - (dist * yDir)] <= game.maxWalkableTileNum && game.sprites[prevX + (dist * xDir)][prevY - (dist * yDir)] <= game.maxWalkableTileNum) {
        goal = [prevX + (dist * xDir), prevY - (dist * yDir)];
      } else if (game.world[prevX - (dist * xDir)][prevY + (dist * yDir)] <= game.maxWalkableTileNum && game.sprites[prevX - (dist * xDir)][prevY + (dist * yDir)] <= game.maxWalkableTileNum) {
        goal = [prevX - (dist * xDir), prevY + (dist * yDir)];
      } else if (game.world[prevX + (dist * xDir)][prevY] <= game.maxWalkableTileNum && game.sprites[prevX + (dist * xDir)][prevY] <= game.maxWalkableTileNum) {
        goal = [prevX + (dist * xDir), prevY];
      } else if (game.world[prevX][prevY + (dist * yDir)] <= game.maxWalkableTileNum && game.sprites[prevX][prevY + (dist * yDir)] <= game.maxWalkableTileNum) {
        goal = [prevX, prevY + (dist * yDir)];
      } else if (game.world[prevX + (dist * xDir)][prevY + (dist * yDir)] <= game.maxWalkableTileNum && game.sprites[prevX + (dist * xDir)][prevY + (dist * yDir)] <= game.maxWalkableTileNum) {
        goal = [prevX + (dist * xDir), prevY + (dist * yDir)];
      } else {
        dist++;
      }
      // console.log(this.id, this.goal);

    }
    this.goal = goal;
    this.path = game.findPath(game.world, game.sprites, [this.x, this.y], this.goal);
    // console.log(this.id, this.path);
  }

  drawSelf() {
    game.drawSprites();
    if (this.goal.length > 0) {
      // console.log(this.id, 'about to move', this.path);
      setTimeout(() => {
        this.move();
      }, this.speed);
    }
  }


}