import _ from 'lodash';
import Resource from './Resource';
import Q from 'q';
import BasePool from './BasePool';
import DB from './DB';


export default class MemoryPool extends BasePool {
  constructor() {
    super();
    this.db = new DB();
  }

  get(type, id = null) {
    return Q.resolve(
      id === undefined ?
        this.db(type).value() :
        this.db(type).getById(id)
    );
  }

  create(type, data) {
    if (!type) {
      throw new Error('unenough arguments');
    }

    return Q.resolve(this._saveResourceToPool({
      ...data, type,
    }));
  }

  update(type, id, data) {
    if (!type || !id) {
      throw new Error('unenough arguments');
    }

    return Q.resolve(this._saveResourceToPool({
      ...data, type, id,
    }));
  }

  remove(type, id) {
    if (!type || !id) {
      throw new Error('unenough arguments');
    }

    return Q.resolve(this._removeResourceFromPool(type, id));
  }

  addLinkage(relationship, linkage) {
    if (!_.isArray(linkage)) {
      throw new Error('linkage should be array!');
    }

    if (!_.isArray(relationship.data)) {
      throw new Error('relationship should be array');
    }

    relationship.addLinkage(linkage);
    return Q.resolve();
  }

  removeLinkage(relationship, linkage) {
    if (!_.isArray(linkage)) {
      throw new Error('linkage should be array!');
    }

    if (!_.isArray(relationship.data)) {
      throw new Error('relationship should be array');
    }

    relationship.removeLinkage(linkage);
    return Q.resolve();
  }

  replaceLinkage(relationship, linkage) {
    relationship.replaceLinkage(linkage);
    return Q.resolve();
  }

  _saveResourceToPool(data) {
    if (_.isUndefined(data.type) || _.isUndefined(data.id)) {
      throw new Error('Invalid data: type & id property should be given.');
    }

    let resource = this.db(data.type).getById(data.id);

    /* New Resource */
    if (!resource) {
      resource = new Resource(data);
      this.db(resource.type).insert(resource);
    }
    /* Existing Resource */
    else {
      const before = resource.serialize();
      resource.deserialize(
        _.extend({}, data, {
          attributes: _.extend(
            {}, before.attributes, data.attributes),
          relationships: _.extend(
            {}, before.relationships, data.relationships),
          meta: _.extend(
            {}, resource.meta, data.meta),
        })
      );
    }

    return resource;
  }

  _removeResourceFromPool(type, id) {
    return this.db(type).removeById(id);
  }

}

