import random from './lib/random';

export const NUMBER_OF_LINES = 1000;

export const startLength = () => 400 + random() * 500;
export const endLength = () => 800 + random() * 100;


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

export const LINE_WIDTH = 4;


// Line generation config
export const SEGMENT_LENGTH = 10;
export const BIAS_TO_PERFECT = 0.5;
export const RANDOM_FACTOR = 1;
