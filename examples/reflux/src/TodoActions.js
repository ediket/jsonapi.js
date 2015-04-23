var Reflux = require('reflux');


module.exports = Reflux.createActions({

  fetchTodo: {
    asyncResult: true
  },

  patchTodo: {
    asyncResult: true
  },

  createTodo: {
    asyncResult: true
  },

  removeTodo: {
    asyncResult: true
  }

});
