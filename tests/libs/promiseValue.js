import Q from 'q';


export default function (value, reject=false) {

  let deferred = Q.defer();

  if (reject) {
    deferred.reject(value);
  }
  else {
    deferred.resolve(value);
  }

  return deferred.promise;

}
