var _ = require('lodash');
var Q = require('q');


var PoolMixin = function (memoryPool, restPool, memoryToRest, type) {

  return {

    create: function (attributes) {
      return Q.fcall(function () {
        return memoryPool.create(attributes);
      });
    },

    patch: function (resource, attributes) {
      return Q.fcall(function () {
        return memoryPool.patch(resource, attributes);
      });
    },

    remove: function (resource) {
      return Q.fcall(function () {
        return memoryPool.remove(resource);
      });
    },

    add: function (resource) {
      return Q.fcall(function () {
        return memoryPool.add(resource);
      });
    },

    get: function (url) {
      return Q.fcall(function () {
        return memoryPool.get(url);
      })
      .then(function (resource) {
        return resource || restPool.get(url)
          .then(function (resource) {
            return memoryPool.add(resource)
              .then(this.flush.bind(this, resource))
          }.bind(this));
      }.bind(this));
    },

    find: function (pridicate) {
      return Q.fcall(function () {
        return memoryPool.find(pridicate);
      });
    },

    findById: function (id) {
      return Q.fcall(function () {
        return memoryPool.find(function (resource) {
          return resource.id === id;
        });
      });
    },

    flush: function (before) {
      return Q.fcall(function () {
        return memoryToRest.flush();
      })
      .then(function () {
        return before;
      });
    }

  }

};


module.exports = PoolMixin;
