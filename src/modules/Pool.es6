import _ from 'lodash';
import Q from 'q';
import urljoin from 'url-join';
import toParams from 'utils/toParams';
import DB from 'modules/DB';
import RESTful from 'modules/RESTful';
import Resource from 'modules/Resource';
import Query from 'modules/Query';


/**
 * @example
 * pool.addRemote('foo', '/foo/');
 *
 * // Fetch Many Resources
 * pool.fetch('foo')
 * .then(resources => {
 *   resources === pool.get('foo');  // true
 * });
 *
 * // Fetch One Resource
 * pool.fetch('foo', 1)
 * .then(resource => {
 *   resource === pool.get('foo', 1);  // true
 * });
 *
 * // Create Resource
 * pool.create('foo', {
 *   attributes: {
 *     content: 'bar'
 *   }
 * })
 * .then(resource => {
 *   resource === pool.get('foo', resource.id);  // true
 * });
 *
 * // Update Resource
 * pool.update('foo', 1, {
 *   attributes: {
 *     content: 'bar'
 *   }
 * })
 *
 * // Remove Resource
 * pool.remove('foo', 1)
 * .then(() => {
 *   undefined === pool.get('foo', 1);  // true
 * });
 */
export default class Pool {

  constructor() {
    /** @type {LowDB} */
    this.db = new DB();
    /** @type {RESTful} */
    this.sync = RESTful;
    this._resetAll();
    /** @type {Object<string, string>} */
    this.remote = {};
  }

  _resetAll() {
    this.remote = {};
    this.db.object = {};
  }

  query(type) {
    return new Query(this, type);
  }

  /**
   * @param {!string} type
   * @param {?(string|number)} id
   * @param {?object} options
   * @param {?string[]} options.sort
   * @param {?string[]} options.include
   * @param {?object} options.page
   * @param {?number} options.page.number
   * @param {?number} options.page.size
   * @param {?fields[]} options.fields
   * @param {?filter[]} options.filter
   * @return {Promise}
   */
  fetch(type, id, options={}) {
    return this.sync.get(
      this.getRemote(type, id), toParams(options)
    )
    .then(response => this._saveResponseToPool(response));
  }

  /**
   * @param {!string} type
   * @param {!(string|number)} id
   * @param {?object} options
   * @param {boolean} [options.sync=true]
   * @return {Promise}
   */
  remove(type, id, options={}) {
    _.defaults(options, {
      sync: true
    });

    if (!type || !id) {
      throw new Error('unenough arguments');
    }

    if (!options.sync) {
      return Q.resolve(this._removeResourceFromPool(type, id));
    }

    return this.sync.delete(
      this.getRemote(type, id)
    )
    .then(response => {
      return response.status !== 204 ?
        this._saveResponseToPool(response) :
        null;
    })
    .then(() => this._removeResourceFromPool(type, id));
  }

  /**
   * @param {!string} type
   * @param {?ResourceObject} data
   * @param {?object} options
   * @param {boolean} [options.sync=true]
   * @return {Promise}
   */
  create(type, data, options={}) {
    _.defaults(options, {
      sync: true
    });

    if (!type) {
      throw new Error('unenough arguments');
    }

    data = _.extend({ type }, data);

    if (!options.sync) {
      return Q.resolve(this._saveResourceToPool(data));
    }

    return this.sync.post(
      this.getRemote(type), { data }
    )
    .then(response => {
      return this._saveResponseToPool(response);
    });
  }

  /**
   * @param {!string} type
   * @param {!(string|number)} id
   * @param {?ResourceObject} data
   * @param {?object} options
   * @param {boolean} [options.sync=true]
   * @return {Promise}
   */
  update(type, id, data, options={}) {
    _.defaults(options, {
      sync: true
    });

    if (!type || !id) {
      throw new Error('unenough arguments');
    }

    data = _.extend({ type, id }, data);

    if (!options.sync) {
      return Q.resolve(this._saveResourceToPool(data));
    }

    return this.sync.patch(
      this.getRemote(type, id), { data }
    )
    .then(response => {
      return response.status === 204 ?
        this._saveResourceToPool(data, true) :
        this._saveResponseToPool(response);
    });
  }

  /**
   * @param {!Relationship} relationship
   * @param {!ResourceLinkage} linkage
   * @param {?object} options
   * @param {boolean} [options.sync=true]
   */
  replaceLinkage(relationship, linkage, options={}) {
    _.defaults(options, {
      sync: true
    });

    if (!options.sync) {
      relationship.replaceLinkage(linkage);
      return Q.resolve(relationship);
    }

    if (!(relationship.links && relationship.links.self)) {
      throw new Error('relationship should contain self link!');
    }

    return this.sync.patch(
      relationship.links.self.href, { data: linkage }
    )
    .then(response => {
      if (response.status === 204) {
        relationship.replaceLinkage(linkage);
      }
      else {
        if (response.data) {
          relationship.replaceLinkage(response.data);
        }
        if (response.included) {
          _.map(response.included, data => {
            this._saveResourceToPool(data);
          });
        }
      }
      return relationship;
    });
  }

