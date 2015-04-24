(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JSONAPI = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Resource = require('./lib/Resource');

var _Resource2 = _interopRequireWildcard(_Resource);

var _MemoryPool = require('./lib/MemoryPool');

var _MemoryPool2 = _interopRequireWildcard(_MemoryPool);

var _RestPool = require('./lib/RestPool');

var _RestPool2 = _interopRequireWildcard(_RestPool);

var _Pool = require('./lib/Pool');

var _Pool2 = _interopRequireWildcard(_Pool);

var _RESTful = require('./lib/RESTful');

var _RESTful2 = _interopRequireWildcard(_RESTful);

var _Transaction = require('./lib/Transaction');

var _Transaction2 = _interopRequireWildcard(_Transaction);

var _PoolConnector = require('./lib/PoolConnector');

var _PoolConnector2 = _interopRequireWildcard(_PoolConnector);

exports.Transaction = _Transaction2['default'];
exports.Resource = _Resource2['default'];
exports.MemoryPool = _MemoryPool2['default'];
exports.RestPool = _RestPool2['default'];
exports.Pool = _Pool2['default'];
exports.RESTful = _RESTful2['default'];
exports.PoolConnector = _PoolConnector2['default'];

},{"./lib/MemoryPool":2,"./lib/Pool":4,"./lib/PoolConnector":5,"./lib/RESTful":6,"./lib/Resource":7,"./lib/RestPool":9,"./lib/Transaction":10}],2:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Q = require('q');

var _Q2 = _interopRequireWildcard(_Q);

var _Events = require('backbone');

var _Resource = require('./Resource');

var _Resource2 = _interopRequireWildcard(_Resource);

var _Pool2 = require('./Pool');

var _Pool3 = _interopRequireWildcard(_Pool2);

var _Operation = require('./Operation');

var _Operation2 = _interopRequireWildcard(_Operation);

var MemoryPool = (function (_Pool) {
  function MemoryPool(resources) {
    _classCallCheck(this, MemoryPool);

    _get(Object.getPrototypeOf(MemoryPool.prototype), 'constructor', this).call(this, resources);
  }

  _inherits(MemoryPool, _Pool);

  _createClass(MemoryPool, [{
    key: 'create',
    value: function create(attributes, options) {
      var _this = this;

      options = _import2['default'].defaults(options || {}, {
        byOperation: false
      });

      return _Q2['default'].fcall(function () {
        return new _Resource2['default'](attributes, options);
      }).then(function (resource) {
        return _this.add(resource, { create: true });
      }).then(function (resource) {
        if (!options.byOperation) {
          _this._triggerTransform('add', resource);
        }
        return resource;
      });
    }
  }, {
    key: 'patch',
    value: function patch(resource, attributes, options) {
      var _this2 = this;

      options = _import2['default'].defaults(options || {}, {
        byOperation: false
      });

      var setArguments = _import2['default'].toArray(arguments).slice(1);

      return _Q2['default'].fcall(function () {
        resource.set.apply(resource, setArguments);
        if (!options.byOperation) {
          _this2._triggerTransform('replace', resource);
        }
        return resource;
      });
    }
  }, {
    key: 'remove',
    value: function remove(resource, options) {
      var _this3 = this;

      options = _import2['default'].defaults(options || {}, {
        byOperation: false
      });

      return _Q2['default'].fcall(function () {
        _this3.stopListening(resource);
        delete _this3.pool[resource.getLink('self')];
        if (!options.byOperation) {
          _this3._triggerTransform('remove', resource);
        }
        return resource;
      });
    }
  }, {
    key: 'get',
    value: function get(urlOrLinkage) {

      var url = this._toURL(urlOrLinkage);
      var resource = this.pool[url];

      if (!resource) {
        resource = _import2['default'].filter(this.pool, function (resource, resourceUrl) {
          return _import2['default'].startsWith(resourceUrl, url);
        });
        if (_import2['default'].isEmpty(resource)) {
          resource = undefined;
        }
      }

      return _Q2['default'].fcall(function () {
        return resource;
      });
    }
  }, {
    key: 'getURL',
    value: function getURL(type, id) {

      var url = '/' + type + '/';

      if (id) {
        url = url + id;
      }

      return url;
    }
  }, {
    key: '_toURL',
    value: function _toURL(urlOrLinkage) {

      var url = undefined;
      if (_import2['default'].startsWith(urlOrLinkage, '/')) {
        url = urlOrLinkage;
      } else {
        var linkage = urlOrLinkage;
        url = this.getURL(linkage.type, linkage.id);
      }
      return url;
    }
  }, {
    key: 'find',
    value: function find(predicate) {
      var _this4 = this;

      return _Q2['default'].fcall(function () {
        return _import2['default'].find(_this4.pool, predicate);
      });
    }
  }]);

  return MemoryPool;
})(_Pool3['default']);

exports['default'] = MemoryPool;
module.exports = exports['default'];

},{"./Operation":3,"./Pool":4,"./Resource":7,"backbone":"backbone","lodash":"lodash","q":"q"}],3:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _ = require('lodash');

var Operation = function Operation(op, resource) {
  _classCallCheck(this, Operation);

  this.op = op;
  this.path = resource.getLink('self');
  if (op !== 'remove') {
    this.value = resource.deserialize();
    this.value = _.omit(this.value, 'id');
    this.value = _.omit(this.value, 'links');
  }
  if (op === 'add') {}
};

