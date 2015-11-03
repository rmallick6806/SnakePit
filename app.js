// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background2.png";

// Snake image
var snakeReady = false;
var snakeImage = new Image();
snakeImage.onload = function () {
	snakeReady = true;
};
snakeImage.src = "images/hero.png";

// Apple image
var appleReady = false;
var appleImage = new Image();
appleImage.onload = function () {
	appleReady = true;
};
appleImage.src = "images/apple.png";

// Game objects
var snake = {
	speed: 256 // movement in pixels per second
};
var apple = {};
var applesCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches an apple
var reset = function () {
	snake.x = canvas.width / 2;
	snake.y = canvas.height / 2;

	// Throw the apple somewhere on the screen randomly
	apple.x = 32 + (Math.random() * (canvas.width - 64));
	apple.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if(snake.y > 0){
			snake.y -= snake.speed * modifier;
		}		
	}
	if (40 in keysDown) { // Player holding down
		snake.y += snake.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		snake.x -= snake.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		snake.x += snake.speed * modifier;
	}

	// Are they touching?
	if (
		snake.x <= (apple.x + 32)
		&& apple.x <= (snake.x + 32)
		&& snake.y <= (apple.y + 32)
		&& apple.y <= (snake.y + 32)
	) {
		++applesCaught;
		reset();
	}
};

var renderDup = function(){
	for(var i = 1; i <= applesCaught; i++){
		ctx.drawImage(snakeImage, snake.x, snake.y + (32*i));
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (snakeReady) {
		ctx.drawImage(snakeImage, snake.x, snake.y);
	}

	if (appleReady) {
		ctx.drawImage(appleImage, apple.x, apple.y);
	}

};

render();
// The main game loop
var main = function () {
	var now = Date.now(); 
	var delta = now - then;

	update(delta / 1000);
	render();
	if(applesCaught > 0){
		renderDup();
	}
	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};


// Let's play this game!
var then = Date.now();
reset();
main();
