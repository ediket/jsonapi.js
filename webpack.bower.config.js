
'use strict';


module.exports = {
  devtool: "inline-source-map",
  resolve: {
    extensions: ['', '.js']
  },
  entry: {
    jsonapi: './index.js'
  },
  output: {
    path: 'build-bower/',
    filename: "jsonapi.js",
    library: ["JSONAPI"],
    libraryTarget: "umd"
  },
  externals: {
    "backbone": "Backbone",
    "jquery": "$",
    "lodash": "_",
    "node-uuid": "uuid",
    "q": "Q",
    "url-join": "urlJoin"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' }
    ]
  }
};
