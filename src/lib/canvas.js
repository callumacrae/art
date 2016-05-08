export default function Canvas(selector) {
	this._canvas = document.querySelector(selector);
	this._context = this._canvas.getContext('2d');
}

let opacity = 0.6;

// https://color.adobe.com/Passado1-color-theme-8032401/
let colors = [
	`rgba(83, 84, 115, ${opacity})`, // blue
	`rgba(214, 216, 209, ${opacity})`, // white
	`rgba(159, 145, 124, ${opacity})`, // cream
	`rgba(142, 55, 48, ${opacity})` // red
];

/**
 * Draws a path to the canvas. Path should be a string similar to how Raphael
 * does it (it's easier tested).
 *
 * @param {string} path M0,0L10,10L20,20 or something
 */
Canvas.prototype.drawPath = function (path) {
	const context = this._context;
	context.beginPath();

	const points = path.split(/(?=[A-Z])/g);

	points.forEach(function (point) {
		let [_, type, ax, ay] = point.match(/^([A-Z])([\d.]+),([\d.]+)$/);

		switch (type) {
			case 'M':
				context.moveTo(ax, ay);
				break;

			case 'L':
				context.lineTo(ax, ay);
		}
	});

	context.lineWidth = 2;


	context.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
	context.stroke();
};