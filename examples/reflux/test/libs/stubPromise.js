var Q = require('q');
var sinon = require('sinon');


module.exports = function () {

  var stub = sinon.stub.apply(sinon, arguments);

  var deferred = Q.defer();

  deferred.resolve();

  stub.returns(deferred.promise);

  return stub;

};
