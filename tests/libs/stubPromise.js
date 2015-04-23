import sinon from 'sinon';
import Q from 'Q';


export default function () {

  var stub = sinon.stub.apply(sinon, arguments);

  var deferred = Q.defer();

  deferred.resolve();

  stub.returns(deferred.promise);

  return stub;

};
