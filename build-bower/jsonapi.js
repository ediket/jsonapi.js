(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JSONAPI = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Resource = require('./lib/Resource');

var _Resource2 = _interopRequireWildcard(_Resource);

var _Pool = require('./lib/Pool');

var _Pool2 = _interopRequireWildcard(_Pool);

var _RESTful = require('./lib/RESTful');

var _RESTful2 = _interopRequireWildcard(_RESTful);

var _Transaction = require('./lib/Transaction');

var _Transaction2 = _interopRequireWildcard(_Transaction);

exports.Transaction = _Transaction2['default'];
exports.Resource = _Resource2['default'];
exports.Pool = _Pool2['default'];
exports.RESTful = _RESTful2['default'];

},{"./lib/Pool":2,"./lib/RESTful":3,"./lib/Resource":4,"./lib/Transaction":6}],2:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Q = require('q');

var _Q2 = _interopRequireWildcard(_Q);

var _urlJoin = require('url-join');

var _urlJoin2 = _interopRequireWildcard(_urlJoin);

var _uuid = require('node-uuid');

var _uuid2 = _interopRequireWildcard(_uuid);

var _Resource = require('./Resource');

var _Resource2 = _interopRequireWildcard(_Resource);

var _RESTful = require('./RESTful');

var _RESTful2 = _interopRequireWildcard(_RESTful);

