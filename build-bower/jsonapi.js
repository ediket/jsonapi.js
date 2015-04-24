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
exports.RESTful = _RESTful2['default'];
exports.PoolConnector = _PoolConnector2['default'];

},{"./lib/MemoryPool":2,"./lib/PoolConnector":5,"./lib/RESTful":6,"./lib/Resource":7,"./lib/RestPool":9,"./lib/Transaction":10}],2:[function(require,module,exports){
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

      if (!this.pool[resource.getLink('self')]) {
        this.pool[resource.getLink('self')] = resource;
        if (!options.create && !options.byOperation) {
          this._triggerAdd(resource);
        }
      }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9pbmRleC5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9NZW1vcnlQb29sLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvbGliL09wZXJhdGlvbi5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9Qb29sLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvbGliL1Bvb2xDb25uZWN0b3IuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9saWIvUkVTVGZ1bC5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9SZXNvdXJjZS5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9SZXNwb25zZS5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9SZXN0UG9vbC5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL2xpYi9UcmFuc2FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O3dCQ0FxQixnQkFBZ0I7Ozs7MEJBQ2Qsa0JBQWtCOzs7O3dCQUNwQixnQkFBZ0I7Ozs7dUJBQ2pCLGVBQWU7Ozs7MkJBQ1gsbUJBQW1COzs7OzZCQUNqQixxQkFBcUI7Ozs7UUFJN0MsV0FBVztRQUNYLFFBQVE7UUFDUixVQUFVO1FBQ1YsUUFBUTtRQUNSLE9B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Q0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0dBRXRCOztlQVZHLFdBQVc7O1dBWVQsaUJBQUc7O0FBRVAsVUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDckIsVUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBRWxCOzs7V0FFTSxrQkFBRzs7QUFFUixVQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7S0FFcEI7OztXQUdTLHFCQUFHOztBQUVYLFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0tBRXBCOzs7V0FFVyx1QkFBRzs7QUFFYixVQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM3RCxVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUVyQjs7O1dBRVcscUJBQUMsU0FBUyxFQUFFOztBQUV0QixVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUVqQzs7O1NBNUNHLFdBQVc7OztxQkFnREYsV0FBVyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9saWIvUmVzb3VyY2UnO1xuaW1wb3J0IE1lbW9yeVBvb2wgZnJvbSAnLi9saWIvTWVtb3J5UG9vbCc7XG5pbXBvcnQgUmVzdFBvb2wgZnJvbSAnLi9saWIvUmVzdFBvb2wnO1xuaW1wb3J0IFJFU1RmdWwgZnJvbSAnLi9saWIvUkVTVGZ1bCc7XG5pbXBvcnQgVHJhbnNhY3Rpb24gZnJvbSAnLi9saWIvVHJhbnNhY3Rpb24nO1xuaW1wb3J0IFBvb2xDb25uZWN0b3IgZnJvbSAnLi9saWIvUG9vbENvbm5lY3Rvcic7XG5cblxuZXhwb3J0IHtcbiAgVHJhbnNhY3Rpb24sXG4gIFJlc291cmNlLFxuICBNZW1vcnlQb29sLFxuICBSZXN0UG9vbCxcbiAgUkVTVGZ1bCxcbiAgUG9vbENvbm5lY3RvclxufTtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCBQb29sIGZyb20gJy4vUG9vbCc7XG5pbXBvcnQgT3BlcmF0aW9uIGZyb20gJy4vT3BlcmF0aW9uJztcblxuXG5jbGFzcyBNZW1vcnlQb29sIGV4dGVuZHMgUG9vbCB7XG5cbiAgY29uc3RydWN0b3IocmVzb3VyY2VzKSB7XG5cbiAgICBzdXBlcihyZXNvdXJjZXMpO1xuXG4gIH1cblxuICBjcmVhdGUgKGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIHtcbiAgICAgIGJ5T3BlcmF0aW9uOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBSZXNvdXJjZShhdHRyaWJ1dGVzLCBvcHRpb25zKTtcbiAgICB9KVxuICAgIC50aGVuKHJlc291cmNlID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFkZChyZXNvdXJjZSwgeyBjcmVhdGU6IHRydWUgfSk7XG4gICAgfSlcbiAgICAudGhlbihyZXNvdXJjZSA9PiB7XG4gICAgICBpZiAoIW9wdGlvbnMuYnlPcGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlclRyYW5zZm9ybSgnYWRkJywgcmVzb3VyY2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgIH0pO1xuXG4gIH1cblxuICBwYXRjaCAocmVzb3VyY2UsIGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIHtcbiAgICAgIGJ5T3BlcmF0aW9uOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgdmFyIHNldEFyZ3VtZW50cyA9IF8udG9BcnJheShhcmd1bWVudHMpLnNsaWNlKDEpO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmVzb3VyY2Uuc2V0LmFwcGx5KHJlc291cmNlLCBzZXRBcmd1bWVudHMpO1xuICAgICAgaWYgKCFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJUcmFuc2Zvcm0oJ3JlcGxhY2UnLCByZXNvdXJjZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHJlbW92ZSAocmVzb3VyY2UsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIHtcbiAgICAgIGJ5T3BlcmF0aW9uOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgdGhpcy5zdG9wTGlzdGVuaW5nKHJlc291cmNlKTtcbiAgICAgIGRlbGV0ZSB0aGlzLnBvb2xbcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpXTtcbiAgICAgIGlmICghb3B0aW9ucy5ieU9wZXJhdGlvbikge1xuICAgICAgICB0aGlzLl90cmlnZ2VyVHJhbnNmb3JtKCdyZW1vdmUnLCByZXNvdXJjZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGdldCAodXJsKSB7XG5cbiAgICB2YXIgcmVzb3VyY2UgPSB0aGlzLnBvb2xbdXJsXTtcblxuICAgIGlmICghcmVzb3VyY2UpIHtcbiAgICAgIHJlc291cmNlID0gXy5maWx0ZXIodGhpcy5wb29sLCAocmVzb3VyY2UsIHJlc291cmNlVXJsKSA9PiB7XG4gICAgICAgIHJldHVybiBfLnN0YXJ0c1dpdGgocmVzb3VyY2VVcmwsIHVybCk7XG4gICAgICB9KTtcbiAgICAgIGlmIChfLmlzRW1wdHkocmVzb3VyY2UpKSB7XG4gICAgICAgIHJlc291cmNlID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHJlc291cmNlKTtcblxuICB9XG5cbiAgZ2V0VVJMICh0eXBlLCBpZCkge1xuXG4gICAgdmFyIHVybCA9IGAvJHt0eXBlfS9gO1xuXG4gICAgaWYgKGlkKSB7XG4gICAgICB1cmwgPSB1cmwgKyBpZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xuXG4gIH1cblxuICBmaW5kIChwcmVkaWNhdGUpIHtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHJldHVybiBfLmZpbmQodGhpcy5wb29sLCBwcmVkaWNhdGUpO1xuICAgIH0pO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IE1lbW9yeVBvb2w7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5cbmNsYXNzIE9wZXJhdGlvbiB7XG5cbiAgY29uc3RydWN0b3IgKG9wLCByZXNvdXJjZSkge1xuXG4gICAgdGhpcy5vcCA9IG9wO1xuICAgIHRoaXMucGF0aCA9IHJlc291cmNlLmdldExpbmsoJ3NlbGYnKTtcbiAgICBpZiAob3AgIT09ICdyZW1vdmUnKSB7XG4gICAgICB0aGlzLnZhbHVlID0gcmVzb3VyY2UuZGVzZXJpYWxpemUoKTtcbiAgICAgIHRoaXMudmFsdWUgPSBfLm9taXQodGhpcy52YWx1ZSwgJ2lkJyk7XG4gICAgICB0aGlzLnZhbHVlID0gXy5vbWl0KHRoaXMudmFsdWUsICdsaW5rcycpO1xuICAgIH1cbiAgICBpZiAob3AgPT09ICdhZGQnKSB7XG4gICAgfVxuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBPcGVyYXRpb247XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9SZXNvdXJjZSc7XG5pbXBvcnQgT3BlcmF0aW9uIGZyb20gJy4vT3BlcmF0aW9uJztcblxuXG5jbGFzcyBQb29sIHtcblxuICBjb25zdHJ1Y3RvcihyZXNvdXJjZXMpIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMsIEV2ZW50cyk7XG4gICAgdGhpcy5wb29sID0ge307XG4gICAgXy5lYWNoKHJlc291cmNlcywgdGhpcy5hZGQsIHRoaXMpO1xuXG4gIH1cblxuICBjcmVhdGUgKGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcblxuICAgIC8vIGltcGxlbWVudCB0aGlzLy8gaW1wbGVtZW50IHRoaXNcblxuICB9XG5cbiAgcmVtb3ZlIChyZXNvdXJjZSkge1xuXG4gICAgLy8gaW1wbGVtZW50IHRoaXNcblxuICB9XG5cbiAgZ2V0IChpZCkge1xuXG4gICAgLy8gaW1wbGVtZW50IHRoaXNcblxuICB9XG5cbiAgZ2V0VVJMICh0eXBlLCBpZCkge1xuXG4gICAgLy8gaW1wbGVtZW50IHRoaXNcblxuICB9XG5cbiAgYWRkIChyZXNvdXJjZSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlLFxuICAgICAgY3JlYXRlOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLnBvb2xbcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpXSkge1xuICAgICAgdGhpcy5wb29sW3Jlc291cmNlLmdldExpbmsoJ3NlbGYnKV0gPSByZXNvdXJjZTtcbiAgICAgIGlmICghb3B0aW9ucy5jcmVhdGUgJiYgIW9wdGlvbnMuYnlPcGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlckFkZChyZXNvdXJjZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHJlc291cmNlKTtcblxuICB9XG5cbiAgX3RyaWdnZXJUcmFuc2Zvcm0gKG9wLCByZXNvdXJjZSkge1xuXG4gICAgdGhpcy50cmlnZ2VyKCd0cmFuc2Zvcm0nLCBuZXcgT3BlcmF0aW9uKG9wLCByZXNvdXJjZSkpO1xuXG4gIH1cblxuICBfdHJpZ2dlckFkZCAocmVzb3VyY2UpIHtcblxuICAgIHRoaXMudHJpZ2dlcignYWRkJywgcmVzb3VyY2UpO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFBvb2w7XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9SZXNvdXJjZSc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL1Bvb2wnO1xuXG5jbGFzcyBQb29sQ29ubmVjdG9yIHtcblxuICBjb25zdHJ1Y3Rvcihzb3VyY2UsIHRhcmdldCwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLCBFdmVudHMpO1xuXG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy5zb3VyY2VUb1RhcmdldCA9IHt9O1xuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuXG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLnNvdXJjZSwgXCJ0cmFuc2Zvcm1cIiwgdGhpcy5fb25UcmFzbmZvcm0pO1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5zb3VyY2UsIFwiYWRkXCIsIHRoaXMuX29uQWRkKTtcbiAgICAvLyB0aGlzLnN0b3BMaXN0ZW5pbmcoc291cmNlLCBcInRyYW5zZm9ybVwiKTtcblxuICB9XG5cbiAgZ2V0UmVwbGljYSAocmVzb3VyY2VPclVSTCkge1xuXG4gICAgdmFyIHVybCA9IF8uaXNTdHJpbmcocmVzb3VyY2VPclVSTCkgP1xuICAgICAgcmVzb3VyY2VPclVSTCA6IHJlc291cmNlT3JVUkwuZ2V0TGluaygnc2VsZicpO1xuXG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0LmdldChcbiAgICAgIHRoaXMuZ2V0UmVwbGljYXRlZFVSTCh1cmwpKTtcblxuICB9XG5cbiAgZ2V0UmVwbGljYXRlZFVSTCAodXJsKSB7XG5cbiAgICByZXR1cm4gdGhpcy5zb3VyY2VUb1RhcmdldFt1cmxdO1xuXG4gIH1cblxuICBfb25UcmFzbmZvcm0gKG9wZXJhdGlvbikge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zLnB1c2gob3BlcmF0aW9uKTtcblxuICB9XG5cbiAgX29uQWRkIChyZXNvdXJjZSkge1xuXG4gICAgdmFyIGNsb25lZFJlc291cmNlID0gcmVzb3VyY2UuY2xvbmUoKTtcbiAgICB0aGlzLl9hZGRSZXBsaWNhTGluayhyZXNvdXJjZSwgY2xvbmVkUmVzb3VyY2UpO1xuICAgIHJldHVybiB0aGlzLnRhcmdldC5hZGQoY2xvbmVkUmVzb3VyY2UsIHtcbiAgICAgIGJ5T3BlcmF0aW9uOiBmYWxzZVxuICAgIH0pO1xuXG4gIH1cblxuICBmbHVzaCAoKSB7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICByZXR1cm4gXy5yZWR1Y2UodGhpcy5vcGVyYXRpb25zLCAocHJvbWlzZSwgb3BlcmF0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9hcHBseU9wZXJhdGlvblRvVGFyZ2V0KG9wZXJhdGlvbik7XG4gICAgICAgIH0pO1xuICAgICAgfSwgUSgpKVxuICAgIH0pXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5fY2xlYW5RdWV1ZXMoKTtcbiAgICB9KTtcblxuICB9XG5cbiAgX2NsZWFuUXVldWVzICgpIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuXG4gIH1cblxuICBfYXBwbHlPcGVyYXRpb25Ub1RhcmdldCAob3BlcmF0aW9uKSB7XG5cbiAgICB2YXIgb3AgPSBvcGVyYXRpb24ub3A7XG4gICAgdmFyIHZhbHVlID0gb3BlcmF0aW9uLnZhbHVlO1xuICAgIHZhciBwYXRoID0gb3BlcmF0aW9uLnBhdGg7XG5cblxuICAgIGlmIChvcCA9PT0gXCJhZGRcIikge1xuXG4gICAgICByZXR1cm4gdGhpcy50YXJnZXQuY3JlYXRlKHZhbHVlLCB7XG4gICAgICAgIGJ5T3BlcmF0aW9uOiB0cnVlLFxuICAgICAgfSlcbiAgICAgIC50aGVuKHJlc291cmNlID0+IHtcbiAgICAgICAgdmFyIHVybCA9IHJlc291cmNlLmdldExpbmsoJ3NlbGYnKTtcbiAgICAgICAgdGhpcy5fYWRkUmVwbGljYUxpbmsocGF0aCwgcmVzb3VyY2UpXG4gICAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICAgIH0pO1xuXG4gICAgfVxuICAgIGVsc2UgaWYgKG9wID09PSBcInJlcGxhY2VcIikge1xuXG4gICAgICByZXR1cm4gdGhpcy5nZXRSZXBsaWNhKHBhdGgpXG4gICAgICAudGhlbih0YXJnZXRSZXNvdXJjZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRhcmdldC5wYXRjaCh0YXJnZXRSZXNvdXJjZSwgdmFsdWUsIHtcbiAgICAgICAgICBieU9wZXJhdGlvbjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgfVxuICAgIGVsc2UgaWYgKG9wID09PSBcInJlbW92ZVwiKSB7XG5cbiAgICAgIHJldHVybiB0aGlzLmdldFJlcGxpY2EocGF0aClcbiAgICAgIC50aGVuKHRhcmdldFJlc291cmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0LnJlbW92ZSh0YXJnZXRSZXNvdXJjZSwge1xuICAgICAgICAgIGJ5T3BlcmF0aW9uOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgfVxuXG4gIF9hZGRSZXBsaWNhTGluayAoc291cmNlLCB0YXJnZXQpIHtcblxuICAgIHZhciBzb3VyY2VVUkwgPSBzb3VyY2U7XG4gICAgaWYgKCFfLmlzU3RyaW5nKHNvdXJjZSkpIHtcbiAgICAgIHNvdXJjZVVSTCA9IHNvdXJjZS5nZXRMaW5rKCdzZWxmJylcbiAgICB9XG5cbiAgICB2YXIgdGFyZ2V0VVJMID0gdGFyZ2V0O1xuICAgIGlmICghXy5pc1N0cmluZyh0YXJnZXQpKSB7XG4gICAgICB0YXJnZXRVUkwgPSB0YXJnZXQuZ2V0TGluaygnc2VsZicpXG4gICAgfVxuXG4gICAgdGhpcy5zb3VyY2VUb1RhcmdldFtzb3VyY2VVUkxdID0gdGFyZ2V0VVJMO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFBvb2xDb25uZWN0b3I7XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IFJlc3BvbnNlIGZyb20gJy4vUmVzcG9uc2UnO1xuXG52YXIgYWpheE9wdGlvbnMgPSB7XG5cbiAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgcHJvY2Vzc0RhdGE6IHRydWVcblxufTtcblxudmFyIHN0cmluZ2lmeVJlcXVpcmVkTWV0aG9kID0gZnVuY3Rpb24gKG1ldGhvZCkge1xuICAvLyB0aGVzZSBIVFRQIG1ldGhvZHMgcmVxdWlyZXMgSlNPTi5zdHJpbmdpZnlcbiAgcmV0dXJuICgvXihQT1NUfFBVVHxQQVRDSHxERUxFVEUpJC8udGVzdChtZXRob2QudG9VcHBlckNhc2UoKSkpO1xufTtcblxudmFyIG1ha2VBamF4UmVxdWVzdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBhamF4T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgaWYgKHN0cmluZ2lmeVJlcXVpcmVkTWV0aG9kKG9wdGlvbnMudHlwZSkpIHtcbiAgICBpZiAob3B0aW9ucy5jb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nKSB7XG4gICAgICBvcHRpb25zLmRhdGEgPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLmRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvcS93aWtpL0NvbWluZy1mcm9tLWpRdWVyeVxuICByZXR1cm4gUS5wcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAkLmFqYXgob3B0aW9ucylcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xuICAgICAgICBkZWxldGUganFYSFIudGhlbjsgLy8gdHJlYXQgeGhyIGFzIGEgbm9uLXByb21pc2VcbiAgICAgICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGpxWEhSKTtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmZhaWwoZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICBkZWxldGUganFYSFIudGhlbjsgLy8gdHJlYXQgeGhyIGFzIGEgbm9uLXByb21pc2VcbiAgICAgICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGpxWEhSKTtcbiAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgIH0pO1xuICB9KTtcblxufTtcblxuXG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICBoZWFkOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkhFQURcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZ2V0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwb3N0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcHV0OiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBVVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwYXRjaDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQQVRDSFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBkZWxldGU6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiREVMRVRFXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9XG5cbn07XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuXG5cbnZhciBpc1ZhbGlkQXR0cnMgPSBmdW5jdGlvbiAoZGF0YSkge1xuICByZXR1cm4gZGF0YSAmJiBkYXRhLnR5cGU7XG59O1xuXG5cbmNsYXNzIFJlc291cmNlIGV4dGVuZHMgTW9kZWwge1xuXG4gIGNvbnN0cnVjdG9yKGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIF8uZGVmYXVsdHMob3B0aW9ucywgeyBwYXJzZTogdHJ1ZSB9KTtcblxuICAgIHN1cGVyKGF0dHJpYnV0ZXMsIG9wdGlvbnMpO1xuXG4gICAgaWYgKCF0aGlzLmlkKSB7XG4gICAgICB0aGlzLmlkID0gdXVpZC52NCgpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZ2V0TGluaygnc2VsZicpKSB7XG4gICAgICBsZXQganNvbiA9IHRoaXMudG9KU09OKCk7XG4gICAgICB0aGlzLnNldExpbmsoJ3NlbGYnLCBgLyR7anNvbi50eXBlfS8ke3RoaXMuaWR9YCk7XG4gICAgfVxuXG4gIH1cblxuICBzZXRMaW5rIChrZXksIHJlc291cmNlKSB7XG5cbiAgICB2YXIgdXJsID0gXy5pc1N0cmluZyhyZXNvdXJjZSkgPyByZXNvdXJjZSA6IHJlc291cmNlLmdldExpbmsoJ3NlbGYnKTtcbiAgICB0aGlzLmxpbmtzW2tleV0gPSB1cmw7XG4gICAgdGhpcy50cmlnZ2VyKCdhZGQ6bGluaycsIGtleSwgdGhpcy5saW5rc1trZXldKTtcblxuICB9XG5cbiAgcmVtb3ZlTGluayAoa2V5KSB7XG5cbiAgICBpZiAoa2V5ID09PSAnc2VsZicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc2VsZiBsaW5rIGlzIG5vdCBhYmxlIHRvIHJlbW92ZWQhJyk7XG4gICAgfVxuICAgIHZhciByZW1vdmVkTGluayA9IHRoaXMubGlua3Nba2V5XTtcbiAgICBkZWxldGUgdGhpcy5saW5rc1trZXldO1xuICAgIHRoaXMudHJpZ2dlcigncmVtb3ZlOmxpbmsnLCBrZXksIHJlbW92ZWRMaW5rKTtcblxuICB9XG5cbiAgZ2V0TGluayAoa2V5KSB7XG5cbiAgICByZXR1cm4gdGhpcy5saW5rc1trZXldO1xuXG4gIH1cblxuICBwYXJzZSAoZGF0YSkge1xuXG4gICAgaWYgKCFpc1ZhbGlkQXR0cnMoZGF0YSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBkYXRhISB0eXBlIHNob3VsZCBiZSBwcm92aWRlZCcpO1xuICAgIH1cbiAgICB0aGlzLmxpbmtzID0gZGF0YS5saW5rcyB8fCB7fTtcbiAgICByZXR1cm4gXy5vbWl0KGRhdGEsICdsaW5rcycpO1xuXG4gIH1cblxuICBkZXNlcmlhbGl6ZSAoKSB7XG5cbiAgICB2YXIgZGF0YSA9IF8uY2xvbmUodGhpcy5hdHRyaWJ1dGVzLCB0cnVlKTtcbiAgICBkYXRhLmxpbmtzID0gXy5jbG9uZSh0aGlzLmxpbmtzLCB0cnVlKTtcbiAgICByZXR1cm4gZGF0YTtcblxuICB9XG5cbiAgY2xvbmUgKCkge1xuXG4gICAgcmV0dXJuIG5ldyBSZXNvdXJjZSh0aGlzLmRlc2VyaWFsaXplKCksIHsgcGFyc2U6IHRydWUgfSk7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUmVzb3VyY2U7XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5cbnZhciBfdmFsaWRhdGVSZXNwb25zZSA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICB2YXIgYm9keSA9IHhoci5yZXNwb25zZUpTT047XG5cbiAgaWYgKGJvZHkuZGF0YSA9PT0gdW5kZWZpbmVkICYmIGJvZHkuZXJyb3JzID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGRvY3VtZW50IE1VU1QgY29udGFpbiBlaXRoZXIgcHJpbWFyeSBkYXRhIFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJvciBhbiBhcnJheSBvZiBlcnJvciBvYmplY3RzLlwiKTtcbiAgfVxuXG59O1xuXG5cbnZhciBfaXNSZXNwb25zZUVycm9yID0gZnVuY3Rpb24gKHN0YXR1cykge1xuXG4gIHJldHVybiA0MDAgPD0gc3RhdHVzICYmIDYwMCA+IHN0YXR1cyA7XG5cbn07XG5cblxudmFyIF9wYXJzZURhdGEgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgaWYgKCF4aHIucmVzcG9uc2VKU09OKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHhoci5yZXNwb25zZUpTT04uZGF0YTtcblxufTtcblxuXG52YXIgX3BhcnNlRXJyb3JzID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICghKHhoci5yZXNwb25zZUpTT04gJiYgeGhyLnJlc3BvbnNlSlNPTi5lcnJvcnMgKSkge1xuICAgIGlmIChfaXNSZXNwb25zZUVycm9yKHhoci5zdGF0dXMpKSB7XG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgICAgfV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIGVycm9ycyA9IHhoci5yZXNwb25zZUpTT04uZXJyb3JzO1xuXG4gIHJldHVybiBfLm1hcChlcnJvcnMsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHJldHVybiBfLmV4dGVuZCh7XG4gICAgICBzdGF0dXM6IFwiXCIgKyB4aHIuc3RhdHVzXG4gICAgfSwgZXJyb3IpO1xuICB9KTtcblxufTtcblxuXG52YXIgX3BhcnNlSGVhZGVycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgdmFyIGhlYWRlclJlZ2V4ID0gL14oLio/KTpbIFxcdF0qKFteXFxyXFxuXSopJC9tZztcbiAgdmFyIGhlYWRlcnNTdHJpbmcgPSB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCk7XG4gIHZhciBmaW5kUmVzdWx0O1xuXG4gIHdoaWxlICgoZmluZFJlc3VsdCA9IGhlYWRlclJlZ2V4LmV4ZWMoaGVhZGVyc1N0cmluZykpICE9PSBudWxsKSB7XG4gICAgcmVzdWx0LnB1c2goZmluZFJlc3VsdC5zbGljZSgxKSk7XG4gIH1cblxuICByZXR1cm4gXy5vYmplY3QocmVzdWx0KTtcblxufTtcblxuXG5jbGFzcyBSZXNwb25zZSB7XG5cbiAgY29uc3RydWN0b3IgKHhocikge1xuXG4gICAgdGhpcy5yZXNwb25zZUpTT04gPSB4aHIucmVzcG9uc2VKU09OO1xuICAgIHRoaXMuZGF0YSA9IF9wYXJzZURhdGEoeGhyKTtcbiAgICB0aGlzLmVycm9ycyA9IF9wYXJzZUVycm9ycyh4aHIpO1xuICAgIHRoaXMuaGVhZGVycyA9IF9wYXJzZUhlYWRlcnMoeGhyKTtcbiAgICB0aGlzLm5hdGl2ZVhIUiA9IHhocjtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2U7XG4iLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi9Qb29sJztcbmltcG9ydCBPcGVyYXRpb24gZnJvbSAnLi9PcGVyYXRpb24nO1xuaW1wb3J0IFJFU1RmdWwgZnJvbSAnLi9SRVNUZnVsJztcblxuXG5jbGFzcyBSZXN0UG9vbCBleHRlbmRzIFBvb2wge1xuXG4gIGNvbnN0cnVjdG9yIChyZXNvdXJjZXMsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgc3VwZXIocmVzb3VyY2VzLCBvcHRpb25zKTtcbiAgICB0aGlzLnN5bmNyb25pemVyID0gUkVTVGZ1bDtcbiAgICB0aGlzLnR5cGVUb1VybCA9IG9wdGlvbnMudHlwZVRvVXJsIHx8IHt9O1xuXG4gIH1cblxuICBzZXRVUkwgKHR5cGUsIHVybCkge1xuXG4gICAgdGhpcy50eXBlVG9VcmxbdHlwZV0gPSB1cmw7XG5cbiAgfVxuXG4gIGNyZWF0ZSAoYXR0cmlidXRlcywgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zeW5jcm9uaXplci5wb3N0KHRoaXMuZ2V0VVJMKGF0dHJpYnV0ZXMudHlwZSksXG4gICAgICAgIHtcbiAgICAgICAgICBkYXRhOiBfLm9taXQoYXR0cmlidXRlcywgJ2lkJywgJ2xpbmtzJylcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHJldHVybiBuZXcgUmVzb3VyY2UocmVzcG9uc2UuZGF0YSwgb3B0aW9ucyk7XG4gICAgfSlcbiAgICAudGhlbihyZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGQocmVzb3VyY2UsIHsgY3JlYXRlOiB0cnVlIH0pO1xuICAgIH0pXG4gICAgLnRoZW4ocmVzb3VyY2UgPT4ge1xuICAgICAgaWYgKCFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJUcmFuc2Zvcm0oJ2FkZCcsIHJlc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KTtcblxuICB9XG5cbiAgcGF0Y2ggKHJlc291cmNlLCBhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCB7XG4gICAgICBieU9wZXJhdGlvbjogZmFsc2VcbiAgICB9KTtcblxuICAgIHZhciBzZXRBcmd1bWVudHMgPSBfLnRvQXJyYXkoYXJndW1lbnRzKS5zbGljZSgxKTtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHJlc291cmNlLnNldC5hcHBseShyZXNvdXJjZSwgc2V0QXJndW1lbnRzKTtcbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KVxuICAgIC50aGVuKHJlc291cmNlID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN5bmNyb25pemVyLnBhdGNoKFxuICAgICAgICByZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyksXG4gICAgICAgIHRoaXMuX3RvUmVzcG9uc2UocmVzb3VyY2UpKTtcbiAgICB9KVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHJlc291cmNlLnNldC5hcHBseShyZXNvdXJjZSwgcmVzcG9uc2UuZGF0YSk7XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSlcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICBpZiAoIW9wdGlvbnMuYnlPcGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlclRyYW5zZm9ybSgncmVwbGFjZScsIHJlc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KTtcblxuICB9XG5cbiAgcmVtb3ZlIChyZXNvdXJjZSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zeW5jcm9uaXplci5kZWxldGUoXG4gICAgICAgIHJlc291cmNlLmdldExpbmsoJ3NlbGYnKSk7XG4gICAgfSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICB0aGlzLnN0b3BMaXN0ZW5pbmcocmVzb3VyY2UpO1xuICAgICAgZGVsZXRlIHRoaXMucG9vbFtyZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyldO1xuICAgICAgaWYgKCFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJUcmFuc2Zvcm0oJ3JlbW92ZScsIHJlc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KTtcblxuICB9XG5cbiAgZ2V0ICh1cmwsIG9wdGlvbnMpIHtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN5bmNyb25pemVyLmdldCh1cmwsIG9wdGlvbnMpO1xuICAgIH0pXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKF8uaXNBcnJheShyZXNwb25zZS5kYXRhKSkge1xuICAgICAgICByZXR1cm4gXy5tYXAocmVzcG9uc2UuZGF0YSwgZGF0YSA9PlxuICAgICAgICAgIHRoaXMuX3JlZnJlc2hPckNyZWF0ZShkYXRhKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9yZWZyZXNoT3JDcmVhdGUocmVzcG9uc2UuZGF0YSlcbiAgICB9KTtcblxuICB9XG5cbiAgZ2V0VVJMICh0eXBlLCBpZCkge1xuXG4gICAgdmFyIHVybCA9IHRoaXMudHlwZVRvVXJsW3R5cGVdO1xuXG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdHlwZVske3R5cGV9XSBpcyBub3Qgc3VwcG9ydGVkIWApO1xuICAgIH1cblxuICAgIGlmIChpZCkge1xuICAgICAgdXJsID0gdXJsICsgaWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcblxuICB9XG5cbiAgX3RvUmVzcG9uc2UgKHJlc291cmNlKSB7XG5cbiAgICByZXR1cm4gXy5jbG9uZSh7XG4gICAgICBkYXRhOiByZXNvdXJjZS5kZXNlcmlhbGl6ZSgpXG4gICAgfSwgdHJ1ZSk7XG5cbiAgfVxuXG4gIF9yZWZyZXNoT3JDcmVhdGUgKGRhdGEpIHtcblxuICAgIHZhciByZXNvdXJjZSA9IHRoaXMucG9vbFtkYXRhLmxpbmtzLnNlbGZdO1xuXG4gICAgaWYgKHJlc291cmNlKSB7XG4gICAgICByZXNvdXJjZS5zZXQoZGF0YSwgeyBwYXJzZTogdHJ1ZSB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXNvdXJjZSA9IG5ldyBSZXNvdXJjZShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc291cmNlO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlc3RQb29sO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnYmFja2JvbmUnO1xuXG5cbmNsYXNzIFRyYW5zYWN0aW9uIHtcblxuICBjb25zdHJ1Y3Rvcihwb29sLCBvcHRpb25zKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLCBFdmVudHMpO1xuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30pO1xuXG4gICAgdGhpcy5wb29sID0gcG9vbDtcbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcblxuICB9XG5cbiAgYmVnaW4gKCkge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG4gICAgdGhpcy5fYWN0aXZhdGUoKTtcblxuICB9XG5cbiAgY29tbWl0ICgpIHtcblxuICAgIHRoaXMuX2RlYWN0aXZhdGUoKTtcblxuICB9XG5cblxuICBfYWN0aXZhdGUgKCkge1xuXG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLnBvb2wsICd0cmFuc2Zvcm0nLCB0aGlzLm9uVHJhbnNmb3JtKTtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG5cbiAgfVxuXG4gIF9kZWFjdGl2YXRlICgpIHtcblxuICAgIHRoaXMuc3RvcExpc3RlbmluZyh0aGlzLnBvb2wsICd0cmFuc2Zvcm0nLCB0aGlzLm9uVHJhbnNmb3JtKTtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gIH1cblxuICBvblRyYW5zZm9ybSAob3BlcmF0aW9uKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMucHVzaChvcGVyYXRpb24pO1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBUcmFuc2FjdGlvbjtcbiJdfQ==
