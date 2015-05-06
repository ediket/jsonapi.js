'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _ = require('lodash');

var Operation = function Operation(op, resource) {
  _classCallCheck(this, Operation);

  this.op = op;
  this.path = resource.getLink('self');
  if (op !== 'remove') {
    this.value = resource.deserialize();
    this.value = _.omit(this.value, 'id');
    this.value = _.omit(this.value, 'links');
  }
  if (op === 'add') {}
};

exports['default'] = Operation;
module.exports = exports['default'];