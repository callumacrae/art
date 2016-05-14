import random from './lib/random';

export const NUMBER_OF_LINES = 1000;

export const startLength = () => 200 + random() * 250;
export const endLength = () => 400 + random() * 50;


export const BACKGROUND_COLOR = '#262819';

// Colors for the path
let opacity = 0.6;

// https://color.adobe.com/Passado1-color-theme-8032401/
export const COLORS = [
	`rgba(83, 84, 115, ${opacity})`, // blue
	`rgba(214, 216, 209, ${opacity})`, // white
	`rgba(159, 145, 124, ${opacity})`, // cream
	`rgba(142, 55, 48, ${opacity})` // red
];

export const LINE_WIDTH = 2;


// Line generation config
export const SEGMENT_LENGTH = 5;
export const BIAS_TO_PERFECT = 0.5;
export const RANDOM_FACTOR = 0.5;