exports['default'] = Operation;
module.exports = exports['default'];

},{"lodash":"lodash"}],4:[function(require,module,exports){
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

var _Resource = require('./Resource');

var _Resource2 = _interopRequireWildcard(_Resource);

var _Operation = require('./Operation');

var _Operation2 = _interopRequireWildcard(_Operation);

var Pool = (function () {
  function Pool(resources) {
    _classCallCheck(this, Pool);

    _import2['default'].extend(this, _Events.Events);
    this.pool = {};
    _import2['default'].each(resources, this.add, this);
  }

  _createClass(Pool, [{
    key: 'create',
    value: function create(attributes, options) {}
  }, {
    key: 'remove',
    value: function remove(resource) {}
  }, {
    key: 'get',
    value: function get(id) {}
  }, {
    key: 'getURL',
    value: function getURL(type, id) {}
  }, {
    key: 'add',
    value: function add(resource, options) {

      options = _import2['default'].defaults(options || {}, {
        byOperation: false,
        create: false
      });

      var _addToPool = (function (resource) {
        if (!this.pool[resource.getLink('self')]) {
          this.pool[resource.getLink('self')] = resource;
          if (!options.create && !options.byOperation) {
            this._triggerAdd(resource);
          }
        }
      }).bind(this);

      _import2['default'].isArray(resource) ? _import2['default'].each(resource, function (resource) {
        return _addToPool(resource);
      }) : _addToPool(resource);

      return _Q2['default'].fcall(function () {
        return resource;
      });
    }
  }, {
    key: '_triggerTransform',
    value: function _triggerTransform(op, resource) {

      this.trigger('transform', new _Operation2['default'](op, resource));
    }
  }, {
    key: '_triggerAdd',
    value: function _triggerAdd(resource) {

      this.trigger('add', resource);
    }
  }]);

  return Pool;
})();

exports['default'] = Pool;
module.exports = exports['default'];

// implement this// implement this

// implement this

// implement this

// implement this

},{"./Operation":3,"./Resource":7,"backbone":"backbone","lodash":"lodash","q":"q"}],5:[function(require,module,exports){
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

var _Resource = require('./Resource');

var _Resource2 = _interopRequireWildcard(_Resource);

var _Pool = require('./Pool');

var _Pool2 = _interopRequireWildcard(_Pool);

var PoolConnector = (function () {
  function PoolConnector(source, target) {
    var options = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, PoolConnector);

    _import2['default'].extend(this, _Events.Events);

    this.source = source;
    this.target = target;
    this.sourceToTarget = {};
    this.operations = [];

    this.listenTo(this.source, 'transform', this._onTrasnform);
    this.listenTo(this.source, 'add', this._onAdd);
    // this.stopListening(source, "transform");
  }

  _createClass(PoolConnector, [{
    key: 'getReplica',
    value: function getReplica(resourceOrURL) {

      var url = _import2['default'].isString(resourceOrURL) ? resourceOrURL : resourceOrURL.getLink('self');

      return this.target.get(this.getReplicatedURL(url));
    }
  }, {
    key: 'getReplicatedURL',
    value: function getReplicatedURL(url) {

      return this.sourceToTarget[url];
    }
  }, {
    key: '_onTrasnform',
    value: function _onTrasnform(operation) {

      this.operations.push(operation);
    }
  }, {
    key: '_onAdd',
    value: function _onAdd(resource) {

      var clonedResource = resource.clone();
      this._addReplicaLink(resource, clonedResource);
      return this.target.add(clonedResource, {
        byOperation: false
      });
    }
  }, {
    key: 'flush',
    value: function flush() {
      var _this = this;

      return _Q2['default'].fcall(function () {
        return _import2['default'].reduce(_this.operations, function (promise, operation) {
          return promise.then(function () {
            return _this._applyOperationToTarget(operation);
          });
        }, _Q2['default']());
      }).then(function () {
        _this._cleanQueues();
      });
    }
  }, {
    key: '_cleanQueues',
    value: function _cleanQueues() {

      this.operations = [];
    }
  }, {
    key: '_applyOperationToTarget',
    value: function _applyOperationToTarget(operation) {
      var _this2 = this;

      var op = operation.op;
      var value = operation.value;
      var path = operation.path;

      if (op === 'add') {

        return this.target.create(value, {
          byOperation: true }).then(function (resource) {
          var url = resource.getLink('self');
          _this2._addReplicaLink(path, resource);
          return resource;
        });
      } else if (op === 'replace') {

        return this.getReplica(path).then(function (targetResource) {
          return _this2.target.patch(targetResource, value, {
            byOperation: true
          });
        });
      } else if (op === 'remove') {

        return this.getReplica(path).then(function (targetResource) {
          return _this2.target.remove(targetResource, {
            byOperation: true
          });
        });
      }
    }
  }, {
    key: '_addReplicaLink',
    value: function _addReplicaLink(source, target) {

      var sourceURL = source;
      if (!_import2['default'].isString(source)) {
        sourceURL = source.getLink('self');
      }

      var targetURL = target;
      if (!_import2['default'].isString(target)) {
        targetURL = target.getLink('self');
      }

      this.sourceToTarget[sourceURL] = targetURL;
    }
  }]);

  return PoolConnector;
})();

exports['default'] = PoolConnector;
module.exports = exports['default'];

},{"./Pool":4,"./Resource":7,"backbone":"backbone","lodash":"lodash","q":"q"}],6:[function(require,module,exports){
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

},{"./Response":8,"jquery":"jquery","lodash":"lodash","q":"q"}],7:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Model2 = require('backbone');

var _uuid = require('node-uuid');

var _uuid2 = _interopRequireWildcard(_uuid);

var isValidAttrs = function isValidAttrs(data) {
  return data && data.type;
};

var Resource = (function (_Model) {
  function Resource(attributes, options) {
    _classCallCheck(this, Resource);

    options = options || {};
    _import2['default'].defaults(options, { parse: true });

    _get(Object.getPrototypeOf(Resource.prototype), 'constructor', this).call(this, attributes, options);

    if (!this.id) {
      this.id = _uuid2['default'].v4();
    }
    if (!this.getLink('self')) {
      var json = this.toJSON();
      this.setLink('self', '/' + json.type + '/' + this.id);
    }
  }

  _inherits(Resource, _Model);

  _createClass(Resource, [{
    key: 'setLink',
    value: function setLink(key, resource) {

      var url = _import2['default'].isString(resource) ? resource : resource.getLink('self');
      this.links[key] = url;
      this.trigger('add:link', key, this.links[key]);
    }
  }, {
    key: 'removeLink',
    value: function removeLink(key) {

      if (key === 'self') {
        throw new Error('self link is not able to removed!');
      }
      var removedLink = this.links[key];
      delete this.links[key];
      this.trigger('remove:link', key, removedLink);
    }
  }, {
    key: 'getLink',
    value: function getLink(key) {

      return this.links[key];
    }
  }, {
    key: 'parse',
    value: function parse(data) {

      if (!isValidAttrs(data)) {
        throw new Error('invalid data! type should be provided');
      }
      this.links = data.links || {};
      return _import2['default'].omit(data, 'links');
    }
  }, {
    key: 'deserialize',
    value: function deserialize() {

      var data = _import2['default'].clone(this.attributes, true);
      data.links = _import2['default'].clone(this.links, true);
      return data;
    }
  }, {
    key: 'clone',
    value: function clone() {

      return new Resource(this.deserialize(), { parse: true });
    }
  }]);

  return Resource;
})(_Model2.Model);

exports['default'] = Resource;
module.exports = exports['default'];

},{"backbone":"backbone","lodash":"lodash","node-uuid":"node-uuid"}],8:[function(require,module,exports){
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

},{"lodash":"lodash"}],9:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _$ = require('jquery');

var _$2 = _interopRequireWildcard(_$);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Q = require('q');

