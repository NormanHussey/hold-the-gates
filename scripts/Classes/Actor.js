class Actor {
  constructor(x, y, path = []) {
    this.x = x;
    this.y = y;
    this.path = path;
    this.moving = false;
  }

  move() {
    if (this.path.length > 0) {
      this.x = this.path[0][0];
      this.y = this.path[0][1];
      this.path.shift();
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