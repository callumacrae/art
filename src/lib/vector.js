import random from './random';

// Euclidean vector in the Cartesian plane
export default function Vector(ax, ay) {
	if (!(this instanceof Vector)) {
		return new Vector(ax, ay);
	}

	this.ax = ax;
	this.ay = ay;
}

Vector.prototype.getMagnitude = function () {
	return Math.pow(Math.pow(this.ax, 2) + Math.pow(this.ay, 2), 0.5);
};

Vector.prototype.restrictMagnitude = function (newMagnitude) {
	const ratio = newMagnitude / this.getMagnitude();

	return new Vector(this.ax * ratio, this.ay * ratio);
};

Vector.prototype.randomiseByFactor = function (factor) {
	return new Vector(this.ax + random() * factor, this.ay);
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

Vector.average = function (...vectors) {
	const ax = vectors.reduce((sum, { ax }) => sum + ax, 0) / vectors.length;
	const ay = vectors.reduce((sum, { ay }) => sum + ay, 0) / vectors.length;

	return new Vector(ax, ay);
};

Vector.random = function () {
	return new Vector(random(), random());
};
