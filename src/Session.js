
'use strict';


var _ = require('lodash');
var Backbone = require('backbone');
var Events = Backbone.Events;
var ResourceCollection = require('./ResourceCollection');
var serializer = require('./serializer');
var JSONCamera = require('./lib/JSONCamera');
var diffJSON = require('./lib/diffJSON');


var ResourceSession = function (resources, url, options) {

  if (!resources || !url) {
    throw new Error('unenough arguments');
  }

  if (!resources instanceof ResourceCollection) {
    throw new TypeError();
  }

  options = options || {};

  this.url = url;
  this.cameras = {};
  this.resources = resources;
  this.syncronizer = options.syncronizer;

  this.resources.each(function (resource) {

    this._createCamera(resource).capture();

  }, this);

  this.listenTo(this.resources, 'add', function (resource) {

    this._createCamera(resource).capture();

  });

  this.listenTo(this.resources, 'destroy', function (resource) {

    this._getCamera(resource).capture({
      _deleted: true
    });

  });

  this.listenTo(this.resources, 'change', function (resource) {

    this._getCamera(resource).capture();

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

  _getCamera: function (resource) {

    return this.cameras[resource.cid];

  },

  _removeCamera: function (resource) {

    var camera = this.cameras[resource.cid];
    delete this.cameras[resource.cid];
    return camera;

  },

  _getCameras: function () {

    return _.values(this.cameras);

  },

  commit: function () {

    _.each(this._getCameras(), function (camera) {

      var resource = camera.target;

      if (resource.id) {
        if (camera.last()._deleted) {
          this.syncronizer.delete(this.url + resource.id);
          this._removeCamera(resource);
        }
        else {
          if (!_.isEqual(camera.first(), camera.last())) {
            this.syncronizer.patch(this.url + resource.id,
              serializer.serialize(resource, { include: [] }));
          }
        }
      }
      else {
        this.syncronizer.post(this.url,
          serializer.serialize(resource, { include: [] }));
      }

      camera.snapshots = camera.snapshots.slice(-1);

    }, this);

  }


});

module.exports = ResourceSession;
