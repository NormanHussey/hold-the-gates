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
	sprite: 5,
	health: 100,
	maxHealth: 100
};

game.base.inventory = {
	wood: 0,
	stone: 0,
	gold: 0
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
}

game.goToPath = () => {
	for (let i = 0; i < game.base.workers.length; i++) {
		game.base.workers[i].move();
	}
}

game.setPlace = () => {
	game.base.workers.push(new Actor(game.selectedTile[0], game.selectedTile[1], []));
	game.drawSprites();
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
		// console.log(game.endTile);
		game.base.workers[game.selectedActor].goal = game.endTile;
		if (game.resources[`${game.endTile[0]}${game.endTile[1]}`]) {
			clearInterval(game.base.workers[game.selectedActor].work.interval);
			game.base.workers[game.selectedActor].work.type = game.resources[`${game.endTile[0]}${game.endTile[1]}`];
			game.base.workers[game.selectedActor].work.location = game.endTile;
			game.base.workers[game.selectedActor].working = true;
		} else {
			clearInterval(game.base.workers[game.selectedActor].work.interval);
			game.base.workers[game.selectedActor].working = false;
			game.base.workers[game.selectedActor].returning = false;
		}
	}
	game.unselectAll();
};

game.updateDisplay = () => {
	game.display.wood.innerText = game.base.inventory.wood;
	game.display.stone.innerText = game.base.inventory.stone;
	game.display.gold.innerText = game.base.inventory.gold;
}

game.getElements = () => {
	// game.displaySelected = document.querySelector('#selected');
	game.display.wood = document.querySelector('#woodInventory');
	game.display.stone = document.querySelector('#stoneInventory');
	game.display.gold = document.querySelector('#goldInventory');

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

			game.ctxGUI.drawImage(game.spritesheet,
				spriteNum * game.tileWidth, 0,
				game.tileWidth, game.tileHeight,
				x * game.tileWidth, y * game.tileHeight,
				game.tileWidth, game.tileHeight);
		}
	}
}

game.placeWorkers = () => {
	game.base.workers.push(new Worker(11, 11, []));
	game.base.workers.push(new Worker(13, 13, []));
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