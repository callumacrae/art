const random = require('../lib/random');

exports.NUMBER_OF_LINES = 1000;

exports.startLength = () => 400 + random() * 500;
exports.endLength = () => 800 + random() * 100;


exports.BACKGROUND_COLOR = '#262819';

// Colors for the path
let opacity = 0.6;

// https://color.adobe.com/Passado1-color-theme-8032401/
exports.COLORS = [
	`rgba(83, 84, 115, ${opacity})`, // blue
	`rgba(214, 216, 209, ${opacity})`, // white
	`rgba(159, 145, 124, ${opacity})`, // cream
	`rgba(142, 55, 48, ${opacity})` // red
];

exports.LINE_WIDTH = 6;


// Line generation config
exports.SEGMENT_LENGTH = 10;
exports.BIAS_TO_PERFECT = 0.5;
exports.RANDOM_FACTOR = 1;
