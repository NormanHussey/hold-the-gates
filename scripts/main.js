const game = {};

game.world = [[]];
game.sprites = [[]];
game.gui = [[]];

game.findPath = findPath;

game.worldWidth = 24;
game.worldHeight = 24;

game.tileWidth = 32;
game.tileHeight = 32;

game.maxWalkableTileNum = 2;

game.selectedTile = [];
game.endTile = [];

game.selectedActor = -1;

game.display = {};

game.base = {};

game.base.keep = {
	x: 12,
	y: 12,
	sprite: 7,
	health: 100,
	maxHealth: 100
};

game.base.inventory = {
	wood: 0,
	stone: 0,
	gold: 0,
	food: 0
};

game.base.workers = [];

game.resources = {};

// Helper functions
game.probability = (n) => {
  return n > 0 && Math.random() <= n;
};

// Setup functions
game.canvasClick = (e) => {
	const clickX = e.clientX - e.target.offsetLeft;
	const clickY = e.clientY - e.target.offsetTop;
	const x = Math.floor(clickX / game.tileWidth);
	const y = Math.floor(clickY / game.tileHeight);
	if (game.selectedActor !== -1) {
		// 	if (x === game.selectedTile[0] && y === game.selectedTile[1]) {
		// 		game.selectedTile = [];
		// 	}	else {
		// 		game.selectedTile = [x, y];
		// 	}
		// } else {
			game.endTile = [x, y];
		}
		// game.drawGUI();
	for (let i = 0; i < game.base.workers.length; i++) {
		if (game.base.workers[i].x === x && game.base.workers[i].y === y) {
			if (game.selectedActor !== i) {
				game.selectedActor = i;
				// game.displaySelected.innerText = i;
			} else {
				game.selectedActor = -1;
				// game.displaySelected.innerText = '';
			}
		}
	}
}

game.goToPath = () => {
	for (let i = 0; i < game.base.workers.length; i++) {
		game.base.workers[i].move();
	}
}

game.setPlace = () => {
	game.base.workers.push(new Actor(game.base.workers.length, game.selectedTile[0], game.selectedTile[1], []));
	// game.drawSprites();
}

game.unselectAll = () => {
	game.selectedActor = -1;
	game.selectedTile = [];
	game.endTile = [];
	// game.displaySelected.innerText = '';
	// game.drawGUI();
}

game.setGoal = () => {
	if (game.selectedActor !== -1 && game.endTile.length > 0) {
		const worker = game.base.workers[game.selectedActor];
		// console.log(game.endTile);
		worker.setGoal(game.endTile);
		if (game.resources[`${game.endTile[0]}${game.endTile[1]}`]) {
			if (worker.work.interval) {
				clearInterval(worker.work.interval);
			}
			worker.work.type = game.resources[`${game.endTile[0]}${game.endTile[1]}`];
			worker.work.location = game.endTile;
			worker.working = true;
		} else {
			if (worker.work.interval) {
				clearInterval(worker.work.interval);
			}
			worker.working = false;
			worker.returning = false;
		}
	}
	game.unselectAll();
};

game.updateDisplay = () => {
	game.display.wood.innerText = game.base.inventory.wood;
	game.display.stone.innerText = game.base.inventory.stone;
	game.display.gold.innerText = game.base.inventory.gold;
	game.display.food.innerText = game.base.inventory.food;
}

game.getElements = () => {
	// game.displaySelected = document.querySelector('#selected');
	game.display.wood = document.querySelector('#woodInventory');
	game.display.stone = document.querySelector('#stoneInventory');
	game.display.gold = document.querySelector('#goldInventory');
	game.display.food = document.querySelector('#foodInventory');

	game.go = document.querySelector('#go');
	game.go.addEventListener('click', game.goToPath);

	game.place = document.querySelector('#place');
	game.place.addEventListener('click', game.setPlace);

	game.unselect = document.querySelector('#unselect');
	game.unselect.addEventListener('click', game.unselectAll);

	game.goalBtn = document.querySelector('#goal');
	game.goalBtn.addEventListener('click', game.setGoal);

  game.canvasWorld = document.querySelector('#worldCanvas');
	game.canvasWorld.width = game.worldWidth * game.tileWidth;
	game.canvasWorld.height = game.worldHeight * game.tileHeight;
  game.ctxWorld = game.canvasWorld.getContext("2d");
	
  game.canvasSprites = document.querySelector('#spritesCanvas');
	game.canvasSprites.width = game.worldWidth * game.tileWidth;
	game.canvasSprites.height = game.worldHeight * game.tileHeight;
	game.ctxSprites = game.canvasSprites.getContext("2d");
	// game.canvasSprites.addEventListener("click", game.canvasClick);

  game.canvasGUI = document.querySelector('#guiCanvas');
	game.canvasGUI.width = game.worldWidth * game.tileWidth;
	game.canvasGUI.height = game.worldHeight * game.tileHeight;
	game.ctxGUI = game.canvasGUI.getContext("2d");
	game.canvasGUI.addEventListener("click", game.canvasClick);

  game.spritesheet = new Image();
	game.spritesheet.src = 'data:image/png;base64,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';
	game.spritesheet.loaded = false;
	game.spritesheet.onload = setSpriteSheetReady;
}

async function setSpriteSheetReady () {
	const ready = new Promise(resolve => {
		game.spritesheet.loaded = true;
		game.createWorld();
	});
	await ready;
}

