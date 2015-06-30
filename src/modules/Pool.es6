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

    if (options.sort) {
      params.sort = options.sort.join(',');
    }

    if (options.include) {
      params.include = options.include.join(',');
    }

    if (options.page) {
      params = _.extend(params, {
        'page[number]': options.page.number,
        'page[size]': options.page.size
      });
    }

    if (options.fields) {
      _.reduce(options.fields, (result, fields, type) => {
        result[`fields[${type}]`] = fields.join(',');
        return result;
      }, params);
    }

    if (options.filter) {
      _.reduce(options.filter, (result, filter, type) => {
        result[`filter[${type}]`] = filter.join(',');
        return result;
      }, params);
    }

    params = _.omit(params, _.isUndefined);

    return this.sync.get(
      this.getRemote(type, id), params
    )
    .then(response => this.saveResponseToPool(response, {
      partialUpdateTypes: _.keys(options.fields)
    }));
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
    .then(response => {
      return response.status !== 204 ?
        this.saveResponseToPool(response) :
        null;
    })
    .then(() => this.removeResourceFromPool(type, id));
  }

  create(type, data, options={ sync: true }) {
    data = _.extend({ type }, data);

    if (!options.sync) {
      return Q.resolve(this.saveResourceToPool(data));
    }

    return this.sync.post(
      this.getRemote(type), { data }
    )
    .then(response => {
      return response.status === 204 ?
        this.saveResourceToPool(data) :
        this.saveResponseToPool(response);
    });
  }

  update(type, id, data, options={ sync: true }) {
    data = _.extend({ type, id }, data);

    if (!options.sync) {
      return Q.resolve(this.saveResourceToPool(data));
    }

    return this.sync.patch(
      this.getRemote(type, id), { data }
    )
    .then(response => {
      return response.status === 204 ?
        this.saveResourceToPool(data, true) :
        this.saveResponseToPool(response);
    });
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

  saveResponseToPool(response, options={}) {
    options = _.defaults(options, {
      partialUpdateTypes: []
    });

    let mainData = response.data;
    let includedData = response.included;

    let result;

    /* Main Data */
    if (_.isArray(mainData)) {
      if (_.isEmpty(mainData)) {
        result = [];
      }
      else {
        result = _.map(mainData, data =>
          this.saveResourceToPool(data, {
            partialUpdate: _.contains(options.partialUpdateTypes, data.type)
          })
        );
      }
    }
    else {
      if (_.isNull(mainData)) {
        result = null;
      }
      else {
        result = this.saveResourceToPool(mainData, {
          partialUpdate: _.contains(options.partialUpdateTypes, mainData.type)
        });
      }
    }

    /* Included Data */
    if (includedData) {
      _.map(includedData, data => {
        this.saveResourceToPool(data, {
          partialUpdate: _.contains(options.partialUpdateTypes, data.type)
        });
      });
    }

    return result;
  }

  saveResourceToPool(data, options={}) {
    options = _.defaults(options, {
      partialUpdate: false
    });

    if (_.isUndefined(data.type) || _.isUndefined(data.id)) {
      throw new Error('Invalid data: type & id property should be given.');
    }

    let resource = this.get(data.type, data.id);

    /* New Resource */
    if (!resource) {
      resource = new Resource(data);
      this.db(resource.type).insert(resource);
    }
    /* Existing Resource */
    else {
      if (options.partialUpdate) {
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
      _.map(linkage, _linkage => this.get(_linkage.type, _linkage.id)) :
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
