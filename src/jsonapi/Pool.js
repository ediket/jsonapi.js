import _ from 'lodash';
import Q from 'q';
import { Events } from 'backbone';
import Resource from './Resource';
import Operation from './Operation';


class Pool {

  constructor(resources) {

    _.extend(this, Events);
    this.pool = new Map();
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

}


export default Pool;
