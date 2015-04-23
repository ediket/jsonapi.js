var Q = require('q');
var _ = require('lodash');
var expect = require('chai').expect;
var Reflux = require('reflux');
var sinon = require('sinon');
var stubPromise = require('./libs/stubPromise');
var promiseValue = require('./libs/promiseValue');
var matchJSON = require('./libs/matchJSON');
var JSONAPI = require('backbone.resource');
var Resource = JSONAPI.Resource;
var MemoryPool = JSONAPI.MemoryPool;
var RestPool = JSONAPI.RestPool;
var PoolConnector = JSONAPI.PoolConnector;
var TodoStore = require('../src/TodoStore');
var TodoActions = require('../src/TodoActions');
var pools = require('../src/pools');


describe('PoolMixin', function () {

  var syncronizer;
  var originalSyncronizer;

  before(function () {

    syncronizer = {
      post: stubPromise(),
      get: stubPromise(),
      delete: stubPromise(),
      patch: stubPromise()
    };
    originalSyncronizer = pools.rest.syncronizer;
    pools.rest.syncronizer = syncronizer;

  });

  after(function () {

    pools.rest.syncronizer = originalSyncronizer;

  });

  beforeEach(function () {

    pools.rest.pool = {};
    pools.memory.pool = {};
    syncronizer.post.reset();
    syncronizer.get.reset();
    syncronizer.delete.reset();
    syncronizer.patch.reset();

  });

  describe('#fetchTodo', function () {

    it('it should make GET request and fetch Todo', function () {

      syncronizer.get.withArgs('/api/todo/1').returns(
        promiseValue({
          data: {
            type: 'todo',
            id: 1,
            content: 'hello world',
            links: {
              self: '/api/todo/1'
            }
          }
        })
      );

      return Q.fcall(function () {
        return TodoActions.fetchTodo(1);
      })
      .then(function () {
        var state = TodoStore.getState();
        expect(syncronizer.get.getCall(0)).to.ok;
        expect(state).to.have.length(1);
        expect(state[0]).to.satisfy(matchJSON({
          type: 'todo',
          content: 'hello world'
        }));
      })

    });

  });

  describe('#createTodo', function () {

    it('it should make POST request and create new Todo', function () {

      syncronizer.post.withArgs('/api/todo/').returns(
        promiseValue({
          data: {
            type: 'todo',
            id: 2,
            content: 'wow world',
            links: {
              self: '/api/todo/2'
            }
          }
        })
      );

      return Q.fcall(function () {
        return TodoActions.createTodo({
          content: 'wow world'
        });
      })
      .then(function () {
        var state = TodoStore.getState();
        expect(syncronizer.post.getCall(0)).to.ok;
        expect(state).to.have.length(1);
        expect(state[0]).to.satisfy(matchJSON({
          type: 'todo',
          content: 'wow world'
        }));
      });

    });

  });

  describe('#patchTodo', function () {

    it('it should make PATCH request and patch Todo', function () {

      syncronizer.get.withArgs('/api/todo/1').returns(
        promiseValue({
          data: {
            type: 'todo',
            id: 1,
            content: 'hello world',
            links: {
              self: '/api/todo/1'
            }
          }
        })
      );
      syncronizer.patch.withArgs('/api/todo/1').returns(
        promiseValue({
          data: {
            type: 'todo',
            id: 1,
            content: 'test content',
            links: {
              self: '/api/todo/1'
            }
          }
        })
      );

      return Q.fcall(function () {
        return TodoActions.fetchTodo(1);
      })
      .then(function () {
        var state = TodoStore.getState();
        return TodoActions.patchTodo(state[0].id, {
          content: 'test content'
        });
      })
      .then(function () {
        var state = TodoStore.getState();
        expect(syncronizer.patch.getCall(0)).to.ok;
        expect(state[0]).to.satisfy(matchJSON({
          type: 'todo',
          content: 'test content'
        }));
      });

    });

  });

describe('#removeTodo', function () {

    it('it should make DELETE request and remove Todo', function () {

      syncronizer.get.withArgs('/api/todo/1').returns(
        promiseValue({
          data: {
            type: 'todo',
            id: 1,
            content: 'hello world',
            links: {
              self: '/api/todo/1'
            }
          }
        })
      );
      syncronizer.delete.withArgs('/api/todo/1').returns(
        promiseValue({
          data: {
            type: 'todo',
            id: 1,
            content: 'wow world',
            links: {
              self: '/api/todo/1'
            }
          }
        })
      );

      return Q.fcall(function () {
        return TodoActions.fetchTodo(1);
      })
      .then(function () {
        var state = TodoStore.getState();
        return TodoActions.removeTodo(state[0].id);
      })
      .then(function () {
        var state = TodoStore.getState();
        expect(syncronizer.delete.getCall(0)).to.ok;
        expect(state).to.have.length(0);
      });

    });

  });

});
