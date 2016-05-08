import Canvas from './lib/canvas';
import Vector from './lib/Vector';
import random from './lib/random';
import generatePath from './lib/generatePath';

const canvas = new Canvas('#canvas');
const origin = canvas.origin;

const NUMBER_OF_LINES = 1000;

for (var i = 0; i < NUMBER_OF_LINES; i++) {
	let randomDirection = Vector.random();
	let start = origin.add(randomDirection.restrictMagnitude(200 + random() * 250));
	let end = origin.add(randomDirection.restrictMagnitude(400 + random() * 50));
	canvas.drawPath(generatePath(start, end));
}
