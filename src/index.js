import Canvas from './lib/canvas';
import Coord from './lib/coord';
import Vector from './lib/Vector';
import random from './lib/random';
import generatePath from './lib/generatePath';

const canvas = new Canvas('#canvas');




function drawDiagonal(n) {
	for (let i = 0; i < n; i++) {
		let path = generatePath(new Coord(100, 100), new Coord(700, 500));
		canvas.drawPath(path);
	}
}

//drawDiagonal(10);

function drawSunburst(n) {
	const origin = new Coord(400, 300);

	for (var i = 0; i < n; i++) {
		let randomDirection = new Vector(random(), random());
		let start = origin.add(randomDirection.restrictMagnitude(60 + random() * 20));
		let end = origin.add(randomDirection.restrictMagnitude(300));
		let path = generatePath(start, end);
		canvas.drawPath(path);
	}
}

drawSunburst(600);
