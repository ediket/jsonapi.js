import _ from 'lodash';
import Link from './Link';
import Relationship from './Relationship';
import ResourceIdentifier from './ResourceIdentifier';

/**
 * @external {Fields} http://jsonapi.org/format/#document-resource-object-fields
 */

/**
 * @see http://jsonapi.org/format/#document-resource-objects
 * @typedef {object} ResourceObject
 * @property {!string} type
 * @property {?(string|integer)} id
 * @property {?object} attributes
 * @property {?Object<string, RelationshipObject>} relationships
 * @property {?LinksObject} links
 * @property {?MetaObject} meta
 */

/**
 * @see http://jsonapi.org/format/#document-resource-objects
 * @example
 * let foo = new Resource({
 *   type: 'foo',
 *   id: 2,
 *   attributes: {
 *     content: 'foo'
 *   }
 *   relationships: {
 *     bars: {
 *       data: [
 *         { type: 'bar', id: 1 }
 *       ]
 *     }
 *   }
 * });
 *
 * let bar = new Resource({
 *   type: 'bar',
 *   id: 2,
 *   attributes: {
 *     content: 'hello'
 *   }
 * });
 *
 * foo.setRelationship('bar', bar);
 * foo.setRelationship('bar', bar.getIdentifier());
 * foo.setRelationship('bars', [bar]);
 * foo.unsetRelationship('bar');
 * foo.unsetRelationship('bars');
 *
 * foo.setAttribute('key', 'value');
 * foo.unsetAttribute('key');
 */
export default class Resource extends ResourceIdentifier {

  /**
   * @param {ResourceObject} data
   */
  constructor(data) {
    super(data);
    /** @type {?Object} */
    this.attributes = null;
    /** @type {?Object<string, RelationshipObject>} */
    this.relationships = null;
    /** @type {?LinksObject} */
    this.links = null;
    this.deserialize(data);
  }

  /**
   * @return {ResourceIdentifier}
   */
  getIdentifier() {
    return super.serialize();
  }

  /**
   * @param {string} key
   * @param {ResourceLinkage} resource
   */
  setRelationship(key, resource) {
    if (_.isArray(resource)) {
      this.relationships[key] = new Relationship({
        data: _.map(resource, resource => ({
          type: resource.type,
          id: resource.id
        }))
      });
    }
    else {
      this.relationships[key] = new Relationship({
        links: resource.links,
        data: {
          type: resource.type,
          id: resource.id
        }
      });
    }
  }

  /**
   * @param {string} key
   */
  unsetRelationship(key) {
    delete this.relationships[key];
  }

  /**
   * @param {Object<string, ResourceLinkage>} relationships
   */
  setRelationships(relationships) {
    _.each(relationships, (relationship, key) => {
      this.setRelationship(key, relationship);
    });
  }

  /**
   * @param {string} key
   * @param {anything} value
   */
  setAttribute(key, value) {
    this.attributes[key] = value;
  }

  /**
   * @param {string} key
   */
  unsetAttribute(key) {
    delete this.attributes[key];
  }

  /**
   * @param {Object<string, anything>>} key
   */
  setAttributes(attributes) {
    _.extend(this.attributes, attributes);
  }

  /**
   * @return {Fields}
   * @example
   * let foo = new Resource({
   *   type: 'foo',
   *   id: 2,
   *   attributes: {
   *     content: 'foo'
   *   }
   *   relationships: {
   *     bars: {
   *       data: [
   *         { type: 'bar', id: 1 }
   *       ]
   *     }
   *   }
   * });
   * // True
   * _.isEqual(foo.flatten() === {
   *   type: 'foo',
   *   id: 2,
   *   content: 'foo',
   *   bars: {
   *     data: [
   *       { type: 'bar', id: 1 }
   *     ]
   *   }
   * });
   */
  flatten() {
    return _.chain({})
    .extend(this.getIdentifier())
    .extend(this.attributes)
    .extend(_.mapValues(this.relationships, relationship => relationship.serialize()))
    .value();
  }

  /**
   * @return {ResourceObject}
   */
  serialize() {
    return _.chain({
      attributes: this.attributes,
      links: _.mapValues(this.links, link => link.serialize()),
      relationships: _.mapValues(this.relationships, relationship => relationship.serialize())
    })
    .extend(this.getIdentifier())
    .omit(attribute => _.isObject(attribute) ?
      _.isEmpty(attribute) : _.isUndefined(attribute))
    .value();
  }

  /**
   * @param {ResourceObject} data
   */
  deserialize(data) {
    super.deserialize(data);
    this.attributes = data.attributes;
    this.relationships = _.mapValues(data.relationships,
      relationship => new Relationship(relationship));
    this.links = _.mapValues(data.links,
      link => new Link(link));
  }

}
