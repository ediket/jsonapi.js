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

  add (resource) {

    // implement this

  }

  remove (resource) {

    // implement this

  }

  get (id) {

    // implement this

  }

  _triggerTransform (op, resource) {

    this.trigger('transform', new Operation({
      op: op,
      path: resource.getLink('self'),
      value: resource.toJSON()
    }));

  }

}


export default Pool;
