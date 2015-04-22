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
        _this3.pool['delete'](resource.getLink('self'));
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
        return _this4.pool.get(url);
      });
    }
  }, {
    key: 'add',
    value: function add(resource) {
      var _this5 = this;

      return _Q2['default'].fcall(function () {
        _this5.pool.set(resource.getLink('self'), resource);
        return resource;
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
    this.pool = new Map();
    _import2['default'].each(resources, this.add, this);
  }

  _createClass(Pool, [{
    key: 'create',
    value: function create(attributes, options) {}
  }, {
    key: 'add',
    value: function add(resource) {}
  }, {
    key: 'remove',
    value: function remove(resource) {}
  }, {
    key: 'get',
    value: function get(id) {}
  }, {
    key: '_triggerTransform',
    value: function _triggerTransform(op, resource) {

      this.trigger('transform', new _Operation2['default']({
        op: op,
        path: resource.getLink('self'),
        value: resource.toJSON()
      }));
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

    this.listenTo(this.source, 'transform', this.onTrasnform);
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
    key: 'onTrasnform',
    value: function onTrasnform(operation) {

      this.operations.push(operation);
    }
  }, {
    key: 'flush',
    value: function flush() {
      var _this = this;

      return _import2['default'].reduce(this.operations, function (promise, operation) {
        return promise.then(function () {
          return _this._applyOperationToTarget(operation);
        });
      }, _Q2['default']()).then(function () {
        _this._cleanQueue();
      });
    }
  }, {
    key: '_cleanQueue',
    value: function _cleanQueue() {

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
          _this2.sourceToTarget[path] = resource.getLink('self');
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
    key: 'create',
    value: function create(attributes, options) {
      var _this = this;

      var options = _import2['default'].defaults(options || {}, {
        byOperation: false
      });

      return _Q2['default'].fcall(function () {
        return _this.syncronizer.post(_this._getURL(attributes.type), {
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

      var options = _import2['default'].defaults(options || {}, {
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

      var options = _import2['default'].defaults(options || {}, {
        byOperation: false
      });

      return _Q2['default'].fcall(function () {
        return _this3.syncronizer['delete'](resource.getLink('self'));
      }).then(function (response) {
        _this3.stopListening(resource);
        _this3.pool['delete'](resource.getLink('self'));
        if (!options.byOperation) {
          _this3._triggerTransform('remove', resource);
        }
        return resource;
      });
    }
  }, {
    key: 'add',
    value: function add(resource) {

      this.pool.set(resource.getLink('self'), resource);

      return _Q2['default'].fcall(function () {
        return resource;
      });
    }
  }, {
    key: 'get',
    value: function get(url) {
      var _this4 = this;

      var resource = this.pool.get(url);

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
    key: '_getURL',
    value: function _getURL(type, id) {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9zcmMvanNvbmFwaS5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL3NyYy9qc29uYXBpL01lbW9yeVBvb2wuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9zcmMvanNvbmFwaS9PcGVyYXRpb24uanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9zcmMvanNvbmFwaS9Qb29sLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvc3JjL2pzb25hcGkvUG9vbENvbm5lY3Rvci5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL3NyYy9qc29uYXBpL1JFU1RmdWwuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9zcmMvanNvbmFwaS9SZXNvdXJjZS5qcyIsIi9Vc2Vycy9sZWVjaHVsaGVlL0RldmVsb3Blci9Qcm9qZWN0cy9qc29uYXBpL3NyYy9qc29uYXBpL1Jlc3BvbnNlLmpzIiwiL1VzZXJzL2xlZWNodWxoZWUvRGV2ZWxvcGVyL1Byb2plY3RzL2pzb25hcGkvc3JjL2pzb25hcGkvUmVzdFBvb2wuanMiLCIvVXNlcnMvbGVlY2h1bGhlZS9EZXZlbG9wZXIvUHJvamVjdHMvanNvbmFwaS9zcmMvanNvbmFwaS9UcmFuc2FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O3dCQ0FxQixvQkFBb0I7Ozs7MEJBQ2xCLHNCQUFzQjs7Ozt3QkFDeEIsb0JBQW9COzs7O3VCQUNyQixtQkFBbUI7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LEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBRWpDOzs7U0E1Q0csV0FBVzs7O3FCQWdERixXQUFXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBSZXNvdXJjZSBmcm9tICcuL2pzb25hcGkvUmVzb3VyY2UnO1xuaW1wb3J0IE1lbW9yeVBvb2wgZnJvbSAnLi9qc29uYXBpL01lbW9yeVBvb2wnO1xuaW1wb3J0IFJlc3RQb29sIGZyb20gJy4vanNvbmFwaS9SZXN0UG9vbCc7XG5pbXBvcnQgUkVTVGZ1bCBmcm9tICcuL2pzb25hcGkvUkVTVGZ1bCc7XG5pbXBvcnQgVHJhbnNhY3Rpb24gZnJvbSAnLi9qc29uYXBpL1RyYW5zYWN0aW9uJztcbmltcG9ydCBQb29sQ29ubmVjdG9yIGZyb20gJy4vanNvbmFwaS9Qb29sQ29ubmVjdG9yJztcblxuXG5leHBvcnQge1xuICBUcmFuc2FjdGlvbixcbiAgUmVzb3VyY2UsXG4gIE1lbW9yeVBvb2wsXG4gIFJlc3RQb29sLFxuICBSRVNUZnVsLFxuICBQb29sQ29ubmVjdG9yXG59O1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi9Qb29sJztcbmltcG9ydCBPcGVyYXRpb24gZnJvbSAnLi9PcGVyYXRpb24nO1xuXG5cbmNsYXNzIE1lbW9yeVBvb2wgZXh0ZW5kcyBQb29sIHtcblxuICBjb25zdHJ1Y3RvcihyZXNvdXJjZXMpIHtcblxuICAgIHN1cGVyKHJlc291cmNlcyk7XG5cbiAgfVxuXG4gIGNyZWF0ZSAoYXR0cmlidXRlcywgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFJlc291cmNlKGF0dHJpYnV0ZXMsIG9wdGlvbnMpO1xuICAgIH0pXG4gICAgLnRoZW4ocmVzb3VyY2UgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkKHJlc291cmNlKTtcbiAgICB9KVxuICAgIC50aGVuKHJlc291cmNlID0+IHtcbiAgICAgIGlmICghb3B0aW9ucy5ieU9wZXJhdGlvbikge1xuICAgICAgICB0aGlzLl90cmlnZ2VyVHJhbnNmb3JtKCdhZGQnLCByZXNvdXJjZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHBhdGNoIChyZXNvdXJjZSwgYXR0cmlidXRlcywgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgICB2YXIgc2V0QXJndW1lbnRzID0gXy50b0FycmF5KGFyZ3VtZW50cykuc2xpY2UoMSk7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICByZXNvdXJjZS5zZXQuYXBwbHkocmVzb3VyY2UsIHNldEFyZ3VtZW50cyk7XG4gICAgICBpZiAoIW9wdGlvbnMuYnlPcGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlclRyYW5zZm9ybSgncmVwbGFjZScsIHJlc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KTtcblxuICB9XG5cbiAgcmVtb3ZlIChyZXNvdXJjZSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICB0aGlzLnN0b3BMaXN0ZW5pbmcocmVzb3VyY2UpO1xuICAgICAgdGhpcy5wb29sLmRlbGV0ZShyZXNvdXJjZS5nZXRMaW5rKCdzZWxmJykpO1xuICAgICAgaWYgKCFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJUcmFuc2Zvcm0oJ3JlbW92ZScsIHJlc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KTtcblxuICB9XG5cbiAgZ2V0ICh1cmwpIHtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnBvb2wuZ2V0KHVybCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGFkZCAocmVzb3VyY2UpIHtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHRoaXMucG9vbC5zZXQocmVzb3VyY2UuZ2V0TGluaygnc2VsZicpLCByZXNvdXJjZSk7XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSk7XG5cbiAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgTWVtb3J5UG9vbDtcbiIsImNsYXNzIE9wZXJhdGlvbiB7XG5cbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcblxuICAgIHRoaXMub3AgPSBvcHRpb25zLm9wO1xuICAgIHRoaXMucGF0aCA9IG9wdGlvbnMucGF0aDtcbiAgICBpZiAob3B0aW9ucy5vcCAhPT0gJ3JlbW92ZScpIHtcbiAgICAgIHRoaXMudmFsdWUgPSBvcHRpb25zLnZhbHVlO1xuICAgIH1cblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgT3BlcmF0aW9uO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IFJlc291cmNlIGZyb20gJy4vUmVzb3VyY2UnO1xuaW1wb3J0IE9wZXJhdGlvbiBmcm9tICcuL09wZXJhdGlvbic7XG5cblxuY2xhc3MgUG9vbCB7XG5cbiAgY29uc3RydWN0b3IocmVzb3VyY2VzKSB7XG5cbiAgICBfLmV4dGVuZCh0aGlzLCBFdmVudHMpO1xuICAgIHRoaXMucG9vbCA9IG5ldyBNYXAoKTtcbiAgICBfLmVhY2gocmVzb3VyY2VzLCB0aGlzLmFkZCwgdGhpcyk7XG5cbiAgfVxuXG4gIGNyZWF0ZSAoYXR0cmlidXRlcywgb3B0aW9ucykge1xuXG4gICAgLy8gaW1wbGVtZW50IHRoaXMvLyBpbXBsZW1lbnQgdGhpc1xuXG4gIH1cblxuICBhZGQgKHJlc291cmNlKSB7XG5cbiAgICAvLyBpbXBsZW1lbnQgdGhpc1xuXG4gIH1cblxuICByZW1vdmUgKHJlc291cmNlKSB7XG5cbiAgICAvLyBpbXBsZW1lbnQgdGhpc1xuXG4gIH1cblxuICBnZXQgKGlkKSB7XG5cbiAgICAvLyBpbXBsZW1lbnQgdGhpc1xuXG4gIH1cblxuICBfdHJpZ2dlclRyYW5zZm9ybSAob3AsIHJlc291cmNlKSB7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3RyYW5zZm9ybScsIG5ldyBPcGVyYXRpb24oe1xuICAgICAgb3A6IG9wLFxuICAgICAgcGF0aDogcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpLFxuICAgICAgdmFsdWU6IHJlc291cmNlLnRvSlNPTigpXG4gICAgfSkpO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFBvb2w7XG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5pbXBvcnQgeyBFdmVudHMgfSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9SZXNvdXJjZSc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL1Bvb2wnO1xuaW1wb3J0IE9wZXJhdGlvbiBmcm9tICcuL09wZXJhdGlvbic7XG5cbmNsYXNzIFBvb2xDb25uZWN0b3Ige1xuXG4gIGNvbnN0cnVjdG9yKHNvdXJjZSwgdGFyZ2V0LCBvcHRpb25zID0ge30pIHtcblxuICAgIF8uZXh0ZW5kKHRoaXMsIEV2ZW50cyk7XG5cbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICB0aGlzLnNvdXJjZVRvVGFyZ2V0ID0ge307XG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG5cbiAgICB0aGlzLmxpc3RlblRvKHRoaXMuc291cmNlLCBcInRyYW5zZm9ybVwiLCB0aGlzLm9uVHJhc25mb3JtKTtcbiAgICAvLyB0aGlzLnN0b3BMaXN0ZW5pbmcoc291cmNlLCBcInRyYW5zZm9ybVwiKTtcblxuICB9XG5cbiAgZ2V0UmVwbGljYSAocmVzb3VyY2VPclVSTCkge1xuXG4gICAgdmFyIHVybCA9IF8uaXNTdHJpbmcocmVzb3VyY2VPclVSTCkgP1xuICAgICAgcmVzb3VyY2VPclVSTCA6IHJlc291cmNlT3JVUkwuZ2V0TGluaygnc2VsZicpO1xuXG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0LmdldChcbiAgICAgIHRoaXMuZ2V0UmVwbGljYXRlZFVSTCh1cmwpKTtcblxuICB9XG5cbiAgZ2V0UmVwbGljYXRlZFVSTCAodXJsKSB7XG5cbiAgICByZXR1cm4gdGhpcy5zb3VyY2VUb1RhcmdldFt1cmxdO1xuXG4gIH1cblxuICBvblRyYXNuZm9ybSAob3BlcmF0aW9uKSB7XG5cbiAgICB0aGlzLm9wZXJhdGlvbnMucHVzaChvcGVyYXRpb24pO1xuXG4gIH1cblxuICBmbHVzaCAoKSB7XG5cbiAgICByZXR1cm4gXy5yZWR1Y2UodGhpcy5vcGVyYXRpb25zLCAocHJvbWlzZSwgb3BlcmF0aW9uKSA9PiB7XG4gICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5T3BlcmF0aW9uVG9UYXJnZXQob3BlcmF0aW9uKTtcbiAgICAgIH0pO1xuICAgIH0sIFEoKSlcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLl9jbGVhblF1ZXVlKCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIF9jbGVhblF1ZXVlICgpIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuXG4gIH1cblxuICBfYXBwbHlPcGVyYXRpb25Ub1RhcmdldCAob3BlcmF0aW9uKSB7XG5cbiAgICB2YXIgb3AgPSBvcGVyYXRpb24ub3A7XG4gICAgdmFyIHZhbHVlID0gb3BlcmF0aW9uLnZhbHVlO1xuICAgIHZhciBwYXRoID0gb3BlcmF0aW9uLnBhdGg7XG5cblxuICAgIGlmIChvcCA9PT0gXCJhZGRcIikge1xuXG4gICAgICByZXR1cm4gdGhpcy50YXJnZXQuY3JlYXRlKHZhbHVlLCB7XG4gICAgICAgIGJ5T3BlcmF0aW9uOiB0cnVlLFxuICAgICAgfSlcbiAgICAgIC50aGVuKHJlc291cmNlID0+IHtcbiAgICAgICAgdmFyIHVybCA9IHJlc291cmNlLmdldExpbmsoJ3NlbGYnKTtcbiAgICAgICAgdGhpcy5zb3VyY2VUb1RhcmdldFtwYXRoXSA9IHJlc291cmNlLmdldExpbmsoJ3NlbGYnKTtcbiAgICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgICAgfSk7XG5cbiAgICB9XG4gICAgZWxzZSBpZiAob3AgPT09IFwicmVwbGFjZVwiKSB7XG5cbiAgICAgIHJldHVybiB0aGlzLmdldFJlcGxpY2EocGF0aClcbiAgICAgIC50aGVuKHRhcmdldFJlc291cmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0LnBhdGNoKHRhcmdldFJlc291cmNlLCB2YWx1ZSwge1xuICAgICAgICAgIGJ5T3BlcmF0aW9uOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICB9XG4gICAgZWxzZSBpZiAob3AgPT09IFwicmVtb3ZlXCIpIHtcblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVwbGljYShwYXRoKVxuICAgICAgLnRoZW4odGFyZ2V0UmVzb3VyY2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50YXJnZXQucmVtb3ZlKHRhcmdldFJlc291cmNlLCB7XG4gICAgICAgICAgYnlPcGVyYXRpb246IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIH1cblxuICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBQb29sQ29ubmVjdG9yO1xuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCBSZXNwb25zZSBmcm9tICcuL1Jlc3BvbnNlJztcblxudmFyIGFqYXhPcHRpb25zID0ge1xuXG4gIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gIHByb2Nlc3NEYXRhOiB0cnVlXG5cbn07XG5cbnZhciBzdHJpbmdpZnlSZXF1aXJlZE1ldGhvZCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgLy8gdGhlc2UgSFRUUCBtZXRob2RzIHJlcXVpcmVzIEpTT04uc3RyaW5naWZ5XG4gIHJldHVybiAoL14oUE9TVHxQVVR8UEFUQ0h8REVMRVRFKSQvLnRlc3QobWV0aG9kLnRvVXBwZXJDYXNlKCkpKTtcbn07XG5cbnZhciBtYWtlQWpheFJlcXVlc3QgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gIG9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgYWpheE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gIGlmIChzdHJpbmdpZnlSZXF1aXJlZE1ldGhvZChvcHRpb25zLnR5cGUpKSB7XG4gICAgaWYgKG9wdGlvbnMuY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJykge1xuICAgICAgb3B0aW9ucy5kYXRhID0gSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5kYXRhKTtcbiAgICB9XG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL3Evd2lraS9Db21pbmctZnJvbS1qUXVlcnlcbiAgcmV0dXJuIFEucHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgJC5hamF4KG9wdGlvbnMpXG4gICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcbiAgICAgICAgZGVsZXRlIGpxWEhSLnRoZW47IC8vIHRyZWF0IHhociBhcyBhIG5vbi1wcm9taXNlXG4gICAgICAgIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShqcVhIUik7XG4gICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5mYWlsKGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgZGVsZXRlIGpxWEhSLnRoZW47IC8vIHRyZWF0IHhociBhcyBhIG5vbi1wcm9taXNlXG4gICAgICAgIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShqcVhIUik7XG4gICAgICAgIHJlamVjdChyZXNwb25zZSk7XG4gICAgICB9KTtcbiAgfSk7XG5cbn07XG5cblxuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgaGVhZDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJIRUFEXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIGdldDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcG9zdDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG1ha2VBamF4UmVxdWVzdChvcHRpb25zKTtcblxuICB9LFxuXG4gIHB1dDogZnVuY3Rpb24gKHVybCwgZGF0YSwgb3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IF8uZXh0ZW5kKHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQVVRcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgcGF0Y2g6IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmV4dGVuZCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUEFUQ0hcIixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gbWFrZUFqYXhSZXF1ZXN0KG9wdGlvbnMpO1xuXG4gIH0sXG5cbiAgZGVsZXRlOiBmdW5jdGlvbiAodXJsLCBkYXRhLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIkRFTEVURVwiLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0sIG9wdGlvbnMpO1xuICAgIHJldHVybiBtYWtlQWpheFJlcXVlc3Qob3B0aW9ucyk7XG5cbiAgfVxuXG59O1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IHV1aWQgZnJvbSAnbm9kZS11dWlkJztcblxuXG52YXIgaXNWYWxpZEF0dHJzID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgcmV0dXJuIGRhdGEgJiYgZGF0YS50eXBlO1xufTtcblxuXG5jbGFzcyBSZXNvdXJjZSBleHRlbmRzIE1vZGVsIHtcblxuICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBfLmRlZmF1bHRzKG9wdGlvbnMsIHsgcGFyc2U6IHRydWUgfSk7XG5cbiAgICBzdXBlcihhdHRyaWJ1dGVzLCBvcHRpb25zKTtcblxuICAgIGlmICghdGhpcy5nZXRMaW5rKCdzZWxmJykpIHtcbiAgICAgIHRoaXMuc2V0TGluaygnc2VsZicsICcvJyArIHV1aWQudjQoKSk7XG4gICAgfVxuXG4gIH1cblxuICBzZXRMaW5rIChrZXksIHJlc291cmNlKSB7XG5cbiAgICB2YXIgdXJsID0gXy5pc1N0cmluZyhyZXNvdXJjZSkgPyByZXNvdXJjZSA6IHJlc291cmNlLmdldExpbmsoJ3NlbGYnKTtcbiAgICB0aGlzLmxpbmtzW2tleV0gPSB1cmw7XG4gICAgdGhpcy50cmlnZ2VyKCdhZGQ6bGluaycsIGtleSwgdGhpcy5saW5rc1trZXldKTtcblxuICB9XG5cbiAgcmVtb3ZlTGluayAoa2V5KSB7XG5cbiAgICBpZiAoa2V5ID09PSAnc2VsZicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc2VsZiBsaW5rIGlzIG5vdCBhYmxlIHRvIHJlbW92ZWQhJyk7XG4gICAgfVxuICAgIHZhciByZW1vdmVkTGluayA9IHRoaXMubGlua3Nba2V5XTtcbiAgICBkZWxldGUgdGhpcy5saW5rc1trZXldO1xuICAgIHRoaXMudHJpZ2dlcigncmVtb3ZlOmxpbmsnLCBrZXksIHJlbW92ZWRMaW5rKTtcblxuICB9XG5cbiAgZ2V0TGluayAoa2V5KSB7XG5cbiAgICByZXR1cm4gdGhpcy5saW5rc1trZXldO1xuXG4gIH1cblxuICBwYXJzZSAoZGF0YSkge1xuXG4gICAgaWYgKCFpc1ZhbGlkQXR0cnMoZGF0YSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBkYXRhISB0eXBlIHNob3VsZCBiZSBwcm92aWRlZCcpO1xuICAgIH1cbiAgICB0aGlzLmxpbmtzID0gZGF0YS5saW5rcyB8fCB7fTtcbiAgICByZXR1cm4gXy5vbWl0KGRhdGEsICdsaW5rcycpO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlO1xuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuXG52YXIgX3ZhbGlkYXRlUmVzcG9uc2UgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgdmFyIGJvZHkgPSB4aHIucmVzcG9uc2VKU09OO1xuXG4gIGlmIChib2R5LmRhdGEgPT09IHVuZGVmaW5lZCAmJiBib2R5LmVycm9ycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQSBkb2N1bWVudCBNVVNUIGNvbnRhaW4gZWl0aGVyIHByaW1hcnkgZGF0YSBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwib3IgYW4gYXJyYXkgb2YgZXJyb3Igb2JqZWN0cy5cIik7XG4gIH1cblxufTtcblxuXG52YXIgX2lzUmVzcG9uc2VFcnJvciA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcblxuICByZXR1cm4gNDAwIDw9IHN0YXR1cyAmJiA2MDAgPiBzdGF0dXMgO1xuXG59O1xuXG5cbnZhciBfcGFyc2VEYXRhID0gZnVuY3Rpb24gKHhocikge1xuXG4gIGlmICgheGhyLnJlc3BvbnNlSlNPTikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB4aHIucmVzcG9uc2VKU09OLmRhdGE7XG5cbn07XG5cblxudmFyIF9wYXJzZUVycm9ycyA9IGZ1bmN0aW9uICh4aHIpIHtcblxuICBpZiAoISh4aHIucmVzcG9uc2VKU09OICYmIHhoci5yZXNwb25zZUpTT04uZXJyb3JzICkpIHtcbiAgICBpZiAoX2lzUmVzcG9uc2VFcnJvcih4aHIuc3RhdHVzKSkge1xuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIHN0YXR1czogXCJcIiArIHhoci5zdGF0dXNcbiAgICAgIH1dO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBlcnJvcnMgPSB4aHIucmVzcG9uc2VKU09OLmVycm9ycztcblxuICByZXR1cm4gXy5tYXAoZXJyb3JzLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICByZXR1cm4gXy5leHRlbmQoe1xuICAgICAgc3RhdHVzOiBcIlwiICsgeGhyLnN0YXR1c1xuICAgIH0sIGVycm9yKTtcbiAgfSk7XG5cbn07XG5cblxudmFyIF9wYXJzZUhlYWRlcnMgPSBmdW5jdGlvbiAoeGhyKSB7XG5cbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIHZhciBoZWFkZXJSZWdleCA9IC9eKC4qPyk6WyBcXHRdKihbXlxcclxcbl0qKSQvbWc7XG4gIHZhciBoZWFkZXJzU3RyaW5nID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpO1xuICB2YXIgZmluZFJlc3VsdDtcblxuICB3aGlsZSAoKGZpbmRSZXN1bHQgPSBoZWFkZXJSZWdleC5leGVjKGhlYWRlcnNTdHJpbmcpKSAhPT0gbnVsbCkge1xuICAgIHJlc3VsdC5wdXNoKGZpbmRSZXN1bHQuc2xpY2UoMSkpO1xuICB9XG5cbiAgcmV0dXJuIF8ub2JqZWN0KHJlc3VsdCk7XG5cbn07XG5cblxuY2xhc3MgUmVzcG9uc2Uge1xuXG4gIGNvbnN0cnVjdG9yICh4aHIpIHtcblxuICAgIHRoaXMucmVzcG9uc2VKU09OID0geGhyLnJlc3BvbnNlSlNPTjtcbiAgICB0aGlzLmRhdGEgPSBfcGFyc2VEYXRhKHhocik7XG4gICAgdGhpcy5lcnJvcnMgPSBfcGFyc2VFcnJvcnMoeGhyKTtcbiAgICB0aGlzLmhlYWRlcnMgPSBfcGFyc2VIZWFkZXJzKHhocik7XG4gICAgdGhpcy5uYXRpdmVYSFIgPSB4aHI7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNlO1xuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCBSZXNvdXJjZSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCBQb29sIGZyb20gJy4vUG9vbCc7XG5pbXBvcnQgT3BlcmF0aW9uIGZyb20gJy4vT3BlcmF0aW9uJztcbmltcG9ydCBSRVNUZnVsIGZyb20gJy4vUkVTVGZ1bCc7XG5cblxuY2xhc3MgUmVzdFBvb2wgZXh0ZW5kcyBQb29sIHtcblxuICBjb25zdHJ1Y3RvciAocmVzb3VyY2VzLCBvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHN1cGVyKHJlc291cmNlcywgb3B0aW9ucyk7XG4gICAgdGhpcy5zeW5jcm9uaXplciA9IFJFU1RmdWw7XG4gICAgdGhpcy50eXBlVG9VcmwgPSBvcHRpb25zLnR5cGVUb1VybCB8fCB7fTtcblxuICB9XG5cbiAgY3JlYXRlIChhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG5cbiAgICB2YXIgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zeW5jcm9uaXplci5wb3N0KHRoaXMuX2dldFVSTChhdHRyaWJ1dGVzLnR5cGUpLFxuICAgICAgICB7XG4gICAgICAgICAgZGF0YTogYXR0cmlidXRlc1xuICAgICAgICB9KTtcbiAgICB9KVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHJldHVybiBuZXcgUmVzb3VyY2UocmVzcG9uc2UuZGF0YSwgb3B0aW9ucyk7XG4gICAgfSlcbiAgICAudGhlbihyZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGQocmVzb3VyY2UpO1xuICAgIH0pXG4gICAgLnRoZW4ocmVzb3VyY2UgPT4ge1xuICAgICAgaWYgKCFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJUcmFuc2Zvcm0oJ2FkZCcsIHJlc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICB9KTtcblxuICB9XG5cbiAgcGF0Y2ggKHJlc291cmNlLCBhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG5cbiAgICB2YXIgb3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwge1xuICAgICAgYnlPcGVyYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgICB2YXIgc2V0QXJndW1lbnRzID0gXy50b0FycmF5KGFyZ3VtZW50cykuc2xpY2UoMSk7XG5cbiAgICByZXR1cm4gUS5mY2FsbCgoKSA9PiB7XG4gICAgICByZXNvdXJjZS5zZXQuYXBwbHkocmVzb3VyY2UsIHNldEFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSlcbiAgICAudGhlbihyZXNvdXJjZSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zeW5jcm9uaXplci5wYXRjaChcbiAgICAgICAgcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpLFxuICAgICAgICB0aGlzLl90b1Jlc3BvbnNlKHJlc291cmNlKSk7XG4gICAgfSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICByZXNvdXJjZS5zZXQuYXBwbHkocmVzb3VyY2UsIHJlc3BvbnNlLmRhdGEpO1xuICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgIH0pXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKCFvcHRpb25zLmJ5T3BlcmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJUcmFuc2Zvcm0oJ3JlcGxhY2UnLCByZXNvdXJjZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHJlbW92ZSAocmVzb3VyY2UsIG9wdGlvbnMpIHtcblxuICAgIHZhciBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9LCB7XG4gICAgICBieU9wZXJhdGlvbjogZmFsc2VcbiAgICB9KTtcblxuICAgIHJldHVybiBRLmZjYWxsKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN5bmNyb25pemVyLmRlbGV0ZShcbiAgICAgICAgcmVzb3VyY2UuZ2V0TGluaygnc2VsZicpKTtcbiAgICB9KVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHRoaXMuc3RvcExpc3RlbmluZyhyZXNvdXJjZSk7XG4gICAgICB0aGlzLnBvb2wuZGVsZXRlKHJlc291cmNlLmdldExpbmsoJ3NlbGYnKSk7XG4gICAgICBpZiAoIW9wdGlvbnMuYnlPcGVyYXRpb24pIHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlclRyYW5zZm9ybSgncmVtb3ZlJywgcmVzb3VyY2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc291cmNlO1xuICAgIH0pO1xuXG4gIH1cblxuICBhZGQgKHJlc291cmNlKSB7XG5cbiAgICB0aGlzLnBvb2wuc2V0KHJlc291cmNlLmdldExpbmsoJ3NlbGYnKSwgcmVzb3VyY2UpO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4gcmVzb3VyY2UpO1xuXG4gIH1cblxuICBnZXQgKHVybCkge1xuXG4gICAgdmFyIHJlc291cmNlID0gdGhpcy5wb29sLmdldCh1cmwpO1xuXG4gICAgcmV0dXJuIFEuZmNhbGwoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3luY3Jvbml6ZXIuZ2V0KHVybCk7XG4gICAgfSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzb3VyY2UpIHtcbiAgICAgICAgcmVzb3VyY2Uuc2V0KHJlc3BvbnNlLmRhdGEsIHsgcGFyc2U6IHRydWUgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzb3VyY2UgPSBuZXcgUmVzb3VyY2UocmVzcG9uc2UuZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb3VyY2U7XG4gICAgfSk7XG5cbiAgfVxuXG4gIF9nZXRVUkwgKHR5cGUsIGlkKSB7XG5cbiAgICB2YXIgdXJsID0gdGhpcy50eXBlVG9VcmxbdHlwZV07XG5cbiAgICBpZiAoIXVybCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB0eXBlWyR7dHlwZX1dIGlzIG5vdCBzdXBwb3J0ZWQhYCk7XG4gICAgfVxuXG4gICAgaWYgKGlkKSB7XG4gICAgICB1cmwgPSB1cmwgKyBpZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xuXG4gIH1cblxuICBfdG9SZXNwb25zZSAocmVzb3VyY2UpIHtcblxuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICByZXN1bHQuZGF0YSA9IHJlc291cmNlLnRvSlNPTigpO1xuICAgIHJlc3VsdC5kYXRhLmxpbmtzID0gcmVzb3VyY2UubGlua3M7XG4gICAgcmV0dXJuIF8uY2xvbmUocmVzdWx0LCB0cnVlKTtcblxuICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBSZXN0UG9vbDtcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCB7IEV2ZW50cyB9IGZyb20gJ2JhY2tib25lJztcblxuXG5jbGFzcyBUcmFuc2FjdGlvbiB7XG5cbiAgY29uc3RydWN0b3IocG9vbCwgb3B0aW9ucykge1xuXG4gICAgXy5leHRlbmQodGhpcywgRXZlbnRzKTtcbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyhvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMucG9vbCA9IHBvb2w7XG4gICAgdGhpcy5vcGVyYXRpb25zID0gW107XG5cbiAgfVxuXG4gIGJlZ2luICgpIHtcblxuICAgIHRoaXMub3BlcmF0aW9ucyA9IFtdO1xuICAgIHRoaXMuX2FjdGl2YXRlKCk7XG5cbiAgfVxuXG4gIGNvbW1pdCAoKSB7XG5cbiAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XG5cbiAgfVxuXG5cbiAgX2FjdGl2YXRlICgpIHtcblxuICAgIHRoaXMubGlzdGVuVG8odGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gIH1cblxuICBfZGVhY3RpdmF0ZSAoKSB7XG5cbiAgICB0aGlzLnN0b3BMaXN0ZW5pbmcodGhpcy5wb29sLCAndHJhbnNmb3JtJywgdGhpcy5vblRyYW5zZm9ybSk7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICB9XG5cbiAgb25UcmFuc2Zvcm0gKG9wZXJhdGlvbikge1xuXG4gICAgdGhpcy5vcGVyYXRpb25zLnB1c2gob3BlcmF0aW9uKTtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHJhbnNhY3Rpb247XG4iXX0=
