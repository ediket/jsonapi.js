(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JSONAPI = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Resource = require('./jsonapi/Resource');

var _Resource2 = _interopRequireWildcard(_Resource);

var _MemoryPool = require('./jsonapi/MemoryPool');

var _MemoryPool2 = _interopRequireWildcard(_MemoryPool);

var _RestPool = require('./jsonapi/RestPool');

var _RestPool2 = _interopRequireWildcard(_RestPool);

var _RESTful = require('./jsonapi/RESTful');

var _RESTful2 = _interopRequireWildcard(_RESTful);

var _Transaction = require('./jsonapi/Transaction');

var _Transaction2 = _interopRequireWildcard(_Transaction);

var _PoolConnector = require('./jsonapi/PoolConnector');

var _PoolConnector2 = _interopRequireWildcard(_PoolConnector);

exports.Transaction = _Transaction2['default'];
exports.Resource = _Resource2['default'];
exports.MemoryPool = _MemoryPool2['default'];
exports.RestPool = _RestPool2['default'];
exports.RESTful = _RESTful2['default'];
exports.PoolConnector = _PoolConnector2['default'];

},{"./jsonapi/MemoryPool":2,"./jsonapi/PoolConnector":5,"./jsonapi/RESTful":6,"./jsonapi/Resource":7,"./jsonapi/RestPool":9,"./jsonapi/Transaction":10}],2:[function(require,module,exports){
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
        return _this.add(resource);
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
      var _this4 = this;

      return _Q2['default'].fcall(function () {
        return _this4.pool[url];
      });
    }
  }, {
    key: 'getURL',
    value: function getURL(type, id) {

      return _import2['default'].find(this.pool, function (resource) {
        var json = resource.toJSON();
        return json.type === type && json.id === id;
      }).getLink('self');
    }
  }, {
    key: 'find',
    value: function find(predicate) {
      var _this5 = this;

      return _Q2['default'].fcall(function () {
        return _import2['default'].find(_this5.pool, predicate);
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

var Operation = function Operation(options) {
  _classCallCheck(this, Operation);

  this.op = options.op;
  this.path = options.path;
  if (options.op !== 'remove') {
    this.value = options.value;
  }
};

exports['default'] = Operation;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
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
        byOperation: false
      });

      if (!options.byOperation) {
        if (!this.pool[resource.getLink('self')]) {
          this.pool[resource.getLink('self')] = resource;
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

      this.trigger('transform', new _Operation2['default']({
        op: op,
        path: resource.getLink('self'),
        value: resource.toJSON()
      }));
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

var _Operation = require('./Operation');

var _Operation2 = _interopRequireWildcard(_Operation);

var PoolConnector = (function () {
  function PoolConnector(source, target) {
    var options = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, PoolConnector);

    _import2['default'].extend(this, _Events.Events);

    this.source = source;
    this.target = target;
    this.sourceToTarget = {};
    this.operations = [];
    this.cloneBays = [];

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

      this.cloneBays.push(resource);
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
        return _import2['default'].reduce(_this.cloneBays, function (promise, resource) {
          return promise.then(function () {
            return _this._applyCloneToTarget(resource);
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
      this.cloneBays = [];
    }
  }, {
    key: '_applyCloneToTarget',
    value: function _applyCloneToTarget(resource) {

      var clonedResource = resource.clone();
      this._addReplicaLink(resource, clonedResource);
      return this.target.add(clonedResource, {
        byOperation: false
      });
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

},{"./Operation":3,"./Pool":4,"./Resource":7,"backbone":"backbone","lodash":"lodash","q":"q"}],6:[function(require,module,exports){
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

    if (!this.getLink('self')) {
      this.setLink('self', '/' + _uuid2['default'].v4());
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
          data: attributes
        });
      }).then(function (response) {
        return new _Resource2['default'](response.data, options);
      }).then(function (resource) {
        return _this.add(resource);
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
    value: function get(url) {
      var _this4 = this;

      var resource = this.pool[url];

      return _Q2['default'].fcall(function () {
        return _this4.syncronizer.get(url);
      }).then(function (response) {
        if (resource) {
          resource.set(response.data, { parse: true });
        } else {
          resource = new _Resource2['default'](response.data);
        }
        return resource;
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

      var result = {};
      result.data = resource.toJSON();
      result.data.links = resource.links;
      return _import2['default'].clone(result, true);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9zcmMvanNvbmFwaS5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL3NyYy9qc29uYXBpL01lbW9yeVBvb2wuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9zcmMvanNvbmFwaS9PcGVyYXRpb24uanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9zcmMvanNvbmFwaS9Qb29sLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvc3JjL2pzb25hcGkvUG9vbENvbm5lY3Rvci5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL3NyYy9qc29uYXBpL1JFU1RmdWwuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9zcmMvanNvbmFwaS9SZXNvdXJjZS5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL3NyYy9qc29uYXBpL1Jlc3BvbnNlLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvc3JjL2pzb25hcGkvUmVzdFBvb2wuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9zcmMvanNvbmFwaS9UcmFuc2FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O3dCQ0FxQixvQkFBb0I7Ozs7MEJBQ2xCLHNCQUFzQjs7Ozt3QkFDeEIsb0JBQW9COzs7O3VCQUNyQixtQkFBbUI7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RVcsdUJBQUc7O0FBRWIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDN0QsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FFckI7OztXQUVXLHFCQUFDLFNBQVMsRUFBRTs7QUFFdEIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FFakM7OztTQTVDRyxXQUFXOzs7cUJBZ0RGLFdBQVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlc291cmNlIGZyb20gJy4vanNvbmFwaS9SZXNvdXJjZSc7XG5pbXBvcnQgTWVtb3J5UG9vbCBmcm9tICcuL2pzb25hcGkvTWVtb3J5UG9vbCc7XG5pbXBvcnQgUmVzdFBvb2wgZnJvbSAnLi9qc29uYXBpL1Jlc3RQb29sJztcbmltcG9ydCBSRVNUZnVsIGZyb20gJy4vanNvbmFwaS9SRVNUZnVsJztcbmltcG9ydCBUcmFuc2FjdGlvbiBmcm9tICcuL2pzb25hcGkvVHJhbnNhY3Rpb24nO1xuaW1wb3J0IFBvb2xDb25uZWN0b3IgZnJvbSAnLi9qc29uYXBpL1Bvb2xDb25uZWN0b3InO1xuXG5cbmV4cG9ydCB7XG4gIFRyYW5zYWN0aW9uLFxuICBSZXNvdXJjZSxcbiAgTWVtb3J5UG9vbCxcbiAgUmVzdFBvb2wsXG4gIFJFU1RmdWwsXG4gIFBvb2xDb25uZWN0b3Jcbn07XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9SZXNvdXJjZSc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL1Bvb2wnO1xuaW1wb3J0IE9wZXJhdGlvbiBmcm9tICcuL09wZXJhdGlvbic7XG5cblxuY2xhc3MgTWVtb3J5UG9vbCBleHRlbmRzIFBvb2wge1xuXG4gIGNvbnN0cnVjdG9yKHJlc291cmNlcykge1xuXG4gICAgc3VwZXIocmVzb3VyY2VzKTtcblxuICB9XG5cbiAgY3JlYXRlIChhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCB7XG4gICAgICBieU9wZXJhdGlvbjogZmFsc2VcbiAgICB9KTtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUmVzb3VyY2UoYXR0cmlidXRlcywgb3B0aW9ucyk7XG4gICAgfSlcbiAgICAudGhlbihyZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGQocmVzb3VyY2UpO1xuICAgIH0pXG4gICAgLnRoZW4ocmVzb3VyY2UgPT4ge1xuICAgICAgaWYgKCFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJUcmFuc2Zvcm0oJ2FkZCcsIHJlc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KTtcblxuICB9XG5cbiAgcGF0Y2ggKHJlc291cmNlLCBhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCB7XG4gICAgICBieU9wZXJhdGlvbjogZmFsc2VcbiAgICB9KTtcblxuICAgIHZhciBzZXRBcmd1bWVudHMgPSBfLnRvQXJyYXkoYXJndW1lbnRzKS5zbGljZSgxKTtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHJlc291cmNlLnNldC5hcHBseShyZXNvdXJjZSwgc2V0QXJndW1lbnRzKTtcbiAgICAgIGlmICghb3B0aW9ucy5ieU9wZXJhdGlvbikge1xuICAgICAgICB0aGlzLl90cmlnZ2VyVHJhbnNmb3JtKCdyZXBsYWNlJywgcmVzb3VyY2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgIH0pO1xuXG4gIH1cblxuICByZW1vdmUgKHJlc291cmNlLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCB7XG4gICAgICBieU9wZXJhdGlvbjogZmFsc2VcbiAgICB9KTtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHRoaXMuc3RvcExpc3RlbmluZyhyZXNvdXJjZSk7XG4gICAgICBkZWxldGUgdGhpcy5wb29sW3Jlc291cmNlLmdldExpbmsoJ3NlbGYnKV07XG4gICAgICBpZiAoIW9wdGlvbnMuYnlPcGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlclRyYW5zZm9ybSgncmVtb3ZlJywgcmVzb3VyY2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgIH0pO1xuXG4gIH1cblxuICBnZXQgKHVybCkge1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucG9vbFt1cmxdO1xuICAgIH0pO1xuXG4gIH1cblxuICBnZXRVUkwgKHR5cGUsIGlkKSB7XG5cbiAgICByZXR1cm4gXy5maW5kKHRoaXMucG9vbCwgZnVuY3Rpb24gKHJlc291cmNlKSB7XG4gICAgICB2YXIganNvbiA9IHJlc291cmNlLnRvSlNPTigpO1xuICAgICAgcmV0dXJuIGpzb24udHlwZSA9PT0gdHlwZSAmJiBqc29uLmlkID09PSBpZDtcbiAgICB9KS5nZXRMaW5rKCdzZWxmJyk7XG5cbiAgfVxuXG4gIGZpbmQgKHByZWRpY2F0ZSkge1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnBvb2wsIHByZWRpY2F0ZSk7XG4gICAgfSk7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgTWVtb3J5UG9vbDtcbiIsImNsYXNzIE9wZXJhdGlvbiB7XG5cbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcblxuICAgIHRoaXMub3AgPSBvcHRpb25zLm9wO1xuICAgIHRoaXMucGF0aCA9IG9wdGlvbnMucGF0aDtcbiAgICBpZiAob3B0aW9ucy5vcCAhPT0gJ3JlbW92ZScpIHtcbiAgICAgIHRoaXMudmFsdWUgPSBvcHRpb25zLnZhbHVlO1xuICAgIH1cblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgT3BlcmF0aW9uO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xuaW1wb3J0IE9wZXJhdGlvbiBmcm9tICcuL09wZXJhdGlvbic7XG5cblxuY2xhc3MgUG9vbCB7XG5cbiAgY29uc3RydWN0b3IocmVzb3VyY2VzKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLCBFdmVudHMpO1xuICAgIHRoaXMucG9vbCA9IHt9O1xuICAgIF8uZWFjaChyZXNvdXJjZXMsIHRoaXMuYWRkLCB0aGlzKTtcblxuICB9XG5cbiAgY3JlYXRlIChhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG5cbiAgICAvLyBpbXBsZW1lbnQgdGhpcy8vIGltcGxlbWVudCB0aGlzXG5cbiAgfVxuXG4gIHJlbW92ZSAocmVzb3VyY2UpIHtcblxuICAgIC8vIGltcGxlbWVudCB0aGlzXG5cbiAgfVxuXG4gIGdldCAoaWQpIHtcblxuICAgIC8vIGltcGxlbWVudCB0aGlzXG5cbiAgfVxuXG4gIGdldFVSTCAodHlwZSwgaWQpIHtcblxuICAgIC8vIGltcGxlbWVudCB0aGlzXG5cbiAgfVxuXG4gIGFkZCAocmVzb3VyY2UsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIHtcbiAgICAgIGJ5T3BlcmF0aW9uOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgaWYgKCFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICBpZiAoIXRoaXMucG9vbFtyZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyldKSB7XG4gICAgICAgIHRoaXMucG9vbFtyZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyldID0gcmVzb3VyY2U7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJBZGQocmVzb3VyY2UpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiByZXNvdXJjZSk7XG5cbiAgfVxuXG4gIF90cmlnZ2VyVHJhbnNmb3JtIChvcCwgcmVzb3VyY2UpIHtcblxuICAgIHRoaXMudHJpZ2dlcigndHJhbnNmb3JtJywgbmV3IE9wZXJhdGlvbih7XG4gICAgICBvcDogb3AsXG4gICAgICBwYXRoOiByZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyksXG4gICAgICB2YWx1ZTogcmVzb3VyY2UudG9KU09OKClcbiAgICB9KSk7XG5cbiAgfVxuXG4gIF90cmlnZ2VyQWRkIChyZXNvdXJjZSkge1xuXG4gICAgdGhpcy50cmlnZ2VyKCdhZGQnLCByZXNvdXJjZSk7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUG9vbDtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCBQb29sIGZyb20gJy4vUG9vbCc7XG5pbXBvcnQgT3BlcmF0aW9uIGZyb20gJy4vT3BlcmF0aW9uJztcblxuY2xhc3MgUG9vbENvbm5lY3RvciB7XG5cbiAgY29uc3RydWN0b3Ioc291cmNlLCB0YXJnZXQsIG9wdGlvbnMgPSB7fSkge1xuXG4gICAgXy5leHRlbmQodGhpcywgRXZlbnRzKTtcblxuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMuc291cmNlVG9UYXJnZXQgPSB7fTtcbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcbiAgICB0aGlzLmNsb25lQmF5cyA9IFtdO1xuXG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLnNvdXJjZSwgXCJ0cmFuc2Zvcm1cIiwgdGhpcy5fb25UcmFzbmZvcm0pO1xuICAgIHRoaXMubGlzdGVuVG8odGhpcy5zb3VyY2UsIFwiYWRkXCIsIHRoaXMuX29uQWRkKTtcbiAgICAvLyB0aGlzLnN0b3BMaXN0ZW5pbmcoc291cmNlLCBcInRyYW5zZm9ybVwiKTtcblxuICB9XG5cbiAgZ2V0UmVwbGljYSAocmVzb3VyY2VPclVSTCkge1xuXG4gICAgdmFyIHVybCA9IF8uaXNTdHJpbmcocmVzb3VyY2VPclVSTCkgP1xuICAgICAgcmVzb3VyY2VPclVSTCA6IHJlc291cmNlT3JVUkwuZ2V0TGluaygnc2VsZicpO1xuXG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0LmdldChcbiAgICAgIHRoaXMuZ2V0UmVwbGljYXRlZFVSTCh1cmwpKTtcblxuICB9XG5cbiAgZ2V0UmVwbGljYXRlZFVSTCAodXJsKSB7XG5cbiAgICByZXR1cm4gdGhpcy5zb3VyY2VUb1RhcmdldFt1cmxdO1xuXG4gIH1cblxuICBfb25UcmFzbmZvcm0gKG9wZXJhdGlvbikge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zLnB1c2gob3BlcmF0aW9uKTtcblxuICB9XG5cbiAgX29uQWRkIChyZXNvdXJjZSkge1xuXG4gICAgdGhpcy5jbG9uZUJheXMucHVzaChyZXNvdXJjZSk7XG5cbiAgfVxuXG4gIGZsdXNoICgpIHtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHJldHVybiBfLnJlZHVjZSh0aGlzLm9wZXJhdGlvbnMsIChwcm9taXNlLCBvcGVyYXRpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5T3BlcmF0aW9uVG9UYXJnZXQob3BlcmF0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBRKCkpXG4gICAgfSlcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gXy5yZWR1Y2UodGhpcy5jbG9uZUJheXMsIChwcm9taXNlLCByZXNvdXJjZSkgPT4ge1xuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlDbG9uZVRvVGFyZ2V0KHJlc291cmNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBRKCkpO1xuICAgIH0pXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5fY2xlYW5RdWV1ZXMoKTtcbiAgICB9KTtcblxuICB9XG5cbiAgX2NsZWFuUXVldWVzICgpIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuY2xvbmVCYXlzID0gW107XG5cbiAgfVxuXG4gIF9hcHBseUNsb25lVG9UYXJnZXQgKHJlc291cmNlKSB7XG5cbiAgICB2YXIgY2xvbmVkUmVzb3VyY2UgPSByZXNvdXJjZS5jbG9uZSgpO1xuICAgIHRoaXMuX2FkZFJlcGxpY2FMaW5rKHJlc291cmNlLCBjbG9uZWRSZXNvdXJjZSk7XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0LmFkZChjbG9uZWRSZXNvdXJjZSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgfVxuXG4gIF9hcHBseU9wZXJhdGlvblRvVGFyZ2V0IChvcGVyYXRpb24pIHtcblxuICAgIHZhciBvcCA9IG9wZXJhdGlvbi5vcDtcbiAgICB2YXIgdmFsdWUgPSBvcGVyYXRpb24udmFsdWU7XG4gICAgdmFyIHBhdGggPSBvcGVyYXRpb24ucGF0aDtcblxuXG4gICAgaWYgKG9wID09PSBcImFkZFwiKSB7XG5cbiAgICAgIHJldHVybiB0aGlzLnRhcmdldC5jcmVhdGUodmFsdWUsIHtcbiAgICAgICAgYnlPcGVyYXRpb246IHRydWUsXG4gICAgICB9KVxuICAgICAgLnRoZW4ocmVzb3VyY2UgPT4ge1xuICAgICAgICB2YXIgdXJsID0gcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpO1xuICAgICAgICB0aGlzLl9hZGRSZXBsaWNhTGluayhwYXRoLCByZXNvdXJjZSlcbiAgICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgICAgfSk7XG5cbiAgICB9XG4gICAgZWxzZSBpZiAob3AgPT09IFwicmVwbGFjZVwiKSB7XG5cbiAgICAgIHJldHVybiB0aGlzLmdldFJlcGxpY2EocGF0aClcbiAgICAgIC50aGVuKHRhcmdldFJlc291cmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0LnBhdGNoKHRhcmdldFJlc291cmNlLCB2YWx1ZSwge1xuICAgICAgICAgIGJ5T3BlcmF0aW9uOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICB9XG4gICAgZWxzZSBpZiAob3AgPT09IFwicmVtb3ZlXCIpIHtcblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVwbGljYShwYXRoKVxuICAgICAgLnRoZW4odGFyZ2V0UmVzb3VyY2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50YXJnZXQucmVtb3ZlKHRhcmdldFJlc291cmNlLCB7XG4gICAgICAgICAgYnlPcGVyYXRpb246IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIH1cblxuICB9XG5cbiAgX2FkZFJlcGxpY2FMaW5rIChzb3VyY2UsIHRhcmdldCkge1xuXG4gICAgdmFyIHNvdXJjZVVSTCA9IHNvdXJjZTtcbiAgICBpZiAoIV8uaXNTdHJpbmcoc291cmNlKSkge1xuICAgICAgc291cmNlVVJMID0gc291cmNlLmdldExpbmsoJ3NlbGYnKVxuICAgIH1cblxuICAgIHZhciB0YXJnZXRVUkwgPSB0YXJnZXQ7XG4gICAgaWYgKCFfLmlzU3RyaW5nKHRhcmdldCkpIHtcbiAgICAgIHRhcmdldFVSTCA9IHRhcmdldC5nZXRMaW5rKCdzZWxmJylcbiAgICB9XG5cbiAgICB0aGlzLnNvdXJjZVRvVGFyZ2V0W3NvdXJjZVVSTF0gPSB0YXJnZXRVUkw7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUG9vbENvbm5lY3RvcjtcbiIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgUmVzcG9uc2UgZnJvbSAnLi9SZXNwb25zZSc7XG5cbnZhciBhamF4T3B0aW9ucyA9IHtcblxuICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICBwcm9jZXNzRGF0YTogdHJ1ZVxuXG59O1xuXG52YXIgc3RyaW5naWZ5UmVxdWlyZWRNZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gIC8vIHRoZXNlIEhUVFAgbWV0aG9kcyByZXF1aXJlcyBKU09OLnN0cmluZ2lmeVxuICByZXR1cm4gKC9eKFBPU1R8UFVUfFBBVENIfERFTEVURSkkLy50ZXN0KG1ldGhvZC50b1VwcGVyQ2FzZSgpKSk7XG59O1xuXG52YXIgbWFrZUFqYXhSZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gXy5leHRlbmQoe30sIGFqYXhPcHRpb25zLCBvcHRpb25zKTtcblxuICBpZiAoc3RyaW5naWZ5UmVxdWlyZWRNZXRob2Qob3B0aW9ucy50eXBlKSkge1xuICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgIG9wdGlvbnMuZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL3dpa2kvQ29taW5nLWZyb20talF1ZXJ5XG4gIHJldHVybiBRLnByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICQuYWpheChvcHRpb25zKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZmFpbChmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgIGRlbGV0ZSBqcVhIUi50aGVuOyAvLyB0cmVhdCB4aHIgYXMgYSBub24tcHJvbWlzZVxuICAgICAgICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoanFYSFIpO1xuICAgICAgICByZWplY3QocmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH0pO1xuXG59O1xuXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGhlYWQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiSEVBRFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHBvc3Q6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfSxcblxuICBwdXQ6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUFVUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHBhdGNoOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBBVENIXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGRlbGV0ZTogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJERUxFVEVcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH1cblxufTtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5cblxudmFyIGlzVmFsaWRBdHRycyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIHJldHVybiBkYXRhICYmIGRhdGEudHlwZTtcbn07XG5cblxuY2xhc3MgUmVzb3VyY2UgZXh0ZW5kcyBNb2RlbCB7XG5cbiAgY29uc3RydWN0b3IoYXR0cmlidXRlcywgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgXy5kZWZhdWx0cyhvcHRpb25zLCB7IHBhcnNlOiB0cnVlIH0pO1xuXG4gICAgc3VwZXIoYXR0cmlidXRlcywgb3B0aW9ucyk7XG5cbiAgICBpZiAoIXRoaXMuZ2V0TGluaygnc2VsZicpKSB7XG4gICAgICB0aGlzLnNldExpbmsoJ3NlbGYnLCAnLycgKyB1dWlkLnY0KCkpO1xuICAgIH1cblxuICB9XG5cbiAgc2V0TGluayAoa2V5LCByZXNvdXJjZSkge1xuXG4gICAgdmFyIHVybCA9IF8uaXNTdHJpbmcocmVzb3VyY2UpID8gcmVzb3VyY2UgOiByZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyk7XG4gICAgdGhpcy5saW5rc1trZXldID0gdXJsO1xuICAgIHRoaXMudHJpZ2dlcignYWRkOmxpbmsnLCBrZXksIHRoaXMubGlua3Nba2V5XSk7XG5cbiAgfVxuXG4gIHJlbW92ZUxpbmsgKGtleSkge1xuXG4gICAgaWYgKGtleSA9PT0gJ3NlbGYnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NlbGYgbGluayBpcyBub3QgYWJsZSB0byByZW1vdmVkIScpO1xuICAgIH1cbiAgICB2YXIgcmVtb3ZlZExpbmsgPSB0aGlzLmxpbmtzW2tleV07XG4gICAgZGVsZXRlIHRoaXMubGlua3Nba2V5XTtcbiAgICB0aGlzLnRyaWdnZXIoJ3JlbW92ZTpsaW5rJywga2V5LCByZW1vdmVkTGluayk7XG5cbiAgfVxuXG4gIGdldExpbmsgKGtleSkge1xuXG4gICAgcmV0dXJuIHRoaXMubGlua3Nba2V5XTtcblxuICB9XG5cbiAgcGFyc2UgKGRhdGEpIHtcblxuICAgIGlmICghaXNWYWxpZEF0dHJzKGRhdGEpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZGF0YSEgdHlwZSBzaG91bGQgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG4gICAgdGhpcy5saW5rcyA9IGRhdGEubGlua3MgfHwge307XG4gICAgcmV0dXJuIF8ub21pdChkYXRhLCAnbGlua3MnKTtcblxuICB9XG5cbiAgZGVzZXJpYWxpemUgKCkge1xuXG4gICAgdmFyIGRhdGEgPSBfLmNsb25lKHRoaXMuYXR0cmlidXRlcywgdHJ1ZSk7XG4gICAgZGF0YS5saW5rcyA9IF8uY2xvbmUodGhpcy5saW5rcywgdHJ1ZSk7XG4gICAgcmV0dXJuIGRhdGE7XG5cbiAgfVxuXG4gIGNsb25lICgpIHtcblxuICAgIHJldHVybiBuZXcgUmVzb3VyY2UodGhpcy5kZXNlcmlhbGl6ZSgpLCB7IHBhcnNlOiB0cnVlIH0pO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuXG52YXIgX3ZhbGlkYXRlUmVzcG9uc2UgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgdmFyIGJvZHkgPSB4aHIucmVzcG9uc2VKU09OO1xuXG4gIGlmIChib2R5LmRhdGEgPT09IHVuZGVmaW5lZCAmJiBib2R5LmVycm9ycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQSBkb2N1bWVudCBNVVNUIGNvbnRhaW4gZWl0aGVyIHByaW1hcnkgZGF0YSBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwib3IgYW4gYXJyYXkgb2YgZXJyb3Igb2JqZWN0cy5cIik7XG4gIH1cblxufTtcblxuXG52YXIgX2lzUmVzcG9uc2VFcnJvciA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcblxuICByZXR1cm4gNDAwIDw9IHN0YXR1cyAmJiA2MDAgPiBzdGF0dXMgO1xuXG59O1xuXG5cbnZhciBfcGFyc2VEYXRhID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICgheGhyLnJlc3BvbnNlSlNPTikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB4aHIucmVzcG9uc2VKU09OLmRhdGE7XG5cbn07XG5cblxudmFyIF9wYXJzZUVycm9ycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBpZiAoISh4aHIucmVzcG9uc2VKU09OICYmIHhoci5yZXNwb25zZUpTT04uZXJyb3JzICkpIHtcbiAgICBpZiAoX2lzUmVzcG9uc2VFcnJvcih4aHIuc3RhdHVzKSkge1xuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIHN0YXR1czogXCJcIiArIHhoci5zdGF0dXNcbiAgICAgIH1dO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBlcnJvcnMgPSB4aHIucmVzcG9uc2VKU09OLmVycm9ycztcblxuICByZXR1cm4gXy5tYXAoZXJyb3JzLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICByZXR1cm4gXy5leHRlbmQoe1xuICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgIH0sIGVycm9yKTtcbiAgfSk7XG5cbn07XG5cblxudmFyIF9wYXJzZUhlYWRlcnMgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIHZhciBoZWFkZXJSZWdleCA9IC9eKC4qPyk6WyBcXHRdKihbXlxcclxcbl0qKSQvbWc7XG4gIHZhciBoZWFkZXJzU3RyaW5nID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpO1xuICB2YXIgZmluZFJlc3VsdDtcblxuICB3aGlsZSAoKGZpbmRSZXN1bHQgPSBoZWFkZXJSZWdleC5leGVjKGhlYWRlcnNTdHJpbmcpKSAhPT0gbnVsbCkge1xuICAgIHJlc3VsdC5wdXNoKGZpbmRSZXN1bHQuc2xpY2UoMSkpO1xuICB9XG5cbiAgcmV0dXJuIF8ub2JqZWN0KHJlc3VsdCk7XG5cbn07XG5cblxuY2xhc3MgUmVzcG9uc2Uge1xuXG4gIGNvbnN0cnVjdG9yICh4aHIpIHtcblxuICAgIHRoaXMucmVzcG9uc2VKU09OID0geGhyLnJlc3BvbnNlSlNPTjtcbiAgICB0aGlzLmRhdGEgPSBfcGFyc2VEYXRhKHhocik7XG4gICAgdGhpcy5lcnJvcnMgPSBfcGFyc2VFcnJvcnMoeGhyKTtcbiAgICB0aGlzLmhlYWRlcnMgPSBfcGFyc2VIZWFkZXJzKHhocik7XG4gICAgdGhpcy5uYXRpdmVYSFIgPSB4aHI7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNlO1xuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCBQb29sIGZyb20gJy4vUG9vbCc7XG5pbXBvcnQgT3BlcmF0aW9uIGZyb20gJy4vT3BlcmF0aW9uJztcbmltcG9ydCBSRVNUZnVsIGZyb20gJy4vUkVTVGZ1bCc7XG5cblxuY2xhc3MgUmVzdFBvb2wgZXh0ZW5kcyBQb29sIHtcblxuICBjb25zdHJ1Y3RvciAocmVzb3VyY2VzLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHN1cGVyKHJlc291cmNlcywgb3B0aW9ucyk7XG4gICAgdGhpcy5zeW5jcm9uaXplciA9IFJFU1RmdWw7XG4gICAgdGhpcy50eXBlVG9VcmwgPSBvcHRpb25zLnR5cGVUb1VybCB8fCB7fTtcblxuICB9XG5cbiAgc2V0VVJMICh0eXBlLCB1cmwpIHtcblxuICAgIHRoaXMudHlwZVRvVXJsW3R5cGVdID0gdXJsO1xuXG4gIH1cblxuICBjcmVhdGUgKGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIHtcbiAgICAgIGJ5T3BlcmF0aW9uOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3luY3Jvbml6ZXIucG9zdCh0aGlzLmdldFVSTChhdHRyaWJ1dGVzLnR5cGUpLFxuICAgICAgICB7XG4gICAgICAgICAgZGF0YTogYXR0cmlidXRlc1xuICAgICAgICB9KTtcbiAgICB9KVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHJldHVybiBuZXcgUmVzb3VyY2UocmVzcG9uc2UuZGF0YSwgb3B0aW9ucyk7XG4gICAgfSlcbiAgICAudGhlbihyZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGQocmVzb3VyY2UpO1xuICAgIH0pXG4gICAgLnRoZW4ocmVzb3VyY2UgPT4ge1xuICAgICAgaWYgKCFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJUcmFuc2Zvcm0oJ2FkZCcsIHJlc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KTtcblxuICB9XG5cbiAgcGF0Y2ggKHJlc291cmNlLCBhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCB7XG4gICAgICBieU9wZXJhdGlvbjogZmFsc2VcbiAgICB9KTtcblxuICAgIHZhciBzZXRBcmd1bWVudHMgPSBfLnRvQXJyYXkoYXJndW1lbnRzKS5zbGljZSgxKTtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHJlc291cmNlLnNldC5hcHBseShyZXNvdXJjZSwgc2V0QXJndW1lbnRzKTtcbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KVxuICAgIC50aGVuKHJlc291cmNlID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN5bmNyb25pemVyLnBhdGNoKFxuICAgICAgICByZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyksXG4gICAgICAgIHRoaXMuX3RvUmVzcG9uc2UocmVzb3VyY2UpKTtcbiAgICB9KVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHJlc291cmNlLnNldC5hcHBseShyZXNvdXJjZSwgcmVzcG9uc2UuZGF0YSk7XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSlcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICBpZiAoIW9wdGlvbnMuYnlPcGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlclRyYW5zZm9ybSgncmVwbGFjZScsIHJlc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KTtcblxuICB9XG5cbiAgcmVtb3ZlIChyZXNvdXJjZSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zeW5jcm9uaXplci5kZWxldGUoXG4gICAgICAgIHJlc291cmNlLmdldExpbmsoJ3NlbGYnKSk7XG4gICAgfSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICB0aGlzLnN0b3BMaXN0ZW5pbmcocmVzb3VyY2UpO1xuICAgICAgZGVsZXRlIHRoaXMucG9vbFtyZXNvdXJjZS5nZXRMaW5rKCdzZWxmJyldO1xuICAgICAgaWYgKCFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJUcmFuc2Zvcm0oJ3JlbW92ZScsIHJlc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KTtcblxuICB9XG5cbiAgZ2V0ICh1cmwpIHtcblxuICAgIHZhciByZXNvdXJjZSA9IHRoaXMucG9vbFt1cmxdO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3luY3Jvbml6ZXIuZ2V0KHVybCk7XG4gICAgfSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzb3VyY2UpIHtcbiAgICAgICAgcmVzb3VyY2Uuc2V0KHJlc3BvbnNlLmRhdGEsIHsgcGFyc2U6IHRydWUgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzb3VyY2UgPSBuZXcgUmVzb3VyY2UocmVzcG9uc2UuZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGdldFVSTCAodHlwZSwgaWQpIHtcblxuICAgIHZhciB1cmwgPSB0aGlzLnR5cGVUb1VybFt0eXBlXTtcblxuICAgIGlmICghdXJsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHR5cGVbJHt0eXBlfV0gaXMgbm90IHN1cHBvcnRlZCFgKTtcbiAgICB9XG5cbiAgICBpZiAoaWQpIHtcbiAgICAgIHVybCA9IHVybCArIGlkO1xuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG5cbiAgfVxuXG4gIF90b1Jlc3BvbnNlIChyZXNvdXJjZSkge1xuXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5kYXRhID0gcmVzb3VyY2UudG9KU09OKCk7XG4gICAgcmVzdWx0LmRhdGEubGlua3MgPSByZXNvdXJjZS5saW5rcztcbiAgICByZXR1cm4gXy5jbG9uZShyZXN1bHQsIHRydWUpO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlc3RQb29sO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnYmFja2JvbmUnO1xuXG5cbmNsYXNzIFRyYW5zYWN0aW9uIHtcblxuICBjb25zdHJ1Y3Rvcihwb29sLCBvcHRpb25zKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLCBFdmVudHMpO1xuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30pO1xuXG4gICAgdGhpcy5wb29sID0gcG9vbDtcbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBbXTtcblxuICB9XG5cbiAgYmVnaW4gKCkge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG4gICAgdGhpcy5fYWN0aXZhdGUoKTtcblxuICB9XG5cbiAgY29tbWl0ICgpIHtcblxuICAgIHRoaXMuX2RlYWN0aXZhdGUoKTtcblxuICB9XG5cblxuICBfYWN0aXZhdGUgKCkge1xuXG4gICAgdGhpcy5saXN0ZW5Ubyh0aGlzLnBvb2wsICd0cmFuc2Zvcm0nLCB0aGlzLm9uVHJhbnNmb3JtKTtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG5cbiAgfVxuXG4gIF9kZWFjdGl2YXRlICgpIHtcblxuICAgIHRoaXMuc3RvcExpc3RlbmluZyh0aGlzLnBvb2wsICd0cmFuc2Zvcm0nLCB0aGlzLm9uVHJhbnNmb3JtKTtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gIH1cblxuICBvblRyYW5zZm9ybSAob3BlcmF0aW9uKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMucHVzaChvcGVyYXRpb24pO1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBUcmFuc2FjdGlvbjtcbiJdfQ==
