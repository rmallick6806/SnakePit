require('../css/app.css');
// import Lazy from 'lazy.js';
import _ from 'lodash';

export const SnakePit = {};
SnakePit.width = document.getElementById('snakePit').width;
SnakePit.height = document.getElementById('snakePit').height;

SnakePit.game = function() {

	// Create the canvas
	let canvas = document.getElementById('snakePit');
	let ctx = canvas.getContext("2d");
	let last = new Date().getTime();
	// snake object
	let snake1 = new SnakePit.snake();
	let gameRunning = true;
	var cellWidth = 13;

	function init() {
		bindEvents();
		snake1.init();
		gameLoop();
	}

	function update(snake) {
		let vectors = {
			RIGHT : { x: 1, y: 0 },
			LEFT  : { x: -1, y: 0 },
			UP    : { x: 0, y: -1 },
			DOWN  : { x: 0, y: 1 }
		};

		let currentVector = vectors[snake.direction];
		if (currentVector) {
			snake.segments[0].x += (currentVector.x );
			snake.segments[0].y += (currentVector.y );
		}
		//Move snake
		var tail = snake.segments.pop();
		tail.x = snake.segments[0].x;
		tail.y = snake.segments[0].y;
		snake.segments.unshift(tail);

		let head = snake.segments[0];
		if ( head.x < 0 ||
			 head.y < 0 ||
			 head.x >= SnakePit.width - 9 ||
			 head.y >= SnakePit.height - 9 ) {
				gameRunning = false;
		}
	}

	function draw() {
		ctx.fillStyle = 'green';
		ctx.strokeStyle = "white";

		snake1.segments.forEach(function(segment, index){
			ctx.fillRect(segment.x * cellWidth, segment.y * cellWidth, snake1.segmentSize, snake1.segmentSize);
			ctx.strokeRect(segment.x * cellWidth, segment.y * cellWidth, snake1.segmentSize, snake1.segmentSize);
		});
	}

	function clear() {
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0, canvas.height, canvas.width);
	}

	function gameLoop() {
		if (!gameRunning) return;
	   update(snake1);
	   clear();
	   draw();
	   setTimeout(gameLoop, 60)
	}

	function bindEvents() {
		let controls = {
			37: 'LEFT',
			38: 'UP',
			39: 'RIGHT',
			40: 'DOWN'
		}

	    document.addEventListener('keydown', function (event) {
	      let key = event.keyCode;
	      let direction = controls[key];

	      if (direction) {
	        snake1.setDirection(direction);
	      }
	      else if (key === 32) {
	        gameRunning = false;
	      }
	    });
  	}
  	return {
  		init: init
  	}
};

// Game objects
SnakePit.snake = function() {
	let snake = this;
	this.speed = 1;
	this.head = {
		x: 250,
		y: 250
	};
	this.segmentSize = 10;
	this.length = 5;
	this.segments = [];
	this.direction = 'RIGHT';
	this.init = function () {
		for(var i = this.length - 1; i >= 0; i--){
			snake.segments.push({x: 25 + i, y: 0});
		}
	};

	this.setDirection = function(newDirection) {
  		let oppositeDirections = {
		  	LEFT: 'RIGHT',
		  	RIGHT: 'LEFT',
		  	UP: 'DOWN',
		  	DOWN: 'UP'
	  	}

  		if (newDirection !== oppositeDirections[snake.direction]) {
	  		snake.direction = newDirection;
	  	}
	}
}
SnakePit.game().init();
