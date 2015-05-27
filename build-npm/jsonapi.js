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

	module.exports = require("lodash");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("node-uuid");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("q");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("url-join");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("jquery");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("backbone");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("jsondiffpatch");

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNGQ2MGUzNjYyYTNmODZhNTkyMzIiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1Jlc291cmNlLmpzIiwid2VicGFjazovLy8uL2xpYi9Qb29sLmpzIiwid2VicGFjazovLy8uL2xpYi9SRVNUZnVsLmpzIiwid2VicGFjazovLy8uL2xpYi9UcmFuc2FjdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9saWIvZGlmZi5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLXV1aWRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJxXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXJsLWpvaW5cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJqcXVlcnlcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiYWNrYm9uZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImpzb25kaWZmcGF0Y2hcIiIsIndlYnBhY2s6Ly8vLi9saWIvUmVzcG9uc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7d0NDdENxQixDQUFnQjs7OztvQ0FDcEIsQ0FBWTs7Ozt1Q0FDVCxDQUFlOzs7OzJDQUNYLENBQW1COzs7O29DQUMxQixDQUFZOzs7O1NBSTNCLFdBQVc7U0FDWCxRQUFRO1NBQ1IsSUFBSTtTQUNKLE9BQU87U0FDUCxJQUFJLHdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7bUNDWlEsQ0FBUTs7OztxQ0FDTCxDQUFXOzs7O0tBR3RCLFFB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LEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLE9BQUksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLE9BQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLE9BQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0VBRXRCOztzQkFJWSxRQUFRIiwiZmlsZSI6Impzb25hcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDRkNjBlMzY2MmEzZjg2YTU5MjMyXG4gKiovIiwiaW1wb3J0IFJlc291cmNlIGZyb20gJy4vbGliL1Jlc291cmNlJztcbmltcG9ydCBQb29sIGZyb20gJy4vbGliL1Bvb2wnO1xuaW1wb3J0IFJFU1RmdWwgZnJvbSAnLi9saWIvUkVTVGZ1bCc7XG5pbXBvcnQgVHJhbnNhY3Rpb24gZnJvbSAnLi9saWIvVHJhbnNhY3Rpb24nO1xuaW1wb3J0IGRpZmYgZnJvbSAnLi9saWIvZGlmZic7XG5cblxuZXhwb3J0IHtcbiAgVHJhbnNhY3Rpb24sXG4gIFJlc291cmNlLFxuICBQb29sLFxuICBSRVNUZnVsLFxuICBkaWZmXG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9pbmRleC5qc1xuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuXG5cbmNsYXNzIFJlc291cmNlIHtcblxuICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzKSB7XG5cbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSB7fTtcbiAgICB0aGlzLmxpbmtzID0ge307XG4gICAgdGhpcy5yaWQgPSB1dWlkLnY0KCk7XG5cbiAgICB0aGlzLmRlc2VyaWFsaXplKGF0dHJpYnV0ZXMpO1xuXG4gIH1cblxuICBnZXQgKGtleSkge1xuXG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1trZXldO1xuXG4gIH1cblxuICBzZXQgKGF0dHJpYnV0ZXMpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cbiAgfVxuXG4gIHVuc2V0IChrZXkpIHtcblxuICAgIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNba2V5XTtcblxuICB9XG5cbiAgZ2V0TGluayAoa2V5KSB7XG5cbiAgICBrZXkgPSBrZXkgfHwgJ3NlbGYnO1xuICAgIHJldHVybiB0aGlzLmxpbmtzW2tleV07XG5cbiAgfVxuXG4gIHNldExpbmsgKGxpbmtzKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLmxpbmtzLCBsaW5rcyk7XG5cbiAgfVxuXG4gIHVuc2V0TGluayAoa2V5KSB7XG5cbiAgICBkZWxldGUgdGhpcy5saW5rc1trZXldO1xuXG4gIH1cblxuICBnZXRMaW5rYWdlICgpIHtcblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0aGlzLmF0dHJpYnV0ZXMudHlwZSxcbiAgICAgIGlkOiB0aGlzLmF0dHJpYnV0ZXMuaWRcbiAgICB9O1xuXG4gIH1cblxuICBzZXJpYWxpemUgKCkge1xuXG4gICAgbGV0IHJlc3VsdCA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzLCB0cnVlKTtcbiAgICByZXN1bHQubGlua3MgPSB0aGlzLmxpbmtzO1xuXG4gICAgaWYgKF8uaXNFbXB0eShyZXN1bHQubGlua3MpKSB7XG4gICAgICBkZWxldGUgcmVzdWx0LmxpbmtzO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgfVxuXG4gIGRlc2VyaWFsaXplIChzZXJpYWxpemVkKSB7XG5cbiAgICBpZiAoIXRoaXMuX3ZhbGlkYXRlU2VyaWFsaXplZChzZXJpYWxpemVkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGRhdGEhIHR5cGUgc2hvdWxkIGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoXy5jbG9uZShfLm9taXQoc2VyaWFsaXplZCwgJ2xpbmtzJyksIHRydWUpKTtcbiAgICB0aGlzLnNldExpbmsoc2VyaWFsaXplZC5saW5rcyk7XG5cbiAgfVxuXG4gIGNsb25lICgpIHtcblxuICAgIGxldCByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZSh0aGlzLnNlcmlhbGl6ZSgpKTtcbiAgICByZXNvdXJjZS51dWlkID0gdGhpcy51dWlkO1xuICAgIHJldHVybiByZXNvdXJjZTtcblxuICB9XG5cbiAgX3ZhbGlkYXRlU2VyaWFsaXplZCAoc2VyaWFsaXplZCkge1xuXG4gICAgcmV0dXJuIHNlcmlhbGl6ZWQgJiYgc2VyaWFsaXplZC50eXBlO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvUmVzb3VyY2UuanNcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgdXJsam9pbiBmcm9tICd1cmwtam9pbic7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuaW1wb3J0IGRpZmYgZnJvbSAnLi9kaWZmJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCBSRVNUZnVsIGZyb20gJy4vUkVTVGZ1bCc7XG5cblxuY2xhc3MgUG9vbCB7XG5cbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcblxuICAgIHRoaXMuc3luYyA9IFJFU1RmdWw7XG4gICAgdGhpcy5yZXNldEFsbCgpO1xuXG4gIH1cblxuICByZXNldEFsbCAoKSB7XG5cbiAgICB0aGlzLnBvb2wgPSB7fTtcbiAgICB0aGlzLmJsb2JzID0ge307XG4gICAgdGhpcy5zdGFnZWQgPSB7fTtcbiAgICB0aGlzLnN0YWdlZExpbmsgPSBbXTtcbiAgICB0aGlzLnJlbW90ZSA9IHt9O1xuICAgIHRoaXMuY29tbWl0cyA9IFtdO1xuICAgIHRoaXMucmVtb3RlSW5kZXggPSAtMTtcblxuICB9XG5cbiAgZ2V0Q29tbWl0IChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCAhPT0gdW5kZWZpbmVkID8gaWR4IDogdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIHRoaXMuY29tbWl0c1tpZHhdIHx8IHt9O1xuXG4gIH1cblxuICBzZXRSZW1vdGVJbmRleCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggIT09IHVuZGVmaW5lZCA/IGlkeCA6IHRoaXMuY29tbWl0cy5sZW5ndGggLSAxO1xuICAgIHRoaXMucmVtb3RlSW5kZXggPSBpZHg7XG5cbiAgfVxuXG4gIHJtIChyZXNvdXJjZSkge1xuXG4gICAgaWYoXy5pc0FycmF5KHJlc291cmNlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKHJlc291cmNlLCByZXNvdXJjZSA9PiB0aGlzLnJtKHJlc291cmNlKSk7XG4gICAgfVxuXG4gICAgbGV0IHJpZCA9IHJlc291cmNlLnJpZDtcblxuICAgIHRoaXMuc3RhZ2VkW3JpZF0gPSBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3JpZF07XG5cbiAgfVxuXG4gIGFkZCAocmVzb3VyY2UpIHtcblxuICAgIGlmKF8uaXNBcnJheShyZXNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChyZXNvdXJjZSwgcmVzb3VyY2UgPT4gdGhpcy5hZGQocmVzb3VyY2UpKTtcbiAgICB9XG5cbiAgICBsZXQgcmlkID0gcmVzb3VyY2UucmlkO1xuXG4gICAgaWYgKCF0aGlzLnBvb2xbcmlkXSkge1xuICAgICAgdGhpcy5wb29sW3JpZF0gPSByZXNvdXJjZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YWdlZFtyaWRdID0gcmVzb3VyY2Uuc2VyaWFsaXplKCk7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmlkXTtcblxuICB9XG5cbiAgcm1MaW5rYWdlIChyZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uKFxuICAgICAgJ3JlbW92ZScsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIGFkZExpbmthZ2UgKHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykge1xuXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24oXG4gICAgICAnYWRkJywgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKTtcblxuICB9XG5cbiAgX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24gKG9wLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpIHtcblxuICAgIGlmKF8uaXNBcnJheShsaW5rYWdlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKGxpbmthZ2UsIGxpbmthZ2UgPT4gdGhpcy5fY3JlYXRlTGlua2FnZU9wZXJhdGlvbihcbiAgICAgICAgb3AsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykpO1xuICAgIH1cblxuICAgIGxldCBzdGFnZWQgPSB7XG4gICAgICBvcCxcbiAgICAgIHJlc291cmNlLFxuICAgICAgcmVsYXRpb24sXG4gICAgICBsaW5rYWdlLFxuICAgICAgb3B0aW9uc1xuICAgIH07XG5cbiAgICB0aGlzLnN0YWdlZExpbmsucHVzaChzdGFnZWQpO1xuXG4gICAgcmV0dXJuIHN0YWdlZDtcblxuICB9XG5cbiAgZ2V0U3RhZ2VkIChyZXNvdXJjZSkge1xuXG4gICAgaWYgKCF0aGlzLmlzU3RhZ2VkKHJlc291cmNlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoYGNhbiBub3QgZmluZCAke3Jlc291cmNlfWApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyZXNvdXJjZS5yaWRdO1xuXG4gIH1cblxuICBpc1N0YWdlZCAocmVzb3VyY2UpIHtcblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyZXNvdXJjZS5yaWRdICE9PSB1bmRlZmluZWQ7XG5cbiAgfVxuXG4gIGNvbW1pdCAoKSB7XG5cbiAgICBsZXQgbGFzdENvbW1pdCA9IHRoaXMuZ2V0Q29tbWl0KCk7XG5cbiAgICBsZXQgbmV3Q29tbWl0ID0gXy5yZWR1Y2UodGhpcy5zdGFnZWQsIChjb21taXQsIHNlcmlhbGl6ZWQsIHJpZCkgPT4ge1xuICAgICAgaWYgKCFzZXJpYWxpemVkKSB7XG4gICAgICAgIGlmIChjb21taXRbcmlkXSkge1xuICAgICAgICAgIGRlbGV0ZSBjb21taXRbcmlkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbW1pdFtyaWRdID0gdGhpcy5fY3JlYXRlQmxvYihzZXJpYWxpemVkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb21taXQ7XG4gICAgfSwgXy5jbG9uZShsYXN0Q29tbWl0LCB0cnVlKSk7XG5cbiAgICBfLnJlZHVjZSh0aGlzLnN0YWdlZExpbmssIChjb21taXQsIGxpbmtPcGVyYXRpb24pID0+IHtcbiAgICAgIGNvbW1pdFt1dWlkLnY0KCldID0gbGlua09wZXJhdGlvbjtcbiAgICAgIHJldHVybiBjb21taXQ7XG4gICAgfSwgbmV3Q29tbWl0KTtcblxuICAgIHRoaXMuY29tbWl0cy5wdXNoKG5ld0NvbW1pdCk7XG4gICAgdGhpcy5zdGFnZWQgPSB7fTtcbiAgICB0aGlzLnN0YWdlZExpbmsgPSBbXTtcblxuICB9XG5cbiAgYWRkUmVtb3RlICh0eXBlLCB1cmwpIHtcblxuICAgIHRoaXMucmVtb3RlW3R5cGVdID0gdXJsO1xuXG4gIH1cblxuICBnZXRSZW1vdGUgKHR5cGUsIGlkLCByZWxhdGlvbikge1xuXG4gICAgbGV0IHVybFBhcnRzID0gXy5jb21wYWN0KFtcbiAgICAgIHRoaXMucmVtb3RlW3R5cGVdLFxuICAgICAgaWQsXG4gICAgICByZWxhdGlvbiA/ICdsaW5rcycgOiB1bmRlZmluZWQsXG4gICAgICByZWxhdGlvblxuICAgIF0pO1xuICAgIHJldHVybiB1cmxqb2luLmFwcGx5KG51bGwsIHVybFBhcnRzKTtcblxuICB9XG5cbiAgZ2V0ICh0eXBlLCBpZCkge1xuXG4gICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLnBvb2wsIHJlc291cmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc291cmNlLmdldCgndHlwZScpID09PSB0eXBlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF8uZmluZCh0aGlzLnBvb2wsIHJlc291cmNlID0+IHtcbiAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoJ3R5cGUnKSA9PT0gdHlwZSAmJlxuICAgICAgICByZXNvdXJjZS5nZXQoJ2lkJykgPT09IGlkO1xuICAgIH0pO1xuXG4gIH1cblxuICBoYXMgKHR5cGUsIGlkKSB7XG5cbiAgICByZXR1cm4gISFfLmZpbmQodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCd0eXBlJykgPT09IHR5cGUgJiZcbiAgICAgICAgcmVzb3VyY2UuZ2V0KCdpZCcpID09PSBpZDtcbiAgICB9KTtcblxuICB9XG5cbiAgX2NyZWF0ZUJsb2IgKHNlcmlhbGl6ZWQpIHtcblxuICAgIGxldCBiaWQgPSB1dWlkLnY0KCk7XG4gICAgdGhpcy5ibG9ic1tiaWRdID0gXy5jbG9uZShzZXJpYWxpemVkLCB0cnVlKTtcbiAgICByZXR1cm4gdGhpcy5ibG9ic1tiaWRdO1xuXG4gIH1cblxuICBfZ2V0QmxvYiAoYmlkKSB7XG5cbiAgICByZXR1cm4gdGhpcy5ibG9ic1tiaWRdO1xuXG4gIH1cblxuICBwdWxsQnlMaW5rIChsaW5rLCBvcHRpb25zKSB7XG5cbiAgICBsZXQgdXJsO1xuICAgIGlmIChfLmlzU3RyaW5nKGxpbmspKSB7XG4gICAgICB1cmwgPSBsaW5rO1xuICAgIH1cbiAgICBlbHNlIGlmIChsaW5rLmxpbmthZ2UpIHtcbiAgICAgIHVybCA9IHRoaXMuZ2V0UmVtb3RlKGxpbmsubGlua2FnZS50eXBlLCBsaW5rLmxpbmthZ2UuaWQpO1xuICAgIH1cbiAgICBlbHNlIGlmIChsaW5rLnJlbGF0ZWQpIHtcbiAgICAgIHVybCA9IGxpbmsucmVsYXRlZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgbGluay4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wdWxsQnlVUkwodXJsLCBvcHRpb25zKTtcblxuICB9XG5cbiAgcHVsbCAodHlwZSwgaWQsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiB0aGlzLnB1bGxCeVVSTCh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCksIG9wdGlvbnMpO1xuXG4gIH1cblxuICBwdWxsQnlVUkwgKHVybCwgb3B0aW9ucykge1xuXG4gICAgaWYgKCFfLmlzRW1wdHkodGhpcy5zdGFnZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3B1bGwgd2hlbiBzdGFnZWQgY2hhbmdlIGlzIG5vdCBleGlzdCcpO1xuICAgIH1cblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgbGV0IGluY2x1ZGVkID0gb3B0aW9ucy5pbmNsdWRlZDtcbiAgICBpZiAoaW5jbHVkZWQpIHtcbiAgICAgIG9wdGlvbnMuaW5jbHVkZWQgPSBpbmNsdWRlZC5qb2luKCcsJyk7XG4gICAgfVxuXG4gICAgbGV0IGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzO1xuICAgIGlmIChmaWVsZHMpIHtcbiAgICAgIF8ucmVkdWNlKGZpZWxkcywgKG9wdGlvbnMsIGZpZWxkcywgdHlwZSkgPT4ge1xuICAgICAgICBvcHRpb25zW2BmaWVsZHNbJHt0eXBlfV1gXSA9IGZpZWxkcy5qb2luKCcsJyk7XG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgICAgfSwgb3B0aW9ucyk7XG4gICAgICBkZWxldGUgb3B0aW9ucy5maWVsZHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3luYy5nZXQodXJsLCBvcHRpb25zKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9zYXZlUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgIH0pO1xuXG4gIH1cblxuICBwdXNoIChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCB8fCB0aGlzLmNvbW1pdHMubGVuZ3RoIC0gMTtcblxuICAgIGlmIChpZHggPD0gdGhpcy5yZW1vdGVJbmRleCkge1xuICAgICAgcmV0dXJuIFEoKTtcbiAgICB9XG5cbiAgICBsZXQgYWZ0ZXJDb21taXQgPSB0aGlzLmdldENvbW1pdChpZHgpO1xuICAgIGxldCBiZWZvcmVDb21taXQgPSB0aGlzLmdldENvbW1pdCh0aGlzLnJlbW90ZUluZGV4KTtcblxuICAgIGxldCByZW1vdmVkID0gXy5kaWZmZXJlbmNlKFxuICAgICAgXy5rZXlzKGJlZm9yZUNvbW1pdCksXG4gICAgICBfLmtleXMoYWZ0ZXJDb21taXQpXG4gICAgKTtcblxuICAgIGxldCBjaGFuZ2VkT3JBZGRlZCA9IF8ud2l0aG91dChcbiAgICAgIF8ua2V5cyhhZnRlckNvbW1pdCksXG4gICAgICBfLmtleXMocmVtb3ZlZClcbiAgICApO1xuXG4gICAgbGV0IGRlbGV0ZVJlcXVlc3QgPSBfLm1hcChyZW1vdmVkLCByaWQgPT4ge1xuICAgICAgLy8gaXMgTGlua1xuICAgICAgaWYgKCF0aGlzLnBvb2xbcmlkXSkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ3R5cGUnKTtcbiAgICAgIGxldCBpZCA9IHRoaXMucG9vbFtyaWRdLmdldCgnaWQnKTtcbiAgICAgIGlmIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLmRlbGV0ZSh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gZGVsZXRlIHRoaXMucG9vbFtyaWRdLFxuICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9zYXZlRGF0YShiZWZvcmVDb21taXRbcmlkXSwgcmlkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHBvc3RPclBhdGNoUmVxdWVzdCA9IF8ubWFwKGNoYW5nZWRPckFkZGVkLCByaWQgPT4ge1xuICAgICAgLy8gaXMgTGlua1xuICAgICAgaWYgKCF0aGlzLnBvb2xbcmlkXSkgeyByZXR1cm47IH1cbiAgICAgIC8vIG5vdCBjaGFuZ2VcbiAgICAgIGlmIChfLmlzRXF1YWwoYWZ0ZXJDb21taXRbcmlkXSwgYmVmb3JlQ29tbWl0W3JpZF0pKSB7IHJldHVybjsgfVxuXG4gICAgICBsZXQgdHlwZSA9IHRoaXMucG9vbFtyaWRdLmdldCgndHlwZScpO1xuICAgICAgbGV0IGlkID0gdGhpcy5wb29sW3JpZF0uZ2V0KCdpZCcpO1xuICAgICAgbGV0IGRlbHRhID0gZGlmZihiZWZvcmVDb21taXRbcmlkXSwgYWZ0ZXJDb21taXRbcmlkXSk7XG5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICBfLmV4dGVuZChkZWx0YSwgeyB0eXBlLCBpZCB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5wYXRjaCh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9SZXF1ZXN0KGRlbHRhKSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB0aGlzLl9zYXZlUmVzcG9uc2UocmVzcG9uc2UsIHJpZCksXG4gICAgICAgICAgICByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX3NhdmVEYXRhKGJlZm9yZUNvbW1pdFtyaWRdLCByaWQpO1xuICAgICAgICAgICAgICByZXR1cm4gUS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIWlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMucG9zdCh0aGlzLmdldFJlbW90ZSh0eXBlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvUmVxdWVzdChkZWx0YSkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlLCByaWQpLFxuICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9yZW1vdmUocmlkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGxpbmtPcGVyYXRpb25SZXF1ZXN0ID0gXy5tYXAoYWZ0ZXJDb21taXQsIChzdGFnZWQsIHJpZCkgPT4ge1xuICAgICAgLy8gaXMgcmVzb3VyY2VcbiAgICAgIGlmICh0aGlzLnBvb2xbcmlkXSB8fCAhc3RhZ2VkLm9wKSB7IHJldHVybjsgfVxuXG4gICAgICBsZXQgdHlwZSA9IHN0YWdlZC5yZXNvdXJjZS5nZXQoJ3R5cGUnKTtcbiAgICAgIGxldCBpZCA9IHN0YWdlZC5yZXNvdXJjZS5nZXQoJ2lkJyk7XG4gICAgICBsZXQgb3B0aW9ucyA9IF8uZGVmYXVsdHMoc3RhZ2VkLm9wdGlvbnMgfHwge30sIHtcbiAgICAgICAgaGFzTWFueTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICBsZXQgb3AgPSBzdGFnZWQub3A7XG4gICAgICBsZXQgcmVsYXRpb24gPSBzdGFnZWQucmVsYXRpb247XG4gICAgICBsZXQgbGlua2FnZSA9IHN0YWdlZC5saW5rYWdlO1xuICAgICAgbGV0IHJlcXVlc3RCb2R5ID0gb3B0aW9ucy5oYXNNYW55ID9cbiAgICAgICAgeyBkYXRhOiBbbGlua2FnZV0gfSA6IHsgZGF0YTogbGlua2FnZSB9O1xuXG4gICAgICBpZiAob3AgPT09ICdhZGQnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMucG9zdCh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCwgcmVsYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIGFmdGVyQ29tbWl0W3JpZF07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wID09PSAncmVtb3ZlJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLmRlbGV0ZSh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCwgcmVsYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIGFmdGVyQ29tbWl0W3JpZF07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBRLmFsbChcbiAgICAgIGRlbGV0ZVJlcXVlc3QuY29uY2F0KFxuICAgICAgICBwb3N0T3JQYXRjaFJlcXVlc3QsXG4gICAgICAgIGxpbmtPcGVyYXRpb25SZXF1ZXN0KVxuICAgIClcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLnNldFJlbW90ZUluZGV4KCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIF9zYXZlUmVzcG9uc2UgKHJlc3BvbnNlLCByaWQpIHtcblxuICAgIGxldCBtYWluUmVzb3VyY2UgPSB0aGlzLl9zYXZlRGF0YShyZXNwb25zZS5kYXRhLCByaWQpO1xuICAgIGxldCBpbmNsdWRlZFJlc291cmNlcyA9IF8ubWFwKFxuICAgICAgcmVzcG9uc2UuaW5jbHVkZWQsIGRhdGEgPT4gdGhpcy5fc2F2ZURhdGEoZGF0YSkpO1xuICAgIHJldHVybiBtYWluUmVzb3VyY2U7XG5cbiAgfVxuXG4gIF9yZW1vdmUgKHJpZCkge1xuXG4gICAgaWYgKF8uaXNBcnJheShyaWQpKSB7XG4gICAgICByZXR1cm4gXy5tYXAocmlkLCBkYXRhID0+IHRoaXMuX3JlbW92ZShyaWQpKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzb3VyY2UgPSB0aGlzLnBvb2xbcmlkXTtcblxuICAgIGxldCBzdGFnZWRCYWNrdXAgPSBfLmNsb25lKHRoaXMuc3RhZ2VkLCB0cnVlKTtcblxuICAgIHRoaXMucm0ocmVzb3VyY2UpO1xuICAgIHRoaXMuY29tbWl0KCk7XG4gICAgdGhpcy5zZXRSZW1vdGVJbmRleCgpO1xuXG4gICAgdGhpcy5zdGFnZWQgPSBzdGFnZWRCYWNrdXA7XG5cbiAgfVxuXG4gIF9zYXZlRGF0YSAoZGF0YSwgcmlkKSB7XG5cbiAgICBpZiAoXy5pc0FycmF5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gXy5tYXAoZGF0YSwgZGF0YSA9PiB0aGlzLl9zYXZlRGF0YShkYXRhKSk7XG4gICAgfVxuXG4gICAgbGV0IHJlc291cmNlID0gcmlkICE9PSB1bmRlZmluZWQgP1xuICAgICAgdGhpcy5wb29sW3JpZF0gOiB0aGlzLmdldChkYXRhLnR5cGUsIGRhdGEuaWQpO1xuXG4gICAgaWYgKCFyZXNvdXJjZSkge1xuICAgICAgcmVzb3VyY2UgPSBuZXcgUmVzb3VyY2UoZGF0YSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmVzb3VyY2UuZGVzZXJpYWxpemUoZGF0YSk7XG4gICAgfVxuXG4gICAgbGV0IHN0YWdlZEJhY2t1cCA9IF8uY2xvbmUodGhpcy5zdGFnZWQsIHRydWUpO1xuXG4gICAgdGhpcy5hZGQocmVzb3VyY2UpO1xuICAgIHRoaXMuY29tbWl0KCk7XG4gICAgdGhpcy5zZXRSZW1vdGVJbmRleCgpO1xuXG4gICAgdGhpcy5zdGFnZWQgPSBzdGFnZWRCYWNrdXA7XG5cbiAgICByZXR1cm4gcmVzb3VyY2U7XG5cbiAgfVxuXG4gIF90b1JlcXVlc3QgKHNlcmlhbGl6ZWQpIHtcblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBzZXJpYWxpemVkXG4gICAgfTtcblxuICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBQb29sO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvUG9vbC5qc1xuICoqLyIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgUmVzcG9uc2UgZnJvbSAnLi9SZXNwb25zZSc7XG5cblxubGV0IHN0cmluZ2lmeVJlcXVpcmVkTWV0aG9kID0gZnVuY3Rpb24gKG1ldGhvZCkge1xuICAvLyB0aGVzZSBIVFRQIG1ldGhvZHMgcmVxdWlyZXMgSlNPTi5zdHJpbmdpZnlcbiAgcmV0dXJuICgvXihQT1NUfFBVVHxQQVRDSHxERUxFVEUpJC8udGVzdChtZXRob2QudG9VcHBlckNhc2UoKSkpO1xufTtcblxubGV0IG1ha2VBamF4UmVxdWVzdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgaWYgKHN0cmluZ2lmeVJlcXVpcmVkTWV0aG9kKG9wdGlvbnMudHlwZSkpIHtcbiAgICBpZiAob3B0aW9ucy5jb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nKSB7XG4gICAgICBvcHRpb25zLmRhdGEgPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLmRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIG9wdGlvbnMudXJsID0gb3B0aW9ucy51cmwucmVwbGFjZSgvXFwvPyQvLCAnLycpO1xuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvcS93aWtpL0NvbWluZy1mcm9tLWpRdWVyeVxuICByZXR1cm4gUS5wcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAkLmFqYXgob3B0aW9ucylcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xuICAgICAgICBkZWxldGUganFYSFIudGhlbjsgLy8gdHJlYXQgeGhyIGFzIGEgbm9uLXByb21pc2VcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGpxWEhSKTtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmZhaWwoZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICBkZWxldGUganFYSFIudGhlbjsgLy8gdHJlYXQgeGhyIGFzIGEgbm9uLXByb21pc2VcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGpxWEhSKTtcbiAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgIH0pO1xuICB9KTtcblxufTtcblxuXG5cbmxldCBSRVNUZnVsID0ge1xuXG4gIGhlYWQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiSEVBRFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHBvc3Q6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwdXQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUFVUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHBhdGNoOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBBVENIXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGRlbGV0ZTogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJERUxFVEVcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZGVmYXVsdE9wdGlvbnM6IHtcblxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgcHJvY2Vzc0RhdGE6IHRydWVcblxuICB9LFxuXG4gIGFqYXhTZXR1cDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICAgICQuYWpheFNldHVwKG9wdGlvbnMpO1xuXG4gIH1cblxufTtcblxuZXhwb3J0IGRlZmF1bHQgUkVTVGZ1bDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL1JFU1RmdWwuanNcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tICdiYWNrYm9uZSc7XG5cblxuY2xhc3MgVHJhbnNhY3Rpb24ge1xuXG4gIGNvbnN0cnVjdG9yKHBvb2wsIG9wdGlvbnMpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMsIEV2ZW50cyk7XG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLnBvb2wgPSBwb29sO1xuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuXG4gIH1cblxuICBiZWdpbiAoKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcbiAgICB0aGlzLl9hY3RpdmF0ZSgpO1xuXG4gIH1cblxuICBjb21taXQgKCkge1xuXG4gICAgdGhpcy5fZGVhY3RpdmF0ZSgpO1xuXG4gIH1cblxuXG4gIF9hY3RpdmF0ZSAoKSB7XG5cbiAgICB0aGlzLmxpc3RlblRvKHRoaXMucG9vbCwgJ3RyYW5zZm9ybScsIHRoaXMub25UcmFuc2Zvcm0pO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcblxuICB9XG5cbiAgX2RlYWN0aXZhdGUgKCkge1xuXG4gICAgdGhpcy5zdG9wTGlzdGVuaW5nKHRoaXMucG9vbCwgJ3RyYW5zZm9ybScsIHRoaXMub25UcmFuc2Zvcm0pO1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgfVxuXG4gIG9uVHJhbnNmb3JtIChvcGVyYXRpb24pIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucy5wdXNoKG9wZXJhdGlvbik7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zYWN0aW9uO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvVHJhbnNhY3Rpb24uanNcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGpzb25kaWZmcGF0Y2ggZnJvbSAnanNvbmRpZmZwYXRjaCc7XG5cblxudmFyIGRpZmZwYXRjaGVyID0ganNvbmRpZmZwYXRjaC5jcmVhdGUoe1xuICB0ZXh0RGlmZjoge1xuICAgIG1pbkxlbmd0aDogSW5maW5pdHlcbiAgfVxufSk7XG5cblxuZnVuY3Rpb24gZ2V0QWZ0ZXJWYWx1ZUZyb21EaWZmIChkaWZmKSB7XG5cbiAgaWYgKCFfLmlzQXJyYXkoZGlmZikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgdHlwZSEnKTtcbiAgfVxuXG4gIHN3aXRjaCAoZGlmZi5sZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gZGlmZlswXTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gZGlmZlsxXTtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbn1cblxuXG5mdW5jdGlvbiBnZXRDaGFuZ2VkIChkaWZmcykge1xuXG4gIGlmIChfLmlzQXJyYXkoZGlmZnMpKSB7XG4gICAgcmV0dXJuIGdldEFmdGVyVmFsdWVGcm9tRGlmZihkaWZmcyk7XG4gIH1cblxuICByZXR1cm4gXy5yZWR1Y2UoZGlmZnMsIGZ1bmN0aW9uIChyZXN1bHQsIGRpZmYsIGtleSkge1xuXG4gICAgaWYgKF8uaXNPYmplY3QoZGlmZikpIHtcbiAgICAgIGlmIChkaWZmLl90ID09PSAnYScpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHJlc3VsdFtrZXldID0gZ2V0Q2hhbmdlZChkaWZmKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoXy5pc0FycmF5KGRpZmYpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IGdldEFmdGVyVmFsdWVGcm9tRGlmZihkaWZmKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIH0sIHt9KTtcblxufVxuXG5mdW5jdGlvbiBkaWZmIChvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcblxuICB2YXIgZGVsdGEgPSBkaWZmcGF0Y2hlci5kaWZmKG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gIHJldHVybiBnZXRDaGFuZ2VkKGRlbHRhKTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBkaWZmO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvZGlmZi5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImxvZGFzaFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwibG9kYXNoXCJcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJub2RlLXV1aWRcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcIm5vZGUtdXVpZFwiXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicVwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwicVwiXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXJsLWpvaW5cIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInVybC1qb2luXCJcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImpxdWVyeVwiXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJhY2tib25lXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJiYWNrYm9uZVwiXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImpzb25kaWZmcGF0Y2hcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImpzb25kaWZmcGF0Y2hcIlxuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5cbmxldCBfdmFsaWRhdGVSZXNwb25zZSA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgYm9keSA9IHhoci5yZXNwb25zZUpTT047XG5cbiAgaWYgKGJvZHkuZGF0YSA9PT0gdW5kZWZpbmVkICYmIGJvZHkuZXJyb3JzID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGRvY3VtZW50IE1VU1QgY29udGFpbiBlaXRoZXIgcHJpbWFyeSBkYXRhIFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJvciBhbiBhcnJheSBvZiBlcnJvciBvYmplY3RzLlwiKTtcbiAgfVxuXG59O1xuXG5cbmxldCBfaXNSZXNwb25zZUVycm9yID0gZnVuY3Rpb24gKHN0YXR1cykge1xuXG4gIHJldHVybiA0MDAgPD0gc3RhdHVzICYmIDYwMCA+IHN0YXR1cyA7XG5cbn07XG5cblxubGV0IF9wYXJzZURhdGEgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgaWYgKCF4aHIucmVzcG9uc2VKU09OKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHhoci5yZXNwb25zZUpTT04uZGF0YTtcblxufTtcblxubGV0IF9wYXJzZUluY2x1ZGVkID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICgheGhyLnJlc3BvbnNlSlNPTikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB4aHIucmVzcG9uc2VKU09OLmluY2x1ZGVkO1xuXG59O1xuXG5sZXQgX3BhcnNlRXJyb3JzID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICghKHhoci5yZXNwb25zZUpTT04gJiYgeGhyLnJlc3BvbnNlSlNPTi5lcnJvcnMgKSkge1xuICAgIGlmIChfaXNSZXNwb25zZUVycm9yKHhoci5zdGF0dXMpKSB7XG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgICAgfV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGVycm9ycyA9IHhoci5yZXNwb25zZUpTT04uZXJyb3JzO1xuXG4gIHJldHVybiBfLm1hcChlcnJvcnMsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHJldHVybiBfLmV4dGVuZCh7XG4gICAgICBzdGF0dXM6IFwiXCIgKyB4aHIuc3RhdHVzXG4gICAgfSwgZXJyb3IpO1xuICB9KTtcblxufTtcblxuXG5sZXQgX3BhcnNlSGVhZGVycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgbGV0IGhlYWRlclJlZ2V4ID0gL14oLio/KTpbIFxcdF0qKFteXFxyXFxuXSopJC9tZztcbiAgbGV0IGhlYWRlcnNTdHJpbmcgPSB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCk7XG4gIGxldCBmaW5kUmVzdWx0O1xuXG4gIHdoaWxlICgoZmluZFJlc3VsdCA9IGhlYWRlclJlZ2V4LmV4ZWMoaGVhZGVyc1N0cmluZykpICE9PSBudWxsKSB7XG4gICAgcmVzdWx0LnB1c2goZmluZFJlc3VsdC5zbGljZSgxKSk7XG4gIH1cblxuICByZXR1cm4gXy5vYmplY3QocmVzdWx0KTtcblxufTtcblxuXG5jbGFzcyBSZXNwb25zZSB7XG5cbiAgY29uc3RydWN0b3IgKHhocikge1xuXG4gICAgdGhpcy5yZXNwb25zZUpTT04gPSB4aHIucmVzcG9uc2VKU09OO1xuICAgIHRoaXMuZGF0YSA9IF9wYXJzZURhdGEoeGhyKTtcbiAgICB0aGlzLmluY2x1ZGVkID0gX3BhcnNlSW5jbHVkZWQoeGhyKTtcbiAgICB0aGlzLmVycm9ycyA9IF9wYXJzZUVycm9ycyh4aHIpO1xuICAgIHRoaXMuaGVhZGVycyA9IF9wYXJzZUhlYWRlcnMoeGhyKTtcbiAgICB0aGlzLm5hdGl2ZVhIUiA9IHhocjtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2U7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9SZXNwb25zZS5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=