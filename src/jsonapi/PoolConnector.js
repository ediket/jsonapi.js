import _ from 'lodash';
import Q from 'q';
import { Events } from 'backbone';
import Resource from './Resource';
import Pool from './Pool';
import Operation from './Operation';

class PoolConnector {

  constructor(source, target, options = {}) {

    _.extend(this, Events);

    this.source = source;
    this.target = target;
    this.sourceToTarget = {};
    this.operations = [];

    this.listenTo(this.source, "transform", this.onTrasnform);
    // this.stopListening(source, "transform");

  }

  getReplica (resourceOrURL) {

    var url = _.isString(resourceOrURL) ?
      resourceOrURL : resourceOrURL.getLink('self');

    return this.target.get(
      this.getReplicatedURL(url));

  }

  getReplicatedURL (url) {

    return this.sourceToTarget[url];

  }

  onTrasnform (operation) {

    this.operations.push(operation);

  }

  flush () {

    return _.reduce(this.operations, (promise, operation) => {
      return promise.then(() => {
        return this._applyOperationToTarget(operation);
      });
    }, Q())
    .then(() => {
      this._cleanQueue();
    });

  }

  _cleanQueue () {

    this.operations = [];

  }

  _applyOperationToTarget (operation) {

    var op = operation.op;
    var value = operation.value;
    var path = operation.path;


    if (op === "add") {

      return this.target.create(value, {
        byOperation: true,
      })
      .then(resource => {
        var url = resource.getLink('self');
        this.sourceToTarget[path] = resource.getLink('self');
        return resource;
      });

    }
    else if (op === "replace") {

      return this.getReplica(path)
      .then(targetResource => {
        return this.target.patch(targetResource, value, {
          byOperation: true
        });
      });

    }
    else if (op === "remove") {

      return this.getReplica(path)
      .then(targetResource => {
        return this.target.remove(targetResource, {
          byOperation: true
        });
      });

    }

  }

}


export default PoolConnector;