game.buildRandomStone = (n) => {
	for (let x = 0; x < game.worldWidth; x++) {
		for (let y = 0; y < game.worldHeight; y++) {
			if ((x < game.base.keep.x - 2 || x > game.base.keep.x + 2) && (y < game.base.keep.y - 2 || y > game.base.keep.y + 2)) {
				if (game.probability(n)) {
					game.world[x][y] = 3;
					game.resources[`${x}${y}`] = 'stone';
				}
			}
    }
  }
}

game.buildRandomForests = (n) => {
	for (let x = 0; x < game.worldWidth; x++) {
		for (let y = 0; y < game.worldHeight; y++) {
			if ((x < game.base.keep.x - 2 || x > game.base.keep.x + 2) && (y < game.base.keep.y - 2 || y > game.base.keep.y + 2)) {
				if (game.probability(n)) {
					game.world[x][y] = 4;
					game.resources[`${x}${y}`] = 'wood';
				}
			}
    }
  }
}

game.buildRandomFood = (n) => {
	for (let x = 0; x < game.worldWidth; x++) {
		for (let y = 0; y < game.worldHeight; y++) {
			if ((x < game.base.keep.x - 2 || x > game.base.keep.x + 2) && (y < game.base.keep.y - 2 || y > game.base.keep.y + 2)) {
				if (game.probability(n)) {
					game.world[x][y] = 5;
					game.resources[`${x}${y}`] = 'food';
				}
			}
    }
  }
}

game.buildRandomGold = (n) => {
	for (let x = 0; x < game.worldWidth; x++) {
		for (let y = 0; y < game.worldHeight; y++) {
			if ((x < game.base.keep.x - 2 || x > game.base.keep.x + 2) && (y < game.base.keep.y - 2 || y > game.base.keep.y + 2)) {
				if (game.probability(n)) {
					game.world[x][y] = 6;
					game.resources[`${x}${y}`] = 'gold';
				}
			}
    }
  }
}

game.drawWorld = () => {
	game.ctxWorld.fillStyle = '#000000';
	game.ctxWorld.fillRect(0, 0, game.canvasWorld.width, game.canvasWorld.height);

	for (let x = 0; x < game.worldWidth; x++) {
		for (let y = 0; y < game.worldHeight; y++) {
			const spriteNum = game.world[x][y];

			game.ctxWorld.drawImage(game.spritesheet,
			spriteNum * game.tileWidth, 0,
			game.tileWidth, game.tileHeight,
			x * game.tileWidth, y * game.tileHeight,
			game.tileWidth, game.tileHeight);

		}
	}
}

game.drawSprites = () => {
	game.ctxSprites.clearRect(0, 0, game.canvasSprites.width, game.canvasSprites.height);
	for (let x = 0; x < game.worldWidth; x++) {
		for (let y = 0; y < game.worldHeight; y++) {
			const spriteNum = game.sprites[x][y];

			game.ctxSprites.drawImage(game.spritesheet,
				spriteNum * game.tileWidth, 0,
				game.tileWidth, game.tileHeight,
				x * game.tileWidth, y * game.tileHeight,
				game.tileWidth, game.tileHeight);
		}
	}
}

game.drawGUI = () => {
	game.ctxGUI.clearRect(0, 0, game.canvasGUI.width, game.canvasGUI.height);
	for (let x = 0; x < game.worldWidth; x++) {
		for (let y = 0; y < game.worldHeight; y++) {
			let spriteNum = game.gui[x][y];

			if ((x === game.selectedTile[0] && y === game.selectedTile[1]) || (x === game.endTile[0] && y === game.endTile[1]) || (game.selectedActor !== -1 && game.base.workers[game.selectedActor].x === x && game.base.workers[game.selectedActor].y === y)) {
				spriteNum = 1;
			}

			if ((game.selectedActor !== -1 && game.base.workers[game.selectedActor].x === x && game.base.workers[game.selectedActor].y === y)) {
				const worker = game.base.workers[game.selectedActor];
				game.ctxGUI.fillText(`${worker.id},m:${worker.moving}`, x * game.tileWidth, y * game.tileHeight);
			}

			game.ctxGUI.drawImage(game.spritesheet,
				spriteNum * game.tileWidth, 0,
				game.tileWidth, game.tileHeight,
				x * game.tileWidth, y * game.tileHeight,
				game.tileWidth, game.tileHeight);
		}
	}
}

game.placeWorkers = () => {
	game.base.workers.push(new Worker(game.base.workers.length, 11, 11, []));
	game.base.workers.push(new Worker(game.base.workers.length, 13, 13, []));
}

game.createWorld = () => {
	// create emptiness
	for (let x = 0; x < game.worldWidth; x++) {
		game.world[x] = [];
		game.sprites[x] = [];
		game.gui[x] = [];
		for (let y = 0; y < game.worldHeight; y++) {
			game.world[x][y] = 2;
			game.sprites[x][y] = 0;
			game.gui[x][y] = 0;
		}
  }
	game.buildRandomStone(0.1);
	game.buildRandomForests(0.1);
	game.buildRandomFood(0.1);
	game.buildRandomGold(0.025);
	game.sprites[game.base.keep.x][game.base.keep.y] = game.base.keep.sprite;
	game.placeWorkers();
	game.drawWorld();
	game.drawSprites();
	game.drawGUI();
}

game.update = () => {
	game.drawGUI();
	for (let i = 0; i < game.base.workers.length; i++) {
		game.base.workers[i].update();
	}
	requestAnimationFrame(game.update);
}


game.init = () => {
	game.getElements();
	window.requestAnimationFrame(game.update);
}

// Document Ready
if(document.readyState === 'complete') {
	game.init();
} else {
	document.addEventListener('DOMContentLoaded', game.init);
};