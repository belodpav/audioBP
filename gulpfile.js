var gulp = require('gulp'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	connect = require('gulp-connect'),
	cleanCSS = require('gulp-clean-css');

gulp.task('build__css', function() {
	return gulp.src('./src/css/main.css')
	.pipe(autoprefixer({
		browsers: [
    		"last 5 version",
      		"ie 10"
      		],
    	cascade: false 
    }))
    .pipe(rename('simple-modal.css'))
	.pipe(gulp.dest('./dist/'))
    .pipe(cleanCSS())
	.pipe(rename('simple-modal.min.css'))
	.pipe(gulp.dest('./dist/'))
});
gulp.task('build__js', function() {
	return gulp.src('./src/js/script.js')
	.pipe(rename('simple-modal.js'))
	.pipe(gulp.dest('./dist/'));
});
gulp.task('build', ['build__css', 'build__js']);

gulp.task('css', function() {
	return gulp.src('./src/css/main.css')
	.pipe(autoprefixer({
		browsers: [
    		"last 5 version",
      		"ie 10"
      		],
    	cascade: false 
    }))
	.pipe(rename('style.css'))
	.pipe(gulp.dest('src/css/'))
	.pipe(connect.reload());
});

gulp.task('js', function() {
	gulp.src('./src/js/*.js')
	.pipe(connect.reload());
});
gulp.task('html', function() {
	gulp.src('./src/*.html')
	.pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    root: '',
    livereload: true
  });
});

gulp.task('watch', function() {
	gulp.watch('./src/index.html', ['html']);
	gulp.watch('./src/css/main.css', ['css']);
	gulp.watch('./src/js/script.js', ['js']);
});

gulp.task('default', ['watch', 'connect', 'css', 'html', 'js']);