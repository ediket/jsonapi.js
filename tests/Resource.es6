import { expect } from 'chai';
import { Resource } from '../src/jsonapi';


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

  describe('#setRelationship', () => {
    it('should create relationship with resource', () => {
      let foo = new Resource({
        type: 'foo',
        id: 1
      });

      let bar = new Resource({
        type: 'bar',
        id: 1
      });

      foo.setRelationship('bar', bar);

      expect(foo.relationships.bar.serialize()).to.deep.equal({
        data: {
          type: 'bar',
          id: 1
        }
      });
    });

    it('should create relationship with linkage', () => {
      let foo = new Resource({
        type: 'foo',
        id: 1
      });

      foo.setRelationship('bar', {
        type: 'bar',
        id: 1
      });

      expect(foo.relationships.bar.serialize()).to.deep.equal({
        data: {
          type: 'bar',
          id: 1
        }
      });
    });

    it('should create relationship of collection with resource', () => {
      let foo = new Resource({
        type: 'foo',
        id: 1
      });

      let bar = [new Resource({
        type: 'bar',
        id: 1
      })];

      foo.setRelationship('bar', bar);

      expect(foo.relationships.bar.serialize()).to.deep.equal({
        data: [{
          type: 'bar',
          id: 1
        }]
      });
    });

    it('should create relationship of collection with linakge', () => {
      let foo = new Resource({
        type: 'foo',
        id: 1
      });

      foo.setRelationship('bar', [{
        type: 'bar',
        id: 1
      }]);

      expect(foo.relationships.bar.serialize()).to.deep.equal({
        data: [{
          type: 'bar',
          id: 1
        }]
      });
    });
  });

  describe('#unsetRelationship', () => {
    it('should remove relationship', () => {
      let foo = new Resource({
        type: 'foo',
        id: 1
      });

      let bar = new Resource({
        type: 'bar',
        id: 1
      });

      foo.setRelationship('bar', bar);
      foo.unsetRelationship('bar');

      expect(foo.relationships.bar).to.not.ok;
    });
  });

  describe('#setRelationships', () => {
    it('should set relationships', () => {
      let foo = new Resource({
        type: 'foo',
        id: 1
      });

      let bar = new Resource({
        type: 'bar',
        id: 1
      });

      let baz = new Resource({
        type: 'baz',
        id: 1
      });

      foo.setRelationships({
        bar: bar,
        baz: baz
      });

      expect(foo.serialize().relationships).to.deep.equal({
        bar: {
          data: {
            type: 'bar',
            id: 1
          }
        },
        baz: {
          data: {
            type: 'baz',
            id: 1
          }
        }
      });
    });
  });

  describe('#setAttribute', () => {
    it('should set attribute', () => {
      let resource = new Resource({
        type: 'bar',
        id: 1,
        attributes: {}
      });

      resource.setAttribute('a', 'b');

      expect(resource.serialize()).to.deep.equal({
        type: 'bar',
        id: 1,
        attributes: {
          a: 'b'
        }
      });
    });
  });

  describe('#unsetAttribute', () => {
    it('should unset attribute', () => {
      let resource = new Resource({
        type: 'bar',
        id: 1,
        attributes: {
          a: 'b',
          c: 'd'
        }
      });

      resource.unsetAttribute('a');

      expect(resource.serialize()).to.deep.equal({
        type: 'bar',
        id: 1,
        attributes: {
          c: 'd'
        }
      });
    });
  });

  describe('#setAttributes', () => {
    it('should unset attributes', () => {
      let resource = new Resource({
        type: 'bar',
        id: 1,
        attributes: {
          a: 'b',
          c: 'd'
        }
      });

      resource.setAttributes({
        a: 1,
        b: 2
      });

      expect(resource.serialize()).to.deep.equal({
        type: 'bar',
        id: 1,
        attributes: {
          a: 1,
          b: 2,
          c: 'd'
        }
      });
    });
  });

  describe('#flatten', () => {
    it('should flatten identifier, relationships, attributes', () => {
      let resource = new Resource({
        type: 'bar',
        id: 1,
        attributes: {
          content: 'bar'
        },
        relationships: {
          foo: {
            data: { type: 'foo', id: 1 }
          }
        }
      });

      expect(resource.flatten()).to.deep.equal({
        id: 1,
        type: 'bar',
        content: 'bar',
        foo: {
          data: { type: 'foo', id: 1 }
        }
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
