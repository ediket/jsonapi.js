import _ from 'lodash';


var SerializableRequiredError = function (message) {
  this.name = "SerializableRequiredError";
  this.message = (message || "");
};
SerializableRequiredError.prototype = Error.prototype;


export default {
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
