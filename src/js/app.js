require('../css/app.css');
import FastList from 'fast-list';
import _ from 'lodash';

let canvas = document.getElementById('snakePit');
let ctx = canvas.getContext("2d");
canvas.height = 780;
canvas.width = 780;

export const SnakePit = {};
SnakePit.fps2 = 3;
SnakePit.cellWidth = 13;

SnakePit.game = function() {
	// Create the canvas
	// game configuration
	let gameRunning = true;
	let food = new SnakePit.food();
	// init snake object
		let snake1 = new SnakePit.snake({
		x: 20,
		y: 20,
		speed: 6
	});
		let snake2 = new SnakePit.snake({
		x: 20,
		y: 30,
		speed: 6
	});
	var gameTime = Date.now();

	function init() {
		bindEvents();
		snake1.init();
		snake2.init();
		food.place();
		gameLoop();
		gameLoop2();
	}

	function update(now, snake) {
		advanceSnake(now, snake);
		checkCollision(snake);
		checkSelfCollision(snake);
	}

	function advanceSnake(now, snake) {
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
			newSnakeHeadPosition.x += (currentVector.x);
			newSnakeHeadPosition.y += (currentVector.y);
		}
		 
		
		snake.segments.unshift(newSnakeHeadPosition);
		if( checkFoodCollision(snake, food)) {
			snake.length += 1;
		} else {
			snake.segments.pop();
		}
	}

	function checkCollision(snake){
		let head = snake.segments._head.data;
		if ( head.x < 0 ||
			 head.y < 0 ||
			 head.x >= (canvas.width / SnakePit.cellWidth) ||
			 head.y >= (canvas.height / SnakePit.cellWidth) ) {
				gameRunning = false;
		}
	}

	function checkSelfCollision(snake){
		let head = snake.segments._head.data;
		let noCollision = snake.segments.reduce( (previousValue, currentSegment, index, segments) => {
			let segmentsCollide = _.isEqual(head, currentSegment);
			if (typeof previousValue === 'object') previousValue = true;
			return previousValue && !segmentsCollide;
		});
		if (!noCollision) gameRunning = false;
	}

	function checkFoodCollision(snake, food) {
		let head = snake.segments._head.data;
		if ( _.isEqual(head, food.coordinates) ) {
			food.place();
			if (SnakePit.fps < 60) snake.speed += 1;
			return true;
		}
	}

	function draw() {
		ctx.fillStyle = 'green';
		ctx.strokeStyle = "white";

		snake1.segments.forEach(function(segment, index){
			ctx.fillRect(segment.x * SnakePit.cellWidth, segment.y * SnakePit.cellWidth, snake1.segmentSize, snake1.segmentSize);
			ctx.strokeRect(segment.x * SnakePit.cellWidth, segment.y * SnakePit.cellWidth, snake1.segmentSize, snake1.segmentSize);
		});

		ctx.fillStyle = 'blue';
		ctx.strokeStyle = "white";

		snake2.segments.forEach(function(segment, index){
			ctx.fillRect(segment.x * SnakePit.cellWidth, segment.y * SnakePit.cellWidth, snake2.segmentSize, snake2.segmentSize);
			ctx.strokeRect(segment.x * SnakePit.cellWidth, segment.y * SnakePit.cellWidth, snake2.segmentSize, snake2.segmentSize);
		});


		ctx.fillStyle = 'red';
		ctx.fillRect(food.coordinates.x * SnakePit.cellWidth, food.coordinates.y * SnakePit.cellWidth, 10, 10);
		ctx.strokeRect(food.coordinates.x * SnakePit.cellWidth, food.coordinates.y * SnakePit.cellWidth, snake1.segmentSize, snake1.segmentSize);
	}

	function clear() {
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0, canvas.height, canvas.width);
	}

	function gameLoop() {
		if (!gameRunning) return;

		var now = Math.round(Date.now()/50);
		var delta = (now - then)/1000;
		var then = now;
		update(now, snake1);
	   	clear();
	   	draw();
	   	setTimeout( () => {
	   		requestAnimationFrame(gameLoop);
	   	}, 1000 / snake1.speed);
	}

	function gameLoop2() {
		if (!gameRunning) return;

		var now = Math.round(Date.now()/50);
		var delta = (now - then)/1000;
		var then = now;
		update(now, snake2);
	   	clear();
	   	draw();
	   	setTimeout( () => {
	   		requestAnimationFrame(gameLoop2);
	   	}, 1000 / snake2.speed);
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
	        snake2.setDirection(direction);
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
SnakePit.snake = function(options) {
	let snake = this;
	this.head = {
		x: options.x,
		y: options.y
	};
	this.segmentSize = 10;
	this.speed = options.speed;
	this.length = 5;
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
};

SnakePit.food = function() {
	let food = this;
	this.coordinates = {
		x: 0,
		y: 0
	};
	this.place = function() {
		food.coordinates.x = Math.floor(Math.random() * (canvas.width / SnakePit.cellWidth));
		food.coordinates.y = Math.floor(Math.random() * (canvas.height / SnakePit.cellWidth));
	}
};

SnakePit.game().init();