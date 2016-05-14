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

/**
 * Generate a vector from the direction and magnitude instead of from the
 * components.
 *
 * @param {number} direction Direction in radians.
 * @param {number} magnitude Magnitude of the vector.
 * @returns {Vector} Generated vector.
 */
Vector.fromDirection = function (direction, magnitude = 1) {
	const ax = magnitude * Math.cos(direction);
	const ay = magnitude * Math.sin(direction);
	return new Vector(ax, ay);
};

module.exports = Vector;
