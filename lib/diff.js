import _ from 'lodash';
import jsondiffpatch from 'jsondiffpatch';


var diffpatcher = jsondiffpatch.create({});


function getAfterValueFromDiff (diff) {

  if (!_.isArray(diff)) {
    throw new Error('invalid type!');
  }

  switch (diff.length) {
    case 1:
      return diff[0];
    case 2:
      return diff[1];
    case 3:
      return undefined;
  }

}


function getChanged (diffs) {

  if (_.isArray(diffs)) {
    return getAfterValueFromDiff(diffs);
  }

  return _.reduce(diffs, function (result, diff, key) {

    if (_.isObject(diff)) {
      if (diff._t === 'a') {
        return result;
      }
      result[key] = getChanged(diff);
    }
    else if (_.isArray(diff)) {
      result[key] = getAfterValueFromDiff(diff);
    }

    return result;

  }, {});

}

function diff (oldValue, newValue) {

  var delta = diffpatcher.diff(oldValue, newValue);
  return getChanged(delta);

}

export default diff;
