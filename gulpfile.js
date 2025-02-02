var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var del = require('del');

gulp.task('default', ['watch']);

gulp.task('watch', ['scripts', 'styles'], function() {
	browserSync.init({
		server: {
			baseDir: ['./app', './dist']
		}
	});

	gulp.watch('app/scripts/**/*.js', ['scripts']);
	gulp.watch('app/styles/**/*.scss', ['styles']);
	gulp.watch([
		'dist/**/*',
		'app/*.html'
		]).on('change', browserSync.reload)
});

gulp.task('build', ['clean', 'scripts', 'styles', 'html']);

gulp.task('clean', function(cb) {
	del(['dist/**/*'], cb);
});
gulp.task('html', function() {
	return gulp.src('app/*.html')
		.pipe($.htmlmin())
		.pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
	return $.rubySass('app/styles', { sourcemap: true })
		.pipe($.plumber())
		.pipe($.sourcemaps.write('./', {
			includeContent: false,
			sourceRoot: '/app/styles'
		}))
		.pipe(gulp.dest('dist/styles'));
});

gulp.task('scripts', function() {
	return gulp.src(['app/scripts/vendor/**/*.js',  'app/scripts/glyphs.js', 'app/scripts/*.js'])
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.eslint())
		.pipe($.eslint.format())
		//.pipe($.traceur())
		.pipe($.concat('ipa-input.js'))
		.pipe($.uglify())
		.pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest('dist'));
});