import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import stubPromise from './libs/stubPromise';
import matchJSON from './libs/matchJSON';
import promiseValue from './libs/promiseValue';
import { Resource, ResourcePool } from '../index';


describe('Resource', function () {

  it('should throw error when type is not provided', function () {

    expect(function () {
      new Resource({
        content: 'foo'
      });
    }).to.throw(Error);

  });

  it('should parse attirbutes', function () {

    let foo = new Resource({
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

  it('should parse links', function () {

    let foo = new Resource({
      type: 'foo',
      links: {
        self: '/foo/1'
      }
    });

    expect(foo.getLink('self')).to.equal('/foo/1');

  });

  describe('#get', function () {

    it('should return attribute', function () {

      let foo = new Resource({
        type: 'foo',
        a: 'b'
      });

      expect(foo.get('a')).to.equal('b');

    });

  });

  describe('#set', function () {

    it('should set attributes properly', function () {

      let foo = new Resource({
        type: 'foo'
      });

      foo.set({
        a: 'b'
      });

      expect(foo.get('a')).to.equal('b');

    });

  });

  describe('#getLink', function () {

    it('should return link', function () {

      let foo = new Resource({
        type: 'foo',
        links: {
          self: '/foo/1'
        }
      });

      expect(foo.getLink('self')).to.equal('/foo/1');

    });

  });

  describe('#setLink', function () {

    it('should set links properly', function () {

      let foo = new Resource({
        type: 'foo'
      });

      let bar = new Resource({
        type: 'bar',
        links: {
          self: '/bar/1'
        }
      });

      foo.setLink({
        'barlink': bar.getLink()
      });

      expect(foo.getLink('barlink')).to.equal('/bar/1');

    });

  });

  describe('#unsetLink', function () {

    it('should unset link properly', function () {

      let foo = new Resource({
        type: 'foo',
        links: {
          self: '/foo/1',
          test: '/test/1'
        }
      });

      foo.unsetLink('test');

      expect(foo.getLink('test')).to.be.empty;

    });

  });

  describe('#getLinkage', function () {

    it('should return it\'s linkage', function () {

      let foo = new Resource({
        type: 'foo',
        id: 1,
        links: {
          self: '/foo/1'
        }
      });

      expect(foo.getLinkage()).to.deep.equal({
        type: 'foo',
        id: 1
      });

    });

  });

  describe('#serialize', function () {

    it('should serialize itself', function () {

      let newResource = new Resource({
        type: 'bar',
        content: 'bar'
      });

      let savedResource = new Resource({
        id: 1,
        type: 'foo',
        content: 'foo',
        links: {
          self: '/foo/1/'
        }
      });

      expect(newResource.serialize()).to.satisfy(matchJSON({
        type: 'bar',
        content: 'bar'
      }));

      expect(savedResource.serialize()).to.satisfy(matchJSON({
        id: 1,
        type: 'foo',
        content: 'foo',
        links: {
          self: '/foo/1/'
        }
      }));

    });

  });

  describe('#deserialize', function () {

    it('should serialize itself', function () {

      let newResource = new Resource({
        type: 'bar'
      });

      newResource.deserialize({
        id: 1,
        type: 'bar',
        content: 'bar',
        links: {
          self: '/bar/1/'
        }
      });

      expect(newResource.serialize()).to.satisfy(matchJSON({
        id: 1,
        type: 'bar',
        content: 'bar',
        links: {
          self: '/bar/1/'
        }
      }));

    });

  });

  describe('#clone', function () {

    it('should clone itself', function () {

      let resource = new Resource({
        type: 'bar'
      });

      let clonedResource = resource.clone();

      expect(resource.serialize())
        .to.deep.equal(clonedResource.serialize());

      clonedResource.set({
        content: 'wow'
      });

      expect(resource.get('content')).to.be.not.ok;
      expect(clonedResource.get('content')).to.be.ok;

    });

  });

});
