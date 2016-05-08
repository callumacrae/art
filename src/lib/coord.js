/**
 * Stores the x and y positions of a coordinate and provides some useful helper
 * functions.
 *
 * @param {number} x The x position.
 * @param {number} y The y position.
 * @constructor
 */
export default function Coord(x, y) {
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
