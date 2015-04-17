
'use strict';


var $ = require('jquery');
var _ = require('lodash');
var Q = require('q');
var Response = require('./Response');


var ajaxOptions = {

  contentType: 'application/json',
  processData: true

};

var stringifyRequiredMethod = function (method) {
  // these HTTP methods requires JSON.stringify
  return (/^(POST|PUT|PATCH|DELETE)$/.test(method.toUpperCase()));
};

var makeAjaxRequest = function (options) {

  options = _.extend({}, ajaxOptions, options);

  if (stringifyRequiredMethod(options.type)) {
    if (options.contentType === 'application/json') {
      options.data = JSON.stringify(options.data);
    }
  }

  // https://github.com/kriskowal/q/wiki/Coming-from-jQuery
  return Q.promise(function (resolve, reject) {
    $.ajax(options)
      .then(function (data, textStatus, jqXHR) {
        delete jqXHR.then; // treat xhr as a non-promise
        var response = new Response(jqXHR);
        resolve(response);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        delete jqXHR.then; // treat xhr as a non-promise
        var response = new Response(jqXHR);
        reject(response);
      });
  });

};


module.exports = {

  head: function (url, data, options) {

    options = _.extend({
      url: url,
      type: "HEAD",
      data: data
    }, options);
    return makeAjaxRequest(options);

  },

  get: function (url, data, options) {

    options = _.extend({
      url: url,
      type: "GET",
      data: data
    }, options);
    return makeAjaxRequest(options);

  },

  post: function (url, data, options) {

    options = _.extend({
      url: url,
      type: "POST",
      data: data
    }, options);
    return makeAjaxRequest(options);

  },

  put: function (url, data, options) {

    options = _.extend({
      url: url,
      type: "PUT",
      data: data
    }, options);
    return makeAjaxRequest(options);

  },

  patch: function (url, data, options) {

    options = _.extend({
      url: url,
      type: "PATCH",
      data: data
    }, options);
    return makeAjaxRequest(options);

  },

  delete: function (url, data, options) {

    options = _.extend({
      url: url,
      type: "DELETE",
      data: data
    }, options);
    return makeAjaxRequest(options);

  }

};
