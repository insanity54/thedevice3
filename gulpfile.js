var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var wrap = require('gulp-wrap');
var del = require('del');


var paths = {
    scripts: ['client/js/**/*.js', '!client/external/**/*.js'],
    images: 'client/img/**/*',
    styles: 'client/styles/**/*.scss',
    pages: 'client/pages/**/*.html',
    layouts: 'client/layouts/**/*.html'
};


// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
	// You can use multiple globbing patterns as you would with `gulp.src`
	return del(['dist']);
    });

gulp.task('scripts', ['clean'], function() {
	// Minify and copy all JavaScript (except vendor scripts)
	// with sourcemaps all the way down
	return gulp.src(paths.scripts)
	    .pipe(sourcemaps.init())
	    .pipe(uglify())
	    .pipe(concat('all.min.js'))
	    .pipe(sourcemaps.write())
	    .pipe(gulp.dest('dist/js'));
    });

// Copy all static images
gulp.task('images', ['clean'], function() {
	return gulp.src(paths.images)
	    // Pass in options to the task
	    .pipe(imagemin({optimizationLevel: 5}))
	    .pipe(gulp.dest('dist/img'));
    });

// put html partial files into the layout
gulp.task('layout', function() {
	gulp.src(paths.pages)
	    .pipe(wrap({src: paths.layouts + 'layout.html'}, {}, {engine: 'nunjucks'}))
	    .pipe(gulp.dest('dist'));
    });


// compress and copy sass
gulp.task('styles', function () {
	gulp.src(paths.styles)
	    .pipe(sass({outputStyle: 'compressed'}))
	    .pipe(gulp.dest('dist/css'));
    });


// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.images, ['images']);
    });

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['layout', 'scripts', 'styles', 'images']);