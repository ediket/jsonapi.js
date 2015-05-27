(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Q"), require("_"), require("urljoin"), require("uuid"), require("jsondiffpatch"), require("Backbone"), require("$"));
	else if(typeof define === 'function' && define.amd)
		define(["Q", "_", "urljoin", "uuid", "jsondiffpatch", "Backbone", "$"], factory);
	else if(typeof exports === 'object')
		exports["JSONAPI"] = factory(require("Q"), require("_"), require("urljoin"), require("uuid"), require("jsondiffpatch"), require("Backbone"), require("$"));
	else
		root["JSONAPI"] = factory(root["Q"], root["_"], root["urljoin"], root["uuid"], root["jsondiffpatch"], root["Backbone"], root["$"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_12__) {
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
	
	var _libResource = __webpack_require__(7);
	
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

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

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
	
	var _q = __webpack_require__(1);
	
	var _q2 = _interopRequireDefault(_q);
	
	var _urlJoin = __webpack_require__(8);
	
	var _urlJoin2 = _interopRequireDefault(_urlJoin);
	
	var _nodeUuid = __webpack_require__(9);
	
	var _nodeUuid2 = _interopRequireDefault(_nodeUuid);
	
	var _diff = __webpack_require__(5);
	
	var _diff2 = _interopRequireDefault(_diff);
	
	var _Resource = __webpack_require__(7);
	
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
	        return (0, _q2['default'])();
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
	        var delta = (0, _diff2['default'])(beforeCommit[rid], afterCommit[rid]);
	
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
	          return _this6.sync.post(_this6.getRemote(type, id, relation), requestBody).then(function () {
	            return requestBody;
	          }).then(function () {
	            return delete afterCommit[rid];
	          });
	        }
	
	        if (op === 'remove') {
	          return _this6.sync['delete'](_this6.getRemote(type, id, relation), requestBody).then(function () {
	            return requestBody;
	          }).then(function () {
	            return delete afterCommit[rid];
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
	
	var _jquery = __webpack_require__(12);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _lodash = __webpack_require__(6);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _q = __webpack_require__(1);
	
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
	
	var _q = __webpack_require__(1);
	
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
	
	var _jsondiffpatch = __webpack_require__(10);
	
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

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _lodash = __webpack_require__(6);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _nodeUuid = __webpack_require__(9);
	
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBkYzdlMTc1Yjc4ZTZmZjI2ZTBkMCIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJRXCIiLCJ3ZWJwYWNrOi8vLy4vbGliL1Bvb2wuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1JFU1RmdWwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1RyYW5zYWN0aW9uLmpzIiwid2VicGFjazovLy8uL2xpYi9kaWZmLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcIl9cIiIsIndlYnBhY2s6Ly8vLi9saWIvUmVzb3VyY2UuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXJsam9pblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInV1aWRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJqc29uZGlmZnBhdGNoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQmFja2JvbmVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCIkXCIiLCJ3ZWJwYWNrOi8vLy4vbGliL1Jlc3BvbnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O3dDQ3RDcUIsQ0FBZ0I7Ozs7b0NBQ3BCLENBQVk7Ozs7dUNBQ1QsQ0FBZTs7OzsyQ0FDWCxDQUFtQjs7OztvQ0FDMUIsQ0FBWTs7OztTQUkzQixXQUFXO1NBQ1gs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QUcsQ0FBQyxDQUFDO0FBQzVCLE9BQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLE9BQUksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLE9BQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLE9BQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0VBRXRCOztzQkFJWSxRQUFRIiwiZmlsZSI6Impzb25hcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJRXCIpLCByZXF1aXJlKFwiX1wiKSwgcmVxdWlyZShcInVybGpvaW5cIiksIHJlcXVpcmUoXCJ1dWlkXCIpLCByZXF1aXJlKFwianNvbmRpZmZwYXRjaFwiKSwgcmVxdWlyZShcIkJhY2tib25lXCIpLCByZXF1aXJlKFwiJFwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJRXCIsIFwiX1wiLCBcInVybGpvaW5cIiwgXCJ1dWlkXCIsIFwianNvbmRpZmZwYXRjaFwiLCBcIkJhY2tib25lXCIsIFwiJFwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJKU09OQVBJXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiUVwiKSwgcmVxdWlyZShcIl9cIiksIHJlcXVpcmUoXCJ1cmxqb2luXCIpLCByZXF1aXJlKFwidXVpZFwiKSwgcmVxdWlyZShcImpzb25kaWZmcGF0Y2hcIiksIHJlcXVpcmUoXCJCYWNrYm9uZVwiKSwgcmVxdWlyZShcIiRcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkpTT05BUElcIl0gPSBmYWN0b3J5KHJvb3RbXCJRXCJdLCByb290W1wiX1wiXSwgcm9vdFtcInVybGpvaW5cIl0sIHJvb3RbXCJ1dWlkXCJdLCByb290W1wianNvbmRpZmZwYXRjaFwiXSwgcm9vdFtcIkJhY2tib25lXCJdLCByb290W1wiJFwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV82X18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfOF9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzlfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xMF9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzExX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMTJfXykge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgZGM3ZTE3NWI3OGU2ZmYyNmUwZDBcbiAqKi8iLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9saWIvUmVzb3VyY2UnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi9saWIvUG9vbCc7XG5pbXBvcnQgUkVTVGZ1bCBmcm9tICcuL2xpYi9SRVNUZnVsJztcbmltcG9ydCBUcmFuc2FjdGlvbiBmcm9tICcuL2xpYi9UcmFuc2FjdGlvbic7XG5pbXBvcnQgZGlmZiBmcm9tICcuL2xpYi9kaWZmJztcblxuXG5leHBvcnQge1xuICBUcmFuc2FjdGlvbixcbiAgUmVzb3VyY2UsXG4gIFBvb2wsXG4gIFJFU1RmdWwsXG4gIGRpZmZcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2luZGV4LmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiUVwiXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHVybGpvaW4gZnJvbSAndXJsLWpvaW4nO1xuaW1wb3J0IHV1aWQgZnJvbSAnbm9kZS11dWlkJztcbmltcG9ydCBkaWZmIGZyb20gJy4vZGlmZic7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9SZXNvdXJjZSc7XG5pbXBvcnQgUkVTVGZ1bCBmcm9tICcuL1JFU1RmdWwnO1xuXG5cbmNsYXNzIFBvb2wge1xuXG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG5cbiAgICB0aGlzLnN5bmMgPSBSRVNUZnVsO1xuICAgIHRoaXMucmVzZXRBbGwoKTtcblxuICB9XG5cbiAgcmVzZXRBbGwgKCkge1xuXG4gICAgdGhpcy5wb29sID0ge307XG4gICAgdGhpcy5ibG9icyA9IHt9O1xuICAgIHRoaXMuc3RhZ2VkID0ge307XG4gICAgdGhpcy5zdGFnZWRMaW5rID0gW107XG4gICAgdGhpcy5yZW1vdGUgPSB7fTtcbiAgICB0aGlzLmNvbW1pdHMgPSBbXTtcbiAgICB0aGlzLnJlbW90ZUluZGV4ID0gLTE7XG5cbiAgfVxuXG4gIGdldENvbW1pdCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggIT09IHVuZGVmaW5lZCA/IGlkeCA6IHRoaXMuY29tbWl0cy5sZW5ndGggLSAxO1xuICAgIHJldHVybiB0aGlzLmNvbW1pdHNbaWR4XSB8fCB7fTtcblxuICB9XG5cbiAgc2V0UmVtb3RlSW5kZXggKGlkeCkge1xuXG4gICAgaWR4ID0gaWR4ICE9PSB1bmRlZmluZWQgPyBpZHggOiB0aGlzLmNvbW1pdHMubGVuZ3RoIC0gMTtcbiAgICB0aGlzLnJlbW90ZUluZGV4ID0gaWR4O1xuXG4gIH1cblxuICBybSAocmVzb3VyY2UpIHtcblxuICAgIGlmKF8uaXNBcnJheShyZXNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChyZXNvdXJjZSwgcmVzb3VyY2UgPT4gdGhpcy5ybShyZXNvdXJjZSkpO1xuICAgIH1cblxuICAgIGxldCByaWQgPSByZXNvdXJjZS5yaWQ7XG5cbiAgICB0aGlzLnN0YWdlZFtyaWRdID0gbnVsbDtcblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyaWRdO1xuXG4gIH1cblxuICBhZGQgKHJlc291cmNlKSB7XG5cbiAgICBpZihfLmlzQXJyYXkocmVzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gXy5tYXAocmVzb3VyY2UsIHJlc291cmNlID0+IHRoaXMuYWRkKHJlc291cmNlKSk7XG4gICAgfVxuXG4gICAgbGV0IHJpZCA9IHJlc291cmNlLnJpZDtcblxuICAgIGlmICghdGhpcy5wb29sW3JpZF0pIHtcbiAgICAgIHRoaXMucG9vbFtyaWRdID0gcmVzb3VyY2U7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFnZWRbcmlkXSA9IHJlc291cmNlLnNlcmlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3JpZF07XG5cbiAgfVxuXG4gIHJtTGlua2FnZSAocmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSB7XG5cbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlTGlua2FnZU9wZXJhdGlvbihcbiAgICAgICdyZW1vdmUnLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpO1xuXG4gIH1cblxuICBhZGRMaW5rYWdlIChyZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uKFxuICAgICAgJ2FkZCcsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIF9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uIChvcCwgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSB7XG5cbiAgICBpZihfLmlzQXJyYXkobGlua2FnZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChsaW5rYWdlLCBsaW5rYWdlID0+IHRoaXMuX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24oXG4gICAgICAgIG9wLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhZ2VkID0ge1xuICAgICAgb3AsXG4gICAgICByZXNvdXJjZSxcbiAgICAgIHJlbGF0aW9uLFxuICAgICAgbGlua2FnZSxcbiAgICAgIG9wdGlvbnNcbiAgICB9O1xuXG4gICAgdGhpcy5zdGFnZWRMaW5rLnB1c2goc3RhZ2VkKTtcblxuICAgIHJldHVybiBzdGFnZWQ7XG5cbiAgfVxuXG4gIGdldFN0YWdlZCAocmVzb3VyY2UpIHtcblxuICAgIGlmICghdGhpcy5pc1N0YWdlZChyZXNvdXJjZSkpIHtcbiAgICAgIHRocm93IEVycm9yKGBjYW4gbm90IGZpbmQgJHtyZXNvdXJjZX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmVzb3VyY2UucmlkXTtcblxuICB9XG5cbiAgaXNTdGFnZWQgKHJlc291cmNlKSB7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmVzb3VyY2UucmlkXSAhPT0gdW5kZWZpbmVkO1xuXG4gIH1cblxuICBjb21taXQgKCkge1xuXG4gICAgbGV0IGxhc3RDb21taXQgPSB0aGlzLmdldENvbW1pdCgpO1xuXG4gICAgbGV0IG5ld0NvbW1pdCA9IF8ucmVkdWNlKHRoaXMuc3RhZ2VkLCAoY29tbWl0LCBzZXJpYWxpemVkLCByaWQpID0+IHtcbiAgICAgIGlmICghc2VyaWFsaXplZCkge1xuICAgICAgICBpZiAoY29tbWl0W3JpZF0pIHtcbiAgICAgICAgICBkZWxldGUgY29tbWl0W3JpZF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjb21taXRbcmlkXSA9IHRoaXMuX2NyZWF0ZUJsb2Ioc2VyaWFsaXplZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29tbWl0O1xuICAgIH0sIF8uY2xvbmUobGFzdENvbW1pdCwgdHJ1ZSkpO1xuXG4gICAgXy5yZWR1Y2UodGhpcy5zdGFnZWRMaW5rLCAoY29tbWl0LCBsaW5rT3BlcmF0aW9uKSA9PiB7XG4gICAgICBjb21taXRbdXVpZC52NCgpXSA9IGxpbmtPcGVyYXRpb247XG4gICAgICByZXR1cm4gY29tbWl0O1xuICAgIH0sIG5ld0NvbW1pdCk7XG5cbiAgICB0aGlzLmNvbW1pdHMucHVzaChuZXdDb21taXQpO1xuICAgIHRoaXMuc3RhZ2VkID0ge307XG4gICAgdGhpcy5zdGFnZWRMaW5rID0gW107XG5cbiAgfVxuXG4gIGFkZFJlbW90ZSAodHlwZSwgdXJsKSB7XG5cbiAgICB0aGlzLnJlbW90ZVt0eXBlXSA9IHVybDtcblxuICB9XG5cbiAgZ2V0UmVtb3RlICh0eXBlLCBpZCwgcmVsYXRpb24pIHtcblxuICAgIGxldCB1cmxQYXJ0cyA9IF8uY29tcGFjdChbXG4gICAgICB0aGlzLnJlbW90ZVt0eXBlXSxcbiAgICAgIGlkLFxuICAgICAgcmVsYXRpb24gPyAnbGlua3MnIDogdW5kZWZpbmVkLFxuICAgICAgcmVsYXRpb25cbiAgICBdKTtcbiAgICByZXR1cm4gdXJsam9pbi5hcHBseShudWxsLCB1cmxQYXJ0cyk7XG5cbiAgfVxuXG4gIGdldCAodHlwZSwgaWQpIHtcblxuICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoJ3R5cGUnKSA9PT0gdHlwZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBfLmZpbmQodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCd0eXBlJykgPT09IHR5cGUgJiZcbiAgICAgICAgcmVzb3VyY2UuZ2V0KCdpZCcpID09PSBpZDtcbiAgICB9KTtcblxuICB9XG5cbiAgaGFzICh0eXBlLCBpZCkge1xuXG4gICAgcmV0dXJuICEhXy5maW5kKHRoaXMucG9vbCwgcmVzb3VyY2UgPT4ge1xuICAgICAgcmV0dXJuIHJlc291cmNlLmdldCgndHlwZScpID09PSB0eXBlICYmXG4gICAgICAgIHJlc291cmNlLmdldCgnaWQnKSA9PT0gaWQ7XG4gICAgfSk7XG5cbiAgfVxuXG4gIF9jcmVhdGVCbG9iIChzZXJpYWxpemVkKSB7XG5cbiAgICBsZXQgYmlkID0gdXVpZC52NCgpO1xuICAgIHRoaXMuYmxvYnNbYmlkXSA9IF8uY2xvbmUoc2VyaWFsaXplZCwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXMuYmxvYnNbYmlkXTtcblxuICB9XG5cbiAgX2dldEJsb2IgKGJpZCkge1xuXG4gICAgcmV0dXJuIHRoaXMuYmxvYnNbYmlkXTtcblxuICB9XG5cbiAgcHVsbEJ5TGluayAobGluaywgb3B0aW9ucykge1xuXG4gICAgbGV0IHVybDtcbiAgICBpZiAoXy5pc1N0cmluZyhsaW5rKSkge1xuICAgICAgdXJsID0gbGluaztcbiAgICB9XG4gICAgZWxzZSBpZiAobGluay5saW5rYWdlKSB7XG4gICAgICB1cmwgPSB0aGlzLmdldFJlbW90ZShsaW5rLmxpbmthZ2UudHlwZSwgbGluay5saW5rYWdlLmlkKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobGluay5yZWxhdGVkKSB7XG4gICAgICB1cmwgPSBsaW5rLnJlbGF0ZWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGxpbmsuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHVsbEJ5VVJMKHVybCwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIHB1bGwgKHR5cGUsIGlkLCBvcHRpb25zKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wdWxsQnlVUkwodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpLCBvcHRpb25zKTtcblxuICB9XG5cbiAgcHVsbEJ5VVJMICh1cmwsIG9wdGlvbnMpIHtcblxuICAgIGlmICghXy5pc0VtcHR5KHRoaXMuc3RhZ2VkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwdWxsIHdoZW4gc3RhZ2VkIGNoYW5nZSBpcyBub3QgZXhpc3QnKTtcbiAgICB9XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIGxldCBpbmNsdWRlZCA9IG9wdGlvbnMuaW5jbHVkZWQ7XG4gICAgaWYgKGluY2x1ZGVkKSB7XG4gICAgICBvcHRpb25zLmluY2x1ZGVkID0gaW5jbHVkZWQuam9pbignLCcpO1xuICAgIH1cblxuICAgIGxldCBmaWVsZHMgPSBvcHRpb25zLmZpZWxkcztcbiAgICBpZiAoZmllbGRzKSB7XG4gICAgICBfLnJlZHVjZShmaWVsZHMsIChvcHRpb25zLCBmaWVsZHMsIHR5cGUpID0+IHtcbiAgICAgICAgb3B0aW9uc1tgZmllbGRzWyR7dHlwZX1dYF0gPSBmaWVsZHMuam9pbignLCcpO1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICAgIH0sIG9wdGlvbnMpO1xuICAgICAgZGVsZXRlIG9wdGlvbnMuZmllbGRzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN5bmMuZ2V0KHVybCwgb3B0aW9ucylcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICB9KTtcblxuICB9XG5cbiAgcHVzaCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggfHwgdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG5cbiAgICBpZiAoaWR4IDw9IHRoaXMucmVtb3RlSW5kZXgpIHtcbiAgICAgIHJldHVybiBRKCk7XG4gICAgfVxuXG4gICAgbGV0IGFmdGVyQ29tbWl0ID0gdGhpcy5nZXRDb21taXQoaWR4KTtcbiAgICBsZXQgYmVmb3JlQ29tbWl0ID0gdGhpcy5nZXRDb21taXQodGhpcy5yZW1vdGVJbmRleCk7XG5cbiAgICBsZXQgcmVtb3ZlZCA9IF8uZGlmZmVyZW5jZShcbiAgICAgIF8ua2V5cyhiZWZvcmVDb21taXQpLFxuICAgICAgXy5rZXlzKGFmdGVyQ29tbWl0KVxuICAgICk7XG5cbiAgICBsZXQgY2hhbmdlZE9yQWRkZWQgPSBfLndpdGhvdXQoXG4gICAgICBfLmtleXMoYWZ0ZXJDb21taXQpLFxuICAgICAgXy5rZXlzKHJlbW92ZWQpXG4gICAgKTtcblxuICAgIGxldCBkZWxldGVSZXF1ZXN0ID0gXy5tYXAocmVtb3ZlZCwgcmlkID0+IHtcbiAgICAgIC8vIGlzIExpbmtcbiAgICAgIGlmICghdGhpcy5wb29sW3JpZF0pIHsgcmV0dXJuOyB9XG5cbiAgICAgIGxldCB0eXBlID0gdGhpcy5wb29sW3JpZF0uZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ2lkJyk7XG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5kZWxldGUodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IGRlbGV0ZSB0aGlzLnBvb2xbcmlkXSxcbiAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fc2F2ZURhdGEoYmVmb3JlQ29tbWl0W3JpZF0sIHJpZCk7XG4gICAgICAgICAgICAgIHJldHVybiBRLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBwb3N0T3JQYXRjaFJlcXVlc3QgPSBfLm1hcChjaGFuZ2VkT3JBZGRlZCwgcmlkID0+IHtcbiAgICAgIC8vIGlzIExpbmtcbiAgICAgIGlmICghdGhpcy5wb29sW3JpZF0pIHsgcmV0dXJuOyB9XG4gICAgICAvLyBub3QgY2hhbmdlXG4gICAgICBpZiAoXy5pc0VxdWFsKGFmdGVyQ29tbWl0W3JpZF0sIGJlZm9yZUNvbW1pdFtyaWRdKSkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ3R5cGUnKTtcbiAgICAgIGxldCBpZCA9IHRoaXMucG9vbFtyaWRdLmdldCgnaWQnKTtcbiAgICAgIGxldCBkZWx0YSA9IGRpZmYoYmVmb3JlQ29tbWl0W3JpZF0sIGFmdGVyQ29tbWl0W3JpZF0pO1xuXG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgXy5leHRlbmQoZGVsdGEsIHsgdHlwZSwgaWQgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMucGF0Y2godGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvUmVxdWVzdChkZWx0YSkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlLCByaWQpLFxuICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9zYXZlRGF0YShiZWZvcmVDb21taXRbcmlkXSwgcmlkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCFpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBvc3QodGhpcy5nZXRSZW1vdGUodHlwZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90b1JlcXVlc3QoZGVsdGEpKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHRoaXMuX3NhdmVSZXNwb25zZShyZXNwb25zZSwgcmlkKSxcbiAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlKHJpZCk7XG4gICAgICAgICAgICAgIHJldHVybiBRLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBsaW5rT3BlcmF0aW9uUmVxdWVzdCA9IF8ubWFwKGFmdGVyQ29tbWl0LCAoc3RhZ2VkLCByaWQpID0+IHtcbiAgICAgIC8vIGlzIHJlc291cmNlXG4gICAgICBpZiAodGhpcy5wb29sW3JpZF0gfHwgIXN0YWdlZC5vcCkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSBzdGFnZWQucmVzb3VyY2UuZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSBzdGFnZWQucmVzb3VyY2UuZ2V0KCdpZCcpO1xuICAgICAgbGV0IG9wdGlvbnMgPSBfLmRlZmF1bHRzKHN0YWdlZC5vcHRpb25zIHx8IHt9LCB7XG4gICAgICAgIGhhc01hbnk6IHRydWVcbiAgICAgIH0pO1xuICAgICAgbGV0IG9wID0gc3RhZ2VkLm9wO1xuICAgICAgbGV0IHJlbGF0aW9uID0gc3RhZ2VkLnJlbGF0aW9uO1xuICAgICAgbGV0IGxpbmthZ2UgPSBzdGFnZWQubGlua2FnZTtcbiAgICAgIGxldCByZXF1ZXN0Qm9keSA9IG9wdGlvbnMuaGFzTWFueSA/XG4gICAgICAgIHsgZGF0YTogW2xpbmthZ2VdIH0gOiB7IGRhdGE6IGxpbmthZ2UgfTtcblxuICAgICAgaWYgKG9wID09PSAnYWRkJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBvc3QodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQsIHJlbGF0aW9uKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5KVxuICAgICAgICAgIC50aGVuKCgpID0+IHJlcXVlc3RCb2R5KVxuICAgICAgICAgIC50aGVuKCgpID0+IGRlbGV0ZSBhZnRlckNvbW1pdFtyaWRdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wID09PSAncmVtb3ZlJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLmRlbGV0ZSh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCwgcmVsYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHkpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gcmVxdWVzdEJvZHkpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gZGVsZXRlIGFmdGVyQ29tbWl0W3JpZF0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuYWxsKFxuICAgICAgZGVsZXRlUmVxdWVzdC5jb25jYXQoXG4gICAgICAgIHBvc3RPclBhdGNoUmVxdWVzdCxcbiAgICAgICAgbGlua09wZXJhdGlvblJlcXVlc3QpXG4gICAgKVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0UmVtb3RlSW5kZXgoKTtcbiAgICB9KTtcblxuICB9XG5cbiAgX3NhdmVSZXNwb25zZSAocmVzcG9uc2UsIHJpZCkge1xuXG4gICAgbGV0IG1haW5SZXNvdXJjZSA9IHRoaXMuX3NhdmVEYXRhKHJlc3BvbnNlLmRhdGEsIHJpZCk7XG4gICAgbGV0IGluY2x1ZGVkUmVzb3VyY2VzID0gXy5tYXAoXG4gICAgICByZXNwb25zZS5pbmNsdWRlZCwgZGF0YSA9PiB0aGlzLl9zYXZlRGF0YShkYXRhKSk7XG4gICAgcmV0dXJuIG1haW5SZXNvdXJjZTtcblxuICB9XG5cbiAgX3JlbW92ZSAocmlkKSB7XG5cbiAgICBpZiAoXy5pc0FycmF5KHJpZCkpIHtcbiAgICAgIHJldHVybiBfLm1hcChyaWQsIGRhdGEgPT4gdGhpcy5fcmVtb3ZlKHJpZCkpO1xuICAgIH1cblxuICAgIGxldCByZXNvdXJjZSA9IHRoaXMucG9vbFtyaWRdO1xuXG4gICAgbGV0IHN0YWdlZEJhY2t1cCA9IF8uY2xvbmUodGhpcy5zdGFnZWQsIHRydWUpO1xuXG4gICAgdGhpcy5ybShyZXNvdXJjZSk7XG4gICAgdGhpcy5jb21taXQoKTtcbiAgICB0aGlzLnNldFJlbW90ZUluZGV4KCk7XG5cbiAgICB0aGlzLnN0YWdlZCA9IHN0YWdlZEJhY2t1cDtcblxuICB9XG5cbiAgX3NhdmVEYXRhIChkYXRhLCByaWQpIHtcblxuICAgIGlmIChfLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChkYXRhLCBkYXRhID0+IHRoaXMuX3NhdmVEYXRhKGRhdGEpKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzb3VyY2UgPSByaWQgIT09IHVuZGVmaW5lZCA/XG4gICAgICB0aGlzLnBvb2xbcmlkXSA6IHRoaXMuZ2V0KGRhdGEudHlwZSwgZGF0YS5pZCk7XG5cbiAgICBpZiAoIXJlc291cmNlKSB7XG4gICAgICByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZShkYXRhKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXNvdXJjZS5kZXNlcmlhbGl6ZShkYXRhKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhZ2VkQmFja3VwID0gXy5jbG9uZSh0aGlzLnN0YWdlZCwgdHJ1ZSk7XG5cbiAgICB0aGlzLmFkZChyZXNvdXJjZSk7XG4gICAgdGhpcy5jb21taXQoKTtcbiAgICB0aGlzLnNldFJlbW90ZUluZGV4KCk7XG5cbiAgICB0aGlzLnN0YWdlZCA9IHN0YWdlZEJhY2t1cDtcblxuICAgIHJldHVybiByZXNvdXJjZTtcblxuICB9XG5cbiAgX3RvUmVxdWVzdCAoc2VyaWFsaXplZCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IHNlcmlhbGl6ZWRcbiAgICB9O1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFBvb2w7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9Qb29sLmpzXG4gKiovIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCBSZXNwb25zZSBmcm9tICcuL1Jlc3BvbnNlJztcblxuXG5sZXQgc3RyaW5naWZ5UmVxdWlyZWRNZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gIC8vIHRoZXNlIEhUVFAgbWV0aG9kcyByZXF1aXJlcyBKU09OLnN0cmluZ2lmeVxuICByZXR1cm4gKC9eKFBPU1R8UFVUfFBBVENIfERFTEVURSkkLy50ZXN0KG1ldGhvZC50b1VwcGVyQ2FzZSgpKSk7XG59O1xuXG5sZXQgbWFrZUFqYXhSZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBpZiAoc3RyaW5naWZ5UmVxdWlyZWRNZXRob2Qob3B0aW9ucy50eXBlKSkge1xuICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgIG9wdGlvbnMuZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgb3B0aW9ucy51cmwgPSBvcHRpb25zLnVybC5yZXBsYWNlKC9cXC8/JC8sICcvJyk7XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL3dpa2kvQ29taW5nLWZyb20talF1ZXJ5XG4gIHJldHVybiBRLnByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICQuYWpheChvcHRpb25zKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZmFpbChmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZWplY3QocmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH0pO1xuXG59O1xuXG5cblxubGV0IFJFU1RmdWwgPSB7XG5cbiAgaGVhZDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJIRUFEXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGdldDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcG9zdDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHB1dDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQVVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcGF0Y2g6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUEFUQ0hcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZGVsZXRlOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkRFTEVURVwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBkZWZhdWx0T3B0aW9uczoge1xuXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICBwcm9jZXNzRGF0YTogdHJ1ZVxuXG4gIH0sXG5cbiAgYWpheFNldHVwOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gICAgJC5hamF4U2V0dXAob3B0aW9ucyk7XG5cbiAgfVxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBSRVNUZnVsO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvUkVTVGZ1bC5qc1xuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcblxuXG5jbGFzcyBUcmFuc2FjdGlvbiB7XG5cbiAgY29uc3RydWN0b3IocG9vbCwgb3B0aW9ucykge1xuXG4gICAgXy5leHRlbmQodGhpcywgRXZlbnRzKTtcbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMucG9vbCA9IHBvb2w7XG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG5cbiAgfVxuXG4gIGJlZ2luICgpIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuX2FjdGl2YXRlKCk7XG5cbiAgfVxuXG4gIGNvbW1pdCAoKSB7XG5cbiAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XG5cbiAgfVxuXG5cbiAgX2FjdGl2YXRlICgpIHtcblxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gIH1cblxuICBfZGVhY3RpdmF0ZSAoKSB7XG5cbiAgICB0aGlzLnN0b3BMaXN0ZW5pbmcodGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICB9XG5cbiAgb25UcmFuc2Zvcm0gKG9wZXJhdGlvbikge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zLnB1c2gob3BlcmF0aW9uKTtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHJhbnNhY3Rpb247XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9UcmFuc2FjdGlvbi5qc1xuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQganNvbmRpZmZwYXRjaCBmcm9tICdqc29uZGlmZnBhdGNoJztcblxuXG52YXIgZGlmZnBhdGNoZXIgPSBqc29uZGlmZnBhdGNoLmNyZWF0ZSh7XG4gIHRleHREaWZmOiB7XG4gICAgbWluTGVuZ3RoOiBJbmZpbml0eVxuICB9XG59KTtcblxuXG5mdW5jdGlvbiBnZXRBZnRlclZhbHVlRnJvbURpZmYgKGRpZmYpIHtcblxuICBpZiAoIV8uaXNBcnJheShkaWZmKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCB0eXBlIScpO1xuICB9XG5cbiAgc3dpdGNoIChkaWZmLmxlbmd0aCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBkaWZmWzBdO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBkaWZmWzFdO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxufVxuXG5cbmZ1bmN0aW9uIGdldENoYW5nZWQgKGRpZmZzKSB7XG5cbiAgaWYgKF8uaXNBcnJheShkaWZmcykpIHtcbiAgICByZXR1cm4gZ2V0QWZ0ZXJWYWx1ZUZyb21EaWZmKGRpZmZzKTtcbiAgfVxuXG4gIHJldHVybiBfLnJlZHVjZShkaWZmcywgZnVuY3Rpb24gKHJlc3VsdCwgZGlmZiwga2V5KSB7XG5cbiAgICBpZiAoXy5pc09iamVjdChkaWZmKSkge1xuICAgICAgaWYgKGRpZmYuX3QgPT09ICdhJykge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICAgcmVzdWx0W2tleV0gPSBnZXRDaGFuZ2VkKGRpZmYpO1xuICAgIH1cbiAgICBlbHNlIGlmIChfLmlzQXJyYXkoZGlmZikpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gZ2V0QWZ0ZXJWYWx1ZUZyb21EaWZmKGRpZmYpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgfSwge30pO1xuXG59XG5cbmZ1bmN0aW9uIGRpZmYgKG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuXG4gIHZhciBkZWx0YSA9IGRpZmZwYXRjaGVyLmRpZmYob2xkVmFsdWUsIG5ld1ZhbHVlKTtcbiAgcmV0dXJuIGdldENoYW5nZWQoZGVsdGEpO1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRpZmY7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9kaWZmLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzZfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiX1wiXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5cblxuY2xhc3MgUmVzb3VyY2Uge1xuXG4gIGNvbnN0cnVjdG9yKGF0dHJpYnV0ZXMpIHtcblxuICAgIHRoaXMuYXR0cmlidXRlcyA9IHt9O1xuICAgIHRoaXMubGlua3MgPSB7fTtcbiAgICB0aGlzLnJpZCA9IHV1aWQudjQoKTtcblxuICAgIHRoaXMuZGVzZXJpYWxpemUoYXR0cmlidXRlcyk7XG5cbiAgfVxuXG4gIGdldCAoa2V5KSB7XG5cbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2tleV07XG5cbiAgfVxuXG4gIHNldCAoYXR0cmlidXRlcykge1xuXG4gICAgXy5leHRlbmQodGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcblxuICB9XG5cbiAgdW5zZXQgKGtleSkge1xuXG4gICAgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1trZXldO1xuXG4gIH1cblxuICBnZXRMaW5rIChrZXkpIHtcblxuICAgIGtleSA9IGtleSB8fCAnc2VsZic7XG4gICAgcmV0dXJuIHRoaXMubGlua3Nba2V5XTtcblxuICB9XG5cbiAgc2V0TGluayAobGlua3MpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMubGlua3MsIGxpbmtzKTtcblxuICB9XG5cbiAgdW5zZXRMaW5rIChrZXkpIHtcblxuICAgIGRlbGV0ZSB0aGlzLmxpbmtzW2tleV07XG5cbiAgfVxuXG4gIGdldExpbmthZ2UgKCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHRoaXMuYXR0cmlidXRlcy50eXBlLFxuICAgICAgaWQ6IHRoaXMuYXR0cmlidXRlcy5pZFxuICAgIH07XG5cbiAgfVxuXG4gIHNlcmlhbGl6ZSAoKSB7XG5cbiAgICBsZXQgcmVzdWx0ID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMsIHRydWUpO1xuICAgIHJlc3VsdC5saW5rcyA9IHRoaXMubGlua3M7XG5cbiAgICBpZiAoXy5pc0VtcHR5KHJlc3VsdC5saW5rcykpIHtcbiAgICAgIGRlbGV0ZSByZXN1bHQubGlua3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcblxuICB9XG5cbiAgZGVzZXJpYWxpemUgKHNlcmlhbGl6ZWQpIHtcblxuICAgIGlmICghdGhpcy5fdmFsaWRhdGVTZXJpYWxpemVkKHNlcmlhbGl6ZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZGF0YSEgdHlwZSBzaG91bGQgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldChfLmNsb25lKF8ub21pdChzZXJpYWxpemVkLCAnbGlua3MnKSwgdHJ1ZSkpO1xuICAgIHRoaXMuc2V0TGluayhzZXJpYWxpemVkLmxpbmtzKTtcblxuICB9XG5cbiAgY2xvbmUgKCkge1xuXG4gICAgbGV0IHJlc291cmNlID0gbmV3IFJlc291cmNlKHRoaXMuc2VyaWFsaXplKCkpO1xuICAgIHJlc291cmNlLnV1aWQgPSB0aGlzLnV1aWQ7XG4gICAgcmV0dXJuIHJlc291cmNlO1xuXG4gIH1cblxuICBfdmFsaWRhdGVTZXJpYWxpemVkIChzZXJpYWxpemVkKSB7XG5cbiAgICByZXR1cm4gc2VyaWFsaXplZCAmJiBzZXJpYWxpemVkLnR5cGU7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2U7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9SZXNvdXJjZS5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV84X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInVybGpvaW5cIlxuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV85X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInV1aWRcIlxuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xMF9fO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJqc29uZGlmZnBhdGNoXCJcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzExX187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcIkJhY2tib25lXCJcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzEyX187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcIiRcIlxuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5cbmxldCBfdmFsaWRhdGVSZXNwb25zZSA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgYm9keSA9IHhoci5yZXNwb25zZUpTT047XG5cbiAgaWYgKGJvZHkuZGF0YSA9PT0gdW5kZWZpbmVkICYmIGJvZHkuZXJyb3JzID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGRvY3VtZW50IE1VU1QgY29udGFpbiBlaXRoZXIgcHJpbWFyeSBkYXRhIFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJvciBhbiBhcnJheSBvZiBlcnJvciBvYmplY3RzLlwiKTtcbiAgfVxuXG59O1xuXG5cbmxldCBfaXNSZXNwb25zZUVycm9yID0gZnVuY3Rpb24gKHN0YXR1cykge1xuXG4gIHJldHVybiA0MDAgPD0gc3RhdHVzICYmIDYwMCA+IHN0YXR1cyA7XG5cbn07XG5cblxubGV0IF9wYXJzZURhdGEgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgaWYgKCF4aHIucmVzcG9uc2VKU09OKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHhoci5yZXNwb25zZUpTT04uZGF0YTtcblxufTtcblxubGV0IF9wYXJzZUluY2x1ZGVkID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICgheGhyLnJlc3BvbnNlSlNPTikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB4aHIucmVzcG9uc2VKU09OLmluY2x1ZGVkO1xuXG59O1xuXG5sZXQgX3BhcnNlRXJyb3JzID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICghKHhoci5yZXNwb25zZUpTT04gJiYgeGhyLnJlc3BvbnNlSlNPTi5lcnJvcnMgKSkge1xuICAgIGlmIChfaXNSZXNwb25zZUVycm9yKHhoci5zdGF0dXMpKSB7XG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgICAgfV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGVycm9ycyA9IHhoci5yZXNwb25zZUpTT04uZXJyb3JzO1xuXG4gIHJldHVybiBfLm1hcChlcnJvcnMsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHJldHVybiBfLmV4dGVuZCh7XG4gICAgICBzdGF0dXM6IFwiXCIgKyB4aHIuc3RhdHVzXG4gICAgfSwgZXJyb3IpO1xuICB9KTtcblxufTtcblxuXG5sZXQgX3BhcnNlSGVhZGVycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgbGV0IGhlYWRlclJlZ2V4ID0gL14oLio/KTpbIFxcdF0qKFteXFxyXFxuXSopJC9tZztcbiAgbGV0IGhlYWRlcnNTdHJpbmcgPSB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCk7XG4gIGxldCBmaW5kUmVzdWx0O1xuXG4gIHdoaWxlICgoZmluZFJlc3VsdCA9IGhlYWRlclJlZ2V4LmV4ZWMoaGVhZGVyc1N0cmluZykpICE9PSBudWxsKSB7XG4gICAgcmVzdWx0LnB1c2goZmluZFJlc3VsdC5zbGljZSgxKSk7XG4gIH1cblxuICByZXR1cm4gXy5vYmplY3QocmVzdWx0KTtcblxufTtcblxuXG5jbGFzcyBSZXNwb25zZSB7XG5cbiAgY29uc3RydWN0b3IgKHhocikge1xuXG4gICAgdGhpcy5yZXNwb25zZUpTT04gPSB4aHIucmVzcG9uc2VKU09OO1xuICAgIHRoaXMuZGF0YSA9IF9wYXJzZURhdGEoeGhyKTtcbiAgICB0aGlzLmluY2x1ZGVkID0gX3BhcnNlSW5jbHVkZWQoeGhyKTtcbiAgICB0aGlzLmVycm9ycyA9IF9wYXJzZUVycm9ycyh4aHIpO1xuICAgIHRoaXMuaGVhZGVycyA9IF9wYXJzZUhlYWRlcnMoeGhyKTtcbiAgICB0aGlzLm5hdGl2ZVhIUiA9IHhocjtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2U7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9SZXNwb25zZS5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=