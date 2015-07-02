import _ from 'lodash';
import Link from './Link';
import ResourceIdentifier from './ResourceIdentifier';

/**
 * @see http://jsonapi.org/format/#document-resource-object-relationships
 * @typedef {object} RelationshipObject
 * @property {?LinksObject} links
 * @property {?ResourceLinkage} data
 * @property {?MetaObject} meta
 */

/**
 * @see http://jsonapi.org/format/#document-resource-object-relationships
 * @typedef {object} LinksObject
 * @property {?LinksObject} self
 * @property {?LinksObject} related
 */

/**
 * @see http://jsonapi.org/format/#document-resource-object-linkage
 * @typedef {?(null|ResourceIdentifierObject[]|ResourceIdentifierObject)} ResourceLinkage
 */

/**
 * @see http://jsonapi.org/format/#document-resource-object-relationships
 * @example
 * let toOneRelationship = new Relationship({
 *   data: {
 *     type: 'foo',
 *     id: 1
 *   }
 * });
 * let toManyRelationship = new Relationship({
 *   data: [{
 *     type: 'foo',
 *     id: 1
 *   }]
 * });
 */
export default class Relationship {

  /**
   * @param {RelationshipObject} relationship
   */
  constructor(relationship) {
    /** @type {ResourceLinkage} */
    this.data = null;
    /** @type {LinksObject} */
    this.links = null;
    /** @type {MetaObject} */
    this.meta = null;
    this.deserialize(relationship);
  }

  /**
   * @desc completely replace every member of the relationship.
   * @param {ResourceLinkage} linkage
   * @see http://jsonapi.org/format/#crud-updating-relationships
   * @example
   * // Updating To-One Relationships
   * let toOneRelationship = new Relationship({
   *   data: { type: 'foo', id: 1 }
   * });
   * toOneRelationship.replaceLinkage({ type: 'foo', id: 2 });
   * toOneRelationship.replaceLinkage(null);
   *
   * // Updating To-Many Relationships
   * let toManyRelationship = new Relationship({
   *   data: [
   *     { type: 'foo', id: 1 }
   *   ]
   * });
   * toManyRelationship.replaceLinkage([
   *   { type: 'foo', id: 2 }
   * ]);
   * toManyRelationship.replaceLinkage([]);
   */
  replaceLinkage(linkage) {
    if (_.isArray(linkage)) {
      this.data = _.map(linkage,
        linkage => new ResourceIdentifier(linkage));
    }
    else {
      if (_.isNull(linkage)) {
        this.data = null;
      }
      else {
        this.data = new ResourceIdentifier(linkage);
      }
    }
  }

  /**
   * @desc add the specified members to the relationship unless they are already present.
   * @param {ResourceIdentifierObject[]} linkage
   * @see http://jsonapi.org/format/#crud-updating-to-many-relationships
   * @example
   * let toManyRelationship = new Relationship({
   *   data: [
   *     { type: 'foo', id: 1 }
   *   ]
   * });
   * toManyRelationship.addLinkage([
   *   { type: 'foo', id: 1 },
   *   { type: 'foo', id: 2 }
   * ]);
   */
  addLinkage(linkage) {
    if (!_.isArray(this.data)) {
      throw new Error('relationship should be array');
    }

    if (!_.isArray(linkage)) {
      throw new Error('linkage should be array!');
    }

    this.removeLinkage(linkage);
    this.data = this.data.concat(
      _.map(linkage, linkage => new ResourceIdentifier(linkage))
    );
  }

  /**
   * @desc delete the specified members from the relationship.
   * @param {ResourceIdentifierObject[]} linkage
   * @see http://jsonapi.org/format/#crud-updating-to-many-relationships
   * @example
   * let toManyRelationship = new Relationship({
   *   data: [
   *     { type: 'foo', id: 1 }
   *   ]
   * });
   * toManyRelationship.removeLinkage([
   *   { type: 'foo', id: 1 }
   * ]);
   */
  removeLinkage(linkage) {
    if (!_.isArray(this.data)) {
      throw new Error('relationship should be array');
    }

    if (!_.isArray(linkage)) {
      throw new Error('linkage should be array!');
    }

    _.remove(this.data, identifier => {
      return _.findWhere(linkage, identifier);
    });
  }

  /**
   * @desc serialize relationship.
   * @return {RelationshipObject} relationship
   */
  serialize() {
    return _.chain({
      links: _.mapValues(this.links, link => link.serialize()),
      meta: this.meta
    })
    .omit(_.isEmpty)
    .extend({
      data: _.isArray(this.data) ?
        _.map(this.data, identifier => identifier.serialize()) :
        this.data && this.data.serialize()
    })
    .omit(_.isUndefined)
    .value();
  }

  /**
   * @desc deserialize relationship.
   * @param {RelationshipObject} relationship
   */
  deserialize(relationship) {
    this.links = _.mapValues(relationship.links, link => {
      return new Link(link);
    });
    if (!_.isUndefined(relationship.data)) {
      this.replaceLinkage(relationship.data);
    }
    else {
      this.data = undefined;
    }
    this.meta = relationship.meta;
  }

}
