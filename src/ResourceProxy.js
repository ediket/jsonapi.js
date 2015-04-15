
'use strict';


var _ = require('lodash');
var Q = require('q');
var ResourcePool = require('./ResourcePool');


var isValidResponse = function (res) {
  return res && res.data && (res.links || res.data.links);
};


var ResourceProxy = function (options) {

  this.url = options.url || options.links.self;
  this.data = options.data || null;
  this.links = options.links || null;
  this.pool = options.pool || new ResourcePool([this]);
  if (!this.pool.get(this.url)) {
    this.pool.add(this);
  }
  this.syncronizer = options.syncronizer;

};


_.extend(ResourceProxy.prototype, {

  _createResource: function (options) {

    return new ResourceProxy(
      _.extend(options, {
        pool: this.pool,
        syncronizer: this.syncronizer
      }));

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

    if (this.data) {
      deferred.resolve(this.data);
    }
    else {
      this.fetch()
        .then(function () {
          deferred.resolve(this.data);
        }.bind(this));
    }

    return deferred.promise;

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

    var deferred = Q.defer();

    this.getLink(key)
      .then(function (links) {
        var related = this.pool.get(links.related);
        if (related) {
          return related;
        }
        else {
          return this._createResource({ url: links.related })
            .fetch();
        }
      }.bind(this))
      .then(function (related) {
        deferred.resolve(related);
      }.bind(this))
      .catch(function () {
        console.log(arguments[0].stack);
      }.bind(this));

    return deferred.promise;

  }

});


module.exports = ResourceProxy;
