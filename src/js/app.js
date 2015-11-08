require('../css/app.css');
import FastList from 'fast-list';
import _ from 'lodash';

export const SnakePit = {};
SnakePit.width = document.getElementById('snakePit').width;
SnakePit.height = document.getElementById('snakePit').height;

SnakePit.game = function() {

	// Create the canvas
	let canvas = document.getElementById('snakePit');
	let ctx = canvas.getContext("2d");
	canvas.height = 600;
	canvas.width = 600;
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
		advanceSnake(snake);
		checkCollision(snake);
		checkSelfCollision(snake);
	}

	function advanceSnake( snake ) {
		let newSnakeHeadPosition = {
			x: snake.segments._head.data.x,
			y: snake.segments._head.data.y
		};
		let vectors = {
			RIGHT : { x: 1, y: 0 },
			LEFT  : { x: -1, y: 0 },
			UP    : { x: 0, y: -1 },
			DOWN  : { x: 0, y: 1 }
		};
		let currentVector = vectors[snake.direction];
		if ( currentVector ) {
			newSnakeHeadPosition.x += currentVector.x;
			newSnakeHeadPosition.y += currentVector.y;
		}
		snake.segments.unshift(newSnakeHeadPosition);
		snake.segments.pop();
	}

	function checkCollision(snake){
		let head = snake.segments._head.data;
		if ( head.x < 0||
			 head.y < 0 ||
			 head.x >= SnakePit.width - 9 ||
			 head.y >= SnakePit.height - 9 ) {
				gameRunning = false;
		}
	}

	function checkSelfCollision(snake){
		let head = snake.segments._head.data;
		let selfCollide = snake.segments.reduce( (previousSegment, currentSegment, index, segments) => {
			return true && (_.isEqual(previousSegment, currentSegment));
		});
		console.log(selfCollide);
		if (selfCollide) gameRunning = false;
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
	   setTimeout(gameLoop, 100)
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
	this.head = {
		x: 25,
		y: 25
	};
	this.segmentSize = 10;
	this.length = 3;
	this.segments = new FastList;
	this.direction = 'RIGHT';
	this.init = function() {
		_.range(snake.length)
			.map(function(segment, index){
				snake.segments.push({
					x: snake.head.x - (index),
					y: snake.head.y
				});
			});
	}

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
