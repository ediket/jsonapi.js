
'use strict';


var sinon = require('sinon');
var Q = require('Q');


module.exports = function () {

  var stub = sinon.stub.apply(sinon, arguments);

  var deferred = Q.defer();

  deferred.resolve();

  stub.returns(deferred.promise);

  return stub;

};
