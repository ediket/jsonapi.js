var gulp = require('gulp');
var watch = require('gulp-watch');
var karma = require('karma');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var pkg = require('./package.json')
var runSequence = require('run-sequence');
var _ = require('lodash');

var dependencies = _.keys(pkg.dependencies);


gulp.task('watch:src', function() {

  gulp.watch('src/**/*.js', ['browserify:src']);

});

gulp.task('watch:test', function() {

  karma.server.start({
    configFile: __dirname + '/karma.conf.js'
  });

});

gulp.task('browserify:src', function () {

  var b = browserify({
    entries: './jsonapi',
    basedir: './src/',
    standalone: 'JSONAPI',
    debug: true
  })
  .external(dependencies);

  return b.bundle()
    .on('error', function () { //prevent gulp-watch breaking down from errors.
      console.error(arguments);
      this.emit('end');
    })
    .pipe(source('jsonapi.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build-bower'));

});

gulp.task('browserify:vendor', function () {

  return browserify()
    .require(dependencies)
    .bundle()
    .pipe(source('vendor.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build-bower'));

});

gulp.task('build', ['browserify:src', 'browserify:vendor']);

gulp.task('dev', function (callback) {
  runSequence(
    [
      'browserify:src'
    ],
    'watch:test',
    'watch:src',
    callback
  );
});

gulp.task('default', ['dev']);
