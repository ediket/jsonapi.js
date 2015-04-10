
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

  options = options || {};

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

  this.listenTo(this.resources, 'add', function (resource) {

    if (_.contains(this.removed, resource)) {
      _.pull(this.removed, resources);
      return;
    }
    this.added.push(resource);

  });

  this.listenTo(this.resources, 'remove', function (resource) {

    if (_.contains(this.added, resource)) {
      _.pull(this.added, resources);
      return;
    }
    this.removed.push(resource);

  });

  this.listenTo(this.resources, 'change', function (resource) {

    this.changed.push(resource);
    this._getCamera(resource).capture();

  });

  this.resources.each(function (resource) {

    _.each(resource.getLinks(), function (resource, referKey) {

      this.linkSessions.push(
        new ResourceSession(resource,
          url + 'links/' + referKey + '/', options)
      );

    }, this);

  }, this);


  this.listenTo(this.resources, 'add:link', function (resource, referKey) {

    this.linkSessions.push(
      new ResourceSession(resource,
        url + 'links/' + referKey + '/', options)
    );

  });

  this.listenTo(this.resources, 'remove:link', function (resource, referKey) {

    var session = _.find(this.linkSessions, function (session) {
      return session.resources === resource;
    });
    _.pull(this.linkSessions, session);

  });

};


_.extend(ResourceSession.prototype, Events, {

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

  commit: function () {

    // CHANGED
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

    // ADDED
    var postData = _.map(this.added, function (resource) {
      return serializer.serialize(resource, { include: [] }).data;
    });

    if (!_.isEmpty(postData)) {
      this.syncronizer.post(this.url, {
        data: postData
      });
    }

    // REMOVED
    var deleteData = _.map(this.removed, function (resource) {
      return resource.toLinkage();
    });

    if (!_.isEmpty(deleteData)) {
      this.syncronizer.delete(this.url, {
        data: deleteData
      });
    }

    // Reset Camera
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

    // Reset change log
    this.addad = [];
    this.removed = [];
    this.changed = [];

    _.each(this.linkSessions, function (session) {
      return session.commit();
    });

  }

});

module.exports = ResourceSession;