var _Q2 = _interopRequireWildcard(_Q);

var _Events = require('backbone');

var _Resource = require('./Resource');

var _Resource2 = _interopRequireWildcard(_Resource);

var _Pool2 = require('./Pool');

var _Pool3 = _interopRequireWildcard(_Pool2);

var _Operation = require('./Operation');

var _Operation2 = _interopRequireWildcard(_Operation);

var _RESTful = require('./RESTful');

var _RESTful2 = _interopRequireWildcard(_RESTful);

var RestPool = (function (_Pool) {
  function RestPool(resources, options) {
    _classCallCheck(this, RestPool);

    options = options || {};

    _get(Object.getPrototypeOf(RestPool.prototype), 'constructor', this).call(this, resources, options);
    this.syncronizer = _RESTful2['default'];
    this.typeToUrl = options.typeToUrl || {};
  }

  _inherits(RestPool, _Pool);

  _createClass(RestPool, [{
    key: 'setURL',
    value: function setURL(type, url) {

      this.typeToUrl[type] = url;
    }
  }, {
    key: 'create',
    value: function create(attributes, options) {
      var _this = this;

      options = _import2['default'].defaults(options || {}, {
        byOperation: false
      });

      return _Q2['default'].fcall(function () {
        return _this.syncronizer.post(_this.getURL(attributes.type), {
          data: _import2['default'].omit(attributes, 'id', 'links')
        });
      }).then(function (response) {
        return new _Resource2['default'](response.data, options);
      }).then(function (resource) {
        return _this.add(resource, { create: true });
      }).then(function (resource) {
        if (!options.byOperation) {
          _this._triggerTransform('add', resource);
        }
        return resource;
      });
    }
  }, {
    key: 'patch',
    value: function patch(resource, attributes, options) {
      var _this2 = this;

      options = _import2['default'].defaults(options || {}, {
        byOperation: false
      });

      var setArguments = _import2['default'].toArray(arguments).slice(1);

      return _Q2['default'].fcall(function () {
        resource.set.apply(resource, setArguments);
        return resource;
      }).then(function (resource) {
        return _this2.syncronizer.patch(resource.getLink('self'), _this2._toResponse(resource));
      }).then(function (response) {
        resource.set.apply(resource, response.data);
        return resource;
      }).then(function () {
        if (!options.byOperation) {
          _this2._triggerTransform('replace', resource);
        }
        return resource;
      });
    }
  }, {
    key: 'remove',
    value: function remove(resource, options) {
      var _this3 = this;

      options = _import2['default'].defaults(options || {}, {
        byOperation: false
      });

      return _Q2['default'].fcall(function () {
        return _this3.syncronizer['delete'](resource.getLink('self'));
      }).then(function (response) {
        _this3.stopListening(resource);
        delete _this3.pool[resource.getLink('self')];
        if (!options.byOperation) {
          _this3._triggerTransform('remove', resource);
        }
        return resource;
      });
    }
  }, {
    key: 'get',
    value: function get(urlOrLinkage, options) {
      var _this4 = this;

      var url = this._toURL(urlOrLinkage);

      return _Q2['default'].fcall(function () {
        return _this4.syncronizer.get(url, options);
      }).then(function (response) {
        if (_import2['default'].isArray(response.data)) {
          return _import2['default'].map(response.data, function (data) {
            return _this4._refreshOrCreate(data);
          });
        }

        return _this4._refreshOrCreate(response.data);
      });
    }
  }, {
    key: 'getURL',
    value: function getURL(type, id) {

      var url = this.typeToUrl[type];

      if (!url) {
        throw new Error('type[' + type + '] is not supported!');
      }

      if (id) {
        url = url + id;
      }

      return url;
    }
  }, {
    key: '_toURL',
    value: function _toURL(urlOrLinkage) {

      var url = undefined;
      if (_import2['default'].startsWith(urlOrLinkage, '/')) {
        url = urlOrLinkage;
      } else {
        var linkage = urlOrLinkage;
        url = this.getURL(linkage.type, linkage.id);
      }
      return url;
    }
  }, {
    key: '_toResponse',
    value: function _toResponse(resource) {

      return _import2['default'].clone({
        data: resource.deserialize()
      }, true);
    }
  }, {
    key: '_refreshOrCreate',
    value: function _refreshOrCreate(data) {

      var resource = this.pool[data.links.self];

      if (resource) {
        resource.set(data, { parse: true });
      } else {
        resource = new _Resource2['default'](data);
      }
      return resource;
    }
  }]);

  return RestPool;
})(_Pool3['default']);

