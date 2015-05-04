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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9pbmRleC5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9Qb29sLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvbGliL1JFU1RmdWwuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvUmVzb3VyY2UuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvUmVzcG9uc2UuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvVHJhbnNhY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsZ0JBQWdCOzs7O29CQUNwQixZQUFZOzs7O3VCQUNULGVBQWU7Ozs7MkJBQ1gsbUJBQW1COzs7O1FBSXpDLFdBQVc7UUFDWCxRQUFRO1FBQ1IsSUFBSTtRQUNKLE9BQU87Ozs7Ozs7Ozs7Ozs7OztzQkNWSyxRQUFROzs7O2lCQUNSLEdBQUc7Ozs7dUJBQ0csVUFBVTs7OztvQkFDYixXQUFXOzs7O3dCQUNQLFlBQVk7Ozs7dUJBQ2IsV0FBVzs7OztJQUd6QixJQUFJO0FBRUksV0FGUixJQUFJLENBRUssT0FBTyxFQUFFOzBCQUZsQixJQUFJOztBQUlOLFFBQUksQ0FBQyxJQUFJLHVCQUFVLENBQUM7QUFDcEIsUUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0dBRWpCOztlQVBHLElBQUk7O1dBU0Msb0JBQUc7O0FBRVYsVUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZixVQUFJLENBQUMsS0FBSyxHQUFH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N0QsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FFckI7OztXQUVXLHFCQUFDLFNBQVMsRUFBRTs7QUFFdEIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FFakM7OztTQTVDRyxXQUFXOzs7cUJBZ0RGLFdBQVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlc291cmNlIGZyb20gJy4vbGliL1Jlc291cmNlJztcbmltcG9ydCBQb29sIGZyb20gJy4vbGliL1Bvb2wnO1xuaW1wb3J0IFJFU1RmdWwgZnJvbSAnLi9saWIvUkVTVGZ1bCc7XG5pbXBvcnQgVHJhbnNhY3Rpb24gZnJvbSAnLi9saWIvVHJhbnNhY3Rpb24nO1xuXG5cbmV4cG9ydCB7XG4gIFRyYW5zYWN0aW9uLFxuICBSZXNvdXJjZSxcbiAgUG9vbCxcbiAgUkVTVGZ1bFxufTtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB1cmxKb2luIGZyb20gJ3VybC1qb2luJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9SZXNvdXJjZSc7XG5pbXBvcnQgUkVTVGZ1bCBmcm9tICcuL1JFU1RmdWwnO1xuXG5cbmNsYXNzIFBvb2wge1xuXG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG5cbiAgICB0aGlzLnN5bmMgPSBSRVNUZnVsO1xuICAgIHRoaXMucmVzZXRBbGwoKTtcblxuICB9XG5cbiAgcmVzZXRBbGwgKCkge1xuXG4gICAgdGhpcy5wb29sID0ge307XG4gICAgdGhpcy5ibG9icyA9IHt9O1xuICAgIHRoaXMuc3RhZ2VkID0ge307XG4gICAgdGhpcy5zdGFnZWRMaW5rID0gW107XG4gICAgdGhpcy5yZW1vdGUgPSB7fTtcbiAgICB0aGlzLmNvbW1pdHMgPSBbXTtcbiAgICB0aGlzLnJlbW90ZUluZGV4ID0gLTE7XG5cbiAgfVxuXG4gIGdldENvbW1pdCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggIT09IHVuZGVmaW5lZCA/IGlkeCA6IHRoaXMuY29tbWl0cy5sZW5ndGggLSAxO1xuICAgIHJldHVybiB0aGlzLmNvbW1pdHNbaWR4XSB8fCB7fTtcblxuICB9XG5cbiAgc2V0UmVtb3RlSW5kZXggKGlkeCkge1xuXG4gICAgaWR4ID0gaWR4ICE9PSB1bmRlZmluZWQgPyBpZHggOiB0aGlzLmNvbW1pdHMubGVuZ3RoIC0gMTtcbiAgICB0aGlzLnJlbW90ZUluZGV4ID0gaWR4O1xuXG4gIH1cblxuICBybSAocmVzb3VyY2UpIHtcblxuICAgIGlmKF8uaXNBcnJheShyZXNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChyZXNvdXJjZSwgcmVzb3VyY2UgPT4gdGhpcy5ybShyZXNvdXJjZSkpO1xuICAgIH1cblxuICAgIGxldCByaWQgPSByZXNvdXJjZS5yaWQ7XG5cbiAgICB0aGlzLnN0YWdlZFtyaWRdID0gbnVsbDtcblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyaWRdO1xuXG4gIH1cblxuICBhZGQgKHJlc291cmNlKSB7XG5cbiAgICBpZihfLmlzQXJyYXkocmVzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gXy5tYXAocmVzb3VyY2UsIHJlc291cmNlID0+IHRoaXMuYWRkKHJlc291cmNlKSk7XG4gICAgfVxuXG4gICAgbGV0IHJpZCA9IHJlc291cmNlLnJpZDtcblxuICAgIGlmICghdGhpcy5wb29sW3JpZF0pIHtcbiAgICAgIHRoaXMucG9vbFtyaWRdID0gcmVzb3VyY2U7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFnZWRbcmlkXSA9IHJlc291cmNlLnNlcmlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3JpZF07XG5cbiAgfVxuXG4gIHJtTGlua2FnZSAocmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSB7XG5cbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlTGlua2FnZU9wZXJhdGlvbihcbiAgICAgICdyZW1vdmUnLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpO1xuXG4gIH1cblxuICBhZGRMaW5rYWdlIChyZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uKFxuICAgICAgJ2FkZCcsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIF9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uIChvcCwgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSB7XG5cbiAgICBpZihfLmlzQXJyYXkobGlua2FnZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChsaW5rYWdlLCBsaW5rYWdlID0+IHRoaXMuX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24oXG4gICAgICAgIG9wLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhZ2VkID0ge1xuICAgICAgb3AsXG4gICAgICByZXNvdXJjZSxcbiAgICAgIHJlbGF0aW9uLFxuICAgICAgbGlua2FnZSxcbiAgICAgIG9wdGlvbnNcbiAgICB9O1xuXG4gICAgdGhpcy5zdGFnZWRMaW5rLnB1c2goc3RhZ2VkKTtcblxuICAgIHJldHVybiBzdGFnZWQ7XG5cbiAgfVxuXG4gIGdldFN0YWdlZCAocmVzb3VyY2UpIHtcblxuICAgIGlmICghdGhpcy5pc1N0YWdlZChyZXNvdXJjZSkpIHtcbiAgICAgIHRocm93IEVycm9yKGBjYW4gbm90IGZpbmQgJHtyZXNvdXJjZX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmVzb3VyY2UucmlkXTtcblxuICB9XG5cbiAgaXNTdGFnZWQgKHJlc291cmNlKSB7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmVzb3VyY2UucmlkXSAhPT0gdW5kZWZpbmVkO1xuXG4gIH1cblxuICBjb21taXQgKCkge1xuXG4gICAgbGV0IGxhc3RDb21taXQgPSB0aGlzLmdldENvbW1pdCgpO1xuXG4gICAgbGV0IG5ld0NvbW1pdCA9IF8ucmVkdWNlKHRoaXMuc3RhZ2VkLCAoY29tbWl0LCBzZXJpYWxpemVkLCByaWQpID0+IHtcbiAgICAgIGlmICghc2VyaWFsaXplZCkge1xuICAgICAgICBpZiAoY29tbWl0W3JpZF0pIHtcbiAgICAgICAgICBkZWxldGUgY29tbWl0W3JpZF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjb21taXRbcmlkXSA9IHRoaXMuX2NyZWF0ZUJsb2Ioc2VyaWFsaXplZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29tbWl0O1xuICAgIH0sIF8uY2xvbmUobGFzdENvbW1pdCwgdHJ1ZSkpO1xuXG4gICAgXy5yZWR1Y2UodGhpcy5zdGFnZWRMaW5rLCAoY29tbWl0LCBsaW5rT3BlcmF0aW9uKSA9PiB7XG4gICAgICBjb21taXRbdXVpZC52NCgpXSA9IGxpbmtPcGVyYXRpb247XG4gICAgICByZXR1cm4gY29tbWl0O1xuICAgIH0sIG5ld0NvbW1pdCk7XG5cbiAgICB0aGlzLmNvbW1pdHMucHVzaChuZXdDb21taXQpO1xuICAgIHRoaXMuc3RhZ2VkID0ge307XG5cbiAgfVxuXG4gIGFkZFJlbW90ZSAodHlwZSwgdXJsKSB7XG5cbiAgICB0aGlzLnJlbW90ZVt0eXBlXSA9IHVybDtcblxuICB9XG5cbiAgZ2V0UmVtb3RlICh0eXBlLCBpZCwgcmVsYXRpb24pIHtcblxuICAgIGxldCB1cmxQYXJ0cyA9IF8uY29tcGFjdChbXG4gICAgICB0aGlzLnJlbW90ZVt0eXBlXSxcbiAgICAgIGlkLFxuICAgICAgcmVsYXRpb24gPyAnbGlua3MnIDogdW5kZWZpbmVkLFxuICAgICAgcmVsYXRpb25cbiAgICBdKTtcbiAgICByZXR1cm4gdXJsSm9pbi5hcHBseShudWxsLCB1cmxQYXJ0cyk7XG5cbiAgfVxuXG4gIGdldCAodHlwZSwgaWQpIHtcblxuICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoJ3R5cGUnKSA9PT0gdHlwZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBfLmZpbmQodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCd0eXBlJykgPT09IHR5cGUgJiZcbiAgICAgICAgcmVzb3VyY2UuZ2V0KCdpZCcpID09PSBpZDtcbiAgICB9KTtcblxuICB9XG5cbiAgaGFzICh0eXBlLCBpZCkge1xuXG4gICAgcmV0dXJuICEhXy5maW5kKHRoaXMucG9vbCwgcmVzb3VyY2UgPT4ge1xuICAgICAgcmV0dXJuIHJlc291cmNlLmdldCgndHlwZScpID09PSB0eXBlICYmXG4gICAgICAgIHJlc291cmNlLmdldCgnaWQnKSA9PT0gaWQ7XG4gICAgfSk7XG5cbiAgfVxuXG4gIF9jcmVhdGVCbG9iIChzZXJpYWxpemVkKSB7XG5cbiAgICBsZXQgYmlkID0gdXVpZC52NCgpO1xuICAgIHRoaXMuYmxvYnNbYmlkXSA9IF8uY2xvbmUoc2VyaWFsaXplZCwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXMuYmxvYnNbYmlkXTtcblxuICB9XG5cbiAgX2dldEJsb2IgKGJpZCkge1xuXG4gICAgcmV0dXJuIHRoaXMuYmxvYnNbYmlkXTtcblxuICB9XG5cbiAgcHVsbEJ5TGluayAobGluaywgb3B0aW9ucykge1xuXG4gICAgbGV0IHVybDtcbiAgICBpZiAoXy5pc1N0cmluZyhsaW5rKSkge1xuICAgICAgdXJsID0gbGluaztcbiAgICB9XG4gICAgZWxzZSBpZiAobGluay5saW5rYWdlKSB7XG4gICAgICB1cmwgPSB0aGlzLmdldFJlbW90ZShsaW5rLmxpbmthZ2UudHlwZSwgbGluay5saW5rYWdlLmlkKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobGluay5yZWxhdGVkKSB7XG4gICAgICB1cmwgPSBsaW5rLnJlbGF0ZWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGxpbmsuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHVsbEJ5VVJMKHVybCwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIHB1bGwgKHR5cGUsIGlkLCBvcHRpb25zKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wdWxsQnlVUkwodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpLCBvcHRpb25zKTtcblxuICB9XG5cbiAgcHVsbEJ5VVJMICh1cmwsIG9wdGlvbnMpIHtcblxuICAgIGlmICghXy5pc0VtcHR5KHRoaXMuc3RhZ2VkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwdWxsIHdoZW4gc3RhZ2VkIGNoYW5nZSBpcyBub3QgZXhpc3QnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zeW5jLmdldCh1cmwsIG9wdGlvbnMpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX3NhdmVSZXNwb25zZShyZXNwb25zZSk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHB1c2ggKGlkeCkge1xuXG4gICAgaWR4ID0gaWR4IHx8IHRoaXMuY29tbWl0cy5sZW5ndGggLSAxO1xuXG4gICAgaWYgKGlkeCA8PSB0aGlzLnJlbW90ZUluZGV4KSB7XG4gICAgICByZXR1cm4gUSgpO1xuICAgIH1cblxuICAgIGxldCBhZnRlckNvbW1pdCA9IHRoaXMuZ2V0Q29tbWl0KGlkeCk7XG4gICAgbGV0IGJlZm9yZUNvbW1pdCA9IHRoaXMuZ2V0Q29tbWl0KHRoaXMucmVtb3RlSW5kZXgpO1xuXG4gICAgbGV0IHJlbW92ZWQgPSBfLmRpZmZlcmVuY2UoXG4gICAgICBfLmtleXMoYmVmb3JlQ29tbWl0KSxcbiAgICAgIF8ua2V5cyhhZnRlckNvbW1pdClcbiAgICApO1xuXG4gICAgbGV0IGNoYW5nZWRPckFkZGVkID0gXy53aXRob3V0KFxuICAgICAgXy5rZXlzKGFmdGVyQ29tbWl0KSxcbiAgICAgIF8ua2V5cyhyZW1vdmVkKVxuICAgICk7XG5cbiAgICBsZXQgZGVsZXRlUmVxdWVzdCA9IF8ubWFwKHJlbW92ZWQsIHJpZCA9PiB7XG4gICAgICAvLyBpcyBMaW5rXG4gICAgICBpZiAoIXRoaXMucG9vbFtyaWRdKSB7IHJldHVybjsgfVxuXG4gICAgICBsZXQgdHlwZSA9IHRoaXMucG9vbFtyaWRdLmdldCgndHlwZScpO1xuICAgICAgbGV0IGlkID0gdGhpcy5wb29sW3JpZF0uZ2V0KCdpZCcpO1xuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMuZGVsZXRlKHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkKSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5wb29sW3JpZF07XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgcG9zdE9yUGF0Y2hSZXF1ZXN0ID0gXy5tYXAoY2hhbmdlZE9yQWRkZWQsIHJpZCA9PiB7XG4gICAgICAvLyBpcyBMaW5rXG4gICAgICBpZiAoIXRoaXMucG9vbFtyaWRdKSB7IHJldHVybjsgfVxuXG4gICAgICBsZXQgdHlwZSA9IHRoaXMucG9vbFtyaWRdLmdldCgndHlwZScpO1xuICAgICAgbGV0IGlkID0gdGhpcy5wb29sW3JpZF0uZ2V0KCdpZCcpO1xuICAgICAgbGV0IGJsb2IgPSBhZnRlckNvbW1pdFtyaWRdO1xuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMucGF0Y2godGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvUmVxdWVzdChibG9iKSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB0aGlzLl9zYXZlUmVzcG9uc2UocmVzcG9uc2UsIHJpZCkpO1xuICAgICAgfVxuICAgICAgaWYgKCFpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBvc3QodGhpcy5nZXRSZW1vdGUodHlwZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90b1JlcXVlc3QoYmxvYikpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlLCByaWQpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBsaW5rT3BlcmF0aW9uUmVxdWVzdCA9IF8ubWFwKGFmdGVyQ29tbWl0LCAoc3RhZ2VkLCByaWQpID0+IHtcbiAgICAgIC8vIGlzIHJlc291cmNlXG4gICAgICBpZiAodGhpcy5wb29sW3JpZF0gfHwgIXN0YWdlZC5vcCkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSBzdGFnZWQucmVzb3VyY2UuZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSBzdGFnZWQucmVzb3VyY2UuZ2V0KCdpZCcpO1xuICAgICAgbGV0IG9wdGlvbnMgPSBfLmRlZmF1bHRzKHN0YWdlZC5vcHRpb25zIHx8IHt9LCB7XG4gICAgICAgIGhhc01hbnk6IHRydWVcbiAgICAgIH0pO1xuICAgICAgbGV0IG9wID0gc3RhZ2VkLm9wO1xuICAgICAgbGV0IHJlbGF0aW9uID0gc3RhZ2VkLnJlbGF0aW9uO1xuICAgICAgbGV0IGxpbmthZ2UgPSBzdGFnZWQubGlua2FnZTtcbiAgICAgIGxldCByZXF1ZXN0Qm9keSA9IG9wdGlvbnMuaGFzTWFueSA/XG4gICAgICAgIHsgZGF0YTogW2xpbmthZ2VdIH0gOiB7IGRhdGE6IGxpbmthZ2UgfTtcblxuICAgICAgaWYgKG9wID09PSAnYWRkJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBvc3QodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQsIHJlbGF0aW9uKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5KVxuICAgICAgICAgIC50aGVuKCgpID0+IHJlcXVlc3RCb2R5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wID09PSAncmVtb3ZlJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLmRlbGV0ZSh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCwgcmVsYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHkpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gcmVxdWVzdEJvZHkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuYWxsKGRlbGV0ZVJlcXVlc3QuY29uY2F0KHBvc3RPclBhdGNoUmVxdWVzdCkpXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5zZXRSZW1vdGVJbmRleCgpO1xuICAgIH0pO1xuXG4gIH1cblxuICBfc2F2ZVJlc3BvbnNlIChyZXNwb25zZSwgcmlkKSB7XG5cbiAgICByZXR1cm4gdGhpcy5fc2F2ZURhdGEodGhpcy5fZnJvbVJlc3BvbnNlKHJlc3BvbnNlKSwgcmlkKTtcblxuICB9XG5cbiAgX3NhdmVEYXRhIChkYXRhLCByaWQpIHtcblxuICAgIGlmIChfLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChkYXRhLCBkYXRhID0+IHRoaXMuX3NhdmVEYXRhKGRhdGEpKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzb3VyY2UgPSByaWQgIT09IHVuZGVmaW5lZCA/XG4gICAgICB0aGlzLnBvb2xbcmlkXSA6IHRoaXMuZ2V0KGRhdGEudHlwZSwgZGF0YS5pZCk7XG5cbiAgICBpZiAoIXJlc291cmNlKSB7XG4gICAgICByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZShkYXRhKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXNvdXJjZS5kZXNlcmlhbGl6ZShkYXRhKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhZ2VkQmFja3VwID0gXy5jbG9uZSh0aGlzLnN0YWdlZCwgdHJ1ZSk7XG5cbiAgICB0aGlzLmFkZChyZXNvdXJjZSk7XG4gICAgdGhpcy5jb21taXQoKTtcbiAgICB0aGlzLnNldFJlbW90ZUluZGV4KCk7XG5cbiAgICB0aGlzLnN0YWdlZCA9IHN0YWdlZEJhY2t1cDtcblxuICAgIHJldHVybiByZXNvdXJjZTtcblxuICB9XG5cbiAgX3RvUmVxdWVzdCAoc2VyaWFsaXplZCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IHNlcmlhbGl6ZWRcbiAgICB9O1xuXG4gIH1cblxuICBfZnJvbVJlc3BvbnNlIChyZXNwb25zZSkge1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUG9vbDtcbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgUmVzcG9uc2UgZnJvbSAnLi9SZXNwb25zZSc7XG5cblxubGV0IHN0cmluZ2lmeVJlcXVpcmVkTWV0aG9kID0gZnVuY3Rpb24gKG1ldGhvZCkge1xuICAvLyB0aGVzZSBIVFRQIG1ldGhvZHMgcmVxdWlyZXMgSlNPTi5zdHJpbmdpZnlcbiAgcmV0dXJuICgvXihQT1NUfFBVVHxQQVRDSHxERUxFVEUpJC8udGVzdChtZXRob2QudG9VcHBlckNhc2UoKSkpO1xufTtcblxubGV0IG1ha2VBamF4UmVxdWVzdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgaWYgKHN0cmluZ2lmeVJlcXVpcmVkTWV0aG9kKG9wdGlvbnMudHlwZSkpIHtcbiAgICBpZiAob3B0aW9ucy5jb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbicpIHtcbiAgICAgIG9wdGlvbnMuZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL3dpa2kvQ29taW5nLWZyb20talF1ZXJ5XG4gIHJldHVybiBRLnByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICQuYWpheChvcHRpb25zKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZmFpbChmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZWplY3QocmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH0pO1xuXG59O1xuXG5cblxubGV0IFJFU1RmdWwgPSB7XG5cbiAgaGVhZDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJIRUFEXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGdldDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcG9zdDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHB1dDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQVVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcGF0Y2g6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUEFUQ0hcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZGVsZXRlOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkRFTEVURVwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBkZWZhdWx0T3B0aW9uczoge1xuXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nLFxuICAgIHByb2Nlc3NEYXRhOiB0cnVlXG5cbiAgfVxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBSRVNUZnVsO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5cblxuY2xhc3MgUmVzb3VyY2Uge1xuXG4gIGNvbnN0cnVjdG9yKGF0dHJpYnV0ZXMpIHtcblxuICAgIHRoaXMuYXR0cmlidXRlcyA9IHt9O1xuICAgIHRoaXMubGlua3MgPSB7fTtcbiAgICB0aGlzLnJpZCA9IHV1aWQudjQoKTtcblxuICAgIHRoaXMuZGVzZXJpYWxpemUoYXR0cmlidXRlcyk7XG5cbiAgfVxuXG4gIGdldCAoa2V5KSB7XG5cbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2tleV07XG5cbiAgfVxuXG4gIHNldCAoYXR0cmlidXRlcykge1xuXG4gICAgXy5leHRlbmQodGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcblxuICB9XG5cbiAgdW5zZXQgKGtleSkge1xuXG4gICAgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1trZXldO1xuXG4gIH1cblxuICBnZXRMaW5rIChrZXkpIHtcblxuICAgIGtleSA9IGtleSB8fCAnc2VsZic7XG4gICAgcmV0dXJuIHRoaXMubGlua3Nba2V5XTtcblxuICB9XG5cbiAgc2V0TGluayAobGlua3MpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMubGlua3MsIGxpbmtzKTtcblxuICB9XG5cbiAgdW5zZXRMaW5rIChrZXkpIHtcblxuICAgIGRlbGV0ZSB0aGlzLmxpbmtzW2tleV07XG5cbiAgfVxuXG4gIGdldExpbmthZ2UgKCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHRoaXMuYXR0cmlidXRlcy50eXBlLFxuICAgICAgaWQ6IHRoaXMuYXR0cmlidXRlcy5pZFxuICAgIH07XG5cbiAgfVxuXG4gIHNlcmlhbGl6ZSAoKSB7XG5cbiAgICBsZXQgcmVzdWx0ID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMsIHRydWUpO1xuICAgIHJlc3VsdC5saW5rcyA9IHRoaXMubGlua3M7XG5cbiAgICBpZiAoXy5pc0VtcHR5KHJlc3VsdC5saW5rcykpIHtcbiAgICAgIGRlbGV0ZSByZXN1bHQubGlua3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcblxuICB9XG5cbiAgZGVzZXJpYWxpemUgKHNlcmlhbGl6ZWQpIHtcblxuICAgIGlmICghdGhpcy5fdmFsaWRhdGVTZXJpYWxpemVkKHNlcmlhbGl6ZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZGF0YSEgdHlwZSBzaG91bGQgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldChfLmNsb25lKF8ub21pdChzZXJpYWxpemVkLCAnbGlua3MnKSwgdHJ1ZSkpO1xuICAgIHRoaXMuc2V0TGluayhzZXJpYWxpemVkLmxpbmtzKTtcblxuICB9XG5cbiAgY2xvbmUgKCkge1xuXG4gICAgbGV0IHJlc291cmNlID0gbmV3IFJlc291cmNlKHRoaXMuc2VyaWFsaXplKCkpO1xuICAgIHJlc291cmNlLnV1aWQgPSB0aGlzLnV1aWQ7XG4gICAgcmV0dXJuIHJlc291cmNlO1xuXG4gIH1cblxuICBfdmFsaWRhdGVTZXJpYWxpemVkIChzZXJpYWxpemVkKSB7XG5cbiAgICByZXR1cm4gc2VyaWFsaXplZCAmJiBzZXJpYWxpemVkLnR5cGU7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2U7XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5cbmxldCBfdmFsaWRhdGVSZXNwb25zZSA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgYm9keSA9IHhoci5yZXNwb25zZUpTT047XG5cbiAgaWYgKGJvZHkuZGF0YSA9PT0gdW5kZWZpbmVkICYmIGJvZHkuZXJyb3JzID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGRvY3VtZW50IE1VU1QgY29udGFpbiBlaXRoZXIgcHJpbWFyeSBkYXRhIFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJvciBhbiBhcnJheSBvZiBlcnJvciBvYmplY3RzLlwiKTtcbiAgfVxuXG59O1xuXG5cbmxldCBfaXNSZXNwb25zZUVycm9yID0gZnVuY3Rpb24gKHN0YXR1cykge1xuXG4gIHJldHVybiA0MDAgPD0gc3RhdHVzICYmIDYwMCA+IHN0YXR1cyA7XG5cbn07XG5cblxubGV0IF9wYXJzZURhdGEgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgaWYgKCF4aHIucmVzcG9uc2VKU09OKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHhoci5yZXNwb25zZUpTT04uZGF0YTtcblxufTtcblxuXG5sZXQgX3BhcnNlRXJyb3JzID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICghKHhoci5yZXNwb25zZUpTT04gJiYgeGhyLnJlc3BvbnNlSlNPTi5lcnJvcnMgKSkge1xuICAgIGlmIChfaXNSZXNwb25zZUVycm9yKHhoci5zdGF0dXMpKSB7XG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgICAgfV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGVycm9ycyA9IHhoci5yZXNwb25zZUpTT04uZXJyb3JzO1xuXG4gIHJldHVybiBfLm1hcChlcnJvcnMsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHJldHVybiBfLmV4dGVuZCh7XG4gICAgICBzdGF0dXM6IFwiXCIgKyB4aHIuc3RhdHVzXG4gICAgfSwgZXJyb3IpO1xuICB9KTtcblxufTtcblxuXG5sZXQgX3BhcnNlSGVhZGVycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgbGV0IGhlYWRlclJlZ2V4ID0gL14oLio/KTpbIFxcdF0qKFteXFxyXFxuXSopJC9tZztcbiAgbGV0IGhlYWRlcnNTdHJpbmcgPSB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCk7XG4gIGxldCBmaW5kUmVzdWx0O1xuXG4gIHdoaWxlICgoZmluZFJlc3VsdCA9IGhlYWRlclJlZ2V4LmV4ZWMoaGVhZGVyc1N0cmluZykpICE9PSBudWxsKSB7XG4gICAgcmVzdWx0LnB1c2goZmluZFJlc3VsdC5zbGljZSgxKSk7XG4gIH1cblxuICByZXR1cm4gXy5vYmplY3QocmVzdWx0KTtcblxufTtcblxuXG5jbGFzcyBSZXNwb25zZSB7XG5cbiAgY29uc3RydWN0b3IgKHhocikge1xuXG4gICAgdGhpcy5yZXNwb25zZUpTT04gPSB4aHIucmVzcG9uc2VKU09OO1xuICAgIHRoaXMuZGF0YSA9IF9wYXJzZURhdGEoeGhyKTtcbiAgICB0aGlzLmVycm9ycyA9IF9wYXJzZUVycm9ycyh4aHIpO1xuICAgIHRoaXMuaGVhZGVycyA9IF9wYXJzZUhlYWRlcnMoeGhyKTtcbiAgICB0aGlzLm5hdGl2ZVhIUiA9IHhocjtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2U7XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tICdiYWNrYm9uZSc7XG5cblxuY2xhc3MgVHJhbnNhY3Rpb24ge1xuXG4gIGNvbnN0cnVjdG9yKHBvb2wsIG9wdGlvbnMpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMsIEV2ZW50cyk7XG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLnBvb2wgPSBwb29sO1xuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuXG4gIH1cblxuICBiZWdpbiAoKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcbiAgICB0aGlzLl9hY3RpdmF0ZSgpO1xuXG4gIH1cblxuICBjb21taXQgKCkge1xuXG4gICAgdGhpcy5fZGVhY3RpdmF0ZSgpO1xuXG4gIH1cblxuXG4gIF9hY3RpdmF0ZSAoKSB7XG5cbiAgICB0aGlzLmxpc3RlblRvKHRoaXMucG9vbCwgJ3RyYW5zZm9ybScsIHRoaXMub25UcmFuc2Zvcm0pO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcblxuICB9XG5cbiAgX2RlYWN0aXZhdGUgKCkge1xuXG4gICAgdGhpcy5zdG9wTGlzdGVuaW5nKHRoaXMucG9vbCwgJ3RyYW5zZm9ybScsIHRoaXMub25UcmFuc2Zvcm0pO1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgfVxuXG4gIG9uVHJhbnNmb3JtIChvcGVyYXRpb24pIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucy5wdXNoKG9wZXJhdGlvbik7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zYWN0aW9uO1xuIl19
