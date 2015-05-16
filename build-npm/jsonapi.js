module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _libResource = __webpack_require__(1);
	
	var _libResource2 = _interopRequireDefault(_libResource);
	
	var _libPool = __webpack_require__(2);
	
	var _libPool2 = _interopRequireDefault(_libPool);
	
	var _libRESTful = __webpack_require__(3);
	
	var _libRESTful2 = _interopRequireDefault(_libRESTful);
	
	var _libTransaction = __webpack_require__(4);
	
	var _libTransaction2 = _interopRequireDefault(_libTransaction);
	
	exports.Transaction = _libTransaction2['default'];
	exports.Resource = _libResource2['default'];
	exports.Pool = _libPool2['default'];
	exports.RESTful = _libRESTful2['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _lodash = __webpack_require__(5);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _nodeUuid = __webpack_require__(6);
	
	var _nodeUuid2 = _interopRequireDefault(_nodeUuid);
	
	var Resource = (function () {
	  function Resource(attributes) {
	    _classCallCheck(this, Resource);
	
	    this.attributes = {};
	    this.links = {};
	    this.rid = _nodeUuid2['default'].v4();
	
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
	
	      _lodash2['default'].extend(this.attributes, attributes);
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
	
	      _lodash2['default'].extend(this.links, links);
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
	
	      var result = _lodash2['default'].clone(this.attributes, true);
	      result.links = this.links;
	
	      if (_lodash2['default'].isEmpty(result.links)) {
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
	
	      this.set(_lodash2['default'].clone(_lodash2['default'].omit(serialized, 'links'), true));
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _lodash = __webpack_require__(5);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _q = __webpack_require__(7);
	
	var _q2 = _interopRequireDefault(_q);
	
	var _urlJoin = __webpack_require__(8);
	
	var _urlJoin2 = _interopRequireDefault(_urlJoin);
	
	var _nodeUuid = __webpack_require__(6);
	
	var _nodeUuid2 = _interopRequireDefault(_nodeUuid);
	
	var _Resource = __webpack_require__(1);
	
	var _Resource2 = _interopRequireDefault(_Resource);
	
	var _RESTful = __webpack_require__(3);
	
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
	
	      if (_lodash2['default'].isArray(resource)) {
	        return _lodash2['default'].map(resource, function (resource) {
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
	
	      if (_lodash2['default'].isArray(resource)) {
	        return _lodash2['default'].map(resource, function (resource) {
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
	
	      if (_lodash2['default'].isArray(linkage)) {
	        return _lodash2['default'].map(linkage, function (linkage) {
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
	
	      var newCommit = _lodash2['default'].reduce(this.staged, function (commit, serialized, rid) {
	        if (!serialized) {
	          if (commit[rid]) {
	            delete commit[rid];
	          }
	        } else {
	          commit[rid] = _this4._createBlob(serialized);
	        }
	        return commit;
	      }, _lodash2['default'].clone(lastCommit, true));
	
	      _lodash2['default'].reduce(this.stagedLink, function (commit, linkOperation) {
	        commit[_nodeUuid2['default'].v4()] = linkOperation;
	        return commit;
	      }, newCommit);
	
	      this.commits.push(newCommit);
	      this.staged = {};
	      this.stagedLink = [];
	    }
	  }, {
	    key: 'addRemote',
	    value: function addRemote(type, url) {
	
	      this.remote[type] = url;
	    }
	  }, {
	    key: 'getRemote',
	    value: function getRemote(type, id, relation) {
	
	      var urlParts = _lodash2['default'].compact([this.remote[type], id, relation ? 'links' : undefined, relation]);
	      return _urlJoin2['default'].apply(null, urlParts);
	    }
	  }, {
	    key: 'get',
	    value: function get(type, id) {
	
	      if (id === undefined) {
	        return _lodash2['default'].filter(this.pool, function (resource) {
	          return resource.get('type') === type;
	        });
	      }
	
	      return _lodash2['default'].find(this.pool, function (resource) {
	        return resource.get('type') === type && resource.get('id') === id;
	      });
	    }
	  }, {
	    key: 'has',
	    value: function has(type, id) {
	
	      return !!_lodash2['default'].find(this.pool, function (resource) {
	        return resource.get('type') === type && resource.get('id') === id;
	      });
	    }
	  }, {
	    key: '_createBlob',
	    value: function _createBlob(serialized) {
	
	      var bid = _nodeUuid2['default'].v4();
	      this.blobs[bid] = _lodash2['default'].clone(serialized, true);
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
	      if (_lodash2['default'].isString(link)) {
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
	
	      if (!_lodash2['default'].isEmpty(this.staged)) {
	        throw new Error('pull when staged change is not exist');
	      }
	
	      options = options || {};
	
	      var included = options.included;
	      if (included) {
	        options.included = included.join(',');
	      }
	
	      var fields = options.fields;
	      if (fields) {
	        _lodash2['default'].reduce(fields, function (options, fields, type) {
	          options['fields[' + type + ']'] = fields.join(',');
	          return options;
	        }, options);
	        delete options.fields;
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
	        return _q2['default']();
	      }
	
	      var afterCommit = this.getCommit(idx);
	      var beforeCommit = this.getCommit(this.remoteIndex);
	
	      var removed = _lodash2['default'].difference(_lodash2['default'].keys(beforeCommit), _lodash2['default'].keys(afterCommit));
	
	      var changedOrAdded = _lodash2['default'].without(_lodash2['default'].keys(afterCommit), _lodash2['default'].keys(removed));
	
	      var deleteRequest = _lodash2['default'].map(removed, function (rid) {
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
	
	      var postOrPatchRequest = _lodash2['default'].map(changedOrAdded, function (rid) {
	        // is Link
	        if (!_this6.pool[rid]) {
	          return;
	        }
	        // not change
	        if (_lodash2['default'].isEqual(afterCommit[rid], beforeCommit[rid])) {
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
	
	      var linkOperationRequest = _lodash2['default'].map(afterCommit, function (staged, rid) {
	        // is resource
	        if (_this6.pool[rid] || !staged.op) {
	          return;
	        }
	
	        var type = staged.resource.get('type');
	        var id = staged.resource.get('id');
	        var options = _lodash2['default'].defaults(staged.options || {}, {
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
	
	      return _q2['default'].all(deleteRequest.concat(postOrPatchRequest)).then(function () {
	        _this6.setRemoteIndex();
	      });
	    }
	  }, {
	    key: '_saveResponse',
	    value: function _saveResponse(response, rid) {
	      var _this7 = this;
	
	      var mainResource = this._saveData(response.data, rid);
	      var includedResources = _lodash2['default'].map(response.included, function (data) {
	        return _this7._saveData(data);
	      });
	      return mainResource;
	    }
	  }, {
	    key: '_saveData',
	    value: function _saveData(data, rid) {
	      var _this8 = this;
	
	      if (_lodash2['default'].isArray(data)) {
	        return _lodash2['default'].map(data, function (data) {
	          return _this8._saveData(data);
	        });
	      }
	
	      var resource = rid !== undefined ? this.pool[rid] : this.get(data.type, data.id);
	
	      if (!resource) {
	        resource = new _Resource2['default'](data);
	      } else {
	        resource.deserialize(data);
	      }
	
	      var stagedBackup = _lodash2['default'].clone(this.staged, true);
	
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
	  }]);
	
	  return Pool;
	})();
	
	exports['default'] = Pool;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _jquery = __webpack_require__(9);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _lodash = __webpack_require__(5);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _q = __webpack_require__(7);
	
	var _q2 = _interopRequireDefault(_q);
	
	var _Response = __webpack_require__(11);
	
	var _Response2 = _interopRequireDefault(_Response);
	
	var stringifyRequiredMethod = function stringifyRequiredMethod(method) {
	  // these HTTP methods requires JSON.stringify
	  return /^(POST|PUT|PATCH|DELETE)$/.test(method.toUpperCase());
	};
	
	var makeAjaxRequest = function makeAjaxRequest(options) {
	
	  options = options || {};
	
	  if (stringifyRequiredMethod(options.type)) {
	    if (options.contentType === 'application/json') {
	      options.data = JSON.stringify(options.data);
	    }
	  }
	
	  options.url = options.url.replace(/\/?$/, '/');
	
	  // https://github.com/kriskowal/q/wiki/Coming-from-jQuery
	  return _q2['default'].promise(function (resolve, reject) {
	    _jquery2['default'].ajax(options).then(function (data, textStatus, jqXHR) {
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
	
	    options = _lodash2['default'].extend({
	      url: url,
	      type: 'HEAD',
	      data: data
	    }, this.defaultOptions, options);
	    return makeAjaxRequest(options);
	  },
	
	  get: function get(url, data, options) {
	
	    options = _lodash2['default'].extend({
	      url: url,
	      type: 'GET',
	      data: data
	    }, options);
	    return makeAjaxRequest(options);
	  },
	
	  post: function post(url, data, options) {
	
	    options = _lodash2['default'].extend({
	      url: url,
	      type: 'POST',
	      data: data
	    }, this.defaultOptions, options);
	    return makeAjaxRequest(options);
	  },
	
	  put: function put(url, data, options) {
	
	    options = _lodash2['default'].extend({
	      url: url,
	      type: 'PUT',
	      data: data
	    }, this.defaultOptions, options);
	    return makeAjaxRequest(options);
	  },
	
	  patch: function patch(url, data, options) {
	
	    options = _lodash2['default'].extend({
	      url: url,
	      type: 'PATCH',
	      data: data
	    }, this.defaultOptions, options);
	    return makeAjaxRequest(options);
	  },
	
	  'delete': function _delete(url, data, options) {
	
	    options = _lodash2['default'].extend({
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
	
	  ajaxSetup: function ajaxSetup(options) {
	
	    _jquery2['default'].ajaxSetup(options);
	  }
	
	};
	
	exports['default'] = RESTful;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _lodash = __webpack_require__(5);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _q = __webpack_require__(7);
	
	var _q2 = _interopRequireDefault(_q);
	
	var _backbone = __webpack_require__(10);
	
	var Transaction = (function () {
	  function Transaction(pool, options) {
	    _classCallCheck(this, Transaction);
	
	    _lodash2['default'].extend(this, _backbone.Events);
	    options = _lodash2['default'].defaults(options || {});
	
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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("lodash");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("node-uuid");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("q");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("url-join");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("jquery");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("backbone");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _lodash = __webpack_require__(5);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
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
	
	var _parseIncluded = function _parseIncluded(xhr) {
	
	  if (!xhr.responseJSON) {
	    return null;
	  }
	  return xhr.responseJSON.included;
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
	
	  return _lodash2["default"].map(errors, function (error) {
	    return _lodash2["default"].extend({
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
	
	  return _lodash2["default"].object(result);
	};
	
	var Response = function Response(xhr) {
	  _classCallCheck(this, Response);
	
	  this.responseJSON = xhr.responseJSON;
	  this.data = _parseData(xhr);
	  this.included = _parseIncluded(xhr);
	  this.errors = _parseErrors(xhr);
	  this.headers = _parseHeaders(xhr);
	  this.nativeXHR = xhr;
	};
	
	exports["default"] = Response;
	module.exports = exports["default"];

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTdmZjdlMThmNjk1NmMyMjE5MGQiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1Jlc291cmNlLmpzIiwid2VicGFjazovLy8uL2xpYi9Qb29sLmpzIiwid2VicGFjazovLy8uL2xpYi9SRVNUZnVsLmpzIiwid2VicGFjazovLy8uL2xpYi9UcmFuc2FjdGlvbi5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLXV1aWRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJxXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXJsLWpvaW5cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJqcXVlcnlcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiYWNrYm9uZVwiIiwid2VicGFjazovLy8uL2xpYi9SZXNwb25zZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozt3Q0N0Q3FCLENBQWdCOzs7O29DQUNwQixDQUFZOzs7O3VDQUNULENBQWU7Ozs7MkNBQ1gsQ0FBbUI7Ozs7U0FJekMsV0FBVztTQUNYLFFBQVE7U0FDUixJQUFJO1NBQ0osT0FBTywyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O21DQ1ZLLENBQVE7Ozs7cUNBQ0wsQ0FBVzs7OztLQUd0QixRQUFRO0FBRUQsWUFGUCxRQUFRLENBRUEsVUFBVSxFQUFFOzJCQUZwQixRQUFROztBQUlWLFNBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFNBQUks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LFVBQVUsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLElBQUksRUFBRTtBQUM5RCxXQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQzs7QUFFRCxVQUFPLG9CQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUV6QixDQUFDOztLQUdJLFFBQVEsR0FFQSxTQUZSLFFBQVEsQ0FFQyxHQUFHLEVBQUU7eUJBRmQsUUFBUTs7QUFJVixPQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUM7QUFDckMsT0FBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsT0FBSSxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEMsT0FBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsT0FBSSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsT0FBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7RUFFdEI7O3NCQUlZLFFBQVEiLCJmaWxlIjoianNvbmFwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgZTdmZjdlMThmNjk1NmMyMjE5MGRcbiAqKi8iLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9saWIvUmVzb3VyY2UnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi9saWIvUG9vbCc7XG5pbXBvcnQgUkVTVGZ1bCBmcm9tICcuL2xpYi9SRVNUZnVsJztcbmltcG9ydCBUcmFuc2FjdGlvbiBmcm9tICcuL2xpYi9UcmFuc2FjdGlvbic7XG5cblxuZXhwb3J0IHtcbiAgVHJhbnNhY3Rpb24sXG4gIFJlc291cmNlLFxuICBQb29sLFxuICBSRVNUZnVsXG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9pbmRleC5qc1xuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuXG5cbmNsYXNzIFJlc291cmNlIHtcblxuICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzKSB7XG5cbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSB7fTtcbiAgICB0aGlzLmxpbmtzID0ge307XG4gICAgdGhpcy5yaWQgPSB1dWlkLnY0KCk7XG5cbiAgICB0aGlzLmRlc2VyaWFsaXplKGF0dHJpYnV0ZXMpO1xuXG4gIH1cblxuICBnZXQgKGtleSkge1xuXG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1trZXldO1xuXG4gIH1cblxuICBzZXQgKGF0dHJpYnV0ZXMpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cbiAgfVxuXG4gIHVuc2V0IChrZXkpIHtcblxuICAgIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNba2V5XTtcblxuICB9XG5cbiAgZ2V0TGluayAoa2V5KSB7XG5cbiAgICBrZXkgPSBrZXkgfHwgJ3NlbGYnO1xuICAgIHJldHVybiB0aGlzLmxpbmtzW2tleV07XG5cbiAgfVxuXG4gIHNldExpbmsgKGxpbmtzKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLmxpbmtzLCBsaW5rcyk7XG5cbiAgfVxuXG4gIHVuc2V0TGluayAoa2V5KSB7XG5cbiAgICBkZWxldGUgdGhpcy5saW5rc1trZXldO1xuXG4gIH1cblxuICBnZXRMaW5rYWdlICgpIHtcblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0aGlzLmF0dHJpYnV0ZXMudHlwZSxcbiAgICAgIGlkOiB0aGlzLmF0dHJpYnV0ZXMuaWRcbiAgICB9O1xuXG4gIH1cblxuICBzZXJpYWxpemUgKCkge1xuXG4gICAgbGV0IHJlc3VsdCA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzLCB0cnVlKTtcbiAgICByZXN1bHQubGlua3MgPSB0aGlzLmxpbmtzO1xuXG4gICAgaWYgKF8uaXNFbXB0eShyZXN1bHQubGlua3MpKSB7XG4gICAgICBkZWxldGUgcmVzdWx0LmxpbmtzO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgfVxuXG4gIGRlc2VyaWFsaXplIChzZXJpYWxpemVkKSB7XG5cbiAgICBpZiAoIXRoaXMuX3ZhbGlkYXRlU2VyaWFsaXplZChzZXJpYWxpemVkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGRhdGEhIHR5cGUgc2hvdWxkIGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoXy5jbG9uZShfLm9taXQoc2VyaWFsaXplZCwgJ2xpbmtzJyksIHRydWUpKTtcbiAgICB0aGlzLnNldExpbmsoc2VyaWFsaXplZC5saW5rcyk7XG5cbiAgfVxuXG4gIGNsb25lICgpIHtcblxuICAgIGxldCByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZSh0aGlzLnNlcmlhbGl6ZSgpKTtcbiAgICByZXNvdXJjZS51dWlkID0gdGhpcy51dWlkO1xuICAgIHJldHVybiByZXNvdXJjZTtcblxuICB9XG5cbiAgX3ZhbGlkYXRlU2VyaWFsaXplZCAoc2VyaWFsaXplZCkge1xuXG4gICAgcmV0dXJuIHNlcmlhbGl6ZWQgJiYgc2VyaWFsaXplZC50eXBlO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvUmVzb3VyY2UuanNcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgdXJsam9pbiBmcm9tICd1cmwtam9pbic7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xuaW1wb3J0IFJFU1RmdWwgZnJvbSAnLi9SRVNUZnVsJztcblxuXG5jbGFzcyBQb29sIHtcblxuICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuXG4gICAgdGhpcy5zeW5jID0gUkVTVGZ1bDtcbiAgICB0aGlzLnJlc2V0QWxsKCk7XG5cbiAgfVxuXG4gIHJlc2V0QWxsICgpIHtcblxuICAgIHRoaXMucG9vbCA9IHt9O1xuICAgIHRoaXMuYmxvYnMgPSB7fTtcbiAgICB0aGlzLnN0YWdlZCA9IHt9O1xuICAgIHRoaXMuc3RhZ2VkTGluayA9IFtdO1xuICAgIHRoaXMucmVtb3RlID0ge307XG4gICAgdGhpcy5jb21taXRzID0gW107XG4gICAgdGhpcy5yZW1vdGVJbmRleCA9IC0xO1xuXG4gIH1cblxuICBnZXRDb21taXQgKGlkeCkge1xuXG4gICAgaWR4ID0gaWR4ICE9PSB1bmRlZmluZWQgPyBpZHggOiB0aGlzLmNvbW1pdHMubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gdGhpcy5jb21taXRzW2lkeF0gfHwge307XG5cbiAgfVxuXG4gIHNldFJlbW90ZUluZGV4IChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCAhPT0gdW5kZWZpbmVkID8gaWR4IDogdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG4gICAgdGhpcy5yZW1vdGVJbmRleCA9IGlkeDtcblxuICB9XG5cbiAgcm0gKHJlc291cmNlKSB7XG5cbiAgICBpZihfLmlzQXJyYXkocmVzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gXy5tYXAocmVzb3VyY2UsIHJlc291cmNlID0+IHRoaXMucm0ocmVzb3VyY2UpKTtcbiAgICB9XG5cbiAgICBsZXQgcmlkID0gcmVzb3VyY2UucmlkO1xuXG4gICAgdGhpcy5zdGFnZWRbcmlkXSA9IG51bGw7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmlkXTtcblxuICB9XG5cbiAgYWRkIChyZXNvdXJjZSkge1xuXG4gICAgaWYoXy5pc0FycmF5KHJlc291cmNlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKHJlc291cmNlLCByZXNvdXJjZSA9PiB0aGlzLmFkZChyZXNvdXJjZSkpO1xuICAgIH1cblxuICAgIGxldCByaWQgPSByZXNvdXJjZS5yaWQ7XG5cbiAgICBpZiAoIXRoaXMucG9vbFtyaWRdKSB7XG4gICAgICB0aGlzLnBvb2xbcmlkXSA9IHJlc291cmNlO1xuICAgIH1cblxuICAgIHRoaXMuc3RhZ2VkW3JpZF0gPSByZXNvdXJjZS5zZXJpYWxpemUoKTtcblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyaWRdO1xuXG4gIH1cblxuICBybUxpbmthZ2UgKHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykge1xuXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24oXG4gICAgICAncmVtb3ZlJywgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKTtcblxuICB9XG5cbiAgYWRkTGlua2FnZSAocmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSB7XG5cbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlTGlua2FnZU9wZXJhdGlvbihcbiAgICAgICdhZGQnLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpO1xuXG4gIH1cblxuICBfY3JlYXRlTGlua2FnZU9wZXJhdGlvbiAob3AsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykge1xuXG4gICAgaWYoXy5pc0FycmF5KGxpbmthZ2UpKSB7XG4gICAgICByZXR1cm4gXy5tYXAobGlua2FnZSwgbGlua2FnZSA9PiB0aGlzLl9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uKFxuICAgICAgICBvcCwgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSk7XG4gICAgfVxuXG4gICAgbGV0IHN0YWdlZCA9IHtcbiAgICAgIG9wLFxuICAgICAgcmVzb3VyY2UsXG4gICAgICByZWxhdGlvbixcbiAgICAgIGxpbmthZ2UsXG4gICAgICBvcHRpb25zXG4gICAgfTtcblxuICAgIHRoaXMuc3RhZ2VkTGluay5wdXNoKHN0YWdlZCk7XG5cbiAgICByZXR1cm4gc3RhZ2VkO1xuXG4gIH1cblxuICBnZXRTdGFnZWQgKHJlc291cmNlKSB7XG5cbiAgICBpZiAoIXRoaXMuaXNTdGFnZWQocmVzb3VyY2UpKSB7XG4gICAgICB0aHJvdyBFcnJvcihgY2FuIG5vdCBmaW5kICR7cmVzb3VyY2V9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3Jlc291cmNlLnJpZF07XG5cbiAgfVxuXG4gIGlzU3RhZ2VkIChyZXNvdXJjZSkge1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3Jlc291cmNlLnJpZF0gIT09IHVuZGVmaW5lZDtcblxuICB9XG5cbiAgY29tbWl0ICgpIHtcblxuICAgIGxldCBsYXN0Q29tbWl0ID0gdGhpcy5nZXRDb21taXQoKTtcblxuICAgIGxldCBuZXdDb21taXQgPSBfLnJlZHVjZSh0aGlzLnN0YWdlZCwgKGNvbW1pdCwgc2VyaWFsaXplZCwgcmlkKSA9PiB7XG4gICAgICBpZiAoIXNlcmlhbGl6ZWQpIHtcbiAgICAgICAgaWYgKGNvbW1pdFtyaWRdKSB7XG4gICAgICAgICAgZGVsZXRlIGNvbW1pdFtyaWRdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY29tbWl0W3JpZF0gPSB0aGlzLl9jcmVhdGVCbG9iKHNlcmlhbGl6ZWQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbW1pdDtcbiAgICB9LCBfLmNsb25lKGxhc3RDb21taXQsIHRydWUpKTtcblxuICAgIF8ucmVkdWNlKHRoaXMuc3RhZ2VkTGluaywgKGNvbW1pdCwgbGlua09wZXJhdGlvbikgPT4ge1xuICAgICAgY29tbWl0W3V1aWQudjQoKV0gPSBsaW5rT3BlcmF0aW9uO1xuICAgICAgcmV0dXJuIGNvbW1pdDtcbiAgICB9LCBuZXdDb21taXQpO1xuXG4gICAgdGhpcy5jb21taXRzLnB1c2gobmV3Q29tbWl0KTtcbiAgICB0aGlzLnN0YWdlZCA9IHt9O1xuICAgIHRoaXMuc3RhZ2VkTGluayA9IFtdO1xuXG4gIH1cblxuICBhZGRSZW1vdGUgKHR5cGUsIHVybCkge1xuXG4gICAgdGhpcy5yZW1vdGVbdHlwZV0gPSB1cmw7XG5cbiAgfVxuXG4gIGdldFJlbW90ZSAodHlwZSwgaWQsIHJlbGF0aW9uKSB7XG5cbiAgICBsZXQgdXJsUGFydHMgPSBfLmNvbXBhY3QoW1xuICAgICAgdGhpcy5yZW1vdGVbdHlwZV0sXG4gICAgICBpZCxcbiAgICAgIHJlbGF0aW9uID8gJ2xpbmtzJyA6IHVuZGVmaW5lZCxcbiAgICAgIHJlbGF0aW9uXG4gICAgXSk7XG4gICAgcmV0dXJuIHVybGpvaW4uYXBwbHkobnVsbCwgdXJsUGFydHMpO1xuXG4gIH1cblxuICBnZXQgKHR5cGUsIGlkKSB7XG5cbiAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIF8uZmlsdGVyKHRoaXMucG9vbCwgcmVzb3VyY2UgPT4ge1xuICAgICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCd0eXBlJykgPT09IHR5cGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gXy5maW5kKHRoaXMucG9vbCwgcmVzb3VyY2UgPT4ge1xuICAgICAgcmV0dXJuIHJlc291cmNlLmdldCgndHlwZScpID09PSB0eXBlICYmXG4gICAgICAgIHJlc291cmNlLmdldCgnaWQnKSA9PT0gaWQ7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGhhcyAodHlwZSwgaWQpIHtcblxuICAgIHJldHVybiAhIV8uZmluZCh0aGlzLnBvb2wsIHJlc291cmNlID0+IHtcbiAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoJ3R5cGUnKSA9PT0gdHlwZSAmJlxuICAgICAgICByZXNvdXJjZS5nZXQoJ2lkJykgPT09IGlkO1xuICAgIH0pO1xuXG4gIH1cblxuICBfY3JlYXRlQmxvYiAoc2VyaWFsaXplZCkge1xuXG4gICAgbGV0IGJpZCA9IHV1aWQudjQoKTtcbiAgICB0aGlzLmJsb2JzW2JpZF0gPSBfLmNsb25lKHNlcmlhbGl6ZWQsIHRydWUpO1xuICAgIHJldHVybiB0aGlzLmJsb2JzW2JpZF07XG5cbiAgfVxuXG4gIF9nZXRCbG9iIChiaWQpIHtcblxuICAgIHJldHVybiB0aGlzLmJsb2JzW2JpZF07XG5cbiAgfVxuXG4gIHB1bGxCeUxpbmsgKGxpbmssIG9wdGlvbnMpIHtcblxuICAgIGxldCB1cmw7XG4gICAgaWYgKF8uaXNTdHJpbmcobGluaykpIHtcbiAgICAgIHVybCA9IGxpbms7XG4gICAgfVxuICAgIGVsc2UgaWYgKGxpbmsubGlua2FnZSkge1xuICAgICAgdXJsID0gdGhpcy5nZXRSZW1vdGUobGluay5saW5rYWdlLnR5cGUsIGxpbmsubGlua2FnZS5pZCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGxpbmsucmVsYXRlZCkge1xuICAgICAgdXJsID0gbGluay5yZWxhdGVkO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBsaW5rLicpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnB1bGxCeVVSTCh1cmwsIG9wdGlvbnMpO1xuXG4gIH1cblxuICBwdWxsICh0eXBlLCBpZCwgb3B0aW9ucykge1xuXG4gICAgcmV0dXJuIHRoaXMucHVsbEJ5VVJMKHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkKSwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIHB1bGxCeVVSTCAodXJsLCBvcHRpb25zKSB7XG5cbiAgICBpZiAoIV8uaXNFbXB0eSh0aGlzLnN0YWdlZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncHVsbCB3aGVuIHN0YWdlZCBjaGFuZ2UgaXMgbm90IGV4aXN0Jyk7XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICBsZXQgaW5jbHVkZWQgPSBvcHRpb25zLmluY2x1ZGVkO1xuICAgIGlmIChpbmNsdWRlZCkge1xuICAgICAgb3B0aW9ucy5pbmNsdWRlZCA9IGluY2x1ZGVkLmpvaW4oJywnKTtcbiAgICB9XG5cbiAgICBsZXQgZmllbGRzID0gb3B0aW9ucy5maWVsZHM7XG4gICAgaWYgKGZpZWxkcykge1xuICAgICAgXy5yZWR1Y2UoZmllbGRzLCAob3B0aW9ucywgZmllbGRzLCB0eXBlKSA9PiB7XG4gICAgICAgIG9wdGlvbnNbYGZpZWxkc1ske3R5cGV9XWBdID0gZmllbGRzLmpvaW4oJywnKTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgICB9LCBvcHRpb25zKTtcbiAgICAgIGRlbGV0ZSBvcHRpb25zLmZpZWxkcztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zeW5jLmdldCh1cmwsIG9wdGlvbnMpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX3NhdmVSZXNwb25zZShyZXNwb25zZSk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHB1c2ggKGlkeCkge1xuXG4gICAgaWR4ID0gaWR4IHx8IHRoaXMuY29tbWl0cy5sZW5ndGggLSAxO1xuXG4gICAgaWYgKGlkeCA8PSB0aGlzLnJlbW90ZUluZGV4KSB7XG4gICAgICByZXR1cm4gUSgpO1xuICAgIH1cblxuICAgIGxldCBhZnRlckNvbW1pdCA9IHRoaXMuZ2V0Q29tbWl0KGlkeCk7XG4gICAgbGV0IGJlZm9yZUNvbW1pdCA9IHRoaXMuZ2V0Q29tbWl0KHRoaXMucmVtb3RlSW5kZXgpO1xuXG4gICAgbGV0IHJlbW92ZWQgPSBfLmRpZmZlcmVuY2UoXG4gICAgICBfLmtleXMoYmVmb3JlQ29tbWl0KSxcbiAgICAgIF8ua2V5cyhhZnRlckNvbW1pdClcbiAgICApO1xuXG4gICAgbGV0IGNoYW5nZWRPckFkZGVkID0gXy53aXRob3V0KFxuICAgICAgXy5rZXlzKGFmdGVyQ29tbWl0KSxcbiAgICAgIF8ua2V5cyhyZW1vdmVkKVxuICAgICk7XG5cbiAgICBsZXQgZGVsZXRlUmVxdWVzdCA9IF8ubWFwKHJlbW92ZWQsIHJpZCA9PiB7XG4gICAgICAvLyBpcyBMaW5rXG4gICAgICBpZiAoIXRoaXMucG9vbFtyaWRdKSB7IHJldHVybjsgfVxuXG4gICAgICBsZXQgdHlwZSA9IHRoaXMucG9vbFtyaWRdLmdldCgndHlwZScpO1xuICAgICAgbGV0IGlkID0gdGhpcy5wb29sW3JpZF0uZ2V0KCdpZCcpO1xuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMuZGVsZXRlKHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkKSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5wb29sW3JpZF07XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgcG9zdE9yUGF0Y2hSZXF1ZXN0ID0gXy5tYXAoY2hhbmdlZE9yQWRkZWQsIHJpZCA9PiB7XG4gICAgICAvLyBpcyBMaW5rXG4gICAgICBpZiAoIXRoaXMucG9vbFtyaWRdKSB7IHJldHVybjsgfVxuICAgICAgLy8gbm90IGNoYW5nZVxuICAgICAgaWYgKF8uaXNFcXVhbChhZnRlckNvbW1pdFtyaWRdLCBiZWZvcmVDb21taXRbcmlkXSkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIGxldCB0eXBlID0gdGhpcy5wb29sW3JpZF0uZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ2lkJyk7XG4gICAgICBsZXQgYmxvYiA9IGFmdGVyQ29tbWl0W3JpZF07XG5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBhdGNoKHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90b1JlcXVlc3QoYmxvYikpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlLCByaWQpKTtcbiAgICAgIH1cbiAgICAgIGlmICghaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5wb3N0KHRoaXMuZ2V0UmVtb3RlKHR5cGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9SZXF1ZXN0KGJsb2IpKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHRoaXMuX3NhdmVSZXNwb25zZShyZXNwb25zZSwgcmlkKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgbGlua09wZXJhdGlvblJlcXVlc3QgPSBfLm1hcChhZnRlckNvbW1pdCwgKHN0YWdlZCwgcmlkKSA9PiB7XG4gICAgICAvLyBpcyByZXNvdXJjZVxuICAgICAgaWYgKHRoaXMucG9vbFtyaWRdIHx8ICFzdGFnZWQub3ApIHsgcmV0dXJuOyB9XG5cbiAgICAgIGxldCB0eXBlID0gc3RhZ2VkLnJlc291cmNlLmdldCgndHlwZScpO1xuICAgICAgbGV0IGlkID0gc3RhZ2VkLnJlc291cmNlLmdldCgnaWQnKTtcbiAgICAgIGxldCBvcHRpb25zID0gXy5kZWZhdWx0cyhzdGFnZWQub3B0aW9ucyB8fCB7fSwge1xuICAgICAgICBoYXNNYW55OiB0cnVlXG4gICAgICB9KTtcbiAgICAgIGxldCBvcCA9IHN0YWdlZC5vcDtcbiAgICAgIGxldCByZWxhdGlvbiA9IHN0YWdlZC5yZWxhdGlvbjtcbiAgICAgIGxldCBsaW5rYWdlID0gc3RhZ2VkLmxpbmthZ2U7XG4gICAgICBsZXQgcmVxdWVzdEJvZHkgPSBvcHRpb25zLmhhc01hbnkgP1xuICAgICAgICB7IGRhdGE6IFtsaW5rYWdlXSB9IDogeyBkYXRhOiBsaW5rYWdlIH07XG5cbiAgICAgIGlmIChvcCA9PT0gJ2FkZCcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5wb3N0KHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkLCByZWxhdGlvbiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0Qm9keSlcbiAgICAgICAgICAudGhlbigoKSA9PiByZXF1ZXN0Qm9keSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcCA9PT0gJ3JlbW92ZScpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5kZWxldGUodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQsIHJlbGF0aW9uKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5KVxuICAgICAgICAgIC50aGVuKCgpID0+IHJlcXVlc3RCb2R5KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBRLmFsbChkZWxldGVSZXF1ZXN0LmNvbmNhdChwb3N0T3JQYXRjaFJlcXVlc3QpKVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0UmVtb3RlSW5kZXgoKTtcbiAgICB9KTtcblxuICB9XG5cbiAgX3NhdmVSZXNwb25zZSAocmVzcG9uc2UsIHJpZCkge1xuXG4gICAgbGV0IG1haW5SZXNvdXJjZSA9IHRoaXMuX3NhdmVEYXRhKHJlc3BvbnNlLmRhdGEsIHJpZCk7XG4gICAgbGV0IGluY2x1ZGVkUmVzb3VyY2VzID0gXy5tYXAoXG4gICAgICByZXNwb25zZS5pbmNsdWRlZCwgZGF0YSA9PiB0aGlzLl9zYXZlRGF0YShkYXRhKSk7XG4gICAgcmV0dXJuIG1haW5SZXNvdXJjZTtcblxuICB9XG5cbiAgX3NhdmVEYXRhIChkYXRhLCByaWQpIHtcblxuICAgIGlmIChfLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChkYXRhLCBkYXRhID0+IHRoaXMuX3NhdmVEYXRhKGRhdGEpKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzb3VyY2UgPSByaWQgIT09IHVuZGVmaW5lZCA/XG4gICAgICB0aGlzLnBvb2xbcmlkXSA6IHRoaXMuZ2V0KGRhdGEudHlwZSwgZGF0YS5pZCk7XG5cbiAgICBpZiAoIXJlc291cmNlKSB7XG4gICAgICByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZShkYXRhKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXNvdXJjZS5kZXNlcmlhbGl6ZShkYXRhKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhZ2VkQmFja3VwID0gXy5jbG9uZSh0aGlzLnN0YWdlZCwgdHJ1ZSk7XG5cbiAgICB0aGlzLmFkZChyZXNvdXJjZSk7XG4gICAgdGhpcy5jb21taXQoKTtcbiAgICB0aGlzLnNldFJlbW90ZUluZGV4KCk7XG5cbiAgICB0aGlzLnN0YWdlZCA9IHN0YWdlZEJhY2t1cDtcblxuICAgIHJldHVybiByZXNvdXJjZTtcblxuICB9XG5cbiAgX3RvUmVxdWVzdCAoc2VyaWFsaXplZCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IHNlcmlhbGl6ZWRcbiAgICB9O1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFBvb2w7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9Qb29sLmpzXG4gKiovIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCBSZXNwb25zZSBmcm9tICcuL1Jlc3BvbnNlJztcblxuXG5sZXQgc3RyaW5naWZ5UmVxdWlyZWRNZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gIC8vIHRoZXNlIEhUVFAgbWV0aG9kcyByZXF1aXJlcyBKU09OLnN0cmluZ2lmeVxuICByZXR1cm4gKC9eKFBPU1R8UFVUfFBBVENIfERFTEVURSkkLy50ZXN0KG1ldGhvZC50b1VwcGVyQ2FzZSgpKSk7XG59O1xuXG5sZXQgbWFrZUFqYXhSZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBpZiAoc3RyaW5naWZ5UmVxdWlyZWRNZXRob2Qob3B0aW9ucy50eXBlKSkge1xuICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgIG9wdGlvbnMuZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgb3B0aW9ucy51cmwgPSBvcHRpb25zLnVybC5yZXBsYWNlKC9cXC8/JC8sICcvJyk7XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL3dpa2kvQ29taW5nLWZyb20talF1ZXJ5XG4gIHJldHVybiBRLnByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICQuYWpheChvcHRpb25zKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZmFpbChmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZWplY3QocmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH0pO1xuXG59O1xuXG5cblxubGV0IFJFU1RmdWwgPSB7XG5cbiAgaGVhZDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJIRUFEXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGdldDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcG9zdDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHB1dDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQVVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcGF0Y2g6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUEFUQ0hcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZGVsZXRlOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkRFTEVURVwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBkZWZhdWx0T3B0aW9uczoge1xuXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICBwcm9jZXNzRGF0YTogdHJ1ZVxuXG4gIH0sXG5cbiAgYWpheFNldHVwOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gICAgJC5hamF4U2V0dXAob3B0aW9ucyk7XG5cbiAgfVxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBSRVNUZnVsO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvUkVTVGZ1bC5qc1xuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcblxuXG5jbGFzcyBUcmFuc2FjdGlvbiB7XG5cbiAgY29uc3RydWN0b3IocG9vbCwgb3B0aW9ucykge1xuXG4gICAgXy5leHRlbmQodGhpcywgRXZlbnRzKTtcbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMucG9vbCA9IHBvb2w7XG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG5cbiAgfVxuXG4gIGJlZ2luICgpIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuX2FjdGl2YXRlKCk7XG5cbiAgfVxuXG4gIGNvbW1pdCAoKSB7XG5cbiAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XG5cbiAgfVxuXG5cbiAgX2FjdGl2YXRlICgpIHtcblxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gIH1cblxuICBfZGVhY3RpdmF0ZSAoKSB7XG5cbiAgICB0aGlzLnN0b3BMaXN0ZW5pbmcodGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICB9XG5cbiAgb25UcmFuc2Zvcm0gKG9wZXJhdGlvbikge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zLnB1c2gob3BlcmF0aW9uKTtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHJhbnNhY3Rpb247XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9UcmFuc2FjdGlvbi5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImxvZGFzaFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwibG9kYXNoXCJcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJub2RlLXV1aWRcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcIm5vZGUtdXVpZFwiXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicVwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwicVwiXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXJsLWpvaW5cIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInVybC1qb2luXCJcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImpxdWVyeVwiXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFja2JvbmVcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImJhY2tib25lXCJcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuXG5sZXQgX3ZhbGlkYXRlUmVzcG9uc2UgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgbGV0IGJvZHkgPSB4aHIucmVzcG9uc2VKU09OO1xuXG4gIGlmIChib2R5LmRhdGEgPT09IHVuZGVmaW5lZCAmJiBib2R5LmVycm9ycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQSBkb2N1bWVudCBNVVNUIGNvbnRhaW4gZWl0aGVyIHByaW1hcnkgZGF0YSBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwib3IgYW4gYXJyYXkgb2YgZXJyb3Igb2JqZWN0cy5cIik7XG4gIH1cblxufTtcblxuXG5sZXQgX2lzUmVzcG9uc2VFcnJvciA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcblxuICByZXR1cm4gNDAwIDw9IHN0YXR1cyAmJiA2MDAgPiBzdGF0dXMgO1xuXG59O1xuXG5cbmxldCBfcGFyc2VEYXRhID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICgheGhyLnJlc3BvbnNlSlNPTikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB4aHIucmVzcG9uc2VKU09OLmRhdGE7XG5cbn07XG5cbmxldCBfcGFyc2VJbmNsdWRlZCA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBpZiAoIXhoci5yZXNwb25zZUpTT04pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4geGhyLnJlc3BvbnNlSlNPTi5pbmNsdWRlZDtcblxufTtcblxubGV0IF9wYXJzZUVycm9ycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBpZiAoISh4aHIucmVzcG9uc2VKU09OICYmIHhoci5yZXNwb25zZUpTT04uZXJyb3JzICkpIHtcbiAgICBpZiAoX2lzUmVzcG9uc2VFcnJvcih4aHIuc3RhdHVzKSkge1xuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIHN0YXR1czogXCJcIiArIHhoci5zdGF0dXNcbiAgICAgIH1dO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCBlcnJvcnMgPSB4aHIucmVzcG9uc2VKU09OLmVycm9ycztcblxuICByZXR1cm4gXy5tYXAoZXJyb3JzLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICByZXR1cm4gXy5leHRlbmQoe1xuICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgIH0sIGVycm9yKTtcbiAgfSk7XG5cbn07XG5cblxubGV0IF9wYXJzZUhlYWRlcnMgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgbGV0IHJlc3VsdCA9IFtdO1xuXG4gIGxldCBoZWFkZXJSZWdleCA9IC9eKC4qPyk6WyBcXHRdKihbXlxcclxcbl0qKSQvbWc7XG4gIGxldCBoZWFkZXJzU3RyaW5nID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpO1xuICBsZXQgZmluZFJlc3VsdDtcblxuICB3aGlsZSAoKGZpbmRSZXN1bHQgPSBoZWFkZXJSZWdleC5leGVjKGhlYWRlcnNTdHJpbmcpKSAhPT0gbnVsbCkge1xuICAgIHJlc3VsdC5wdXNoKGZpbmRSZXN1bHQuc2xpY2UoMSkpO1xuICB9XG5cbiAgcmV0dXJuIF8ub2JqZWN0KHJlc3VsdCk7XG5cbn07XG5cblxuY2xhc3MgUmVzcG9uc2Uge1xuXG4gIGNvbnN0cnVjdG9yICh4aHIpIHtcblxuICAgIHRoaXMucmVzcG9uc2VKU09OID0geGhyLnJlc3BvbnNlSlNPTjtcbiAgICB0aGlzLmRhdGEgPSBfcGFyc2VEYXRhKHhocik7XG4gICAgdGhpcy5pbmNsdWRlZCA9IF9wYXJzZUluY2x1ZGVkKHhocik7XG4gICAgdGhpcy5lcnJvcnMgPSBfcGFyc2VFcnJvcnMoeGhyKTtcbiAgICB0aGlzLmhlYWRlcnMgPSBfcGFyc2VIZWFkZXJzKHhocik7XG4gICAgdGhpcy5uYXRpdmVYSFIgPSB4aHI7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvUmVzcG9uc2UuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9