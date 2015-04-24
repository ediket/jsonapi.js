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