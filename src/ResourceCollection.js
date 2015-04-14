
'use strict';


var _ = require('lodash');
var Backbone = require('backbone');
var Collection = Backbone.Collection;
var Resource = require('./Resource');
var SerializeMixin = require('./SerializeMixin');


module.exports = Collection.extend(_.extend({}, SerializeMixin, {

  sync: function () { return false; },

  initialize: function (models, options) {

    if (!options || !options.type) {
      throw new Error('type is required');
    }

    this.type = options.type;

    this.on('add', function (resource) {

      if (resource.type !== this.type) {
        throw new Error('type [' + this.type + '] is required');
      }

    });

  },

  create: function () {

    if (arguments[0]) {
      arguments[0].type = arguments[0].type || this.type;
    }

    return Collection.prototype.create.apply(this, arguments);

  },

  model: Resource,

  toJSON: function () {

    return Collection.prototype.toJSON.apply(this, arguments);

  },

  toLinkage: function () {

    return _.map(this.models, function (resource) {
      return resource.toLinkage();
    });

  }

}));
