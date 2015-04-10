
'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');
var JSONAPI = require('../index');
var Session = JSONAPI.Session;
var serializer = JSONAPI.serializer;
var Resource = JSONAPI.Resource;
var ResourceCollection = JSONAPI.ResourceCollection;

describe('Session', function () {

  var syncronizer;

  beforeEach(function () {

    syncronizer = {
      post: sinon.spy(),
      get: sinon.spy(),
      delete: sinon.spy(),
      patch: sinon.spy()
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

      var res = new ResourceCollection();
      res.create({
        type: 'foo',
        name: 'bar'
      });

      var session = new Session(res, '/api/foo/');

    }).to.not.throw();

  });

  describe('#commit', function () {

    it('should make POST request if new Resource was created', function () {

      var res = new ResourceCollection();

      var session = new Session(res, '/api/foo/', {
        syncronizer: syncronizer
      });

      res.create({
        type: 'foo',
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

      var res = new ResourceCollection();

      res.create({
        id: 1,
        type: 'foo',
        name: 'bar'
      });

      var session = new Session(res, '/api/foo/', {
        syncronizer: syncronizer
      });

      res.first().set({
        name: 'hello'
      });


      res.first().addLink('baz',
        new ResourceCollection());

      res.first().getLink('baz').create({
        id: 1,
        type: 'baz'
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
              name: 'hello'
            }]
          })
        );

      expect(syncronizer.post.called).to.be.true;
      expect(syncronizer.post.getCall(0).args[0]).to.equal('/api/foo/links/baz/');
      expect(syncronizer.post.getCall(0).args[1])
        .to.satisfy(
          _.partialRight(_.isMatch, {
            data: [{
              id: 1,
              type: 'baz'
            }]
          })
        );

    });

    it('should make DELETE request if Resource was deleted', function () {

      var res = new ResourceCollection();

      res.create({
        id: 1,
        type: 'foo',
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
