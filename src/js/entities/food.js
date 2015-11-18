module.exports = function Food(canvas, board) {
	let food = this;
	this.coordinates = {
		x: 0,
		y: 0
	};
	this.place = function() {
		food.coordinates.x = Math.floor(Math.random() * (canvas.width / board.cellWidth));
		food.coordinates.y = Math.floor(Math.random() * (canvas.height / board.cellWidth));
	}
};