import _ from 'lodash';
import Q from 'q';
import urlJoin from 'url-join';
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

    if (!this.pool[resource.cid]) {
      this.pool[resource.cid] = resource.serialize();
    }

    let serialized = resource.serialize();
    serialized._rm = true;
    this.staged[resource.cid] = serialized;

    return serialized;

  }

  add (resource) {

    if(_.isArray(resource)) {
      return _.map(resource, resource => this.add(resource));
    }

    let serialized = resource.serialize();
    this.staged[resource.cid] = serialized;

    return serialized;

  }

  getStaged (resource) {

    let result;
    let cid = resource.cid;

    if (!this.isStaged(cid)) {
      throw Error(`can not find ${cid}`)
    }

    result = this.staged[cid];
    if (result._rm) {
      result = null;
    }

    return result;

  }

  isStaged (cid) {

    return this.staged[cid] !== undefined;

  }

  commit () {

    this.commits.push(this.staged);

    _.each(this.staged, (serialized, cid) => {
      if (!serialized) {
        this._rmFromPool(cid);
      }
      else {
        this._saveToPool(cid, serialized);
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
    let cid = _.findKey(this.pool, serialized => {
      return serialized.type === type && serialized.id === id;
    });

    if (cid) {
      resource = new Resource(this.pool[cid]);
      resource.cid = cid;
    }

    return resource;

  }

  has (type, id) {

    return !!_.find(this.pool, serialized => {
      return serialized.type === type && serialized.id === id;
    });

  }

  _saveToPool (cid, serialized) {

    this.pool[cid] = serialized;

  }

  _rmFromPool (cid) {

    delete this.pool[cid];

  }

  pull (type, id, options) {

    return this.sync.get(this.getRemote(type, id), options)
    .then(response => {
      let resource;
      if (this.has(type, id)) {
        resource = this.get(type, id)
        resource.deserialize(response.data);
      }
      else {
        resource = new Resource(response.data);
      }
      this._saveToPool(resource.cid, resource.serialize());
      return resource;
    });

  }

  push () {

    let commits = this.commits.slice(this.remoteIndex);

    return _.reduce(commits, (promise, commit) => {

      return promise.then(() => {

        return Q.all(_.map(commit, (serialized, cid) => {

          let type = serialized.type || this.pool[cid].type;
          let id = serialized.id || this.pool[cid].id;

          if (serialized._rm && id) {
            this.sync.delete(this.getRemote(type, id))
              .then(response => {
                this._rmFromPool(cid);
              });
          }
          else if (serialized && id) {
            this.sync.patch(this.getRemote(type, id),
                            this._toRequest(serialized))
              .then(response => {
                this._saveToPool(cid,
                  this._fromResponse(response));
              });
          }
          else if (serialized && !id) {
            this.sync.post(this.getRemote(type),
                          this._toRequest(serialized))
              .then(response => {
                this._saveToPool(cid,
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
