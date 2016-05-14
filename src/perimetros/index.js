const Canvas = require('../lib/canvas');
const Vector = require('../lib/vector');
const config = require('./config');

module.exports = function (selector) {
	const canvas = new Canvas(selector);
	const origin = canvas.origin;

	document.documentElement.style.backgroundColor = config.BACKGROUND_COLOR;
	canvas.fill(config.BACKGROUND_COLOR);

	const digits = config.DIGITS.split('').map(Number);
	let i = 0;

	digits.forEach(function (digit) {
		const path = [];
		const iAfter = i + digit + 1;

		for (let j = i; j <= iAfter; j++) {
			const direction = Math.PI / 150 * j - Math.PI / 2;
			const magnitude = 1200 / Math.pow(j / 3500 + 1, 2);

			const vector = Vector.fromDirection(direction, magnitude);
			const coord = origin.add(vector);

			path.push({ type: 'L', x: coord.x, y: coord.y });
		}

		i = iAfter + 3 + i / 2000;

		path[0].type = 'M';

		const width = 20 - Math.pow(i / 40, 0.5);

		canvas.drawPath({
			path,
			width,
			color: config.COLOR,
			lineCap: 'round'
		});
	});
};
