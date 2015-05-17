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

	module.exports = require("q");

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
	        var delta = (0, _diff2['default'])(beforeCommit[rid], afterCommit[rid]);
	
	        if (id) {
	          _lodash2['default'].extend(delta, { type: type, id: id });
	          return _this6.sync.patch(_this6.getRemote(type, id), _this6._toRequest(delta)).then(function (response) {
	            return _this6._saveResponse(response, rid);
	          });
	        }
	        if (!id) {
	          return _this6.sync.post(_this6.getRemote(type), _this6._toRequest(delta)).then(function (response) {
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
	
	var diffpatcher = _jsondiffpatch2['default'].create({});
	
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

	module.exports = require("lodash");

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

	module.exports = require("url-join");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("node-uuid");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("jsondiffpatch");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("backbone");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("jquery");

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
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTJmNTExZDg1YzYyODM1MDRiNGMiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicVwiIiwid2VicGFjazovLy8uL2xpYi9Qb29sLmpzIiwid2VicGFjazovLy8uL2xpYi9SRVNUZnVsLmpzIiwid2VicGFjazovLy8uL2xpYi9UcmFuc2FjdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9saWIvZGlmZi5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vLi9saWIvUmVzb3VyY2UuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXJsLWpvaW5cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLXV1aWRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJqc29uZGlmZnBhdGNoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYmFja2JvbmVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJqcXVlcnlcIiIsIndlYnBhY2s6Ly8vLi9saWIvUmVzcG9uc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7d0NDdENxQixDQUFnQjs7OztvQ0FDcEIsQ0FBWTs7Ozt1Q0FDVCxDQUFlOzs7OzJDQUNYLENBQW1COzs7O29DQUMxQixDQUFZOzs7O1NBSTNCLFdBQVc7U0FDWCxRQUFRO1NBQ1IsSUFBSTtTQUNKLE9BQU87U0FDUCxJQUFJLHdCOzs7Ozs7QUNaTiwrQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O21DQ0FjLENBQVE7Ozs7OEJBQ1IsQ0FB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LEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLE9BQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0VBRXRCOztzQkFJWSxRQUFRIiwiZmlsZSI6Impzb25hcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDkyZjUxMWQ4NWM2MjgzNTA0YjRjXG4gKiovIiwiaW1wb3J0IFJlc291cmNlIGZyb20gJy4vbGliL1Jlc291cmNlJztcbmltcG9ydCBQb29sIGZyb20gJy4vbGliL1Bvb2wnO1xuaW1wb3J0IFJFU1RmdWwgZnJvbSAnLi9saWIvUkVTVGZ1bCc7XG5pbXBvcnQgVHJhbnNhY3Rpb24gZnJvbSAnLi9saWIvVHJhbnNhY3Rpb24nO1xuaW1wb3J0IGRpZmYgZnJvbSAnLi9saWIvZGlmZic7XG5cblxuZXhwb3J0IHtcbiAgVHJhbnNhY3Rpb24sXG4gIFJlc291cmNlLFxuICBQb29sLFxuICBSRVNUZnVsLFxuICBkaWZmXG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9pbmRleC5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInFcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInFcIlxuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB1cmxqb2luIGZyb20gJ3VybC1qb2luJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5pbXBvcnQgZGlmZiBmcm9tICcuL2RpZmYnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xuaW1wb3J0IFJFU1RmdWwgZnJvbSAnLi9SRVNUZnVsJztcblxuXG5jbGFzcyBQb29sIHtcblxuICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuXG4gICAgdGhpcy5zeW5jID0gUkVTVGZ1bDtcbiAgICB0aGlzLnJlc2V0QWxsKCk7XG5cbiAgfVxuXG4gIHJlc2V0QWxsICgpIHtcblxuICAgIHRoaXMucG9vbCA9IHt9O1xuICAgIHRoaXMuYmxvYnMgPSB7fTtcbiAgICB0aGlzLnN0YWdlZCA9IHt9O1xuICAgIHRoaXMuc3RhZ2VkTGluayA9IFtdO1xuICAgIHRoaXMucmVtb3RlID0ge307XG4gICAgdGhpcy5jb21taXRzID0gW107XG4gICAgdGhpcy5yZW1vdGVJbmRleCA9IC0xO1xuXG4gIH1cblxuICBnZXRDb21taXQgKGlkeCkge1xuXG4gICAgaWR4ID0gaWR4ICE9PSB1bmRlZmluZWQgPyBpZHggOiB0aGlzLmNvbW1pdHMubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gdGhpcy5jb21taXRzW2lkeF0gfHwge307XG5cbiAgfVxuXG4gIHNldFJlbW90ZUluZGV4IChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCAhPT0gdW5kZWZpbmVkID8gaWR4IDogdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG4gICAgdGhpcy5yZW1vdGVJbmRleCA9IGlkeDtcblxuICB9XG5cbiAgcm0gKHJlc291cmNlKSB7XG5cbiAgICBpZihfLmlzQXJyYXkocmVzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gXy5tYXAocmVzb3VyY2UsIHJlc291cmNlID0+IHRoaXMucm0ocmVzb3VyY2UpKTtcbiAgICB9XG5cbiAgICBsZXQgcmlkID0gcmVzb3VyY2UucmlkO1xuXG4gICAgdGhpcy5zdGFnZWRbcmlkXSA9IG51bGw7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmlkXTtcblxuICB9XG5cbiAgYWRkIChyZXNvdXJjZSkge1xuXG4gICAgaWYoXy5pc0FycmF5KHJlc291cmNlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKHJlc291cmNlLCByZXNvdXJjZSA9PiB0aGlzLmFkZChyZXNvdXJjZSkpO1xuICAgIH1cblxuICAgIGxldCByaWQgPSByZXNvdXJjZS5yaWQ7XG5cbiAgICBpZiAoIXRoaXMucG9vbFtyaWRdKSB7XG4gICAgICB0aGlzLnBvb2xbcmlkXSA9IHJlc291cmNlO1xuICAgIH1cblxuICAgIHRoaXMuc3RhZ2VkW3JpZF0gPSByZXNvdXJjZS5zZXJpYWxpemUoKTtcblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyaWRdO1xuXG4gIH1cblxuICBybUxpbmthZ2UgKHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykge1xuXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24oXG4gICAgICAncmVtb3ZlJywgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKTtcblxuICB9XG5cbiAgYWRkTGlua2FnZSAocmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSB7XG5cbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlTGlua2FnZU9wZXJhdGlvbihcbiAgICAgICdhZGQnLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpO1xuXG4gIH1cblxuICBfY3JlYXRlTGlua2FnZU9wZXJhdGlvbiAob3AsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykge1xuXG4gICAgaWYoXy5pc0FycmF5KGxpbmthZ2UpKSB7XG4gICAgICByZXR1cm4gXy5tYXAobGlua2FnZSwgbGlua2FnZSA9PiB0aGlzLl9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uKFxuICAgICAgICBvcCwgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSk7XG4gICAgfVxuXG4gICAgbGV0IHN0YWdlZCA9IHtcbiAgICAgIG9wLFxuICAgICAgcmVzb3VyY2UsXG4gICAgICByZWxhdGlvbixcbiAgICAgIGxpbmthZ2UsXG4gICAgICBvcHRpb25zXG4gICAgfTtcblxuICAgIHRoaXMuc3RhZ2VkTGluay5wdXNoKHN0YWdlZCk7XG5cbiAgICByZXR1cm4gc3RhZ2VkO1xuXG4gIH1cblxuICBnZXRTdGFnZWQgKHJlc291cmNlKSB7XG5cbiAgICBpZiAoIXRoaXMuaXNTdGFnZWQocmVzb3VyY2UpKSB7XG4gICAgICB0aHJvdyBFcnJvcihgY2FuIG5vdCBmaW5kICR7cmVzb3VyY2V9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3Jlc291cmNlLnJpZF07XG5cbiAgfVxuXG4gIGlzU3RhZ2VkIChyZXNvdXJjZSkge1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3Jlc291cmNlLnJpZF0gIT09IHVuZGVmaW5lZDtcblxuICB9XG5cbiAgY29tbWl0ICgpIHtcblxuICAgIGxldCBsYXN0Q29tbWl0ID0gdGhpcy5nZXRDb21taXQoKTtcblxuICAgIGxldCBuZXdDb21taXQgPSBfLnJlZHVjZSh0aGlzLnN0YWdlZCwgKGNvbW1pdCwgc2VyaWFsaXplZCwgcmlkKSA9PiB7XG4gICAgICBpZiAoIXNlcmlhbGl6ZWQpIHtcbiAgICAgICAgaWYgKGNvbW1pdFtyaWRdKSB7XG4gICAgICAgICAgZGVsZXRlIGNvbW1pdFtyaWRdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY29tbWl0W3JpZF0gPSB0aGlzLl9jcmVhdGVCbG9iKHNlcmlhbGl6ZWQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbW1pdDtcbiAgICB9LCBfLmNsb25lKGxhc3RDb21taXQsIHRydWUpKTtcblxuICAgIF8ucmVkdWNlKHRoaXMuc3RhZ2VkTGluaywgKGNvbW1pdCwgbGlua09wZXJhdGlvbikgPT4ge1xuICAgICAgY29tbWl0W3V1aWQudjQoKV0gPSBsaW5rT3BlcmF0aW9uO1xuICAgICAgcmV0dXJuIGNvbW1pdDtcbiAgICB9LCBuZXdDb21taXQpO1xuXG4gICAgdGhpcy5jb21taXRzLnB1c2gobmV3Q29tbWl0KTtcbiAgICB0aGlzLnN0YWdlZCA9IHt9O1xuICAgIHRoaXMuc3RhZ2VkTGluayA9IFtdO1xuXG4gIH1cblxuICBhZGRSZW1vdGUgKHR5cGUsIHVybCkge1xuXG4gICAgdGhpcy5yZW1vdGVbdHlwZV0gPSB1cmw7XG5cbiAgfVxuXG4gIGdldFJlbW90ZSAodHlwZSwgaWQsIHJlbGF0aW9uKSB7XG5cbiAgICBsZXQgdXJsUGFydHMgPSBfLmNvbXBhY3QoW1xuICAgICAgdGhpcy5yZW1vdGVbdHlwZV0sXG4gICAgICBpZCxcbiAgICAgIHJlbGF0aW9uID8gJ2xpbmtzJyA6IHVuZGVmaW5lZCxcbiAgICAgIHJlbGF0aW9uXG4gICAgXSk7XG4gICAgcmV0dXJuIHVybGpvaW4uYXBwbHkobnVsbCwgdXJsUGFydHMpO1xuXG4gIH1cblxuICBnZXQgKHR5cGUsIGlkKSB7XG5cbiAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIF8uZmlsdGVyKHRoaXMucG9vbCwgcmVzb3VyY2UgPT4ge1xuICAgICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCd0eXBlJykgPT09IHR5cGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gXy5maW5kKHRoaXMucG9vbCwgcmVzb3VyY2UgPT4ge1xuICAgICAgcmV0dXJuIHJlc291cmNlLmdldCgndHlwZScpID09PSB0eXBlICYmXG4gICAgICAgIHJlc291cmNlLmdldCgnaWQnKSA9PT0gaWQ7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGhhcyAodHlwZSwgaWQpIHtcblxuICAgIHJldHVybiAhIV8uZmluZCh0aGlzLnBvb2wsIHJlc291cmNlID0+IHtcbiAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoJ3R5cGUnKSA9PT0gdHlwZSAmJlxuICAgICAgICByZXNvdXJjZS5nZXQoJ2lkJykgPT09IGlkO1xuICAgIH0pO1xuXG4gIH1cblxuICBfY3JlYXRlQmxvYiAoc2VyaWFsaXplZCkge1xuXG4gICAgbGV0IGJpZCA9IHV1aWQudjQoKTtcbiAgICB0aGlzLmJsb2JzW2JpZF0gPSBfLmNsb25lKHNlcmlhbGl6ZWQsIHRydWUpO1xuICAgIHJldHVybiB0aGlzLmJsb2JzW2JpZF07XG5cbiAgfVxuXG4gIF9nZXRCbG9iIChiaWQpIHtcblxuICAgIHJldHVybiB0aGlzLmJsb2JzW2JpZF07XG5cbiAgfVxuXG4gIHB1bGxCeUxpbmsgKGxpbmssIG9wdGlvbnMpIHtcblxuICAgIGxldCB1cmw7XG4gICAgaWYgKF8uaXNTdHJpbmcobGluaykpIHtcbiAgICAgIHVybCA9IGxpbms7XG4gICAgfVxuICAgIGVsc2UgaWYgKGxpbmsubGlua2FnZSkge1xuICAgICAgdXJsID0gdGhpcy5nZXRSZW1vdGUobGluay5saW5rYWdlLnR5cGUsIGxpbmsubGlua2FnZS5pZCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGxpbmsucmVsYXRlZCkge1xuICAgICAgdXJsID0gbGluay5yZWxhdGVkO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBsaW5rLicpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnB1bGxCeVVSTCh1cmwsIG9wdGlvbnMpO1xuXG4gIH1cblxuICBwdWxsICh0eXBlLCBpZCwgb3B0aW9ucykge1xuXG4gICAgcmV0dXJuIHRoaXMucHVsbEJ5VVJMKHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkKSwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIHB1bGxCeVVSTCAodXJsLCBvcHRpb25zKSB7XG5cbiAgICBpZiAoIV8uaXNFbXB0eSh0aGlzLnN0YWdlZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncHVsbCB3aGVuIHN0YWdlZCBjaGFuZ2UgaXMgbm90IGV4aXN0Jyk7XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICBsZXQgaW5jbHVkZWQgPSBvcHRpb25zLmluY2x1ZGVkO1xuICAgIGlmIChpbmNsdWRlZCkge1xuICAgICAgb3B0aW9ucy5pbmNsdWRlZCA9IGluY2x1ZGVkLmpvaW4oJywnKTtcbiAgICB9XG5cbiAgICBsZXQgZmllbGRzID0gb3B0aW9ucy5maWVsZHM7XG4gICAgaWYgKGZpZWxkcykge1xuICAgICAgXy5yZWR1Y2UoZmllbGRzLCAob3B0aW9ucywgZmllbGRzLCB0eXBlKSA9PiB7XG4gICAgICAgIG9wdGlvbnNbYGZpZWxkc1ske3R5cGV9XWBdID0gZmllbGRzLmpvaW4oJywnKTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgICB9LCBvcHRpb25zKTtcbiAgICAgIGRlbGV0ZSBvcHRpb25zLmZpZWxkcztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zeW5jLmdldCh1cmwsIG9wdGlvbnMpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX3NhdmVSZXNwb25zZShyZXNwb25zZSk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHB1c2ggKGlkeCkge1xuXG4gICAgaWR4ID0gaWR4IHx8IHRoaXMuY29tbWl0cy5sZW5ndGggLSAxO1xuXG4gICAgaWYgKGlkeCA8PSB0aGlzLnJlbW90ZUluZGV4KSB7XG4gICAgICByZXR1cm4gUSgpO1xuICAgIH1cblxuICAgIGxldCBhZnRlckNvbW1pdCA9IHRoaXMuZ2V0Q29tbWl0KGlkeCk7XG4gICAgbGV0IGJlZm9yZUNvbW1pdCA9IHRoaXMuZ2V0Q29tbWl0KHRoaXMucmVtb3RlSW5kZXgpO1xuXG4gICAgbGV0IHJlbW92ZWQgPSBfLmRpZmZlcmVuY2UoXG4gICAgICBfLmtleXMoYmVmb3JlQ29tbWl0KSxcbiAgICAgIF8ua2V5cyhhZnRlckNvbW1pdClcbiAgICApO1xuXG4gICAgbGV0IGNoYW5nZWRPckFkZGVkID0gXy53aXRob3V0KFxuICAgICAgXy5rZXlzKGFmdGVyQ29tbWl0KSxcbiAgICAgIF8ua2V5cyhyZW1vdmVkKVxuICAgICk7XG5cbiAgICBsZXQgZGVsZXRlUmVxdWVzdCA9IF8ubWFwKHJlbW92ZWQsIHJpZCA9PiB7XG4gICAgICAvLyBpcyBMaW5rXG4gICAgICBpZiAoIXRoaXMucG9vbFtyaWRdKSB7IHJldHVybjsgfVxuXG4gICAgICBsZXQgdHlwZSA9IHRoaXMucG9vbFtyaWRdLmdldCgndHlwZScpO1xuICAgICAgbGV0IGlkID0gdGhpcy5wb29sW3JpZF0uZ2V0KCdpZCcpO1xuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMuZGVsZXRlKHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkKSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5wb29sW3JpZF07XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgcG9zdE9yUGF0Y2hSZXF1ZXN0ID0gXy5tYXAoY2hhbmdlZE9yQWRkZWQsIHJpZCA9PiB7XG4gICAgICAvLyBpcyBMaW5rXG4gICAgICBpZiAoIXRoaXMucG9vbFtyaWRdKSB7IHJldHVybjsgfVxuICAgICAgLy8gbm90IGNoYW5nZVxuICAgICAgaWYgKF8uaXNFcXVhbChhZnRlckNvbW1pdFtyaWRdLCBiZWZvcmVDb21taXRbcmlkXSkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIGxldCB0eXBlID0gdGhpcy5wb29sW3JpZF0uZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ2lkJyk7XG4gICAgICBsZXQgZGVsdGEgPSBkaWZmKGJlZm9yZUNvbW1pdFtyaWRdLCBhZnRlckNvbW1pdFtyaWRdKTtcblxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIF8uZXh0ZW5kKGRlbHRhLCB7IHR5cGUsIGlkIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBhdGNoKHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90b1JlcXVlc3QoZGVsdGEpKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHRoaXMuX3NhdmVSZXNwb25zZShyZXNwb25zZSwgcmlkKSk7XG4gICAgICB9XG4gICAgICBpZiAoIWlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMucG9zdCh0aGlzLmdldFJlbW90ZSh0eXBlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvUmVxdWVzdChkZWx0YSkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlLCByaWQpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBsaW5rT3BlcmF0aW9uUmVxdWVzdCA9IF8ubWFwKGFmdGVyQ29tbWl0LCAoc3RhZ2VkLCByaWQpID0+IHtcbiAgICAgIC8vIGlzIHJlc291cmNlXG4gICAgICBpZiAodGhpcy5wb29sW3JpZF0gfHwgIXN0YWdlZC5vcCkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSBzdGFnZWQucmVzb3VyY2UuZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSBzdGFnZWQucmVzb3VyY2UuZ2V0KCdpZCcpO1xuICAgICAgbGV0IG9wdGlvbnMgPSBfLmRlZmF1bHRzKHN0YWdlZC5vcHRpb25zIHx8IHt9LCB7XG4gICAgICAgIGhhc01hbnk6IHRydWVcbiAgICAgIH0pO1xuICAgICAgbGV0IG9wID0gc3RhZ2VkLm9wO1xuICAgICAgbGV0IHJlbGF0aW9uID0gc3RhZ2VkLnJlbGF0aW9uO1xuICAgICAgbGV0IGxpbmthZ2UgPSBzdGFnZWQubGlua2FnZTtcbiAgICAgIGxldCByZXF1ZXN0Qm9keSA9IG9wdGlvbnMuaGFzTWFueSA/XG4gICAgICAgIHsgZGF0YTogW2xpbmthZ2VdIH0gOiB7IGRhdGE6IGxpbmthZ2UgfTtcblxuICAgICAgaWYgKG9wID09PSAnYWRkJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBvc3QodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQsIHJlbGF0aW9uKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5KVxuICAgICAgICAgIC50aGVuKCgpID0+IHJlcXVlc3RCb2R5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wID09PSAncmVtb3ZlJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLmRlbGV0ZSh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCwgcmVsYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHkpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gcmVxdWVzdEJvZHkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuYWxsKGRlbGV0ZVJlcXVlc3QuY29uY2F0KHBvc3RPclBhdGNoUmVxdWVzdCkpXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5zZXRSZW1vdGVJbmRleCgpO1xuICAgIH0pO1xuXG4gIH1cblxuICBfc2F2ZVJlc3BvbnNlIChyZXNwb25zZSwgcmlkKSB7XG5cbiAgICBsZXQgbWFpblJlc291cmNlID0gdGhpcy5fc2F2ZURhdGEocmVzcG9uc2UuZGF0YSwgcmlkKTtcbiAgICBsZXQgaW5jbHVkZWRSZXNvdXJjZXMgPSBfLm1hcChcbiAgICAgIHJlc3BvbnNlLmluY2x1ZGVkLCBkYXRhID0+IHRoaXMuX3NhdmVEYXRhKGRhdGEpKTtcbiAgICByZXR1cm4gbWFpblJlc291cmNlO1xuXG4gIH1cblxuICBfc2F2ZURhdGEgKGRhdGEsIHJpZCkge1xuXG4gICAgaWYgKF8uaXNBcnJheShkYXRhKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKGRhdGEsIGRhdGEgPT4gdGhpcy5fc2F2ZURhdGEoZGF0YSkpO1xuICAgIH1cblxuICAgIGxldCByZXNvdXJjZSA9IHJpZCAhPT0gdW5kZWZpbmVkID9cbiAgICAgIHRoaXMucG9vbFtyaWRdIDogdGhpcy5nZXQoZGF0YS50eXBlLCBkYXRhLmlkKTtcblxuICAgIGlmICghcmVzb3VyY2UpIHtcbiAgICAgIHJlc291cmNlID0gbmV3IFJlc291cmNlKGRhdGEpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJlc291cmNlLmRlc2VyaWFsaXplKGRhdGEpO1xuICAgIH1cblxuICAgIGxldCBzdGFnZWRCYWNrdXAgPSBfLmNsb25lKHRoaXMuc3RhZ2VkLCB0cnVlKTtcblxuICAgIHRoaXMuYWRkKHJlc291cmNlKTtcbiAgICB0aGlzLmNvbW1pdCgpO1xuICAgIHRoaXMuc2V0UmVtb3RlSW5kZXgoKTtcblxuICAgIHRoaXMuc3RhZ2VkID0gc3RhZ2VkQmFja3VwO1xuXG4gICAgcmV0dXJuIHJlc291cmNlO1xuXG4gIH1cblxuICBfdG9SZXF1ZXN0IChzZXJpYWxpemVkKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogc2VyaWFsaXplZFxuICAgIH07XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUG9vbDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL1Bvb2wuanNcbiAqKi8iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IFJlc3BvbnNlIGZyb20gJy4vUmVzcG9uc2UnO1xuXG5cbmxldCBzdHJpbmdpZnlSZXF1aXJlZE1ldGhvZCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgLy8gdGhlc2UgSFRUUCBtZXRob2RzIHJlcXVpcmVzIEpTT04uc3RyaW5naWZ5XG4gIHJldHVybiAoL14oUE9TVHxQVVR8UEFUQ0h8REVMRVRFKSQvLnRlc3QobWV0aG9kLnRvVXBwZXJDYXNlKCkpKTtcbn07XG5cbmxldCBtYWtlQWpheFJlcXVlc3QgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGlmIChzdHJpbmdpZnlSZXF1aXJlZE1ldGhvZChvcHRpb25zLnR5cGUpKSB7XG4gICAgaWYgKG9wdGlvbnMuY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJykge1xuICAgICAgb3B0aW9ucy5kYXRhID0gSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5kYXRhKTtcbiAgICB9XG4gIH1cblxuICBvcHRpb25zLnVybCA9IG9wdGlvbnMudXJsLnJlcGxhY2UoL1xcLz8kLywgJy8nKTtcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL3Evd2lraS9Db21pbmctZnJvbS1qUXVlcnlcbiAgcmV0dXJuIFEucHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgJC5hamF4KG9wdGlvbnMpXG4gICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcbiAgICAgICAgZGVsZXRlIGpxWEhSLnRoZW47IC8vIHRyZWF0IHhociBhcyBhIG5vbi1wcm9taXNlXG4gICAgICAgIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShqcVhIUik7XG4gICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5mYWlsKGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgZGVsZXRlIGpxWEhSLnRoZW47IC8vIHRyZWF0IHhociBhcyBhIG5vbi1wcm9taXNlXG4gICAgICAgIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShqcVhIUik7XG4gICAgICAgIHJlamVjdChyZXNwb25zZSk7XG4gICAgICB9KTtcbiAgfSk7XG5cbn07XG5cblxuXG5sZXQgUkVTVGZ1bCA9IHtcblxuICBoZWFkOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkhFQURcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZ2V0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwb3N0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcHV0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBVVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwYXRjaDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQQVRDSFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBkZWxldGU6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiREVMRVRFXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGRlZmF1bHRPcHRpb25zOiB7XG5cbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIHByb2Nlc3NEYXRhOiB0cnVlXG5cbiAgfSxcblxuICBhamF4U2V0dXA6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICAkLmFqYXhTZXR1cChvcHRpb25zKTtcblxuICB9XG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJFU1RmdWw7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9SRVNUZnVsLmpzXG4gKiovIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnYmFja2JvbmUnO1xuXG5cbmNsYXNzIFRyYW5zYWN0aW9uIHtcblxuICBjb25zdHJ1Y3Rvcihwb29sLCBvcHRpb25zKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLCBFdmVudHMpO1xuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30pO1xuXG4gICAgdGhpcy5wb29sID0gcG9vbDtcbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcblxuICB9XG5cbiAgYmVnaW4gKCkge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG4gICAgdGhpcy5fYWN0aXZhdGUoKTtcblxuICB9XG5cbiAgY29tbWl0ICgpIHtcblxuICAgIHRoaXMuX2RlYWN0aXZhdGUoKTtcblxuICB9XG5cblxuICBfYWN0aXZhdGUgKCkge1xuXG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLnBvb2wsICd0cmFuc2Zvcm0nLCB0aGlzLm9uVHJhbnNmb3JtKTtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG5cbiAgfVxuXG4gIF9kZWFjdGl2YXRlICgpIHtcblxuICAgIHRoaXMuc3RvcExpc3RlbmluZyh0aGlzLnBvb2wsICd0cmFuc2Zvcm0nLCB0aGlzLm9uVHJhbnNmb3JtKTtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gIH1cblxuICBvblRyYW5zZm9ybSAob3BlcmF0aW9uKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMucHVzaChvcGVyYXRpb24pO1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBUcmFuc2FjdGlvbjtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL1RyYW5zYWN0aW9uLmpzXG4gKiovIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBqc29uZGlmZnBhdGNoIGZyb20gJ2pzb25kaWZmcGF0Y2gnO1xuXG5cbnZhciBkaWZmcGF0Y2hlciA9IGpzb25kaWZmcGF0Y2guY3JlYXRlKHt9KTtcblxuXG5mdW5jdGlvbiBnZXRBZnRlclZhbHVlRnJvbURpZmYgKGRpZmYpIHtcblxuICBpZiAoIV8uaXNBcnJheShkaWZmKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCB0eXBlIScpO1xuICB9XG5cbiAgc3dpdGNoIChkaWZmLmxlbmd0aCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBkaWZmWzBdO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBkaWZmWzFdO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxufVxuXG5cbmZ1bmN0aW9uIGdldENoYW5nZWQgKGRpZmZzKSB7XG5cbiAgaWYgKF8uaXNBcnJheShkaWZmcykpIHtcbiAgICByZXR1cm4gZ2V0QWZ0ZXJWYWx1ZUZyb21EaWZmKGRpZmZzKTtcbiAgfVxuXG4gIHJldHVybiBfLnJlZHVjZShkaWZmcywgZnVuY3Rpb24gKHJlc3VsdCwgZGlmZiwga2V5KSB7XG5cbiAgICBpZiAoXy5pc09iamVjdChkaWZmKSkge1xuICAgICAgaWYgKGRpZmYuX3QgPT09ICdhJykge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICAgcmVzdWx0W2tleV0gPSBnZXRDaGFuZ2VkKGRpZmYpO1xuICAgIH1cbiAgICBlbHNlIGlmIChfLmlzQXJyYXkoZGlmZikpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gZ2V0QWZ0ZXJWYWx1ZUZyb21EaWZmKGRpZmYpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgfSwge30pO1xuXG59XG5cbmZ1bmN0aW9uIGRpZmYgKG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuXG4gIHZhciBkZWx0YSA9IGRpZmZwYXRjaGVyLmRpZmYob2xkVmFsdWUsIG5ld1ZhbHVlKTtcbiAgcmV0dXJuIGdldENoYW5nZWQoZGVsdGEpO1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRpZmY7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9kaWZmLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJsb2Rhc2hcIlxuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuXG5cbmNsYXNzIFJlc291cmNlIHtcblxuICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzKSB7XG5cbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSB7fTtcbiAgICB0aGlzLmxpbmtzID0ge307XG4gICAgdGhpcy5yaWQgPSB1dWlkLnY0KCk7XG5cbiAgICB0aGlzLmRlc2VyaWFsaXplKGF0dHJpYnV0ZXMpO1xuXG4gIH1cblxuICBnZXQgKGtleSkge1xuXG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1trZXldO1xuXG4gIH1cblxuICBzZXQgKGF0dHJpYnV0ZXMpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cbiAgfVxuXG4gIHVuc2V0IChrZXkpIHtcblxuICAgIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNba2V5XTtcblxuICB9XG5cbiAgZ2V0TGluayAoa2V5KSB7XG5cbiAgICBrZXkgPSBrZXkgfHwgJ3NlbGYnO1xuICAgIHJldHVybiB0aGlzLmxpbmtzW2tleV07XG5cbiAgfVxuXG4gIHNldExpbmsgKGxpbmtzKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLmxpbmtzLCBsaW5rcyk7XG5cbiAgfVxuXG4gIHVuc2V0TGluayAoa2V5KSB7XG5cbiAgICBkZWxldGUgdGhpcy5saW5rc1trZXldO1xuXG4gIH1cblxuICBnZXRMaW5rYWdlICgpIHtcblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0aGlzLmF0dHJpYnV0ZXMudHlwZSxcbiAgICAgIGlkOiB0aGlzLmF0dHJpYnV0ZXMuaWRcbiAgICB9O1xuXG4gIH1cblxuICBzZXJpYWxpemUgKCkge1xuXG4gICAgbGV0IHJlc3VsdCA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzLCB0cnVlKTtcbiAgICByZXN1bHQubGlua3MgPSB0aGlzLmxpbmtzO1xuXG4gICAgaWYgKF8uaXNFbXB0eShyZXN1bHQubGlua3MpKSB7XG4gICAgICBkZWxldGUgcmVzdWx0LmxpbmtzO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgfVxuXG4gIGRlc2VyaWFsaXplIChzZXJpYWxpemVkKSB7XG5cbiAgICBpZiAoIXRoaXMuX3ZhbGlkYXRlU2VyaWFsaXplZChzZXJpYWxpemVkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGRhdGEhIHR5cGUgc2hvdWxkIGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoXy5jbG9uZShfLm9taXQoc2VyaWFsaXplZCwgJ2xpbmtzJyksIHRydWUpKTtcbiAgICB0aGlzLnNldExpbmsoc2VyaWFsaXplZC5saW5rcyk7XG5cbiAgfVxuXG4gIGNsb25lICgpIHtcblxuICAgIGxldCByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZSh0aGlzLnNlcmlhbGl6ZSgpKTtcbiAgICByZXNvdXJjZS51dWlkID0gdGhpcy51dWlkO1xuICAgIHJldHVybiByZXNvdXJjZTtcblxuICB9XG5cbiAgX3ZhbGlkYXRlU2VyaWFsaXplZCAoc2VyaWFsaXplZCkge1xuXG4gICAgcmV0dXJuIHNlcmlhbGl6ZWQgJiYgc2VyaWFsaXplZC50eXBlO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvUmVzb3VyY2UuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1cmwtam9pblwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwidXJsLWpvaW5cIlxuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5vZGUtdXVpZFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwibm9kZS11dWlkXCJcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29uZGlmZnBhdGNoXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJqc29uZGlmZnBhdGNoXCJcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFja2JvbmVcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImJhY2tib25lXCJcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJqcXVlcnlcIlxuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5cbmxldCBfdmFsaWRhdGVSZXNwb25zZSA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgYm9keSA9IHhoci5yZXNwb25zZUpTT047XG5cbiAgaWYgKGJvZHkuZGF0YSA9PT0gdW5kZWZpbmVkICYmIGJvZHkuZXJyb3JzID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGRvY3VtZW50IE1VU1QgY29udGFpbiBlaXRoZXIgcHJpbWFyeSBkYXRhIFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJvciBhbiBhcnJheSBvZiBlcnJvciBvYmplY3RzLlwiKTtcbiAgfVxuXG59O1xuXG5cbmxldCBfaXNSZXNwb25zZUVycm9yID0gZnVuY3Rpb24gKHN0YXR1cykge1xuXG4gIHJldHVybiA0MDAgPD0gc3RhdHVzICYmIDYwMCA+IHN0YXR1cyA7XG5cbn07XG5cblxubGV0IF9wYXJzZURhdGEgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgaWYgKCF4aHIucmVzcG9uc2VKU09OKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHhoci5yZXNwb25zZUpTT04uZGF0YTtcblxufTtcblxubGV0IF9wYXJzZUluY2x1ZGVkID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICgheGhyLnJlc3BvbnNlSlNPTikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB4aHIucmVzcG9uc2VKU09OLmluY2x1ZGVkO1xuXG59O1xuXG5sZXQgX3BhcnNlRXJyb3JzID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICghKHhoci5yZXNwb25zZUpTT04gJiYgeGhyLnJlc3BvbnNlSlNPTi5lcnJvcnMgKSkge1xuICAgIGlmIChfaXNSZXNwb25zZUVycm9yKHhoci5zdGF0dXMpKSB7XG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgICAgfV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGVycm9ycyA9IHhoci5yZXNwb25zZUpTT04uZXJyb3JzO1xuXG4gIHJldHVybiBfLm1hcChlcnJvcnMsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHJldHVybiBfLmV4dGVuZCh7XG4gICAgICBzdGF0dXM6IFwiXCIgKyB4aHIuc3RhdHVzXG4gICAgfSwgZXJyb3IpO1xuICB9KTtcblxufTtcblxuXG5sZXQgX3BhcnNlSGVhZGVycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgbGV0IGhlYWRlclJlZ2V4ID0gL14oLio/KTpbIFxcdF0qKFteXFxyXFxuXSopJC9tZztcbiAgbGV0IGhlYWRlcnNTdHJpbmcgPSB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCk7XG4gIGxldCBmaW5kUmVzdWx0O1xuXG4gIHdoaWxlICgoZmluZFJlc3VsdCA9IGhlYWRlclJlZ2V4LmV4ZWMoaGVhZGVyc1N0cmluZykpICE9PSBudWxsKSB7XG4gICAgcmVzdWx0LnB1c2goZmluZFJlc3VsdC5zbGljZSgxKSk7XG4gIH1cblxuICByZXR1cm4gXy5vYmplY3QocmVzdWx0KTtcblxufTtcblxuXG5jbGFzcyBSZXNwb25zZSB7XG5cbiAgY29uc3RydWN0b3IgKHhocikge1xuXG4gICAgdGhpcy5yZXNwb25zZUpTT04gPSB4aHIucmVzcG9uc2VKU09OO1xuICAgIHRoaXMuZGF0YSA9IF9wYXJzZURhdGEoeGhyKTtcbiAgICB0aGlzLmluY2x1ZGVkID0gX3BhcnNlSW5jbHVkZWQoeGhyKTtcbiAgICB0aGlzLmVycm9ycyA9IF9wYXJzZUVycm9ycyh4aHIpO1xuICAgIHRoaXMuaGVhZGVycyA9IF9wYXJzZUhlYWRlcnMoeGhyKTtcbiAgICB0aGlzLm5hdGl2ZVhIUiA9IHhocjtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2U7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9SZXNwb25zZS5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=