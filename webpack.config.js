'use strict';


var _ = require('lodash');


function transformUMDExternal(externals) {
  return _.mapValues(externals, function(externalKey, requireKey) {
    return {
      'root': externalKey,
      'amd': requireKey,
      'commonjs': requireKey,
      'commonjs2': requireKey
    };
  });
}


module.exports = {
  devtool: 'eval-source-map',
  resolve: {
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
  externals: transformUMDExternal({
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
