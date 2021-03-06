const Coord = require('./coord');

/**
 * A small wrapper function so that we don't have to mix canvas logic randomly
 * in the rest of the code. Basically makes everything testable.
 *
 * @param {string} selector The element to draw onto.
 * @constructor
 */
function Canvas(selector) {
	this._canvas = document.querySelector(selector);
	this._context = this._canvas.getContext('2d');

	this.origin = new Coord(this._canvas.width / 2, this._canvas.height / 2);
}


/**
 * Draws a path to the canvas. Path should be a string similar to how Raphael
 * does it (it's easier tested).
 *
 * @param {object} options An object containing options: path, width and color.
 */
Canvas.prototype.drawPath = function (options) {
	const context = this._context;
	context.beginPath();

	options.path.forEach(function (point) {
		switch (point.type) {
			case 'M':
				context.moveTo(point.x, point.y);
				break;

			case 'L':
				context.lineTo(point.x, point.y);
		}
	});

	context.lineWidth = options.width;
	context.strokeStyle = options.color;
	context.lineCap = options.lineCap;
	context.stroke();
};

/**
 * Fill the entire canvas with a specified color. Good for backgrounds.
 *
 * @param {string} color The color to fill the canvas with.
 */
Canvas.prototype.fill = function (color) {
	const context = this._context;
	context.rect(0, 0, this._canvas.width, this._canvas.height);
	context.fillStyle = color;
	context.fill();
};

/**
 * Export the contents of the canvas to a specified image element.
 *
 * @param {string} selector Selector matching the element to export to.
 */
Canvas.prototype.exportTo = function (selector) {
	this._canvas.toBlob(function (blob) {
		const image = document.querySelector(selector);
		image.src = URL.createObjectURL(blob);
	});
};

module.exports = Canvas;
