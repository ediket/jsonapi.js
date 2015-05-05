'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _Q = require('q');

var _Q2 = _interopRequireDefault(_Q);

var _urlJoin = require('url-join');

var _urlJoin2 = _interopRequireDefault(_urlJoin);

var _uuid = require('node-uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _Resource = require('./Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _RESTful = require('./RESTful');

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

      if (_import2['default'].isArray(resource)) {
        return _import2['default'].map(resource, function (resource) {
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

      if (_import2['default'].isArray(resource)) {
        return _import2['default'].map(resource, function (resource) {
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

      if (_import2['default'].isArray(linkage)) {
        return _import2['default'].map(linkage, function (linkage) {
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

      var newCommit = _import2['default'].reduce(this.staged, function (commit, serialized, rid) {
        if (!serialized) {
          if (commit[rid]) {
            delete commit[rid];
          }
        } else {
          commit[rid] = _this4._createBlob(serialized);
        }
        return commit;
      }, _import2['default'].clone(lastCommit, true));

      _import2['default'].reduce(this.stagedLink, function (commit, linkOperation) {
        commit[_uuid2['default'].v4()] = linkOperation;
        return commit;
      }, newCommit);

      this.commits.push(newCommit);
      this.staged = {};
    }
  }, {
    key: 'addRemote',
    value: function addRemote(type, url) {

      this.remote[type] = url;
    }
  }, {
    key: 'getRemote',
    value: function getRemote(type, id, relation) {

      var urlParts = _import2['default'].compact([this.remote[type], id, relation ? 'links' : undefined, relation]);
      return _urlJoin2['default'].apply(null, urlParts);
    }
  }, {
    key: 'get',
    value: function get(type, id) {

      if (id === undefined) {
        return _import2['default'].filter(this.pool, function (resource) {
          return resource.get('type') === type;
        });
      }

      return _import2['default'].find(this.pool, function (resource) {
        return resource.get('type') === type && resource.get('id') === id;
      });
    }
  }, {
    key: 'has',
    value: function has(type, id) {

      return !!_import2['default'].find(this.pool, function (resource) {
        return resource.get('type') === type && resource.get('id') === id;
      });
    }
  }, {
    key: '_createBlob',
    value: function _createBlob(serialized) {

      var bid = _uuid2['default'].v4();
      this.blobs[bid] = _import2['default'].clone(serialized, true);
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
      if (_import2['default'].isString(link)) {
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

      if (!_import2['default'].isEmpty(this.staged)) {
        throw new Error('pull when staged change is not exist');
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
        return _Q2['default']();
      }

      var afterCommit = this.getCommit(idx);
      var beforeCommit = this.getCommit(this.remoteIndex);

      var removed = _import2['default'].difference(_import2['default'].keys(beforeCommit), _import2['default'].keys(afterCommit));

      var changedOrAdded = _import2['default'].without(_import2['default'].keys(afterCommit), _import2['default'].keys(removed));

      var deleteRequest = _import2['default'].map(removed, function (rid) {
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

      var postOrPatchRequest = _import2['default'].map(changedOrAdded, function (rid) {
        // is Link
        if (!_this6.pool[rid]) {
          return;
        }

        var type = _this6.pool[rid].get('type');
        var id = _this6.pool[rid].get('id');
        var blob = afterCommit[rid];
        if (id) {
          return _this6.sync.patch(_this6.getRemote(type, id), _this6._toRequest(blob)).then(function (response) {
            return _this6._saveResponse(response, rid);
          });
        }
        if (!id) {
          return _this6.sync.post(_this6.getRemote(type), _this6._toRequest(blob)).then(function (response) {
            return _this6._saveResponse(response, rid);
          });
        }
      });

      var linkOperationRequest = _import2['default'].map(afterCommit, function (staged, rid) {
        // is resource
        if (_this6.pool[rid] || !staged.op) {
          return;
        }

        var type = staged.resource.get('type');
        var id = staged.resource.get('id');
        var options = _import2['default'].defaults(staged.options || {}, {
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

      return _Q2['default'].all(deleteRequest.concat(postOrPatchRequest)).then(function () {
        _this6.setRemoteIndex();
      });
    }
  }, {
    key: '_saveResponse',
    value: function _saveResponse(response, rid) {

      return this._saveData(this._fromResponse(response), rid);
    }
  }, {
    key: '_saveData',
    value: function _saveData(data, rid) {
      var _this7 = this;

      if (_import2['default'].isArray(data)) {
        return _import2['default'].map(data, function (data) {
          return _this7._saveData(data);
        });
      }

      var resource = rid !== undefined ? this.pool[rid] : this.get(data.type, data.id);

      if (!resource) {
        resource = new _Resource2['default'](data);
      } else {
        resource.deserialize(data);
      }

      var stagedBackup = _import2['default'].clone(this.staged, true);

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
  }, {
    key: '_fromResponse',
    value: function _fromResponse(response) {

      return response.data;
    }
  }]);

  return Pool;
})();

exports['default'] = Pool;
module.exports = exports['default'];