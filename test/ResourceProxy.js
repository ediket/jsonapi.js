import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import stubPromise from './lib/stubPromise';
import promiseValue from './lib/promiseValue';
import { ResourceProxy, pool } from '../build/jsonapi';


describe('ResourceProxy', function () {

  var syncronizer;
  var originalSyncronizer;

  before(function () {

    syncronizer = {
      post: stubPromise(),
      get: stubPromise(),
      delete: stubPromise(),
      patch: stubPromise()
    };
    originalSyncronizer = pool.syncronizer;
    pool.syncronizer = syncronizer;

  });

  after(function () {

    pool.syncronizer = originalSyncronizer;

  });

  afterEach(function () {

    syncronizer.post.reset();
    syncronizer.get.reset();
    syncronizer.delete.reset();
    syncronizer.patch.reset();

  });

  describe('#getData', function () {

    it('should be promised to get data', function () {

      syncronizer.get.withArgs('/api/foo/').returns(
        promiseValue({
          data: {
            content: 'hello world',
            links: {
              self: '/api/foo/'
            }
          }
        })
      );

      pool.get('/api/foo/')
        .then(function (rc) {
          var json = rc.getData();
          expect(syncronizer.get.called).to.be.true;
          expect(json.content).to.equal('hello world');
        });

    });

  });

  describe('#getRelated', function () {

    it('should not make ajax request when resource already in pool.', function () {

      var foo = new ResourceProxy({
        data: {
          content: 'foo',
          links: {
            self: '/api/foo/',
            children: {
              self: '/api/foo/links/children/',
              related: '/api/foo/children/',
              linkage: [{
                type: 'foo',
                id: 1
              }]
            }
          }
        }
      });

      pool.add(foo);

      var bar = new ResourceProxy({
        data: {
          content: 'bar',
          links: {
            self: '/api/bar/'
          }
        }
      });

      pool.add(bar);

      foo.setLink('barlink', bar);

      return pool.get(foo.getRelatedURL('barlink'))
        .then(function (bar) {
          var json = bar.getData();
          expect(syncronizer.get.called).to.be.false;
          expect(json.content).to.equal('bar');
        });

    });

    it('should be promised to get related resource', function () {

      syncronizer.get.withArgs('/api/foo/children/').returns(
        promiseValue({
          links: {
            self: '/api/foo/children/'
          },
          data: [{
            id: 1,
            type: 'foo',
            content: 'hello'
          }]
        })
      );

      var rc = new ResourceProxy({
        data: {
          links: {
            self: '/api/foo/',
            children: {
              self: '/api/foo/links/children/',
              related: '/api/foo/children/',
              linkage: [{
                type: 'foo',
                id: 1
              }]
            }
          }
        }
      });

      pool.add(rc);

      return pool.get(rc.getRelatedURL('children'))
        .then(function (children) {
          var json = children.getData();
          expect(syncronizer.get.called).to.be.true;
          expect(json[0].content).to.equal('hello');
        });

    });

  });

});
