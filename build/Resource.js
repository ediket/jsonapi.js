
'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
var Model = Backbone.Model;
var SerializeMixin = require('./SerializeMixin');

module.exports = Model.extend(_.extend({}, SerializeMixin, {

  sync: function sync() {
    return false;
  },

  initialize: function initialize(options) {

    if (!options || !options.type) {
      throw new Error('type is required');
    }

    this.type = options.type;
    this.links = {};
  },

  addLink: function addLink(key, otherResource) {

    if (!this.isSerializable(otherResource)) {
      throw 'error';
    }

    this.links[key] = otherResource;
    this.trigger('add:link', otherResource, key);

    return this;
  },

  removeLink: function removeLink(key) {

    this.trigger('remove:link', this.links[key], key);
    delete this.links[key];

    return this;
  },

  getLink: function getLink(link) {

    return this.links[link];
  },

  getLinks: function getLinks() {

    return _.clone(this.links);
  },

  setLinks: function setLinks(links) {

    this.links = links;
  },

  toJSON: function toJSON(options) {

    options = _.defaults(options || {}, {
      recursive: false
    });

    var result = Model.prototype.toJSON.apply(this, arguments);
    _.extend(result, _.clone(this.toLinkage()));

    if (options.recursive) {
      _.extend(result, _.mapValues(this.getLinks(), function (resource, key) {
        return resource.toJSON();
      }));
    }

    return _.omit(result, _.isUndefined);
  },

  toLinkage: function toLinkage() {

    return {
      type: this.type,
      id: this.id
    };
  },

  merge: function merge(resource) {

    if (resource.get('id') !== this.get('id') || resource.get('type') !== this.get('type')) {
      throw new Error('type, id doesn\'t match ');
    }

    this.set(resource.toJSON());
    this.setLinks(resource.getLinks());

    return this;
  }

}));
//# sourceMappingURL=data:application/json;base64,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QixDQUFDLENBQ0gsQ0FBQztLQUNIOztBQUVELFdBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0dBRXRDOztBQUVELFdBQVMsRUFBRSxxQkFBWTs7QUFFckIsV0FBTztBQUNMLFVBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNmLFFBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtLQUNaLENBQUM7R0FFSDs7QUFFRCxPQUFLLEVBQUUsZUFBVSxRQUFRLEVBQUU7O0FBRXpCLFFBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUN2QyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDM0MsWUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBeUIsQ0FBQyxDQUFDO0tBQzVDOztBQUVELFFBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDNUIsUUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzs7QUFFbkMsV0FBTyxJQUFJLENBQUM7R0FFYjs7Q0FFRixDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJzcmMvUmVzb3VyY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc3RyaWN0JztcblxuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xudmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcbnZhciBNb2RlbCA9IEJhY2tib25lLk1vZGVsO1xudmFyIFNlcmlhbGl6ZU1peGluID0gcmVxdWlyZSgnLi9TZXJpYWxpemVNaXhpbicpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwuZXh0ZW5kKF8uZXh0ZW5kKHt9LCBTZXJpYWxpemVNaXhpbiwge1xuXG4gIHN5bmM6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZhbHNlOyB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMudHlwZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0eXBlIGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuXG4gICAgdGhpcy50eXBlID0gb3B0aW9ucy50eXBlO1xuICAgIHRoaXMubGlua3MgPSB7fTtcblxuICB9LFxuXG4gIGFkZExpbms6IGZ1bmN0aW9uIChrZXksIG90aGVyUmVzb3VyY2UpIHtcblxuICAgIGlmICghdGhpcy5pc1NlcmlhbGl6YWJsZShvdGhlclJlc291cmNlKSkge1xuICAgICAgdGhyb3cgJ2Vycm9yJztcbiAgICB9XG5cbiAgICB0aGlzLmxpbmtzW2tleV0gPSBvdGhlclJlc291cmNlO1xuICAgIHRoaXMudHJpZ2dlcignYWRkOmxpbmsnLCBvdGhlclJlc291cmNlLCBrZXkpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgfSxcblxuICByZW1vdmVMaW5rOiBmdW5jdGlvbiAoa2V5KSB7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3JlbW92ZTpsaW5rJywgdGhpcy5saW5rc1trZXldLCBrZXkpO1xuICAgIGRlbGV0ZSB0aGlzLmxpbmtzW2tleV07XG5cbiAgICByZXR1cm4gdGhpcztcblxuICB9LFxuXG4gIGdldExpbms6IGZ1bmN0aW9uIChsaW5rKSB7XG5cbiAgICByZXR1cm4gdGhpcy5saW5rc1tsaW5rXTtcblxuICB9LFxuXG4gIGdldExpbmtzOiBmdW5jdGlvbiAoKSB7XG5cbiAgICByZXR1cm4gXy5jbG9uZSh0aGlzLmxpbmtzKTtcblxuICB9LFxuXG4gIHNldExpbmtzOiBmdW5jdGlvbiAobGlua3MpIHtcblxuICAgIHRoaXMubGlua3MgPSBsaW5rcztcblxuICB9LFxuXG4gIHRvSlNPTjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMgfHwge30sIHtcbiAgICAgIHJlY3Vyc2l2ZTogZmFsc2VcbiAgICB9KTtcblxuICAgIHZhciByZXN1bHQgPSBNb2RlbC5wcm90b3R5cGUudG9KU09OLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgXy5leHRlbmQocmVzdWx0LCBfLmNsb25lKHRoaXMudG9MaW5rYWdlKCkpKTtcblxuICAgIGlmIChvcHRpb25zLnJlY3Vyc2l2ZSkge1xuICAgICAgXy5leHRlbmQocmVzdWx0LFxuICAgICAgICBfLm1hcFZhbHVlcyh0aGlzLmdldExpbmtzKCksIGZ1bmN0aW9uIChyZXNvdXJjZSwga2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc291cmNlLnRvSlNPTigpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gXy5vbWl0KHJlc3VsdCwgXy5pc1VuZGVmaW5lZCk7XG5cbiAgfSxcblxuICB0b0xpbmthZ2U6IGZ1bmN0aW9uICgpIHtcblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBpZDogdGhpcy5pZFxuICAgIH07XG5cbiAgfSxcblxuICBtZXJnZTogZnVuY3Rpb24gKHJlc291cmNlKSB7XG5cbiAgICBpZiAocmVzb3VyY2UuZ2V0KFwiaWRcIikgIT09IHRoaXMuZ2V0KFwiaWRcIikgfHxcbiAgICAgIHJlc291cmNlLmdldChcInR5cGVcIikgIT09IHRoaXMuZ2V0KFwidHlwZVwiKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHlwZSwgaWQgZG9lc24ndCBtYXRjaCBcIik7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQocmVzb3VyY2UudG9KU09OKCkpO1xuICAgIHRoaXMuc2V0TGlua3MocmVzb3VyY2UuZ2V0TGlua3MoKSk7XG5cbiAgICByZXR1cm4gdGhpcztcblxuICB9XG5cbn0pKTtcbiJdfQ==