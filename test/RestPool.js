import $ from 'jquery';
import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import Q from 'q';
import promiseValue from './lib/promiseValue';
import matchJSON from './lib/matchJSON';
import stubPromise from './lib/stubPromise';
import { RestPool, Resource, RESTful } from '../build/jsonapi';


describe('RestPool', function () {

  var server;
  var restPool;

  var syncronizer;
  var originalSyncronizer;

  beforeEach(function () {

    server = sinon.fakeServer.create();
    server.autoRespond = true;

    restPool = new RestPool([], {
      typeToUrl: {
        foo: '/api/foo/'
      }
    });

    syncronizer = {
      post: stubPromise(),
      get: stubPromise(),
      delete: stubPromise(),
      patch: stubPromise()
    };

    originalSyncronizer = restPool.syncronizer;
    restPool.syncronizer = syncronizer;

  });

  afterEach(function () {

    syncronizer.post.reset();
    syncronizer.get.reset();
    syncronizer.delete.reset();
    syncronizer.patch.reset();

    restPool = {};
    server.restore();

    restPool.syncronizer = originalSyncronizer;

  });

  describe('#create', function () {

    it('should create resource and make POST request', function () {

      syncronizer.post.withArgs('/api/foo/').returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 23,
            content: 'hello world',
            links: {
              self: '/api/foo/'
            }
          }
        })
      );

      return Q.fcall(() => {

        return restPool.create({
          type: 'foo',
          id: 23,
          content: 'hello world',
          links: {
            self: '/api/foo/'
          }
        })

      })
      .then(resource => {

        console.log(syncronizer.post.getCall(0));
        expect(syncronizer.post.getCall(0)).to.deep.equal(matchJSON({
          type: 'foo',
          content: 'foo'
        }));

        expect(restPool.get()).to.deep.equal(matchJSON({
          type: 'foo',
          content: 'foo'
        }));


      });

    });

  });

});
