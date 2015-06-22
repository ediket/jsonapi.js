'use strict';


var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var mocha = require('gulp-mocha');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var webpackLogger = require('webpack-gulp-logger');
var pkg = require('./package.json');


require('babel/register');


gulp.task('default', ['build']);

gulp.task('build', [
  'build:clean',
  'build:vendors',
  'build:src'
]);

gulp.task('test', [
  'test:src'
]);

gulp.task('watch', [
  'watch:src',
  'watch:test'
]);

gulp.task('watch:test', function() {
  gulp.watch(['tests/**/*', pkg.main], ['test:src']);
});

gulp.task('watch:src', function() {
  webpack(webpackConfig).watch({}, webpackLogger());
});

gulp.task('test:src', function() {
  return gulp.src('tests/*.js', { read: false })
    .pipe(mocha({}));
});

gulp.task('build:src', function(callback) {
  webpack(webpackConfig, webpackLogger(callback));
});

gulp.task('build:vendors', function() {
  return gulp.src(mainBowerFiles())
    .pipe(sourcemaps.init())
    .pipe(concat('vendors.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('build:clean', function() {
  return gulp.src('dist')
    .pipe(vinylPaths(del));
});
