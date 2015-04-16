
'use strict';


var _ = require('lodash');
var Q = require('q');
var ResourcePool = require('./ResourcePool');
var singletons = require('./singletons');


var isValidResponse = function (res) {
  return res && res.data && (res.links || res.data.links);
};


var ResourceProxy = function (options) {

  this.url = options.url || options.links.self;
  this.data = options.data || null;
  this.links = options.links || null;

  this.options = _.omit(options, 'data', 'links', 'url');
  this.syncronizer = options.syncronizer;
  this.pool = options.pool || singletons.pool;
  this.pool.add(this);

};


_.extend(ResourceProxy.prototype, {

  _createNeighbor: function (options) {

    return new ResourceProxy(_.extend({}, this.options, options));

  },

  fetch: function () {

    return this.syncronizer.get(this.url)
      .then(function (res) {
        if (!isValidResponse(res)) {
          throw new Error('invalid response!');
        }
        this.data = _.omit(res.data, 'links');
        this.links = res.links || res.data.links;
        return this;
      }.bind(this));

  },

  getData: function () {

    var deferred = Q.defer();

    var data = this.data;

    if (data) {
      deferred.resolve(data);
    }
    else {
      this.fetch()
        .then(function () {
          data = this.data;
          data ? deferred.resolve(data) : deferred.reject();
        }.bind(this));
    }

    return deferred.promise;

  },

  setLink: function (key, resource) {

    this.links[key] = {
      related: resource.url
    };

  },

  getLink: function (key) {

    var deferred = Q.defer();

    var links = this.links[key];

    if (links) {
      deferred.resolve(links);
    }
    else {
      this.fetch()
        .then(function () {
          links = this.links[key];
          links ? deferred.resolve(links) : deferred.reject();
        }.bind(this));
    }

    return deferred.promise;

  },

  getRelated: function (key) {

    return this.getLink(key)
      .then(function (links) {
        var related = this.pool.get(links.related);
        return related || this._createNeighbor({ url: links.related });
      }.bind(this));

  }

});


module.exports = ResourceProxy;
