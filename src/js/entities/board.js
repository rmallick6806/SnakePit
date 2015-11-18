module.exports = function Board() {
	let board = this;
	this.cellWidth = 13;

	this.draw = (ctx, snake1, snake2, food) => {
		ctx.fillStyle = 'green';
		ctx.strokeStyle = "white";

		snake1.segments.forEach(function(segment, index){
			ctx.fillRect(segment.x * board.cellWidth, segment.y * board.cellWidth, snake1.segmentSize, snake1.segmentSize);
			ctx.strokeRect(segment.x * board.cellWidth, segment.y * board.cellWidth, snake1.segmentSize, snake1.segmentSize);
		});

		ctx.fillStyle = 'blue';
		ctx.strokeStyle = "white";

		snake2.segments.forEach(function(segment, index){
			ctx.fillRect(segment.x * board.cellWidth, segment.y * board.cellWidth, snake2.segmentSize, snake2.segmentSize);
			ctx.strokeRect(segment.x * board.cellWidth, segment.y * board.cellWidth, snake2.segmentSize, snake2.segmentSize);
		});


		ctx.fillStyle = 'red';
		ctx.fillRect(food.coordinates.x * board.cellWidth, food.coordinates.y * board.cellWidth, 10, 10);
		ctx.strokeRect(food.coordinates.x * board.cellWidth, food.coordinates.y * board.cellWidth, snake1.segmentSize, snake1.segmentSize);
	}

	this.clear = (ctx, canvas) => {
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0, canvas.height, canvas.width);
		
	}
}