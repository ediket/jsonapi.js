import _ from 'lodash';

var array = [];
var slice = array.slice;


// Proxy Underscore methods to a Backbone class' prototype using a
// particular attribute as the data argument
var addMethod = function(length, method, attribute) {
  switch (length) {
    case 1: return function() {
      return _[method](this[attribute]);
    };
    case 2: return function(value) {
      return _[method](this[attribute], value);
    };
    case 3: return function(iteratee, context) {
      return _[method](this[attribute], iteratee, context);
    };
    case 4: return function(iteratee, defaultVal, context) {
      return _[method](this[attribute], iteratee, defaultVal, context);
    };
    default: return function() {
      var args = slice.call(arguments);
      args.unshift(this[attribute]);
      return _[method].apply(_, args);
    };
  }
};

export default function(Class, methods, attribute) {
  _.each(methods, function(length, method) {
    if (_[method]) Class.prototype[method] = addMethod(length, method, attribute);
  });
}
