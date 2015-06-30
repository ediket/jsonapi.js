'use strict';


var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');
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
  'watch:build',
  'watch:test',
  'watch:lint'
]);

gulp.task('watch:build', function() {
  webpack(webpackConfig).watch({}, webpackLogger());
});

gulp.task('watch:test', function() {
  gulp.watch(['tests/**/*', pkg.main], ['test:src']);
});

gulp.task('watch:lint', function() {
  gulp.watch(['src/**/*'], ['lint:src']);
});

gulp.task('test:src', function() {
  return gulp.src('tests/*.js', { read: false })
    .pipe(mocha({}));
});

gulp.task('lint:src', function () {
  return gulp.src(['src/**/*.js', 'src/**/*.es6'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
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
