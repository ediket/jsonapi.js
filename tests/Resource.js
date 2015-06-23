import { expect } from 'chai';
import { Resource } from '../';


describe('Resource', function() {
  it('should throw error when type is not provided', () => {
    expect(() => {
      let resource = new Resource({
        content: 'foo'
      });
      expect(resource).to.be.ok;
    }).to.throw(Error);
  });

  it('should parse attirbutes', () => {
    let foo = new Resource({
      type: 'foo',
      id: 2,
      attributes: {
        content: 'foo'
      }
    });

    expect(foo.attributes).to.deep.equal({
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

    expect(foo.links.self.href).to.equal('/foo/1');
  });

  describe('#getIdentifier', () => {
    it('should return it\'s identifier', () => {
      let foo = new Resource({
        type: 'foo',
        id: 1
      });

      expect(foo.getIdentifier()).to.deep.equal({
        type: 'foo',
        id: 1
      });
    });
  });

  describe('#serialize', () => {
    it('should serialize itself', () => {
      let newResource = new Resource({
        type: 'bar',
        attributes: {
          content: 'bar'
        }
      });

      let savedResource = new Resource({
        id: 1,
        type: 'foo',
        attributes: {
          content: 'foo'
        },
        links: {
          self: '/foo/1/'
        }
      });

      expect(newResource.serialize()).to.deep.equal({
        type: 'bar',
        attributes: {
          content: 'bar'
        }
      });

      expect(savedResource.serialize()).to.deep.equal({
        id: 1,
        type: 'foo',
        attributes: {
          content: 'foo'
        },
        links: {
          self: {
            href: '/foo/1/'
          }
        }
      });
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
        attributes: {
          content: 'bar'
        },
        links: {
          self: '/bar/1/'
        }
      });

      expect(newResource.serialize()).to.deep.equal({
        id: 1,
        type: 'bar',
        attributes: {
          content: 'bar'
        },
        links: {
          self: {
            href: '/bar/1/'
          }
        }
      });
    });
  });
});
