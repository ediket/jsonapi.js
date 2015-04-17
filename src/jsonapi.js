
'use strict';


var _ = require('lodash');


var JSONAPI = {
  Resource: require('./jsonapi/Resource'),
  ResourceProxy: require('./jsonapi/ResourceProxy'),
  ResourcePool: require('./jsonapi/ResourcePool'),
  ResourceCollection: require('./jsonapi/ResourceCollection'),
  Session: require('./jsonapi/Session'),
  serializer: require('./jsonapi/serializer')
};


_.extend(JSONAPI, require('./jsonapi/singletons'));


module.exports = JSONAPI;
