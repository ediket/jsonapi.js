import { expect } from 'chai';
import matchJSON from './libs/matchJSON';
import { Resource } from '../';

describe('Resource', function() {
  it('should throw error when type is not provided', () => {
    expect(() => {
      new Resource({
        content: 'foo'
      });
    }).to.throw(Error);
  });

  it('should parse attirbutes', () => {
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

  it('should parse links', () => {
    let foo = new Resource({
      type: 'foo',
      links: {
        self: '/foo/1'
      }
    });

    expect(foo.getLink('self')).to.equal('/foo/1');
  });

  describe('#get', () => {
    it('should return attribute', () => {
      let foo = new Resource({
        type: 'foo',
        a: 'b'
      });

      expect(foo.get('a')).to.equal('b');
    });
  });

  describe('#set', () => {
    it('should set attributes properly', () => {
      let foo = new Resource({
        type: 'foo'
      });

      foo.set({
        a: 'b'
      });

      expect(foo.get('a')).to.equal('b');
    });
  });

  describe('#getLink', () => {
    it('should return link', () => {
      let foo = new Resource({
        type: 'foo',
        links: {
          self: '/foo/1'
        }
      });

      expect(foo.getLink('self')).to.equal('/foo/1');
    });
  });

  describe('#setLink', () => {
    it('should set links properly', () => {
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

  describe('#unsetLink', () => {
    it('should unset link properly', () => {
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

  describe('#getLinkage', () => {
    it('should return it\'s linkage', () => {
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

  describe('#serialize', () => {
    it('should serialize itself', () => {
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

  describe('#deserialize', () => {
    it('should serialize itself', () => {
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

  describe('#clone', () => {
    it('should clone itself', () => {
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
