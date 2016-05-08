import buble from 'rollup-plugin-buble';

export default {
	entry: 'src/index.js',
	dest: 'demo/line.js',
	sourceMap: true,
	plugins: [
		buble()
	],
	format: 'umd',
	moduleName: 'line'
};
