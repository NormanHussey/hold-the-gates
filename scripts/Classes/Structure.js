class Structure {
  constructor(id, x, y, width = 1, height = 1, sprite = 7, maxHealth = 10) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sprite = sprite;
    this.maxHealth = maxHealth;
    this.health = 1;
    game.sprites[this.x][this.y] = this.sprite;
    this.drawSelf();
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  repair(amount) {
    this.health += amount;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }

  destroy() {
    game.sprites[this.x][this.y] = 0;
    // delete this;
  }

  drawSelf() {
    game.drawSprites();
  }
}