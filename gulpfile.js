
'use strict';


var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var gutil = require("gulp-util");
var webpack = require("webpack");
var webpackBowerConfig = require('./webpack.bower.config');
var webpackNPMConfig = require('./webpack.npm.config');


gulp.task('default', ['build']);
gulp.task('build', [
  'build-bower', 'build-npm'
]);
gulp.task('build-bower', [
  'build-bower:clean',
  'build-bower:vendors',
  'build-bower:src'
]);
gulp.task('build-npm', [
  'build-npm:clean',
  'build-npm:src'
]);

function webpackCallback (callback) {
  return function (err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
        // output options
    }));
    callback();
  };
}

gulp.task('build-bower:src', function (callback) {
  webpack(webpackBowerConfig, webpackCallback(callback));
});

gulp.task('build-bower:vendors', function () {
  return gulp.src(mainBowerFiles())
    .pipe(sourcemaps.init())
    .pipe(concat('vendors.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build-bower'));
});

gulp.task('build-npm:src', function (callback) {
  webpack(webpackNPMConfig, webpackCallback(callback));
});


gulp.task('build-bower:clean', function () {
  return gulp.src('build-bower')
    .pipe(vinylPaths(del));
});

gulp.task('build-npm:clean', function () {
  return gulp.src('build-npm')
    .pipe(vinylPaths(del));
});
