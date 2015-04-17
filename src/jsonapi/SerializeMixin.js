

'use strict';

var _ = require('lodash');


var SerializableRequiredError = function (message) {
  this.name = "SerializableRequiredError";
  this.message = (message || "");
};
SerializableRequiredError.prototype = Error.prototype;


module.exports = {
  toJSON: function () {
    throw new Error('toJSON should be implemented!');
  },
  toLinkage: function () {
    throw new Error('toJSONResponse should be implemented!');
  },
  isSerializable: function (obj) {
    return obj &&
      _.isFunction(obj.toJSON) &&
      _.isFunction(obj.toLinkage);
  }
};
