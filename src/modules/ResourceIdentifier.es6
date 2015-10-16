import _ from 'lodash';

/**
 * @see http://jsonapi.org/format/#document-resource-identifier-objects
 * @typedef {Object} ResourceIdentifierObject
 * @property {!string} type
 * @property {?(string|number)} id
 * @property {?MetaObject} meta
 */

/**
 * @see http://jsonapi.org/format/#document-resource-identifier-objects
 * @example
 * let identifier = new ResourceIdentifier({ type: 'foo', id: 1 });
 */
export default class ResourceIdentifier {

  /**
   * @param {ResourceIdentifierObject} resourceIdentifier
   */
  constructor(resourceIdentifier) {
    /** @type {!string} */
    this.type = null;
    /** @type {?(string|number)} */
    this.id = null;
    this.deserialize(resourceIdentifier);
  }

  /**
   * @return {ResourceIdentifierObject} resourceIdentifier
   */
  serialize() {
    return _.omit({
      type: this.type,
      id: this.id,
    }, _.isUndefined);
  }

  /**
   * @param {ResourceIdentifierObject} resourceIdentifier
   */
  deserialize(resourceIdentifier) {
    if (!(resourceIdentifier && resourceIdentifier.type)) {
      throw new Error('invalid data!');
    }
    this.type = resourceIdentifier.type;
    this.id = resourceIdentifier.id;
  }

}
