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

var ajaxOptions = {

  contentType: 'application/json',
  processData: true

};

var stringifyRequiredMethod = function stringifyRequiredMethod(method) {
  // these HTTP methods requires JSON.stringify
  return /^(POST|PUT|PATCH|DELETE)$/.test(method.toUpperCase());
};

var makeAjaxRequest = function makeAjaxRequest(options) {

  options = _import2['default'].extend({}, ajaxOptions, options);

  if (stringifyRequiredMethod(options.type)) {
    if (options.contentType === 'application/json') {
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

exports['default'] = {

  head: function head(url, data, options) {

    options = _import2['default'].extend({
      url: url,
      type: 'HEAD',
      data: data
    }, options);
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
    }, options);
    return makeAjaxRequest(options);
  },

  put: function put(url, data, options) {

    options = _import2['default'].extend({
      url: url,
      type: 'PUT',
      data: data
    }, options);
    return makeAjaxRequest(options);
  },

  patch: function patch(url, data, options) {

    options = _import2['default'].extend({
      url: url,
      type: 'PATCH',
      data: data
    }, options);
    return makeAjaxRequest(options);
  },

  'delete': function _delete(url, data, options) {

    options = _import2['default'].extend({
      url: url,
      type: 'DELETE',
      data: data
    }, options);
    return makeAjaxRequest(options);
  }

};
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

      var result = this.attributes;
      result.links = this.links;

      if (_import2['default'].isEmpty(result.links)) {
        delete result.links;
      }

      return _import2['default'].clone(result, true);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9pbmRleC5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9Qb29sLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvbGliL1JFU1RmdWwuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvUmVzb3VyY2UuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvUmVzcG9uc2UuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvVHJhbnNhY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsZ0JBQWdCOzs7O29CQUNwQixZQUFZOzs7O3VCQUNULGVBQWU7Ozs7MkJBQ1gsbUJBQW1COzs7O1FBSXpDLFdBQVc7UUFDWCxRQUFRO1FBQ1IsSUFBSTtRQUNKLE9BQU87Ozs7Ozs7Ozs7Ozs7OztzQkNWSyxRQUFROzs7O2lCQUNSLEdBQUc7Ozs7dUJBQ0csVUFBVTs7OztvQkFDYixXQUFXOzs7O3dCQUNQLFlBQVk7Ozs7dUJBQ2IsV0FBVzs7OztJQUd6QixJQUFJO0FBRUcsV0FGUCxJQUFJLENBRUksT0FBTyxFQUFFOzBCQUZqQixJQUFJOztBQUlOLFFBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztHQUVqQjs7ZUFORyxJQUFJOzs7Ozs7V0FVQyxvQkFBRzs7QUFFVixVQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNmLFVBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxN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QUM7QUFDckIsVUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBRWxCOzs7V0FFTSxrQkFBRzs7QUFFUixVQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7S0FFcEI7OztXQUdTLHFCQUFHOztBQUVYLFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0tBRXBCOzs7V0FFVyx1QkFBRzs7QUFFYixVQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM3RCxVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUVyQjs7O1dBRVcscUJBQUMsU0FBUyxFQUFFOztBQUV0QixVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUVqQzs7O1NBNUNHLFdBQVc7OztxQkFnREYsV0FBVyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9saWIvUmVzb3VyY2UnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi9saWIvUG9vbCc7XG5pbXBvcnQgUkVTVGZ1bCBmcm9tICcuL2xpYi9SRVNUZnVsJztcbmltcG9ydCBUcmFuc2FjdGlvbiBmcm9tICcuL2xpYi9UcmFuc2FjdGlvbic7XG5cblxuZXhwb3J0IHtcbiAgVHJhbnNhY3Rpb24sXG4gIFJlc291cmNlLFxuICBQb29sLFxuICBSRVNUZnVsXG59O1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHVybEpvaW4gZnJvbSAndXJsLWpvaW4nO1xuaW1wb3J0IHV1aWQgZnJvbSAnbm9kZS11dWlkJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCBSRVNUZnVsIGZyb20gJy4vUkVTVGZ1bCc7XG5cblxuY2xhc3MgUG9vbCB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuXG4gICAgdGhpcy5yZXNldEFsbCgpO1xuXG4gIH1cbsKgXG4gIHN5bmM6IFJFU1RmdWxcblxuICByZXNldEFsbCAoKSB7XG5cbiAgICB0aGlzLnBvb2wgPSB7fTtcbiAgICB0aGlzLmJsb2JzID0ge307XG4gICAgdGhpcy5zdGFnZWQgPSB7fTtcbiAgICB0aGlzLnJlbW90ZSA9IHt9O1xuICAgIHRoaXMuY29tbWl0cyA9IFtdO1xuICAgIHRoaXMucmVtb3RlSW5kZXggPSAtMTtcblxuICB9XG5cbiAgZ2V0Q29tbWl0IChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCAhPT0gdW5kZWZpbmVkID8gaWR4IDogdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIHRoaXMuY29tbWl0c1tpZHhdIHx8IHt9O1xuXG4gIH1cblxuICBzZXRSZW1vdGVJbmRleCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggIT09IHVuZGVmaW5lZCA/IGlkeCA6IHRoaXMuY29tbWl0cy5sZW5ndGggLSAxO1xuICAgIHRoaXMucmVtb3RlSW5kZXggPSBpZHg7XG5cbiAgfVxuXG4gIHJtIChyZXNvdXJjZSkge1xuXG4gICAgaWYoXy5pc0FycmF5KHJlc291cmNlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKHJlc291cmNlLCByZXNvdXJjZSA9PiB0aGlzLnJtKHJlc291cmNlKSk7XG4gICAgfVxuXG4gICAgbGV0IHJpZCA9IHJlc291cmNlLnJpZDtcblxuICAgIHRoaXMuc3RhZ2VkW3JpZF0gPSBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3JpZF07XG5cbiAgfVxuXG4gIGFkZCAocmVzb3VyY2UpIHtcblxuICAgIGlmKF8uaXNBcnJheShyZXNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChyZXNvdXJjZSwgcmVzb3VyY2UgPT4gdGhpcy5hZGQocmVzb3VyY2UpKTtcbiAgICB9XG5cbiAgICBsZXQgcmlkID0gcmVzb3VyY2UucmlkO1xuXG4gICAgaWYgKCF0aGlzLnBvb2xbcmlkXSkge1xuICAgICAgdGhpcy5wb29sW3JpZF0gPSByZXNvdXJjZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YWdlZFtyaWRdID0gcmVzb3VyY2Uuc2VyaWFsaXplKCk7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmlkXTtcblxuICB9XG5cbiAgZ2V0U3RhZ2VkIChyZXNvdXJjZSkge1xuXG4gICAgaWYgKCF0aGlzLmlzU3RhZ2VkKHJlc291cmNlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoYGNhbiBub3QgZmluZCAke3Jlc291cmNlfWApXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3Jlc291cmNlLnJpZF07XG5cbiAgfVxuXG4gIGlzU3RhZ2VkIChyZXNvdXJjZSkge1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3Jlc291cmNlLnJpZF0gIT09IHVuZGVmaW5lZDtcblxuICB9XG5cbiAgY29tbWl0ICgpIHtcblxuICAgIGxldCBsYXN0Q29tbWl0ID0gdGhpcy5nZXRDb21taXQoKTtcblxuICAgIGxldCBuZXdDb21taXQgPSBfLnJlZHVjZSh0aGlzLnN0YWdlZCwgKGNvbW1pdCwgc2VyaWFsaXplZCwgcmlkKSA9PiB7XG4gICAgICBpZiAoIXNlcmlhbGl6ZWQpIHtcbiAgICAgICAgaWYgKGNvbW1pdFtyaWRdKSB7XG4gICAgICAgICAgZGVsZXRlIGNvbW1pdFtyaWRdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY29tbWl0W3JpZF0gPSB0aGlzLl9jcmVhdGVCbG9iKHNlcmlhbGl6ZWQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbW1pdFxuICAgIH0sIF8uY2xvbmUobGFzdENvbW1pdCwgdHJ1ZSkpO1xuXG4gICAgdGhpcy5jb21taXRzLnB1c2gobmV3Q29tbWl0KTtcbiAgICB0aGlzLnN0YWdlZCA9IHt9O1xuXG4gIH1cblxuICBhZGRSZW1vdGUgKHR5cGUsIHVybCkge1xuXG4gICAgdGhpcy5yZW1vdGVbdHlwZV0gPSB1cmw7XG5cbiAgfVxuXG4gIGdldFJlbW90ZSAodHlwZSwgaWQpIHtcblxuICAgIHJldHVybiB1cmxKb2luKHRoaXMucmVtb3RlW3R5cGVdLCBpZCk7XG5cbiAgfVxuXG4gIGdldCAodHlwZSwgaWQpIHtcblxuICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoJ3R5cGUnKSA9PT0gdHlwZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBfLmZpbmQodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCd0eXBlJykgPT09IHR5cGUgJiZcbiAgICAgICAgcmVzb3VyY2UuZ2V0KCdpZCcpID09PSBpZDtcbiAgICB9KTtcblxuICB9XG5cbiAgaGFzICh0eXBlLCBpZCkge1xuXG4gICAgcmV0dXJuICEhXy5maW5kKHRoaXMucG9vbCwgcmVzb3VyY2UgPT4ge1xuICAgICAgcmV0dXJuIHJlc291cmNlLmdldCgndHlwZScpID09PSB0eXBlICYmXG4gICAgICAgIHJlc291cmNlLmdldCgnaWQnKSA9PT0gaWQ7XG4gICAgfSk7XG5cbiAgfVxuXG4gIF9jcmVhdGVCbG9iIChzZXJpYWxpemVkKSB7XG5cbiAgICBsZXQgYmlkID0gdXVpZC52NCgpO1xuICAgIHRoaXMuYmxvYnNbYmlkXSA9IF8uY2xvbmUoc2VyaWFsaXplZCwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXMuYmxvYnNbYmlkXTtcblxuICB9XG5cbiAgX2dldEJsb2IgKGJpZCkge1xuXG4gICAgcmV0dXJuIHRoaXMuYmxvYnNbYmlkXTtcblxuICB9XG5cbiAgcHVsbEJ5TGluayAobGluaywgb3B0aW9ucykge1xuXG4gICAgbGV0IHVybDtcbiAgICBpZiAoXy5pc1N0cmluZyhsaW5rKSkge1xuICAgICAgdXJsID0gbGluaztcbiAgICB9XG4gICAgZWxzZSBpZiAobGluay5saW5rYWdlKSB7XG4gICAgICB1cmwgPSB0aGlzLmdldFJlbW90ZShsaW5rLmxpbmthZ2UudHlwZSwgbGluay5saW5rYWdlLmlkKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobGluay5yZWxhdGVkKSB7XG4gICAgICB1cmwgPSBsaW5rLnJlbGF0ZWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGxpbmsuJylcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wdWxsQnlVUkwodXJsLCBvcHRpb25zKTtcblxuICB9XG5cbiAgcHVsbCAodHlwZSwgaWQsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiB0aGlzLnB1bGxCeVVSTCh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCksIG9wdGlvbnMpO1xuXG4gIH1cblxuICBwdWxsQnlVUkwgKHVybCwgb3B0aW9ucykge1xuXG4gICAgaWYgKCFfLmlzRW1wdHkodGhpcy5zdGFnZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3B1bGwgd2hlbiBzdGFnZWQgY2hhbmdlIGlzIG5vdCBleGlzdCcpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN5bmMuZ2V0KHVybCwgb3B0aW9ucylcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICB9KTtcblxuICB9XG5cbiAgcHVzaCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggfHwgdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG5cbiAgICBpZiAoaWR4IDw9IHRoaXMucmVtb3RlSW5kZXgpIHtcbiAgICAgIHJldHVybiBRKCk7XG4gICAgfVxuXG4gICAgbGV0IGFmdGVyQ29tbWl0ID0gdGhpcy5nZXRDb21taXQoaWR4KTtcbiAgICBsZXQgYmVmb3JlQ29tbWl0ID0gdGhpcy5nZXRDb21taXQodGhpcy5yZW1vdGVJbmRleCk7XG5cbiAgICBsZXQgcmVtb3ZlZCA9IF8uZGlmZmVyZW5jZShcbiAgICAgIF8ua2V5cyhiZWZvcmVDb21taXQpLFxuICAgICAgXy5rZXlzKGFmdGVyQ29tbWl0KVxuICAgICk7XG5cbiAgICBsZXQgY2hhbmdlZE9yQWRkZWQgPSBfLndpdGhvdXQoXG4gICAgICBfLmtleXMoYWZ0ZXJDb21taXQpLFxuICAgICAgXy5rZXlzKHJlbW92ZWQpXG4gICAgKTtcblxuICAgIGxldCBkZWxldGVSZXF1ZXN0ID0gXy5tYXAocmVtb3ZlZCwgcmlkID0+IHtcbiAgICAgIGxldCB0eXBlID0gdGhpcy5wb29sW3JpZF0uZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ2lkJyk7XG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5kZWxldGUodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGlzLnBvb2xbcmlkXTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBwb3N0T3JQYXRjaFJlcXVlc3QgPSBfLm1hcChjaGFuZ2VkT3JBZGRlZCwgcmlkID0+IHtcbiAgICAgIGxldCB0eXBlID0gdGhpcy5wb29sW3JpZF0uZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ2lkJyk7XG4gICAgICBsZXQgYmxvYiA9IGFmdGVyQ29tbWl0W3JpZF07XG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5wYXRjaCh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9SZXF1ZXN0KGJsb2IpKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHRoaXMuX3NhdmVSZXNwb25zZShyZXNwb25zZSwgcmlkKSk7XG4gICAgICB9XG4gICAgICBpZiAoIWlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMucG9zdCh0aGlzLmdldFJlbW90ZSh0eXBlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvUmVxdWVzdChibG9iKSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB0aGlzLl9zYXZlUmVzcG9uc2UocmVzcG9uc2UsIHJpZCkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuYWxsKGRlbGV0ZVJlcXVlc3QuY29uY2F0KHBvc3RPclBhdGNoUmVxdWVzdCkpXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5zZXRSZW1vdGVJbmRleCgpO1xuICAgIH0pO1xuXG4gIH1cblxuICBfc2F2ZVJlc3BvbnNlIChyZXNwb25zZSwgcmlkKSB7XG5cbiAgICByZXR1cm4gdGhpcy5fc2F2ZURhdGEodGhpcy5fZnJvbVJlc3BvbnNlKHJlc3BvbnNlKSwgcmlkKTtcblxuICB9XG5cbiAgX3NhdmVEYXRhIChkYXRhLCByaWQpIHtcblxuICAgIGlmIChfLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChkYXRhLCBkYXRhID0+IHRoaXMuX3NhdmVEYXRhKGRhdGEpKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzb3VyY2UgPSByaWQgIT09IHVuZGVmaW5lZCA/XG4gICAgICB0aGlzLnBvb2xbcmlkXSA6IHRoaXMuZ2V0KGRhdGEudHlwZSwgZGF0YS5pZCk7XG5cbiAgICBpZiAoIXJlc291cmNlKSB7XG4gICAgICByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZShkYXRhKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXNvdXJjZS5kZXNlcmlhbGl6ZShkYXRhKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhZ2VkQmFja3VwID0gXy5jbG9uZSh0aGlzLnN0YWdlZCwgdHJ1ZSk7XG5cbiAgICB0aGlzLmFkZChyZXNvdXJjZSk7XG4gICAgdGhpcy5jb21taXQoKTtcbiAgICB0aGlzLnNldFJlbW90ZUluZGV4KCk7XG5cbiAgICB0aGlzLnN0YWdlZCA9IHN0YWdlZEJhY2t1cDtcblxuICAgIHJldHVybiByZXNvdXJjZTtcblxuICB9XG5cbiAgX3RvUmVxdWVzdCAoc2VyaWFsaXplZCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IHNlcmlhbGl6ZWRcbiAgICB9O1xuXG4gIH1cblxuICBfZnJvbVJlc3BvbnNlIChyZXNwb25zZSkge1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUG9vbDtcbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgUmVzcG9uc2UgZnJvbSAnLi9SZXNwb25zZSc7XG5cbmxldCBhamF4T3B0aW9ucyA9IHtcblxuICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICBwcm9jZXNzRGF0YTogdHJ1ZVxuXG59O1xuXG5sZXQgc3RyaW5naWZ5UmVxdWlyZWRNZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gIC8vIHRoZXNlIEhUVFAgbWV0aG9kcyByZXF1aXJlcyBKU09OLnN0cmluZ2lmeVxuICByZXR1cm4gKC9eKFBPU1R8UFVUfFBBVENIfERFTEVURSkkLy50ZXN0KG1ldGhvZC50b1VwcGVyQ2FzZSgpKSk7XG59O1xuXG5sZXQgbWFrZUFqYXhSZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gXy5leHRlbmQoe30sIGFqYXhPcHRpb25zLCBvcHRpb25zKTtcblxuICBpZiAoc3RyaW5naWZ5UmVxdWlyZWRNZXRob2Qob3B0aW9ucy50eXBlKSkge1xuICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgIG9wdGlvbnMuZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL3dpa2kvQ29taW5nLWZyb20talF1ZXJ5XG4gIHJldHVybiBRLnByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICQuYWpheChvcHRpb25zKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZmFpbChmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZWplY3QocmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH0pO1xuXG59O1xuXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGhlYWQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiSEVBRFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHBvc3Q6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwdXQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUFVUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHBhdGNoOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBBVENIXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGRlbGV0ZTogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJERUxFVEVcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH1cblxufTtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuXG5cbmNsYXNzIFJlc291cmNlIHtcblxuICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzKSB7XG5cbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSB7fTtcbiAgICB0aGlzLmxpbmtzID0ge307XG4gICAgdGhpcy5yaWQgPSB1dWlkLnY0KCk7XG5cbiAgICB0aGlzLmRlc2VyaWFsaXplKGF0dHJpYnV0ZXMpO1xuXG4gIH1cblxuICBnZXQgKGtleSkge1xuXG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1trZXldO1xuXG4gIH1cblxuICBzZXQgKGF0dHJpYnV0ZXMpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cbiAgfVxuXG4gIHVuc2V0IChrZXkpIHtcblxuICAgIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNba2V5XTtcblxuICB9XG5cbiAgZ2V0TGluayAoa2V5KSB7XG5cbiAgICBrZXkgPSBrZXkgfHwgJ3NlbGYnO1xuICAgIHJldHVybiB0aGlzLmxpbmtzW2tleV07XG5cbiAgfVxuXG4gIHNldExpbmsgKGxpbmtzKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLmxpbmtzLCBsaW5rcyk7XG5cbiAgfVxuXG4gIHVuc2V0TGluayAoa2V5KSB7XG5cbiAgICBkZWxldGUgdGhpcy5saW5rc1trZXldO1xuXG4gIH1cblxuICBnZXRMaW5rYWdlICgpIHtcblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0aGlzLmF0dHJpYnV0ZXMudHlwZSxcbiAgICAgIGlkOiB0aGlzLmF0dHJpYnV0ZXMuaWRcbiAgICB9XG5cbiAgfVxuXG4gIHNlcmlhbGl6ZSAoKSB7XG5cbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5hdHRyaWJ1dGVzO1xuICAgIHJlc3VsdC5saW5rcyA9IHRoaXMubGlua3M7XG5cbiAgICBpZiAoXy5pc0VtcHR5KHJlc3VsdC5saW5rcykpIHtcbiAgICAgIGRlbGV0ZSByZXN1bHQubGlua3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIF8uY2xvbmUocmVzdWx0LCB0cnVlKTtcblxuICB9XG5cbiAgZGVzZXJpYWxpemUgKHNlcmlhbGl6ZWQpIHtcblxuICAgIGlmICghdGhpcy5fdmFsaWRhdGVTZXJpYWxpemVkKHNlcmlhbGl6ZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZGF0YSEgdHlwZSBzaG91bGQgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldChfLmNsb25lKF8ub21pdChzZXJpYWxpemVkLCAnbGlua3MnKSwgdHJ1ZSkpO1xuICAgIHRoaXMuc2V0TGluayhzZXJpYWxpemVkLmxpbmtzKTtcblxuICB9XG5cbiAgY2xvbmUgKCkge1xuXG4gICAgbGV0IHJlc291cmNlID0gbmV3IFJlc291cmNlKHRoaXMuc2VyaWFsaXplKCkpO1xuICAgIHJlc291cmNlLnV1aWQgPSB0aGlzLnV1aWQ7XG4gICAgcmV0dXJuIHJlc291cmNlO1xuXG4gIH1cblxuICBfdmFsaWRhdGVTZXJpYWxpemVkIChzZXJpYWxpemVkKSB7XG5cbiAgICByZXR1cm4gc2VyaWFsaXplZCAmJiBzZXJpYWxpemVkLnR5cGU7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2U7XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5cbmxldCBfdmFsaWRhdGVSZXNwb25zZSA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgYm9keSA9IHhoci5yZXNwb25zZUpTT047XG5cbiAgaWYgKGJvZHkuZGF0YSA9PT0gdW5kZWZpbmVkICYmIGJvZHkuZXJyb3JzID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGRvY3VtZW50IE1VU1QgY29udGFpbiBlaXRoZXIgcHJpbWFyeSBkYXRhIFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJvciBhbiBhcnJheSBvZiBlcnJvciBvYmplY3RzLlwiKTtcbiAgfVxuXG59O1xuXG5cbmxldCBfaXNSZXNwb25zZUVycm9yID0gZnVuY3Rpb24gKHN0YXR1cykge1xuXG4gIHJldHVybiA0MDAgPD0gc3RhdHVzICYmIDYwMCA+IHN0YXR1cyA7XG5cbn07XG5cblxubGV0IF9wYXJzZURhdGEgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgaWYgKCF4aHIucmVzcG9uc2VKU09OKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHhoci5yZXNwb25zZUpTT04uZGF0YTtcblxufTtcblxuXG5sZXQgX3BhcnNlRXJyb3JzID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICghKHhoci5yZXNwb25zZUpTT04gJiYgeGhyLnJlc3BvbnNlSlNPTi5lcnJvcnMgKSkge1xuICAgIGlmIChfaXNSZXNwb25zZUVycm9yKHhoci5zdGF0dXMpKSB7XG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgICAgfV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGVycm9ycyA9IHhoci5yZXNwb25zZUpTT04uZXJyb3JzO1xuXG4gIHJldHVybiBfLm1hcChlcnJvcnMsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHJldHVybiBfLmV4dGVuZCh7XG4gICAgICBzdGF0dXM6IFwiXCIgKyB4aHIuc3RhdHVzXG4gICAgfSwgZXJyb3IpO1xuICB9KTtcblxufTtcblxuXG5sZXQgX3BhcnNlSGVhZGVycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgbGV0IGhlYWRlclJlZ2V4ID0gL14oLio/KTpbIFxcdF0qKFteXFxyXFxuXSopJC9tZztcbiAgbGV0IGhlYWRlcnNTdHJpbmcgPSB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCk7XG4gIGxldCBmaW5kUmVzdWx0O1xuXG4gIHdoaWxlICgoZmluZFJlc3VsdCA9IGhlYWRlclJlZ2V4LmV4ZWMoaGVhZGVyc1N0cmluZykpICE9PSBudWxsKSB7XG4gICAgcmVzdWx0LnB1c2goZmluZFJlc3VsdC5zbGljZSgxKSk7XG4gIH1cblxuICByZXR1cm4gXy5vYmplY3QocmVzdWx0KTtcblxufTtcblxuXG5jbGFzcyBSZXNwb25zZSB7XG5cbiAgY29uc3RydWN0b3IgKHhocikge1xuXG4gICAgdGhpcy5yZXNwb25zZUpTT04gPSB4aHIucmVzcG9uc2VKU09OO1xuICAgIHRoaXMuZGF0YSA9IF9wYXJzZURhdGEoeGhyKTtcbiAgICB0aGlzLmVycm9ycyA9IF9wYXJzZUVycm9ycyh4aHIpO1xuICAgIHRoaXMuaGVhZGVycyA9IF9wYXJzZUhlYWRlcnMoeGhyKTtcbiAgICB0aGlzLm5hdGl2ZVhIUiA9IHhocjtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2U7XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tICdiYWNrYm9uZSc7XG5cblxuY2xhc3MgVHJhbnNhY3Rpb24ge1xuXG4gIGNvbnN0cnVjdG9yKHBvb2wsIG9wdGlvbnMpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMsIEV2ZW50cyk7XG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLnBvb2wgPSBwb29sO1xuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuXG4gIH1cblxuICBiZWdpbiAoKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcbiAgICB0aGlzLl9hY3RpdmF0ZSgpO1xuXG4gIH1cblxuICBjb21taXQgKCkge1xuXG4gICAgdGhpcy5fZGVhY3RpdmF0ZSgpO1xuXG4gIH1cblxuXG4gIF9hY3RpdmF0ZSAoKSB7XG5cbiAgICB0aGlzLmxpc3RlblRvKHRoaXMucG9vbCwgJ3RyYW5zZm9ybScsIHRoaXMub25UcmFuc2Zvcm0pO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcblxuICB9XG5cbiAgX2RlYWN0aXZhdGUgKCkge1xuXG4gICAgdGhpcy5zdG9wTGlzdGVuaW5nKHRoaXMucG9vbCwgJ3RyYW5zZm9ybScsIHRoaXMub25UcmFuc2Zvcm0pO1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgfVxuXG4gIG9uVHJhbnNmb3JtIChvcGVyYXRpb24pIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucy5wdXNoKG9wZXJhdGlvbik7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zYWN0aW9uO1xuIl19
