'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _$ = require('jquery');

var _$2 = _interopRequireWildcard(_$);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Q = require('q');

var _Q2 = _interopRequireWildcard(_Q);

var _Response = require('./Response');

var _Response2 = _interopRequireWildcard(_Response);

var stringifyRequiredMethod = function stringifyRequiredMethod(method) {
  // these HTTP methods requires JSON.stringify
  return /^(POST|PUT|PATCH|DELETE)$/.test(method.toUpperCase());
};

var makeAjaxRequest = function makeAjaxRequest(options) {

  options = options || {};

  if (stringifyRequiredMethod(options.type)) {
    if (options.contentType === 'application/vnd.api+json') {
      options.data = JSON.stringify(options.data);
    }
  }

  // https://github.com/kriskowal/q/wiki/Coming-from-jQuery
  return _Q2['default'].promise(function (resolve, reject) {
    _$2['default'].ajax(options).then(function (data, textStatus, jqXHR) {
      delete jqXHR.then; // treat xhr as a non-promise
      var response = new _Response2['default'](jqXHR);
      resolve(response);
    }).fail(function (jqXHR, textStatus, errorThrown) {
      delete jqXHR.then; // treat xhr as a non-promise
      var response = new _Response2['default'](jqXHR);
      reject(response);
    });
  });
};

var RESTful = {

  head: function head(url, data, options) {

    options = _import2['default'].extend({
      url: url,
      type: 'HEAD',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  },

  get: function get(url, data, options) {

    options = _import2['default'].extend({
      url: url,
      type: 'GET',
      data: data
    }, options);
    return makeAjaxRequest(options);
  },

  post: function post(url, data, options) {

    options = _import2['default'].extend({
      url: url,
      type: 'POST',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  },

  put: function put(url, data, options) {

    options = _import2['default'].extend({
      url: url,
      type: 'PUT',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  },

  patch: function patch(url, data, options) {

    options = _import2['default'].extend({
      url: url,
      type: 'PATCH',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  },

  'delete': function _delete(url, data, options) {

    options = _import2['default'].extend({
      url: url,
      type: 'DELETE',
      data: data
    }, this.defaultOptions, options);
    return makeAjaxRequest(options);
  },

  defaultOptions: {

    contentType: 'application/vnd.api+json',
    processData: true

  },

  ajaxSetup: function ajaxSetup(options) {

    _$2['default'].ajaxSetup(options);
  }

};

exports['default'] = RESTful;
module.exports = exports['default'];