  /**
   * @desc To-Many Relationships only
   * @param {!Relationship} relationship
   * @param {!ResourceIdentifierObject[]} linkage
   * @param {?object} options
   * @param {boolean} [options.sync=true]
   */
  addLinkage(relationship, linkage, options={}) {
    _.defaults(options, {
      sync: true
    });

    if (!_.isArray(linkage)) {
      throw new Error('linkage should be array!');
    }

    if (!_.isArray(relationship.data)) {
      throw new Error('relationship should be array');
    }

    if (!options.sync) {
      relationship.addLinkage(linkage);
      return Q.resolve(relationship);
    }

    if (!(relationship.links && relationship.links.self)) {
      throw new Error('relationship should contain self link!');
    }

    return this.sync.post(
      relationship.links.self.href, { data: linkage }
    )
    .then(response => {
      if (response.status === 204) {
        relationship.addLinkage(linkage);
      }
      else {
        if (response.data) {
          relationship.addLinkage(response.data);
        }
        if (response.included) {
          _.map(response.included, data => {
            this._saveResourceToPool(data);
          });
        }
      }
      return relationship;
    });
  }

  /**
   * @desc To-Many Relationships only
   * @param {!Relationship} relationship
   * @param {!ResourceIdentifierObject[]} linkage
   * @param {?object} options
   * @param {boolean} [options.sync=true]
   */
  removeLinkage(relationship, linkage, options={}) {
    _.defaults(options, {
      sync: true
    });

    if (!_.isArray(linkage)) {
      throw new Error('linkage should be array!');
    }

    if (!_.isArray(relationship.data)) {
      throw new Error('relationship should be array');
    }

    if (!options.sync) {
      relationship.removeLinkage(linkage);
      return Q.resolve(relationship);
    }

    if (!(relationship.links && relationship.links.self)) {
      throw new Error('relationship should contain self link!');
    }

    return this.sync.delete(
      relationship.links.self.href, { data: linkage }
    )
    .then(response => {
      relationship.removeLinkage(linkage);
      if (response.status !== 204) {
        if (response.included) {
          _.map(response.included, data => {
            this._saveResourceToPool(data);
          });
        }
      }
      return relationship;
    });
  }

  /**
   * @deprecated use replaceLinkage, addLinkage, removeLinkage
   * instead of this.
   */
  linkageOperation(operation, type, id, relationship, linkage) {
    console.warn('this method is deprecated. ' +
      'use addLinkage, removeLinkage, replaceLinkage instead.');

    return this.sync[operation](
      this.getRemote(type, id, relationship),
      !_.isUndefined(linkage) ? { data: linkage } : undefined
    )
    .then(() => {
      // FIXME: linkage operation
    });
  }

  _saveResponseToPool(response) {
    let mainData = response.data;
    let includedData = response.included;

    let result;

    /* Main Data */
    if (_.isArray(mainData)) {
      result = !_.isEmpty(mainData) ?
        _.map(mainData, data =>
          this._saveResourceToPool(data)) : [];
    }
    else {
      result = mainData ?
        this._saveResourceToPool(mainData) : null;
    }

    /* Included Data */
    if (includedData) {
      _.map(includedData, data => {
        this._saveResourceToPool(data);
      });
    }

    return result;
  }

  _saveResourceToPool(data) {
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
      let before = resource.serialize();
      resource.deserialize(
        _.extend({}, data, {
          attributes: _.extend(
            {}, before.attributes, data.attributes),
          relationships: _.extend(
            {}, before.relationships, data.relationships)
        })
      );
    }

    return resource;
  }

  _removeResourceFromPool(type, id) {
    return this.db(type).removeById(id);
  }

  /**
   * @param {!string} type
   * @param {!string} url
   */
  addRemote(type, url) {
    if (!type || !url) {
      throw new Error('unenough arguments');
    }
    this.remote[type] = url;
  }

  /**
   * @param {!string} type
   * @param {?(string|number)} id
   * @param {?string} relationship
   * @return {string} url
   */
  getRemote(type, id, relationship) {
    let urlParts = _.compact([
      this.remote[type],
      id,
      relationship ? 'relationships' : undefined,
      relationship
    ]);
    return urljoin.apply(null, urlParts);
  }

  /**
   * @param {!type} type
   * @param {?(string|number)} id
   * @return {(Resource|Resource[])} resource
   */
  get(type, id) {
    return id === undefined ?
      this.db(type).value() :
      this.db(type).getById(id);
  }

  /**
   * @param {!type} type
   * @param {!string} relationship
   * @return {(Resource|Resource[])} resource
   */
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

  /**
   * @param {!type} type
   * @param {!string} id
   * @return {boolean}
   */
  has(type, id) {
    if (!type || !id) {
      throw new Error('unenough arguments');
    }

    let result = this.db(type).getById(id);
    return !!result;
  }

}
