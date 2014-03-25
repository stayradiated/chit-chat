var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
});

gulp.task('sass', function () {
  gulp.src('stylesheets/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function () {
  gulp.src('scripts/client/index.js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});
