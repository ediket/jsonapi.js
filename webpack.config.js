var _ = require('lodash');
var webpackUMDExternal = require('webpack-umd-external');


module.exports = {
  devtool: 'eval-source-map',
  resolve: {
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.js', '.es6']
  },
  entry: {
    jsonapi: './src/jsonapi.es6'
  },
  output: {
    path: 'dist/',
    filename: 'jsonapi.js',
    library: ['JSONAPI'],
    libraryTarget: 'umd'
  },
  externals: webpackUMDExternal({
    'backbone': 'Backbone',
    'jquery': '$',
    'lodash': '_',
    'node-uuid': 'uuid',
    'q': 'Q',
    'underscore-db': 'underscoreDB',
    'url-join': 'urljoin',
    'jsondiffpatch': 'jsondiffpatch'
  }),
  module: {
    loaders: [
      {
        test: /\.es6$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  }
};
