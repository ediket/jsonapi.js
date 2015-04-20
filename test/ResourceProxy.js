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
            type: '123',
            id: 23,
            content: 'hello world',
            links: {
              self: '/api/foo/'
            }
          }
        })
      );

      var exampleLink = {
        related: '/api/foo/'
      };

      pool.get(exampleLink)
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
        type: 'foo',
        id: 2,
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
      });

      pool.add(foo);

      var bar = new ResourceProxy({
        type: 'bar',
        id: 2,
        content: 'bar',
        links: {
          self: '/api/bar/'
        }
      });

      pool.add(bar);

      foo.setLink('barlink', bar);

      return pool.get(foo.getLink('barlink'))
        .then(function (bar) {
          expect(syncronizer.get.called).to.be.false;
          expect(bar.get('content')).to.equal('bar');
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
            content: 'hello',
            links: {
              self: '/api/foo/children/1/'
            }
          }]
        })
      );

      var rc = new ResourceProxy({
        type: 'content',
        id: 1,
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
      });

      pool.add(rc);

      return pool.get(rc.getLink('children'))
        .then(function (children) {
          var child = children[0];
          expect(syncronizer.get.called).to.be.true;
          expect(child.get('content')).to.equal('hello');
        });

    });

  });

});
