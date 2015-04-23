var JSONAPI = require('backbone.resource');
var PoolConnector = JSONAPI.PoolConnector;
var pools = require('./pools');


module.exports = {
  memoryToRest: new PoolConnector(pools.memory, pools.rest)
};

