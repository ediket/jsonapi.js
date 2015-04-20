
'use strict';


var _ = require('lodash');


var JSONAPI = {
  Transaction: require('./src/Transaction'),
  ResourceProxy: require('./src/ResourceProxy'),
  ResourcePool: require('./src/ResourcePool'),
  serializer: require('./src/serializer'),
};


_.extend(JSONAPI, require('./src/singletons'));


module.exports = JSONAPI;
