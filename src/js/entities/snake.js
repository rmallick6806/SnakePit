import FastList from 'fast-list';
import _ from 'lodash';
import { oppositeDirections } from './utils';

module.exports = function Snake(options) {
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
	this.id = null;
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
  		if (newDirection !== oppositeDirections[snake.direction]) {
	  		snake.direction = newDirection;
	  	}
	}

	this.advance = (food) => {
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
		if( snake.checkFoodCollision(snake, food)) {
			snake.length += 1;
		} else {
			snake.segments.pop();
		}		
	}

	this.checkCollision = (canvas, board, game) => {
		let head = snake.segments._head.data;
		if ( head.x < 0 ||
			 head.y < 0 ||
			 head.x >= (canvas.width / board.cellWidth) ||
			 head.y >= (canvas.height / board.cellWidth) ) {
				game.running = false;
		}
	}

	this.checkSelfCollision = (game) => {
		let head = snake.segments._head.data;
		let noCollision = snake.segments.reduce( (previousValue, currentSegment, index, segments) => {
			let segmentsCollide = _.isEqual(head, currentSegment);
			if (typeof previousValue === 'object') previousValue = true;
			return previousValue && !segmentsCollide;
		});
		if (!noCollision) game.running = false;
	}

	this.checkFoodCollision = (snake, food) => {
		let head = snake.segments._head.data;
		if ( _.isEqual(head, food.coordinates) ) {
			food.place();
			snake.speed += 1;
			return true;
		}
	}
};