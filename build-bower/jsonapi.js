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

    this.resetAll();
  }

  _createClass(Pool, [{
    key: 'sync',
    value: undefined,
    enumerable: true
  }, {
    key: 'resetAll',
    value: function resetAll() {

      this.pool = {};
      this.blobs = {};
      this.staged = {};
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
      var _this3 = this;

      var lastCommit = this.getCommit();

      var newCommit = _import2['default'].reduce(this.staged, function (commit, serialized, rid) {
        if (!serialized) {
          if (commit[rid]) {
            delete commit[rid];
          }
        } else {
          commit[rid] = _this3._createBlob(serialized);
        }
        return commit;
      }, _import2['default'].clone(lastCommit, true));

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
    value: function getRemote(type, id) {

      return _urlJoin2['default'](this.remote[type], id);
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
      var _this4 = this;

      if (!_import2['default'].isEmpty(this.staged)) {
        throw new Error('pull when staged change is not exist');
      }

      return this.sync.get(url, options).then(function (response) {
        return _this4._saveResponse(response);
      });
    }
  }, {
    key: 'push',
    value: function push(idx) {
      var _this5 = this;

      idx = idx || this.commits.length - 1;

      if (idx <= this.remoteIndex) {
        return _Q2['default']();
      }

      var afterCommit = this.getCommit(idx);
      var beforeCommit = this.getCommit(this.remoteIndex);

      var removed = _import2['default'].difference(_import2['default'].keys(beforeCommit), _import2['default'].keys(afterCommit));

      var changedOrAdded = _import2['default'].without(_import2['default'].keys(afterCommit), _import2['default'].keys(removed));

      var deleteRequest = _import2['default'].map(removed, function (rid) {
        var type = _this5.pool[rid].get('type');
        var id = _this5.pool[rid].get('id');
        if (id) {
          return _this5.sync['delete'](_this5.getRemote(type, id)).then(function (response) {});
        }
      });

      var postOrPatchRequest = _import2['default'].map(changedOrAdded, function (rid) {
        var type = _this5.pool[rid].get('type');
        var id = _this5.pool[rid].get('id');
        var blob = afterCommit[rid];
        if (id) {
          return _this5.sync.patch(_this5.getRemote(type, id), _this5._toRequest(blob)).then(function (response) {
            return _this5._saveResponse(response, rid);
          });
        }
        if (!id) {
          return _this5.sync.post(_this5.getRemote(type), _this5._toRequest(blob)).then(function (response) {
            return _this5._saveResponse(response, rid);
          });
        }
      });

      return _Q2['default'].all(deleteRequest.concat(postOrPatchRequest)).then(function () {
        _this5.setRemoteIndex();
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
      var _this6 = this;

      if (_import2['default'].isArray(data)) {
        return _import2['default'].map(data, function (data) {
          return _this6._saveData(data);
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

// delete this.pool[rid];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9pbmRleC5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9Qb29sLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvbGliL1JFU1RmdWwuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvUmVzb3VyY2UuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvUmVzcG9uc2UuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvVHJhbnNhY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsZ0JBQWdCOzs7O29CQUNwQixZQUFZOzs7O3VCQUNULGVBQWU7Ozs7MkJBQ1gsbUJBQW1COzs7O1FBSXpDLFdBQVc7UUFDWCxRQUFRO1FBQ1IsSUFBSTtRQUNKLE9BQU87Ozs7Ozs7Ozs7Ozs7OztzQkNWSyxRQUFROzs7O2lCQUNSLEdBQUc7Ozs7dUJBQ0csVUFBVTs7OztvQkFDYixXQUFXOzs7O3dCQUNQLFlBQVk7Ozs7dUJBQ2IsV0FBVzs7OztJQUd6QixJQUFJO0FBRUksV0FGUixJQUFJLENBRUssT0FBTyxFQUFFOzBCQUZsQixJQUFJOztBQUlOLFFBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztHQUVqQjs7ZUFORyxJQUFJOzs7Ozs7V0FVQyxvQkFBRzs7QUFFVixVQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNmLFVBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxN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QixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztHQUV0Qjs7ZUFWRyxXQUFXOztXQVlULGlCQUFHOztBQUVQLFVBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUVsQjs7O1dBRU0sa0JBQUc7O0FBRVIsVUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBRXBCOzs7V0FHUyxxQkFBRzs7QUFFWCxVQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztLQUVwQjs7O1dBRVcsdUJBQUc7O0FBRWIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDN0QsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FFckI7OztXQUVXLHFCQUFDLFNBQVMsRUFBRTs7QUFFdEIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FFakM7OztTQTVDRyxXQUFXOzs7cUJBZ0RGLFdBQVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlc291cmNlIGZyb20gJy4vbGliL1Jlc291cmNlJztcbmltcG9ydCBQb29sIGZyb20gJy4vbGliL1Bvb2wnO1xuaW1wb3J0IFJFU1RmdWwgZnJvbSAnLi9saWIvUkVTVGZ1bCc7XG5pbXBvcnQgVHJhbnNhY3Rpb24gZnJvbSAnLi9saWIvVHJhbnNhY3Rpb24nO1xuXG5cbmV4cG9ydCB7XG4gIFRyYW5zYWN0aW9uLFxuICBSZXNvdXJjZSxcbiAgUG9vbCxcbiAgUkVTVGZ1bFxufTtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB1cmxKb2luIGZyb20gJ3VybC1qb2luJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9SZXNvdXJjZSc7XG5pbXBvcnQgUkVTVGZ1bCBmcm9tICcuL1JFU1RmdWwnO1xuXG5cbmNsYXNzIFBvb2wge1xuXG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG5cbiAgICB0aGlzLnJlc2V0QWxsKCk7XG5cbiAgfVxuwqBcbiAgc3luYzogUkVTVGZ1bFxuXG4gIHJlc2V0QWxsICgpIHtcblxuICAgIHRoaXMucG9vbCA9IHt9O1xuICAgIHRoaXMuYmxvYnMgPSB7fTtcbiAgICB0aGlzLnN0YWdlZCA9IHt9O1xuICAgIHRoaXMucmVtb3RlID0ge307XG4gICAgdGhpcy5jb21taXRzID0gW107XG4gICAgdGhpcy5yZW1vdGVJbmRleCA9IC0xO1xuXG4gIH1cblxuICBnZXRDb21taXQgKGlkeCkge1xuXG4gICAgaWR4ID0gaWR4ICE9PSB1bmRlZmluZWQgPyBpZHggOiB0aGlzLmNvbW1pdHMubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gdGhpcy5jb21taXRzW2lkeF0gfHwge307XG5cbiAgfVxuXG4gIHNldFJlbW90ZUluZGV4IChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCAhPT0gdW5kZWZpbmVkID8gaWR4IDogdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG4gICAgdGhpcy5yZW1vdGVJbmRleCA9IGlkeDtcblxuICB9XG5cbiAgcm0gKHJlc291cmNlKSB7XG5cbiAgICBpZihfLmlzQXJyYXkocmVzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gXy5tYXAocmVzb3VyY2UsIHJlc291cmNlID0+IHRoaXMucm0ocmVzb3VyY2UpKTtcbiAgICB9XG5cbiAgICBsZXQgcmlkID0gcmVzb3VyY2UucmlkO1xuXG4gICAgdGhpcy5zdGFnZWRbcmlkXSA9IG51bGw7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmlkXTtcblxuICB9XG5cbiAgYWRkIChyZXNvdXJjZSkge1xuXG4gICAgaWYoXy5pc0FycmF5KHJlc291cmNlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKHJlc291cmNlLCByZXNvdXJjZSA9PiB0aGlzLmFkZChyZXNvdXJjZSkpO1xuICAgIH1cblxuICAgIGxldCByaWQgPSByZXNvdXJjZS5yaWQ7XG5cbiAgICBpZiAoIXRoaXMucG9vbFtyaWRdKSB7XG4gICAgICB0aGlzLnBvb2xbcmlkXSA9IHJlc291cmNlO1xuICAgIH1cblxuICAgIHRoaXMuc3RhZ2VkW3JpZF0gPSByZXNvdXJjZS5zZXJpYWxpemUoKTtcblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyaWRdO1xuXG4gIH1cblxuICBnZXRTdGFnZWQgKHJlc291cmNlKSB7XG5cbiAgICBpZiAoIXRoaXMuaXNTdGFnZWQocmVzb3VyY2UpKSB7XG4gICAgICB0aHJvdyBFcnJvcihgY2FuIG5vdCBmaW5kICR7cmVzb3VyY2V9YClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmVzb3VyY2UucmlkXTtcblxuICB9XG5cbiAgaXNTdGFnZWQgKHJlc291cmNlKSB7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmVzb3VyY2UucmlkXSAhPT0gdW5kZWZpbmVkO1xuXG4gIH1cblxuICBjb21taXQgKCkge1xuXG4gICAgbGV0IGxhc3RDb21taXQgPSB0aGlzLmdldENvbW1pdCgpO1xuXG4gICAgbGV0IG5ld0NvbW1pdCA9IF8ucmVkdWNlKHRoaXMuc3RhZ2VkLCAoY29tbWl0LCBzZXJpYWxpemVkLCByaWQpID0+IHtcbiAgICAgIGlmICghc2VyaWFsaXplZCkge1xuICAgICAgICBpZiAoY29tbWl0W3JpZF0pIHtcbiAgICAgICAgICBkZWxldGUgY29tbWl0W3JpZF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjb21taXRbcmlkXSA9IHRoaXMuX2NyZWF0ZUJsb2Ioc2VyaWFsaXplZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29tbWl0XG4gICAgfSwgXy5jbG9uZShsYXN0Q29tbWl0LCB0cnVlKSk7XG5cbiAgICB0aGlzLmNvbW1pdHMucHVzaChuZXdDb21taXQpO1xuICAgIHRoaXMuc3RhZ2VkID0ge307XG5cbiAgfVxuXG4gIGFkZFJlbW90ZSAodHlwZSwgdXJsKSB7XG5cbiAgICB0aGlzLnJlbW90ZVt0eXBlXSA9IHVybDtcblxuICB9XG5cbiAgZ2V0UmVtb3RlICh0eXBlLCBpZCkge1xuXG4gICAgcmV0dXJuIHVybEpvaW4odGhpcy5yZW1vdGVbdHlwZV0sIGlkKTtcblxuICB9XG5cbiAgZ2V0ICh0eXBlLCBpZCkge1xuXG4gICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLnBvb2wsIHJlc291cmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc291cmNlLmdldCgndHlwZScpID09PSB0eXBlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF8uZmluZCh0aGlzLnBvb2wsIHJlc291cmNlID0+IHtcbiAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoJ3R5cGUnKSA9PT0gdHlwZSAmJlxuICAgICAgICByZXNvdXJjZS5nZXQoJ2lkJykgPT09IGlkO1xuICAgIH0pO1xuXG4gIH1cblxuICBoYXMgKHR5cGUsIGlkKSB7XG5cbiAgICByZXR1cm4gISFfLmZpbmQodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCd0eXBlJykgPT09IHR5cGUgJiZcbiAgICAgICAgcmVzb3VyY2UuZ2V0KCdpZCcpID09PSBpZDtcbiAgICB9KTtcblxuICB9XG5cbiAgX2NyZWF0ZUJsb2IgKHNlcmlhbGl6ZWQpIHtcblxuICAgIGxldCBiaWQgPSB1dWlkLnY0KCk7XG4gICAgdGhpcy5ibG9ic1tiaWRdID0gXy5jbG9uZShzZXJpYWxpemVkLCB0cnVlKTtcbiAgICByZXR1cm4gdGhpcy5ibG9ic1tiaWRdO1xuXG4gIH1cblxuICBfZ2V0QmxvYiAoYmlkKSB7XG5cbiAgICByZXR1cm4gdGhpcy5ibG9ic1tiaWRdO1xuXG4gIH1cblxuICBwdWxsQnlMaW5rIChsaW5rLCBvcHRpb25zKSB7XG5cbiAgICBsZXQgdXJsO1xuICAgIGlmIChfLmlzU3RyaW5nKGxpbmspKSB7XG4gICAgICB1cmwgPSBsaW5rO1xuICAgIH1cbiAgICBlbHNlIGlmIChsaW5rLmxpbmthZ2UpIHtcbiAgICAgIHVybCA9IHRoaXMuZ2V0UmVtb3RlKGxpbmsubGlua2FnZS50eXBlLCBsaW5rLmxpbmthZ2UuaWQpO1xuICAgIH1cbiAgICBlbHNlIGlmIChsaW5rLnJlbGF0ZWQpIHtcbiAgICAgIHVybCA9IGxpbmsucmVsYXRlZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgbGluay4nKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnB1bGxCeVVSTCh1cmwsIG9wdGlvbnMpO1xuXG4gIH1cblxuICBwdWxsICh0eXBlLCBpZCwgb3B0aW9ucykge1xuXG4gICAgcmV0dXJuIHRoaXMucHVsbEJ5VVJMKHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkKSwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIHB1bGxCeVVSTCAodXJsLCBvcHRpb25zKSB7XG5cbiAgICBpZiAoIV8uaXNFbXB0eSh0aGlzLnN0YWdlZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncHVsbCB3aGVuIHN0YWdlZCBjaGFuZ2UgaXMgbm90IGV4aXN0Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3luYy5nZXQodXJsLCBvcHRpb25zKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9zYXZlUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgIH0pO1xuXG4gIH1cblxuICBwdXNoIChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCB8fCB0aGlzLmNvbW1pdHMubGVuZ3RoIC0gMTtcblxuICAgIGlmIChpZHggPD0gdGhpcy5yZW1vdGVJbmRleCkge1xuICAgICAgcmV0dXJuIFEoKTtcbiAgICB9XG5cbiAgICBsZXQgYWZ0ZXJDb21taXQgPSB0aGlzLmdldENvbW1pdChpZHgpO1xuICAgIGxldCBiZWZvcmVDb21taXQgPSB0aGlzLmdldENvbW1pdCh0aGlzLnJlbW90ZUluZGV4KTtcblxuICAgIGxldCByZW1vdmVkID0gXy5kaWZmZXJlbmNlKFxuICAgICAgXy5rZXlzKGJlZm9yZUNvbW1pdCksXG4gICAgICBfLmtleXMoYWZ0ZXJDb21taXQpXG4gICAgKTtcblxuICAgIGxldCBjaGFuZ2VkT3JBZGRlZCA9IF8ud2l0aG91dChcbiAgICAgIF8ua2V5cyhhZnRlckNvbW1pdCksXG4gICAgICBfLmtleXMocmVtb3ZlZClcbiAgICApO1xuXG4gICAgbGV0IGRlbGV0ZVJlcXVlc3QgPSBfLm1hcChyZW1vdmVkLCByaWQgPT4ge1xuICAgICAgbGV0IHR5cGUgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ3R5cGUnKTtcbiAgICAgIGxldCBpZCA9IHRoaXMucG9vbFtyaWRdLmdldCgnaWQnKTtcbiAgICAgIGlmIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLmRlbGV0ZSh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgLy8gZGVsZXRlIHRoaXMucG9vbFtyaWRdO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHBvc3RPclBhdGNoUmVxdWVzdCA9IF8ubWFwKGNoYW5nZWRPckFkZGVkLCByaWQgPT4ge1xuICAgICAgbGV0IHR5cGUgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ3R5cGUnKTtcbiAgICAgIGxldCBpZCA9IHRoaXMucG9vbFtyaWRdLmdldCgnaWQnKTtcbiAgICAgIGxldCBibG9iID0gYWZ0ZXJDb21taXRbcmlkXTtcbiAgICAgIGlmIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBhdGNoKHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90b1JlcXVlc3QoYmxvYikpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlLCByaWQpKTtcbiAgICAgIH1cbiAgICAgIGlmICghaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5wb3N0KHRoaXMuZ2V0UmVtb3RlKHR5cGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9SZXF1ZXN0KGJsb2IpKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHRoaXMuX3NhdmVSZXNwb25zZShyZXNwb25zZSwgcmlkKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gUS5hbGwoZGVsZXRlUmVxdWVzdC5jb25jYXQocG9zdE9yUGF0Y2hSZXF1ZXN0KSlcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLnNldFJlbW90ZUluZGV4KCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIF9zYXZlUmVzcG9uc2UgKHJlc3BvbnNlLCByaWQpIHtcblxuICAgIHJldHVybiB0aGlzLl9zYXZlRGF0YSh0aGlzLl9mcm9tUmVzcG9uc2UocmVzcG9uc2UpLCByaWQpO1xuXG4gIH1cblxuICBfc2F2ZURhdGEgKGRhdGEsIHJpZCkge1xuXG4gICAgaWYgKF8uaXNBcnJheShkYXRhKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKGRhdGEsIGRhdGEgPT4gdGhpcy5fc2F2ZURhdGEoZGF0YSkpO1xuICAgIH1cblxuICAgIGxldCByZXNvdXJjZSA9IHJpZCAhPT0gdW5kZWZpbmVkID9cbiAgICAgIHRoaXMucG9vbFtyaWRdIDogdGhpcy5nZXQoZGF0YS50eXBlLCBkYXRhLmlkKTtcblxuICAgIGlmICghcmVzb3VyY2UpIHtcbiAgICAgIHJlc291cmNlID0gbmV3IFJlc291cmNlKGRhdGEpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJlc291cmNlLmRlc2VyaWFsaXplKGRhdGEpO1xuICAgIH1cblxuICAgIGxldCBzdGFnZWRCYWNrdXAgPSBfLmNsb25lKHRoaXMuc3RhZ2VkLCB0cnVlKTtcblxuICAgIHRoaXMuYWRkKHJlc291cmNlKTtcbiAgICB0aGlzLmNvbW1pdCgpO1xuICAgIHRoaXMuc2V0UmVtb3RlSW5kZXgoKTtcblxuICAgIHRoaXMuc3RhZ2VkID0gc3RhZ2VkQmFja3VwO1xuXG4gICAgcmV0dXJuIHJlc291cmNlO1xuXG4gIH1cblxuICBfdG9SZXF1ZXN0IChzZXJpYWxpemVkKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogc2VyaWFsaXplZFxuICAgIH07XG5cbiAgfVxuXG4gIF9mcm9tUmVzcG9uc2UgKHJlc3BvbnNlKSB7XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcblxuICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBQb29sO1xuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCBSZXNwb25zZSBmcm9tICcuL1Jlc3BvbnNlJztcblxuXG5sZXQgc3RyaW5naWZ5UmVxdWlyZWRNZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gIC8vIHRoZXNlIEhUVFAgbWV0aG9kcyByZXF1aXJlcyBKU09OLnN0cmluZ2lmeVxuICByZXR1cm4gKC9eKFBPU1R8UFVUfFBBVENIfERFTEVURSkkLy50ZXN0KG1ldGhvZC50b1VwcGVyQ2FzZSgpKSk7XG59O1xuXG5sZXQgbWFrZUFqYXhSZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBpZiAoc3RyaW5naWZ5UmVxdWlyZWRNZXRob2Qob3B0aW9ucy50eXBlKSkge1xuICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vdm5kLmFwaStqc29uJykge1xuICAgICAgb3B0aW9ucy5kYXRhID0gSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5kYXRhKTtcbiAgICB9XG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL3Evd2lraS9Db21pbmctZnJvbS1qUXVlcnlcbiAgcmV0dXJuIFEucHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgJC5hamF4KG9wdGlvbnMpXG4gICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcbiAgICAgICAgZGVsZXRlIGpxWEhSLnRoZW47IC8vIHRyZWF0IHhociBhcyBhIG5vbi1wcm9taXNlXG4gICAgICAgIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShqcVhIUik7XG4gICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5mYWlsKGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgZGVsZXRlIGpxWEhSLnRoZW47IC8vIHRyZWF0IHhociBhcyBhIG5vbi1wcm9taXNlXG4gICAgICAgIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShqcVhIUik7XG4gICAgICAgIHJlamVjdChyZXNwb25zZSk7XG4gICAgICB9KTtcbiAgfSk7XG5cbn07XG5cblxuXG5sZXQgUkVTVGZ1bCA9IHtcblxuICBoZWFkOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkhFQURcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZ2V0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwb3N0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcHV0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBVVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwYXRjaDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQQVRDSFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBkZWxldGU6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiREVMRVRFXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGRlZmF1bHRPcHRpb25zOiB7XG5cbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3ZuZC5hcGkranNvbicsXG4gICAgcHJvY2Vzc0RhdGE6IHRydWVcblxuICB9XG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJFU1RmdWw7XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHV1aWQgZnJvbSAnbm9kZS11dWlkJztcblxuXG5jbGFzcyBSZXNvdXJjZSB7XG5cbiAgY29uc3RydWN0b3IoYXR0cmlidXRlcykge1xuXG4gICAgdGhpcy5hdHRyaWJ1dGVzID0ge307XG4gICAgdGhpcy5saW5rcyA9IHt9O1xuICAgIHRoaXMucmlkID0gdXVpZC52NCgpO1xuXG4gICAgdGhpcy5kZXNlcmlhbGl6ZShhdHRyaWJ1dGVzKTtcblxuICB9XG5cbiAgZ2V0IChrZXkpIHtcblxuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNba2V5XTtcblxuICB9XG5cbiAgc2V0IChhdHRyaWJ1dGVzKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xuXG4gIH1cblxuICB1bnNldCAoa2V5KSB7XG5cbiAgICBkZWxldGUgdGhpcy5hdHRyaWJ1dGVzW2tleV07XG5cbiAgfVxuXG4gIGdldExpbmsgKGtleSkge1xuXG4gICAga2V5ID0ga2V5IHx8ICdzZWxmJztcbiAgICByZXR1cm4gdGhpcy5saW5rc1trZXldO1xuXG4gIH1cblxuICBzZXRMaW5rIChsaW5rcykge1xuXG4gICAgXy5leHRlbmQodGhpcy5saW5rcywgbGlua3MpO1xuXG4gIH1cblxuICB1bnNldExpbmsgKGtleSkge1xuXG4gICAgZGVsZXRlIHRoaXMubGlua3Nba2V5XTtcblxuICB9XG5cbiAgZ2V0TGlua2FnZSAoKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogdGhpcy5hdHRyaWJ1dGVzLnR5cGUsXG4gICAgICBpZDogdGhpcy5hdHRyaWJ1dGVzLmlkXG4gICAgfVxuXG4gIH1cblxuICBzZXJpYWxpemUgKCkge1xuXG4gICAgbGV0IHJlc3VsdCA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzLCB0cnVlKTtcbiAgICByZXN1bHQubGlua3MgPSB0aGlzLmxpbmtzO1xuXG4gICAgaWYgKF8uaXNFbXB0eShyZXN1bHQubGlua3MpKSB7XG4gICAgICBkZWxldGUgcmVzdWx0LmxpbmtzO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgfVxuXG4gIGRlc2VyaWFsaXplIChzZXJpYWxpemVkKSB7XG5cbiAgICBpZiAoIXRoaXMuX3ZhbGlkYXRlU2VyaWFsaXplZChzZXJpYWxpemVkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGRhdGEhIHR5cGUgc2hvdWxkIGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoXy5jbG9uZShfLm9taXQoc2VyaWFsaXplZCwgJ2xpbmtzJyksIHRydWUpKTtcbiAgICB0aGlzLnNldExpbmsoc2VyaWFsaXplZC5saW5rcyk7XG5cbiAgfVxuXG4gIGNsb25lICgpIHtcblxuICAgIGxldCByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZSh0aGlzLnNlcmlhbGl6ZSgpKTtcbiAgICByZXNvdXJjZS51dWlkID0gdGhpcy51dWlkO1xuICAgIHJldHVybiByZXNvdXJjZTtcblxuICB9XG5cbiAgX3ZhbGlkYXRlU2VyaWFsaXplZCAoc2VyaWFsaXplZCkge1xuXG4gICAgcmV0dXJuIHNlcmlhbGl6ZWQgJiYgc2VyaWFsaXplZC50eXBlO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuXG5sZXQgX3ZhbGlkYXRlUmVzcG9uc2UgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgbGV0IGJvZHkgPSB4aHIucmVzcG9uc2VKU09OO1xuXG4gIGlmIChib2R5LmRhdGEgPT09IHVuZGVmaW5lZCAmJiBib2R5LmVycm9ycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQSBkb2N1bWVudCBNVVNUIGNvbnRhaW4gZWl0aGVyIHByaW1hcnkgZGF0YSBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwib3IgYW4gYXJyYXkgb2YgZXJyb3Igb2JqZWN0cy5cIik7XG4gIH1cblxufTtcblxuXG5sZXQgX2lzUmVzcG9uc2VFcnJvciA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcblxuICByZXR1cm4gNDAwIDw9IHN0YXR1cyAmJiA2MDAgPiBzdGF0dXMgO1xuXG59O1xuXG5cbmxldCBfcGFyc2VEYXRhID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICgheGhyLnJlc3BvbnNlSlNPTikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB4aHIucmVzcG9uc2VKU09OLmRhdGE7XG5cbn07XG5cblxubGV0IF9wYXJzZUVycm9ycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBpZiAoISh4aHIucmVzcG9uc2VKU09OICYmIHhoci5yZXNwb25zZUpTT04uZXJyb3JzICkpIHtcbiAgICBpZiAoX2lzUmVzcG9uc2VFcnJvcih4aHIuc3RhdHVzKSkge1xuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIHN0YXR1czogXCJcIiArIHhoci5zdGF0dXNcbiAgICAgIH1dO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCBlcnJvcnMgPSB4aHIucmVzcG9uc2VKU09OLmVycm9ycztcblxuICByZXR1cm4gXy5tYXAoZXJyb3JzLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICByZXR1cm4gXy5leHRlbmQoe1xuICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgIH0sIGVycm9yKTtcbiAgfSk7XG5cbn07XG5cblxubGV0IF9wYXJzZUhlYWRlcnMgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgbGV0IHJlc3VsdCA9IFtdO1xuXG4gIGxldCBoZWFkZXJSZWdleCA9IC9eKC4qPyk6WyBcXHRdKihbXlxcclxcbl0qKSQvbWc7XG4gIGxldCBoZWFkZXJzU3RyaW5nID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpO1xuICBsZXQgZmluZFJlc3VsdDtcblxuICB3aGlsZSAoKGZpbmRSZXN1bHQgPSBoZWFkZXJSZWdleC5leGVjKGhlYWRlcnNTdHJpbmcpKSAhPT0gbnVsbCkge1xuICAgIHJlc3VsdC5wdXNoKGZpbmRSZXN1bHQuc2xpY2UoMSkpO1xuICB9XG5cbiAgcmV0dXJuIF8ub2JqZWN0KHJlc3VsdCk7XG5cbn07XG5cblxuY2xhc3MgUmVzcG9uc2Uge1xuXG4gIGNvbnN0cnVjdG9yICh4aHIpIHtcblxuICAgIHRoaXMucmVzcG9uc2VKU09OID0geGhyLnJlc3BvbnNlSlNPTjtcbiAgICB0aGlzLmRhdGEgPSBfcGFyc2VEYXRhKHhocik7XG4gICAgdGhpcy5lcnJvcnMgPSBfcGFyc2VFcnJvcnMoeGhyKTtcbiAgICB0aGlzLmhlYWRlcnMgPSBfcGFyc2VIZWFkZXJzKHhocik7XG4gICAgdGhpcy5uYXRpdmVYSFIgPSB4aHI7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNlO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnYmFja2JvbmUnO1xuXG5cbmNsYXNzIFRyYW5zYWN0aW9uIHtcblxuICBjb25zdHJ1Y3Rvcihwb29sLCBvcHRpb25zKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLCBFdmVudHMpO1xuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30pO1xuXG4gICAgdGhpcy5wb29sID0gcG9vbDtcbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcblxuICB9XG5cbiAgYmVnaW4gKCkge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG4gICAgdGhpcy5fYWN0aXZhdGUoKTtcblxuICB9XG5cbiAgY29tbWl0ICgpIHtcblxuICAgIHRoaXMuX2RlYWN0aXZhdGUoKTtcblxuICB9XG5cblxuICBfYWN0aXZhdGUgKCkge1xuXG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLnBvb2wsICd0cmFuc2Zvcm0nLCB0aGlzLm9uVHJhbnNmb3JtKTtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG5cbiAgfVxuXG4gIF9kZWFjdGl2YXRlICgpIHtcblxuICAgIHRoaXMuc3RvcExpc3RlbmluZyh0aGlzLnBvb2wsICd0cmFuc2Zvcm0nLCB0aGlzLm9uVHJhbnNmb3JtKTtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gIH1cblxuICBvblRyYW5zZm9ybSAob3BlcmF0aW9uKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMucHVzaChvcGVyYXRpb24pO1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBUcmFuc2FjdGlvbjtcbiJdfQ==
