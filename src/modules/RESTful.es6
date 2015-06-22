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

export default {
  head(url, data, options) {
    options = _.extend({
      url: url,
      type: 'HEAD',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  },

  get(url, data, options) {
    options = _.extend({
      url: url,
      type: 'GET',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  },

  post(url, data, options) {
    options = _.extend({
      url: url,
      type: 'POST',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  },

  put(url, data, options) {
    options = _.extend({
      url: url,
      type: 'PUT',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  },

  patch(url, data, options) {
    options = _.extend({
      url: url,
      type: 'PATCH',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  },

  delete(url, data, options) {
    options = _.extend({
      url: url,
      type: 'DELETE',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  },

  defaultOptions: {
    contentType: 'application/json',
    processData: true
  },

  ajaxSetup(options) {
    $.ajaxSetup(options);
  }
};
