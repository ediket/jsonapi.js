var JSONAPI = require('backbone.resource');
var Reflux = require('reflux');
var TodoActions = require('./TodoActions');
var PoolMixin = require('./PoolMixin');
var pools = require('./pools');
var connectors = require('./connectors');


pools.rest.setURL('todo', '/api/todo/');


var TodoStore = Reflux.createStore({

  mixins: [
    new PoolMixin(
      pools.memory,
      pools.rest,
      connectors.memoryToRest,
      'todo')
  ],

  listenables: [TodoActions],

  onCreateTodo: function (attributes) {

    TodoActions.createTodo.promise(
      this.create(attributes)
        .then(this.flush.bind(this))
        .then(this.trigger.bind(this))
    );

  },

  onRemoveTodo: function (id) {

    TodoActions.removeTodo.promise(
      this.get(this.getURL(id))
        .then(function (resource) {
          return this.remove(resource);
        }.bind(this))
        .then(this.flush.bind(this))
        .then(this.trigger.bind(this))
    );

  },

  onPatchTodo: function (id, attributes) {

    TodoActions.patchTodo.promise(
      this.get(this.getURL(id))
        .then(function (resource) {
          return this.patch(resource, attributes);
        }.bind(this))
        .then(this.flush.bind(this))
        .then(this.trigger.bind(this))
    );

  },

  onFetchTodo: function (id) {

    TodoActions.fetchTodo.promise(
      this.get(this.getURL(id))
        .then(this.flush.bind(this))
        .then(this.trigger.bind(this))
    );

  }

});


module.exports = TodoStore;
