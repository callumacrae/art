const Canvas = require('../lib/canvas');
const Vector = require('../lib/vector');
const generatePath = require('../lib/generatePath');
const config = require('./config');

module.exports = function (selector) {
	const canvas = new Canvas(selector);
	const origin = canvas.origin;

	document.documentElement.style.backgroundColor = config.BACKGROUND_COLOR;
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
