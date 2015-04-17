
'use strict';

var _ = require('lodash');
var Q = require('q');
var ResourcePool = require('./ResourcePool');
var singletons = require('./singletons');

var isValidResponse = function isValidResponse(res) {
  return res && res.data && (res.links || res.data.links);
};

var ResourceProxy = function ResourceProxy(options) {

  this.url = options.url || options.links.self;
  this.data = options.data || null;
  this.links = options.links || null;

  this.options = _.omit(options, 'data', 'links', 'url');
  this.syncronizer = options.syncronizer;
  this.pool = options.pool || singletons.pool;
  this.pool.add(this);
};

_.extend(ResourceProxy.prototype, {

  _createNeighbor: function _createNeighbor(options) {

    return new ResourceProxy(_.extend({}, this.options, options));
  },

  fetch: function fetch() {

    return Q.when(this.syncronizer.get(this.url), (function (res) {
      if (!isValidResponse(res)) {
        throw new Error('invalid response!');
      }
      this.data = _.omit(res.data, 'links');
      this.links = res.links || res.data.links;
      return this;
    }).bind(this));
  },

  getData: function getData() {

    return Q.when(this.data ? this : this.fetch(), (function () {
      return this.data;
    }).bind(this));
  },

  setLink: function setLink(key, resource) {

    this.links[key] = {
      related: resource.url
    };
  },

  getLink: function getLink(key) {

    return Q.when(this.links[key] ? this : this.fetch(), (function () {
      return this.links[key];
    }).bind(this));
  },

  getRelated: function getRelated(key) {

    return Q.when(this.getLink(key), (function (links) {
      return this.pool.get(links.related) || this._createNeighbor({ url: links.related });
    }).bind(this));
  }

});

