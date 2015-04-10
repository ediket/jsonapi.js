
'use strict';


var _ = require('lodash');
var Backbone = require('backbone');
var Collection = Backbone.Collection;
var Resource = require('./Resource');
var SerializeMixin = require('./SerializeMixin');


module.exports = Collection.extend(_.extend({}, SerializeMixin, {

  sync: function () { return false; },

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