exports['default'] = RestPool;
module.exports = exports['default'];

},{"./Operation":3,"./Pool":4,"./RESTful":6,"./Resource":7,"backbone":"backbone","jquery":"jquery","lodash":"lodash","q":"q"}],10:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9pbmRleC5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9NZW1vcnlQb29sLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvbGliL09wZXJhdGlvbi5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9Qb29sLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvbGliL1Bvb2xDb25uZWN0b3IuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvUkVTVGZ1bC5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9SZXNvdXJjZS5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9SZXNwb25zZS5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9SZXN0UG9vbC5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9UcmFuc2FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O3dCQ0FxQixnQkFBZ0I7Ozs7MEJBQ2Qsa0JBQWtCOzs7O3dCQUNwQixnQkFBZ0I7Ozs7b0JBQ3BCLFlBQVk7Ozs7dUJBQ1QsZUFBZTs7OzsyQkFDWCxtQkFBbUI7Ozs7NkJBQ2pCLHFCQUFxQjs7OztRQUk3QyxXQUFXO1FBQ1gsUUFBUTtRQUNSLFVBQVU7UUFD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SSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztHQUV0Qjs7ZUFWRyxXQUFXOztXQVlULGlCQUFHOztBQUVQLFVBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUVsQjs7O1dBRU0sa0JBQUc7O0FBRVIsVUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBRXBCOzs7V0FHUyxxQkFBRzs7QUFFWCxVQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztLQUVwQjs7O1dBRVcsdUJBQUc7O0FBRWIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDN0QsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FFckI7OztXQUVXLHFCQUFDLFNBQVMsRUFBRTs7QUFFdEIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FFakM7OztTQTVDRyxXQUFXOzs7cUJBZ0RGLFdBQVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlc291cmNlIGZyb20gJy4vbGliL1Jlc291cmNlJztcbmltcG9ydCBNZW1vcnlQb29sIGZyb20gJy4vbGliL01lbW9yeVBvb2wnO1xuaW1wb3J0IFJlc3RQb29sIGZyb20gJy4vbGliL1Jlc3RQb29sJztcbmltcG9ydCBQb29sIGZyb20gJy4vbGliL1Bvb2wnO1xuaW1wb3J0IFJFU1RmdWwgZnJvbSAnLi9saWIvUkVTVGZ1bCc7XG5pbXBvcnQgVHJhbnNhY3Rpb24gZnJvbSAnLi9saWIvVHJhbnNhY3Rpb24nO1xuaW1wb3J0IFBvb2xDb25uZWN0b3IgZnJvbSAnLi9saWIvUG9vbENvbm5lY3Rvcic7XG5cblxuZXhwb3J0IHtcbiAgVHJhbnNhY3Rpb24sXG4gIFJlc291cmNlLFxuICBNZW1vcnlQb29sLFxuICBSZXN0UG9vbCxcbiAgUG9vbCxcbiAgUkVTVGZ1bCxcbiAgUG9vbENvbm5lY3RvclxufTtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCBQb29sIGZyb20gJy4vUG9vbCc7XG5pbXBvcnQgT3BlcmF0aW9uIGZyb20gJy4vT3BlcmF0aW9uJztcblxuXG5jbGFzcyBNZW1vcnlQb29sIGV4dGVuZHMgUG9vbCB7XG5cbiAgY29uc3RydWN0b3IocmVzb3VyY2VzKSB7XG5cbiAgICBzdXBlcihyZXNvdXJjZXMpO1xuXG4gIH1cblxuICBjcmVhdGUgKGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIHtcbiAgICAgIGJ5T3BlcmF0aW9uOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBSZXNvdXJjZShhdHRyaWJ1dGVzLCBvcHRpb25zKTtcbiAgICB9KVxuICAgIC50aGVuKHJlc291cmNlID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFkZChyZXNvdXJjZSwgeyBjcmVhdGU6IHRydWUgfSk7XG4gICAgfSlcbiAgICAudGhlbihyZXNvdXJjZSA9PiB7XG4gICAgICBpZiAoIW9wdGlvbnMuYnlPcGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlclRyYW5zZm9ybSgnYWRkJywgcmVzb3VyY2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgIH0pO1xuXG4gIH1cblxuICBwYXRjaCAocmVzb3VyY2UsIGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIHtcbiAgICAgIGJ5T3BlcmF0aW9uOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgbGV0IHNldEFyZ3VtZW50cyA9IF8udG9BcnJheShhcmd1bWVudHMpLnNsaWNlKDEpO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmVzb3VyY2Uuc2V0LmFwcGx5KHJlc291cmNlLCBzZXRBcmd1bWVudHMpO1xuICAgICAgaWYgKCFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJUcmFuc2Zvcm0oJ3JlcGxhY2UnLCByZXNvdXJjZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHJlbW92ZSAocmVzb3VyY2UsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIHtcbiAgICAgIGJ5T3BlcmF0aW9uOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgdGhpcy5zdG9wTGlzdGVuaW5nKHJlc291cmNlKTtcbiAgICAgIGRlbGV0ZSB0aGlzLnBvb2xbcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpXTtcbiAgICAgIGlmICghb3B0aW9ucy5ieU9wZXJhdGlvbikge1xuICAgICAgICB0aGlzLl90cmlnZ2VyVHJhbnNmb3JtKCdyZW1vdmUnLCByZXNvdXJjZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGdldCAodXJsT3JMaW5rYWdlKSB7XG5cbiAgICBsZXQgdXJsID0gdGhpcy5fdG9VUkwodXJsT3JMaW5rYWdlKTtcbiAgICBsZXQgcmVzb3VyY2UgPSB0aGlzLnBvb2xbdXJsXTtcblxuICAgIGlmICghcmVzb3VyY2UpIHtcbiAgICAgIHJlc291cmNlID0gXy5maWx0ZXIodGhpcy5wb29sLCAocmVzb3VyY2UsIHJlc291cmNlVXJsKSA9PiB7XG4gICAgICAgIHJldHVybiBfLnN0YXJ0c1dpdGgocmVzb3VyY2VVcmwsIHVybCk7XG4gICAgICB9KTtcbiAgICAgIGlmIChfLmlzRW1wdHkocmVzb3VyY2UpKSB7XG4gICAgICAgIHJlc291cmNlID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHJlc291cmNlKTtcblxuICB9XG5cbiAgZ2V0VVJMICh0eXBlLCBpZCkge1xuXG4gICAgbGV0IHVybCA9IGAvJHt0eXBlfS9gO1xuXG4gICAgaWYgKGlkKSB7XG4gICAgICB1cmwgPSB1cmwgKyBpZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xuXG4gIH1cblxuICBfdG9VUkwgKHVybE9yTGlua2FnZSkge1xuXG4gICAgbGV0IHVybDtcbiAgICBpZiAoXy5zdGFydHNXaXRoKHVybE9yTGlua2FnZSwgJy8nKSkge1xuICAgICAgdXJsID0gdXJsT3JMaW5rYWdlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCBsaW5rYWdlID0gdXJsT3JMaW5rYWdlO1xuICAgICAgdXJsID0gdGhpcy5nZXRVUkwobGlua2FnZS50eXBlLCBsaW5rYWdlLmlkKTtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcblxuICB9XG5cbiAgZmluZCAocHJlZGljYXRlKSB7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICByZXR1cm4gXy5maW5kKHRoaXMucG9vbCwgcHJlZGljYXRlKTtcbiAgICB9KTtcblxuICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBNZW1vcnlQb29sO1xuIiwibGV0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuXG5jbGFzcyBPcGVyYXRpb24ge1xuXG4gIGNvbnN0cnVjdG9yIChvcCwgcmVzb3VyY2UpIHtcblxuICAgIHRoaXMub3AgPSBvcDtcbiAgICB0aGlzLnBhdGggPSByZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyk7XG4gICAgaWYgKG9wICE9PSAncmVtb3ZlJykge1xuICAgICAgdGhpcy52YWx1ZSA9IHJlc291cmNlLmRlc2VyaWFsaXplKCk7XG4gICAgICB0aGlzLnZhbHVlID0gXy5vbWl0KHRoaXMudmFsdWUsICdpZCcpO1xuICAgICAgdGhpcy52YWx1ZSA9IF8ub21pdCh0aGlzLnZhbHVlLCAnbGlua3MnKTtcbiAgICB9XG4gICAgaWYgKG9wID09PSAnYWRkJykge1xuICAgIH1cblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgT3BlcmF0aW9uO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xuaW1wb3J0IE9wZXJhdGlvbiBmcm9tICcuL09wZXJhdGlvbic7XG5cblxuY2xhc3MgUG9vbCB7XG5cbiAgY29uc3RydWN0b3IocmVzb3VyY2VzKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLCBFdmVudHMpO1xuICAgIHRoaXMucG9vbCA9IHt9O1xuICAgIF8uZWFjaChyZXNvdXJjZXMsIHRoaXMuYWRkLCB0aGlzKTtcblxuICB9XG5cbiAgY3JlYXRlIChhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG5cbiAgICAvLyBpbXBsZW1lbnQgdGhpcy8vIGltcGxlbWVudCB0aGlzXG5cbiAgfVxuXG4gIHJlbW92ZSAocmVzb3VyY2UpIHtcblxuICAgIC8vIGltcGxlbWVudCB0aGlzXG5cbiAgfVxuXG4gIGdldCAoaWQpIHtcblxuICAgIC8vIGltcGxlbWVudCB0aGlzXG5cbiAgfVxuXG4gIGdldFVSTCAodHlwZSwgaWQpIHtcblxuICAgIC8vIGltcGxlbWVudCB0aGlzXG5cbiAgfVxuXG4gIGFkZCAocmVzb3VyY2UsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIHtcbiAgICAgIGJ5T3BlcmF0aW9uOiBmYWxzZSxcbiAgICAgIGNyZWF0ZTogZmFsc2VcbiAgICB9KTtcblxuICAgIGxldCBfYWRkVG9Qb29sID0gZnVuY3Rpb24gKHJlc291cmNlKSB7XG4gICAgICBpZiAoIXRoaXMucG9vbFtyZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyldKSB7XG4gICAgICAgIHRoaXMucG9vbFtyZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyldID0gcmVzb3VyY2U7XG4gICAgICAgIGlmICghb3B0aW9ucy5jcmVhdGUgJiYgIW9wdGlvbnMuYnlPcGVyYXRpb24pIHtcbiAgICAgICAgICB0aGlzLl90cmlnZ2VyQWRkKHJlc291cmNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIF8uaXNBcnJheShyZXNvdXJjZSkgP1xuICAgICAgXy5lYWNoKHJlc291cmNlLCByZXNvdXJjZSA9PiBfYWRkVG9Qb29sKHJlc291cmNlKSkgOlxuICAgICAgX2FkZFRvUG9vbChyZXNvdXJjZSk7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiByZXNvdXJjZSk7XG5cbiAgfVxuXG4gIF90cmlnZ2VyVHJhbnNmb3JtIChvcCwgcmVzb3VyY2UpIHtcblxuICAgIHRoaXMudHJpZ2dlcigndHJhbnNmb3JtJywgbmV3IE9wZXJhdGlvbihvcCwgcmVzb3VyY2UpKTtcblxuICB9XG5cbiAgX3RyaWdnZXJBZGQgKHJlc291cmNlKSB7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ2FkZCcsIHJlc291cmNlKTtcblxuICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBQb29sO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi9Qb29sJztcblxuY2xhc3MgUG9vbENvbm5lY3RvciB7XG5cbiAgY29uc3RydWN0b3Ioc291cmNlLCB0YXJnZXQsIG9wdGlvbnMgPSB7fSkge1xuXG4gICAgXy5leHRlbmQodGhpcywgRXZlbnRzKTtcblxuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMuc291cmNlVG9UYXJnZXQgPSB7fTtcbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcblxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5zb3VyY2UsIFwidHJhbnNmb3JtXCIsIHRoaXMuX29uVHJhc25mb3JtKTtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMuc291cmNlLCBcImFkZFwiLCB0aGlzLl9vbkFkZCk7XG4gICAgLy8gdGhpcy5zdG9wTGlzdGVuaW5nKHNvdXJjZSwgXCJ0cmFuc2Zvcm1cIik7XG5cbiAgfVxuXG4gIGdldFJlcGxpY2EgKHJlc291cmNlT3JVUkwpIHtcblxuICAgIGxldCB1cmwgPSBfLmlzU3RyaW5nKHJlc291cmNlT3JVUkwpID9cbiAgICAgIHJlc291cmNlT3JVUkwgOiByZXNvdXJjZU9yVVJMLmdldExpbmsoJ3NlbGYnKTtcblxuICAgIHJldHVybiB0aGlzLnRhcmdldC5nZXQoXG4gICAgICB0aGlzLmdldFJlcGxpY2F0ZWRVUkwodXJsKSk7XG5cbiAgfVxuXG4gIGdldFJlcGxpY2F0ZWRVUkwgKHVybCkge1xuXG4gICAgcmV0dXJuIHRoaXMuc291cmNlVG9UYXJnZXRbdXJsXTtcblxuICB9XG5cbiAgX29uVHJhc25mb3JtIChvcGVyYXRpb24pIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucy5wdXNoKG9wZXJhdGlvbik7XG5cbiAgfVxuXG4gIF9vbkFkZCAocmVzb3VyY2UpIHtcblxuICAgIGxldCBjbG9uZWRSZXNvdXJjZSA9IHJlc291cmNlLmNsb25lKCk7XG4gICAgdGhpcy5fYWRkUmVwbGljYUxpbmsocmVzb3VyY2UsIGNsb25lZFJlc291cmNlKTtcbiAgICByZXR1cm4gdGhpcy50YXJnZXQuYWRkKGNsb25lZFJlc291cmNlLCB7XG4gICAgICBieU9wZXJhdGlvbjogZmFsc2VcbiAgICB9KTtcblxuICB9XG5cbiAgZmx1c2ggKCkge1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmV0dXJuIF8ucmVkdWNlKHRoaXMub3BlcmF0aW9ucywgKHByb21pc2UsIG9wZXJhdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlPcGVyYXRpb25Ub1RhcmdldChvcGVyYXRpb24pO1xuICAgICAgICB9KTtcbiAgICAgIH0sIFEoKSlcbiAgICB9KVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuX2NsZWFuUXVldWVzKCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIF9jbGVhblF1ZXVlcyAoKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcblxuICB9XG5cbiAgX2FwcGx5T3BlcmF0aW9uVG9UYXJnZXQgKG9wZXJhdGlvbikge1xuXG4gICAgbGV0IG9wID0gb3BlcmF0aW9uLm9wO1xuICAgIGxldCB2YWx1ZSA9IG9wZXJhdGlvbi52YWx1ZTtcbiAgICBsZXQgcGF0aCA9IG9wZXJhdGlvbi5wYXRoO1xuXG5cbiAgICBpZiAob3AgPT09IFwiYWRkXCIpIHtcblxuICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0LmNyZWF0ZSh2YWx1ZSwge1xuICAgICAgICBieU9wZXJhdGlvbjogdHJ1ZSxcbiAgICAgIH0pXG4gICAgICAudGhlbihyZXNvdXJjZSA9PiB7XG4gICAgICAgIGxldCB1cmwgPSByZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyk7XG4gICAgICAgIHRoaXMuX2FkZFJlcGxpY2FMaW5rKHBhdGgsIHJlc291cmNlKVxuICAgICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgICB9KTtcblxuICAgIH1cbiAgICBlbHNlIGlmIChvcCA9PT0gXCJyZXBsYWNlXCIpIHtcblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVwbGljYShwYXRoKVxuICAgICAgLnRoZW4odGFyZ2V0UmVzb3VyY2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50YXJnZXQucGF0Y2godGFyZ2V0UmVzb3VyY2UsIHZhbHVlLCB7XG4gICAgICAgICAgYnlPcGVyYXRpb246IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIH1cbiAgICBlbHNlIGlmIChvcCA9PT0gXCJyZW1vdmVcIikge1xuXG4gICAgICByZXR1cm4gdGhpcy5nZXRSZXBsaWNhKHBhdGgpXG4gICAgICAudGhlbih0YXJnZXRSZXNvdXJjZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRhcmdldC5yZW1vdmUodGFyZ2V0UmVzb3VyY2UsIHtcbiAgICAgICAgICBieU9wZXJhdGlvbjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgfVxuXG4gIH1cblxuICBfYWRkUmVwbGljYUxpbmsgKHNvdXJjZSwgdGFyZ2V0KSB7XG5cbiAgICBsZXQgc291cmNlVVJMID0gc291cmNlO1xuICAgIGlmICghXy5pc1N0cmluZyhzb3VyY2UpKSB7XG4gICAgICBzb3VyY2VVUkwgPSBzb3VyY2UuZ2V0TGluaygnc2VsZicpXG4gICAgfVxuXG4gICAgbGV0IHRhcmdldFVSTCA9IHRhcmdldDtcbiAgICBpZiAoIV8uaXNTdHJpbmcodGFyZ2V0KSkge1xuICAgICAgdGFyZ2V0VVJMID0gdGFyZ2V0LmdldExpbmsoJ3NlbGYnKVxuICAgIH1cblxuICAgIHRoaXMuc291cmNlVG9UYXJnZXRbc291cmNlVVJMXSA9IHRhcmdldFVSTDtcblxuICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBQb29sQ29ubmVjdG9yO1xuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCBSZXNwb25zZSBmcm9tICcuL1Jlc3BvbnNlJztcblxubGV0IGFqYXhPcHRpb25zID0ge1xuXG4gIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gIHByb2Nlc3NEYXRhOiB0cnVlXG5cbn07XG5cbmxldCBzdHJpbmdpZnlSZXF1aXJlZE1ldGhvZCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgLy8gdGhlc2UgSFRUUCBtZXRob2RzIHJlcXVpcmVzIEpTT04uc3RyaW5naWZ5XG4gIHJldHVybiAoL14oUE9TVHxQVVR8UEFUQ0h8REVMRVRFKSQvLnRlc3QobWV0aG9kLnRvVXBwZXJDYXNlKCkpKTtcbn07XG5cbmxldCBtYWtlQWpheFJlcXVlc3QgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gIG9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgYWpheE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gIGlmIChzdHJpbmdpZnlSZXF1aXJlZE1ldGhvZChvcHRpb25zLnR5cGUpKSB7XG4gICAgaWYgKG9wdGlvbnMuY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJykge1xuICAgICAgb3B0aW9ucy5kYXRhID0gSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5kYXRhKTtcbiAgICB9XG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL3Evd2lraS9Db21pbmctZnJvbS1qUXVlcnlcbiAgcmV0dXJuIFEucHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgJC5hamF4KG9wdGlvbnMpXG4gICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcbiAgICAgICAgZGVsZXRlIGpxWEhSLnRoZW47IC8vIHRyZWF0IHhociBhcyBhIG5vbi1wcm9taXNlXG4gICAgICAgIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShqcVhIUik7XG4gICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5mYWlsKGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgZGVsZXRlIGpxWEhSLnRoZW47IC8vIHRyZWF0IHhociBhcyBhIG5vbi1wcm9taXNlXG4gICAgICAgIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShqcVhIUik7XG4gICAgICAgIHJlamVjdChyZXNwb25zZSk7XG4gICAgICB9KTtcbiAgfSk7XG5cbn07XG5cblxuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgaGVhZDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJIRUFEXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGdldDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcG9zdDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHB1dDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQVVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcGF0Y2g6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUEFUQ0hcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZGVsZXRlOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkRFTEVURVwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfVxuXG59O1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IHV1aWQgZnJvbSAnbm9kZS11dWlkJztcblxuXG5sZXQgaXNWYWxpZEF0dHJzID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgcmV0dXJuIGRhdGEgJiYgZGF0YS50eXBlO1xufTtcblxuXG5jbGFzcyBSZXNvdXJjZSBleHRlbmRzIE1vZGVsIHtcblxuICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBfLmRlZmF1bHRzKG9wdGlvbnMsIHsgcGFyc2U6IHRydWUgfSk7XG5cbiAgICBzdXBlcihhdHRyaWJ1dGVzLCBvcHRpb25zKTtcblxuICAgIGlmICghdGhpcy5pZCkge1xuICAgICAgdGhpcy5pZCA9IHV1aWQudjQoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmdldExpbmsoJ3NlbGYnKSkge1xuICAgICAgbGV0IGpzb24gPSB0aGlzLnRvSlNPTigpO1xuICAgICAgdGhpcy5zZXRMaW5rKCdzZWxmJywgYC8ke2pzb24udHlwZX0vJHt0aGlzLmlkfWApO1xuICAgIH1cblxuICB9XG5cbiAgc2V0TGluayAoa2V5LCByZXNvdXJjZSkge1xuXG4gICAgbGV0IHVybCA9IF8uaXNTdHJpbmcocmVzb3VyY2UpID8gcmVzb3VyY2UgOiByZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyk7XG4gICAgdGhpcy5saW5rc1trZXldID0gdXJsO1xuICAgIHRoaXMudHJpZ2dlcignYWRkOmxpbmsnLCBrZXksIHRoaXMubGlua3Nba2V5XSk7XG5cbiAgfVxuXG4gIHJlbW92ZUxpbmsgKGtleSkge1xuXG4gICAgaWYgKGtleSA9PT0gJ3NlbGYnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NlbGYgbGluayBpcyBub3QgYWJsZSB0byByZW1vdmVkIScpO1xuICAgIH1cbiAgICBsZXQgcmVtb3ZlZExpbmsgPSB0aGlzLmxpbmtzW2tleV07XG4gICAgZGVsZXRlIHRoaXMubGlua3Nba2V5XTtcbiAgICB0aGlzLnRyaWdnZXIoJ3JlbW92ZTpsaW5rJywga2V5LCByZW1vdmVkTGluayk7XG5cbiAgfVxuXG4gIGdldExpbmsgKGtleSkge1xuXG4gICAgcmV0dXJuIHRoaXMubGlua3Nba2V5XTtcblxuICB9XG5cbiAgcGFyc2UgKGRhdGEpIHtcblxuICAgIGlmICghaXNWYWxpZEF0dHJzKGRhdGEpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZGF0YSEgdHlwZSBzaG91bGQgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG4gICAgdGhpcy5saW5rcyA9IGRhdGEubGlua3MgfHwge307XG4gICAgcmV0dXJuIF8ub21pdChkYXRhLCAnbGlua3MnKTtcblxuICB9XG5cbiAgZGVzZXJpYWxpemUgKCkge1xuXG4gICAgbGV0IGRhdGEgPSBfLmNsb25lKHRoaXMuYXR0cmlidXRlcywgdHJ1ZSk7XG4gICAgZGF0YS5saW5rcyA9IF8uY2xvbmUodGhpcy5saW5rcywgdHJ1ZSk7XG4gICAgcmV0dXJuIGRhdGE7XG5cbiAgfVxuXG4gIGNsb25lICgpIHtcblxuICAgIHJldHVybiBuZXcgUmVzb3VyY2UodGhpcy5kZXNlcmlhbGl6ZSgpLCB7IHBhcnNlOiB0cnVlIH0pO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuXG5sZXQgX3ZhbGlkYXRlUmVzcG9uc2UgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgbGV0IGJvZHkgPSB4aHIucmVzcG9uc2VKU09OO1xuXG4gIGlmIChib2R5LmRhdGEgPT09IHVuZGVmaW5lZCAmJiBib2R5LmVycm9ycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQSBkb2N1bWVudCBNVVNUIGNvbnRhaW4gZWl0aGVyIHByaW1hcnkgZGF0YSBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwib3IgYW4gYXJyYXkgb2YgZXJyb3Igb2JqZWN0cy5cIik7XG4gIH1cblxufTtcblxuXG5sZXQgX2lzUmVzcG9uc2VFcnJvciA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcblxuICByZXR1cm4gNDAwIDw9IHN0YXR1cyAmJiA2MDAgPiBzdGF0dXMgO1xuXG59O1xuXG5cbmxldCBfcGFyc2VEYXRhID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICgheGhyLnJlc3BvbnNlSlNPTikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB4aHIucmVzcG9uc2VKU09OLmRhdGE7XG5cbn07XG5cblxubGV0IF9wYXJzZUVycm9ycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBpZiAoISh4aHIucmVzcG9uc2VKU09OICYmIHhoci5yZXNwb25zZUpTT04uZXJyb3JzICkpIHtcbiAgICBpZiAoX2lzUmVzcG9uc2VFcnJvcih4aHIuc3RhdHVzKSkge1xuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIHN0YXR1czogXCJcIiArIHhoci5zdGF0dXNcbiAgICAgIH1dO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCBlcnJvcnMgPSB4aHIucmVzcG9uc2VKU09OLmVycm9ycztcblxuICByZXR1cm4gXy5tYXAoZXJyb3JzLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICByZXR1cm4gXy5leHRlbmQoe1xuICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgIH0sIGVycm9yKTtcbiAgfSk7XG5cbn07XG5cblxubGV0IF9wYXJzZUhlYWRlcnMgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgbGV0IHJlc3VsdCA9IFtdO1xuXG4gIGxldCBoZWFkZXJSZWdleCA9IC9eKC4qPyk6WyBcXHRdKihbXlxcclxcbl0qKSQvbWc7XG4gIGxldCBoZWFkZXJzU3RyaW5nID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpO1xuICBsZXQgZmluZFJlc3VsdDtcblxuICB3aGlsZSAoKGZpbmRSZXN1bHQgPSBoZWFkZXJSZWdleC5leGVjKGhlYWRlcnNTdHJpbmcpKSAhPT0gbnVsbCkge1xuICAgIHJlc3VsdC5wdXNoKGZpbmRSZXN1bHQuc2xpY2UoMSkpO1xuICB9XG5cbiAgcmV0dXJuIF8ub2JqZWN0KHJlc3VsdCk7XG5cbn07XG5cblxuY2xhc3MgUmVzcG9uc2Uge1xuXG4gIGNvbnN0cnVjdG9yICh4aHIpIHtcblxuICAgIHRoaXMucmVzcG9uc2VKU09OID0geGhyLnJlc3BvbnNlSlNPTjtcbiAgICB0aGlzLmRhdGEgPSBfcGFyc2VEYXRhKHhocik7XG4gICAgdGhpcy5lcnJvcnMgPSBfcGFyc2VFcnJvcnMoeGhyKTtcbiAgICB0aGlzLmhlYWRlcnMgPSBfcGFyc2VIZWFkZXJzKHhocik7XG4gICAgdGhpcy5uYXRpdmVYSFIgPSB4aHI7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNlO1xuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCBQb29sIGZyb20gJy4vUG9vbCc7XG5pbXBvcnQgT3BlcmF0aW9uIGZyb20gJy4vT3BlcmF0aW9uJztcbmltcG9ydCBSRVNUZnVsIGZyb20gJy4vUkVTVGZ1bCc7XG5cblxuY2xhc3MgUmVzdFBvb2wgZXh0ZW5kcyBQb29sIHtcblxuICBjb25zdHJ1Y3RvciAocmVzb3VyY2VzLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHN1cGVyKHJlc291cmNlcywgb3B0aW9ucyk7XG4gICAgdGhpcy5zeW5jcm9uaXplciA9IFJFU1RmdWw7XG4gICAgdGhpcy50eXBlVG9VcmwgPSBvcHRpb25zLnR5cGVUb1VybCB8fCB7fTtcblxuICB9XG5cbiAgc2V0VVJMICh0eXBlLCB1cmwpIHtcblxuICAgIHRoaXMudHlwZVRvVXJsW3R5cGVdID0gdXJsO1xuXG4gIH1cblxuICBjcmVhdGUgKGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIHtcbiAgICAgIGJ5T3BlcmF0aW9uOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3luY3Jvbml6ZXIucG9zdCh0aGlzLmdldFVSTChhdHRyaWJ1dGVzLnR5cGUpLFxuICAgICAgICB7XG4gICAgICAgICAgZGF0YTogXy5vbWl0KGF0dHJpYnV0ZXMsICdpZCcsICdsaW5rcycpXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFJlc291cmNlKHJlc3BvbnNlLmRhdGEsIG9wdGlvbnMpO1xuICAgIH0pXG4gICAgLnRoZW4ocmVzb3VyY2UgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkKHJlc291cmNlLCB7IGNyZWF0ZTogdHJ1ZSB9KTtcbiAgICB9KVxuICAgIC50aGVuKHJlc291cmNlID0+IHtcbiAgICAgIGlmICghb3B0aW9ucy5ieU9wZXJhdGlvbikge1xuICAgICAgICB0aGlzLl90cmlnZ2VyVHJhbnNmb3JtKCdhZGQnLCByZXNvdXJjZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHBhdGNoIChyZXNvdXJjZSwgYXR0cmlidXRlcywgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgICBsZXQgc2V0QXJndW1lbnRzID0gXy50b0FycmF5KGFyZ3VtZW50cykuc2xpY2UoMSk7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICByZXNvdXJjZS5zZXQuYXBwbHkocmVzb3VyY2UsIHNldEFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSlcbiAgICAudGhlbihyZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zeW5jcm9uaXplci5wYXRjaChcbiAgICAgICAgcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpLFxuICAgICAgICB0aGlzLl90b1Jlc3BvbnNlKHJlc291cmNlKSk7XG4gICAgfSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICByZXNvdXJjZS5zZXQuYXBwbHkocmVzb3VyY2UsIHJlc3BvbnNlLmRhdGEpO1xuICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgIH0pXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKCFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJUcmFuc2Zvcm0oJ3JlcGxhY2UnLCByZXNvdXJjZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHJlbW92ZSAocmVzb3VyY2UsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIHtcbiAgICAgIGJ5T3BlcmF0aW9uOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3luY3Jvbml6ZXIuZGVsZXRlKFxuICAgICAgICByZXNvdXJjZS5nZXRMaW5rKCdzZWxmJykpO1xuICAgIH0pXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgdGhpcy5zdG9wTGlzdGVuaW5nKHJlc291cmNlKTtcbiAgICAgIGRlbGV0ZSB0aGlzLnBvb2xbcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpXTtcbiAgICAgIGlmICghb3B0aW9ucy5ieU9wZXJhdGlvbikge1xuICAgICAgICB0aGlzLl90cmlnZ2VyVHJhbnNmb3JtKCdyZW1vdmUnLCByZXNvdXJjZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGdldCAodXJsT3JMaW5rYWdlLCBvcHRpb25zKSB7XG5cbiAgICBsZXQgdXJsID0gdGhpcy5fdG9VUkwodXJsT3JMaW5rYWdlKTtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN5bmNyb25pemVyLmdldCh1cmwsIG9wdGlvbnMpO1xuICAgIH0pXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKF8uaXNBcnJheShyZXNwb25zZS5kYXRhKSkge1xuICAgICAgICByZXR1cm4gXy5tYXAocmVzcG9uc2UuZGF0YSwgZGF0YSA9PlxuICAgICAgICAgIHRoaXMuX3JlZnJlc2hPckNyZWF0ZShkYXRhKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9yZWZyZXNoT3JDcmVhdGUocmVzcG9uc2UuZGF0YSlcbiAgICB9KTtcblxuICB9XG5cbiAgZ2V0VVJMICh0eXBlLCBpZCkge1xuXG4gICAgbGV0IHVybCA9IHRoaXMudHlwZVRvVXJsW3R5cGVdO1xuXG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdHlwZVske3R5cGV9XSBpcyBub3Qgc3VwcG9ydGVkIWApO1xuICAgIH1cblxuICAgIGlmIChpZCkge1xuICAgICAgdXJsID0gdXJsICsgaWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcblxuICB9XG5cbiAgX3RvVVJMICh1cmxPckxpbmthZ2UpIHtcblxuICAgIGxldCB1cmw7XG4gICAgaWYgKF8uc3RhcnRzV2l0aCh1cmxPckxpbmthZ2UsICcvJykpIHtcbiAgICAgIHVybCA9IHVybE9yTGlua2FnZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsZXQgbGlua2FnZSA9IHVybE9yTGlua2FnZTtcbiAgICAgIHVybCA9IHRoaXMuZ2V0VVJMKGxpbmthZ2UudHlwZSwgbGlua2FnZS5pZCk7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG5cbiAgfVxuXG4gIF90b1Jlc3BvbnNlIChyZXNvdXJjZSkge1xuXG4gICAgcmV0dXJuIF8uY2xvbmUoe1xuICAgICAgZGF0YTogcmVzb3VyY2UuZGVzZXJpYWxpemUoKVxuICAgIH0sIHRydWUpO1xuXG4gIH1cblxuICBfcmVmcmVzaE9yQ3JlYXRlIChkYXRhKSB7XG5cbiAgICBsZXQgcmVzb3VyY2UgPSB0aGlzLnBvb2xbZGF0YS5saW5rcy5zZWxmXTtcblxuICAgIGlmIChyZXNvdXJjZSkge1xuICAgICAgcmVzb3VyY2Uuc2V0KGRhdGEsIHsgcGFyc2U6IHRydWUgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmVzb3VyY2UgPSBuZXcgUmVzb3VyY2UoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiByZXNvdXJjZTtcblxuICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBSZXN0UG9vbDtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcblxuXG5jbGFzcyBUcmFuc2FjdGlvbiB7XG5cbiAgY29uc3RydWN0b3IocG9vbCwgb3B0aW9ucykge1xuXG4gICAgXy5leHRlbmQodGhpcywgRXZlbnRzKTtcbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMucG9vbCA9IHBvb2w7XG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG5cbiAgfVxuXG4gIGJlZ2luICgpIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuX2FjdGl2YXRlKCk7XG5cbiAgfVxuXG4gIGNvbW1pdCAoKSB7XG5cbiAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XG5cbiAgfVxuXG5cbiAgX2FjdGl2YXRlICgpIHtcblxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gIH1cblxuICBfZGVhY3RpdmF0ZSAoKSB7XG5cbiAgICB0aGlzLnN0b3BMaXN0ZW5pbmcodGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICB9XG5cbiAgb25UcmFuc2Zvcm0gKG9wZXJhdGlvbikge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zLnB1c2gob3BlcmF0aW9uKTtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHJhbnNhY3Rpb247XG4iXX0=
