/**
 * Returns a random number between -0.5 and 0.5. Basically in its own function
 * so that it can be replaced with a different random function if needed.
 *
 * @returns {number} A random number between -0.5 and 0.5.
 */
export default function random() {
	return Math.random() - 0.5;
}

/**
 * Generate normally distributed random numbers.
 *
 * Only an approximation: actually a Irwin–Hall distribution.
 *
 * @returns {number} A number between -6 and 6 that will approximately map to a
 * normal distribution.
 */
random.normal = function () {
	var total = 0;

	for (let i = 0; i < 12; i++) {
		total += random();
	}

	return total;
};
