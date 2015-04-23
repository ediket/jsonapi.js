import $ from 'jquery';
import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import Q from 'q';
import promiseValue from './libs/promiseValue';
import matchJSON from './libs/matchJSON';
import stubPromise from './libs/stubPromise';
import { RestPool, Resource, RESTful } from '../build-npm/jsonapi';


describe('RestPool', function () {

  var restPool;
  var syncronizer;

  beforeEach(function () {

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
    restPool.syncronizer = syncronizer;

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
              self: '/api/foo/23'
            }
          }
        })
      );

      return Q.fcall(() => {

        return restPool.create({
          type: 'foo',
          content: 'hello world'
        })

      })
      .then(resource => {

        var args = syncronizer.post.getCall(0).args;
        expect(args[0]).to.deep.equal('/api/foo/');
        expect(args[1]).to.deep.equal({
          data: {
            type: 'foo',
            content: 'hello world'
          }
        });
        expect(resource.getLink('self')).to.deep.equal('/api/foo/23');
        expect(resource.id).to.deep.equal(23);

      });

    });

  });

  describe('#patch', function () {

    it('should patch resource and make PATCH request', function () {

      syncronizer.patch.withArgs('/api/foo/23').returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 23,
            content: 'hello world',
            links: {
              self: '/api/foo/23'
            }
          }
        })
      );

      return Q.fcall(() => {
        return new Resource({
          type: 'foo',
          id: 23,
          content: 'hello world',
          links: {
            self: '/api/foo/23'
          }
        });
      })
      .then((foo) => {
        return restPool.patch(foo, 'content', 'wow')
      })
      .then(resource => {
        var args = syncronizer.patch.getCall(0).args;
        expect(args[0]).to.deep.equal('/api/foo/23');
        expect(args[1]).to.deep.equal({
          data: {
            type: 'foo',
            id: 23,
            content: 'wow',
            links: {
              self: '/api/foo/23'
            }
          }
        });
        expect(resource.get('content')).to.deep.equal('wow');
      });

    });

  });

  describe('#remove', function () {

    it('should remove resource and make DELETE request', function () {

      return Q.fcall(() => {
        return new Resource({
          type: 'foo',
          id: 23,
          content: 'hello world',
          links: {
            self: '/api/foo/23'
          }
        });
      })
      .then((foo) => {
        return restPool.remove(foo)
      })
      .then(resource => {
        var args = syncronizer.delete.getCall(0).args;
        expect(args[0]).to.deep.equal('/api/foo/23');
      });

    });

  });

  describe('#get', function () {

    it('should get resource and make GET request', function () {

      syncronizer.get.withArgs('/api/foo/23').returns(
        promiseValue({
          data: {
            type: 'foo',
            id: 23,
            content: 'hello world',
            links: {
              self: '/api/foo/23'
            }
          }
        })
      );

      return Q.fcall(() => {
        return restPool.get('/api/foo/23');
      })
      .then(resource => {
        var args = syncronizer.get.getCall(0).args;
        expect(args[0]).to.deep.equal('/api/foo/23');
        expect(resource.toJSON()).to.deep.equal({
          type: 'foo',
          id: 23,
          content: 'hello world'
        });
      });

    });

  });

});
