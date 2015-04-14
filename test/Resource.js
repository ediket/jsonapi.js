
'use strict';

var expect = require('chai').expect;
var JSONAPI = require('../index');
var Resource = JSONAPI.Resource;

describe('Resource', function () {

  it('should set type', function () {

    var resource = new Resource({
      type: 'foo'
    });

    expect(resource.type).to.equal('foo');

  });

  it('should check type is given', function () {

    expect(function () {
      new Resource({
        type: 'foo'
      });
    }).to.not.throw(Error);

    expect(function () {
      new Resource();
    }).to.throw(Error);

  });

  describe('#getLink', function () {

    it('should return link', function () {

      var res1 = new Resource({
        id: 1,
        type: 'foo',
        content: 'hello'
      });

      res1.links['a'] = true;

      expect(res1.getLink('a')).to.be.true;

    });

  });

  describe('#addLink', function () {

    it('should link resource', function () {

      var res1 = new Resource({
        id: 1,
        type: 'foo',
        content: 'hello'
      });

      var res2 = new Resource({
        id: 2,
        type: 'bar',
        content: 'world'
      });

      res1.addLink('barlink', res2);
      expect(res1.getLink('barlink')).to.equal(res2);

    });

  });

  describe('#removeLink', function () {

    it('should remove link', function () {

      var res1 = new Resource({
        id: 1,
        type: 'foo',
        content: 'hello'
      });

      var res2 = new Resource({
        id: 2,
        type: 'bar',
        content: 'world'
      });

      res1.addLink('barlink', res2);
      res1.removeLink('barlink');
      expect(res1.getLink('barlink')).to.be.undefined;

    });

  });

  describe('#toJSON', function () {

    it('should return valid data', function () {

      var res = new Resource({
        type: 'foo',
        name: 'bar'
      });

      expect(res.toJSON()).to.deep.equal({
        type: 'foo',
        name: 'bar'
      });

    });

    it('should return linked data', function () {

      var res1 = new Resource({
        id: 1,
        type: 'foo',
        content: 'hello'
      });

      var res2 = new Resource({
        id: 2,
        type: 'bar',
        content: 'world'
      });

      res1.addLink('barlink', res2);

      expect(res1.toJSON()).to.deep.equal({
        id: 1,
        type: 'foo',
        content: 'hello'
      });

      expect(res1.toJSON({ recursive: true })).to.deep.equal({
        id: 1,
        type: 'foo',
        content: 'hello',
        barlink: {
          id: 2,
          type: 'bar',
          content: 'world'
        }
      });

    });

    it('should return only itselft after #removeLink', function () {

      var res1 = new Resource({
        id: 1,
        type: 'foo',
        content: 'hello'
      });

      var res2 = new Resource({
        id: 2,
        type: 'bar',
        content: 'world'
      });

      res1.addLink('barlink', res2);
      res1.removeLink('barlink');

      expect(res1.toJSON()).to.deep.equal({
        id: 1,
        type: 'foo',
        content: 'hello'
      });

    });

  });

  describe('#toLinkage', function () {

    it('should return linkage', function () {

      var res1 = new Resource({
        id: 1,
        type: 'foo',
        content: 'hello'
      });

      expect(res1.toLinkage()).to.deep.equal({
        id: 1,
        type: 'foo'
      });

    });

  });

  describe('#merge', function () {

    it('should return merged data', function () {

      var res1 = new Resource({
        id: 1,
        type: 'foo',
        content: 'hello'
      });

      var res2 = new Resource({
        id: 1,
        type: 'foo',
        content: 'world'
      });

      expect(res1.merge(res2).toJSON())
        .to.deep.equal({
          id: 1,
          type: 'foo',
          content: 'world'
        });

    });

  });


});
