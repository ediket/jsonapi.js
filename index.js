
'use strict';


var _ = require('lodash');


var JSONAPI = {
  Resource: require('./src/Resource'),
  ResourceProxy: require('./src/ResourceProxy'),
  ResourcePool: require('./src/ResourcePool'),
  ResourceCollection: require('./src/ResourceCollection'),
  Session: require('./src/Session'),
  serializer: require('./src/serializer')
};


_.extend(JSONAPI, require('./src/singletons'));


module.exports = JSONAPI;
