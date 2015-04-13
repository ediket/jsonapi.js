
'use strict';


var _ = require('lodash');
var Q = require('q');
var Backbone = require('backbone');
var Events = Backbone.Events;
var ResourceCollection = require('./ResourceCollection');
var serializer = require('./serializer');
var JSONCamera = require('./lib/JSONCamera');
var diffJSON = require('./lib/diffJSON');


var ResourceSession = function ResourceSession (resources, url, options) {

  if (!resources || !url) {
    throw new Error('unenough arguments');
  }

  if (!resources instanceof ResourceCollection) {
    throw new TypeError();
  }

  options = _.defaults(options || {}, {
    syncronizer: {
      post: function () {},
      patch: function () {},
      delete: function () {},
      get: function () {}
    },
  });

  this.url = url;
  this.cameras = {};
  this.added = [];
  this.removed = [];
  this.changed = [];
  this.resources = resources;
  this.syncronizer = options.syncronizer;
  this.linkSessions = [];

  this.resources.each(function (resource) {

    if (resource.id) {
      this._createCamera(resource).capture();
    }
    else {
      this.added.push(resource);
    }

  }, this);

  this.resources.each(function (resource) {

    _.each(resource.getLinks(), function (resource, referKey) {

      this._createLinkSession(resource, referKey, options);

    }, this);

  }, this);

  this.listenTo(this.resources, 'add', this._trackAdded);
  this.listenTo(this.resources, 'remove', this._trackRemoved);
  this.listenTo(this.resources, 'change', this._trackChanged);

  this.listenTo(this.resources, 'add:link', this._trackLinkAdded);
  this.listenTo(this.resources, 'remove:link', this._trackLinkRemoved);

};


_.extend(ResourceSession.prototype, Events, {

  commit: function () {

    this._syncResources();
    this._resetCameras();
    this._resetTrackers();

    this._commitLinkSessions();

  },

  _commitLinkSessions: function () {

    _.each(this.linkSessions, function (session) {
      return session.commit();
    });

  },

  _syncResources: function () {

    this._patchChangedResources();
    this._postAddedResources();
    this._deleteRemovedResources();

  },

  _patchChangedResources: function () {

    var patchData = _.chain(this.changed)
      .filter(function (resource) {
        var camera = this._getCamera(resource);
        return !_.isEqual(camera.first(), camera.last());
      }.bind(this))
      .map(function (resource) {
        return serializer.serialize(resource, { include: [] }).data;
      })
      .value();

    if (!_.isEmpty(patchData)) {
      this.syncronizer.patch(this.url, {
        data: patchData
      });
    }

  },

  _postAddedResources: function () {

    var postData = _.map(this.added, function (resource) {
      return serializer.serialize(resource, { include: [] }).data;
    });

    if (!_.isEmpty(postData)) {
      this.syncronizer.post(this.url, {
        data: postData
      });
    }

  },

  _deleteRemovedResources: function () {

    var deleteData = _.map(this.removed, function (resource) {
      return resource.toLinkage();
    });

    if (!_.isEmpty(deleteData)) {
      this.syncronizer.delete(this.url, {
        data: deleteData
      });
    }

  },

  _resetCameras: function () {

    _.each(this.changed, function (resource) {
      var camera = this._getCamera(resource);
      camera.snapshots = camera.snapshots.slice(-1);
    }, this);

    _.each(this.added, function (resource) {
      this._createCamera(resource).capture();
    }, this);

    _.each(this.removed, function (resource) {
      this._removeCamera(resource);
    }, this);

  },

  _resetTrackers: function () {

    this.addad = [];
    this.removed = [];
    this.changed = [];

  },

  _trackAdded: function (resource) {

    if (_.contains(this.removed, resource)) {
      _.pull(this.removed, this.resources);
      return;
    }
    this.added.push(resource);

  },

  _trackRemoved: function (resource) {

    if (_.contains(this.added, resource)) {
      _.pull(this.added, this.resources);
      return;
    }
    this.removed.push(resource);

  },

  _trackChanged: function (resource) {

    this.changed.push(resource);
    this._getCamera(resource).capture();

  },

  _trackLinkAdded: function (resource, referKey) {

    this._createLinkSession(resource, referKey, {
      syncronizer: this.syncronizer
    });

  },

  _trackLinkRemoved: function (resource) {

    this._removeLinkSession(resource);

  },

  _createCamera: function (resource) {

    var camera = new JSONCamera(resource, function (resource) {
      var JSONResponse = serializer.serialize(resource, { include: [] });
      return JSONResponse.data;
    });

    this.cameras[resource.cid] = camera;

    return camera;

  },

  _removeCamera: function (resource) {

    delete this.cameras[resource.cid];

  },

  _getCamera: function (resource) {

    return this.cameras[resource.cid];

  },

  _createLinkSession: function (resource, key, options) {

    this.linkSessions.push(
      new ResourceSession(resource,
        this.url + 'links/' + key + '/', options)
    );

  },

  _removeLinkSession: function (resource) {

    var session = _.find(this.linkSessions, function (session) {
      return session.resources === resource;
    });
    _.pull(this.linkSessions, session);

  },

});

module.exports = ResourceSession;
