var JSONAPI = require('backbone.resource');
var MemoryPool = JSONAPI.MemoryPool;
var RestPool = JSONAPI.RestPool;


module.exports = {
  memory: new MemoryPool(),
  rest: new RestPool()
};

