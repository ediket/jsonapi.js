
'use strict';


var _ = require('lodash');


var ResourcePool = function (resources) {

  this.pool = {};
  _.each(resources, this.add, this);

};


_.extend(ResourcePool.prototype, {

  add: function (resource) {

    this.pool[resource.url] = resource;

  },

  get: function (url) {

    return this.pool[url];

  }

});


module.exports = ResourcePool;
