import _ from 'lodash';
import Q from 'q';
import ResourcePool from './ResourcePool';
import singletons from './singletons';


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

    return Q.when(this.syncronizer.get(this.url), function (res) {
      if (!isValidResponse(res)) {
        throw new Error('invalid response!');
      }
      this.data = _.omit(res.data, 'links');
      this.links = res.links || res.data.links;
      return this;
    }.bind(this));

  },

  getData: function () {

    return Q.when(this.data ? this : this.fetch(), function () {
      return this.data;
    }.bind(this));

  },

  setLink: function (key, resource) {

    this.links[key] = {
      related: resource.url
    };

  },

  getLink: function (key) {

    return Q.when(this.links[key] ? this : this.fetch(), function () {
      return this.links[key];
    }.bind(this));

  },

  getRelated: function (key) {

    return Q.when(this.getLink(key), function (links) {
      return this.pool.get(links.related) ||
        this._createNeighbor({ url: links.related });
    }.bind(this));

  }

});


export default ResourceProxy;
