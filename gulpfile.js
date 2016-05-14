var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

function js() {
	var bundler = browserify({
		entries: './src/index.js',
		debug: true
	});

	return bundler.bundle()
		.pipe(source('art.js'))
		.pipe(gulp.dest('./demo'))
		.pipe(browserSync.stream());
}

gulp.task(js);
gulp.task('default', js);

if (process.argv.indexOf('--watch') !== -1) {
	gulp.watch('./src/**/*.js', gulp.series('js'));

	browserSync.init({
		server: './demo'
	});
}
