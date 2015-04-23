var Q = require('q');
var expect = require('chai').expect;
var Reflux = require('reflux');
var sinon = require('sinon');
var stubPromise = require('./libs/stubPromise');
var matchJSON = require('./libs/matchJSON');
var promiseValue = require('./libs/promiseValue');
var JSONAPI = require('backbone.resource');
var Resource = JSONAPI.Resource;
var MemoryPool = JSONAPI.MemoryPool;
var RestPool = JSONAPI.RestPool;
var PoolConnector = JSONAPI.PoolConnector;
var PoolMixin = require('../src/PoolMixin');


describe('PoolMixin', function () {

  var memoryPool = new MemoryPool();
  var restPool = new RestPool([], {
    typeToUrl: {
      'foo': '/api/foo/'
    }
  });
  var memoryToRest = new PoolConnector(memoryPool, restPool);
  var syncronizer;

  var Store = Reflux.createStore({

    mixins: [
      new PoolMixin(
        memoryPool,
        restPool,
        memoryToRest,
        'foo')
    ]

  });

  before(function () {

    syncronizer = {
      post: stubPromise(),
      get: stubPromise(),
      delete: stubPromise(),
      patch: stubPromise()
    };
    restPool.syncronizer = syncronizer;

  });

  beforeEach(function () {

    memoryPool.pool = {};
    restPool.pool = {};
    syncronizer.post.reset();
    syncronizer.get.reset();
    syncronizer.delete.reset();
    syncronizer.patch.reset();

  });

  describe('#get', function () {

    before(function () {

      syncronizer.get.withArgs('/api/foo/1').returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1,
            content: 'hello world',
            links: {
              self: '/api/foo/1'
            }
          }
        })
      );

    });

    it('should get resource from memory if it exist in memory', function () {

      Store.add(new Resource({
        type: 'foo',
        id: 1,
        content: 'hello world',
        links: {
          self: '/api/foo/1'
        }
      }));

      return Q.fcall(function () {
        return Store.get('/api/foo/1');
      })
      .then(function (resource) {
        expect(resource.toJSON()).to.deep.equal({
          type: 'foo',
          id: 1,
          content: 'hello world'
        });
        expect(syncronizer.get.getCall(0)).to.not.ok;
      });

    });

    it('should get resource from server if it does not exist in memory', function () {

      return Q.fcall(function () {
        return Store.get('/api/foo/1');
      })
      .then(function (resource) {
        expect(resource.toJSON()).to.deep.equal({
          type: 'foo',
          id: 1,
          content: 'hello world'
        });
        expect(syncronizer.get.getCall(0)).to.ok;
        expect(syncronizer.get.getCall(0).args[0]).to.deep.equal('/api/foo/1');
      });

    });

  });

  describe('#create', function () {

    before(function () {

      syncronizer.post.withArgs('/api/foo/').returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1,
            content: 'hello world',
            links: {
              self: '/api/foo/1'
            }
          }
        })
      );

    });

    it('should create resource in memory and not request POST if store is not flushed', function () {

      return Q.fcall(function () {
        return Store.create({
          content: 'hello world'
        });
      })
      .then(function (resource) {
        expect(resource.toJSON()).to.satisfy(matchJSON({
          type: 'foo',
          content: 'hello world'
        }));
        expect(syncronizer.post.getCall(0)).to.not.ok;
      });

    });

    it('should create resource in memory and request POST if store is flushed', function () {

      return Q.fcall(function () {
        return Store.create({
          type: 'foo',
          id: 1,
          content: 'hello world'
        })
        .then(Store.flush());
      })
      .then(function (resource) {
        expect(resource.toJSON()).to.satisfy(matchJSON({
          type: 'foo',
          content: 'hello world'
        }));
        expect(syncronizer.post.getCall(0)).to.ok;
        expect(syncronizer.post.getCall(0).args[0]).to.deep.equal('/api/foo/');
        expect(syncronizer.post.getCall(0).args[1]).to.deep.equal({
          data: {
            type: 'foo',
            content: 'hello world'
          }
        });
      });

    });

  });

  describe('#patch', function () {

    before(function () {

      syncronizer.get.withArgs('/api/foo/1').returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1,
            content: 'hello world',
            links: {
              self: '/api/foo/1'
            }
          }
        })
      );

      syncronizer.patch.withArgs('/api/foo/1').returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1,
            content: 'wow',
            links: {
              self: '/api/foo/1'
            }
          }
        })
      );

    });

    it('should patch resource in memory and not request PATCH if store is not flushed', function () {

      return Q.fcall(function () {
        return Store.get('/api/foo/1');
      })
      .then(function (resource) {
        return Store.patch(resource, {
          content: 'wow'
        });
      })
      .then(function (resource) {
        expect(resource.toJSON()).to.deep.equal({
          type: 'foo',
          id: 1,
          content: 'wow'
        });
        expect(syncronizer.patch.getCall(0)).to.not.ok;
      });

    });

    it('should patch resource in memory and request PATCH if store is flushed', function () {

      return Q.fcall(function () {
        return Store.get('/api/foo/1');
      })
      .then(function (resource) {
        return Store.patch(resource, {
          content: 'wow'
        })
        .then(Store.flush());
      })
      .then(function (resource) {
        expect(resource.toJSON()).to.deep.equal({
          type: 'foo',
          id: 1,
          content: 'wow'
        });
        expect(syncronizer.patch.getCall(0)).to.ok;
      });

    });

  });

  describe('#remove', function () {

    before(function () {

      syncronizer.get.withArgs('/api/foo/1').returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1,
            content: 'hello world',
            links: {
              self: '/api/foo/1'
            }
          }
        })
      );

      syncronizer.delete.withArgs('/api/foo/1').returns(
        promiseValue()
      );

    });

    it('should remove resource in memory and not request DELETE if store is not flushed', function () {

      return Q.fcall(function () {
        return Store.get('/api/foo/1');
      })
      .then(function (resource) {
        return Store.remove(resource);
      })
      .then(function (resource) {
        expect(syncronizer.delete.getCall(0)).to.not.ok;
      });

    });

    it('should remove resource in memory and request DELETE if store is flushed', function () {

      return Q.fcall(function () {
        return Store.get('/api/foo/1');
      })
      .then(function (resource) {
        return Store.remove(resource)
        .then(Store.flush());
      })
      .then(function (resource) {
        expect(syncronizer.delete.getCall(0)).to.ok;
        expect(syncronizer.delete.getCall(0).args[0]).to.equal('/api/foo/1');
      });

    });

  });

  describe('#getState', function () {

    before(function () {

      syncronizer.get.withArgs('/api/foo/1').returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 1,
            content: 'hello world',
            links: {
              self: '/api/foo/1'
            }
          }
        })
      );

    });

    it('should return current MemoryPool\'s resources', function () {

      return Q.fcall(function () {
        return Store.get('/api/foo/1');
      })
      .then(function (resource) {
        expect(Store.getState()).to.have.length(1);
      });

    });

  });

});
