import Coord from './coord';
import Vector from './vector';


const SEGMENT_LENGTH = 5;
const BIAS_TO_PERFECT = 0.5;
const RANDOM_FACTOR = 0.5;


export default function generatePath(from, to) {
	let path = `M${from.x},${from.y}`;
	let currentPoint = from;
	let currentDirection;

	// Safety to avoid crashing browsers
	let maxRuns = 1000;

	do {

		// This is the perfect direction: also, a boring straight line
		let perfect = Vector.between(currentPoint, to);

		let newDirection;
		if (currentDirection) {
			newDirection = Vector.average(
					perfect.restrictMagnitude(BIAS_TO_PERFECT),
					currentDirection.restrictMagnitude(1 - BIAS_TO_PERFECT)
			);
		} else {
			newDirection = perfect;
		}

		newDirection = newDirection
				.restrictMagnitude(SEGMENT_LENGTH)
				.randomiseByFactor(RANDOM_FACTOR);

		let newPoint = currentPoint.add(newDirection);

		path += `L${newPoint.x},${newPoint.y}`;
		currentPoint = newPoint;
		currentDirection = newDirection;

	} while (currentPoint.distFrom(to) > SEGMENT_LENGTH * 10 && maxRuns--);

	return path;
}
