(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.normalLines = require('./normal-lines');

},{"./normal-lines":9}],2:[function(require,module,exports){
const random = require('./random');

/**
 * Stores the x and y dimensions of a euclidean vector in the cartesian plane
 * and provides some useful helper functions.
 *
 * @param {number} ax The x dimension of the vector.
 * @param {number} ay The y dimension.
 * @constructor
 */
function Vector(ax, ay) {
	if (!(this instanceof Vector)) {
		return new Vector(ax, ay);
	}

	this.ax = ax;
	this.ay = ay;
}

/**
 * Calculates the magnitude of the vector.
 *
 * @returns {number} The magnitude of the vector.
 */
Vector.prototype.getMagnitude = function () {
	return Math.pow(Math.pow(this.ax, 2) + Math.pow(this.ay, 2), 0.5);
};

/**
 * Returns a new vector with a specified magnitude.
 *
 * @param {number} newMagnitude The magnitude of the new vector.
 * @returns {Vector} A new vector with specified magnitude.
 */
Vector.prototype.restrictMagnitude = function (newMagnitude) {
	const ratio = newMagnitude / this.getMagnitude();

	return new Vector(this.ax * ratio, this.ay * ratio);
};

/**
 * Changes a vector slightly by a random amount. Uses a random function with a
 * normal distribution, so it's usually not that different.
 *
 * @param {number} [factor=1] Standard deviation of the normal distribution
 * function used.
 * @returns {Vector} Slightly different vector.
 */
Vector.prototype.randomiseByFactor = function (factor = 1) {
	return new Vector(this.ax + random.normal() * factor, this.ay + random.normal() * factor);
};

/**
 * Calculates the vector between two coordinates
 *
 * @param {Coord} from Coordinate to calculate vector from
 * @param {Coord} to Coordinate to calculate vector to
 */
Vector.between = function (from, to) {
	return new Vector(to.x - from.x, to.y - from.y);
};

/**
 * Returns the average of n vectors.
 *
 * @param {...Vector} vectors One or more vectors.
 * @returns {Vector} The average vector.
 */
Vector.average = function (...vectors) {
	const ax = vectors.reduce((sum, { ax }) => sum + ax, 0) / vectors.length;
	const ay = vectors.reduce((sum, { ay }) => sum + ay, 0) / vectors.length;

	return new Vector(ax, ay);
};

/**
 * Generates a random vector going < 0.5 on the x and y axes.
 *
 * @returns {Vector} Random vector.
 */
Vector.random = function () {
	return new Vector(random(), random());
};

module.exports = Vector;

},{"./random":6}],3:[function(require,module,exports){
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

},{"./coord":4}],4:[function(require,module,exports){
/**
 * Stores the x and y positions of a coordinate and provides some useful helper
 * functions.
 *
 * @param {number} x The x position.
 * @param {number} y The y position.
 * @constructor
 */
function Coord(x, y) {
	if (!(this instanceof Coord)) {
		return new Coord(x, y);
	}

	this.x = x;
	this.y = y;
}

/**
 * Works out the distance between two coordinates using Pythagoras' theorum.
 *
 * @param {Coord} other The other coordinate.
 * @returns {number} The distance between the two coordinates.
 */
Coord.prototype.distFrom = function (other) {
	const distX = Math.pow(this.x - other.x, 2);
	const distY = Math.pow(this.y - other.y, 2);

	return Math.pow(distX + distY, 0.5);
};

/**
 * Adds a vector to the coordinate.
 *
 * @param {Vector} vector The vector to add to the coordinate.
 * @returns {Coord} The new coordinate.
 */
Coord.prototype.add = function (vector) {
	return new Coord(this.x + vector.ax, this.y + vector.ay);
};

module.exports = Coord;

},{}],5:[function(require,module,exports){
const Vector = require('./vector');

/**
 * Generates a slightly wobbly path between two coordinates. The amount of
 * wobbliness can be changed by tweaking the above constants.
 *
 * @param {Coord} from The coordinate to draw from.
 * @param {Coord} to The coordinate to draw to.
 * @param {object} config Configuration options.
 * @returns {Array} An array representing the path to draw.
 */
function generatePath(from, to, config) {
	let path = [
		{ type: 'M', x: from.x, y: from.y }
	];

	let currentPoint = from;
	let currentDirection;

	// Safety to avoid crashing browsers
	let maxRuns = 1000;

	do {

		// This is the perfect direction: also, a boring straight line
		let perfect = Vector.between(currentPoint, to);

		let newDirection;
		if (currentDirection) {
			// This carries on most in the direction the line is currently going, but
			// skews it a little bit back towards the point it's supposed to be going
			// so that it's not too crazy
			newDirection = Vector.average(
					perfect.restrictMagnitude(config.BIAS_TO_PERFECT),
					currentDirection.restrictMagnitude(1 - config.BIAS_TO_PERFECT)
			);
		} else {
			newDirection = perfect;
		}

		newDirection = newDirection
				.restrictMagnitude(config.SEGMENT_LENGTH)
				.randomiseByFactor(config.RANDOM_FACTOR);

		let newPoint = currentPoint.add(newDirection);

		path.push({ type: 'L', x: newPoint.x, y: newPoint.y });
		currentPoint = newPoint;
		currentDirection = newDirection;

	} while (currentPoint.distFrom(to) > config.SEGMENT_LENGTH * 10 && maxRuns--);

	return path;
}

module.exports = generatePath;

},{"./vector":7}],6:[function(require,module,exports){
/**
 * Returns a random number between -0.5 and 0.5. Basically in its own function
 * so that it can be replaced with a different random function if needed.
 *
 * @returns {number} A random number between -0.5 and 0.5.
 */
function random() {
	return Math.random() - 0.5;
}

/**
 * Generate normally distributed random numbers.
 *
 * Only an approximation: actually a Irwin–Hall distribution.
 *
 * @returns {number} A number between -6 and 6 that will approximately map to a
 * normal distribution.
 */
random.normal = function () {
	var total = 0;

	for (let i = 0; i < 12; i++) {
		total += random();
	}

	return total;
};

module.exports = random;

},{}],7:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./random":6,"dup":2}],8:[function(require,module,exports){
const random = require('../lib/random');

