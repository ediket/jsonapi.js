
'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');
var JSONAPI = require('../build/jsonapi');
var stubPromise = require('./lib/stubPromise');
var promiseValue = require('./lib/promiseValue');
var ResourceProxy = JSONAPI.ResourceProxy;

describe('ResourceProxy', function () {

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

      var rc = new ResourceProxy({
        links: {
          self: '/api/foo/'
        },
        syncronizer: syncronizer
      });

      return rc.getData()
        .then(function (json) {
          expect(syncronizer.get.called).to.be.true;
          expect(json.content).to.equal('hello world');
        });

    });

  });

  describe('#getRelated', function () {

    it('should not make ajax request when resource already in pool.', function () {

      var foo = new ResourceProxy({
        data: {
          content: 'foo'
        },
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
        },
        syncronizer: syncronizer
      });

      var bar = new ResourceProxy({
        data: {
          content: 'bar'
        },
        links: {
          self: '/api/bar/'
        },
        syncronizer: syncronizer
      });

      foo.setLink('barlink', bar);

      return foo.getRelated('barlink')
        .then(function (bar) {
          return bar.getData();
        })
        .then(function (json) {
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
        },
        syncronizer: syncronizer
      });

      return rc.getRelated('children')
        .then(function (children) {
          return children.getData();
        })
        .then(function (json) {
          expect(syncronizer.get.called).to.be.true;
          expect(json[0].content).to.equal('hello');
        });

    });

  });

});
