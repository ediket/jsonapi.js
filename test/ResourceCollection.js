
'use strict';

var expect = require('chai').expect;
var JSONAPI = require('../index');
var Resource = JSONAPI.Resource;
var ResourceCollection = JSONAPI.ResourceCollection;

describe('ResourceCollection', function () {

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
      ]);

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
      ]);

      expect(res1.toLinkage()).to.deep.equal([
        {
          id: 1,
          type: 'foo'
        }
      ]);

    });

  });

  describe('#merge', function () {

    it('should return merged data', function () {

      var resCollection = new ResourceCollection([
        new Resource({
          id: 1,
          type: 'foo',
          content: 'hello'
        }),
        new Resource({
          id: 2,
          type: 'bar',
          content: 'world'
        })
      ]);

      var margeRes = new Resource({
        id: 2,
        type: 'bar',
        content: 'good bye'
      });

      expect(resCollection.merge([margeRes]).toJSON())
        .to.deep.equal([
          {
            id: 1,
            type: 'foo',
            content: 'hello'
          },
          {
            id: 2,
            type: 'bar',
            content: 'good bye'
          }
        ]);
      });
    });
});
