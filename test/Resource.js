import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import stubPromise from './lib/stubPromise';
import promiseValue from './lib/promiseValue';
import { Resource, ResourcePool } from '../build-npm/jsonapi';


describe('Resource', function () {

  it('should throw error when type is not provided', function () {

    expect(function () {
      new Resource({
        content: 'foo'
      });
    }).to.throw(Error);

  });

  it('should parse data argument', function () {

    var foo = new Resource({
      type: 'foo',
      id: 2,
      content: 'foo'
    });

    expect(foo.attributes).to.deep.equal({
      type: 'foo',
      id: 2,
      content: 'foo'
    });

  });

  it('should parse link argument', function () {

    var foo = new Resource({
      type: 'foo',
      links: {
        self: '/foo/1'
      }
    });

    expect(foo.getLink('self')).to.equal('/foo/1');

  });

  describe('#getLink', function () {

    it('should return url of link', function () {

      var foo = new Resource({
        type: 'foo',
        links: {
          self: '/foo/1'
        }
      });

      expect(foo.getLink('self')).to.equal('/foo/1');

    });

  });

  describe('#setLink', function () {

    it('should link another resource', function () {

      var foo = new Resource({
        type: 'foo'
      });

      var bar = new Resource({
        type: 'bar',
        links: {
          self: '/bar/1'
        }
      });

      foo.setLink('barlink', bar);

      expect(foo.getLink('barlink')).to.equal('/bar/1');

    });

  });

  describe('#removeLink', function () {

    it('should remove link of resource', function () {

      var foo = new Resource({
        type: 'foo',
        links: {
          self: '/foo/1',
          test: '/test/1'
        }
      });

      foo.removeLink('test');

      expect(foo.getLink('test')).to.be.empty;

    });

  });

  describe('#clone', function () {

    it('should clone of itself', function () {

      var foo = new Resource({
        type: 'foo',
        id: 1,
        name: '23',
        links: {
          self: '/foo/1',
          test: '/test/1'
        }
      });

      var fooClone = foo.clone();

      expect(foo).to.not.equal(fooClone);
      expect(foo.toJSON()).to.deep.equal(fooClone.toJSON());

    });

  });

});
