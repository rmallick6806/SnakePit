require('../css/app.css');
import Lazy from 'lazy.js';
import FastList from 'fast-list';

export const SnakePit = {};
SnakePit.width = document.getElementById('snakePit').width;
SnakePit.height = document.getElementById('snakePit').height;

SnakePit.game = function() {

	// Create the canvas
	let canvas = document.getElementById('snakePit');
	let ctx = canvas.getContext("2d");
	let rAF = window.requestAnimationFrame;
	// time-based animation: http://blog.sklambert.com/using-time-based-animation-implement/
	let accumulator = 0;
	let last = new Date().getTime();
	let dt = 1000 / 60;  // constant dt step of 1 frame every 60 seconds
	// snake object
	let snake1 = new SnakePit.snake();

	function init() {
		bindEvents();
		snake1.init();
		gameLoop();
	}

	function update(dt, snake) {
		let newSnakeHeadPosition;
		switch (snake.direction) {
			case 'RIGHT':
				newSnakeHeadPosition = {
					x: snake.head.x += snake.speed,
					y: snake.head.y
				};
				break;
			case 'LEFT':
				newSnakeHeadPosition = {
					x: snake.head.x -= snake.speed,
					y: snake.head.y
				}
				break;
			case 'UP':
				newSnakeHeadPosition = {
					x: snake.head.x,
					y: snake.head.y -= snake.speed
				}
				break;
			case 'DOWN':
				newSnakeHeadPosition = {
					x: snake.head.x,
					y: snake.head.y += snake.speed
				}
				break;
			default:
				newSnakeHeadPosition = {
					x: snake.head.x += snake.speed,
					y: snake.head.y
				};
				break
		}
		snake.segments.unshift(newSnakeHeadPosition);
		snake.segments.pop();
	}

	function draw() {
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0, canvas.height, canvas.width);

		ctx.fillStyle = 'green';
		snake1.segments.forEach(function(segment, index){
			ctx.fillRect(segment.x, segment.y, snake1.segmentSize, snake1.segmentSize);
		});

	}

	function gameLoop() {
	   var now = new Date().getTime();
	   var passed = now - last;
	   last = now;
	   accumulator += passed;
	   while (accumulator >= dt) {
	      update(dt, snake1);
	      accumulator -= dt;
	   }
	   draw();
	   rAF(gameLoop);
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
	        event.preventDefault();
	      }
	      else if (key === 32) {
	        // restart();
	        console.log('restart');
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
	this.speed = 5;
	this.head = {
		x: SnakePit.width / 2,
		y: SnakePit.height / 2
	};
	this.segmentSize = 10;
	this.length = 4;
	this.segments = new FastList();
	this.direction = 'RIGHT';
	this.init = function() {
		snake.segments.push(snake.head);
		Lazy.range(snake.length)
			.toArray()
			.map(function(segment, index){
				snake.segments.push({
					x: snake.head.x - (index * (snake.segmentSize + 1)),
					y: snake.head.y
				});
			});
	}
	this.setDirection = function(newDirection) {
	  let allowedDirections;
	  //If snake is going left or right, only valid new directions
	  //are up and down. Vice versa for up or down.
	  switch (snake.direction) {
	  case 'LEFT':
	  case 'RIGHT':
	    allowedDirections = ['UP', 'DOWN'];
	    break;
	  case 'UP':
	  case 'DOWN':
	    allowedDirections = ['LEFT', 'RIGHT'];
	    break;
	  default:
	    throw('Invalid direction');
	  }
	  if (allowedDirections.indexOf(newDirection) > -1) {
	    snake.direction = newDirection;
	  }
	}
}
SnakePit.game().init();