/* eslint no-unused-vars: [0] */
import _ from 'lodash';

/**
 * @external {jqXHR} https://api.jquery.com/jQuery.ajax/#jqXHR
 */

/**
 * @see http://jsonapi.org/format/#errors
 * @typedef {object} ErrorObject
 * @property {?(string|number)} id
 * @property {?LinkObject} links
 * @property {?string} status
 * @property {?string} code
 * @property {?string} title
 * @property {?string} detail
 * @property {?ErrorSourceObject} source
 * @property {?MetaObject} meta
 */

/**
 * @see http://jsonapi.org/format/#errors
 * @typedef {object} ErrorSourceObject
 * @property {?string} pointer
 * @property {?string} parameter
 */


function _isResponseError(status) {
  return status => 400 && status < 600;
}

function _parseErrors(xhr) {
  if (!(xhr.responseJSON && xhr.responseJSON.errors )) {
    if (_isResponseError(xhr.status)) {
      return [{
        status: '' + xhr.status
      }];
    }
    return null;
  }

  let errors = xhr.responseJSON.errors;

  return _.map(errors, function(error) {
    return _.extend({
      status: '' + xhr.status
    }, error);
  });
}

function _parseHeaders(xhr) {
  let result = [];

  let headerRegex = /^(.*?):[ \t]*([^\r\n]*)$/mg;
  let headersString = xhr.getAllResponseHeaders();
  let findResult;

  do {
    findResult = headerRegex.exec(headersString);
    if (findResult) {
      result.push(findResult.slice(1));
    }
  } while (findResult !== null)

  return _.object(result);
}


/**
 * @see http://jsonapi.org/format/#document-top-level
 * @desc The response object of jsonapi. used in {@link RESTful}.
 */
export default class Response {

  /**
   * @param {jqXHR} jqXHR
   */
  constructor(jqXHR) {
    let body = jqXHR.responseJSON || {};
    /** @type {?(ResourceObject|ResourceObject[]|ResourceIdentifierObject|ResourceIdentifierObject[]|null)} */
    this.data = body.data || null;
    /** @type {?ErrorObject[]} */
    this.errors = _parseErrors(jqXHR);
    /** @type {?MetaObject} */
    this.meta = body.included || null;
    /** @type {?Object} */
    this.jsonapi = body.jsonapi || null;
    /** @type {?LinkObject} */
    this.links = body.links || null;
    /** @type {?ResourceObject[]} */
    this.included = body.included || null;

    /** @type {!Object} */
    this.headers = _parseHeaders(jqXHR);
    /** @type {!string} */
    this.status = jqXHR.status;
    /** @type {!jqXHR} */
    this.jqXHR = jqXHR;
  }

}
