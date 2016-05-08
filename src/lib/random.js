/**
 * Returns a random number between -0.5 and 0.5. Basically in its own function
 * so that it can be replaced with a different random function if needed.
 *
 * @returns {number} A random number between -0.5 and 0.5.
 */
export default function random() {
	return Math.random() - 0.5;
}
