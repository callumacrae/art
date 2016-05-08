import Coord from './coord';
import { COLORS as colors } from '../config';

/**
 * A small wrapper function so that we don't have to mix canvas logic randomly
 * in the rest of the code. Basically makes everything testable.
 *
 * @param {string} selector The element to draw onto.
 * @constructor
 */
export default function Canvas(selector) {
	this._canvas = document.querySelector(selector);
	this._context = this._canvas.getContext('2d');

	this.origin = new Coord(this._canvas.width / 2, this._canvas.height / 2);
}


/**
 * Draws a path to the canvas. Path should be a string similar to how Raphael
 * does it (it's easier tested).
 *
 * @param {string} path M0,0L10,10L20,20 or something
 */
Canvas.prototype.drawPath = function (path) {
	const context = this._context;
	context.beginPath();

	const points = path.split(/(?=[A-Z])/g);

	points.forEach(function (point) {
		let [_, type, ax, ay] = point.match(/^([A-Z])(-?[\d.]+),(-?[\d.]+)$/);

		switch (type) {
			case 'M':
				context.moveTo(ax, ay);
				break;

			case 'L':
				context.lineTo(ax, ay);
		}
	});

	context.lineWidth = 2;

	context.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
	context.stroke();
};