module.exports = ResourceProxy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZXNvdXJjZVByb3h5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxZQUFZLENBQUM7O0FBR2IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM3QyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBR3pDLElBQUksZUFBZSxHQUFHLHlCQUFVLEdBQUcsRUFBRTtBQUNuQyxTQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUEsQUFBQyxDQUFDO0NBQ3pELENBQUM7O0FBR0YsSUFBSSxhQUFhLEdBQUcsdUJBQVUsT0FBTyxFQUFFOztBQUVyQyxNQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDN0MsTUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztBQUNqQyxNQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDOztBQUVuQyxNQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdkQsTUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQ3ZDLE1BQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQzVDLE1BQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0NBRXJCLENBQUM7O0FBR0YsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFOztBQUVoQyxpQkFBZSxFQUFFLHlCQUFVLE9BQU8sRUFBRTs7QUFFbEMsV0FBTyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FFL0Q7O0FBRUQsT0FBSyxFQUFFLGlCQUFZOztBQUVqQixXQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUEsVUFBVSxHQUFHLEVBQUU7QUFDM0QsVUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN6QixjQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7T0FDdEM7QUFDRCxVQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN0QyxVQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDekMsYUFBTyxJQUFJLENBQUM7S0FDYixDQUFBLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FFZjs7QUFFRCxTQUFPLEVBQUUsbUJBQVk7O0FBRW5CLFdBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQSxZQUFZO0FBQ3pELGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQztLQUNsQixDQUFBLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FFZjs7QUFFRCxTQUFPLEVBQUUsaUJBQVUsR0FBRyxFQUFFLFFBQVEsRUFBRTs7QUFFaEMsUUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRztBQUNoQixhQUFPLEVBQUUsUUFBUSxDQUFDLEdBQUc7S0FDdEIsQ0FBQztHQUVIOztBQUVELFNBQU8sRUFBRSxpQkFBVSxHQUFHLEVBQUU7O0FBRXRCLFdBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQSxZQUFZO0FBQy9ELGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN4QixDQUFBLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FFZjs7QUFFRCxZQUFVLEVBQUUsb0JBQVUsR0FBRyxFQUFFOztBQUV6QixXQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFBLFVBQVUsS0FBSyxFQUFFO0FBQ2hELGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUNqQyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ2hELENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUVmOztDQUVGLENBQUMsQ0FBQzs7QUFHSCxNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyIsImZpbGUiOiJzcmMvUmVzb3VyY2VQcm94eS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgUSA9IHJlcXVpcmUoJ3EnKTtcbnZhciBSZXNvdXJjZVBvb2wgPSByZXF1aXJlKCcuL1Jlc291cmNlUG9vbCcpO1xudmFyIHNpbmdsZXRvbnMgPSByZXF1aXJlKCcuL3NpbmdsZXRvbnMnKTtcblxuXG52YXIgaXNWYWxpZFJlc3BvbnNlID0gZnVuY3Rpb24gKHJlcykge1xuICByZXR1cm4gcmVzICYmIHJlcy5kYXRhICYmIChyZXMubGlua3MgfHwgcmVzLmRhdGEubGlua3MpO1xufTtcblxuXG52YXIgUmVzb3VyY2VQcm94eSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCBvcHRpb25zLmxpbmtzLnNlbGY7XG4gIHRoaXMuZGF0YSA9IG9wdGlvbnMuZGF0YSB8fCBudWxsO1xuICB0aGlzLmxpbmtzID0gb3B0aW9ucy5saW5rcyB8fCBudWxsO1xuXG4gIHRoaXMub3B0aW9ucyA9IF8ub21pdChvcHRpb25zLCAnZGF0YScsICdsaW5rcycsICd1cmwnKTtcbiAgdGhpcy5zeW5jcm9uaXplciA9IG9wdGlvbnMuc3luY3Jvbml6ZXI7XG4gIHRoaXMucG9vbCA9IG9wdGlvbnMucG9vbCB8fCBzaW5nbGV0b25zLnBvb2w7XG4gIHRoaXMucG9vbC5hZGQodGhpcyk7XG5cbn07XG5cblxuXy5leHRlbmQoUmVzb3VyY2VQcm94eS5wcm90b3R5cGUsIHtcblxuICBfY3JlYXRlTmVpZ2hib3I6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICByZXR1cm4gbmV3IFJlc291cmNlUHJveHkoXy5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucykpO1xuXG4gIH0sXG5cbiAgZmV0Y2g6IGZ1bmN0aW9uICgpIHtcblxuICAgIHJldHVybiBRLndoZW4odGhpcy5zeW5jcm9uaXplci5nZXQodGhpcy51cmwpLCBmdW5jdGlvbiAocmVzKSB7XG4gICAgICBpZiAoIWlzVmFsaWRSZXNwb25zZShyZXMpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCByZXNwb25zZSEnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZGF0YSA9IF8ub21pdChyZXMuZGF0YSwgJ2xpbmtzJyk7XG4gICAgICB0aGlzLmxpbmtzID0gcmVzLmxpbmtzIHx8IHJlcy5kYXRhLmxpbmtzO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICB9LFxuXG4gIGdldERhdGE6IGZ1bmN0aW9uICgpIHtcblxuICAgIHJldHVybiBRLndoZW4odGhpcy5kYXRhID8gdGhpcyA6IHRoaXMuZmV0Y2goKSwgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gIH0sXG5cbiAgc2V0TGluazogZnVuY3Rpb24gKGtleSwgcmVzb3VyY2UpIHtcblxuICAgIHRoaXMubGlua3Nba2V5XSA9IHtcbiAgICAgIHJlbGF0ZWQ6IHJlc291cmNlLnVybFxuICAgIH07XG5cbiAgfSxcblxuICBnZXRMaW5rOiBmdW5jdGlvbiAoa2V5KSB7XG5cbiAgICByZXR1cm4gUS53aGVuKHRoaXMubGlua3Nba2V5XSA/IHRoaXMgOiB0aGlzLmZldGNoKCksIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpbmtzW2tleV07XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICB9LFxuXG4gIGdldFJlbGF0ZWQ6IGZ1bmN0aW9uIChrZXkpIHtcblxuICAgIHJldHVybiBRLndoZW4odGhpcy5nZXRMaW5rKGtleSksIGZ1bmN0aW9uIChsaW5rcykge1xuICAgICAgcmV0dXJuIHRoaXMucG9vbC5nZXQobGlua3MucmVsYXRlZCkgfHxcbiAgICAgICAgdGhpcy5fY3JlYXRlTmVpZ2hib3IoeyB1cmw6IGxpbmtzLnJlbGF0ZWQgfSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICB9XG5cbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VQcm94eTtcbiJdfQ==