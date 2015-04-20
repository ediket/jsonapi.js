import _ from 'lodash';
import Q from 'q';
import { Events } from 'backbone';
import ResourceProxy from './ResourceProxy';

class Transaction {

  constructor(pool, options) {

    _.extend(this, Events);
    options = _.defaults(options || {});

    this.pool = pool;
    this.operations = [];

  }

  begin () {

    this.operations = [];
    this._activate();

  }

  commit () {

    this._deactivate();

  }


  _activate () {

    this.listenTo(this.pool, 'transform', this.onTransform);
    this.active = true;

  }

  _deactivate () {

    this.stopListening(this.pool, 'transform', this.onTransform);
    this.active = false;

  }

  onTransform (operation) {

    this.operations.push(operation);

  }

}

export default Transaction;
