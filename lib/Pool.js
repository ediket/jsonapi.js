import _ from 'lodash';
import Q from 'q';
import urlJoin from 'url-join';
import uuid from 'node-uuid';
import Resource from './Resource';
import RESTful from './RESTful';


class Pool {

  constructor (options) {

    this.resetAll();

  }
 
  sync: RESTful

  resetAll () {

    this.pool = {};
    this.blobs = {};
    this.staged = {};
    this.remote = {};
    this.commits = [];
    this.remoteIndex = -1;

  }

  getCommit (idx) {

    idx = idx !== undefined ? idx : this.commits.length - 1;
    return this.commits[idx] || {};

  }

  setRemoteIndex (idx) {

    idx = idx !== undefined ? idx : this.commits.length - 1;
    this.remoteIndex = idx;

  }

  rm (resource) {

    if(_.isArray(resource)) {
      return _.map(resource, resource => this.rm(resource));
    }

    let rid = resource.rid;

    this.staged[rid] = null;

    return this.staged[rid];

  }

  add (resource) {

    if(_.isArray(resource)) {
      return _.map(resource, resource => this.add(resource));
    }

    let rid = resource.rid;

    if (!this.pool[rid]) {
      this.pool[rid] = resource;
    }

    this.staged[rid] = resource.serialize();

    return this.staged[rid];

  }

  getStaged (resource) {

    if (!this.isStaged(resource)) {
      throw Error(`can not find ${resource}`)
    }

    return this.staged[resource.rid];

  }

  isStaged (resource) {

    return this.staged[resource.rid] !== undefined;

  }

  commit () {

    let lastCommit = this.getCommit();

    let newCommit = _.reduce(this.staged, (commit, serialized, rid) => {
      if (!serialized) {
        if (commit[rid]) {
          delete commit[rid];
        }
      }
      else {
        commit[rid] = this._createBlob(serialized);
      }
      return commit
    }, _.clone(lastCommit, true));

    this.commits.push(newCommit);
    this.staged = {};

  }

  addRemote (type, url) {

    this.remote[type] = url;

  }

  getRemote (type, id) {

    return urlJoin(this.remote[type], id);

  }

  get (type, id) {

    if (id === undefined) {
      return _.filter(this.pool, resource => {
        return resource.get('type') === type;
      });
    }

    return _.find(this.pool, resource => {
      return resource.get('type') === type &&
        resource.get('id') === id;
    });

  }

  has (type, id) {

    return !!_.find(this.pool, resource => {
      return resource.get('type') === type &&
        resource.get('id') === id;
    });

  }

  _createBlob (serialized) {

    let bid = uuid.v4();
    this.blobs[bid] = _.clone(serialized, true);
    return this.blobs[bid];

  }

  _getBlob (bid) {

    return this.blobs[bid];

  }

  pullByLink (link, options) {

    let url;
    if (_.isString(link)) {
      url = link;
    }
    else if (link.linkage) {
      url = this.getRemote(link.linkage.type, link.linkage.id);
    }
    else if (link.related) {
      url = link.related;
    }
    else {
      throw new Error('invalid link.')
    }

    return this.pullByURL(url, options);

  }

  pull (type, id, options) {

    return this.pullByURL(this.getRemote(type, id), options);

  }

  pullByURL (url, options) {

    if (!_.isEmpty(this.staged)) {
      throw new Error('pull when staged change is not exist');
    }

    return this.sync.get(url, options)
    .then(response => {
      return this._saveResponse(response);
    });

  }

  push (idx) {

    idx = idx || this.commits.length - 1;

    if (idx <= this.remoteIndex) {
      return Q();
    }

    let afterCommit = this.getCommit(idx);
    let beforeCommit = this.getCommit(this.remoteIndex);

    let removed = _.difference(
      _.keys(beforeCommit),
      _.keys(afterCommit)
    );

    let changedOrAdded = _.without(
      _.keys(afterCommit),
      _.keys(removed)
    );

    let deleteRequest = _.map(removed, rid => {
      let type = this.pool[rid].get('type');
      let id = this.pool[rid].get('id');
      if (id) {
        return this.sync.delete(this.getRemote(type, id))
          .then(response => {
            // delete this.pool[rid];
          });
      }
    });

    let postOrPatchRequest = _.map(changedOrAdded, rid => {
      let type = this.pool[rid].get('type');
      let id = this.pool[rid].get('id');
      let blob = afterCommit[rid];
      if (id) {
        return this.sync.patch(this.getRemote(type, id),
                               this._toRequest(blob))
          .then(response => this._saveResponse(response, rid));
      }
      if (!id) {
        return this.sync.post(this.getRemote(type),
                              this._toRequest(blob))
          .then(response => this._saveResponse(response, rid));
      }
    });

    return Q.all(deleteRequest.concat(postOrPatchRequest))
    .then(() => {
      this.setRemoteIndex();
    });

  }

  _saveResponse (response, rid) {

    return this._saveData(this._fromResponse(response), rid);

  }

  _saveData (data, rid) {

    if (_.isArray(data)) {
      return _.map(data, data => this._saveData(data));
    }

    let resource = rid !== undefined ?
      this.pool[rid] : this.get(data.type, data.id);

    if (!resource) {
      resource = new Resource(data);
    }
    else {
      resource.deserialize(data);
    }

    let stagedBackup = _.clone(this.staged, true);

    this.add(resource);
    this.commit();
    this.setRemoteIndex();

    this.staged = stagedBackup;

    return resource;

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
