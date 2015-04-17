var expect = require('chai').expect;
import _ from 'lodash';
import JSONAPI from '../build/jsonapi';
var ResourcePool = JSONAPI.ResourcePool;


describe('ResourcePool', function () {

  describe('#add', function () {

    it('should add resource to itself', function () {

      var rp = new ResourcePool();
      rp.add({
        url: '/foo/bar/'
      });

      expect(rp.get('/foo/bar/')).to.deep.equal({
        url: '/foo/bar/'
      });

    });

  });

  describe('#get', function () {

    it('should be able to get resources', function () {

      var rp = new ResourcePool([{
        url: '/foo/bar/'
      }]);

      expect(rp.get('/foo/bar/')).to.deep.equal({
        url: '/foo/bar/'
      });

    });


    it('should be able to get added resources', function () {

      var rp = new ResourcePool();
      rp.add({
        url: '/foo/bar/'
      });

      expect(rp.get('/foo/bar/')).to.deep.equal({
        url: '/foo/bar/'
      });

    });

  });

});
