
'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var Q = require('q');
var _ = require('lodash');
var JSONAPI = require('../index');
var stubPromise = require('./lib/stubPromise');
var promiseValue = require('./lib/promiseValue');
var ResourcePool = JSONAPI.ResourcePool;
var ResourceProxy = JSONAPI.ResourceProxy;

describe('ResourcePool', function () {

  describe('#add', function () {

    it('should add resource to itself', function () {

      var rc = new ResourceProxy({
        url: '/foo/bar/'
      });

      var rp = new ResourcePool();
      rp.add(rc);

      expect(rp.get('/foo/bar/')).to.equal(rc);

    });

  });

  describe('#get', function () {

    it('should be able to get resources', function () {

      var rc = new ResourceProxy({
        url: '/foo/bar/'
      });

      var rp = new ResourcePool([rc]);

      expect(rp.get('/foo/bar/')).to.equal(rc);

    });


    it('should be able to get added resources', function () {

      var rc = new ResourceProxy({
        url: '/foo/bar/'
      });

      var rp = new ResourcePool();
      rp.add(rc);

      expect(rp.get('/foo/bar/')).to.equal(rc);

    });

  });

  describe('#merge', function () {

    it('should merge another ResourcePool\'s resources', function () {

      var rp1 = new ResourcePool([
        new ResourceProxy({
          url: '/bar/'
        })
      ]);

      var rp2 = new ResourcePool([
        new ResourceProxy({
          url: '/foo/'
        })
      ]);

      rp1.merge(rp2);

      expect(rp1.get('/bar/')).to.equal(rp2.get('/bar/'));
      expect(rp1.get('/foo/')).to.equal(rp2.get('/foo/'));

      var rp3 = new ResourcePool([
        new ResourceProxy({
          url: '/baz/'
        })
      ]);

      expect(rp1.get('/baz/')).to.equal(rp2.get('/baz/'));

    });

  });

});
