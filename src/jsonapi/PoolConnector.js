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
    this.cloneBays = [];

    this.listenTo(this.source, "transform", this._onTrasnform);
    this.listenTo(this.source, "add", this._onAdd);
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

  _onTrasnform (operation) {

    this.operations.push(operation);

  }

  _onAdd (resource) {

    this.cloneBays.push(resource);

  }

  flush () {

    return Q.fcall(() => {
      return _.reduce(this.operations, (promise, operation) => {
        return promise.then(() => {
          return this._applyOperationToTarget(operation);
        });
      }, Q())
    })
    .then(() => {
      return _.reduce(this.cloneBays, (promise, resource) => {
        return promise.then(() => {
          return this._applyCloneToTarget(resource);
        });
      }, Q());
    })
    .then(() => {
      this._cleanQueues();
    });

  }

  _cleanQueues () {

    this.operations = [];
    this.cloneBays = [];

  }

  _applyCloneToTarget (resource) {

    var clonedResource = resource.clone();
    this._addReplicaLink(resource, clonedResource);
    return this.target.add(clonedResource, {
      byOperation: false
    });

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
        this._addReplicaLink(path, resource)
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

  _addReplicaLink (source, target) {

    var sourceURL = source;
    if (!_.isString(source)) {
      sourceURL = source.getLink('self')
    }

    var targetURL = target;
    if (!_.isString(target)) {
      targetURL = target.getLink('self')
    }

    this.sourceToTarget[sourceURL] = targetURL;

  }

}


export default PoolConnector;
