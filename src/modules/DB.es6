import lodash from 'lodash';
import underscoreDB from 'underscore-db';


function lowChain(_, array) {
  let chain = _.chain(array);

  _.functions(chain)
  .forEach(function(method) {
    chain[method] = _.flow(chain[method], function(arg) {
      let res = arg.value ? arg.value() : arg;
      return res;
    });
  });

  return chain;
}


function DB() {
  let _ = lodash.runInContext();
  _.mixin(underscoreDB);

  let value = _.prototype.value;
  _.prototype.value = function() {
    let res = value.apply(this, arguments);
    return res;
  };

  function db(key) {
    let array;
    if (db.object[key]) {
      array = db.object[key];
    }
    else {
      array = db.object[key] = [];
    }

    let short = lowChain(_, array);
    short.chain = function() {
      return _.chain(array);
    };
    return short;
  }

  // Expose lodash instance
  db._ = _;

  // Expose database object
  db.object = {};

  return db;
}

DB.stringify = function(obj) {
  return JSON.stringify(obj, null, 2);
};

DB.parse = function(str) {
  return JSON.parse(str);
};


export default DB;
