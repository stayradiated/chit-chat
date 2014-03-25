var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');

gulp.task('default', ['sass', 'scripts']);

gulp.task('watch', function () {
  gulp.watch('stylesheets/**/*.scss', ['sass']);
  gulp.watch('scripts/client/**/*.js', ['scripts']);
});

gulp.task('connect', ['watch'], connect.server({
  root: ['dist'],
  port: 8080,
  livereload: true
}));

gulp.task('sass', function () {

  var _sass = sass();
  _sass.on('error', console.log.bind(console));

  gulp.src('stylesheets/main.scss')
    .pipe(_sass)
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('scripts', function () {
  gulp.src('scripts/client/index.js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload());
});
