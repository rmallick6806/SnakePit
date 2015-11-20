import _ from 'lodash';

module.exports = function Board() {
	let board = this;
	this.cellWidth = 13;

	this.draw = (ctx, snakes, food, elapsed) => {
		ctx.strokeStyle = "white";

		_.forEach(snakes, (snake, playerIndex) => {
			let snakeColor = playerIndex === 0 ? 'green' : 'blue';
			ctx.fillStyle = snakeColor;
			snake.segments.forEach( (segment, segmentIndex) => {
				ctx.fillRect(segment.x * board.cellWidth, segment.y * board.cellWidth, snake.segmentSize, snake.segmentSize);
				ctx.strokeRect(segment.x * board.cellWidth, segment.y * board.cellWidth, snake.segmentSize, snake.segmentSize);
			});

		})

		// ctx.fillStyle = 'blue';
		// ctx.strokeStyle = "white";

		// snake2.segments.forEach(function(segment, index){
		// 	ctx.fillRect(segment.x * board.cellWidth, segment.y * board.cellWidth, snake2.segmentSize, snake2.segmentSize);
		// 	ctx.strokeRect(segment.x * board.cellWidth, segment.y * board.cellWidth, snake2.segmentSize, snake2.segmentSize);
		// });


		ctx.fillStyle = 'red';
		ctx.fillRect(food.coordinates.x * board.cellWidth, food.coordinates.y * board.cellWidth, 10, 10);
		ctx.strokeRect(food.coordinates.x * board.cellWidth, food.coordinates.y * board.cellWidth, 10, 10);
	}

	this.clear = (canvas, ctx) => {
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0, canvas.height, canvas.width);
		
	}
}