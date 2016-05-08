import Coord from './coord';
import Vector from './vector';
import * as config from '../config';

/**
 * Generates a slightly wobbly path between two coordinates. The amount of
 * wobbliness can be changed by tweaking the above constants.
 *
 * @param {Coord} from The coordinate to draw from.
 * @param {Coord} to The coordinate to draw to.
 * @returns {string} A string representing the path to draw.
 */
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
			// This carries on most in the direction the line is currently going, but
			// skews it a little bit back towards the point it's supposed to be going
			// so that it's not too crazy
			newDirection = Vector.average(
					perfect.restrictMagnitude(config.BIAS_TO_PERFECT),
					currentDirection.restrictMagnitude(1 - config.BIAS_TO_PERFECT)
			);
		} else {
			newDirection = perfect;
		}

		newDirection = newDirection
				.restrictMagnitude(config.SEGMENT_LENGTH)
				.randomiseByFactor(config.RANDOM_FACTOR);

		let newPoint = currentPoint.add(newDirection);

		path += `L${newPoint.x},${newPoint.y}`;
		currentPoint = newPoint;
		currentDirection = newDirection;

	} while (currentPoint.distFrom(to) > config.SEGMENT_LENGTH * 10 && maxRuns--);

	return path;
}
