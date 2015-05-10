
'use strict';

var webpack = require('webpack');
var _ = require('lodash');
var pkg = require('./package.json');


module.exports = {
  devtool: "inline-source-map",
  resolve: {
    extensions: ['', '.js']
  },
  entry: {
    'jsonapi': './index.js'
  },
  output: {
    path: 'build-npm/',
    // filename: 'jsonapi.js',
    filename: "[name].js",
    library: [pkg.name],
    libraryTarget: "commonjs2"
  },
  externals: [_.keys(pkg.dependencies)],
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' }
    ]
  }
};
