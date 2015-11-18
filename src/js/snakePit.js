require('../css/app.css');
import FastList from 'fast-list';
import _ from 'lodash';
import io from 'socket.io-client';
import Snake from './entities/snake';
import Food from './entities/food';
import Board from './entities/board';

const socket = io.connect();

const p1Btn = document.getElementById('p1');
const p2Btn = document.getElementById('p2');
// Create the canvas
const canvas = document.getElementById('snakePit');
const ctx = canvas.getContext("2d");

canvas.height = 780;
canvas.width = 780;

export const SnakePit = {};

SnakePit.game = function() {
	let game = this;
	// game configuration
	this.running = true;
	let board = new Board();
	let snake1 = new Snake({
		x: 20,
		y: 20,
		speed: 6
	});
	let snake2 = new Snake({
		x: 20,
		y: 30,
		speed: 6
	});
	let food = new Food(canvas, board);
	let gameTime = Date.now();

	function init() {
		bindEvents();
		snake1.init();
		snake2.init();
		food.place();
		gameLoop();
		gameLoop2();
	}

	function update(now, snake) {
		snake.advance(food);
		snake.checkCollision(canvas, board, game);
		snake.checkSelfCollision(game);
	}


	function gameLoop() {
		if (!game.running) return;

		var now = Math.round(Date.now()/50);
		var delta = (now - then)/1000;
		var then = now;
		update(now, snake1);
	   	board.clear(ctx, canvas);
	   	board.draw(ctx, snake1, snake2, food);
	   	setTimeout( () => {
	   		requestAnimationFrame(gameLoop);
	   	}, 1000 / snake1.speed);
	}

	function gameLoop2() {
		if (!game.running) return;

		var now = Math.round(Date.now()/50);
		var delta = (now - then)/1000;
		var then = now;
		update(now, snake2);
	   	board.clear(ctx, canvas);
	   	board.draw(ctx, snake1, snake2, food);
	   	setTimeout( () => {
	   		requestAnimationFrame(gameLoop);
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
	        game.running = false;
	      }
	    });
  	}
  	return {
  		init: init
  	}
};

// socket.on('connected', (data) => {
// 	console.log(data.message, 'p1 id:', data.mySocketId);
// 	SnakePit.p1.id = data.mySocketId;
// });

// p1Btn.addEventListener('click', (e) => {
// 	e.preventDefault();
// 	socket.emit('p1Join', { p1: SnakePit.p1.id });
// });

// p2Btn.addEventListener('click', (e) => {
// 	e.preventDefault();
// 	socket.emit('p1Join', { p1: SnakePit.p1.id });
// });
SnakePit.game().init();