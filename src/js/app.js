require('../css/app.css');
import Lazy from 'lazy.js';

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
	let snake = new SnakePit.snake();

	function init() {
		bindEvents();
		snake.init();
		gameLoop();
	}

	function update(dt, snake) {
		snake.head.x += snake.speed;
		if (snake.head.x >= canvas.width ||
			snake.head.x <= canvas.width ) {
				snake.head = { x: 0, y: snake.head.y }
		}
		if ( snake.head.y >= canvas.height ||
			 snake.head.y <= canvas.height ) {
				snake.head = { x: snake.head.x, y: 0 }
		}

	}

	function draw() {
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0, canvas.height, canvas.width);

		ctx.fillStyle = 'green';
		Lazy(snake.segments).each(function(segment, index){
			ctx.fillRect(segment.x, segment.y, snake.segmentSize, snake.segmentSize);
		});

	}

	function gameLoop() {
	   var now = new Date().getTime();
	   var passed = now - last;
	   last = now;
	   accumulator += passed;
	   while (accumulator >= dt) {
	      update(dt, snake);
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
	      console.log(direction);

	      if (direction) {
	        snake.setDirection(direction);
	        console.log(snake.direction);
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
	this.speed = 3;
	this.head = {
		x: SnakePit.width / 2,
		y: SnakePit.height / 2
	};
	this.segmentSize = 10;
	this.length = 4;
	this.segments = [];
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
	this.add = function(){
		
	}
	this.build = function(segments) {
		
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