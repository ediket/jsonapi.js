(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("uuid"), require("Q"), require("urljoin"), require("$"), require("Backbone"), require("jsondiffpatch"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "uuid", "Q", "urljoin", "$", "Backbone", "jsondiffpatch"], factory);
	else if(typeof exports === 'object')
		exports["JSONAPI"] = factory(require("_"), require("uuid"), require("Q"), require("urljoin"), require("$"), require("Backbone"), require("jsondiffpatch"));
	else
		root["JSONAPI"] = factory(root["_"], root["uuid"], root["Q"], root["urljoin"], root["$"], root["Backbone"], root["jsondiffpatch"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_12__) {
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
	
	var _libDiff = __webpack_require__(5);
	
	var _libDiff2 = _interopRequireDefault(_libDiff);
	
	exports.Transaction = _libTransaction2['default'];
	exports.Resource = _libResource2['default'];
	exports.Pool = _libPool2['default'];
	exports.RESTful = _libRESTful2['default'];
	exports.diff = _libDiff2['default'];

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
	
	var _nodeUuid = __webpack_require__(7);
	
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
	
	var _q = __webpack_require__(8);
	
	var _q2 = _interopRequireDefault(_q);
	
	var _urlJoin = __webpack_require__(9);
	
	var _urlJoin2 = _interopRequireDefault(_urlJoin);
	
	var _nodeUuid = __webpack_require__(7);
	
	var _nodeUuid2 = _interopRequireDefault(_nodeUuid);
	
	var _diff = __webpack_require__(5);
	
	var _diff2 = _interopRequireDefault(_diff);
	
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
	            return delete _this6.pool[rid];
	          }, function (response) {
	            _this6._saveData(beforeCommit[rid], rid);
	            return _q2['default'].reject(response);
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
	        var delta = _diff2['default'](beforeCommit[rid], afterCommit[rid]);
	
	        if (id) {
	          _lodash2['default'].extend(delta, { type: type, id: id });
	          return _this6.sync.patch(_this6.getRemote(type, id), _this6._toRequest(delta)).then(function (response) {
	            return _this6._saveResponse(response, rid);
	          }, function (response) {
	            _this6._saveData(beforeCommit[rid], rid);
	            return _q2['default'].reject(response);
	          });
	        }
	        if (!id) {
	          return _this6.sync.post(_this6.getRemote(type), _this6._toRequest(delta)).then(function (response) {
	            return _this6._saveResponse(response, rid);
	          }, function (response) {
	            _this6._remove(rid);
	            return _q2['default'].reject(response);
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
	          return _this6.sync.post(_this6.getRemote(type, id, relation), requestBody).then(function (response) {
	            delete afterCommit[rid];
	            return _this6._saveResponse(response);
	          });
	        }
	
	        if (op === 'remove') {
	          return _this6.sync['delete'](_this6.getRemote(type, id, relation), requestBody).then(function (response) {
	            delete afterCommit[rid];
	            return _this6._saveResponse(response);
	          });
	        }
	      });
	
	      return _q2['default'].all(deleteRequest.concat(postOrPatchRequest, linkOperationRequest)).then(function () {
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
	    key: '_remove',
	    value: function _remove(rid) {
	      var _this8 = this;
	
	      if (_lodash2['default'].isArray(rid)) {
	        return _lodash2['default'].map(rid, function (data) {
	          return _this8._remove(rid);
	        });
	      }
	
	      var resource = this.pool[rid];
	
	      var stagedBackup = _lodash2['default'].clone(this.staged, true);
	
	      this.rm(resource);
	      this.commit();
	      this.setRemoteIndex();
	
	      this.staged = stagedBackup;
	    }
	  }, {
	    key: '_saveData',
	    value: function _saveData(data, rid) {
	      var _this9 = this;
	
	      if (_lodash2['default'].isArray(data)) {
	        return _lodash2['default'].map(data, function (data) {
	          return _this9._saveData(data);
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
	
	var _jquery = __webpack_require__(10);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _lodash = __webpack_require__(6);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _q = __webpack_require__(8);
	
	var _q2 = _interopRequireDefault(_q);
	
	var _Response = __webpack_require__(13);
	
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
	
	var _q = __webpack_require__(8);
	
	var _q2 = _interopRequireDefault(_q);
	
	var _backbone = __webpack_require__(11);
	
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

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _lodash = __webpack_require__(6);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _jsondiffpatch = __webpack_require__(12);
	
	var _jsondiffpatch2 = _interopRequireDefault(_jsondiffpatch);
	
	var diffpatcher = _jsondiffpatch2['default'].create({
	  textDiff: {
	    minLength: Infinity
	  }
	});
	
	function getAfterValueFromDiff(diff) {
	
	  if (!_lodash2['default'].isArray(diff)) {
	    throw new Error('invalid type!');
	  }
	
	  switch (diff.length) {
	    case 1:
	      return diff[0];
	    case 2:
	      return diff[1];
	    case 3:
	      return undefined;
	  }
	}
	
	function getChanged(diffs) {
	
	  if (_lodash2['default'].isArray(diffs)) {
	    return getAfterValueFromDiff(diffs);
	  }
	
	  return _lodash2['default'].reduce(diffs, function (result, diff, key) {
	
	    if (_lodash2['default'].isObject(diff)) {
	      if (diff._t === 'a') {
	        return result;
	      }
	      result[key] = getChanged(diff);
	    } else if (_lodash2['default'].isArray(diff)) {
	      result[key] = getAfterValueFromDiff(diff);
	    }
	
	    return result;
	  }, {});
	}
	
	function diff(oldValue, newValue) {
	
	  var delta = diffpatcher.diff(oldValue, newValue);
	  return getChanged(delta);
	}
	
	exports['default'] = diff;
	module.exports = exports['default'];

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

	module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ },
/* 13 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjNTg1MTYzNmEwOTBiNDExMWJhNCIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvUmVzb3VyY2UuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1Bvb2wuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1JFU1RmdWwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1RyYW5zYWN0aW9uLmpzIiwid2VicGFjazovLy8uL2xpYi9kaWZmLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcIl9cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dWlkXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiUVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInVybGpvaW5cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCIkXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQmFja2JvbmVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJqc29uZGlmZnBhdGNoXCIiLCJ3ZWJwYWNrOi8vLy4vbGliL1Jlc3BvbnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O3dDQ3RDcUIsQ0FBZ0I7Ozs7b0NBQ3BCLENBQVk7Ozs7dUNBQ1QsQ0FBZTs7OzsyQ0FDWCxDQUFtQjs7OztvQ0FDMUIsQ0FBWTs7OztTQUkzQixXQUFXO1NBQ1gs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Q0FBQztBQUNyQyxPQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixPQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQyxPQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxPQUFJLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxPQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztFQUV0Qjs7c0JBSVksUUFBUSIsImZpbGUiOiJqc29uYXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiX1wiKSwgcmVxdWlyZShcInV1aWRcIiksIHJlcXVpcmUoXCJRXCIpLCByZXF1aXJlKFwidXJsam9pblwiKSwgcmVxdWlyZShcIiRcIiksIHJlcXVpcmUoXCJCYWNrYm9uZVwiKSwgcmVxdWlyZShcImpzb25kaWZmcGF0Y2hcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiX1wiLCBcInV1aWRcIiwgXCJRXCIsIFwidXJsam9pblwiLCBcIiRcIiwgXCJCYWNrYm9uZVwiLCBcImpzb25kaWZmcGF0Y2hcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiSlNPTkFQSVwiXSA9IGZhY3RvcnkocmVxdWlyZShcIl9cIiksIHJlcXVpcmUoXCJ1dWlkXCIpLCByZXF1aXJlKFwiUVwiKSwgcmVxdWlyZShcInVybGpvaW5cIiksIHJlcXVpcmUoXCIkXCIpLCByZXF1aXJlKFwiQmFja2JvbmVcIiksIHJlcXVpcmUoXCJqc29uZGlmZnBhdGNoXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJKU09OQVBJXCJdID0gZmFjdG9yeShyb290W1wiX1wiXSwgcm9vdFtcInV1aWRcIl0sIHJvb3RbXCJRXCJdLCByb290W1widXJsam9pblwiXSwgcm9vdFtcIiRcIl0sIHJvb3RbXCJCYWNrYm9uZVwiXSwgcm9vdFtcImpzb25kaWZmcGF0Y2hcIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV82X18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfN19fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzhfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV85X18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMTBfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xMV9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzEyX18pIHtcbnJldHVybiBcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb25cbiAqKi8iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGM1ODUxNjM2YTA5MGI0MTExYmE0XG4gKiovIiwiaW1wb3J0IFJlc291cmNlIGZyb20gJy4vbGliL1Jlc291cmNlJztcbmltcG9ydCBQb29sIGZyb20gJy4vbGliL1Bvb2wnO1xuaW1wb3J0IFJFU1RmdWwgZnJvbSAnLi9saWIvUkVTVGZ1bCc7XG5pbXBvcnQgVHJhbnNhY3Rpb24gZnJvbSAnLi9saWIvVHJhbnNhY3Rpb24nO1xuaW1wb3J0IGRpZmYgZnJvbSAnLi9saWIvZGlmZic7XG5cblxuZXhwb3J0IHtcbiAgVHJhbnNhY3Rpb24sXG4gIFJlc291cmNlLFxuICBQb29sLFxuICBSRVNUZnVsLFxuICBkaWZmXG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9pbmRleC5qc1xuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuXG5cbmNsYXNzIFJlc291cmNlIHtcblxuICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzKSB7XG5cbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSB7fTtcbiAgICB0aGlzLmxpbmtzID0ge307XG4gICAgdGhpcy5yaWQgPSB1dWlkLnY0KCk7XG5cbiAgICB0aGlzLmRlc2VyaWFsaXplKGF0dHJpYnV0ZXMpO1xuXG4gIH1cblxuICBnZXQgKGtleSkge1xuXG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1trZXldO1xuXG4gIH1cblxuICBzZXQgKGF0dHJpYnV0ZXMpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cbiAgfVxuXG4gIHVuc2V0IChrZXkpIHtcblxuICAgIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNba2V5XTtcblxuICB9XG5cbiAgZ2V0TGluayAoa2V5KSB7XG5cbiAgICBrZXkgPSBrZXkgfHwgJ3NlbGYnO1xuICAgIHJldHVybiB0aGlzLmxpbmtzW2tleV07XG5cbiAgfVxuXG4gIHNldExpbmsgKGxpbmtzKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLmxpbmtzLCBsaW5rcyk7XG5cbiAgfVxuXG4gIHVuc2V0TGluayAoa2V5KSB7XG5cbiAgICBkZWxldGUgdGhpcy5saW5rc1trZXldO1xuXG4gIH1cblxuICBnZXRMaW5rYWdlICgpIHtcblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0aGlzLmF0dHJpYnV0ZXMudHlwZSxcbiAgICAgIGlkOiB0aGlzLmF0dHJpYnV0ZXMuaWRcbiAgICB9O1xuXG4gIH1cblxuICBzZXJpYWxpemUgKCkge1xuXG4gICAgbGV0IHJlc3VsdCA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzLCB0cnVlKTtcbiAgICByZXN1bHQubGlua3MgPSB0aGlzLmxpbmtzO1xuXG4gICAgaWYgKF8uaXNFbXB0eShyZXN1bHQubGlua3MpKSB7XG4gICAgICBkZWxldGUgcmVzdWx0LmxpbmtzO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgfVxuXG4gIGRlc2VyaWFsaXplIChzZXJpYWxpemVkKSB7XG5cbiAgICBpZiAoIXRoaXMuX3ZhbGlkYXRlU2VyaWFsaXplZChzZXJpYWxpemVkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGRhdGEhIHR5cGUgc2hvdWxkIGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoXy5jbG9uZShfLm9taXQoc2VyaWFsaXplZCwgJ2xpbmtzJyksIHRydWUpKTtcbiAgICB0aGlzLnNldExpbmsoc2VyaWFsaXplZC5saW5rcyk7XG5cbiAgfVxuXG4gIGNsb25lICgpIHtcblxuICAgIGxldCByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZSh0aGlzLnNlcmlhbGl6ZSgpKTtcbiAgICByZXNvdXJjZS51dWlkID0gdGhpcy51dWlkO1xuICAgIHJldHVybiByZXNvdXJjZTtcblxuICB9XG5cbiAgX3ZhbGlkYXRlU2VyaWFsaXplZCAoc2VyaWFsaXplZCkge1xuXG4gICAgcmV0dXJuIHNlcmlhbGl6ZWQgJiYgc2VyaWFsaXplZC50eXBlO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvUmVzb3VyY2UuanNcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgdXJsam9pbiBmcm9tICd1cmwtam9pbic7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuaW1wb3J0IGRpZmYgZnJvbSAnLi9kaWZmJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCBSRVNUZnVsIGZyb20gJy4vUkVTVGZ1bCc7XG5cblxuY2xhc3MgUG9vbCB7XG5cbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcblxuICAgIHRoaXMuc3luYyA9IFJFU1RmdWw7XG4gICAgdGhpcy5yZXNldEFsbCgpO1xuXG4gIH1cblxuICByZXNldEFsbCAoKSB7XG5cbiAgICB0aGlzLnBvb2wgPSB7fTtcbiAgICB0aGlzLmJsb2JzID0ge307XG4gICAgdGhpcy5zdGFnZWQgPSB7fTtcbiAgICB0aGlzLnN0YWdlZExpbmsgPSBbXTtcbiAgICB0aGlzLnJlbW90ZSA9IHt9O1xuICAgIHRoaXMuY29tbWl0cyA9IFtdO1xuICAgIHRoaXMucmVtb3RlSW5kZXggPSAtMTtcblxuICB9XG5cbiAgZ2V0Q29tbWl0IChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCAhPT0gdW5kZWZpbmVkID8gaWR4IDogdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIHRoaXMuY29tbWl0c1tpZHhdIHx8IHt9O1xuXG4gIH1cblxuICBzZXRSZW1vdGVJbmRleCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggIT09IHVuZGVmaW5lZCA/IGlkeCA6IHRoaXMuY29tbWl0cy5sZW5ndGggLSAxO1xuICAgIHRoaXMucmVtb3RlSW5kZXggPSBpZHg7XG5cbiAgfVxuXG4gIHJtIChyZXNvdXJjZSkge1xuXG4gICAgaWYoXy5pc0FycmF5KHJlc291cmNlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKHJlc291cmNlLCByZXNvdXJjZSA9PiB0aGlzLnJtKHJlc291cmNlKSk7XG4gICAgfVxuXG4gICAgbGV0IHJpZCA9IHJlc291cmNlLnJpZDtcblxuICAgIHRoaXMuc3RhZ2VkW3JpZF0gPSBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3JpZF07XG5cbiAgfVxuXG4gIGFkZCAocmVzb3VyY2UpIHtcblxuICAgIGlmKF8uaXNBcnJheShyZXNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChyZXNvdXJjZSwgcmVzb3VyY2UgPT4gdGhpcy5hZGQocmVzb3VyY2UpKTtcbiAgICB9XG5cbiAgICBsZXQgcmlkID0gcmVzb3VyY2UucmlkO1xuXG4gICAgaWYgKCF0aGlzLnBvb2xbcmlkXSkge1xuICAgICAgdGhpcy5wb29sW3JpZF0gPSByZXNvdXJjZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YWdlZFtyaWRdID0gcmVzb3VyY2Uuc2VyaWFsaXplKCk7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmlkXTtcblxuICB9XG5cbiAgcm1MaW5rYWdlIChyZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uKFxuICAgICAgJ3JlbW92ZScsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIGFkZExpbmthZ2UgKHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykge1xuXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24oXG4gICAgICAnYWRkJywgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKTtcblxuICB9XG5cbiAgX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24gKG9wLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpIHtcblxuICAgIGlmKF8uaXNBcnJheShsaW5rYWdlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKGxpbmthZ2UsIGxpbmthZ2UgPT4gdGhpcy5fY3JlYXRlTGlua2FnZU9wZXJhdGlvbihcbiAgICAgICAgb3AsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykpO1xuICAgIH1cblxuICAgIGxldCBzdGFnZWQgPSB7XG4gICAgICBvcCxcbiAgICAgIHJlc291cmNlLFxuICAgICAgcmVsYXRpb24sXG4gICAgICBsaW5rYWdlLFxuICAgICAgb3B0aW9uc1xuICAgIH07XG5cbiAgICB0aGlzLnN0YWdlZExpbmsucHVzaChzdGFnZWQpO1xuXG4gICAgcmV0dXJuIHN0YWdlZDtcblxuICB9XG5cbiAgZ2V0U3RhZ2VkIChyZXNvdXJjZSkge1xuXG4gICAgaWYgKCF0aGlzLmlzU3RhZ2VkKHJlc291cmNlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoYGNhbiBub3QgZmluZCAke3Jlc291cmNlfWApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyZXNvdXJjZS5yaWRdO1xuXG4gIH1cblxuICBpc1N0YWdlZCAocmVzb3VyY2UpIHtcblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyZXNvdXJjZS5yaWRdICE9PSB1bmRlZmluZWQ7XG5cbiAgfVxuXG4gIGNvbW1pdCAoKSB7XG5cbiAgICBsZXQgbGFzdENvbW1pdCA9IHRoaXMuZ2V0Q29tbWl0KCk7XG5cbiAgICBsZXQgbmV3Q29tbWl0ID0gXy5yZWR1Y2UodGhpcy5zdGFnZWQsIChjb21taXQsIHNlcmlhbGl6ZWQsIHJpZCkgPT4ge1xuICAgICAgaWYgKCFzZXJpYWxpemVkKSB7XG4gICAgICAgIGlmIChjb21taXRbcmlkXSkge1xuICAgICAgICAgIGRlbGV0ZSBjb21taXRbcmlkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbW1pdFtyaWRdID0gdGhpcy5fY3JlYXRlQmxvYihzZXJpYWxpemVkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb21taXQ7XG4gICAgfSwgXy5jbG9uZShsYXN0Q29tbWl0LCB0cnVlKSk7XG5cbiAgICBfLnJlZHVjZSh0aGlzLnN0YWdlZExpbmssIChjb21taXQsIGxpbmtPcGVyYXRpb24pID0+IHtcbiAgICAgIGNvbW1pdFt1dWlkLnY0KCldID0gbGlua09wZXJhdGlvbjtcbiAgICAgIHJldHVybiBjb21taXQ7XG4gICAgfSwgbmV3Q29tbWl0KTtcblxuICAgIHRoaXMuY29tbWl0cy5wdXNoKG5ld0NvbW1pdCk7XG4gICAgdGhpcy5zdGFnZWQgPSB7fTtcbiAgICB0aGlzLnN0YWdlZExpbmsgPSBbXTtcblxuICB9XG5cbiAgYWRkUmVtb3RlICh0eXBlLCB1cmwpIHtcblxuICAgIHRoaXMucmVtb3RlW3R5cGVdID0gdXJsO1xuXG4gIH1cblxuICBnZXRSZW1vdGUgKHR5cGUsIGlkLCByZWxhdGlvbikge1xuXG4gICAgbGV0IHVybFBhcnRzID0gXy5jb21wYWN0KFtcbiAgICAgIHRoaXMucmVtb3RlW3R5cGVdLFxuICAgICAgaWQsXG4gICAgICByZWxhdGlvbiA/ICdsaW5rcycgOiB1bmRlZmluZWQsXG4gICAgICByZWxhdGlvblxuICAgIF0pO1xuICAgIHJldHVybiB1cmxqb2luLmFwcGx5KG51bGwsIHVybFBhcnRzKTtcblxuICB9XG5cbiAgZ2V0ICh0eXBlLCBpZCkge1xuXG4gICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLnBvb2wsIHJlc291cmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc291cmNlLmdldCgndHlwZScpID09PSB0eXBlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF8uZmluZCh0aGlzLnBvb2wsIHJlc291cmNlID0+IHtcbiAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoJ3R5cGUnKSA9PT0gdHlwZSAmJlxuICAgICAgICByZXNvdXJjZS5nZXQoJ2lkJykgPT09IGlkO1xuICAgIH0pO1xuXG4gIH1cblxuICBoYXMgKHR5cGUsIGlkKSB7XG5cbiAgICByZXR1cm4gISFfLmZpbmQodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCd0eXBlJykgPT09IHR5cGUgJiZcbiAgICAgICAgcmVzb3VyY2UuZ2V0KCdpZCcpID09PSBpZDtcbiAgICB9KTtcblxuICB9XG5cbiAgX2NyZWF0ZUJsb2IgKHNlcmlhbGl6ZWQpIHtcblxuICAgIGxldCBiaWQgPSB1dWlkLnY0KCk7XG4gICAgdGhpcy5ibG9ic1tiaWRdID0gXy5jbG9uZShzZXJpYWxpemVkLCB0cnVlKTtcbiAgICByZXR1cm4gdGhpcy5ibG9ic1tiaWRdO1xuXG4gIH1cblxuICBfZ2V0QmxvYiAoYmlkKSB7XG5cbiAgICByZXR1cm4gdGhpcy5ibG9ic1tiaWRdO1xuXG4gIH1cblxuICBwdWxsQnlMaW5rIChsaW5rLCBvcHRpb25zKSB7XG5cbiAgICBsZXQgdXJsO1xuICAgIGlmIChfLmlzU3RyaW5nKGxpbmspKSB7XG4gICAgICB1cmwgPSBsaW5rO1xuICAgIH1cbiAgICBlbHNlIGlmIChsaW5rLmxpbmthZ2UpIHtcbiAgICAgIHVybCA9IHRoaXMuZ2V0UmVtb3RlKGxpbmsubGlua2FnZS50eXBlLCBsaW5rLmxpbmthZ2UuaWQpO1xuICAgIH1cbiAgICBlbHNlIGlmIChsaW5rLnJlbGF0ZWQpIHtcbiAgICAgIHVybCA9IGxpbmsucmVsYXRlZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgbGluay4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wdWxsQnlVUkwodXJsLCBvcHRpb25zKTtcblxuICB9XG5cbiAgcHVsbCAodHlwZSwgaWQsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiB0aGlzLnB1bGxCeVVSTCh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCksIG9wdGlvbnMpO1xuXG4gIH1cblxuICBwdWxsQnlVUkwgKHVybCwgb3B0aW9ucykge1xuXG4gICAgaWYgKCFfLmlzRW1wdHkodGhpcy5zdGFnZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3B1bGwgd2hlbiBzdGFnZWQgY2hhbmdlIGlzIG5vdCBleGlzdCcpO1xuICAgIH1cblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgbGV0IGluY2x1ZGVkID0gb3B0aW9ucy5pbmNsdWRlZDtcbiAgICBpZiAoaW5jbHVkZWQpIHtcbiAgICAgIG9wdGlvbnMuaW5jbHVkZWQgPSBpbmNsdWRlZC5qb2luKCcsJyk7XG4gICAgfVxuXG4gICAgbGV0IGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzO1xuICAgIGlmIChmaWVsZHMpIHtcbiAgICAgIF8ucmVkdWNlKGZpZWxkcywgKG9wdGlvbnMsIGZpZWxkcywgdHlwZSkgPT4ge1xuICAgICAgICBvcHRpb25zW2BmaWVsZHNbJHt0eXBlfV1gXSA9IGZpZWxkcy5qb2luKCcsJyk7XG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgICAgfSwgb3B0aW9ucyk7XG4gICAgICBkZWxldGUgb3B0aW9ucy5maWVsZHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3luYy5nZXQodXJsLCBvcHRpb25zKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9zYXZlUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgIH0pO1xuXG4gIH1cblxuICBwdXNoIChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCB8fCB0aGlzLmNvbW1pdHMubGVuZ3RoIC0gMTtcblxuICAgIGlmIChpZHggPD0gdGhpcy5yZW1vdGVJbmRleCkge1xuICAgICAgcmV0dXJuIFEoKTtcbiAgICB9XG5cbiAgICBsZXQgYWZ0ZXJDb21taXQgPSB0aGlzLmdldENvbW1pdChpZHgpO1xuICAgIGxldCBiZWZvcmVDb21taXQgPSB0aGlzLmdldENvbW1pdCh0aGlzLnJlbW90ZUluZGV4KTtcblxuICAgIGxldCByZW1vdmVkID0gXy5kaWZmZXJlbmNlKFxuICAgICAgXy5rZXlzKGJlZm9yZUNvbW1pdCksXG4gICAgICBfLmtleXMoYWZ0ZXJDb21taXQpXG4gICAgKTtcblxuICAgIGxldCBjaGFuZ2VkT3JBZGRlZCA9IF8ud2l0aG91dChcbiAgICAgIF8ua2V5cyhhZnRlckNvbW1pdCksXG4gICAgICBfLmtleXMocmVtb3ZlZClcbiAgICApO1xuXG4gICAgbGV0IGRlbGV0ZVJlcXVlc3QgPSBfLm1hcChyZW1vdmVkLCByaWQgPT4ge1xuICAgICAgLy8gaXMgTGlua1xuICAgICAgaWYgKCF0aGlzLnBvb2xbcmlkXSkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ3R5cGUnKTtcbiAgICAgIGxldCBpZCA9IHRoaXMucG9vbFtyaWRdLmdldCgnaWQnKTtcbiAgICAgIGlmIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLmRlbGV0ZSh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gZGVsZXRlIHRoaXMucG9vbFtyaWRdLFxuICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9zYXZlRGF0YShiZWZvcmVDb21taXRbcmlkXSwgcmlkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHBvc3RPclBhdGNoUmVxdWVzdCA9IF8ubWFwKGNoYW5nZWRPckFkZGVkLCByaWQgPT4ge1xuICAgICAgLy8gaXMgTGlua1xuICAgICAgaWYgKCF0aGlzLnBvb2xbcmlkXSkgeyByZXR1cm47IH1cbiAgICAgIC8vIG5vdCBjaGFuZ2VcbiAgICAgIGlmIChfLmlzRXF1YWwoYWZ0ZXJDb21taXRbcmlkXSwgYmVmb3JlQ29tbWl0W3JpZF0pKSB7IHJldHVybjsgfVxuXG4gICAgICBsZXQgdHlwZSA9IHRoaXMucG9vbFtyaWRdLmdldCgndHlwZScpO1xuICAgICAgbGV0IGlkID0gdGhpcy5wb29sW3JpZF0uZ2V0KCdpZCcpO1xuICAgICAgbGV0IGRlbHRhID0gZGlmZihiZWZvcmVDb21taXRbcmlkXSwgYWZ0ZXJDb21taXRbcmlkXSk7XG5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICBfLmV4dGVuZChkZWx0YSwgeyB0eXBlLCBpZCB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5wYXRjaCh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9SZXF1ZXN0KGRlbHRhKSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB0aGlzLl9zYXZlUmVzcG9uc2UocmVzcG9uc2UsIHJpZCksXG4gICAgICAgICAgICByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX3NhdmVEYXRhKGJlZm9yZUNvbW1pdFtyaWRdLCByaWQpO1xuICAgICAgICAgICAgICByZXR1cm4gUS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIWlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMucG9zdCh0aGlzLmdldFJlbW90ZSh0eXBlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvUmVxdWVzdChkZWx0YSkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlLCByaWQpLFxuICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9yZW1vdmUocmlkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGxpbmtPcGVyYXRpb25SZXF1ZXN0ID0gXy5tYXAoYWZ0ZXJDb21taXQsIChzdGFnZWQsIHJpZCkgPT4ge1xuICAgICAgLy8gaXMgcmVzb3VyY2VcbiAgICAgIGlmICh0aGlzLnBvb2xbcmlkXSB8fCAhc3RhZ2VkLm9wKSB7IHJldHVybjsgfVxuXG4gICAgICBsZXQgdHlwZSA9IHN0YWdlZC5yZXNvdXJjZS5nZXQoJ3R5cGUnKTtcbiAgICAgIGxldCBpZCA9IHN0YWdlZC5yZXNvdXJjZS5nZXQoJ2lkJyk7XG4gICAgICBsZXQgb3B0aW9ucyA9IF8uZGVmYXVsdHMoc3RhZ2VkLm9wdGlvbnMgfHwge30sIHtcbiAgICAgICAgaGFzTWFueTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICBsZXQgb3AgPSBzdGFnZWQub3A7XG4gICAgICBsZXQgcmVsYXRpb24gPSBzdGFnZWQucmVsYXRpb247XG4gICAgICBsZXQgbGlua2FnZSA9IHN0YWdlZC5saW5rYWdlO1xuICAgICAgbGV0IHJlcXVlc3RCb2R5ID0gb3B0aW9ucy5oYXNNYW55ID9cbiAgICAgICAgeyBkYXRhOiBbbGlua2FnZV0gfSA6IHsgZGF0YTogbGlua2FnZSB9O1xuXG4gICAgICBpZiAob3AgPT09ICdhZGQnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMucG9zdCh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCwgcmVsYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIGFmdGVyQ29tbWl0W3JpZF07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wID09PSAncmVtb3ZlJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLmRlbGV0ZSh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCwgcmVsYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIGFmdGVyQ29tbWl0W3JpZF07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBRLmFsbChcbiAgICAgIGRlbGV0ZVJlcXVlc3QuY29uY2F0KFxuICAgICAgICBwb3N0T3JQYXRjaFJlcXVlc3QsXG4gICAgICAgIGxpbmtPcGVyYXRpb25SZXF1ZXN0KVxuICAgIClcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLnNldFJlbW90ZUluZGV4KCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIF9zYXZlUmVzcG9uc2UgKHJlc3BvbnNlLCByaWQpIHtcblxuICAgIGxldCBtYWluUmVzb3VyY2UgPSB0aGlzLl9zYXZlRGF0YShyZXNwb25zZS5kYXRhLCByaWQpO1xuICAgIGxldCBpbmNsdWRlZFJlc291cmNlcyA9IF8ubWFwKFxuICAgICAgcmVzcG9uc2UuaW5jbHVkZWQsIGRhdGEgPT4gdGhpcy5fc2F2ZURhdGEoZGF0YSkpO1xuICAgIHJldHVybiBtYWluUmVzb3VyY2U7XG5cbiAgfVxuXG4gIF9yZW1vdmUgKHJpZCkge1xuXG4gICAgaWYgKF8uaXNBcnJheShyaWQpKSB7XG4gICAgICByZXR1cm4gXy5tYXAocmlkLCBkYXRhID0+IHRoaXMuX3JlbW92ZShyaWQpKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzb3VyY2UgPSB0aGlzLnBvb2xbcmlkXTtcblxuICAgIGxldCBzdGFnZWRCYWNrdXAgPSBfLmNsb25lKHRoaXMuc3RhZ2VkLCB0cnVlKTtcblxuICAgIHRoaXMucm0ocmVzb3VyY2UpO1xuICAgIHRoaXMuY29tbWl0KCk7XG4gICAgdGhpcy5zZXRSZW1vdGVJbmRleCgpO1xuXG4gICAgdGhpcy5zdGFnZWQgPSBzdGFnZWRCYWNrdXA7XG5cbiAgfVxuXG4gIF9zYXZlRGF0YSAoZGF0YSwgcmlkKSB7XG5cbiAgICBpZiAoXy5pc0FycmF5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gXy5tYXAoZGF0YSwgZGF0YSA9PiB0aGlzLl9zYXZlRGF0YShkYXRhKSk7XG4gICAgfVxuXG4gICAgbGV0IHJlc291cmNlID0gcmlkICE9PSB1bmRlZmluZWQgP1xuICAgICAgdGhpcy5wb29sW3JpZF0gOiB0aGlzLmdldChkYXRhLnR5cGUsIGRhdGEuaWQpO1xuXG4gICAgaWYgKCFyZXNvdXJjZSkge1xuICAgICAgcmVzb3VyY2UgPSBuZXcgUmVzb3VyY2UoZGF0YSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmVzb3VyY2UuZGVzZXJpYWxpemUoZGF0YSk7XG4gICAgfVxuXG4gICAgbGV0IHN0YWdlZEJhY2t1cCA9IF8uY2xvbmUodGhpcy5zdGFnZWQsIHRydWUpO1xuXG4gICAgdGhpcy5hZGQocmVzb3VyY2UpO1xuICAgIHRoaXMuY29tbWl0KCk7XG4gICAgdGhpcy5zZXRSZW1vdGVJbmRleCgpO1xuXG4gICAgdGhpcy5zdGFnZWQgPSBzdGFnZWRCYWNrdXA7XG5cbiAgICByZXR1cm4gcmVzb3VyY2U7XG5cbiAgfVxuXG4gIF90b1JlcXVlc3QgKHNlcmlhbGl6ZWQpIHtcblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBzZXJpYWxpemVkXG4gICAgfTtcblxuICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBQb29sO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvUG9vbC5qc1xuICoqLyIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgUmVzcG9uc2UgZnJvbSAnLi9SZXNwb25zZSc7XG5cblxubGV0IHN0cmluZ2lmeVJlcXVpcmVkTWV0aG9kID0gZnVuY3Rpb24gKG1ldGhvZCkge1xuICAvLyB0aGVzZSBIVFRQIG1ldGhvZHMgcmVxdWlyZXMgSlNPTi5zdHJpbmdpZnlcbiAgcmV0dXJuICgvXihQT1NUfFBVVHxQQVRDSHxERUxFVEUpJC8udGVzdChtZXRob2QudG9VcHBlckNhc2UoKSkpO1xufTtcblxubGV0IG1ha2VBamF4UmVxdWVzdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgaWYgKHN0cmluZ2lmeVJlcXVpcmVkTWV0aG9kKG9wdGlvbnMudHlwZSkpIHtcbiAgICBpZiAob3B0aW9ucy5jb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nKSB7XG4gICAgICBvcHRpb25zLmRhdGEgPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLmRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIG9wdGlvbnMudXJsID0gb3B0aW9ucy51cmwucmVwbGFjZSgvXFwvPyQvLCAnLycpO1xuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvcS93aWtpL0NvbWluZy1mcm9tLWpRdWVyeVxuICByZXR1cm4gUS5wcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAkLmFqYXgob3B0aW9ucylcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xuICAgICAgICBkZWxldGUganFYSFIudGhlbjsgLy8gdHJlYXQgeGhyIGFzIGEgbm9uLXByb21pc2VcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGpxWEhSKTtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmZhaWwoZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICBkZWxldGUganFYSFIudGhlbjsgLy8gdHJlYXQgeGhyIGFzIGEgbm9uLXByb21pc2VcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGpxWEhSKTtcbiAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgIH0pO1xuICB9KTtcblxufTtcblxuXG5cbmxldCBSRVNUZnVsID0ge1xuXG4gIGhlYWQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiSEVBRFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHBvc3Q6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwdXQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUFVUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHBhdGNoOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBBVENIXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGRlbGV0ZTogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJERUxFVEVcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZGVmYXVsdE9wdGlvbnM6IHtcblxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgcHJvY2Vzc0RhdGE6IHRydWVcblxuICB9LFxuXG4gIGFqYXhTZXR1cDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICAgICQuYWpheFNldHVwKG9wdGlvbnMpO1xuXG4gIH1cblxufTtcblxuZXhwb3J0IGRlZmF1bHQgUkVTVGZ1bDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL1JFU1RmdWwuanNcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tICdiYWNrYm9uZSc7XG5cblxuY2xhc3MgVHJhbnNhY3Rpb24ge1xuXG4gIGNvbnN0cnVjdG9yKHBvb2wsIG9wdGlvbnMpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMsIEV2ZW50cyk7XG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLnBvb2wgPSBwb29sO1xuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuXG4gIH1cblxuICBiZWdpbiAoKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcbiAgICB0aGlzLl9hY3RpdmF0ZSgpO1xuXG4gIH1cblxuICBjb21taXQgKCkge1xuXG4gICAgdGhpcy5fZGVhY3RpdmF0ZSgpO1xuXG4gIH1cblxuXG4gIF9hY3RpdmF0ZSAoKSB7XG5cbiAgICB0aGlzLmxpc3RlblRvKHRoaXMucG9vbCwgJ3RyYW5zZm9ybScsIHRoaXMub25UcmFuc2Zvcm0pO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcblxuICB9XG5cbiAgX2RlYWN0aXZhdGUgKCkge1xuXG4gICAgdGhpcy5zdG9wTGlzdGVuaW5nKHRoaXMucG9vbCwgJ3RyYW5zZm9ybScsIHRoaXMub25UcmFuc2Zvcm0pO1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgfVxuXG4gIG9uVHJhbnNmb3JtIChvcGVyYXRpb24pIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucy5wdXNoKG9wZXJhdGlvbik7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zYWN0aW9uO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvVHJhbnNhY3Rpb24uanNcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGpzb25kaWZmcGF0Y2ggZnJvbSAnanNvbmRpZmZwYXRjaCc7XG5cblxudmFyIGRpZmZwYXRjaGVyID0ganNvbmRpZmZwYXRjaC5jcmVhdGUoe1xuICB0ZXh0RGlmZjoge1xuICAgIG1pbkxlbmd0aDogSW5maW5pdHlcbiAgfVxufSk7XG5cblxuZnVuY3Rpb24gZ2V0QWZ0ZXJWYWx1ZUZyb21EaWZmIChkaWZmKSB7XG5cbiAgaWYgKCFfLmlzQXJyYXkoZGlmZikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgdHlwZSEnKTtcbiAgfVxuXG4gIHN3aXRjaCAoZGlmZi5sZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gZGlmZlswXTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gZGlmZlsxXTtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbn1cblxuXG5mdW5jdGlvbiBnZXRDaGFuZ2VkIChkaWZmcykge1xuXG4gIGlmIChfLmlzQXJyYXkoZGlmZnMpKSB7XG4gICAgcmV0dXJuIGdldEFmdGVyVmFsdWVGcm9tRGlmZihkaWZmcyk7XG4gIH1cblxuICByZXR1cm4gXy5yZWR1Y2UoZGlmZnMsIGZ1bmN0aW9uIChyZXN1bHQsIGRpZmYsIGtleSkge1xuXG4gICAgaWYgKF8uaXNPYmplY3QoZGlmZikpIHtcbiAgICAgIGlmIChkaWZmLl90ID09PSAnYScpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHJlc3VsdFtrZXldID0gZ2V0Q2hhbmdlZChkaWZmKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoXy5pc0FycmF5KGRpZmYpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IGdldEFmdGVyVmFsdWVGcm9tRGlmZihkaWZmKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIH0sIHt9KTtcblxufVxuXG5mdW5jdGlvbiBkaWZmIChvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcblxuICB2YXIgZGVsdGEgPSBkaWZmcGF0Y2hlci5kaWZmKG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gIHJldHVybiBnZXRDaGFuZ2VkKGRlbHRhKTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBkaWZmO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvZGlmZi5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV82X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcIl9cIlxuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV83X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInV1aWRcIlxuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV84X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcIlFcIlxuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV85X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInVybGpvaW5cIlxuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xMF9fO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCIkXCJcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzExX187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcIkJhY2tib25lXCJcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzEyX187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImpzb25kaWZmcGF0Y2hcIlxuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5cbmxldCBfdmFsaWRhdGVSZXNwb25zZSA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgYm9keSA9IHhoci5yZXNwb25zZUpTT047XG5cbiAgaWYgKGJvZHkuZGF0YSA9PT0gdW5kZWZpbmVkICYmIGJvZHkuZXJyb3JzID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGRvY3VtZW50IE1VU1QgY29udGFpbiBlaXRoZXIgcHJpbWFyeSBkYXRhIFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJvciBhbiBhcnJheSBvZiBlcnJvciBvYmplY3RzLlwiKTtcbiAgfVxuXG59O1xuXG5cbmxldCBfaXNSZXNwb25zZUVycm9yID0gZnVuY3Rpb24gKHN0YXR1cykge1xuXG4gIHJldHVybiA0MDAgPD0gc3RhdHVzICYmIDYwMCA+IHN0YXR1cyA7XG5cbn07XG5cblxubGV0IF9wYXJzZURhdGEgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgaWYgKCF4aHIucmVzcG9uc2VKU09OKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHhoci5yZXNwb25zZUpTT04uZGF0YTtcblxufTtcblxubGV0IF9wYXJzZUluY2x1ZGVkID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICgheGhyLnJlc3BvbnNlSlNPTikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB4aHIucmVzcG9uc2VKU09OLmluY2x1ZGVkO1xuXG59O1xuXG5sZXQgX3BhcnNlRXJyb3JzID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICghKHhoci5yZXNwb25zZUpTT04gJiYgeGhyLnJlc3BvbnNlSlNPTi5lcnJvcnMgKSkge1xuICAgIGlmIChfaXNSZXNwb25zZUVycm9yKHhoci5zdGF0dXMpKSB7XG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgICAgfV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGVycm9ycyA9IHhoci5yZXNwb25zZUpTT04uZXJyb3JzO1xuXG4gIHJldHVybiBfLm1hcChlcnJvcnMsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHJldHVybiBfLmV4dGVuZCh7XG4gICAgICBzdGF0dXM6IFwiXCIgKyB4aHIuc3RhdHVzXG4gICAgfSwgZXJyb3IpO1xuICB9KTtcblxufTtcblxuXG5sZXQgX3BhcnNlSGVhZGVycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgbGV0IGhlYWRlclJlZ2V4ID0gL14oLio/KTpbIFxcdF0qKFteXFxyXFxuXSopJC9tZztcbiAgbGV0IGhlYWRlcnNTdHJpbmcgPSB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCk7XG4gIGxldCBmaW5kUmVzdWx0O1xuXG4gIHdoaWxlICgoZmluZFJlc3VsdCA9IGhlYWRlclJlZ2V4LmV4ZWMoaGVhZGVyc1N0cmluZykpICE9PSBudWxsKSB7XG4gICAgcmVzdWx0LnB1c2goZmluZFJlc3VsdC5zbGljZSgxKSk7XG4gIH1cblxuICByZXR1cm4gXy5vYmplY3QocmVzdWx0KTtcblxufTtcblxuXG5jbGFzcyBSZXNwb25zZSB7XG5cbiAgY29uc3RydWN0b3IgKHhocikge1xuXG4gICAgdGhpcy5yZXNwb25zZUpTT04gPSB4aHIucmVzcG9uc2VKU09OO1xuICAgIHRoaXMuZGF0YSA9IF9wYXJzZURhdGEoeGhyKTtcbiAgICB0aGlzLmluY2x1ZGVkID0gX3BhcnNlSW5jbHVkZWQoeGhyKTtcbiAgICB0aGlzLmVycm9ycyA9IF9wYXJzZUVycm9ycyh4aHIpO1xuICAgIHRoaXMuaGVhZGVycyA9IF9wYXJzZUhlYWRlcnMoeGhyKTtcbiAgICB0aGlzLm5hdGl2ZVhIUiA9IHhocjtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2U7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9SZXNwb25zZS5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=