var Pool = (function () {
  function Pool(options) {
    _classCallCheck(this, Pool);

    this.sync = _RESTful2['default'];
    this.resetAll();
  }

  _createClass(Pool, [{
    key: 'resetAll',
    value: function resetAll() {

      this.pool = {};
      this.blobs = {};
      this.staged = {};
      this.stagedLink = [];
      this.remote = {};
      this.commits = [];
      this.remoteIndex = -1;
    }
  }, {
    key: 'getCommit',
    value: function getCommit(idx) {

      idx = idx !== undefined ? idx : this.commits.length - 1;
      return this.commits[idx] || {};
    }
  }, {
    key: 'setRemoteIndex',
    value: function setRemoteIndex(idx) {

      idx = idx !== undefined ? idx : this.commits.length - 1;
      this.remoteIndex = idx;
    }
  }, {
    key: 'rm',
    value: function rm(resource) {
      var _this = this;

      if (_import2['default'].isArray(resource)) {
        return _import2['default'].map(resource, function (resource) {
          return _this.rm(resource);
        });
      }

      var rid = resource.rid;

      this.staged[rid] = null;

      return this.staged[rid];
    }
  }, {
    key: 'add',
    value: function add(resource) {
      var _this2 = this;

      if (_import2['default'].isArray(resource)) {
        return _import2['default'].map(resource, function (resource) {
          return _this2.add(resource);
        });
      }

      var rid = resource.rid;

      if (!this.pool[rid]) {
        this.pool[rid] = resource;
      }

      this.staged[rid] = resource.serialize();

      return this.staged[rid];
    }
  }, {
    key: 'rmLinkage',
    value: function rmLinkage(resource, relation, linkage, options) {

      return this._createLinkageOperation('remove', resource, relation, linkage, options);
    }
  }, {
    key: 'addLinkage',
    value: function addLinkage(resource, relation, linkage, options) {

      return this._createLinkageOperation('add', resource, relation, linkage, options);
    }
  }, {
    key: '_createLinkageOperation',
    value: function _createLinkageOperation(op, resource, relation, linkage, options) {
      var _this3 = this;

      if (_import2['default'].isArray(linkage)) {
        return _import2['default'].map(linkage, function (linkage) {
          return _this3._createLinkageOperation(op, resource, relation, linkage, options);
        });
      }

      var staged = {
        op: op,
        resource: resource,
        relation: relation,
        linkage: linkage,
        options: options
      };

      this.stagedLink.push(staged);

      return staged;
    }
  }, {
    key: 'getStaged',
    value: function getStaged(resource) {

      if (!this.isStaged(resource)) {
        throw Error('can not find ' + resource);
      }

      return this.staged[resource.rid];
    }
  }, {
    key: 'isStaged',
    value: function isStaged(resource) {

      return this.staged[resource.rid] !== undefined;
    }
  }, {
    key: 'commit',
    value: function commit() {
      var _this4 = this;

      var lastCommit = this.getCommit();

      var newCommit = _import2['default'].reduce(this.staged, function (commit, serialized, rid) {
        if (!serialized) {
          if (commit[rid]) {
            delete commit[rid];
          }
        } else {
          commit[rid] = _this4._createBlob(serialized);
        }
        return commit;
      }, _import2['default'].clone(lastCommit, true));

      _import2['default'].reduce(this.stagedLink, function (commit, linkOperation) {
        commit[_uuid2['default'].v4()] = linkOperation;
        return commit;
      }, newCommit);

      this.commits.push(newCommit);
      this.staged = {};
      this.stagedLink = {};
    }
  }, {
    key: 'addRemote',
    value: function addRemote(type, url) {

      this.remote[type] = url;
    }
  }, {
    key: 'getRemote',
    value: function getRemote(type, id, relation) {

      var urlParts = _import2['default'].compact([this.remote[type], id, relation ? 'links' : undefined, relation]);
      return _urlJoin2['default'].apply(null, urlParts);
    }
  }, {
    key: 'get',
    value: function get(type, id) {

      if (id === undefined) {
        return _import2['default'].filter(this.pool, function (resource) {
          return resource.get('type') === type;
        });
      }

      return _import2['default'].find(this.pool, function (resource) {
        return resource.get('type') === type && resource.get('id') === id;
      });
    }
  }, {
    key: 'has',
    value: function has(type, id) {

      return !!_import2['default'].find(this.pool, function (resource) {
        return resource.get('type') === type && resource.get('id') === id;
      });
    }
  }, {
    key: '_createBlob',
    value: function _createBlob(serialized) {

      var bid = _uuid2['default'].v4();
      this.blobs[bid] = _import2['default'].clone(serialized, true);
      return this.blobs[bid];
    }
  }, {
    key: '_getBlob',
    value: function _getBlob(bid) {

      return this.blobs[bid];
    }
  }, {
    key: 'pullByLink',
    value: function pullByLink(link, options) {

      var url = undefined;
      if (_import2['default'].isString(link)) {
        url = link;
      } else if (link.linkage) {
        url = this.getRemote(link.linkage.type, link.linkage.id);
      } else if (link.related) {
        url = link.related;
      } else {
        throw new Error('invalid link.');
      }

      return this.pullByURL(url, options);
    }
  }, {
    key: 'pull',
    value: function pull(type, id, options) {

      return this.pullByURL(this.getRemote(type, id), options);
    }
  }, {
    key: 'pullByURL',
    value: function pullByURL(url, options) {
      var _this5 = this;

      if (!_import2['default'].isEmpty(this.staged)) {
        throw new Error('pull when staged change is not exist');
      }

      return this.sync.get(url, options).then(function (response) {
        return _this5._saveResponse(response);
      });
    }
  }, {
    key: 'push',
    value: function push(idx) {
      var _this6 = this;

      idx = idx || this.commits.length - 1;

      if (idx <= this.remoteIndex) {
        return _Q2['default']();
      }

      var afterCommit = this.getCommit(idx);
      var beforeCommit = this.getCommit(this.remoteIndex);

      var removed = _import2['default'].difference(_import2['default'].keys(beforeCommit), _import2['default'].keys(afterCommit));

      var changedOrAdded = _import2['default'].without(_import2['default'].keys(afterCommit), _import2['default'].keys(removed));

      var deleteRequest = _import2['default'].map(removed, function (rid) {
        // is Link
        if (!_this6.pool[rid]) {
          return;
        }

        var type = _this6.pool[rid].get('type');
        var id = _this6.pool[rid].get('id');
        if (id) {
          return _this6.sync['delete'](_this6.getRemote(type, id)).then(function (response) {
            delete _this6.pool[rid];
          });
        }
      });

      var postOrPatchRequest = _import2['default'].map(changedOrAdded, function (rid) {
        // is Link
        if (!_this6.pool[rid]) {
          return;
        }
        // not change
        if (_import2['default'].isEqual(afterCommit[rid], beforeCommit[rid])) {
          return;
        }

        var type = _this6.pool[rid].get('type');
        var id = _this6.pool[rid].get('id');
        var blob = afterCommit[rid];

        if (id) {
          return _this6.sync.patch(_this6.getRemote(type, id), _this6._toRequest(blob)).then(function (response) {
            return _this6._saveResponse(response, rid);
          });
        }
        if (!id) {
          return _this6.sync.post(_this6.getRemote(type), _this6._toRequest(blob)).then(function (response) {
            return _this6._saveResponse(response, rid);
          });
        }
      });

      var linkOperationRequest = _import2['default'].map(afterCommit, function (staged, rid) {
        // is resource
        if (_this6.pool[rid] || !staged.op) {
          return;
        }

        var type = staged.resource.get('type');
        var id = staged.resource.get('id');
        var options = _import2['default'].defaults(staged.options || {}, {
          hasMany: true
        });
        var op = staged.op;
        var relation = staged.relation;
        var linkage = staged.linkage;
        var requestBody = options.hasMany ? { data: [linkage] } : { data: linkage };

        if (op === 'add') {
          return _this6.sync.post(_this6.getRemote(type, id, relation), requestBody).then(function () {
            return requestBody;
          });
        }

        if (op === 'remove') {
          return _this6.sync['delete'](_this6.getRemote(type, id, relation), requestBody).then(function () {
            return requestBody;
          });
        }
      });

      return _Q2['default'].all(deleteRequest.concat(postOrPatchRequest)).then(function () {
        _this6.setRemoteIndex();
      });
    }
  }, {
    key: '_saveResponse',
    value: function _saveResponse(response, rid) {

      return this._saveData(this._fromResponse(response), rid);
    }
  }, {
    key: '_saveData',
    value: function _saveData(data, rid) {
      var _this7 = this;

      if (_import2['default'].isArray(data)) {
        return _import2['default'].map(data, function (data) {
          return _this7._saveData(data);
        });
      }

      var resource = rid !== undefined ? this.pool[rid] : this.get(data.type, data.id);

      if (!resource) {
        resource = new _Resource2['default'](data);
      } else {
        resource.deserialize(data);
      }

      var stagedBackup = _import2['default'].clone(this.staged, true);

      this.add(resource);
      this.commit();
      this.setRemoteIndex();

      this.staged = stagedBackup;

      return resource;
    }
  }, {
    key: '_toRequest',
    value: function _toRequest(serialized) {

      return {
        data: serialized
      };
    }
  }, {
    key: '_fromResponse',
    value: function _fromResponse(response) {

      return response.data;
    }
  }]);

  return Pool;
})();

exports['default'] = Pool;
module.exports = exports['default'];

},{"./RESTful":3,"./Resource":4,"lodash":"lodash","node-uuid":"node-uuid","q":"q","url-join":"url-join"}],3:[function(require,module,exports){
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

},{"./Response":5,"jquery":"jquery","lodash":"lodash","q":"q"}],4:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _uuid = require('node-uuid');

var _uuid2 = _interopRequireWildcard(_uuid);

