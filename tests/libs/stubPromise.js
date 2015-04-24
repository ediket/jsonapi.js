import sinon from 'sinon';
import Q from 'Q';


export default function () {

  let stub = sinon.stub.apply(sinon, arguments);

  let deferred = Q.defer();

  deferred.resolve();

  stub.returns(deferred.promise);

  return stub;

};
