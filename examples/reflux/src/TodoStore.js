var JSONAPI = require('backbone.resource');
var Reflux = require('reflux');
var TodoActions = require('./TodoActions');
var PoolMixin = require('./PoolMixin');
var pools = require('./pools');
var connectors = require('./connectors');


pools.rest.setURL('todo', '/api/todo/')


var TodoStore = Reflux.createStore({

  mixins: [
    new PoolMixin(
      pools.memory,
      pools.rest,
      connectors.memoryToRest,
      'todo')
  ],

  listenables: [TodoActions],

  onCreateTodo: function () {

  },

  onRemoveTodo: function () {

  },

  onPatchTodo: function () {

  },

  onFetchTodo: function () {

  }

});


module.exports = TodoStore;
