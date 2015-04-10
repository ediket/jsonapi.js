
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

  describe('#track', function () {

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

  });

  describe('#commit', function () {

    it('should make POST request if new Resource was created', function () {

      var postSpy = sinon.spy();

      var res = new ResourceCollection();

      var session = new Session(res, '/api/foo/', {
        syncronizer: {
          post: postSpy
        }
      });

      res.create({
        type: 'foo',
        name: 'bar'
      });

      session.commit();

      expect(postSpy.called).to.be.true;
      expect(postSpy.getCall(0).args[0]).to.equal('/api/foo/');
      expect(postSpy.getCall(0).args[1])
        .to.satisfy(
          _.partialRight(_.isMatch, serializer.serialize(res.first()))
        );

    });

    it('should make PATCH request if Resource was changed', function () {

      var patchSpy = sinon.spy();

      var res = new ResourceCollection();

      res.create({
        id: 1,
        type: 'foo',
        name: 'bar'
      });

      var session = new Session(res, '/api/foo/', {
        syncronizer: {
          patch: patchSpy
        }
      });

      res.first().set({
        name: 'hello'
      });

      session.commit();

      expect(patchSpy.called).to.be.true;
      expect(patchSpy.getCall(0).args[0]).to.equal('/api/foo/1');
      expect(patchSpy.getCall(0).args[1])
        .to.satisfy(
          _.partialRight(_.isMatch, serializer.serialize(res.first()))
        );

    });

    it('should make DELETE request if Resource was deleted', function () {

      var spy = sinon.spy();

      var res = new ResourceCollection();

      res.create({
        id: 1,
        type: 'foo',
        name: 'bar'
      });

      var session = new Session(res, '/api/foo/', {
        syncronizer: {
          delete: spy
        }
      });

      res.first().destroy();

      session.commit();

      expect(spy.called).to.be.true;
      expect(spy.getCall(0).args[0]).to.equal('/api/foo/1');

    });

  });

});
