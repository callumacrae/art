import Canvas from './lib/canvas';
import Vector from './lib/Vector';
import generatePath from './lib/generatePath';
import * as config from './config';

const canvas = new Canvas('#canvas');
const origin = canvas.origin;

canvas.fill(config.BACKGROUND_COLOR);

for (var i = 0; i < config.NUMBER_OF_LINES; i++) {
	let randomDirection = Vector.random();
	let start = origin.add(randomDirection.restrictMagnitude(config.startLength()));
	let end = origin.add(randomDirection.restrictMagnitude(config.endLength()));
	canvas.drawPath(generatePath(start, end));
}