var Resource = (function () {
  function Resource(attributes) {
    _classCallCheck(this, Resource);

    this.attributes = {};
    this.links = {};
    this.rid = _uuid2['default'].v4();

    this.deserialize(attributes);
  }

  _createClass(Resource, [{
    key: 'get',
    value: function get(key) {

      return this.attributes[key];
    }
  }, {
    key: 'set',
    value: function set(attributes) {

      _import2['default'].extend(this.attributes, attributes);
    }
  }, {
    key: 'unset',
    value: function unset(key) {

      delete this.attributes[key];
    }
  }, {
    key: 'getLink',
    value: function getLink(key) {

      key = key || 'self';
      return this.links[key];
    }
  }, {
    key: 'setLink',
    value: function setLink(links) {

      _import2['default'].extend(this.links, links);
    }
  }, {
    key: 'unsetLink',
    value: function unsetLink(key) {

      delete this.links[key];
    }
  }, {
    key: 'getLinkage',
    value: function getLinkage() {

      return {
        type: this.attributes.type,
        id: this.attributes.id
      };
    }
  }, {
    key: 'serialize',
    value: function serialize() {

      var result = _import2['default'].clone(this.attributes, true);
      result.links = this.links;

      if (_import2['default'].isEmpty(result.links)) {
        delete result.links;
      }

      return result;
    }
  }, {
    key: 'deserialize',
    value: function deserialize(serialized) {

      if (!this._validateSerialized(serialized)) {
        throw new Error('invalid data! type should be provided');
      }

      this.set(_import2['default'].clone(_import2['default'].omit(serialized, 'links'), true));
      this.setLink(serialized.links);
    }
  }, {
    key: 'clone',
    value: function clone() {

      var resource = new Resource(this.serialize());
      resource.uuid = this.uuid;
      return resource;
    }
  }, {
    key: '_validateSerialized',
    value: function _validateSerialized(serialized) {

      return serialized && serialized.type;
    }
  }]);

  return Resource;
})();

exports['default'] = Resource;
module.exports = exports['default'];

},{"lodash":"lodash","node-uuid":"node-uuid"}],5:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _import = require("lodash");

var _import2 = _interopRequireWildcard(_import);

var _validateResponse = function _validateResponse(xhr) {

  var body = xhr.responseJSON;

  if (body.data === undefined && body.errors === undefined) {
    throw new Error("A document MUST contain either primary data " + "or an array of error objects.");
  }
};

var _isResponseError = function _isResponseError(status) {

  return 400 <= status && 600 > status;
};

var _parseData = function _parseData(xhr) {

  if (!xhr.responseJSON) {
    return null;
  }
  return xhr.responseJSON.data;
};

var _parseErrors = function _parseErrors(xhr) {

  if (!(xhr.responseJSON && xhr.responseJSON.errors)) {
    if (_isResponseError(xhr.status)) {
      return [{
        status: "" + xhr.status
      }];
    }
    return null;
  }

  var errors = xhr.responseJSON.errors;

  return _import2["default"].map(errors, function (error) {
    return _import2["default"].extend({
      status: "" + xhr.status
    }, error);
  });
};

var _parseHeaders = function _parseHeaders(xhr) {

  var result = [];

  var headerRegex = /^(.*?):[ \t]*([^\r\n]*)$/mg;
  var headersString = xhr.getAllResponseHeaders();
  var findResult = undefined;

  while ((findResult = headerRegex.exec(headersString)) !== null) {
    result.push(findResult.slice(1));
  }

  return _import2["default"].object(result);
};

var Response = function Response(xhr) {
  _classCallCheck(this, Response);

  this.responseJSON = xhr.responseJSON;
  this.data = _parseData(xhr);
  this.errors = _parseErrors(xhr);
  this.headers = _parseHeaders(xhr);
  this.nativeXHR = xhr;
};

exports["default"] = Response;
module.exports = exports["default"];

},{"lodash":"lodash"}],6:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Q = require('q');

var _Q2 = _interopRequireWildcard(_Q);

var _Events = require('backbone');

var Transaction = (function () {
  function Transaction(pool, options) {
    _classCallCheck(this, Transaction);

    _import2['default'].extend(this, _Events.Events);
    options = _import2['default'].defaults(options || {});

    this.pool = pool;
    this.operations = [];
  }

  _createClass(Transaction, [{
    key: 'begin',
    value: function begin() {

      this.operations = [];
      this._activate();
    }
  }, {
    key: 'commit',
    value: function commit() {

      this._deactivate();
    }
  }, {
    key: '_activate',
    value: function _activate() {

      this.listenTo(this.pool, 'transform', this.onTransform);
      this.active = true;
    }
  }, {
    key: '_deactivate',
    value: function _deactivate() {

      this.stopListening(this.pool, 'transform', this.onTransform);
      this.active = false;
    }
  }, {
    key: 'onTransform',
    value: function onTransform(operation) {

      this.operations.push(operation);
    }
  }]);

  return Transaction;
})();

