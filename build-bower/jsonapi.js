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
    value: function get(url) {

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
  var findResult;

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
    value: function get(url, options) {
      var _this4 = this;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9pbmRleC5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9NZW1vcnlQb29sLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvbGliL09wZXJhdGlvbi5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9Qb29sLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvbGliL1Bvb2xDb25uZWN0b3IuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvUkVTVGZ1bC5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9SZXNvdXJjZS5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9SZXNwb25zZS5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9SZXN0UG9vbC5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9UcmFuc2FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O3dCQ0FxQixnQkFBZ0I7Ozs7MEJBQ2Qsa0JBQWtCOzs7O3dCQUNwQixnQkFBZ0I7Ozs7b0JBQ3BCLFlBQVk7Ozs7dUJBQ1QsZUFBZTs7OzsyQkFDWCxtQkFBbUI7Ozs7NkJBQ2pCLHFCQUFxQjs7OztRQUk3QyxXQUFXO1FBQ1gsUUFBUTtRQUNSLFVBQVU7UUFD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UUFBUTs7OztpQkFDUixHQUFHOzs7O3NCQUNNLFVBQVU7O0lBRzNCLFdBQVc7QUFFSixXQUZQLFdBQVcsQ0FFSCxJQUFJLEVBQUUsT0FBTyxFQUFFOzBCQUZ2QixXQUFXOztBQUliLHdCQUFFLE1BQU0sQ0FBQyxJQUFJLFVBUFIsTUFBTSxDQU9XLENBQUM7QUFDdkIsV0FBTyxHQUFHLG9CQUFFLFFBQVEsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7O0FBRXBDLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0dBRXRCOztlQVZHLFdBQVc7O1dBWVQsaUJBQUc7O0FBRVAsVUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDckIsVUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBRWxCOzs7V0FFTSxrQkFBRzs7QUFFUixVQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7S0FFcEI7OztXQUdTLHFCQUFHOztBQUVYLFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0tBRXBCOzs7V0FFVyx1QkFBRzs7QUFFYixVQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM3RCxVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUVyQjs7O1dBRVcscUJBQUMsU0FBUyxFQUFFOztBQUV0QixVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUVqQzs7O1NBNUNHLFdBQVc7OztxQkFnREYsV0FBVyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9saWIvUmVzb3VyY2UnO1xuaW1wb3J0IE1lbW9yeVBvb2wgZnJvbSAnLi9saWIvTWVtb3J5UG9vbCc7XG5pbXBvcnQgUmVzdFBvb2wgZnJvbSAnLi9saWIvUmVzdFBvb2wnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi9saWIvUG9vbCc7XG5pbXBvcnQgUkVTVGZ1bCBmcm9tICcuL2xpYi9SRVNUZnVsJztcbmltcG9ydCBUcmFuc2FjdGlvbiBmcm9tICcuL2xpYi9UcmFuc2FjdGlvbic7XG5pbXBvcnQgUG9vbENvbm5lY3RvciBmcm9tICcuL2xpYi9Qb29sQ29ubmVjdG9yJztcblxuXG5leHBvcnQge1xuICBUcmFuc2FjdGlvbixcbiAgUmVzb3VyY2UsXG4gIE1lbW9yeVBvb2wsXG4gIFJlc3RQb29sLFxuICBQb29sLFxuICBSRVNUZnVsLFxuICBQb29sQ29ubmVjdG9yXG59O1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi9Qb29sJztcbmltcG9ydCBPcGVyYXRpb24gZnJvbSAnLi9PcGVyYXRpb24nO1xuXG5cbmNsYXNzIE1lbW9yeVBvb2wgZXh0ZW5kcyBQb29sIHtcblxuICBjb25zdHJ1Y3RvcihyZXNvdXJjZXMpIHtcblxuICAgIHN1cGVyKHJlc291cmNlcyk7XG5cbiAgfVxuXG4gIGNyZWF0ZSAoYXR0cmlidXRlcywgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFJlc291cmNlKGF0dHJpYnV0ZXMsIG9wdGlvbnMpO1xuICAgIH0pXG4gICAgLnRoZW4ocmVzb3VyY2UgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkKHJlc291cmNlLCB7IGNyZWF0ZTogdHJ1ZSB9KTtcbiAgICB9KVxuICAgIC50aGVuKHJlc291cmNlID0+IHtcbiAgICAgIGlmICghb3B0aW9ucy5ieU9wZXJhdGlvbikge1xuICAgICAgICB0aGlzLl90cmlnZ2VyVHJhbnNmb3JtKCdhZGQnLCByZXNvdXJjZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHBhdGNoIChyZXNvdXJjZSwgYXR0cmlidXRlcywgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgICB2YXIgc2V0QXJndW1lbnRzID0gXy50b0FycmF5KGFyZ3VtZW50cykuc2xpY2UoMSk7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICByZXNvdXJjZS5zZXQuYXBwbHkocmVzb3VyY2UsIHNldEFyZ3VtZW50cyk7XG4gICAgICBpZiAoIW9wdGlvbnMuYnlPcGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlclRyYW5zZm9ybSgncmVwbGFjZScsIHJlc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KTtcblxuICB9XG5cbiAgcmVtb3ZlIChyZXNvdXJjZSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICB0aGlzLnN0b3BMaXN0ZW5pbmcocmVzb3VyY2UpO1xuICAgICAgZGVsZXRlIHRoaXMucG9vbFtyZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyldO1xuICAgICAgaWYgKCFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJUcmFuc2Zvcm0oJ3JlbW92ZScsIHJlc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KTtcblxuICB9XG5cbiAgZ2V0ICh1cmwpIHtcblxuICAgIHZhciByZXNvdXJjZSA9IHRoaXMucG9vbFt1cmxdO1xuXG4gICAgaWYgKCFyZXNvdXJjZSkge1xuICAgICAgcmVzb3VyY2UgPSBfLmZpbHRlcih0aGlzLnBvb2wsIChyZXNvdXJjZSwgcmVzb3VyY2VVcmwpID0+IHtcbiAgICAgICAgcmV0dXJuIF8uc3RhcnRzV2l0aChyZXNvdXJjZVVybCwgdXJsKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKF8uaXNFbXB0eShyZXNvdXJjZSkpIHtcbiAgICAgICAgcmVzb3VyY2UgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4gcmVzb3VyY2UpO1xuXG4gIH1cblxuICBnZXRVUkwgKHR5cGUsIGlkKSB7XG5cbiAgICB2YXIgdXJsID0gYC8ke3R5cGV9L2A7XG5cbiAgICBpZiAoaWQpIHtcbiAgICAgIHVybCA9IHVybCArIGlkO1xuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG5cbiAgfVxuXG4gIGZpbmQgKHByZWRpY2F0ZSkge1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnBvb2wsIHByZWRpY2F0ZSk7XG4gICAgfSk7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgTWVtb3J5UG9vbDtcbiIsInZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cblxuY2xhc3MgT3BlcmF0aW9uIHtcblxuICBjb25zdHJ1Y3RvciAob3AsIHJlc291cmNlKSB7XG5cbiAgICB0aGlzLm9wID0gb3A7XG4gICAgdGhpcy5wYXRoID0gcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpO1xuICAgIGlmIChvcCAhPT0gJ3JlbW92ZScpIHtcbiAgICAgIHRoaXMudmFsdWUgPSByZXNvdXJjZS5kZXNlcmlhbGl6ZSgpO1xuICAgICAgdGhpcy52YWx1ZSA9IF8ub21pdCh0aGlzLnZhbHVlLCAnaWQnKTtcbiAgICAgIHRoaXMudmFsdWUgPSBfLm9taXQodGhpcy52YWx1ZSwgJ2xpbmtzJyk7XG4gICAgfVxuICAgIGlmIChvcCA9PT0gJ2FkZCcpIHtcbiAgICB9XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IE9wZXJhdGlvbjtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCBPcGVyYXRpb24gZnJvbSAnLi9PcGVyYXRpb24nO1xuXG5cbmNsYXNzIFBvb2wge1xuXG4gIGNvbnN0cnVjdG9yKHJlc291cmNlcykge1xuXG4gICAgXy5leHRlbmQodGhpcywgRXZlbnRzKTtcbiAgICB0aGlzLnBvb2wgPSB7fTtcbiAgICBfLmVhY2gocmVzb3VyY2VzLCB0aGlzLmFkZCwgdGhpcyk7XG5cbiAgfVxuXG4gIGNyZWF0ZSAoYXR0cmlidXRlcywgb3B0aW9ucykge1xuXG4gICAgLy8gaW1wbGVtZW50IHRoaXMvLyBpbXBsZW1lbnQgdGhpc1xuXG4gIH1cblxuICByZW1vdmUgKHJlc291cmNlKSB7XG5cbiAgICAvLyBpbXBsZW1lbnQgdGhpc1xuXG4gIH1cblxuICBnZXQgKGlkKSB7XG5cbiAgICAvLyBpbXBsZW1lbnQgdGhpc1xuXG4gIH1cblxuICBnZXRVUkwgKHR5cGUsIGlkKSB7XG5cbiAgICAvLyBpbXBsZW1lbnQgdGhpc1xuXG4gIH1cblxuICBhZGQgKHJlc291cmNlLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCB7XG4gICAgICBieU9wZXJhdGlvbjogZmFsc2UsXG4gICAgICBjcmVhdGU6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBsZXQgX2FkZFRvUG9vbCA9IGZ1bmN0aW9uIChyZXNvdXJjZSkge1xuICAgICAgaWYgKCF0aGlzLnBvb2xbcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpXSkge1xuICAgICAgICB0aGlzLnBvb2xbcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpXSA9IHJlc291cmNlO1xuICAgICAgICBpZiAoIW9wdGlvbnMuY3JlYXRlICYmICFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICAgICAgdGhpcy5fdHJpZ2dlckFkZChyZXNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICBfLmlzQXJyYXkocmVzb3VyY2UpID9cbiAgICAgIF8uZWFjaChyZXNvdXJjZSwgcmVzb3VyY2UgPT4gX2FkZFRvUG9vbChyZXNvdXJjZSkpIDpcbiAgICAgIF9hZGRUb1Bvb2wocmVzb3VyY2UpO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4gcmVzb3VyY2UpO1xuXG4gIH1cblxuICBfdHJpZ2dlclRyYW5zZm9ybSAob3AsIHJlc291cmNlKSB7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3RyYW5zZm9ybScsIG5ldyBPcGVyYXRpb24ob3AsIHJlc291cmNlKSk7XG5cbiAgfVxuXG4gIF90cmlnZ2VyQWRkIChyZXNvdXJjZSkge1xuXG4gICAgdGhpcy50cmlnZ2VyKCdhZGQnLCByZXNvdXJjZSk7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUG9vbDtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCBQb29sIGZyb20gJy4vUG9vbCc7XG5cbmNsYXNzIFBvb2xDb25uZWN0b3Ige1xuXG4gIGNvbnN0cnVjdG9yKHNvdXJjZSwgdGFyZ2V0LCBvcHRpb25zID0ge30pIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMsIEV2ZW50cyk7XG5cbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICB0aGlzLnNvdXJjZVRvVGFyZ2V0ID0ge307XG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG5cbiAgICB0aGlzLmxpc3RlblRvKHRoaXMuc291cmNlLCBcInRyYW5zZm9ybVwiLCB0aGlzLl9vblRyYXNuZm9ybSk7XG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLnNvdXJjZSwgXCJhZGRcIiwgdGhpcy5fb25BZGQpO1xuICAgIC8vIHRoaXMuc3RvcExpc3RlbmluZyhzb3VyY2UsIFwidHJhbnNmb3JtXCIpO1xuXG4gIH1cblxuICBnZXRSZXBsaWNhIChyZXNvdXJjZU9yVVJMKSB7XG5cbiAgICB2YXIgdXJsID0gXy5pc1N0cmluZyhyZXNvdXJjZU9yVVJMKSA/XG4gICAgICByZXNvdXJjZU9yVVJMIDogcmVzb3VyY2VPclVSTC5nZXRMaW5rKCdzZWxmJyk7XG5cbiAgICByZXR1cm4gdGhpcy50YXJnZXQuZ2V0KFxuICAgICAgdGhpcy5nZXRSZXBsaWNhdGVkVVJMKHVybCkpO1xuXG4gIH1cblxuICBnZXRSZXBsaWNhdGVkVVJMICh1cmwpIHtcblxuICAgIHJldHVybiB0aGlzLnNvdXJjZVRvVGFyZ2V0W3VybF07XG5cbiAgfVxuXG4gIF9vblRyYXNuZm9ybSAob3BlcmF0aW9uKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMucHVzaChvcGVyYXRpb24pO1xuXG4gIH1cblxuICBfb25BZGQgKHJlc291cmNlKSB7XG5cbiAgICB2YXIgY2xvbmVkUmVzb3VyY2UgPSByZXNvdXJjZS5jbG9uZSgpO1xuICAgIHRoaXMuX2FkZFJlcGxpY2FMaW5rKHJlc291cmNlLCBjbG9uZWRSZXNvdXJjZSk7XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0LmFkZChjbG9uZWRSZXNvdXJjZSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgfVxuXG4gIGZsdXNoICgpIHtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHJldHVybiBfLnJlZHVjZSh0aGlzLm9wZXJhdGlvbnMsIChwcm9taXNlLCBvcGVyYXRpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5T3BlcmF0aW9uVG9UYXJnZXQob3BlcmF0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBRKCkpXG4gICAgfSlcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLl9jbGVhblF1ZXVlcygpO1xuICAgIH0pO1xuXG4gIH1cblxuICBfY2xlYW5RdWV1ZXMgKCkge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG5cbiAgfVxuXG4gIF9hcHBseU9wZXJhdGlvblRvVGFyZ2V0IChvcGVyYXRpb24pIHtcblxuICAgIHZhciBvcCA9IG9wZXJhdGlvbi5vcDtcbiAgICB2YXIgdmFsdWUgPSBvcGVyYXRpb24udmFsdWU7XG4gICAgdmFyIHBhdGggPSBvcGVyYXRpb24ucGF0aDtcblxuXG4gICAgaWYgKG9wID09PSBcImFkZFwiKSB7XG5cbiAgICAgIHJldHVybiB0aGlzLnRhcmdldC5jcmVhdGUodmFsdWUsIHtcbiAgICAgICAgYnlPcGVyYXRpb246IHRydWUsXG4gICAgICB9KVxuICAgICAgLnRoZW4ocmVzb3VyY2UgPT4ge1xuICAgICAgICB2YXIgdXJsID0gcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpO1xuICAgICAgICB0aGlzLl9hZGRSZXBsaWNhTGluayhwYXRoLCByZXNvdXJjZSlcbiAgICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgICAgfSk7XG5cbiAgICB9XG4gICAgZWxzZSBpZiAob3AgPT09IFwicmVwbGFjZVwiKSB7XG5cbiAgICAgIHJldHVybiB0aGlzLmdldFJlcGxpY2EocGF0aClcbiAgICAgIC50aGVuKHRhcmdldFJlc291cmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0LnBhdGNoKHRhcmdldFJlc291cmNlLCB2YWx1ZSwge1xuICAgICAgICAgIGJ5T3BlcmF0aW9uOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICB9XG4gICAgZWxzZSBpZiAob3AgPT09IFwicmVtb3ZlXCIpIHtcblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVwbGljYShwYXRoKVxuICAgICAgLnRoZW4odGFyZ2V0UmVzb3VyY2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50YXJnZXQucmVtb3ZlKHRhcmdldFJlc291cmNlLCB7XG4gICAgICAgICAgYnlPcGVyYXRpb246IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIH1cblxuICB9XG5cbiAgX2FkZFJlcGxpY2FMaW5rIChzb3VyY2UsIHRhcmdldCkge1xuXG4gICAgdmFyIHNvdXJjZVVSTCA9IHNvdXJjZTtcbiAgICBpZiAoIV8uaXNTdHJpbmcoc291cmNlKSkge1xuICAgICAgc291cmNlVVJMID0gc291cmNlLmdldExpbmsoJ3NlbGYnKVxuICAgIH1cblxuICAgIHZhciB0YXJnZXRVUkwgPSB0YXJnZXQ7XG4gICAgaWYgKCFfLmlzU3RyaW5nKHRhcmdldCkpIHtcbiAgICAgIHRhcmdldFVSTCA9IHRhcmdldC5nZXRMaW5rKCdzZWxmJylcbiAgICB9XG5cbiAgICB0aGlzLnNvdXJjZVRvVGFyZ2V0W3NvdXJjZVVSTF0gPSB0YXJnZXRVUkw7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUG9vbENvbm5lY3RvcjtcbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgUmVzcG9uc2UgZnJvbSAnLi9SZXNwb25zZSc7XG5cbnZhciBhamF4T3B0aW9ucyA9IHtcblxuICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICBwcm9jZXNzRGF0YTogdHJ1ZVxuXG59O1xuXG52YXIgc3RyaW5naWZ5UmVxdWlyZWRNZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gIC8vIHRoZXNlIEhUVFAgbWV0aG9kcyByZXF1aXJlcyBKU09OLnN0cmluZ2lmeVxuICByZXR1cm4gKC9eKFBPU1R8UFVUfFBBVENIfERFTEVURSkkLy50ZXN0KG1ldGhvZC50b1VwcGVyQ2FzZSgpKSk7XG59O1xuXG52YXIgbWFrZUFqYXhSZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gXy5leHRlbmQoe30sIGFqYXhPcHRpb25zLCBvcHRpb25zKTtcblxuICBpZiAoc3RyaW5naWZ5UmVxdWlyZWRNZXRob2Qob3B0aW9ucy50eXBlKSkge1xuICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgIG9wdGlvbnMuZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL3dpa2kvQ29taW5nLWZyb20talF1ZXJ5XG4gIHJldHVybiBRLnByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICQuYWpheChvcHRpb25zKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZmFpbChmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZWplY3QocmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH0pO1xuXG59O1xuXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGhlYWQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiSEVBRFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHBvc3Q6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwdXQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUFVUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHBhdGNoOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBBVENIXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGRlbGV0ZTogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJERUxFVEVcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH1cblxufTtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5cblxudmFyIGlzVmFsaWRBdHRycyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIHJldHVybiBkYXRhICYmIGRhdGEudHlwZTtcbn07XG5cblxuY2xhc3MgUmVzb3VyY2UgZXh0ZW5kcyBNb2RlbCB7XG5cbiAgY29uc3RydWN0b3IoYXR0cmlidXRlcywgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgXy5kZWZhdWx0cyhvcHRpb25zLCB7IHBhcnNlOiB0cnVlIH0pO1xuXG4gICAgc3VwZXIoYXR0cmlidXRlcywgb3B0aW9ucyk7XG5cbiAgICBpZiAoIXRoaXMuaWQpIHtcbiAgICAgIHRoaXMuaWQgPSB1dWlkLnY0KCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5nZXRMaW5rKCdzZWxmJykpIHtcbiAgICAgIGxldCBqc29uID0gdGhpcy50b0pTT04oKTtcbiAgICAgIHRoaXMuc2V0TGluaygnc2VsZicsIGAvJHtqc29uLnR5cGV9LyR7dGhpcy5pZH1gKTtcbiAgICB9XG5cbiAgfVxuXG4gIHNldExpbmsgKGtleSwgcmVzb3VyY2UpIHtcblxuICAgIHZhciB1cmwgPSBfLmlzU3RyaW5nKHJlc291cmNlKSA/IHJlc291cmNlIDogcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpO1xuICAgIHRoaXMubGlua3Nba2V5XSA9IHVybDtcbiAgICB0aGlzLnRyaWdnZXIoJ2FkZDpsaW5rJywga2V5LCB0aGlzLmxpbmtzW2tleV0pO1xuXG4gIH1cblxuICByZW1vdmVMaW5rIChrZXkpIHtcblxuICAgIGlmIChrZXkgPT09ICdzZWxmJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZWxmIGxpbmsgaXMgbm90IGFibGUgdG8gcmVtb3ZlZCEnKTtcbiAgICB9XG4gICAgdmFyIHJlbW92ZWRMaW5rID0gdGhpcy5saW5rc1trZXldO1xuICAgIGRlbGV0ZSB0aGlzLmxpbmtzW2tleV07XG4gICAgdGhpcy50cmlnZ2VyKCdyZW1vdmU6bGluaycsIGtleSwgcmVtb3ZlZExpbmspO1xuXG4gIH1cblxuICBnZXRMaW5rIChrZXkpIHtcblxuICAgIHJldHVybiB0aGlzLmxpbmtzW2tleV07XG5cbiAgfVxuXG4gIHBhcnNlIChkYXRhKSB7XG5cbiAgICBpZiAoIWlzVmFsaWRBdHRycyhkYXRhKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGRhdGEhIHR5cGUgc2hvdWxkIGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuICAgIHRoaXMubGlua3MgPSBkYXRhLmxpbmtzIHx8IHt9O1xuICAgIHJldHVybiBfLm9taXQoZGF0YSwgJ2xpbmtzJyk7XG5cbiAgfVxuXG4gIGRlc2VyaWFsaXplICgpIHtcblxuICAgIHZhciBkYXRhID0gXy5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMsIHRydWUpO1xuICAgIGRhdGEubGlua3MgPSBfLmNsb25lKHRoaXMubGlua3MsIHRydWUpO1xuICAgIHJldHVybiBkYXRhO1xuXG4gIH1cblxuICBjbG9uZSAoKSB7XG5cbiAgICByZXR1cm4gbmV3IFJlc291cmNlKHRoaXMuZGVzZXJpYWxpemUoKSwgeyBwYXJzZTogdHJ1ZSB9KTtcblxuICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZTtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cblxudmFyIF92YWxpZGF0ZVJlc3BvbnNlID0gZnVuY3Rpb24gKHhocikge1xuXG4gIHZhciBib2R5ID0geGhyLnJlc3BvbnNlSlNPTjtcblxuICBpZiAoYm9keS5kYXRhID09PSB1bmRlZmluZWQgJiYgYm9keS5lcnJvcnMgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkEgZG9jdW1lbnQgTVVTVCBjb250YWluIGVpdGhlciBwcmltYXJ5IGRhdGEgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcIm9yIGFuIGFycmF5IG9mIGVycm9yIG9iamVjdHMuXCIpO1xuICB9XG5cbn07XG5cblxudmFyIF9pc1Jlc3BvbnNlRXJyb3IgPSBmdW5jdGlvbiAoc3RhdHVzKSB7XG5cbiAgcmV0dXJuIDQwMCA8PSBzdGF0dXMgJiYgNjAwID4gc3RhdHVzIDtcblxufTtcblxuXG52YXIgX3BhcnNlRGF0YSA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBpZiAoIXhoci5yZXNwb25zZUpTT04pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4geGhyLnJlc3BvbnNlSlNPTi5kYXRhO1xuXG59O1xuXG5cbnZhciBfcGFyc2VFcnJvcnMgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgaWYgKCEoeGhyLnJlc3BvbnNlSlNPTiAmJiB4aHIucmVzcG9uc2VKU09OLmVycm9ycyApKSB7XG4gICAgaWYgKF9pc1Jlc3BvbnNlRXJyb3IoeGhyLnN0YXR1cykpIHtcbiAgICAgIHJldHVybiBbe1xuICAgICAgICBzdGF0dXM6IFwiXCIgKyB4aHIuc3RhdHVzXG4gICAgICB9XTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgZXJyb3JzID0geGhyLnJlc3BvbnNlSlNPTi5lcnJvcnM7XG5cbiAgcmV0dXJuIF8ubWFwKGVycm9ycywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgcmV0dXJuIF8uZXh0ZW5kKHtcbiAgICAgIHN0YXR1czogXCJcIiArIHhoci5zdGF0dXNcbiAgICB9LCBlcnJvcik7XG4gIH0pO1xuXG59O1xuXG5cbnZhciBfcGFyc2VIZWFkZXJzID0gZnVuY3Rpb24gKHhocikge1xuXG4gIHZhciByZXN1bHQgPSBbXTtcblxuICB2YXIgaGVhZGVyUmVnZXggPSAvXiguKj8pOlsgXFx0XSooW15cXHJcXG5dKikkL21nO1xuICB2YXIgaGVhZGVyc1N0cmluZyA9IHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKTtcbiAgdmFyIGZpbmRSZXN1bHQ7XG5cbiAgd2hpbGUgKChmaW5kUmVzdWx0ID0gaGVhZGVyUmVnZXguZXhlYyhoZWFkZXJzU3RyaW5nKSkgIT09IG51bGwpIHtcbiAgICByZXN1bHQucHVzaChmaW5kUmVzdWx0LnNsaWNlKDEpKTtcbiAgfVxuXG4gIHJldHVybiBfLm9iamVjdChyZXN1bHQpO1xuXG59O1xuXG5cbmNsYXNzIFJlc3BvbnNlIHtcblxuICBjb25zdHJ1Y3RvciAoeGhyKSB7XG5cbiAgICB0aGlzLnJlc3BvbnNlSlNPTiA9IHhoci5yZXNwb25zZUpTT047XG4gICAgdGhpcy5kYXRhID0gX3BhcnNlRGF0YSh4aHIpO1xuICAgIHRoaXMuZXJyb3JzID0gX3BhcnNlRXJyb3JzKHhocik7XG4gICAgdGhpcy5oZWFkZXJzID0gX3BhcnNlSGVhZGVycyh4aHIpO1xuICAgIHRoaXMubmF0aXZlWEhSID0geGhyO1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zZTtcbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9SZXNvdXJjZSc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL1Bvb2wnO1xuaW1wb3J0IE9wZXJhdGlvbiBmcm9tICcuL09wZXJhdGlvbic7XG5pbXBvcnQgUkVTVGZ1bCBmcm9tICcuL1JFU1RmdWwnO1xuXG5cbmNsYXNzIFJlc3RQb29sIGV4dGVuZHMgUG9vbCB7XG5cbiAgY29uc3RydWN0b3IgKHJlc291cmNlcywgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICBzdXBlcihyZXNvdXJjZXMsIG9wdGlvbnMpO1xuICAgIHRoaXMuc3luY3Jvbml6ZXIgPSBSRVNUZnVsO1xuICAgIHRoaXMudHlwZVRvVXJsID0gb3B0aW9ucy50eXBlVG9VcmwgfHwge307XG5cbiAgfVxuXG4gIHNldFVSTCAodHlwZSwgdXJsKSB7XG5cbiAgICB0aGlzLnR5cGVUb1VybFt0eXBlXSA9IHVybDtcblxuICB9XG5cbiAgY3JlYXRlIChhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCB7XG4gICAgICBieU9wZXJhdGlvbjogZmFsc2VcbiAgICB9KTtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN5bmNyb25pemVyLnBvc3QodGhpcy5nZXRVUkwoYXR0cmlidXRlcy50eXBlKSxcbiAgICAgICAge1xuICAgICAgICAgIGRhdGE6IF8ub21pdChhdHRyaWJ1dGVzLCAnaWQnLCAnbGlua3MnKVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBSZXNvdXJjZShyZXNwb25zZS5kYXRhLCBvcHRpb25zKTtcbiAgICB9KVxuICAgIC50aGVuKHJlc291cmNlID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFkZChyZXNvdXJjZSwgeyBjcmVhdGU6IHRydWUgfSk7XG4gICAgfSlcbiAgICAudGhlbihyZXNvdXJjZSA9PiB7XG4gICAgICBpZiAoIW9wdGlvbnMuYnlPcGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlclRyYW5zZm9ybSgnYWRkJywgcmVzb3VyY2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgIH0pO1xuXG4gIH1cblxuICBwYXRjaCAocmVzb3VyY2UsIGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIHtcbiAgICAgIGJ5T3BlcmF0aW9uOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgdmFyIHNldEFyZ3VtZW50cyA9IF8udG9BcnJheShhcmd1bWVudHMpLnNsaWNlKDEpO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmVzb3VyY2Uuc2V0LmFwcGx5KHJlc291cmNlLCBzZXRBcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgIH0pXG4gICAgLnRoZW4ocmVzb3VyY2UgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3luY3Jvbml6ZXIucGF0Y2goXG4gICAgICAgIHJlc291cmNlLmdldExpbmsoJ3NlbGYnKSxcbiAgICAgICAgdGhpcy5fdG9SZXNwb25zZShyZXNvdXJjZSkpO1xuICAgIH0pXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgcmVzb3VyY2Uuc2V0LmFwcGx5KHJlc291cmNlLCByZXNwb25zZS5kYXRhKTtcbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIGlmICghb3B0aW9ucy5ieU9wZXJhdGlvbikge1xuICAgICAgICB0aGlzLl90cmlnZ2VyVHJhbnNmb3JtKCdyZXBsYWNlJywgcmVzb3VyY2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgIH0pO1xuXG4gIH1cblxuICByZW1vdmUgKHJlc291cmNlLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCB7XG4gICAgICBieU9wZXJhdGlvbjogZmFsc2VcbiAgICB9KTtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN5bmNyb25pemVyLmRlbGV0ZShcbiAgICAgICAgcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpKTtcbiAgICB9KVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHRoaXMuc3RvcExpc3RlbmluZyhyZXNvdXJjZSk7XG4gICAgICBkZWxldGUgdGhpcy5wb29sW3Jlc291cmNlLmdldExpbmsoJ3NlbGYnKV07XG4gICAgICBpZiAoIW9wdGlvbnMuYnlPcGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlclRyYW5zZm9ybSgncmVtb3ZlJywgcmVzb3VyY2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgIH0pO1xuXG4gIH1cblxuICBnZXQgKHVybCwgb3B0aW9ucykge1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3luY3Jvbml6ZXIuZ2V0KHVybCwgb3B0aW9ucyk7XG4gICAgfSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBpZiAoXy5pc0FycmF5KHJlc3BvbnNlLmRhdGEpKSB7XG4gICAgICAgIHJldHVybiBfLm1hcChyZXNwb25zZS5kYXRhLCBkYXRhID0+XG4gICAgICAgICAgdGhpcy5fcmVmcmVzaE9yQ3JlYXRlKGRhdGEpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3JlZnJlc2hPckNyZWF0ZShyZXNwb25zZS5kYXRhKVxuICAgIH0pO1xuXG4gIH1cblxuICBnZXRVUkwgKHR5cGUsIGlkKSB7XG5cbiAgICB2YXIgdXJsID0gdGhpcy50eXBlVG9VcmxbdHlwZV07XG5cbiAgICBpZiAoIXVybCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB0eXBlWyR7dHlwZX1dIGlzIG5vdCBzdXBwb3J0ZWQhYCk7XG4gICAgfVxuXG4gICAgaWYgKGlkKSB7XG4gICAgICB1cmwgPSB1cmwgKyBpZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xuXG4gIH1cblxuICBfdG9SZXNwb25zZSAocmVzb3VyY2UpIHtcblxuICAgIHJldHVybiBfLmNsb25lKHtcbiAgICAgIGRhdGE6IHJlc291cmNlLmRlc2VyaWFsaXplKClcbiAgICB9LCB0cnVlKTtcblxuICB9XG5cbiAgX3JlZnJlc2hPckNyZWF0ZSAoZGF0YSkge1xuXG4gICAgdmFyIHJlc291cmNlID0gdGhpcy5wb29sW2RhdGEubGlua3Muc2VsZl07XG5cbiAgICBpZiAocmVzb3VyY2UpIHtcbiAgICAgIHJlc291cmNlLnNldChkYXRhLCB7IHBhcnNlOiB0cnVlIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJlc291cmNlID0gbmV3IFJlc291cmNlKGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzb3VyY2U7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUmVzdFBvb2w7XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tICdiYWNrYm9uZSc7XG5cblxuY2xhc3MgVHJhbnNhY3Rpb24ge1xuXG4gIGNvbnN0cnVjdG9yKHBvb2wsIG9wdGlvbnMpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMsIEV2ZW50cyk7XG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLnBvb2wgPSBwb29sO1xuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuXG4gIH1cblxuICBiZWdpbiAoKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcbiAgICB0aGlzLl9hY3RpdmF0ZSgpO1xuXG4gIH1cblxuICBjb21taXQgKCkge1xuXG4gICAgdGhpcy5fZGVhY3RpdmF0ZSgpO1xuXG4gIH1cblxuXG4gIF9hY3RpdmF0ZSAoKSB7XG5cbiAgICB0aGlzLmxpc3RlblRvKHRoaXMucG9vbCwgJ3RyYW5zZm9ybScsIHRoaXMub25UcmFuc2Zvcm0pO1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcblxuICB9XG5cbiAgX2RlYWN0aXZhdGUgKCkge1xuXG4gICAgdGhpcy5zdG9wTGlzdGVuaW5nKHRoaXMucG9vbCwgJ3RyYW5zZm9ybScsIHRoaXMub25UcmFuc2Zvcm0pO1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgfVxuXG4gIG9uVHJhbnNmb3JtIChvcGVyYXRpb24pIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucy5wdXNoKG9wZXJhdGlvbik7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zYWN0aW9uO1xuIl19
