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