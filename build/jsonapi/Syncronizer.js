'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Q = require('q');

var _Q2 = _interopRequireWildcard(_Q);

var _ResourcePool = require('./ResourcePool');

var _ResourcePool2 = _interopRequireWildcard(_ResourcePool);

var isValidResponse = function isValidResponse(res) {
  return res && res.data && (res.links || res.data.links);
};

var Syncronizer = function Syncronizer(pool) {

  this.diffs = [];
  this.syncronizer = {};
};

_import2['default'].extend(Syncronizer.prototype, {

  addDiff: function addDiff(diff) {

    this.diffs.push(diff);
  },

  patchAll: function patchAll(options) {

    this.diffs = this._optimizeDiff(this.diffs);

    _import2['default'].each(this.diffs, function () {});
  },

  fetch: function fetch(url) {

    return this.syncronizer.get(url);
  },

  getDiffs: function getDiffs() {

    return this.diffs;
  },

  _optimizeDiffs: function _optimizeDiffs(diffs) {

    return diffs;
  },

  isSynced: function isSynced() {

    return _import2['default'].isEmpty(this.diffs);
  }

});

exports['default'] = Syncronizer;
module.exports = exports['default'];

// SYNC CODE
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qc29uYXBpL1N5bmNyb25pemVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3NCQUFjLFFBQVE7Ozs7aUJBQ1IsR0FBRzs7Ozs0QkFDUSxnQkFBZ0I7Ozs7QUFHekMsSUFBSSxlQUFlLEdBQUcseUJBQVUsR0FBRyxFQUFFO0FBQ25DLFNBQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQSxBQUFDLENBQUM7Q0FDekQsQ0FBQzs7QUFHRixJQUFJLFdBQVcsR0FBRyxxQkFBVSxJQUFJLEVBQUU7O0FBRWhDLE1BQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLE1BQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0NBRXZCLENBQUM7O0FBR0Ysb0JBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7O0FBRTlCLFNBQU8sRUFBRSxpQkFBVSxJQUFJLEVBQUU7O0FBRXZCLFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBRXZCOztBQUVELFVBQVEsRUFBRSxrQkFBVSxPQUFPLEVBQUU7O0FBRTNCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTVDLHdCQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFlBQVksRUFFOUIsQ0FBQyxDQUFDO0dBRUo7O0FBRUQsT0FBSyxFQUFFLGVBQVUsR0FBRyxFQUFFOztBQUVwQixXQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBRWxDOztBQUVELFVBQVEsRUFBRSxvQkFBWTs7QUFFcEIsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0dBRW5COztBQUVELGdCQUFjLEVBQUUsd0JBQVUsS0FBSyxFQUFFOztBQUUvQixXQUFPLEtBQUssQ0FBQztHQUVkOztBQUVELFVBQVEsRUFBRSxvQkFBWTs7QUFFcEIsV0FBTyxvQkFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBRTlCOztDQUVGLENBQUMsQ0FBQzs7cUJBR1ksV0FBVyIsImZpbGUiOiJzcmMvanNvbmFwaS9TeW5jcm9uaXplci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUSBmcm9tICdxJztcbmltcG9ydCBSZXNvdXJjZVBvb2wgZnJvbSAnLi9SZXNvdXJjZVBvb2wnO1xuXG5cbnZhciBpc1ZhbGlkUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzKSB7XG4gIHJldHVybiByZXMgJiYgcmVzLmRhdGEgJiYgKHJlcy5saW5rcyB8fCByZXMuZGF0YS5saW5rcyk7XG59O1xuXG5cbnZhciBTeW5jcm9uaXplciA9IGZ1bmN0aW9uIChwb29sKSB7XG5cbiAgdGhpcy5kaWZmcyA9IFtdO1xuICB0aGlzLnN5bmNyb25pemVyID0ge307XG5cbn07XG5cblxuXy5leHRlbmQoU3luY3Jvbml6ZXIucHJvdG90eXBlLCB7XG5cbiAgYWRkRGlmZjogZnVuY3Rpb24gKGRpZmYpIHtcblxuICAgIHRoaXMuZGlmZnMucHVzaChkaWZmKTtcblxuICB9LFxuXG4gIHBhdGNoQWxsOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gICAgdGhpcy5kaWZmcyA9IHRoaXMuX29wdGltaXplRGlmZih0aGlzLmRpZmZzKTtcblxuICAgIF8uZWFjaCh0aGlzLmRpZmZzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBTWU5DIENPREVcbiAgICB9KTtcblxuICB9LFxuXG4gIGZldGNoOiBmdW5jdGlvbiAodXJsKSB7XG5cbiAgICByZXR1cm4gdGhpcy5zeW5jcm9uaXplci5nZXQodXJsKTtcblxuICB9LFxuXG4gIGdldERpZmZzOiBmdW5jdGlvbiAoKSB7XG5cbiAgICByZXR1cm4gdGhpcy5kaWZmcztcblxuICB9LFxuXG4gIF9vcHRpbWl6ZURpZmZzOiBmdW5jdGlvbiAoZGlmZnMpIHtcblxuICAgIHJldHVybiBkaWZmcztcblxuICB9LFxuXG4gIGlzU3luY2VkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICByZXR1cm4gXy5pc0VtcHR5KHRoaXMuZGlmZnMpO1xuXG4gIH1cblxufSk7XG5cblxuZXhwb3J0IGRlZmF1bHQgU3luY3Jvbml6ZXI7XG4iXX0=