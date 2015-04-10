
'use strict';


var _ = require('lodash');
var Backbone = require('backbone');
var Model = Backbone.Model;
var SerializeMixin = require('./SerializeMixin');


var optionKeys = ['type'];


module.exports = Model.extend(_.extend({}, SerializeMixin, {

  sync: function () { return false; },

  initialize: function (options) {

    _.extend(this, _.pick(options || {}, optionKeys));

    if (!this.type) {
      throw new Error('type is required');
    }

    this.links = {};

  },

  addLink: function (key, otherResource) {

    if (!this.isSerializable(otherResource)) {
      throw 'error';
    }

    this.links[key] = otherResource;

    return this;

  },

  removeLink: function (key) {

    delete this.links[key];

    return this;

  },

  getLink: function (link) {

    return this.links[link];

  },

  getLinks: function () {

    return _.clone(this.links);

  },

  toJSON: function (options) {

    options = _.defaults(options || {}, {
      recursive: false
    });

    var result = Model.prototype.toJSON.apply(this, arguments);
    _.extend(result, _.clone(this.toLinkage()));

    if (options.recursive) {
      _.extend(result,
        _.mapValues(this.links, function (resource, key) {
          return resource.toJSON();
        })
      );
    }

    return _.omit(result, _.isUndefined);

  },

  toLinkage: function () {

    return {
      type: this.type,
      id: this.id
    };

  },

  fromJSONResponse: function (JSONResponse) {

    return _.omit(JSONResponse, 'links');

  }

}));
