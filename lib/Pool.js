import _ from 'lodash';
import Q from 'q';
import urlJoin from 'url-join';
import { Events } from 'backbone';
import Resource from './Resource';
import RESTful from './RESTful';


class Pool {

  constructor(options) {

    this.pool = {};
    this.staged = {};
    this.remote = {};
    this.commits = [];
    this.remoteIndex = 0;

  }

  resetAll () {

    this.pool = {};
    this.staged = {};
    this.remote = {};
    this.commits = [];
    this.remoteIndex = 0;

  }

  sync: RESTful

  rm (resource) {

    if(_.isArray(resource)) {
      return _.map(resource, resource => this.rm(resource));
    }

    if (!this.pool[resource.uuid]) {
      this.pool[resource.uuid] = resource.serialize();
    }

    let serialized = resource.serialize();
    serialized._rm = true;
    this.staged[resource.uuid] = serialized;

    return serialized;

  }

  add (resource) {

    if(_.isArray(resource)) {
      return _.map(resource, resource => this.add(resource));
    }

    let serialized = resource.serialize();
    this.staged[resource.uuid] = serialized;

    return serialized;

  }

  getStaged (resource) {

    let result;
    let uuid = resource.uuid;

    if (!this.isStaged(uuid)) {
      throw Error(`can not find ${uuid}`)
    }

    result = this.staged[uuid];
    if (result._rm) {
      result = null;
    }

    return result;

  }

  isStaged (uuid) {

    return this.staged[uuid] !== undefined;

  }

  commit () {

    this.commits.push(this.staged);

    _.each(this.staged, (serialized, uuid) => {
      if (!serialized) {
        this._rmFromPool(uuid);
      }
      else {
        this._saveToPool(uuid, serialized);
      }
    });

    this.staged = {};

  }

  addRemote (type, url) {

    this.remote[type] = url;

  }

  getRemote (type, id) {

    return urlJoin(this.remote[type], id);

  }

  get (type, id) {

    let resource;
    let uuid = _.findKey(this.pool, serialized => {
      return serialized.type === type && serialized.id === id;
    });

    if (uuid) {
      resource = new Resource(this.pool[uuid]);
      resource.uuid = uuid;
    }

    return resource;

  }

  has (type, id) {

    return !!_.find(this.pool, serialized => {
      return serialized.type === type && serialized.id === id;
    });

  }

  _saveToPool (uuid, serialized) {

    this.pool[uuid] = serialized;

  }

  _rmFromPool (uuid) {

    delete this.pool[uuid];

  }

  clone (type, id, options) {

    if (this.has(type, id)) {
      throw new Error('can not clone already exist resource');
    }

    return this.sync.get(this.getRemote(type, id), options)
    .then(response => {
      let resource = new Resource(response.data);
      this._saveToPool(resource.uuid, resource.serialize());
      return resource;
    });

  }

  push () {

    let commits = this.commits.slice(this.remoteIndex);

    return _.reduce(commits, (promise, commit) => {

      return promise.then(() => {

        return Q.all(_.map(commit, (serialized, uuid) => {

          let type = this.pool[uuid].type;
          let id = this.pool[uuid].id;

          if (serialized._rm && id) {
            this.sync.delete(this.getRemote(type, id));
          }
          else if (serialized && id) {
            this.sync.patch(this.getRemote(type, id),
                            this._toRequest(serialized))
              .then(response => {
                this._saveToPool(uuid,
                  this._fromResponse(response));
              });
          }
          else if (serialized && !id) {
            this.sync.post(this.getRemote(type),
                          this._toRequest(serialized))
              .then(response => {
                this._saveToPool(uuid,
                  this._fromResponse(response));
              });
          }

        }));

      });

    }, Q());

  }

  _toRequest (serialized) {

    return {
      data: serialized
    };

  }

  _fromResponse (response) {

    return response.data;

  }

}


export default Pool;
