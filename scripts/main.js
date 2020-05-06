const game = {};

game.world = [[]];
game.path = [];
game.findPath = findPath;

game.worldWidth = 24;
game.worldHeight = 24;

game.tileWidth = 32;
game.tileHeight = 32;

game.selectedTile = [];
game.endTile = [];

game.path = {};
game.canvas = {};

game.path.start = [game.worldWidth,game.worldHeight];
game.path.end = [0,0];
game.path.current = [];

game.actors = [];
game.selectedActor = -1;

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
	for (let i = 0; i < game.actors.length; i++) {
		if (game.actors[i].x === x && game.actors[i].y === y) {
			if (game.selectedActor !== i) {
				game.selectedActor = i;
				console.log(game.selectedActor);
			} else {
				game.selectedActor = -1;
			}
		}
	}
	if (game.selectedActor === -1) {
		if (x === game.selectedTile[0] && y === game.selectedTile[1]) {
			game.selectedTile = [];
		// } else if (x === game.endTile[0] && y === game.endTile[1]) {
		// 	game.endTile = [];
		// } else if (game.selectedTile.length > 0) {
		// 	game.endTile = [x, y];
		}	else {
			game.selectedTile = [x, y];
		}
	} else if (x !== game.actors[game.selectedActor].x && y !== game.actors[game.selectedActor].y) {
		game.endTile = [x, y];
	}
	game.drawWorld();
}

game.goToPath = () => {
	for (let i = 0; i < game.actors.length; i++) {
		game.actors[i].move();
	}
}

game.setPlace = () => {
	let path = [];
	if (game.selectedTile.length > 0 && game.endTile.length > 0) {
		path = game.findPath(game.world, game.selectedTile, game.endTile);
	}
	game.actors.push(new Actor(game.selectedTile[0], game.selectedTile[1], path));
	game.drawWorld();
}

game.setGoal = () => {
	if (game.selectedActor !== -1 && game.endTile.length > 0) {
		const actor = game.actors[game.selectedActor];
		actor.path = game.findPath(game.world, [actor.x, actor.y], game.endTile);
	}
};

game.getElements = () => {
	game.go = document.querySelector('#go');
	game.go.addEventListener('click', game.goToPath);

	game.place = document.querySelector('#place');
	game.place.addEventListener('click', game.setPlace);

	game.unselect = document.querySelector('#unselect');
	game.unselect.addEventListener('click', () => {
		game.selectedActor = -1;
		game.selectedTile = [];
		game.endTile = [];
		game.drawWorld();
	});

	game.goalBtn = document.querySelector('#goal');
	game.goalBtn.addEventListener('click', game.setGoal);

  game.canvas = document.querySelector('#gameCanvas');
	game.canvas.width = game.worldWidth * game.tileWidth;
  game.canvas.height = game.worldHeight * game.tileHeight;
  console.log(game.canvas.width, game.canvas.height);
	game.canvas.addEventListener("click", game.canvasClick);
  game.ctx = game.canvas.getContext("2d");
  game.spritesheet = new Image();
  // game.spritesheet.src = '../assets/spritesheet.png';
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

game.buildRandomWalls = (n) => {
	for (let x = 0; x < game.worldWidth; x++) {
		for (let y = 0; y < game.worldHeight; y++) {
			if (game.probability(n)) {
			  game.world[x][y] = 1;
		  }
    }
  }
}

game.drawWorld = () => {

	let spriteNum = 0;

	// clear the screen
	game.ctx.fillStyle = '#000000';
	game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

	for (let x = 0; x < game.worldWidth; x++) {
		for (let y = 0; y < game.worldHeight; y++) {
			// choose a sprite to draw
			switch(game.world[x][y]) {
        case 1:
          spriteNum = 1;
          break;

        default:
          spriteNum = 0;
          break;
			}

			if (x === game.selectedTile[0] && y === game.selectedTile[1]) {
				spriteNum = 4;
			}

			if (x === game.endTile[0] && y === game.endTile[1]) {
				spriteNum = 3;
			}

			if (game.actors.length > 0) {
				// for (let i = 0; i < game.actor.path.length; i++) {
				// 	if (x === game.actor.path[i][0] && y === game.actor.path[i][1]) {
				// 		spriteNum = 4;
				// 	}
				// }
				for (let i = 0; i < game.actors.length; i++) {
					if (x === game.actors[i].x && y === game.actors[i].y) {
						spriteNum = 4;
					}
				}
			}

			// draw it
			// ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
			game.ctx.drawImage(game.spritesheet,
			spriteNum * game.tileWidth, 0,
			game.tileWidth, game.tileHeight,
			x * game.tileWidth, y * game.tileHeight,
			game.tileWidth, game.tileHeight);

		}
	}
}

game.createWorld = () => {
	// create emptiness
	for (let x = 0; x < game.worldWidth; x++) {
		game.world[x] = [];
		for (let y = 0; y < game.worldHeight; y++) {
			game.world[x][y] = 0;
		}
  }
	game.buildRandomWalls(0.25);
	game.drawWorld();
}


game.init = () => {
	game.getElements();

}

// Document Ready
if(document.readyState === 'complete') {
	game.init();
} else {
	document.addEventListener('DOMContentLoaded', game.init);
};