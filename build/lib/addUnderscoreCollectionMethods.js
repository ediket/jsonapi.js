
'use strict';

var _ = require('lodash');
var addUnderscoreMethods = require('./addUnderscoreMethods');

// Underscore methods that we want to implement on the Collection.
// 90% of the core usefulness of Backbone Collections is actually implemented
// right here:
var collectionMethods = { forEach: 3, each: 3, map: 3, collect: 3, reduce: 4,
  foldl: 4, inject: 4, reduceRight: 4, foldr: 4, find: 3, detect: 3, filter: 3,
  select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 2,
  contains: 2, invoke: 2, max: 3, min: 3, toArray: 1, size: 1, first: 3,
  head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
  without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
  isEmpty: 1, chain: 1, sample: 3, partition: 3 };

module.exports = function (Collection, attribute) {

  // Mix in each Underscore method as a proxy to `Collection#models`.
  addUnderscoreMethods(Collection, collectionMethods, attribute);

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function (method) {
    if (!_[method]) return;
    Collection.prototype[method] = function (value, context) {
      var iterator = _.isFunction(value) ? value : function (model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvYWRkVW5kZXJzY29yZUNvbGxlY3Rpb25NZXRob2RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxZQUFZLENBQUM7O0FBR2IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLElBQUksb0JBQW9CLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7Ozs7O0FBTTdELElBQUksaUJBQWlCLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3hFLE9BQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQzVFLFFBQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDO0FBQ25FLFVBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3JFLE1BQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO0FBQ2hFLFNBQU8sRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUM7QUFDakUsU0FBTyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDOztBQUdwRCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsVUFBVSxFQUFFLFNBQVMsRUFBRTs7O0FBR2hELHNCQUFvQixDQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLENBQUMsQ0FBQzs7O0FBRy9ELE1BQUksZ0JBQWdCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQzs7O0FBR25FLEdBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsVUFBUyxNQUFNLEVBQUU7QUFDeEMsUUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPO0FBQ3ZCLGNBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQ3RELFVBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQzNELGVBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUN6QixDQUFDO0FBQ0YsYUFBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDbEQsQ0FBQztHQUNILENBQUMsQ0FBQztDQUVKLENBQUMiLCJmaWxlIjoic3JjL2xpYi9hZGRVbmRlcnNjb3JlQ29sbGVjdGlvbk1ldGhvZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc3RyaWN0JztcblxuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xudmFyIGFkZFVuZGVyc2NvcmVNZXRob2RzID0gcmVxdWlyZSgnLi9hZGRVbmRlcnNjb3JlTWV0aG9kcycpO1xuXG5cbi8vIFVuZGVyc2NvcmUgbWV0aG9kcyB0aGF0IHdlIHdhbnQgdG8gaW1wbGVtZW50IG9uIHRoZSBDb2xsZWN0aW9uLlxuLy8gOTAlIG9mIHRoZSBjb3JlIHVzZWZ1bG5lc3Mgb2YgQmFja2JvbmUgQ29sbGVjdGlvbnMgaXMgYWN0dWFsbHkgaW1wbGVtZW50ZWRcbi8vIHJpZ2h0IGhlcmU6XG52YXIgY29sbGVjdGlvbk1ldGhvZHMgPSB7IGZvckVhY2g6IDMsIGVhY2g6IDMsIG1hcDogMywgY29sbGVjdDogMywgcmVkdWNlOiA0LFxuICAgIGZvbGRsOiA0LCBpbmplY3Q6IDQsIHJlZHVjZVJpZ2h0OiA0LCBmb2xkcjogNCwgZmluZDogMywgZGV0ZWN0OiAzLCBmaWx0ZXI6IDMsXG4gICAgc2VsZWN0OiAzLCByZWplY3Q6IDMsIGV2ZXJ5OiAzLCBhbGw6IDMsIHNvbWU6IDMsIGFueTogMywgaW5jbHVkZTogMixcbiAgICBjb250YWluczogMiwgaW52b2tlOiAyLCBtYXg6IDMsIG1pbjogMywgdG9BcnJheTogMSwgc2l6ZTogMSwgZmlyc3Q6IDMsXG4gICAgaGVhZDogMywgdGFrZTogMywgaW5pdGlhbDogMywgcmVzdDogMywgdGFpbDogMywgZHJvcDogMywgbGFzdDogMyxcbiAgICB3aXRob3V0OiAwLCBkaWZmZXJlbmNlOiAwLCBpbmRleE9mOiAzLCBzaHVmZmxlOiAxLCBsYXN0SW5kZXhPZjogMyxcbiAgICBpc0VtcHR5OiAxLCBjaGFpbjogMSwgc2FtcGxlOiAzLCBwYXJ0aXRpb246IDMgfTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb2xsZWN0aW9uLCBhdHRyaWJ1dGUpIHtcblxuICAvLyBNaXggaW4gZWFjaCBVbmRlcnNjb3JlIG1ldGhvZCBhcyBhIHByb3h5IHRvIGBDb2xsZWN0aW9uI21vZGVsc2AuXG4gIGFkZFVuZGVyc2NvcmVNZXRob2RzKENvbGxlY3Rpb24sIGNvbGxlY3Rpb25NZXRob2RzLCBhdHRyaWJ1dGUpO1xuXG4gIC8vIFVuZGVyc2NvcmUgbWV0aG9kcyB0aGF0IHRha2UgYSBwcm9wZXJ0eSBuYW1lIGFzIGFuIGFyZ3VtZW50LlxuICB2YXIgYXR0cmlidXRlTWV0aG9kcyA9IFsnZ3JvdXBCeScsICdjb3VudEJ5JywgJ3NvcnRCeScsICdpbmRleEJ5J107XG5cbiAgLy8gVXNlIGF0dHJpYnV0ZXMgaW5zdGVhZCBvZiBwcm9wZXJ0aWVzLlxuICBfLmVhY2goYXR0cmlidXRlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgaWYgKCFfW21ldGhvZF0pIHJldHVybjtcbiAgICBDb2xsZWN0aW9uLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZSA6IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgIHJldHVybiBtb2RlbC5nZXQodmFsdWUpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBfW21ldGhvZF0odGhpcy5tb2RlbHMsIGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICB9O1xuICB9KTtcblxufTtcbiJdfQ==