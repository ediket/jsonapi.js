'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Operation = function Operation(options) {
  _classCallCheck(this, Operation);

  this.op = options.op;
  this.path = options.path;
  if (options.op !== 'remove') {
    this.value = options.value;
  }
};

exports['default'] = Operation;
module.exports = exports['default'];