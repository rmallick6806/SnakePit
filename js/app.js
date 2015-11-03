// Create the canvas
var rAF = window.requestAnimationFrame;
var canvas = document.getElementById('snakePit');
var ctx = canvas.getContext("2d");
var accumulator = 0;
var controls = {
	37: 'LEFT',
	38: 'UP',
	39: 'RIGHT',
	40: 'DOWN'
}

// Game objects
function Snake() {
	var self = this;
	this.headX = canvas.width / 2;
	this.headY = canvas.height / 2;
	this.segmentSize = 10;
	this.initialLength = 5;
	this.segments = [];
	this.direction = 'RIGHT';
	this.init = function() {
		Lazy.range(self.initialLength)
			.toArray()
			.map(function(segment, index){
				self.segments.push({
					x: self.headX - (index * (self.segmentSize + 1)),
					y: self.headY
				});
			});
	}
}

var snake = new Snake();
snake.init();
function update(dt) {

}
function draw() {
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0, canvas.height, canvas.width);

	ctx.fillStyle = 'green';
	Lazy(snake.segments).each(function(segment, index){
		ctx.fillRect(segment.x, segment.y, snake.segmentSize, snake.segmentSize);
	});

}
var last = new Date().getTime();
var dt = 1000 / 60;  // constant dt step of 1 frame every 60 seconds

function mainLoop() {
   var now = new Date().getTime();
   var passed = now - last;
   last = now;
   accumulator += passed;
   while (accumulator >= dt) {
      update(dt);
      accumulator -= dt;
   }
   draw();
   rAF(mainLoop);
}
// Handle keyboard controls
// var keysDown = {};

// addEventListener("keydown", function (e) {
// 	keysDown[e.keyCode] = true;
// }, false);

// addEventListener("keyup", function (e) {
// 	delete keysDown[e.keyCode];
// }, false);

// // Reset the game when the player catches an apple
// var reset = function () {
// 	snake.x = canvas.width / 2;
// 	snake.y = canvas.height / 2;

// 	// Throw the apple somewhere on the screen randomly
// 	apple.x = 32 + (Math.random() * (canvas.width - 64));
// 	apple.y = 32 + (Math.random() * (canvas.height - 64));
// };

// // Update game objects
// var update = function (modifier) {
// 	if (38 in keysDown) { // Player holding up
// 		if(snake.y > 0){
// 			snake.y -= snake.speed * modifier;
// 		}		
// 	}
// 	if (40 in keysDown) { // Player holding down
// 		snake.y += snake.speed * modifier;
// 	}
// 	if (37 in keysDown) { // Player holding left
// 		snake.x -= snake.speed * modifier;
// 	}
// 	if (39 in keysDown) { // Player holding right
// 		snake.x += snake.speed * modifier;
// 	}

// 	// Are they touching?
// 	if (
// 		snake.x <= (apple.x + 32)
// 		&& apple.x <= (snake.x + 32)
// 		&& snake.y <= (apple.y + 32)
// 		&& apple.y <= (snake.y + 32)
// 	) {
// 		++applesCaught;
// 		reset();
// 	}
// };

// var renderDup = function(){
// 	for(var i = 1; i <= applesCaught; i++){
// 		ctx.drawImage(snakeImage, snake.x, snake.y + (32*i));
// 	}
// };

// // Draw everything
// var render = function () {
// 	if (bgReady) {
// 		ctx.drawImage(bgImage, 0, 0);
// 	}

// 	if (snakeReady) {
// 		ctx.drawImage(snakeImage, snake.x, snake.y);
// 	}

// 	if (appleReady) {
// 		ctx.drawImage(appleImage, apple.x, apple.y);
// 	}

// };

// render();
// // The main game loop
// var main = function () {
// 	var now = Date.now(); 
// 	var delta = now - then;

// 	update(delta / 1000);
// 	render();
// 	if(applesCaught > 0){
// 		renderDup();
// 	}
// 	then = now;

// 	// Request to do this again ASAP
// 	requestAnimationFrame(main);
// };


// // Let's play this game!
// var then = Date.now();
// reset();
// main();
