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
    let included = options.included;
    if (included) {
      options.included = included.join(',');
    }

    let fields = options.fields;
    if (fields) {
      _.reduce(fields, (options, fields, type) => {
        options[`fields[${type}]`] = fields.join(',');
        return options;
      }, options);
      delete options.fields;
    }

    return this.sync.get(
      this.getRemote(type, id), options
    )
    .then(response => this.saveResponseToPool(response));
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

  saveResponseToPool(response) {
    let mainResource = this.saveResourceToPool(response.data);
    if (response.included) {
      this.saveResourceToPool(response.included);
    }
    return mainResource;
  }

  saveResourceToPool(data) {
    if (_.isArray(data)) {
      return _.map(data, data => this.saveResourceToPool(data));
    }

    if (!data.type || !data.id) {
      throw new Error('invalid data');
    }

    let resource = this.get(data.type, data.id);

    if (!resource) {
      resource = new Resource(data);
      this.db(resource.type).insert(resource);
    }
    else {
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

  has(type, id) {
    if (!type || !id) {
      throw new Error('unenough arguments');
    }

    let result = this.db(type).getById(id);
    return !!result;
  }

}
