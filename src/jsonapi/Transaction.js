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

    this.listenTo(this.pool, 'create', this.onAddResource);
    this.listenTo(this.pool, 'change', this.onChangeResource);
    this.listenTo(this.pool, 'remove', this.onRemoveResource);
    this.active = true;

  }

  _deactivate () {

    this.stopListening(this.pool, 'create', this.onAddResource);
    this.stopListening(this.pool, 'change', this.onChangeResource);
    this.stopListening(this.pool, 'remove', this.onRemoveResource);
    this.active = false;

  }

  onAddResource (resource) {

    var url = "api" + "/" +  resource.get('type') +  "/-";

    this.operations.push({
      op: "add",
      path: url,
      value: resource.toJSON()
    });

  }

  onChangeResource (resource) {

    var url = resource.links.self || "api" + "/" +  resource.get('type') +  "/-";

    this.operations.push({
      op: "change",
      path: url,
      value: resource.toJSON()
    });

  }

  onRemoveResource (resource) {

    var url = resource.links.self || "api" + "/" +  resource.get('type') +  "/-";

    this.operations.push({
      op: "remove",
      path: url
    });

  }

}

export default Transaction;
