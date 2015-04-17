import _ from 'lodash';


export default function diffJSON(oldObj, newObj) {

  if (!(oldObj && newObj)) {
    throw new Error('two object is required:', oldObj, newObj);
  }

  var oldKeys = _.keys(oldObj);
  var newKeys = _.keys(newObj);

  var removedKeys = _.difference(oldKeys, newKeys);
  var addedKeys = _.difference(newKeys, oldKeys);
  var changedKeys = _.chain(_.intersection(oldKeys, newKeys))
    .filter(function (key) {
      return !_.isEqual(oldObj[key], newObj[key]);
    })
    .value();

  var result = {};

  _.each(removedKeys, function (key) {
    result[key] = {
      removed: oldObj[key]
    };
  });

  _.each(addedKeys, function (key) {
    result[key] = {
      added: newObj[key]
    };
  });

  _.each(changedKeys, function (key) {
    result[key] = {
      removed: oldObj[key],
      added: newObj[key]
    };
  });

  return result;

}
