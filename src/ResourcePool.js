
'use strict';


var _ = require('lodash');


var ResourcePool = function (resources) {

  this.pool = {};
  _.each(resources, this.add, this);

};


_.extend(ResourcePool.prototype, {

  add: function (resource) {

    this.pool[resource.url] = resource;
    if (resource.pool && resource.pool !== this) {
      this.merge(resource.pool);
    }

  },

  get: function (url) {

    return this.pool[url];

  },

  merge: function (anotherPool) {

    _.extend(this.pool, anotherPool.pool);
    anotherPool.pool = this.pool;

  }

});


module.exports = ResourcePool;
