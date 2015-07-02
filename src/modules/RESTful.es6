import $ from 'jquery';
import _ from 'lodash';
import Q from 'q';
import Response from './Response';


let stringifyRequiredMethod = function(method) {
  // these HTTP methods requires JSON.stringify
  return (/^(POST|PUT|PATCH|DELETE)$/.test(method.toUpperCase()));
};

function makeAjaxRequest(options) {
  options = options || {};

  if (stringifyRequiredMethod(options.type)) {
    if (options.contentType === 'application/json') {
      options.data = JSON.stringify(options.data);
    }
  }

  options.url = options.url.replace(/\/?$/, '/');

  // https://github.com/kriskowal/q/wiki/Coming-from-jQuery
  return Q.promise(function(resolve, reject) {
    $.ajax(options)
      .then(function(data, textStatus, jqXHR) {
        delete jqXHR.then; // treat xhr as a non-promise
        let response = new Response(jqXHR);
        resolve(response);
      })
      .fail(function(jqXHR) {
        delete jqXHR.then; // treat xhr as a non-promise
        let response = new Response(jqXHR);
        reject(response);
      });
  });
}


/**
 * @desc wrapper function to make RESTful ajax request.
 * @example
 * // Fetch comment 1
 * RESTful.get('/comments/1')
 * .then(response => {
 *   let resource = new Resource(response.data);
 * })
 *
 * // Create comment
 * RESTful.post('/comments', {
 *   type: 'comment',
 *   attributes: {
 *     content: 'hello world'
 *   }
 * })
 * .then(response => {
 *   let resource = new Resource(response.data);
 * })
 *
 * // Update content of comment 2
 * RESTful.patch('/comments/2', {
 *   type: 'comment',
 *   id: 2,
 *   attributes: {
 *     content: 'fix'
 *   }
 * })
 *
 * // Remove comment 2
 * RESTful.delete('/comments/1')
 */
class RESTful {
  /**
   * @desc make http HEAD request
   * @param {string} url URL for ajax request
   * @param {object} data body of request
   * @param {object} options overide options for $.ajax.
   * @return {Response}
   */
  static head(url, data, options) {
    options = _.extend({
      url: url,
      type: 'HEAD',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  }

  /**
   * @desc make http GET request
   * @param {string} url URL for ajax request
   * @param {object} data body of request
   * @param {object} options overide options for $.ajax.
   * @return {Response}
   */
  static get(url, data, options) {
    options = _.extend({
      url: url,
      type: 'GET',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  }

  /**
   * @desc make http POST request
   * @param {string} url URL for ajax request
   * @param {object} data body of request
   * @param {object} options overide options for $.ajax.
   * @return {Response}
   */
  static post(url, data, options) {
    options = _.extend({
      url: url,
      type: 'POST',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  }

  /**
   * @desc make http PUT request
   * @param {string} url URL for ajax request
   * @param {object} data body of request
   * @param {object} options overide options for $.ajax.
   * @return {Response}
   */
  static put(url, data, options) {
    options = _.extend({
      url: url,
      type: 'PUT',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  }

  /**
   * @desc make http PATCH request
   * @param {string} url URL for ajax request
   * @param {object} data body of request
   * @param {object} options overide options for $.ajax.
   * @return {Response}
   */
  static patch(url, data, options) {
    options = _.extend({
      url: url,
      type: 'PATCH',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  }

  /**
   * @desc make http DELETE request
   * @param {string} url URL for ajax request
   * @param {object} data body of request
   * @param {object} options overide options for $.ajax.
   * @return {Response}
   */
  static delete(url, data, options) {
    options = _.extend({
      url: url,
      type: 'DELETE',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  }

  /**
   * @see https://api.jquery.com/jQuery.ajaxSetup/
   * @desc wrapper function for $.ajaxSetup
   * @param {object} options options for $.ajaxSetup
   */
  static ajaxSetup(options) {
    $.ajaxSetup(options);
  }
}

RESTful.defaultOptions = {
  contentType: 'application/json',
  processData: true
};


export default RESTful;
