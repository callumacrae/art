export default function Coord(x, y) {
	if (!(this instanceof Coord)) {
		return new Coord(x, y);
	}

	this.x = x;
	this.y = y;
}

// Basic Pythagoras theorem
Coord.prototype.distFrom = function (other) {
	const distX = Math.pow(this.x - other.x, 2);
	const distY = Math.pow(this.y - other.y, 2);

	return Math.pow(distX + distY, 0.5);
};

Coord.prototype.add = function (vector) {
	return new Coord(this.x + vector.ax, this.y + vector.ay);
};
