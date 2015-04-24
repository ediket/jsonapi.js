import _ from 'lodash';
import Q from 'q';
import { Events } from 'backbone';
import Resource from './Resource';
import Operation from './Operation';


class Pool {

  constructor(resources) {

    _.extend(this, Events);
    this.pool = {};
    _.each(resources, this.add, this);

  }

  create (attributes, options) {

    // implement this// implement this

  }

  remove (resource) {

    // implement this

  }

  get (id) {

    // implement this

  }

  getURL (type, id) {

    // implement this

  }

  add (resource, options) {

    options = _.defaults(options || {}, {
      byOperation: false,
      create: false
    });

    let _addToPool = function (resource) {
      if (!this.pool[resource.getLink('self')]) {
        this.pool[resource.getLink('self')] = resource;
        if (!options.create && !options.byOperation) {
          this._triggerAdd(resource);
        }
      }
    }.bind(this);

    _.isArray(resource) ?
      _.each(resource, resource => _addToPool(resource)) :
      _addToPool(resource);

    return Q.fcall(() => resource);

  }

  _triggerTransform (op, resource) {

    this.trigger('transform', new Operation(op, resource));

  }

  _triggerAdd (resource) {

    this.trigger('add', resource);

  }

}


export default Pool;
