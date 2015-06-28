import _ from 'lodash';
import Q from 'q';
import urljoin from 'url-join';
import DB from './DB';
import RESTful from './RESTful';
import Resource from './Resource';


export default class Pool {

  constructor() {
    this.db = new DB();
    this.sync = RESTful;
    this.resetAll();
    this.remote = {};
  }

  resetAll() {
    this.remote = {};
    this.db.object = {};
  }

  fetch(type, id, options={}) {
    let params = {};

    let included = _.clone(options.included, true);
    if (included) {
      params.included = included.join(',');
    }

    let fields = _.clone(options.fields, true);
    if (fields) {
      _.reduce(fields, (result, fields, type) => {
        result[`fields[${type}]`] = fields.join(',');
        return result;
      }, params);
    }

    return this.sync.get(
      this.getRemote(type, id), params
    )
    .then(response => this.saveResponseToPool(response, options.fields));
  }

  remove(type, id, options={ sync: true }) {
    if (!type || !id) {
      throw new Error('unenough arguments');
    }

    if (!options.sync) {
      return Q.resolve(this.removeResourceFromPool(type, id));
    }

    return this.sync.delete(
      this.getRemote(type, id)
    )
    .then(response => this.saveResponseToPool(response))
    .then(() => this.removeResourceFromPool(type, id));
  }

  create(type, attributes, options={ sync: true }) {
    attributes = _.extend({ type }, attributes);

    if (!options.sync) {
      return Q.resolve(this.saveResourceToPool(attributes));
    }

    return this.sync.post(
      this.getRemote(type), {
        data: attributes
      }
    )
    .then(response => this.saveResponseToPool(response));
  }

  update(type, id, attributes, options={ sync: true }) {
    attributes = _.extend({ type, id }, attributes);

    if (!options.sync) {
      return Q.resolve(this.saveResourceToPool(attributes));
    }

    return this.sync.patch(
      this.getRemote(type, id), {
        data: attributes
      }
    )
    .then(response => this.saveResponseToPool(response));
  }

  linkageOperation(operation, type, id, relationship, linkage) {
    return this.sync[operation](
      this.getRemote(type, id, relationship),
      !_.isUndefined(linkage) ? { data: linkage } : undefined
    )
    .then(() => {
      // FIXME: linkage operation
    });
  }

  saveResponseToPool(response, fields={}) {
    let serializedList = [response.data];
    if (response.included) {
      serializedList = serializedList.concat(response.included);
    }

    let resources = _.map(serializedList, serializedData => {
      return this.saveResourceToPool(serializedData, fields[serializedData.type]);
    });

    return resources[0];
  }

  saveResourceToPool(data, fields) {
    if (_.isArray(data)) {
      return _.map(data, data => this.saveResourceToPool(data));
    }

    if (_.isUndefined(data.type) || _.isUndefined(data.id)) {
      throw new Error('invalid data');
    }

    let resource = this.get(data.type, data.id);

    if (!resource) {
      resource = new Resource(data);
      this.db(resource.type).insert(resource);
    }
    else {
      if (_.isArray(fields)) {
        let before = resource.serialize();
        data = _.extend({}, data, {
          attributes: _.extend({}, before.attributes, data.attributes),
          relationships: _.extend({}, before.relationships, data.relationships)
        });
      }
      resource.deserialize(data);
    }

    return resource;
  }

  removeResourceFromPool(type, id) {
    return this.db(type).removeById(id);
  }

  addRemote(type, url) {
    this.remote[type] = url;
  }

  getRemote(type, id, relationship) {
    let urlParts = _.compact([
      this.remote[type],
      id,
      relationship ? 'relationships' : undefined,
      relationship
    ]);
    return urljoin.apply(null, urlParts);
  }

  get(type, id) {
    return id === undefined ?
      this.db(type).value() :
      this.db(type).getById(id);
  }

  getRelated(resource, relationship) {
    if (_.isUndefined(resource.relationships)) {
      throw new Error('resource have empty relationship');
    }

    let relationshipObj = resource.relationships[relationship];
    if (_.isUndefined(relationshipObj)) {
      throw new Error(`resource dose not have relationship: ${relationship}`);
    }

    let linkage = resource.relationships[relationship].data;
    if (_.isUndefined(linkage)) {
      throw new Error(`resource\'s relationship(${relationship}) dose not have linkage`);
    }

    return _.isArray(linkage) ?
      _.map(linkage, linkage => this.get(linkage.type, linkage.id)) :
      this.get(linkage.type, linkage.id);
  }

  has(type, id) {
    if (!type || !id) {
      throw new Error('unenough arguments');
    }

    let result = this.db(type).getById(id);
    return !!result;
  }

}
