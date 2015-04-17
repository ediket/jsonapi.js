import _ from 'lodash';
import addUnderscoreMethods from './addUnderscoreMethods';


// Underscore methods that we want to implement on the Model.
  var modelMethods = { keys: 1, values: 1, pairs: 1, invert: 1, pick: 0,
      omit: 0, chain: 1, isEmpty: 1 };


export default function (Model, attributes) {

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  addUnderscoreMethods(Model, modelMethods, attributes);

}
