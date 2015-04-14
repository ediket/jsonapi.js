
'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var Q = require('q');
var _ = require('lodash');
var JSONAPI = require('../index');
var stubPromise = require('./lib/stubPromise');
var promiseValue = require('./lib/promiseValue');
var Session = JSONAPI.Session;
var serializer = JSONAPI.serializer;
var Resource = JSONAPI.Resource;
var ResourceCollection = JSONAPI.ResourceCollection;

describe('Session', function () {

  var syncronizer;

  beforeEach(function () {

    syncronizer = {
      post: stubPromise(),
      get: stubPromise(),
      delete: stubPromise(),
      patch: stubPromise()
    };

  });

  afterEach(function () {

    syncronizer.post.reset();
    syncronizer.get.reset();
    syncronizer.delete.reset();
    syncronizer.patch.reset();

  });

  it('should track ResourceCollection', function () {

    expect(function () {

      var res = new ResourceCollection([], { type: 'foo' });
      res.create({
        name: 'bar'
      });

      var session = new Session(res, '/api/foo/');

    }).to.not.throw();

  });

  describe('#fetch', function () {

    it('should make GET request if fetch single Resource', function () {

      syncronizer.get.withArgs('/api/foo/1/').returns(
        promiseValue({
          resource: new Resource({ type: 'foo' })
        })
      );

      var res = new ResourceCollection([], { type: 'foo' });

      var session = new Session(res, '/api/foo/', {
        syncronizer: syncronizer
      });

      return session.fetch(1)
        .then(function () {
          expect(syncronizer.get.called).to.be.true;
          expect(syncronizer.get.getCall(0).args[0]).to.equal('/api/foo/1/');
          expect(res.models).to.have.length(1);
        });

    });

    it('should make GET request if fetch multiple Resource', function () {

      syncronizer.get.withArgs('/api/foo/').returns(
        promiseValue({
          resource: new ResourceCollection([{
            type: 'foo'
          }, {
            type: 'foo'
          }], { type: 'foo' })
        })
      );

      var res = new ResourceCollection([], { type: 'foo' });

      var session = new Session(res, '/api/foo/', {
        syncronizer: syncronizer
      });

      return session.fetch([1, 2])
        .then(function () {
          expect(syncronizer.get.called).to.be.true;
          expect(syncronizer.get.getCall(0).args[0]).to.equal('/api/foo/');
          expect(syncronizer.get.getCall(0).args[1])
          .to.satisfy(
              _.partialRight(_.isMatch, {
                filter: {
                  id: [1, 2]
                }
              })
            );
          expect(res.models).to.have.length(2);
        });

    });

  });

  describe('#commit', function () {

    it('should make POST request if new Resource was created', function () {

      var res = new ResourceCollection([], { type: "foo" });

      var session = new Session(res, '/api/foo/', {
        syncronizer: syncronizer
      });

      res.create({
        name: 'bar'
      });

      session.commit();

      expect(syncronizer.post.called).to.be.true;
      expect(syncronizer.post.getCall(0).args[0]).to.equal('/api/foo/');
      expect(syncronizer.post.getCall(0).args[1])
        .to.satisfy(
          _.partialRight(_.isMatch, {
            data: [{
              type: 'foo',
              name: 'bar'
            }]
          })
        );

    });

    it('should make PATCH request if Resource was changed', function () {

      var res = new ResourceCollection([], { type: 'foo' });

      res.create({
        id: 1,
        name: 'bar'
      });

      var session = new Session(res, '/api/foo/', {
        syncronizer: syncronizer
      });

      res.first().set({
        name: 'hello'
      });

      res.first().addLink('baz',
        new ResourceCollection([], { type: 'baz' }));

      res.first().getLink('baz').create({
        id: 1
      });

      session.commit();

      expect(syncronizer.patch.called).to.be.true;
      expect(syncronizer.patch.getCall(0).args[0]).to.equal('/api/foo/');
      expect(syncronizer.patch.getCall(0).args[1])
        .to.satisfy(
          _.partialRight(_.isMatch, {
            data: [{
              id: 1,
              type: 'foo',
              name: 'hello',
              links: {
                baz: {
                  linkage: [{
                    id: 1,
                    type: 'baz'
                  }]
                }
              }
            }]
          })
        );

    });

    it('should make DELETE request if Resource was deleted', function () {

      var res = new ResourceCollection([], { type: 'foo' });

      res.create({
        id: 1,
        name: 'bar'
      });

      var session = new Session(res, '/api/foo/', {
        syncronizer: syncronizer
      });

      res.first().destroy();

      session.commit();

      expect(syncronizer.delete.called).to.be.true;
      expect(syncronizer.delete.getCall(0).args[0]).to.equal('/api/foo/');
      expect(syncronizer.delete.getCall(0).args[1])
        .to.satisfy(
          _.partialRight(_.isMatch, {
            data: [{
              id: 1,
              type: 'foo'
            }]
          })
        );

    });

  });

});
