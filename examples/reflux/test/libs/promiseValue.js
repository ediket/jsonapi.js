var Q = require('q');


module.exports = function (value) {

  var deferred = Q.defer();

  deferred.resolve(value);

  return deferred.promise;

};
