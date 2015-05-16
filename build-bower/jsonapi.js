(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("$"), require("_"), require("Q"), require("uuid"), require("Backbone"), require("urljoin"));
	else if(typeof define === 'function' && define.amd)
		define(["$", "_", "Q", "uuid", "Backbone", "urljoin"], factory);
	else if(typeof exports === 'object')
		exports["JSONAPI"] = factory(require("$"), require("_"), require("Q"), require("uuid"), require("Backbone"), require("urljoin"));
	else
		root["JSONAPI"] = factory(root["$"], root["_"], root["Q"], root["uuid"], root["Backbone"], root["urljoin"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__) {
return /******/ (function(modules) { // webpackBootstrap
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
	
	var _lodash = __webpack_require__(6);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _nodeUuid = __webpack_require__(8);
	
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
	
	var _lodash = __webpack_require__(6);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _q = __webpack_require__(7);
	
	var _q2 = _interopRequireDefault(_q);
	
	var _urlJoin = __webpack_require__(10);
	
	var _urlJoin2 = _interopRequireDefault(_urlJoin);
	
	var _nodeUuid = __webpack_require__(8);
	
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
	
	var _jquery = __webpack_require__(5);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _lodash = __webpack_require__(6);
	
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
	    }, this.defaultOptions, options);
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
	
	var _lodash = __webpack_require__(6);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _q = __webpack_require__(7);
	
	var _q2 = _interopRequireDefault(_q);
	
	var _backbone = __webpack_require__(9);
	
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

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _lodash = __webpack_require__(6);
	
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
/******/ ])
});
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA1YjQxYmEzNDk2NjBhNWQwNzEwZSIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvUmVzb3VyY2UuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1Bvb2wuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1JFU1RmdWwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1RyYW5zYWN0aW9uLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcIiRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJfXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiUVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInV1aWRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJCYWNrYm9uZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInVybGpvaW5cIiIsIndlYnBhY2s6Ly8vLi9saWIvUmVzcG9uc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7d0NDdENxQixDQUFnQjs7OztvQ0FDcEIsQ0FBWTs7Ozt1Q0FDVCxDQUFlOzs7OzJDQUNYLENBQW1COzs7O1NBSXpDLFdBQVc7U0FDWCxRQUFRO1NBQ1IsSUFBSTtTQUNKLE9BQU8sMkI7Ozs7Ozs7Ozs7Ozs7Ozs7OzttQ0NWSyxDQUFROzs7O3FDQUNMLENBQVc7Ozs7S0FHdEIsUUFB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LE9BQUksV0FBVyxHQUFHLDRCQUE0QixDQUFDO0FBQy9DLE9BQUksYUFBYSxHQUFHLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQ2hELE9BQUksVUFBVSxhQUFDOztBQUVmLFVBQU8sQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLEVBQUU7QUFDOUQsV0FBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEM7O0FBRUQsVUFBTyxvQkFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7RUFFekIsQ0FBQzs7S0FHSSxRQUFRLEdBRUEsU0FGUixRQUFRLENBRUMsR0FBRyxFQUFFO3lCQUZkLFFBQVE7O0FBSVYsT0FBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO0FBQ3JDLE9BQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLE9BQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLE9BQUksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLE9BQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLE9BQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0VBRXRCOztzQkFJWSxRQUFRIiwiZmlsZSI6Impzb25hcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCIkXCIpLCByZXF1aXJlKFwiX1wiKSwgcmVxdWlyZShcIlFcIiksIHJlcXVpcmUoXCJ1dWlkXCIpLCByZXF1aXJlKFwiQmFja2JvbmVcIiksIHJlcXVpcmUoXCJ1cmxqb2luXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcIiRcIiwgXCJfXCIsIFwiUVwiLCBcInV1aWRcIiwgXCJCYWNrYm9uZVwiLCBcInVybGpvaW5cIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiSlNPTkFQSVwiXSA9IGZhY3RvcnkocmVxdWlyZShcIiRcIiksIHJlcXVpcmUoXCJfXCIpLCByZXF1aXJlKFwiUVwiKSwgcmVxdWlyZShcInV1aWRcIiksIHJlcXVpcmUoXCJCYWNrYm9uZVwiKSwgcmVxdWlyZShcInVybGpvaW5cIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkpTT05BUElcIl0gPSBmYWN0b3J5KHJvb3RbXCIkXCJdLCByb290W1wiX1wiXSwgcm9vdFtcIlFcIl0sIHJvb3RbXCJ1dWlkXCJdLCByb290W1wiQmFja2JvbmVcIl0sIHJvb3RbXCJ1cmxqb2luXCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNV9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzZfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV83X18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfOF9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzlfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xMF9fKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA1YjQxYmEzNDk2NjBhNWQwNzEwZVxuICoqLyIsImltcG9ydCBSZXNvdXJjZSBmcm9tICcuL2xpYi9SZXNvdXJjZSc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL2xpYi9Qb29sJztcbmltcG9ydCBSRVNUZnVsIGZyb20gJy4vbGliL1JFU1RmdWwnO1xuaW1wb3J0IFRyYW5zYWN0aW9uIGZyb20gJy4vbGliL1RyYW5zYWN0aW9uJztcblxuXG5leHBvcnQge1xuICBUcmFuc2FjdGlvbixcbiAgUmVzb3VyY2UsXG4gIFBvb2wsXG4gIFJFU1RmdWxcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2luZGV4LmpzXG4gKiovIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5cblxuY2xhc3MgUmVzb3VyY2Uge1xuXG4gIGNvbnN0cnVjdG9yKGF0dHJpYnV0ZXMpIHtcblxuICAgIHRoaXMuYXR0cmlidXRlcyA9IHt9O1xuICAgIHRoaXMubGlua3MgPSB7fTtcbiAgICB0aGlzLnJpZCA9IHV1aWQudjQoKTtcblxuICAgIHRoaXMuZGVzZXJpYWxpemUoYXR0cmlidXRlcyk7XG5cbiAgfVxuXG4gIGdldCAoa2V5KSB7XG5cbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2tleV07XG5cbiAgfVxuXG4gIHNldCAoYXR0cmlidXRlcykge1xuXG4gICAgXy5leHRlbmQodGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcblxuICB9XG5cbiAgdW5zZXQgKGtleSkge1xuXG4gICAgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1trZXldO1xuXG4gIH1cblxuICBnZXRMaW5rIChrZXkpIHtcblxuICAgIGtleSA9IGtleSB8fCAnc2VsZic7XG4gICAgcmV0dXJuIHRoaXMubGlua3Nba2V5XTtcblxuICB9XG5cbiAgc2V0TGluayAobGlua3MpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMubGlua3MsIGxpbmtzKTtcblxuICB9XG5cbiAgdW5zZXRMaW5rIChrZXkpIHtcblxuICAgIGRlbGV0ZSB0aGlzLmxpbmtzW2tleV07XG5cbiAgfVxuXG4gIGdldExpbmthZ2UgKCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHRoaXMuYXR0cmlidXRlcy50eXBlLFxuICAgICAgaWQ6IHRoaXMuYXR0cmlidXRlcy5pZFxuICAgIH07XG5cbiAgfVxuXG4gIHNlcmlhbGl6ZSAoKSB7XG5cbiAgICBsZXQgcmVzdWx0ID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMsIHRydWUpO1xuICAgIHJlc3VsdC5saW5rcyA9IHRoaXMubGlua3M7XG5cbiAgICBpZiAoXy5pc0VtcHR5KHJlc3VsdC5saW5rcykpIHtcbiAgICAgIGRlbGV0ZSByZXN1bHQubGlua3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcblxuICB9XG5cbiAgZGVzZXJpYWxpemUgKHNlcmlhbGl6ZWQpIHtcblxuICAgIGlmICghdGhpcy5fdmFsaWRhdGVTZXJpYWxpemVkKHNlcmlhbGl6ZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZGF0YSEgdHlwZSBzaG91bGQgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldChfLmNsb25lKF8ub21pdChzZXJpYWxpemVkLCAnbGlua3MnKSwgdHJ1ZSkpO1xuICAgIHRoaXMuc2V0TGluayhzZXJpYWxpemVkLmxpbmtzKTtcblxuICB9XG5cbiAgY2xvbmUgKCkge1xuXG4gICAgbGV0IHJlc291cmNlID0gbmV3IFJlc291cmNlKHRoaXMuc2VyaWFsaXplKCkpO1xuICAgIHJlc291cmNlLnV1aWQgPSB0aGlzLnV1aWQ7XG4gICAgcmV0dXJuIHJlc291cmNlO1xuXG4gIH1cblxuICBfdmFsaWRhdGVTZXJpYWxpemVkIChzZXJpYWxpemVkKSB7XG5cbiAgICByZXR1cm4gc2VyaWFsaXplZCAmJiBzZXJpYWxpemVkLnR5cGU7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2U7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9SZXNvdXJjZS5qc1xuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB1cmxqb2luIGZyb20gJ3VybC1qb2luJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9SZXNvdXJjZSc7XG5pbXBvcnQgUkVTVGZ1bCBmcm9tICcuL1JFU1RmdWwnO1xuXG5cbmNsYXNzIFBvb2wge1xuXG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG5cbiAgICB0aGlzLnN5bmMgPSBSRVNUZnVsO1xuICAgIHRoaXMucmVzZXRBbGwoKTtcblxuICB9XG5cbiAgcmVzZXRBbGwgKCkge1xuXG4gICAgdGhpcy5wb29sID0ge307XG4gICAgdGhpcy5ibG9icyA9IHt9O1xuICAgIHRoaXMuc3RhZ2VkID0ge307XG4gICAgdGhpcy5zdGFnZWRMaW5rID0gW107XG4gICAgdGhpcy5yZW1vdGUgPSB7fTtcbiAgICB0aGlzLmNvbW1pdHMgPSBbXTtcbiAgICB0aGlzLnJlbW90ZUluZGV4ID0gLTE7XG5cbiAgfVxuXG4gIGdldENvbW1pdCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggIT09IHVuZGVmaW5lZCA/IGlkeCA6IHRoaXMuY29tbWl0cy5sZW5ndGggLSAxO1xuICAgIHJldHVybiB0aGlzLmNvbW1pdHNbaWR4XSB8fCB7fTtcblxuICB9XG5cbiAgc2V0UmVtb3RlSW5kZXggKGlkeCkge1xuXG4gICAgaWR4ID0gaWR4ICE9PSB1bmRlZmluZWQgPyBpZHggOiB0aGlzLmNvbW1pdHMubGVuZ3RoIC0gMTtcbiAgICB0aGlzLnJlbW90ZUluZGV4ID0gaWR4O1xuXG4gIH1cblxuICBybSAocmVzb3VyY2UpIHtcblxuICAgIGlmKF8uaXNBcnJheShyZXNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChyZXNvdXJjZSwgcmVzb3VyY2UgPT4gdGhpcy5ybShyZXNvdXJjZSkpO1xuICAgIH1cblxuICAgIGxldCByaWQgPSByZXNvdXJjZS5yaWQ7XG5cbiAgICB0aGlzLnN0YWdlZFtyaWRdID0gbnVsbDtcblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyaWRdO1xuXG4gIH1cblxuICBhZGQgKHJlc291cmNlKSB7XG5cbiAgICBpZihfLmlzQXJyYXkocmVzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gXy5tYXAocmVzb3VyY2UsIHJlc291cmNlID0+IHRoaXMuYWRkKHJlc291cmNlKSk7XG4gICAgfVxuXG4gICAgbGV0IHJpZCA9IHJlc291cmNlLnJpZDtcblxuICAgIGlmICghdGhpcy5wb29sW3JpZF0pIHtcbiAgICAgIHRoaXMucG9vbFtyaWRdID0gcmVzb3VyY2U7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFnZWRbcmlkXSA9IHJlc291cmNlLnNlcmlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3JpZF07XG5cbiAgfVxuXG4gIHJtTGlua2FnZSAocmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSB7XG5cbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlTGlua2FnZU9wZXJhdGlvbihcbiAgICAgICdyZW1vdmUnLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpO1xuXG4gIH1cblxuICBhZGRMaW5rYWdlIChyZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uKFxuICAgICAgJ2FkZCcsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIF9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uIChvcCwgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSB7XG5cbiAgICBpZihfLmlzQXJyYXkobGlua2FnZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChsaW5rYWdlLCBsaW5rYWdlID0+IHRoaXMuX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24oXG4gICAgICAgIG9wLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhZ2VkID0ge1xuICAgICAgb3AsXG4gICAgICByZXNvdXJjZSxcbiAgICAgIHJlbGF0aW9uLFxuICAgICAgbGlua2FnZSxcbiAgICAgIG9wdGlvbnNcbiAgICB9O1xuXG4gICAgdGhpcy5zdGFnZWRMaW5rLnB1c2goc3RhZ2VkKTtcblxuICAgIHJldHVybiBzdGFnZWQ7XG5cbiAgfVxuXG4gIGdldFN0YWdlZCAocmVzb3VyY2UpIHtcblxuICAgIGlmICghdGhpcy5pc1N0YWdlZChyZXNvdXJjZSkpIHtcbiAgICAgIHRocm93IEVycm9yKGBjYW4gbm90IGZpbmQgJHtyZXNvdXJjZX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmVzb3VyY2UucmlkXTtcblxuICB9XG5cbiAgaXNTdGFnZWQgKHJlc291cmNlKSB7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmVzb3VyY2UucmlkXSAhPT0gdW5kZWZpbmVkO1xuXG4gIH1cblxuICBjb21taXQgKCkge1xuXG4gICAgbGV0IGxhc3RDb21taXQgPSB0aGlzLmdldENvbW1pdCgpO1xuXG4gICAgbGV0IG5ld0NvbW1pdCA9IF8ucmVkdWNlKHRoaXMuc3RhZ2VkLCAoY29tbWl0LCBzZXJpYWxpemVkLCByaWQpID0+IHtcbiAgICAgIGlmICghc2VyaWFsaXplZCkge1xuICAgICAgICBpZiAoY29tbWl0W3JpZF0pIHtcbiAgICAgICAgICBkZWxldGUgY29tbWl0W3JpZF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjb21taXRbcmlkXSA9IHRoaXMuX2NyZWF0ZUJsb2Ioc2VyaWFsaXplZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29tbWl0O1xuICAgIH0sIF8uY2xvbmUobGFzdENvbW1pdCwgdHJ1ZSkpO1xuXG4gICAgXy5yZWR1Y2UodGhpcy5zdGFnZWRMaW5rLCAoY29tbWl0LCBsaW5rT3BlcmF0aW9uKSA9PiB7XG4gICAgICBjb21taXRbdXVpZC52NCgpXSA9IGxpbmtPcGVyYXRpb247XG4gICAgICByZXR1cm4gY29tbWl0O1xuICAgIH0sIG5ld0NvbW1pdCk7XG5cbiAgICB0aGlzLmNvbW1pdHMucHVzaChuZXdDb21taXQpO1xuICAgIHRoaXMuc3RhZ2VkID0ge307XG4gICAgdGhpcy5zdGFnZWRMaW5rID0gW107XG5cbiAgfVxuXG4gIGFkZFJlbW90ZSAodHlwZSwgdXJsKSB7XG5cbiAgICB0aGlzLnJlbW90ZVt0eXBlXSA9IHVybDtcblxuICB9XG5cbiAgZ2V0UmVtb3RlICh0eXBlLCBpZCwgcmVsYXRpb24pIHtcblxuICAgIGxldCB1cmxQYXJ0cyA9IF8uY29tcGFjdChbXG4gICAgICB0aGlzLnJlbW90ZVt0eXBlXSxcbiAgICAgIGlkLFxuICAgICAgcmVsYXRpb24gPyAnbGlua3MnIDogdW5kZWZpbmVkLFxuICAgICAgcmVsYXRpb25cbiAgICBdKTtcbiAgICByZXR1cm4gdXJsam9pbi5hcHBseShudWxsLCB1cmxQYXJ0cyk7XG5cbiAgfVxuXG4gIGdldCAodHlwZSwgaWQpIHtcblxuICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoJ3R5cGUnKSA9PT0gdHlwZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBfLmZpbmQodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCd0eXBlJykgPT09IHR5cGUgJiZcbiAgICAgICAgcmVzb3VyY2UuZ2V0KCdpZCcpID09PSBpZDtcbiAgICB9KTtcblxuICB9XG5cbiAgaGFzICh0eXBlLCBpZCkge1xuXG4gICAgcmV0dXJuICEhXy5maW5kKHRoaXMucG9vbCwgcmVzb3VyY2UgPT4ge1xuICAgICAgcmV0dXJuIHJlc291cmNlLmdldCgndHlwZScpID09PSB0eXBlICYmXG4gICAgICAgIHJlc291cmNlLmdldCgnaWQnKSA9PT0gaWQ7XG4gICAgfSk7XG5cbiAgfVxuXG4gIF9jcmVhdGVCbG9iIChzZXJpYWxpemVkKSB7XG5cbiAgICBsZXQgYmlkID0gdXVpZC52NCgpO1xuICAgIHRoaXMuYmxvYnNbYmlkXSA9IF8uY2xvbmUoc2VyaWFsaXplZCwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXMuYmxvYnNbYmlkXTtcblxuICB9XG5cbiAgX2dldEJsb2IgKGJpZCkge1xuXG4gICAgcmV0dXJuIHRoaXMuYmxvYnNbYmlkXTtcblxuICB9XG5cbiAgcHVsbEJ5TGluayAobGluaywgb3B0aW9ucykge1xuXG4gICAgbGV0IHVybDtcbiAgICBpZiAoXy5pc1N0cmluZyhsaW5rKSkge1xuICAgICAgdXJsID0gbGluaztcbiAgICB9XG4gICAgZWxzZSBpZiAobGluay5saW5rYWdlKSB7XG4gICAgICB1cmwgPSB0aGlzLmdldFJlbW90ZShsaW5rLmxpbmthZ2UudHlwZSwgbGluay5saW5rYWdlLmlkKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobGluay5yZWxhdGVkKSB7XG4gICAgICB1cmwgPSBsaW5rLnJlbGF0ZWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGxpbmsuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHVsbEJ5VVJMKHVybCwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIHB1bGwgKHR5cGUsIGlkLCBvcHRpb25zKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wdWxsQnlVUkwodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpLCBvcHRpb25zKTtcblxuICB9XG5cbiAgcHVsbEJ5VVJMICh1cmwsIG9wdGlvbnMpIHtcblxuICAgIGlmICghXy5pc0VtcHR5KHRoaXMuc3RhZ2VkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwdWxsIHdoZW4gc3RhZ2VkIGNoYW5nZSBpcyBub3QgZXhpc3QnKTtcbiAgICB9XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIGxldCBpbmNsdWRlZCA9IG9wdGlvbnMuaW5jbHVkZWQ7XG4gICAgaWYgKGluY2x1ZGVkKSB7XG4gICAgICBvcHRpb25zLmluY2x1ZGVkID0gaW5jbHVkZWQuam9pbignLCcpO1xuICAgIH1cblxuICAgIGxldCBmaWVsZHMgPSBvcHRpb25zLmZpZWxkcztcbiAgICBpZiAoZmllbGRzKSB7XG4gICAgICBfLnJlZHVjZShmaWVsZHMsIChvcHRpb25zLCBmaWVsZHMsIHR5cGUpID0+IHtcbiAgICAgICAgb3B0aW9uc1tgZmllbGRzWyR7dHlwZX1dYF0gPSBmaWVsZHMuam9pbignLCcpO1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICAgIH0sIG9wdGlvbnMpO1xuICAgICAgZGVsZXRlIG9wdGlvbnMuZmllbGRzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN5bmMuZ2V0KHVybCwgb3B0aW9ucylcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICB9KTtcblxuICB9XG5cbiAgcHVzaCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggfHwgdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG5cbiAgICBpZiAoaWR4IDw9IHRoaXMucmVtb3RlSW5kZXgpIHtcbiAgICAgIHJldHVybiBRKCk7XG4gICAgfVxuXG4gICAgbGV0IGFmdGVyQ29tbWl0ID0gdGhpcy5nZXRDb21taXQoaWR4KTtcbiAgICBsZXQgYmVmb3JlQ29tbWl0ID0gdGhpcy5nZXRDb21taXQodGhpcy5yZW1vdGVJbmRleCk7XG5cbiAgICBsZXQgcmVtb3ZlZCA9IF8uZGlmZmVyZW5jZShcbiAgICAgIF8ua2V5cyhiZWZvcmVDb21taXQpLFxuICAgICAgXy5rZXlzKGFmdGVyQ29tbWl0KVxuICAgICk7XG5cbiAgICBsZXQgY2hhbmdlZE9yQWRkZWQgPSBfLndpdGhvdXQoXG4gICAgICBfLmtleXMoYWZ0ZXJDb21taXQpLFxuICAgICAgXy5rZXlzKHJlbW92ZWQpXG4gICAgKTtcblxuICAgIGxldCBkZWxldGVSZXF1ZXN0ID0gXy5tYXAocmVtb3ZlZCwgcmlkID0+IHtcbiAgICAgIC8vIGlzIExpbmtcbiAgICAgIGlmICghdGhpcy5wb29sW3JpZF0pIHsgcmV0dXJuOyB9XG5cbiAgICAgIGxldCB0eXBlID0gdGhpcy5wb29sW3JpZF0uZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ2lkJyk7XG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5kZWxldGUodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnBvb2xbcmlkXTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBwb3N0T3JQYXRjaFJlcXVlc3QgPSBfLm1hcChjaGFuZ2VkT3JBZGRlZCwgcmlkID0+IHtcbiAgICAgIC8vIGlzIExpbmtcbiAgICAgIGlmICghdGhpcy5wb29sW3JpZF0pIHsgcmV0dXJuOyB9XG4gICAgICAvLyBub3QgY2hhbmdlXG4gICAgICBpZiAoXy5pc0VxdWFsKGFmdGVyQ29tbWl0W3JpZF0sIGJlZm9yZUNvbW1pdFtyaWRdKSkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ3R5cGUnKTtcbiAgICAgIGxldCBpZCA9IHRoaXMucG9vbFtyaWRdLmdldCgnaWQnKTtcbiAgICAgIGxldCBibG9iID0gYWZ0ZXJDb21taXRbcmlkXTtcblxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMucGF0Y2godGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvUmVxdWVzdChibG9iKSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB0aGlzLl9zYXZlUmVzcG9uc2UocmVzcG9uc2UsIHJpZCkpO1xuICAgICAgfVxuICAgICAgaWYgKCFpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBvc3QodGhpcy5nZXRSZW1vdGUodHlwZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90b1JlcXVlc3QoYmxvYikpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlLCByaWQpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBsaW5rT3BlcmF0aW9uUmVxdWVzdCA9IF8ubWFwKGFmdGVyQ29tbWl0LCAoc3RhZ2VkLCByaWQpID0+IHtcbiAgICAgIC8vIGlzIHJlc291cmNlXG4gICAgICBpZiAodGhpcy5wb29sW3JpZF0gfHwgIXN0YWdlZC5vcCkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSBzdGFnZWQucmVzb3VyY2UuZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSBzdGFnZWQucmVzb3VyY2UuZ2V0KCdpZCcpO1xuICAgICAgbGV0IG9wdGlvbnMgPSBfLmRlZmF1bHRzKHN0YWdlZC5vcHRpb25zIHx8IHt9LCB7XG4gICAgICAgIGhhc01hbnk6IHRydWVcbiAgICAgIH0pO1xuICAgICAgbGV0IG9wID0gc3RhZ2VkLm9wO1xuICAgICAgbGV0IHJlbGF0aW9uID0gc3RhZ2VkLnJlbGF0aW9uO1xuICAgICAgbGV0IGxpbmthZ2UgPSBzdGFnZWQubGlua2FnZTtcbiAgICAgIGxldCByZXF1ZXN0Qm9keSA9IG9wdGlvbnMuaGFzTWFueSA/XG4gICAgICAgIHsgZGF0YTogW2xpbmthZ2VdIH0gOiB7IGRhdGE6IGxpbmthZ2UgfTtcblxuICAgICAgaWYgKG9wID09PSAnYWRkJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBvc3QodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQsIHJlbGF0aW9uKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5KVxuICAgICAgICAgIC50aGVuKCgpID0+IHJlcXVlc3RCb2R5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wID09PSAncmVtb3ZlJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLmRlbGV0ZSh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCwgcmVsYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHkpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gcmVxdWVzdEJvZHkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuYWxsKGRlbGV0ZVJlcXVlc3QuY29uY2F0KHBvc3RPclBhdGNoUmVxdWVzdCkpXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5zZXRSZW1vdGVJbmRleCgpO1xuICAgIH0pO1xuXG4gIH1cblxuICBfc2F2ZVJlc3BvbnNlIChyZXNwb25zZSwgcmlkKSB7XG5cbiAgICBsZXQgbWFpblJlc291cmNlID0gdGhpcy5fc2F2ZURhdGEocmVzcG9uc2UuZGF0YSwgcmlkKTtcbiAgICBsZXQgaW5jbHVkZWRSZXNvdXJjZXMgPSBfLm1hcChcbiAgICAgIHJlc3BvbnNlLmluY2x1ZGVkLCBkYXRhID0+IHRoaXMuX3NhdmVEYXRhKGRhdGEpKTtcbiAgICByZXR1cm4gbWFpblJlc291cmNlO1xuXG4gIH1cblxuICBfc2F2ZURhdGEgKGRhdGEsIHJpZCkge1xuXG4gICAgaWYgKF8uaXNBcnJheShkYXRhKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKGRhdGEsIGRhdGEgPT4gdGhpcy5fc2F2ZURhdGEoZGF0YSkpO1xuICAgIH1cblxuICAgIGxldCByZXNvdXJjZSA9IHJpZCAhPT0gdW5kZWZpbmVkID9cbiAgICAgIHRoaXMucG9vbFtyaWRdIDogdGhpcy5nZXQoZGF0YS50eXBlLCBkYXRhLmlkKTtcblxuICAgIGlmICghcmVzb3VyY2UpIHtcbiAgICAgIHJlc291cmNlID0gbmV3IFJlc291cmNlKGRhdGEpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJlc291cmNlLmRlc2VyaWFsaXplKGRhdGEpO1xuICAgIH1cblxuICAgIGxldCBzdGFnZWRCYWNrdXAgPSBfLmNsb25lKHRoaXMuc3RhZ2VkLCB0cnVlKTtcblxuICAgIHRoaXMuYWRkKHJlc291cmNlKTtcbiAgICB0aGlzLmNvbW1pdCgpO1xuICAgIHRoaXMuc2V0UmVtb3RlSW5kZXgoKTtcblxuICAgIHRoaXMuc3RhZ2VkID0gc3RhZ2VkQmFja3VwO1xuXG4gICAgcmV0dXJuIHJlc291cmNlO1xuXG4gIH1cblxuICBfdG9SZXF1ZXN0IChzZXJpYWxpemVkKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogc2VyaWFsaXplZFxuICAgIH07XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUG9vbDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL1Bvb2wuanNcbiAqKi8iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IFJlc3BvbnNlIGZyb20gJy4vUmVzcG9uc2UnO1xuXG5cbmxldCBzdHJpbmdpZnlSZXF1aXJlZE1ldGhvZCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgLy8gdGhlc2UgSFRUUCBtZXRob2RzIHJlcXVpcmVzIEpTT04uc3RyaW5naWZ5XG4gIHJldHVybiAoL14oUE9TVHxQVVR8UEFUQ0h8REVMRVRFKSQvLnRlc3QobWV0aG9kLnRvVXBwZXJDYXNlKCkpKTtcbn07XG5cbmxldCBtYWtlQWpheFJlcXVlc3QgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGlmIChzdHJpbmdpZnlSZXF1aXJlZE1ldGhvZChvcHRpb25zLnR5cGUpKSB7XG4gICAgaWYgKG9wdGlvbnMuY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJykge1xuICAgICAgb3B0aW9ucy5kYXRhID0gSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5kYXRhKTtcbiAgICB9XG4gIH1cblxuICBvcHRpb25zLnVybCA9IG9wdGlvbnMudXJsLnJlcGxhY2UoL1xcLz8kLywgJy8nKTtcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL3Evd2lraS9Db21pbmctZnJvbS1qUXVlcnlcbiAgcmV0dXJuIFEucHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgJC5hamF4KG9wdGlvbnMpXG4gICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcbiAgICAgICAgZGVsZXRlIGpxWEhSLnRoZW47IC8vIHRyZWF0IHhociBhcyBhIG5vbi1wcm9taXNlXG4gICAgICAgIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShqcVhIUik7XG4gICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5mYWlsKGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgZGVsZXRlIGpxWEhSLnRoZW47IC8vIHRyZWF0IHhociBhcyBhIG5vbi1wcm9taXNlXG4gICAgICAgIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShqcVhIUik7XG4gICAgICAgIHJlamVjdChyZXNwb25zZSk7XG4gICAgICB9KTtcbiAgfSk7XG5cbn07XG5cblxuXG5sZXQgUkVTVGZ1bCA9IHtcblxuICBoZWFkOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkhFQURcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZ2V0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwb3N0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcHV0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBVVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwYXRjaDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQQVRDSFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBkZWxldGU6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiREVMRVRFXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGRlZmF1bHRPcHRpb25zOiB7XG5cbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIHByb2Nlc3NEYXRhOiB0cnVlXG5cbiAgfSxcblxuICBhamF4U2V0dXA6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICAkLmFqYXhTZXR1cChvcHRpb25zKTtcblxuICB9XG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJFU1RmdWw7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9SRVNUZnVsLmpzXG4gKiovIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnYmFja2JvbmUnO1xuXG5cbmNsYXNzIFRyYW5zYWN0aW9uIHtcblxuICBjb25zdHJ1Y3Rvcihwb29sLCBvcHRpb25zKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLCBFdmVudHMpO1xuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30pO1xuXG4gICAgdGhpcy5wb29sID0gcG9vbDtcbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcblxuICB9XG5cbiAgYmVnaW4gKCkge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG4gICAgdGhpcy5fYWN0aXZhdGUoKTtcblxuICB9XG5cbiAgY29tbWl0ICgpIHtcblxuICAgIHRoaXMuX2RlYWN0aXZhdGUoKTtcblxuICB9XG5cblxuICBfYWN0aXZhdGUgKCkge1xuXG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLnBvb2wsICd0cmFuc2Zvcm0nLCB0aGlzLm9uVHJhbnNmb3JtKTtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG5cbiAgfVxuXG4gIF9kZWFjdGl2YXRlICgpIHtcblxuICAgIHRoaXMuc3RvcExpc3RlbmluZyh0aGlzLnBvb2wsICd0cmFuc2Zvcm0nLCB0aGlzLm9uVHJhbnNmb3JtKTtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gIH1cblxuICBvblRyYW5zZm9ybSAob3BlcmF0aW9uKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMucHVzaChvcGVyYXRpb24pO1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBUcmFuc2FjdGlvbjtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL1RyYW5zYWN0aW9uLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzVfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiJFwiXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzZfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiX1wiXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzdfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiUVwiXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzhfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwidXVpZFwiXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzlfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiQmFja2JvbmVcIlxuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xMF9fO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJ1cmxqb2luXCJcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuXG5sZXQgX3ZhbGlkYXRlUmVzcG9uc2UgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgbGV0IGJvZHkgPSB4aHIucmVzcG9uc2VKU09OO1xuXG4gIGlmIChib2R5LmRhdGEgPT09IHVuZGVmaW5lZCAmJiBib2R5LmVycm9ycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQSBkb2N1bWVudCBNVVNUIGNvbnRhaW4gZWl0aGVyIHByaW1hcnkgZGF0YSBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwib3IgYW4gYXJyYXkgb2YgZXJyb3Igb2JqZWN0cy5cIik7XG4gIH1cblxufTtcblxuXG5sZXQgX2lzUmVzcG9uc2VFcnJvciA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcblxuICByZXR1cm4gNDAwIDw9IHN0YXR1cyAmJiA2MDAgPiBzdGF0dXMgO1xuXG59O1xuXG5cbmxldCBfcGFyc2VEYXRhID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICgheGhyLnJlc3BvbnNlSlNPTikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB4aHIucmVzcG9uc2VKU09OLmRhdGE7XG5cbn07XG5cbmxldCBfcGFyc2VJbmNsdWRlZCA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBpZiAoIXhoci5yZXNwb25zZUpTT04pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4geGhyLnJlc3BvbnNlSlNPTi5pbmNsdWRlZDtcblxufTtcblxubGV0IF9wYXJzZUVycm9ycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBpZiAoISh4aHIucmVzcG9uc2VKU09OICYmIHhoci5yZXNwb25zZUpTT04uZXJyb3JzICkpIHtcbiAgICBpZiAoX2lzUmVzcG9uc2VFcnJvcih4aHIuc3RhdHVzKSkge1xuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIHN0YXR1czogXCJcIiArIHhoci5zdGF0dXNcbiAgICAgIH1dO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCBlcnJvcnMgPSB4aHIucmVzcG9uc2VKU09OLmVycm9ycztcblxuICByZXR1cm4gXy5tYXAoZXJyb3JzLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICByZXR1cm4gXy5leHRlbmQoe1xuICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgIH0sIGVycm9yKTtcbiAgfSk7XG5cbn07XG5cblxubGV0IF9wYXJzZUhlYWRlcnMgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgbGV0IHJlc3VsdCA9IFtdO1xuXG4gIGxldCBoZWFkZXJSZWdleCA9IC9eKC4qPyk6WyBcXHRdKihbXlxcclxcbl0qKSQvbWc7XG4gIGxldCBoZWFkZXJzU3RyaW5nID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpO1xuICBsZXQgZmluZFJlc3VsdDtcblxuICB3aGlsZSAoKGZpbmRSZXN1bHQgPSBoZWFkZXJSZWdleC5leGVjKGhlYWRlcnNTdHJpbmcpKSAhPT0gbnVsbCkge1xuICAgIHJlc3VsdC5wdXNoKGZpbmRSZXN1bHQuc2xpY2UoMSkpO1xuICB9XG5cbiAgcmV0dXJuIF8ub2JqZWN0KHJlc3VsdCk7XG5cbn07XG5cblxuY2xhc3MgUmVzcG9uc2Uge1xuXG4gIGNvbnN0cnVjdG9yICh4aHIpIHtcblxuICAgIHRoaXMucmVzcG9uc2VKU09OID0geGhyLnJlc3BvbnNlSlNPTjtcbiAgICB0aGlzLmRhdGEgPSBfcGFyc2VEYXRhKHhocik7XG4gICAgdGhpcy5pbmNsdWRlZCA9IF9wYXJzZUluY2x1ZGVkKHhocik7XG4gICAgdGhpcy5lcnJvcnMgPSBfcGFyc2VFcnJvcnMoeGhyKTtcbiAgICB0aGlzLmhlYWRlcnMgPSBfcGFyc2VIZWFkZXJzKHhocik7XG4gICAgdGhpcy5uYXRpdmVYSFIgPSB4aHI7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvUmVzcG9uc2UuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9