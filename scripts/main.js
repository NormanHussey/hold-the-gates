const game = {};

game.world = [[]];
game.sprites = [[]];
game.path = [];
game.findPath = findPath;

game.worldWidth = 24;
game.worldHeight = 24;

game.tileWidth = 32;
game.tileHeight = 32;

game.maxWalkableTileNum = 2;

game.selectedTile = [];
game.endTile = [];

game.path = {};
game.canvasWorld = {};

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
game.canvasWorldClick = (e) => {
	const clickX = e.clientX - e.target.offsetLeft;
	const clickY = e.clientY - e.target.offsetTop;
	const x = Math.floor(clickX / game.tileWidth);
	const y = Math.floor(clickY / game.tileHeight);
	for (let i = 0; i < game.actors.length; i++) {
		if (game.actors[i].x === x && game.actors[i].y === y) {
			if (game.selectedActor !== i) {
				game.selectedActor = i;
				game.displaySelected.innerText = i;
			} else {
				game.selectedActor = -1;
				game.displaySelected.innerText = '';
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
	game.drawSprites();
}

game.goToPath = () => {
	for (let i = 0; i < game.actors.length; i++) {
		game.actors[i].move();
	}
}

game.setPlace = () => {
	// let path = [];
	// if (game.selectedTile.length > 0 && game.endTile.length > 0) {
	// 	path = game.findPath(game.world, game.selectedTile, game.endTile);
	// }
	game.actors.push(new Actor(game.selectedTile[0], game.selectedTile[1], []));
	game.drawWorld();
}

game.setGoal = () => {
	if (game.selectedActor !== -1 && game.endTile.length > 0) {
		// const actor = game.actors[game.selectedActor];
		// actor.path = game.findPath(game.world, [actor.x, actor.y], game.endTile);
		game.actors[game.selectedActor].goal = game.endTile;
	}
};

game.getElements = () => {
	game.displaySelected = document.querySelector('#selected');

	game.go = document.querySelector('#go');
	game.go.addEventListener('click', game.goToPath);

	game.place = document.querySelector('#place');
	game.place.addEventListener('click', game.setPlace);

	game.unselect = document.querySelector('#unselect');
	game.unselect.addEventListener('click', () => {
		game.selectedActor = -1;
		game.selectedTile = [];
		game.endTile = [];
		game.displaySelected.innerText = '';
		game.drawSprites();
	});

	game.goalBtn = document.querySelector('#goal');
	game.goalBtn.addEventListener('click', game.setGoal);

  game.canvasWorld = document.querySelector('#worldCanvas');
	game.canvasWorld.width = game.worldWidth * game.tileWidth;
	game.canvasWorld.height = game.worldHeight * game.tileHeight;
  game.ctxWorld = game.canvasWorld.getContext("2d");
  // console.log(game.canvasWorld.width, game.canvasWorld.height);
	
  game.canvasSprites = document.querySelector('#spritesCanvas');
	game.canvasSprites.width = game.worldWidth * game.tileWidth;
	game.canvasSprites.height = game.worldHeight * game.tileHeight;
	game.ctxSprites = game.canvasSprites.getContext("2d");
	game.canvasSprites.addEventListener("click", game.canvasWorldClick);

  game.spritesheet = new Image();
  // game.spritesheet.src = '../assets/spritesheet.png';
	// game.spritesheet.src = 'data:image/png;base64,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';
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
			  game.world[x][y] = 3;
		  }
    }
  }
}

game.drawWorld = () => {

	// let spriteNum = 0;

	// clear the screen
	game.ctxWorld.fillStyle = '#000000';
	game.ctxWorld.fillRect(0, 0, game.canvasWorld.width, game.canvasWorld.height);

	for (let x = 0; x < game.worldWidth; x++) {
		for (let y = 0; y < game.worldHeight; y++) {

			const spriteNum = game.world[x][y];
			// choose a sprite to draw
			// switch(game.world[x][y]) {
      //   case 1:
      //     spriteNum = 1;
			// 		break;
					
			// 	case 4:
			// 		spriteNum = 4;
			// 		break;

      //   default:
      //     spriteNum = 0;
      //     break;
			// }

			// if (x === game.selectedTile[0] && y === game.selectedTile[1]) {
			// 	spriteNum = 4;
			// }

			// if (x === game.endTile[0] && y === game.endTile[1]) {
			// 	spriteNum = 3;
			// }

			// if (game.actors.length > 0) {
			// 	for (let i = 0; i < game.actors.length; i++) {
			// 		if (x === game.actors[i].x && y === game.actors[i].y) {
			// 			spriteNum = 4;
			// 		}
			// 	}
			// }

			// draw it
			// ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
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
			let spriteNum = game.sprites[x][y];

			if (x === game.selectedTile[0] && y === game.selectedTile[1]) {
				spriteNum = 1;
			}

			if (x === game.endTile[0] && y === game.endTile[1]) {
				spriteNum = 1;
			}

			game.ctxSprites.drawImage(game.spritesheet,
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
		game.sprites[x] = [];
		for (let y = 0; y < game.worldHeight; y++) {
			game.world[x][y] = 2;
			game.sprites[x][y] = 0;
		}
  }
	game.buildRandomWalls(0.25);
	game.drawWorld();
	game.drawSprites();
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