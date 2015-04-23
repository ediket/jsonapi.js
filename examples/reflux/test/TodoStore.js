var Q = require('q');
var _ = require('lodash');
var expect = require('chai').expect;
var Reflux = require('reflux');
var sinon = require('sinon');
var stubPromise = require('./libs/stubPromise');
var promiseValue = require('./libs/promiseValue');
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

  describe('#getTodo', function () {

    it('it should return current todos', function () {

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
        return TodoActions.getTodo(1);
      })
      .then(function () {
        var state = TodoStore.getState();
        expect(state).to.have.length(1);

        return TodoActions.createTodo({
          content: 'wow world'
        });
      })
      .then(function () {
        var state = TodoStore.getState();
        expect(state).to.have.length(2);
        return TodoActions.patchTodo(state[0].id, {
          content: 'test content'
        });
      })
      .then(function () {
        var state = TodoStore.getState();
        expect(state[0].content).to.equal('test content');
      });

    });

  });

  describe('#createTodo', function () {

    it('it should create todo', function () {

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
        expect(state).to.have.length(1);
        expect(_.omit(state[0], 'id')).to.deep.equal({
          type: 'todo',
          content: 'wow world'
        });
      });

    });

  });

});
