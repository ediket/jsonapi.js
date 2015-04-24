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