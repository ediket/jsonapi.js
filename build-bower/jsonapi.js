(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("uuid"), require("Q"), require("urljoin"), require("Backbone"), require("$"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "uuid", "Q", "urljoin", "Backbone", "$"], factory);
	else if(typeof exports === 'object')
		exports["JSONAPI"] = factory(require("_"), require("uuid"), require("Q"), require("urljoin"), require("Backbone"), require("$"));
	else
		root["JSONAPI"] = factory(root["_"], root["uuid"], root["Q"], root["urljoin"], root["Backbone"], root["$"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_11__) {
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
	
	var _libResource = __webpack_require__(24);
	
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

	/*
	
	LCS implementation that supports arrays or strings
	
	reference: http://en.wikipedia.org/wiki/Longest_common_subsequence_problem
	
	*/
	
	'use strict';
	
	var defaultMatch = function defaultMatch(array1, array2, index1, index2) {
	  return array1[index1] === array2[index2];
	};
	
	var lengthMatrix = function lengthMatrix(array1, array2, match, context) {
	  var len1 = array1.length;
	  var len2 = array2.length;
	  var x, y;
	
	  // initialize empty matrix of len1+1 x len2+1
	  var matrix = [len1 + 1];
	  for (x = 0; x < len1 + 1; x++) {
	    matrix[x] = [len2 + 1];
	    for (y = 0; y < len2 + 1; y++) {
	      matrix[x][y] = 0;
	    }
	  }
	  matrix.match = match;
	  // save sequence lengths for each coordinate
	  for (x = 1; x < len1 + 1; x++) {
	    for (y = 1; y < len2 + 1; y++) {
	      if (match(array1, array2, x - 1, y - 1, context)) {
	        matrix[x][y] = matrix[x - 1][y - 1] + 1;
	      } else {
	        matrix[x][y] = Math.max(matrix[x - 1][y], matrix[x][y - 1]);
	      }
	    }
	  }
	  return matrix;
	};
	
	var backtrack = function backtrack(_x, _x2, _x3, _x4, _x5, _x6) {
	  var _again = true;
	
	  _function: while (_again) {
	    var matrix = _x,
	        array1 = _x2,
	        array2 = _x3,
	        index1 = _x4,
	        index2 = _x5,
	        context = _x6;
	    subsequence = undefined;
	    _again = false;
	
	    if (index1 === 0 || index2 === 0) {
	      return {
	        sequence: [],
	        indices1: [],
	        indices2: []
	      };
	    }
	
	    if (matrix.match(array1, array2, index1 - 1, index2 - 1, context)) {
	      var subsequence = backtrack(matrix, array1, array2, index1 - 1, index2 - 1, context);
	      subsequence.sequence.push(array1[index1 - 1]);
	      subsequence.indices1.push(index1 - 1);
	      subsequence.indices2.push(index2 - 1);
	      return subsequence;
	    }
	
	    if (matrix[index1][index2 - 1] > matrix[index1 - 1][index2]) {
	      _x = matrix;
	      _x2 = array1;
	      _x3 = array2;
	      _x4 = index1;
	      _x5 = index2 - 1;
	      _x6 = context;
	      _again = true;
	      continue _function;
	    } else {
	      _x = matrix;
	      _x2 = array1;
	      _x3 = array2;
	      _x4 = index1 - 1;
	      _x5 = index2;
	      _x6 = context;
	      _again = true;
	      continue _function;
	    }
	  }
	};
	
	var get = function get(array1, array2, match, context) {
	  context = context || {};
	  var matrix = lengthMatrix(array1, array2, match || defaultMatch, context);
	  var result = backtrack(matrix, array1, array2, array1.length, array2.length, context);
	  if (typeof array1 === 'string' && typeof array2 === 'string') {
	    result.sequence = result.sequence.join('');
	  }
	  return result;
	};
	
	exports.get = get;

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
	
	var _Resource = __webpack_require__(24);
	
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
	
	var _jquery = __webpack_require__(11);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _lodash = __webpack_require__(6);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _q = __webpack_require__(8);
	
	var _q2 = _interopRequireDefault(_q);
	
	var _Response = __webpack_require__(12);
	
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

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _lodash = __webpack_require__(6);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _jsondiffpatch = __webpack_require__(13);
	
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

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var environment = __webpack_require__(15);
	
	var DiffPatcher = __webpack_require__(16).DiffPatcher;
	exports.DiffPatcher = DiffPatcher;
	
	exports.create = function (options) {
		return new DiffPatcher(options);
	};
	
	exports.dateReviver = __webpack_require__(17);
	
	var defaultInstance;
	
	exports.diff = function () {
		if (!defaultInstance) {
			defaultInstance = new DiffPatcher();
		}
		return defaultInstance.diff.apply(defaultInstance, arguments);
	};
	
	exports.patch = function () {
		if (!defaultInstance) {
			defaultInstance = new DiffPatcher();
		}
		return defaultInstance.patch.apply(defaultInstance, arguments);
	};
	
	exports.unpatch = function () {
		if (!defaultInstance) {
			defaultInstance = new DiffPatcher();
		}
		return defaultInstance.unpatch.apply(defaultInstance, arguments);
	};
	
	exports.reverse = function () {
		if (!defaultInstance) {
			defaultInstance = new DiffPatcher();
		}
		return defaultInstance.reverse.apply(defaultInstance, arguments);
	};
	
	if (environment.isBrowser) {
		exports.homepage = '{{package-homepage}}';
		exports.version = '{{package-version}}';
	} else {
		var packageInfoModuleName = '../package.json';
		var packageInfo = __webpack_require__(14)(packageInfoModuleName);
		exports.homepage = packageInfo.homepage;
		exports.version = packageInfo.version;
	
		var formatterModuleName = './formatters';
		var formatters = __webpack_require__(14)(formatterModuleName);
		exports.formatters = formatters;
		// shortcut for console
		exports.console = formatters.console;
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./contexts/context": 18,
		"./contexts/context.js": 18,
		"./contexts/diff": 19,
		"./contexts/diff.js": 19,
		"./contexts/patch": 20,
		"./contexts/patch.js": 20,
		"./contexts/reverse": 21,
		"./contexts/reverse.js": 21,
		"./date-reviver": 17,
		"./date-reviver.js": 17,
		"./diffpatcher": 16,
		"./diffpatcher.js": 16,
		"./environment": 15,
		"./environment.js": 15,
		"./filters/arrays": 22,
		"./filters/arrays.js": 22,
		"./filters/dates": 23,
		"./filters/dates.js": 23,
		"./filters/lcs": 1,
		"./filters/lcs.js": 1,
		"./filters/nested": 25,
		"./filters/nested.js": 25,
		"./filters/texts": 26,
		"./filters/texts.js": 26,
		"./filters/trivial": 27,
		"./filters/trivial.js": 27,
		"./formatters/annotated": 28,
		"./formatters/annotated.js": 28,
		"./formatters/base": 29,
		"./formatters/base.js": 29,
		"./formatters/console": 30,
		"./formatters/console.js": 30,
		"./formatters/html": 31,
		"./formatters/html.js": 31,
		"./formatters/index": 32,
		"./formatters/index.js": 32,
		"./main": 13,
		"./main-formatters": 33,
		"./main-formatters.js": 33,
		"./main-full": 34,
		"./main-full.js": 34,
		"./main.js": 13,
		"./pipe": 35,
		"./pipe.js": 35,
		"./processor": 36,
		"./processor.js": 36
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 14;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.isBrowser = typeof window !== 'undefined';

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Processor = __webpack_require__(36).Processor;
	var Pipe = __webpack_require__(35).Pipe;
	var DiffContext = __webpack_require__(19).DiffContext;
	var PatchContext = __webpack_require__(20).PatchContext;
	var ReverseContext = __webpack_require__(21).ReverseContext;
	
	var trivial = __webpack_require__(27);
	var nested = __webpack_require__(25);
	var arrays = __webpack_require__(22);
	var dates = __webpack_require__(23);
	var texts = __webpack_require__(26);
	
	var DiffPatcher = function DiffPatcher(options) {
	  this.processor = new Processor(options);
	  this.processor.pipe(new Pipe('diff').append(nested.collectChildrenDiffFilter, trivial.diffFilter, dates.diffFilter, texts.diffFilter, nested.objectsDiffFilter, arrays.diffFilter).shouldHaveResult());
	  this.processor.pipe(new Pipe('patch').append(nested.collectChildrenPatchFilter, arrays.collectChildrenPatchFilter, trivial.patchFilter, texts.patchFilter, nested.patchFilter, arrays.patchFilter).shouldHaveResult());
	  this.processor.pipe(new Pipe('reverse').append(nested.collectChildrenReverseFilter, arrays.collectChildrenReverseFilter, trivial.reverseFilter, texts.reverseFilter, nested.reverseFilter, arrays.reverseFilter).shouldHaveResult());
	};
	
	DiffPatcher.prototype.options = function () {
	  return this.processor.options.apply(this.processor, arguments);
	};
	
	DiffPatcher.prototype.diff = function (left, right) {
	  return this.processor.process(new DiffContext(left, right));
	};
	
	DiffPatcher.prototype.patch = function (left, delta) {
	  return this.processor.process(new PatchContext(left, delta));
	};
	
	DiffPatcher.prototype.reverse = function (delta) {
	  return this.processor.process(new ReverseContext(delta));
	};
	
	DiffPatcher.prototype.unpatch = function (right, delta) {
	  return this.patch(right, this.reverse(delta));
	};
	
	exports.DiffPatcher = DiffPatcher;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// use as 2nd parameter for JSON.parse to revive Date instances
	'use strict';
	
	module.exports = function dateReviver(key, value) {
	  var parts;
	  if (typeof value === 'string') {
	    parts = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d*))?(Z|([+\-])(\d{2}):(\d{2}))$/.exec(value);
	    if (parts) {
	      return new Date(Date.UTC(+parts[1], +parts[2] - 1, +parts[3], +parts[4], +parts[5], +parts[6], +(parts[7] || 0)));
	    }
	  }
	  return value;
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Pipe = __webpack_require__(35).Pipe;
	
	var Context = function Context() {};
	
	Context.prototype.setResult = function (result) {
		this.result = result;
		this.hasResult = true;
		return this;
	};
	
	Context.prototype.exit = function () {
		this.exiting = true;
		return this;
	};
	
	Context.prototype.switchTo = function (next, pipe) {
		if (typeof next === 'string' || next instanceof Pipe) {
			this.nextPipe = next;
		} else {
			this.next = next;
			if (pipe) {
				this.nextPipe = pipe;
			}
		}
		return this;
	};
	
	Context.prototype.push = function (child, name) {
		child.parent = this;
		if (typeof name !== 'undefined') {
			child.childName = name;
		}
		child.root = this.root || this;
		child.options = child.options || this.options;
		if (!this.children) {
			this.children = [child];
			this.nextAfterChildren = this.next || null;
			this.next = child;
		} else {
			this.children[this.children.length - 1].next = child;
			this.children.push(child);
		}
		child.next = this;
		return this;
	};
	
	exports.Context = Context;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Context = __webpack_require__(18).Context;
	
	var DiffContext = function DiffContext(left, right) {
	  this.left = left;
	  this.right = right;
	  this.pipe = 'diff';
	};
	
	DiffContext.prototype = new Context();
	
	exports.DiffContext = DiffContext;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Context = __webpack_require__(18).Context;
	
	var PatchContext = function PatchContext(left, delta) {
	  this.left = left;
	  this.delta = delta;
	  this.pipe = 'patch';
	};
	
	PatchContext.prototype = new Context();
	
	exports.PatchContext = PatchContext;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Context = __webpack_require__(18).Context;
	
	var ReverseContext = function ReverseContext(delta) {
	  this.delta = delta;
	  this.pipe = 'reverse';
	};
	
	ReverseContext.prototype = new Context();
	
	exports.ReverseContext = ReverseContext;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DiffContext = __webpack_require__(19).DiffContext;
	var PatchContext = __webpack_require__(20).PatchContext;
	var ReverseContext = __webpack_require__(21).ReverseContext;
	
	var lcs = __webpack_require__(1);
	
	var ARRAY_MOVE = 3;
	
	var isArray = typeof Array.isArray === 'function' ?
	// use native function
	Array.isArray :
	// use instanceof operator
	function (a) {
	  return a instanceof Array;
	};
	
	var arrayIndexOf = typeof Array.prototype.indexOf === 'function' ? function (array, item) {
	  return array.indexOf(item);
	} : function (array, item) {
	  var length = array.length;
	  for (var i = 0; i < length; i++) {
	    if (array[i] === item) {
	      return i;
	    }
	  }
	  return -1;
	};
	
	function arraysHaveMatchByRef(array1, array2, len1, len2) {
	  for (var index1 = 0; index1 < len1; index1++) {
	    var val1 = array1[index1];
	    for (var index2 = 0; index2 < len2; index2++) {
	      var val2 = array2[index2];
	      if (val1 === val2) {
	        return true;
	      }
	    }
	  }
	}
	
	function matchItems(array1, array2, index1, index2, context) {
	  var value1 = array1[index1];
	  var value2 = array2[index2];
	  if (value1 === value2) {
	    return true;
	  }
	  if (typeof value1 !== 'object' || typeof value2 !== 'object') {
	    return false;
	  }
	  var objectHash = context.objectHash;
	  if (!objectHash) {
	    // no way to match objects was provided, try match by position
	    return context.matchByPosition && index1 === index2;
	  }
	  var hash1;
	  var hash2;
	  if (typeof index1 === 'number') {
	    context.hashCache1 = context.hashCache1 || [];
	    hash1 = context.hashCache1[index1];
	    if (typeof hash1 === 'undefined') {
	      context.hashCache1[index1] = hash1 = objectHash(value1, index1);
	    }
	  } else {
	    hash1 = objectHash(value1);
	  }
	  if (typeof hash1 === 'undefined') {
	    return false;
	  }
	  if (typeof index2 === 'number') {
	    context.hashCache2 = context.hashCache2 || [];
	    hash2 = context.hashCache2[index2];
	    if (typeof hash2 === 'undefined') {
	      context.hashCache2[index2] = hash2 = objectHash(value2, index2);
	    }
	  } else {
	    hash2 = objectHash(value2);
	  }
	  if (typeof hash2 === 'undefined') {
	    return false;
	  }
	  return hash1 === hash2;
	}
	
	var diffFilter = function arraysDiffFilter(context) {
	  if (!context.leftIsArray) {
	    return;
	  }
	
	  var matchContext = {
	    objectHash: context.options && context.options.objectHash,
	    matchByPosition: context.options && context.options.matchByPosition
	  };
	  var commonHead = 0;
	  var commonTail = 0;
	  var index;
	  var index1;
	  var index2;
	  var array1 = context.left;
	  var array2 = context.right;
	  var len1 = array1.length;
	  var len2 = array2.length;
	
	  var child;
	
	  if (len1 > 0 && len2 > 0 && !matchContext.objectHash && typeof matchContext.matchByPosition !== 'boolean') {
	    matchContext.matchByPosition = !arraysHaveMatchByRef(array1, array2, len1, len2);
	  }
	
	  // separate common head
	  while (commonHead < len1 && commonHead < len2 && matchItems(array1, array2, commonHead, commonHead, matchContext)) {
	    index = commonHead;
	    child = new DiffContext(context.left[index], context.right[index]);
	    context.push(child, index);
	    commonHead++;
	  }
	  // separate common tail
	  while (commonTail + commonHead < len1 && commonTail + commonHead < len2 && matchItems(array1, array2, len1 - 1 - commonTail, len2 - 1 - commonTail, matchContext)) {
	    index1 = len1 - 1 - commonTail;
	    index2 = len2 - 1 - commonTail;
	    child = new DiffContext(context.left[index1], context.right[index2]);
	    context.push(child, index2);
	    commonTail++;
	  }
	  var result;
	  if (commonHead + commonTail === len1) {
	    if (len1 === len2) {
	      // arrays are identical
	      context.setResult(undefined).exit();
	      return;
	    }
	    // trivial case, a block (1 or more consecutive items) was added
	    result = result || {
	      _t: 'a'
	    };
	    for (index = commonHead; index < len2 - commonTail; index++) {
	      result[index] = [array2[index]];
	    }
	    context.setResult(result).exit();
	    return;
	  }
	  if (commonHead + commonTail === len2) {
	    // trivial case, a block (1 or more consecutive items) was removed
	    result = result || {
	      _t: 'a'
	    };
	    for (index = commonHead; index < len1 - commonTail; index++) {
	      result['_' + index] = [array1[index], 0, 0];
	    }
	    context.setResult(result).exit();
	    return;
	  }
	  // reset hash cache
	  delete matchContext.hashCache1;
	  delete matchContext.hashCache2;
	
	  // diff is not trivial, find the LCS (Longest Common Subsequence)
	  var trimmed1 = array1.slice(commonHead, len1 - commonTail);
	  var trimmed2 = array2.slice(commonHead, len2 - commonTail);
	  var seq = lcs.get(trimmed1, trimmed2, matchItems, matchContext);
	  var removedItems = [];
	  result = result || {
	    _t: 'a'
	  };
	  for (index = commonHead; index < len1 - commonTail; index++) {
	    if (arrayIndexOf(seq.indices1, index - commonHead) < 0) {
	      // removed
	      result['_' + index] = [array1[index], 0, 0];
	      removedItems.push(index);
	    }
	  }
	
	  var detectMove = true;
	  if (context.options && context.options.arrays && context.options.arrays.detectMove === false) {
	    detectMove = false;
	  }
	  var includeValueOnMove = false;
	  if (context.options && context.options.arrays && context.options.arrays.includeValueOnMove) {
	    includeValueOnMove = true;
	  }
	
	  var removedItemsLength = removedItems.length;
	  for (index = commonHead; index < len2 - commonTail; index++) {
	    var indexOnArray2 = arrayIndexOf(seq.indices2, index - commonHead);
	    if (indexOnArray2 < 0) {
	      // added, try to match with a removed item and register as position move
	      var isMove = false;
	      if (detectMove && removedItemsLength > 0) {
	        for (var removeItemIndex1 = 0; removeItemIndex1 < removedItemsLength; removeItemIndex1++) {
	          index1 = removedItems[removeItemIndex1];
	          if (matchItems(trimmed1, trimmed2, index1 - commonHead, index - commonHead, matchContext)) {
	            // store position move as: [originalValue, newPosition, ARRAY_MOVE]
	            result['_' + index1].splice(1, 2, index, ARRAY_MOVE);
	            if (!includeValueOnMove) {
	              // don't include moved value on diff, to save bytes
	              result['_' + index1][0] = '';
	            }
	
	            index2 = index;
	            child = new DiffContext(context.left[index1], context.right[index2]);
	            context.push(child, index2);
	            removedItems.splice(removeItemIndex1, 1);
	            isMove = true;
	            break;
	          }
	        }
	      }
	      if (!isMove) {
	        // added
	        result[index] = [array2[index]];
	      }
	    } else {
	      // match, do inner diff
	      index1 = seq.indices1[indexOnArray2] + commonHead;
	      index2 = seq.indices2[indexOnArray2] + commonHead;
	      child = new DiffContext(context.left[index1], context.right[index2]);
	      context.push(child, index2);
	    }
	  }
	
	  context.setResult(result).exit();
	};
	diffFilter.filterName = 'arrays';
	
	var compare = {
	  numerically: function numerically(a, b) {
	    return a - b;
	  },
	  numericallyBy: function numericallyBy(name) {
	    return function (a, b) {
	      return a[name] - b[name];
	    };
	  }
	};
	
	var patchFilter = function nestedPatchFilter(context) {
	  if (!context.nested) {
	    return;
	  }
	  if (context.delta._t !== 'a') {
	    return;
	  }
	  var index, index1;
	
	  var delta = context.delta;
	  var array = context.left;
	
	  // first, separate removals, insertions and modifications
	  var toRemove = [];
	  var toInsert = [];
	  var toModify = [];
	  for (index in delta) {
	    if (index !== '_t') {
	      if (index[0] === '_') {
	        // removed item from original array
	        if (delta[index][2] === 0 || delta[index][2] === ARRAY_MOVE) {
	          toRemove.push(parseInt(index.slice(1), 10));
	        } else {
	          throw new Error('only removal or move can be applied at original array indices' + ', invalid diff type: ' + delta[index][2]);
	        }
	      } else {
	        if (delta[index].length === 1) {
	          // added item at new array
	          toInsert.push({
	            index: parseInt(index, 10),
	            value: delta[index][0]
	          });
	        } else {
	          // modified item at new array
	          toModify.push({
	            index: parseInt(index, 10),
	            delta: delta[index]
	          });
	        }
	      }
	    }
	  }
	
	  // remove items, in reverse order to avoid sawing our own floor
	  toRemove = toRemove.sort(compare.numerically);
	  for (index = toRemove.length - 1; index >= 0; index--) {
	    index1 = toRemove[index];
	    var indexDiff = delta['_' + index1];
	    var removedValue = array.splice(index1, 1)[0];
	    if (indexDiff[2] === ARRAY_MOVE) {
	      // reinsert later
	      toInsert.push({
	        index: indexDiff[1],
	        value: removedValue
	      });
	    }
	  }
	
	  // insert items, in reverse order to avoid moving our own floor
	  toInsert = toInsert.sort(compare.numericallyBy('index'));
	  var toInsertLength = toInsert.length;
	  for (index = 0; index < toInsertLength; index++) {
	    var insertion = toInsert[index];
	    array.splice(insertion.index, 0, insertion.value);
	  }
	
	  // apply modifications
	  var toModifyLength = toModify.length;
	  var child;
	  if (toModifyLength > 0) {
	    for (index = 0; index < toModifyLength; index++) {
	      var modification = toModify[index];
	      child = new PatchContext(context.left[modification.index], modification.delta);
	      context.push(child, modification.index);
	    }
	  }
	
	  if (!context.children) {
	    context.setResult(context.left).exit();
	    return;
	  }
	  context.exit();
	};
	patchFilter.filterName = 'arrays';
	
	var collectChildrenPatchFilter = function collectChildrenPatchFilter(context) {
	  if (!context || !context.children) {
	    return;
	  }
	  if (context.delta._t !== 'a') {
	    return;
	  }
	  var length = context.children.length;
	  var child;
	  for (var index = 0; index < length; index++) {
	    child = context.children[index];
	    context.left[child.childName] = child.result;
	  }
	  context.setResult(context.left).exit();
	};
	collectChildrenPatchFilter.filterName = 'arraysCollectChildren';
	
	var reverseFilter = function arraysReverseFilter(context) {
	  if (!context.nested) {
	    if (context.delta[2] === ARRAY_MOVE) {
	      context.newName = '_' + context.delta[1];
	      context.setResult([context.delta[0], parseInt(context.childName.substr(1), 10), ARRAY_MOVE]).exit();
	    }
	    return;
	  }
	  if (context.delta._t !== 'a') {
	    return;
	  }
	  var name, child;
	  for (name in context.delta) {
	    if (name === '_t') {
	      continue;
	    }
	    child = new ReverseContext(context.delta[name]);
	    context.push(child, name);
	  }
	  context.exit();
	};
	reverseFilter.filterName = 'arrays';
	
	var reverseArrayDeltaIndex = function reverseArrayDeltaIndex(delta, index, itemDelta) {
	  if (typeof index === 'string' && index[0] === '_') {
	    return parseInt(index.substr(1), 10);
	  } else if (isArray(itemDelta) && itemDelta[2] === 0) {
	    return '_' + index;
	  }
	
	  var reverseIndex = +index;
	  for (var deltaIndex in delta) {
	    var deltaItem = delta[deltaIndex];
	    if (isArray(deltaItem)) {
	      if (deltaItem[2] === ARRAY_MOVE) {
	        var moveFromIndex = parseInt(deltaIndex.substr(1), 10);
	        var moveToIndex = deltaItem[1];
	        if (moveToIndex === +index) {
	          return moveFromIndex;
	        }
	        if (moveFromIndex <= reverseIndex && moveToIndex > reverseIndex) {
	          reverseIndex++;
	        } else if (moveFromIndex >= reverseIndex && moveToIndex < reverseIndex) {
	          reverseIndex--;
	        }
	      } else if (deltaItem[2] === 0) {
	        var deleteIndex = parseInt(deltaIndex.substr(1), 10);
	        if (deleteIndex <= reverseIndex) {
	          reverseIndex++;
	        }
	      } else if (deltaItem.length === 1 && deltaIndex <= reverseIndex) {
	        reverseIndex--;
	      }
	    }
	  }
	
	  return reverseIndex;
	};
	
	var collectChildrenReverseFilter = function collectChildrenReverseFilter(context) {
	  if (!context || !context.children) {
	    return;
	  }
	  if (context.delta._t !== 'a') {
	    return;
	  }
	  var length = context.children.length;
	  var child;
	  var delta = {
	    _t: 'a'
	  };
	
	  for (var index = 0; index < length; index++) {
	    child = context.children[index];
	    var name = child.newName;
	    if (typeof name === 'undefined') {
	      name = reverseArrayDeltaIndex(context.delta, child.childName, child.result);
	    }
	    if (delta[name] !== child.result) {
	      delta[name] = child.result;
	    }
	  }
	  context.setResult(delta).exit();
	};
	collectChildrenReverseFilter.filterName = 'arraysCollectChildren';
	
	exports.diffFilter = diffFilter;
	exports.patchFilter = patchFilter;
	exports.collectChildrenPatchFilter = collectChildrenPatchFilter;
	exports.reverseFilter = reverseFilter;
	exports.collectChildrenReverseFilter = collectChildrenReverseFilter;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var diffFilter = function datesDiffFilter(context) {
	  if (context.left instanceof Date) {
	    if (context.right instanceof Date) {
	      if (context.left.getTime() !== context.right.getTime()) {
	        context.setResult([context.left, context.right]);
	      } else {
	        context.setResult(undefined);
	      }
	    } else {
	      context.setResult([context.left, context.right]);
	    }
	    context.exit();
	  } else if (context.right instanceof Date) {
	    context.setResult([context.left, context.right]).exit();
	  }
	};
	diffFilter.filterName = 'dates';
	
	exports.diffFilter = diffFilter;

/***/ },
/* 24 */
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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DiffContext = __webpack_require__(19).DiffContext;
	var PatchContext = __webpack_require__(20).PatchContext;
	var ReverseContext = __webpack_require__(21).ReverseContext;
	
	var collectChildrenDiffFilter = function collectChildrenDiffFilter(context) {
	  if (!context || !context.children) {
	    return;
	  }
	  var length = context.children.length;
	  var child;
	  var result = context.result;
	  for (var index = 0; index < length; index++) {
	    child = context.children[index];
	    if (typeof child.result === 'undefined') {
	      continue;
	    }
	    result = result || {};
	    result[child.childName] = child.result;
	  }
	  if (result && context.leftIsArray) {
	    result._t = 'a';
	  }
	  context.setResult(result).exit();
	};
	collectChildrenDiffFilter.filterName = 'collectChildren';
	
	var objectsDiffFilter = function objectsDiffFilter(context) {
	  if (context.leftIsArray || context.leftType !== 'object') {
	    return;
	  }
	
	  var name, child;
	  for (name in context.left) {
	    child = new DiffContext(context.left[name], context.right[name]);
	    context.push(child, name);
	  }
	  for (name in context.right) {
	    if (typeof context.left[name] === 'undefined') {
	      child = new DiffContext(undefined, context.right[name]);
	      context.push(child, name);
	    }
	  }
	
	  if (!context.children || context.children.length === 0) {
	    context.setResult(undefined).exit();
	    return;
	  }
	  context.exit();
	};
	objectsDiffFilter.filterName = 'objects';
	
	var patchFilter = function nestedPatchFilter(context) {
	  if (!context.nested) {
	    return;
	  }
	  if (context.delta._t) {
	    return;
	  }
	  var name, child;
	  for (name in context.delta) {
	    child = new PatchContext(context.left[name], context.delta[name]);
	    context.push(child, name);
	  }
	  context.exit();
	};
	patchFilter.filterName = 'objects';
	
	var collectChildrenPatchFilter = function collectChildrenPatchFilter(context) {
	  if (!context || !context.children) {
	    return;
	  }
	  if (context.delta._t) {
	    return;
	  }
	  var length = context.children.length;
	  var child;
	  for (var index = 0; index < length; index++) {
	    child = context.children[index];
	    if (context.left.hasOwnProperty(child.childName) && child.result === undefined) {
	      delete context.left[child.childName];
	    } else if (context.left[child.childName] !== child.result) {
	      context.left[child.childName] = child.result;
	    }
	  }
	  context.setResult(context.left).exit();
	};
	collectChildrenPatchFilter.filterName = 'collectChildren';
	
	var reverseFilter = function nestedReverseFilter(context) {
	  if (!context.nested) {
	    return;
	  }
	  if (context.delta._t) {
	    return;
	  }
	  var name, child;
	  for (name in context.delta) {
	    child = new ReverseContext(context.delta[name]);
	    context.push(child, name);
	  }
	  context.exit();
	};
	reverseFilter.filterName = 'objects';
	
	var collectChildrenReverseFilter = function collectChildrenReverseFilter(context) {
	  if (!context || !context.children) {
	    return;
	  }
	  if (context.delta._t) {
	    return;
	  }
	  var length = context.children.length;
	  var child;
	  var delta = {};
	  for (var index = 0; index < length; index++) {
	    child = context.children[index];
	    if (delta[child.childName] !== child.result) {
	      delta[child.childName] = child.result;
	    }
	  }
	  context.setResult(delta).exit();
	};
	collectChildrenReverseFilter.filterName = 'collectChildren';
	
	exports.collectChildrenDiffFilter = collectChildrenDiffFilter;
	exports.objectsDiffFilter = objectsDiffFilter;
	exports.patchFilter = patchFilter;
	exports.collectChildrenPatchFilter = collectChildrenPatchFilter;
	exports.reverseFilter = reverseFilter;
	exports.collectChildrenReverseFilter = collectChildrenReverseFilter;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* global diff_match_patch */
	'use strict';
	
	var TEXT_DIFF = 2;
	var DEFAULT_MIN_LENGTH = 60;
	var cachedDiffPatch = null;
	
	var getDiffMatchPatch = function getDiffMatchPatch() {
	  /*jshint camelcase: false */
	
	  if (!cachedDiffPatch) {
	    var instance;
	    if (typeof diff_match_patch !== 'undefined') {
	      // already loaded, probably a browser
	      instance = typeof diff_match_patch === 'function' ? new diff_match_patch() : new diff_match_patch.diff_match_patch();
	    } else if (true) {
	      try {
	        var dmpModuleName = 'diff_match_patch_uncompressed';
	        var dmp = __webpack_require__(38)("./" + dmpModuleName);
	        instance = new dmp.diff_match_patch();
	      } catch (err) {
	        instance = null;
	      }
	    }
	    if (!instance) {
	      var error = new Error('text diff_match_patch library not found');
	      error.diff_match_patch_not_found = true;
	      throw error;
	    }
	    cachedDiffPatch = {
	      diff: function diff(txt1, txt2) {
	        return instance.patch_toText(instance.patch_make(txt1, txt2));
	      },
	      patch: function patch(txt1, _patch) {
	        var results = instance.patch_apply(instance.patch_fromText(_patch), txt1);
	        for (var i = 0; i < results[1].length; i++) {
	          if (!results[1][i]) {
	            var error = new Error('text patch failed');
	            error.textPatchFailed = true;
	          }
	        }
	        return results[0];
	      }
	    };
	  }
	  return cachedDiffPatch;
	};
	
	var diffFilter = function textsDiffFilter(context) {
	  if (context.leftType !== 'string') {
	    return;
	  }
	  var minLength = context.options && context.options.textDiff && context.options.textDiff.minLength || DEFAULT_MIN_LENGTH;
	  if (context.left.length < minLength || context.right.length < minLength) {
	    context.setResult([context.left, context.right]).exit();
	    return;
	  }
	  // large text, use a text-diff algorithm
	  var diff = getDiffMatchPatch().diff;
	  context.setResult([diff(context.left, context.right), 0, TEXT_DIFF]).exit();
	};
	diffFilter.filterName = 'texts';
	
	var patchFilter = function textsPatchFilter(context) {
	  if (context.nested) {
	    return;
	  }
	  if (context.delta[2] !== TEXT_DIFF) {
	    return;
	  }
	
	  // text-diff, use a text-patch algorithm
	  var patch = getDiffMatchPatch().patch;
	  context.setResult(patch(context.left, context.delta[0])).exit();
	};
	patchFilter.filterName = 'texts';
	
	var textDeltaReverse = function textDeltaReverse(delta) {
	  var i,
	      l,
	      lines,
	      line,
	      lineTmp,
	      header = null,
	      headerRegex = /^@@ +\-(\d+),(\d+) +\+(\d+),(\d+) +@@$/,
	      lineHeader,
	      lineAdd,
	      lineRemove;
	  lines = delta.split('\n');
	  for (i = 0, l = lines.length; i < l; i++) {
	    line = lines[i];
	    var lineStart = line.slice(0, 1);
	    if (lineStart === '@') {
	      header = headerRegex.exec(line);
	      lineHeader = i;
	      lineAdd = null;
	      lineRemove = null;
	
	      // fix header
	      lines[lineHeader] = '@@ -' + header[3] + ',' + header[4] + ' +' + header[1] + ',' + header[2] + ' @@';
	    } else if (lineStart === '+') {
	      lineAdd = i;
	      lines[i] = '-' + lines[i].slice(1);
	      if (lines[i - 1].slice(0, 1) === '+') {
	        // swap lines to keep default order (-+)
	        lineTmp = lines[i];
	        lines[i] = lines[i - 1];
	        lines[i - 1] = lineTmp;
	      }
	    } else if (lineStart === '-') {
	      lineRemove = i;
	      lines[i] = '+' + lines[i].slice(1);
	    }
	  }
	  return lines.join('\n');
	};
	
	var reverseFilter = function textsReverseFilter(context) {
	  if (context.nested) {
	    return;
	  }
	  if (context.delta[2] !== TEXT_DIFF) {
	    return;
	  }
	
	  // text-diff, use a text-diff algorithm
	  context.setResult([textDeltaReverse(context.delta[0]), 0, TEXT_DIFF]).exit();
	};
	reverseFilter.filterName = 'texts';
	
	exports.diffFilter = diffFilter;
	exports.patchFilter = patchFilter;
	exports.reverseFilter = reverseFilter;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isArray = typeof Array.isArray === 'function' ?
	// use native function
	Array.isArray :
	// use instanceof operator
	function (a) {
	  return a instanceof Array;
	};
	
	var diffFilter = function trivialMatchesDiffFilter(context) {
	  if (context.left === context.right) {
	    context.setResult(undefined).exit();
	    return;
	  }
	  if (typeof context.left === 'undefined') {
	    if (typeof context.right === 'function') {
	      throw new Error('functions are not supported');
	    }
	    context.setResult([context.right]).exit();
	    return;
	  }
	  if (typeof context.right === 'undefined') {
	    context.setResult([context.left, 0, 0]).exit();
	    return;
	  }
	  if (typeof context.left === 'function' || typeof context.right === 'function') {
	    throw new Error('functions are not supported');
	  }
	  context.leftType = context.left === null ? 'null' : typeof context.left;
	  context.rightType = context.right === null ? 'null' : typeof context.right;
	  if (context.leftType !== context.rightType) {
	    context.setResult([context.left, context.right]).exit();
	    return;
	  }
	  if (context.leftType === 'boolean' || context.leftType === 'number') {
	    context.setResult([context.left, context.right]).exit();
	    return;
	  }
	  if (context.leftType === 'object') {
	    context.leftIsArray = isArray(context.left);
	  }
	  if (context.rightType === 'object') {
	    context.rightIsArray = isArray(context.right);
	  }
	  if (context.leftIsArray !== context.rightIsArray) {
	    context.setResult([context.left, context.right]).exit();
	    return;
	  }
	};
	diffFilter.filterName = 'trivial';
	
	var patchFilter = function trivialMatchesPatchFilter(context) {
	  if (typeof context.delta === 'undefined') {
	    context.setResult(context.left).exit();
	    return;
	  }
	  context.nested = !isArray(context.delta);
	  if (context.nested) {
	    return;
	  }
	  if (context.delta.length === 1) {
	    context.setResult(context.delta[0]).exit();
	    return;
	  }
	  if (context.delta.length === 2) {
	    context.setResult(context.delta[1]).exit();
	    return;
	  }
	  if (context.delta.length === 3 && context.delta[2] === 0) {
	    context.setResult(undefined).exit();
	    return;
	  }
	};
	patchFilter.filterName = 'trivial';
	
	var reverseFilter = function trivialReferseFilter(context) {
	  if (typeof context.delta === 'undefined') {
	    context.setResult(context.delta).exit();
	    return;
	  }
	  context.nested = !isArray(context.delta);
	  if (context.nested) {
	    return;
	  }
	  if (context.delta.length === 1) {
	    context.setResult([context.delta[0], 0, 0]).exit();
	    return;
	  }
	  if (context.delta.length === 2) {
	    context.setResult([context.delta[1], context.delta[0]]).exit();
	    return;
	  }
	  if (context.delta.length === 3 && context.delta[2] === 0) {
	    context.setResult([context.delta[0]]).exit();
	    return;
	  }
	};
	reverseFilter.filterName = 'trivial';
	
	exports.diffFilter = diffFilter;
	exports.patchFilter = patchFilter;
	exports.reverseFilter = reverseFilter;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var base = __webpack_require__(29);
	var BaseFormatter = base.BaseFormatter;
	
	var AnnotatedFormatter = function AnnotatedFormatter() {
	  this.includeMoveDestinations = false;
	};
	
	AnnotatedFormatter.prototype = new BaseFormatter();
	
	AnnotatedFormatter.prototype.prepareContext = function (context) {
	  BaseFormatter.prototype.prepareContext.call(this, context);
	  context.indent = function (levels) {
	    this.indentLevel = (this.indentLevel || 0) + (typeof levels === 'undefined' ? 1 : levels);
	    this.indentPad = new Array(this.indentLevel + 1).join('&nbsp;&nbsp;');
	  };
	  context.row = function (json, htmlNote) {
	    context.out('<tr><td style="white-space: nowrap;">' + '<pre class="jsondiffpatch-annotated-indent" style="display: inline-block">');
	    context.out(context.indentPad);
	    context.out('</pre><pre style="display: inline-block">');
	    context.out(json);
	    context.out('</pre></td><td class="jsondiffpatch-delta-note"><div>');
	    context.out(htmlNote);
	    context.out('</div></td></tr>');
	  };
	};
	
	AnnotatedFormatter.prototype.typeFormattterErrorFormatter = function (context, err) {
	  context.row('', '<pre class="jsondiffpatch-error">' + err + '</pre>');
	};
	
	AnnotatedFormatter.prototype.formatTextDiffString = function (context, value) {
	  var lines = this.parseTextDiff(value);
	  context.out('<ul class="jsondiffpatch-textdiff">');
	  for (var i = 0, l = lines.length; i < l; i++) {
	    var line = lines[i];
	    context.out('<li>' + '<div class="jsondiffpatch-textdiff-location">' + '<span class="jsondiffpatch-textdiff-line-number">' + line.location.line + '</span>' + '<span class="jsondiffpatch-textdiff-char">' + line.location.chr + '</span>' + '</div>' + '<div class="jsondiffpatch-textdiff-line">');
	    var pieces = line.pieces;
	    for (var pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
	      var piece = pieces[pieceIndex];
	      context.out('<span class="jsondiffpatch-textdiff-' + piece.type + '">' + piece.text + '</span>');
	    }
	    context.out('</div></li>');
	  }
	  context.out('</ul>');
	};
	
	AnnotatedFormatter.prototype.rootBegin = function (context, type, nodeType) {
	  context.out('<table class="jsondiffpatch-annotated-delta">');
	  if (type === 'node') {
	    context.row('{');
	    context.indent();
	  }
	  if (nodeType === 'array') {
	    context.row('"_t": "a",', 'Array delta (member names indicate array indices)');
	  }
	};
	
	AnnotatedFormatter.prototype.rootEnd = function (context, type) {
	  if (type === 'node') {
	    context.indent(-1);
	    context.row('}');
	  }
	  context.out('</table>');
	};
	
	AnnotatedFormatter.prototype.nodeBegin = function (context, key, leftKey, type, nodeType) {
	  context.row('&quot;' + key + '&quot;: {');
	  if (type === 'node') {
	    context.indent();
	  }
	  if (nodeType === 'array') {
	    context.row('"_t": "a",', 'Array delta (member names indicate array indices)');
	  }
	};
	
	AnnotatedFormatter.prototype.nodeEnd = function (context, key, leftKey, type, nodeType, isLast) {
	  if (type === 'node') {
	    context.indent(-1);
	  }
	  context.row('}' + (isLast ? '' : ','));
	};
	
	/* jshint camelcase: false */
	
	AnnotatedFormatter.prototype.format_unchanged = function () {
	  return;
	};
	
	AnnotatedFormatter.prototype.format_movedestination = function () {
	  return;
	};
	
	AnnotatedFormatter.prototype.format_node = function (context, delta, left) {
	  // recurse
	  this.formatDeltaChildren(context, delta, left);
	};
	
	var wrapPropertyName = function wrapPropertyName(name) {
	  return '<pre style="display:inline-block">&quot;' + name + '&quot;</pre>';
	};
	
	var deltaAnnotations = {
	  added: function added(delta, left, key, leftKey) {
	    var formatLegend = ' <pre>([newValue])</pre>';
	    if (typeof leftKey === 'undefined') {
	      return 'new value' + formatLegend;
	    }
	    if (typeof leftKey === 'number') {
	      return 'insert at index ' + leftKey + formatLegend;
	    }
	    return 'add property ' + wrapPropertyName(leftKey) + formatLegend;
	  },
	  modified: function modified(delta, left, key, leftKey) {
	    var formatLegend = ' <pre>([previousValue, newValue])</pre>';
	    if (typeof leftKey === 'undefined') {
	      return 'modify value' + formatLegend;
	    }
	    if (typeof leftKey === 'number') {
	      return 'modify at index ' + leftKey + formatLegend;
	    }
	    return 'modify property ' + wrapPropertyName(leftKey) + formatLegend;
	  },
	  deleted: function deleted(delta, left, key, leftKey) {
	    var formatLegend = ' <pre>([previousValue, 0, 0])</pre>';
	    if (typeof leftKey === 'undefined') {
	      return 'delete value' + formatLegend;
	    }
	    if (typeof leftKey === 'number') {
	      return 'remove index ' + leftKey + formatLegend;
	    }
	    return 'delete property ' + wrapPropertyName(leftKey) + formatLegend;
	  },
	  moved: function moved(delta, left, key, leftKey) {
	    return 'move from <span title="(position to remove at original state)">index ' + leftKey + '</span> to ' + '<span title="(position to insert at final state)">index ' + delta[1] + '</span>';
	  },
	  textdiff: function textdiff(delta, left, key, leftKey) {
	    var location = typeof leftKey === 'undefined' ? '' : typeof leftKey === 'number' ? ' at index ' + leftKey : ' at property ' + wrapPropertyName(leftKey);
	    return 'text diff' + location + ', format is ' + '<a href="https://code.google.com/p/google-diff-match-patch/wiki/Unidiff">' + 'a variation of Unidiff</a>';
	  }
	};
	
	var formatAnyChange = function formatAnyChange(context, delta) {
	  var deltaType = this.getDeltaType(delta);
	  var annotator = deltaAnnotations[deltaType];
	  var htmlNote = annotator && annotator.apply(annotator, Array.prototype.slice.call(arguments, 1));
	  var json = JSON.stringify(delta, null, 2);
	  if (deltaType === 'textdiff') {
	    // split text diffs lines
	    json = json.split('\\n').join('\\n"+\n   "');
	  }
	  context.indent();
	  context.row(json, htmlNote);
	  context.indent(-1);
	};
	
	AnnotatedFormatter.prototype.format_added = formatAnyChange;
	AnnotatedFormatter.prototype.format_modified = formatAnyChange;
	AnnotatedFormatter.prototype.format_deleted = formatAnyChange;
	AnnotatedFormatter.prototype.format_moved = formatAnyChange;
	AnnotatedFormatter.prototype.format_textdiff = formatAnyChange;
	
	/* jshint camelcase: true */
	
	exports.AnnotatedFormatter = AnnotatedFormatter;
	
	var defaultInstance;
	
	exports.format = function (delta, left) {
	  if (!defaultInstance) {
	    defaultInstance = new AnnotatedFormatter();
	  }
	  return defaultInstance.format(delta, left);
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isArray = typeof Array.isArray === 'function' ?
	// use native function
	Array.isArray :
	// use instanceof operator
	function (a) {
	  return a instanceof Array;
	};
	
	var getObjectKeys = typeof Object.keys === 'function' ? function (obj) {
	  return Object.keys(obj);
	} : function (obj) {
	  var names = [];
	  for (var property in obj) {
	    if (obj.hasOwnProperty(property)) {
	      names.push(property);
	    }
	  }
	  return names;
	};
	
	var trimUnderscore = function trimUnderscore(str) {
	  if (str.substr(0, 1) === '_') {
	    return str.slice(1);
	  }
	  return str;
	};
	
	var arrayKeyToSortNumber = function arrayKeyToSortNumber(key) {
	  if (key === '_t') {
	    return -1;
	  } else {
	    if (key.substr(0, 1) === '_') {
	      return parseInt(key.slice(1), 10);
	    } else {
	      return parseInt(key, 10) + 0.1;
	    }
	  }
	};
	
	var arrayKeyComparer = function arrayKeyComparer(key1, key2) {
	  return arrayKeyToSortNumber(key1) - arrayKeyToSortNumber(key2);
	};
	
	var BaseFormatter = function BaseFormatter() {};
	
	BaseFormatter.prototype.format = function (delta, left) {
	  var context = {};
	  this.prepareContext(context);
	  this.recurse(context, delta, left);
	  return this.finalize(context);
	};
	
	BaseFormatter.prototype.prepareContext = function (context) {
	  context.buffer = [];
	  context.out = function () {
	    this.buffer.push.apply(this.buffer, arguments);
	  };
	};
	
	BaseFormatter.prototype.typeFormattterNotFound = function (context, deltaType) {
	  throw new Error('cannot format delta type: ' + deltaType);
	};
	
	BaseFormatter.prototype.typeFormattterErrorFormatter = function (context, err) {
	  return err.toString();
	};
	
	BaseFormatter.prototype.finalize = function (context) {
	  if (isArray(context.buffer)) {
	    return context.buffer.join('');
	  }
	};
	
	BaseFormatter.prototype.recurse = function (context, delta, left, key, leftKey, movedFrom, isLast) {
	
	  var useMoveOriginHere = delta && movedFrom;
	  var leftValue = useMoveOriginHere ? movedFrom.value : left;
	
	  if (typeof delta === 'undefined' && typeof key === 'undefined') {
	    return undefined;
	  }
	
	  var type = this.getDeltaType(delta, movedFrom);
	  var nodeType = type === 'node' ? delta._t === 'a' ? 'array' : 'object' : '';
	
	  if (typeof key !== 'undefined') {
	    this.nodeBegin(context, key, leftKey, type, nodeType, isLast);
	  } else {
	    this.rootBegin(context, type, nodeType);
	  }
	
	  var typeFormattter;
	  try {
	    typeFormattter = this['format_' + type] || this.typeFormattterNotFound(context, type);
	    typeFormattter.call(this, context, delta, leftValue, key, leftKey, movedFrom);
	  } catch (err) {
	    this.typeFormattterErrorFormatter(context, err, delta, leftValue, key, leftKey, movedFrom);
	    if (typeof console !== 'undefined' && console.error) {
	      console.error(err.stack);
	    }
	  }
	
	  if (typeof key !== 'undefined') {
	    this.nodeEnd(context, key, leftKey, type, nodeType, isLast);
	  } else {
	    this.rootEnd(context, type, nodeType);
	  }
	};
	
	BaseFormatter.prototype.formatDeltaChildren = function (context, delta, left) {
	  var self = this;
	  this.forEachDeltaKey(delta, left, function (key, leftKey, movedFrom, isLast) {
	    self.recurse(context, delta[key], left ? left[leftKey] : undefined, key, leftKey, movedFrom, isLast);
	  });
	};
	
	BaseFormatter.prototype.forEachDeltaKey = function (delta, left, fn) {
	  var keys = getObjectKeys(delta);
	  var arrayKeys = delta._t === 'a';
	  var moveDestinations = {};
	  var name;
	  if (typeof left !== 'undefined') {
	    for (name in left) {
	      if (typeof delta[name] === 'undefined' && (!arrayKeys || typeof delta['_' + name] === 'undefined')) {
	        keys.push(name);
	      }
	    }
	  }
	  // look for move destinations
	  for (name in delta) {
	    var value = delta[name];
	    if (isArray(value) && value[2] === 3) {
	      moveDestinations[value[1].toString()] = {
	        key: name,
	        value: left[parseInt(name.substr(1))]
	      };
	      if (this.includeMoveDestinations !== false) {
	        if (typeof left === 'undefined' && typeof delta[value[1]] === 'undefined') {
	          keys.push(value[1].toString());
	        }
	      }
	    }
	  }
	  if (arrayKeys) {
	    keys.sort(arrayKeyComparer);
	  } else {
	    keys.sort();
	  }
	  for (var index = 0, length = keys.length; index < length; index++) {
	    var key = keys[index];
	    if (arrayKeys && key === '_t') {
	      continue;
	    }
	    var leftKey = arrayKeys ? typeof key === 'number' ? key : parseInt(trimUnderscore(key), 10) : key;
	    var isLast = index === length - 1;
	    fn(key, leftKey, moveDestinations[leftKey], isLast);
	  }
	};
	
	BaseFormatter.prototype.getDeltaType = function (delta, movedFrom) {
	  if (typeof delta === 'undefined') {
	    if (typeof movedFrom !== 'undefined') {
	      return 'movedestination';
	    }
	    return 'unchanged';
	  }
	  if (isArray(delta)) {
	    if (delta.length === 1) {
	      return 'added';
	    }
	    if (delta.length === 2) {
	      return 'modified';
	    }
	    if (delta.length === 3 && delta[2] === 0) {
	      return 'deleted';
	    }
	    if (delta.length === 3 && delta[2] === 2) {
	      return 'textdiff';
	    }
	    if (delta.length === 3 && delta[2] === 3) {
	      return 'moved';
	    }
	  } else if (typeof delta === 'object') {
	    return 'node';
	  }
	  return 'unknown';
	};
	
	BaseFormatter.prototype.parseTextDiff = function (value) {
	  var output = [];
	  var lines = value.split('\n@@ ');
	  for (var i = 0, l = lines.length; i < l; i++) {
	    var line = lines[i];
	    var lineOutput = {
	      pieces: []
	    };
	    var location = /^(?:@@ )?[-+]?(\d+),(\d+)/.exec(line).slice(1);
	    lineOutput.location = {
	      line: location[0],
	      chr: location[1]
	    };
	    var pieces = line.split('\n').slice(1);
	    for (var pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
	      var piece = pieces[pieceIndex];
	      if (!piece.length) {
	        continue;
	      }
	      var pieceOutput = {
	        type: 'context'
	      };
	      if (piece.substr(0, 1) === '+') {
	        pieceOutput.type = 'added';
	      } else if (piece.substr(0, 1) === '-') {
	        pieceOutput.type = 'deleted';
	      }
	      pieceOutput.text = piece.slice(1);
	      lineOutput.pieces.push(pieceOutput);
	    }
	    output.push(lineOutput);
	  }
	  return output;
	};
	
	exports.BaseFormatter = BaseFormatter;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var chalk = __webpack_require__(40);
	var base = __webpack_require__(29);
	var BaseFormatter = base.BaseFormatter;
	
	var colors = {
	  added: chalk.green,
	  deleted: chalk.red,
	  movedestination: chalk.gray,
	  moved: chalk.yellow,
	  unchanged: chalk.gray,
	  error: chalk.white.bgRed,
	  textDiffLine: chalk.gray
	};
	
	var ConsoleFormatter = function ConsoleFormatter() {
	  this.includeMoveDestinations = false;
	};
	
	ConsoleFormatter.prototype = new BaseFormatter();
	
	ConsoleFormatter.prototype.prepareContext = function (context) {
	  BaseFormatter.prototype.prepareContext.call(this, context);
	  context.indent = function (levels) {
	    this.indentLevel = (this.indentLevel || 0) + (typeof levels === 'undefined' ? 1 : levels);
	    this.indentPad = new Array(this.indentLevel + 1).join('  ');
	    this.outLine();
	  };
	  context.outLine = function () {
	    this.buffer.push('\n' + (this.indentPad || ''));
	  };
	  context.out = function () {
	    for (var i = 0, l = arguments.length; i < l; i++) {
	      var lines = arguments[i].split('\n');
	      var text = lines.join('\n' + (this.indentPad || ''));
	      if (this.color && this.color[0]) {
	        text = this.color[0](text);
	      }
	      this.buffer.push(text);
	    }
	  };
	  context.pushColor = function (color) {
	    this.color = this.color || [];
	    this.color.unshift(color);
	  };
	  context.popColor = function () {
	    this.color = this.color || [];
	    this.color.shift();
	  };
	};
	
	ConsoleFormatter.prototype.typeFormattterErrorFormatter = function (context, err) {
	  context.pushColor(colors.error);
	  context.out('[ERROR]' + err);
	  context.popColor();
	};
	
	ConsoleFormatter.prototype.formatValue = function (context, value) {
	  context.out(JSON.stringify(value, null, 2));
	};
	
	ConsoleFormatter.prototype.formatTextDiffString = function (context, value) {
	  var lines = this.parseTextDiff(value);
	  context.indent();
	  for (var i = 0, l = lines.length; i < l; i++) {
	    var line = lines[i];
	    context.pushColor(colors.textDiffLine);
	    context.out(line.location.line + ',' + line.location.chr + ' ');
	    context.popColor();
	    var pieces = line.pieces;
	    for (var pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
	      var piece = pieces[pieceIndex];
	      context.pushColor(colors[piece.type]);
	      context.out(piece.text);
	      context.popColor();
	    }
	    if (i < l - 1) {
	      context.outLine();
	    }
	  }
	  context.indent(-1);
	};
	
	ConsoleFormatter.prototype.rootBegin = function (context, type, nodeType) {
	  context.pushColor(colors[type]);
	  if (type === 'node') {
	    context.out(nodeType === 'array' ? '[' : '{');
	    context.indent();
	  }
	};
	
	ConsoleFormatter.prototype.rootEnd = function (context, type, nodeType) {
	  if (type === 'node') {
	    context.indent(-1);
	    context.out(nodeType === 'array' ? ']' : '}');
	  }
	  context.popColor();
	};
	
	ConsoleFormatter.prototype.nodeBegin = function (context, key, leftKey, type, nodeType) {
	  context.pushColor(colors[type]);
	  context.out(leftKey + ': ');
	  if (type === 'node') {
	    context.out(nodeType === 'array' ? '[' : '{');
	    context.indent();
	  }
	};
	
	ConsoleFormatter.prototype.nodeEnd = function (context, key, leftKey, type, nodeType, isLast) {
	  if (type === 'node') {
	    context.indent(-1);
	    context.out(nodeType === 'array' ? ']' : '}' + (isLast ? '' : ','));
	  }
	  if (!isLast) {
	    context.outLine();
	  }
	  context.popColor();
	};
	
	/* jshint camelcase: false */
	
	ConsoleFormatter.prototype.format_unchanged = function (context, delta, left) {
	  if (typeof left === 'undefined') {
	    return;
	  }
	  this.formatValue(context, left);
	};
	
	ConsoleFormatter.prototype.format_movedestination = function (context, delta, left) {
	  if (typeof left === 'undefined') {
	    return;
	  }
	  this.formatValue(context, left);
	};
	
	ConsoleFormatter.prototype.format_node = function (context, delta, left) {
	  // recurse
	  this.formatDeltaChildren(context, delta, left);
	};
	
	ConsoleFormatter.prototype.format_added = function (context, delta) {
	  this.formatValue(context, delta[0]);
	};
	
	ConsoleFormatter.prototype.format_modified = function (context, delta) {
	  context.pushColor(colors.deleted);
	  this.formatValue(context, delta[0]);
	  context.popColor();
	  context.out(' => ');
	  context.pushColor(colors.added);
	  this.formatValue(context, delta[1]);
	  context.popColor();
	};
	
	ConsoleFormatter.prototype.format_deleted = function (context, delta) {
	  this.formatValue(context, delta[0]);
	};
	
	ConsoleFormatter.prototype.format_moved = function (context, delta) {
	  context.out('==> ' + delta[1]);
	};
	
	ConsoleFormatter.prototype.format_textdiff = function (context, delta) {
	  this.formatTextDiffString(context, delta[0]);
	};
	
	/* jshint camelcase: true */
	
	exports.ConsoleFormatter = ConsoleFormatter;
	
	var defaultInstance;
	
	var format = function format(delta, left) {
	  if (!defaultInstance) {
	    defaultInstance = new ConsoleFormatter();
	  }
	  return defaultInstance.format(delta, left);
	};
	
	exports.log = function (delta, left) {
	  console.log(format(delta, left));
	};
	
	exports.format = format;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var base = __webpack_require__(29);
	var BaseFormatter = base.BaseFormatter;
	
	var HtmlFormatter = function HtmlFormatter() {};
	
	HtmlFormatter.prototype = new BaseFormatter();
	
	HtmlFormatter.prototype.typeFormattterErrorFormatter = function (context, err) {
	  context.out('<pre class="jsondiffpatch-error">' + err + '</pre>');
	};
	
	HtmlFormatter.prototype.formatValue = function (context, value) {
	  context.out('<pre>' + JSON.stringify(value, null, 2) + '</pre>');
	};
	
	HtmlFormatter.prototype.formatTextDiffString = function (context, value) {
	  var lines = this.parseTextDiff(value);
	  context.out('<ul class="jsondiffpatch-textdiff">');
	  for (var i = 0, l = lines.length; i < l; i++) {
	    var line = lines[i];
	    context.out('<li>' + '<div class="jsondiffpatch-textdiff-location">' + '<span class="jsondiffpatch-textdiff-line-number">' + line.location.line + '</span>' + '<span class="jsondiffpatch-textdiff-char">' + line.location.chr + '</span>' + '</div>' + '<div class="jsondiffpatch-textdiff-line">');
	    var pieces = line.pieces;
	    for (var pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
	      var piece = pieces[pieceIndex];
	      context.out('<span class="jsondiffpatch-textdiff-' + piece.type + '">' + piece.text + '</span>');
	    }
	    context.out('</div></li>');
	  }
	  context.out('</ul>');
	};
	
	var adjustArrows = function jsondiffpatchHtmlFormatterAdjustArrows(node) {
	  node = node || document;
	  var getElementText = function getElementText(el) {
	    return el.textContent || el.innerText;
	  };
	  var eachByQuery = function eachByQuery(el, query, fn) {
	    var elems = el.querySelectorAll(query);
	    for (var i = 0, l = elems.length; i < l; i++) {
	      fn(elems[i]);
	    }
	  };
	  var eachChildren = function eachChildren(el, fn) {
	    for (var i = 0, l = el.children.length; i < l; i++) {
	      fn(el.children[i], i);
	    }
	  };
	  eachByQuery(node, '.jsondiffpatch-arrow', function (arrow) {
	    var arrowParent = arrow.parentNode;
	    var svg = arrow.children[0],
	        path = svg.children[1];
	    svg.style.display = 'none';
	    var destination = getElementText(arrowParent.querySelector('.jsondiffpatch-moved-destination'));
	    var container = arrowParent.parentNode;
	    var destinationElem;
	    eachChildren(container, function (child) {
	      if (child.getAttribute('data-key') === destination) {
	        destinationElem = child;
	      }
	    });
	    if (!destinationElem) {
	      return;
	    }
	    try {
	      var distance = destinationElem.offsetTop - arrowParent.offsetTop;
	      svg.setAttribute('height', Math.abs(distance) + 6);
	      arrow.style.top = -8 + (distance > 0 ? 0 : distance) + 'px';
	      var curve = distance > 0 ? 'M30,0 Q-10,' + Math.round(distance / 2) + ' 26,' + (distance - 4) : 'M30,' + -distance + ' Q-10,' + Math.round(-distance / 2) + ' 26,4';
	      path.setAttribute('d', curve);
	      svg.style.display = '';
	    } catch (err) {
	      return;
	    }
	  });
	};
	
	HtmlFormatter.prototype.rootBegin = function (context, type, nodeType) {
	  var nodeClass = 'jsondiffpatch-' + type + (nodeType ? ' jsondiffpatch-child-node-type-' + nodeType : '');
	  context.out('<div class="jsondiffpatch-delta ' + nodeClass + '">');
	};
	
	HtmlFormatter.prototype.rootEnd = function (context) {
	  context.out('</div>' + (context.hasArrows ? '<script type="text/javascript">setTimeout(' + adjustArrows.toString() + ',10);</script>' : ''));
	};
	
	HtmlFormatter.prototype.nodeBegin = function (context, key, leftKey, type, nodeType) {
	  var nodeClass = 'jsondiffpatch-' + type + (nodeType ? ' jsondiffpatch-child-node-type-' + nodeType : '');
	  context.out('<li class="' + nodeClass + '" data-key="' + leftKey + '">' + '<div class="jsondiffpatch-property-name">' + leftKey + '</div>');
	};
	
	HtmlFormatter.prototype.nodeEnd = function (context) {
	  context.out('</li>');
	};
	
	/* jshint camelcase: false */
	
	HtmlFormatter.prototype.format_unchanged = function (context, delta, left) {
	  if (typeof left === 'undefined') {
	    return;
	  }
	  context.out('<div class="jsondiffpatch-value">');
	  this.formatValue(context, left);
	  context.out('</div>');
	};
	
	HtmlFormatter.prototype.format_movedestination = function (context, delta, left) {
	  if (typeof left === 'undefined') {
	    return;
	  }
	  context.out('<div class="jsondiffpatch-value">');
	  this.formatValue(context, left);
	  context.out('</div>');
	};
	
	HtmlFormatter.prototype.format_node = function (context, delta, left) {
	  // recurse
	  var nodeType = delta._t === 'a' ? 'array' : 'object';
	  context.out('<ul class="jsondiffpatch-node jsondiffpatch-node-type-' + nodeType + '">');
	  this.formatDeltaChildren(context, delta, left);
	  context.out('</ul>');
	};
	
	HtmlFormatter.prototype.format_added = function (context, delta) {
	  context.out('<div class="jsondiffpatch-value">');
	  this.formatValue(context, delta[0]);
	  context.out('</div>');
	};
	
	HtmlFormatter.prototype.format_modified = function (context, delta) {
	  context.out('<div class="jsondiffpatch-value jsondiffpatch-left-value">');
	  this.formatValue(context, delta[0]);
	  context.out('</div>' + '<div class="jsondiffpatch-value jsondiffpatch-right-value">');
	  this.formatValue(context, delta[1]);
	  context.out('</div>');
	};
	
	HtmlFormatter.prototype.format_deleted = function (context, delta) {
	  context.out('<div class="jsondiffpatch-value">');
	  this.formatValue(context, delta[0]);
	  context.out('</div>');
	};
	
	HtmlFormatter.prototype.format_moved = function (context, delta) {
	  context.out('<div class="jsondiffpatch-value">');
	  this.formatValue(context, delta[0]);
	  context.out('</div><div class="jsondiffpatch-moved-destination">' + delta[1] + '</div>');
	
	  // draw an SVG arrow from here to move destination
	  context.out(
	  /*jshint multistr: true */
	  '<div class="jsondiffpatch-arrow" style="position: relative; left: -34px;">        <svg width="30" height="60" style="position: absolute; display: none;">        <defs>            <marker id="markerArrow" markerWidth="8" markerHeight="8" refx="2" refy="4"                   orient="auto" markerUnits="userSpaceOnUse">                <path d="M1,1 L1,7 L7,4 L1,1" style="fill: #339;" />            </marker>        </defs>        <path d="M30,0 Q-10,25 26,50" style="stroke: #88f; stroke-width: 2px; fill: none;        stroke-opacity: 0.5; marker-end: url(#markerArrow);"></path>        </svg>        </div>');
	  context.hasArrows = true;
	};
	
	HtmlFormatter.prototype.format_textdiff = function (context, delta) {
	  context.out('<div class="jsondiffpatch-value">');
	  this.formatTextDiffString(context, delta[0]);
	  context.out('</div>');
	};
	
	/* jshint camelcase: true */
	
	var showUnchanged = function showUnchanged(show, node, delay) {
	  var el = node || document.body;
	  var prefix = 'jsondiffpatch-unchanged-';
	  var classes = {
	    showing: prefix + 'showing',
	    hiding: prefix + 'hiding',
	    visible: prefix + 'visible',
	    hidden: prefix + 'hidden' };
	  var list = el.classList;
	  if (!list) {
	    return;
	  }
	  if (!delay) {
	    list.remove(classes.showing);
	    list.remove(classes.hiding);
	    list.remove(classes.visible);
	    list.remove(classes.hidden);
	    if (show === false) {
	      list.add(classes.hidden);
	    }
	    return;
	  }
	  if (show === false) {
	    list.remove(classes.showing);
	    list.add(classes.visible);
	    setTimeout(function () {
	      list.add(classes.hiding);
	    }, 10);
	  } else {
	    list.remove(classes.hiding);
	    list.add(classes.showing);
	    list.remove(classes.hidden);
	  }
	  var intervalId = setInterval(function () {
	    adjustArrows(el);
	  }, 100);
	  setTimeout(function () {
	    list.remove(classes.showing);
	    list.remove(classes.hiding);
	    if (show === false) {
	      list.add(classes.hidden);
	      list.remove(classes.visible);
	    } else {
	      list.add(classes.visible);
	      list.remove(classes.hidden);
	    }
	    setTimeout(function () {
	      list.remove(classes.visible);
	      clearInterval(intervalId);
	    }, delay + 400);
	  }, delay);
	};
	
	var hideUnchanged = function hideUnchanged(node, delay) {
	  return showUnchanged(false, node, delay);
	};
	
	exports.HtmlFormatter = HtmlFormatter;
	
	exports.showUnchanged = showUnchanged;
	
	exports.hideUnchanged = hideUnchanged;
	
	var defaultInstance;
	
	exports.format = function (delta, left) {
	  if (!defaultInstance) {
	    defaultInstance = new HtmlFormatter();
	  }
	  return defaultInstance.format(delta, left);
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var environment = __webpack_require__(15);
	
	exports.html = __webpack_require__(31);
	exports.annotated = __webpack_require__(28);
	
	if (!environment.isBrowser) {
		var consoleModuleName = './console';
		exports.console = __webpack_require__(37)(consoleModuleName);
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(32);

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var environment = __webpack_require__(15);
	
	if (environment.isBrowser) {
	  /* global window */
	  /* jshint camelcase: false */
	  window.diff_match_patch = __webpack_require__(39);
	  /* jshint camelcase: true */
	}
	
	module.exports = __webpack_require__(13);

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Pipe = function Pipe(name) {
	  this.name = name;
	  this.filters = [];
	};
	
	Pipe.prototype.process = function (input) {
	  if (!this.processor) {
	    throw new Error('add this pipe to a processor before using it');
	  }
	  var debug = this.debug;
	  var length = this.filters.length;
	  var context = input;
	  for (var index = 0; index < length; index++) {
	    var filter = this.filters[index];
	    if (debug) {
	      this.log('filter: ' + filter.filterName);
	    }
	    filter(context);
	    if (typeof context === 'object' && context.exiting) {
	      context.exiting = false;
	      break;
	    }
	  }
	  if (!context.next && this.resultCheck) {
	    this.resultCheck(context);
	  }
	};
	
	Pipe.prototype.log = function (msg) {
	  console.log('[jsondiffpatch] ' + this.name + ' pipe, ' + msg);
	};
	
	Pipe.prototype.append = function () {
	  this.filters.push.apply(this.filters, arguments);
	  return this;
	};
	
	Pipe.prototype.prepend = function () {
	  this.filters.unshift.apply(this.filters, arguments);
	  return this;
	};
	
	Pipe.prototype.indexOf = function (filterName) {
	  if (!filterName) {
	    throw new Error('a filter name is required');
	  }
	  for (var index = 0; index < this.filters.length; index++) {
	    var filter = this.filters[index];
	    if (filter.filterName === filterName) {
	      return index;
	    }
	  }
	  throw new Error('filter not found: ' + filterName);
	};
	
	Pipe.prototype.list = function () {
	  var names = [];
	  for (var index = 0; index < this.filters.length; index++) {
	    var filter = this.filters[index];
	    names.push(filter.filterName);
	  }
	  return names;
	};
	
	Pipe.prototype.after = function (filterName) {
	  var index = this.indexOf(filterName);
	  var params = Array.prototype.slice.call(arguments, 1);
	  if (!params.length) {
	    throw new Error('a filter is required');
	  }
	  params.unshift(index + 1, 0);
	  Array.prototype.splice.apply(this.filters, params);
	  return this;
	};
	
	Pipe.prototype.before = function (filterName) {
	  var index = this.indexOf(filterName);
	  var params = Array.prototype.slice.call(arguments, 1);
	  if (!params.length) {
	    throw new Error('a filter is required');
	  }
	  params.unshift(index, 0);
	  Array.prototype.splice.apply(this.filters, params);
	  return this;
	};
	
	Pipe.prototype.clear = function () {
	  this.filters.length = 0;
	  return this;
	};
	
	Pipe.prototype.shouldHaveResult = function (should) {
	  if (should === false) {
	    this.resultCheck = null;
	    return;
	  }
	  if (this.resultCheck) {
	    return;
	  }
	  var pipe = this;
	  this.resultCheck = function (context) {
	    if (!context.hasResult) {
	      console.log(context);
	      var error = new Error(pipe.name + ' failed');
	      error.noResult = true;
	      throw error;
	    }
	  };
	  return this;
	};
	
	exports.Pipe = Pipe;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Processor = function Processor(options) {
		this.selfOptions = options;
		this.pipes = {};
	};
	
	Processor.prototype.options = function (options) {
		if (options) {
			this.selfOptions = options;
		}
		return this.selfOptions;
	};
	
	Processor.prototype.pipe = function (name, pipe) {
		if (typeof name === 'string') {
			if (typeof pipe === 'undefined') {
				return this.pipes[name];
			} else {
				this.pipes[name] = pipe;
			}
		}
		if (name && name.name) {
			pipe = name;
			if (pipe.processor === this) {
				return pipe;
			}
			this.pipes[pipe.name] = pipe;
		}
		pipe.processor = this;
		return pipe;
	};
	
	Processor.prototype.process = function (input, pipe) {
		var context = input;
		context.options = this.options();
		var nextPipe = pipe || input.pipe || 'default';
		var lastPipe, lastContext;
		while (nextPipe) {
			if (typeof context.nextAfterChildren !== 'undefined') {
				// children processed and coming back to parent
				context.next = context.nextAfterChildren;
				context.nextAfterChildren = null;
			}
	
			if (typeof nextPipe === 'string') {
				nextPipe = this.pipe(nextPipe);
			}
			nextPipe.process(context);
			lastContext = context;
			lastPipe = nextPipe;
			nextPipe = null;
			if (context) {
				if (context.next) {
					context = context.next;
					nextPipe = lastContext.nextPipe || context.pipe || lastPipe;
				}
			}
		}
		return context.hasResult ? context.result : undefined;
	};
	
	exports.Processor = Processor;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./annotated": 28,
		"./annotated.js": 28,
		"./base": 29,
		"./base.js": 29,
		"./console": 30,
		"./console.js": 30,
		"./html": 31,
		"./html.js": 31,
		"./index": 32,
		"./index.js": 32
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 37;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./diff_match_patch_uncompressed": 39,
		"./diff_match_patch_uncompressed.js": 39
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 38;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Diff Match and Patch
	 *
	 * Copyright 2006 Google Inc.
	 * http://code.google.com/p/google-diff-match-patch/
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/**
	 * @fileoverview Computes the difference between two texts to create a patch.
	 * Applies the patch onto another text, allowing for errors.
	 * @author fraser@google.com (Neil Fraser)
	 */
	
	/**
	 * Class containing the diff, match and patch methods.
	 * @constructor
	 */
	'use strict';
	
	function diff_match_patch() {
	
	  // Defaults.
	  // Redefine these in your program to override the defaults.
	
	  // Number of seconds to map a diff before giving up (0 for infinity).
	  this.Diff_Timeout = 1;
	  // Cost of an empty edit operation in terms of edit characters.
	  this.Diff_EditCost = 4;
	  // At what point is no match declared (0.0 = perfection, 1.0 = very loose).
	  this.Match_Threshold = 0.5;
	  // How far to search for a match (0 = exact location, 1000+ = broad match).
	  // A match this many characters away from the expected location will add
	  // 1.0 to the score (0.0 is a perfect match).
	  this.Match_Distance = 1000;
	  // When deleting a large block of text (over ~64 characters), how close does
	  // the contents have to match the expected contents. (0.0 = perfection,
	  // 1.0 = very loose).  Note that Match_Threshold controls how closely the
	  // end points of a delete need to match.
	  this.Patch_DeleteThreshold = 0.5;
	  // Chunk size for context length.
	  this.Patch_Margin = 4;
	
	  // The number of bits in an int.
	  this.Match_MaxBits = 32;
	}
	
	//  DIFF FUNCTIONS
	
	/**
	 * The data structure representing a diff is an array of tuples:
	 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
	 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
	 */
	var DIFF_DELETE = -1;
	var DIFF_INSERT = 1;
	var DIFF_EQUAL = 0;
	
	/** @typedef {!Array.<number|string>} */
	diff_match_patch.Diff;
	
	/**
	 * Find the differences between two texts.  Simplifies the problem by stripping
	 * any common prefix or suffix off the texts before diffing.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {boolean=} opt_checklines Optional speedup flag. If present and false,
	 *     then don't run a line-level diff first to identify the changed areas.
	 *     Defaults to true, which does a faster, slightly less optimal diff.
	 * @param {number} opt_deadline Optional time when the diff should be complete
	 *     by.  Used internally for recursive calls.  Users should set DiffTimeout
	 *     instead.
	 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
	 */
	diff_match_patch.prototype.diff_main = function (text1, text2, opt_checklines, opt_deadline) {
	  // Set a deadline by which time the diff must be complete.
	  if (typeof opt_deadline == 'undefined') {
	    if (this.Diff_Timeout <= 0) {
	      opt_deadline = Number.MAX_VALUE;
	    } else {
	      opt_deadline = new Date().getTime() + this.Diff_Timeout * 1000;
	    }
	  }
	  var deadline = opt_deadline;
	
	  // Check for null inputs.
	  if (text1 == null || text2 == null) {
	    throw new Error('Null input. (diff_main)');
	  }
	
	  // Check for equality (speedup).
	  if (text1 == text2) {
	    if (text1) {
	      return [[DIFF_EQUAL, text1]];
	    }
	    return [];
	  }
	
	  if (typeof opt_checklines == 'undefined') {
	    opt_checklines = true;
	  }
	  var checklines = opt_checklines;
	
	  // Trim off common prefix (speedup).
	  var commonlength = this.diff_commonPrefix(text1, text2);
	  var commonprefix = text1.substring(0, commonlength);
	  text1 = text1.substring(commonlength);
	  text2 = text2.substring(commonlength);
	
	  // Trim off common suffix (speedup).
	  commonlength = this.diff_commonSuffix(text1, text2);
	  var commonsuffix = text1.substring(text1.length - commonlength);
	  text1 = text1.substring(0, text1.length - commonlength);
	  text2 = text2.substring(0, text2.length - commonlength);
	
	  // Compute the diff on the middle block.
	  var diffs = this.diff_compute_(text1, text2, checklines, deadline);
	
	  // Restore the prefix and suffix.
	  if (commonprefix) {
	    diffs.unshift([DIFF_EQUAL, commonprefix]);
	  }
	  if (commonsuffix) {
	    diffs.push([DIFF_EQUAL, commonsuffix]);
	  }
	  this.diff_cleanupMerge(diffs);
	  return diffs;
	};
	
	/**
	 * Find the differences between two texts.  Assumes that the texts do not
	 * have any common prefix or suffix.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {boolean} checklines Speedup flag.  If false, then don't run a
	 *     line-level diff first to identify the changed areas.
	 *     If true, then run a faster, slightly less optimal diff.
	 * @param {number} deadline Time when the diff should be complete by.
	 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
	 * @private
	 */
	diff_match_patch.prototype.diff_compute_ = function (text1, text2, checklines, deadline) {
	  var diffs;
	
	  if (!text1) {
	    // Just add some text (speedup).
	    return [[DIFF_INSERT, text2]];
	  }
	
	  if (!text2) {
	    // Just delete some text (speedup).
	    return [[DIFF_DELETE, text1]];
	  }
	
	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  var i = longtext.indexOf(shorttext);
	  if (i != -1) {
	    // Shorter text is inside the longer text (speedup).
	    diffs = [[DIFF_INSERT, longtext.substring(0, i)], [DIFF_EQUAL, shorttext], [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
	    // Swap insertions for deletions if diff is reversed.
	    if (text1.length > text2.length) {
	      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
	    }
	    return diffs;
	  }
	
	  if (shorttext.length == 1) {
	    // Single character string.
	    // After the previous speedup, the character can't be an equality.
	    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
	  }
	  longtext = shorttext = null; // Garbage collect.
	
	  // Check to see if the problem can be split in two.
	  var hm = this.diff_halfMatch_(text1, text2);
	  if (hm) {
	    // A half-match was found, sort out the return data.
	    var text1_a = hm[0];
	    var text1_b = hm[1];
	    var text2_a = hm[2];
	    var text2_b = hm[3];
	    var mid_common = hm[4];
	    // Send both pairs off for separate processing.
	    var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
	    var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
	    // Merge the results.
	    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
	  }
	
	  if (checklines && text1.length > 100 && text2.length > 100) {
	    return this.diff_lineMode_(text1, text2, deadline);
	  }
	
	  return this.diff_bisect_(text1, text2, deadline);
	};
	
	/**
	 * Do a quick line-level diff on both strings, then rediff the parts for
	 * greater accuracy.
	 * This speedup can produce non-minimal diffs.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {number} deadline Time when the diff should be complete by.
	 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
	 * @private
	 */
	diff_match_patch.prototype.diff_lineMode_ = function (text1, text2, deadline) {
	  // Scan the text on a line-by-line basis first.
	  var a = this.diff_linesToChars_(text1, text2);
	  text1 = a[0];
	  text2 = a[1];
	  var linearray = a[2];
	
	  var diffs = this.diff_bisect_(text1, text2, deadline);
	
	  // Convert the diff back to original text.
	  this.diff_charsToLines_(diffs, linearray);
	  // Eliminate freak matches (e.g. blank lines)
	  this.diff_cleanupSemantic(diffs);
	
	  // Rediff any replacement blocks, this time character-by-character.
	  // Add a dummy entry at the end.
	  diffs.push([DIFF_EQUAL, '']);
	  var pointer = 0;
	  var count_delete = 0;
	  var count_insert = 0;
	  var text_delete = '';
	  var text_insert = '';
	  while (pointer < diffs.length) {
	    switch (diffs[pointer][0]) {
	      case DIFF_INSERT:
	        count_insert++;
	        text_insert += diffs[pointer][1];
	        break;
	      case DIFF_DELETE:
	        count_delete++;
	        text_delete += diffs[pointer][1];
	        break;
	      case DIFF_EQUAL:
	        // Upon reaching an equality, check for prior redundancies.
	        if (count_delete >= 1 && count_insert >= 1) {
	          // Delete the offending records and add the merged ones.
	          var a = this.diff_main(text_delete, text_insert, false, deadline);
	          diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert);
	          pointer = pointer - count_delete - count_insert;
	          for (var j = a.length - 1; j >= 0; j--) {
	            diffs.splice(pointer, 0, a[j]);
	          }
	          pointer = pointer + a.length;
	        }
	        count_insert = 0;
	        count_delete = 0;
	        text_delete = '';
	        text_insert = '';
	        break;
	    }
	    pointer++;
	  }
	  diffs.pop(); // Remove the dummy entry at the end.
	
	  return diffs;
	};
	
	/**
	 * Find the 'middle snake' of a diff, split the problem in two
	 * and return the recursively constructed diff.
	 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {number} deadline Time at which to bail if not yet complete.
	 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
	 * @private
	 */
	diff_match_patch.prototype.diff_bisect_ = function (text1, text2, deadline) {
	  // Cache the text lengths to prevent multiple calls.
	  var text1_length = text1.length;
	  var text2_length = text2.length;
	  var max_d = Math.ceil((text1_length + text2_length) / 2);
	  var v_offset = max_d;
	  var v_length = 2 * max_d;
	  var v1 = new Array(v_length);
	  var v2 = new Array(v_length);
	  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
	  // integers and undefined.
	  for (var x = 0; x < v_length; x++) {
	    v1[x] = -1;
	    v2[x] = -1;
	  }
	  v1[v_offset + 1] = 0;
	  v2[v_offset + 1] = 0;
	  var delta = text1_length - text2_length;
	  // If the total number of characters is odd, then the front path will collide
	  // with the reverse path.
	  var front = delta % 2 != 0;
	  // Offsets for start and end of k loop.
	  // Prevents mapping of space beyond the grid.
	  var k1start = 0;
	  var k1end = 0;
	  var k2start = 0;
	  var k2end = 0;
	  for (var d = 0; d < max_d; d++) {
	    // Bail out if deadline is reached.
	    if (new Date().getTime() > deadline) {
	      break;
	    }
	
	    // Walk the front path one step.
	    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
	      var k1_offset = v_offset + k1;
	      var x1;
	      if (k1 == -d || k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
	        x1 = v1[k1_offset + 1];
	      } else {
	        x1 = v1[k1_offset - 1] + 1;
	      }
	      var y1 = x1 - k1;
	      while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) == text2.charAt(y1)) {
	        x1++;
	        y1++;
	      }
	      v1[k1_offset] = x1;
	      if (x1 > text1_length) {
	        // Ran off the right of the graph.
	        k1end += 2;
	      } else if (y1 > text2_length) {
	        // Ran off the bottom of the graph.
	        k1start += 2;
	      } else if (front) {
	        var k2_offset = v_offset + delta - k1;
	        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
	          // Mirror x2 onto top-left coordinate system.
	          var x2 = text1_length - v2[k2_offset];
	          if (x1 >= x2) {
	            // Overlap detected.
	            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
	          }
	        }
	      }
	    }
	
	    // Walk the reverse path one step.
	    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
	      var k2_offset = v_offset + k2;
	      var x2;
	      if (k2 == -d || k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
	        x2 = v2[k2_offset + 1];
	      } else {
	        x2 = v2[k2_offset - 1] + 1;
	      }
	      var y2 = x2 - k2;
	      while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) == text2.charAt(text2_length - y2 - 1)) {
	        x2++;
	        y2++;
	      }
	      v2[k2_offset] = x2;
	      if (x2 > text1_length) {
	        // Ran off the left of the graph.
	        k2end += 2;
	      } else if (y2 > text2_length) {
	        // Ran off the top of the graph.
	        k2start += 2;
	      } else if (!front) {
	        var k1_offset = v_offset + delta - k2;
	        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
	          var x1 = v1[k1_offset];
	          var y1 = v_offset + x1 - k1_offset;
	          // Mirror x2 onto top-left coordinate system.
	          x2 = text1_length - x2;
	          if (x1 >= x2) {
	            // Overlap detected.
	            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
	          }
	        }
	      }
	    }
	  }
	  // Diff took too long and hit the deadline or
	  // number of diffs equals number of characters, no commonality at all.
	  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
	};
	
	/**
	 * Given the location of the 'middle snake', split the diff in two parts
	 * and recurse.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {number} x Index of split point in text1.
	 * @param {number} y Index of split point in text2.
	 * @param {number} deadline Time at which to bail if not yet complete.
	 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
	 * @private
	 */
	diff_match_patch.prototype.diff_bisectSplit_ = function (text1, text2, x, y, deadline) {
	  var text1a = text1.substring(0, x);
	  var text2a = text2.substring(0, y);
	  var text1b = text1.substring(x);
	  var text2b = text2.substring(y);
	
	  // Compute both diffs serially.
	  var diffs = this.diff_main(text1a, text2a, false, deadline);
	  var diffsb = this.diff_main(text1b, text2b, false, deadline);
	
	  return diffs.concat(diffsb);
	};
	
	/**
	 * Split two texts into an array of strings.  Reduce the texts to a string of
	 * hashes where each Unicode character represents one line.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {!Array.<string|!Array.<string>>} Three element Array, containing the
	 *     encoded text1, the encoded text2 and the array of unique strings.  The
	 *     zeroth element of the array of unique strings is intentionally blank.
	 * @private
	 */
	diff_match_patch.prototype.diff_linesToChars_ = function (text1, text2) {
	  var lineArray = []; // e.g. lineArray[4] == 'Hello\n'
	  var lineHash = {}; // e.g. lineHash['Hello\n'] == 4
	
	  // '\x00' is a valid character, but various debuggers don't like it.
	  // So we'll insert a junk entry to avoid generating a null character.
	  lineArray[0] = '';
	
	  /**
	   * Split a text into an array of strings.  Reduce the texts to a string of
	   * hashes where each Unicode character represents one line.
	   * Modifies linearray and linehash through being a closure.
	   * @param {string} text String to encode.
	   * @return {string} Encoded string.
	   * @private
	   */
	  function diff_linesToCharsMunge_(text) {
	    var chars = '';
	    // Walk the text, pulling out a substring for each line.
	    // text.split('\n') would would temporarily double our memory footprint.
	    // Modifying text would create many large strings to garbage collect.
	    var lineStart = 0;
	    var lineEnd = -1;
	    // Keeping our own length variable is faster than looking it up.
	    var lineArrayLength = lineArray.length;
	    while (lineEnd < text.length - 1) {
	      lineEnd = text.indexOf('\n', lineStart);
	      if (lineEnd == -1) {
	        lineEnd = text.length - 1;
	      }
	      var line = text.substring(lineStart, lineEnd + 1);
	      lineStart = lineEnd + 1;
	
	      if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) : lineHash[line] !== undefined) {
	        chars += String.fromCharCode(lineHash[line]);
	      } else {
	        chars += String.fromCharCode(lineArrayLength);
	        lineHash[line] = lineArrayLength;
	        lineArray[lineArrayLength++] = line;
	      }
	    }
	    return chars;
	  }
	
	  var chars1 = diff_linesToCharsMunge_(text1);
	  var chars2 = diff_linesToCharsMunge_(text2);
	  return [chars1, chars2, lineArray];
	};
	
	/**
	 * Rehydrate the text in a diff from a string of line hashes to real lines of
	 * text.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @param {!Array.<string>} lineArray Array of unique strings.
	 * @private
	 */
	diff_match_patch.prototype.diff_charsToLines_ = function (diffs, lineArray) {
	  for (var x = 0; x < diffs.length; x++) {
	    var chars = diffs[x][1];
	    var text = [];
	    for (var y = 0; y < chars.length; y++) {
	      text[y] = lineArray[chars.charCodeAt(y)];
	    }
	    diffs[x][1] = text.join('');
	  }
	};
	
	/**
	 * Determine the common prefix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the start of each
	 *     string.
	 */
	diff_match_patch.prototype.diff_commonPrefix = function (text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerstart = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
	      pointermin = pointermid;
	      pointerstart = pointermin;
	    } else {
	      pointermax = pointermid;
	    }
	    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	  }
	  return pointermid;
	};
	
	/**
	 * Determine the common suffix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the end of each string.
	 */
	diff_match_patch.prototype.diff_commonSuffix = function (text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerend = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
	      pointermin = pointermid;
	      pointerend = pointermin;
	    } else {
	      pointermax = pointermid;
	    }
	    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	  }
	  return pointermid;
	};
	
	/**
	 * Determine if the suffix of one string is the prefix of another.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the end of the first
	 *     string and the start of the second string.
	 * @private
	 */
	diff_match_patch.prototype.diff_commonOverlap_ = function (text1, text2) {
	  // Cache the text lengths to prevent multiple calls.
	  var text1_length = text1.length;
	  var text2_length = text2.length;
	  // Eliminate the null case.
	  if (text1_length == 0 || text2_length == 0) {
	    return 0;
	  }
	  // Truncate the longer string.
	  if (text1_length > text2_length) {
	    text1 = text1.substring(text1_length - text2_length);
	  } else if (text1_length < text2_length) {
	    text2 = text2.substring(0, text1_length);
	  }
	  var text_length = Math.min(text1_length, text2_length);
	  // Quick check for the worst case.
	  if (text1 == text2) {
	    return text_length;
	  }
	
	  // Start by looking for a single character match
	  // and increase length until no match is found.
	  // Performance analysis: http://neil.fraser.name/news/2010/11/04/
	  var best = 0;
	  var length = 1;
	  while (true) {
	    var pattern = text1.substring(text_length - length);
	    var found = text2.indexOf(pattern);
	    if (found == -1) {
	      return best;
	    }
	    length += found;
	    if (found == 0 || text1.substring(text_length - length) == text2.substring(0, length)) {
	      best = length;
	      length++;
	    }
	  }
	};
	
	/**
	 * Do the two texts share a substring which is at least half the length of the
	 * longer text?
	 * This speedup can produce non-minimal diffs.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {Array.<string>} Five element Array, containing the prefix of
	 *     text1, the suffix of text1, the prefix of text2, the suffix of
	 *     text2 and the common middle.  Or null if there was no match.
	 * @private
	 */
	diff_match_patch.prototype.diff_halfMatch_ = function (text1, text2) {
	  if (this.Diff_Timeout <= 0) {
	    // Don't risk returning a non-optimal diff if we have unlimited time.
	    return null;
	  }
	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
	    return null; // Pointless.
	  }
	  var dmp = this; // 'this' becomes 'window' in a closure.
	
	  /**
	   * Does a substring of shorttext exist within longtext such that the substring
	   * is at least half the length of longtext?
	   * Closure, but does not reference any external variables.
	   * @param {string} longtext Longer string.
	   * @param {string} shorttext Shorter string.
	   * @param {number} i Start index of quarter length substring within longtext.
	   * @return {Array.<string>} Five element Array, containing the prefix of
	   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
	   *     of shorttext and the common middle.  Or null if there was no match.
	   * @private
	   */
	  function diff_halfMatchI_(longtext, shorttext, i) {
	    // Start with a 1/4 length substring at position i as a seed.
	    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
	    var j = -1;
	    var best_common = '';
	    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
	    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
	      var prefixLength = dmp.diff_commonPrefix(longtext.substring(i), shorttext.substring(j));
	      var suffixLength = dmp.diff_commonSuffix(longtext.substring(0, i), shorttext.substring(0, j));
	      if (best_common.length < suffixLength + prefixLength) {
	        best_common = shorttext.substring(j - suffixLength, j) + shorttext.substring(j, j + prefixLength);
	        best_longtext_a = longtext.substring(0, i - suffixLength);
	        best_longtext_b = longtext.substring(i + prefixLength);
	        best_shorttext_a = shorttext.substring(0, j - suffixLength);
	        best_shorttext_b = shorttext.substring(j + prefixLength);
	      }
	    }
	    if (best_common.length * 2 >= longtext.length) {
	      return [best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b, best_common];
	    } else {
	      return null;
	    }
	  }
	
	  // First check if the second quarter is the seed for a half-match.
	  var hm1 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 4));
	  // Check again based on the third quarter.
	  var hm2 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 2));
	  var hm;
	  if (!hm1 && !hm2) {
	    return null;
	  } else if (!hm2) {
	    hm = hm1;
	  } else if (!hm1) {
	    hm = hm2;
	  } else {
	    // Both matched.  Select the longest.
	    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
	  }
	
	  // A half-match was found, sort out the return data.
	  var text1_a, text1_b, text2_a, text2_b;
	  if (text1.length > text2.length) {
	    text1_a = hm[0];
	    text1_b = hm[1];
	    text2_a = hm[2];
	    text2_b = hm[3];
	  } else {
	    text2_a = hm[0];
	    text2_b = hm[1];
	    text1_a = hm[2];
	    text1_b = hm[3];
	  }
	  var mid_common = hm[4];
	  return [text1_a, text1_b, text2_a, text2_b, mid_common];
	};
	
	/**
	 * Reduce the number of edits by eliminating semantically trivial equalities.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 */
	diff_match_patch.prototype.diff_cleanupSemantic = function (diffs) {
	  var changes = false;
	  var equalities = []; // Stack of indices where equalities are found.
	  var equalitiesLength = 0; // Keeping our own length var is faster in JS.
	  /** @type {?string} */
	  var lastequality = null; // Always equal to equalities[equalitiesLength-1][1]
	  var pointer = 0; // Index of current position.
	  // Number of characters that changed prior to the equality.
	  var length_insertions1 = 0;
	  var length_deletions1 = 0;
	  // Number of characters that changed after the equality.
	  var length_insertions2 = 0;
	  var length_deletions2 = 0;
	  while (pointer < diffs.length) {
	    if (diffs[pointer][0] == DIFF_EQUAL) {
	      // Equality found.
	      equalities[equalitiesLength++] = pointer;
	      length_insertions1 = length_insertions2;
	      length_deletions1 = length_deletions2;
	      length_insertions2 = 0;
	      length_deletions2 = 0;
	      lastequality = diffs[pointer][1];
	    } else {
	      // An insertion or deletion.
	      if (diffs[pointer][0] == DIFF_INSERT) {
	        length_insertions2 += diffs[pointer][1].length;
	      } else {
	        length_deletions2 += diffs[pointer][1].length;
	      }
	      // Eliminate an equality that is smaller or equal to the edits on both
	      // sides of it.
	      if (lastequality !== null && lastequality.length <= Math.max(length_insertions1, length_deletions1) && lastequality.length <= Math.max(length_insertions2, length_deletions2)) {
	        // Duplicate record.
	        diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastequality]);
	        // Change second copy to insert.
	        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
	        // Throw away the equality we just deleted.
	        equalitiesLength--;
	        // Throw away the previous equality (it needs to be reevaluated).
	        equalitiesLength--;
	        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
	        length_insertions1 = 0; // Reset the counters.
	        length_deletions1 = 0;
	        length_insertions2 = 0;
	        length_deletions2 = 0;
	        lastequality = null;
	        changes = true;
	      }
	    }
	    pointer++;
	  }
	
	  // Normalize the diff.
	  if (changes) {
	    this.diff_cleanupMerge(diffs);
	  }
	  this.diff_cleanupSemanticLossless(diffs);
	
	  // Find any overlaps between deletions and insertions.
	  // e.g: <del>abcxxx</del><ins>xxxdef</ins>
	  //   -> <del>abc</del>xxx<ins>def</ins>
	  // Only extract an overlap if it is as big as the edit ahead or behind it.
	  pointer = 1;
	  while (pointer < diffs.length) {
	    if (diffs[pointer - 1][0] == DIFF_DELETE && diffs[pointer][0] == DIFF_INSERT) {
	      var deletion = diffs[pointer - 1][1];
	      var insertion = diffs[pointer][1];
	      var overlap_length = this.diff_commonOverlap_(deletion, insertion);
	      if (overlap_length >= deletion.length / 2 || overlap_length >= insertion.length / 2) {
	        // Overlap found.  Insert an equality and trim the surrounding edits.
	        diffs.splice(pointer, 0, [DIFF_EQUAL, insertion.substring(0, overlap_length)]);
	        diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlap_length);
	        diffs[pointer + 1][1] = insertion.substring(overlap_length);
	        pointer++;
	      }
	      pointer++;
	    }
	    pointer++;
	  }
	};
	
	/**
	 * Look for single edits surrounded on both sides by equalities
	 * which can be shifted sideways to align the edit to a word boundary.
	 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 */
	diff_match_patch.prototype.diff_cleanupSemanticLossless = function (diffs) {
	  // Define some regex patterns for matching boundaries.
	  var punctuation = /[^a-zA-Z0-9]/;
	  var whitespace = /\s/;
	  var linebreak = /[\r\n]/;
	  var blanklineEnd = /\n\r?\n$/;
	  var blanklineStart = /^\r?\n\r?\n/;
	
	  /**
	   * Given two strings, compute a score representing whether the internal
	   * boundary falls on logical boundaries.
	   * Scores range from 5 (best) to 0 (worst).
	   * Closure, makes reference to regex patterns defined above.
	   * @param {string} one First string.
	   * @param {string} two Second string.
	   * @return {number} The score.
	   * @private
	   */
	  function diff_cleanupSemanticScore_(one, two) {
	    if (!one || !two) {
	      // Edges are the best.
	      return 5;
	    }
	
	    // Each port of this function behaves slightly differently due to
	    // subtle differences in each language's definition of things like
	    // 'whitespace'.  Since this function's purpose is largely cosmetic,
	    // the choice has been made to use each language's native features
	    // rather than force total conformity.
	    var score = 0;
	    // One point for non-alphanumeric.
	    if (one.charAt(one.length - 1).match(punctuation) || two.charAt(0).match(punctuation)) {
	      score++;
	      // Two points for whitespace.
	      if (one.charAt(one.length - 1).match(whitespace) || two.charAt(0).match(whitespace)) {
	        score++;
	        // Three points for line breaks.
	        if (one.charAt(one.length - 1).match(linebreak) || two.charAt(0).match(linebreak)) {
	          score++;
	          // Four points for blank lines.
	          if (one.match(blanklineEnd) || two.match(blanklineStart)) {
	            score++;
	          }
	        }
	      }
	    }
	    return score;
	  }
	
	  var pointer = 1;
	  // Intentionally ignore the first and last element (don't need checking).
	  while (pointer < diffs.length - 1) {
	    if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
	      // This is a single edit surrounded by equalities.
	      var equality1 = diffs[pointer - 1][1];
	      var edit = diffs[pointer][1];
	      var equality2 = diffs[pointer + 1][1];
	
	      // First, shift the edit as far left as possible.
	      var commonOffset = this.diff_commonSuffix(equality1, edit);
	      if (commonOffset) {
	        var commonString = edit.substring(edit.length - commonOffset);
	        equality1 = equality1.substring(0, equality1.length - commonOffset);
	        edit = commonString + edit.substring(0, edit.length - commonOffset);
	        equality2 = commonString + equality2;
	      }
	
	      // Second, step character by character right, looking for the best fit.
	      var bestEquality1 = equality1;
	      var bestEdit = edit;
	      var bestEquality2 = equality2;
	      var bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
	      while (edit.charAt(0) === equality2.charAt(0)) {
	        equality1 += edit.charAt(0);
	        edit = edit.substring(1) + equality2.charAt(0);
	        equality2 = equality2.substring(1);
	        var score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
	        // The >= encourages trailing rather than leading whitespace on edits.
	        if (score >= bestScore) {
	          bestScore = score;
	          bestEquality1 = equality1;
	          bestEdit = edit;
	          bestEquality2 = equality2;
	        }
	      }
	
	      if (diffs[pointer - 1][1] != bestEquality1) {
	        // We have an improvement, save it back to the diff.
	        if (bestEquality1) {
	          diffs[pointer - 1][1] = bestEquality1;
	        } else {
	          diffs.splice(pointer - 1, 1);
	          pointer--;
	        }
	        diffs[pointer][1] = bestEdit;
	        if (bestEquality2) {
	          diffs[pointer + 1][1] = bestEquality2;
	        } else {
	          diffs.splice(pointer + 1, 1);
	          pointer--;
	        }
	      }
	    }
	    pointer++;
	  }
	};
	
	/**
	 * Reduce the number of edits by eliminating operationally trivial equalities.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 */
	diff_match_patch.prototype.diff_cleanupEfficiency = function (diffs) {
	  var changes = false;
	  var equalities = []; // Stack of indices where equalities are found.
	  var equalitiesLength = 0; // Keeping our own length var is faster in JS.
	  var lastequality = ''; // Always equal to equalities[equalitiesLength-1][1]
	  var pointer = 0; // Index of current position.
	  // Is there an insertion operation before the last equality.
	  var pre_ins = false;
	  // Is there a deletion operation before the last equality.
	  var pre_del = false;
	  // Is there an insertion operation after the last equality.
	  var post_ins = false;
	  // Is there a deletion operation after the last equality.
	  var post_del = false;
	  while (pointer < diffs.length) {
	    if (diffs[pointer][0] == DIFF_EQUAL) {
	      // Equality found.
	      if (diffs[pointer][1].length < this.Diff_EditCost && (post_ins || post_del)) {
	        // Candidate found.
	        equalities[equalitiesLength++] = pointer;
	        pre_ins = post_ins;
	        pre_del = post_del;
	        lastequality = diffs[pointer][1];
	      } else {
	        // Not a candidate, and can never become one.
	        equalitiesLength = 0;
	        lastequality = '';
	      }
	      post_ins = post_del = false;
	    } else {
	      // An insertion or deletion.
	      if (diffs[pointer][0] == DIFF_DELETE) {
	        post_del = true;
	      } else {
	        post_ins = true;
	      }
	      /*
	       * Five types to be split:
	       * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
	       * <ins>A</ins>X<ins>C</ins><del>D</del>
	       * <ins>A</ins><del>B</del>X<ins>C</ins>
	       * <ins>A</del>X<ins>C</ins><del>D</del>
	       * <ins>A</ins><del>B</del>X<del>C</del>
	       */
	      if (lastequality && (pre_ins && pre_del && post_ins && post_del || lastequality.length < this.Diff_EditCost / 2 && pre_ins + pre_del + post_ins + post_del == 3)) {
	        // Duplicate record.
	        diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastequality]);
	        // Change second copy to insert.
	        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
	        equalitiesLength--; // Throw away the equality we just deleted;
	        lastequality = '';
	        if (pre_ins && pre_del) {
	          // No changes made which could affect previous entry, keep going.
	          post_ins = post_del = true;
	          equalitiesLength = 0;
	        } else {
	          equalitiesLength--; // Throw away the previous equality.
	          pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
	          post_ins = post_del = false;
	        }
	        changes = true;
	      }
	    }
	    pointer++;
	  }
	
	  if (changes) {
	    this.diff_cleanupMerge(diffs);
	  }
	};
	
	/**
	 * Reorder and merge like edit sections.  Merge equalities.
	 * Any edit section can move as long as it doesn't cross an equality.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 */
	diff_match_patch.prototype.diff_cleanupMerge = function (diffs) {
	  diffs.push([DIFF_EQUAL, '']); // Add a dummy entry at the end.
	  var pointer = 0;
	  var count_delete = 0;
	  var count_insert = 0;
	  var text_delete = '';
	  var text_insert = '';
	  var commonlength;
	  while (pointer < diffs.length) {
	    switch (diffs[pointer][0]) {
	      case DIFF_INSERT:
	        count_insert++;
	        text_insert += diffs[pointer][1];
	        pointer++;
	        break;
	      case DIFF_DELETE:
	        count_delete++;
	        text_delete += diffs[pointer][1];
	        pointer++;
	        break;
	      case DIFF_EQUAL:
	        // Upon reaching an equality, check for prior redundancies.
	        if (count_delete + count_insert > 1) {
	          if (count_delete !== 0 && count_insert !== 0) {
	            // Factor out any common prefixies.
	            commonlength = this.diff_commonPrefix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              if (pointer - count_delete - count_insert > 0 && diffs[pointer - count_delete - count_insert - 1][0] == DIFF_EQUAL) {
	                diffs[pointer - count_delete - count_insert - 1][1] += text_insert.substring(0, commonlength);
	              } else {
	                diffs.splice(0, 0, [DIFF_EQUAL, text_insert.substring(0, commonlength)]);
	                pointer++;
	              }
	              text_insert = text_insert.substring(commonlength);
	              text_delete = text_delete.substring(commonlength);
	            }
	            // Factor out any common suffixies.
	            commonlength = this.diff_commonSuffix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
	              text_insert = text_insert.substring(0, text_insert.length - commonlength);
	              text_delete = text_delete.substring(0, text_delete.length - commonlength);
	            }
	          }
	          // Delete the offending records and add the merged ones.
	          if (count_delete === 0) {
	            diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert, [DIFF_INSERT, text_insert]);
	          } else if (count_insert === 0) {
	            diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert, [DIFF_DELETE, text_delete]);
	          } else {
	            diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert, [DIFF_DELETE, text_delete], [DIFF_INSERT, text_insert]);
	          }
	          pointer = pointer - count_delete - count_insert + (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
	        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
	          // Merge this equality with the previous one.
	          diffs[pointer - 1][1] += diffs[pointer][1];
	          diffs.splice(pointer, 1);
	        } else {
	          pointer++;
	        }
	        count_insert = 0;
	        count_delete = 0;
	        text_delete = '';
	        text_insert = '';
	        break;
	    }
	  }
	  if (diffs[diffs.length - 1][1] === '') {
	    diffs.pop(); // Remove the dummy entry at the end.
	  }
	
	  // Second pass: look for single edits surrounded on both sides by equalities
	  // which can be shifted sideways to eliminate an equality.
	  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
	  var changes = false;
	  pointer = 1;
	  // Intentionally ignore the first and last element (don't need checking).
	  while (pointer < diffs.length - 1) {
	    if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
	      // This is a single edit surrounded by equalities.
	      if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
	        // Shift the edit over the previous equality.
	        diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
	        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
	        diffs.splice(pointer - 1, 1);
	        changes = true;
	      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
	        // Shift the edit over the next equality.
	        diffs[pointer - 1][1] += diffs[pointer + 1][1];
	        diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
	        diffs.splice(pointer + 1, 1);
	        changes = true;
	      }
	    }
	    pointer++;
	  }
	  // If shifts were made, the diff needs reordering and another shift sweep.
	  if (changes) {
	    this.diff_cleanupMerge(diffs);
	  }
	};
	
	/**
	 * loc is a location in text1, compute and return the equivalent location in
	 * text2.
	 * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @param {number} loc Location within text1.
	 * @return {number} Location within text2.
	 */
	diff_match_patch.prototype.diff_xIndex = function (diffs, loc) {
	  var chars1 = 0;
	  var chars2 = 0;
	  var last_chars1 = 0;
	  var last_chars2 = 0;
	  var x;
	  for (x = 0; x < diffs.length; x++) {
	    if (diffs[x][0] !== DIFF_INSERT) {
	      // Equality or deletion.
	      chars1 += diffs[x][1].length;
	    }
	    if (diffs[x][0] !== DIFF_DELETE) {
	      // Equality or insertion.
	      chars2 += diffs[x][1].length;
	    }
	    if (chars1 > loc) {
	      // Overshot the location.
	      break;
	    }
	    last_chars1 = chars1;
	    last_chars2 = chars2;
	  }
	  // Was the location was deleted?
	  if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
	    return last_chars2;
	  }
	  // Add the remaining character length.
	  return last_chars2 + (loc - last_chars1);
	};
	
	/**
	 * Convert a diff array into a pretty HTML report.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @return {string} HTML representation.
	 */
	diff_match_patch.prototype.diff_prettyHtml = function (diffs) {
	  var html = [];
	  var i = 0;
	  var pattern_amp = /&/g;
	  var pattern_lt = /</g;
	  var pattern_gt = />/g;
	  var pattern_para = /\n/g;
	  for (var x = 0; x < diffs.length; x++) {
	    var op = diffs[x][0]; // Operation (insert, delete, equal)
	    var data = diffs[x][1]; // Text of change.
	    var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;').replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
	    switch (op) {
	      case DIFF_INSERT:
	        html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
	        break;
	      case DIFF_DELETE:
	        html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
	        break;
	      case DIFF_EQUAL:
	        html[x] = '<span>' + text + '</span>';
	        break;
	    }
	    if (op !== DIFF_DELETE) {
	      i += data.length;
	    }
	  }
	  return html.join('');
	};
	
	/**
	 * Compute and return the source text (all equalities and deletions).
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @return {string} Source text.
	 */
	diff_match_patch.prototype.diff_text1 = function (diffs) {
	  var text = [];
	  for (var x = 0; x < diffs.length; x++) {
	    if (diffs[x][0] !== DIFF_INSERT) {
	      text[x] = diffs[x][1];
	    }
	  }
	  return text.join('');
	};
	
	/**
	 * Compute and return the destination text (all equalities and insertions).
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @return {string} Destination text.
	 */
	diff_match_patch.prototype.diff_text2 = function (diffs) {
	  var text = [];
	  for (var x = 0; x < diffs.length; x++) {
	    if (diffs[x][0] !== DIFF_DELETE) {
	      text[x] = diffs[x][1];
	    }
	  }
	  return text.join('');
	};
	
	/**
	 * Compute the Levenshtein distance; the number of inserted, deleted or
	 * substituted characters.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @return {number} Number of changes.
	 */
	diff_match_patch.prototype.diff_levenshtein = function (diffs) {
	  var levenshtein = 0;
	  var insertions = 0;
	  var deletions = 0;
	  for (var x = 0; x < diffs.length; x++) {
	    var op = diffs[x][0];
	    var data = diffs[x][1];
	    switch (op) {
	      case DIFF_INSERT:
	        insertions += data.length;
	        break;
	      case DIFF_DELETE:
	        deletions += data.length;
	        break;
	      case DIFF_EQUAL:
	        // A deletion and an insertion is one substitution.
	        levenshtein += Math.max(insertions, deletions);
	        insertions = 0;
	        deletions = 0;
	        break;
	    }
	  }
	  levenshtein += Math.max(insertions, deletions);
	  return levenshtein;
	};
	
	/**
	 * Crush the diff into an encoded string which describes the operations
	 * required to transform text1 into text2.
	 * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
	 * Operations are tab-separated.  Inserted text is escaped using %xx notation.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @return {string} Delta text.
	 */
	diff_match_patch.prototype.diff_toDelta = function (diffs) {
	  var text = [];
	  for (var x = 0; x < diffs.length; x++) {
	    switch (diffs[x][0]) {
	      case DIFF_INSERT:
	        text[x] = '+' + encodeURI(diffs[x][1]);
	        break;
	      case DIFF_DELETE:
	        text[x] = '-' + diffs[x][1].length;
	        break;
	      case DIFF_EQUAL:
	        text[x] = '=' + diffs[x][1].length;
	        break;
	    }
	  }
	  return text.join('\t').replace(/%20/g, ' ');
	};
	
	/**
	 * Given the original text1, and an encoded string which describes the
	 * operations required to transform text1 into text2, compute the full diff.
	 * @param {string} text1 Source string for the diff.
	 * @param {string} delta Delta text.
	 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
	 * @throws {!Error} If invalid input.
	 */
	diff_match_patch.prototype.diff_fromDelta = function (text1, delta) {
	  var diffs = [];
	  var diffsLength = 0; // Keeping our own length var is faster in JS.
	  var pointer = 0; // Cursor in text1
	  var tokens = delta.split(/\t/g);
	  for (var x = 0; x < tokens.length; x++) {
	    // Each token begins with a one character parameter which specifies the
	    // operation of this token (delete, insert, equality).
	    var param = tokens[x].substring(1);
	    switch (tokens[x].charAt(0)) {
	      case '+':
	        try {
	          diffs[diffsLength++] = [DIFF_INSERT, decodeURI(param)];
	        } catch (ex) {
	          // Malformed URI sequence.
	          throw new Error('Illegal escape in diff_fromDelta: ' + param);
	        }
	        break;
	      case '-':
	      // Fall through.
	      case '=':
	        var n = parseInt(param, 10);
	        if (isNaN(n) || n < 0) {
	          throw new Error('Invalid number in diff_fromDelta: ' + param);
	        }
	        var text = text1.substring(pointer, pointer += n);
	        if (tokens[x].charAt(0) == '=') {
	          diffs[diffsLength++] = [DIFF_EQUAL, text];
	        } else {
	          diffs[diffsLength++] = [DIFF_DELETE, text];
	        }
	        break;
	      default:
	        // Blank tokens are ok (from a trailing \t).
	        // Anything else is an error.
	        if (tokens[x]) {
	          throw new Error('Invalid diff operation in diff_fromDelta: ' + tokens[x]);
	        }
	    }
	  }
	  if (pointer != text1.length) {
	    throw new Error('Delta length (' + pointer + ') does not equal source text length (' + text1.length + ').');
	  }
	  return diffs;
	};
	
	//  MATCH FUNCTIONS
	
	/**
	 * Locate the best instance of 'pattern' in 'text' near 'loc'.
	 * @param {string} text The text to search.
	 * @param {string} pattern The pattern to search for.
	 * @param {number} loc The location to search around.
	 * @return {number} Best match index or -1.
	 */
	diff_match_patch.prototype.match_main = function (text, pattern, loc) {
	  // Check for null inputs.
	  if (text == null || pattern == null || loc == null) {
	    throw new Error('Null input. (match_main)');
	  }
	
	  loc = Math.max(0, Math.min(loc, text.length));
	  if (text == pattern) {
	    // Shortcut (potentially not guaranteed by the algorithm)
	    return 0;
	  } else if (!text.length) {
	    // Nothing to match.
	    return -1;
	  } else if (text.substring(loc, loc + pattern.length) == pattern) {
	    // Perfect match at the perfect spot!  (Includes case of null pattern)
	    return loc;
	  } else {
	    // Do a fuzzy compare.
	    return this.match_bitap_(text, pattern, loc);
	  }
	};
	
	/**
	 * Locate the best instance of 'pattern' in 'text' near 'loc' using the
	 * Bitap algorithm.
	 * @param {string} text The text to search.
	 * @param {string} pattern The pattern to search for.
	 * @param {number} loc The location to search around.
	 * @return {number} Best match index or -1.
	 * @private
	 */
	diff_match_patch.prototype.match_bitap_ = function (text, pattern, loc) {
	  if (pattern.length > this.Match_MaxBits) {
	    throw new Error('Pattern too long for this browser.');
	  }
	
	  // Initialise the alphabet.
	  var s = this.match_alphabet_(pattern);
	
	  var dmp = this; // 'this' becomes 'window' in a closure.
	
	  /**
	   * Compute and return the score for a match with e errors and x location.
	   * Accesses loc and pattern through being a closure.
	   * @param {number} e Number of errors in match.
	   * @param {number} x Location of match.
	   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
	   * @private
	   */
	  function match_bitapScore_(e, x) {
	    var accuracy = e / pattern.length;
	    var proximity = Math.abs(loc - x);
	    if (!dmp.Match_Distance) {
	      // Dodge divide by zero error.
	      return proximity ? 1 : accuracy;
	    }
	    return accuracy + proximity / dmp.Match_Distance;
	  }
	
	  // Highest score beyond which we give up.
	  var score_threshold = this.Match_Threshold;
	  // Is there a nearby exact match? (speedup)
	  var best_loc = text.indexOf(pattern, loc);
	  if (best_loc != -1) {
	    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
	    // What about in the other direction? (speedup)
	    best_loc = text.lastIndexOf(pattern, loc + pattern.length);
	    if (best_loc != -1) {
	      score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
	    }
	  }
	
	  // Initialise the bit arrays.
	  var matchmask = 1 << pattern.length - 1;
	  best_loc = -1;
	
	  var bin_min, bin_mid;
	  var bin_max = pattern.length + text.length;
	  var last_rd;
	  for (var d = 0; d < pattern.length; d++) {
	    // Scan for the best match; each iteration allows for one more error.
	    // Run a binary search to determine how far from 'loc' we can stray at this
	    // error level.
	    bin_min = 0;
	    bin_mid = bin_max;
	    while (bin_min < bin_mid) {
	      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
	        bin_min = bin_mid;
	      } else {
	        bin_max = bin_mid;
	      }
	      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
	    }
	    // Use the result from this iteration as the maximum for the next.
	    bin_max = bin_mid;
	    var start = Math.max(1, loc - bin_mid + 1);
	    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;
	
	    var rd = Array(finish + 2);
	    rd[finish + 1] = (1 << d) - 1;
	    for (var j = finish; j >= start; j--) {
	      // The alphabet (s) is a sparse hash, so the following line generates
	      // warnings.
	      var charMatch = s[text.charAt(j - 1)];
	      if (d === 0) {
	        // First pass: exact match.
	        rd[j] = (rd[j + 1] << 1 | 1) & charMatch;
	      } else {
	        // Subsequent passes: fuzzy match.
	        rd[j] = (rd[j + 1] << 1 | 1) & charMatch | ((last_rd[j + 1] | last_rd[j]) << 1 | 1) | last_rd[j + 1];
	      }
	      if (rd[j] & matchmask) {
	        var score = match_bitapScore_(d, j - 1);
	        // This match will almost certainly be better than any existing match.
	        // But check anyway.
	        if (score <= score_threshold) {
	          // Told you so.
	          score_threshold = score;
	          best_loc = j - 1;
	          if (best_loc > loc) {
	            // When passing loc, don't exceed our current distance from loc.
	            start = Math.max(1, 2 * loc - best_loc);
	          } else {
	            // Already passed loc, downhill from here on in.
	            break;
	          }
	        }
	      }
	    }
	    // No hope for a (better) match at greater error levels.
	    if (match_bitapScore_(d + 1, loc) > score_threshold) {
	      break;
	    }
	    last_rd = rd;
	  }
	  return best_loc;
	};
	
	/**
	 * Initialise the alphabet for the Bitap algorithm.
	 * @param {string} pattern The text to encode.
	 * @return {!Object} Hash of character locations.
	 * @private
	 */
	diff_match_patch.prototype.match_alphabet_ = function (pattern) {
	  var s = {};
	  for (var i = 0; i < pattern.length; i++) {
	    s[pattern.charAt(i)] = 0;
	  }
	  for (var i = 0; i < pattern.length; i++) {
	    s[pattern.charAt(i)] |= 1 << pattern.length - i - 1;
	  }
	  return s;
	};
	
	//  PATCH FUNCTIONS
	
	/**
	 * Increase the context until it is unique,
	 * but don't let the pattern expand beyond Match_MaxBits.
	 * @param {!diff_match_patch.patch_obj} patch The patch to grow.
	 * @param {string} text Source text.
	 * @private
	 */
	diff_match_patch.prototype.patch_addContext_ = function (patch, text) {
	  if (text.length == 0) {
	    return;
	  }
	  var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
	  var padding = 0;
	
	  // Look for the first and last matches of pattern in text.  If two different
	  // matches are found, increase the pattern length.
	  while (text.indexOf(pattern) != text.lastIndexOf(pattern) && pattern.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin) {
	    padding += this.Patch_Margin;
	    pattern = text.substring(patch.start2 - padding, patch.start2 + patch.length1 + padding);
	  }
	  // Add one chunk for good luck.
	  padding += this.Patch_Margin;
	
	  // Add the prefix.
	  var prefix = text.substring(patch.start2 - padding, patch.start2);
	  if (prefix) {
	    patch.diffs.unshift([DIFF_EQUAL, prefix]);
	  }
	  // Add the suffix.
	  var suffix = text.substring(patch.start2 + patch.length1, patch.start2 + patch.length1 + padding);
	  if (suffix) {
	    patch.diffs.push([DIFF_EQUAL, suffix]);
	  }
	
	  // Roll back the start points.
	  patch.start1 -= prefix.length;
	  patch.start2 -= prefix.length;
	  // Extend the lengths.
	  patch.length1 += prefix.length + suffix.length;
	  patch.length2 += prefix.length + suffix.length;
	};
	
	/**
	 * Compute a list of patches to turn text1 into text2.
	 * Use diffs if provided, otherwise compute it ourselves.
	 * There are four ways to call this function, depending on what data is
	 * available to the caller:
	 * Method 1:
	 * a = text1, b = text2
	 * Method 2:
	 * a = diffs
	 * Method 3 (optimal):
	 * a = text1, b = diffs
	 * Method 4 (deprecated, use method 3):
	 * a = text1, b = text2, c = diffs
	 *
	 * @param {string|!Array.<!diff_match_patch.Diff>} a text1 (methods 1,3,4) or
	 * Array of diff tuples for text1 to text2 (method 2).
	 * @param {string|!Array.<!diff_match_patch.Diff>} opt_b text2 (methods 1,4) or
	 * Array of diff tuples for text1 to text2 (method 3) or undefined (method 2).
	 * @param {string|!Array.<!diff_match_patch.Diff>} opt_c Array of diff tuples
	 * for text1 to text2 (method 4) or undefined (methods 1,2,3).
	 * @return {!Array.<!diff_match_patch.patch_obj>} Array of patch objects.
	 */
	diff_match_patch.prototype.patch_make = function (a, opt_b, opt_c) {
	  var text1, diffs;
	  if (typeof a == 'string' && typeof opt_b == 'string' && typeof opt_c == 'undefined') {
	    // Method 1: text1, text2
	    // Compute diffs from text1 and text2.
	    text1 = a;
	    diffs = this.diff_main(text1, opt_b, true);
	    if (diffs.length > 2) {
	      this.diff_cleanupSemantic(diffs);
	      this.diff_cleanupEfficiency(diffs);
	    }
	  } else if (a && typeof a == 'object' && typeof opt_b == 'undefined' && typeof opt_c == 'undefined') {
	    // Method 2: diffs
	    // Compute text1 from diffs.
	    diffs = a;
	    text1 = this.diff_text1(diffs);
	  } else if (typeof a == 'string' && opt_b && typeof opt_b == 'object' && typeof opt_c == 'undefined') {
	    // Method 3: text1, diffs
	    text1 = a;
	    diffs = opt_b;
	  } else if (typeof a == 'string' && typeof opt_b == 'string' && opt_c && typeof opt_c == 'object') {
	    // Method 4: text1, text2, diffs
	    // text2 is not used.
	    text1 = a;
	    diffs = opt_c;
	  } else {
	    throw new Error('Unknown call format to patch_make.');
	  }
	
	  if (diffs.length === 0) {
	    return []; // Get rid of the null case.
	  }
	  var patches = [];
	  var patch = new diff_match_patch.patch_obj();
	  var patchDiffLength = 0; // Keeping our own length var is faster in JS.
	  var char_count1 = 0; // Number of characters into the text1 string.
	  var char_count2 = 0; // Number of characters into the text2 string.
	  // Start with text1 (prepatch_text) and apply the diffs until we arrive at
	  // text2 (postpatch_text).  We recreate the patches one by one to determine
	  // context info.
	  var prepatch_text = text1;
	  var postpatch_text = text1;
	  for (var x = 0; x < diffs.length; x++) {
	    var diff_type = diffs[x][0];
	    var diff_text = diffs[x][1];
	
	    if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
	      // A new patch starts here.
	      patch.start1 = char_count1;
	      patch.start2 = char_count2;
	    }
	
	    switch (diff_type) {
	      case DIFF_INSERT:
	        patch.diffs[patchDiffLength++] = diffs[x];
	        patch.length2 += diff_text.length;
	        postpatch_text = postpatch_text.substring(0, char_count2) + diff_text + postpatch_text.substring(char_count2);
	        break;
	      case DIFF_DELETE:
	        patch.length1 += diff_text.length;
	        patch.diffs[patchDiffLength++] = diffs[x];
	        postpatch_text = postpatch_text.substring(0, char_count2) + postpatch_text.substring(char_count2 + diff_text.length);
	        break;
	      case DIFF_EQUAL:
	        if (diff_text.length <= 2 * this.Patch_Margin && patchDiffLength && diffs.length != x + 1) {
	          // Small equality inside a patch.
	          patch.diffs[patchDiffLength++] = diffs[x];
	          patch.length1 += diff_text.length;
	          patch.length2 += diff_text.length;
	        } else if (diff_text.length >= 2 * this.Patch_Margin) {
	          // Time for a new patch.
	          if (patchDiffLength) {
	            this.patch_addContext_(patch, prepatch_text);
	            patches.push(patch);
	            patch = new diff_match_patch.patch_obj();
	            patchDiffLength = 0;
	            // Unlike Unidiff, our patch lists have a rolling context.
	            // http://code.google.com/p/google-diff-match-patch/wiki/Unidiff
	            // Update prepatch text & pos to reflect the application of the
	            // just completed patch.
	            prepatch_text = postpatch_text;
	            char_count1 = char_count2;
	          }
	        }
	        break;
	    }
	
	    // Update the current character count.
	    if (diff_type !== DIFF_INSERT) {
	      char_count1 += diff_text.length;
	    }
	    if (diff_type !== DIFF_DELETE) {
	      char_count2 += diff_text.length;
	    }
	  }
	  // Pick up the leftover patch if not empty.
	  if (patchDiffLength) {
	    this.patch_addContext_(patch, prepatch_text);
	    patches.push(patch);
	  }
	
	  return patches;
	};
	
	/**
	 * Given an array of patches, return another array that is identical.
	 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of patch objects.
	 * @return {!Array.<!diff_match_patch.patch_obj>} Array of patch objects.
	 */
	diff_match_patch.prototype.patch_deepCopy = function (patches) {
	  // Making deep copies is hard in JavaScript.
	  var patchesCopy = [];
	  for (var x = 0; x < patches.length; x++) {
	    var patch = patches[x];
	    var patchCopy = new diff_match_patch.patch_obj();
	    patchCopy.diffs = [];
	    for (var y = 0; y < patch.diffs.length; y++) {
	      patchCopy.diffs[y] = patch.diffs[y].slice();
	    }
	    patchCopy.start1 = patch.start1;
	    patchCopy.start2 = patch.start2;
	    patchCopy.length1 = patch.length1;
	    patchCopy.length2 = patch.length2;
	    patchesCopy[x] = patchCopy;
	  }
	  return patchesCopy;
	};
	
	/**
	 * Merge a set of patches onto the text.  Return a patched text, as well
	 * as a list of true/false values indicating which patches were applied.
	 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of patch objects.
	 * @param {string} text Old text.
	 * @return {!Array.<string|!Array.<boolean>>} Two element Array, containing the
	 *      new text and an array of boolean values.
	 */
	diff_match_patch.prototype.patch_apply = function (patches, text) {
	  if (patches.length == 0) {
	    return [text, []];
	  }
	
	  // Deep copy the patches so that no changes are made to originals.
	  patches = this.patch_deepCopy(patches);
	
	  var nullPadding = this.patch_addPadding(patches);
	  text = nullPadding + text + nullPadding;
	
	  this.patch_splitMax(patches);
	  // delta keeps track of the offset between the expected and actual location
	  // of the previous patch.  If there are patches expected at positions 10 and
	  // 20, but the first patch was found at 12, delta is 2 and the second patch
	  // has an effective expected position of 22.
	  var delta = 0;
	  var results = [];
	  for (var x = 0; x < patches.length; x++) {
	    var expected_loc = patches[x].start2 + delta;
	    var text1 = this.diff_text1(patches[x].diffs);
	    var start_loc;
	    var end_loc = -1;
	    if (text1.length > this.Match_MaxBits) {
	      // patch_splitMax will only provide an oversized pattern in the case of
	      // a monster delete.
	      start_loc = this.match_main(text, text1.substring(0, this.Match_MaxBits), expected_loc);
	      if (start_loc != -1) {
	        end_loc = this.match_main(text, text1.substring(text1.length - this.Match_MaxBits), expected_loc + text1.length - this.Match_MaxBits);
	        if (end_loc == -1 || start_loc >= end_loc) {
	          // Can't find valid trailing context.  Drop this patch.
	          start_loc = -1;
	        }
	      }
	    } else {
	      start_loc = this.match_main(text, text1, expected_loc);
	    }
	    if (start_loc == -1) {
	      // No match found.  :(
	      results[x] = false;
	      // Subtract the delta for this failed patch from subsequent patches.
	      delta -= patches[x].length2 - patches[x].length1;
	    } else {
	      // Found a match.  :)
	      results[x] = true;
	      delta = start_loc - expected_loc;
	      var text2;
	      if (end_loc == -1) {
	        text2 = text.substring(start_loc, start_loc + text1.length);
	      } else {
	        text2 = text.substring(start_loc, end_loc + this.Match_MaxBits);
	      }
	      if (text1 == text2) {
	        // Perfect match, just shove the replacement text in.
	        text = text.substring(0, start_loc) + this.diff_text2(patches[x].diffs) + text.substring(start_loc + text1.length);
	      } else {
	        // Imperfect match.  Run a diff to get a framework of equivalent
	        // indices.
	        var diffs = this.diff_main(text1, text2, false);
	        if (text1.length > this.Match_MaxBits && this.diff_levenshtein(diffs) / text1.length > this.Patch_DeleteThreshold) {
	          // The end points match, but the content is unacceptably bad.
	          results[x] = false;
	        } else {
	          this.diff_cleanupSemanticLossless(diffs);
	          var index1 = 0;
	          var index2;
	          for (var y = 0; y < patches[x].diffs.length; y++) {
	            var mod = patches[x].diffs[y];
	            if (mod[0] !== DIFF_EQUAL) {
	              index2 = this.diff_xIndex(diffs, index1);
	            }
	            if (mod[0] === DIFF_INSERT) {
	              // Insertion
	              text = text.substring(0, start_loc + index2) + mod[1] + text.substring(start_loc + index2);
	            } else if (mod[0] === DIFF_DELETE) {
	              // Deletion
	              text = text.substring(0, start_loc + index2) + text.substring(start_loc + this.diff_xIndex(diffs, index1 + mod[1].length));
	            }
	            if (mod[0] !== DIFF_DELETE) {
	              index1 += mod[1].length;
	            }
	          }
	        }
	      }
	    }
	  }
	  // Strip the padding off.
	  text = text.substring(nullPadding.length, text.length - nullPadding.length);
	  return [text, results];
	};
	
	/**
	 * Add some padding on text start and end so that edges can match something.
	 * Intended to be called only from within patch_apply.
	 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of patch objects.
	 * @return {string} The padding string added to each side.
	 */
	diff_match_patch.prototype.patch_addPadding = function (patches) {
	  var paddingLength = this.Patch_Margin;
	  var nullPadding = '';
	  for (var x = 1; x <= paddingLength; x++) {
	    nullPadding += String.fromCharCode(x);
	  }
	
	  // Bump all the patches forward.
	  for (var x = 0; x < patches.length; x++) {
	    patches[x].start1 += paddingLength;
	    patches[x].start2 += paddingLength;
	  }
	
	  // Add some padding on start of first diff.
	  var patch = patches[0];
	  var diffs = patch.diffs;
	  if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
	    // Add nullPadding equality.
	    diffs.unshift([DIFF_EQUAL, nullPadding]);
	    patch.start1 -= paddingLength; // Should be 0.
	    patch.start2 -= paddingLength; // Should be 0.
	    patch.length1 += paddingLength;
	    patch.length2 += paddingLength;
	  } else if (paddingLength > diffs[0][1].length) {
	    // Grow first equality.
	    var extraLength = paddingLength - diffs[0][1].length;
	    diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
	    patch.start1 -= extraLength;
	    patch.start2 -= extraLength;
	    patch.length1 += extraLength;
	    patch.length2 += extraLength;
	  }
	
	  // Add some padding on end of last diff.
	  patch = patches[patches.length - 1];
	  diffs = patch.diffs;
	  if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
	    // Add nullPadding equality.
	    diffs.push([DIFF_EQUAL, nullPadding]);
	    patch.length1 += paddingLength;
	    patch.length2 += paddingLength;
	  } else if (paddingLength > diffs[diffs.length - 1][1].length) {
	    // Grow last equality.
	    var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
	    diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
	    patch.length1 += extraLength;
	    patch.length2 += extraLength;
	  }
	
	  return nullPadding;
	};
	
	/**
	 * Look through the patches and break up any which are longer than the maximum
	 * limit of the match algorithm.
	 * Intended to be called only from within patch_apply.
	 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of patch objects.
	 */
	diff_match_patch.prototype.patch_splitMax = function (patches) {
	  var patch_size = this.Match_MaxBits;
	  for (var x = 0; x < patches.length; x++) {
	    if (patches[x].length1 > patch_size) {
	      var bigpatch = patches[x];
	      // Remove the big old patch.
	      patches.splice(x--, 1);
	      var start1 = bigpatch.start1;
	      var start2 = bigpatch.start2;
	      var precontext = '';
	      while (bigpatch.diffs.length !== 0) {
	        // Create one of several smaller patches.
	        var patch = new diff_match_patch.patch_obj();
	        var empty = true;
	        patch.start1 = start1 - precontext.length;
	        patch.start2 = start2 - precontext.length;
	        if (precontext !== '') {
	          patch.length1 = patch.length2 = precontext.length;
	          patch.diffs.push([DIFF_EQUAL, precontext]);
	        }
	        while (bigpatch.diffs.length !== 0 && patch.length1 < patch_size - this.Patch_Margin) {
	          var diff_type = bigpatch.diffs[0][0];
	          var diff_text = bigpatch.diffs[0][1];
	          if (diff_type === DIFF_INSERT) {
	            // Insertions are harmless.
	            patch.length2 += diff_text.length;
	            start2 += diff_text.length;
	            patch.diffs.push(bigpatch.diffs.shift());
	            empty = false;
	          } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 && patch.diffs[0][0] == DIFF_EQUAL && diff_text.length > 2 * patch_size) {
	            // This is a large deletion.  Let it pass in one chunk.
	            patch.length1 += diff_text.length;
	            start1 += diff_text.length;
	            empty = false;
	            patch.diffs.push([diff_type, diff_text]);
	            bigpatch.diffs.shift();
	          } else {
	            // Deletion or equality.  Only take as much as we can stomach.
	            diff_text = diff_text.substring(0, patch_size - patch.length1 - this.Patch_Margin);
	            patch.length1 += diff_text.length;
	            start1 += diff_text.length;
	            if (diff_type === DIFF_EQUAL) {
	              patch.length2 += diff_text.length;
	              start2 += diff_text.length;
	            } else {
	              empty = false;
	            }
	            patch.diffs.push([diff_type, diff_text]);
	            if (diff_text == bigpatch.diffs[0][1]) {
	              bigpatch.diffs.shift();
	            } else {
	              bigpatch.diffs[0][1] = bigpatch.diffs[0][1].substring(diff_text.length);
	            }
	          }
	        }
	        // Compute the head context for the next patch.
	        precontext = this.diff_text2(patch.diffs);
	        precontext = precontext.substring(precontext.length - this.Patch_Margin);
	        // Append the end context for this patch.
	        var postcontext = this.diff_text1(bigpatch.diffs).substring(0, this.Patch_Margin);
	        if (postcontext !== '') {
	          patch.length1 += postcontext.length;
	          patch.length2 += postcontext.length;
	          if (patch.diffs.length !== 0 && patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
	            patch.diffs[patch.diffs.length - 1][1] += postcontext;
	          } else {
	            patch.diffs.push([DIFF_EQUAL, postcontext]);
	          }
	        }
	        if (!empty) {
	          patches.splice(++x, 0, patch);
	        }
	      }
	    }
	  }
	};
	
	/**
	 * Take a list of patches and return a textual representation.
	 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of patch objects.
	 * @return {string} Text representation of patches.
	 */
	diff_match_patch.prototype.patch_toText = function (patches) {
	  var text = [];
	  for (var x = 0; x < patches.length; x++) {
	    text[x] = patches[x];
	  }
	  return text.join('');
	};
	
	/**
	 * Parse a textual representation of patches and return a list of patch objects.
	 * @param {string} textline Text representation of patches.
	 * @return {!Array.<!diff_match_patch.patch_obj>} Array of patch objects.
	 * @throws {!Error} If invalid input.
	 */
	diff_match_patch.prototype.patch_fromText = function (textline) {
	  var patches = [];
	  if (!textline) {
	    return patches;
	  }
	  var text = textline.split('\n');
	  var textPointer = 0;
	  var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
	  while (textPointer < text.length) {
	    var m = text[textPointer].match(patchHeader);
	    if (!m) {
	      throw new Error('Invalid patch string: ' + text[textPointer]);
	    }
	    var patch = new diff_match_patch.patch_obj();
	    patches.push(patch);
	    patch.start1 = parseInt(m[1], 10);
	    if (m[2] === '') {
	      patch.start1--;
	      patch.length1 = 1;
	    } else if (m[2] == '0') {
	      patch.length1 = 0;
	    } else {
	      patch.start1--;
	      patch.length1 = parseInt(m[2], 10);
	    }
	
	    patch.start2 = parseInt(m[3], 10);
	    if (m[4] === '') {
	      patch.start2--;
	      patch.length2 = 1;
	    } else if (m[4] == '0') {
	      patch.length2 = 0;
	    } else {
	      patch.start2--;
	      patch.length2 = parseInt(m[4], 10);
	    }
	    textPointer++;
	
	    while (textPointer < text.length) {
	      var sign = text[textPointer].charAt(0);
	      try {
	        var line = decodeURI(text[textPointer].substring(1));
	      } catch (ex) {
	        // Malformed URI sequence.
	        throw new Error('Illegal escape in patch_fromText: ' + line);
	      }
	      if (sign == '-') {
	        // Deletion.
	        patch.diffs.push([DIFF_DELETE, line]);
	      } else if (sign == '+') {
	        // Insertion.
	        patch.diffs.push([DIFF_INSERT, line]);
	      } else if (sign == ' ') {
	        // Minor equality.
	        patch.diffs.push([DIFF_EQUAL, line]);
	      } else if (sign == '@') {
	        // Start of next patch.
	        break;
	      } else if (sign === '') {} else {
	        // WTF?
	        throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
	      }
	      textPointer++;
	    }
	  }
	  return patches;
	};
	
	/**
	 * Class representing one patch operation.
	 * @constructor
	 */
	diff_match_patch.patch_obj = function () {
	  /** @type {!Array.<!diff_match_patch.Diff>} */
	  this.diffs = [];
	  /** @type {?number} */
	  this.start1 = null;
	  /** @type {?number} */
	  this.start2 = null;
	  /** @type {number} */
	  this.length1 = 0;
	  /** @type {number} */
	  this.length2 = 0;
	};
	
	/**
	 * Emmulate GNU diff's format.
	 * Header: @@ -382,8 +481,9 @@
	 * Indicies are printed as 1-based, not 0-based.
	 * @return {string} The GNU diff string.
	 */
	diff_match_patch.patch_obj.prototype.toString = function () {
	  var coords1, coords2;
	  if (this.length1 === 0) {
	    coords1 = this.start1 + ',0';
	  } else if (this.length1 == 1) {
	    coords1 = this.start1 + 1;
	  } else {
	    coords1 = this.start1 + 1 + ',' + this.length1;
	  }
	  if (this.length2 === 0) {
	    coords2 = this.start2 + ',0';
	  } else if (this.length2 == 1) {
	    coords2 = this.start2 + 1;
	  } else {
	    coords2 = this.start2 + 1 + ',' + this.length2;
	  }
	  var text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
	  var op;
	  // Escape the body of the patch with %xx notation.
	  for (var x = 0; x < this.diffs.length; x++) {
	    switch (this.diffs[x][0]) {
	      case DIFF_INSERT:
	        op = '+';
	        break;
	      case DIFF_DELETE:
	        op = '-';
	        break;
	      case DIFF_EQUAL:
	        op = ' ';
	        break;
	    }
	    text[x + 1] = op + encodeURI(this.diffs[x][1]) + '\n';
	  }
	  return text.join('').replace(/%20/g, ' ');
	};
	
	// Export these global variables so that they survive Google's JS compiler.
	// In a browser, 'this' will be 'window'.
	// In node.js 'this' will be a global object.
	undefined['diff_match_patch'] = diff_match_patch;
	undefined['DIFF_DELETE'] = DIFF_DELETE;
	undefined['DIFF_INSERT'] = DIFF_INSERT;
	undefined['DIFF_EQUAL'] = DIFF_EQUAL;
	/** @type {string} */ /** @type {string} */ /** @type {!Array.<string>} */ /** @type {string} */ /** @type {string} */ /** @type {string} */ /** @type {string} */ /** @type {string} */ /** @type {string} */ /** @type {string} */ /** @type {string} */ /** @type {!Array.<!diff_match_patch.Diff>} */ /** @type {string} */ /** @type {!Array.<!diff_match_patch.Diff>} */ /** @type {string} */ /** @type {!Array.<!diff_match_patch.Diff>} */
	// Blank line?  Whatever.

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var escapeStringRegexp = __webpack_require__(41);
	var ansiStyles = __webpack_require__(42);
	var stripAnsi = __webpack_require__(43);
	var hasAnsi = __webpack_require__(44);
	var supportsColor = __webpack_require__(45);
	var defineProps = Object.defineProperties;
	var chalk = module.exports;
	
	function build(_styles) {
		var builder = function builder() {
			return applyStyle.apply(builder, arguments);
		};
		builder._styles = _styles;
		// __proto__ is used because we must return a function, but there is
		// no way to create a function with a different prototype.
		builder.__proto__ = proto;
		return builder;
	}
	
	var styles = (function () {
		var ret = {};
	
		ansiStyles.grey = ansiStyles.gray;
	
		Object.keys(ansiStyles).forEach(function (key) {
			ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
	
			ret[key] = {
				get: function get() {
					return build(this._styles.concat(key));
				}
			};
		});
	
		return ret;
	})();
	
	var proto = defineProps(function chalk() {}, styles);
	
	function applyStyle() {
		// support varags, but simply cast to string in case there's only one arg
		var args = arguments;
		var argsLen = args.length;
		var str = argsLen !== 0 && String(arguments[0]);
		if (argsLen > 1) {
			// don't slice `arguments`, it prevents v8 optimizations
			for (var a = 1; a < argsLen; a++) {
				str += ' ' + args[a];
			}
		}
	
		if (!chalk.enabled || !str) {
			return str;
		}
	
		/*jshint validthis: true*/
		var nestedStyles = this._styles;
	
		for (var i = 0; i < nestedStyles.length; i++) {
			var code = ansiStyles[nestedStyles[i]];
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			str = code.open + str.replace(code.closeRe, code.open) + code.close;
		}
	
		return str;
	}
	
	function init() {
		var ret = {};
	
		Object.keys(styles).forEach(function (name) {
			ret[name] = {
				get: function get() {
					return build([name]);
				}
			};
		});
	
		return ret;
	}
	
	defineProps(chalk, init());
	
	chalk.styles = ansiStyles;
	chalk.hasColor = hasAnsi;
	chalk.stripColor = stripAnsi;
	chalk.supportsColor = supportsColor;
	
	// detect mode if not set manually
	if (chalk.enabled === undefined) {
		chalk.enabled = chalk.supportsColor;
	}

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
	
	module.exports = function (str) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string');
		}
	
		return str.replace(matchOperatorsRe, '\\$&');
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var styles = module.exports;
	
	var codes = {
		reset: [0, 0],
	
		bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
		dim: [2, 22],
		italic: [3, 23],
		underline: [4, 24],
		inverse: [7, 27],
		hidden: [8, 28],
		strikethrough: [9, 29],
	
		black: [30, 39],
		red: [31, 39],
		green: [32, 39],
		yellow: [33, 39],
		blue: [34, 39],
		magenta: [35, 39],
		cyan: [36, 39],
		white: [37, 39],
		gray: [90, 39],
	
		bgBlack: [40, 49],
		bgRed: [41, 49],
		bgGreen: [42, 49],
		bgYellow: [43, 49],
		bgBlue: [44, 49],
		bgMagenta: [45, 49],
		bgCyan: [46, 49],
		bgWhite: [47, 49]
	};
	
	Object.keys(codes).forEach(function (key) {
		var val = codes[key];
		var style = styles[key] = {};
		style.open = '\u001b[' + val[0] + 'm';
		style.close = '\u001b[' + val[1] + 'm';
	});

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(46)();
	
	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(48);
	var re = new RegExp(ansiRegex().source); // remove the `g` flag
	module.exports = re.test.bind(re);

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	module.exports = (function () {
		if (process.argv.indexOf('--no-color') !== -1) {
			return false;
		}
	
		if (process.argv.indexOf('--color') !== -1) {
			return true;
		}
	
		if (process.stdout && !process.stdout.isTTY) {
			return false;
		}
	
		if (process.platform === 'win32') {
			return true;
		}
	
		if ('COLORTERM' in process.env) {
			return true;
		}
	
		if (process.env.TERM === 'dumb') {
			return false;
		}
	
		if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
			return true;
		}
	
		return false;
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(47)))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	module.exports = function () {
		return /\u001b\[(?:[0-9]{1,3}(?:;[0-9]{1,3})*)?[m|K]/g;
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser
	
	'use strict';
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            currentQueue[queueIndex].run();
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (!draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	// TODO(shtylman)
	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	module.exports = function () {
		return /\u001b\[(?:[0-9]{1,3}(?:;[0-9]{1,3})*)?[m|K]/g;
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjMjJjMzFjMmZiNTE0OGZkYjUwNCIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2ZpbHRlcnMvbGNzLmpzIiwid2VicGFjazovLy8uL2xpYi9Qb29sLmpzIiwid2VicGFjazovLy8uL2xpYi9SRVNUZnVsLmpzIiwid2VicGFjazovLy8uL2xpYi9UcmFuc2FjdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9saWIvZGlmZi5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJfXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXVpZFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIlFcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxqb2luXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQmFja2JvbmVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCIkXCIiLCJ3ZWJwYWNrOi8vLy4vbGliL1Jlc3BvbnNlLmpzIiwid2VicGFjazovLy8uL34vanNvbmRpZmZwYXRjaC9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2pzb25kaWZmcGF0Y2gvc3JjIF5cXC5cXC8uKiQiLCJ3ZWJwYWNrOi8vLy4vfi9qc29uZGlmZnBhdGNoL3NyYy9lbnZpcm9ubWVudC5qcyIsIndlYnBhY2s6Ly8vLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2RpZmZwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL34vanNvbmRpZmZwYXRjaC9zcmMvZGF0ZS1yZXZpdmVyLmpzIiwid2VicGFjazovLy8uL34vanNvbmRpZmZwYXRjaC9zcmMvY29udGV4dHMvY29udGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2NvbnRleHRzL2RpZmYuanMiLCJ3ZWJwYWNrOi8vLy4vfi9qc29uZGlmZnBhdGNoL3NyYy9jb250ZXh0cy9wYXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2NvbnRleHRzL3JldmVyc2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9qc29uZGlmZnBhdGNoL3NyYy9maWx0ZXJzL2FycmF5cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2ZpbHRlcnMvZGF0ZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1Jlc291cmNlLmpzIiwid2VicGFjazovLy8uL34vanNvbmRpZmZwYXRjaC9zcmMvZmlsdGVycy9uZXN0ZWQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9qc29uZGlmZnBhdGNoL3NyYy9maWx0ZXJzL3RleHRzLmpzIiwid2VicGFjazovLy8uL34vanNvbmRpZmZwYXRjaC9zcmMvZmlsdGVycy90cml2aWFsLmpzIiwid2VicGFjazovLy8uL34vanNvbmRpZmZwYXRjaC9zcmMvZm9ybWF0dGVycy9hbm5vdGF0ZWQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9qc29uZGlmZnBhdGNoL3NyYy9mb3JtYXR0ZXJzL2Jhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9qc29uZGlmZnBhdGNoL3NyYy9mb3JtYXR0ZXJzL2NvbnNvbGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9qc29uZGlmZnBhdGNoL3NyYy9mb3JtYXR0ZXJzL2h0bWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9qc29uZGlmZnBhdGNoL3NyYy9mb3JtYXR0ZXJzL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vanNvbmRpZmZwYXRjaC9zcmMvbWFpbi1mb3JtYXR0ZXJzLmpzIiwid2VicGFjazovLy8uL34vanNvbmRpZmZwYXRjaC9zcmMvbWFpbi1mdWxsLmpzIiwid2VicGFjazovLy8uL34vanNvbmRpZmZwYXRjaC9zcmMvcGlwZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2pzb25kaWZmcGF0Y2gvc3JjL3Byb2Nlc3Nvci5qcyIsIndlYnBhY2s6Ly8vLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2Zvcm1hdHRlcnMgXlxcLlxcLy4qJCIsIndlYnBhY2s6Ly8vLi9+L2pzb25kaWZmcGF0Y2gvcHVibGljL2V4dGVybmFsIF5cXC5cXC8uKiQiLCJ3ZWJwYWNrOi8vLy4vfi9qc29uZGlmZnBhdGNoL3B1YmxpYy9leHRlcm5hbC9kaWZmX21hdGNoX3BhdGNoX3VuY29tcHJlc3NlZC5qcyIsIndlYnBhY2s6Ly8vLi9+L2pzb25kaWZmcGF0Y2gvfi9jaGFsay9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2pzb25kaWZmcGF0Y2gvfi9jaGFsay9+L2VzY2FwZS1zdHJpbmctcmVnZXhwL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vanNvbmRpZmZwYXRjaC9+L2NoYWxrL34vYW5zaS1zdHlsZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9qc29uZGlmZnBhdGNoL34vY2hhbGsvfi9zdHJpcC1hbnNpL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vanNvbmRpZmZwYXRjaC9+L2NoYWxrL34vaGFzLWFuc2kvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9qc29uZGlmZnBhdGNoL34vY2hhbGsvfi9zdXBwb3J0cy1jb2xvci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2pzb25kaWZmcGF0Y2gvfi9jaGFsay9+L3N0cmlwLWFuc2kvfi9hbnNpLXJlZ2V4L2luZGV4LmpzIiwid2VicGFjazovLy8uL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9qc29uZGlmZnBhdGNoL34vY2hhbGsvfi9oYXMtYW5zaS9+L2Fuc2ktcmVnZXgvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FB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Z0IsRUFBRyxNQUFNLENBQUMsQ0FBQztFQUM5QyxDOzs7Ozs7QUNWRCxhQUFZLENBQUM7QUFDYixLQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDOztBQUU1QixLQUFJLEtBQUssR0FBRztBQUNYLE9BQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRWIsTUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNiLEtBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDWixRQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2YsV0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNsQixTQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2hCLFFBQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDZixlQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDOztBQUV0QixPQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ2YsS0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUNiLE9BQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDZixRQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ2hCLE1BQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDZCxTQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ2pCLE1BQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDZCxPQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ2YsTUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQzs7QUFFZCxTQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ2pCLE9BQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDZixTQUFPLEVBQUUsQ0FB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QUFFbEIsUUFBTyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDM0IsUUFBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBTyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDOUIsUUFBTyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUNsQyxRQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFcEIsUUFBTyxDQUFDLE9BQU8sR0FBRyxVQUFVLElBQUksRUFBRTtBQUM5QixXQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7RUFDdkQsQ0FBQzs7O0FBR0YsUUFBTyxDQUFDLEdBQUcsR0FBRyxZQUFZO0FBQUUsWUFBTyxHQUFHO0VBQUUsQ0FBQztBQUN6QyxRQUFPLENBQUMsS0FBSyxHQUFHLFVBQVUsR0FBRyxFQUFFO0FBQzNCLFdBQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztFQUNyRCxDQUFDO0FBQ0YsUUFBTyxDQUFDLEtBQUssR0FBRyxZQUFXO0FBQUUsWUFBTyxDQUFDLENBQUM7RUFBRSxDOzs7Ozs7QUN6RnhDLGFBQVksQ0FBQztBQUNiLE9BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWTtBQUM1QixTQUFPLCtDQUErQyxDQUFDO0VBQ3ZELEMiLCJmaWxlIjoianNvbmFwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcIl9cIiksIHJlcXVpcmUoXCJ1dWlkXCIpLCByZXF1aXJlKFwiUVwiKSwgcmVxdWlyZShcInVybGpvaW5cIiksIHJlcXVpcmUoXCJCYWNrYm9uZVwiKSwgcmVxdWlyZShcIiRcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiX1wiLCBcInV1aWRcIiwgXCJRXCIsIFwidXJsam9pblwiLCBcIkJhY2tib25lXCIsIFwiJFwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJKU09OQVBJXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiX1wiKSwgcmVxdWlyZShcInV1aWRcIiksIHJlcXVpcmUoXCJRXCIpLCByZXF1aXJlKFwidXJsam9pblwiKSwgcmVxdWlyZShcIkJhY2tib25lXCIpLCByZXF1aXJlKFwiJFwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiSlNPTkFQSVwiXSA9IGZhY3Rvcnkocm9vdFtcIl9cIl0sIHJvb3RbXCJ1dWlkXCJdLCByb290W1wiUVwiXSwgcm9vdFtcInVybGpvaW5cIl0sIHJvb3RbXCJCYWNrYm9uZVwiXSwgcm9vdFtcIiRcIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV82X18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfN19fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzhfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV85X18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMTBfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xMV9fKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBjMjJjMzFjMmZiNTE0OGZkYjUwNFxuICoqLyIsImltcG9ydCBSZXNvdXJjZSBmcm9tICcuL2xpYi9SZXNvdXJjZSc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL2xpYi9Qb29sJztcbmltcG9ydCBSRVNUZnVsIGZyb20gJy4vbGliL1JFU1RmdWwnO1xuaW1wb3J0IFRyYW5zYWN0aW9uIGZyb20gJy4vbGliL1RyYW5zYWN0aW9uJztcbmltcG9ydCBkaWZmIGZyb20gJy4vbGliL2RpZmYnO1xuXG5cbmV4cG9ydCB7XG4gIFRyYW5zYWN0aW9uLFxuICBSZXNvdXJjZSxcbiAgUG9vbCxcbiAgUkVTVGZ1bCxcbiAgZGlmZlxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vaW5kZXguanNcbiAqKi8iLCIvKlxuXG5MQ1MgaW1wbGVtZW50YXRpb24gdGhhdCBzdXBwb3J0cyBhcnJheXMgb3Igc3RyaW5nc1xuXG5yZWZlcmVuY2U6IGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTG9uZ2VzdF9jb21tb25fc3Vic2VxdWVuY2VfcHJvYmxlbVxuXG4qL1xuXG52YXIgZGVmYXVsdE1hdGNoID0gZnVuY3Rpb24oYXJyYXkxLCBhcnJheTIsIGluZGV4MSwgaW5kZXgyKSB7XG4gIHJldHVybiBhcnJheTFbaW5kZXgxXSA9PT0gYXJyYXkyW2luZGV4Ml07XG59O1xuXG52YXIgbGVuZ3RoTWF0cml4ID0gZnVuY3Rpb24oYXJyYXkxLCBhcnJheTIsIG1hdGNoLCBjb250ZXh0KSB7XG4gIHZhciBsZW4xID0gYXJyYXkxLmxlbmd0aDtcbiAgdmFyIGxlbjIgPSBhcnJheTIubGVuZ3RoO1xuICB2YXIgeCwgeTtcblxuICAvLyBpbml0aWFsaXplIGVtcHR5IG1hdHJpeCBvZiBsZW4xKzEgeCBsZW4yKzFcbiAgdmFyIG1hdHJpeCA9IFtsZW4xICsgMV07XG4gIGZvciAoeCA9IDA7IHggPCBsZW4xICsgMTsgeCsrKSB7XG4gICAgbWF0cml4W3hdID0gW2xlbjIgKyAxXTtcbiAgICBmb3IgKHkgPSAwOyB5IDwgbGVuMiArIDE7IHkrKykge1xuICAgICAgbWF0cml4W3hdW3ldID0gMDtcbiAgICB9XG4gIH1cbiAgbWF0cml4Lm1hdGNoID0gbWF0Y2g7XG4gIC8vIHNhdmUgc2VxdWVuY2UgbGVuZ3RocyBmb3IgZWFjaCBjb29yZGluYXRlXG4gIGZvciAoeCA9IDE7IHggPCBsZW4xICsgMTsgeCsrKSB7XG4gICAgZm9yICh5ID0gMTsgeSA8IGxlbjIgKyAxOyB5KyspIHtcbiAgICAgIGlmIChtYXRjaChhcnJheTEsIGFycmF5MiwgeCAtIDEsIHkgLSAxLCBjb250ZXh0KSkge1xuICAgICAgICBtYXRyaXhbeF1beV0gPSBtYXRyaXhbeCAtIDFdW3kgLSAxXSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXRyaXhbeF1beV0gPSBNYXRoLm1heChtYXRyaXhbeCAtIDFdW3ldLCBtYXRyaXhbeF1beSAtIDFdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1hdHJpeDtcbn07XG5cbnZhciBiYWNrdHJhY2sgPSBmdW5jdGlvbihtYXRyaXgsIGFycmF5MSwgYXJyYXkyLCBpbmRleDEsIGluZGV4MiwgY29udGV4dCkge1xuICBpZiAoaW5kZXgxID09PSAwIHx8IGluZGV4MiA9PT0gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBzZXF1ZW5jZTogW10sXG4gICAgICBpbmRpY2VzMTogW10sXG4gICAgICBpbmRpY2VzMjogW11cbiAgICB9O1xuICB9XG5cbiAgaWYgKG1hdHJpeC5tYXRjaChhcnJheTEsIGFycmF5MiwgaW5kZXgxIC0gMSwgaW5kZXgyIC0gMSwgY29udGV4dCkpIHtcbiAgICB2YXIgc3Vic2VxdWVuY2UgPSBiYWNrdHJhY2sobWF0cml4LCBhcnJheTEsIGFycmF5MiwgaW5kZXgxIC0gMSwgaW5kZXgyIC0gMSwgY29udGV4dCk7XG4gICAgc3Vic2VxdWVuY2Uuc2VxdWVuY2UucHVzaChhcnJheTFbaW5kZXgxIC0gMV0pO1xuICAgIHN1YnNlcXVlbmNlLmluZGljZXMxLnB1c2goaW5kZXgxIC0gMSk7XG4gICAgc3Vic2VxdWVuY2UuaW5kaWNlczIucHVzaChpbmRleDIgLSAxKTtcbiAgICByZXR1cm4gc3Vic2VxdWVuY2U7XG4gIH1cblxuICBpZiAobWF0cml4W2luZGV4MV1baW5kZXgyIC0gMV0gPiBtYXRyaXhbaW5kZXgxIC0gMV1baW5kZXgyXSkge1xuICAgIHJldHVybiBiYWNrdHJhY2sobWF0cml4LCBhcnJheTEsIGFycmF5MiwgaW5kZXgxLCBpbmRleDIgLSAxLCBjb250ZXh0KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFja3RyYWNrKG1hdHJpeCwgYXJyYXkxLCBhcnJheTIsIGluZGV4MSAtIDEsIGluZGV4MiwgY29udGV4dCk7XG4gIH1cbn07XG5cbnZhciBnZXQgPSBmdW5jdGlvbihhcnJheTEsIGFycmF5MiwgbWF0Y2gsIGNvbnRleHQpIHtcbiAgY29udGV4dCA9IGNvbnRleHQgfHwge307XG4gIHZhciBtYXRyaXggPSBsZW5ndGhNYXRyaXgoYXJyYXkxLCBhcnJheTIsIG1hdGNoIHx8IGRlZmF1bHRNYXRjaCwgY29udGV4dCk7XG4gIHZhciByZXN1bHQgPSBiYWNrdHJhY2sobWF0cml4LCBhcnJheTEsIGFycmF5MiwgYXJyYXkxLmxlbmd0aCwgYXJyYXkyLmxlbmd0aCwgY29udGV4dCk7XG4gIGlmICh0eXBlb2YgYXJyYXkxID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgYXJyYXkyID09PSAnc3RyaW5nJykge1xuICAgIHJlc3VsdC5zZXF1ZW5jZSA9IHJlc3VsdC5zZXF1ZW5jZS5qb2luKCcnKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0cy5nZXQgPSBnZXQ7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vanNvbmRpZmZwYXRjaC9zcmMvZmlsdGVycy9sY3MuanNcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgdXJsam9pbiBmcm9tICd1cmwtam9pbic7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuaW1wb3J0IGRpZmYgZnJvbSAnLi9kaWZmJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCBSRVNUZnVsIGZyb20gJy4vUkVTVGZ1bCc7XG5cblxuY2xhc3MgUG9vbCB7XG5cbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcblxuICAgIHRoaXMuc3luYyA9IFJFU1RmdWw7XG4gICAgdGhpcy5yZXNldEFsbCgpO1xuXG4gIH1cblxuICByZXNldEFsbCAoKSB7XG5cbiAgICB0aGlzLnBvb2wgPSB7fTtcbiAgICB0aGlzLmJsb2JzID0ge307XG4gICAgdGhpcy5zdGFnZWQgPSB7fTtcbiAgICB0aGlzLnN0YWdlZExpbmsgPSBbXTtcbiAgICB0aGlzLnJlbW90ZSA9IHt9O1xuICAgIHRoaXMuY29tbWl0cyA9IFtdO1xuICAgIHRoaXMucmVtb3RlSW5kZXggPSAtMTtcblxuICB9XG5cbiAgZ2V0Q29tbWl0IChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCAhPT0gdW5kZWZpbmVkID8gaWR4IDogdGhpcy5jb21taXRzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIHRoaXMuY29tbWl0c1tpZHhdIHx8IHt9O1xuXG4gIH1cblxuICBzZXRSZW1vdGVJbmRleCAoaWR4KSB7XG5cbiAgICBpZHggPSBpZHggIT09IHVuZGVmaW5lZCA/IGlkeCA6IHRoaXMuY29tbWl0cy5sZW5ndGggLSAxO1xuICAgIHRoaXMucmVtb3RlSW5kZXggPSBpZHg7XG5cbiAgfVxuXG4gIHJtIChyZXNvdXJjZSkge1xuXG4gICAgaWYoXy5pc0FycmF5KHJlc291cmNlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKHJlc291cmNlLCByZXNvdXJjZSA9PiB0aGlzLnJtKHJlc291cmNlKSk7XG4gICAgfVxuXG4gICAgbGV0IHJpZCA9IHJlc291cmNlLnJpZDtcblxuICAgIHRoaXMuc3RhZ2VkW3JpZF0gPSBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhZ2VkW3JpZF07XG5cbiAgfVxuXG4gIGFkZCAocmVzb3VyY2UpIHtcblxuICAgIGlmKF8uaXNBcnJheShyZXNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChyZXNvdXJjZSwgcmVzb3VyY2UgPT4gdGhpcy5hZGQocmVzb3VyY2UpKTtcbiAgICB9XG5cbiAgICBsZXQgcmlkID0gcmVzb3VyY2UucmlkO1xuXG4gICAgaWYgKCF0aGlzLnBvb2xbcmlkXSkge1xuICAgICAgdGhpcy5wb29sW3JpZF0gPSByZXNvdXJjZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YWdlZFtyaWRdID0gcmVzb3VyY2Uuc2VyaWFsaXplKCk7XG5cbiAgICByZXR1cm4gdGhpcy5zdGFnZWRbcmlkXTtcblxuICB9XG5cbiAgcm1MaW5rYWdlIChyZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVMaW5rYWdlT3BlcmF0aW9uKFxuICAgICAgJ3JlbW92ZScsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucyk7XG5cbiAgfVxuXG4gIGFkZExpbmthZ2UgKHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykge1xuXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24oXG4gICAgICAnYWRkJywgcmVzb3VyY2UsIHJlbGF0aW9uLCBsaW5rYWdlLCBvcHRpb25zKTtcblxuICB9XG5cbiAgX2NyZWF0ZUxpbmthZ2VPcGVyYXRpb24gKG9wLCByZXNvdXJjZSwgcmVsYXRpb24sIGxpbmthZ2UsIG9wdGlvbnMpIHtcblxuICAgIGlmKF8uaXNBcnJheShsaW5rYWdlKSkge1xuICAgICAgcmV0dXJuIF8ubWFwKGxpbmthZ2UsIGxpbmthZ2UgPT4gdGhpcy5fY3JlYXRlTGlua2FnZU9wZXJhdGlvbihcbiAgICAgICAgb3AsIHJlc291cmNlLCByZWxhdGlvbiwgbGlua2FnZSwgb3B0aW9ucykpO1xuICAgIH1cblxuICAgIGxldCBzdGFnZWQgPSB7XG4gICAgICBvcCxcbiAgICAgIHJlc291cmNlLFxuICAgICAgcmVsYXRpb24sXG4gICAgICBsaW5rYWdlLFxuICAgICAgb3B0aW9uc1xuICAgIH07XG5cbiAgICB0aGlzLnN0YWdlZExpbmsucHVzaChzdGFnZWQpO1xuXG4gICAgcmV0dXJuIHN0YWdlZDtcblxuICB9XG5cbiAgZ2V0U3RhZ2VkIChyZXNvdXJjZSkge1xuXG4gICAgaWYgKCF0aGlzLmlzU3RhZ2VkKHJlc291cmNlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoYGNhbiBub3QgZmluZCAke3Jlc291cmNlfWApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyZXNvdXJjZS5yaWRdO1xuXG4gIH1cblxuICBpc1N0YWdlZCAocmVzb3VyY2UpIHtcblxuICAgIHJldHVybiB0aGlzLnN0YWdlZFtyZXNvdXJjZS5yaWRdICE9PSB1bmRlZmluZWQ7XG5cbiAgfVxuXG4gIGNvbW1pdCAoKSB7XG5cbiAgICBsZXQgbGFzdENvbW1pdCA9IHRoaXMuZ2V0Q29tbWl0KCk7XG5cbiAgICBsZXQgbmV3Q29tbWl0ID0gXy5yZWR1Y2UodGhpcy5zdGFnZWQsIChjb21taXQsIHNlcmlhbGl6ZWQsIHJpZCkgPT4ge1xuICAgICAgaWYgKCFzZXJpYWxpemVkKSB7XG4gICAgICAgIGlmIChjb21taXRbcmlkXSkge1xuICAgICAgICAgIGRlbGV0ZSBjb21taXRbcmlkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbW1pdFtyaWRdID0gdGhpcy5fY3JlYXRlQmxvYihzZXJpYWxpemVkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb21taXQ7XG4gICAgfSwgXy5jbG9uZShsYXN0Q29tbWl0LCB0cnVlKSk7XG5cbiAgICBfLnJlZHVjZSh0aGlzLnN0YWdlZExpbmssIChjb21taXQsIGxpbmtPcGVyYXRpb24pID0+IHtcbiAgICAgIGNvbW1pdFt1dWlkLnY0KCldID0gbGlua09wZXJhdGlvbjtcbiAgICAgIHJldHVybiBjb21taXQ7XG4gICAgfSwgbmV3Q29tbWl0KTtcblxuICAgIHRoaXMuY29tbWl0cy5wdXNoKG5ld0NvbW1pdCk7XG4gICAgdGhpcy5zdGFnZWQgPSB7fTtcbiAgICB0aGlzLnN0YWdlZExpbmsgPSBbXTtcblxuICB9XG5cbiAgYWRkUmVtb3RlICh0eXBlLCB1cmwpIHtcblxuICAgIHRoaXMucmVtb3RlW3R5cGVdID0gdXJsO1xuXG4gIH1cblxuICBnZXRSZW1vdGUgKHR5cGUsIGlkLCByZWxhdGlvbikge1xuXG4gICAgbGV0IHVybFBhcnRzID0gXy5jb21wYWN0KFtcbiAgICAgIHRoaXMucmVtb3RlW3R5cGVdLFxuICAgICAgaWQsXG4gICAgICByZWxhdGlvbiA/ICdsaW5rcycgOiB1bmRlZmluZWQsXG4gICAgICByZWxhdGlvblxuICAgIF0pO1xuICAgIHJldHVybiB1cmxqb2luLmFwcGx5KG51bGwsIHVybFBhcnRzKTtcblxuICB9XG5cbiAgZ2V0ICh0eXBlLCBpZCkge1xuXG4gICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLnBvb2wsIHJlc291cmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc291cmNlLmdldCgndHlwZScpID09PSB0eXBlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF8uZmluZCh0aGlzLnBvb2wsIHJlc291cmNlID0+IHtcbiAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoJ3R5cGUnKSA9PT0gdHlwZSAmJlxuICAgICAgICByZXNvdXJjZS5nZXQoJ2lkJykgPT09IGlkO1xuICAgIH0pO1xuXG4gIH1cblxuICBoYXMgKHR5cGUsIGlkKSB7XG5cbiAgICByZXR1cm4gISFfLmZpbmQodGhpcy5wb29sLCByZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCd0eXBlJykgPT09IHR5cGUgJiZcbiAgICAgICAgcmVzb3VyY2UuZ2V0KCdpZCcpID09PSBpZDtcbiAgICB9KTtcblxuICB9XG5cbiAgX2NyZWF0ZUJsb2IgKHNlcmlhbGl6ZWQpIHtcblxuICAgIGxldCBiaWQgPSB1dWlkLnY0KCk7XG4gICAgdGhpcy5ibG9ic1tiaWRdID0gXy5jbG9uZShzZXJpYWxpemVkLCB0cnVlKTtcbiAgICByZXR1cm4gdGhpcy5ibG9ic1tiaWRdO1xuXG4gIH1cblxuICBfZ2V0QmxvYiAoYmlkKSB7XG5cbiAgICByZXR1cm4gdGhpcy5ibG9ic1tiaWRdO1xuXG4gIH1cblxuICBwdWxsQnlMaW5rIChsaW5rLCBvcHRpb25zKSB7XG5cbiAgICBsZXQgdXJsO1xuICAgIGlmIChfLmlzU3RyaW5nKGxpbmspKSB7XG4gICAgICB1cmwgPSBsaW5rO1xuICAgIH1cbiAgICBlbHNlIGlmIChsaW5rLmxpbmthZ2UpIHtcbiAgICAgIHVybCA9IHRoaXMuZ2V0UmVtb3RlKGxpbmsubGlua2FnZS50eXBlLCBsaW5rLmxpbmthZ2UuaWQpO1xuICAgIH1cbiAgICBlbHNlIGlmIChsaW5rLnJlbGF0ZWQpIHtcbiAgICAgIHVybCA9IGxpbmsucmVsYXRlZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgbGluay4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wdWxsQnlVUkwodXJsLCBvcHRpb25zKTtcblxuICB9XG5cbiAgcHVsbCAodHlwZSwgaWQsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiB0aGlzLnB1bGxCeVVSTCh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCksIG9wdGlvbnMpO1xuXG4gIH1cblxuICBwdWxsQnlVUkwgKHVybCwgb3B0aW9ucykge1xuXG4gICAgaWYgKCFfLmlzRW1wdHkodGhpcy5zdGFnZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3B1bGwgd2hlbiBzdGFnZWQgY2hhbmdlIGlzIG5vdCBleGlzdCcpO1xuICAgIH1cblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgbGV0IGluY2x1ZGVkID0gb3B0aW9ucy5pbmNsdWRlZDtcbiAgICBpZiAoaW5jbHVkZWQpIHtcbiAgICAgIG9wdGlvbnMuaW5jbHVkZWQgPSBpbmNsdWRlZC5qb2luKCcsJyk7XG4gICAgfVxuXG4gICAgbGV0IGZpZWxkcyA9IG9wdGlvbnMuZmllbGRzO1xuICAgIGlmIChmaWVsZHMpIHtcbiAgICAgIF8ucmVkdWNlKGZpZWxkcywgKG9wdGlvbnMsIGZpZWxkcywgdHlwZSkgPT4ge1xuICAgICAgICBvcHRpb25zW2BmaWVsZHNbJHt0eXBlfV1gXSA9IGZpZWxkcy5qb2luKCcsJyk7XG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgICAgfSwgb3B0aW9ucyk7XG4gICAgICBkZWxldGUgb3B0aW9ucy5maWVsZHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3luYy5nZXQodXJsLCBvcHRpb25zKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9zYXZlUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgIH0pO1xuXG4gIH1cblxuICBwdXNoIChpZHgpIHtcblxuICAgIGlkeCA9IGlkeCB8fCB0aGlzLmNvbW1pdHMubGVuZ3RoIC0gMTtcblxuICAgIGlmIChpZHggPD0gdGhpcy5yZW1vdGVJbmRleCkge1xuICAgICAgcmV0dXJuIFEoKTtcbiAgICB9XG5cbiAgICBsZXQgYWZ0ZXJDb21taXQgPSB0aGlzLmdldENvbW1pdChpZHgpO1xuICAgIGxldCBiZWZvcmVDb21taXQgPSB0aGlzLmdldENvbW1pdCh0aGlzLnJlbW90ZUluZGV4KTtcblxuICAgIGxldCByZW1vdmVkID0gXy5kaWZmZXJlbmNlKFxuICAgICAgXy5rZXlzKGJlZm9yZUNvbW1pdCksXG4gICAgICBfLmtleXMoYWZ0ZXJDb21taXQpXG4gICAgKTtcblxuICAgIGxldCBjaGFuZ2VkT3JBZGRlZCA9IF8ud2l0aG91dChcbiAgICAgIF8ua2V5cyhhZnRlckNvbW1pdCksXG4gICAgICBfLmtleXMocmVtb3ZlZClcbiAgICApO1xuXG4gICAgbGV0IGRlbGV0ZVJlcXVlc3QgPSBfLm1hcChyZW1vdmVkLCByaWQgPT4ge1xuICAgICAgLy8gaXMgTGlua1xuICAgICAgaWYgKCF0aGlzLnBvb2xbcmlkXSkgeyByZXR1cm47IH1cblxuICAgICAgbGV0IHR5cGUgPSB0aGlzLnBvb2xbcmlkXS5nZXQoJ3R5cGUnKTtcbiAgICAgIGxldCBpZCA9IHRoaXMucG9vbFtyaWRdLmdldCgnaWQnKTtcbiAgICAgIGlmIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLmRlbGV0ZSh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCkpXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMucG9vbFtyaWRdO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHBvc3RPclBhdGNoUmVxdWVzdCA9IF8ubWFwKGNoYW5nZWRPckFkZGVkLCByaWQgPT4ge1xuICAgICAgLy8gaXMgTGlua1xuICAgICAgaWYgKCF0aGlzLnBvb2xbcmlkXSkgeyByZXR1cm47IH1cbiAgICAgIC8vIG5vdCBjaGFuZ2VcbiAgICAgIGlmIChfLmlzRXF1YWwoYWZ0ZXJDb21taXRbcmlkXSwgYmVmb3JlQ29tbWl0W3JpZF0pKSB7IHJldHVybjsgfVxuXG4gICAgICBsZXQgdHlwZSA9IHRoaXMucG9vbFtyaWRdLmdldCgndHlwZScpO1xuICAgICAgbGV0IGlkID0gdGhpcy5wb29sW3JpZF0uZ2V0KCdpZCcpO1xuICAgICAgbGV0IGRlbHRhID0gZGlmZihiZWZvcmVDb21taXRbcmlkXSwgYWZ0ZXJDb21taXRbcmlkXSk7XG5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICBfLmV4dGVuZChkZWx0YSwgeyB0eXBlLCBpZCB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5wYXRjaCh0aGlzLmdldFJlbW90ZSh0eXBlLCBpZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9SZXF1ZXN0KGRlbHRhKSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB0aGlzLl9zYXZlUmVzcG9uc2UocmVzcG9uc2UsIHJpZCkpO1xuICAgICAgfVxuICAgICAgaWYgKCFpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jLnBvc3QodGhpcy5nZXRSZW1vdGUodHlwZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90b1JlcXVlc3QoZGVsdGEpKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHRoaXMuX3NhdmVSZXNwb25zZShyZXNwb25zZSwgcmlkKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgbGlua09wZXJhdGlvblJlcXVlc3QgPSBfLm1hcChhZnRlckNvbW1pdCwgKHN0YWdlZCwgcmlkKSA9PiB7XG4gICAgICAvLyBpcyByZXNvdXJjZVxuICAgICAgaWYgKHRoaXMucG9vbFtyaWRdIHx8ICFzdGFnZWQub3ApIHsgcmV0dXJuOyB9XG5cbiAgICAgIGxldCB0eXBlID0gc3RhZ2VkLnJlc291cmNlLmdldCgndHlwZScpO1xuICAgICAgbGV0IGlkID0gc3RhZ2VkLnJlc291cmNlLmdldCgnaWQnKTtcbiAgICAgIGxldCBvcHRpb25zID0gXy5kZWZhdWx0cyhzdGFnZWQub3B0aW9ucyB8fCB7fSwge1xuICAgICAgICBoYXNNYW55OiB0cnVlXG4gICAgICB9KTtcbiAgICAgIGxldCBvcCA9IHN0YWdlZC5vcDtcbiAgICAgIGxldCByZWxhdGlvbiA9IHN0YWdlZC5yZWxhdGlvbjtcbiAgICAgIGxldCBsaW5rYWdlID0gc3RhZ2VkLmxpbmthZ2U7XG4gICAgICBsZXQgcmVxdWVzdEJvZHkgPSBvcHRpb25zLmhhc01hbnkgP1xuICAgICAgICB7IGRhdGE6IFtsaW5rYWdlXSB9IDogeyBkYXRhOiBsaW5rYWdlIH07XG5cbiAgICAgIGlmIChvcCA9PT0gJ2FkZCcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5wb3N0KHRoaXMuZ2V0UmVtb3RlKHR5cGUsIGlkLCByZWxhdGlvbiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0Qm9keSlcbiAgICAgICAgICAudGhlbigoKSA9PiByZXF1ZXN0Qm9keSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcCA9PT0gJ3JlbW92ZScpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYy5kZWxldGUodGhpcy5nZXRSZW1vdGUodHlwZSwgaWQsIHJlbGF0aW9uKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RCb2R5KVxuICAgICAgICAgIC50aGVuKCgpID0+IHJlcXVlc3RCb2R5KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBRLmFsbChkZWxldGVSZXF1ZXN0LmNvbmNhdChwb3N0T3JQYXRjaFJlcXVlc3QpKVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0UmVtb3RlSW5kZXgoKTtcbiAgICB9KTtcblxuICB9XG5cbiAgX3NhdmVSZXNwb25zZSAocmVzcG9uc2UsIHJpZCkge1xuXG4gICAgbGV0IG1haW5SZXNvdXJjZSA9IHRoaXMuX3NhdmVEYXRhKHJlc3BvbnNlLmRhdGEsIHJpZCk7XG4gICAgbGV0IGluY2x1ZGVkUmVzb3VyY2VzID0gXy5tYXAoXG4gICAgICByZXNwb25zZS5pbmNsdWRlZCwgZGF0YSA9PiB0aGlzLl9zYXZlRGF0YShkYXRhKSk7XG4gICAgcmV0dXJuIG1haW5SZXNvdXJjZTtcblxuICB9XG5cbiAgX3NhdmVEYXRhIChkYXRhLCByaWQpIHtcblxuICAgIGlmIChfLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiBfLm1hcChkYXRhLCBkYXRhID0+IHRoaXMuX3NhdmVEYXRhKGRhdGEpKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzb3VyY2UgPSByaWQgIT09IHVuZGVmaW5lZCA/XG4gICAgICB0aGlzLnBvb2xbcmlkXSA6IHRoaXMuZ2V0KGRhdGEudHlwZSwgZGF0YS5pZCk7XG5cbiAgICBpZiAoIXJlc291cmNlKSB7XG4gICAgICByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZShkYXRhKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXNvdXJjZS5kZXNlcmlhbGl6ZShkYXRhKTtcbiAgICB9XG5cbiAgICBsZXQgc3RhZ2VkQmFja3VwID0gXy5jbG9uZSh0aGlzLnN0YWdlZCwgdHJ1ZSk7XG5cbiAgICB0aGlzLmFkZChyZXNvdXJjZSk7XG4gICAgdGhpcy5jb21taXQoKTtcbiAgICB0aGlzLnNldFJlbW90ZUluZGV4KCk7XG5cbiAgICB0aGlzLnN0YWdlZCA9IHN0YWdlZEJhY2t1cDtcblxuICAgIHJldHVybiByZXNvdXJjZTtcblxuICB9XG5cbiAgX3RvUmVxdWVzdCAoc2VyaWFsaXplZCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IHNlcmlhbGl6ZWRcbiAgICB9O1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFBvb2w7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9Qb29sLmpzXG4gKiovIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCBSZXNwb25zZSBmcm9tICcuL1Jlc3BvbnNlJztcblxuXG5sZXQgc3RyaW5naWZ5UmVxdWlyZWRNZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gIC8vIHRoZXNlIEhUVFAgbWV0aG9kcyByZXF1aXJlcyBKU09OLnN0cmluZ2lmeVxuICByZXR1cm4gKC9eKFBPU1R8UFVUfFBBVENIfERFTEVURSkkLy50ZXN0KG1ldGhvZC50b1VwcGVyQ2FzZSgpKSk7XG59O1xuXG5sZXQgbWFrZUFqYXhSZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBpZiAoc3RyaW5naWZ5UmVxdWlyZWRNZXRob2Qob3B0aW9ucy50eXBlKSkge1xuICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgIG9wdGlvbnMuZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgb3B0aW9ucy51cmwgPSBvcHRpb25zLnVybC5yZXBsYWNlKC9cXC8/JC8sICcvJyk7XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL3dpa2kvQ29taW5nLWZyb20talF1ZXJ5XG4gIHJldHVybiBRLnByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICQuYWpheChvcHRpb25zKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZmFpbChmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZWplY3QocmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH0pO1xuXG59O1xuXG5cblxubGV0IFJFU1RmdWwgPSB7XG5cbiAgaGVhZDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJIRUFEXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGdldDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcG9zdDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHB1dDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQVVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcGF0Y2g6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUEFUQ0hcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZGVsZXRlOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkRFTEVURVwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBkZWZhdWx0T3B0aW9uczoge1xuXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICBwcm9jZXNzRGF0YTogdHJ1ZVxuXG4gIH0sXG5cbiAgYWpheFNldHVwOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gICAgJC5hamF4U2V0dXAob3B0aW9ucyk7XG5cbiAgfVxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBSRVNUZnVsO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvUkVTVGZ1bC5qc1xuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcblxuXG5jbGFzcyBUcmFuc2FjdGlvbiB7XG5cbiAgY29uc3RydWN0b3IocG9vbCwgb3B0aW9ucykge1xuXG4gICAgXy5leHRlbmQodGhpcywgRXZlbnRzKTtcbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMucG9vbCA9IHBvb2w7XG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG5cbiAgfVxuXG4gIGJlZ2luICgpIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuX2FjdGl2YXRlKCk7XG5cbiAgfVxuXG4gIGNvbW1pdCAoKSB7XG5cbiAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XG5cbiAgfVxuXG5cbiAgX2FjdGl2YXRlICgpIHtcblxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gIH1cblxuICBfZGVhY3RpdmF0ZSAoKSB7XG5cbiAgICB0aGlzLnN0b3BMaXN0ZW5pbmcodGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICB9XG5cbiAgb25UcmFuc2Zvcm0gKG9wZXJhdGlvbikge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zLnB1c2gob3BlcmF0aW9uKTtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHJhbnNhY3Rpb247XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9UcmFuc2FjdGlvbi5qc1xuICoqLyIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQganNvbmRpZmZwYXRjaCBmcm9tICdqc29uZGlmZnBhdGNoJztcblxuXG52YXIgZGlmZnBhdGNoZXIgPSBqc29uZGlmZnBhdGNoLmNyZWF0ZSh7fSk7XG5cblxuZnVuY3Rpb24gZ2V0QWZ0ZXJWYWx1ZUZyb21EaWZmIChkaWZmKSB7XG5cbiAgaWYgKCFfLmlzQXJyYXkoZGlmZikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgdHlwZSEnKTtcbiAgfVxuXG4gIHN3aXRjaCAoZGlmZi5sZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gZGlmZlswXTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gZGlmZlsxXTtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbn1cblxuXG5mdW5jdGlvbiBnZXRDaGFuZ2VkIChkaWZmcykge1xuXG4gIGlmIChfLmlzQXJyYXkoZGlmZnMpKSB7XG4gICAgcmV0dXJuIGdldEFmdGVyVmFsdWVGcm9tRGlmZihkaWZmcyk7XG4gIH1cblxuICByZXR1cm4gXy5yZWR1Y2UoZGlmZnMsIGZ1bmN0aW9uIChyZXN1bHQsIGRpZmYsIGtleSkge1xuXG4gICAgaWYgKF8uaXNPYmplY3QoZGlmZikpIHtcbiAgICAgIGlmIChkaWZmLl90ID09PSAnYScpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHJlc3VsdFtrZXldID0gZ2V0Q2hhbmdlZChkaWZmKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoXy5pc0FycmF5KGRpZmYpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IGdldEFmdGVyVmFsdWVGcm9tRGlmZihkaWZmKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIH0sIHt9KTtcblxufVxuXG5mdW5jdGlvbiBkaWZmIChvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcblxuICB2YXIgZGVsdGEgPSBkaWZmcGF0Y2hlci5kaWZmKG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gIHJldHVybiBnZXRDaGFuZ2VkKGRlbHRhKTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBkaWZmO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvZGlmZi5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV82X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcIl9cIlxuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV83X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInV1aWRcIlxuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV84X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcIlFcIlxuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV85X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInVybGpvaW5cIlxuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xMF9fO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJCYWNrYm9uZVwiXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xMV9fO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCIkXCJcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuXG5sZXQgX3ZhbGlkYXRlUmVzcG9uc2UgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgbGV0IGJvZHkgPSB4aHIucmVzcG9uc2VKU09OO1xuXG4gIGlmIChib2R5LmRhdGEgPT09IHVuZGVmaW5lZCAmJiBib2R5LmVycm9ycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQSBkb2N1bWVudCBNVVNUIGNvbnRhaW4gZWl0aGVyIHByaW1hcnkgZGF0YSBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwib3IgYW4gYXJyYXkgb2YgZXJyb3Igb2JqZWN0cy5cIik7XG4gIH1cblxufTtcblxuXG5sZXQgX2lzUmVzcG9uc2VFcnJvciA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcblxuICByZXR1cm4gNDAwIDw9IHN0YXR1cyAmJiA2MDAgPiBzdGF0dXMgO1xuXG59O1xuXG5cbmxldCBfcGFyc2VEYXRhID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICgheGhyLnJlc3BvbnNlSlNPTikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB4aHIucmVzcG9uc2VKU09OLmRhdGE7XG5cbn07XG5cbmxldCBfcGFyc2VJbmNsdWRlZCA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBpZiAoIXhoci5yZXNwb25zZUpTT04pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4geGhyLnJlc3BvbnNlSlNPTi5pbmNsdWRlZDtcblxufTtcblxubGV0IF9wYXJzZUVycm9ycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBpZiAoISh4aHIucmVzcG9uc2VKU09OICYmIHhoci5yZXNwb25zZUpTT04uZXJyb3JzICkpIHtcbiAgICBpZiAoX2lzUmVzcG9uc2VFcnJvcih4aHIuc3RhdHVzKSkge1xuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIHN0YXR1czogXCJcIiArIHhoci5zdGF0dXNcbiAgICAgIH1dO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCBlcnJvcnMgPSB4aHIucmVzcG9uc2VKU09OLmVycm9ycztcblxuICByZXR1cm4gXy5tYXAoZXJyb3JzLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICByZXR1cm4gXy5leHRlbmQoe1xuICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgIH0sIGVycm9yKTtcbiAgfSk7XG5cbn07XG5cblxubGV0IF9wYXJzZUhlYWRlcnMgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgbGV0IHJlc3VsdCA9IFtdO1xuXG4gIGxldCBoZWFkZXJSZWdleCA9IC9eKC4qPyk6WyBcXHRdKihbXlxcclxcbl0qKSQvbWc7XG4gIGxldCBoZWFkZXJzU3RyaW5nID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpO1xuICBsZXQgZmluZFJlc3VsdDtcblxuICB3aGlsZSAoKGZpbmRSZXN1bHQgPSBoZWFkZXJSZWdleC5leGVjKGhlYWRlcnNTdHJpbmcpKSAhPT0gbnVsbCkge1xuICAgIHJlc3VsdC5wdXNoKGZpbmRSZXN1bHQuc2xpY2UoMSkpO1xuICB9XG5cbiAgcmV0dXJuIF8ub2JqZWN0KHJlc3VsdCk7XG5cbn07XG5cblxuY2xhc3MgUmVzcG9uc2Uge1xuXG4gIGNvbnN0cnVjdG9yICh4aHIpIHtcblxuICAgIHRoaXMucmVzcG9uc2VKU09OID0geGhyLnJlc3BvbnNlSlNPTjtcbiAgICB0aGlzLmRhdGEgPSBfcGFyc2VEYXRhKHhocik7XG4gICAgdGhpcy5pbmNsdWRlZCA9IF9wYXJzZUluY2x1ZGVkKHhocik7XG4gICAgdGhpcy5lcnJvcnMgPSBfcGFyc2VFcnJvcnMoeGhyKTtcbiAgICB0aGlzLmhlYWRlcnMgPSBfcGFyc2VIZWFkZXJzKHhocik7XG4gICAgdGhpcy5uYXRpdmVYSFIgPSB4aHI7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvUmVzcG9uc2UuanNcbiAqKi8iLCJcbnZhciBlbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vZW52aXJvbm1lbnQnKTtcblxudmFyIERpZmZQYXRjaGVyID0gcmVxdWlyZSgnLi9kaWZmcGF0Y2hlcicpLkRpZmZQYXRjaGVyO1xuZXhwb3J0cy5EaWZmUGF0Y2hlciA9IERpZmZQYXRjaGVyO1xuXG5leHBvcnRzLmNyZWF0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuXHRyZXR1cm4gbmV3IERpZmZQYXRjaGVyKG9wdGlvbnMpO1xufTtcblxuZXhwb3J0cy5kYXRlUmV2aXZlciA9IHJlcXVpcmUoJy4vZGF0ZS1yZXZpdmVyJyk7XG5cbnZhciBkZWZhdWx0SW5zdGFuY2U7XG5cbmV4cG9ydHMuZGlmZiA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIWRlZmF1bHRJbnN0YW5jZSkge1xuXHRcdGRlZmF1bHRJbnN0YW5jZSA9IG5ldyBEaWZmUGF0Y2hlcigpO1xuXHR9XG5cdHJldHVybiBkZWZhdWx0SW5zdGFuY2UuZGlmZi5hcHBseShkZWZhdWx0SW5zdGFuY2UsIGFyZ3VtZW50cyk7XG59O1xuXG5leHBvcnRzLnBhdGNoID0gZnVuY3Rpb24oKSB7XG5cdGlmICghZGVmYXVsdEluc3RhbmNlKSB7XG5cdFx0ZGVmYXVsdEluc3RhbmNlID0gbmV3IERpZmZQYXRjaGVyKCk7XG5cdH1cblx0cmV0dXJuIGRlZmF1bHRJbnN0YW5jZS5wYXRjaC5hcHBseShkZWZhdWx0SW5zdGFuY2UsIGFyZ3VtZW50cyk7XG59O1xuXG5leHBvcnRzLnVucGF0Y2ggPSBmdW5jdGlvbigpIHtcblx0aWYgKCFkZWZhdWx0SW5zdGFuY2UpIHtcblx0XHRkZWZhdWx0SW5zdGFuY2UgPSBuZXcgRGlmZlBhdGNoZXIoKTtcblx0fVxuXHRyZXR1cm4gZGVmYXVsdEluc3RhbmNlLnVucGF0Y2guYXBwbHkoZGVmYXVsdEluc3RhbmNlLCBhcmd1bWVudHMpO1xufTtcblxuZXhwb3J0cy5yZXZlcnNlID0gZnVuY3Rpb24oKSB7XG5cdGlmICghZGVmYXVsdEluc3RhbmNlKSB7XG5cdFx0ZGVmYXVsdEluc3RhbmNlID0gbmV3IERpZmZQYXRjaGVyKCk7XG5cdH1cblx0cmV0dXJuIGRlZmF1bHRJbnN0YW5jZS5yZXZlcnNlLmFwcGx5KGRlZmF1bHRJbnN0YW5jZSwgYXJndW1lbnRzKTtcbn07XG5cbmlmIChlbnZpcm9ubWVudC5pc0Jyb3dzZXIpIHtcblx0ZXhwb3J0cy5ob21lcGFnZSA9ICd7e3BhY2thZ2UtaG9tZXBhZ2V9fSc7XG5cdGV4cG9ydHMudmVyc2lvbiA9ICd7e3BhY2thZ2UtdmVyc2lvbn19Jztcbn0gZWxzZSB7XG5cdHZhciBwYWNrYWdlSW5mb01vZHVsZU5hbWUgPSAnLi4vcGFja2FnZS5qc29uJztcblx0dmFyIHBhY2thZ2VJbmZvID0gcmVxdWlyZShwYWNrYWdlSW5mb01vZHVsZU5hbWUpO1xuXHRleHBvcnRzLmhvbWVwYWdlID0gcGFja2FnZUluZm8uaG9tZXBhZ2U7XG5cdGV4cG9ydHMudmVyc2lvbiA9IHBhY2thZ2VJbmZvLnZlcnNpb247XG5cblx0dmFyIGZvcm1hdHRlck1vZHVsZU5hbWUgPSAnLi9mb3JtYXR0ZXJzJztcblx0dmFyIGZvcm1hdHRlcnMgPSByZXF1aXJlKGZvcm1hdHRlck1vZHVsZU5hbWUpO1xuXHRleHBvcnRzLmZvcm1hdHRlcnMgPSBmb3JtYXR0ZXJzO1xuXHQvLyBzaG9ydGN1dCBmb3IgY29uc29sZVxuXHRleHBvcnRzLmNvbnNvbGUgPSBmb3JtYXR0ZXJzLmNvbnNvbGU7XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vanNvbmRpZmZwYXRjaC9zcmMvbWFpbi5qc1xuICoqLyIsInZhciBtYXAgPSB7XG5cdFwiLi9jb250ZXh0cy9jb250ZXh0XCI6IDE4LFxuXHRcIi4vY29udGV4dHMvY29udGV4dC5qc1wiOiAxOCxcblx0XCIuL2NvbnRleHRzL2RpZmZcIjogMTksXG5cdFwiLi9jb250ZXh0cy9kaWZmLmpzXCI6IDE5LFxuXHRcIi4vY29udGV4dHMvcGF0Y2hcIjogMjAsXG5cdFwiLi9jb250ZXh0cy9wYXRjaC5qc1wiOiAyMCxcblx0XCIuL2NvbnRleHRzL3JldmVyc2VcIjogMjEsXG5cdFwiLi9jb250ZXh0cy9yZXZlcnNlLmpzXCI6IDIxLFxuXHRcIi4vZGF0ZS1yZXZpdmVyXCI6IDE3LFxuXHRcIi4vZGF0ZS1yZXZpdmVyLmpzXCI6IDE3LFxuXHRcIi4vZGlmZnBhdGNoZXJcIjogMTYsXG5cdFwiLi9kaWZmcGF0Y2hlci5qc1wiOiAxNixcblx0XCIuL2Vudmlyb25tZW50XCI6IDE1LFxuXHRcIi4vZW52aXJvbm1lbnQuanNcIjogMTUsXG5cdFwiLi9maWx0ZXJzL2FycmF5c1wiOiAyMixcblx0XCIuL2ZpbHRlcnMvYXJyYXlzLmpzXCI6IDIyLFxuXHRcIi4vZmlsdGVycy9kYXRlc1wiOiAyMyxcblx0XCIuL2ZpbHRlcnMvZGF0ZXMuanNcIjogMjMsXG5cdFwiLi9maWx0ZXJzL2xjc1wiOiAxLFxuXHRcIi4vZmlsdGVycy9sY3MuanNcIjogMSxcblx0XCIuL2ZpbHRlcnMvbmVzdGVkXCI6IDI1LFxuXHRcIi4vZmlsdGVycy9uZXN0ZWQuanNcIjogMjUsXG5cdFwiLi9maWx0ZXJzL3RleHRzXCI6IDI2LFxuXHRcIi4vZmlsdGVycy90ZXh0cy5qc1wiOiAyNixcblx0XCIuL2ZpbHRlcnMvdHJpdmlhbFwiOiAyNyxcblx0XCIuL2ZpbHRlcnMvdHJpdmlhbC5qc1wiOiAyNyxcblx0XCIuL2Zvcm1hdHRlcnMvYW5ub3RhdGVkXCI6IDI4LFxuXHRcIi4vZm9ybWF0dGVycy9hbm5vdGF0ZWQuanNcIjogMjgsXG5cdFwiLi9mb3JtYXR0ZXJzL2Jhc2VcIjogMjksXG5cdFwiLi9mb3JtYXR0ZXJzL2Jhc2UuanNcIjogMjksXG5cdFwiLi9mb3JtYXR0ZXJzL2NvbnNvbGVcIjogMzAsXG5cdFwiLi9mb3JtYXR0ZXJzL2NvbnNvbGUuanNcIjogMzAsXG5cdFwiLi9mb3JtYXR0ZXJzL2h0bWxcIjogMzEsXG5cdFwiLi9mb3JtYXR0ZXJzL2h0bWwuanNcIjogMzEsXG5cdFwiLi9mb3JtYXR0ZXJzL2luZGV4XCI6IDMyLFxuXHRcIi4vZm9ybWF0dGVycy9pbmRleC5qc1wiOiAzMixcblx0XCIuL21haW5cIjogMTMsXG5cdFwiLi9tYWluLWZvcm1hdHRlcnNcIjogMzMsXG5cdFwiLi9tYWluLWZvcm1hdHRlcnMuanNcIjogMzMsXG5cdFwiLi9tYWluLWZ1bGxcIjogMzQsXG5cdFwiLi9tYWluLWZ1bGwuanNcIjogMzQsXG5cdFwiLi9tYWluLmpzXCI6IDEzLFxuXHRcIi4vcGlwZVwiOiAzNSxcblx0XCIuL3BpcGUuanNcIjogMzUsXG5cdFwiLi9wcm9jZXNzb3JcIjogMzYsXG5cdFwiLi9wcm9jZXNzb3IuanNcIjogMzZcbn07XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18od2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkpO1xufTtcbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0cmV0dXJuIG1hcFtyZXFdIHx8IChmdW5jdGlvbigpIHsgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJy5cIikgfSgpKTtcbn07XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gMTQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uZGlmZnBhdGNoL3NyYyBeXFwuXFwvLiokXG4gKiogbW9kdWxlIGlkID0gMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlxuZXhwb3J0cy5pc0Jyb3dzZXIgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9qc29uZGlmZnBhdGNoL3NyYy9lbnZpcm9ubWVudC5qc1xuICoqLyIsInZhciBQcm9jZXNzb3IgPSByZXF1aXJlKCcuL3Byb2Nlc3NvcicpLlByb2Nlc3NvcjtcbnZhciBQaXBlID0gcmVxdWlyZSgnLi9waXBlJykuUGlwZTtcbnZhciBEaWZmQ29udGV4dCA9IHJlcXVpcmUoJy4vY29udGV4dHMvZGlmZicpLkRpZmZDb250ZXh0O1xudmFyIFBhdGNoQ29udGV4dCA9IHJlcXVpcmUoJy4vY29udGV4dHMvcGF0Y2gnKS5QYXRjaENvbnRleHQ7XG52YXIgUmV2ZXJzZUNvbnRleHQgPSByZXF1aXJlKCcuL2NvbnRleHRzL3JldmVyc2UnKS5SZXZlcnNlQ29udGV4dDtcblxudmFyIHRyaXZpYWwgPSByZXF1aXJlKCcuL2ZpbHRlcnMvdHJpdmlhbCcpO1xudmFyIG5lc3RlZCA9IHJlcXVpcmUoJy4vZmlsdGVycy9uZXN0ZWQnKTtcbnZhciBhcnJheXMgPSByZXF1aXJlKCcuL2ZpbHRlcnMvYXJyYXlzJyk7XG52YXIgZGF0ZXMgPSByZXF1aXJlKCcuL2ZpbHRlcnMvZGF0ZXMnKTtcbnZhciB0ZXh0cyA9IHJlcXVpcmUoJy4vZmlsdGVycy90ZXh0cycpO1xuXG52YXIgRGlmZlBhdGNoZXIgPSBmdW5jdGlvbiBEaWZmUGF0Y2hlcihvcHRpb25zKSB7XG4gIHRoaXMucHJvY2Vzc29yID0gbmV3IFByb2Nlc3NvcihvcHRpb25zKTtcbiAgdGhpcy5wcm9jZXNzb3IucGlwZShuZXcgUGlwZSgnZGlmZicpLmFwcGVuZChcbiAgICBuZXN0ZWQuY29sbGVjdENoaWxkcmVuRGlmZkZpbHRlcixcbiAgICB0cml2aWFsLmRpZmZGaWx0ZXIsXG4gICAgZGF0ZXMuZGlmZkZpbHRlcixcbiAgICB0ZXh0cy5kaWZmRmlsdGVyLFxuICAgIG5lc3RlZC5vYmplY3RzRGlmZkZpbHRlcixcbiAgICBhcnJheXMuZGlmZkZpbHRlclxuICApLnNob3VsZEhhdmVSZXN1bHQoKSk7XG4gIHRoaXMucHJvY2Vzc29yLnBpcGUobmV3IFBpcGUoJ3BhdGNoJykuYXBwZW5kKFxuICAgIG5lc3RlZC5jb2xsZWN0Q2hpbGRyZW5QYXRjaEZpbHRlcixcbiAgICBhcnJheXMuY29sbGVjdENoaWxkcmVuUGF0Y2hGaWx0ZXIsXG4gICAgdHJpdmlhbC5wYXRjaEZpbHRlcixcbiAgICB0ZXh0cy5wYXRjaEZpbHRlcixcbiAgICBuZXN0ZWQucGF0Y2hGaWx0ZXIsXG4gICAgYXJyYXlzLnBhdGNoRmlsdGVyXG4gICkuc2hvdWxkSGF2ZVJlc3VsdCgpKTtcbiAgdGhpcy5wcm9jZXNzb3IucGlwZShuZXcgUGlwZSgncmV2ZXJzZScpLmFwcGVuZChcbiAgICBuZXN0ZWQuY29sbGVjdENoaWxkcmVuUmV2ZXJzZUZpbHRlcixcbiAgICBhcnJheXMuY29sbGVjdENoaWxkcmVuUmV2ZXJzZUZpbHRlcixcbiAgICB0cml2aWFsLnJldmVyc2VGaWx0ZXIsXG4gICAgdGV4dHMucmV2ZXJzZUZpbHRlcixcbiAgICBuZXN0ZWQucmV2ZXJzZUZpbHRlcixcbiAgICBhcnJheXMucmV2ZXJzZUZpbHRlclxuICApLnNob3VsZEhhdmVSZXN1bHQoKSk7XG59O1xuXG5EaWZmUGF0Y2hlci5wcm90b3R5cGUub3B0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5wcm9jZXNzb3Iub3B0aW9ucy5hcHBseSh0aGlzLnByb2Nlc3NvciwgYXJndW1lbnRzKTtcbn07XG5cbkRpZmZQYXRjaGVyLnByb3RvdHlwZS5kaWZmID0gZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgcmV0dXJuIHRoaXMucHJvY2Vzc29yLnByb2Nlc3MobmV3IERpZmZDb250ZXh0KGxlZnQsIHJpZ2h0KSk7XG59O1xuXG5EaWZmUGF0Y2hlci5wcm90b3R5cGUucGF0Y2ggPSBmdW5jdGlvbihsZWZ0LCBkZWx0YSkge1xuICByZXR1cm4gdGhpcy5wcm9jZXNzb3IucHJvY2VzcyhuZXcgUGF0Y2hDb250ZXh0KGxlZnQsIGRlbHRhKSk7XG59O1xuXG5EaWZmUGF0Y2hlci5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uKGRlbHRhKSB7XG4gIHJldHVybiB0aGlzLnByb2Nlc3Nvci5wcm9jZXNzKG5ldyBSZXZlcnNlQ29udGV4dChkZWx0YSkpO1xufTtcblxuRGlmZlBhdGNoZXIucHJvdG90eXBlLnVucGF0Y2ggPSBmdW5jdGlvbihyaWdodCwgZGVsdGEpIHtcbiAgcmV0dXJuIHRoaXMucGF0Y2gocmlnaHQsIHRoaXMucmV2ZXJzZShkZWx0YSkpO1xufTtcblxuZXhwb3J0cy5EaWZmUGF0Y2hlciA9IERpZmZQYXRjaGVyO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2RpZmZwYXRjaGVyLmpzXG4gKiovIiwiLy8gdXNlIGFzIDJuZCBwYXJhbWV0ZXIgZm9yIEpTT04ucGFyc2UgdG8gcmV2aXZlIERhdGUgaW5zdGFuY2VzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRhdGVSZXZpdmVyKGtleSwgdmFsdWUpIHtcbiAgdmFyIHBhcnRzO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHBhcnRzID0gL14oXFxkezR9KS0oXFxkezJ9KS0oXFxkezJ9KVQoXFxkezJ9KTooXFxkezJ9KTooXFxkezJ9KSg/OlxcLihcXGQqKSk/KFp8KFsrXFwtXSkoXFxkezJ9KTooXFxkezJ9KSkkLy5leGVjKHZhbHVlKTtcbiAgICBpZiAocGFydHMpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygrcGFydHNbMV0sICtwYXJ0c1syXSAtIDEsICtwYXJ0c1szXSwgK3BhcnRzWzRdLCArcGFydHNbNV0sICtwYXJ0c1s2XSwgKyhwYXJ0c1s3XSB8fCAwKSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWU7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2RhdGUtcmV2aXZlci5qc1xuICoqLyIsIlxudmFyIFBpcGUgPSByZXF1aXJlKCcuLi9waXBlJykuUGlwZTtcblxudmFyIENvbnRleHQgPSBmdW5jdGlvbiBDb250ZXh0KCl7XG59O1xuXG5Db250ZXh0LnByb3RvdHlwZS5zZXRSZXN1bHQgPSBmdW5jdGlvbihyZXN1bHQpIHtcblx0dGhpcy5yZXN1bHQgPSByZXN1bHQ7XG5cdHRoaXMuaGFzUmVzdWx0ID0gdHJ1ZTtcblx0cmV0dXJuIHRoaXM7XG59O1xuXG5Db250ZXh0LnByb3RvdHlwZS5leGl0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuZXhpdGluZyA9IHRydWU7XG5cdHJldHVybiB0aGlzO1xufTtcblxuQ29udGV4dC5wcm90b3R5cGUuc3dpdGNoVG8gPSBmdW5jdGlvbihuZXh0LCBwaXBlKSB7XG5cdGlmICh0eXBlb2YgbmV4dCA9PT0gJ3N0cmluZycgfHwgbmV4dCBpbnN0YW5jZW9mIFBpcGUpIHtcblx0XHR0aGlzLm5leHRQaXBlID0gbmV4dDtcblx0fSBlbHNlIHtcblx0XHR0aGlzLm5leHQgPSBuZXh0O1xuXHRcdGlmIChwaXBlKSB7XG5cdFx0XHR0aGlzLm5leHRQaXBlID0gcGlwZTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5Db250ZXh0LnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oY2hpbGQsIG5hbWUpIHtcblx0Y2hpbGQucGFyZW50ID0gdGhpcztcblx0aWYgKHR5cGVvZiBuYW1lICE9PSAndW5kZWZpbmVkJykge1xuXHRcdGNoaWxkLmNoaWxkTmFtZSA9IG5hbWU7XG5cdH1cblx0Y2hpbGQucm9vdCA9IHRoaXMucm9vdCB8fCB0aGlzO1xuXHRjaGlsZC5vcHRpb25zID0gY2hpbGQub3B0aW9ucyB8fCB0aGlzLm9wdGlvbnM7XG5cdGlmICghdGhpcy5jaGlsZHJlbikge1xuXHRcdHRoaXMuY2hpbGRyZW4gPSBbY2hpbGRdO1xuXHRcdHRoaXMubmV4dEFmdGVyQ2hpbGRyZW4gPSB0aGlzLm5leHQgfHwgbnVsbDtcblx0XHR0aGlzLm5leHQgPSBjaGlsZDtcblx0fSBlbHNlIHtcblx0XHR0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV0ubmV4dCA9IGNoaWxkO1xuXHRcdHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG5cdH1cblx0Y2hpbGQubmV4dCA9IHRoaXM7XG5cdHJldHVybiB0aGlzO1xufTtcblxuZXhwb3J0cy5Db250ZXh0ID0gQ29udGV4dDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9qc29uZGlmZnBhdGNoL3NyYy9jb250ZXh0cy9jb250ZXh0LmpzXG4gKiovIiwidmFyIENvbnRleHQgPSByZXF1aXJlKCcuL2NvbnRleHQnKS5Db250ZXh0O1xuXG52YXIgRGlmZkNvbnRleHQgPSBmdW5jdGlvbiBEaWZmQ29udGV4dChsZWZ0LCByaWdodCkge1xuICB0aGlzLmxlZnQgPSBsZWZ0O1xuICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gIHRoaXMucGlwZSA9ICdkaWZmJztcbn07XG5cbkRpZmZDb250ZXh0LnByb3RvdHlwZSA9IG5ldyBDb250ZXh0KCk7XG5cbmV4cG9ydHMuRGlmZkNvbnRleHQgPSBEaWZmQ29udGV4dDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9qc29uZGlmZnBhdGNoL3NyYy9jb250ZXh0cy9kaWZmLmpzXG4gKiovIiwidmFyIENvbnRleHQgPSByZXF1aXJlKCcuL2NvbnRleHQnKS5Db250ZXh0O1xuXG52YXIgUGF0Y2hDb250ZXh0ID0gZnVuY3Rpb24gUGF0Y2hDb250ZXh0KGxlZnQsIGRlbHRhKSB7XG4gIHRoaXMubGVmdCA9IGxlZnQ7XG4gIHRoaXMuZGVsdGEgPSBkZWx0YTtcbiAgdGhpcy5waXBlID0gJ3BhdGNoJztcbn07XG5cblBhdGNoQ29udGV4dC5wcm90b3R5cGUgPSBuZXcgQ29udGV4dCgpO1xuXG5leHBvcnRzLlBhdGNoQ29udGV4dCA9IFBhdGNoQ29udGV4dDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9qc29uZGlmZnBhdGNoL3NyYy9jb250ZXh0cy9wYXRjaC5qc1xuICoqLyIsInZhciBDb250ZXh0ID0gcmVxdWlyZSgnLi9jb250ZXh0JykuQ29udGV4dDtcblxudmFyIFJldmVyc2VDb250ZXh0ID0gZnVuY3Rpb24gUmV2ZXJzZUNvbnRleHQoZGVsdGEpIHtcbiAgdGhpcy5kZWx0YSA9IGRlbHRhO1xuICB0aGlzLnBpcGUgPSAncmV2ZXJzZSc7XG59O1xuXG5SZXZlcnNlQ29udGV4dC5wcm90b3R5cGUgPSBuZXcgQ29udGV4dCgpO1xuXG5leHBvcnRzLlJldmVyc2VDb250ZXh0ID0gUmV2ZXJzZUNvbnRleHQ7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vanNvbmRpZmZwYXRjaC9zcmMvY29udGV4dHMvcmV2ZXJzZS5qc1xuICoqLyIsInZhciBEaWZmQ29udGV4dCA9IHJlcXVpcmUoJy4uL2NvbnRleHRzL2RpZmYnKS5EaWZmQ29udGV4dDtcbnZhciBQYXRjaENvbnRleHQgPSByZXF1aXJlKCcuLi9jb250ZXh0cy9wYXRjaCcpLlBhdGNoQ29udGV4dDtcbnZhciBSZXZlcnNlQ29udGV4dCA9IHJlcXVpcmUoJy4uL2NvbnRleHRzL3JldmVyc2UnKS5SZXZlcnNlQ29udGV4dDtcblxudmFyIGxjcyA9IHJlcXVpcmUoJy4vbGNzJyk7XG5cbnZhciBBUlJBWV9NT1ZFID0gMztcblxudmFyIGlzQXJyYXkgPSAodHlwZW9mIEFycmF5LmlzQXJyYXkgPT09ICdmdW5jdGlvbicpID9cbiAgLy8gdXNlIG5hdGl2ZSBmdW5jdGlvblxuICBBcnJheS5pc0FycmF5IDpcbiAgLy8gdXNlIGluc3RhbmNlb2Ygb3BlcmF0b3JcbiAgZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBhIGluc3RhbmNlb2YgQXJyYXk7XG4gIH07XG5cbnZhciBhcnJheUluZGV4T2YgPSB0eXBlb2YgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicgP1xuICBmdW5jdGlvbihhcnJheSwgaXRlbSkge1xuICAgIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pO1xuICB9IDogZnVuY3Rpb24oYXJyYXksIGl0ZW0pIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhcnJheVtpXSA9PT0gaXRlbSkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xuICB9O1xuXG5mdW5jdGlvbiBhcnJheXNIYXZlTWF0Y2hCeVJlZihhcnJheTEsIGFycmF5MiwgbGVuMSwgbGVuMikge1xuICBmb3IgKHZhciBpbmRleDEgPSAwOyBpbmRleDEgPCBsZW4xOyBpbmRleDErKykge1xuICAgIHZhciB2YWwxID0gYXJyYXkxW2luZGV4MV07XG4gICAgZm9yICh2YXIgaW5kZXgyID0gMDsgaW5kZXgyIDwgbGVuMjsgaW5kZXgyKyspIHtcbiAgICAgIHZhciB2YWwyID0gYXJyYXkyW2luZGV4Ml07XG4gICAgICBpZiAodmFsMSA9PT0gdmFsMikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbWF0Y2hJdGVtcyhhcnJheTEsIGFycmF5MiwgaW5kZXgxLCBpbmRleDIsIGNvbnRleHQpIHtcbiAgdmFyIHZhbHVlMSA9IGFycmF5MVtpbmRleDFdO1xuICB2YXIgdmFsdWUyID0gYXJyYXkyW2luZGV4Ml07XG4gIGlmICh2YWx1ZTEgPT09IHZhbHVlMikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUxICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsdWUyICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgb2JqZWN0SGFzaCA9IGNvbnRleHQub2JqZWN0SGFzaDtcbiAgaWYgKCFvYmplY3RIYXNoKSB7XG4gICAgLy8gbm8gd2F5IHRvIG1hdGNoIG9iamVjdHMgd2FzIHByb3ZpZGVkLCB0cnkgbWF0Y2ggYnkgcG9zaXRpb25cbiAgICByZXR1cm4gY29udGV4dC5tYXRjaEJ5UG9zaXRpb24gJiYgaW5kZXgxID09PSBpbmRleDI7XG4gIH1cbiAgdmFyIGhhc2gxO1xuICB2YXIgaGFzaDI7XG4gIGlmICh0eXBlb2YgaW5kZXgxID09PSAnbnVtYmVyJykge1xuICAgIGNvbnRleHQuaGFzaENhY2hlMSA9IGNvbnRleHQuaGFzaENhY2hlMSB8fCBbXTtcbiAgICBoYXNoMSA9IGNvbnRleHQuaGFzaENhY2hlMVtpbmRleDFdO1xuICAgIGlmICh0eXBlb2YgaGFzaDEgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb250ZXh0Lmhhc2hDYWNoZTFbaW5kZXgxXSA9IGhhc2gxID0gb2JqZWN0SGFzaCh2YWx1ZTEsIGluZGV4MSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhhc2gxID0gb2JqZWN0SGFzaCh2YWx1ZTEpO1xuICB9XG4gIGlmICh0eXBlb2YgaGFzaDEgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0eXBlb2YgaW5kZXgyID09PSAnbnVtYmVyJykge1xuICAgIGNvbnRleHQuaGFzaENhY2hlMiA9IGNvbnRleHQuaGFzaENhY2hlMiB8fCBbXTtcbiAgICBoYXNoMiA9IGNvbnRleHQuaGFzaENhY2hlMltpbmRleDJdO1xuICAgIGlmICh0eXBlb2YgaGFzaDIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb250ZXh0Lmhhc2hDYWNoZTJbaW5kZXgyXSA9IGhhc2gyID0gb2JqZWN0SGFzaCh2YWx1ZTIsIGluZGV4Mik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhhc2gyID0gb2JqZWN0SGFzaCh2YWx1ZTIpO1xuICB9XG4gIGlmICh0eXBlb2YgaGFzaDIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBoYXNoMSA9PT0gaGFzaDI7XG59XG5cbnZhciBkaWZmRmlsdGVyID0gZnVuY3Rpb24gYXJyYXlzRGlmZkZpbHRlcihjb250ZXh0KSB7XG4gIGlmICghY29udGV4dC5sZWZ0SXNBcnJheSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBtYXRjaENvbnRleHQgPSB7XG4gICAgb2JqZWN0SGFzaDogY29udGV4dC5vcHRpb25zICYmIGNvbnRleHQub3B0aW9ucy5vYmplY3RIYXNoLFxuICAgIG1hdGNoQnlQb3NpdGlvbjogY29udGV4dC5vcHRpb25zICYmIGNvbnRleHQub3B0aW9ucy5tYXRjaEJ5UG9zaXRpb25cbiAgfTtcbiAgdmFyIGNvbW1vbkhlYWQgPSAwO1xuICB2YXIgY29tbW9uVGFpbCA9IDA7XG4gIHZhciBpbmRleDtcbiAgdmFyIGluZGV4MTtcbiAgdmFyIGluZGV4MjtcbiAgdmFyIGFycmF5MSA9IGNvbnRleHQubGVmdDtcbiAgdmFyIGFycmF5MiA9IGNvbnRleHQucmlnaHQ7XG4gIHZhciBsZW4xID0gYXJyYXkxLmxlbmd0aDtcbiAgdmFyIGxlbjIgPSBhcnJheTIubGVuZ3RoO1xuXG4gIHZhciBjaGlsZDtcblxuICBpZiAobGVuMSA+IDAgJiYgbGVuMiA+IDAgJiYgIW1hdGNoQ29udGV4dC5vYmplY3RIYXNoICYmXG4gICAgdHlwZW9mIG1hdGNoQ29udGV4dC5tYXRjaEJ5UG9zaXRpb24gIT09ICdib29sZWFuJykge1xuICAgIG1hdGNoQ29udGV4dC5tYXRjaEJ5UG9zaXRpb24gPSAhYXJyYXlzSGF2ZU1hdGNoQnlSZWYoYXJyYXkxLCBhcnJheTIsIGxlbjEsIGxlbjIpO1xuICB9XG5cbiAgLy8gc2VwYXJhdGUgY29tbW9uIGhlYWRcbiAgd2hpbGUgKGNvbW1vbkhlYWQgPCBsZW4xICYmIGNvbW1vbkhlYWQgPCBsZW4yICYmXG4gICAgbWF0Y2hJdGVtcyhhcnJheTEsIGFycmF5MiwgY29tbW9uSGVhZCwgY29tbW9uSGVhZCwgbWF0Y2hDb250ZXh0KSkge1xuICAgIGluZGV4ID0gY29tbW9uSGVhZDtcbiAgICBjaGlsZCA9IG5ldyBEaWZmQ29udGV4dChjb250ZXh0LmxlZnRbaW5kZXhdLCBjb250ZXh0LnJpZ2h0W2luZGV4XSk7XG4gICAgY29udGV4dC5wdXNoKGNoaWxkLCBpbmRleCk7XG4gICAgY29tbW9uSGVhZCsrO1xuICB9XG4gIC8vIHNlcGFyYXRlIGNvbW1vbiB0YWlsXG4gIHdoaWxlIChjb21tb25UYWlsICsgY29tbW9uSGVhZCA8IGxlbjEgJiYgY29tbW9uVGFpbCArIGNvbW1vbkhlYWQgPCBsZW4yICYmXG4gICAgbWF0Y2hJdGVtcyhhcnJheTEsIGFycmF5MiwgbGVuMSAtIDEgLSBjb21tb25UYWlsLCBsZW4yIC0gMSAtIGNvbW1vblRhaWwsIG1hdGNoQ29udGV4dCkpIHtcbiAgICBpbmRleDEgPSBsZW4xIC0gMSAtIGNvbW1vblRhaWw7XG4gICAgaW5kZXgyID0gbGVuMiAtIDEgLSBjb21tb25UYWlsO1xuICAgIGNoaWxkID0gbmV3IERpZmZDb250ZXh0KGNvbnRleHQubGVmdFtpbmRleDFdLCBjb250ZXh0LnJpZ2h0W2luZGV4Ml0pO1xuICAgIGNvbnRleHQucHVzaChjaGlsZCwgaW5kZXgyKTtcbiAgICBjb21tb25UYWlsKys7XG4gIH1cbiAgdmFyIHJlc3VsdDtcbiAgaWYgKGNvbW1vbkhlYWQgKyBjb21tb25UYWlsID09PSBsZW4xKSB7XG4gICAgaWYgKGxlbjEgPT09IGxlbjIpIHtcbiAgICAgIC8vIGFycmF5cyBhcmUgaWRlbnRpY2FsXG4gICAgICBjb250ZXh0LnNldFJlc3VsdCh1bmRlZmluZWQpLmV4aXQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gdHJpdmlhbCBjYXNlLCBhIGJsb2NrICgxIG9yIG1vcmUgY29uc2VjdXRpdmUgaXRlbXMpIHdhcyBhZGRlZFxuICAgIHJlc3VsdCA9IHJlc3VsdCB8fCB7XG4gICAgICBfdDogJ2EnXG4gICAgfTtcbiAgICBmb3IgKGluZGV4ID0gY29tbW9uSGVhZDsgaW5kZXggPCBsZW4yIC0gY29tbW9uVGFpbDsgaW5kZXgrKykge1xuICAgICAgcmVzdWx0W2luZGV4XSA9IFthcnJheTJbaW5kZXhdXTtcbiAgICB9XG4gICAgY29udGV4dC5zZXRSZXN1bHQocmVzdWx0KS5leGl0KCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChjb21tb25IZWFkICsgY29tbW9uVGFpbCA9PT0gbGVuMikge1xuICAgIC8vIHRyaXZpYWwgY2FzZSwgYSBibG9jayAoMSBvciBtb3JlIGNvbnNlY3V0aXZlIGl0ZW1zKSB3YXMgcmVtb3ZlZFxuICAgIHJlc3VsdCA9IHJlc3VsdCB8fCB7XG4gICAgICBfdDogJ2EnXG4gICAgfTtcbiAgICBmb3IgKGluZGV4ID0gY29tbW9uSGVhZDsgaW5kZXggPCBsZW4xIC0gY29tbW9uVGFpbDsgaW5kZXgrKykge1xuICAgICAgcmVzdWx0WydfJyArIGluZGV4XSA9IFthcnJheTFbaW5kZXhdLCAwLCAwXTtcbiAgICB9XG4gICAgY29udGV4dC5zZXRSZXN1bHQocmVzdWx0KS5leGl0KCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIHJlc2V0IGhhc2ggY2FjaGVcbiAgZGVsZXRlIG1hdGNoQ29udGV4dC5oYXNoQ2FjaGUxO1xuICBkZWxldGUgbWF0Y2hDb250ZXh0Lmhhc2hDYWNoZTI7XG5cbiAgLy8gZGlmZiBpcyBub3QgdHJpdmlhbCwgZmluZCB0aGUgTENTIChMb25nZXN0IENvbW1vbiBTdWJzZXF1ZW5jZSlcbiAgdmFyIHRyaW1tZWQxID0gYXJyYXkxLnNsaWNlKGNvbW1vbkhlYWQsIGxlbjEgLSBjb21tb25UYWlsKTtcbiAgdmFyIHRyaW1tZWQyID0gYXJyYXkyLnNsaWNlKGNvbW1vbkhlYWQsIGxlbjIgLSBjb21tb25UYWlsKTtcbiAgdmFyIHNlcSA9IGxjcy5nZXQoXG4gICAgdHJpbW1lZDEsIHRyaW1tZWQyLFxuICAgIG1hdGNoSXRlbXMsXG4gICAgbWF0Y2hDb250ZXh0XG4gICk7XG4gIHZhciByZW1vdmVkSXRlbXMgPSBbXTtcbiAgcmVzdWx0ID0gcmVzdWx0IHx8IHtcbiAgICBfdDogJ2EnXG4gIH07XG4gIGZvciAoaW5kZXggPSBjb21tb25IZWFkOyBpbmRleCA8IGxlbjEgLSBjb21tb25UYWlsOyBpbmRleCsrKSB7XG4gICAgaWYgKGFycmF5SW5kZXhPZihzZXEuaW5kaWNlczEsIGluZGV4IC0gY29tbW9uSGVhZCkgPCAwKSB7XG4gICAgICAvLyByZW1vdmVkXG4gICAgICByZXN1bHRbJ18nICsgaW5kZXhdID0gW2FycmF5MVtpbmRleF0sIDAsIDBdO1xuICAgICAgcmVtb3ZlZEl0ZW1zLnB1c2goaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBkZXRlY3RNb3ZlID0gdHJ1ZTtcbiAgaWYgKGNvbnRleHQub3B0aW9ucyAmJiBjb250ZXh0Lm9wdGlvbnMuYXJyYXlzICYmIGNvbnRleHQub3B0aW9ucy5hcnJheXMuZGV0ZWN0TW92ZSA9PT0gZmFsc2UpIHtcbiAgICBkZXRlY3RNb3ZlID0gZmFsc2U7XG4gIH1cbiAgdmFyIGluY2x1ZGVWYWx1ZU9uTW92ZSA9IGZhbHNlO1xuICBpZiAoY29udGV4dC5vcHRpb25zICYmIGNvbnRleHQub3B0aW9ucy5hcnJheXMgJiYgY29udGV4dC5vcHRpb25zLmFycmF5cy5pbmNsdWRlVmFsdWVPbk1vdmUpIHtcbiAgICBpbmNsdWRlVmFsdWVPbk1vdmUgPSB0cnVlO1xuICB9XG5cbiAgdmFyIHJlbW92ZWRJdGVtc0xlbmd0aCA9IHJlbW92ZWRJdGVtcy5sZW5ndGg7XG4gIGZvciAoaW5kZXggPSBjb21tb25IZWFkOyBpbmRleCA8IGxlbjIgLSBjb21tb25UYWlsOyBpbmRleCsrKSB7XG4gICAgdmFyIGluZGV4T25BcnJheTIgPSBhcnJheUluZGV4T2Yoc2VxLmluZGljZXMyLCBpbmRleCAtIGNvbW1vbkhlYWQpO1xuICAgIGlmIChpbmRleE9uQXJyYXkyIDwgMCkge1xuICAgICAgLy8gYWRkZWQsIHRyeSB0byBtYXRjaCB3aXRoIGEgcmVtb3ZlZCBpdGVtIGFuZCByZWdpc3RlciBhcyBwb3NpdGlvbiBtb3ZlXG4gICAgICB2YXIgaXNNb3ZlID0gZmFsc2U7XG4gICAgICBpZiAoZGV0ZWN0TW92ZSAmJiByZW1vdmVkSXRlbXNMZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAodmFyIHJlbW92ZUl0ZW1JbmRleDEgPSAwOyByZW1vdmVJdGVtSW5kZXgxIDwgcmVtb3ZlZEl0ZW1zTGVuZ3RoOyByZW1vdmVJdGVtSW5kZXgxKyspIHtcbiAgICAgICAgICBpbmRleDEgPSByZW1vdmVkSXRlbXNbcmVtb3ZlSXRlbUluZGV4MV07XG4gICAgICAgICAgaWYgKG1hdGNoSXRlbXModHJpbW1lZDEsIHRyaW1tZWQyLCBpbmRleDEgLSBjb21tb25IZWFkLFxuICAgICAgICAgICAgaW5kZXggLSBjb21tb25IZWFkLCBtYXRjaENvbnRleHQpKSB7XG4gICAgICAgICAgICAvLyBzdG9yZSBwb3NpdGlvbiBtb3ZlIGFzOiBbb3JpZ2luYWxWYWx1ZSwgbmV3UG9zaXRpb24sIEFSUkFZX01PVkVdXG4gICAgICAgICAgICByZXN1bHRbJ18nICsgaW5kZXgxXS5zcGxpY2UoMSwgMiwgaW5kZXgsIEFSUkFZX01PVkUpO1xuICAgICAgICAgICAgaWYgKCFpbmNsdWRlVmFsdWVPbk1vdmUpIHtcbiAgICAgICAgICAgICAgLy8gZG9uJ3QgaW5jbHVkZSBtb3ZlZCB2YWx1ZSBvbiBkaWZmLCB0byBzYXZlIGJ5dGVzXG4gICAgICAgICAgICAgIHJlc3VsdFsnXycgKyBpbmRleDFdWzBdID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluZGV4MiA9IGluZGV4O1xuICAgICAgICAgICAgY2hpbGQgPSBuZXcgRGlmZkNvbnRleHQoY29udGV4dC5sZWZ0W2luZGV4MV0sIGNvbnRleHQucmlnaHRbaW5kZXgyXSk7XG4gICAgICAgICAgICBjb250ZXh0LnB1c2goY2hpbGQsIGluZGV4Mik7XG4gICAgICAgICAgICByZW1vdmVkSXRlbXMuc3BsaWNlKHJlbW92ZUl0ZW1JbmRleDEsIDEpO1xuICAgICAgICAgICAgaXNNb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFpc01vdmUpIHtcbiAgICAgICAgLy8gYWRkZWRcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IFthcnJheTJbaW5kZXhdXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbWF0Y2gsIGRvIGlubmVyIGRpZmZcbiAgICAgIGluZGV4MSA9IHNlcS5pbmRpY2VzMVtpbmRleE9uQXJyYXkyXSArIGNvbW1vbkhlYWQ7XG4gICAgICBpbmRleDIgPSBzZXEuaW5kaWNlczJbaW5kZXhPbkFycmF5Ml0gKyBjb21tb25IZWFkO1xuICAgICAgY2hpbGQgPSBuZXcgRGlmZkNvbnRleHQoY29udGV4dC5sZWZ0W2luZGV4MV0sIGNvbnRleHQucmlnaHRbaW5kZXgyXSk7XG4gICAgICBjb250ZXh0LnB1c2goY2hpbGQsIGluZGV4Mik7XG4gICAgfVxuICB9XG5cbiAgY29udGV4dC5zZXRSZXN1bHQocmVzdWx0KS5leGl0KCk7XG5cbn07XG5kaWZmRmlsdGVyLmZpbHRlck5hbWUgPSAnYXJyYXlzJztcblxudmFyIGNvbXBhcmUgPSB7XG4gIG51bWVyaWNhbGx5OiBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEgLSBiO1xuICB9LFxuICBudW1lcmljYWxseUJ5OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhW25hbWVdIC0gYltuYW1lXTtcbiAgICB9O1xuICB9XG59O1xuXG52YXIgcGF0Y2hGaWx0ZXIgPSBmdW5jdGlvbiBuZXN0ZWRQYXRjaEZpbHRlcihjb250ZXh0KSB7XG4gIGlmICghY29udGV4dC5uZXN0ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGNvbnRleHQuZGVsdGEuX3QgIT09ICdhJykge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgaW5kZXgsIGluZGV4MTtcblxuICB2YXIgZGVsdGEgPSBjb250ZXh0LmRlbHRhO1xuICB2YXIgYXJyYXkgPSBjb250ZXh0LmxlZnQ7XG5cbiAgLy8gZmlyc3QsIHNlcGFyYXRlIHJlbW92YWxzLCBpbnNlcnRpb25zIGFuZCBtb2RpZmljYXRpb25zXG4gIHZhciB0b1JlbW92ZSA9IFtdO1xuICB2YXIgdG9JbnNlcnQgPSBbXTtcbiAgdmFyIHRvTW9kaWZ5ID0gW107XG4gIGZvciAoaW5kZXggaW4gZGVsdGEpIHtcbiAgICBpZiAoaW5kZXggIT09ICdfdCcpIHtcbiAgICAgIGlmIChpbmRleFswXSA9PT0gJ18nKSB7XG4gICAgICAgIC8vIHJlbW92ZWQgaXRlbSBmcm9tIG9yaWdpbmFsIGFycmF5XG4gICAgICAgIGlmIChkZWx0YVtpbmRleF1bMl0gPT09IDAgfHwgZGVsdGFbaW5kZXhdWzJdID09PSBBUlJBWV9NT1ZFKSB7XG4gICAgICAgICAgdG9SZW1vdmUucHVzaChwYXJzZUludChpbmRleC5zbGljZSgxKSwgMTApKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ29ubHkgcmVtb3ZhbCBvciBtb3ZlIGNhbiBiZSBhcHBsaWVkIGF0IG9yaWdpbmFsIGFycmF5IGluZGljZXMnICtcbiAgICAgICAgICAgICcsIGludmFsaWQgZGlmZiB0eXBlOiAnICsgZGVsdGFbaW5kZXhdWzJdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGRlbHRhW2luZGV4XS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAvLyBhZGRlZCBpdGVtIGF0IG5ldyBhcnJheVxuICAgICAgICAgIHRvSW5zZXJ0LnB1c2goe1xuICAgICAgICAgICAgaW5kZXg6IHBhcnNlSW50KGluZGV4LCAxMCksXG4gICAgICAgICAgICB2YWx1ZTogZGVsdGFbaW5kZXhdWzBdXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gbW9kaWZpZWQgaXRlbSBhdCBuZXcgYXJyYXlcbiAgICAgICAgICB0b01vZGlmeS5wdXNoKHtcbiAgICAgICAgICAgIGluZGV4OiBwYXJzZUludChpbmRleCwgMTApLFxuICAgICAgICAgICAgZGVsdGE6IGRlbHRhW2luZGV4XVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcmVtb3ZlIGl0ZW1zLCBpbiByZXZlcnNlIG9yZGVyIHRvIGF2b2lkIHNhd2luZyBvdXIgb3duIGZsb29yXG4gIHRvUmVtb3ZlID0gdG9SZW1vdmUuc29ydChjb21wYXJlLm51bWVyaWNhbGx5KTtcbiAgZm9yIChpbmRleCA9IHRvUmVtb3ZlLmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcbiAgICBpbmRleDEgPSB0b1JlbW92ZVtpbmRleF07XG4gICAgdmFyIGluZGV4RGlmZiA9IGRlbHRhWydfJyArIGluZGV4MV07XG4gICAgdmFyIHJlbW92ZWRWYWx1ZSA9IGFycmF5LnNwbGljZShpbmRleDEsIDEpWzBdO1xuICAgIGlmIChpbmRleERpZmZbMl0gPT09IEFSUkFZX01PVkUpIHtcbiAgICAgIC8vIHJlaW5zZXJ0IGxhdGVyXG4gICAgICB0b0luc2VydC5wdXNoKHtcbiAgICAgICAgaW5kZXg6IGluZGV4RGlmZlsxXSxcbiAgICAgICAgdmFsdWU6IHJlbW92ZWRWYWx1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gaW5zZXJ0IGl0ZW1zLCBpbiByZXZlcnNlIG9yZGVyIHRvIGF2b2lkIG1vdmluZyBvdXIgb3duIGZsb29yXG4gIHRvSW5zZXJ0ID0gdG9JbnNlcnQuc29ydChjb21wYXJlLm51bWVyaWNhbGx5QnkoJ2luZGV4JykpO1xuICB2YXIgdG9JbnNlcnRMZW5ndGggPSB0b0luc2VydC5sZW5ndGg7XG4gIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHRvSW5zZXJ0TGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgdmFyIGluc2VydGlvbiA9IHRvSW5zZXJ0W2luZGV4XTtcbiAgICBhcnJheS5zcGxpY2UoaW5zZXJ0aW9uLmluZGV4LCAwLCBpbnNlcnRpb24udmFsdWUpO1xuICB9XG5cbiAgLy8gYXBwbHkgbW9kaWZpY2F0aW9uc1xuICB2YXIgdG9Nb2RpZnlMZW5ndGggPSB0b01vZGlmeS5sZW5ndGg7XG4gIHZhciBjaGlsZDtcbiAgaWYgKHRvTW9kaWZ5TGVuZ3RoID4gMCkge1xuICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHRvTW9kaWZ5TGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgbW9kaWZpY2F0aW9uID0gdG9Nb2RpZnlbaW5kZXhdO1xuICAgICAgY2hpbGQgPSBuZXcgUGF0Y2hDb250ZXh0KGNvbnRleHQubGVmdFttb2RpZmljYXRpb24uaW5kZXhdLCBtb2RpZmljYXRpb24uZGVsdGEpO1xuICAgICAgY29udGV4dC5wdXNoKGNoaWxkLCBtb2RpZmljYXRpb24uaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29udGV4dC5jaGlsZHJlbikge1xuICAgIGNvbnRleHQuc2V0UmVzdWx0KGNvbnRleHQubGVmdCkuZXhpdCgpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb250ZXh0LmV4aXQoKTtcbn07XG5wYXRjaEZpbHRlci5maWx0ZXJOYW1lID0gJ2FycmF5cyc7XG5cbnZhciBjb2xsZWN0Q2hpbGRyZW5QYXRjaEZpbHRlciA9IGZ1bmN0aW9uIGNvbGxlY3RDaGlsZHJlblBhdGNoRmlsdGVyKGNvbnRleHQpIHtcbiAgaWYgKCFjb250ZXh0IHx8ICFjb250ZXh0LmNoaWxkcmVuKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChjb250ZXh0LmRlbHRhLl90ICE9PSAnYScpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGxlbmd0aCA9IGNvbnRleHQuY2hpbGRyZW4ubGVuZ3RoO1xuICB2YXIgY2hpbGQ7XG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICBjaGlsZCA9IGNvbnRleHQuY2hpbGRyZW5baW5kZXhdO1xuICAgIGNvbnRleHQubGVmdFtjaGlsZC5jaGlsZE5hbWVdID0gY2hpbGQucmVzdWx0O1xuICB9XG4gIGNvbnRleHQuc2V0UmVzdWx0KGNvbnRleHQubGVmdCkuZXhpdCgpO1xufTtcbmNvbGxlY3RDaGlsZHJlblBhdGNoRmlsdGVyLmZpbHRlck5hbWUgPSAnYXJyYXlzQ29sbGVjdENoaWxkcmVuJztcblxudmFyIHJldmVyc2VGaWx0ZXIgPSBmdW5jdGlvbiBhcnJheXNSZXZlcnNlRmlsdGVyKGNvbnRleHQpIHtcbiAgaWYgKCFjb250ZXh0Lm5lc3RlZCkge1xuICAgIGlmIChjb250ZXh0LmRlbHRhWzJdID09PSBBUlJBWV9NT1ZFKSB7XG4gICAgICBjb250ZXh0Lm5ld05hbWUgPSAnXycgKyBjb250ZXh0LmRlbHRhWzFdO1xuICAgICAgY29udGV4dC5zZXRSZXN1bHQoW2NvbnRleHQuZGVsdGFbMF0sIHBhcnNlSW50KGNvbnRleHQuY2hpbGROYW1lLnN1YnN0cigxKSwgMTApLCBBUlJBWV9NT1ZFXSkuZXhpdCgpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGNvbnRleHQuZGVsdGEuX3QgIT09ICdhJykge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmFtZSwgY2hpbGQ7XG4gIGZvciAobmFtZSBpbiBjb250ZXh0LmRlbHRhKSB7XG4gICAgaWYgKG5hbWUgPT09ICdfdCcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjaGlsZCA9IG5ldyBSZXZlcnNlQ29udGV4dChjb250ZXh0LmRlbHRhW25hbWVdKTtcbiAgICBjb250ZXh0LnB1c2goY2hpbGQsIG5hbWUpO1xuICB9XG4gIGNvbnRleHQuZXhpdCgpO1xufTtcbnJldmVyc2VGaWx0ZXIuZmlsdGVyTmFtZSA9ICdhcnJheXMnO1xuXG52YXIgcmV2ZXJzZUFycmF5RGVsdGFJbmRleCA9IGZ1bmN0aW9uKGRlbHRhLCBpbmRleCwgaXRlbURlbHRhKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggPT09ICdzdHJpbmcnICYmIGluZGV4WzBdID09PSAnXycpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoaW5kZXguc3Vic3RyKDEpLCAxMCk7XG4gIH0gZWxzZSBpZiAoaXNBcnJheShpdGVtRGVsdGEpICYmIGl0ZW1EZWx0YVsyXSA9PT0gMCkge1xuICAgIHJldHVybiAnXycgKyBpbmRleDtcbiAgfVxuXG4gIHZhciByZXZlcnNlSW5kZXggPSAraW5kZXg7XG4gIGZvciAodmFyIGRlbHRhSW5kZXggaW4gZGVsdGEpIHtcbiAgICB2YXIgZGVsdGFJdGVtID0gZGVsdGFbZGVsdGFJbmRleF07XG4gICAgaWYgKGlzQXJyYXkoZGVsdGFJdGVtKSkge1xuICAgICAgaWYgKGRlbHRhSXRlbVsyXSA9PT0gQVJSQVlfTU9WRSkge1xuICAgICAgICB2YXIgbW92ZUZyb21JbmRleCA9IHBhcnNlSW50KGRlbHRhSW5kZXguc3Vic3RyKDEpLCAxMCk7XG4gICAgICAgIHZhciBtb3ZlVG9JbmRleCA9IGRlbHRhSXRlbVsxXTtcbiAgICAgICAgaWYgKG1vdmVUb0luZGV4ID09PSAraW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gbW92ZUZyb21JbmRleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobW92ZUZyb21JbmRleCA8PSByZXZlcnNlSW5kZXggJiYgbW92ZVRvSW5kZXggPiByZXZlcnNlSW5kZXgpIHtcbiAgICAgICAgICByZXZlcnNlSW5kZXgrKztcbiAgICAgICAgfSBlbHNlIGlmIChtb3ZlRnJvbUluZGV4ID49IHJldmVyc2VJbmRleCAmJiBtb3ZlVG9JbmRleCA8IHJldmVyc2VJbmRleCkge1xuICAgICAgICAgIHJldmVyc2VJbmRleC0tO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGRlbHRhSXRlbVsyXSA9PT0gMCkge1xuICAgICAgICB2YXIgZGVsZXRlSW5kZXggPSBwYXJzZUludChkZWx0YUluZGV4LnN1YnN0cigxKSwgMTApO1xuICAgICAgICBpZiAoZGVsZXRlSW5kZXggPD0gcmV2ZXJzZUluZGV4KSB7XG4gICAgICAgICAgcmV2ZXJzZUluZGV4Kys7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZGVsdGFJdGVtLmxlbmd0aCA9PT0gMSAmJiBkZWx0YUluZGV4IDw9IHJldmVyc2VJbmRleCkge1xuICAgICAgICByZXZlcnNlSW5kZXgtLTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV2ZXJzZUluZGV4O1xufTtcblxudmFyIGNvbGxlY3RDaGlsZHJlblJldmVyc2VGaWx0ZXIgPSBmdW5jdGlvbiBjb2xsZWN0Q2hpbGRyZW5SZXZlcnNlRmlsdGVyKGNvbnRleHQpIHtcbiAgaWYgKCFjb250ZXh0IHx8ICFjb250ZXh0LmNoaWxkcmVuKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChjb250ZXh0LmRlbHRhLl90ICE9PSAnYScpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGxlbmd0aCA9IGNvbnRleHQuY2hpbGRyZW4ubGVuZ3RoO1xuICB2YXIgY2hpbGQ7XG4gIHZhciBkZWx0YSA9IHtcbiAgICBfdDogJ2EnXG4gIH07XG5cbiAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgIGNoaWxkID0gY29udGV4dC5jaGlsZHJlbltpbmRleF07XG4gICAgdmFyIG5hbWUgPSBjaGlsZC5uZXdOYW1lO1xuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIG5hbWUgPSByZXZlcnNlQXJyYXlEZWx0YUluZGV4KGNvbnRleHQuZGVsdGEsIGNoaWxkLmNoaWxkTmFtZSwgY2hpbGQucmVzdWx0KTtcbiAgICB9XG4gICAgaWYgKGRlbHRhW25hbWVdICE9PSBjaGlsZC5yZXN1bHQpIHtcbiAgICAgIGRlbHRhW25hbWVdID0gY2hpbGQucmVzdWx0O1xuICAgIH1cbiAgfVxuICBjb250ZXh0LnNldFJlc3VsdChkZWx0YSkuZXhpdCgpO1xufTtcbmNvbGxlY3RDaGlsZHJlblJldmVyc2VGaWx0ZXIuZmlsdGVyTmFtZSA9ICdhcnJheXNDb2xsZWN0Q2hpbGRyZW4nO1xuXG5leHBvcnRzLmRpZmZGaWx0ZXIgPSBkaWZmRmlsdGVyO1xuZXhwb3J0cy5wYXRjaEZpbHRlciA9IHBhdGNoRmlsdGVyO1xuZXhwb3J0cy5jb2xsZWN0Q2hpbGRyZW5QYXRjaEZpbHRlciA9IGNvbGxlY3RDaGlsZHJlblBhdGNoRmlsdGVyO1xuZXhwb3J0cy5yZXZlcnNlRmlsdGVyID0gcmV2ZXJzZUZpbHRlcjtcbmV4cG9ydHMuY29sbGVjdENoaWxkcmVuUmV2ZXJzZUZpbHRlciA9IGNvbGxlY3RDaGlsZHJlblJldmVyc2VGaWx0ZXI7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vanNvbmRpZmZwYXRjaC9zcmMvZmlsdGVycy9hcnJheXMuanNcbiAqKi8iLCJ2YXIgZGlmZkZpbHRlciA9IGZ1bmN0aW9uIGRhdGVzRGlmZkZpbHRlcihjb250ZXh0KSB7XG4gIGlmIChjb250ZXh0LmxlZnQgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgaWYgKGNvbnRleHQucmlnaHQgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICBpZiAoY29udGV4dC5sZWZ0LmdldFRpbWUoKSAhPT0gY29udGV4dC5yaWdodC5nZXRUaW1lKCkpIHtcbiAgICAgICAgY29udGV4dC5zZXRSZXN1bHQoW2NvbnRleHQubGVmdCwgY29udGV4dC5yaWdodF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGV4dC5zZXRSZXN1bHQodW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29udGV4dC5zZXRSZXN1bHQoW2NvbnRleHQubGVmdCwgY29udGV4dC5yaWdodF0pO1xuICAgIH1cbiAgICBjb250ZXh0LmV4aXQoKTtcbiAgfSBlbHNlIGlmIChjb250ZXh0LnJpZ2h0IGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIGNvbnRleHQuc2V0UmVzdWx0KFtjb250ZXh0LmxlZnQsIGNvbnRleHQucmlnaHRdKS5leGl0KCk7XG4gIH1cbn07XG5kaWZmRmlsdGVyLmZpbHRlck5hbWUgPSAnZGF0ZXMnO1xuXG5leHBvcnRzLmRpZmZGaWx0ZXIgPSBkaWZmRmlsdGVyO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2ZpbHRlcnMvZGF0ZXMuanNcbiAqKi8iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHV1aWQgZnJvbSAnbm9kZS11dWlkJztcblxuXG5jbGFzcyBSZXNvdXJjZSB7XG5cbiAgY29uc3RydWN0b3IoYXR0cmlidXRlcykge1xuXG4gICAgdGhpcy5hdHRyaWJ1dGVzID0ge307XG4gICAgdGhpcy5saW5rcyA9IHt9O1xuICAgIHRoaXMucmlkID0gdXVpZC52NCgpO1xuXG4gICAgdGhpcy5kZXNlcmlhbGl6ZShhdHRyaWJ1dGVzKTtcblxuICB9XG5cbiAgZ2V0IChrZXkpIHtcblxuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNba2V5XTtcblxuICB9XG5cbiAgc2V0IChhdHRyaWJ1dGVzKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xuXG4gIH1cblxuICB1bnNldCAoa2V5KSB7XG5cbiAgICBkZWxldGUgdGhpcy5hdHRyaWJ1dGVzW2tleV07XG5cbiAgfVxuXG4gIGdldExpbmsgKGtleSkge1xuXG4gICAga2V5ID0ga2V5IHx8ICdzZWxmJztcbiAgICByZXR1cm4gdGhpcy5saW5rc1trZXldO1xuXG4gIH1cblxuICBzZXRMaW5rIChsaW5rcykge1xuXG4gICAgXy5leHRlbmQodGhpcy5saW5rcywgbGlua3MpO1xuXG4gIH1cblxuICB1bnNldExpbmsgKGtleSkge1xuXG4gICAgZGVsZXRlIHRoaXMubGlua3Nba2V5XTtcblxuICB9XG5cbiAgZ2V0TGlua2FnZSAoKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogdGhpcy5hdHRyaWJ1dGVzLnR5cGUsXG4gICAgICBpZDogdGhpcy5hdHRyaWJ1dGVzLmlkXG4gICAgfTtcblxuICB9XG5cbiAgc2VyaWFsaXplICgpIHtcblxuICAgIGxldCByZXN1bHQgPSBfLmNsb25lKHRoaXMuYXR0cmlidXRlcywgdHJ1ZSk7XG4gICAgcmVzdWx0LmxpbmtzID0gdGhpcy5saW5rcztcblxuICAgIGlmIChfLmlzRW1wdHkocmVzdWx0LmxpbmtzKSkge1xuICAgICAgZGVsZXRlIHJlc3VsdC5saW5rcztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIH1cblxuICBkZXNlcmlhbGl6ZSAoc2VyaWFsaXplZCkge1xuXG4gICAgaWYgKCF0aGlzLl92YWxpZGF0ZVNlcmlhbGl6ZWQoc2VyaWFsaXplZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBkYXRhISB0eXBlIHNob3VsZCBiZSBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KF8uY2xvbmUoXy5vbWl0KHNlcmlhbGl6ZWQsICdsaW5rcycpLCB0cnVlKSk7XG4gICAgdGhpcy5zZXRMaW5rKHNlcmlhbGl6ZWQubGlua3MpO1xuXG4gIH1cblxuICBjbG9uZSAoKSB7XG5cbiAgICBsZXQgcmVzb3VyY2UgPSBuZXcgUmVzb3VyY2UodGhpcy5zZXJpYWxpemUoKSk7XG4gICAgcmVzb3VyY2UudXVpZCA9IHRoaXMudXVpZDtcbiAgICByZXR1cm4gcmVzb3VyY2U7XG5cbiAgfVxuXG4gIF92YWxpZGF0ZVNlcmlhbGl6ZWQgKHNlcmlhbGl6ZWQpIHtcblxuICAgIHJldHVybiBzZXJpYWxpemVkICYmIHNlcmlhbGl6ZWQudHlwZTtcblxuICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL1Jlc291cmNlLmpzXG4gKiovIiwidmFyIERpZmZDb250ZXh0ID0gcmVxdWlyZSgnLi4vY29udGV4dHMvZGlmZicpLkRpZmZDb250ZXh0O1xudmFyIFBhdGNoQ29udGV4dCA9IHJlcXVpcmUoJy4uL2NvbnRleHRzL3BhdGNoJykuUGF0Y2hDb250ZXh0O1xudmFyIFJldmVyc2VDb250ZXh0ID0gcmVxdWlyZSgnLi4vY29udGV4dHMvcmV2ZXJzZScpLlJldmVyc2VDb250ZXh0O1xuXG52YXIgY29sbGVjdENoaWxkcmVuRGlmZkZpbHRlciA9IGZ1bmN0aW9uIGNvbGxlY3RDaGlsZHJlbkRpZmZGaWx0ZXIoY29udGV4dCkge1xuICBpZiAoIWNvbnRleHQgfHwgIWNvbnRleHQuY2hpbGRyZW4pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGxlbmd0aCA9IGNvbnRleHQuY2hpbGRyZW4ubGVuZ3RoO1xuICB2YXIgY2hpbGQ7XG4gIHZhciByZXN1bHQgPSBjb250ZXh0LnJlc3VsdDtcbiAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgIGNoaWxkID0gY29udGV4dC5jaGlsZHJlbltpbmRleF07XG4gICAgaWYgKHR5cGVvZiBjaGlsZC5yZXN1bHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmVzdWx0ID0gcmVzdWx0IHx8IHt9O1xuICAgIHJlc3VsdFtjaGlsZC5jaGlsZE5hbWVdID0gY2hpbGQucmVzdWx0O1xuICB9XG4gIGlmIChyZXN1bHQgJiYgY29udGV4dC5sZWZ0SXNBcnJheSkge1xuICAgIHJlc3VsdC5fdCA9ICdhJztcbiAgfVxuICBjb250ZXh0LnNldFJlc3VsdChyZXN1bHQpLmV4aXQoKTtcbn07XG5jb2xsZWN0Q2hpbGRyZW5EaWZmRmlsdGVyLmZpbHRlck5hbWUgPSAnY29sbGVjdENoaWxkcmVuJztcblxudmFyIG9iamVjdHNEaWZmRmlsdGVyID0gZnVuY3Rpb24gb2JqZWN0c0RpZmZGaWx0ZXIoY29udGV4dCkge1xuICBpZiAoY29udGV4dC5sZWZ0SXNBcnJheSB8fCBjb250ZXh0LmxlZnRUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBuYW1lLCBjaGlsZDtcbiAgZm9yIChuYW1lIGluIGNvbnRleHQubGVmdCkge1xuICAgIGNoaWxkID0gbmV3IERpZmZDb250ZXh0KGNvbnRleHQubGVmdFtuYW1lXSwgY29udGV4dC5yaWdodFtuYW1lXSk7XG4gICAgY29udGV4dC5wdXNoKGNoaWxkLCBuYW1lKTtcbiAgfVxuICBmb3IgKG5hbWUgaW4gY29udGV4dC5yaWdodCkge1xuICAgIGlmICh0eXBlb2YgY29udGV4dC5sZWZ0W25hbWVdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgY2hpbGQgPSBuZXcgRGlmZkNvbnRleHQodW5kZWZpbmVkLCBjb250ZXh0LnJpZ2h0W25hbWVdKTtcbiAgICAgIGNvbnRleHQucHVzaChjaGlsZCwgbmFtZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb250ZXh0LmNoaWxkcmVuIHx8IGNvbnRleHQuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgY29udGV4dC5zZXRSZXN1bHQodW5kZWZpbmVkKS5leGl0KCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnRleHQuZXhpdCgpO1xufTtcbm9iamVjdHNEaWZmRmlsdGVyLmZpbHRlck5hbWUgPSAnb2JqZWN0cyc7XG5cbnZhciBwYXRjaEZpbHRlciA9IGZ1bmN0aW9uIG5lc3RlZFBhdGNoRmlsdGVyKGNvbnRleHQpIHtcbiAgaWYgKCFjb250ZXh0Lm5lc3RlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoY29udGV4dC5kZWx0YS5fdCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmFtZSwgY2hpbGQ7XG4gIGZvciAobmFtZSBpbiBjb250ZXh0LmRlbHRhKSB7XG4gICAgY2hpbGQgPSBuZXcgUGF0Y2hDb250ZXh0KGNvbnRleHQubGVmdFtuYW1lXSwgY29udGV4dC5kZWx0YVtuYW1lXSk7XG4gICAgY29udGV4dC5wdXNoKGNoaWxkLCBuYW1lKTtcbiAgfVxuICBjb250ZXh0LmV4aXQoKTtcbn07XG5wYXRjaEZpbHRlci5maWx0ZXJOYW1lID0gJ29iamVjdHMnO1xuXG52YXIgY29sbGVjdENoaWxkcmVuUGF0Y2hGaWx0ZXIgPSBmdW5jdGlvbiBjb2xsZWN0Q2hpbGRyZW5QYXRjaEZpbHRlcihjb250ZXh0KSB7XG4gIGlmICghY29udGV4dCB8fCAhY29udGV4dC5jaGlsZHJlbikge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoY29udGV4dC5kZWx0YS5fdCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbGVuZ3RoID0gY29udGV4dC5jaGlsZHJlbi5sZW5ndGg7XG4gIHZhciBjaGlsZDtcbiAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgIGNoaWxkID0gY29udGV4dC5jaGlsZHJlbltpbmRleF07XG4gICAgaWYgKGNvbnRleHQubGVmdC5oYXNPd25Qcm9wZXJ0eShjaGlsZC5jaGlsZE5hbWUpICYmIGNoaWxkLnJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWxldGUgY29udGV4dC5sZWZ0W2NoaWxkLmNoaWxkTmFtZV07XG4gICAgfSBlbHNlIGlmIChjb250ZXh0LmxlZnRbY2hpbGQuY2hpbGROYW1lXSAhPT0gY2hpbGQucmVzdWx0KSB7XG4gICAgICBjb250ZXh0LmxlZnRbY2hpbGQuY2hpbGROYW1lXSA9IGNoaWxkLnJlc3VsdDtcbiAgICB9XG4gIH1cbiAgY29udGV4dC5zZXRSZXN1bHQoY29udGV4dC5sZWZ0KS5leGl0KCk7XG59O1xuY29sbGVjdENoaWxkcmVuUGF0Y2hGaWx0ZXIuZmlsdGVyTmFtZSA9ICdjb2xsZWN0Q2hpbGRyZW4nO1xuXG52YXIgcmV2ZXJzZUZpbHRlciA9IGZ1bmN0aW9uIG5lc3RlZFJldmVyc2VGaWx0ZXIoY29udGV4dCkge1xuICBpZiAoIWNvbnRleHQubmVzdGVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChjb250ZXh0LmRlbHRhLl90KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuYW1lLCBjaGlsZDtcbiAgZm9yIChuYW1lIGluIGNvbnRleHQuZGVsdGEpIHtcbiAgICBjaGlsZCA9IG5ldyBSZXZlcnNlQ29udGV4dChjb250ZXh0LmRlbHRhW25hbWVdKTtcbiAgICBjb250ZXh0LnB1c2goY2hpbGQsIG5hbWUpO1xuICB9XG4gIGNvbnRleHQuZXhpdCgpO1xufTtcbnJldmVyc2VGaWx0ZXIuZmlsdGVyTmFtZSA9ICdvYmplY3RzJztcblxudmFyIGNvbGxlY3RDaGlsZHJlblJldmVyc2VGaWx0ZXIgPSBmdW5jdGlvbiBjb2xsZWN0Q2hpbGRyZW5SZXZlcnNlRmlsdGVyKGNvbnRleHQpIHtcbiAgaWYgKCFjb250ZXh0IHx8ICFjb250ZXh0LmNoaWxkcmVuKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChjb250ZXh0LmRlbHRhLl90KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBsZW5ndGggPSBjb250ZXh0LmNoaWxkcmVuLmxlbmd0aDtcbiAgdmFyIGNoaWxkO1xuICB2YXIgZGVsdGEgPSB7fTtcbiAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgIGNoaWxkID0gY29udGV4dC5jaGlsZHJlbltpbmRleF07XG4gICAgaWYgKGRlbHRhW2NoaWxkLmNoaWxkTmFtZV0gIT09IGNoaWxkLnJlc3VsdCkge1xuICAgICAgZGVsdGFbY2hpbGQuY2hpbGROYW1lXSA9IGNoaWxkLnJlc3VsdDtcbiAgICB9XG4gIH1cbiAgY29udGV4dC5zZXRSZXN1bHQoZGVsdGEpLmV4aXQoKTtcbn07XG5jb2xsZWN0Q2hpbGRyZW5SZXZlcnNlRmlsdGVyLmZpbHRlck5hbWUgPSAnY29sbGVjdENoaWxkcmVuJztcblxuZXhwb3J0cy5jb2xsZWN0Q2hpbGRyZW5EaWZmRmlsdGVyID0gY29sbGVjdENoaWxkcmVuRGlmZkZpbHRlcjtcbmV4cG9ydHMub2JqZWN0c0RpZmZGaWx0ZXIgPSBvYmplY3RzRGlmZkZpbHRlcjtcbmV4cG9ydHMucGF0Y2hGaWx0ZXIgPSBwYXRjaEZpbHRlcjtcbmV4cG9ydHMuY29sbGVjdENoaWxkcmVuUGF0Y2hGaWx0ZXIgPSBjb2xsZWN0Q2hpbGRyZW5QYXRjaEZpbHRlcjtcbmV4cG9ydHMucmV2ZXJzZUZpbHRlciA9IHJldmVyc2VGaWx0ZXI7XG5leHBvcnRzLmNvbGxlY3RDaGlsZHJlblJldmVyc2VGaWx0ZXIgPSBjb2xsZWN0Q2hpbGRyZW5SZXZlcnNlRmlsdGVyO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2ZpbHRlcnMvbmVzdGVkLmpzXG4gKiovIiwiLyogZ2xvYmFsIGRpZmZfbWF0Y2hfcGF0Y2ggKi9cbnZhciBURVhUX0RJRkYgPSAyO1xudmFyIERFRkFVTFRfTUlOX0xFTkdUSCA9IDYwO1xudmFyIGNhY2hlZERpZmZQYXRjaCA9IG51bGw7XG5cbnZhciBnZXREaWZmTWF0Y2hQYXRjaCA9IGZ1bmN0aW9uKCkge1xuICAvKmpzaGludCBjYW1lbGNhc2U6IGZhbHNlICovXG5cbiAgaWYgKCFjYWNoZWREaWZmUGF0Y2gpIHtcbiAgICB2YXIgaW5zdGFuY2U7XG4gICAgaWYgKHR5cGVvZiBkaWZmX21hdGNoX3BhdGNoICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gYWxyZWFkeSBsb2FkZWQsIHByb2JhYmx5IGEgYnJvd3NlclxuICAgICAgaW5zdGFuY2UgPSB0eXBlb2YgZGlmZl9tYXRjaF9wYXRjaCA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgIG5ldyBkaWZmX21hdGNoX3BhdGNoKCkgOiBuZXcgZGlmZl9tYXRjaF9wYXRjaC5kaWZmX21hdGNoX3BhdGNoKCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGRtcE1vZHVsZU5hbWUgPSAnZGlmZl9tYXRjaF9wYXRjaF91bmNvbXByZXNzZWQnO1xuICAgICAgICB2YXIgZG1wID0gcmVxdWlyZSgnLi4vLi4vcHVibGljL2V4dGVybmFsLycgKyBkbXBNb2R1bGVOYW1lKTtcbiAgICAgICAgaW5zdGFuY2UgPSBuZXcgZG1wLmRpZmZfbWF0Y2hfcGF0Y2goKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpbnN0YW5jZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcigndGV4dCBkaWZmX21hdGNoX3BhdGNoIGxpYnJhcnkgbm90IGZvdW5kJyk7XG4gICAgICBlcnJvci5kaWZmX21hdGNoX3BhdGNoX25vdF9mb3VuZCA9IHRydWU7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gICAgY2FjaGVkRGlmZlBhdGNoID0ge1xuICAgICAgZGlmZjogZnVuY3Rpb24odHh0MSwgdHh0Mikge1xuICAgICAgICByZXR1cm4gaW5zdGFuY2UucGF0Y2hfdG9UZXh0KGluc3RhbmNlLnBhdGNoX21ha2UodHh0MSwgdHh0MikpO1xuICAgICAgfSxcbiAgICAgIHBhdGNoOiBmdW5jdGlvbih0eHQxLCBwYXRjaCkge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IGluc3RhbmNlLnBhdGNoX2FwcGx5KGluc3RhbmNlLnBhdGNoX2Zyb21UZXh0KHBhdGNoKSwgdHh0MSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0c1sxXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICghcmVzdWx0c1sxXVtpXSkge1xuICAgICAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKCd0ZXh0IHBhdGNoIGZhaWxlZCcpO1xuICAgICAgICAgICAgZXJyb3IudGV4dFBhdGNoRmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNbMF07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICByZXR1cm4gY2FjaGVkRGlmZlBhdGNoO1xufTtcblxudmFyIGRpZmZGaWx0ZXIgPSBmdW5jdGlvbiB0ZXh0c0RpZmZGaWx0ZXIoY29udGV4dCkge1xuICBpZiAoY29udGV4dC5sZWZ0VHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG1pbkxlbmd0aCA9IChjb250ZXh0Lm9wdGlvbnMgJiYgY29udGV4dC5vcHRpb25zLnRleHREaWZmICYmXG4gICAgY29udGV4dC5vcHRpb25zLnRleHREaWZmLm1pbkxlbmd0aCkgfHwgREVGQVVMVF9NSU5fTEVOR1RIO1xuICBpZiAoY29udGV4dC5sZWZ0Lmxlbmd0aCA8IG1pbkxlbmd0aCB8fFxuICAgIGNvbnRleHQucmlnaHQubGVuZ3RoIDwgbWluTGVuZ3RoKSB7XG4gICAgY29udGV4dC5zZXRSZXN1bHQoW2NvbnRleHQubGVmdCwgY29udGV4dC5yaWdodF0pLmV4aXQoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gbGFyZ2UgdGV4dCwgdXNlIGEgdGV4dC1kaWZmIGFsZ29yaXRobVxuICB2YXIgZGlmZiA9IGdldERpZmZNYXRjaFBhdGNoKCkuZGlmZjtcbiAgY29udGV4dC5zZXRSZXN1bHQoW2RpZmYoY29udGV4dC5sZWZ0LCBjb250ZXh0LnJpZ2h0KSwgMCwgVEVYVF9ESUZGXSkuZXhpdCgpO1xufTtcbmRpZmZGaWx0ZXIuZmlsdGVyTmFtZSA9ICd0ZXh0cyc7XG5cbnZhciBwYXRjaEZpbHRlciA9IGZ1bmN0aW9uIHRleHRzUGF0Y2hGaWx0ZXIoY29udGV4dCkge1xuICBpZiAoY29udGV4dC5uZXN0ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGNvbnRleHQuZGVsdGFbMl0gIT09IFRFWFRfRElGRikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIHRleHQtZGlmZiwgdXNlIGEgdGV4dC1wYXRjaCBhbGdvcml0aG1cbiAgdmFyIHBhdGNoID0gZ2V0RGlmZk1hdGNoUGF0Y2goKS5wYXRjaDtcbiAgY29udGV4dC5zZXRSZXN1bHQocGF0Y2goY29udGV4dC5sZWZ0LCBjb250ZXh0LmRlbHRhWzBdKSkuZXhpdCgpO1xufTtcbnBhdGNoRmlsdGVyLmZpbHRlck5hbWUgPSAndGV4dHMnO1xuXG52YXIgdGV4dERlbHRhUmV2ZXJzZSA9IGZ1bmN0aW9uKGRlbHRhKSB7XG4gIHZhciBpLCBsLCBsaW5lcywgbGluZSwgbGluZVRtcCwgaGVhZGVyID0gbnVsbCxcbiAgICBoZWFkZXJSZWdleCA9IC9eQEAgK1xcLShcXGQrKSwoXFxkKykgK1xcKyhcXGQrKSwoXFxkKykgK0BAJC8sXG4gICAgbGluZUhlYWRlciwgbGluZUFkZCwgbGluZVJlbW92ZTtcbiAgbGluZXMgPSBkZWx0YS5zcGxpdCgnXFxuJyk7XG4gIGZvciAoaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBsaW5lID0gbGluZXNbaV07XG4gICAgdmFyIGxpbmVTdGFydCA9IGxpbmUuc2xpY2UoMCwgMSk7XG4gICAgaWYgKGxpbmVTdGFydCA9PT0gJ0AnKSB7XG4gICAgICBoZWFkZXIgPSBoZWFkZXJSZWdleC5leGVjKGxpbmUpO1xuICAgICAgbGluZUhlYWRlciA9IGk7XG4gICAgICBsaW5lQWRkID0gbnVsbDtcbiAgICAgIGxpbmVSZW1vdmUgPSBudWxsO1xuXG4gICAgICAvLyBmaXggaGVhZGVyXG4gICAgICBsaW5lc1tsaW5lSGVhZGVyXSA9ICdAQCAtJyArIGhlYWRlclszXSArICcsJyArIGhlYWRlcls0XSArICcgKycgKyBoZWFkZXJbMV0gKyAnLCcgKyBoZWFkZXJbMl0gKyAnIEBAJztcbiAgICB9IGVsc2UgaWYgKGxpbmVTdGFydCA9PT0gJysnKSB7XG4gICAgICBsaW5lQWRkID0gaTtcbiAgICAgIGxpbmVzW2ldID0gJy0nICsgbGluZXNbaV0uc2xpY2UoMSk7XG4gICAgICBpZiAobGluZXNbaSAtIDFdLnNsaWNlKDAsIDEpID09PSAnKycpIHtcbiAgICAgICAgLy8gc3dhcCBsaW5lcyB0byBrZWVwIGRlZmF1bHQgb3JkZXIgKC0rKVxuICAgICAgICBsaW5lVG1wID0gbGluZXNbaV07XG4gICAgICAgIGxpbmVzW2ldID0gbGluZXNbaSAtIDFdO1xuICAgICAgICBsaW5lc1tpIC0gMV0gPSBsaW5lVG1wO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobGluZVN0YXJ0ID09PSAnLScpIHtcbiAgICAgIGxpbmVSZW1vdmUgPSBpO1xuICAgICAgbGluZXNbaV0gPSAnKycgKyBsaW5lc1tpXS5zbGljZSgxKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xufTtcblxudmFyIHJldmVyc2VGaWx0ZXIgPSBmdW5jdGlvbiB0ZXh0c1JldmVyc2VGaWx0ZXIoY29udGV4dCkge1xuICBpZiAoY29udGV4dC5uZXN0ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGNvbnRleHQuZGVsdGFbMl0gIT09IFRFWFRfRElGRikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIHRleHQtZGlmZiwgdXNlIGEgdGV4dC1kaWZmIGFsZ29yaXRobVxuICBjb250ZXh0LnNldFJlc3VsdChbdGV4dERlbHRhUmV2ZXJzZShjb250ZXh0LmRlbHRhWzBdKSwgMCwgVEVYVF9ESUZGXSkuZXhpdCgpO1xufTtcbnJldmVyc2VGaWx0ZXIuZmlsdGVyTmFtZSA9ICd0ZXh0cyc7XG5cbmV4cG9ydHMuZGlmZkZpbHRlciA9IGRpZmZGaWx0ZXI7XG5leHBvcnRzLnBhdGNoRmlsdGVyID0gcGF0Y2hGaWx0ZXI7XG5leHBvcnRzLnJldmVyc2VGaWx0ZXIgPSByZXZlcnNlRmlsdGVyO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2ZpbHRlcnMvdGV4dHMuanNcbiAqKi8iLCJ2YXIgaXNBcnJheSA9ICh0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJykgP1xuICAvLyB1c2UgbmF0aXZlIGZ1bmN0aW9uXG4gIEFycmF5LmlzQXJyYXkgOlxuICAvLyB1c2UgaW5zdGFuY2VvZiBvcGVyYXRvclxuICBmdW5jdGlvbihhKSB7XG4gICAgcmV0dXJuIGEgaW5zdGFuY2VvZiBBcnJheTtcbiAgfTtcblxudmFyIGRpZmZGaWx0ZXIgPSBmdW5jdGlvbiB0cml2aWFsTWF0Y2hlc0RpZmZGaWx0ZXIoY29udGV4dCkge1xuICBpZiAoY29udGV4dC5sZWZ0ID09PSBjb250ZXh0LnJpZ2h0KSB7XG4gICAgY29udGV4dC5zZXRSZXN1bHQodW5kZWZpbmVkKS5leGl0KCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh0eXBlb2YgY29udGV4dC5sZWZ0ID09PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgY29udGV4dC5yaWdodCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdmdW5jdGlvbnMgYXJlIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICB9XG4gICAgY29udGV4dC5zZXRSZXN1bHQoW2NvbnRleHQucmlnaHRdKS5leGl0KCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh0eXBlb2YgY29udGV4dC5yaWdodCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjb250ZXh0LnNldFJlc3VsdChbY29udGV4dC5sZWZ0LCAwLCAwXSkuZXhpdCgpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodHlwZW9mIGNvbnRleHQubGVmdCA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgY29udGV4dC5yaWdodCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcignZnVuY3Rpb25zIGFyZSBub3Qgc3VwcG9ydGVkJyk7XG4gIH1cbiAgY29udGV4dC5sZWZ0VHlwZSA9IGNvbnRleHQubGVmdCA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiBjb250ZXh0LmxlZnQ7XG4gIGNvbnRleHQucmlnaHRUeXBlID0gY29udGV4dC5yaWdodCA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiBjb250ZXh0LnJpZ2h0O1xuICBpZiAoY29udGV4dC5sZWZ0VHlwZSAhPT0gY29udGV4dC5yaWdodFR5cGUpIHtcbiAgICBjb250ZXh0LnNldFJlc3VsdChbY29udGV4dC5sZWZ0LCBjb250ZXh0LnJpZ2h0XSkuZXhpdCgpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoY29udGV4dC5sZWZ0VHlwZSA9PT0gJ2Jvb2xlYW4nIHx8IGNvbnRleHQubGVmdFR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgY29udGV4dC5zZXRSZXN1bHQoW2NvbnRleHQubGVmdCwgY29udGV4dC5yaWdodF0pLmV4aXQoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGNvbnRleHQubGVmdFR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgY29udGV4dC5sZWZ0SXNBcnJheSA9IGlzQXJyYXkoY29udGV4dC5sZWZ0KTtcbiAgfVxuICBpZiAoY29udGV4dC5yaWdodFR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgY29udGV4dC5yaWdodElzQXJyYXkgPSBpc0FycmF5KGNvbnRleHQucmlnaHQpO1xuICB9XG4gIGlmIChjb250ZXh0LmxlZnRJc0FycmF5ICE9PSBjb250ZXh0LnJpZ2h0SXNBcnJheSkge1xuICAgIGNvbnRleHQuc2V0UmVzdWx0KFtjb250ZXh0LmxlZnQsIGNvbnRleHQucmlnaHRdKS5leGl0KCk7XG4gICAgcmV0dXJuO1xuICB9XG59O1xuZGlmZkZpbHRlci5maWx0ZXJOYW1lID0gJ3RyaXZpYWwnO1xuXG52YXIgcGF0Y2hGaWx0ZXIgPSBmdW5jdGlvbiB0cml2aWFsTWF0Y2hlc1BhdGNoRmlsdGVyKGNvbnRleHQpIHtcbiAgaWYgKHR5cGVvZiBjb250ZXh0LmRlbHRhID09PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnRleHQuc2V0UmVzdWx0KGNvbnRleHQubGVmdCkuZXhpdCgpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb250ZXh0Lm5lc3RlZCA9ICFpc0FycmF5KGNvbnRleHQuZGVsdGEpO1xuICBpZiAoY29udGV4dC5uZXN0ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGNvbnRleHQuZGVsdGEubGVuZ3RoID09PSAxKSB7XG4gICAgY29udGV4dC5zZXRSZXN1bHQoY29udGV4dC5kZWx0YVswXSkuZXhpdCgpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoY29udGV4dC5kZWx0YS5sZW5ndGggPT09IDIpIHtcbiAgICBjb250ZXh0LnNldFJlc3VsdChjb250ZXh0LmRlbHRhWzFdKS5leGl0KCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChjb250ZXh0LmRlbHRhLmxlbmd0aCA9PT0gMyAmJiBjb250ZXh0LmRlbHRhWzJdID09PSAwKSB7XG4gICAgY29udGV4dC5zZXRSZXN1bHQodW5kZWZpbmVkKS5leGl0KCk7XG4gICAgcmV0dXJuO1xuICB9XG59O1xucGF0Y2hGaWx0ZXIuZmlsdGVyTmFtZSA9ICd0cml2aWFsJztcblxudmFyIHJldmVyc2VGaWx0ZXIgPSBmdW5jdGlvbiB0cml2aWFsUmVmZXJzZUZpbHRlcihjb250ZXh0KSB7XG4gIGlmICh0eXBlb2YgY29udGV4dC5kZWx0YSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjb250ZXh0LnNldFJlc3VsdChjb250ZXh0LmRlbHRhKS5leGl0KCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnRleHQubmVzdGVkID0gIWlzQXJyYXkoY29udGV4dC5kZWx0YSk7XG4gIGlmIChjb250ZXh0Lm5lc3RlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoY29udGV4dC5kZWx0YS5sZW5ndGggPT09IDEpIHtcbiAgICBjb250ZXh0LnNldFJlc3VsdChbY29udGV4dC5kZWx0YVswXSwgMCwgMF0pLmV4aXQoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGNvbnRleHQuZGVsdGEubGVuZ3RoID09PSAyKSB7XG4gICAgY29udGV4dC5zZXRSZXN1bHQoW2NvbnRleHQuZGVsdGFbMV0sIGNvbnRleHQuZGVsdGFbMF1dKS5leGl0KCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChjb250ZXh0LmRlbHRhLmxlbmd0aCA9PT0gMyAmJiBjb250ZXh0LmRlbHRhWzJdID09PSAwKSB7XG4gICAgY29udGV4dC5zZXRSZXN1bHQoW2NvbnRleHQuZGVsdGFbMF1dKS5leGl0KCk7XG4gICAgcmV0dXJuO1xuICB9XG59O1xucmV2ZXJzZUZpbHRlci5maWx0ZXJOYW1lID0gJ3RyaXZpYWwnO1xuXG5leHBvcnRzLmRpZmZGaWx0ZXIgPSBkaWZmRmlsdGVyO1xuZXhwb3J0cy5wYXRjaEZpbHRlciA9IHBhdGNoRmlsdGVyO1xuZXhwb3J0cy5yZXZlcnNlRmlsdGVyID0gcmV2ZXJzZUZpbHRlcjtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9qc29uZGlmZnBhdGNoL3NyYy9maWx0ZXJzL3RyaXZpYWwuanNcbiAqKi8iLCJ2YXIgYmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xudmFyIEJhc2VGb3JtYXR0ZXIgPSBiYXNlLkJhc2VGb3JtYXR0ZXI7XG5cbnZhciBBbm5vdGF0ZWRGb3JtYXR0ZXIgPSBmdW5jdGlvbiBBbm5vdGF0ZWRGb3JtYXR0ZXIoKSB7XG4gIHRoaXMuaW5jbHVkZU1vdmVEZXN0aW5hdGlvbnMgPSBmYWxzZTtcbn07XG5cbkFubm90YXRlZEZvcm1hdHRlci5wcm90b3R5cGUgPSBuZXcgQmFzZUZvcm1hdHRlcigpO1xuXG5Bbm5vdGF0ZWRGb3JtYXR0ZXIucHJvdG90eXBlLnByZXBhcmVDb250ZXh0ID0gZnVuY3Rpb24oY29udGV4dCkge1xuICBCYXNlRm9ybWF0dGVyLnByb3RvdHlwZS5wcmVwYXJlQ29udGV4dC5jYWxsKHRoaXMsIGNvbnRleHQpO1xuICBjb250ZXh0LmluZGVudCA9IGZ1bmN0aW9uKGxldmVscykge1xuICAgIHRoaXMuaW5kZW50TGV2ZWwgPSAodGhpcy5pbmRlbnRMZXZlbCB8fCAwKSArXG4gICAgICAodHlwZW9mIGxldmVscyA9PT0gJ3VuZGVmaW5lZCcgPyAxIDogbGV2ZWxzKTtcbiAgICB0aGlzLmluZGVudFBhZCA9IG5ldyBBcnJheSh0aGlzLmluZGVudExldmVsICsgMSkuam9pbignJm5ic3A7Jm5ic3A7Jyk7XG4gIH07XG4gIGNvbnRleHQucm93ID0gZnVuY3Rpb24oanNvbiwgaHRtbE5vdGUpIHtcbiAgICBjb250ZXh0Lm91dCgnPHRyPjx0ZCBzdHlsZT1cIndoaXRlLXNwYWNlOiBub3dyYXA7XCI+JyArXG4gICAgICAnPHByZSBjbGFzcz1cImpzb25kaWZmcGF0Y2gtYW5ub3RhdGVkLWluZGVudFwiIHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrXCI+Jyk7XG4gICAgY29udGV4dC5vdXQoY29udGV4dC5pbmRlbnRQYWQpO1xuICAgIGNvbnRleHQub3V0KCc8L3ByZT48cHJlIHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrXCI+Jyk7XG4gICAgY29udGV4dC5vdXQoanNvbik7XG4gICAgY29udGV4dC5vdXQoJzwvcHJlPjwvdGQ+PHRkIGNsYXNzPVwianNvbmRpZmZwYXRjaC1kZWx0YS1ub3RlXCI+PGRpdj4nKTtcbiAgICBjb250ZXh0Lm91dChodG1sTm90ZSk7XG4gICAgY29udGV4dC5vdXQoJzwvZGl2PjwvdGQ+PC90cj4nKTtcbiAgfTtcbn07XG5cbkFubm90YXRlZEZvcm1hdHRlci5wcm90b3R5cGUudHlwZUZvcm1hdHR0ZXJFcnJvckZvcm1hdHRlciA9IGZ1bmN0aW9uKGNvbnRleHQsIGVycikge1xuICBjb250ZXh0LnJvdygnJywgJzxwcmUgY2xhc3M9XCJqc29uZGlmZnBhdGNoLWVycm9yXCI+JyArIGVyciArICc8L3ByZT4nKTtcbn07XG5cbkFubm90YXRlZEZvcm1hdHRlci5wcm90b3R5cGUuZm9ybWF0VGV4dERpZmZTdHJpbmcgPSBmdW5jdGlvbihjb250ZXh0LCB2YWx1ZSkge1xuICB2YXIgbGluZXMgPSB0aGlzLnBhcnNlVGV4dERpZmYodmFsdWUpO1xuICBjb250ZXh0Lm91dCgnPHVsIGNsYXNzPVwianNvbmRpZmZwYXRjaC10ZXh0ZGlmZlwiPicpO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHZhciBsaW5lID0gbGluZXNbaV07XG4gICAgY29udGV4dC5vdXQoJzxsaT4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwianNvbmRpZmZwYXRjaC10ZXh0ZGlmZi1sb2NhdGlvblwiPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwianNvbmRpZmZwYXRjaC10ZXh0ZGlmZi1saW5lLW51bWJlclwiPicgK1xuICAgICAgbGluZS5sb2NhdGlvbi5saW5lICtcbiAgICAgICc8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJqc29uZGlmZnBhdGNoLXRleHRkaWZmLWNoYXJcIj4nICtcbiAgICAgIGxpbmUubG9jYXRpb24uY2hyICtcbiAgICAgICc8L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cImpzb25kaWZmcGF0Y2gtdGV4dGRpZmYtbGluZVwiPicpO1xuICAgIHZhciBwaWVjZXMgPSBsaW5lLnBpZWNlcztcbiAgICBmb3IgKHZhciBwaWVjZUluZGV4ID0gMCwgcGllY2VzTGVuZ3RoID0gcGllY2VzLmxlbmd0aDsgcGllY2VJbmRleCA8IHBpZWNlc0xlbmd0aDsgcGllY2VJbmRleCsrKSB7XG4gICAgICB2YXIgcGllY2UgPSBwaWVjZXNbcGllY2VJbmRleF07XG4gICAgICBjb250ZXh0Lm91dCgnPHNwYW4gY2xhc3M9XCJqc29uZGlmZnBhdGNoLXRleHRkaWZmLScgKyBwaWVjZS50eXBlICsgJ1wiPicgK1xuICAgICAgICBwaWVjZS50ZXh0ICsgJzwvc3Bhbj4nKTtcbiAgICB9XG4gICAgY29udGV4dC5vdXQoJzwvZGl2PjwvbGk+Jyk7XG4gIH1cbiAgY29udGV4dC5vdXQoJzwvdWw+Jyk7XG59O1xuXG5Bbm5vdGF0ZWRGb3JtYXR0ZXIucHJvdG90eXBlLnJvb3RCZWdpbiA9IGZ1bmN0aW9uKGNvbnRleHQsIHR5cGUsIG5vZGVUeXBlKSB7XG4gIGNvbnRleHQub3V0KCc8dGFibGUgY2xhc3M9XCJqc29uZGlmZnBhdGNoLWFubm90YXRlZC1kZWx0YVwiPicpO1xuICBpZiAodHlwZSA9PT0gJ25vZGUnKSB7XG4gICAgY29udGV4dC5yb3coJ3snKTtcbiAgICBjb250ZXh0LmluZGVudCgpO1xuICB9XG4gIGlmIChub2RlVHlwZSA9PT0gJ2FycmF5Jykge1xuICAgIGNvbnRleHQucm93KCdcIl90XCI6IFwiYVwiLCcsICdBcnJheSBkZWx0YSAobWVtYmVyIG5hbWVzIGluZGljYXRlIGFycmF5IGluZGljZXMpJyk7XG4gIH1cbn07XG5cbkFubm90YXRlZEZvcm1hdHRlci5wcm90b3R5cGUucm9vdEVuZCA9IGZ1bmN0aW9uKGNvbnRleHQsIHR5cGUpIHtcbiAgaWYgKHR5cGUgPT09ICdub2RlJykge1xuICAgIGNvbnRleHQuaW5kZW50KC0xKTtcbiAgICBjb250ZXh0LnJvdygnfScpO1xuICB9XG4gIGNvbnRleHQub3V0KCc8L3RhYmxlPicpO1xufTtcblxuQW5ub3RhdGVkRm9ybWF0dGVyLnByb3RvdHlwZS5ub2RlQmVnaW4gPSBmdW5jdGlvbihjb250ZXh0LCBrZXksIGxlZnRLZXksIHR5cGUsIG5vZGVUeXBlKSB7XG4gIGNvbnRleHQucm93KCcmcXVvdDsnICsga2V5ICsgJyZxdW90OzogeycpO1xuICBpZiAodHlwZSA9PT0gJ25vZGUnKSB7XG4gICAgY29udGV4dC5pbmRlbnQoKTtcbiAgfVxuICBpZiAobm9kZVR5cGUgPT09ICdhcnJheScpIHtcbiAgICBjb250ZXh0LnJvdygnXCJfdFwiOiBcImFcIiwnLCAnQXJyYXkgZGVsdGEgKG1lbWJlciBuYW1lcyBpbmRpY2F0ZSBhcnJheSBpbmRpY2VzKScpO1xuICB9XG59O1xuXG5Bbm5vdGF0ZWRGb3JtYXR0ZXIucHJvdG90eXBlLm5vZGVFbmQgPSBmdW5jdGlvbihjb250ZXh0LCBrZXksIGxlZnRLZXksIHR5cGUsIG5vZGVUeXBlLCBpc0xhc3QpIHtcbiAgaWYgKHR5cGUgPT09ICdub2RlJykge1xuICAgIGNvbnRleHQuaW5kZW50KC0xKTtcbiAgfVxuICBjb250ZXh0LnJvdygnfScgKyAoaXNMYXN0ID8gJycgOiAnLCcpKTtcbn07XG5cbi8qIGpzaGludCBjYW1lbGNhc2U6IGZhbHNlICovXG5cbkFubm90YXRlZEZvcm1hdHRlci5wcm90b3R5cGUuZm9ybWF0X3VuY2hhbmdlZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm47XG59O1xuXG5Bbm5vdGF0ZWRGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdF9tb3ZlZGVzdGluYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuO1xufTtcblxuXG5Bbm5vdGF0ZWRGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdF9ub2RlID0gZnVuY3Rpb24oY29udGV4dCwgZGVsdGEsIGxlZnQpIHtcbiAgLy8gcmVjdXJzZVxuICB0aGlzLmZvcm1hdERlbHRhQ2hpbGRyZW4oY29udGV4dCwgZGVsdGEsIGxlZnQpO1xufTtcblxudmFyIHdyYXBQcm9wZXJ0eU5hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiAnPHByZSBzdHlsZT1cImRpc3BsYXk6aW5saW5lLWJsb2NrXCI+JnF1b3Q7JyArIG5hbWUgKyAnJnF1b3Q7PC9wcmU+Jztcbn07XG5cbnZhciBkZWx0YUFubm90YXRpb25zID0ge1xuICBhZGRlZDogZnVuY3Rpb24oZGVsdGEsIGxlZnQsIGtleSwgbGVmdEtleSkge1xuICAgIHZhciBmb3JtYXRMZWdlbmQgPSAnIDxwcmU+KFtuZXdWYWx1ZV0pPC9wcmU+JztcbiAgICBpZiAodHlwZW9mIGxlZnRLZXkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gJ25ldyB2YWx1ZScgKyBmb3JtYXRMZWdlbmQ7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbGVmdEtleSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiAnaW5zZXJ0IGF0IGluZGV4ICcgKyBsZWZ0S2V5ICsgZm9ybWF0TGVnZW5kO1xuICAgIH1cbiAgICByZXR1cm4gJ2FkZCBwcm9wZXJ0eSAnICsgd3JhcFByb3BlcnR5TmFtZShsZWZ0S2V5KSArIGZvcm1hdExlZ2VuZDtcbiAgfSxcbiAgbW9kaWZpZWQ6IGZ1bmN0aW9uKGRlbHRhLCBsZWZ0LCBrZXksIGxlZnRLZXkpIHtcbiAgICB2YXIgZm9ybWF0TGVnZW5kID0gJyA8cHJlPihbcHJldmlvdXNWYWx1ZSwgbmV3VmFsdWVdKTwvcHJlPic7XG4gICAgaWYgKHR5cGVvZiBsZWZ0S2V5ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuICdtb2RpZnkgdmFsdWUnICsgZm9ybWF0TGVnZW5kO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGxlZnRLZXkgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gJ21vZGlmeSBhdCBpbmRleCAnICsgbGVmdEtleSArIGZvcm1hdExlZ2VuZDtcbiAgICB9XG4gICAgcmV0dXJuICdtb2RpZnkgcHJvcGVydHkgJyArIHdyYXBQcm9wZXJ0eU5hbWUobGVmdEtleSkgKyBmb3JtYXRMZWdlbmQ7XG4gIH0sXG4gIGRlbGV0ZWQ6IGZ1bmN0aW9uKGRlbHRhLCBsZWZ0LCBrZXksIGxlZnRLZXkpIHtcbiAgICB2YXIgZm9ybWF0TGVnZW5kID0gJyA8cHJlPihbcHJldmlvdXNWYWx1ZSwgMCwgMF0pPC9wcmU+JztcbiAgICBpZiAodHlwZW9mIGxlZnRLZXkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gJ2RlbGV0ZSB2YWx1ZScgKyBmb3JtYXRMZWdlbmQ7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbGVmdEtleSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiAncmVtb3ZlIGluZGV4ICcgKyBsZWZ0S2V5ICsgZm9ybWF0TGVnZW5kO1xuICAgIH1cbiAgICByZXR1cm4gJ2RlbGV0ZSBwcm9wZXJ0eSAnICsgd3JhcFByb3BlcnR5TmFtZShsZWZ0S2V5KSArIGZvcm1hdExlZ2VuZDtcbiAgfSxcbiAgbW92ZWQ6IGZ1bmN0aW9uKGRlbHRhLCBsZWZ0LCBrZXksIGxlZnRLZXkpIHtcbiAgICByZXR1cm4gJ21vdmUgZnJvbSA8c3BhbiB0aXRsZT1cIihwb3NpdGlvbiB0byByZW1vdmUgYXQgb3JpZ2luYWwgc3RhdGUpXCI+aW5kZXggJyArXG4gICAgICBsZWZ0S2V5ICsgJzwvc3Bhbj4gdG8gJyArXG4gICAgICAnPHNwYW4gdGl0bGU9XCIocG9zaXRpb24gdG8gaW5zZXJ0IGF0IGZpbmFsIHN0YXRlKVwiPmluZGV4ICcgK1xuICAgICAgZGVsdGFbMV0gKyAnPC9zcGFuPic7XG4gIH0sXG4gIHRleHRkaWZmOiBmdW5jdGlvbihkZWx0YSwgbGVmdCwga2V5LCBsZWZ0S2V5KSB7XG4gICAgdmFyIGxvY2F0aW9uID0gKHR5cGVvZiBsZWZ0S2V5ID09PSAndW5kZWZpbmVkJykgP1xuICAgICAgJycgOiAoXG4gICAgICAgICh0eXBlb2YgbGVmdEtleSA9PT0gJ251bWJlcicpID9cbiAgICAgICAgJyBhdCBpbmRleCAnICsgbGVmdEtleSA6XG4gICAgICAgICcgYXQgcHJvcGVydHkgJyArIHdyYXBQcm9wZXJ0eU5hbWUobGVmdEtleSlcbiAgICAgICk7XG4gICAgcmV0dXJuICd0ZXh0IGRpZmYnICsgbG9jYXRpb24gKyAnLCBmb3JtYXQgaXMgJyArXG4gICAgICAnPGEgaHJlZj1cImh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvZ29vZ2xlLWRpZmYtbWF0Y2gtcGF0Y2gvd2lraS9VbmlkaWZmXCI+JyArXG4gICAgICAnYSB2YXJpYXRpb24gb2YgVW5pZGlmZjwvYT4nO1xuICB9XG59O1xuXG52YXIgZm9ybWF0QW55Q2hhbmdlID0gZnVuY3Rpb24oY29udGV4dCwgZGVsdGEpIHtcbiAgdmFyIGRlbHRhVHlwZSA9IHRoaXMuZ2V0RGVsdGFUeXBlKGRlbHRhKTtcbiAgdmFyIGFubm90YXRvciA9IGRlbHRhQW5ub3RhdGlvbnNbZGVsdGFUeXBlXTtcbiAgdmFyIGh0bWxOb3RlID0gYW5ub3RhdG9yICYmIGFubm90YXRvci5hcHBseShhbm5vdGF0b3IsXG4gICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIHZhciBqc29uID0gSlNPTi5zdHJpbmdpZnkoZGVsdGEsIG51bGwsIDIpO1xuICBpZiAoZGVsdGFUeXBlID09PSAndGV4dGRpZmYnKSB7XG4gICAgLy8gc3BsaXQgdGV4dCBkaWZmcyBsaW5lc1xuICAgIGpzb24gPSBqc29uLnNwbGl0KCdcXFxcbicpLmpvaW4oJ1xcXFxuXCIrXFxuICAgXCInKTtcbiAgfVxuICBjb250ZXh0LmluZGVudCgpO1xuICBjb250ZXh0LnJvdyhqc29uLCBodG1sTm90ZSk7XG4gIGNvbnRleHQuaW5kZW50KC0xKTtcbn07XG5cbkFubm90YXRlZEZvcm1hdHRlci5wcm90b3R5cGUuZm9ybWF0X2FkZGVkID0gZm9ybWF0QW55Q2hhbmdlO1xuQW5ub3RhdGVkRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXRfbW9kaWZpZWQgPSBmb3JtYXRBbnlDaGFuZ2U7XG5Bbm5vdGF0ZWRGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdF9kZWxldGVkID0gZm9ybWF0QW55Q2hhbmdlO1xuQW5ub3RhdGVkRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXRfbW92ZWQgPSBmb3JtYXRBbnlDaGFuZ2U7XG5Bbm5vdGF0ZWRGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdF90ZXh0ZGlmZiA9IGZvcm1hdEFueUNoYW5nZTtcblxuLyoganNoaW50IGNhbWVsY2FzZTogdHJ1ZSAqL1xuXG5leHBvcnRzLkFubm90YXRlZEZvcm1hdHRlciA9IEFubm90YXRlZEZvcm1hdHRlcjtcblxudmFyIGRlZmF1bHRJbnN0YW5jZTtcblxuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihkZWx0YSwgbGVmdCkge1xuICBpZiAoIWRlZmF1bHRJbnN0YW5jZSkge1xuICAgIGRlZmF1bHRJbnN0YW5jZSA9IG5ldyBBbm5vdGF0ZWRGb3JtYXR0ZXIoKTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdEluc3RhbmNlLmZvcm1hdChkZWx0YSwgbGVmdCk7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2Zvcm1hdHRlcnMvYW5ub3RhdGVkLmpzXG4gKiovIiwidmFyIGlzQXJyYXkgPSAodHlwZW9mIEFycmF5LmlzQXJyYXkgPT09ICdmdW5jdGlvbicpID9cbiAgLy8gdXNlIG5hdGl2ZSBmdW5jdGlvblxuICBBcnJheS5pc0FycmF5IDpcbiAgLy8gdXNlIGluc3RhbmNlb2Ygb3BlcmF0b3JcbiAgZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBhIGluc3RhbmNlb2YgQXJyYXk7XG4gIH07XG5cbnZhciBnZXRPYmplY3RLZXlzID0gdHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nID9cbiAgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaik7XG4gIH0gOiBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICAgIG5hbWVzLnB1c2gocHJvcGVydHkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmFtZXM7XG4gIH07XG5cbnZhciB0cmltVW5kZXJzY29yZSA9IGZ1bmN0aW9uKHN0cikge1xuICBpZiAoc3RyLnN1YnN0cigwLCAxKSA9PT0gJ18nKSB7XG4gICAgcmV0dXJuIHN0ci5zbGljZSgxKTtcbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxudmFyIGFycmF5S2V5VG9Tb3J0TnVtYmVyID0gZnVuY3Rpb24oa2V5KSB7XG4gIGlmIChrZXkgPT09ICdfdCcpIHtcbiAgICByZXR1cm4gLTE7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGtleS5zdWJzdHIoMCwgMSkgPT09ICdfJykge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KGtleS5zbGljZSgxKSwgMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQoa2V5LCAxMCkgKyAwLjE7XG4gICAgfVxuICB9XG59O1xuXG52YXIgYXJyYXlLZXlDb21wYXJlciA9IGZ1bmN0aW9uKGtleTEsIGtleTIpIHtcbiAgcmV0dXJuIGFycmF5S2V5VG9Tb3J0TnVtYmVyKGtleTEpIC0gYXJyYXlLZXlUb1NvcnROdW1iZXIoa2V5Mik7XG59O1xuXG52YXIgQmFzZUZvcm1hdHRlciA9IGZ1bmN0aW9uIEJhc2VGb3JtYXR0ZXIoKSB7fTtcblxuQmFzZUZvcm1hdHRlci5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24oZGVsdGEsIGxlZnQpIHtcbiAgdmFyIGNvbnRleHQgPSB7fTtcbiAgdGhpcy5wcmVwYXJlQ29udGV4dChjb250ZXh0KTtcbiAgdGhpcy5yZWN1cnNlKGNvbnRleHQsIGRlbHRhLCBsZWZ0KTtcbiAgcmV0dXJuIHRoaXMuZmluYWxpemUoY29udGV4dCk7XG59O1xuXG5CYXNlRm9ybWF0dGVyLnByb3RvdHlwZS5wcmVwYXJlQ29udGV4dCA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgY29udGV4dC5idWZmZXIgPSBbXTtcbiAgY29udGV4dC5vdXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmJ1ZmZlci5wdXNoLmFwcGx5KHRoaXMuYnVmZmVyLCBhcmd1bWVudHMpO1xuICB9O1xufTtcblxuQmFzZUZvcm1hdHRlci5wcm90b3R5cGUudHlwZUZvcm1hdHR0ZXJOb3RGb3VuZCA9IGZ1bmN0aW9uKGNvbnRleHQsIGRlbHRhVHlwZSkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBmb3JtYXQgZGVsdGEgdHlwZTogJyArIGRlbHRhVHlwZSk7XG59O1xuXG5CYXNlRm9ybWF0dGVyLnByb3RvdHlwZS50eXBlRm9ybWF0dHRlckVycm9yRm9ybWF0dGVyID0gZnVuY3Rpb24oY29udGV4dCwgZXJyKSB7XG4gIHJldHVybiBlcnIudG9TdHJpbmcoKTtcbn07XG5cbkJhc2VGb3JtYXR0ZXIucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24oY29udGV4dCkge1xuICBpZiAoaXNBcnJheShjb250ZXh0LmJ1ZmZlcikpIHtcbiAgICByZXR1cm4gY29udGV4dC5idWZmZXIuam9pbignJyk7XG4gIH1cbn07XG5cbkJhc2VGb3JtYXR0ZXIucHJvdG90eXBlLnJlY3Vyc2UgPSBmdW5jdGlvbihjb250ZXh0LCBkZWx0YSwgbGVmdCwga2V5LCBsZWZ0S2V5LCBtb3ZlZEZyb20sIGlzTGFzdCkge1xuXG4gIHZhciB1c2VNb3ZlT3JpZ2luSGVyZSA9IGRlbHRhICYmIG1vdmVkRnJvbTtcbiAgdmFyIGxlZnRWYWx1ZSA9IHVzZU1vdmVPcmlnaW5IZXJlID8gbW92ZWRGcm9tLnZhbHVlIDogbGVmdDtcblxuICBpZiAodHlwZW9mIGRlbHRhID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgdHlwZSA9IHRoaXMuZ2V0RGVsdGFUeXBlKGRlbHRhLCBtb3ZlZEZyb20pO1xuICB2YXIgbm9kZVR5cGUgPSB0eXBlID09PSAnbm9kZScgPyAoZGVsdGEuX3QgPT09ICdhJyA/ICdhcnJheScgOiAnb2JqZWN0JykgOiAnJztcblxuICBpZiAodHlwZW9mIGtleSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aGlzLm5vZGVCZWdpbihjb250ZXh0LCBrZXksIGxlZnRLZXksIHR5cGUsIG5vZGVUeXBlLCBpc0xhc3QpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMucm9vdEJlZ2luKGNvbnRleHQsIHR5cGUsIG5vZGVUeXBlKTtcbiAgfVxuXG4gIHZhciB0eXBlRm9ybWF0dHRlcjtcbiAgdHJ5IHtcbiAgICB0eXBlRm9ybWF0dHRlciA9IHRoaXNbJ2Zvcm1hdF8nICsgdHlwZV0gfHwgdGhpcy50eXBlRm9ybWF0dHRlck5vdEZvdW5kKGNvbnRleHQsIHR5cGUpO1xuICAgIHR5cGVGb3JtYXR0dGVyLmNhbGwodGhpcywgY29udGV4dCwgZGVsdGEsIGxlZnRWYWx1ZSwga2V5LCBsZWZ0S2V5LCBtb3ZlZEZyb20pO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aGlzLnR5cGVGb3JtYXR0dGVyRXJyb3JGb3JtYXR0ZXIoY29udGV4dCwgZXJyLCBkZWx0YSwgbGVmdFZhbHVlLCBrZXksIGxlZnRLZXksIG1vdmVkRnJvbSk7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiBrZXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhpcy5ub2RlRW5kKGNvbnRleHQsIGtleSwgbGVmdEtleSwgdHlwZSwgbm9kZVR5cGUsIGlzTGFzdCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5yb290RW5kKGNvbnRleHQsIHR5cGUsIG5vZGVUeXBlKTtcbiAgfVxufTtcblxuQmFzZUZvcm1hdHRlci5wcm90b3R5cGUuZm9ybWF0RGVsdGFDaGlsZHJlbiA9IGZ1bmN0aW9uKGNvbnRleHQsIGRlbHRhLCBsZWZ0KSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5mb3JFYWNoRGVsdGFLZXkoZGVsdGEsIGxlZnQsIGZ1bmN0aW9uKGtleSwgbGVmdEtleSwgbW92ZWRGcm9tLCBpc0xhc3QpIHtcbiAgICBzZWxmLnJlY3Vyc2UoY29udGV4dCwgZGVsdGFba2V5XSwgbGVmdCA/IGxlZnRbbGVmdEtleV0gOiB1bmRlZmluZWQsXG4gICAgICBrZXksIGxlZnRLZXksIG1vdmVkRnJvbSwgaXNMYXN0KTtcbiAgfSk7XG59O1xuXG5CYXNlRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JFYWNoRGVsdGFLZXkgPSBmdW5jdGlvbihkZWx0YSwgbGVmdCwgZm4pIHtcbiAgdmFyIGtleXMgPSBnZXRPYmplY3RLZXlzKGRlbHRhKTtcbiAgdmFyIGFycmF5S2V5cyA9IGRlbHRhLl90ID09PSAnYSc7XG4gIHZhciBtb3ZlRGVzdGluYXRpb25zID0ge307XG4gIHZhciBuYW1lO1xuICBpZiAodHlwZW9mIGxlZnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZm9yIChuYW1lIGluIGxlZnQpIHtcbiAgICAgIGlmICh0eXBlb2YgZGVsdGFbbmFtZV0gPT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICgoIWFycmF5S2V5cykgfHwgdHlwZW9mIGRlbHRhWydfJyArIG5hbWVdID09PSAndW5kZWZpbmVkJykpIHtcbiAgICAgICAga2V5cy5wdXNoKG5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBsb29rIGZvciBtb3ZlIGRlc3RpbmF0aW9uc1xuICBmb3IgKG5hbWUgaW4gZGVsdGEpIHtcbiAgICB2YXIgdmFsdWUgPSBkZWx0YVtuYW1lXTtcbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWVbMl0gPT09IDMpIHtcbiAgICAgIG1vdmVEZXN0aW5hdGlvbnNbdmFsdWVbMV0udG9TdHJpbmcoKV0gPSB7XG4gICAgICAgIGtleTogbmFtZSxcbiAgICAgICAgdmFsdWU6IGxlZnRbcGFyc2VJbnQobmFtZS5zdWJzdHIoMSkpXVxuICAgICAgfTtcbiAgICAgIGlmICh0aGlzLmluY2x1ZGVNb3ZlRGVzdGluYXRpb25zICE9PSBmYWxzZSkge1xuICAgICAgICBpZiAoKHR5cGVvZiBsZWZ0ID09PSAndW5kZWZpbmVkJykgJiZcbiAgICAgICAgICAodHlwZW9mIGRlbHRhW3ZhbHVlWzFdXSA9PT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAga2V5cy5wdXNoKHZhbHVlWzFdLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChhcnJheUtleXMpIHtcbiAgICBrZXlzLnNvcnQoYXJyYXlLZXlDb21wYXJlcik7XG4gIH0gZWxzZSB7XG4gICAga2V5cy5zb3J0KCk7XG4gIH1cbiAgZm9yICh2YXIgaW5kZXggPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpbmRleF07XG4gICAgaWYgKGFycmF5S2V5cyAmJiBrZXkgPT09ICdfdCcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB2YXIgbGVmdEtleSA9IGFycmF5S2V5cyA/XG4gICAgICAodHlwZW9mIGtleSA9PT0gJ251bWJlcicgPyBrZXkgOiBwYXJzZUludCh0cmltVW5kZXJzY29yZShrZXkpLCAxMCkpIDpcbiAgICAgIGtleTtcbiAgICB2YXIgaXNMYXN0ID0gKGluZGV4ID09PSBsZW5ndGggLSAxKTtcbiAgICBmbihrZXksIGxlZnRLZXksIG1vdmVEZXN0aW5hdGlvbnNbbGVmdEtleV0sIGlzTGFzdCk7XG4gIH1cbn07XG5cbkJhc2VGb3JtYXR0ZXIucHJvdG90eXBlLmdldERlbHRhVHlwZSA9IGZ1bmN0aW9uKGRlbHRhLCBtb3ZlZEZyb20pIHtcbiAgaWYgKHR5cGVvZiBkZWx0YSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vdmVkRnJvbSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiAnbW92ZWRlc3RpbmF0aW9uJztcbiAgICB9XG4gICAgcmV0dXJuICd1bmNoYW5nZWQnO1xuICB9XG4gIGlmIChpc0FycmF5KGRlbHRhKSkge1xuICAgIGlmIChkZWx0YS5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiAnYWRkZWQnO1xuICAgIH1cbiAgICBpZiAoZGVsdGEubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gJ21vZGlmaWVkJztcbiAgICB9XG4gICAgaWYgKGRlbHRhLmxlbmd0aCA9PT0gMyAmJiBkZWx0YVsyXSA9PT0gMCkge1xuICAgICAgcmV0dXJuICdkZWxldGVkJztcbiAgICB9XG4gICAgaWYgKGRlbHRhLmxlbmd0aCA9PT0gMyAmJiBkZWx0YVsyXSA9PT0gMikge1xuICAgICAgcmV0dXJuICd0ZXh0ZGlmZic7XG4gICAgfVxuICAgIGlmIChkZWx0YS5sZW5ndGggPT09IDMgJiYgZGVsdGFbMl0gPT09IDMpIHtcbiAgICAgIHJldHVybiAnbW92ZWQnO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVsdGEgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuICdub2RlJztcbiAgfVxuICByZXR1cm4gJ3Vua25vd24nO1xufTtcblxuQmFzZUZvcm1hdHRlci5wcm90b3R5cGUucGFyc2VUZXh0RGlmZiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgdmFyIGxpbmVzID0gdmFsdWUuc3BsaXQoJ1xcbkBAICcpO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHZhciBsaW5lID0gbGluZXNbaV07XG4gICAgdmFyIGxpbmVPdXRwdXQgPSB7XG4gICAgICBwaWVjZXM6IFtdXG4gICAgfTtcbiAgICB2YXIgbG9jYXRpb24gPSAvXig/OkBAICk/Wy0rXT8oXFxkKyksKFxcZCspLy5leGVjKGxpbmUpLnNsaWNlKDEpO1xuICAgIGxpbmVPdXRwdXQubG9jYXRpb24gPSB7XG4gICAgICBsaW5lOiBsb2NhdGlvblswXSxcbiAgICAgIGNocjogbG9jYXRpb25bMV1cbiAgICB9O1xuICAgIHZhciBwaWVjZXMgPSBsaW5lLnNwbGl0KCdcXG4nKS5zbGljZSgxKTtcbiAgICBmb3IgKHZhciBwaWVjZUluZGV4ID0gMCwgcGllY2VzTGVuZ3RoID0gcGllY2VzLmxlbmd0aDsgcGllY2VJbmRleCA8IHBpZWNlc0xlbmd0aDsgcGllY2VJbmRleCsrKSB7XG4gICAgICB2YXIgcGllY2UgPSBwaWVjZXNbcGllY2VJbmRleF07XG4gICAgICBpZiAoIXBpZWNlLmxlbmd0aCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHZhciBwaWVjZU91dHB1dCA9IHtcbiAgICAgICAgdHlwZTogJ2NvbnRleHQnXG4gICAgICB9O1xuICAgICAgaWYgKHBpZWNlLnN1YnN0cigwLCAxKSA9PT0gJysnKSB7XG4gICAgICAgIHBpZWNlT3V0cHV0LnR5cGUgPSAnYWRkZWQnO1xuICAgICAgfSBlbHNlIGlmIChwaWVjZS5zdWJzdHIoMCwgMSkgPT09ICctJykge1xuICAgICAgICBwaWVjZU91dHB1dC50eXBlID0gJ2RlbGV0ZWQnO1xuICAgICAgfVxuICAgICAgcGllY2VPdXRwdXQudGV4dCA9IHBpZWNlLnNsaWNlKDEpO1xuICAgICAgbGluZU91dHB1dC5waWVjZXMucHVzaChwaWVjZU91dHB1dCk7XG4gICAgfVxuICAgIG91dHB1dC5wdXNoKGxpbmVPdXRwdXQpO1xuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59O1xuXG5leHBvcnRzLkJhc2VGb3JtYXR0ZXIgPSBCYXNlRm9ybWF0dGVyO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2Zvcm1hdHRlcnMvYmFzZS5qc1xuICoqLyIsInZhciBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJyk7XG52YXIgYmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xudmFyIEJhc2VGb3JtYXR0ZXIgPSBiYXNlLkJhc2VGb3JtYXR0ZXI7XG5cbnZhciBjb2xvcnMgPSB7XG4gIGFkZGVkOiBjaGFsay5ncmVlbixcbiAgZGVsZXRlZDogY2hhbGsucmVkLFxuICBtb3ZlZGVzdGluYXRpb246IGNoYWxrLmdyYXksXG4gIG1vdmVkOiBjaGFsay55ZWxsb3csXG4gIHVuY2hhbmdlZDogY2hhbGsuZ3JheSxcbiAgZXJyb3I6IGNoYWxrLndoaXRlLmJnUmVkLFxuICB0ZXh0RGlmZkxpbmU6IGNoYWxrLmdyYXlcbn07XG5cbnZhciBDb25zb2xlRm9ybWF0dGVyID0gZnVuY3Rpb24gQ29uc29sZUZvcm1hdHRlcigpIHtcbiAgdGhpcy5pbmNsdWRlTW92ZURlc3RpbmF0aW9ucyA9IGZhbHNlO1xufTtcblxuQ29uc29sZUZvcm1hdHRlci5wcm90b3R5cGUgPSBuZXcgQmFzZUZvcm1hdHRlcigpO1xuXG5Db25zb2xlRm9ybWF0dGVyLnByb3RvdHlwZS5wcmVwYXJlQ29udGV4dCA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgQmFzZUZvcm1hdHRlci5wcm90b3R5cGUucHJlcGFyZUNvbnRleHQuY2FsbCh0aGlzLCBjb250ZXh0KTtcbiAgY29udGV4dC5pbmRlbnQgPSBmdW5jdGlvbihsZXZlbHMpIHtcbiAgICB0aGlzLmluZGVudExldmVsID0gKHRoaXMuaW5kZW50TGV2ZWwgfHwgMCkgK1xuICAgICAgKHR5cGVvZiBsZXZlbHMgPT09ICd1bmRlZmluZWQnID8gMSA6IGxldmVscyk7XG4gICAgdGhpcy5pbmRlbnRQYWQgPSBuZXcgQXJyYXkodGhpcy5pbmRlbnRMZXZlbCArIDEpLmpvaW4oJyAgJyk7XG4gICAgdGhpcy5vdXRMaW5lKCk7XG4gIH07XG4gIGNvbnRleHQub3V0TGluZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYnVmZmVyLnB1c2goJ1xcbicgKyAodGhpcy5pbmRlbnRQYWQgfHwgJycpKTtcbiAgfTtcbiAgY29udGV4dC5vdXQgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBsaW5lcyA9IGFyZ3VtZW50c1tpXS5zcGxpdCgnXFxuJyk7XG4gICAgICB2YXIgdGV4dCA9IGxpbmVzLmpvaW4oJ1xcbicgKyAodGhpcy5pbmRlbnRQYWQgfHwgJycpKTtcbiAgICAgIGlmICh0aGlzLmNvbG9yICYmIHRoaXMuY29sb3JbMF0pIHtcbiAgICAgICAgdGV4dCA9IHRoaXMuY29sb3JbMF0odGV4dCk7XG4gICAgICB9XG4gICAgICB0aGlzLmJ1ZmZlci5wdXNoKHRleHQpO1xuICAgIH1cbiAgfTtcbiAgY29udGV4dC5wdXNoQ29sb3IgPSBmdW5jdGlvbihjb2xvcikge1xuICAgIHRoaXMuY29sb3IgPSB0aGlzLmNvbG9yIHx8IFtdO1xuICAgIHRoaXMuY29sb3IudW5zaGlmdChjb2xvcik7XG4gIH07XG4gIGNvbnRleHQucG9wQ29sb3IgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNvbG9yID0gdGhpcy5jb2xvciB8fCBbXTtcbiAgICB0aGlzLmNvbG9yLnNoaWZ0KCk7XG4gIH07XG59O1xuXG5Db25zb2xlRm9ybWF0dGVyLnByb3RvdHlwZS50eXBlRm9ybWF0dHRlckVycm9yRm9ybWF0dGVyID0gZnVuY3Rpb24oY29udGV4dCwgZXJyKSB7XG4gIGNvbnRleHQucHVzaENvbG9yKGNvbG9ycy5lcnJvcik7XG4gIGNvbnRleHQub3V0KCdbRVJST1JdJyArIGVycik7XG4gIGNvbnRleHQucG9wQ29sb3IoKTtcbn07XG5cbkNvbnNvbGVGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdFZhbHVlID0gZnVuY3Rpb24oY29udGV4dCwgdmFsdWUpIHtcbiAgY29udGV4dC5vdXQoSlNPTi5zdHJpbmdpZnkodmFsdWUsIG51bGwsIDIpKTtcbn07XG5cbkNvbnNvbGVGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdFRleHREaWZmU3RyaW5nID0gZnVuY3Rpb24oY29udGV4dCwgdmFsdWUpIHtcbiAgdmFyIGxpbmVzID0gdGhpcy5wYXJzZVRleHREaWZmKHZhbHVlKTtcbiAgY29udGV4dC5pbmRlbnQoKTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB2YXIgbGluZSA9IGxpbmVzW2ldO1xuICAgIGNvbnRleHQucHVzaENvbG9yKGNvbG9ycy50ZXh0RGlmZkxpbmUpO1xuICAgIGNvbnRleHQub3V0KGxpbmUubG9jYXRpb24ubGluZSArICcsJyArIGxpbmUubG9jYXRpb24uY2hyICsgJyAnKTtcbiAgICBjb250ZXh0LnBvcENvbG9yKCk7XG4gICAgdmFyIHBpZWNlcyA9IGxpbmUucGllY2VzO1xuICAgIGZvciAodmFyIHBpZWNlSW5kZXggPSAwLCBwaWVjZXNMZW5ndGggPSBwaWVjZXMubGVuZ3RoOyBwaWVjZUluZGV4IDwgcGllY2VzTGVuZ3RoOyBwaWVjZUluZGV4KyspIHtcbiAgICAgIHZhciBwaWVjZSA9IHBpZWNlc1twaWVjZUluZGV4XTtcbiAgICAgIGNvbnRleHQucHVzaENvbG9yKGNvbG9yc1twaWVjZS50eXBlXSk7XG4gICAgICBjb250ZXh0Lm91dChwaWVjZS50ZXh0KTtcbiAgICAgIGNvbnRleHQucG9wQ29sb3IoKTtcbiAgICB9XG4gICAgaWYgKGkgPCBsIC0gMSkge1xuICAgICAgY29udGV4dC5vdXRMaW5lKCk7XG4gICAgfVxuICB9XG4gIGNvbnRleHQuaW5kZW50KC0xKTtcbn07XG5cbkNvbnNvbGVGb3JtYXR0ZXIucHJvdG90eXBlLnJvb3RCZWdpbiA9IGZ1bmN0aW9uKGNvbnRleHQsIHR5cGUsIG5vZGVUeXBlKSB7XG4gIGNvbnRleHQucHVzaENvbG9yKGNvbG9yc1t0eXBlXSk7XG4gIGlmICh0eXBlID09PSAnbm9kZScpIHtcbiAgICBjb250ZXh0Lm91dChub2RlVHlwZSA9PT0gJ2FycmF5JyA/ICdbJyA6ICd7Jyk7XG4gICAgY29udGV4dC5pbmRlbnQoKTtcbiAgfVxufTtcblxuQ29uc29sZUZvcm1hdHRlci5wcm90b3R5cGUucm9vdEVuZCA9IGZ1bmN0aW9uKGNvbnRleHQsIHR5cGUsIG5vZGVUeXBlKSB7XG4gIGlmICh0eXBlID09PSAnbm9kZScpIHtcbiAgICBjb250ZXh0LmluZGVudCgtMSk7XG4gICAgY29udGV4dC5vdXQobm9kZVR5cGUgPT09ICdhcnJheScgPyAnXScgOiAnfScpO1xuICB9XG4gIGNvbnRleHQucG9wQ29sb3IoKTtcbn07XG5cbkNvbnNvbGVGb3JtYXR0ZXIucHJvdG90eXBlLm5vZGVCZWdpbiA9IGZ1bmN0aW9uKGNvbnRleHQsIGtleSwgbGVmdEtleSwgdHlwZSwgbm9kZVR5cGUpIHtcbiAgY29udGV4dC5wdXNoQ29sb3IoY29sb3JzW3R5cGVdKTtcbiAgY29udGV4dC5vdXQobGVmdEtleSArICc6ICcpO1xuICBpZiAodHlwZSA9PT0gJ25vZGUnKSB7XG4gICAgY29udGV4dC5vdXQobm9kZVR5cGUgPT09ICdhcnJheScgPyAnWycgOiAneycpO1xuICAgIGNvbnRleHQuaW5kZW50KCk7XG4gIH1cbn07XG5cbkNvbnNvbGVGb3JtYXR0ZXIucHJvdG90eXBlLm5vZGVFbmQgPSBmdW5jdGlvbihjb250ZXh0LCBrZXksIGxlZnRLZXksIHR5cGUsIG5vZGVUeXBlLCBpc0xhc3QpIHtcbiAgaWYgKHR5cGUgPT09ICdub2RlJykge1xuICAgIGNvbnRleHQuaW5kZW50KC0xKTtcbiAgICBjb250ZXh0Lm91dChub2RlVHlwZSA9PT0gJ2FycmF5JyA/ICddJyA6ICd9JyArXG4gICAgICAoaXNMYXN0ID8gJycgOiAnLCcpKTtcbiAgfVxuICBpZiAoIWlzTGFzdCkge1xuICAgIGNvbnRleHQub3V0TGluZSgpO1xuICB9XG4gIGNvbnRleHQucG9wQ29sb3IoKTtcbn07XG5cbi8qIGpzaGludCBjYW1lbGNhc2U6IGZhbHNlICovXG5cbkNvbnNvbGVGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdF91bmNoYW5nZWQgPSBmdW5jdGlvbihjb250ZXh0LCBkZWx0YSwgbGVmdCkge1xuICBpZiAodHlwZW9mIGxlZnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuZm9ybWF0VmFsdWUoY29udGV4dCwgbGVmdCk7XG59O1xuXG5Db25zb2xlRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXRfbW92ZWRlc3RpbmF0aW9uID0gZnVuY3Rpb24oY29udGV4dCwgZGVsdGEsIGxlZnQpIHtcbiAgaWYgKHR5cGVvZiBsZWZ0ID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLmZvcm1hdFZhbHVlKGNvbnRleHQsIGxlZnQpO1xufTtcblxuQ29uc29sZUZvcm1hdHRlci5wcm90b3R5cGUuZm9ybWF0X25vZGUgPSBmdW5jdGlvbihjb250ZXh0LCBkZWx0YSwgbGVmdCkge1xuICAvLyByZWN1cnNlXG4gIHRoaXMuZm9ybWF0RGVsdGFDaGlsZHJlbihjb250ZXh0LCBkZWx0YSwgbGVmdCk7XG59O1xuXG5Db25zb2xlRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXRfYWRkZWQgPSBmdW5jdGlvbihjb250ZXh0LCBkZWx0YSkge1xuICB0aGlzLmZvcm1hdFZhbHVlKGNvbnRleHQsIGRlbHRhWzBdKTtcbn07XG5cbkNvbnNvbGVGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdF9tb2RpZmllZCA9IGZ1bmN0aW9uKGNvbnRleHQsIGRlbHRhKSB7XG4gIGNvbnRleHQucHVzaENvbG9yKGNvbG9ycy5kZWxldGVkKTtcbiAgdGhpcy5mb3JtYXRWYWx1ZShjb250ZXh0LCBkZWx0YVswXSk7XG4gIGNvbnRleHQucG9wQ29sb3IoKTtcbiAgY29udGV4dC5vdXQoJyA9PiAnKTtcbiAgY29udGV4dC5wdXNoQ29sb3IoY29sb3JzLmFkZGVkKTtcbiAgdGhpcy5mb3JtYXRWYWx1ZShjb250ZXh0LCBkZWx0YVsxXSk7XG4gIGNvbnRleHQucG9wQ29sb3IoKTtcbn07XG5cbkNvbnNvbGVGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdF9kZWxldGVkID0gZnVuY3Rpb24oY29udGV4dCwgZGVsdGEpIHtcbiAgdGhpcy5mb3JtYXRWYWx1ZShjb250ZXh0LCBkZWx0YVswXSk7XG59O1xuXG5Db25zb2xlRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXRfbW92ZWQgPSBmdW5jdGlvbihjb250ZXh0LCBkZWx0YSkge1xuICBjb250ZXh0Lm91dCgnPT0+ICcgKyBkZWx0YVsxXSk7XG59O1xuXG5Db25zb2xlRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXRfdGV4dGRpZmYgPSBmdW5jdGlvbihjb250ZXh0LCBkZWx0YSkge1xuICB0aGlzLmZvcm1hdFRleHREaWZmU3RyaW5nKGNvbnRleHQsIGRlbHRhWzBdKTtcbn07XG5cbi8qIGpzaGludCBjYW1lbGNhc2U6IHRydWUgKi9cblxuZXhwb3J0cy5Db25zb2xlRm9ybWF0dGVyID0gQ29uc29sZUZvcm1hdHRlcjtcblxudmFyIGRlZmF1bHRJbnN0YW5jZTtcblxudmFyIGZvcm1hdCA9IGZ1bmN0aW9uKGRlbHRhLCBsZWZ0KSB7XG4gIGlmICghZGVmYXVsdEluc3RhbmNlKSB7XG4gICAgZGVmYXVsdEluc3RhbmNlID0gbmV3IENvbnNvbGVGb3JtYXR0ZXIoKTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdEluc3RhbmNlLmZvcm1hdChkZWx0YSwgbGVmdCk7XG59O1xuXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKGRlbHRhLCBsZWZ0KSB7XG4gIGNvbnNvbGUubG9nKGZvcm1hdChkZWx0YSwgbGVmdCkpO1xufTtcblxuZXhwb3J0cy5mb3JtYXQgPSBmb3JtYXQ7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vanNvbmRpZmZwYXRjaC9zcmMvZm9ybWF0dGVycy9jb25zb2xlLmpzXG4gKiovIiwidmFyIGJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKTtcbnZhciBCYXNlRm9ybWF0dGVyID0gYmFzZS5CYXNlRm9ybWF0dGVyO1xuXG52YXIgSHRtbEZvcm1hdHRlciA9IGZ1bmN0aW9uIEh0bWxGb3JtYXR0ZXIoKSB7fTtcblxuSHRtbEZvcm1hdHRlci5wcm90b3R5cGUgPSBuZXcgQmFzZUZvcm1hdHRlcigpO1xuXG5IdG1sRm9ybWF0dGVyLnByb3RvdHlwZS50eXBlRm9ybWF0dHRlckVycm9yRm9ybWF0dGVyID0gZnVuY3Rpb24oY29udGV4dCwgZXJyKSB7XG4gIGNvbnRleHQub3V0KCc8cHJlIGNsYXNzPVwianNvbmRpZmZwYXRjaC1lcnJvclwiPicgKyBlcnIgKyAnPC9wcmU+Jyk7XG59O1xuXG5IdG1sRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXRWYWx1ZSA9IGZ1bmN0aW9uKGNvbnRleHQsIHZhbHVlKSB7XG4gIGNvbnRleHQub3V0KCc8cHJlPicgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSwgbnVsbCwgMikgKyAnPC9wcmU+Jyk7XG59O1xuXG5IdG1sRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXRUZXh0RGlmZlN0cmluZyA9IGZ1bmN0aW9uKGNvbnRleHQsIHZhbHVlKSB7XG4gIHZhciBsaW5lcyA9IHRoaXMucGFyc2VUZXh0RGlmZih2YWx1ZSk7XG4gIGNvbnRleHQub3V0KCc8dWwgY2xhc3M9XCJqc29uZGlmZnBhdGNoLXRleHRkaWZmXCI+Jyk7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gbGluZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgdmFyIGxpbmUgPSBsaW5lc1tpXTtcbiAgICBjb250ZXh0Lm91dCgnPGxpPicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJqc29uZGlmZnBhdGNoLXRleHRkaWZmLWxvY2F0aW9uXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJqc29uZGlmZnBhdGNoLXRleHRkaWZmLWxpbmUtbnVtYmVyXCI+JyArXG4gICAgICBsaW5lLmxvY2F0aW9uLmxpbmUgK1xuICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cImpzb25kaWZmcGF0Y2gtdGV4dGRpZmYtY2hhclwiPicgK1xuICAgICAgbGluZS5sb2NhdGlvbi5jaHIgK1xuICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwianNvbmRpZmZwYXRjaC10ZXh0ZGlmZi1saW5lXCI+Jyk7XG4gICAgdmFyIHBpZWNlcyA9IGxpbmUucGllY2VzO1xuICAgIGZvciAodmFyIHBpZWNlSW5kZXggPSAwLCBwaWVjZXNMZW5ndGggPSBwaWVjZXMubGVuZ3RoOyBwaWVjZUluZGV4IDwgcGllY2VzTGVuZ3RoOyBwaWVjZUluZGV4KyspIHtcbiAgICAgIHZhciBwaWVjZSA9IHBpZWNlc1twaWVjZUluZGV4XTtcbiAgICAgIGNvbnRleHQub3V0KCc8c3BhbiBjbGFzcz1cImpzb25kaWZmcGF0Y2gtdGV4dGRpZmYtJyArIHBpZWNlLnR5cGUgKyAnXCI+JyArXG4gICAgICAgIHBpZWNlLnRleHQgKyAnPC9zcGFuPicpO1xuICAgIH1cbiAgICBjb250ZXh0Lm91dCgnPC9kaXY+PC9saT4nKTtcbiAgfVxuICBjb250ZXh0Lm91dCgnPC91bD4nKTtcbn07XG5cbnZhciBhZGp1c3RBcnJvd3MgPSBmdW5jdGlvbiBqc29uZGlmZnBhdGNoSHRtbEZvcm1hdHRlckFkanVzdEFycm93cyhub2RlKSB7XG4gIG5vZGUgPSBub2RlIHx8IGRvY3VtZW50O1xuICB2YXIgZ2V0RWxlbWVudFRleHQgPSBmdW5jdGlvbihlbCkge1xuICAgIHJldHVybiBlbC50ZXh0Q29udGVudCB8fCBlbC5pbm5lclRleHQ7XG4gIH07XG4gIHZhciBlYWNoQnlRdWVyeSA9IGZ1bmN0aW9uKGVsLCBxdWVyeSwgZm4pIHtcbiAgICB2YXIgZWxlbXMgPSBlbC5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5KTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGVsZW1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4oZWxlbXNbaV0pO1xuICAgIH1cbiAgfTtcbiAgdmFyIGVhY2hDaGlsZHJlbiA9IGZ1bmN0aW9uKGVsLCBmbikge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gZWwuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbihlbC5jaGlsZHJlbltpXSwgaSk7XG4gICAgfVxuICB9O1xuICBlYWNoQnlRdWVyeShub2RlLCAnLmpzb25kaWZmcGF0Y2gtYXJyb3cnLCBmdW5jdGlvbihhcnJvdykge1xuICAgIHZhciBhcnJvd1BhcmVudCA9IGFycm93LnBhcmVudE5vZGU7XG4gICAgdmFyIHN2ZyA9IGFycm93LmNoaWxkcmVuWzBdLFxuICAgICAgcGF0aCA9IHN2Zy5jaGlsZHJlblsxXTtcbiAgICBzdmcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB2YXIgZGVzdGluYXRpb24gPSBnZXRFbGVtZW50VGV4dChhcnJvd1BhcmVudC5xdWVyeVNlbGVjdG9yKCcuanNvbmRpZmZwYXRjaC1tb3ZlZC1kZXN0aW5hdGlvbicpKTtcbiAgICB2YXIgY29udGFpbmVyID0gYXJyb3dQYXJlbnQucGFyZW50Tm9kZTtcbiAgICB2YXIgZGVzdGluYXRpb25FbGVtO1xuICAgIGVhY2hDaGlsZHJlbihjb250YWluZXIsIGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLWtleScpID09PSBkZXN0aW5hdGlvbikge1xuICAgICAgICBkZXN0aW5hdGlvbkVsZW0gPSBjaGlsZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWRlc3RpbmF0aW9uRWxlbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdmFyIGRpc3RhbmNlID0gZGVzdGluYXRpb25FbGVtLm9mZnNldFRvcCAtIGFycm93UGFyZW50Lm9mZnNldFRvcDtcbiAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIE1hdGguYWJzKGRpc3RhbmNlKSArIDYpO1xuICAgICAgYXJyb3cuc3R5bGUudG9wID0gKC04ICsgKGRpc3RhbmNlID4gMCA/IDAgOiBkaXN0YW5jZSkpICsgJ3B4JztcbiAgICAgIHZhciBjdXJ2ZSA9IGRpc3RhbmNlID4gMCA/XG4gICAgICAgICdNMzAsMCBRLTEwLCcgKyBNYXRoLnJvdW5kKGRpc3RhbmNlIC8gMikgKyAnIDI2LCcgKyAoZGlzdGFuY2UgLSA0KSA6XG4gICAgICAgICdNMzAsJyArICgtZGlzdGFuY2UpICsgJyBRLTEwLCcgKyBNYXRoLnJvdW5kKC1kaXN0YW5jZSAvIDIpICsgJyAyNiw0JztcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgY3VydmUpO1xuICAgICAgc3ZnLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0pO1xufTtcblxuSHRtbEZvcm1hdHRlci5wcm90b3R5cGUucm9vdEJlZ2luID0gZnVuY3Rpb24oY29udGV4dCwgdHlwZSwgbm9kZVR5cGUpIHtcbiAgdmFyIG5vZGVDbGFzcyA9ICdqc29uZGlmZnBhdGNoLScgKyB0eXBlICtcbiAgICAobm9kZVR5cGUgPyAnIGpzb25kaWZmcGF0Y2gtY2hpbGQtbm9kZS10eXBlLScgKyBub2RlVHlwZSA6ICcnKTtcbiAgY29udGV4dC5vdXQoJzxkaXYgY2xhc3M9XCJqc29uZGlmZnBhdGNoLWRlbHRhICcgKyBub2RlQ2xhc3MgKyAnXCI+Jyk7XG59O1xuXG5IdG1sRm9ybWF0dGVyLnByb3RvdHlwZS5yb290RW5kID0gZnVuY3Rpb24oY29udGV4dCkge1xuICBjb250ZXh0Lm91dCgnPC9kaXY+JyArIChjb250ZXh0Lmhhc0Fycm93cyA/XG4gICAgKCc8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIj5zZXRUaW1lb3V0KCcgK1xuICAgICAgYWRqdXN0QXJyb3dzLnRvU3RyaW5nKCkgK1xuICAgICAgJywxMCk7PC9zY3JpcHQ+JykgOiAnJykpO1xufTtcblxuSHRtbEZvcm1hdHRlci5wcm90b3R5cGUubm9kZUJlZ2luID0gZnVuY3Rpb24oY29udGV4dCwga2V5LCBsZWZ0S2V5LCB0eXBlLCBub2RlVHlwZSkge1xuICB2YXIgbm9kZUNsYXNzID0gJ2pzb25kaWZmcGF0Y2gtJyArIHR5cGUgK1xuICAgIChub2RlVHlwZSA/ICcganNvbmRpZmZwYXRjaC1jaGlsZC1ub2RlLXR5cGUtJyArIG5vZGVUeXBlIDogJycpO1xuICBjb250ZXh0Lm91dCgnPGxpIGNsYXNzPVwiJyArIG5vZGVDbGFzcyArICdcIiBkYXRhLWtleT1cIicgKyBsZWZ0S2V5ICsgJ1wiPicgK1xuICAgICc8ZGl2IGNsYXNzPVwianNvbmRpZmZwYXRjaC1wcm9wZXJ0eS1uYW1lXCI+JyArIGxlZnRLZXkgKyAnPC9kaXY+Jyk7XG59O1xuXG5cbkh0bWxGb3JtYXR0ZXIucHJvdG90eXBlLm5vZGVFbmQgPSBmdW5jdGlvbihjb250ZXh0KSB7XG4gIGNvbnRleHQub3V0KCc8L2xpPicpO1xufTtcblxuLyoganNoaW50IGNhbWVsY2FzZTogZmFsc2UgKi9cblxuSHRtbEZvcm1hdHRlci5wcm90b3R5cGUuZm9ybWF0X3VuY2hhbmdlZCA9IGZ1bmN0aW9uKGNvbnRleHQsIGRlbHRhLCBsZWZ0KSB7XG4gIGlmICh0eXBlb2YgbGVmdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29udGV4dC5vdXQoJzxkaXYgY2xhc3M9XCJqc29uZGlmZnBhdGNoLXZhbHVlXCI+Jyk7XG4gIHRoaXMuZm9ybWF0VmFsdWUoY29udGV4dCwgbGVmdCk7XG4gIGNvbnRleHQub3V0KCc8L2Rpdj4nKTtcbn07XG5cbkh0bWxGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdF9tb3ZlZGVzdGluYXRpb24gPSBmdW5jdGlvbihjb250ZXh0LCBkZWx0YSwgbGVmdCkge1xuICBpZiAodHlwZW9mIGxlZnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnRleHQub3V0KCc8ZGl2IGNsYXNzPVwianNvbmRpZmZwYXRjaC12YWx1ZVwiPicpO1xuICB0aGlzLmZvcm1hdFZhbHVlKGNvbnRleHQsIGxlZnQpO1xuICBjb250ZXh0Lm91dCgnPC9kaXY+Jyk7XG59O1xuXG5IdG1sRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXRfbm9kZSA9IGZ1bmN0aW9uKGNvbnRleHQsIGRlbHRhLCBsZWZ0KSB7XG4gIC8vIHJlY3Vyc2VcbiAgdmFyIG5vZGVUeXBlID0gKGRlbHRhLl90ID09PSAnYScpID8gJ2FycmF5JyA6ICdvYmplY3QnO1xuICBjb250ZXh0Lm91dCgnPHVsIGNsYXNzPVwianNvbmRpZmZwYXRjaC1ub2RlIGpzb25kaWZmcGF0Y2gtbm9kZS10eXBlLScgKyBub2RlVHlwZSArICdcIj4nKTtcbiAgdGhpcy5mb3JtYXREZWx0YUNoaWxkcmVuKGNvbnRleHQsIGRlbHRhLCBsZWZ0KTtcbiAgY29udGV4dC5vdXQoJzwvdWw+Jyk7XG59O1xuXG5IdG1sRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXRfYWRkZWQgPSBmdW5jdGlvbihjb250ZXh0LCBkZWx0YSkge1xuICBjb250ZXh0Lm91dCgnPGRpdiBjbGFzcz1cImpzb25kaWZmcGF0Y2gtdmFsdWVcIj4nKTtcbiAgdGhpcy5mb3JtYXRWYWx1ZShjb250ZXh0LCBkZWx0YVswXSk7XG4gIGNvbnRleHQub3V0KCc8L2Rpdj4nKTtcbn07XG5cbkh0bWxGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdF9tb2RpZmllZCA9IGZ1bmN0aW9uKGNvbnRleHQsIGRlbHRhKSB7XG4gIGNvbnRleHQub3V0KCc8ZGl2IGNsYXNzPVwianNvbmRpZmZwYXRjaC12YWx1ZSBqc29uZGlmZnBhdGNoLWxlZnQtdmFsdWVcIj4nKTtcbiAgdGhpcy5mb3JtYXRWYWx1ZShjb250ZXh0LCBkZWx0YVswXSk7XG4gIGNvbnRleHQub3V0KCc8L2Rpdj4nICtcbiAgICAnPGRpdiBjbGFzcz1cImpzb25kaWZmcGF0Y2gtdmFsdWUganNvbmRpZmZwYXRjaC1yaWdodC12YWx1ZVwiPicpO1xuICB0aGlzLmZvcm1hdFZhbHVlKGNvbnRleHQsIGRlbHRhWzFdKTtcbiAgY29udGV4dC5vdXQoJzwvZGl2PicpO1xufTtcblxuSHRtbEZvcm1hdHRlci5wcm90b3R5cGUuZm9ybWF0X2RlbGV0ZWQgPSBmdW5jdGlvbihjb250ZXh0LCBkZWx0YSkge1xuICBjb250ZXh0Lm91dCgnPGRpdiBjbGFzcz1cImpzb25kaWZmcGF0Y2gtdmFsdWVcIj4nKTtcbiAgdGhpcy5mb3JtYXRWYWx1ZShjb250ZXh0LCBkZWx0YVswXSk7XG4gIGNvbnRleHQub3V0KCc8L2Rpdj4nKTtcbn07XG5cbkh0bWxGb3JtYXR0ZXIucHJvdG90eXBlLmZvcm1hdF9tb3ZlZCA9IGZ1bmN0aW9uKGNvbnRleHQsIGRlbHRhKSB7XG4gIGNvbnRleHQub3V0KCc8ZGl2IGNsYXNzPVwianNvbmRpZmZwYXRjaC12YWx1ZVwiPicpO1xuICB0aGlzLmZvcm1hdFZhbHVlKGNvbnRleHQsIGRlbHRhWzBdKTtcbiAgY29udGV4dC5vdXQoJzwvZGl2PjxkaXYgY2xhc3M9XCJqc29uZGlmZnBhdGNoLW1vdmVkLWRlc3RpbmF0aW9uXCI+JyArIGRlbHRhWzFdICsgJzwvZGl2PicpO1xuXG4gIC8vIGRyYXcgYW4gU1ZHIGFycm93IGZyb20gaGVyZSB0byBtb3ZlIGRlc3RpbmF0aW9uXG4gIGNvbnRleHQub3V0KFxuICAgIC8qanNoaW50IG11bHRpc3RyOiB0cnVlICovXG4gICAgJzxkaXYgY2xhc3M9XCJqc29uZGlmZnBhdGNoLWFycm93XCIgc3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmU7IGxlZnQ6IC0zNHB4O1wiPlxcXG4gICAgICAgIDxzdmcgd2lkdGg9XCIzMFwiIGhlaWdodD1cIjYwXCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGRpc3BsYXk6IG5vbmU7XCI+XFxcbiAgICAgICAgPGRlZnM+XFxcbiAgICAgICAgICAgIDxtYXJrZXIgaWQ9XCJtYXJrZXJBcnJvd1wiIG1hcmtlcldpZHRoPVwiOFwiIG1hcmtlckhlaWdodD1cIjhcIiByZWZ4PVwiMlwiIHJlZnk9XCI0XCJcXFxuICAgICAgICAgICAgICAgICAgIG9yaWVudD1cImF1dG9cIiBtYXJrZXJVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XFxcbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEsMSBMMSw3IEw3LDQgTDEsMVwiIHN0eWxlPVwiZmlsbDogIzMzOTtcIiAvPlxcXG4gICAgICAgICAgICA8L21hcmtlcj5cXFxuICAgICAgICA8L2RlZnM+XFxcbiAgICAgICAgPHBhdGggZD1cIk0zMCwwIFEtMTAsMjUgMjYsNTBcIiBzdHlsZT1cInN0cm9rZTogIzg4Zjsgc3Ryb2tlLXdpZHRoOiAycHg7IGZpbGw6IG5vbmU7XFxcbiAgICAgICAgc3Ryb2tlLW9wYWNpdHk6IDAuNTsgbWFya2VyLWVuZDogdXJsKCNtYXJrZXJBcnJvdyk7XCI+PC9wYXRoPlxcXG4gICAgICAgIDwvc3ZnPlxcXG4gICAgICAgIDwvZGl2PicpO1xuICBjb250ZXh0Lmhhc0Fycm93cyA9IHRydWU7XG59O1xuXG5IdG1sRm9ybWF0dGVyLnByb3RvdHlwZS5mb3JtYXRfdGV4dGRpZmYgPSBmdW5jdGlvbihjb250ZXh0LCBkZWx0YSkge1xuICBjb250ZXh0Lm91dCgnPGRpdiBjbGFzcz1cImpzb25kaWZmcGF0Y2gtdmFsdWVcIj4nKTtcbiAgdGhpcy5mb3JtYXRUZXh0RGlmZlN0cmluZyhjb250ZXh0LCBkZWx0YVswXSk7XG4gIGNvbnRleHQub3V0KCc8L2Rpdj4nKTtcbn07XG5cbi8qIGpzaGludCBjYW1lbGNhc2U6IHRydWUgKi9cblxudmFyIHNob3dVbmNoYW5nZWQgPSBmdW5jdGlvbihzaG93LCBub2RlLCBkZWxheSkge1xuICB2YXIgZWwgPSBub2RlIHx8IGRvY3VtZW50LmJvZHk7XG4gIHZhciBwcmVmaXggPSAnanNvbmRpZmZwYXRjaC11bmNoYW5nZWQtJztcbiAgdmFyIGNsYXNzZXMgPSB7XG4gICAgc2hvd2luZzogcHJlZml4ICsgJ3Nob3dpbmcnLFxuICAgIGhpZGluZzogcHJlZml4ICsgJ2hpZGluZycsXG4gICAgdmlzaWJsZTogcHJlZml4ICsgJ3Zpc2libGUnLFxuICAgIGhpZGRlbjogcHJlZml4ICsgJ2hpZGRlbicsXG4gIH07XG4gIHZhciBsaXN0ID0gZWwuY2xhc3NMaXN0O1xuICBpZiAoIWxpc3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFkZWxheSkge1xuICAgIGxpc3QucmVtb3ZlKGNsYXNzZXMuc2hvd2luZyk7XG4gICAgbGlzdC5yZW1vdmUoY2xhc3Nlcy5oaWRpbmcpO1xuICAgIGxpc3QucmVtb3ZlKGNsYXNzZXMudmlzaWJsZSk7XG4gICAgbGlzdC5yZW1vdmUoY2xhc3Nlcy5oaWRkZW4pO1xuICAgIGlmIChzaG93ID09PSBmYWxzZSkge1xuICAgICAgbGlzdC5hZGQoY2xhc3Nlcy5oaWRkZW4pO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHNob3cgPT09IGZhbHNlKSB7XG4gICAgbGlzdC5yZW1vdmUoY2xhc3Nlcy5zaG93aW5nKTtcbiAgICBsaXN0LmFkZChjbGFzc2VzLnZpc2libGUpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBsaXN0LmFkZChjbGFzc2VzLmhpZGluZyk7XG4gICAgfSwgMTApO1xuICB9IGVsc2Uge1xuICAgIGxpc3QucmVtb3ZlKGNsYXNzZXMuaGlkaW5nKTtcbiAgICBsaXN0LmFkZChjbGFzc2VzLnNob3dpbmcpO1xuICAgIGxpc3QucmVtb3ZlKGNsYXNzZXMuaGlkZGVuKTtcbiAgfVxuICB2YXIgaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgIGFkanVzdEFycm93cyhlbCk7XG4gIH0sIDEwMCk7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgbGlzdC5yZW1vdmUoY2xhc3Nlcy5zaG93aW5nKTtcbiAgICBsaXN0LnJlbW92ZShjbGFzc2VzLmhpZGluZyk7XG4gICAgaWYgKHNob3cgPT09IGZhbHNlKSB7XG4gICAgICBsaXN0LmFkZChjbGFzc2VzLmhpZGRlbik7XG4gICAgICBsaXN0LnJlbW92ZShjbGFzc2VzLnZpc2libGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LmFkZChjbGFzc2VzLnZpc2libGUpO1xuICAgICAgbGlzdC5yZW1vdmUoY2xhc3Nlcy5oaWRkZW4pO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgbGlzdC5yZW1vdmUoY2xhc3Nlcy52aXNpYmxlKTtcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJZCk7XG4gICAgfSwgZGVsYXkgKyA0MDApO1xuICB9LCBkZWxheSk7XG59O1xuXG52YXIgaGlkZVVuY2hhbmdlZCA9IGZ1bmN0aW9uKG5vZGUsIGRlbGF5KSB7XG4gIHJldHVybiBzaG93VW5jaGFuZ2VkKGZhbHNlLCBub2RlLCBkZWxheSk7XG59O1xuXG5leHBvcnRzLkh0bWxGb3JtYXR0ZXIgPSBIdG1sRm9ybWF0dGVyO1xuXG5leHBvcnRzLnNob3dVbmNoYW5nZWQgPSBzaG93VW5jaGFuZ2VkO1xuXG5leHBvcnRzLmhpZGVVbmNoYW5nZWQgPSBoaWRlVW5jaGFuZ2VkO1xuXG52YXIgZGVmYXVsdEluc3RhbmNlO1xuXG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGRlbHRhLCBsZWZ0KSB7XG4gIGlmICghZGVmYXVsdEluc3RhbmNlKSB7XG4gICAgZGVmYXVsdEluc3RhbmNlID0gbmV3IEh0bWxGb3JtYXR0ZXIoKTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdEluc3RhbmNlLmZvcm1hdChkZWx0YSwgbGVmdCk7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2pzb25kaWZmcGF0Y2gvc3JjL2Zvcm1hdHRlcnMvaHRtbC5qc1xuICoqLyIsInZhciBlbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4uL2Vudmlyb25tZW50Jyk7XG5cbmV4cG9ydHMuaHRtbCA9IHJlcXVpcmUoJy4vaHRtbCcpO1xuZXhwb3J0cy5hbm5vdGF0ZWQgPSByZXF1aXJlKCcuL2Fubm90YXRlZCcpO1xuXG5pZiAoIWVudmlyb25tZW50LmlzQnJvd3Nlcikge1xuXHR2YXIgY29uc29sZU1vZHVsZU5hbWUgPSAnLi9jb25zb2xlJztcblx0ZXhwb3J0cy5jb25zb2xlID0gcmVxdWlyZShjb25zb2xlTW9kdWxlTmFtZSk7XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vanNvbmRpZmZwYXRjaC9zcmMvZm9ybWF0dGVycy9pbmRleC5qc1xuICoqLyIsIlxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Zvcm1hdHRlcnMnKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9qc29uZGlmZnBhdGNoL3NyYy9tYWluLWZvcm1hdHRlcnMuanNcbiAqKi8iLCJ2YXIgZW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL2Vudmlyb25tZW50Jyk7XG5cbmlmIChlbnZpcm9ubWVudC5pc0Jyb3dzZXIpIHtcbiAgLyogZ2xvYmFsIHdpbmRvdyAqL1xuICAvKiBqc2hpbnQgY2FtZWxjYXNlOiBmYWxzZSAqL1xuICB3aW5kb3cuZGlmZl9tYXRjaF9wYXRjaCA9IHJlcXVpcmUoJy4uL3B1YmxpYy9leHRlcm5hbC9kaWZmX21hdGNoX3BhdGNoX3VuY29tcHJlc3NlZCcpO1xuICAvKiBqc2hpbnQgY2FtZWxjYXNlOiB0cnVlICovXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9tYWluJyk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vanNvbmRpZmZwYXRjaC9zcmMvbWFpbi1mdWxsLmpzXG4gKiovIiwidmFyIFBpcGUgPSBmdW5jdGlvbiBQaXBlKG5hbWUpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5maWx0ZXJzID0gW107XG59O1xuXG5QaXBlLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgaWYgKCF0aGlzLnByb2Nlc3Nvcikge1xuICAgIHRocm93IG5ldyBFcnJvcignYWRkIHRoaXMgcGlwZSB0byBhIHByb2Nlc3NvciBiZWZvcmUgdXNpbmcgaXQnKTtcbiAgfVxuICB2YXIgZGVidWcgPSB0aGlzLmRlYnVnO1xuICB2YXIgbGVuZ3RoID0gdGhpcy5maWx0ZXJzLmxlbmd0aDtcbiAgdmFyIGNvbnRleHQgPSBpbnB1dDtcbiAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgIHZhciBmaWx0ZXIgPSB0aGlzLmZpbHRlcnNbaW5kZXhdO1xuICAgIGlmIChkZWJ1Zykge1xuICAgICAgdGhpcy5sb2coJ2ZpbHRlcjogJyArIGZpbHRlci5maWx0ZXJOYW1lKTtcbiAgICB9XG4gICAgZmlsdGVyKGNvbnRleHQpO1xuICAgIGlmICh0eXBlb2YgY29udGV4dCA9PT0gJ29iamVjdCcgJiYgY29udGV4dC5leGl0aW5nKSB7XG4gICAgICBjb250ZXh0LmV4aXRpbmcgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAoIWNvbnRleHQubmV4dCAmJiB0aGlzLnJlc3VsdENoZWNrKSB7XG4gICAgdGhpcy5yZXN1bHRDaGVjayhjb250ZXh0KTtcbiAgfVxufTtcblxuUGlwZS5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24obXNnKSB7XG4gIGNvbnNvbGUubG9nKCdbanNvbmRpZmZwYXRjaF0gJyArIHRoaXMubmFtZSArICcgcGlwZSwgJyArIG1zZyk7XG59O1xuXG5QaXBlLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5maWx0ZXJzLnB1c2guYXBwbHkodGhpcy5maWx0ZXJzLCBhcmd1bWVudHMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblBpcGUucHJvdG90eXBlLnByZXBlbmQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5maWx0ZXJzLnVuc2hpZnQuYXBwbHkodGhpcy5maWx0ZXJzLCBhcmd1bWVudHMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblBpcGUucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbihmaWx0ZXJOYW1lKSB7XG4gIGlmICghZmlsdGVyTmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYSBmaWx0ZXIgbmFtZSBpcyByZXF1aXJlZCcpO1xuICB9XG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmZpbHRlcnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgdmFyIGZpbHRlciA9IHRoaXMuZmlsdGVyc1tpbmRleF07XG4gICAgaWYgKGZpbHRlci5maWx0ZXJOYW1lID09PSBmaWx0ZXJOYW1lKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcignZmlsdGVyIG5vdCBmb3VuZDogJyArIGZpbHRlck5hbWUpO1xufTtcblxuUGlwZS5wcm90b3R5cGUubGlzdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbmFtZXMgPSBbXTtcbiAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZmlsdGVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICB2YXIgZmlsdGVyID0gdGhpcy5maWx0ZXJzW2luZGV4XTtcbiAgICBuYW1lcy5wdXNoKGZpbHRlci5maWx0ZXJOYW1lKTtcbiAgfVxuICByZXR1cm4gbmFtZXM7XG59O1xuXG5QaXBlLnByb3RvdHlwZS5hZnRlciA9IGZ1bmN0aW9uKGZpbHRlck5hbWUpIHtcbiAgdmFyIGluZGV4ID0gdGhpcy5pbmRleE9mKGZpbHRlck5hbWUpO1xuICB2YXIgcGFyYW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgaWYgKCFwYXJhbXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhIGZpbHRlciBpcyByZXF1aXJlZCcpO1xuICB9XG4gIHBhcmFtcy51bnNoaWZ0KGluZGV4ICsgMSwgMCk7XG4gIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkodGhpcy5maWx0ZXJzLCBwYXJhbXMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblBpcGUucHJvdG90eXBlLmJlZm9yZSA9IGZ1bmN0aW9uKGZpbHRlck5hbWUpIHtcbiAgdmFyIGluZGV4ID0gdGhpcy5pbmRleE9mKGZpbHRlck5hbWUpO1xuICB2YXIgcGFyYW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgaWYgKCFwYXJhbXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhIGZpbHRlciBpcyByZXF1aXJlZCcpO1xuICB9XG4gIHBhcmFtcy51bnNoaWZ0KGluZGV4LCAwKTtcbiAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseSh0aGlzLmZpbHRlcnMsIHBhcmFtcyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUGlwZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5maWx0ZXJzLmxlbmd0aCA9IDA7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUGlwZS5wcm90b3R5cGUuc2hvdWxkSGF2ZVJlc3VsdCA9IGZ1bmN0aW9uKHNob3VsZCkge1xuICBpZiAoc2hvdWxkID09PSBmYWxzZSkge1xuICAgIHRoaXMucmVzdWx0Q2hlY2sgPSBudWxsO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodGhpcy5yZXN1bHRDaGVjaykge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgcGlwZSA9IHRoaXM7XG4gIHRoaXMucmVzdWx0Q2hlY2sgPSBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgaWYgKCFjb250ZXh0Lmhhc1Jlc3VsdCkge1xuICAgICAgY29uc29sZS5sb2coY29udGV4dCk7XG4gICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IocGlwZS5uYW1lICsgJyBmYWlsZWQnKTtcbiAgICAgIGVycm9yLm5vUmVzdWx0ID0gdHJ1ZTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5leHBvcnRzLlBpcGUgPSBQaXBlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2pzb25kaWZmcGF0Y2gvc3JjL3BpcGUuanNcbiAqKi8iLCJcbnZhciBQcm9jZXNzb3IgPSBmdW5jdGlvbiBQcm9jZXNzb3Iob3B0aW9ucyl7XG5cdHRoaXMuc2VsZk9wdGlvbnMgPSBvcHRpb25zO1xuXHR0aGlzLnBpcGVzID0ge307XG59O1xuXG5Qcm9jZXNzb3IucHJvdG90eXBlLm9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdGlmIChvcHRpb25zKSB7XG5cdFx0dGhpcy5zZWxmT3B0aW9ucyA9IG9wdGlvbnM7XG5cdH1cblx0cmV0dXJuIHRoaXMuc2VsZk9wdGlvbnM7XG59O1xuXG5Qcm9jZXNzb3IucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbihuYW1lLCBwaXBlKSB7XG5cdGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcblx0XHRpZiAodHlwZW9mIHBpcGUgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5waXBlc1tuYW1lXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5waXBlc1tuYW1lXSA9IHBpcGU7XG5cdFx0fVxuXHR9XG5cdGlmIChuYW1lICYmIG5hbWUubmFtZSkge1xuXHRcdHBpcGUgPSBuYW1lO1xuXHRcdGlmIChwaXBlLnByb2Nlc3NvciA9PT0gdGhpcykgeyByZXR1cm4gcGlwZTsgfVxuXHRcdHRoaXMucGlwZXNbcGlwZS5uYW1lXSA9IHBpcGU7XG5cdH1cblx0cGlwZS5wcm9jZXNzb3IgPSB0aGlzO1xuXHRyZXR1cm4gcGlwZTtcbn07XG5cblByb2Nlc3Nvci5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uKGlucHV0LCBwaXBlKSB7XG5cdHZhciBjb250ZXh0ID0gaW5wdXQ7XG5cdGNvbnRleHQub3B0aW9ucyA9IHRoaXMub3B0aW9ucygpO1xuXHR2YXIgbmV4dFBpcGUgPSBwaXBlIHx8IGlucHV0LnBpcGUgfHwgJ2RlZmF1bHQnO1xuXHR2YXIgbGFzdFBpcGUsIGxhc3RDb250ZXh0O1xuXHR3aGlsZSAobmV4dFBpcGUpIHtcblx0XHRpZiAodHlwZW9mIGNvbnRleHQubmV4dEFmdGVyQ2hpbGRyZW4gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHQvLyBjaGlsZHJlbiBwcm9jZXNzZWQgYW5kIGNvbWluZyBiYWNrIHRvIHBhcmVudFxuXHRcdFx0Y29udGV4dC5uZXh0ID0gY29udGV4dC5uZXh0QWZ0ZXJDaGlsZHJlbjtcblx0XHRcdGNvbnRleHQubmV4dEFmdGVyQ2hpbGRyZW4gPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgbmV4dFBpcGUgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRuZXh0UGlwZSA9IHRoaXMucGlwZShuZXh0UGlwZSk7XG5cdFx0fVxuXHRcdG5leHRQaXBlLnByb2Nlc3MoY29udGV4dCk7XG5cdFx0bGFzdENvbnRleHQgPSBjb250ZXh0O1xuXHRcdGxhc3RQaXBlID0gbmV4dFBpcGU7XG5cdFx0bmV4dFBpcGUgPSBudWxsO1xuXHRcdGlmIChjb250ZXh0KSB7XG5cdFx0XHRpZiAoY29udGV4dC5uZXh0KSB7XG5cdFx0XHRcdGNvbnRleHQgPSBjb250ZXh0Lm5leHQ7XG5cdFx0XHRcdG5leHRQaXBlID0gbGFzdENvbnRleHQubmV4dFBpcGUgfHwgY29udGV4dC5waXBlIHx8IGxhc3RQaXBlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gY29udGV4dC5oYXNSZXN1bHQgPyBjb250ZXh0LnJlc3VsdCA6IHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydHMuUHJvY2Vzc29yID0gUHJvY2Vzc29yO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2pzb25kaWZmcGF0Y2gvc3JjL3Byb2Nlc3Nvci5qc1xuICoqLyIsInZhciBtYXAgPSB7XG5cdFwiLi9hbm5vdGF0ZWRcIjogMjgsXG5cdFwiLi9hbm5vdGF0ZWQuanNcIjogMjgsXG5cdFwiLi9iYXNlXCI6IDI5LFxuXHRcIi4vYmFzZS5qc1wiOiAyOSxcblx0XCIuL2NvbnNvbGVcIjogMzAsXG5cdFwiLi9jb25zb2xlLmpzXCI6IDMwLFxuXHRcIi4vaHRtbFwiOiAzMSxcblx0XCIuL2h0bWwuanNcIjogMzEsXG5cdFwiLi9pbmRleFwiOiAzMixcblx0XCIuL2luZGV4LmpzXCI6IDMyXG59O1xuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpKTtcbn07XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdHJldHVybiBtYXBbcmVxXSB8fCAoZnVuY3Rpb24oKSB7IHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIicuXCIpIH0oKSk7XG59O1xud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IDM3O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbmRpZmZwYXRjaC9zcmMvZm9ybWF0dGVycyBeXFwuXFwvLiokXG4gKiogbW9kdWxlIGlkID0gMzdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBtYXAgPSB7XG5cdFwiLi9kaWZmX21hdGNoX3BhdGNoX3VuY29tcHJlc3NlZFwiOiAzOSxcblx0XCIuL2RpZmZfbWF0Y2hfcGF0Y2hfdW5jb21wcmVzc2VkLmpzXCI6IDM5XG59O1xuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpKTtcbn07XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdHJldHVybiBtYXBbcmVxXSB8fCAoZnVuY3Rpb24oKSB7IHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIicuXCIpIH0oKSk7XG59O1xud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IDM4O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbmRpZmZwYXRjaC9wdWJsaWMvZXh0ZXJuYWwgXlxcLlxcLy4qJFxuICoqIG1vZHVsZSBpZCA9IDM4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIERpZmYgTWF0Y2ggYW5kIFBhdGNoXG4gKlxuICogQ29weXJpZ2h0IDIwMDYgR29vZ2xlIEluYy5cbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9nb29nbGUtZGlmZi1tYXRjaC1wYXRjaC9cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBDb21wdXRlcyB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHR3byB0ZXh0cyB0byBjcmVhdGUgYSBwYXRjaC5cbiAqIEFwcGxpZXMgdGhlIHBhdGNoIG9udG8gYW5vdGhlciB0ZXh0LCBhbGxvd2luZyBmb3IgZXJyb3JzLlxuICogQGF1dGhvciBmcmFzZXJAZ29vZ2xlLmNvbSAoTmVpbCBGcmFzZXIpXG4gKi9cblxuLyoqXG4gKiBDbGFzcyBjb250YWluaW5nIHRoZSBkaWZmLCBtYXRjaCBhbmQgcGF0Y2ggbWV0aG9kcy5cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBkaWZmX21hdGNoX3BhdGNoKCkge1xuXG4gIC8vIERlZmF1bHRzLlxuICAvLyBSZWRlZmluZSB0aGVzZSBpbiB5b3VyIHByb2dyYW0gdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHRzLlxuXG4gIC8vIE51bWJlciBvZiBzZWNvbmRzIHRvIG1hcCBhIGRpZmYgYmVmb3JlIGdpdmluZyB1cCAoMCBmb3IgaW5maW5pdHkpLlxuICB0aGlzLkRpZmZfVGltZW91dCA9IDEuMDtcbiAgLy8gQ29zdCBvZiBhbiBlbXB0eSBlZGl0IG9wZXJhdGlvbiBpbiB0ZXJtcyBvZiBlZGl0IGNoYXJhY3RlcnMuXG4gIHRoaXMuRGlmZl9FZGl0Q29zdCA9IDQ7XG4gIC8vIEF0IHdoYXQgcG9pbnQgaXMgbm8gbWF0Y2ggZGVjbGFyZWQgKDAuMCA9IHBlcmZlY3Rpb24sIDEuMCA9IHZlcnkgbG9vc2UpLlxuICB0aGlzLk1hdGNoX1RocmVzaG9sZCA9IDAuNTtcbiAgLy8gSG93IGZhciB0byBzZWFyY2ggZm9yIGEgbWF0Y2ggKDAgPSBleGFjdCBsb2NhdGlvbiwgMTAwMCsgPSBicm9hZCBtYXRjaCkuXG4gIC8vIEEgbWF0Y2ggdGhpcyBtYW55IGNoYXJhY3RlcnMgYXdheSBmcm9tIHRoZSBleHBlY3RlZCBsb2NhdGlvbiB3aWxsIGFkZFxuICAvLyAxLjAgdG8gdGhlIHNjb3JlICgwLjAgaXMgYSBwZXJmZWN0IG1hdGNoKS5cbiAgdGhpcy5NYXRjaF9EaXN0YW5jZSA9IDEwMDA7XG4gIC8vIFdoZW4gZGVsZXRpbmcgYSBsYXJnZSBibG9jayBvZiB0ZXh0IChvdmVyIH42NCBjaGFyYWN0ZXJzKSwgaG93IGNsb3NlIGRvZXNcbiAgLy8gdGhlIGNvbnRlbnRzIGhhdmUgdG8gbWF0Y2ggdGhlIGV4cGVjdGVkIGNvbnRlbnRzLiAoMC4wID0gcGVyZmVjdGlvbixcbiAgLy8gMS4wID0gdmVyeSBsb29zZSkuICBOb3RlIHRoYXQgTWF0Y2hfVGhyZXNob2xkIGNvbnRyb2xzIGhvdyBjbG9zZWx5IHRoZVxuICAvLyBlbmQgcG9pbnRzIG9mIGEgZGVsZXRlIG5lZWQgdG8gbWF0Y2guXG4gIHRoaXMuUGF0Y2hfRGVsZXRlVGhyZXNob2xkID0gMC41O1xuICAvLyBDaHVuayBzaXplIGZvciBjb250ZXh0IGxlbmd0aC5cbiAgdGhpcy5QYXRjaF9NYXJnaW4gPSA0O1xuXG4gIC8vIFRoZSBudW1iZXIgb2YgYml0cyBpbiBhbiBpbnQuXG4gIHRoaXMuTWF0Y2hfTWF4Qml0cyA9IDMyO1xufVxuXG5cbi8vICBESUZGIEZVTkNUSU9OU1xuXG5cbi8qKlxuICogVGhlIGRhdGEgc3RydWN0dXJlIHJlcHJlc2VudGluZyBhIGRpZmYgaXMgYW4gYXJyYXkgb2YgdHVwbGVzOlxuICogW1tESUZGX0RFTEVURSwgJ0hlbGxvJ10sIFtESUZGX0lOU0VSVCwgJ0dvb2RieWUnXSwgW0RJRkZfRVFVQUwsICcgd29ybGQuJ11dXG4gKiB3aGljaCBtZWFuczogZGVsZXRlICdIZWxsbycsIGFkZCAnR29vZGJ5ZScgYW5kIGtlZXAgJyB3b3JsZC4nXG4gKi9cbnZhciBESUZGX0RFTEVURSA9IC0xO1xudmFyIERJRkZfSU5TRVJUID0gMTtcbnZhciBESUZGX0VRVUFMID0gMDtcblxuLyoqIEB0eXBlZGVmIHshQXJyYXkuPG51bWJlcnxzdHJpbmc+fSAqL1xuZGlmZl9tYXRjaF9wYXRjaC5EaWZmO1xuXG5cbi8qKlxuICogRmluZCB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiB0d28gdGV4dHMuICBTaW1wbGlmaWVzIHRoZSBwcm9ibGVtIGJ5IHN0cmlwcGluZ1xuICogYW55IGNvbW1vbiBwcmVmaXggb3Igc3VmZml4IG9mZiB0aGUgdGV4dHMgYmVmb3JlIGRpZmZpbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDEgT2xkIHN0cmluZyB0byBiZSBkaWZmZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDIgTmV3IHN0cmluZyB0byBiZSBkaWZmZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSBvcHRfY2hlY2tsaW5lcyBPcHRpb25hbCBzcGVlZHVwIGZsYWcuIElmIHByZXNlbnQgYW5kIGZhbHNlLFxuICogICAgIHRoZW4gZG9uJ3QgcnVuIGEgbGluZS1sZXZlbCBkaWZmIGZpcnN0IHRvIGlkZW50aWZ5IHRoZSBjaGFuZ2VkIGFyZWFzLlxuICogICAgIERlZmF1bHRzIHRvIHRydWUsIHdoaWNoIGRvZXMgYSBmYXN0ZXIsIHNsaWdodGx5IGxlc3Mgb3B0aW1hbCBkaWZmLlxuICogQHBhcmFtIHtudW1iZXJ9IG9wdF9kZWFkbGluZSBPcHRpb25hbCB0aW1lIHdoZW4gdGhlIGRpZmYgc2hvdWxkIGJlIGNvbXBsZXRlXG4gKiAgICAgYnkuICBVc2VkIGludGVybmFsbHkgZm9yIHJlY3Vyc2l2ZSBjYWxscy4gIFVzZXJzIHNob3VsZCBzZXQgRGlmZlRpbWVvdXRcbiAqICAgICBpbnN0ZWFkLlxuICogQHJldHVybiB7IUFycmF5LjwhZGlmZl9tYXRjaF9wYXRjaC5EaWZmPn0gQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gKi9cbmRpZmZfbWF0Y2hfcGF0Y2gucHJvdG90eXBlLmRpZmZfbWFpbiA9IGZ1bmN0aW9uKHRleHQxLCB0ZXh0Miwgb3B0X2NoZWNrbGluZXMsXG4gICAgb3B0X2RlYWRsaW5lKSB7XG4gIC8vIFNldCBhIGRlYWRsaW5lIGJ5IHdoaWNoIHRpbWUgdGhlIGRpZmYgbXVzdCBiZSBjb21wbGV0ZS5cbiAgaWYgKHR5cGVvZiBvcHRfZGVhZGxpbmUgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodGhpcy5EaWZmX1RpbWVvdXQgPD0gMCkge1xuICAgICAgb3B0X2RlYWRsaW5lID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0X2RlYWRsaW5lID0gKG5ldyBEYXRlKS5nZXRUaW1lKCkgKyB0aGlzLkRpZmZfVGltZW91dCAqIDEwMDA7XG4gICAgfVxuICB9XG4gIHZhciBkZWFkbGluZSA9IG9wdF9kZWFkbGluZTtcblxuICAvLyBDaGVjayBmb3IgbnVsbCBpbnB1dHMuXG4gIGlmICh0ZXh0MSA9PSBudWxsIHx8IHRleHQyID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ051bGwgaW5wdXQuIChkaWZmX21haW4pJyk7XG4gIH1cblxuICAvLyBDaGVjayBmb3IgZXF1YWxpdHkgKHNwZWVkdXApLlxuICBpZiAodGV4dDEgPT0gdGV4dDIpIHtcbiAgICBpZiAodGV4dDEpIHtcbiAgICAgIHJldHVybiBbW0RJRkZfRVFVQUwsIHRleHQxXV07XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0X2NoZWNrbGluZXMgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRfY2hlY2tsaW5lcyA9IHRydWU7XG4gIH1cbiAgdmFyIGNoZWNrbGluZXMgPSBvcHRfY2hlY2tsaW5lcztcblxuICAvLyBUcmltIG9mZiBjb21tb24gcHJlZml4IChzcGVlZHVwKS5cbiAgdmFyIGNvbW1vbmxlbmd0aCA9IHRoaXMuZGlmZl9jb21tb25QcmVmaXgodGV4dDEsIHRleHQyKTtcbiAgdmFyIGNvbW1vbnByZWZpeCA9IHRleHQxLnN1YnN0cmluZygwLCBjb21tb25sZW5ndGgpO1xuICB0ZXh0MSA9IHRleHQxLnN1YnN0cmluZyhjb21tb25sZW5ndGgpO1xuICB0ZXh0MiA9IHRleHQyLnN1YnN0cmluZyhjb21tb25sZW5ndGgpO1xuXG4gIC8vIFRyaW0gb2ZmIGNvbW1vbiBzdWZmaXggKHNwZWVkdXApLlxuICBjb21tb25sZW5ndGggPSB0aGlzLmRpZmZfY29tbW9uU3VmZml4KHRleHQxLCB0ZXh0Mik7XG4gIHZhciBjb21tb25zdWZmaXggPSB0ZXh0MS5zdWJzdHJpbmcodGV4dDEubGVuZ3RoIC0gY29tbW9ubGVuZ3RoKTtcbiAgdGV4dDEgPSB0ZXh0MS5zdWJzdHJpbmcoMCwgdGV4dDEubGVuZ3RoIC0gY29tbW9ubGVuZ3RoKTtcbiAgdGV4dDIgPSB0ZXh0Mi5zdWJzdHJpbmcoMCwgdGV4dDIubGVuZ3RoIC0gY29tbW9ubGVuZ3RoKTtcblxuICAvLyBDb21wdXRlIHRoZSBkaWZmIG9uIHRoZSBtaWRkbGUgYmxvY2suXG4gIHZhciBkaWZmcyA9IHRoaXMuZGlmZl9jb21wdXRlXyh0ZXh0MSwgdGV4dDIsIGNoZWNrbGluZXMsIGRlYWRsaW5lKTtcblxuICAvLyBSZXN0b3JlIHRoZSBwcmVmaXggYW5kIHN1ZmZpeC5cbiAgaWYgKGNvbW1vbnByZWZpeCkge1xuICAgIGRpZmZzLnVuc2hpZnQoW0RJRkZfRVFVQUwsIGNvbW1vbnByZWZpeF0pO1xuICB9XG4gIGlmIChjb21tb25zdWZmaXgpIHtcbiAgICBkaWZmcy5wdXNoKFtESUZGX0VRVUFMLCBjb21tb25zdWZmaXhdKTtcbiAgfVxuICB0aGlzLmRpZmZfY2xlYW51cE1lcmdlKGRpZmZzKTtcbiAgcmV0dXJuIGRpZmZzO1xufTtcblxuXG4vKipcbiAqIEZpbmQgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gdHdvIHRleHRzLiAgQXNzdW1lcyB0aGF0IHRoZSB0ZXh0cyBkbyBub3RcbiAqIGhhdmUgYW55IGNvbW1vbiBwcmVmaXggb3Igc3VmZml4LlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQxIE9sZCBzdHJpbmcgdG8gYmUgZGlmZmVkLlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQyIE5ldyBzdHJpbmcgdG8gYmUgZGlmZmVkLlxuICogQHBhcmFtIHtib29sZWFufSBjaGVja2xpbmVzIFNwZWVkdXAgZmxhZy4gIElmIGZhbHNlLCB0aGVuIGRvbid0IHJ1biBhXG4gKiAgICAgbGluZS1sZXZlbCBkaWZmIGZpcnN0IHRvIGlkZW50aWZ5IHRoZSBjaGFuZ2VkIGFyZWFzLlxuICogICAgIElmIHRydWUsIHRoZW4gcnVuIGEgZmFzdGVyLCBzbGlnaHRseSBsZXNzIG9wdGltYWwgZGlmZi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkZWFkbGluZSBUaW1lIHdoZW4gdGhlIGRpZmYgc2hvdWxkIGJlIGNvbXBsZXRlIGJ5LlxuICogQHJldHVybiB7IUFycmF5LjwhZGlmZl9tYXRjaF9wYXRjaC5EaWZmPn0gQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gKiBAcHJpdmF0ZVxuICovXG5kaWZmX21hdGNoX3BhdGNoLnByb3RvdHlwZS5kaWZmX2NvbXB1dGVfID0gZnVuY3Rpb24odGV4dDEsIHRleHQyLCBjaGVja2xpbmVzLFxuICAgIGRlYWRsaW5lKSB7XG4gIHZhciBkaWZmcztcblxuICBpZiAoIXRleHQxKSB7XG4gICAgLy8gSnVzdCBhZGQgc29tZSB0ZXh0IChzcGVlZHVwKS5cbiAgICByZXR1cm4gW1tESUZGX0lOU0VSVCwgdGV4dDJdXTtcbiAgfVxuXG4gIGlmICghdGV4dDIpIHtcbiAgICAvLyBKdXN0IGRlbGV0ZSBzb21lIHRleHQgKHNwZWVkdXApLlxuICAgIHJldHVybiBbW0RJRkZfREVMRVRFLCB0ZXh0MV1dO1xuICB9XG5cbiAgdmFyIGxvbmd0ZXh0ID0gdGV4dDEubGVuZ3RoID4gdGV4dDIubGVuZ3RoID8gdGV4dDEgOiB0ZXh0MjtcbiAgdmFyIHNob3J0dGV4dCA9IHRleHQxLmxlbmd0aCA+IHRleHQyLmxlbmd0aCA/IHRleHQyIDogdGV4dDE7XG4gIHZhciBpID0gbG9uZ3RleHQuaW5kZXhPZihzaG9ydHRleHQpO1xuICBpZiAoaSAhPSAtMSkge1xuICAgIC8vIFNob3J0ZXIgdGV4dCBpcyBpbnNpZGUgdGhlIGxvbmdlciB0ZXh0IChzcGVlZHVwKS5cbiAgICBkaWZmcyA9IFtbRElGRl9JTlNFUlQsIGxvbmd0ZXh0LnN1YnN0cmluZygwLCBpKV0sXG4gICAgICAgICAgICAgW0RJRkZfRVFVQUwsIHNob3J0dGV4dF0sXG4gICAgICAgICAgICAgW0RJRkZfSU5TRVJULCBsb25ndGV4dC5zdWJzdHJpbmcoaSArIHNob3J0dGV4dC5sZW5ndGgpXV07XG4gICAgLy8gU3dhcCBpbnNlcnRpb25zIGZvciBkZWxldGlvbnMgaWYgZGlmZiBpcyByZXZlcnNlZC5cbiAgICBpZiAodGV4dDEubGVuZ3RoID4gdGV4dDIubGVuZ3RoKSB7XG4gICAgICBkaWZmc1swXVswXSA9IGRpZmZzWzJdWzBdID0gRElGRl9ERUxFVEU7XG4gICAgfVxuICAgIHJldHVybiBkaWZmcztcbiAgfVxuXG4gIGlmIChzaG9ydHRleHQubGVuZ3RoID09IDEpIHtcbiAgICAvLyBTaW5nbGUgY2hhcmFjdGVyIHN0cmluZy5cbiAgICAvLyBBZnRlciB0aGUgcHJldmlvdXMgc3BlZWR1cCwgdGhlIGNoYXJhY3RlciBjYW4ndCBiZSBhbiBlcXVhbGl0eS5cbiAgICByZXR1cm4gW1tESUZGX0RFTEVURSwgdGV4dDFdLCBbRElGRl9JTlNFUlQsIHRleHQyXV07XG4gIH1cbiAgbG9uZ3RleHQgPSBzaG9ydHRleHQgPSBudWxsOyAgLy8gR2FyYmFnZSBjb2xsZWN0LlxuXG4gIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgcHJvYmxlbSBjYW4gYmUgc3BsaXQgaW4gdHdvLlxuICB2YXIgaG0gPSB0aGlzLmRpZmZfaGFsZk1hdGNoXyh0ZXh0MSwgdGV4dDIpO1xuICBpZiAoaG0pIHtcbiAgICAvLyBBIGhhbGYtbWF0Y2ggd2FzIGZvdW5kLCBzb3J0IG91dCB0aGUgcmV0dXJuIGRhdGEuXG4gICAgdmFyIHRleHQxX2EgPSBobVswXTtcbiAgICB2YXIgdGV4dDFfYiA9IGhtWzFdO1xuICAgIHZhciB0ZXh0Ml9hID0gaG1bMl07XG4gICAgdmFyIHRleHQyX2IgPSBobVszXTtcbiAgICB2YXIgbWlkX2NvbW1vbiA9IGhtWzRdO1xuICAgIC8vIFNlbmQgYm90aCBwYWlycyBvZmYgZm9yIHNlcGFyYXRlIHByb2Nlc3NpbmcuXG4gICAgdmFyIGRpZmZzX2EgPSB0aGlzLmRpZmZfbWFpbih0ZXh0MV9hLCB0ZXh0Ml9hLCBjaGVja2xpbmVzLCBkZWFkbGluZSk7XG4gICAgdmFyIGRpZmZzX2IgPSB0aGlzLmRpZmZfbWFpbih0ZXh0MV9iLCB0ZXh0Ml9iLCBjaGVja2xpbmVzLCBkZWFkbGluZSk7XG4gICAgLy8gTWVyZ2UgdGhlIHJlc3VsdHMuXG4gICAgcmV0dXJuIGRpZmZzX2EuY29uY2F0KFtbRElGRl9FUVVBTCwgbWlkX2NvbW1vbl1dLCBkaWZmc19iKTtcbiAgfVxuXG4gIGlmIChjaGVja2xpbmVzICYmIHRleHQxLmxlbmd0aCA+IDEwMCAmJiB0ZXh0Mi5sZW5ndGggPiAxMDApIHtcbiAgICByZXR1cm4gdGhpcy5kaWZmX2xpbmVNb2RlXyh0ZXh0MSwgdGV4dDIsIGRlYWRsaW5lKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmRpZmZfYmlzZWN0Xyh0ZXh0MSwgdGV4dDIsIGRlYWRsaW5lKTtcbn07XG5cblxuLyoqXG4gKiBEbyBhIHF1aWNrIGxpbmUtbGV2ZWwgZGlmZiBvbiBib3RoIHN0cmluZ3MsIHRoZW4gcmVkaWZmIHRoZSBwYXJ0cyBmb3JcbiAqIGdyZWF0ZXIgYWNjdXJhY3kuXG4gKiBUaGlzIHNwZWVkdXAgY2FuIHByb2R1Y2Ugbm9uLW1pbmltYWwgZGlmZnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDEgT2xkIHN0cmluZyB0byBiZSBkaWZmZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDIgTmV3IHN0cmluZyB0byBiZSBkaWZmZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gZGVhZGxpbmUgVGltZSB3aGVuIHRoZSBkaWZmIHNob3VsZCBiZSBjb21wbGV0ZSBieS5cbiAqIEByZXR1cm4geyFBcnJheS48IWRpZmZfbWF0Y2hfcGF0Y2guRGlmZj59IEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICogQHByaXZhdGVcbiAqL1xuZGlmZl9tYXRjaF9wYXRjaC5wcm90b3R5cGUuZGlmZl9saW5lTW9kZV8gPSBmdW5jdGlvbih0ZXh0MSwgdGV4dDIsIGRlYWRsaW5lKSB7XG4gIC8vIFNjYW4gdGhlIHRleHQgb24gYSBsaW5lLWJ5LWxpbmUgYmFzaXMgZmlyc3QuXG4gIHZhciBhID0gdGhpcy5kaWZmX2xpbmVzVG9DaGFyc18odGV4dDEsIHRleHQyKTtcbiAgdGV4dDEgPSAvKiogQHR5cGUge3N0cmluZ30gKi8oYVswXSk7XG4gIHRleHQyID0gLyoqIEB0eXBlIHtzdHJpbmd9ICovKGFbMV0pO1xuICB2YXIgbGluZWFycmF5ID0gLyoqIEB0eXBlIHshQXJyYXkuPHN0cmluZz59ICovKGFbMl0pO1xuXG4gIHZhciBkaWZmcyA9IHRoaXMuZGlmZl9iaXNlY3RfKHRleHQxLCB0ZXh0MiwgZGVhZGxpbmUpO1xuXG4gIC8vIENvbnZlcnQgdGhlIGRpZmYgYmFjayB0byBvcmlnaW5hbCB0ZXh0LlxuICB0aGlzLmRpZmZfY2hhcnNUb0xpbmVzXyhkaWZmcywgbGluZWFycmF5KTtcbiAgLy8gRWxpbWluYXRlIGZyZWFrIG1hdGNoZXMgKGUuZy4gYmxhbmsgbGluZXMpXG4gIHRoaXMuZGlmZl9jbGVhbnVwU2VtYW50aWMoZGlmZnMpO1xuXG4gIC8vIFJlZGlmZiBhbnkgcmVwbGFjZW1lbnQgYmxvY2tzLCB0aGlzIHRpbWUgY2hhcmFjdGVyLWJ5LWNoYXJhY3Rlci5cbiAgLy8gQWRkIGEgZHVtbXkgZW50cnkgYXQgdGhlIGVuZC5cbiAgZGlmZnMucHVzaChbRElGRl9FUVVBTCwgJyddKTtcbiAgdmFyIHBvaW50ZXIgPSAwO1xuICB2YXIgY291bnRfZGVsZXRlID0gMDtcbiAgdmFyIGNvdW50X2luc2VydCA9IDA7XG4gIHZhciB0ZXh0X2RlbGV0ZSA9ICcnO1xuICB2YXIgdGV4dF9pbnNlcnQgPSAnJztcbiAgd2hpbGUgKHBvaW50ZXIgPCBkaWZmcy5sZW5ndGgpIHtcbiAgICBzd2l0Y2ggKGRpZmZzW3BvaW50ZXJdWzBdKSB7XG4gICAgICBjYXNlIERJRkZfSU5TRVJUOlxuICAgICAgICBjb3VudF9pbnNlcnQrKztcbiAgICAgICAgdGV4dF9pbnNlcnQgKz0gZGlmZnNbcG9pbnRlcl1bMV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBESUZGX0RFTEVURTpcbiAgICAgICAgY291bnRfZGVsZXRlKys7XG4gICAgICAgIHRleHRfZGVsZXRlICs9IGRpZmZzW3BvaW50ZXJdWzFdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRElGRl9FUVVBTDpcbiAgICAgICAgLy8gVXBvbiByZWFjaGluZyBhbiBlcXVhbGl0eSwgY2hlY2sgZm9yIHByaW9yIHJlZHVuZGFuY2llcy5cbiAgICAgICAgaWYgKGNvdW50X2RlbGV0ZSA+PSAxICYmIGNvdW50X2luc2VydCA+PSAxKSB7XG4gICAgICAgICAgLy8gRGVsZXRlIHRoZSBvZmZlbmRpbmcgcmVjb3JkcyBhbmQgYWRkIHRoZSBtZXJnZWQgb25lcy5cbiAgICAgICAgICB2YXIgYSA9IHRoaXMuZGlmZl9tYWluKHRleHRfZGVsZXRlLCB0ZXh0X2luc2VydCwgZmFsc2UsIGRlYWRsaW5lKTtcbiAgICAgICAgICBkaWZmcy5zcGxpY2UocG9pbnRlciAtIGNvdW50X2RlbGV0ZSAtIGNvdW50X2luc2VydCxcbiAgICAgICAgICAgICAgICAgICAgICAgY291bnRfZGVsZXRlICsgY291bnRfaW5zZXJ0KTtcbiAgICAgICAgICBwb2ludGVyID0gcG9pbnRlciAtIGNvdW50X2RlbGV0ZSAtIGNvdW50X2luc2VydDtcbiAgICAgICAgICBmb3IgKHZhciBqID0gYS5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICAgICAgZGlmZnMuc3BsaWNlKHBvaW50ZXIsIDAsIGFbal0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwb2ludGVyID0gcG9pbnRlciArIGEubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGNvdW50X2luc2VydCA9IDA7XG4gICAgICAgIGNvdW50X2RlbGV0ZSA9IDA7XG4gICAgICAgIHRleHRfZGVsZXRlID0gJyc7XG4gICAgICAgIHRleHRfaW5zZXJ0ID0gJyc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBwb2ludGVyKys7XG4gIH1cbiAgZGlmZnMucG9wKCk7ICAvLyBSZW1vdmUgdGhlIGR1bW15IGVudHJ5IGF0IHRoZSBlbmQuXG5cbiAgcmV0dXJuIGRpZmZzO1xufTtcblxuXG4vKipcbiAqIEZpbmQgdGhlICdtaWRkbGUgc25ha2UnIG9mIGEgZGlmZiwgc3BsaXQgdGhlIHByb2JsZW0gaW4gdHdvXG4gKiBhbmQgcmV0dXJuIHRoZSByZWN1cnNpdmVseSBjb25zdHJ1Y3RlZCBkaWZmLlxuICogU2VlIE15ZXJzIDE5ODYgcGFwZXI6IEFuIE8oTkQpIERpZmZlcmVuY2UgQWxnb3JpdGhtIGFuZCBJdHMgVmFyaWF0aW9ucy5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MSBPbGQgc3RyaW5nIHRvIGJlIGRpZmZlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MiBOZXcgc3RyaW5nIHRvIGJlIGRpZmZlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkZWFkbGluZSBUaW1lIGF0IHdoaWNoIHRvIGJhaWwgaWYgbm90IHlldCBjb21wbGV0ZS5cbiAqIEByZXR1cm4geyFBcnJheS48IWRpZmZfbWF0Y2hfcGF0Y2guRGlmZj59IEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICogQHByaXZhdGVcbiAqL1xuZGlmZl9tYXRjaF9wYXRjaC5wcm90b3R5cGUuZGlmZl9iaXNlY3RfID0gZnVuY3Rpb24odGV4dDEsIHRleHQyLCBkZWFkbGluZSkge1xuICAvLyBDYWNoZSB0aGUgdGV4dCBsZW5ndGhzIHRvIHByZXZlbnQgbXVsdGlwbGUgY2FsbHMuXG4gIHZhciB0ZXh0MV9sZW5ndGggPSB0ZXh0MS5sZW5ndGg7XG4gIHZhciB0ZXh0Ml9sZW5ndGggPSB0ZXh0Mi5sZW5ndGg7XG4gIHZhciBtYXhfZCA9IE1hdGguY2VpbCgodGV4dDFfbGVuZ3RoICsgdGV4dDJfbGVuZ3RoKSAvIDIpO1xuICB2YXIgdl9vZmZzZXQgPSBtYXhfZDtcbiAgdmFyIHZfbGVuZ3RoID0gMiAqIG1heF9kO1xuICB2YXIgdjEgPSBuZXcgQXJyYXkodl9sZW5ndGgpO1xuICB2YXIgdjIgPSBuZXcgQXJyYXkodl9sZW5ndGgpO1xuICAvLyBTZXR0aW5nIGFsbCBlbGVtZW50cyB0byAtMSBpcyBmYXN0ZXIgaW4gQ2hyb21lICYgRmlyZWZveCB0aGFuIG1peGluZ1xuICAvLyBpbnRlZ2VycyBhbmQgdW5kZWZpbmVkLlxuICBmb3IgKHZhciB4ID0gMDsgeCA8IHZfbGVuZ3RoOyB4KyspIHtcbiAgICB2MVt4XSA9IC0xO1xuICAgIHYyW3hdID0gLTE7XG4gIH1cbiAgdjFbdl9vZmZzZXQgKyAxXSA9IDA7XG4gIHYyW3Zfb2Zmc2V0ICsgMV0gPSAwO1xuICB2YXIgZGVsdGEgPSB0ZXh0MV9sZW5ndGggLSB0ZXh0Ml9sZW5ndGg7XG4gIC8vIElmIHRoZSB0b3RhbCBudW1iZXIgb2YgY2hhcmFjdGVycyBpcyBvZGQsIHRoZW4gdGhlIGZyb250IHBhdGggd2lsbCBjb2xsaWRlXG4gIC8vIHdpdGggdGhlIHJldmVyc2UgcGF0aC5cbiAgdmFyIGZyb250ID0gKGRlbHRhICUgMiAhPSAwKTtcbiAgLy8gT2Zmc2V0cyBmb3Igc3RhcnQgYW5kIGVuZCBvZiBrIGxvb3AuXG4gIC8vIFByZXZlbnRzIG1hcHBpbmcgb2Ygc3BhY2UgYmV5b25kIHRoZSBncmlkLlxuICB2YXIgazFzdGFydCA9IDA7XG4gIHZhciBrMWVuZCA9IDA7XG4gIHZhciBrMnN0YXJ0ID0gMDtcbiAgdmFyIGsyZW5kID0gMDtcbiAgZm9yICh2YXIgZCA9IDA7IGQgPCBtYXhfZDsgZCsrKSB7XG4gICAgLy8gQmFpbCBvdXQgaWYgZGVhZGxpbmUgaXMgcmVhY2hlZC5cbiAgICBpZiAoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSA+IGRlYWRsaW5lKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBXYWxrIHRoZSBmcm9udCBwYXRoIG9uZSBzdGVwLlxuICAgIGZvciAodmFyIGsxID0gLWQgKyBrMXN0YXJ0OyBrMSA8PSBkIC0gazFlbmQ7IGsxICs9IDIpIHtcbiAgICAgIHZhciBrMV9vZmZzZXQgPSB2X29mZnNldCArIGsxO1xuICAgICAgdmFyIHgxO1xuICAgICAgaWYgKGsxID09IC1kIHx8IGsxICE9IGQgJiYgdjFbazFfb2Zmc2V0IC0gMV0gPCB2MVtrMV9vZmZzZXQgKyAxXSkge1xuICAgICAgICB4MSA9IHYxW2sxX29mZnNldCArIDFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeDEgPSB2MVtrMV9vZmZzZXQgLSAxXSArIDE7XG4gICAgICB9XG4gICAgICB2YXIgeTEgPSB4MSAtIGsxO1xuICAgICAgd2hpbGUgKHgxIDwgdGV4dDFfbGVuZ3RoICYmIHkxIDwgdGV4dDJfbGVuZ3RoICYmXG4gICAgICAgICAgICAgdGV4dDEuY2hhckF0KHgxKSA9PSB0ZXh0Mi5jaGFyQXQoeTEpKSB7XG4gICAgICAgIHgxKys7XG4gICAgICAgIHkxKys7XG4gICAgICB9XG4gICAgICB2MVtrMV9vZmZzZXRdID0geDE7XG4gICAgICBpZiAoeDEgPiB0ZXh0MV9sZW5ndGgpIHtcbiAgICAgICAgLy8gUmFuIG9mZiB0aGUgcmlnaHQgb2YgdGhlIGdyYXBoLlxuICAgICAgICBrMWVuZCArPSAyO1xuICAgICAgfSBlbHNlIGlmICh5MSA+IHRleHQyX2xlbmd0aCkge1xuICAgICAgICAvLyBSYW4gb2ZmIHRoZSBib3R0b20gb2YgdGhlIGdyYXBoLlxuICAgICAgICBrMXN0YXJ0ICs9IDI7XG4gICAgICB9IGVsc2UgaWYgKGZyb250KSB7XG4gICAgICAgIHZhciBrMl9vZmZzZXQgPSB2X29mZnNldCArIGRlbHRhIC0gazE7XG4gICAgICAgIGlmIChrMl9vZmZzZXQgPj0gMCAmJiBrMl9vZmZzZXQgPCB2X2xlbmd0aCAmJiB2MltrMl9vZmZzZXRdICE9IC0xKSB7XG4gICAgICAgICAgLy8gTWlycm9yIHgyIG9udG8gdG9wLWxlZnQgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAgICAgICAgdmFyIHgyID0gdGV4dDFfbGVuZ3RoIC0gdjJbazJfb2Zmc2V0XTtcbiAgICAgICAgICBpZiAoeDEgPj0geDIpIHtcbiAgICAgICAgICAgIC8vIE92ZXJsYXAgZGV0ZWN0ZWQuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaWZmX2Jpc2VjdFNwbGl0Xyh0ZXh0MSwgdGV4dDIsIHgxLCB5MSwgZGVhZGxpbmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdhbGsgdGhlIHJldmVyc2UgcGF0aCBvbmUgc3RlcC5cbiAgICBmb3IgKHZhciBrMiA9IC1kICsgazJzdGFydDsgazIgPD0gZCAtIGsyZW5kOyBrMiArPSAyKSB7XG4gICAgICB2YXIgazJfb2Zmc2V0ID0gdl9vZmZzZXQgKyBrMjtcbiAgICAgIHZhciB4MjtcbiAgICAgIGlmIChrMiA9PSAtZCB8fCBrMiAhPSBkICYmIHYyW2syX29mZnNldCAtIDFdIDwgdjJbazJfb2Zmc2V0ICsgMV0pIHtcbiAgICAgICAgeDIgPSB2MltrMl9vZmZzZXQgKyAxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHgyID0gdjJbazJfb2Zmc2V0IC0gMV0gKyAxO1xuICAgICAgfVxuICAgICAgdmFyIHkyID0geDIgLSBrMjtcbiAgICAgIHdoaWxlICh4MiA8IHRleHQxX2xlbmd0aCAmJiB5MiA8IHRleHQyX2xlbmd0aCAmJlxuICAgICAgICAgICAgIHRleHQxLmNoYXJBdCh0ZXh0MV9sZW5ndGggLSB4MiAtIDEpID09XG4gICAgICAgICAgICAgdGV4dDIuY2hhckF0KHRleHQyX2xlbmd0aCAtIHkyIC0gMSkpIHtcbiAgICAgICAgeDIrKztcbiAgICAgICAgeTIrKztcbiAgICAgIH1cbiAgICAgIHYyW2syX29mZnNldF0gPSB4MjtcbiAgICAgIGlmICh4MiA+IHRleHQxX2xlbmd0aCkge1xuICAgICAgICAvLyBSYW4gb2ZmIHRoZSBsZWZ0IG9mIHRoZSBncmFwaC5cbiAgICAgICAgazJlbmQgKz0gMjtcbiAgICAgIH0gZWxzZSBpZiAoeTIgPiB0ZXh0Ml9sZW5ndGgpIHtcbiAgICAgICAgLy8gUmFuIG9mZiB0aGUgdG9wIG9mIHRoZSBncmFwaC5cbiAgICAgICAgazJzdGFydCArPSAyO1xuICAgICAgfSBlbHNlIGlmICghZnJvbnQpIHtcbiAgICAgICAgdmFyIGsxX29mZnNldCA9IHZfb2Zmc2V0ICsgZGVsdGEgLSBrMjtcbiAgICAgICAgaWYgKGsxX29mZnNldCA+PSAwICYmIGsxX29mZnNldCA8IHZfbGVuZ3RoICYmIHYxW2sxX29mZnNldF0gIT0gLTEpIHtcbiAgICAgICAgICB2YXIgeDEgPSB2MVtrMV9vZmZzZXRdO1xuICAgICAgICAgIHZhciB5MSA9IHZfb2Zmc2V0ICsgeDEgLSBrMV9vZmZzZXQ7XG4gICAgICAgICAgLy8gTWlycm9yIHgyIG9udG8gdG9wLWxlZnQgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAgICAgICAgeDIgPSB0ZXh0MV9sZW5ndGggLSB4MjtcbiAgICAgICAgICBpZiAoeDEgPj0geDIpIHtcbiAgICAgICAgICAgIC8vIE92ZXJsYXAgZGV0ZWN0ZWQuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaWZmX2Jpc2VjdFNwbGl0Xyh0ZXh0MSwgdGV4dDIsIHgxLCB5MSwgZGVhZGxpbmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBEaWZmIHRvb2sgdG9vIGxvbmcgYW5kIGhpdCB0aGUgZGVhZGxpbmUgb3JcbiAgLy8gbnVtYmVyIG9mIGRpZmZzIGVxdWFscyBudW1iZXIgb2YgY2hhcmFjdGVycywgbm8gY29tbW9uYWxpdHkgYXQgYWxsLlxuICByZXR1cm4gW1tESUZGX0RFTEVURSwgdGV4dDFdLCBbRElGRl9JTlNFUlQsIHRleHQyXV07XG59O1xuXG5cbi8qKlxuICogR2l2ZW4gdGhlIGxvY2F0aW9uIG9mIHRoZSAnbWlkZGxlIHNuYWtlJywgc3BsaXQgdGhlIGRpZmYgaW4gdHdvIHBhcnRzXG4gKiBhbmQgcmVjdXJzZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MSBPbGQgc3RyaW5nIHRvIGJlIGRpZmZlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MiBOZXcgc3RyaW5nIHRvIGJlIGRpZmZlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSB4IEluZGV4IG9mIHNwbGl0IHBvaW50IGluIHRleHQxLlxuICogQHBhcmFtIHtudW1iZXJ9IHkgSW5kZXggb2Ygc3BsaXQgcG9pbnQgaW4gdGV4dDIuXG4gKiBAcGFyYW0ge251bWJlcn0gZGVhZGxpbmUgVGltZSBhdCB3aGljaCB0byBiYWlsIGlmIG5vdCB5ZXQgY29tcGxldGUuXG4gKiBAcmV0dXJuIHshQXJyYXkuPCFkaWZmX21hdGNoX3BhdGNoLkRpZmY+fSBBcnJheSBvZiBkaWZmIHR1cGxlcy5cbiAqIEBwcml2YXRlXG4gKi9cbmRpZmZfbWF0Y2hfcGF0Y2gucHJvdG90eXBlLmRpZmZfYmlzZWN0U3BsaXRfID0gZnVuY3Rpb24odGV4dDEsIHRleHQyLCB4LCB5LFxuICAgIGRlYWRsaW5lKSB7XG4gIHZhciB0ZXh0MWEgPSB0ZXh0MS5zdWJzdHJpbmcoMCwgeCk7XG4gIHZhciB0ZXh0MmEgPSB0ZXh0Mi5zdWJzdHJpbmcoMCwgeSk7XG4gIHZhciB0ZXh0MWIgPSB0ZXh0MS5zdWJzdHJpbmcoeCk7XG4gIHZhciB0ZXh0MmIgPSB0ZXh0Mi5zdWJzdHJpbmcoeSk7XG5cbiAgLy8gQ29tcHV0ZSBib3RoIGRpZmZzIHNlcmlhbGx5LlxuICB2YXIgZGlmZnMgPSB0aGlzLmRpZmZfbWFpbih0ZXh0MWEsIHRleHQyYSwgZmFsc2UsIGRlYWRsaW5lKTtcbiAgdmFyIGRpZmZzYiA9IHRoaXMuZGlmZl9tYWluKHRleHQxYiwgdGV4dDJiLCBmYWxzZSwgZGVhZGxpbmUpO1xuXG4gIHJldHVybiBkaWZmcy5jb25jYXQoZGlmZnNiKTtcbn07XG5cblxuLyoqXG4gKiBTcGxpdCB0d28gdGV4dHMgaW50byBhbiBhcnJheSBvZiBzdHJpbmdzLiAgUmVkdWNlIHRoZSB0ZXh0cyB0byBhIHN0cmluZyBvZlxuICogaGFzaGVzIHdoZXJlIGVhY2ggVW5pY29kZSBjaGFyYWN0ZXIgcmVwcmVzZW50cyBvbmUgbGluZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MSBGaXJzdCBzdHJpbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDIgU2Vjb25kIHN0cmluZy5cbiAqIEByZXR1cm4geyFBcnJheS48c3RyaW5nfCFBcnJheS48c3RyaW5nPj59IFRocmVlIGVsZW1lbnQgQXJyYXksIGNvbnRhaW5pbmcgdGhlXG4gKiAgICAgZW5jb2RlZCB0ZXh0MSwgdGhlIGVuY29kZWQgdGV4dDIgYW5kIHRoZSBhcnJheSBvZiB1bmlxdWUgc3RyaW5ncy4gIFRoZVxuICogICAgIHplcm90aCBlbGVtZW50IG9mIHRoZSBhcnJheSBvZiB1bmlxdWUgc3RyaW5ncyBpcyBpbnRlbnRpb25hbGx5IGJsYW5rLlxuICogQHByaXZhdGVcbiAqL1xuZGlmZl9tYXRjaF9wYXRjaC5wcm90b3R5cGUuZGlmZl9saW5lc1RvQ2hhcnNfID0gZnVuY3Rpb24odGV4dDEsIHRleHQyKSB7XG4gIHZhciBsaW5lQXJyYXkgPSBbXTsgIC8vIGUuZy4gbGluZUFycmF5WzRdID09ICdIZWxsb1xcbidcbiAgdmFyIGxpbmVIYXNoID0ge307ICAgLy8gZS5nLiBsaW5lSGFzaFsnSGVsbG9cXG4nXSA9PSA0XG5cbiAgLy8gJ1xceDAwJyBpcyBhIHZhbGlkIGNoYXJhY3RlciwgYnV0IHZhcmlvdXMgZGVidWdnZXJzIGRvbid0IGxpa2UgaXQuXG4gIC8vIFNvIHdlJ2xsIGluc2VydCBhIGp1bmsgZW50cnkgdG8gYXZvaWQgZ2VuZXJhdGluZyBhIG51bGwgY2hhcmFjdGVyLlxuICBsaW5lQXJyYXlbMF0gPSAnJztcblxuICAvKipcbiAgICogU3BsaXQgYSB0ZXh0IGludG8gYW4gYXJyYXkgb2Ygc3RyaW5ncy4gIFJlZHVjZSB0aGUgdGV4dHMgdG8gYSBzdHJpbmcgb2ZcbiAgICogaGFzaGVzIHdoZXJlIGVhY2ggVW5pY29kZSBjaGFyYWN0ZXIgcmVwcmVzZW50cyBvbmUgbGluZS5cbiAgICogTW9kaWZpZXMgbGluZWFycmF5IGFuZCBsaW5laGFzaCB0aHJvdWdoIGJlaW5nIGEgY2xvc3VyZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgU3RyaW5nIHRvIGVuY29kZS5cbiAgICogQHJldHVybiB7c3RyaW5nfSBFbmNvZGVkIHN0cmluZy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIGRpZmZfbGluZXNUb0NoYXJzTXVuZ2VfKHRleHQpIHtcbiAgICB2YXIgY2hhcnMgPSAnJztcbiAgICAvLyBXYWxrIHRoZSB0ZXh0LCBwdWxsaW5nIG91dCBhIHN1YnN0cmluZyBmb3IgZWFjaCBsaW5lLlxuICAgIC8vIHRleHQuc3BsaXQoJ1xcbicpIHdvdWxkIHdvdWxkIHRlbXBvcmFyaWx5IGRvdWJsZSBvdXIgbWVtb3J5IGZvb3RwcmludC5cbiAgICAvLyBNb2RpZnlpbmcgdGV4dCB3b3VsZCBjcmVhdGUgbWFueSBsYXJnZSBzdHJpbmdzIHRvIGdhcmJhZ2UgY29sbGVjdC5cbiAgICB2YXIgbGluZVN0YXJ0ID0gMDtcbiAgICB2YXIgbGluZUVuZCA9IC0xO1xuICAgIC8vIEtlZXBpbmcgb3VyIG93biBsZW5ndGggdmFyaWFibGUgaXMgZmFzdGVyIHRoYW4gbG9va2luZyBpdCB1cC5cbiAgICB2YXIgbGluZUFycmF5TGVuZ3RoID0gbGluZUFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAobGluZUVuZCA8IHRleHQubGVuZ3RoIC0gMSkge1xuICAgICAgbGluZUVuZCA9IHRleHQuaW5kZXhPZignXFxuJywgbGluZVN0YXJ0KTtcbiAgICAgIGlmIChsaW5lRW5kID09IC0xKSB7XG4gICAgICAgIGxpbmVFbmQgPSB0ZXh0Lmxlbmd0aCAtIDE7XG4gICAgICB9XG4gICAgICB2YXIgbGluZSA9IHRleHQuc3Vic3RyaW5nKGxpbmVTdGFydCwgbGluZUVuZCArIDEpO1xuICAgICAgbGluZVN0YXJ0ID0gbGluZUVuZCArIDE7XG5cbiAgICAgIGlmIChsaW5lSGFzaC5oYXNPd25Qcm9wZXJ0eSA/IGxpbmVIYXNoLmhhc093blByb3BlcnR5KGxpbmUpIDpcbiAgICAgICAgICAobGluZUhhc2hbbGluZV0gIT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgY2hhcnMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShsaW5lSGFzaFtsaW5lXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGFycyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGxpbmVBcnJheUxlbmd0aCk7XG4gICAgICAgIGxpbmVIYXNoW2xpbmVdID0gbGluZUFycmF5TGVuZ3RoO1xuICAgICAgICBsaW5lQXJyYXlbbGluZUFycmF5TGVuZ3RoKytdID0gbGluZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNoYXJzO1xuICB9XG5cbiAgdmFyIGNoYXJzMSA9IGRpZmZfbGluZXNUb0NoYXJzTXVuZ2VfKHRleHQxKTtcbiAgdmFyIGNoYXJzMiA9IGRpZmZfbGluZXNUb0NoYXJzTXVuZ2VfKHRleHQyKTtcbiAgcmV0dXJuIFtjaGFyczEsIGNoYXJzMiwgbGluZUFycmF5XTtcbn07XG5cblxuLyoqXG4gKiBSZWh5ZHJhdGUgdGhlIHRleHQgaW4gYSBkaWZmIGZyb20gYSBzdHJpbmcgb2YgbGluZSBoYXNoZXMgdG8gcmVhbCBsaW5lcyBvZlxuICogdGV4dC5cbiAqIEBwYXJhbSB7IUFycmF5LjwhZGlmZl9tYXRjaF9wYXRjaC5EaWZmPn0gZGlmZnMgQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gKiBAcGFyYW0geyFBcnJheS48c3RyaW5nPn0gbGluZUFycmF5IEFycmF5IG9mIHVuaXF1ZSBzdHJpbmdzLlxuICogQHByaXZhdGVcbiAqL1xuZGlmZl9tYXRjaF9wYXRjaC5wcm90b3R5cGUuZGlmZl9jaGFyc1RvTGluZXNfID0gZnVuY3Rpb24oZGlmZnMsIGxpbmVBcnJheSkge1xuICBmb3IgKHZhciB4ID0gMDsgeCA8IGRpZmZzLmxlbmd0aDsgeCsrKSB7XG4gICAgdmFyIGNoYXJzID0gZGlmZnNbeF1bMV07XG4gICAgdmFyIHRleHQgPSBbXTtcbiAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGNoYXJzLmxlbmd0aDsgeSsrKSB7XG4gICAgICB0ZXh0W3ldID0gbGluZUFycmF5W2NoYXJzLmNoYXJDb2RlQXQoeSldO1xuICAgIH1cbiAgICBkaWZmc1t4XVsxXSA9IHRleHQuam9pbignJyk7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgdGhlIGNvbW1vbiBwcmVmaXggb2YgdHdvIHN0cmluZ3MuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDEgRmlyc3Qgc3RyaW5nLlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQyIFNlY29uZCBzdHJpbmcuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyBjb21tb24gdG8gdGhlIHN0YXJ0IG9mIGVhY2hcbiAqICAgICBzdHJpbmcuXG4gKi9cbmRpZmZfbWF0Y2hfcGF0Y2gucHJvdG90eXBlLmRpZmZfY29tbW9uUHJlZml4ID0gZnVuY3Rpb24odGV4dDEsIHRleHQyKSB7XG4gIC8vIFF1aWNrIGNoZWNrIGZvciBjb21tb24gbnVsbCBjYXNlcy5cbiAgaWYgKCF0ZXh0MSB8fCAhdGV4dDIgfHwgdGV4dDEuY2hhckF0KDApICE9IHRleHQyLmNoYXJBdCgwKSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIC8vIEJpbmFyeSBzZWFyY2guXG4gIC8vIFBlcmZvcm1hbmNlIGFuYWx5c2lzOiBodHRwOi8vbmVpbC5mcmFzZXIubmFtZS9uZXdzLzIwMDcvMTAvMDkvXG4gIHZhciBwb2ludGVybWluID0gMDtcbiAgdmFyIHBvaW50ZXJtYXggPSBNYXRoLm1pbih0ZXh0MS5sZW5ndGgsIHRleHQyLmxlbmd0aCk7XG4gIHZhciBwb2ludGVybWlkID0gcG9pbnRlcm1heDtcbiAgdmFyIHBvaW50ZXJzdGFydCA9IDA7XG4gIHdoaWxlIChwb2ludGVybWluIDwgcG9pbnRlcm1pZCkge1xuICAgIGlmICh0ZXh0MS5zdWJzdHJpbmcocG9pbnRlcnN0YXJ0LCBwb2ludGVybWlkKSA9PVxuICAgICAgICB0ZXh0Mi5zdWJzdHJpbmcocG9pbnRlcnN0YXJ0LCBwb2ludGVybWlkKSkge1xuICAgICAgcG9pbnRlcm1pbiA9IHBvaW50ZXJtaWQ7XG4gICAgICBwb2ludGVyc3RhcnQgPSBwb2ludGVybWluO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb2ludGVybWF4ID0gcG9pbnRlcm1pZDtcbiAgICB9XG4gICAgcG9pbnRlcm1pZCA9IE1hdGguZmxvb3IoKHBvaW50ZXJtYXggLSBwb2ludGVybWluKSAvIDIgKyBwb2ludGVybWluKTtcbiAgfVxuICByZXR1cm4gcG9pbnRlcm1pZDtcbn07XG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgdGhlIGNvbW1vbiBzdWZmaXggb2YgdHdvIHN0cmluZ3MuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDEgRmlyc3Qgc3RyaW5nLlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQyIFNlY29uZCBzdHJpbmcuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyBjb21tb24gdG8gdGhlIGVuZCBvZiBlYWNoIHN0cmluZy5cbiAqL1xuZGlmZl9tYXRjaF9wYXRjaC5wcm90b3R5cGUuZGlmZl9jb21tb25TdWZmaXggPSBmdW5jdGlvbih0ZXh0MSwgdGV4dDIpIHtcbiAgLy8gUXVpY2sgY2hlY2sgZm9yIGNvbW1vbiBudWxsIGNhc2VzLlxuICBpZiAoIXRleHQxIHx8ICF0ZXh0MiB8fFxuICAgICAgdGV4dDEuY2hhckF0KHRleHQxLmxlbmd0aCAtIDEpICE9IHRleHQyLmNoYXJBdCh0ZXh0Mi5sZW5ndGggLSAxKSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIC8vIEJpbmFyeSBzZWFyY2guXG4gIC8vIFBlcmZvcm1hbmNlIGFuYWx5c2lzOiBodHRwOi8vbmVpbC5mcmFzZXIubmFtZS9uZXdzLzIwMDcvMTAvMDkvXG4gIHZhciBwb2ludGVybWluID0gMDtcbiAgdmFyIHBvaW50ZXJtYXggPSBNYXRoLm1pbih0ZXh0MS5sZW5ndGgsIHRleHQyLmxlbmd0aCk7XG4gIHZhciBwb2ludGVybWlkID0gcG9pbnRlcm1heDtcbiAgdmFyIHBvaW50ZXJlbmQgPSAwO1xuICB3aGlsZSAocG9pbnRlcm1pbiA8IHBvaW50ZXJtaWQpIHtcbiAgICBpZiAodGV4dDEuc3Vic3RyaW5nKHRleHQxLmxlbmd0aCAtIHBvaW50ZXJtaWQsIHRleHQxLmxlbmd0aCAtIHBvaW50ZXJlbmQpID09XG4gICAgICAgIHRleHQyLnN1YnN0cmluZyh0ZXh0Mi5sZW5ndGggLSBwb2ludGVybWlkLCB0ZXh0Mi5sZW5ndGggLSBwb2ludGVyZW5kKSkge1xuICAgICAgcG9pbnRlcm1pbiA9IHBvaW50ZXJtaWQ7XG4gICAgICBwb2ludGVyZW5kID0gcG9pbnRlcm1pbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9pbnRlcm1heCA9IHBvaW50ZXJtaWQ7XG4gICAgfVxuICAgIHBvaW50ZXJtaWQgPSBNYXRoLmZsb29yKChwb2ludGVybWF4IC0gcG9pbnRlcm1pbikgLyAyICsgcG9pbnRlcm1pbik7XG4gIH1cbiAgcmV0dXJuIHBvaW50ZXJtaWQ7XG59O1xuXG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHRoZSBzdWZmaXggb2Ygb25lIHN0cmluZyBpcyB0aGUgcHJlZml4IG9mIGFub3RoZXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDEgRmlyc3Qgc3RyaW5nLlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQyIFNlY29uZCBzdHJpbmcuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyBjb21tb24gdG8gdGhlIGVuZCBvZiB0aGUgZmlyc3RcbiAqICAgICBzdHJpbmcgYW5kIHRoZSBzdGFydCBvZiB0aGUgc2Vjb25kIHN0cmluZy5cbiAqIEBwcml2YXRlXG4gKi9cbmRpZmZfbWF0Y2hfcGF0Y2gucHJvdG90eXBlLmRpZmZfY29tbW9uT3ZlcmxhcF8gPSBmdW5jdGlvbih0ZXh0MSwgdGV4dDIpIHtcbiAgLy8gQ2FjaGUgdGhlIHRleHQgbGVuZ3RocyB0byBwcmV2ZW50IG11bHRpcGxlIGNhbGxzLlxuICB2YXIgdGV4dDFfbGVuZ3RoID0gdGV4dDEubGVuZ3RoO1xuICB2YXIgdGV4dDJfbGVuZ3RoID0gdGV4dDIubGVuZ3RoO1xuICAvLyBFbGltaW5hdGUgdGhlIG51bGwgY2FzZS5cbiAgaWYgKHRleHQxX2xlbmd0aCA9PSAwIHx8IHRleHQyX2xlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgLy8gVHJ1bmNhdGUgdGhlIGxvbmdlciBzdHJpbmcuXG4gIGlmICh0ZXh0MV9sZW5ndGggPiB0ZXh0Ml9sZW5ndGgpIHtcbiAgICB0ZXh0MSA9IHRleHQxLnN1YnN0cmluZyh0ZXh0MV9sZW5ndGggLSB0ZXh0Ml9sZW5ndGgpO1xuICB9IGVsc2UgaWYgKHRleHQxX2xlbmd0aCA8IHRleHQyX2xlbmd0aCkge1xuICAgIHRleHQyID0gdGV4dDIuc3Vic3RyaW5nKDAsIHRleHQxX2xlbmd0aCk7XG4gIH1cbiAgdmFyIHRleHRfbGVuZ3RoID0gTWF0aC5taW4odGV4dDFfbGVuZ3RoLCB0ZXh0Ml9sZW5ndGgpO1xuICAvLyBRdWljayBjaGVjayBmb3IgdGhlIHdvcnN0IGNhc2UuXG4gIGlmICh0ZXh0MSA9PSB0ZXh0Mikge1xuICAgIHJldHVybiB0ZXh0X2xlbmd0aDtcbiAgfVxuXG4gIC8vIFN0YXJ0IGJ5IGxvb2tpbmcgZm9yIGEgc2luZ2xlIGNoYXJhY3RlciBtYXRjaFxuICAvLyBhbmQgaW5jcmVhc2UgbGVuZ3RoIHVudGlsIG5vIG1hdGNoIGlzIGZvdW5kLlxuICAvLyBQZXJmb3JtYW5jZSBhbmFseXNpczogaHR0cDovL25laWwuZnJhc2VyLm5hbWUvbmV3cy8yMDEwLzExLzA0L1xuICB2YXIgYmVzdCA9IDA7XG4gIHZhciBsZW5ndGggPSAxO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIHZhciBwYXR0ZXJuID0gdGV4dDEuc3Vic3RyaW5nKHRleHRfbGVuZ3RoIC0gbGVuZ3RoKTtcbiAgICB2YXIgZm91bmQgPSB0ZXh0Mi5pbmRleE9mKHBhdHRlcm4pO1xuICAgIGlmIChmb3VuZCA9PSAtMSkge1xuICAgICAgcmV0dXJuIGJlc3Q7XG4gICAgfVxuICAgIGxlbmd0aCArPSBmb3VuZDtcbiAgICBpZiAoZm91bmQgPT0gMCB8fCB0ZXh0MS5zdWJzdHJpbmcodGV4dF9sZW5ndGggLSBsZW5ndGgpID09XG4gICAgICAgIHRleHQyLnN1YnN0cmluZygwLCBsZW5ndGgpKSB7XG4gICAgICBiZXN0ID0gbGVuZ3RoO1xuICAgICAgbGVuZ3RoKys7XG4gICAgfVxuICB9XG59O1xuXG5cbi8qKlxuICogRG8gdGhlIHR3byB0ZXh0cyBzaGFyZSBhIHN1YnN0cmluZyB3aGljaCBpcyBhdCBsZWFzdCBoYWxmIHRoZSBsZW5ndGggb2YgdGhlXG4gKiBsb25nZXIgdGV4dD9cbiAqIFRoaXMgc3BlZWR1cCBjYW4gcHJvZHVjZSBub24tbWluaW1hbCBkaWZmcy5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MSBGaXJzdCBzdHJpbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDIgU2Vjb25kIHN0cmluZy5cbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fSBGaXZlIGVsZW1lbnQgQXJyYXksIGNvbnRhaW5pbmcgdGhlIHByZWZpeCBvZlxuICogICAgIHRleHQxLCB0aGUgc3VmZml4IG9mIHRleHQxLCB0aGUgcHJlZml4IG9mIHRleHQyLCB0aGUgc3VmZml4IG9mXG4gKiAgICAgdGV4dDIgYW5kIHRoZSBjb21tb24gbWlkZGxlLiAgT3IgbnVsbCBpZiB0aGVyZSB3YXMgbm8gbWF0Y2guXG4gKiBAcHJpdmF0ZVxuICovXG5kaWZmX21hdGNoX3BhdGNoLnByb3RvdHlwZS5kaWZmX2hhbGZNYXRjaF8gPSBmdW5jdGlvbih0ZXh0MSwgdGV4dDIpIHtcbiAgaWYgKHRoaXMuRGlmZl9UaW1lb3V0IDw9IDApIHtcbiAgICAvLyBEb24ndCByaXNrIHJldHVybmluZyBhIG5vbi1vcHRpbWFsIGRpZmYgaWYgd2UgaGF2ZSB1bmxpbWl0ZWQgdGltZS5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgbG9uZ3RleHQgPSB0ZXh0MS5sZW5ndGggPiB0ZXh0Mi5sZW5ndGggPyB0ZXh0MSA6IHRleHQyO1xuICB2YXIgc2hvcnR0ZXh0ID0gdGV4dDEubGVuZ3RoID4gdGV4dDIubGVuZ3RoID8gdGV4dDIgOiB0ZXh0MTtcbiAgaWYgKGxvbmd0ZXh0Lmxlbmd0aCA8IDQgfHwgc2hvcnR0ZXh0Lmxlbmd0aCAqIDIgPCBsb25ndGV4dC5sZW5ndGgpIHtcbiAgICByZXR1cm4gbnVsbDsgIC8vIFBvaW50bGVzcy5cbiAgfVxuICB2YXIgZG1wID0gdGhpczsgIC8vICd0aGlzJyBiZWNvbWVzICd3aW5kb3cnIGluIGEgY2xvc3VyZS5cblxuICAvKipcbiAgICogRG9lcyBhIHN1YnN0cmluZyBvZiBzaG9ydHRleHQgZXhpc3Qgd2l0aGluIGxvbmd0ZXh0IHN1Y2ggdGhhdCB0aGUgc3Vic3RyaW5nXG4gICAqIGlzIGF0IGxlYXN0IGhhbGYgdGhlIGxlbmd0aCBvZiBsb25ndGV4dD9cbiAgICogQ2xvc3VyZSwgYnV0IGRvZXMgbm90IHJlZmVyZW5jZSBhbnkgZXh0ZXJuYWwgdmFyaWFibGVzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9uZ3RleHQgTG9uZ2VyIHN0cmluZy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNob3J0dGV4dCBTaG9ydGVyIHN0cmluZy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGkgU3RhcnQgaW5kZXggb2YgcXVhcnRlciBsZW5ndGggc3Vic3RyaW5nIHdpdGhpbiBsb25ndGV4dC5cbiAgICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59IEZpdmUgZWxlbWVudCBBcnJheSwgY29udGFpbmluZyB0aGUgcHJlZml4IG9mXG4gICAqICAgICBsb25ndGV4dCwgdGhlIHN1ZmZpeCBvZiBsb25ndGV4dCwgdGhlIHByZWZpeCBvZiBzaG9ydHRleHQsIHRoZSBzdWZmaXhcbiAgICogICAgIG9mIHNob3J0dGV4dCBhbmQgdGhlIGNvbW1vbiBtaWRkbGUuICBPciBudWxsIGlmIHRoZXJlIHdhcyBubyBtYXRjaC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIGRpZmZfaGFsZk1hdGNoSV8obG9uZ3RleHQsIHNob3J0dGV4dCwgaSkge1xuICAgIC8vIFN0YXJ0IHdpdGggYSAxLzQgbGVuZ3RoIHN1YnN0cmluZyBhdCBwb3NpdGlvbiBpIGFzIGEgc2VlZC5cbiAgICB2YXIgc2VlZCA9IGxvbmd0ZXh0LnN1YnN0cmluZyhpLCBpICsgTWF0aC5mbG9vcihsb25ndGV4dC5sZW5ndGggLyA0KSk7XG4gICAgdmFyIGogPSAtMTtcbiAgICB2YXIgYmVzdF9jb21tb24gPSAnJztcbiAgICB2YXIgYmVzdF9sb25ndGV4dF9hLCBiZXN0X2xvbmd0ZXh0X2IsIGJlc3Rfc2hvcnR0ZXh0X2EsIGJlc3Rfc2hvcnR0ZXh0X2I7XG4gICAgd2hpbGUgKChqID0gc2hvcnR0ZXh0LmluZGV4T2Yoc2VlZCwgaiArIDEpKSAhPSAtMSkge1xuICAgICAgdmFyIHByZWZpeExlbmd0aCA9IGRtcC5kaWZmX2NvbW1vblByZWZpeChsb25ndGV4dC5zdWJzdHJpbmcoaSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3J0dGV4dC5zdWJzdHJpbmcoaikpO1xuICAgICAgdmFyIHN1ZmZpeExlbmd0aCA9IGRtcC5kaWZmX2NvbW1vblN1ZmZpeChsb25ndGV4dC5zdWJzdHJpbmcoMCwgaSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3J0dGV4dC5zdWJzdHJpbmcoMCwgaikpO1xuICAgICAgaWYgKGJlc3RfY29tbW9uLmxlbmd0aCA8IHN1ZmZpeExlbmd0aCArIHByZWZpeExlbmd0aCkge1xuICAgICAgICBiZXN0X2NvbW1vbiA9IHNob3J0dGV4dC5zdWJzdHJpbmcoaiAtIHN1ZmZpeExlbmd0aCwgaikgK1xuICAgICAgICAgICAgc2hvcnR0ZXh0LnN1YnN0cmluZyhqLCBqICsgcHJlZml4TGVuZ3RoKTtcbiAgICAgICAgYmVzdF9sb25ndGV4dF9hID0gbG9uZ3RleHQuc3Vic3RyaW5nKDAsIGkgLSBzdWZmaXhMZW5ndGgpO1xuICAgICAgICBiZXN0X2xvbmd0ZXh0X2IgPSBsb25ndGV4dC5zdWJzdHJpbmcoaSArIHByZWZpeExlbmd0aCk7XG4gICAgICAgIGJlc3Rfc2hvcnR0ZXh0X2EgPSBzaG9ydHRleHQuc3Vic3RyaW5nKDAsIGogLSBzdWZmaXhMZW5ndGgpO1xuICAgICAgICBiZXN0X3Nob3J0dGV4dF9iID0gc2hvcnR0ZXh0LnN1YnN0cmluZyhqICsgcHJlZml4TGVuZ3RoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJlc3RfY29tbW9uLmxlbmd0aCAqIDIgPj0gbG9uZ3RleHQubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW2Jlc3RfbG9uZ3RleHRfYSwgYmVzdF9sb25ndGV4dF9iLFxuICAgICAgICAgICAgICBiZXN0X3Nob3J0dGV4dF9hLCBiZXN0X3Nob3J0dGV4dF9iLCBiZXN0X2NvbW1vbl07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpcnN0IGNoZWNrIGlmIHRoZSBzZWNvbmQgcXVhcnRlciBpcyB0aGUgc2VlZCBmb3IgYSBoYWxmLW1hdGNoLlxuICB2YXIgaG0xID0gZGlmZl9oYWxmTWF0Y2hJXyhsb25ndGV4dCwgc2hvcnR0ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmNlaWwobG9uZ3RleHQubGVuZ3RoIC8gNCkpO1xuICAvLyBDaGVjayBhZ2FpbiBiYXNlZCBvbiB0aGUgdGhpcmQgcXVhcnRlci5cbiAgdmFyIGhtMiA9IGRpZmZfaGFsZk1hdGNoSV8obG9uZ3RleHQsIHNob3J0dGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5jZWlsKGxvbmd0ZXh0Lmxlbmd0aCAvIDIpKTtcbiAgdmFyIGhtO1xuICBpZiAoIWhtMSAmJiAhaG0yKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSBpZiAoIWhtMikge1xuICAgIGhtID0gaG0xO1xuICB9IGVsc2UgaWYgKCFobTEpIHtcbiAgICBobSA9IGhtMjtcbiAgfSBlbHNlIHtcbiAgICAvLyBCb3RoIG1hdGNoZWQuICBTZWxlY3QgdGhlIGxvbmdlc3QuXG4gICAgaG0gPSBobTFbNF0ubGVuZ3RoID4gaG0yWzRdLmxlbmd0aCA/IGhtMSA6IGhtMjtcbiAgfVxuXG4gIC8vIEEgaGFsZi1tYXRjaCB3YXMgZm91bmQsIHNvcnQgb3V0IHRoZSByZXR1cm4gZGF0YS5cbiAgdmFyIHRleHQxX2EsIHRleHQxX2IsIHRleHQyX2EsIHRleHQyX2I7XG4gIGlmICh0ZXh0MS5sZW5ndGggPiB0ZXh0Mi5sZW5ndGgpIHtcbiAgICB0ZXh0MV9hID0gaG1bMF07XG4gICAgdGV4dDFfYiA9IGhtWzFdO1xuICAgIHRleHQyX2EgPSBobVsyXTtcbiAgICB0ZXh0Ml9iID0gaG1bM107XG4gIH0gZWxzZSB7XG4gICAgdGV4dDJfYSA9IGhtWzBdO1xuICAgIHRleHQyX2IgPSBobVsxXTtcbiAgICB0ZXh0MV9hID0gaG1bMl07XG4gICAgdGV4dDFfYiA9IGhtWzNdO1xuICB9XG4gIHZhciBtaWRfY29tbW9uID0gaG1bNF07XG4gIHJldHVybiBbdGV4dDFfYSwgdGV4dDFfYiwgdGV4dDJfYSwgdGV4dDJfYiwgbWlkX2NvbW1vbl07XG59O1xuXG5cbi8qKlxuICogUmVkdWNlIHRoZSBudW1iZXIgb2YgZWRpdHMgYnkgZWxpbWluYXRpbmcgc2VtYW50aWNhbGx5IHRyaXZpYWwgZXF1YWxpdGllcy5cbiAqIEBwYXJhbSB7IUFycmF5LjwhZGlmZl9tYXRjaF9wYXRjaC5EaWZmPn0gZGlmZnMgQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gKi9cbmRpZmZfbWF0Y2hfcGF0Y2gucHJvdG90eXBlLmRpZmZfY2xlYW51cFNlbWFudGljID0gZnVuY3Rpb24oZGlmZnMpIHtcbiAgdmFyIGNoYW5nZXMgPSBmYWxzZTtcbiAgdmFyIGVxdWFsaXRpZXMgPSBbXTsgIC8vIFN0YWNrIG9mIGluZGljZXMgd2hlcmUgZXF1YWxpdGllcyBhcmUgZm91bmQuXG4gIHZhciBlcXVhbGl0aWVzTGVuZ3RoID0gMDsgIC8vIEtlZXBpbmcgb3VyIG93biBsZW5ndGggdmFyIGlzIGZhc3RlciBpbiBKUy5cbiAgLyoqIEB0eXBlIHs/c3RyaW5nfSAqL1xuICB2YXIgbGFzdGVxdWFsaXR5ID0gbnVsbDsgIC8vIEFsd2F5cyBlcXVhbCB0byBlcXVhbGl0aWVzW2VxdWFsaXRpZXNMZW5ndGgtMV1bMV1cbiAgdmFyIHBvaW50ZXIgPSAwOyAgLy8gSW5kZXggb2YgY3VycmVudCBwb3NpdGlvbi5cbiAgLy8gTnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCBjaGFuZ2VkIHByaW9yIHRvIHRoZSBlcXVhbGl0eS5cbiAgdmFyIGxlbmd0aF9pbnNlcnRpb25zMSA9IDA7XG4gIHZhciBsZW5ndGhfZGVsZXRpb25zMSA9IDA7XG4gIC8vIE51bWJlciBvZiBjaGFyYWN0ZXJzIHRoYXQgY2hhbmdlZCBhZnRlciB0aGUgZXF1YWxpdHkuXG4gIHZhciBsZW5ndGhfaW5zZXJ0aW9uczIgPSAwO1xuICB2YXIgbGVuZ3RoX2RlbGV0aW9uczIgPSAwO1xuICB3aGlsZSAocG9pbnRlciA8IGRpZmZzLmxlbmd0aCkge1xuICAgIGlmIChkaWZmc1twb2ludGVyXVswXSA9PSBESUZGX0VRVUFMKSB7ICAvLyBFcXVhbGl0eSBmb3VuZC5cbiAgICAgIGVxdWFsaXRpZXNbZXF1YWxpdGllc0xlbmd0aCsrXSA9IHBvaW50ZXI7XG4gICAgICBsZW5ndGhfaW5zZXJ0aW9uczEgPSBsZW5ndGhfaW5zZXJ0aW9uczI7XG4gICAgICBsZW5ndGhfZGVsZXRpb25zMSA9IGxlbmd0aF9kZWxldGlvbnMyO1xuICAgICAgbGVuZ3RoX2luc2VydGlvbnMyID0gMDtcbiAgICAgIGxlbmd0aF9kZWxldGlvbnMyID0gMDtcbiAgICAgIGxhc3RlcXVhbGl0eSA9IC8qKiBAdHlwZSB7c3RyaW5nfSAqLyhkaWZmc1twb2ludGVyXVsxXSk7XG4gICAgfSBlbHNlIHsgIC8vIEFuIGluc2VydGlvbiBvciBkZWxldGlvbi5cbiAgICAgIGlmIChkaWZmc1twb2ludGVyXVswXSA9PSBESUZGX0lOU0VSVCkge1xuICAgICAgICBsZW5ndGhfaW5zZXJ0aW9uczIgKz0gZGlmZnNbcG9pbnRlcl1bMV0ubGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVuZ3RoX2RlbGV0aW9uczIgKz0gZGlmZnNbcG9pbnRlcl1bMV0ubGVuZ3RoO1xuICAgICAgfVxuICAgICAgLy8gRWxpbWluYXRlIGFuIGVxdWFsaXR5IHRoYXQgaXMgc21hbGxlciBvciBlcXVhbCB0byB0aGUgZWRpdHMgb24gYm90aFxuICAgICAgLy8gc2lkZXMgb2YgaXQuXG4gICAgICBpZiAobGFzdGVxdWFsaXR5ICE9PSBudWxsICYmIChsYXN0ZXF1YWxpdHkubGVuZ3RoIDw9XG4gICAgICAgICAgTWF0aC5tYXgobGVuZ3RoX2luc2VydGlvbnMxLCBsZW5ndGhfZGVsZXRpb25zMSkpICYmXG4gICAgICAgICAgKGxhc3RlcXVhbGl0eS5sZW5ndGggPD0gTWF0aC5tYXgobGVuZ3RoX2luc2VydGlvbnMyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aF9kZWxldGlvbnMyKSkpIHtcbiAgICAgICAgLy8gRHVwbGljYXRlIHJlY29yZC5cbiAgICAgICAgZGlmZnMuc3BsaWNlKGVxdWFsaXRpZXNbZXF1YWxpdGllc0xlbmd0aCAtIDFdLCAwLFxuICAgICAgICAgICAgICAgICAgICAgW0RJRkZfREVMRVRFLCBsYXN0ZXF1YWxpdHldKTtcbiAgICAgICAgLy8gQ2hhbmdlIHNlY29uZCBjb3B5IHRvIGluc2VydC5cbiAgICAgICAgZGlmZnNbZXF1YWxpdGllc1tlcXVhbGl0aWVzTGVuZ3RoIC0gMV0gKyAxXVswXSA9IERJRkZfSU5TRVJUO1xuICAgICAgICAvLyBUaHJvdyBhd2F5IHRoZSBlcXVhbGl0eSB3ZSBqdXN0IGRlbGV0ZWQuXG4gICAgICAgIGVxdWFsaXRpZXNMZW5ndGgtLTtcbiAgICAgICAgLy8gVGhyb3cgYXdheSB0aGUgcHJldmlvdXMgZXF1YWxpdHkgKGl0IG5lZWRzIHRvIGJlIHJlZXZhbHVhdGVkKS5cbiAgICAgICAgZXF1YWxpdGllc0xlbmd0aC0tO1xuICAgICAgICBwb2ludGVyID0gZXF1YWxpdGllc0xlbmd0aCA+IDAgPyBlcXVhbGl0aWVzW2VxdWFsaXRpZXNMZW5ndGggLSAxXSA6IC0xO1xuICAgICAgICBsZW5ndGhfaW5zZXJ0aW9uczEgPSAwOyAgLy8gUmVzZXQgdGhlIGNvdW50ZXJzLlxuICAgICAgICBsZW5ndGhfZGVsZXRpb25zMSA9IDA7XG4gICAgICAgIGxlbmd0aF9pbnNlcnRpb25zMiA9IDA7XG4gICAgICAgIGxlbmd0aF9kZWxldGlvbnMyID0gMDtcbiAgICAgICAgbGFzdGVxdWFsaXR5ID0gbnVsbDtcbiAgICAgICAgY2hhbmdlcyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHBvaW50ZXIrKztcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgZGlmZi5cbiAgaWYgKGNoYW5nZXMpIHtcbiAgICB0aGlzLmRpZmZfY2xlYW51cE1lcmdlKGRpZmZzKTtcbiAgfVxuICB0aGlzLmRpZmZfY2xlYW51cFNlbWFudGljTG9zc2xlc3MoZGlmZnMpO1xuXG4gIC8vIEZpbmQgYW55IG92ZXJsYXBzIGJldHdlZW4gZGVsZXRpb25zIGFuZCBpbnNlcnRpb25zLlxuICAvLyBlLmc6IDxkZWw+YWJjeHh4PC9kZWw+PGlucz54eHhkZWY8L2lucz5cbiAgLy8gICAtPiA8ZGVsPmFiYzwvZGVsPnh4eDxpbnM+ZGVmPC9pbnM+XG4gIC8vIE9ubHkgZXh0cmFjdCBhbiBvdmVybGFwIGlmIGl0IGlzIGFzIGJpZyBhcyB0aGUgZWRpdCBhaGVhZCBvciBiZWhpbmQgaXQuXG4gIHBvaW50ZXIgPSAxO1xuICB3aGlsZSAocG9pbnRlciA8IGRpZmZzLmxlbmd0aCkge1xuICAgIGlmIChkaWZmc1twb2ludGVyIC0gMV1bMF0gPT0gRElGRl9ERUxFVEUgJiZcbiAgICAgICAgZGlmZnNbcG9pbnRlcl1bMF0gPT0gRElGRl9JTlNFUlQpIHtcbiAgICAgIHZhciBkZWxldGlvbiA9IC8qKiBAdHlwZSB7c3RyaW5nfSAqLyhkaWZmc1twb2ludGVyIC0gMV1bMV0pO1xuICAgICAgdmFyIGluc2VydGlvbiA9IC8qKiBAdHlwZSB7c3RyaW5nfSAqLyhkaWZmc1twb2ludGVyXVsxXSk7XG4gICAgICB2YXIgb3ZlcmxhcF9sZW5ndGggPSB0aGlzLmRpZmZfY29tbW9uT3ZlcmxhcF8oZGVsZXRpb24sIGluc2VydGlvbik7XG4gICAgICBpZiAob3ZlcmxhcF9sZW5ndGggPj0gZGVsZXRpb24ubGVuZ3RoIC8gMiB8fFxuICAgICAgICAgIG92ZXJsYXBfbGVuZ3RoID49IGluc2VydGlvbi5sZW5ndGggLyAyKSB7XG4gICAgICAgIC8vIE92ZXJsYXAgZm91bmQuICBJbnNlcnQgYW4gZXF1YWxpdHkgYW5kIHRyaW0gdGhlIHN1cnJvdW5kaW5nIGVkaXRzLlxuICAgICAgICBkaWZmcy5zcGxpY2UocG9pbnRlciwgMCxcbiAgICAgICAgICAgIFtESUZGX0VRVUFMLCBpbnNlcnRpb24uc3Vic3RyaW5nKDAsIG92ZXJsYXBfbGVuZ3RoKV0pO1xuICAgICAgICBkaWZmc1twb2ludGVyIC0gMV1bMV0gPVxuICAgICAgICAgICAgZGVsZXRpb24uc3Vic3RyaW5nKDAsIGRlbGV0aW9uLmxlbmd0aCAtIG92ZXJsYXBfbGVuZ3RoKTtcbiAgICAgICAgZGlmZnNbcG9pbnRlciArIDFdWzFdID0gaW5zZXJ0aW9uLnN1YnN0cmluZyhvdmVybGFwX2xlbmd0aCk7XG4gICAgICAgIHBvaW50ZXIrKztcbiAgICAgIH1cbiAgICAgIHBvaW50ZXIrKztcbiAgICB9XG4gICAgcG9pbnRlcisrO1xuICB9XG59O1xuXG5cbi8qKlxuICogTG9vayBmb3Igc2luZ2xlIGVkaXRzIHN1cnJvdW5kZWQgb24gYm90aCBzaWRlcyBieSBlcXVhbGl0aWVzXG4gKiB3aGljaCBjYW4gYmUgc2hpZnRlZCBzaWRld2F5cyB0byBhbGlnbiB0aGUgZWRpdCB0byBhIHdvcmQgYm91bmRhcnkuXG4gKiBlLmc6IFRoZSBjPGlucz5hdCBjPC9pbnM+YW1lLiAtPiBUaGUgPGlucz5jYXQgPC9pbnM+Y2FtZS5cbiAqIEBwYXJhbSB7IUFycmF5LjwhZGlmZl9tYXRjaF9wYXRjaC5EaWZmPn0gZGlmZnMgQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gKi9cbmRpZmZfbWF0Y2hfcGF0Y2gucHJvdG90eXBlLmRpZmZfY2xlYW51cFNlbWFudGljTG9zc2xlc3MgPSBmdW5jdGlvbihkaWZmcykge1xuICAvLyBEZWZpbmUgc29tZSByZWdleCBwYXR0ZXJucyBmb3IgbWF0Y2hpbmcgYm91bmRhcmllcy5cbiAgdmFyIHB1bmN0dWF0aW9uID0gL1teYS16QS1aMC05XS87XG4gIHZhciB3aGl0ZXNwYWNlID0gL1xccy87XG4gIHZhciBsaW5lYnJlYWsgPSAvW1xcclxcbl0vO1xuICB2YXIgYmxhbmtsaW5lRW5kID0gL1xcblxccj9cXG4kLztcbiAgdmFyIGJsYW5rbGluZVN0YXJ0ID0gL15cXHI/XFxuXFxyP1xcbi87XG5cbiAgLyoqXG4gICAqIEdpdmVuIHR3byBzdHJpbmdzLCBjb21wdXRlIGEgc2NvcmUgcmVwcmVzZW50aW5nIHdoZXRoZXIgdGhlIGludGVybmFsXG4gICAqIGJvdW5kYXJ5IGZhbGxzIG9uIGxvZ2ljYWwgYm91bmRhcmllcy5cbiAgICogU2NvcmVzIHJhbmdlIGZyb20gNSAoYmVzdCkgdG8gMCAod29yc3QpLlxuICAgKiBDbG9zdXJlLCBtYWtlcyByZWZlcmVuY2UgdG8gcmVnZXggcGF0dGVybnMgZGVmaW5lZCBhYm92ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9uZSBGaXJzdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0d28gU2Vjb25kIHN0cmluZy5cbiAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgc2NvcmUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBkaWZmX2NsZWFudXBTZW1hbnRpY1Njb3JlXyhvbmUsIHR3bykge1xuICAgIGlmICghb25lIHx8ICF0d28pIHtcbiAgICAgIC8vIEVkZ2VzIGFyZSB0aGUgYmVzdC5cbiAgICAgIHJldHVybiA1O1xuICAgIH1cblxuICAgIC8vIEVhY2ggcG9ydCBvZiB0aGlzIGZ1bmN0aW9uIGJlaGF2ZXMgc2xpZ2h0bHkgZGlmZmVyZW50bHkgZHVlIHRvXG4gICAgLy8gc3VidGxlIGRpZmZlcmVuY2VzIGluIGVhY2ggbGFuZ3VhZ2UncyBkZWZpbml0aW9uIG9mIHRoaW5ncyBsaWtlXG4gICAgLy8gJ3doaXRlc3BhY2UnLiAgU2luY2UgdGhpcyBmdW5jdGlvbidzIHB1cnBvc2UgaXMgbGFyZ2VseSBjb3NtZXRpYyxcbiAgICAvLyB0aGUgY2hvaWNlIGhhcyBiZWVuIG1hZGUgdG8gdXNlIGVhY2ggbGFuZ3VhZ2UncyBuYXRpdmUgZmVhdHVyZXNcbiAgICAvLyByYXRoZXIgdGhhbiBmb3JjZSB0b3RhbCBjb25mb3JtaXR5LlxuICAgIHZhciBzY29yZSA9IDA7XG4gICAgLy8gT25lIHBvaW50IGZvciBub24tYWxwaGFudW1lcmljLlxuICAgIGlmIChvbmUuY2hhckF0KG9uZS5sZW5ndGggLSAxKS5tYXRjaChwdW5jdHVhdGlvbikgfHxcbiAgICAgICAgdHdvLmNoYXJBdCgwKS5tYXRjaChwdW5jdHVhdGlvbikpIHtcbiAgICAgIHNjb3JlKys7XG4gICAgICAvLyBUd28gcG9pbnRzIGZvciB3aGl0ZXNwYWNlLlxuICAgICAgaWYgKG9uZS5jaGFyQXQob25lLmxlbmd0aCAtIDEpLm1hdGNoKHdoaXRlc3BhY2UpIHx8XG4gICAgICAgICAgdHdvLmNoYXJBdCgwKS5tYXRjaCh3aGl0ZXNwYWNlKSkge1xuICAgICAgICBzY29yZSsrO1xuICAgICAgICAvLyBUaHJlZSBwb2ludHMgZm9yIGxpbmUgYnJlYWtzLlxuICAgICAgICBpZiAob25lLmNoYXJBdChvbmUubGVuZ3RoIC0gMSkubWF0Y2gobGluZWJyZWFrKSB8fFxuICAgICAgICAgICAgdHdvLmNoYXJBdCgwKS5tYXRjaChsaW5lYnJlYWspKSB7XG4gICAgICAgICAgc2NvcmUrKztcbiAgICAgICAgICAvLyBGb3VyIHBvaW50cyBmb3IgYmxhbmsgbGluZXMuXG4gICAgICAgICAgaWYgKG9uZS5tYXRjaChibGFua2xpbmVFbmQpIHx8IHR3by5tYXRjaChibGFua2xpbmVTdGFydCkpIHtcbiAgICAgICAgICAgIHNjb3JlKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzY29yZTtcbiAgfVxuXG4gIHZhciBwb2ludGVyID0gMTtcbiAgLy8gSW50ZW50aW9uYWxseSBpZ25vcmUgdGhlIGZpcnN0IGFuZCBsYXN0IGVsZW1lbnQgKGRvbid0IG5lZWQgY2hlY2tpbmcpLlxuICB3aGlsZSAocG9pbnRlciA8IGRpZmZzLmxlbmd0aCAtIDEpIHtcbiAgICBpZiAoZGlmZnNbcG9pbnRlciAtIDFdWzBdID09IERJRkZfRVFVQUwgJiZcbiAgICAgICAgZGlmZnNbcG9pbnRlciArIDFdWzBdID09IERJRkZfRVFVQUwpIHtcbiAgICAgIC8vIFRoaXMgaXMgYSBzaW5nbGUgZWRpdCBzdXJyb3VuZGVkIGJ5IGVxdWFsaXRpZXMuXG4gICAgICB2YXIgZXF1YWxpdHkxID0gLyoqIEB0eXBlIHtzdHJpbmd9ICovKGRpZmZzW3BvaW50ZXIgLSAxXVsxXSk7XG4gICAgICB2YXIgZWRpdCA9IC8qKiBAdHlwZSB7c3RyaW5nfSAqLyhkaWZmc1twb2ludGVyXVsxXSk7XG4gICAgICB2YXIgZXF1YWxpdHkyID0gLyoqIEB0eXBlIHtzdHJpbmd9ICovKGRpZmZzW3BvaW50ZXIgKyAxXVsxXSk7XG5cbiAgICAgIC8vIEZpcnN0LCBzaGlmdCB0aGUgZWRpdCBhcyBmYXIgbGVmdCBhcyBwb3NzaWJsZS5cbiAgICAgIHZhciBjb21tb25PZmZzZXQgPSB0aGlzLmRpZmZfY29tbW9uU3VmZml4KGVxdWFsaXR5MSwgZWRpdCk7XG4gICAgICBpZiAoY29tbW9uT2Zmc2V0KSB7XG4gICAgICAgIHZhciBjb21tb25TdHJpbmcgPSBlZGl0LnN1YnN0cmluZyhlZGl0Lmxlbmd0aCAtIGNvbW1vbk9mZnNldCk7XG4gICAgICAgIGVxdWFsaXR5MSA9IGVxdWFsaXR5MS5zdWJzdHJpbmcoMCwgZXF1YWxpdHkxLmxlbmd0aCAtIGNvbW1vbk9mZnNldCk7XG4gICAgICAgIGVkaXQgPSBjb21tb25TdHJpbmcgKyBlZGl0LnN1YnN0cmluZygwLCBlZGl0Lmxlbmd0aCAtIGNvbW1vbk9mZnNldCk7XG4gICAgICAgIGVxdWFsaXR5MiA9IGNvbW1vblN0cmluZyArIGVxdWFsaXR5MjtcbiAgICAgIH1cblxuICAgICAgLy8gU2Vjb25kLCBzdGVwIGNoYXJhY3RlciBieSBjaGFyYWN0ZXIgcmlnaHQsIGxvb2tpbmcgZm9yIHRoZSBiZXN0IGZpdC5cbiAgICAgIHZhciBiZXN0RXF1YWxpdHkxID0gZXF1YWxpdHkxO1xuICAgICAgdmFyIGJlc3RFZGl0ID0gZWRpdDtcbiAgICAgIHZhciBiZXN0RXF1YWxpdHkyID0gZXF1YWxpdHkyO1xuICAgICAgdmFyIGJlc3RTY29yZSA9IGRpZmZfY2xlYW51cFNlbWFudGljU2NvcmVfKGVxdWFsaXR5MSwgZWRpdCkgK1xuICAgICAgICAgIGRpZmZfY2xlYW51cFNlbWFudGljU2NvcmVfKGVkaXQsIGVxdWFsaXR5Mik7XG4gICAgICB3aGlsZSAoZWRpdC5jaGFyQXQoMCkgPT09IGVxdWFsaXR5Mi5jaGFyQXQoMCkpIHtcbiAgICAgICAgZXF1YWxpdHkxICs9IGVkaXQuY2hhckF0KDApO1xuICAgICAgICBlZGl0ID0gZWRpdC5zdWJzdHJpbmcoMSkgKyBlcXVhbGl0eTIuY2hhckF0KDApO1xuICAgICAgICBlcXVhbGl0eTIgPSBlcXVhbGl0eTIuc3Vic3RyaW5nKDEpO1xuICAgICAgICB2YXIgc2NvcmUgPSBkaWZmX2NsZWFudXBTZW1hbnRpY1Njb3JlXyhlcXVhbGl0eTEsIGVkaXQpICtcbiAgICAgICAgICAgIGRpZmZfY2xlYW51cFNlbWFudGljU2NvcmVfKGVkaXQsIGVxdWFsaXR5Mik7XG4gICAgICAgIC8vIFRoZSA+PSBlbmNvdXJhZ2VzIHRyYWlsaW5nIHJhdGhlciB0aGFuIGxlYWRpbmcgd2hpdGVzcGFjZSBvbiBlZGl0cy5cbiAgICAgICAgaWYgKHNjb3JlID49IGJlc3RTY29yZSkge1xuICAgICAgICAgIGJlc3RTY29yZSA9IHNjb3JlO1xuICAgICAgICAgIGJlc3RFcXVhbGl0eTEgPSBlcXVhbGl0eTE7XG4gICAgICAgICAgYmVzdEVkaXQgPSBlZGl0O1xuICAgICAgICAgIGJlc3RFcXVhbGl0eTIgPSBlcXVhbGl0eTI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGRpZmZzW3BvaW50ZXIgLSAxXVsxXSAhPSBiZXN0RXF1YWxpdHkxKSB7XG4gICAgICAgIC8vIFdlIGhhdmUgYW4gaW1wcm92ZW1lbnQsIHNhdmUgaXQgYmFjayB0byB0aGUgZGlmZi5cbiAgICAgICAgaWYgKGJlc3RFcXVhbGl0eTEpIHtcbiAgICAgICAgICBkaWZmc1twb2ludGVyIC0gMV1bMV0gPSBiZXN0RXF1YWxpdHkxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpZmZzLnNwbGljZShwb2ludGVyIC0gMSwgMSk7XG4gICAgICAgICAgcG9pbnRlci0tO1xuICAgICAgICB9XG4gICAgICAgIGRpZmZzW3BvaW50ZXJdWzFdID0gYmVzdEVkaXQ7XG4gICAgICAgIGlmIChiZXN0RXF1YWxpdHkyKSB7XG4gICAgICAgICAgZGlmZnNbcG9pbnRlciArIDFdWzFdID0gYmVzdEVxdWFsaXR5MjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaWZmcy5zcGxpY2UocG9pbnRlciArIDEsIDEpO1xuICAgICAgICAgIHBvaW50ZXItLTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBwb2ludGVyKys7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBSZWR1Y2UgdGhlIG51bWJlciBvZiBlZGl0cyBieSBlbGltaW5hdGluZyBvcGVyYXRpb25hbGx5IHRyaXZpYWwgZXF1YWxpdGllcy5cbiAqIEBwYXJhbSB7IUFycmF5LjwhZGlmZl9tYXRjaF9wYXRjaC5EaWZmPn0gZGlmZnMgQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gKi9cbmRpZmZfbWF0Y2hfcGF0Y2gucHJvdG90eXBlLmRpZmZfY2xlYW51cEVmZmljaWVuY3kgPSBmdW5jdGlvbihkaWZmcykge1xuICB2YXIgY2hhbmdlcyA9IGZhbHNlO1xuICB2YXIgZXF1YWxpdGllcyA9IFtdOyAgLy8gU3RhY2sgb2YgaW5kaWNlcyB3aGVyZSBlcXVhbGl0aWVzIGFyZSBmb3VuZC5cbiAgdmFyIGVxdWFsaXRpZXNMZW5ndGggPSAwOyAgLy8gS2VlcGluZyBvdXIgb3duIGxlbmd0aCB2YXIgaXMgZmFzdGVyIGluIEpTLlxuICB2YXIgbGFzdGVxdWFsaXR5ID0gJyc7ICAvLyBBbHdheXMgZXF1YWwgdG8gZXF1YWxpdGllc1tlcXVhbGl0aWVzTGVuZ3RoLTFdWzFdXG4gIHZhciBwb2ludGVyID0gMDsgIC8vIEluZGV4IG9mIGN1cnJlbnQgcG9zaXRpb24uXG4gIC8vIElzIHRoZXJlIGFuIGluc2VydGlvbiBvcGVyYXRpb24gYmVmb3JlIHRoZSBsYXN0IGVxdWFsaXR5LlxuICB2YXIgcHJlX2lucyA9IGZhbHNlO1xuICAvLyBJcyB0aGVyZSBhIGRlbGV0aW9uIG9wZXJhdGlvbiBiZWZvcmUgdGhlIGxhc3QgZXF1YWxpdHkuXG4gIHZhciBwcmVfZGVsID0gZmFsc2U7XG4gIC8vIElzIHRoZXJlIGFuIGluc2VydGlvbiBvcGVyYXRpb24gYWZ0ZXIgdGhlIGxhc3QgZXF1YWxpdHkuXG4gIHZhciBwb3N0X2lucyA9IGZhbHNlO1xuICAvLyBJcyB0aGVyZSBhIGRlbGV0aW9uIG9wZXJhdGlvbiBhZnRlciB0aGUgbGFzdCBlcXVhbGl0eS5cbiAgdmFyIHBvc3RfZGVsID0gZmFsc2U7XG4gIHdoaWxlIChwb2ludGVyIDwgZGlmZnMubGVuZ3RoKSB7XG4gICAgaWYgKGRpZmZzW3BvaW50ZXJdWzBdID09IERJRkZfRVFVQUwpIHsgIC8vIEVxdWFsaXR5IGZvdW5kLlxuICAgICAgaWYgKGRpZmZzW3BvaW50ZXJdWzFdLmxlbmd0aCA8IHRoaXMuRGlmZl9FZGl0Q29zdCAmJlxuICAgICAgICAgIChwb3N0X2lucyB8fCBwb3N0X2RlbCkpIHtcbiAgICAgICAgLy8gQ2FuZGlkYXRlIGZvdW5kLlxuICAgICAgICBlcXVhbGl0aWVzW2VxdWFsaXRpZXNMZW5ndGgrK10gPSBwb2ludGVyO1xuICAgICAgICBwcmVfaW5zID0gcG9zdF9pbnM7XG4gICAgICAgIHByZV9kZWwgPSBwb3N0X2RlbDtcbiAgICAgICAgbGFzdGVxdWFsaXR5ID0gZGlmZnNbcG9pbnRlcl1bMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBOb3QgYSBjYW5kaWRhdGUsIGFuZCBjYW4gbmV2ZXIgYmVjb21lIG9uZS5cbiAgICAgICAgZXF1YWxpdGllc0xlbmd0aCA9IDA7XG4gICAgICAgIGxhc3RlcXVhbGl0eSA9ICcnO1xuICAgICAgfVxuICAgICAgcG9zdF9pbnMgPSBwb3N0X2RlbCA9IGZhbHNlO1xuICAgIH0gZWxzZSB7ICAvLyBBbiBpbnNlcnRpb24gb3IgZGVsZXRpb24uXG4gICAgICBpZiAoZGlmZnNbcG9pbnRlcl1bMF0gPT0gRElGRl9ERUxFVEUpIHtcbiAgICAgICAgcG9zdF9kZWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9zdF9pbnMgPSB0cnVlO1xuICAgICAgfVxuICAgICAgLypcbiAgICAgICAqIEZpdmUgdHlwZXMgdG8gYmUgc3BsaXQ6XG4gICAgICAgKiA8aW5zPkE8L2lucz48ZGVsPkI8L2RlbD5YWTxpbnM+QzwvaW5zPjxkZWw+RDwvZGVsPlxuICAgICAgICogPGlucz5BPC9pbnM+WDxpbnM+QzwvaW5zPjxkZWw+RDwvZGVsPlxuICAgICAgICogPGlucz5BPC9pbnM+PGRlbD5CPC9kZWw+WDxpbnM+QzwvaW5zPlxuICAgICAgICogPGlucz5BPC9kZWw+WDxpbnM+QzwvaW5zPjxkZWw+RDwvZGVsPlxuICAgICAgICogPGlucz5BPC9pbnM+PGRlbD5CPC9kZWw+WDxkZWw+QzwvZGVsPlxuICAgICAgICovXG4gICAgICBpZiAobGFzdGVxdWFsaXR5ICYmICgocHJlX2lucyAmJiBwcmVfZGVsICYmIHBvc3RfaW5zICYmIHBvc3RfZGVsKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKChsYXN0ZXF1YWxpdHkubGVuZ3RoIDwgdGhpcy5EaWZmX0VkaXRDb3N0IC8gMikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAocHJlX2lucyArIHByZV9kZWwgKyBwb3N0X2lucyArIHBvc3RfZGVsKSA9PSAzKSkpIHtcbiAgICAgICAgLy8gRHVwbGljYXRlIHJlY29yZC5cbiAgICAgICAgZGlmZnMuc3BsaWNlKGVxdWFsaXRpZXNbZXF1YWxpdGllc0xlbmd0aCAtIDFdLCAwLFxuICAgICAgICAgICAgICAgICAgICAgW0RJRkZfREVMRVRFLCBsYXN0ZXF1YWxpdHldKTtcbiAgICAgICAgLy8gQ2hhbmdlIHNlY29uZCBjb3B5IHRvIGluc2VydC5cbiAgICAgICAgZGlmZnNbZXF1YWxpdGllc1tlcXVhbGl0aWVzTGVuZ3RoIC0gMV0gKyAxXVswXSA9IERJRkZfSU5TRVJUO1xuICAgICAgICBlcXVhbGl0aWVzTGVuZ3RoLS07ICAvLyBUaHJvdyBhd2F5IHRoZSBlcXVhbGl0eSB3ZSBqdXN0IGRlbGV0ZWQ7XG4gICAgICAgIGxhc3RlcXVhbGl0eSA9ICcnO1xuICAgICAgICBpZiAocHJlX2lucyAmJiBwcmVfZGVsKSB7XG4gICAgICAgICAgLy8gTm8gY2hhbmdlcyBtYWRlIHdoaWNoIGNvdWxkIGFmZmVjdCBwcmV2aW91cyBlbnRyeSwga2VlcCBnb2luZy5cbiAgICAgICAgICBwb3N0X2lucyA9IHBvc3RfZGVsID0gdHJ1ZTtcbiAgICAgICAgICBlcXVhbGl0aWVzTGVuZ3RoID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlcXVhbGl0aWVzTGVuZ3RoLS07ICAvLyBUaHJvdyBhd2F5IHRoZSBwcmV2aW91cyBlcXVhbGl0eS5cbiAgICAgICAgICBwb2ludGVyID0gZXF1YWxpdGllc0xlbmd0aCA+IDAgP1xuICAgICAgICAgICAgICBlcXVhbGl0aWVzW2VxdWFsaXRpZXNMZW5ndGggLSAxXSA6IC0xO1xuICAgICAgICAgIHBvc3RfaW5zID0gcG9zdF9kZWwgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjaGFuZ2VzID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcG9pbnRlcisrO1xuICB9XG5cbiAgaWYgKGNoYW5nZXMpIHtcbiAgICB0aGlzLmRpZmZfY2xlYW51cE1lcmdlKGRpZmZzKTtcbiAgfVxufTtcblxuXG4vKipcbiAqIFJlb3JkZXIgYW5kIG1lcmdlIGxpa2UgZWRpdCBzZWN0aW9ucy4gIE1lcmdlIGVxdWFsaXRpZXMuXG4gKiBBbnkgZWRpdCBzZWN0aW9uIGNhbiBtb3ZlIGFzIGxvbmcgYXMgaXQgZG9lc24ndCBjcm9zcyBhbiBlcXVhbGl0eS5cbiAqIEBwYXJhbSB7IUFycmF5LjwhZGlmZl9tYXRjaF9wYXRjaC5EaWZmPn0gZGlmZnMgQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gKi9cbmRpZmZfbWF0Y2hfcGF0Y2gucHJvdG90eXBlLmRpZmZfY2xlYW51cE1lcmdlID0gZnVuY3Rpb24oZGlmZnMpIHtcbiAgZGlmZnMucHVzaChbRElGRl9FUVVBTCwgJyddKTsgIC8vIEFkZCBhIGR1bW15IGVudHJ5IGF0IHRoZSBlbmQuXG4gIHZhciBwb2ludGVyID0gMDtcbiAgdmFyIGNvdW50X2RlbGV0ZSA9IDA7XG4gIHZhciBjb3VudF9pbnNlcnQgPSAwO1xuICB2YXIgdGV4dF9kZWxldGUgPSAnJztcbiAgdmFyIHRleHRfaW5zZXJ0ID0gJyc7XG4gIHZhciBjb21tb25sZW5ndGg7XG4gIHdoaWxlIChwb2ludGVyIDwgZGlmZnMubGVuZ3RoKSB7XG4gICAgc3dpdGNoIChkaWZmc1twb2ludGVyXVswXSkge1xuICAgICAgY2FzZSBESUZGX0lOU0VSVDpcbiAgICAgICAgY291bnRfaW5zZXJ0Kys7XG4gICAgICAgIHRleHRfaW5zZXJ0ICs9IGRpZmZzW3BvaW50ZXJdWzFdO1xuICAgICAgICBwb2ludGVyKys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBESUZGX0RFTEVURTpcbiAgICAgICAgY291bnRfZGVsZXRlKys7XG4gICAgICAgIHRleHRfZGVsZXRlICs9IGRpZmZzW3BvaW50ZXJdWzFdO1xuICAgICAgICBwb2ludGVyKys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBESUZGX0VRVUFMOlxuICAgICAgICAvLyBVcG9uIHJlYWNoaW5nIGFuIGVxdWFsaXR5LCBjaGVjayBmb3IgcHJpb3IgcmVkdW5kYW5jaWVzLlxuICAgICAgICBpZiAoY291bnRfZGVsZXRlICsgY291bnRfaW5zZXJ0ID4gMSkge1xuICAgICAgICAgIGlmIChjb3VudF9kZWxldGUgIT09IDAgJiYgY291bnRfaW5zZXJ0ICE9PSAwKSB7XG4gICAgICAgICAgICAvLyBGYWN0b3Igb3V0IGFueSBjb21tb24gcHJlZml4aWVzLlxuICAgICAgICAgICAgY29tbW9ubGVuZ3RoID0gdGhpcy5kaWZmX2NvbW1vblByZWZpeCh0ZXh0X2luc2VydCwgdGV4dF9kZWxldGUpO1xuICAgICAgICAgICAgaWYgKGNvbW1vbmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICBpZiAoKHBvaW50ZXIgLSBjb3VudF9kZWxldGUgLSBjb3VudF9pbnNlcnQpID4gMCAmJlxuICAgICAgICAgICAgICAgICAgZGlmZnNbcG9pbnRlciAtIGNvdW50X2RlbGV0ZSAtIGNvdW50X2luc2VydCAtIDFdWzBdID09XG4gICAgICAgICAgICAgICAgICBESUZGX0VRVUFMKSB7XG4gICAgICAgICAgICAgICAgZGlmZnNbcG9pbnRlciAtIGNvdW50X2RlbGV0ZSAtIGNvdW50X2luc2VydCAtIDFdWzFdICs9XG4gICAgICAgICAgICAgICAgICAgIHRleHRfaW5zZXJ0LnN1YnN0cmluZygwLCBjb21tb25sZW5ndGgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRpZmZzLnNwbGljZSgwLCAwLCBbRElGRl9FUVVBTCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRfaW5zZXJ0LnN1YnN0cmluZygwLCBjb21tb25sZW5ndGgpXSk7XG4gICAgICAgICAgICAgICAgcG9pbnRlcisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRleHRfaW5zZXJ0ID0gdGV4dF9pbnNlcnQuc3Vic3RyaW5nKGNvbW1vbmxlbmd0aCk7XG4gICAgICAgICAgICAgIHRleHRfZGVsZXRlID0gdGV4dF9kZWxldGUuc3Vic3RyaW5nKGNvbW1vbmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBGYWN0b3Igb3V0IGFueSBjb21tb24gc3VmZml4aWVzLlxuICAgICAgICAgICAgY29tbW9ubGVuZ3RoID0gdGhpcy5kaWZmX2NvbW1vblN1ZmZpeCh0ZXh0X2luc2VydCwgdGV4dF9kZWxldGUpO1xuICAgICAgICAgICAgaWYgKGNvbW1vbmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICBkaWZmc1twb2ludGVyXVsxXSA9IHRleHRfaW5zZXJ0LnN1YnN0cmluZyh0ZXh0X2luc2VydC5sZW5ndGggLVxuICAgICAgICAgICAgICAgICAgY29tbW9ubGVuZ3RoKSArIGRpZmZzW3BvaW50ZXJdWzFdO1xuICAgICAgICAgICAgICB0ZXh0X2luc2VydCA9IHRleHRfaW5zZXJ0LnN1YnN0cmluZygwLCB0ZXh0X2luc2VydC5sZW5ndGggLVxuICAgICAgICAgICAgICAgICAgY29tbW9ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgdGV4dF9kZWxldGUgPSB0ZXh0X2RlbGV0ZS5zdWJzdHJpbmcoMCwgdGV4dF9kZWxldGUubGVuZ3RoIC1cbiAgICAgICAgICAgICAgICAgIGNvbW1vbmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIERlbGV0ZSB0aGUgb2ZmZW5kaW5nIHJlY29yZHMgYW5kIGFkZCB0aGUgbWVyZ2VkIG9uZXMuXG4gICAgICAgICAgaWYgKGNvdW50X2RlbGV0ZSA9PT0gMCkge1xuICAgICAgICAgICAgZGlmZnMuc3BsaWNlKHBvaW50ZXIgLSBjb3VudF9kZWxldGUgLSBjb3VudF9pbnNlcnQsXG4gICAgICAgICAgICAgICAgY291bnRfZGVsZXRlICsgY291bnRfaW5zZXJ0LCBbRElGRl9JTlNFUlQsIHRleHRfaW5zZXJ0XSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChjb3VudF9pbnNlcnQgPT09IDApIHtcbiAgICAgICAgICAgIGRpZmZzLnNwbGljZShwb2ludGVyIC0gY291bnRfZGVsZXRlIC0gY291bnRfaW5zZXJ0LFxuICAgICAgICAgICAgICAgIGNvdW50X2RlbGV0ZSArIGNvdW50X2luc2VydCwgW0RJRkZfREVMRVRFLCB0ZXh0X2RlbGV0ZV0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaWZmcy5zcGxpY2UocG9pbnRlciAtIGNvdW50X2RlbGV0ZSAtIGNvdW50X2luc2VydCxcbiAgICAgICAgICAgICAgICBjb3VudF9kZWxldGUgKyBjb3VudF9pbnNlcnQsIFtESUZGX0RFTEVURSwgdGV4dF9kZWxldGVdLFxuICAgICAgICAgICAgICAgIFtESUZGX0lOU0VSVCwgdGV4dF9pbnNlcnRdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcG9pbnRlciA9IHBvaW50ZXIgLSBjb3VudF9kZWxldGUgLSBjb3VudF9pbnNlcnQgK1xuICAgICAgICAgICAgICAgICAgICAoY291bnRfZGVsZXRlID8gMSA6IDApICsgKGNvdW50X2luc2VydCA/IDEgOiAwKSArIDE7XG4gICAgICAgIH0gZWxzZSBpZiAocG9pbnRlciAhPT0gMCAmJiBkaWZmc1twb2ludGVyIC0gMV1bMF0gPT0gRElGRl9FUVVBTCkge1xuICAgICAgICAgIC8vIE1lcmdlIHRoaXMgZXF1YWxpdHkgd2l0aCB0aGUgcHJldmlvdXMgb25lLlxuICAgICAgICAgIGRpZmZzW3BvaW50ZXIgLSAxXVsxXSArPSBkaWZmc1twb2ludGVyXVsxXTtcbiAgICAgICAgICBkaWZmcy5zcGxpY2UocG9pbnRlciwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcG9pbnRlcisrO1xuICAgICAgICB9XG4gICAgICAgIGNvdW50X2luc2VydCA9IDA7XG4gICAgICAgIGNvdW50X2RlbGV0ZSA9IDA7XG4gICAgICAgIHRleHRfZGVsZXRlID0gJyc7XG4gICAgICAgIHRleHRfaW5zZXJ0ID0gJyc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAoZGlmZnNbZGlmZnMubGVuZ3RoIC0gMV1bMV0gPT09ICcnKSB7XG4gICAgZGlmZnMucG9wKCk7ICAvLyBSZW1vdmUgdGhlIGR1bW15IGVudHJ5IGF0IHRoZSBlbmQuXG4gIH1cblxuICAvLyBTZWNvbmQgcGFzczogbG9vayBmb3Igc2luZ2xlIGVkaXRzIHN1cnJvdW5kZWQgb24gYm90aCBzaWRlcyBieSBlcXVhbGl0aWVzXG4gIC8vIHdoaWNoIGNhbiBiZSBzaGlmdGVkIHNpZGV3YXlzIHRvIGVsaW1pbmF0ZSBhbiBlcXVhbGl0eS5cbiAgLy8gZS5nOiBBPGlucz5CQTwvaW5zPkMgLT4gPGlucz5BQjwvaW5zPkFDXG4gIHZhciBjaGFuZ2VzID0gZmFsc2U7XG4gIHBvaW50ZXIgPSAxO1xuICAvLyBJbnRlbnRpb25hbGx5IGlnbm9yZSB0aGUgZmlyc3QgYW5kIGxhc3QgZWxlbWVudCAoZG9uJ3QgbmVlZCBjaGVja2luZykuXG4gIHdoaWxlIChwb2ludGVyIDwgZGlmZnMubGVuZ3RoIC0gMSkge1xuICAgIGlmIChkaWZmc1twb2ludGVyIC0gMV1bMF0gPT0gRElGRl9FUVVBTCAmJlxuICAgICAgICBkaWZmc1twb2ludGVyICsgMV1bMF0gPT0gRElGRl9FUVVBTCkge1xuICAgICAgLy8gVGhpcyBpcyBhIHNpbmdsZSBlZGl0IHN1cnJvdW5kZWQgYnkgZXF1YWxpdGllcy5cbiAgICAgIGlmIChkaWZmc1twb2ludGVyXVsxXS5zdWJzdHJpbmcoZGlmZnNbcG9pbnRlcl1bMV0ubGVuZ3RoIC1cbiAgICAgICAgICBkaWZmc1twb2ludGVyIC0gMV1bMV0ubGVuZ3RoKSA9PSBkaWZmc1twb2ludGVyIC0gMV1bMV0pIHtcbiAgICAgICAgLy8gU2hpZnQgdGhlIGVkaXQgb3ZlciB0aGUgcHJldmlvdXMgZXF1YWxpdHkuXG4gICAgICAgIGRpZmZzW3BvaW50ZXJdWzFdID0gZGlmZnNbcG9pbnRlciAtIDFdWzFdICtcbiAgICAgICAgICAgIGRpZmZzW3BvaW50ZXJdWzFdLnN1YnN0cmluZygwLCBkaWZmc1twb2ludGVyXVsxXS5sZW5ndGggLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZzW3BvaW50ZXIgLSAxXVsxXS5sZW5ndGgpO1xuICAgICAgICBkaWZmc1twb2ludGVyICsgMV1bMV0gPSBkaWZmc1twb2ludGVyIC0gMV1bMV0gKyBkaWZmc1twb2ludGVyICsgMV1bMV07XG4gICAgICAgIGRpZmZzLnNwbGljZShwb2ludGVyIC0gMSwgMSk7XG4gICAgICAgIGNoYW5nZXMgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChkaWZmc1twb2ludGVyXVsxXS5zdWJzdHJpbmcoMCwgZGlmZnNbcG9pbnRlciArIDFdWzFdLmxlbmd0aCkgPT1cbiAgICAgICAgICBkaWZmc1twb2ludGVyICsgMV1bMV0pIHtcbiAgICAgICAgLy8gU2hpZnQgdGhlIGVkaXQgb3ZlciB0aGUgbmV4dCBlcXVhbGl0eS5cbiAgICAgICAgZGlmZnNbcG9pbnRlciAtIDFdWzFdICs9IGRpZmZzW3BvaW50ZXIgKyAxXVsxXTtcbiAgICAgICAgZGlmZnNbcG9pbnRlcl1bMV0gPVxuICAgICAgICAgICAgZGlmZnNbcG9pbnRlcl1bMV0uc3Vic3RyaW5nKGRpZmZzW3BvaW50ZXIgKyAxXVsxXS5sZW5ndGgpICtcbiAgICAgICAgICAgIGRpZmZzW3BvaW50ZXIgKyAxXVsxXTtcbiAgICAgICAgZGlmZnMuc3BsaWNlKHBvaW50ZXIgKyAxLCAxKTtcbiAgICAgICAgY2hhbmdlcyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHBvaW50ZXIrKztcbiAgfVxuICAvLyBJZiBzaGlmdHMgd2VyZSBtYWRlLCB0aGUgZGlmZiBuZWVkcyByZW9yZGVyaW5nIGFuZCBhbm90aGVyIHNoaWZ0IHN3ZWVwLlxuICBpZiAoY2hhbmdlcykge1xuICAgIHRoaXMuZGlmZl9jbGVhbnVwTWVyZ2UoZGlmZnMpO1xuICB9XG59O1xuXG5cbi8qKlxuICogbG9jIGlzIGEgbG9jYXRpb24gaW4gdGV4dDEsIGNvbXB1dGUgYW5kIHJldHVybiB0aGUgZXF1aXZhbGVudCBsb2NhdGlvbiBpblxuICogdGV4dDIuXG4gKiBlLmcuICdUaGUgY2F0JyB2cyAnVGhlIGJpZyBjYXQnLCAxLT4xLCA1LT44XG4gKiBAcGFyYW0geyFBcnJheS48IWRpZmZfbWF0Y2hfcGF0Y2guRGlmZj59IGRpZmZzIEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICogQHBhcmFtIHtudW1iZXJ9IGxvYyBMb2NhdGlvbiB3aXRoaW4gdGV4dDEuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IExvY2F0aW9uIHdpdGhpbiB0ZXh0Mi5cbiAqL1xuZGlmZl9tYXRjaF9wYXRjaC5wcm90b3R5cGUuZGlmZl94SW5kZXggPSBmdW5jdGlvbihkaWZmcywgbG9jKSB7XG4gIHZhciBjaGFyczEgPSAwO1xuICB2YXIgY2hhcnMyID0gMDtcbiAgdmFyIGxhc3RfY2hhcnMxID0gMDtcbiAgdmFyIGxhc3RfY2hhcnMyID0gMDtcbiAgdmFyIHg7XG4gIGZvciAoeCA9IDA7IHggPCBkaWZmcy5sZW5ndGg7IHgrKykge1xuICAgIGlmIChkaWZmc1t4XVswXSAhPT0gRElGRl9JTlNFUlQpIHsgIC8vIEVxdWFsaXR5IG9yIGRlbGV0aW9uLlxuICAgICAgY2hhcnMxICs9IGRpZmZzW3hdWzFdLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKGRpZmZzW3hdWzBdICE9PSBESUZGX0RFTEVURSkgeyAgLy8gRXF1YWxpdHkgb3IgaW5zZXJ0aW9uLlxuICAgICAgY2hhcnMyICs9IGRpZmZzW3hdWzFdLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKGNoYXJzMSA+IGxvYykgeyAgLy8gT3ZlcnNob3QgdGhlIGxvY2F0aW9uLlxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxhc3RfY2hhcnMxID0gY2hhcnMxO1xuICAgIGxhc3RfY2hhcnMyID0gY2hhcnMyO1xuICB9XG4gIC8vIFdhcyB0aGUgbG9jYXRpb24gd2FzIGRlbGV0ZWQ/XG4gIGlmIChkaWZmcy5sZW5ndGggIT0geCAmJiBkaWZmc1t4XVswXSA9PT0gRElGRl9ERUxFVEUpIHtcbiAgICByZXR1cm4gbGFzdF9jaGFyczI7XG4gIH1cbiAgLy8gQWRkIHRoZSByZW1haW5pbmcgY2hhcmFjdGVyIGxlbmd0aC5cbiAgcmV0dXJuIGxhc3RfY2hhcnMyICsgKGxvYyAtIGxhc3RfY2hhcnMxKTtcbn07XG5cblxuLyoqXG4gKiBDb252ZXJ0IGEgZGlmZiBhcnJheSBpbnRvIGEgcHJldHR5IEhUTUwgcmVwb3J0LlxuICogQHBhcmFtIHshQXJyYXkuPCFkaWZmX21hdGNoX3BhdGNoLkRpZmY+fSBkaWZmcyBBcnJheSBvZiBkaWZmIHR1cGxlcy5cbiAqIEByZXR1cm4ge3N0cmluZ30gSFRNTCByZXByZXNlbnRhdGlvbi5cbiAqL1xuZGlmZl9tYXRjaF9wYXRjaC5wcm90b3R5cGUuZGlmZl9wcmV0dHlIdG1sID0gZnVuY3Rpb24oZGlmZnMpIHtcbiAgdmFyIGh0bWwgPSBbXTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcGF0dGVybl9hbXAgPSAvJi9nO1xuICB2YXIgcGF0dGVybl9sdCA9IC88L2c7XG4gIHZhciBwYXR0ZXJuX2d0ID0gLz4vZztcbiAgdmFyIHBhdHRlcm5fcGFyYSA9IC9cXG4vZztcbiAgZm9yICh2YXIgeCA9IDA7IHggPCBkaWZmcy5sZW5ndGg7IHgrKykge1xuICAgIHZhciBvcCA9IGRpZmZzW3hdWzBdOyAgICAvLyBPcGVyYXRpb24gKGluc2VydCwgZGVsZXRlLCBlcXVhbClcbiAgICB2YXIgZGF0YSA9IGRpZmZzW3hdWzFdOyAgLy8gVGV4dCBvZiBjaGFuZ2UuXG4gICAgdmFyIHRleHQgPSBkYXRhLnJlcGxhY2UocGF0dGVybl9hbXAsICcmYW1wOycpLnJlcGxhY2UocGF0dGVybl9sdCwgJyZsdDsnKVxuICAgICAgICAucmVwbGFjZShwYXR0ZXJuX2d0LCAnJmd0OycpLnJlcGxhY2UocGF0dGVybl9wYXJhLCAnJnBhcmE7PGJyPicpO1xuICAgIHN3aXRjaCAob3ApIHtcbiAgICAgIGNhc2UgRElGRl9JTlNFUlQ6XG4gICAgICAgIGh0bWxbeF0gPSAnPGlucyBzdHlsZT1cImJhY2tncm91bmQ6I2U2ZmZlNjtcIj4nICsgdGV4dCArICc8L2lucz4nO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRElGRl9ERUxFVEU6XG4gICAgICAgIGh0bWxbeF0gPSAnPGRlbCBzdHlsZT1cImJhY2tncm91bmQ6I2ZmZTZlNjtcIj4nICsgdGV4dCArICc8L2RlbD4nO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRElGRl9FUVVBTDpcbiAgICAgICAgaHRtbFt4XSA9ICc8c3Bhbj4nICsgdGV4dCArICc8L3NwYW4+JztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChvcCAhPT0gRElGRl9ERUxFVEUpIHtcbiAgICAgIGkgKz0gZGF0YS5sZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiBodG1sLmpvaW4oJycpO1xufTtcblxuXG4vKipcbiAqIENvbXB1dGUgYW5kIHJldHVybiB0aGUgc291cmNlIHRleHQgKGFsbCBlcXVhbGl0aWVzIGFuZCBkZWxldGlvbnMpLlxuICogQHBhcmFtIHshQXJyYXkuPCFkaWZmX21hdGNoX3BhdGNoLkRpZmY+fSBkaWZmcyBBcnJheSBvZiBkaWZmIHR1cGxlcy5cbiAqIEByZXR1cm4ge3N0cmluZ30gU291cmNlIHRleHQuXG4gKi9cbmRpZmZfbWF0Y2hfcGF0Y2gucHJvdG90eXBlLmRpZmZfdGV4dDEgPSBmdW5jdGlvbihkaWZmcykge1xuICB2YXIgdGV4dCA9IFtdO1xuICBmb3IgKHZhciB4ID0gMDsgeCA8IGRpZmZzLmxlbmd0aDsgeCsrKSB7XG4gICAgaWYgKGRpZmZzW3hdWzBdICE9PSBESUZGX0lOU0VSVCkge1xuICAgICAgdGV4dFt4XSA9IGRpZmZzW3hdWzFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGV4dC5qb2luKCcnKTtcbn07XG5cblxuLyoqXG4gKiBDb21wdXRlIGFuZCByZXR1cm4gdGhlIGRlc3RpbmF0aW9uIHRleHQgKGFsbCBlcXVhbGl0aWVzIGFuZCBpbnNlcnRpb25zKS5cbiAqIEBwYXJhbSB7IUFycmF5LjwhZGlmZl9tYXRjaF9wYXRjaC5EaWZmPn0gZGlmZnMgQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IERlc3RpbmF0aW9uIHRleHQuXG4gKi9cbmRpZmZfbWF0Y2hfcGF0Y2gucHJvdG90eXBlLmRpZmZfdGV4dDIgPSBmdW5jdGlvbihkaWZmcykge1xuICB2YXIgdGV4dCA9IFtdO1xuICBmb3IgKHZhciB4ID0gMDsgeCA8IGRpZmZzLmxlbmd0aDsgeCsrKSB7XG4gICAgaWYgKGRpZmZzW3hdWzBdICE9PSBESUZGX0RFTEVURSkge1xuICAgICAgdGV4dFt4XSA9IGRpZmZzW3hdWzFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGV4dC5qb2luKCcnKTtcbn07XG5cblxuLyoqXG4gKiBDb21wdXRlIHRoZSBMZXZlbnNodGVpbiBkaXN0YW5jZTsgdGhlIG51bWJlciBvZiBpbnNlcnRlZCwgZGVsZXRlZCBvclxuICogc3Vic3RpdHV0ZWQgY2hhcmFjdGVycy5cbiAqIEBwYXJhbSB7IUFycmF5LjwhZGlmZl9tYXRjaF9wYXRjaC5EaWZmPn0gZGlmZnMgQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IE51bWJlciBvZiBjaGFuZ2VzLlxuICovXG5kaWZmX21hdGNoX3BhdGNoLnByb3RvdHlwZS5kaWZmX2xldmVuc2h0ZWluID0gZnVuY3Rpb24oZGlmZnMpIHtcbiAgdmFyIGxldmVuc2h0ZWluID0gMDtcbiAgdmFyIGluc2VydGlvbnMgPSAwO1xuICB2YXIgZGVsZXRpb25zID0gMDtcbiAgZm9yICh2YXIgeCA9IDA7IHggPCBkaWZmcy5sZW5ndGg7IHgrKykge1xuICAgIHZhciBvcCA9IGRpZmZzW3hdWzBdO1xuICAgIHZhciBkYXRhID0gZGlmZnNbeF1bMV07XG4gICAgc3dpdGNoIChvcCkge1xuICAgICAgY2FzZSBESUZGX0lOU0VSVDpcbiAgICAgICAgaW5zZXJ0aW9ucyArPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERJRkZfREVMRVRFOlxuICAgICAgICBkZWxldGlvbnMgKz0gZGF0YS5sZW5ndGg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBESUZGX0VRVUFMOlxuICAgICAgICAvLyBBIGRlbGV0aW9uIGFuZCBhbiBpbnNlcnRpb24gaXMgb25lIHN1YnN0aXR1dGlvbi5cbiAgICAgICAgbGV2ZW5zaHRlaW4gKz0gTWF0aC5tYXgoaW5zZXJ0aW9ucywgZGVsZXRpb25zKTtcbiAgICAgICAgaW5zZXJ0aW9ucyA9IDA7XG4gICAgICAgIGRlbGV0aW9ucyA9IDA7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBsZXZlbnNodGVpbiArPSBNYXRoLm1heChpbnNlcnRpb25zLCBkZWxldGlvbnMpO1xuICByZXR1cm4gbGV2ZW5zaHRlaW47XG59O1xuXG5cbi8qKlxuICogQ3J1c2ggdGhlIGRpZmYgaW50byBhbiBlbmNvZGVkIHN0cmluZyB3aGljaCBkZXNjcmliZXMgdGhlIG9wZXJhdGlvbnNcbiAqIHJlcXVpcmVkIHRvIHRyYW5zZm9ybSB0ZXh0MSBpbnRvIHRleHQyLlxuICogRS5nLiA9M1xcdC0yXFx0K2luZyAgLT4gS2VlcCAzIGNoYXJzLCBkZWxldGUgMiBjaGFycywgaW5zZXJ0ICdpbmcnLlxuICogT3BlcmF0aW9ucyBhcmUgdGFiLXNlcGFyYXRlZC4gIEluc2VydGVkIHRleHQgaXMgZXNjYXBlZCB1c2luZyAleHggbm90YXRpb24uXG4gKiBAcGFyYW0geyFBcnJheS48IWRpZmZfbWF0Y2hfcGF0Y2guRGlmZj59IGRpZmZzIEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICogQHJldHVybiB7c3RyaW5nfSBEZWx0YSB0ZXh0LlxuICovXG5kaWZmX21hdGNoX3BhdGNoLnByb3RvdHlwZS5kaWZmX3RvRGVsdGEgPSBmdW5jdGlvbihkaWZmcykge1xuICB2YXIgdGV4dCA9IFtdO1xuICBmb3IgKHZhciB4ID0gMDsgeCA8IGRpZmZzLmxlbmd0aDsgeCsrKSB7XG4gICAgc3dpdGNoIChkaWZmc1t4XVswXSkge1xuICAgICAgY2FzZSBESUZGX0lOU0VSVDpcbiAgICAgICAgdGV4dFt4XSA9ICcrJyArIGVuY29kZVVSSShkaWZmc1t4XVsxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBESUZGX0RFTEVURTpcbiAgICAgICAgdGV4dFt4XSA9ICctJyArIGRpZmZzW3hdWzFdLmxlbmd0aDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERJRkZfRVFVQUw6XG4gICAgICAgIHRleHRbeF0gPSAnPScgKyBkaWZmc1t4XVsxXS5sZW5ndGg7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGV4dC5qb2luKCdcXHQnKS5yZXBsYWNlKC8lMjAvZywgJyAnKTtcbn07XG5cblxuLyoqXG4gKiBHaXZlbiB0aGUgb3JpZ2luYWwgdGV4dDEsIGFuZCBhbiBlbmNvZGVkIHN0cmluZyB3aGljaCBkZXNjcmliZXMgdGhlXG4gKiBvcGVyYXRpb25zIHJlcXVpcmVkIHRvIHRyYW5zZm9ybSB0ZXh0MSBpbnRvIHRleHQyLCBjb21wdXRlIHRoZSBmdWxsIGRpZmYuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDEgU291cmNlIHN0cmluZyBmb3IgdGhlIGRpZmYuXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVsdGEgRGVsdGEgdGV4dC5cbiAqIEByZXR1cm4geyFBcnJheS48IWRpZmZfbWF0Y2hfcGF0Y2guRGlmZj59IEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICogQHRocm93cyB7IUVycm9yfSBJZiBpbnZhbGlkIGlucHV0LlxuICovXG5kaWZmX21hdGNoX3BhdGNoLnByb3RvdHlwZS5kaWZmX2Zyb21EZWx0YSA9IGZ1bmN0aW9uKHRleHQxLCBkZWx0YSkge1xuICB2YXIgZGlmZnMgPSBbXTtcbiAgdmFyIGRpZmZzTGVuZ3RoID0gMDsgIC8vIEtlZXBpbmcgb3VyIG93biBsZW5ndGggdmFyIGlzIGZhc3RlciBpbiBKUy5cbiAgdmFyIHBvaW50ZXIgPSAwOyAgLy8gQ3Vyc29yIGluIHRleHQxXG4gIHZhciB0b2tlbnMgPSBkZWx0YS5zcGxpdCgvXFx0L2cpO1xuICBmb3IgKHZhciB4ID0gMDsgeCA8IHRva2Vucy5sZW5ndGg7IHgrKykge1xuICAgIC8vIEVhY2ggdG9rZW4gYmVnaW5zIHdpdGggYSBvbmUgY2hhcmFjdGVyIHBhcmFtZXRlciB3aGljaCBzcGVjaWZpZXMgdGhlXG4gICAgLy8gb3BlcmF0aW9uIG9mIHRoaXMgdG9rZW4gKGRlbGV0ZSwgaW5zZXJ0LCBlcXVhbGl0eSkuXG4gICAgdmFyIHBhcmFtID0gdG9rZW5zW3hdLnN1YnN0cmluZygxKTtcbiAgICBzd2l0Y2ggKHRva2Vuc1t4XS5jaGFyQXQoMCkpIHtcbiAgICAgIGNhc2UgJysnOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIGRpZmZzW2RpZmZzTGVuZ3RoKytdID0gW0RJRkZfSU5TRVJULCBkZWNvZGVVUkkocGFyYW0pXTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAvLyBNYWxmb3JtZWQgVVJJIHNlcXVlbmNlLlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSWxsZWdhbCBlc2NhcGUgaW4gZGlmZl9mcm9tRGVsdGE6ICcgKyBwYXJhbSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICctJzpcbiAgICAgICAgLy8gRmFsbCB0aHJvdWdoLlxuICAgICAgY2FzZSAnPSc6XG4gICAgICAgIHZhciBuID0gcGFyc2VJbnQocGFyYW0sIDEwKTtcbiAgICAgICAgaWYgKGlzTmFOKG4pIHx8IG4gPCAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG51bWJlciBpbiBkaWZmX2Zyb21EZWx0YTogJyArIHBhcmFtKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGV4dCA9IHRleHQxLnN1YnN0cmluZyhwb2ludGVyLCBwb2ludGVyICs9IG4pO1xuICAgICAgICBpZiAodG9rZW5zW3hdLmNoYXJBdCgwKSA9PSAnPScpIHtcbiAgICAgICAgICBkaWZmc1tkaWZmc0xlbmd0aCsrXSA9IFtESUZGX0VRVUFMLCB0ZXh0XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaWZmc1tkaWZmc0xlbmd0aCsrXSA9IFtESUZGX0RFTEVURSwgdGV4dF07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBCbGFuayB0b2tlbnMgYXJlIG9rIChmcm9tIGEgdHJhaWxpbmcgXFx0KS5cbiAgICAgICAgLy8gQW55dGhpbmcgZWxzZSBpcyBhbiBlcnJvci5cbiAgICAgICAgaWYgKHRva2Vuc1t4XSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBkaWZmIG9wZXJhdGlvbiBpbiBkaWZmX2Zyb21EZWx0YTogJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRva2Vuc1t4XSk7XG4gICAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHBvaW50ZXIgIT0gdGV4dDEubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdEZWx0YSBsZW5ndGggKCcgKyBwb2ludGVyICtcbiAgICAgICAgJykgZG9lcyBub3QgZXF1YWwgc291cmNlIHRleHQgbGVuZ3RoICgnICsgdGV4dDEubGVuZ3RoICsgJykuJyk7XG4gIH1cbiAgcmV0dXJuIGRpZmZzO1xufTtcblxuXG4vLyAgTUFUQ0ggRlVOQ1RJT05TXG5cblxuLyoqXG4gKiBMb2NhdGUgdGhlIGJlc3QgaW5zdGFuY2Ugb2YgJ3BhdHRlcm4nIGluICd0ZXh0JyBuZWFyICdsb2MnLlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gc2VhcmNoLlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm4gVGhlIHBhdHRlcm4gdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsb2MgVGhlIGxvY2F0aW9uIHRvIHNlYXJjaCBhcm91bmQuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IEJlc3QgbWF0Y2ggaW5kZXggb3IgLTEuXG4gKi9cbmRpZmZfbWF0Y2hfcGF0Y2gucHJvdG90eXBlLm1hdGNoX21haW4gPSBmdW5jdGlvbih0ZXh0LCBwYXR0ZXJuLCBsb2MpIHtcbiAgLy8gQ2hlY2sgZm9yIG51bGwgaW5wdXRzLlxuICBpZiAodGV4dCA9PSBudWxsIHx8IHBhdHRlcm4gPT0gbnVsbCB8fCBsb2MgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTnVsbCBpbnB1dC4gKG1hdGNoX21haW4pJyk7XG4gIH1cblxuICBsb2MgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihsb2MsIHRleHQubGVuZ3RoKSk7XG4gIGlmICh0ZXh0ID09IHBhdHRlcm4pIHtcbiAgICAvLyBTaG9ydGN1dCAocG90ZW50aWFsbHkgbm90IGd1YXJhbnRlZWQgYnkgdGhlIGFsZ29yaXRobSlcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmICghdGV4dC5sZW5ndGgpIHtcbiAgICAvLyBOb3RoaW5nIHRvIG1hdGNoLlxuICAgIHJldHVybiAtMTtcbiAgfSBlbHNlIGlmICh0ZXh0LnN1YnN0cmluZyhsb2MsIGxvYyArIHBhdHRlcm4ubGVuZ3RoKSA9PSBwYXR0ZXJuKSB7XG4gICAgLy8gUGVyZmVjdCBtYXRjaCBhdCB0aGUgcGVyZmVjdCBzcG90ISAgKEluY2x1ZGVzIGNhc2Ugb2YgbnVsbCBwYXR0ZXJuKVxuICAgIHJldHVybiBsb2M7XG4gIH0gZWxzZSB7XG4gICAgLy8gRG8gYSBmdXp6eSBjb21wYXJlLlxuICAgIHJldHVybiB0aGlzLm1hdGNoX2JpdGFwXyh0ZXh0LCBwYXR0ZXJuLCBsb2MpO1xuICB9XG59O1xuXG5cbi8qKlxuICogTG9jYXRlIHRoZSBiZXN0IGluc3RhbmNlIG9mICdwYXR0ZXJuJyBpbiAndGV4dCcgbmVhciAnbG9jJyB1c2luZyB0aGVcbiAqIEJpdGFwIGFsZ29yaXRobS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXR0ZXJuIFRoZSBwYXR0ZXJuIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gbG9jIFRoZSBsb2NhdGlvbiB0byBzZWFyY2ggYXJvdW5kLlxuICogQHJldHVybiB7bnVtYmVyfSBCZXN0IG1hdGNoIGluZGV4IG9yIC0xLlxuICogQHByaXZhdGVcbiAqL1xuZGlmZl9tYXRjaF9wYXRjaC5wcm90b3R5cGUubWF0Y2hfYml0YXBfID0gZnVuY3Rpb24odGV4dCwgcGF0dGVybiwgbG9jKSB7XG4gIGlmIChwYXR0ZXJuLmxlbmd0aCA+IHRoaXMuTWF0Y2hfTWF4Qml0cykge1xuICAgIHRocm93IG5ldyBFcnJvcignUGF0dGVybiB0b28gbG9uZyBmb3IgdGhpcyBicm93c2VyLicpO1xuICB9XG5cbiAgLy8gSW5pdGlhbGlzZSB0aGUgYWxwaGFiZXQuXG4gIHZhciBzID0gdGhpcy5tYXRjaF9hbHBoYWJldF8ocGF0dGVybik7XG5cbiAgdmFyIGRtcCA9IHRoaXM7ICAvLyAndGhpcycgYmVjb21lcyAnd2luZG93JyBpbiBhIGNsb3N1cmUuXG5cbiAgLyoqXG4gICAqIENvbXB1dGUgYW5kIHJldHVybiB0aGUgc2NvcmUgZm9yIGEgbWF0Y2ggd2l0aCBlIGVycm9ycyBhbmQgeCBsb2NhdGlvbi5cbiAgICogQWNjZXNzZXMgbG9jIGFuZCBwYXR0ZXJuIHRocm91Z2ggYmVpbmcgYSBjbG9zdXJlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gZSBOdW1iZXIgb2YgZXJyb3JzIGluIG1hdGNoLlxuICAgKiBAcGFyYW0ge251bWJlcn0geCBMb2NhdGlvbiBvZiBtYXRjaC5cbiAgICogQHJldHVybiB7bnVtYmVyfSBPdmVyYWxsIHNjb3JlIGZvciBtYXRjaCAoMC4wID0gZ29vZCwgMS4wID0gYmFkKS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIG1hdGNoX2JpdGFwU2NvcmVfKGUsIHgpIHtcbiAgICB2YXIgYWNjdXJhY3kgPSBlIC8gcGF0dGVybi5sZW5ndGg7XG4gICAgdmFyIHByb3hpbWl0eSA9IE1hdGguYWJzKGxvYyAtIHgpO1xuICAgIGlmICghZG1wLk1hdGNoX0Rpc3RhbmNlKSB7XG4gICAgICAvLyBEb2RnZSBkaXZpZGUgYnkgemVybyBlcnJvci5cbiAgICAgIHJldHVybiBwcm94aW1pdHkgPyAxLjAgOiBhY2N1cmFjeTtcbiAgICB9XG4gICAgcmV0dXJuIGFjY3VyYWN5ICsgKHByb3hpbWl0eSAvIGRtcC5NYXRjaF9EaXN0YW5jZSk7XG4gIH1cblxuICAvLyBIaWdoZXN0IHNjb3JlIGJleW9uZCB3aGljaCB3ZSBnaXZlIHVwLlxuICB2YXIgc2NvcmVfdGhyZXNob2xkID0gdGhpcy5NYXRjaF9UaHJlc2hvbGQ7XG4gIC8vIElzIHRoZXJlIGEgbmVhcmJ5IGV4YWN0IG1hdGNoPyAoc3BlZWR1cClcbiAgdmFyIGJlc3RfbG9jID0gdGV4dC5pbmRleE9mKHBhdHRlcm4sIGxvYyk7XG4gIGlmIChiZXN0X2xvYyAhPSAtMSkge1xuICAgIHNjb3JlX3RocmVzaG9sZCA9IE1hdGgubWluKG1hdGNoX2JpdGFwU2NvcmVfKDAsIGJlc3RfbG9jKSwgc2NvcmVfdGhyZXNob2xkKTtcbiAgICAvLyBXaGF0IGFib3V0IGluIHRoZSBvdGhlciBkaXJlY3Rpb24/IChzcGVlZHVwKVxuICAgIGJlc3RfbG9jID0gdGV4dC5sYXN0SW5kZXhPZihwYXR0ZXJuLCBsb2MgKyBwYXR0ZXJuLmxlbmd0aCk7XG4gICAgaWYgKGJlc3RfbG9jICE9IC0xKSB7XG4gICAgICBzY29yZV90aHJlc2hvbGQgPVxuICAgICAgICAgIE1hdGgubWluKG1hdGNoX2JpdGFwU2NvcmVfKDAsIGJlc3RfbG9jKSwgc2NvcmVfdGhyZXNob2xkKTtcbiAgICB9XG4gIH1cblxuICAvLyBJbml0aWFsaXNlIHRoZSBiaXQgYXJyYXlzLlxuICB2YXIgbWF0Y2htYXNrID0gMSA8PCAocGF0dGVybi5sZW5ndGggLSAxKTtcbiAgYmVzdF9sb2MgPSAtMTtcblxuICB2YXIgYmluX21pbiwgYmluX21pZDtcbiAgdmFyIGJpbl9tYXggPSBwYXR0ZXJuLmxlbmd0aCArIHRleHQubGVuZ3RoO1xuICB2YXIgbGFzdF9yZDtcbiAgZm9yICh2YXIgZCA9IDA7IGQgPCBwYXR0ZXJuLmxlbmd0aDsgZCsrKSB7XG4gICAgLy8gU2NhbiBmb3IgdGhlIGJlc3QgbWF0Y2g7IGVhY2ggaXRlcmF0aW9uIGFsbG93cyBmb3Igb25lIG1vcmUgZXJyb3IuXG4gICAgLy8gUnVuIGEgYmluYXJ5IHNlYXJjaCB0byBkZXRlcm1pbmUgaG93IGZhciBmcm9tICdsb2MnIHdlIGNhbiBzdHJheSBhdCB0aGlzXG4gICAgLy8gZXJyb3IgbGV2ZWwuXG4gICAgYmluX21pbiA9IDA7XG4gICAgYmluX21pZCA9IGJpbl9tYXg7XG4gICAgd2hpbGUgKGJpbl9taW4gPCBiaW5fbWlkKSB7XG4gICAgICBpZiAobWF0Y2hfYml0YXBTY29yZV8oZCwgbG9jICsgYmluX21pZCkgPD0gc2NvcmVfdGhyZXNob2xkKSB7XG4gICAgICAgIGJpbl9taW4gPSBiaW5fbWlkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmluX21heCA9IGJpbl9taWQ7XG4gICAgICB9XG4gICAgICBiaW5fbWlkID0gTWF0aC5mbG9vcigoYmluX21heCAtIGJpbl9taW4pIC8gMiArIGJpbl9taW4pO1xuICAgIH1cbiAgICAvLyBVc2UgdGhlIHJlc3VsdCBmcm9tIHRoaXMgaXRlcmF0aW9uIGFzIHRoZSBtYXhpbXVtIGZvciB0aGUgbmV4dC5cbiAgICBiaW5fbWF4ID0gYmluX21pZDtcbiAgICB2YXIgc3RhcnQgPSBNYXRoLm1heCgxLCBsb2MgLSBiaW5fbWlkICsgMSk7XG4gICAgdmFyIGZpbmlzaCA9IE1hdGgubWluKGxvYyArIGJpbl9taWQsIHRleHQubGVuZ3RoKSArIHBhdHRlcm4ubGVuZ3RoO1xuXG4gICAgdmFyIHJkID0gQXJyYXkoZmluaXNoICsgMik7XG4gICAgcmRbZmluaXNoICsgMV0gPSAoMSA8PCBkKSAtIDE7XG4gICAgZm9yICh2YXIgaiA9IGZpbmlzaDsgaiA+PSBzdGFydDsgai0tKSB7XG4gICAgICAvLyBUaGUgYWxwaGFiZXQgKHMpIGlzIGEgc3BhcnNlIGhhc2gsIHNvIHRoZSBmb2xsb3dpbmcgbGluZSBnZW5lcmF0ZXNcbiAgICAgIC8vIHdhcm5pbmdzLlxuICAgICAgdmFyIGNoYXJNYXRjaCA9IHNbdGV4dC5jaGFyQXQoaiAtIDEpXTtcbiAgICAgIGlmIChkID09PSAwKSB7ICAvLyBGaXJzdCBwYXNzOiBleGFjdCBtYXRjaC5cbiAgICAgICAgcmRbal0gPSAoKHJkW2ogKyAxXSA8PCAxKSB8IDEpICYgY2hhck1hdGNoO1xuICAgICAgfSBlbHNlIHsgIC8vIFN1YnNlcXVlbnQgcGFzc2VzOiBmdXp6eSBtYXRjaC5cbiAgICAgICAgcmRbal0gPSAoKHJkW2ogKyAxXSA8PCAxKSB8IDEpICYgY2hhck1hdGNoIHxcbiAgICAgICAgICAgICAgICAoKChsYXN0X3JkW2ogKyAxXSB8IGxhc3RfcmRbal0pIDw8IDEpIHwgMSkgfFxuICAgICAgICAgICAgICAgIGxhc3RfcmRbaiArIDFdO1xuICAgICAgfVxuICAgICAgaWYgKHJkW2pdICYgbWF0Y2htYXNrKSB7XG4gICAgICAgIHZhciBzY29yZSA9IG1hdGNoX2JpdGFwU2NvcmVfKGQsIGogLSAxKTtcbiAgICAgICAgLy8gVGhpcyBtYXRjaCB3aWxsIGFsbW9zdCBjZXJ0YWlubHkgYmUgYmV0dGVyIHRoYW4gYW55IGV4aXN0aW5nIG1hdGNoLlxuICAgICAgICAvLyBCdXQgY2hlY2sgYW55d2F5LlxuICAgICAgICBpZiAoc2NvcmUgPD0gc2NvcmVfdGhyZXNob2xkKSB7XG4gICAgICAgICAgLy8gVG9sZCB5b3Ugc28uXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkID0gc2NvcmU7XG4gICAgICAgICAgYmVzdF9sb2MgPSBqIC0gMTtcbiAgICAgICAgICBpZiAoYmVzdF9sb2MgPiBsb2MpIHtcbiAgICAgICAgICAgIC8vIFdoZW4gcGFzc2luZyBsb2MsIGRvbid0IGV4Y2VlZCBvdXIgY3VycmVudCBkaXN0YW5jZSBmcm9tIGxvYy5cbiAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5tYXgoMSwgMiAqIGxvYyAtIGJlc3RfbG9jKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWxyZWFkeSBwYXNzZWQgbG9jLCBkb3duaGlsbCBmcm9tIGhlcmUgb24gaW4uXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gTm8gaG9wZSBmb3IgYSAoYmV0dGVyKSBtYXRjaCBhdCBncmVhdGVyIGVycm9yIGxldmVscy5cbiAgICBpZiAobWF0Y2hfYml0YXBTY29yZV8oZCArIDEsIGxvYykgPiBzY29yZV90aHJlc2hvbGQpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBsYXN0X3JkID0gcmQ7XG4gIH1cbiAgcmV0dXJuIGJlc3RfbG9jO1xufTtcblxuXG4vKipcbiAqIEluaXRpYWxpc2UgdGhlIGFscGhhYmV0IGZvciB0aGUgQml0YXAgYWxnb3JpdGhtLlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm4gVGhlIHRleHQgdG8gZW5jb2RlLlxuICogQHJldHVybiB7IU9iamVjdH0gSGFzaCBvZiBjaGFyYWN0ZXIgbG9jYXRpb25zLlxuICogQHByaXZhdGVcbiAqL1xuZGlmZl9tYXRjaF9wYXRjaC5wcm90b3R5cGUubWF0Y2hfYWxwaGFiZXRfID0gZnVuY3Rpb24ocGF0dGVybikge1xuICB2YXIgcyA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdHRlcm4ubGVuZ3RoOyBpKyspIHtcbiAgICBzW3BhdHRlcm4uY2hhckF0KGkpXSA9IDA7XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXR0ZXJuLmxlbmd0aDsgaSsrKSB7XG4gICAgc1twYXR0ZXJuLmNoYXJBdChpKV0gfD0gMSA8PCAocGF0dGVybi5sZW5ndGggLSBpIC0gMSk7XG4gIH1cbiAgcmV0dXJuIHM7XG59O1xuXG5cbi8vICBQQVRDSCBGVU5DVElPTlNcblxuXG4vKipcbiAqIEluY3JlYXNlIHRoZSBjb250ZXh0IHVudGlsIGl0IGlzIHVuaXF1ZSxcbiAqIGJ1dCBkb24ndCBsZXQgdGhlIHBhdHRlcm4gZXhwYW5kIGJleW9uZCBNYXRjaF9NYXhCaXRzLlxuICogQHBhcmFtIHshZGlmZl9tYXRjaF9wYXRjaC5wYXRjaF9vYmp9IHBhdGNoIFRoZSBwYXRjaCB0byBncm93LlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgU291cmNlIHRleHQuXG4gKiBAcHJpdmF0ZVxuICovXG5kaWZmX21hdGNoX3BhdGNoLnByb3RvdHlwZS5wYXRjaF9hZGRDb250ZXh0XyA9IGZ1bmN0aW9uKHBhdGNoLCB0ZXh0KSB7XG4gIGlmICh0ZXh0Lmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gdGV4dC5zdWJzdHJpbmcocGF0Y2guc3RhcnQyLCBwYXRjaC5zdGFydDIgKyBwYXRjaC5sZW5ndGgxKTtcbiAgdmFyIHBhZGRpbmcgPSAwO1xuXG4gIC8vIExvb2sgZm9yIHRoZSBmaXJzdCBhbmQgbGFzdCBtYXRjaGVzIG9mIHBhdHRlcm4gaW4gdGV4dC4gIElmIHR3byBkaWZmZXJlbnRcbiAgLy8gbWF0Y2hlcyBhcmUgZm91bmQsIGluY3JlYXNlIHRoZSBwYXR0ZXJuIGxlbmd0aC5cbiAgd2hpbGUgKHRleHQuaW5kZXhPZihwYXR0ZXJuKSAhPSB0ZXh0Lmxhc3RJbmRleE9mKHBhdHRlcm4pICYmXG4gICAgICAgICBwYXR0ZXJuLmxlbmd0aCA8IHRoaXMuTWF0Y2hfTWF4Qml0cyAtIHRoaXMuUGF0Y2hfTWFyZ2luIC1cbiAgICAgICAgIHRoaXMuUGF0Y2hfTWFyZ2luKSB7XG4gICAgcGFkZGluZyArPSB0aGlzLlBhdGNoX01hcmdpbjtcbiAgICBwYXR0ZXJuID0gdGV4dC5zdWJzdHJpbmcocGF0Y2guc3RhcnQyIC0gcGFkZGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0Y2guc3RhcnQyICsgcGF0Y2gubGVuZ3RoMSArIHBhZGRpbmcpO1xuICB9XG4gIC8vIEFkZCBvbmUgY2h1bmsgZm9yIGdvb2QgbHVjay5cbiAgcGFkZGluZyArPSB0aGlzLlBhdGNoX01hcmdpbjtcblxuICAvLyBBZGQgdGhlIHByZWZpeC5cbiAgdmFyIHByZWZpeCA9IHRleHQuc3Vic3RyaW5nKHBhdGNoLnN0YXJ0MiAtIHBhZGRpbmcsIHBhdGNoLnN0YXJ0Mik7XG4gIGlmIChwcmVmaXgpIHtcbiAgICBwYXRjaC5kaWZmcy51bnNoaWZ0KFtESUZGX0VRVUFMLCBwcmVmaXhdKTtcbiAgfVxuICAvLyBBZGQgdGhlIHN1ZmZpeC5cbiAgdmFyIHN1ZmZpeCA9IHRleHQuc3Vic3RyaW5nKHBhdGNoLnN0YXJ0MiArIHBhdGNoLmxlbmd0aDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC5zdGFydDIgKyBwYXRjaC5sZW5ndGgxICsgcGFkZGluZyk7XG4gIGlmIChzdWZmaXgpIHtcbiAgICBwYXRjaC5kaWZmcy5wdXNoKFtESUZGX0VRVUFMLCBzdWZmaXhdKTtcbiAgfVxuXG4gIC8vIFJvbGwgYmFjayB0aGUgc3RhcnQgcG9pbnRzLlxuICBwYXRjaC5zdGFydDEgLT0gcHJlZml4Lmxlbmd0aDtcbiAgcGF0Y2guc3RhcnQyIC09IHByZWZpeC5sZW5ndGg7XG4gIC8vIEV4dGVuZCB0aGUgbGVuZ3Rocy5cbiAgcGF0Y2gubGVuZ3RoMSArPSBwcmVmaXgubGVuZ3RoICsgc3VmZml4Lmxlbmd0aDtcbiAgcGF0Y2gubGVuZ3RoMiArPSBwcmVmaXgubGVuZ3RoICsgc3VmZml4Lmxlbmd0aDtcbn07XG5cblxuLyoqXG4gKiBDb21wdXRlIGEgbGlzdCBvZiBwYXRjaGVzIHRvIHR1cm4gdGV4dDEgaW50byB0ZXh0Mi5cbiAqIFVzZSBkaWZmcyBpZiBwcm92aWRlZCwgb3RoZXJ3aXNlIGNvbXB1dGUgaXQgb3Vyc2VsdmVzLlxuICogVGhlcmUgYXJlIGZvdXIgd2F5cyB0byBjYWxsIHRoaXMgZnVuY3Rpb24sIGRlcGVuZGluZyBvbiB3aGF0IGRhdGEgaXNcbiAqIGF2YWlsYWJsZSB0byB0aGUgY2FsbGVyOlxuICogTWV0aG9kIDE6XG4gKiBhID0gdGV4dDEsIGIgPSB0ZXh0MlxuICogTWV0aG9kIDI6XG4gKiBhID0gZGlmZnNcbiAqIE1ldGhvZCAzIChvcHRpbWFsKTpcbiAqIGEgPSB0ZXh0MSwgYiA9IGRpZmZzXG4gKiBNZXRob2QgNCAoZGVwcmVjYXRlZCwgdXNlIG1ldGhvZCAzKTpcbiAqIGEgPSB0ZXh0MSwgYiA9IHRleHQyLCBjID0gZGlmZnNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3whQXJyYXkuPCFkaWZmX21hdGNoX3BhdGNoLkRpZmY+fSBhIHRleHQxIChtZXRob2RzIDEsMyw0KSBvclxuICogQXJyYXkgb2YgZGlmZiB0dXBsZXMgZm9yIHRleHQxIHRvIHRleHQyIChtZXRob2QgMikuXG4gKiBAcGFyYW0ge3N0cmluZ3whQXJyYXkuPCFkaWZmX21hdGNoX3BhdGNoLkRpZmY+fSBvcHRfYiB0ZXh0MiAobWV0aG9kcyAxLDQpIG9yXG4gKiBBcnJheSBvZiBkaWZmIHR1cGxlcyBmb3IgdGV4dDEgdG8gdGV4dDIgKG1ldGhvZCAzKSBvciB1bmRlZmluZWQgKG1ldGhvZCAyKS5cbiAqIEBwYXJhbSB7c3RyaW5nfCFBcnJheS48IWRpZmZfbWF0Y2hfcGF0Y2guRGlmZj59IG9wdF9jIEFycmF5IG9mIGRpZmYgdHVwbGVzXG4gKiBmb3IgdGV4dDEgdG8gdGV4dDIgKG1ldGhvZCA0KSBvciB1bmRlZmluZWQgKG1ldGhvZHMgMSwyLDMpLlxuICogQHJldHVybiB7IUFycmF5LjwhZGlmZl9tYXRjaF9wYXRjaC5wYXRjaF9vYmo+fSBBcnJheSBvZiBwYXRjaCBvYmplY3RzLlxuICovXG5kaWZmX21hdGNoX3BhdGNoLnByb3RvdHlwZS5wYXRjaF9tYWtlID0gZnVuY3Rpb24oYSwgb3B0X2IsIG9wdF9jKSB7XG4gIHZhciB0ZXh0MSwgZGlmZnM7XG4gIGlmICh0eXBlb2YgYSA9PSAnc3RyaW5nJyAmJiB0eXBlb2Ygb3B0X2IgPT0gJ3N0cmluZycgJiZcbiAgICAgIHR5cGVvZiBvcHRfYyA9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIE1ldGhvZCAxOiB0ZXh0MSwgdGV4dDJcbiAgICAvLyBDb21wdXRlIGRpZmZzIGZyb20gdGV4dDEgYW5kIHRleHQyLlxuICAgIHRleHQxID0gLyoqIEB0eXBlIHtzdHJpbmd9ICovKGEpO1xuICAgIGRpZmZzID0gdGhpcy5kaWZmX21haW4odGV4dDEsIC8qKiBAdHlwZSB7c3RyaW5nfSAqLyhvcHRfYiksIHRydWUpO1xuICAgIGlmIChkaWZmcy5sZW5ndGggPiAyKSB7XG4gICAgICB0aGlzLmRpZmZfY2xlYW51cFNlbWFudGljKGRpZmZzKTtcbiAgICAgIHRoaXMuZGlmZl9jbGVhbnVwRWZmaWNpZW5jeShkaWZmcyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGEgJiYgdHlwZW9mIGEgPT0gJ29iamVjdCcgJiYgdHlwZW9mIG9wdF9iID09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2Ygb3B0X2MgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBNZXRob2QgMjogZGlmZnNcbiAgICAvLyBDb21wdXRlIHRleHQxIGZyb20gZGlmZnMuXG4gICAgZGlmZnMgPSAvKiogQHR5cGUgeyFBcnJheS48IWRpZmZfbWF0Y2hfcGF0Y2guRGlmZj59ICovKGEpO1xuICAgIHRleHQxID0gdGhpcy5kaWZmX3RleHQxKGRpZmZzKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PSAnc3RyaW5nJyAmJiBvcHRfYiAmJiB0eXBlb2Ygb3B0X2IgPT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBvcHRfYyA9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIE1ldGhvZCAzOiB0ZXh0MSwgZGlmZnNcbiAgICB0ZXh0MSA9IC8qKiBAdHlwZSB7c3RyaW5nfSAqLyhhKTtcbiAgICBkaWZmcyA9IC8qKiBAdHlwZSB7IUFycmF5LjwhZGlmZl9tYXRjaF9wYXRjaC5EaWZmPn0gKi8ob3B0X2IpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBhID09ICdzdHJpbmcnICYmIHR5cGVvZiBvcHRfYiA9PSAnc3RyaW5nJyAmJlxuICAgICAgb3B0X2MgJiYgdHlwZW9mIG9wdF9jID09ICdvYmplY3QnKSB7XG4gICAgLy8gTWV0aG9kIDQ6IHRleHQxLCB0ZXh0MiwgZGlmZnNcbiAgICAvLyB0ZXh0MiBpcyBub3QgdXNlZC5cbiAgICB0ZXh0MSA9IC8qKiBAdHlwZSB7c3RyaW5nfSAqLyhhKTtcbiAgICBkaWZmcyA9IC8qKiBAdHlwZSB7IUFycmF5LjwhZGlmZl9tYXRjaF9wYXRjaC5EaWZmPn0gKi8ob3B0X2MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBjYWxsIGZvcm1hdCB0byBwYXRjaF9tYWtlLicpO1xuICB9XG5cbiAgaWYgKGRpZmZzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbXTsgIC8vIEdldCByaWQgb2YgdGhlIG51bGwgY2FzZS5cbiAgfVxuICB2YXIgcGF0Y2hlcyA9IFtdO1xuICB2YXIgcGF0Y2ggPSBuZXcgZGlmZl9tYXRjaF9wYXRjaC5wYXRjaF9vYmooKTtcbiAgdmFyIHBhdGNoRGlmZkxlbmd0aCA9IDA7ICAvLyBLZWVwaW5nIG91ciBvd24gbGVuZ3RoIHZhciBpcyBmYXN0ZXIgaW4gSlMuXG4gIHZhciBjaGFyX2NvdW50MSA9IDA7ICAvLyBOdW1iZXIgb2YgY2hhcmFjdGVycyBpbnRvIHRoZSB0ZXh0MSBzdHJpbmcuXG4gIHZhciBjaGFyX2NvdW50MiA9IDA7ICAvLyBOdW1iZXIgb2YgY2hhcmFjdGVycyBpbnRvIHRoZSB0ZXh0MiBzdHJpbmcuXG4gIC8vIFN0YXJ0IHdpdGggdGV4dDEgKHByZXBhdGNoX3RleHQpIGFuZCBhcHBseSB0aGUgZGlmZnMgdW50aWwgd2UgYXJyaXZlIGF0XG4gIC8vIHRleHQyIChwb3N0cGF0Y2hfdGV4dCkuICBXZSByZWNyZWF0ZSB0aGUgcGF0Y2hlcyBvbmUgYnkgb25lIHRvIGRldGVybWluZVxuICAvLyBjb250ZXh0IGluZm8uXG4gIHZhciBwcmVwYXRjaF90ZXh0ID0gdGV4dDE7XG4gIHZhciBwb3N0cGF0Y2hfdGV4dCA9IHRleHQxO1xuICBmb3IgKHZhciB4ID0gMDsgeCA8IGRpZmZzLmxlbmd0aDsgeCsrKSB7XG4gICAgdmFyIGRpZmZfdHlwZSA9IGRpZmZzW3hdWzBdO1xuICAgIHZhciBkaWZmX3RleHQgPSBkaWZmc1t4XVsxXTtcblxuICAgIGlmICghcGF0Y2hEaWZmTGVuZ3RoICYmIGRpZmZfdHlwZSAhPT0gRElGRl9FUVVBTCkge1xuICAgICAgLy8gQSBuZXcgcGF0Y2ggc3RhcnRzIGhlcmUuXG4gICAgICBwYXRjaC5zdGFydDEgPSBjaGFyX2NvdW50MTtcbiAgICAgIHBhdGNoLnN0YXJ0MiA9IGNoYXJfY291bnQyO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZGlmZl90eXBlKSB7XG4gICAgICBjYXNlIERJRkZfSU5TRVJUOlxuICAgICAgICBwYXRjaC5kaWZmc1twYXRjaERpZmZMZW5ndGgrK10gPSBkaWZmc1t4XTtcbiAgICAgICAgcGF0Y2gubGVuZ3RoMiArPSBkaWZmX3RleHQubGVuZ3RoO1xuICAgICAgICBwb3N0cGF0Y2hfdGV4dCA9IHBvc3RwYXRjaF90ZXh0LnN1YnN0cmluZygwLCBjaGFyX2NvdW50MikgKyBkaWZmX3RleHQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RwYXRjaF90ZXh0LnN1YnN0cmluZyhjaGFyX2NvdW50Mik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBESUZGX0RFTEVURTpcbiAgICAgICAgcGF0Y2gubGVuZ3RoMSArPSBkaWZmX3RleHQubGVuZ3RoO1xuICAgICAgICBwYXRjaC5kaWZmc1twYXRjaERpZmZMZW5ndGgrK10gPSBkaWZmc1t4XTtcbiAgICAgICAgcG9zdHBhdGNoX3RleHQgPSBwb3N0cGF0Y2hfdGV4dC5zdWJzdHJpbmcoMCwgY2hhcl9jb3VudDIpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0cGF0Y2hfdGV4dC5zdWJzdHJpbmcoY2hhcl9jb3VudDIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmX3RleHQubGVuZ3RoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERJRkZfRVFVQUw6XG4gICAgICAgIGlmIChkaWZmX3RleHQubGVuZ3RoIDw9IDIgKiB0aGlzLlBhdGNoX01hcmdpbiAmJlxuICAgICAgICAgICAgcGF0Y2hEaWZmTGVuZ3RoICYmIGRpZmZzLmxlbmd0aCAhPSB4ICsgMSkge1xuICAgICAgICAgIC8vIFNtYWxsIGVxdWFsaXR5IGluc2lkZSBhIHBhdGNoLlxuICAgICAgICAgIHBhdGNoLmRpZmZzW3BhdGNoRGlmZkxlbmd0aCsrXSA9IGRpZmZzW3hdO1xuICAgICAgICAgIHBhdGNoLmxlbmd0aDEgKz0gZGlmZl90ZXh0Lmxlbmd0aDtcbiAgICAgICAgICBwYXRjaC5sZW5ndGgyICs9IGRpZmZfdGV4dC5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlmZl90ZXh0Lmxlbmd0aCA+PSAyICogdGhpcy5QYXRjaF9NYXJnaW4pIHtcbiAgICAgICAgICAvLyBUaW1lIGZvciBhIG5ldyBwYXRjaC5cbiAgICAgICAgICBpZiAocGF0Y2hEaWZmTGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnBhdGNoX2FkZENvbnRleHRfKHBhdGNoLCBwcmVwYXRjaF90ZXh0KTtcbiAgICAgICAgICAgIHBhdGNoZXMucHVzaChwYXRjaCk7XG4gICAgICAgICAgICBwYXRjaCA9IG5ldyBkaWZmX21hdGNoX3BhdGNoLnBhdGNoX29iaigpO1xuICAgICAgICAgICAgcGF0Y2hEaWZmTGVuZ3RoID0gMDtcbiAgICAgICAgICAgIC8vIFVubGlrZSBVbmlkaWZmLCBvdXIgcGF0Y2ggbGlzdHMgaGF2ZSBhIHJvbGxpbmcgY29udGV4dC5cbiAgICAgICAgICAgIC8vIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9nb29nbGUtZGlmZi1tYXRjaC1wYXRjaC93aWtpL1VuaWRpZmZcbiAgICAgICAgICAgIC8vIFVwZGF0ZSBwcmVwYXRjaCB0ZXh0ICYgcG9zIHRvIHJlZmxlY3QgdGhlIGFwcGxpY2F0aW9uIG9mIHRoZVxuICAgICAgICAgICAgLy8ganVzdCBjb21wbGV0ZWQgcGF0Y2guXG4gICAgICAgICAgICBwcmVwYXRjaF90ZXh0ID0gcG9zdHBhdGNoX3RleHQ7XG4gICAgICAgICAgICBjaGFyX2NvdW50MSA9IGNoYXJfY291bnQyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIGN1cnJlbnQgY2hhcmFjdGVyIGNvdW50LlxuICAgIGlmIChkaWZmX3R5cGUgIT09IERJRkZfSU5TRVJUKSB7XG4gICAgICBjaGFyX2NvdW50MSArPSBkaWZmX3RleHQubGVuZ3RoO1xuICAgIH1cbiAgICBpZiAoZGlmZl90eXBlICE9PSBESUZGX0RFTEVURSkge1xuICAgICAgY2hhcl9jb3VudDIgKz0gZGlmZl90ZXh0Lmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgLy8gUGljayB1cCB0aGUgbGVmdG92ZXIgcGF0Y2ggaWYgbm90IGVtcHR5LlxuICBpZiAocGF0Y2hEaWZmTGVuZ3RoKSB7XG4gICAgdGhpcy5wYXRjaF9hZGRDb250ZXh0XyhwYXRjaCwgcHJlcGF0Y2hfdGV4dCk7XG4gICAgcGF0Y2hlcy5wdXNoKHBhdGNoKTtcbiAgfVxuXG4gIHJldHVybiBwYXRjaGVzO1xufTtcblxuXG4vKipcbiAqIEdpdmVuIGFuIGFycmF5IG9mIHBhdGNoZXMsIHJldHVybiBhbm90aGVyIGFycmF5IHRoYXQgaXMgaWRlbnRpY2FsLlxuICogQHBhcmFtIHshQXJyYXkuPCFkaWZmX21hdGNoX3BhdGNoLnBhdGNoX29iaj59IHBhdGNoZXMgQXJyYXkgb2YgcGF0Y2ggb2JqZWN0cy5cbiAqIEByZXR1cm4geyFBcnJheS48IWRpZmZfbWF0Y2hfcGF0Y2gucGF0Y2hfb2JqPn0gQXJyYXkgb2YgcGF0Y2ggb2JqZWN0cy5cbiAqL1xuZGlmZl9tYXRjaF9wYXRjaC5wcm90b3R5cGUucGF0Y2hfZGVlcENvcHkgPSBmdW5jdGlvbihwYXRjaGVzKSB7XG4gIC8vIE1ha2luZyBkZWVwIGNvcGllcyBpcyBoYXJkIGluIEphdmFTY3JpcHQuXG4gIHZhciBwYXRjaGVzQ29weSA9IFtdO1xuICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhdGNoZXMubGVuZ3RoOyB4KyspIHtcbiAgICB2YXIgcGF0Y2ggPSBwYXRjaGVzW3hdO1xuICAgIHZhciBwYXRjaENvcHkgPSBuZXcgZGlmZl9tYXRjaF9wYXRjaC5wYXRjaF9vYmooKTtcbiAgICBwYXRjaENvcHkuZGlmZnMgPSBbXTtcbiAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHBhdGNoLmRpZmZzLmxlbmd0aDsgeSsrKSB7XG4gICAgICBwYXRjaENvcHkuZGlmZnNbeV0gPSBwYXRjaC5kaWZmc1t5XS5zbGljZSgpO1xuICAgIH1cbiAgICBwYXRjaENvcHkuc3RhcnQxID0gcGF0Y2guc3RhcnQxO1xuICAgIHBhdGNoQ29weS5zdGFydDIgPSBwYXRjaC5zdGFydDI7XG4gICAgcGF0Y2hDb3B5Lmxlbmd0aDEgPSBwYXRjaC5sZW5ndGgxO1xuICAgIHBhdGNoQ29weS5sZW5ndGgyID0gcGF0Y2gubGVuZ3RoMjtcbiAgICBwYXRjaGVzQ29weVt4XSA9IHBhdGNoQ29weTtcbiAgfVxuICByZXR1cm4gcGF0Y2hlc0NvcHk7XG59O1xuXG5cbi8qKlxuICogTWVyZ2UgYSBzZXQgb2YgcGF0Y2hlcyBvbnRvIHRoZSB0ZXh0LiAgUmV0dXJuIGEgcGF0Y2hlZCB0ZXh0LCBhcyB3ZWxsXG4gKiBhcyBhIGxpc3Qgb2YgdHJ1ZS9mYWxzZSB2YWx1ZXMgaW5kaWNhdGluZyB3aGljaCBwYXRjaGVzIHdlcmUgYXBwbGllZC5cbiAqIEBwYXJhbSB7IUFycmF5LjwhZGlmZl9tYXRjaF9wYXRjaC5wYXRjaF9vYmo+fSBwYXRjaGVzIEFycmF5IG9mIHBhdGNoIG9iamVjdHMuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBPbGQgdGV4dC5cbiAqIEByZXR1cm4geyFBcnJheS48c3RyaW5nfCFBcnJheS48Ym9vbGVhbj4+fSBUd28gZWxlbWVudCBBcnJheSwgY29udGFpbmluZyB0aGVcbiAqICAgICAgbmV3IHRleHQgYW5kIGFuIGFycmF5IG9mIGJvb2xlYW4gdmFsdWVzLlxuICovXG5kaWZmX21hdGNoX3BhdGNoLnByb3RvdHlwZS5wYXRjaF9hcHBseSA9IGZ1bmN0aW9uKHBhdGNoZXMsIHRleHQpIHtcbiAgaWYgKHBhdGNoZXMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gW3RleHQsIFtdXTtcbiAgfVxuXG4gIC8vIERlZXAgY29weSB0aGUgcGF0Y2hlcyBzbyB0aGF0IG5vIGNoYW5nZXMgYXJlIG1hZGUgdG8gb3JpZ2luYWxzLlxuICBwYXRjaGVzID0gdGhpcy5wYXRjaF9kZWVwQ29weShwYXRjaGVzKTtcblxuICB2YXIgbnVsbFBhZGRpbmcgPSB0aGlzLnBhdGNoX2FkZFBhZGRpbmcocGF0Y2hlcyk7XG4gIHRleHQgPSBudWxsUGFkZGluZyArIHRleHQgKyBudWxsUGFkZGluZztcblxuICB0aGlzLnBhdGNoX3NwbGl0TWF4KHBhdGNoZXMpO1xuICAvLyBkZWx0YSBrZWVwcyB0cmFjayBvZiB0aGUgb2Zmc2V0IGJldHdlZW4gdGhlIGV4cGVjdGVkIGFuZCBhY3R1YWwgbG9jYXRpb25cbiAgLy8gb2YgdGhlIHByZXZpb3VzIHBhdGNoLiAgSWYgdGhlcmUgYXJlIHBhdGNoZXMgZXhwZWN0ZWQgYXQgcG9zaXRpb25zIDEwIGFuZFxuICAvLyAyMCwgYnV0IHRoZSBmaXJzdCBwYXRjaCB3YXMgZm91bmQgYXQgMTIsIGRlbHRhIGlzIDIgYW5kIHRoZSBzZWNvbmQgcGF0Y2hcbiAgLy8gaGFzIGFuIGVmZmVjdGl2ZSBleHBlY3RlZCBwb3NpdGlvbiBvZiAyMi5cbiAgdmFyIGRlbHRhID0gMDtcbiAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXRjaGVzLmxlbmd0aDsgeCsrKSB7XG4gICAgdmFyIGV4cGVjdGVkX2xvYyA9IHBhdGNoZXNbeF0uc3RhcnQyICsgZGVsdGE7XG4gICAgdmFyIHRleHQxID0gdGhpcy5kaWZmX3RleHQxKHBhdGNoZXNbeF0uZGlmZnMpO1xuICAgIHZhciBzdGFydF9sb2M7XG4gICAgdmFyIGVuZF9sb2MgPSAtMTtcbiAgICBpZiAodGV4dDEubGVuZ3RoID4gdGhpcy5NYXRjaF9NYXhCaXRzKSB7XG4gICAgICAvLyBwYXRjaF9zcGxpdE1heCB3aWxsIG9ubHkgcHJvdmlkZSBhbiBvdmVyc2l6ZWQgcGF0dGVybiBpbiB0aGUgY2FzZSBvZlxuICAgICAgLy8gYSBtb25zdGVyIGRlbGV0ZS5cbiAgICAgIHN0YXJ0X2xvYyA9IHRoaXMubWF0Y2hfbWFpbih0ZXh0LCB0ZXh0MS5zdWJzdHJpbmcoMCwgdGhpcy5NYXRjaF9NYXhCaXRzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZF9sb2MpO1xuICAgICAgaWYgKHN0YXJ0X2xvYyAhPSAtMSkge1xuICAgICAgICBlbmRfbG9jID0gdGhpcy5tYXRjaF9tYWluKHRleHQsXG4gICAgICAgICAgICB0ZXh0MS5zdWJzdHJpbmcodGV4dDEubGVuZ3RoIC0gdGhpcy5NYXRjaF9NYXhCaXRzKSxcbiAgICAgICAgICAgIGV4cGVjdGVkX2xvYyArIHRleHQxLmxlbmd0aCAtIHRoaXMuTWF0Y2hfTWF4Qml0cyk7XG4gICAgICAgIGlmIChlbmRfbG9jID09IC0xIHx8IHN0YXJ0X2xvYyA+PSBlbmRfbG9jKSB7XG4gICAgICAgICAgLy8gQ2FuJ3QgZmluZCB2YWxpZCB0cmFpbGluZyBjb250ZXh0LiAgRHJvcCB0aGlzIHBhdGNoLlxuICAgICAgICAgIHN0YXJ0X2xvYyA9IC0xO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0X2xvYyA9IHRoaXMubWF0Y2hfbWFpbih0ZXh0LCB0ZXh0MSwgZXhwZWN0ZWRfbG9jKTtcbiAgICB9XG4gICAgaWYgKHN0YXJ0X2xvYyA9PSAtMSkge1xuICAgICAgLy8gTm8gbWF0Y2ggZm91bmQuICA6KFxuICAgICAgcmVzdWx0c1t4XSA9IGZhbHNlO1xuICAgICAgLy8gU3VidHJhY3QgdGhlIGRlbHRhIGZvciB0aGlzIGZhaWxlZCBwYXRjaCBmcm9tIHN1YnNlcXVlbnQgcGF0Y2hlcy5cbiAgICAgIGRlbHRhIC09IHBhdGNoZXNbeF0ubGVuZ3RoMiAtIHBhdGNoZXNbeF0ubGVuZ3RoMTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRm91bmQgYSBtYXRjaC4gIDopXG4gICAgICByZXN1bHRzW3hdID0gdHJ1ZTtcbiAgICAgIGRlbHRhID0gc3RhcnRfbG9jIC0gZXhwZWN0ZWRfbG9jO1xuICAgICAgdmFyIHRleHQyO1xuICAgICAgaWYgKGVuZF9sb2MgPT0gLTEpIHtcbiAgICAgICAgdGV4dDIgPSB0ZXh0LnN1YnN0cmluZyhzdGFydF9sb2MsIHN0YXJ0X2xvYyArIHRleHQxLmxlbmd0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0MiA9IHRleHQuc3Vic3RyaW5nKHN0YXJ0X2xvYywgZW5kX2xvYyArIHRoaXMuTWF0Y2hfTWF4Qml0cyk7XG4gICAgICB9XG4gICAgICBpZiAodGV4dDEgPT0gdGV4dDIpIHtcbiAgICAgICAgLy8gUGVyZmVjdCBtYXRjaCwganVzdCBzaG92ZSB0aGUgcmVwbGFjZW1lbnQgdGV4dCBpbi5cbiAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIHN0YXJ0X2xvYykgK1xuICAgICAgICAgICAgICAgdGhpcy5kaWZmX3RleHQyKHBhdGNoZXNbeF0uZGlmZnMpICtcbiAgICAgICAgICAgICAgIHRleHQuc3Vic3RyaW5nKHN0YXJ0X2xvYyArIHRleHQxLmxlbmd0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJbXBlcmZlY3QgbWF0Y2guICBSdW4gYSBkaWZmIHRvIGdldCBhIGZyYW1ld29yayBvZiBlcXVpdmFsZW50XG4gICAgICAgIC8vIGluZGljZXMuXG4gICAgICAgIHZhciBkaWZmcyA9IHRoaXMuZGlmZl9tYWluKHRleHQxLCB0ZXh0MiwgZmFsc2UpO1xuICAgICAgICBpZiAodGV4dDEubGVuZ3RoID4gdGhpcy5NYXRjaF9NYXhCaXRzICYmXG4gICAgICAgICAgICB0aGlzLmRpZmZfbGV2ZW5zaHRlaW4oZGlmZnMpIC8gdGV4dDEubGVuZ3RoID5cbiAgICAgICAgICAgIHRoaXMuUGF0Y2hfRGVsZXRlVGhyZXNob2xkKSB7XG4gICAgICAgICAgLy8gVGhlIGVuZCBwb2ludHMgbWF0Y2gsIGJ1dCB0aGUgY29udGVudCBpcyB1bmFjY2VwdGFibHkgYmFkLlxuICAgICAgICAgIHJlc3VsdHNbeF0gPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRpZmZfY2xlYW51cFNlbWFudGljTG9zc2xlc3MoZGlmZnMpO1xuICAgICAgICAgIHZhciBpbmRleDEgPSAwO1xuICAgICAgICAgIHZhciBpbmRleDI7XG4gICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBwYXRjaGVzW3hdLmRpZmZzLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgICB2YXIgbW9kID0gcGF0Y2hlc1t4XS5kaWZmc1t5XTtcbiAgICAgICAgICAgIGlmIChtb2RbMF0gIT09IERJRkZfRVFVQUwpIHtcbiAgICAgICAgICAgICAgaW5kZXgyID0gdGhpcy5kaWZmX3hJbmRleChkaWZmcywgaW5kZXgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtb2RbMF0gPT09IERJRkZfSU5TRVJUKSB7ICAvLyBJbnNlcnRpb25cbiAgICAgICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIHN0YXJ0X2xvYyArIGluZGV4MikgKyBtb2RbMV0gK1xuICAgICAgICAgICAgICAgICAgICAgdGV4dC5zdWJzdHJpbmcoc3RhcnRfbG9jICsgaW5kZXgyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobW9kWzBdID09PSBESUZGX0RFTEVURSkgeyAgLy8gRGVsZXRpb25cbiAgICAgICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIHN0YXJ0X2xvYyArIGluZGV4MikgK1xuICAgICAgICAgICAgICAgICAgICAgdGV4dC5zdWJzdHJpbmcoc3RhcnRfbG9jICsgdGhpcy5kaWZmX3hJbmRleChkaWZmcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDEgKyBtb2RbMV0ubGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobW9kWzBdICE9PSBESUZGX0RFTEVURSkge1xuICAgICAgICAgICAgICBpbmRleDEgKz0gbW9kWzFdLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gU3RyaXAgdGhlIHBhZGRpbmcgb2ZmLlxuICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcobnVsbFBhZGRpbmcubGVuZ3RoLCB0ZXh0Lmxlbmd0aCAtIG51bGxQYWRkaW5nLmxlbmd0aCk7XG4gIHJldHVybiBbdGV4dCwgcmVzdWx0c107XG59O1xuXG5cbi8qKlxuICogQWRkIHNvbWUgcGFkZGluZyBvbiB0ZXh0IHN0YXJ0IGFuZCBlbmQgc28gdGhhdCBlZGdlcyBjYW4gbWF0Y2ggc29tZXRoaW5nLlxuICogSW50ZW5kZWQgdG8gYmUgY2FsbGVkIG9ubHkgZnJvbSB3aXRoaW4gcGF0Y2hfYXBwbHkuXG4gKiBAcGFyYW0geyFBcnJheS48IWRpZmZfbWF0Y2hfcGF0Y2gucGF0Y2hfb2JqPn0gcGF0Y2hlcyBBcnJheSBvZiBwYXRjaCBvYmplY3RzLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgcGFkZGluZyBzdHJpbmcgYWRkZWQgdG8gZWFjaCBzaWRlLlxuICovXG5kaWZmX21hdGNoX3BhdGNoLnByb3RvdHlwZS5wYXRjaF9hZGRQYWRkaW5nID0gZnVuY3Rpb24ocGF0Y2hlcykge1xuICB2YXIgcGFkZGluZ0xlbmd0aCA9IHRoaXMuUGF0Y2hfTWFyZ2luO1xuICB2YXIgbnVsbFBhZGRpbmcgPSAnJztcbiAgZm9yICh2YXIgeCA9IDE7IHggPD0gcGFkZGluZ0xlbmd0aDsgeCsrKSB7XG4gICAgbnVsbFBhZGRpbmcgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSh4KTtcbiAgfVxuXG4gIC8vIEJ1bXAgYWxsIHRoZSBwYXRjaGVzIGZvcndhcmQuXG4gIGZvciAodmFyIHggPSAwOyB4IDwgcGF0Y2hlcy5sZW5ndGg7IHgrKykge1xuICAgIHBhdGNoZXNbeF0uc3RhcnQxICs9IHBhZGRpbmdMZW5ndGg7XG4gICAgcGF0Y2hlc1t4XS5zdGFydDIgKz0gcGFkZGluZ0xlbmd0aDtcbiAgfVxuXG4gIC8vIEFkZCBzb21lIHBhZGRpbmcgb24gc3RhcnQgb2YgZmlyc3QgZGlmZi5cbiAgdmFyIHBhdGNoID0gcGF0Y2hlc1swXTtcbiAgdmFyIGRpZmZzID0gcGF0Y2guZGlmZnM7XG4gIGlmIChkaWZmcy5sZW5ndGggPT0gMCB8fCBkaWZmc1swXVswXSAhPSBESUZGX0VRVUFMKSB7XG4gICAgLy8gQWRkIG51bGxQYWRkaW5nIGVxdWFsaXR5LlxuICAgIGRpZmZzLnVuc2hpZnQoW0RJRkZfRVFVQUwsIG51bGxQYWRkaW5nXSk7XG4gICAgcGF0Y2guc3RhcnQxIC09IHBhZGRpbmdMZW5ndGg7ICAvLyBTaG91bGQgYmUgMC5cbiAgICBwYXRjaC5zdGFydDIgLT0gcGFkZGluZ0xlbmd0aDsgIC8vIFNob3VsZCBiZSAwLlxuICAgIHBhdGNoLmxlbmd0aDEgKz0gcGFkZGluZ0xlbmd0aDtcbiAgICBwYXRjaC5sZW5ndGgyICs9IHBhZGRpbmdMZW5ndGg7XG4gIH0gZWxzZSBpZiAocGFkZGluZ0xlbmd0aCA+IGRpZmZzWzBdWzFdLmxlbmd0aCkge1xuICAgIC8vIEdyb3cgZmlyc3QgZXF1YWxpdHkuXG4gICAgdmFyIGV4dHJhTGVuZ3RoID0gcGFkZGluZ0xlbmd0aCAtIGRpZmZzWzBdWzFdLmxlbmd0aDtcbiAgICBkaWZmc1swXVsxXSA9IG51bGxQYWRkaW5nLnN1YnN0cmluZyhkaWZmc1swXVsxXS5sZW5ndGgpICsgZGlmZnNbMF1bMV07XG4gICAgcGF0Y2guc3RhcnQxIC09IGV4dHJhTGVuZ3RoO1xuICAgIHBhdGNoLnN0YXJ0MiAtPSBleHRyYUxlbmd0aDtcbiAgICBwYXRjaC5sZW5ndGgxICs9IGV4dHJhTGVuZ3RoO1xuICAgIHBhdGNoLmxlbmd0aDIgKz0gZXh0cmFMZW5ndGg7XG4gIH1cblxuICAvLyBBZGQgc29tZSBwYWRkaW5nIG9uIGVuZCBvZiBsYXN0IGRpZmYuXG4gIHBhdGNoID0gcGF0Y2hlc1twYXRjaGVzLmxlbmd0aCAtIDFdO1xuICBkaWZmcyA9IHBhdGNoLmRpZmZzO1xuICBpZiAoZGlmZnMubGVuZ3RoID09IDAgfHwgZGlmZnNbZGlmZnMubGVuZ3RoIC0gMV1bMF0gIT0gRElGRl9FUVVBTCkge1xuICAgIC8vIEFkZCBudWxsUGFkZGluZyBlcXVhbGl0eS5cbiAgICBkaWZmcy5wdXNoKFtESUZGX0VRVUFMLCBudWxsUGFkZGluZ10pO1xuICAgIHBhdGNoLmxlbmd0aDEgKz0gcGFkZGluZ0xlbmd0aDtcbiAgICBwYXRjaC5sZW5ndGgyICs9IHBhZGRpbmdMZW5ndGg7XG4gIH0gZWxzZSBpZiAocGFkZGluZ0xlbmd0aCA+IGRpZmZzW2RpZmZzLmxlbmd0aCAtIDFdWzFdLmxlbmd0aCkge1xuICAgIC8vIEdyb3cgbGFzdCBlcXVhbGl0eS5cbiAgICB2YXIgZXh0cmFMZW5ndGggPSBwYWRkaW5nTGVuZ3RoIC0gZGlmZnNbZGlmZnMubGVuZ3RoIC0gMV1bMV0ubGVuZ3RoO1xuICAgIGRpZmZzW2RpZmZzLmxlbmd0aCAtIDFdWzFdICs9IG51bGxQYWRkaW5nLnN1YnN0cmluZygwLCBleHRyYUxlbmd0aCk7XG4gICAgcGF0Y2gubGVuZ3RoMSArPSBleHRyYUxlbmd0aDtcbiAgICBwYXRjaC5sZW5ndGgyICs9IGV4dHJhTGVuZ3RoO1xuICB9XG5cbiAgcmV0dXJuIG51bGxQYWRkaW5nO1xufTtcblxuXG4vKipcbiAqIExvb2sgdGhyb3VnaCB0aGUgcGF0Y2hlcyBhbmQgYnJlYWsgdXAgYW55IHdoaWNoIGFyZSBsb25nZXIgdGhhbiB0aGUgbWF4aW11bVxuICogbGltaXQgb2YgdGhlIG1hdGNoIGFsZ29yaXRobS5cbiAqIEludGVuZGVkIHRvIGJlIGNhbGxlZCBvbmx5IGZyb20gd2l0aGluIHBhdGNoX2FwcGx5LlxuICogQHBhcmFtIHshQXJyYXkuPCFkaWZmX21hdGNoX3BhdGNoLnBhdGNoX29iaj59IHBhdGNoZXMgQXJyYXkgb2YgcGF0Y2ggb2JqZWN0cy5cbiAqL1xuZGlmZl9tYXRjaF9wYXRjaC5wcm90b3R5cGUucGF0Y2hfc3BsaXRNYXggPSBmdW5jdGlvbihwYXRjaGVzKSB7XG4gIHZhciBwYXRjaF9zaXplID0gdGhpcy5NYXRjaF9NYXhCaXRzO1xuICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhdGNoZXMubGVuZ3RoOyB4KyspIHtcbiAgICBpZiAocGF0Y2hlc1t4XS5sZW5ndGgxID4gcGF0Y2hfc2l6ZSkge1xuICAgICAgdmFyIGJpZ3BhdGNoID0gcGF0Y2hlc1t4XTtcbiAgICAgIC8vIFJlbW92ZSB0aGUgYmlnIG9sZCBwYXRjaC5cbiAgICAgIHBhdGNoZXMuc3BsaWNlKHgtLSwgMSk7XG4gICAgICB2YXIgc3RhcnQxID0gYmlncGF0Y2guc3RhcnQxO1xuICAgICAgdmFyIHN0YXJ0MiA9IGJpZ3BhdGNoLnN0YXJ0MjtcbiAgICAgIHZhciBwcmVjb250ZXh0ID0gJyc7XG4gICAgICB3aGlsZSAoYmlncGF0Y2guZGlmZnMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIC8vIENyZWF0ZSBvbmUgb2Ygc2V2ZXJhbCBzbWFsbGVyIHBhdGNoZXMuXG4gICAgICAgIHZhciBwYXRjaCA9IG5ldyBkaWZmX21hdGNoX3BhdGNoLnBhdGNoX29iaigpO1xuICAgICAgICB2YXIgZW1wdHkgPSB0cnVlO1xuICAgICAgICBwYXRjaC5zdGFydDEgPSBzdGFydDEgLSBwcmVjb250ZXh0Lmxlbmd0aDtcbiAgICAgICAgcGF0Y2guc3RhcnQyID0gc3RhcnQyIC0gcHJlY29udGV4dC5sZW5ndGg7XG4gICAgICAgIGlmIChwcmVjb250ZXh0ICE9PSAnJykge1xuICAgICAgICAgIHBhdGNoLmxlbmd0aDEgPSBwYXRjaC5sZW5ndGgyID0gcHJlY29udGV4dC5sZW5ndGg7XG4gICAgICAgICAgcGF0Y2guZGlmZnMucHVzaChbRElGRl9FUVVBTCwgcHJlY29udGV4dF0pO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChiaWdwYXRjaC5kaWZmcy5sZW5ndGggIT09IDAgJiZcbiAgICAgICAgICAgICAgIHBhdGNoLmxlbmd0aDEgPCBwYXRjaF9zaXplIC0gdGhpcy5QYXRjaF9NYXJnaW4pIHtcbiAgICAgICAgICB2YXIgZGlmZl90eXBlID0gYmlncGF0Y2guZGlmZnNbMF1bMF07XG4gICAgICAgICAgdmFyIGRpZmZfdGV4dCA9IGJpZ3BhdGNoLmRpZmZzWzBdWzFdO1xuICAgICAgICAgIGlmIChkaWZmX3R5cGUgPT09IERJRkZfSU5TRVJUKSB7XG4gICAgICAgICAgICAvLyBJbnNlcnRpb25zIGFyZSBoYXJtbGVzcy5cbiAgICAgICAgICAgIHBhdGNoLmxlbmd0aDIgKz0gZGlmZl90ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIHN0YXJ0MiArPSBkaWZmX3RleHQubGVuZ3RoO1xuICAgICAgICAgICAgcGF0Y2guZGlmZnMucHVzaChiaWdwYXRjaC5kaWZmcy5zaGlmdCgpKTtcbiAgICAgICAgICAgIGVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIGlmIChkaWZmX3R5cGUgPT09IERJRkZfREVMRVRFICYmIHBhdGNoLmRpZmZzLmxlbmd0aCA9PSAxICYmXG4gICAgICAgICAgICAgICAgICAgICBwYXRjaC5kaWZmc1swXVswXSA9PSBESUZGX0VRVUFMICYmXG4gICAgICAgICAgICAgICAgICAgICBkaWZmX3RleHQubGVuZ3RoID4gMiAqIHBhdGNoX3NpemUpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBsYXJnZSBkZWxldGlvbi4gIExldCBpdCBwYXNzIGluIG9uZSBjaHVuay5cbiAgICAgICAgICAgIHBhdGNoLmxlbmd0aDEgKz0gZGlmZl90ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIHN0YXJ0MSArPSBkaWZmX3RleHQubGVuZ3RoO1xuICAgICAgICAgICAgZW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgIHBhdGNoLmRpZmZzLnB1c2goW2RpZmZfdHlwZSwgZGlmZl90ZXh0XSk7XG4gICAgICAgICAgICBiaWdwYXRjaC5kaWZmcy5zaGlmdCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBEZWxldGlvbiBvciBlcXVhbGl0eS4gIE9ubHkgdGFrZSBhcyBtdWNoIGFzIHdlIGNhbiBzdG9tYWNoLlxuICAgICAgICAgICAgZGlmZl90ZXh0ID0gZGlmZl90ZXh0LnN1YnN0cmluZygwLFxuICAgICAgICAgICAgICAgIHBhdGNoX3NpemUgLSBwYXRjaC5sZW5ndGgxIC0gdGhpcy5QYXRjaF9NYXJnaW4pO1xuICAgICAgICAgICAgcGF0Y2gubGVuZ3RoMSArPSBkaWZmX3RleHQubGVuZ3RoO1xuICAgICAgICAgICAgc3RhcnQxICs9IGRpZmZfdGV4dC5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoZGlmZl90eXBlID09PSBESUZGX0VRVUFMKSB7XG4gICAgICAgICAgICAgIHBhdGNoLmxlbmd0aDIgKz0gZGlmZl90ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgc3RhcnQyICs9IGRpZmZfdGV4dC5sZW5ndGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGF0Y2guZGlmZnMucHVzaChbZGlmZl90eXBlLCBkaWZmX3RleHRdKTtcbiAgICAgICAgICAgIGlmIChkaWZmX3RleHQgPT0gYmlncGF0Y2guZGlmZnNbMF1bMV0pIHtcbiAgICAgICAgICAgICAgYmlncGF0Y2guZGlmZnMuc2hpZnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJpZ3BhdGNoLmRpZmZzWzBdWzFdID1cbiAgICAgICAgICAgICAgICAgIGJpZ3BhdGNoLmRpZmZzWzBdWzFdLnN1YnN0cmluZyhkaWZmX3RleHQubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUgaGVhZCBjb250ZXh0IGZvciB0aGUgbmV4dCBwYXRjaC5cbiAgICAgICAgcHJlY29udGV4dCA9IHRoaXMuZGlmZl90ZXh0MihwYXRjaC5kaWZmcyk7XG4gICAgICAgIHByZWNvbnRleHQgPVxuICAgICAgICAgICAgcHJlY29udGV4dC5zdWJzdHJpbmcocHJlY29udGV4dC5sZW5ndGggLSB0aGlzLlBhdGNoX01hcmdpbik7XG4gICAgICAgIC8vIEFwcGVuZCB0aGUgZW5kIGNvbnRleHQgZm9yIHRoaXMgcGF0Y2guXG4gICAgICAgIHZhciBwb3N0Y29udGV4dCA9IHRoaXMuZGlmZl90ZXh0MShiaWdwYXRjaC5kaWZmcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoMCwgdGhpcy5QYXRjaF9NYXJnaW4pO1xuICAgICAgICBpZiAocG9zdGNvbnRleHQgIT09ICcnKSB7XG4gICAgICAgICAgcGF0Y2gubGVuZ3RoMSArPSBwb3N0Y29udGV4dC5sZW5ndGg7XG4gICAgICAgICAgcGF0Y2gubGVuZ3RoMiArPSBwb3N0Y29udGV4dC5sZW5ndGg7XG4gICAgICAgICAgaWYgKHBhdGNoLmRpZmZzLmxlbmd0aCAhPT0gMCAmJlxuICAgICAgICAgICAgICBwYXRjaC5kaWZmc1twYXRjaC5kaWZmcy5sZW5ndGggLSAxXVswXSA9PT0gRElGRl9FUVVBTCkge1xuICAgICAgICAgICAgcGF0Y2guZGlmZnNbcGF0Y2guZGlmZnMubGVuZ3RoIC0gMV1bMV0gKz0gcG9zdGNvbnRleHQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhdGNoLmRpZmZzLnB1c2goW0RJRkZfRVFVQUwsIHBvc3Rjb250ZXh0XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghZW1wdHkpIHtcbiAgICAgICAgICBwYXRjaGVzLnNwbGljZSgrK3gsIDAsIHBhdGNoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuXG4vKipcbiAqIFRha2UgYSBsaXN0IG9mIHBhdGNoZXMgYW5kIHJldHVybiBhIHRleHR1YWwgcmVwcmVzZW50YXRpb24uXG4gKiBAcGFyYW0geyFBcnJheS48IWRpZmZfbWF0Y2hfcGF0Y2gucGF0Y2hfb2JqPn0gcGF0Y2hlcyBBcnJheSBvZiBwYXRjaCBvYmplY3RzLlxuICogQHJldHVybiB7c3RyaW5nfSBUZXh0IHJlcHJlc2VudGF0aW9uIG9mIHBhdGNoZXMuXG4gKi9cbmRpZmZfbWF0Y2hfcGF0Y2gucHJvdG90eXBlLnBhdGNoX3RvVGV4dCA9IGZ1bmN0aW9uKHBhdGNoZXMpIHtcbiAgdmFyIHRleHQgPSBbXTtcbiAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXRjaGVzLmxlbmd0aDsgeCsrKSB7XG4gICAgdGV4dFt4XSA9IHBhdGNoZXNbeF07XG4gIH1cbiAgcmV0dXJuIHRleHQuam9pbignJyk7XG59O1xuXG5cbi8qKlxuICogUGFyc2UgYSB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uIG9mIHBhdGNoZXMgYW5kIHJldHVybiBhIGxpc3Qgb2YgcGF0Y2ggb2JqZWN0cy5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0bGluZSBUZXh0IHJlcHJlc2VudGF0aW9uIG9mIHBhdGNoZXMuXG4gKiBAcmV0dXJuIHshQXJyYXkuPCFkaWZmX21hdGNoX3BhdGNoLnBhdGNoX29iaj59IEFycmF5IG9mIHBhdGNoIG9iamVjdHMuXG4gKiBAdGhyb3dzIHshRXJyb3J9IElmIGludmFsaWQgaW5wdXQuXG4gKi9cbmRpZmZfbWF0Y2hfcGF0Y2gucHJvdG90eXBlLnBhdGNoX2Zyb21UZXh0ID0gZnVuY3Rpb24odGV4dGxpbmUpIHtcbiAgdmFyIHBhdGNoZXMgPSBbXTtcbiAgaWYgKCF0ZXh0bGluZSkge1xuICAgIHJldHVybiBwYXRjaGVzO1xuICB9XG4gIHZhciB0ZXh0ID0gdGV4dGxpbmUuc3BsaXQoJ1xcbicpO1xuICB2YXIgdGV4dFBvaW50ZXIgPSAwO1xuICB2YXIgcGF0Y2hIZWFkZXIgPSAvXkBAIC0oXFxkKyksPyhcXGQqKSBcXCsoXFxkKyksPyhcXGQqKSBAQCQvO1xuICB3aGlsZSAodGV4dFBvaW50ZXIgPCB0ZXh0Lmxlbmd0aCkge1xuICAgIHZhciBtID0gdGV4dFt0ZXh0UG9pbnRlcl0ubWF0Y2gocGF0Y2hIZWFkZXIpO1xuICAgIGlmICghbSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBhdGNoIHN0cmluZzogJyArIHRleHRbdGV4dFBvaW50ZXJdKTtcbiAgICB9XG4gICAgdmFyIHBhdGNoID0gbmV3IGRpZmZfbWF0Y2hfcGF0Y2gucGF0Y2hfb2JqKCk7XG4gICAgcGF0Y2hlcy5wdXNoKHBhdGNoKTtcbiAgICBwYXRjaC5zdGFydDEgPSBwYXJzZUludChtWzFdLCAxMCk7XG4gICAgaWYgKG1bMl0gPT09ICcnKSB7XG4gICAgICBwYXRjaC5zdGFydDEtLTtcbiAgICAgIHBhdGNoLmxlbmd0aDEgPSAxO1xuICAgIH0gZWxzZSBpZiAobVsyXSA9PSAnMCcpIHtcbiAgICAgIHBhdGNoLmxlbmd0aDEgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXRjaC5zdGFydDEtLTtcbiAgICAgIHBhdGNoLmxlbmd0aDEgPSBwYXJzZUludChtWzJdLCAxMCk7XG4gICAgfVxuXG4gICAgcGF0Y2guc3RhcnQyID0gcGFyc2VJbnQobVszXSwgMTApO1xuICAgIGlmIChtWzRdID09PSAnJykge1xuICAgICAgcGF0Y2guc3RhcnQyLS07XG4gICAgICBwYXRjaC5sZW5ndGgyID0gMTtcbiAgICB9IGVsc2UgaWYgKG1bNF0gPT0gJzAnKSB7XG4gICAgICBwYXRjaC5sZW5ndGgyID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGF0Y2guc3RhcnQyLS07XG4gICAgICBwYXRjaC5sZW5ndGgyID0gcGFyc2VJbnQobVs0XSwgMTApO1xuICAgIH1cbiAgICB0ZXh0UG9pbnRlcisrO1xuXG4gICAgd2hpbGUgKHRleHRQb2ludGVyIDwgdGV4dC5sZW5ndGgpIHtcbiAgICAgIHZhciBzaWduID0gdGV4dFt0ZXh0UG9pbnRlcl0uY2hhckF0KDApO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGxpbmUgPSBkZWNvZGVVUkkodGV4dFt0ZXh0UG9pbnRlcl0uc3Vic3RyaW5nKDEpKTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIC8vIE1hbGZvcm1lZCBVUkkgc2VxdWVuY2UuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSWxsZWdhbCBlc2NhcGUgaW4gcGF0Y2hfZnJvbVRleHQ6ICcgKyBsaW5lKTtcbiAgICAgIH1cbiAgICAgIGlmIChzaWduID09ICctJykge1xuICAgICAgICAvLyBEZWxldGlvbi5cbiAgICAgICAgcGF0Y2guZGlmZnMucHVzaChbRElGRl9ERUxFVEUsIGxpbmVdKTtcbiAgICAgIH0gZWxzZSBpZiAoc2lnbiA9PSAnKycpIHtcbiAgICAgICAgLy8gSW5zZXJ0aW9uLlxuICAgICAgICBwYXRjaC5kaWZmcy5wdXNoKFtESUZGX0lOU0VSVCwgbGluZV0pO1xuICAgICAgfSBlbHNlIGlmIChzaWduID09ICcgJykge1xuICAgICAgICAvLyBNaW5vciBlcXVhbGl0eS5cbiAgICAgICAgcGF0Y2guZGlmZnMucHVzaChbRElGRl9FUVVBTCwgbGluZV0pO1xuICAgICAgfSBlbHNlIGlmIChzaWduID09ICdAJykge1xuICAgICAgICAvLyBTdGFydCBvZiBuZXh0IHBhdGNoLlxuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSBpZiAoc2lnbiA9PT0gJycpIHtcbiAgICAgICAgLy8gQmxhbmsgbGluZT8gIFdoYXRldmVyLlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV1RGP1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGF0Y2ggbW9kZSBcIicgKyBzaWduICsgJ1wiIGluOiAnICsgbGluZSk7XG4gICAgICB9XG4gICAgICB0ZXh0UG9pbnRlcisrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGF0Y2hlcztcbn07XG5cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgb25lIHBhdGNoIG9wZXJhdGlvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5kaWZmX21hdGNoX3BhdGNoLnBhdGNoX29iaiA9IGZ1bmN0aW9uKCkge1xuICAvKiogQHR5cGUgeyFBcnJheS48IWRpZmZfbWF0Y2hfcGF0Y2guRGlmZj59ICovXG4gIHRoaXMuZGlmZnMgPSBbXTtcbiAgLyoqIEB0eXBlIHs/bnVtYmVyfSAqL1xuICB0aGlzLnN0YXJ0MSA9IG51bGw7XG4gIC8qKiBAdHlwZSB7P251bWJlcn0gKi9cbiAgdGhpcy5zdGFydDIgPSBudWxsO1xuICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgdGhpcy5sZW5ndGgxID0gMDtcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG4gIHRoaXMubGVuZ3RoMiA9IDA7XG59O1xuXG5cbi8qKlxuICogRW1tdWxhdGUgR05VIGRpZmYncyBmb3JtYXQuXG4gKiBIZWFkZXI6IEBAIC0zODIsOCArNDgxLDkgQEBcbiAqIEluZGljaWVzIGFyZSBwcmludGVkIGFzIDEtYmFzZWQsIG5vdCAwLWJhc2VkLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgR05VIGRpZmYgc3RyaW5nLlxuICovXG5kaWZmX21hdGNoX3BhdGNoLnBhdGNoX29iai5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNvb3JkczEsIGNvb3JkczI7XG4gIGlmICh0aGlzLmxlbmd0aDEgPT09IDApIHtcbiAgICBjb29yZHMxID0gdGhpcy5zdGFydDEgKyAnLDAnO1xuICB9IGVsc2UgaWYgKHRoaXMubGVuZ3RoMSA9PSAxKSB7XG4gICAgY29vcmRzMSA9IHRoaXMuc3RhcnQxICsgMTtcbiAgfSBlbHNlIHtcbiAgICBjb29yZHMxID0gKHRoaXMuc3RhcnQxICsgMSkgKyAnLCcgKyB0aGlzLmxlbmd0aDE7XG4gIH1cbiAgaWYgKHRoaXMubGVuZ3RoMiA9PT0gMCkge1xuICAgIGNvb3JkczIgPSB0aGlzLnN0YXJ0MiArICcsMCc7XG4gIH0gZWxzZSBpZiAodGhpcy5sZW5ndGgyID09IDEpIHtcbiAgICBjb29yZHMyID0gdGhpcy5zdGFydDIgKyAxO1xuICB9IGVsc2Uge1xuICAgIGNvb3JkczIgPSAodGhpcy5zdGFydDIgKyAxKSArICcsJyArIHRoaXMubGVuZ3RoMjtcbiAgfVxuICB2YXIgdGV4dCA9IFsnQEAgLScgKyBjb29yZHMxICsgJyArJyArIGNvb3JkczIgKyAnIEBAXFxuJ107XG4gIHZhciBvcDtcbiAgLy8gRXNjYXBlIHRoZSBib2R5IG9mIHRoZSBwYXRjaCB3aXRoICV4eCBub3RhdGlvbi5cbiAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmRpZmZzLmxlbmd0aDsgeCsrKSB7XG4gICAgc3dpdGNoICh0aGlzLmRpZmZzW3hdWzBdKSB7XG4gICAgICBjYXNlIERJRkZfSU5TRVJUOlxuICAgICAgICBvcCA9ICcrJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERJRkZfREVMRVRFOlxuICAgICAgICBvcCA9ICctJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERJRkZfRVFVQUw6XG4gICAgICAgIG9wID0gJyAnO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdGV4dFt4ICsgMV0gPSBvcCArIGVuY29kZVVSSSh0aGlzLmRpZmZzW3hdWzFdKSArICdcXG4nO1xuICB9XG4gIHJldHVybiB0ZXh0LmpvaW4oJycpLnJlcGxhY2UoLyUyMC9nLCAnICcpO1xufTtcblxuXG4vLyBFeHBvcnQgdGhlc2UgZ2xvYmFsIHZhcmlhYmxlcyBzbyB0aGF0IHRoZXkgc3Vydml2ZSBHb29nbGUncyBKUyBjb21waWxlci5cbi8vIEluIGEgYnJvd3NlciwgJ3RoaXMnIHdpbGwgYmUgJ3dpbmRvdycuXG4vLyBJbiBub2RlLmpzICd0aGlzJyB3aWxsIGJlIGEgZ2xvYmFsIG9iamVjdC5cbnRoaXNbJ2RpZmZfbWF0Y2hfcGF0Y2gnXSA9IGRpZmZfbWF0Y2hfcGF0Y2g7XG50aGlzWydESUZGX0RFTEVURSddID0gRElGRl9ERUxFVEU7XG50aGlzWydESUZGX0lOU0VSVCddID0gRElGRl9JTlNFUlQ7XG50aGlzWydESUZGX0VRVUFMJ10gPSBESUZGX0VRVUFMO1xuXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vanNvbmRpZmZwYXRjaC9wdWJsaWMvZXh0ZXJuYWwvZGlmZl9tYXRjaF9wYXRjaF91bmNvbXByZXNzZWQuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XG52YXIgZXNjYXBlU3RyaW5nUmVnZXhwID0gcmVxdWlyZSgnZXNjYXBlLXN0cmluZy1yZWdleHAnKTtcbnZhciBhbnNpU3R5bGVzID0gcmVxdWlyZSgnYW5zaS1zdHlsZXMnKTtcbnZhciBzdHJpcEFuc2kgPSByZXF1aXJlKCdzdHJpcC1hbnNpJyk7XG52YXIgaGFzQW5zaSA9IHJlcXVpcmUoJ2hhcy1hbnNpJyk7XG52YXIgc3VwcG9ydHNDb2xvciA9IHJlcXVpcmUoJ3N1cHBvcnRzLWNvbG9yJyk7XG52YXIgZGVmaW5lUHJvcHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcbnZhciBjaGFsayA9IG1vZHVsZS5leHBvcnRzO1xuXG5mdW5jdGlvbiBidWlsZChfc3R5bGVzKSB7XG5cdHZhciBidWlsZGVyID0gZnVuY3Rpb24gYnVpbGRlcigpIHtcblx0XHRyZXR1cm4gYXBwbHlTdHlsZS5hcHBseShidWlsZGVyLCBhcmd1bWVudHMpO1xuXHR9O1xuXHRidWlsZGVyLl9zdHlsZXMgPSBfc3R5bGVzO1xuXHQvLyBfX3Byb3RvX18gaXMgdXNlZCBiZWNhdXNlIHdlIG11c3QgcmV0dXJuIGEgZnVuY3Rpb24sIGJ1dCB0aGVyZSBpc1xuXHQvLyBubyB3YXkgdG8gY3JlYXRlIGEgZnVuY3Rpb24gd2l0aCBhIGRpZmZlcmVudCBwcm90b3R5cGUuXG5cdGJ1aWxkZXIuX19wcm90b19fID0gcHJvdG87XG5cdHJldHVybiBidWlsZGVyO1xufVxuXG52YXIgc3R5bGVzID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHJldCA9IHt9O1xuXG5cdGFuc2lTdHlsZXMuZ3JleSA9IGFuc2lTdHlsZXMuZ3JheTtcblxuXHRPYmplY3Qua2V5cyhhbnNpU3R5bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRhbnNpU3R5bGVzW2tleV0uY2xvc2VSZSA9IG5ldyBSZWdFeHAoZXNjYXBlU3RyaW5nUmVnZXhwKGFuc2lTdHlsZXNba2V5XS5jbG9zZSksICdnJyk7XG5cblx0XHRyZXRba2V5XSA9IHtcblx0XHRcdGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gYnVpbGQodGhpcy5fc3R5bGVzLmNvbmNhdChrZXkpKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcblxuXHRyZXR1cm4gcmV0O1xufSkoKTtcblxudmFyIHByb3RvID0gZGVmaW5lUHJvcHMoZnVuY3Rpb24gY2hhbGsoKSB7fSwgc3R5bGVzKTtcblxuZnVuY3Rpb24gYXBwbHlTdHlsZSgpIHtcblx0Ly8gc3VwcG9ydCB2YXJhZ3MsIGJ1dCBzaW1wbHkgY2FzdCB0byBzdHJpbmcgaW4gY2FzZSB0aGVyZSdzIG9ubHkgb25lIGFyZ1xuXHR2YXIgYXJncyA9IGFyZ3VtZW50cztcblx0dmFyIGFyZ3NMZW4gPSBhcmdzLmxlbmd0aDtcblx0dmFyIHN0ciA9IGFyZ3NMZW4gIT09IDAgJiYgU3RyaW5nKGFyZ3VtZW50c1swXSk7XG5cdGlmIChhcmdzTGVuID4gMSkge1xuXHRcdC8vIGRvbid0IHNsaWNlIGBhcmd1bWVudHNgLCBpdCBwcmV2ZW50cyB2OCBvcHRpbWl6YXRpb25zXG5cdFx0Zm9yICh2YXIgYSA9IDE7IGEgPCBhcmdzTGVuOyBhKyspIHtcblx0XHRcdHN0ciArPSAnICcgKyBhcmdzW2FdO1xuXHRcdH1cblx0fVxuXG5cdGlmICghY2hhbGsuZW5hYmxlZCB8fCAhc3RyKSB7XG5cdFx0cmV0dXJuIHN0cjtcblx0fVxuXG5cdC8qanNoaW50IHZhbGlkdGhpczogdHJ1ZSovXG5cdHZhciBuZXN0ZWRTdHlsZXMgPSB0aGlzLl9zdHlsZXM7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBuZXN0ZWRTdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgY29kZSA9IGFuc2lTdHlsZXNbbmVzdGVkU3R5bGVzW2ldXTtcblx0XHQvLyBSZXBsYWNlIGFueSBpbnN0YW5jZXMgYWxyZWFkeSBwcmVzZW50IHdpdGggYSByZS1vcGVuaW5nIGNvZGVcblx0XHQvLyBvdGhlcndpc2Ugb25seSB0aGUgcGFydCBvZiB0aGUgc3RyaW5nIHVudGlsIHNhaWQgY2xvc2luZyBjb2RlXG5cdFx0Ly8gd2lsbCBiZSBjb2xvcmVkLCBhbmQgdGhlIHJlc3Qgd2lsbCBzaW1wbHkgYmUgJ3BsYWluJy5cblx0XHRzdHIgPSBjb2RlLm9wZW4gKyBzdHIucmVwbGFjZShjb2RlLmNsb3NlUmUsIGNvZGUub3BlbikgKyBjb2RlLmNsb3NlO1xuXHR9XG5cblx0cmV0dXJuIHN0cjtcbn1cblxuZnVuY3Rpb24gaW5pdCgpIHtcblx0dmFyIHJldCA9IHt9O1xuXG5cdE9iamVjdC5rZXlzKHN0eWxlcykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuXHRcdHJldFtuYW1lXSA9IHtcblx0XHRcdGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gYnVpbGQoW25hbWVdKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcblxuXHRyZXR1cm4gcmV0O1xufVxuXG5kZWZpbmVQcm9wcyhjaGFsaywgaW5pdCgpKTtcblxuY2hhbGsuc3R5bGVzID0gYW5zaVN0eWxlcztcbmNoYWxrLmhhc0NvbG9yID0gaGFzQW5zaTtcbmNoYWxrLnN0cmlwQ29sb3IgPSBzdHJpcEFuc2k7XG5jaGFsay5zdXBwb3J0c0NvbG9yID0gc3VwcG9ydHNDb2xvcjtcblxuLy8gZGV0ZWN0IG1vZGUgaWYgbm90IHNldCBtYW51YWxseVxuaWYgKGNoYWxrLmVuYWJsZWQgPT09IHVuZGVmaW5lZCkge1xuXHRjaGFsay5lbmFibGVkID0gY2hhbGsuc3VwcG9ydHNDb2xvcjtcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9qc29uZGlmZnBhdGNoL34vY2hhbGsvaW5kZXguanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciBtYXRjaE9wZXJhdG9yc1JlID0gL1t8XFxcXHt9KClbXFxdXiQrKj8uXS9nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0aWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBzdHJpbmcnKTtcblx0fVxuXG5cdHJldHVybiBzdHIucmVwbGFjZShtYXRjaE9wZXJhdG9yc1JlLCAgJ1xcXFwkJicpO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9qc29uZGlmZnBhdGNoL34vY2hhbGsvfi9lc2NhcGUtc3RyaW5nLXJlZ2V4cC9pbmRleC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHlsZXMgPSBtb2R1bGUuZXhwb3J0cztcblxudmFyIGNvZGVzID0ge1xuXHRyZXNldDogWzAsIDBdLFxuXG5cdGJvbGQ6IFsxLCAyMl0sIC8vIDIxIGlzbid0IHdpZGVseSBzdXBwb3J0ZWQgYW5kIDIyIGRvZXMgdGhlIHNhbWUgdGhpbmdcblx0ZGltOiBbMiwgMjJdLFxuXHRpdGFsaWM6IFszLCAyM10sXG5cdHVuZGVybGluZTogWzQsIDI0XSxcblx0aW52ZXJzZTogWzcsIDI3XSxcblx0aGlkZGVuOiBbOCwgMjhdLFxuXHRzdHJpa2V0aHJvdWdoOiBbOSwgMjldLFxuXG5cdGJsYWNrOiBbMzAsIDM5XSxcblx0cmVkOiBbMzEsIDM5XSxcblx0Z3JlZW46IFszMiwgMzldLFxuXHR5ZWxsb3c6IFszMywgMzldLFxuXHRibHVlOiBbMzQsIDM5XSxcblx0bWFnZW50YTogWzM1LCAzOV0sXG5cdGN5YW46IFszNiwgMzldLFxuXHR3aGl0ZTogWzM3LCAzOV0sXG5cdGdyYXk6IFs5MCwgMzldLFxuXG5cdGJnQmxhY2s6IFs0MCwgNDldLFxuXHRiZ1JlZDogWzQxLCA0OV0sXG5cdGJnR3JlZW46IFs0MiwgNDldLFxuXHRiZ1llbGxvdzogWzQzLCA0OV0sXG5cdGJnQmx1ZTogWzQ0LCA0OV0sXG5cdGJnTWFnZW50YTogWzQ1LCA0OV0sXG5cdGJnQ3lhbjogWzQ2LCA0OV0sXG5cdGJnV2hpdGU6IFs0NywgNDldXG59O1xuXG5PYmplY3Qua2V5cyhjb2RlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdHZhciB2YWwgPSBjb2Rlc1trZXldO1xuXHR2YXIgc3R5bGUgPSBzdHlsZXNba2V5XSA9IHt9O1xuXHRzdHlsZS5vcGVuID0gJ1xcdTAwMWJbJyArIHZhbFswXSArICdtJztcblx0c3R5bGUuY2xvc2UgPSAnXFx1MDAxYlsnICsgdmFsWzFdICsgJ20nO1xufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vanNvbmRpZmZwYXRjaC9+L2NoYWxrL34vYW5zaS1zdHlsZXMvaW5kZXguanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XG52YXIgYW5zaVJlZ2V4ID0gcmVxdWlyZSgnYW5zaS1yZWdleCcpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0cikge1xuXHRyZXR1cm4gdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgPyBzdHIucmVwbGFjZShhbnNpUmVnZXgsICcnKSA6IHN0cjtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vanNvbmRpZmZwYXRjaC9+L2NoYWxrL34vc3RyaXAtYW5zaS9pbmRleC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBhbnNpUmVnZXggPSByZXF1aXJlKCdhbnNpLXJlZ2V4Jyk7XG52YXIgcmUgPSBuZXcgUmVnRXhwKGFuc2lSZWdleCgpLnNvdXJjZSk7IC8vIHJlbW92ZSB0aGUgYGdgIGZsYWdcbm1vZHVsZS5leHBvcnRzID0gcmUudGVzdC5iaW5kKHJlKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9qc29uZGlmZnBhdGNoL34vY2hhbGsvfi9oYXMtYW5zaS9pbmRleC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcblx0aWYgKHByb2Nlc3MuYXJndi5pbmRleE9mKCctLW5vLWNvbG9yJykgIT09IC0xKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aWYgKHByb2Nlc3MuYXJndi5pbmRleE9mKCctLWNvbG9yJykgIT09IC0xKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRpZiAocHJvY2Vzcy5zdGRvdXQgJiYgIXByb2Nlc3Muc3Rkb3V0LmlzVFRZKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGlmICgnQ09MT1JURVJNJyBpbiBwcm9jZXNzLmVudikge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0aWYgKHByb2Nlc3MuZW52LlRFUk0gPT09ICdkdW1iJykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGlmICgvXnNjcmVlbnxeeHRlcm18XnZ0MTAwfGNvbG9yfGFuc2l8Y3lnd2lufGxpbnV4L2kudGVzdChwcm9jZXNzLmVudi5URVJNKSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlO1xufSkoKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9qc29uZGlmZnBhdGNoL34vY2hhbGsvfi9zdXBwb3J0cy1jb2xvci9pbmRleC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gL1xcdTAwMWJcXFsoPzpbMC05XXsxLDN9KD86O1swLTldezEsM30pKik/W218S10vZztcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vanNvbmRpZmZwYXRjaC9+L2NoYWxrL34vc3RyaXAtYW5zaS9+L2Fuc2ktcmVnZXgvaW5kZXguanNcbiAqKi8iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L25vZGUtbGlicy1icm93c2VyL34vcHJvY2Vzcy9icm93c2VyLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiAvXFx1MDAxYlxcWyg/OlswLTldezEsM30oPzo7WzAtOV17MSwzfSkqKT9bbXxLXS9nO1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9qc29uZGlmZnBhdGNoL34vY2hhbGsvfi9oYXMtYW5zaS9+L2Fuc2ktcmVnZXgvaW5kZXguanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9