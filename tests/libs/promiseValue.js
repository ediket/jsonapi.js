import Q from 'q';


export default function (value) {

  let deferred = Q.defer();

  deferred.resolve(value);

  return deferred.promise;

};
