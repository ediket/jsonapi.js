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
	            (function (response) {
	              return _this6._saveResponse(response);
	            });
	          });
	        }
	
	        if (op === 'remove') {
	          return _this6.sync['delete'](_this6.getRemote(type, id, relation), requestBody).then(function (response) {
	            delete afterCommit[rid];
	            (function (response) {
	              return _this6._saveResponse(response);
	            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTJkYmJmYWFkMzViZjRmNTlmNjEiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1Jlc291cmNlLmpzIiwid2VicGFjazovLy8uL2xpYi9Qb29sLmpzIiwid2VicGFjazovLy8uL2xpYi9SRVNUZnVsLmpzIiwid2VicGFjazovLy8uL2xpYi9UcmFuc2FjdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9saWIvZGlmZi5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLXV1aWRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJxXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXJsLWpvaW5cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJqcXVlcnlcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiYWNrYm9uZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImpzb25kaWZmcGF0Y2hcIiIsIndlYnBhY2s6Ly8vLi9saWIvUmVzcG9uc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7d0NDdENxQixDQUFnQjs7OztvQ0FDcEIsQ0FBWTs7Ozt1Q0FDVCxDQUFlOzs7OzJDQUNYLENBQW1COzs7O29DQUMxQixDQUFZOzs7O1NBSTNCLFdBQVc7U0FDWCxRQUFRO1NBQ1IsSUFBSTtTQUNKLE9BQU87U0FDUCxJQUFJLHdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7bUNDWlEsQ0FBUTs7OztxQ0FDTCxDQUFXOzs7O0tBR3RCLFFB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QUMsUUFBUSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQyxPQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxPQUFJLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxPQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztFQUV0Qjs7c0JBSVksUUFBUSIsImZpbGUiOiJqc29uYXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBhMmRiYmZhYWQzNWJmNGY1OWY2MVxuICoqLyIsImltcG9ydCBSZXNvdXJjZSBmcm9tICcuL2xpYi9SZXNvdXJjZSc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL2xpYi9Qb29sJztcbmltcG9ydCBSRVNUZnVsIGZyb20gJy4vbGliL1JFU1RmdWwnO1xuaW1wb3J0IFRyYW5zYWN0aW9uIGZyb20gJy4vbGliL1RyYW5zYWN0aW9uJztcbmltcG9ydCBkaWZmIGZyb20gJy4vbGliL2RpZmYnO1xuXG5cbmV4cG9ydCB7XG4gIFRyYW5zYWN0aW9uLFxuICBSZXNvdXJjZSxcbiAgUG9vbCxcbiAgUkVTVGZ1bCxcbiAgZGlmZlxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vaW5kZXguanNcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHV1aWQgZnJvbSAnbm9kZS11dWlkJztcblxuXG5jbGFzcyBSZXNvdXJjZSB7XG5cbiAgY29uc3RydWN0b3IoYXR0cmlidXRlcykge1xuXG4gICAgdGhpcy5hdHRyaWJ1dGVzID0ge307XG4gICAgdGhpcy5saW5rcyA9IHt9O1xuICAgIHRoaXMucmlkID0gdXVpZC52NCgpO1xuXG4gICAgdGhpcy5kZXNlcmlhbGl6ZShhdHRyaWJ1dGVzKTtcblxuICB9XG5cbiAgZ2V0IChrZXkpIHtcblxuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNba2V5XTtcblxuICB9XG5cbiAgc2V0IChhdHRyaWJ1dGVzKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xuXG4gIH1cblxuICB1bnNldCAoa2V5KSB7XG5cbiAgICBkZWxldGUgdGhpcy5hdHRyaWJ1dGVzW2tleV07XG5cbiAgfVxuXG4gIGdldExpbmsgKGtleSkge1xuXG4gICAga2V5ID0ga2V5IHx8ICdzZWxmJztcbiAgICByZXR1cm4gdGhpcy5saW5rc1trZXldO1xuXG4gIH1cblxuICBzZXRMaW5rIChsaW5rcykge1xuXG4gICAgXy5leHRlbmQodGhpcy5saW5rcywgbGlua3MpO1xuXG4gIH1cblxuICB1bnNldExpbmsgKGtleSkge1xuXG4gICAgZGVsZXRlIHRoaXMubGlua3Nba2V5XTtcblxuICB9XG5cbiAgZ2V0TGlua2FnZSAoKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogdGhpcy5hdHRyaWJ1dGVzLnR5cGUsXG4gICAgICBpZDogdGhpcy5hdHRyaWJ1dGVzLmlkXG4gICAgfTtcblxuICB9XG5cbiAgc2VyaWFsaXplICgpIHtcblxuICAgIGxldCByZXN1bHQgPSBfLmNsb25lKHRoaXMuYXR0cmlidXRlcywgdHJ1ZSk7XG4gICAgcmVzdWx0LmxpbmtzID0gdGhpcy5saW5rcztcblxuICAgIGlmIChfLmlzRW1wdHkocmVzdWx0LmxpbmtzKSkge1xuICAgICAgZGVsZXRlIHJlc3VsdC5saW5rcztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIH1cblxuICBkZXNlcmlhbGl6ZSAoc2VyaWFsaXplZCkge1xuXG4gICAgaWYgKCF0aGlzLl92YWxpZGF0ZVNlcmlhbGl6ZWQoc2VyaWFsaXplZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBkYXRhISB0eXBlIHNob3VsZCBiZSBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KF8uY2xvbmUoXy5vbWl0KHNlcmlhbGl6ZWQsICdsaW5rcycpLCB0cnVlKSk7XG4gICAgdGhpcy5zZXRMaW5rKHNlcmlhbGl6ZWQubGlua3MpO1xuXG4gIH1cblxuICBjbG9uZSAoKSB7XG5cbiAgICBsZXQgcmVzb3VyY2UgPSBuZXcgUmVzb3VyY2UodGhpcy5zZXJpYWxpemUoKSk7XG4gICAgcmVzb3VyY2UudXVpZCA9IHRoaXMudXVpZDtcbiAgICByZXR1cm4gcmVzb3VyY2U7XG5cbiAgfVxuXG4gIF92YWxpZGF0ZVNlcmlhbGl6ZWQgKHNlcmlhbGl6ZWQpIHtcblxuICAgIHJldHVybiBzZXJpYWxpemVkICYmIHNlcmlhbGl6ZWQudHlwZTtcblxuICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL1Jlc291cmNlLmpzXG4gKiovIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHVybGpvaW4gZnJvbSAndXJsLWpvaW4nO1xuaW1wb3J0IHV1aWQgZnJvbSAnbm9kZS11dWlkJztcbmltcG9ydCBkaWZmIGZyb20gJy4vZGlmZic7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9SZXNvdXJjZSc7XG5pbXBvcnQgUkVTVGZ1bCBmcm9tICcuL1JFU1RmdWwnO1xuXG5cbmNsYXNzIFBvb2wge1xuXG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG5cbiAgICB0aGlzLnN5bmMgPSBSRVNUZnVsO1xuICAgIHRoaXMucmVzZXRBbGwoKTtcblxuICB9XG5cbiAgcmVzZXRBbGwgKCkge1xuXG4gICAgdGhpcy5wb29sID0ge307XG4gICAgdGhpcy5ibG9icyA9IHt9O1xuICAgIHRoaXMuc3RhZ2VkID0ge307XG4gICAgdGhpcy5zdGFnZWRMaW5rID0gW107XG4gICAgdGhpcy5yZW1vdGUgPSB7fTtcbiAgICB0aGlzLmNvbW1pdHMgPSBbXTtcbiAgICB0aGlzLnJlbW90ZUluZGV4ID0gLTE7XG5cbiAgfVxuXG4gIGdldENvbW1pdCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggIT09IHVuZGVmaW5lZCA/IGlkeCA6IHRoaXMuY29tbWl0cy5sZW5ndGggLSAxO1xuICAgIHJldHVybiB0aGlzLmNvbW1pdHNbaWR4XSB8fCB7fTtcblxuICB9XG5cbiAgc2V0UmVtb3RlSW5kZXggKGlkeCkge1xuXG4gICAgaWR4ID0gaWR4ICE9PSB1bmRlZmluZWQgPyBpZHggOiB0aGlzLmNvbW1pdHMubGVuZ3RoIC0gMTtcbiAgICB0aGlzLnJlbW90ZUluZGV4ID0gaWR4O1xuXG4gIH1cblxuICBybSAocmVzb3VyY2UpIHtcblxuICAgIGlmKF8uaXNBcnJheShyZXNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChyZXNvdXJjZSwgcmVzb3VyY2UgPT4gdGhpcy5ybShyZXNvdXJjZSkpO1xuICAgIH1cblxuICAgIGxldCByaWQgPSByZXNvdXJjZS5yaWQ7XG5cbiAgICB0aGlzLnN0YWdlZFtyaWRdID0gbnVsbDtcblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyaWRdO1xuXG4gIH1cblxuICBhZGQgKHJlc291cmNlKSB7XG5cbiAgICBpZihfLmlzQXJyYXkocmVzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gXy5tYXAocmVzb3VyY2UsIHJlc291cmNlID0+IHRoaXMuYWRkKHJlc291cmNlKSk7XG4gICAgfVxuXG4gICAgbGV0IHJpZCA9IHJlc291cmNlLnJpZDtcblxuICAgIGlmICghdGhpcy5wb29sW3JpZF0pIHtcbiAgICAgIHRoaXMucG9vbFtyaWRdID0gcmVzb3VyY2U7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFnZWRbcmlkXSA9IHJlc291cmNlLnNlcmlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3JpZF07XG5cbiAgfVxuXG4gIHJtTGlua2FnZSAocmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSB7XG5cbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlTGlua2FnZU9wZXJhdGlvbihcbiAgICAgICdyZW1vdmUnLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpO1xuXG4gIH1cblxuICBhZGRMaW5rYWdlIChyZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uKFxuICAgICAgJ2FkZCcsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIF9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uIChvcCwgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKSB7XG5cbiAgICBpZihfLmlzQXJyYXkobGlua2FnZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChsaW5rYWdlLCBsaW5rYWdlID0+IHRoaXMuX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24oXG4gICAgICAgIG9wLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhZ2VkID0ge1xuICAgICAgb3AsXG4gICAgICByZXNvdXJjZSxcbiAgICAgIHJlbGF0aW9uLFxuICAgICAgbGlua2FnZSxcbiAgICAgIG9wdGlvbnNcbiAgICB9O1xuXG4gICAgdGhpcy5zdGFnZWRMaW5rLnB1c2goc3RhZ2VkKTtcblxuICAgIHJldHVybiBzdGFnZWQ7XG5cbiAgfVxuXG4gIGdldFN0YWdlZCAocmVzb3VyY2UpIHtcblxuICAgIGlmICghdGhpcy5pc1N0YWdlZChyZXNvdXJjZSkpIHtcbiAgICAgIHRocm93IEVycm9yKGBjYW4gbm90IGZpbmQgJHtyZXNvdXJjZX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmVzb3VyY2UucmlkXTtcblxuICB9XG5cbiAgaXNTdGFnZWQgKHJlc291cmNlKSB7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmVzb3VyY2UucmlkXSAhPT0gdW5kZWZpbmVkO1xuXG4gIH1cblxuICBjb21taXQgKCkge1xuXG4gICAgbGV0IGxhc3RDb21taXQgPSB0aGlzLmdldENvbW1pdCgpO1xuXG4gICAgbGV0IG5ld0NvbW1pdCA9IF8ucmVkdWNlKHRoaXMuc3RhZ2VkLCAoY29tbWl0LCBzZXJpYWxpemVkLCByaWQpID0+IHtcbiAgICAgIGlmICghc2VyaWFsaXplZCkge1xuICAgICAgICBpZiAoY29tbWl0W3JpZF0pIHtcbiAgICAgICAgICBkZWxldGUgY29tbWl0W3JpZF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjb21taXRbcmlkXSA9IHRoaXMuX2NyZWF0ZUJsb2Ioc2VyaWFsaXplZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29tbWl0O1xuICAgIH0sIF8uY2xvbmUobGFzdENvbW1pdCwgdHJ1ZSkpO1xuXG4gICAgXy5yZWR1Y2UodGhpcy5zdGFnZWRMaW5rLCAoY29tbWl0LCBsaW5rT3BlcmF0aW9uKSA9PiB7XG4gICAgICBjb21taXRbdXVpZC52NCgpXSA9IGxpbmtPcGVyYXRpb247XG4gICAgICByZXR1cm4gY29tbWl0O1xuICAgIH0sIG5ld0NvbW1pdCk7XG5cbiAgICB0aGlzLmNvbW1pdHMucHVzaChuZXdDb21taXQpO1xuICAgIHRoaXMuc3RhZ2VkID0ge307XG4gICAgdGhpcy5zdGFnZWRMaW5rID0gW107XG5cbiAgfVxuXG4gIGFkZFJlbW90ZSAodHlwZSwgdXJsKSB7XG5cbiAgICB0aGlzLnJlbW90ZVt0eXBlXSA9IHVybDtcblxuICB9XG5cbiAgZ2V0UmVtb3RlICh0eXBlLCBpZCwgcmVsYXRpb24pIHtcblxuICAgIGxldCB1cmxQYXJ0cyA9IF8uY29tcGFjdChbXG4gICAgICB0aGlzLnJlbW90ZVt0eXBlXSxcbiAgICAgIGlkLFxuICAgICAgcmVsYXRpb24gPyAnbGlua3MnIDogdW5kZWZpbmVkLFxuICAgICAgcmVsYXRpb25cbiAgICBdKTtcbiAgICByZXR1cm4gdXJsam9pbi5hcHBseShudWxsLCB1cmxQYXJ0cyk7XG5cbiAgfVxuXG4gIGdldCAodHlwZSwgaWQpIHtcblxuICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoJ3R5cGUnKSA9PT0gdHlwZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBfLmZpbmQodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCd0eXBlJykgPT09IHR5cGUgJiZcbiAgICAgICAgcmVzb3VyY2UuZ2V0KCdpZCcpID09PSBpZDtcbiAgICB9KTtcblxuICB9XG5cbiAgaGFzICh0eXBlLCBpZCkge1xuXG4gICAgcmV0dXJuICEhXy5maW5kKHRoaXMucG9vbCwgcmVzb3VyY2UgPT4ge1xuICAgICAgcmV0dXJuIHJlc291cmNlLmdldCgndHlwZScpID09PSB0eXBlICYmXG4gICAgICAgIHJlc291cmNlLmdldCgnaWQnKSA9PT0gaWQ7XG4gICAgfSk7XG5cbiAgfVxuXG4gIF9jcmVhdGVCbG9iIChzZXJpYWxpemVkKSB7XG5cbiAgICBsZXQgYmlkID0gdXVpZC52NCgpO1xuICAgIHRoaXMuYmxvYnNbYmlkXSA9IF8uY2xvbmUoc2VyaWFsaXplZCwgdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXMuYmxvYnNbYmlkXTtcblxuICB9XG5cbiAgX2dldEJsb2IgKGJpZCkge1xuXG4gICAgcmV0dXJuIHRoaXMuYmxvYnNbYmlkXTtcblxuICB9XG5cbiAgcHVsbEJ5TGluayAobGluaywgb3B0aW9ucykge1xuXG4gICAgbGV0IHVybDtcbiAgICBpZiAoXy5pc1N0cmluZyhsaW5rKSkge1xuICAgICAgdXJsID0gbGluaztcbiAgICB9XG4gICAgZWxzZSBpZiAobGluay5saW5rYWdlKSB7XG4gICAgICB1cmwgPSB0aGlzLmdldFJlbW90ZShsaW5rLmxpbmthZ2UudHlwZSwgbGluay5saW5rYWdlLmlkKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobGluay5yZWxhdGVkKSB7XG4gICAgICB1cmwgPSBsaW5rLnJlbGF0ZWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGxpbmsuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHVsbEJ5VVJMKHVybCwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIHB1bGwgKHR5cGUsIGlkLCBvcHRpb25zKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wdWxsQnlVUkwodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpLCBvcHRpb25zKTtcblxuICB9XG5cbiAgcHVsbEJ5VVJMICh1cmwsIG9wdGlvbnMpIHtcblxuICAgIGlmICghXy5pc0VtcHR5KHRoaXMuc3RhZ2VkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwdWxsIHdoZW4gc3RhZ2VkIGNoYW5nZSBpcyBub3QgZXhpc3QnKTtcbiAgICB9XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIGxldCBpbmNsdWRlZCA9IG9wdGlvbnMuaW5jbHVkZWQ7XG4gICAgaWYgKGluY2x1ZGVkKSB7XG4gICAgICBvcHRpb25zLmluY2x1ZGVkID0gaW5jbHVkZWQuam9pbignLCcpO1xuICAgIH1cblxuICAgIGxldCBmaWVsZHMgPSBvcHRpb25zLmZpZWxkcztcbiAgICBpZiAoZmllbGRzKSB7XG4gICAgICBfLnJlZHVjZShmaWVsZHMsIChvcHRpb25zLCBmaWVsZHMsIHR5cGUpID0+IHtcbiAgICAgICAgb3B0aW9uc1tgZmllbGRzWyR7dHlwZX1dYF0gPSBmaWVsZHMuam9pbignLCcpO1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICAgIH0sIG9wdGlvbnMpO1xuICAgICAgZGVsZXRlIG9wdGlvbnMuZmllbGRzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN5bmMuZ2V0KHVybCwgb3B0aW9ucylcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICB9KTtcblxuICB9XG5cbiAgcHVzaCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggfHwgdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG5cbiAgICBpZiAoaWR4IDw9IHRoaXMucmVtb3RlSW5kZXgpIHtcbiAgICAgIHJldHVybiBRKCk7XG4gICAgfVxuXG4gICAgbGV0IGFmdGVyQ29tbWl0ID0gdGhpcy5nZXRDb21taXQoaWR4KTtcbiAgICBsZXQgYmVmb3JlQ29tbWl0ID0gdGhpcy5nZXRDb21taXQodGhpcy5yZW1vdGVJbmRleCk7XG5cbiAgICBsZXQgcmVtb3ZlZCA9IF8uZGlmZmVyZW5jZShcbiAgICAgIF8ua2V5cyhiZWZvcmVDb21taXQpLFxuICAgICAgXy5rZXlzKGFmdGVyQ29tbWl0KVxuICAgICk7XG5cbiAgICBsZXQgY2hhbmdlZE9yQWRkZWQgPSBfLndpdGhvdXQoXG4gICAgICBfLmtleXMoYWZ0ZXJDb21taXQpLFxuICAgICAgXy5rZXlzKHJlbW92ZWQpXG4gICAgKTtcblxuICAgIGxldCBkZWxldGVSZXF1ZXN0ID0gXy5tYXAocmVtb3ZlZCwgcmlkID0+IHtcbiAgICAgIC8vIGlzIExpbmtcbiAgICAgIGlmICghdGhpcy5wb29sW3JpZF0pIHsgcmV0dXJuOyB9XG5cbiAgICAgIGxldCB0eXBlID0gdGhpcy5wb29sW3JpZF0uZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ2lkJyk7XG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5kZWxldGUodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IGRlbGV0ZSB0aGlzLnBvb2xbcmlkXSxcbiAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fc2F2ZURhdGEoYmVmb3JlQ29tbWl0W3JpZF0sIHJpZCk7XG4gICAgICAgICAgICAgIHJldHVybiBRLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBwb3N0T3JQYXRjaFJlcXVlc3QgPSBfLm1hcChjaGFuZ2VkT3JBZGRlZCwgcmlkID0+IHtcbiAgICAgIC8vIGlzIExpbmtcbiAgICAgIGlmICghdGhpcy5wb29sW3JpZF0pIHsgcmV0dXJuOyB9XG4gICAgICAvLyBub3QgY2hhbmdlXG4gICAgICBpZiAoXy5pc0VxdWFsKGFmdGVyQ29tbWl0W3JpZF0sIGJlZm9yZUNvbW1pdFtyaWRdKSkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ3R5cGUnKTtcbiAgICAgIGxldCBpZCA9IHRoaXMucG9vbFtyaWRdLmdldCgnaWQnKTtcbiAgICAgIGxldCBkZWx0YSA9IGRpZmYoYmVmb3JlQ29tbWl0W3JpZF0sIGFmdGVyQ29tbWl0W3JpZF0pO1xuXG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgXy5leHRlbmQoZGVsdGEsIHsgdHlwZSwgaWQgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMucGF0Y2godGhpcy5nZXRSZW1vdGUodHlwZSwgaWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvUmVxdWVzdChkZWx0YSkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlLCByaWQpLFxuICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9zYXZlRGF0YShiZWZvcmVDb21taXRbcmlkXSwgcmlkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCFpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBvc3QodGhpcy5nZXRSZW1vdGUodHlwZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90b1JlcXVlc3QoZGVsdGEpKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHRoaXMuX3NhdmVSZXNwb25zZShyZXNwb25zZSwgcmlkKSxcbiAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlKHJpZCk7XG4gICAgICAgICAgICAgIHJldHVybiBRLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBsaW5rT3BlcmF0aW9uUmVxdWVzdCA9IF8ubWFwKGFmdGVyQ29tbWl0LCAoc3RhZ2VkLCByaWQpID0+IHtcbiAgICAgIC8vIGlzIHJlc291cmNlXG4gICAgICBpZiAodGhpcy5wb29sW3JpZF0gfHwgIXN0YWdlZC5vcCkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSBzdGFnZWQucmVzb3VyY2UuZ2V0KCd0eXBlJyk7XG4gICAgICBsZXQgaWQgPSBzdGFnZWQucmVzb3VyY2UuZ2V0KCdpZCcpO1xuICAgICAgbGV0IG9wdGlvbnMgPSBfLmRlZmF1bHRzKHN0YWdlZC5vcHRpb25zIHx8IHt9LCB7XG4gICAgICAgIGhhc01hbnk6IHRydWVcbiAgICAgIH0pO1xuICAgICAgbGV0IG9wID0gc3RhZ2VkLm9wO1xuICAgICAgbGV0IHJlbGF0aW9uID0gc3RhZ2VkLnJlbGF0aW9uO1xuICAgICAgbGV0IGxpbmthZ2UgPSBzdGFnZWQubGlua2FnZTtcbiAgICAgIGxldCByZXF1ZXN0Qm9keSA9IG9wdGlvbnMuaGFzTWFueSA/XG4gICAgICAgIHsgZGF0YTogW2xpbmthZ2VdIH0gOiB7IGRhdGE6IGxpbmthZ2UgfTtcblxuICAgICAgaWYgKG9wID09PSAnYWRkJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBvc3QodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQsIHJlbGF0aW9uKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5KVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZSBhZnRlckNvbW1pdFtyaWRdO1xuICAgICAgICAgICAgcmVzcG9uc2UgPT4gdGhpcy5fc2F2ZVJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wID09PSAncmVtb3ZlJykge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLmRlbGV0ZSh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCwgcmVsYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIGFmdGVyQ29tbWl0W3JpZF07XG4gICAgICAgICAgICByZXNwb25zZSA9PiB0aGlzLl9zYXZlUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuYWxsKFxuICAgICAgZGVsZXRlUmVxdWVzdC5jb25jYXQoXG4gICAgICAgIHBvc3RPclBhdGNoUmVxdWVzdCxcbiAgICAgICAgbGlua09wZXJhdGlvblJlcXVlc3QpXG4gICAgKVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0UmVtb3RlSW5kZXgoKTtcbiAgICB9KTtcblxuICB9XG5cbiAgX3NhdmVSZXNwb25zZSAocmVzcG9uc2UsIHJpZCkge1xuXG4gICAgbGV0IG1haW5SZXNvdXJjZSA9IHRoaXMuX3NhdmVEYXRhKHJlc3BvbnNlLmRhdGEsIHJpZCk7XG4gICAgbGV0IGluY2x1ZGVkUmVzb3VyY2VzID0gXy5tYXAoXG4gICAgICByZXNwb25zZS5pbmNsdWRlZCwgZGF0YSA9PiB0aGlzLl9zYXZlRGF0YShkYXRhKSk7XG4gICAgcmV0dXJuIG1haW5SZXNvdXJjZTtcblxuICB9XG5cbiAgX3JlbW92ZSAocmlkKSB7XG5cbiAgICBpZiAoXy5pc0FycmF5KHJpZCkpIHtcbiAgICAgIHJldHVybiBfLm1hcChyaWQsIGRhdGEgPT4gdGhpcy5fcmVtb3ZlKHJpZCkpO1xuICAgIH1cblxuICAgIGxldCByZXNvdXJjZSA9IHRoaXMucG9vbFtyaWRdO1xuXG4gICAgbGV0IHN0YWdlZEJhY2t1cCA9IF8uY2xvbmUodGhpcy5zdGFnZWQsIHRydWUpO1xuXG4gICAgdGhpcy5ybShyZXNvdXJjZSk7XG4gICAgdGhpcy5jb21taXQoKTtcbiAgICB0aGlzLnNldFJlbW90ZUluZGV4KCk7XG5cbiAgICB0aGlzLnN0YWdlZCA9IHN0YWdlZEJhY2t1cDtcblxuICB9XG5cbiAgX3NhdmVEYXRhIChkYXRhLCByaWQpIHtcblxuICAgIGlmIChfLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChkYXRhLCBkYXRhID0+IHRoaXMuX3NhdmVEYXRhKGRhdGEpKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzb3VyY2UgPSByaWQgIT09IHVuZGVmaW5lZCA/XG4gICAgICB0aGlzLnBvb2xbcmlkXSA6IHRoaXMuZ2V0KGRhdGEudHlwZSwgZGF0YS5pZCk7XG5cbiAgICBpZiAoIXJlc291cmNlKSB7XG4gICAgICByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZShkYXRhKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXNvdXJjZS5kZXNlcmlhbGl6ZShkYXRhKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhZ2VkQmFja3VwID0gXy5jbG9uZSh0aGlzLnN0YWdlZCwgdHJ1ZSk7XG5cbiAgICB0aGlzLmFkZChyZXNvdXJjZSk7XG4gICAgdGhpcy5jb21taXQoKTtcbiAgICB0aGlzLnNldFJlbW90ZUluZGV4KCk7XG5cbiAgICB0aGlzLnN0YWdlZCA9IHN0YWdlZEJhY2t1cDtcblxuICAgIHJldHVybiByZXNvdXJjZTtcblxuICB9XG5cbiAgX3RvUmVxdWVzdCAoc2VyaWFsaXplZCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IHNlcmlhbGl6ZWRcbiAgICB9O1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFBvb2w7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9Qb29sLmpzXG4gKiovIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCBSZXNwb25zZSBmcm9tICcuL1Jlc3BvbnNlJztcblxuXG5sZXQgc3RyaW5naWZ5UmVxdWlyZWRNZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gIC8vIHRoZXNlIEhUVFAgbWV0aG9kcyByZXF1aXJlcyBKU09OLnN0cmluZ2lmeVxuICByZXR1cm4gKC9eKFBPU1R8UFVUfFBBVENIfERFTEVURSkkLy50ZXN0KG1ldGhvZC50b1VwcGVyQ2FzZSgpKSk7XG59O1xuXG5sZXQgbWFrZUFqYXhSZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBpZiAoc3RyaW5naWZ5UmVxdWlyZWRNZXRob2Qob3B0aW9ucy50eXBlKSkge1xuICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgIG9wdGlvbnMuZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgb3B0aW9ucy51cmwgPSBvcHRpb25zLnVybC5yZXBsYWNlKC9cXC8/JC8sICcvJyk7XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL3dpa2kvQ29taW5nLWZyb20talF1ZXJ5XG4gIHJldHVybiBRLnByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICQuYWpheChvcHRpb25zKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZmFpbChmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZWplY3QocmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH0pO1xuXG59O1xuXG5cblxubGV0IFJFU1RmdWwgPSB7XG5cbiAgaGVhZDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJIRUFEXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGdldDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcG9zdDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHB1dDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQVVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcGF0Y2g6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUEFUQ0hcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZGVsZXRlOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkRFTEVURVwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBkZWZhdWx0T3B0aW9uczoge1xuXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICBwcm9jZXNzRGF0YTogdHJ1ZVxuXG4gIH0sXG5cbiAgYWpheFNldHVwOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gICAgJC5hamF4U2V0dXAob3B0aW9ucyk7XG5cbiAgfVxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBSRVNUZnVsO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvUkVTVGZ1bC5qc1xuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcblxuXG5jbGFzcyBUcmFuc2FjdGlvbiB7XG5cbiAgY29uc3RydWN0b3IocG9vbCwgb3B0aW9ucykge1xuXG4gICAgXy5leHRlbmQodGhpcywgRXZlbnRzKTtcbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMucG9vbCA9IHBvb2w7XG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG5cbiAgfVxuXG4gIGJlZ2luICgpIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuX2FjdGl2YXRlKCk7XG5cbiAgfVxuXG4gIGNvbW1pdCAoKSB7XG5cbiAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XG5cbiAgfVxuXG5cbiAgX2FjdGl2YXRlICgpIHtcblxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gIH1cblxuICBfZGVhY3RpdmF0ZSAoKSB7XG5cbiAgICB0aGlzLnN0b3BMaXN0ZW5pbmcodGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICB9XG5cbiAgb25UcmFuc2Zvcm0gKG9wZXJhdGlvbikge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zLnB1c2gob3BlcmF0aW9uKTtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHJhbnNhY3Rpb247XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9UcmFuc2FjdGlvbi5qc1xuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQganNvbmRpZmZwYXRjaCBmcm9tICdqc29uZGlmZnBhdGNoJztcblxuXG52YXIgZGlmZnBhdGNoZXIgPSBqc29uZGlmZnBhdGNoLmNyZWF0ZSh7XG4gIHRleHREaWZmOiB7XG4gICAgbWluTGVuZ3RoOiBJbmZpbml0eVxuICB9XG59KTtcblxuXG5mdW5jdGlvbiBnZXRBZnRlclZhbHVlRnJvbURpZmYgKGRpZmYpIHtcblxuICBpZiAoIV8uaXNBcnJheShkaWZmKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCB0eXBlIScpO1xuICB9XG5cbiAgc3dpdGNoIChkaWZmLmxlbmd0aCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBkaWZmWzBdO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBkaWZmWzFdO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxufVxuXG5cbmZ1bmN0aW9uIGdldENoYW5nZWQgKGRpZmZzKSB7XG5cbiAgaWYgKF8uaXNBcnJheShkaWZmcykpIHtcbiAgICByZXR1cm4gZ2V0QWZ0ZXJWYWx1ZUZyb21EaWZmKGRpZmZzKTtcbiAgfVxuXG4gIHJldHVybiBfLnJlZHVjZShkaWZmcywgZnVuY3Rpb24gKHJlc3VsdCwgZGlmZiwga2V5KSB7XG5cbiAgICBpZiAoXy5pc09iamVjdChkaWZmKSkge1xuICAgICAgaWYgKGRpZmYuX3QgPT09ICdhJykge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICAgcmVzdWx0W2tleV0gPSBnZXRDaGFuZ2VkKGRpZmYpO1xuICAgIH1cbiAgICBlbHNlIGlmIChfLmlzQXJyYXkoZGlmZikpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gZ2V0QWZ0ZXJWYWx1ZUZyb21EaWZmKGRpZmYpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgfSwge30pO1xuXG59XG5cbmZ1bmN0aW9uIGRpZmYgKG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuXG4gIHZhciBkZWx0YSA9IGRpZmZwYXRjaGVyLmRpZmYob2xkVmFsdWUsIG5ld1ZhbHVlKTtcbiAgcmV0dXJuIGdldENoYW5nZWQoZGVsdGEpO1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRpZmY7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9kaWZmLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJsb2Rhc2hcIlxuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5vZGUtdXVpZFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwibm9kZS11dWlkXCJcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJxXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJxXCJcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1cmwtam9pblwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwidXJsLWpvaW5cIlxuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImpxdWVyeVwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwianF1ZXJ5XCJcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFja2JvbmVcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImJhY2tib25lXCJcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwianNvbmRpZmZwYXRjaFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwianNvbmRpZmZwYXRjaFwiXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cblxubGV0IF92YWxpZGF0ZVJlc3BvbnNlID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGxldCBib2R5ID0geGhyLnJlc3BvbnNlSlNPTjtcblxuICBpZiAoYm9keS5kYXRhID09PSB1bmRlZmluZWQgJiYgYm9keS5lcnJvcnMgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkEgZG9jdW1lbnQgTVVTVCBjb250YWluIGVpdGhlciBwcmltYXJ5IGRhdGEgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcIm9yIGFuIGFycmF5IG9mIGVycm9yIG9iamVjdHMuXCIpO1xuICB9XG5cbn07XG5cblxubGV0IF9pc1Jlc3BvbnNlRXJyb3IgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XG5cbiAgcmV0dXJuIDQwMCA8PSBzdGF0dXMgJiYgNjAwID4gc3RhdHVzIDtcblxufTtcblxuXG5sZXQgX3BhcnNlRGF0YSA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBpZiAoIXhoci5yZXNwb25zZUpTT04pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4geGhyLnJlc3BvbnNlSlNPTi5kYXRhO1xuXG59O1xuXG5sZXQgX3BhcnNlSW5jbHVkZWQgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgaWYgKCF4aHIucmVzcG9uc2VKU09OKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHhoci5yZXNwb25zZUpTT04uaW5jbHVkZWQ7XG5cbn07XG5cbmxldCBfcGFyc2VFcnJvcnMgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgaWYgKCEoeGhyLnJlc3BvbnNlSlNPTiAmJiB4aHIucmVzcG9uc2VKU09OLmVycm9ycyApKSB7XG4gICAgaWYgKF9pc1Jlc3BvbnNlRXJyb3IoeGhyLnN0YXR1cykpIHtcbiAgICAgIHJldHVybiBbe1xuICAgICAgICBzdGF0dXM6IFwiXCIgKyB4aHIuc3RhdHVzXG4gICAgICB9XTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgZXJyb3JzID0geGhyLnJlc3BvbnNlSlNPTi5lcnJvcnM7XG5cbiAgcmV0dXJuIF8ubWFwKGVycm9ycywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgcmV0dXJuIF8uZXh0ZW5kKHtcbiAgICAgIHN0YXR1czogXCJcIiArIHhoci5zdGF0dXNcbiAgICB9LCBlcnJvcik7XG4gIH0pO1xuXG59O1xuXG5cbmxldCBfcGFyc2VIZWFkZXJzID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGxldCByZXN1bHQgPSBbXTtcblxuICBsZXQgaGVhZGVyUmVnZXggPSAvXiguKj8pOlsgXFx0XSooW15cXHJcXG5dKikkL21nO1xuICBsZXQgaGVhZGVyc1N0cmluZyA9IHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKTtcbiAgbGV0IGZpbmRSZXN1bHQ7XG5cbiAgd2hpbGUgKChmaW5kUmVzdWx0ID0gaGVhZGVyUmVnZXguZXhlYyhoZWFkZXJzU3RyaW5nKSkgIT09IG51bGwpIHtcbiAgICByZXN1bHQucHVzaChmaW5kUmVzdWx0LnNsaWNlKDEpKTtcbiAgfVxuXG4gIHJldHVybiBfLm9iamVjdChyZXN1bHQpO1xuXG59O1xuXG5cbmNsYXNzIFJlc3BvbnNlIHtcblxuICBjb25zdHJ1Y3RvciAoeGhyKSB7XG5cbiAgICB0aGlzLnJlc3BvbnNlSlNPTiA9IHhoci5yZXNwb25zZUpTT047XG4gICAgdGhpcy5kYXRhID0gX3BhcnNlRGF0YSh4aHIpO1xuICAgIHRoaXMuaW5jbHVkZWQgPSBfcGFyc2VJbmNsdWRlZCh4aHIpO1xuICAgIHRoaXMuZXJyb3JzID0gX3BhcnNlRXJyb3JzKHhocik7XG4gICAgdGhpcy5oZWFkZXJzID0gX3BhcnNlSGVhZGVycyh4aHIpO1xuICAgIHRoaXMubmF0aXZlWEhSID0geGhyO1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zZTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL1Jlc3BvbnNlLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==