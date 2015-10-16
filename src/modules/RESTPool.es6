import _ from 'lodash';
import urljoin from 'url-join';
import toParams from '../utils/toParams';
import BasePool from './BasePool';
import Resource from './Resource';
import RESTful from './RESTful';


export default class RESTPool extends BasePool {
  constructor() {
    super();
    this.remote = {};
  }

  get(type, id = null, options = {}) {
    return RESTful.get(
      this.getRemote(type, id), toParams(options)
    )
    .then(response => _.pick(response, 'data', 'included'))
    .then(response => this._toResult(response));
  }

  create(type, data) {
    if (!type) {
      throw new Error('unenough arguments');
    }

    data = { ...data, type };

    return RESTful.post(
      this.getRemote(type), { data }
    )
    .then(response =>
      response.status !== 204 ?
        _.pick(response, 'data', 'included') :
        { data }
    )
    .then(response => this._toResult(response));
  }

  update(type, id, data) {
    if (!type || !id) {
      throw new Error('unenough arguments');
    }

    data = _.extend({ type, id }, data);

    return RESTful.patch(
      this.getRemote(type, id), { data }
    )
    .then(response =>
      response.status !== 204 ?
        _.pick(response, 'data', 'included') :
        { data }
    )
    .then(response => this._toResult(response));
  }

  remove(type, id) {
    if (!type || !id) {
      throw new Error('unenough arguments');
    }

    return RESTful.delete(
      this.getRemote(type, id)
    )
    .then(response =>
      response.status !== 204 ?
        _.pick(response, 'data', 'included') :
        { data: null }
    )
    .then(response => this._toResult(response));
  }

  addLinkage(relationship, linkage) {
    if (!_.isArray(linkage)) {
      throw new Error('linkage should be array!');
    }

    if (!_.isArray(relationship.data)) {
      throw new Error('relationship should be array');
    }

    if (!(relationship.links && relationship.links.self)) {
      throw new Error('relationship should contain self link!');
    }

    return RESTful.post(
      relationship.links.self.href, { data: linkage }
    )
    .then(response =>
      response.status !== 204 ?
        _.pick(response, 'included') : {}
    )
    .then(response => this._toResult(response));
  }

  removeLinkage(relationship, linkage) {
    if (!_.isArray(linkage)) {
      throw new Error('linkage should be array!');
    }

    if (!_.isArray(relationship.data)) {
      throw new Error('relationship should be array');
    }

    if (!(relationship.links && relationship.links.self)) {
      throw new Error('relationship should contain self link!');
    }

    return RESTful.delete(
      relationship.links.self.href, { data: linkage }
    )
    .then(response =>
      response.status !== 204 ?
        _.pick(response, 'included') :
        {}
    )
    .then(response => this._toResult(response));
  }

  replaceLinkage(relationship, linkage) {
    if (!(relationship.links && relationship.links.self)) {
      throw new Error('relationship should contain self link!');
    }

    return RESTful.patch(
      relationship.links.self.href, { data: linkage }
    )
    .then(response =>
      response.status !== 204 ?
        _.pick(response, 'included') :
        {}
    )
    .then(response => this._toResult(response));
  }

  getRemote(type, id, relationship) {
    if (!_.has(this.remote, type)) {
      throw new Error(`'${type}' is not registered in remote.`);
    }

    const urlParts = _.compact([
      this.remote[type],
      id,
      relationship ? 'relationships' : undefined,
      relationship,
    ]);
    return urljoin.apply(null, urlParts);
  }

  addRemote(type, url) {
    if (!type || !url) {
      throw new Error('unenough arguments');
    }
    this.remote[type] = url;
  }

  _toResult(response) {
    let main = null;

    /* Main Data */
    if (_.isArray(response.data)) {
      main = !_.isEmpty(response.data) ?
        _.map(response.data, data => new Resource(data)) : [];
    }
    else {
      main = response.data ?
        new Resource(response.data) : null;
    }

    return main;
  }

}

