
'use strict';

var expect = require('chai').expect;
var JSONAPI = require('../index');
var Resource = JSONAPI.Resource;
var ResourceCollection = JSONAPI.ResourceCollection;

describe('ResourceCollection', function () {

  it('should set type', function () {

    var resources = new ResourceCollection([], {
      type: 'foo'
    });

    expect(resources.type).to.equal('foo');

  });

  it('should check type is given', function () {

    expect(function () {
      new ResourceCollection([], {
        type: 'foo'
      });
    }).to.not.throw(Error);

    expect(function () {
      new ResourceCollection();
    }).to.throw(Error);

  });

  it('should check child type', function () {

    var res = new ResourceCollection([], {
      type: 'foo'
    });

    expect(function () {
      res.add(new Resource({
        type: 'foo'
      }));
    }).to.not.throw(Error);

    expect(function () {
      res.add(new Resource({
        type: 'bar'
      }));
    }).to.throw(Error);

  });

  it('should create same type resource', function () {

    var resources = new ResourceCollection([], {
      type: 'foo'
    });

    var newRes = resources.create({
      'content': 'hello'
    });

    expect(newRes.type).to.equal('foo');

  });

  describe('#toJSON', function () {

    it('should return valid data', function () {

      var res = new ResourceCollection([
        new Resource({
            id: 1,
            type: 'foo',
            content: 'hello'
          })
          .addLink('barlink', new Resource({
            id: 2,
            type: 'bar',
            content: 'world'
          }))
      ], {
        type: "foo"
      });

      expect(res.toJSON()).to.deep.equal([{
        id: 1,
        type: 'foo',
        content: 'hello'
      }]);

      expect(res.toJSON({ recursive: true })).to.deep.equal([{
        id: 1,
        type: 'foo',
        content: 'hello',
        barlink: {
          id: 2,
          type: 'bar',
          content: 'world'
        }
      }]);

    });

  });

  describe('#toLinkage', function () {

    it('should return linkage', function () {

      var res1 = new ResourceCollection([
        {
          id: 1,
          type: 'foo',
          content: 'hello'
        }
      ], {
        type: "foo"
      });

      expect(res1.toLinkage()).to.deep.equal([
        {
          id: 1,
          type: 'foo'
        }
      ]);

    });

  });

});
