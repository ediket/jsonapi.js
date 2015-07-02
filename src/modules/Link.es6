import _ from 'lodash';

/**
 * @see http://jsonapi.org/format/#document-links
 * @typedef {(object|string)} LinkObject
 * @property {!string} href
 * @property {?MetaObject} meta
 */

/**
 * @see http://jsonapi.org/format/#document-links
 * @example
 * let link1 = new Link('/api/resource');
 * let link2 = new Link({
 *   href: '/api/resource',
 *   meta: {
 *     foo: 'bar'
 *   }
 * });
 * link1.href === link2.href  // true
 * link1.serialize()  // { href: 'api/resource' };
 * link2.serialize()  // { href: 'api/resource', meta: { foo: 'bar' } };
 */
export default class Link {

  /**
   * @param {LinkObject} link
   */
  constructor(link) {
    /** @type {string} */
    this.href = null;
    /** @type {MetaObject} */
    this.meta = null;
    this.deserialize(link);
  }

  /**
   * @return {LinkObject} link
   */
  serialize() {
    return _.omit({
      href: this.href,
      meta: this.meta
    }, _.isEmpty);
  }

  /**
   * @param {LinkObject} link
   */
  deserialize(link) {
    if (_.isString(link)) {
      this.href = link;
      this.meta = {};
    }
    else {
      this.href = link.href;
      this.meta = link.meta;
    }
  }

}
