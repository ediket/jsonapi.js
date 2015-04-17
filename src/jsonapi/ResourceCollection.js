import _ from 'lodash';
import { Collection } from 'backbone';
import Resource from './Resource';
import SerializeMixin from './SerializeMixin';


export default Collection.extend(_.extend({}, SerializeMixin, {

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

  },

  merge: function (resources) {

    if (!resources instanceof this.constructor) {
      throw new Error('merged resources should be a ResourceCollection');
    }

    this.set(resources.models, { remove: false });

    return this;

  }

}));
