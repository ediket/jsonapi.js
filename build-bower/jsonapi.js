(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JSONAPI = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Resource = require('./lib/Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _Pool = require('./lib/Pool');

var _Pool2 = _interopRequireDefault(_Pool);

var _RESTful = require('./lib/RESTful');

var _RESTful2 = _interopRequireDefault(_RESTful);

var _Transaction = require('./lib/Transaction');

var _Transaction2 = _interopRequireDefault(_Transaction);

exports.Transaction = _Transaction2['default'];
exports.Resource = _Resource2['default'];
exports.Pool = _Pool2['default'];
exports.RESTful = _RESTful2['default'];

},{"./lib/Pool":2,"./lib/RESTful":3,"./lib/Resource":4,"./lib/Transaction":6}],2:[function(require,module,exports){
'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _Q = require('q');

var _Q2 = _interopRequireDefault(_Q);

var _urlJoin = require('url-join');

var _urlJoin2 = _interopRequireDefault(_urlJoin);

var _uuid = require('node-uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _Resource = require('./Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _RESTful = require('./RESTful');

var _RESTful2 = _interopRequireDefault(_RESTful);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _$ = require('jquery');

var _$2 = _interopRequireDefault(_$);

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _Q = require('q');

var _Q2 = _interopRequireDefault(_Q);

var _Response = require('./Response');

var _Response2 = _interopRequireDefault(_Response);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _uuid = require('node-uuid');

var _uuid2 = _interopRequireDefault(_uuid);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _import = require("lodash");

var _import2 = _interopRequireDefault(_import);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _Q = require('q');

var _Q2 = _interopRequireDefault(_Q);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvanVuZ3dvb2xlZS9qc29uYXBpLmpzL2luZGV4LmpzIiwiL1VzZXJzL2p1bmd3b29sZWUvanNvbmFwaS5qcy9saWIvUG9vbC5qcyIsIi9Vc2Vycy9qdW5nd29vbGVlL2pzb25hcGkuanMvbGliL1JFU1RmdWwuanMiLCIvVXNlcnMvanVuZ3dvb2xlZS9qc29uYXBpLmpzL2xpYi9SZXNvdXJjZS5qcyIsIi9Vc2Vycy9qdW5nd29vbGVlL2pzb25hcGkuanMvbGliL1Jlc3BvbnNlLmpzIiwiL1VzZXJzL2p1bmd3b29sZWUvanNvbmFwaS5qcy9saWIvVHJhbnNhY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsZ0JBQWdCOzs7O29CQUNwQixZQUFZOzs7O3VCQUNULGVBQWU7Ozs7MkJBQ1gsbUJBQW1COzs7O1FBSXpDLFdBQVc7UUFDWCxRQUFRO1FBQ1IsSUFBSTtRQUNKLE9BQU87Ozs7Ozs7Ozs7Ozs7OztzQkNWSyxRQUFROzs7O2lCQUNSLEdBQUc7Ozs7dUJBQ0csVUFBVTs7OztvQkFDYixXQUFXOzs7O3dCQUNQLFlBQVk7Ozs7dUJBQ2IsV0FBVzs7OztJQUd6QixJQUFJO0FBRUksV0FGUixJQUFJLENBRUssT0FBTyxFQUFFOzBCQUZsQixJQUFJOztBQUlOLFFBQUksQ0FBQyxJQUFJLHVCQUFVLENBQUM7QUFDcEIsUUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0dBRWpCOztlQVBHLElBQUk7O1dBU0Msb0JBQUc7O0FBRVYsVUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZixVQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNoQixVQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQixVQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUNyQixVQUFJLENB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QUcsS0FBSyxDQUFDO0tBRXJCOzs7V0FFVyxxQkFBQyxTQUFTLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBRWpDOzs7U0E1Q0csV0FBVzs7O3FCQWdERixXQUFXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBSZXNvdXJjZSBmcm9tICcuL2xpYi9SZXNvdXJjZSc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL2xpYi9Qb29sJztcbmltcG9ydCBSRVNUZnVsIGZyb20gJy4vbGliL1JFU1RmdWwnO1xuaW1wb3J0IFRyYW5zYWN0aW9uIGZyb20gJy4vbGliL1RyYW5zYWN0aW9uJztcblxuXG5leHBvcnQge1xuICBUcmFuc2FjdGlvbixcbiAgUmVzb3VyY2UsXG4gIFBvb2wsXG4gIFJFU1RmdWxcbn07XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgdXJsSm9pbiBmcm9tICd1cmwtam9pbic7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xuaW1wb3J0IFJFU1RmdWwgZnJvbSAnLi9SRVNUZnVsJztcblxuXG5jbGFzcyBQb29sIHtcblxuICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuXG4gICAgdGhpcy5zeW5jID0gUkVTVGZ1bDtcbiAgICB0aGlzLnJlc2V0QWxsKCk7XG5cbiAgfVxuXG4gIHJlc2V0QWxsICgpIHtcblxuICAgIHRoaXMucG9vbCA9IHt9O1xuICAgIHRoaXMuYmxvYnMgPSB7fTtcbiAgICB0aGlzLnN0YWdlZCA9IHt9O1xuICAgIHRoaXMuc3RhZ2VkTGluayA9IFtdO1xuICAgIHRoaXMucmVtb3RlID0ge307XG4gICAgdGhpcy5jb21taXRzID0gW107XG4gICAgdGhpcy5yZW1vdGVJbmRleCA9IC0xO1xuXG4gIH1cblxuICBnZXRDb21taXQgKGlkeCkge1xuXG4gICAgaWR4ID0gaWR4ICE9PSB1bmRlZmluZWQgPyBpZHggOiB0aGlzLmNvbW1pdHMubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gdGhpcy5jb21taXRzW2lkeF0gfHwge307XG5cbiAgfVxuXG4gIHNldFJlbW90ZUluZGV4IChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCAhPT0gdW5kZWZpbmVkID8gaWR4IDogdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG4gICAgdGhpcy5yZW1vdGVJbmRleCA9IGlkeDtcblxuICB9XG5cbiAgcm0gKHJlc291cmNlKSB7XG5cbiAgICBpZihfLmlzQXJyYXkocmVzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gXy5tYXAocmVzb3VyY2UsIHJlc291cmNlID0+IHRoaXMucm0ocmVzb3VyY2UpKTtcbiAgICB9XG5cbiAgICBsZXQgcmlkID0gcmVzb3VyY2UucmlkO1xuXG4gICAgdGhpcy5zdGFnZWRbcmlkXSA9IG51bGw7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmlkXTtcblxuICB9XG5cbiAgYWRkIChyZXNvdXJjZSkge1xuXG4gICAgaWYoXy5pc0FycmF5KHJlc291cmNlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKHJlc291cmNlLCByZXNvdXJjZSA9PiB0aGlzLmFkZChyZXNvdXJjZSkpO1xuICAgIH1cblxuICAgIGxldCByaWQgPSByZXNvdXJjZS5yaWQ7XG5cbiAgICBpZiAoIXRoaXMucG9vbFtyaWRdKSB7XG4gICAgICB0aGlzLnBvb2xbcmlkXSA9IHJlc291cmNlO1xuICAgIH1cblxuICAgIHRoaXMuc3RhZ2VkW3JpZF0gPSByZXNvdXJjZS5zZXJpYWxpemUoKTtcblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyaWRdO1xuXG4gIH1cblxuICBybUxpbmthZ2UgKHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykge1xuXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24oXG4gICAgICAncmVtb3ZlJywgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKTtcblxuICB9XG5cbiAgYWRkTGlua2FnZSAocmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSB7XG5cbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlTGlua2FnZU9wZXJhdGlvbihcbiAgICAgICdhZGQnLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpO1xuXG4gIH1cblxuICBfY3JlYXRlTGlua2FnZU9wZXJhdGlvbiAob3AsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykge1xuXG4gICAgaWYoXy5pc0FycmF5KGxpbmthZ2UpKSB7XG4gICAgICByZXR1cm4gXy5tYXAobGlua2FnZSwgbGlua2FnZSA9PiB0aGlzLl9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uKFxuICAgICAgICBvcCwgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSk7XG4gICAgfVxuXG4gICAgbGV0IHN0YWdlZCA9IHtcbiAgICAgIG9wLFxuICAgICAgcmVzb3VyY2UsXG4gICAgICByZWxhdGlvbixcbiAgICAgIGxpbmthZ2UsXG4gICAgICBvcHRpb25zXG4gICAgfTtcblxuICAgIHRoaXMuc3RhZ2VkTGluay5wdXNoKHN0YWdlZCk7XG5cbiAgICByZXR1cm4gc3RhZ2VkO1xuXG4gIH1cblxuICBnZXRTdGFnZWQgKHJlc291cmNlKSB7XG5cbiAgICBpZiAoIXRoaXMuaXNTdGFnZWQocmVzb3VyY2UpKSB7XG4gICAgICB0aHJvdyBFcnJvcihgY2FuIG5vdCBmaW5kICR7cmVzb3VyY2V9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3Jlc291cmNlLnJpZF07XG5cbiAgfVxuXG4gIGlzU3RhZ2VkIChyZXNvdXJjZSkge1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3Jlc291cmNlLnJpZF0gIT09IHVuZGVmaW5lZDtcblxuICB9XG5cbiAgY29tbWl0ICgpIHtcblxuICAgIGxldCBsYXN0Q29tbWl0ID0gdGhpcy5nZXRDb21taXQoKTtcblxuICAgIGxldCBuZXdDb21taXQgPSBfLnJlZHVjZSh0aGlzLnN0YWdlZCwgKGNvbW1pdCwgc2VyaWFsaXplZCwgcmlkKSA9PiB7XG4gICAgICBpZiAoIXNlcmlhbGl6ZWQpIHtcbiAgICAgICAgaWYgKGNvbW1pdFtyaWRdKSB7XG4gICAgICAgICAgZGVsZXRlIGNvbW1pdFtyaWRdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY29tbWl0W3JpZF0gPSB0aGlzLl9jcmVhdGVCbG9iKHNlcmlhbGl6ZWQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbW1pdDtcbiAgICB9LCBfLmNsb25lKGxhc3RDb21taXQsIHRydWUpKTtcblxuICAgIF8ucmVkdWNlKHRoaXMuc3RhZ2VkTGluaywgKGNvbW1pdCwgbGlua09wZXJhdGlvbikgPT4ge1xuICAgICAgY29tbWl0W3V1aWQudjQoKV0gPSBsaW5rT3BlcmF0aW9uO1xuICAgICAgcmV0dXJuIGNvbW1pdDtcbiAgICB9LCBuZXdDb21taXQpO1xuXG4gICAgdGhpcy5jb21taXRzLnB1c2gobmV3Q29tbWl0KTtcbiAgICB0aGlzLnN0YWdlZCA9IHt9O1xuXG4gIH1cblxuICBhZGRSZW1vdGUgKHR5cGUsIHVybCkge1xuXG4gICAgdGhpcy5yZW1vdGVbdHlwZV0gPSB1cmw7XG5cbiAgfVxuXG4gIGdldFJlbW90ZSAodHlwZSwgaWQsIHJlbGF0aW9uKSB7XG5cbiAgICBsZXQgdXJsUGFydHMgPSBfLmNvbXBhY3QoW1xuICAgICAgdGhpcy5yZW1vdGVbdHlwZV0sXG4gICAgICBpZCxcbiAgICAgIHJlbGF0aW9uID8gJ2xpbmtzJyA6IHVuZGVmaW5lZCxcbiAgICAgIHJlbGF0aW9uXG4gICAgXSk7XG4gICAgcmV0dXJuIHVybEpvaW4uYXBwbHkobnVsbCwgdXJsUGFydHMpO1xuXG4gIH1cblxuICBnZXQgKHR5cGUsIGlkKSB7XG5cbiAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIF8uZmlsdGVyKHRoaXMucG9vbCwgcmVzb3VyY2UgPT4ge1xuICAgICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCd0eXBlJykgPT09IHR5cGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gXy5maW5kKHRoaXMucG9vbCwgcmVzb3VyY2UgPT4ge1xuICAgICAgcmV0dXJuIHJlc291cmNlLmdldCgndHlwZScpID09PSB0eXBlICYmXG4gICAgICAgIHJlc291cmNlLmdldCgnaWQnKSA9PT0gaWQ7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGhhcyAodHlwZSwgaWQpIHtcblxuICAgIHJldHVybiAhIV8uZmluZCh0aGlzLnBvb2wsIHJlc291cmNlID0+IHtcbiAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoJ3R5cGUnKSA9PT0gdHlwZSAmJlxuICAgICAgICByZXNvdXJjZS5nZXQoJ2lkJykgPT09IGlkO1xuICAgIH0pO1xuXG4gIH1cblxuICBfY3JlYXRlQmxvYiAoc2VyaWFsaXplZCkge1xuXG4gICAgbGV0IGJpZCA9IHV1aWQudjQoKTtcbiAgICB0aGlzLmJsb2JzW2JpZF0gPSBfLmNsb25lKHNlcmlhbGl6ZWQsIHRydWUpO1xuICAgIHJldHVybiB0aGlzLmJsb2JzW2JpZF07XG5cbiAgfVxuXG4gIF9nZXRCbG9iIChiaWQpIHtcblxuICAgIHJldHVybiB0aGlzLmJsb2JzW2JpZF07XG5cbiAgfVxuXG4gIHB1bGxCeUxpbmsgKGxpbmssIG9wdGlvbnMpIHtcblxuICAgIGxldCB1cmw7XG4gICAgaWYgKF8uaXNTdHJpbmcobGluaykpIHtcbiAgICAgIHVybCA9IGxpbms7XG4gICAgfVxuICAgIGVsc2UgaWYgKGxpbmsubGlua2FnZSkge1xuICAgICAgdXJsID0gdGhpcy5nZXRSZW1vdGUobGluay5saW5rYWdlLnR5cGUsIGxpbmsubGlua2FnZS5pZCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGxpbmsucmVsYXRlZCkge1xuICAgICAgdXJsID0gbGluay5yZWxhdGVkO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBsaW5rLicpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnB1bGxCeVVSTCh1cmwsIG9wdGlvbnMpO1xuXG4gIH1cblxuICBwdWxsICh0eXBlLCBpZCwgb3B0aW9ucykge1xuXG4gICAgcmV0dXJuIHRoaXMucHVsbEJ5VVJMKHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkKSwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIHB1bGxCeVVSTCAodXJsLCBvcHRpb25zKSB7XG5cbiAgICBpZiAoIV8uaXNFbXB0eSh0aGlzLnN0YWdlZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncHVsbCB3aGVuIHN0YWdlZCBjaGFuZ2UgaXMgbm90IGV4aXN0Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3luYy5nZXQodXJsLCBvcHRpb25zKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9zYXZlUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgIH0pO1xuXG4gIH1cblxuICBwdXNoIChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCB8fCB0aGlzLmNvbW1pdHMubGVuZ3RoIC0gMTtcblxuICAgIGlmIChpZHggPD0gdGhpcy5yZW1vdGVJbmRleCkge1xuICAgICAgcmV0dXJuIFEoKTtcbiAgICB9XG5cbiAgICBsZXQgYWZ0ZXJDb21taXQgPSB0aGlzLmdldENvbW1pdChpZHgpO1xuICAgIGxldCBiZWZvcmVDb21taXQgPSB0aGlzLmdldENvbW1pdCh0aGlzLnJlbW90ZUluZGV4KTtcblxuICAgIGxldCByZW1vdmVkID0gXy5kaWZmZXJlbmNlKFxuICAgICAgXy5rZXlzKGJlZm9yZUNvbW1pdCksXG4gICAgICBfLmtleXMoYWZ0ZXJDb21taXQpXG4gICAgKTtcblxuICAgIGxldCBjaGFuZ2VkT3JBZGRlZCA9IF8ud2l0aG91dChcbiAgICAgIF8ua2V5cyhhZnRlckNvbW1pdCksXG4gICAgICBfLmtleXMocmVtb3ZlZClcbiAgICApO1xuXG4gICAgbGV0IGRlbGV0ZVJlcXVlc3QgPSBfLm1hcChyZW1vdmVkLCByaWQgPT4ge1xuICAgICAgLy8gaXMgTGlua1xuICAgICAgaWYgKCF0aGlzLnBvb2xbcmlkXSkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ3R5cGUnKTtcbiAgICAgIGxldCBpZCA9IHRoaXMucG9vbFtyaWRdLmdldCgnaWQnKTtcbiAgICAgIGlmIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLmRlbGV0ZSh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMucG9vbFtyaWRdO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHBvc3RPclBhdGNoUmVxdWVzdCA9IF8ubWFwKGNoYW5nZWRPckFkZGVkLCByaWQgPT4ge1xuICAgICAgLy8gaXMgTGlua1xuICAgICAgaWYgKCF0aGlzLnBvb2xbcmlkXSkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ3R5cGUnKTtcbiAgICAgIGxldCBpZCA9IHRoaXMucG9vbFtyaWRdLmdldCgnaWQnKTtcbiAgICAgIGxldCBibG9iID0gYWZ0ZXJDb21taXRbcmlkXTtcbiAgICAgIGlmIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBhdGNoKHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90b1JlcXVlc3QoYmxvYikpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlLCByaWQpKTtcbiAgICAgIH1cbiAgICAgIGlmICghaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5wb3N0KHRoaXMuZ2V0UmVtb3RlKHR5cGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9SZXF1ZXN0KGJsb2IpKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHRoaXMuX3NhdmVSZXNwb25zZShyZXNwb25zZSwgcmlkKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgbGlua09wZXJhdGlvblJlcXVlc3QgPSBfLm1hcChhZnRlckNvbW1pdCwgKHN0YWdlZCwgcmlkKSA9PiB7XG4gICAgICAvLyBpcyByZXNvdXJjZVxuICAgICAgaWYgKHRoaXMucG9vbFtyaWRdIHx8ICFzdGFnZWQub3ApIHsgcmV0dXJuOyB9XG5cbiAgICAgIGxldCB0eXBlID0gc3RhZ2VkLnJlc291cmNlLmdldCgndHlwZScpO1xuICAgICAgbGV0IGlkID0gc3RhZ2VkLnJlc291cmNlLmdldCgnaWQnKTtcbiAgICAgIGxldCBvcHRpb25zID0gXy5kZWZhdWx0cyhzdGFnZWQub3B0aW9ucyB8fCB7fSwge1xuICAgICAgICBoYXNNYW55OiB0cnVlXG4gICAgICB9KTtcbiAgICAgIGxldCBvcCA9IHN0YWdlZC5vcDtcbiAgICAgIGxldCByZWxhdGlvbiA9IHN0YWdlZC5yZWxhdGlvbjtcbiAgICAgIGxldCBsaW5rYWdlID0gc3RhZ2VkLmxpbmthZ2U7XG4gICAgICBsZXQgcmVxdWVzdEJvZHkgPSBvcHRpb25zLmhhc01hbnkgP1xuICAgICAgICB7IGRhdGE6IFtsaW5rYWdlXSB9IDogeyBkYXRhOiBsaW5rYWdlIH07XG5cbiAgICAgIGlmIChvcCA9PT0gJ2FkZCcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5wb3N0KHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkLCByZWxhdGlvbiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0Qm9keSlcbiAgICAgICAgICAudGhlbigoKSA9PiByZXF1ZXN0Qm9keSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcCA9PT0gJ3JlbW92ZScpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5kZWxldGUodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQsIHJlbGF0aW9uKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5KVxuICAgICAgICAgIC50aGVuKCgpID0+IHJlcXVlc3RCb2R5KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBRLmFsbChkZWxldGVSZXF1ZXN0LmNvbmNhdChwb3N0T3JQYXRjaFJlcXVlc3QpKVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0UmVtb3RlSW5kZXgoKTtcbiAgICB9KTtcblxuICB9XG5cbiAgX3NhdmVSZXNwb25zZSAocmVzcG9uc2UsIHJpZCkge1xuXG4gICAgcmV0dXJuIHRoaXMuX3NhdmVEYXRhKHRoaXMuX2Zyb21SZXNwb25zZShyZXNwb25zZSksIHJpZCk7XG5cbiAgfVxuXG4gIF9zYXZlRGF0YSAoZGF0YSwgcmlkKSB7XG5cbiAgICBpZiAoXy5pc0FycmF5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gXy5tYXAoZGF0YSwgZGF0YSA9PiB0aGlzLl9zYXZlRGF0YShkYXRhKSk7XG4gICAgfVxuXG4gICAgbGV0IHJlc291cmNlID0gcmlkICE9PSB1bmRlZmluZWQgP1xuICAgICAgdGhpcy5wb29sW3JpZF0gOiB0aGlzLmdldChkYXRhLnR5cGUsIGRhdGEuaWQpO1xuXG4gICAgaWYgKCFyZXNvdXJjZSkge1xuICAgICAgcmVzb3VyY2UgPSBuZXcgUmVzb3VyY2UoZGF0YSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmVzb3VyY2UuZGVzZXJpYWxpemUoZGF0YSk7XG4gICAgfVxuXG4gICAgbGV0IHN0YWdlZEJhY2t1cCA9IF8uY2xvbmUodGhpcy5zdGFnZWQsIHRydWUpO1xuXG4gICAgdGhpcy5hZGQocmVzb3VyY2UpO1xuICAgIHRoaXMuY29tbWl0KCk7XG4gICAgdGhpcy5zZXRSZW1vdGVJbmRleCgpO1xuXG4gICAgdGhpcy5zdGFnZWQgPSBzdGFnZWRCYWNrdXA7XG5cbiAgICByZXR1cm4gcmVzb3VyY2U7XG5cbiAgfVxuXG4gIF90b1JlcXVlc3QgKHNlcmlhbGl6ZWQpIHtcblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBzZXJpYWxpemVkXG4gICAgfTtcblxuICB9XG5cbiAgX2Zyb21SZXNwb25zZSAocmVzcG9uc2UpIHtcblxuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFBvb2w7XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IFJlc3BvbnNlIGZyb20gJy4vUmVzcG9uc2UnO1xuXG5cbmxldCBzdHJpbmdpZnlSZXF1aXJlZE1ldGhvZCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgLy8gdGhlc2UgSFRUUCBtZXRob2RzIHJlcXVpcmVzIEpTT04uc3RyaW5naWZ5XG4gIHJldHVybiAoL14oUE9TVHxQVVR8UEFUQ0h8REVMRVRFKSQvLnRlc3QobWV0aG9kLnRvVXBwZXJDYXNlKCkpKTtcbn07XG5cbmxldCBtYWtlQWpheFJlcXVlc3QgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGlmIChzdHJpbmdpZnlSZXF1aXJlZE1ldGhvZChvcHRpb25zLnR5cGUpKSB7XG4gICAgaWYgKG9wdGlvbnMuY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi92bmQuYXBpK2pzb24nKSB7XG4gICAgICBvcHRpb25zLmRhdGEgPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLmRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvcS93aWtpL0NvbWluZy1mcm9tLWpRdWVyeVxuICByZXR1cm4gUS5wcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAkLmFqYXgob3B0aW9ucylcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xuICAgICAgICBkZWxldGUganFYSFIudGhlbjsgLy8gdHJlYXQgeGhyIGFzIGEgbm9uLXByb21pc2VcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGpxWEhSKTtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmZhaWwoZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICBkZWxldGUganFYSFIudGhlbjsgLy8gdHJlYXQgeGhyIGFzIGEgbm9uLXByb21pc2VcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGpxWEhSKTtcbiAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgIH0pO1xuICB9KTtcblxufTtcblxuXG5cbmxldCBSRVNUZnVsID0ge1xuXG4gIGhlYWQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiSEVBRFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHBvc3Q6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwdXQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUFVUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHBhdGNoOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBBVENIXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGRlbGV0ZTogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJERUxFVEVcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZGVmYXVsdE9wdGlvbnM6IHtcblxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vdm5kLmFwaStqc29uJyxcbiAgICBwcm9jZXNzRGF0YTogdHJ1ZVxuXG4gIH0sXG5cbiAgYWpheFNldHVwOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gICAgJC5hamF4U2V0dXAob3B0aW9ucyk7XG5cbiAgfVxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBSRVNUZnVsO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5cblxuY2xhc3MgUmVzb3VyY2Uge1xuXG4gIGNvbnN0cnVjdG9yKGF0dHJpYnV0ZXMpIHtcblxuICAgIHRoaXMuYXR0cmlidXRlcyA9IHt9O1xuICAgIHRoaXMubGlua3MgPSB7fTtcbiAgICB0aGlzLnJpZCA9IHV1aWQudjQoKTtcblxuICAgIHRoaXMuZGVzZXJpYWxpemUoYXR0cmlidXRlcyk7XG5cbiAgfVxuXG4gIGdldCAoa2V5KSB7XG5cbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2tleV07XG5cbiAgfVxuXG4gIHNldCAoYXR0cmlidXRlcykge1xuXG4gICAgXy5leHRlbmQodGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcblxuICB9XG5cbiAgdW5zZXQgKGtleSkge1xuXG4gICAgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1trZXldO1xuXG4gIH1cblxuICBnZXRMaW5rIChrZXkpIHtcblxuICAgIGtleSA9IGtleSB8fCAnc2VsZic7XG4gICAgcmV0dXJuIHRoaXMubGlua3Nba2V5XTtcblxuICB9XG5cbiAgc2V0TGluayAobGlua3MpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMubGlua3MsIGxpbmtzKTtcblxuICB9XG5cbiAgdW5zZXRMaW5rIChrZXkpIHtcblxuICAgIGRlbGV0ZSB0aGlzLmxpbmtzW2tleV07XG5cbiAgfVxuXG4gIGdldExpbmthZ2UgKCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHRoaXMuYXR0cmlidXRlcy50eXBlLFxuICAgICAgaWQ6IHRoaXMuYXR0cmlidXRlcy5pZFxuICAgIH07XG5cbiAgfVxuXG4gIHNlcmlhbGl6ZSAoKSB7XG5cbiAgICBsZXQgcmVzdWx0ID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMsIHRydWUpO1xuICAgIHJlc3VsdC5saW5rcyA9IHRoaXMubGlua3M7XG5cbiAgICBpZiAoXy5pc0VtcHR5KHJlc3VsdC5saW5rcykpIHtcbiAgICAgIGRlbGV0ZSByZXN1bHQubGlua3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcblxuICB9XG5cbiAgZGVzZXJpYWxpemUgKHNlcmlhbGl6ZWQpIHtcblxuICAgIGlmICghdGhpcy5fdmFsaWRhdGVTZXJpYWxpemVkKHNlcmlhbGl6ZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZGF0YSEgdHlwZSBzaG91bGQgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldChfLmNsb25lKF8ub21pdChzZXJpYWxpemVkLCAnbGlua3MnKSwgdHJ1ZSkpO1xuICAgIHRoaXMuc2V0TGluayhzZXJpYWxpemVkLmxpbmtzKTtcblxuICB9XG5cbiAgY2xvbmUgKCkge1xuXG4gICAgbGV0IHJlc291cmNlID0gbmV3IFJlc291cmNlKHRoaXMuc2VyaWFsaXplKCkpO1xuICAgIHJlc291cmNlLnV1aWQgPSB0aGlzLnV1aWQ7XG4gICAgcmV0dXJuIHJlc291cmNlO1xuXG4gIH1cblxuICBfdmFsaWRhdGVTZXJpYWxpemVkIChzZXJpYWxpemVkKSB7XG5cbiAgICByZXR1cm4gc2VyaWFsaXplZCAmJiBzZXJpYWxpemVkLnR5cGU7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2U7XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5cbmxldCBfdmFsaWRhdGVSZXNwb25zZSA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgYm9keSA9IHhoci5yZXNwb25zZUpTT047XG5cbiAgaWYgKGJvZHkuZGF0YSA9PT0gdW5kZWZpbmVkICYmIGJvZHkuZXJyb3JzID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGRvY3VtZW50IE1VU1QgY29udGFpbiBlaXRoZXIgcHJpbWFyeSBkYXRhIFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJvciBhbiBhcnJheSBvZiBlcnJvciBvYmplY3RzLlwiKTtcbiAgfVxuXG59O1xuXG5cbmxldCBfaXNSZXNwb25zZUVycm9yID0gZnVuY3Rpb24gKHN0YXR1cykge1xuXG4gIHJldHVybiA0MDAgPD0gc3RhdHVzICYmIDYwMCA+IHN0YXR1cyA7XG5cbn07XG5cblxubGV0IF9wYXJzZURhdGEgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgaWYgKCF4aHIucmVzcG9uc2VKU09OKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHhoci5yZXNwb25zZUpTT04uZGF0YTtcblxufTtcblxuXG5sZXQgX3BhcnNlRXJyb3JzID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICghKHhoci5yZXNwb25zZUpTT04gJiYgeGhyLnJlc3BvbnNlSlNPTi5lcnJvcnMgKSkge1xuICAgIGlmIChfaXNSZXNwb25zZUVycm9yKHhoci5zdGF0dXMpKSB7XG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgICAgfV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGVycm9ycyA9IHhoci5yZXNwb25zZUpTT04uZXJyb3JzO1xuXG4gIHJldHVybiBfLm1hcChlcnJvcnMsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHJldHVybiBfLmV4dGVuZCh7XG4gICAgICBzdGF0dXM6IFwiXCIgKyB4aHIuc3RhdHVzXG4gICAgfSwgZXJyb3IpO1xuICB9KTtcblxufTtcblxuXG5sZXQgX3BhcnNlSGVhZGVycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgbGV0IGhlYWRlclJlZ2V4ID0gL14oLio/KTpbIFxcdF0qKFteXFxyXFxuXSopJC9tZztcbiAgbGV0IGhlYWRlcnNTdHJpbmcgPSB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCk7XG4gIGxldCBmaW5kUmVzdWx0O1xuXG4gIHdoaWxlICgoZmluZFJlc3VsdCA9IGhlYWRlclJlZ2V4LmV4ZWMoaGVhZGVyc1N0cmluZykpICE9PSBudWxsKSB7XG4gICAgcmVzdWx0LnB1c2goZmluZFJlc3VsdC5zbGljZSgxKSk7XG4gIH1cblxuICByZXR1cm4gXy5vYmplY3QocmVzdWx0KTtcblxufTtcblxuXG5jbGFzcyBSZXNwb25zZSB7XG5cbiAgY29uc3RydWN0b3IgKHhocikge1xuXG4gICAgdGhpcy5yZXNwb25zZUpTT04gPSB4aHIucmVzcG9uc2VKU09OO1xuICAgIHRoaXMuZGF0YSA9IF9wYXJzZURhdGEoeGhyKTtcbiAgICB0aGlzLmVycm9ycyA9IF9wYXJzZUVycm9ycyh4aHIpO1xuICAgIHRoaXMuaGVhZGVycyA9IF9wYXJzZUhlYWRlcnMoeGhyKTtcbiAgICB0aGlzLm5hdGl2ZVhIUiA9IHhocjtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2U7XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tICdiYWNrYm9uZSc7XG5cblxuY2xhc3MgVHJhbnNhY3Rpb24ge1xuXG4gIGNvbnN0cnVjdG9yKHBvb2wsIG9wdGlvbnMpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMsIEV2ZW50cyk7XG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLnBvb2wgPSBwb29sO1xuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuXG4gIH1cblxuICBiZWdpbiAoKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcbiAgICB0aGlzLl9hY3RpdmF0ZSgpO1xuXG4gIH1cblxuICBjb21taXQgKCkge1xuXG4gICAgdGhpcy5fZGVhY3RpdmF0ZSgpO1xuXG4gIH1cblxuXG4gIF9hY3RpdmF0ZSAoKSB7XG5cbiAgICB0aGlzLmxpc3RlblRvKHRoaXMucG9vbCwgJ3RyYW5zZm9ybScsIHRoaXMub25UcmFuc2Zvcm0pO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcblxuICB9XG5cbiAgX2RlYWN0aXZhdGUgKCkge1xuXG4gICAgdGhpcy5zdG9wTGlzdGVuaW5nKHRoaXMucG9vbCwgJ3RyYW5zZm9ybScsIHRoaXMub25UcmFuc2Zvcm0pO1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgfVxuXG4gIG9uVHJhbnNmb3JtIChvcGVyYXRpb24pIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucy5wdXNoKG9wZXJhdGlvbik7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zYWN0aW9uO1xuIl19
