import Q from 'q';


export default function (value) {

  var deferred = Q.defer();

  deferred.resolve(value);

  return deferred.promise;

};
