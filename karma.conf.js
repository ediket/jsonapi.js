// Karma configuration
// Generated on Wed Apr 22 2015 10:32:14 GMT+0900 (KST)

module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['browserify', 'mocha'],
    files: [
      './build-bower/vendor.js',
      './build-bower/jsonapi.js',
      './tests/**/*.js'
    ],
    exclude: [
      '*.js'
    ],
    preprocessors: {
      "./tests/**/*.js": ['browserify']
    },
    reporters: ['mocha'],
    colors: true,
    logLevel: config.LOG_ERROR,
    browsers: ['Chrome']
  });
};
