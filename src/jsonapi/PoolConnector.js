import _ from 'lodash';
import Q from 'q';
import { Events } from 'backbone';
import Resource from './Resource';
import Pool from './Pool';
import Operation from './Operation';

class PoolConnector {

  constructor(source, target, options) {

    _.extend(this, Events);

    this.source = source;
    this.target = target;
    this.sourceToTarget = {};
    this.operations = [];

    this.listenTo(this.source, "transform", this.onTrasnform);
    // this.stopListening(source, "transform");

  }

  onTrasnform (operation) {

    this.operations.push(operation);

  }

  flush () {

    return _.chain(this.operation)
      .reduce(this.operations, (promise, operation) => {
        return promise.then(() => {
          this._applyOperationToTarget(operation);
        });
      }, Q())
      .value();

  }

  _applyOperationToTarget (operation) {

    var op = operation.op;
    var value = operation.value;
    var path = operation.path;

    var tartgetResource = this.sourceToTarget[path];

    if (op === "add") {
      return this.target.create(value, {
        byOperation: true
      })
      .then(resource => {
        this.sourceToTarget[path] = resource.getLink('self')
        return resource;
      })
    }
    else if (op === "replace") {
      return this.target.patch(tartgetResource, value, {
        byOperation: true
      });
    }
    else if (op === "remove") {
      return this.target.remove(tartgetResource, {
        byOperation: true
      });
    }

  }

}


export default PoolConnector;