exports.NUMBER_OF_LINES = 1000;

exports.startLength = () => 400 + random() * 500;
exports.endLength = () => 800 + random() * 100;


exports.BACKGROUND_COLOR = '#262819';

// Colors for the path
let opacity = 0.6;

// https://color.adobe.com/Passado1-color-theme-8032401/
exports.COLORS = [
	`rgba(83, 84, 115, ${opacity})`, // blue
	`rgba(214, 216, 209, ${opacity})`, // white
	`rgba(159, 145, 124, ${opacity})`, // cream
	`rgba(142, 55, 48, ${opacity})` // red
];

exports.LINE_WIDTH = 6;


// Line generation config
exports.SEGMENT_LENGTH = 10;
exports.BIAS_TO_PERFECT = 0.5;
exports.RANDOM_FACTOR = 1;

},{"../lib/random":6}],9:[function(require,module,exports){
const Canvas = require('../lib/canvas');
const Vector = require('../lib/Vector');
const generatePath = require('../lib/generatePath');
const config = require('./config');

module.exports = function (selector) {
	const canvas = new Canvas(selector);
	const origin = canvas.origin;

	canvas.fill(config.BACKGROUND_COLOR);

	for (var i = 0; i < config.NUMBER_OF_LINES; i++) {
		let randomDirection = Vector.random();
		let start = origin.add(randomDirection.restrictMagnitude(config.startLength()));
		let end = origin.add(randomDirection.restrictMagnitude(config.endLength()));

		canvas.drawPath({
			path: generatePath(start, end, config),
			width: config.LINE_WIDTH,
			color: config.COLORS[Math.floor(Math.random() * config.COLORS.length)]
		});
	}
};

},{"../lib/Vector":2,"../lib/canvas":3,"../lib/generatePath":5,"./config":8}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbGliL1ZlY3Rvci5qcyIsInNyYy9saWIvY2FudmFzLmpzIiwic3JjL2xpYi9jb29yZC5qcyIsInNyYy9saWIvZ2VuZXJhdGVQYXRoLmpzIiwic3JjL2xpYi9yYW5kb20uanMiLCJzcmMvbm9ybWFsLWxpbmVzL2NvbmZpZy5qcyIsInNyYy9ub3JtYWwtbGluZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwid2luZG93Lm5vcm1hbExpbmVzID0gcmVxdWlyZSgnLi9ub3JtYWwtbGluZXMnKTtcbiIsImNvbnN0IHJhbmRvbSA9IHJlcXVpcmUoJy4vcmFuZG9tJyk7XG5cbi8qKlxuICogU3RvcmVzIHRoZSB4IGFuZCB5IGRpbWVuc2lvbnMgb2YgYSBldWNsaWRlYW4gdmVjdG9yIGluIHRoZSBjYXJ0ZXNpYW4gcGxhbmVcbiAqIGFuZCBwcm92aWRlcyBzb21lIHVzZWZ1bCBoZWxwZXIgZnVuY3Rpb25zLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBheCBUaGUgeCBkaW1lbnNpb24gb2YgdGhlIHZlY3Rvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBheSBUaGUgeSBkaW1lbnNpb24uXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gVmVjdG9yKGF4LCBheSkge1xuXHRpZiAoISh0aGlzIGluc3RhbmNlb2YgVmVjdG9yKSkge1xuXHRcdHJldHVybiBuZXcgVmVjdG9yKGF4LCBheSk7XG5cdH1cblxuXHR0aGlzLmF4ID0gYXg7XG5cdHRoaXMuYXkgPSBheTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBtYWduaXR1ZGUgb2YgdGhlIHZlY3Rvci5cbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgbWFnbml0dWRlIG9mIHRoZSB2ZWN0b3IuXG4gKi9cblZlY3Rvci5wcm90b3R5cGUuZ2V0TWFnbml0dWRlID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gTWF0aC5wb3coTWF0aC5wb3codGhpcy5heCwgMikgKyBNYXRoLnBvdyh0aGlzLmF5LCAyKSwgMC41KTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIG5ldyB2ZWN0b3Igd2l0aCBhIHNwZWNpZmllZCBtYWduaXR1ZGUuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IG5ld01hZ25pdHVkZSBUaGUgbWFnbml0dWRlIG9mIHRoZSBuZXcgdmVjdG9yLlxuICogQHJldHVybnMge1ZlY3Rvcn0gQSBuZXcgdmVjdG9yIHdpdGggc3BlY2lmaWVkIG1hZ25pdHVkZS5cbiAqL1xuVmVjdG9yLnByb3RvdHlwZS5yZXN0cmljdE1hZ25pdHVkZSA9IGZ1bmN0aW9uIChuZXdNYWduaXR1ZGUpIHtcblx0Y29uc3QgcmF0aW8gPSBuZXdNYWduaXR1ZGUgLyB0aGlzLmdldE1hZ25pdHVkZSgpO1xuXG5cdHJldHVybiBuZXcgVmVjdG9yKHRoaXMuYXggKiByYXRpbywgdGhpcy5heSAqIHJhdGlvKTtcbn07XG5cbi8qKlxuICogQ2hhbmdlcyBhIHZlY3RvciBzbGlnaHRseSBieSBhIHJhbmRvbSBhbW91bnQuIFVzZXMgYSByYW5kb20gZnVuY3Rpb24gd2l0aCBhXG4gKiBub3JtYWwgZGlzdHJpYnV0aW9uLCBzbyBpdCdzIHVzdWFsbHkgbm90IHRoYXQgZGlmZmVyZW50LlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZmFjdG9yPTFdIFN0YW5kYXJkIGRldmlhdGlvbiBvZiB0aGUgbm9ybWFsIGRpc3RyaWJ1dGlvblxuICogZnVuY3Rpb24gdXNlZC5cbiAqIEByZXR1cm5zIHtWZWN0b3J9IFNsaWdodGx5IGRpZmZlcmVudCB2ZWN0b3IuXG4gKi9cblZlY3Rvci5wcm90b3R5cGUucmFuZG9taXNlQnlGYWN0b3IgPSBmdW5jdGlvbiAoZmFjdG9yID0gMSkge1xuXHRyZXR1cm4gbmV3IFZlY3Rvcih0aGlzLmF4ICsgcmFuZG9tLm5vcm1hbCgpICogZmFjdG9yLCB0aGlzLmF5ICsgcmFuZG9tLm5vcm1hbCgpICogZmFjdG9yKTtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgdmVjdG9yIGJldHdlZW4gdHdvIGNvb3JkaW5hdGVzXG4gKlxuICogQHBhcmFtIHtDb29yZH0gZnJvbSBDb29yZGluYXRlIHRvIGNhbGN1bGF0ZSB2ZWN0b3IgZnJvbVxuICogQHBhcmFtIHtDb29yZH0gdG8gQ29vcmRpbmF0ZSB0byBjYWxjdWxhdGUgdmVjdG9yIHRvXG4gKi9cblZlY3Rvci5iZXR3ZWVuID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG5cdHJldHVybiBuZXcgVmVjdG9yKHRvLnggLSBmcm9tLngsIHRvLnkgLSBmcm9tLnkpO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBhdmVyYWdlIG9mIG4gdmVjdG9ycy5cbiAqXG4gKiBAcGFyYW0gey4uLlZlY3Rvcn0gdmVjdG9ycyBPbmUgb3IgbW9yZSB2ZWN0b3JzLlxuICogQHJldHVybnMge1ZlY3Rvcn0gVGhlIGF2ZXJhZ2UgdmVjdG9yLlxuICovXG5WZWN0b3IuYXZlcmFnZSA9IGZ1bmN0aW9uICguLi52ZWN0b3JzKSB7XG5cdGNvbnN0IGF4ID0gdmVjdG9ycy5yZWR1Y2UoKHN1bSwgeyBheCB9KSA9PiBzdW0gKyBheCwgMCkgLyB2ZWN0b3JzLmxlbmd0aDtcblx0Y29uc3QgYXkgPSB2ZWN0b3JzLnJlZHVjZSgoc3VtLCB7IGF5IH0pID0+IHN1bSArIGF5LCAwKSAvIHZlY3RvcnMubGVuZ3RoO1xuXG5cdHJldHVybiBuZXcgVmVjdG9yKGF4LCBheSk7XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHJhbmRvbSB2ZWN0b3IgZ29pbmcgPCAwLjUgb24gdGhlIHggYW5kIHkgYXhlcy5cbiAqXG4gKiBAcmV0dXJucyB7VmVjdG9yfSBSYW5kb20gdmVjdG9yLlxuICovXG5WZWN0b3IucmFuZG9tID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gbmV3IFZlY3RvcihyYW5kb20oKSwgcmFuZG9tKCkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3I7XG4iLCJjb25zdCBDb29yZCA9IHJlcXVpcmUoJy4vY29vcmQnKTtcblxuLyoqXG4gKiBBIHNtYWxsIHdyYXBwZXIgZnVuY3Rpb24gc28gdGhhdCB3ZSBkb24ndCBoYXZlIHRvIG1peCBjYW52YXMgbG9naWMgcmFuZG9tbHlcbiAqIGluIHRoZSByZXN0IG9mIHRoZSBjb2RlLiBCYXNpY2FsbHkgbWFrZXMgZXZlcnl0aGluZyB0ZXN0YWJsZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgVGhlIGVsZW1lbnQgdG8gZHJhdyBvbnRvLlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIENhbnZhcyhzZWxlY3Rvcikge1xuXHR0aGlzLl9jYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0dGhpcy5fY29udGV4dCA9IHRoaXMuX2NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5cdHRoaXMub3JpZ2luID0gbmV3IENvb3JkKHRoaXMuX2NhbnZhcy53aWR0aCAvIDIsIHRoaXMuX2NhbnZhcy5oZWlnaHQgLyAyKTtcbn1cblxuXG4vKipcbiAqIERyYXdzIGEgcGF0aCB0byB0aGUgY2FudmFzLiBQYXRoIHNob3VsZCBiZSBhIHN0cmluZyBzaW1pbGFyIHRvIGhvdyBSYXBoYWVsXG4gKiBkb2VzIGl0IChpdCdzIGVhc2llciB0ZXN0ZWQpLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCBjb250YWluaW5nIG9wdGlvbnM6IHBhdGgsIHdpZHRoIGFuZCBjb2xvci5cbiAqL1xuQ2FudmFzLnByb3RvdHlwZS5kcmF3UGF0aCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdGNvbnN0IGNvbnRleHQgPSB0aGlzLl9jb250ZXh0O1xuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXG5cdG9wdGlvbnMucGF0aC5mb3JFYWNoKGZ1bmN0aW9uIChwb2ludCkge1xuXHRcdHN3aXRjaCAocG9pbnQudHlwZSkge1xuXHRcdFx0Y2FzZSAnTSc6XG5cdFx0XHRcdGNvbnRleHQubW92ZVRvKHBvaW50LngsIHBvaW50LnkpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAnTCc6XG5cdFx0XHRcdGNvbnRleHQubGluZVRvKHBvaW50LngsIHBvaW50LnkpO1xuXHRcdH1cblx0fSk7XG5cblx0Y29udGV4dC5saW5lV2lkdGggPSBvcHRpb25zLndpZHRoO1xuXHRjb250ZXh0LnN0cm9rZVN0eWxlID0gb3B0aW9ucy5jb2xvcjtcblx0Y29udGV4dC5zdHJva2UoKTtcbn07XG5cbi8qKlxuICogRmlsbCB0aGUgZW50aXJlIGNhbnZhcyB3aXRoIGEgc3BlY2lmaWVkIGNvbG9yLiBHb29kIGZvciBiYWNrZ3JvdW5kcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgVGhlIGNvbG9yIHRvIGZpbGwgdGhlIGNhbnZhcyB3aXRoLlxuICovXG5DYW52YXMucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAoY29sb3IpIHtcblx0Y29uc3QgY29udGV4dCA9IHRoaXMuX2NvbnRleHQ7XG5cdGNvbnRleHQucmVjdCgwLCAwLCB0aGlzLl9jYW52YXMud2lkdGgsIHRoaXMuX2NhbnZhcy5oZWlnaHQpO1xuXHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRjb250ZXh0LmZpbGwoKTtcbn07XG5cbi8qKlxuICogRXhwb3J0IHRoZSBjb250ZW50cyBvZiB0aGUgY2FudmFzIHRvIGEgc3BlY2lmaWVkIGltYWdlIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIFNlbGVjdG9yIG1hdGNoaW5nIHRoZSBlbGVtZW50IHRvIGV4cG9ydCB0by5cbiAqL1xuQ2FudmFzLnByb3RvdHlwZS5leHBvcnRUbyA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuXHR0aGlzLl9jYW52YXMudG9CbG9iKGZ1bmN0aW9uIChibG9iKSB7XG5cdFx0Y29uc3QgaW1hZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0XHRpbWFnZS5zcmMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXHR9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzO1xuIiwiLyoqXG4gKiBTdG9yZXMgdGhlIHggYW5kIHkgcG9zaXRpb25zIG9mIGEgY29vcmRpbmF0ZSBhbmQgcHJvdmlkZXMgc29tZSB1c2VmdWwgaGVscGVyXG4gKiBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIHggcG9zaXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0geSBUaGUgeSBwb3NpdGlvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBDb29yZCh4LCB5KSB7XG5cdGlmICghKHRoaXMgaW5zdGFuY2VvZiBDb29yZCkpIHtcblx0XHRyZXR1cm4gbmV3IENvb3JkKHgsIHkpO1xuXHR9XG5cblx0dGhpcy54ID0geDtcblx0dGhpcy55ID0geTtcbn1cblxuLyoqXG4gKiBXb3JrcyBvdXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gdHdvIGNvb3JkaW5hdGVzIHVzaW5nIFB5dGhhZ29yYXMnIHRoZW9ydW0uXG4gKlxuICogQHBhcmFtIHtDb29yZH0gb3RoZXIgVGhlIG90aGVyIGNvb3JkaW5hdGUuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgdHdvIGNvb3JkaW5hdGVzLlxuICovXG5Db29yZC5wcm90b3R5cGUuZGlzdEZyb20gPSBmdW5jdGlvbiAob3RoZXIpIHtcblx0Y29uc3QgZGlzdFggPSBNYXRoLnBvdyh0aGlzLnggLSBvdGhlci54LCAyKTtcblx0Y29uc3QgZGlzdFkgPSBNYXRoLnBvdyh0aGlzLnkgLSBvdGhlci55LCAyKTtcblxuXHRyZXR1cm4gTWF0aC5wb3coZGlzdFggKyBkaXN0WSwgMC41KTtcbn07XG5cbi8qKlxuICogQWRkcyBhIHZlY3RvciB0byB0aGUgY29vcmRpbmF0ZS5cbiAqXG4gKiBAcGFyYW0ge1ZlY3Rvcn0gdmVjdG9yIFRoZSB2ZWN0b3IgdG8gYWRkIHRvIHRoZSBjb29yZGluYXRlLlxuICogQHJldHVybnMge0Nvb3JkfSBUaGUgbmV3IGNvb3JkaW5hdGUuXG4gKi9cbkNvb3JkLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodmVjdG9yKSB7XG5cdHJldHVybiBuZXcgQ29vcmQodGhpcy54ICsgdmVjdG9yLmF4LCB0aGlzLnkgKyB2ZWN0b3IuYXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb29yZDtcbiIsImNvbnN0IFZlY3RvciA9IHJlcXVpcmUoJy4vdmVjdG9yJyk7XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgc2xpZ2h0bHkgd29iYmx5IHBhdGggYmV0d2VlbiB0d28gY29vcmRpbmF0ZXMuIFRoZSBhbW91bnQgb2ZcbiAqIHdvYmJsaW5lc3MgY2FuIGJlIGNoYW5nZWQgYnkgdHdlYWtpbmcgdGhlIGFib3ZlIGNvbnN0YW50cy5cbiAqXG4gKiBAcGFyYW0ge0Nvb3JkfSBmcm9tIFRoZSBjb29yZGluYXRlIHRvIGRyYXcgZnJvbS5cbiAqIEBwYXJhbSB7Q29vcmR9IHRvIFRoZSBjb29yZGluYXRlIHRvIGRyYXcgdG8uXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIENvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAqIEByZXR1cm5zIHtBcnJheX0gQW4gYXJyYXkgcmVwcmVzZW50aW5nIHRoZSBwYXRoIHRvIGRyYXcuXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlUGF0aChmcm9tLCB0bywgY29uZmlnKSB7XG5cdGxldCBwYXRoID0gW1xuXHRcdHsgdHlwZTogJ00nLCB4OiBmcm9tLngsIHk6IGZyb20ueSB9XG5cdF07XG5cblx0bGV0IGN1cnJlbnRQb2ludCA9IGZyb207XG5cdGxldCBjdXJyZW50RGlyZWN0aW9uO1xuXG5cdC8vIFNhZmV0eSB0byBhdm9pZCBjcmFzaGluZyBicm93c2Vyc1xuXHRsZXQgbWF4UnVucyA9IDEwMDA7XG5cblx0ZG8ge1xuXG5cdFx0Ly8gVGhpcyBpcyB0aGUgcGVyZmVjdCBkaXJlY3Rpb246IGFsc28sIGEgYm9yaW5nIHN0cmFpZ2h0IGxpbmVcblx0XHRsZXQgcGVyZmVjdCA9IFZlY3Rvci5iZXR3ZWVuKGN1cnJlbnRQb2ludCwgdG8pO1xuXG5cdFx0bGV0IG5ld0RpcmVjdGlvbjtcblx0XHRpZiAoY3VycmVudERpcmVjdGlvbikge1xuXHRcdFx0Ly8gVGhpcyBjYXJyaWVzIG9uIG1vc3QgaW4gdGhlIGRpcmVjdGlvbiB0aGUgbGluZSBpcyBjdXJyZW50bHkgZ29pbmcsIGJ1dFxuXHRcdFx0Ly8gc2tld3MgaXQgYSBsaXR0bGUgYml0IGJhY2sgdG93YXJkcyB0aGUgcG9pbnQgaXQncyBzdXBwb3NlZCB0byBiZSBnb2luZ1xuXHRcdFx0Ly8gc28gdGhhdCBpdCdzIG5vdCB0b28gY3Jhenlcblx0XHRcdG5ld0RpcmVjdGlvbiA9IFZlY3Rvci5hdmVyYWdlKFxuXHRcdFx0XHRcdHBlcmZlY3QucmVzdHJpY3RNYWduaXR1ZGUoY29uZmlnLkJJQVNfVE9fUEVSRkVDVCksXG5cdFx0XHRcdFx0Y3VycmVudERpcmVjdGlvbi5yZXN0cmljdE1hZ25pdHVkZSgxIC0gY29uZmlnLkJJQVNfVE9fUEVSRkVDVClcblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5ld0RpcmVjdGlvbiA9IHBlcmZlY3Q7XG5cdFx0fVxuXG5cdFx0bmV3RGlyZWN0aW9uID0gbmV3RGlyZWN0aW9uXG5cdFx0XHRcdC5yZXN0cmljdE1hZ25pdHVkZShjb25maWcuU0VHTUVOVF9MRU5HVEgpXG5cdFx0XHRcdC5yYW5kb21pc2VCeUZhY3Rvcihjb25maWcuUkFORE9NX0ZBQ1RPUik7XG5cblx0XHRsZXQgbmV3UG9pbnQgPSBjdXJyZW50UG9pbnQuYWRkKG5ld0RpcmVjdGlvbik7XG5cblx0XHRwYXRoLnB1c2goeyB0eXBlOiAnTCcsIHg6IG5ld1BvaW50LngsIHk6IG5ld1BvaW50LnkgfSk7XG5cdFx0Y3VycmVudFBvaW50ID0gbmV3UG9pbnQ7XG5cdFx0Y3VycmVudERpcmVjdGlvbiA9IG5ld0RpcmVjdGlvbjtcblxuXHR9IHdoaWxlIChjdXJyZW50UG9pbnQuZGlzdEZyb20odG8pID4gY29uZmlnLlNFR01FTlRfTEVOR1RIICogMTAgJiYgbWF4UnVucy0tKTtcblxuXHRyZXR1cm4gcGF0aDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZW5lcmF0ZVBhdGg7XG4iLCIvKipcbiAqIFJldHVybnMgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gLTAuNSBhbmQgMC41LiBCYXNpY2FsbHkgaW4gaXRzIG93biBmdW5jdGlvblxuICogc28gdGhhdCBpdCBjYW4gYmUgcmVwbGFjZWQgd2l0aCBhIGRpZmZlcmVudCByYW5kb20gZnVuY3Rpb24gaWYgbmVlZGVkLlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ9IEEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIC0wLjUgYW5kIDAuNS5cbiAqL1xuZnVuY3Rpb24gcmFuZG9tKCkge1xuXHRyZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTtcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSBub3JtYWxseSBkaXN0cmlidXRlZCByYW5kb20gbnVtYmVycy5cbiAqXG4gKiBPbmx5IGFuIGFwcHJveGltYXRpb246IGFjdHVhbGx5IGEgSXJ3aW7igJNIYWxsIGRpc3RyaWJ1dGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBBIG51bWJlciBiZXR3ZWVuIC02IGFuZCA2IHRoYXQgd2lsbCBhcHByb3hpbWF0ZWx5IG1hcCB0byBhXG4gKiBub3JtYWwgZGlzdHJpYnV0aW9uLlxuICovXG5yYW5kb20ubm9ybWFsID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgdG90YWwgPSAwO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgMTI7IGkrKykge1xuXHRcdHRvdGFsICs9IHJhbmRvbSgpO1xuXHR9XG5cblx0cmV0dXJuIHRvdGFsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSByYW5kb207XG4iLCJjb25zdCByYW5kb20gPSByZXF1aXJlKCcuLi9saWIvcmFuZG9tJyk7XG5cbmV4cG9ydHMuTlVNQkVSX09GX0xJTkVTID0gMTAwMDtcblxuZXhwb3J0cy5zdGFydExlbmd0aCA9ICgpID0+IDQwMCArIHJhbmRvbSgpICogNTAwO1xuZXhwb3J0cy5lbmRMZW5ndGggPSAoKSA9PiA4MDAgKyByYW5kb20oKSAqIDEwMDtcblxuXG5leHBvcnRzLkJBQ0tHUk9VTkRfQ09MT1IgPSAnIzI2MjgxOSc7XG5cbi8vIENvbG9ycyBmb3IgdGhlIHBhdGhcbmxldCBvcGFjaXR5ID0gMC42O1xuXG4vLyBodHRwczovL2NvbG9yLmFkb2JlLmNvbS9QYXNzYWRvMS1jb2xvci10aGVtZS04MDMyNDAxL1xuZXhwb3J0cy5DT0xPUlMgPSBbXG5cdGByZ2JhKDgzLCA4NCwgMTE1LCAke29wYWNpdHl9KWAsIC8vIGJsdWVcblx0YHJnYmEoMjE0LCAyMTYsIDIwOSwgJHtvcGFjaXR5fSlgLCAvLyB3aGl0ZVxuXHRgcmdiYSgxNTksIDE0NSwgMTI0LCAke29wYWNpdHl9KWAsIC8vIGNyZWFtXG5cdGByZ2JhKDE0MiwgNTUsIDQ4LCAke29wYWNpdHl9KWAgLy8gcmVkXG5dO1xuXG5leHBvcnRzLkxJTkVfV0lEVEggPSA2O1xuXG5cbi8vIExpbmUgZ2VuZXJhdGlvbiBjb25maWdcbmV4cG9ydHMuU0VHTUVOVF9MRU5HVEggPSAxMDtcbmV4cG9ydHMuQklBU19UT19QRVJGRUNUID0gMC41O1xuZXhwb3J0cy5SQU5ET01fRkFDVE9SID0gMTtcbiIsImNvbnN0IENhbnZhcyA9IHJlcXVpcmUoJy4uL2xpYi9jYW52YXMnKTtcbmNvbnN0IFZlY3RvciA9IHJlcXVpcmUoJy4uL2xpYi9WZWN0b3InKTtcbmNvbnN0IGdlbmVyYXRlUGF0aCA9IHJlcXVpcmUoJy4uL2xpYi9nZW5lcmF0ZVBhdGgnKTtcbmNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG5cdGNvbnN0IGNhbnZhcyA9IG5ldyBDYW52YXMoc2VsZWN0b3IpO1xuXHRjb25zdCBvcmlnaW4gPSBjYW52YXMub3JpZ2luO1xuXG5cdGNhbnZhcy5maWxsKGNvbmZpZy5CQUNLR1JPVU5EX0NPTE9SKTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy5OVU1CRVJfT0ZfTElORVM7IGkrKykge1xuXHRcdGxldCByYW5kb21EaXJlY3Rpb24gPSBWZWN0b3IucmFuZG9tKCk7XG5cdFx0bGV0IHN0YXJ0ID0gb3JpZ2luLmFkZChyYW5kb21EaXJlY3Rpb24ucmVzdHJpY3RNYWduaXR1ZGUoY29uZmlnLnN0YXJ0TGVuZ3RoKCkpKTtcblx0XHRsZXQgZW5kID0gb3JpZ2luLmFkZChyYW5kb21EaXJlY3Rpb24ucmVzdHJpY3RNYWduaXR1ZGUoY29uZmlnLmVuZExlbmd0aCgpKSk7XG5cblx0XHRjYW52YXMuZHJhd1BhdGgoe1xuXHRcdFx0cGF0aDogZ2VuZXJhdGVQYXRoKHN0YXJ0LCBlbmQsIGNvbmZpZyksXG5cdFx0XHR3aWR0aDogY29uZmlnLkxJTkVfV0lEVEgsXG5cdFx0XHRjb2xvcjogY29uZmlnLkNPTE9SU1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb25maWcuQ09MT1JTLmxlbmd0aCldXG5cdFx0fSk7XG5cdH1cbn07XG4iXX0=