exports['default'] = Transaction;
module.exports = exports['default'];

},{"backbone":"backbone","lodash":"lodash","q":"q"}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9pbmRleC5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9Qb29sLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvbGliL1JFU1RmdWwuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvUmVzb3VyY2UuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvUmVzcG9uc2UuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvVHJhbnNhY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsZ0JBQWdCOzs7O29CQUNwQixZQUFZOzs7O3VCQUNULGVBQWU7Ozs7MkJBQ1gsbUJBQW1COzs7O1FBSXpDLFdBQVc7UUFDWCxRQUFRO1FBQ1IsSUFBSTtRQUNKLE9BQU87Ozs7Ozs7Ozs7Ozs7OztzQkNWSyxRQUFROzs7O2lCQUNSLEdBQUc7Ozs7dUJBQ0csVUFBVTs7OztvQkFDYixXQUFXOzs7O3dCQUNQLFlBQVk7Ozs7dUJBQ2IsV0FBVzs7OztJQUd6QixJQUFJO0FBRUksV0FGUixJQUFJLENBRUssT0FBTyxFQUFFOzBCQUZsQixJQUFJOztBQUlOLFFBQUksQ0FBQyxJQUFJLHVCQUFVLENBQUM7QUFDcEIsUUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0dBRWpCOztlQVBHLElBQUk7O1dBU0Msb0JBQUc7O0FBRVYsVUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZixVQUFJLENBQUMsS0FBSyxHQUFH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QUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0tBRXBCOzs7V0FFVyx1QkFBRzs7QUFFYixVQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM3RCxVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUVyQjs7O1dBRVcscUJBQUMsU0FBUyxFQUFFOztBQUV0QixVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUVqQzs7O1NBNUNHLFdBQVc7OztxQkFnREYsV0FBVyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9saWIvUmVzb3VyY2UnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi9saWIvUG9vbCc7XG5pbXBvcnQgUkVTVGZ1bCBmcm9tICcuL2xpYi9SRVNUZnVsJztcbmltcG9ydCBUcmFuc2FjdGlvbiBmcm9tICcuL2xpYi9UcmFuc2FjdGlvbic7XG5cblxuZXhwb3J0IHtcbiAgVHJhbnNhY3Rpb24sXG4gIFJlc291cmNlLFxuICBQb29sLFxuICBSRVNUZnVsXG59O1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHVybEpvaW4gZnJvbSAndXJsLWpvaW4nO1xuaW1wb3J0IHV1aWQgZnJvbSAnbm9kZS11dWlkJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCBSRVNUZnVsIGZyb20gJy4vUkVTVGZ1bCc7XG5cblxuY2xhc3MgUG9vbCB7XG5cbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcblxuICAgIHRoaXMuc3luYyA9IFJFU1RmdWw7XG4gICAgdGhpcy5yZXNldEFsbCgpO1xuXG4gIH1cblxuICByZXNldEFsbCAoKSB7XG5cbiAgICB0aGlzLnBvb2wgPSB7fTtcbiAgICB0aGlzLmJsb2JzID0ge307XG4gICAgdGhpcy5zdGFnZWQgPSB7fTtcbiAgICB0aGlzLnN0YWdlZExpbmsgPSBbXTtcbiAgICB0aGlzLnJlbW90ZSA9IHt9O1xuICAgIHRoaXMuY29tbWl0cyA9IFtdO1xuICAgIHRoaXMucmVtb3RlSW5kZXggPSAtMTtcblxuICB9XG5cbiAgZ2V0Q29tbWl0IChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCAhPT0gdW5kZWZpbmVkID8gaWR4IDogdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIHRoaXMuY29tbWl0c1tpZHhdIHx8IHt9O1xuXG4gIH1cblxuICBzZXRSZW1vdGVJbmRleCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggIT09IHVuZGVmaW5lZCA/IGlkeCA6IHRoaXMuY29tbWl0cy5sZW5ndGggLSAxO1xuICAgIHRoaXMucmVtb3RlSW5kZXggPSBpZHg7XG5cbiAgfVxuXG4gIHJtIChyZXNvdXJjZSkge1xuXG4gICAgaWYoXy5pc0FycmF5KHJlc291cmNlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKHJlc291cmNlLCByZXNvdXJjZSA9PiB0aGlzLnJtKHJlc291cmNlKSk7XG4gICAgfVxuXG4gICAgbGV0IHJpZCA9IHJlc291cmNlLnJpZDtcblxuICAgIHRoaXMuc3RhZ2VkW3JpZF0gPSBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3JpZF07XG5cbiAgfVxuXG4gIGFkZCAocmVzb3VyY2UpIHtcblxuICAgIGlmKF8uaXNBcnJheShyZXNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChyZXNvdXJjZSwgcmVzb3VyY2UgPT4gdGhpcy5hZGQocmVzb3VyY2UpKTtcbiAgICB9XG5cbiAgICBsZXQgcmlkID0gcmVzb3VyY2UucmlkO1xuXG4gICAgaWYgKCF0aGlzLnBvb2xbcmlkXSkge1xuICAgICAgdGhpcy5wb29sW3JpZF0gPSByZXNvdXJjZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YWdlZFtyaWRdID0gcmVzb3VyY2Uuc2VyaWFsaXplKCk7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmlkXTtcblxuICB9XG5cbiAgcm1MaW5rYWdlIChyZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uKFxuICAgICAgJ3JlbW92ZScsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIGFkZExpbmthZ2UgKHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykge1xuXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24oXG4gICAgICAnYWRkJywgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKTtcblxuICB9XG5cbiAgX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24gKG9wLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpIHtcblxuICAgIGlmKF8uaXNBcnJheShsaW5rYWdlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKGxpbmthZ2UsIGxpbmthZ2UgPT4gdGhpcy5fY3JlYXRlTGlua2FnZU9wZXJhdGlvbihcbiAgICAgICAgb3AsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykpO1xuICAgIH1cblxuICAgIGxldCBzdGFnZWQgPSB7XG4gICAgICBvcCxcbiAgICAgIHJlc291cmNlLFxuICAgICAgcmVsYXRpb24sXG4gICAgICBsaW5rYWdlLFxuICAgICAgb3B0aW9uc1xuICAgIH07XG5cbiAgICB0aGlzLnN0YWdlZExpbmsucHVzaChzdGFnZWQpO1xuXG4gICAgcmV0dXJuIHN0YWdlZDtcblxuICB9XG5cbiAgZ2V0U3RhZ2VkIChyZXNvdXJjZSkge1xuXG4gICAgaWYgKCF0aGlzLmlzU3RhZ2VkKHJlc291cmNlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoYGNhbiBub3QgZmluZCAke3Jlc291cmNlfWApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyZXNvdXJjZS5yaWRdO1xuXG4gIH1cblxuICBpc1N0YWdlZCAocmVzb3VyY2UpIHtcblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyZXNvdXJjZS5yaWRdICE9PSB1bmRlZmluZWQ7XG5cbiAgfVxuXG4gIGNvbW1pdCAoKSB7XG5cbiAgICBsZXQgbGFzdENvbW1pdCA9IHRoaXMuZ2V0Q29tbWl0KCk7XG5cbiAgICBsZXQgbmV3Q29tbWl0ID0gXy5yZWR1Y2UodGhpcy5zdGFnZWQsIChjb21taXQsIHNlcmlhbGl6ZWQsIHJpZCkgPT4ge1xuICAgICAgaWYgKCFzZXJpYWxpemVkKSB7XG4gICAgICAgIGlmIChjb21taXRbcmlkXSkge1xuICAgICAgICAgIGRlbGV0ZSBjb21taXRbcmlkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbW1pdFtyaWRdID0gdGhpcy5fY3JlYXRlQmxvYihzZXJpYWxpemVkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb21taXQ7XG4gICAgfSwgXy5jbG9uZShsYXN0Q29tbWl0LCB0cnVlKSk7XG5cbiAgICBfLnJlZHVjZSh0aGlzLnN0YWdlZExpbmssIChjb21taXQsIGxpbmtPcGVyYXRpb24pID0+IHtcbiAgICAgIGNvbW1pdFt1dWlkLnY0KCldID0gbGlua09wZXJhdGlvbjtcbiAgICAgIHJldHVybiBjb21taXQ7XG4gICAgfSwgbmV3Q29tbWl0KTtcblxuICAgIHRoaXMuY29tbWl0cy5wdXNoKG5ld0NvbW1pdCk7XG4gICAgdGhpcy5zdGFnZWQgPSB7fTtcbiAgICB0aGlzLnN0YWdlZExpbmsgPSB7fTtcblxuICB9XG5cbiAgYWRkUmVtb3RlICh0eXBlLCB1cmwpIHtcblxuICAgIHRoaXMucmVtb3RlW3R5cGVdID0gdXJsO1xuXG4gIH1cblxuICBnZXRSZW1vdGUgKHR5cGUsIGlkLCByZWxhdGlvbikge1xuXG4gICAgbGV0IHVybFBhcnRzID0gXy5jb21wYWN0KFtcbiAgICAgIHRoaXMucmVtb3RlW3R5cGVdLFxuICAgICAgaWQsXG4gICAgICByZWxhdGlvbiA/ICdsaW5rcycgOiB1bmRlZmluZWQsXG4gICAgICByZWxhdGlvblxuICAgIF0pO1xuICAgIHJldHVybiB1cmxKb2luLmFwcGx5KG51bGwsIHVybFBhcnRzKTtcblxuICB9XG5cbiAgZ2V0ICh0eXBlLCBpZCkge1xuXG4gICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLnBvb2wsIHJlc291cmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc291cmNlLmdldCgndHlwZScpID09PSB0eXBlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF8uZmluZCh0aGlzLnBvb2wsIHJlc291cmNlID0+IHtcbiAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoJ3R5cGUnKSA9PT0gdHlwZSAmJlxuICAgICAgICByZXNvdXJjZS5nZXQoJ2lkJykgPT09IGlkO1xuICAgIH0pO1xuXG4gIH1cblxuICBoYXMgKHR5cGUsIGlkKSB7XG5cbiAgICByZXR1cm4gISFfLmZpbmQodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCd0eXBlJykgPT09IHR5cGUgJiZcbiAgICAgICAgcmVzb3VyY2UuZ2V0KCdpZCcpID09PSBpZDtcbiAgICB9KTtcblxuICB9XG5cbiAgX2NyZWF0ZUJsb2IgKHNlcmlhbGl6ZWQpIHtcblxuICAgIGxldCBiaWQgPSB1dWlkLnY0KCk7XG4gICAgdGhpcy5ibG9ic1tiaWRdID0gXy5jbG9uZShzZXJpYWxpemVkLCB0cnVlKTtcbiAgICByZXR1cm4gdGhpcy5ibG9ic1tiaWRdO1xuXG4gIH1cblxuICBfZ2V0QmxvYiAoYmlkKSB7XG5cbiAgICByZXR1cm4gdGhpcy5ibG9ic1tiaWRdO1xuXG4gIH1cblxuICBwdWxsQnlMaW5rIChsaW5rLCBvcHRpb25zKSB7XG5cbiAgICBsZXQgdXJsO1xuICAgIGlmIChfLmlzU3RyaW5nKGxpbmspKSB7XG4gICAgICB1cmwgPSBsaW5rO1xuICAgIH1cbiAgICBlbHNlIGlmIChsaW5rLmxpbmthZ2UpIHtcbiAgICAgIHVybCA9IHRoaXMuZ2V0UmVtb3RlKGxpbmsubGlua2FnZS50eXBlLCBsaW5rLmxpbmthZ2UuaWQpO1xuICAgIH1cbiAgICBlbHNlIGlmIChsaW5rLnJlbGF0ZWQpIHtcbiAgICAgIHVybCA9IGxpbmsucmVsYXRlZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgbGluay4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wdWxsQnlVUkwodXJsLCBvcHRpb25zKTtcblxuICB9XG5cbiAgcHVsbCAodHlwZSwgaWQsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiB0aGlzLnB1bGxCeVVSTCh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCksIG9wdGlvbnMpO1xuXG4gIH1cblxuICBwdWxsQnlVUkwgKHVybCwgb3B0aW9ucykge1xuXG4gICAgaWYgKCFfLmlzRW1wdHkodGhpcy5zdGFnZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3B1bGwgd2hlbiBzdGFnZWQgY2hhbmdlIGlzIG5vdCBleGlzdCcpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN5bmMuZ2V0KHVybCwgb3B0aW9ucylcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICB9KTtcblxuICB9XG5cbiAgcHVzaCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggfHwgdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG5cbiAgICBpZiAoaWR4IDw9IHRoaXMucmVtb3RlSW5kZXgpIHtcbiAgICAgIHJldHVybiBRKCk7XG4gICAgfVxuXG4gICAgbGV0IGFmdGVyQ29tbWl0ID0gdGhpcy5nZXRDb21taXQoaWR4KTtcbiAgICBsZXQgYmVmb3JlQ29tbWl0ID0gdGhpcy5nZXRDb21taXQodGhpcy5yZW1vdGVJbmRleCk7XG5cbiAgICBsZXQgcmVtb3ZlZCA9IF8uZGlmZmVyZW5jZShcbiAgICAgIF8ua2V5cyhiZWZvcmVDb21taXQpLFxuICAgICAgXy5rZXlzKGFmdGVyQ29tbWl0KVxuICAgICk7XG5cbiAgICBsZXQgY2hhbmdlZE9yQWRkZWQgPSBfLndpdGhvdXQoXG4gICAgICBfLmtleXMoYWZ0ZXJDb21taXQpLFxuICAgICAgXy5rZXlzKHJlbW92ZWQpXG4gICAgKTtcblxuICAgIGxldCBkZWxldGVSZXF1ZXN0ID0gXy5tYXAocmVtb3ZlZCwgcmlkID0+IHtcbiAgICAgIC8vIGlzIExpbmtcbiAgICAgIGlmICghdGhpcy5wb29sW3JpZF0pIHsgcmV0dXJuOyB9XG5cbiAgICAgIGxldCB0eXBlID0gdGhpcy5wb29sW3JpZF0uZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ2lkJyk7XG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5kZWxldGUodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnBvb2xbcmlkXTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBwb3N0T3JQYXRjaFJlcXVlc3QgPSBfLm1hcChjaGFuZ2VkT3JBZGRlZCwgcmlkID0+IHtcbiAgICAgIC8vIGlzIExpbmtcbiAgICAgIGlmICghdGhpcy5wb29sW3JpZF0pIHsgcmV0dXJuOyB9XG4gICAgICAvLyBub3QgY2hhbmdlXG4gICAgICBpZiAoXy5pc0VxdWFsKGFmdGVyQ29tbWl0W3JpZF0sIGJlZm9yZUNvbW1pdFtyaWRdKSkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ3R5cGUnKTtcbiAgICAgIGxldCBpZCA9IHRoaXMucG9vbFtyaWRdLmdldCgnaWQnKTtcbiAgICAgIGxldCBibG9iID0gYWZ0ZXJDb21taXRbcmlkXTtcblxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMucGF0Y2godGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvUmVxdWVzdChibG9iKSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB0aGlzLl9zYXZlUmVzcG9uc2UocmVzcG9uc2UsIHJpZCkpO1xuICAgICAgfVxuICAgICAgaWYgKCFpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBvc3QodGhpcy5nZXRSZW1vdGUodHlwZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90b1JlcXVlc3QoYmxvYikpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlLCByaWQpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBsaW5rT3BlcmF0aW9uUmVxdWVzdCA9IF8ubWFwKGFmdGVyQ29tbWl0LCAoc3RhZ2VkLCByaWQpID0+IHtcbiAgICAgIC8vIGlzIHJlc291cmNlXG4gICAgICBpZiAodGhpcy5wb29sW3JpZF0gfHwgIXN0YWdlZC5vcCkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSBzdGFnZWQucmVzb3VyY2UuZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSBzdGFnZWQucmVzb3VyY2UuZ2V0KCdpZCcpO1xuICAgICAgbGV0IG9wdGlvbnMgPSBfLmRlZmF1bHRzKHN0YWdlZC5vcHRpb25zIHx8IHt9LCB7XG4gICAgICAgIGhhc01hbnk6IHRydWVcbiAgICAgIH0pO1xuICAgICAgbGV0IG9wID0gc3RhZ2VkLm9wO1xuICAgICAgbGV0IHJlbGF0aW9uID0gc3RhZ2VkLnJlbGF0aW9uO1xuICAgICAgbGV0IGxpbmthZ2UgPSBzdGFnZWQubGlua2FnZTtcbiAgICAgIGxldCByZXF1ZXN0Qm9keSA9IG9wdGlvbnMuaGFzTWFueSA/XG4gICAgICAgIHsgZGF0YTogW2xpbmthZ2VdIH0gOiB7IGRhdGE6IGxpbmthZ2UgfTtcblxuICAgICAgaWYgKG9wID09PSAnYWRkJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBvc3QodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQsIHJlbGF0aW9uKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5KVxuICAgICAgICAgIC50aGVuKCgpID0+IHJlcXVlc3RCb2R5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wID09PSAncmVtb3ZlJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLmRlbGV0ZSh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCwgcmVsYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHkpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gcmVxdWVzdEJvZHkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuYWxsKGRlbGV0ZVJlcXVlc3QuY29uY2F0KHBvc3RPclBhdGNoUmVxdWVzdCkpXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5zZXRSZW1vdGVJbmRleCgpO1xuICAgIH0pO1xuXG4gIH1cblxuICBfc2F2ZVJlc3BvbnNlIChyZXNwb25zZSwgcmlkKSB7XG5cbiAgICByZXR1cm4gdGhpcy5fc2F2ZURhdGEodGhpcy5fZnJvbVJlc3BvbnNlKHJlc3BvbnNlKSwgcmlkKTtcblxuICB9XG5cbiAgX3NhdmVEYXRhIChkYXRhLCByaWQpIHtcblxuICAgIGlmIChfLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChkYXRhLCBkYXRhID0+IHRoaXMuX3NhdmVEYXRhKGRhdGEpKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzb3VyY2UgPSByaWQgIT09IHVuZGVmaW5lZCA/XG4gICAgICB0aGlzLnBvb2xbcmlkXSA6IHRoaXMuZ2V0KGRhdGEudHlwZSwgZGF0YS5pZCk7XG5cbiAgICBpZiAoIXJlc291cmNlKSB7XG4gICAgICByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZShkYXRhKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXNvdXJjZS5kZXNlcmlhbGl6ZShkYXRhKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhZ2VkQmFja3VwID0gXy5jbG9uZSh0aGlzLnN0YWdlZCwgdHJ1ZSk7XG5cbiAgICB0aGlzLmFkZChyZXNvdXJjZSk7XG4gICAgdGhpcy5jb21taXQoKTtcbiAgICB0aGlzLnNldFJlbW90ZUluZGV4KCk7XG5cbiAgICB0aGlzLnN0YWdlZCA9IHN0YWdlZEJhY2t1cDtcblxuICAgIHJldHVybiByZXNvdXJjZTtcblxuICB9XG5cbiAgX3RvUmVxdWVzdCAoc2VyaWFsaXplZCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IHNlcmlhbGl6ZWRcbiAgICB9O1xuXG4gIH1cblxuICBfZnJvbVJlc3BvbnNlIChyZXNwb25zZSkge1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUG9vbDtcbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgUmVzcG9uc2UgZnJvbSAnLi9SZXNwb25zZSc7XG5cblxubGV0IHN0cmluZ2lmeVJlcXVpcmVkTWV0aG9kID0gZnVuY3Rpb24gKG1ldGhvZCkge1xuICAvLyB0aGVzZSBIVFRQIG1ldGhvZHMgcmVxdWlyZXMgSlNPTi5zdHJpbmdpZnlcbiAgcmV0dXJuICgvXihQT1NUfFBVVHxQQVRDSHxERUxFVEUpJC8udGVzdChtZXRob2QudG9VcHBlckNhc2UoKSkpO1xufTtcblxubGV0IG1ha2VBamF4UmVxdWVzdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgaWYgKHN0cmluZ2lmeVJlcXVpcmVkTWV0aG9kKG9wdGlvbnMudHlwZSkpIHtcbiAgICBpZiAob3B0aW9ucy5jb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbicpIHtcbiAgICAgIG9wdGlvbnMuZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL3dpa2kvQ29taW5nLWZyb20talF1ZXJ5XG4gIHJldHVybiBRLnByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICQuYWpheChvcHRpb25zKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZmFpbChmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZWplY3QocmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH0pO1xuXG59O1xuXG5cblxubGV0IFJFU1RmdWwgPSB7XG5cbiAgaGVhZDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJIRUFEXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGdldDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcG9zdDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHB1dDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQVVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcGF0Y2g6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUEFUQ0hcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZGVsZXRlOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkRFTEVURVwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBkZWZhdWx0T3B0aW9uczoge1xuXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nLFxuICAgIHByb2Nlc3NEYXRhOiB0cnVlXG5cbiAgfSxcblxuICBhamF4U2V0dXA6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICAkLmFqYXhTZXR1cChvcHRpb25zKTtcblxuICB9XG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJFU1RmdWw7XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHV1aWQgZnJvbSAnbm9kZS11dWlkJztcblxuXG5jbGFzcyBSZXNvdXJjZSB7XG5cbiAgY29uc3RydWN0b3IoYXR0cmlidXRlcykge1xuXG4gICAgdGhpcy5hdHRyaWJ1dGVzID0ge307XG4gICAgdGhpcy5saW5rcyA9IHt9O1xuICAgIHRoaXMucmlkID0gdXVpZC52NCgpO1xuXG4gICAgdGhpcy5kZXNlcmlhbGl6ZShhdHRyaWJ1dGVzKTtcblxuICB9XG5cbiAgZ2V0IChrZXkpIHtcblxuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNba2V5XTtcblxuICB9XG5cbiAgc2V0IChhdHRyaWJ1dGVzKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xuXG4gIH1cblxuICB1bnNldCAoa2V5KSB7XG5cbiAgICBkZWxldGUgdGhpcy5hdHRyaWJ1dGVzW2tleV07XG5cbiAgfVxuXG4gIGdldExpbmsgKGtleSkge1xuXG4gICAga2V5ID0ga2V5IHx8ICdzZWxmJztcbiAgICByZXR1cm4gdGhpcy5saW5rc1trZXldO1xuXG4gIH1cblxuICBzZXRMaW5rIChsaW5rcykge1xuXG4gICAgXy5leHRlbmQodGhpcy5saW5rcywgbGlua3MpO1xuXG4gIH1cblxuICB1bnNldExpbmsgKGtleSkge1xuXG4gICAgZGVsZXRlIHRoaXMubGlua3Nba2V5XTtcblxuICB9XG5cbiAgZ2V0TGlua2FnZSAoKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogdGhpcy5hdHRyaWJ1dGVzLnR5cGUsXG4gICAgICBpZDogdGhpcy5hdHRyaWJ1dGVzLmlkXG4gICAgfTtcblxuICB9XG5cbiAgc2VyaWFsaXplICgpIHtcblxuICAgIGxldCByZXN1bHQgPSBfLmNsb25lKHRoaXMuYXR0cmlidXRlcywgdHJ1ZSk7XG4gICAgcmVzdWx0LmxpbmtzID0gdGhpcy5saW5rcztcblxuICAgIGlmIChfLmlzRW1wdHkocmVzdWx0LmxpbmtzKSkge1xuICAgICAgZGVsZXRlIHJlc3VsdC5saW5rcztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIH1cblxuICBkZXNlcmlhbGl6ZSAoc2VyaWFsaXplZCkge1xuXG4gICAgaWYgKCF0aGlzLl92YWxpZGF0ZVNlcmlhbGl6ZWQoc2VyaWFsaXplZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBkYXRhISB0eXBlIHNob3VsZCBiZSBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KF8uY2xvbmUoXy5vbWl0KHNlcmlhbGl6ZWQsICdsaW5rcycpLCB0cnVlKSk7XG4gICAgdGhpcy5zZXRMaW5rKHNlcmlhbGl6ZWQubGlua3MpO1xuXG4gIH1cblxuICBjbG9uZSAoKSB7XG5cbiAgICBsZXQgcmVzb3VyY2UgPSBuZXcgUmVzb3VyY2UodGhpcy5zZXJpYWxpemUoKSk7XG4gICAgcmVzb3VyY2UudXVpZCA9IHRoaXMudXVpZDtcbiAgICByZXR1cm4gcmVzb3VyY2U7XG5cbiAgfVxuXG4gIF92YWxpZGF0ZVNlcmlhbGl6ZWQgKHNlcmlhbGl6ZWQpIHtcblxuICAgIHJldHVybiBzZXJpYWxpemVkICYmIHNlcmlhbGl6ZWQudHlwZTtcblxuICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZTtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cblxubGV0IF92YWxpZGF0ZVJlc3BvbnNlID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGxldCBib2R5ID0geGhyLnJlc3BvbnNlSlNPTjtcblxuICBpZiAoYm9keS5kYXRhID09PSB1bmRlZmluZWQgJiYgYm9keS5lcnJvcnMgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkEgZG9jdW1lbnQgTVVTVCBjb250YWluIGVpdGhlciBwcmltYXJ5IGRhdGEgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcIm9yIGFuIGFycmF5IG9mIGVycm9yIG9iamVjdHMuXCIpO1xuICB9XG5cbn07XG5cblxubGV0IF9pc1Jlc3BvbnNlRXJyb3IgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XG5cbiAgcmV0dXJuIDQwMCA8PSBzdGF0dXMgJiYgNjAwID4gc3RhdHVzIDtcblxufTtcblxuXG5sZXQgX3BhcnNlRGF0YSA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBpZiAoIXhoci5yZXNwb25zZUpTT04pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4geGhyLnJlc3BvbnNlSlNPTi5kYXRhO1xuXG59O1xuXG5cbmxldCBfcGFyc2VFcnJvcnMgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgaWYgKCEoeGhyLnJlc3BvbnNlSlNPTiAmJiB4aHIucmVzcG9uc2VKU09OLmVycm9ycyApKSB7XG4gICAgaWYgKF9pc1Jlc3BvbnNlRXJyb3IoeGhyLnN0YXR1cykpIHtcbiAgICAgIHJldHVybiBbe1xuICAgICAgICBzdGF0dXM6IFwiXCIgKyB4aHIuc3RhdHVzXG4gICAgICB9XTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgZXJyb3JzID0geGhyLnJlc3BvbnNlSlNPTi5lcnJvcnM7XG5cbiAgcmV0dXJuIF8ubWFwKGVycm9ycywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgcmV0dXJuIF8uZXh0ZW5kKHtcbiAgICAgIHN0YXR1czogXCJcIiArIHhoci5zdGF0dXNcbiAgICB9LCBlcnJvcik7XG4gIH0pO1xuXG59O1xuXG5cbmxldCBfcGFyc2VIZWFkZXJzID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGxldCByZXN1bHQgPSBbXTtcblxuICBsZXQgaGVhZGVyUmVnZXggPSAvXiguKj8pOlsgXFx0XSooW15cXHJcXG5dKikkL21nO1xuICBsZXQgaGVhZGVyc1N0cmluZyA9IHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKTtcbiAgbGV0IGZpbmRSZXN1bHQ7XG5cbiAgd2hpbGUgKChmaW5kUmVzdWx0ID0gaGVhZGVyUmVnZXguZXhlYyhoZWFkZXJzU3RyaW5nKSkgIT09IG51bGwpIHtcbiAgICByZXN1bHQucHVzaChmaW5kUmVzdWx0LnNsaWNlKDEpKTtcbiAgfVxuXG4gIHJldHVybiBfLm9iamVjdChyZXN1bHQpO1xuXG59O1xuXG5cbmNsYXNzIFJlc3BvbnNlIHtcblxuICBjb25zdHJ1Y3RvciAoeGhyKSB7XG5cbiAgICB0aGlzLnJlc3BvbnNlSlNPTiA9IHhoci5yZXNwb25zZUpTT047XG4gICAgdGhpcy5kYXRhID0gX3BhcnNlRGF0YSh4aHIpO1xuICAgIHRoaXMuZXJyb3JzID0gX3BhcnNlRXJyb3JzKHhocik7XG4gICAgdGhpcy5oZWFkZXJzID0gX3BhcnNlSGVhZGVycyh4aHIpO1xuICAgIHRoaXMubmF0aXZlWEhSID0geGhyO1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zZTtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcblxuXG5jbGFzcyBUcmFuc2FjdGlvbiB7XG5cbiAgY29uc3RydWN0b3IocG9vbCwgb3B0aW9ucykge1xuXG4gICAgXy5leHRlbmQodGhpcywgRXZlbnRzKTtcbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMucG9vbCA9IHBvb2w7XG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG5cbiAgfVxuXG4gIGJlZ2luICgpIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuX2FjdGl2YXRlKCk7XG5cbiAgfVxuXG4gIGNvbW1pdCAoKSB7XG5cbiAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XG5cbiAgfVxuXG5cbiAgX2FjdGl2YXRlICgpIHtcblxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gIH1cblxuICBfZGVhY3RpdmF0ZSAoKSB7XG5cbiAgICB0aGlzLnN0b3BMaXN0ZW5pbmcodGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICB9XG5cbiAgb25UcmFuc2Zvcm0gKG9wZXJhdGlvbikge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zLnB1c2gob3BlcmF0aW9uKTtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHJhbnNhY3Rpb247XG4iXX0=
